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

#ifndef SOSFILT_H
#define SOSFILT_H

#include <cstdlib>

class SOSFilt
{
public:
    SOSFilt(size_t num_sections, const float* coeffs, float* state);
    void processBlock( const float* x, float* y, size_t N );

private:
    size_t m_num_sections;
    const float* m_coeffs;
    float* m_state;
};

template <size_t N>
class SOSFiltAlloc : public SOSFilt
{
public:
    SOSFiltAlloc(const float* coeffs) : SOSFilt(N, coeffs, m_state)
    {
    }

private:
    float m_state[N*2];
};

#endif // SOSFILT_H

