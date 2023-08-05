/*
 * WasmDSP - Biquadratic IIR filter.
 * Copyright (C) 2023  Andrew Rogers
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

#ifndef BIQUAD_H
#define BIQUAD_H

#include <cstdlib>

class Biquad
{
public:
    Biquad(float b0, float b1, float b2, float a1, float a2) : m_b0(b0), m_b1(b1), m_b2(b2), m_a1(a1), m_a2(a2)
    {
    }
    
    void processBlock( const float* x, float* y, size_t N );

private:
    float m_b0;
    float m_b1;
    float m_b2;
    float m_a1;
    float m_a2;
    float m_x1;
    float m_x2;
    float m_y1;
    float m_y2;
};

#endif // BIQUAD_H

