/*
 * WasmDSP - FFT wrapper.
 * Copyright (C) 2024  Andrew Rogers
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

#include <emscripten.h>
#include "kiss_fft.h"

EMSCRIPTEN_KEEPALIVE
extern "C" void* FFT_new(int N, int inv)
{
    return kiss_fft_alloc(N, inv, NULL, NULL);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void FFT_delete(kiss_fft_cfg cfg)
{
    free(cfg);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void FFT_processBlock(kiss_fft_cfg cfg, const float* x, float* y)
{
    kiss_fft(cfg, (const kiss_fft_cpx*)x, (kiss_fft_cpx*)y);
}
