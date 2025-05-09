/*
 * WasmDSP - Polyphase resampling based on FIR filter.
 * Copyright (C) 2025  Andrew Rogers
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "UpFIRDown.h"

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" void* UpFIRDown_new(size_t P, size_t Q, const float* coeffs, size_t num_coeffs, float* buffer)
{
    return new UpFIRDown(P, Q, coeffs, num_coeffs, buffer);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void UpFIRDown_delete(UpFIRDown* ptr)
{
    delete ptr;
}

EMSCRIPTEN_KEEPALIVE
extern "C" size_t UpFIRDown_processBlock(UpFIRDown* ptr, const float* x, float* y, size_t num_x)
{
    return ptr->processBlock(x, y, num_x);
}

UpFIRDown::UpFIRDown(size_t P, size_t Q, const float* coeffs, size_t num_coeffs, float* buffer)
    : m_P(P), m_Q(Q), m_coeffs(coeffs), m_num_coeffs(num_coeffs), m_buffer(buffer)
    , m_cnt(0U)
{
}

size_t UpFIRDown::processBlock( const float* x, float* y, size_t num_x )
{

    // Copy samples into buffer.
    for (size_t n = 0U; n < num_x; n++)
    {
        m_buffer[m_num_coeffs + m_cnt - 1U] = x[n];
        m_cnt++;
    }

    // Calculate number of output samples.
    size_t num_y = m_cnt / m_Q;
    num_y *= m_P;

    size_t hi_start = 0U;
    size_t bi_start = m_num_coeffs - 1U;
    for (size_t yi = 0U; yi < num_y; yi++)
    {

        // MAC.
        float acc = 0.0F;
        size_t bi = bi_start;
        for (size_t hi = hi_start; hi < m_num_coeffs; hi += m_P)
        {
            acc += m_coeffs[hi] * m_buffer[bi];
            bi--;
        }
        y[yi] = acc;

        // Calculate the indexes for the first element of next MAC.
        hi_start += m_Q;
        if (hi_start >= m_P)
        {
            hi_start -= m_P;
            bi_start ++;
        }
    }

    // Update buffer if some output samples were produced.
    if (num_y > 0U)
    {
        size_t offset = m_cnt / m_Q;
        offset *= m_Q;
        size_t cnt = m_cnt + m_num_coeffs - offset - 1U;
        for (size_t n = 0; n < cnt; n++) m_buffer[n] = m_buffer[n + offset];
        m_cnt -= offset;
    }

    return num_y;
}
