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

#ifndef UPFIRDOWN_H
#define UPFIRDOWN_H

#include <cstdlib>

class UpFIRDown
{
public:
    UpFIRDown(size_t P, size_t Q, const float* coeffs, size_t num_coeffs, const float* buffer);
    size_t processBlock( const float* x, float* y, size_t num_x ); // Returns number of output samples.

private:
    size_t m_P;
    size_t m_Q;
    const float* m_coeffs;
    size_t m_num_coeffs;
    const float* m_buffer;
};

#endif // UPFIRDOWN_H

