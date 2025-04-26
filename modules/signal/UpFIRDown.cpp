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

UpFIRDown::UpFIRDown(size_t P, size_t Q, const float* coeffs, size_t num_coeffs, const float* buffer)
    : m_P(P), m_Q(Q), m_coeffs(coeffs), m_num_coeffs(num_coeffs), m_buffer(buffer)
{
}

size_t UpFIRDown::processBlock( const float* x, float* y, size_t num_x )
{
    
    // Copy samples into buffer.
    for (size_t n = 0U; n < num_x; n++)
    {
        m_buffer[num_coeffs + m_cnt] = x[n];
        m_cnt++;
    }

    // Calculate number of output samples.
    size_t num_y = m_cnt / m_Q;
    num_y *= m_P;

    size_t hi_start = 0U;
    size_t bi_start = num_coeffs;
    for (int yi = 0; yi < num_y; yi++)
    {
        // Calculate the indexes for the first element of each MAC.
        hi_start += m_Q;
        if (hi_start >= m_P)
        {
            hi_start -= m_P;
            bi_start ++;
        }

        // MAC.
        float acc = 0.0F;
        for (size_t hi = hi_start; hi < num_coeffs; hi += m_P)
        {
            acc += m_h[hi] * m_buffer[bi];
            bi--;
        }
        y[yi] = acc;
    }

    return num_y;
}