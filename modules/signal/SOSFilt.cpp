/*
 * WasmDSP - Second Order Sections (SOS) filter.
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

#include "SOSFilt.h"

SOSFilt::SOSFilt(size_t num_sections, const float* coeffs, float* state) : m_num_sections(num_sections), m_coeffs(coeffs), m_state(state)
{
}
    
void SOSFilt::processBlock( const float* x, float* y, size_t N )
{
    for (size_t n = 0U; n < N; n++)
    {
        float xn = x[n];
        for (size_t s = 0U; s < m_num_sections; s++)
        {
            const float* c = &m_coeffs[s * 5U];
            float* w = &m_state[s * 2U];
            float w0 = xn - c[3] * w[0] - c[4] * w[1];
            xn  = c[0] * w0 + c[1] * w[0] + c[2] * w[1];
            w[1] = w[0];
            w[0] = w0;
        }
        y[n] = xn;
    }
}
