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

#include "Biquad.h"

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" void* Biquad_new(float b0, float b1, float b2, float a1, float a2)
{
    return new Biquad(b0,b1,b2,a1,a2);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void Biquad_processBlock(Biquad* ptr, const float* x, float* y, size_t N)
{
    ptr->processBlock(x, y, N);
}

void Biquad::processBlock( const float* x, float* y, size_t N )
{
    for (size_t n=0; n<N; n++)
    {
        // Do the calculation
        float sum = m_b0*x[n] + m_b1*m_x1 + m_b2*m_x2 - m_a1*m_y1 - m_a2*m_y2;
        y[n] = sum;
        
        // Shift the delays
        m_x2 = m_x1;
        m_x1 = x[n];
        m_y2 = m_y1;
        m_y1 = sum;
    }
}

