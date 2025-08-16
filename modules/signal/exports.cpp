/*
 * WasmDSP - Exported functions
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

#include "JSArray.h"
#include "SOSFilt.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" void sosfilt()
{
    WasmDSP::JSArray sos("sos");
    WasmDSP::JSArray x("x");
    WasmDSP::JSArray y("y");

    size_t num_sections = sos.size() / 5U;
    float coeffs[num_sections * 5U];
    float state[num_sections * 2U];
    size_t nr = sos.read(coeffs, num_sections * 5U);

    SOSFilt filt(num_sections, coeffs, state);

    const size_t BlockSize = 64U;
    float samples[BlockSize];
    float output[BlockSize];
    do {
        nr = x.read(samples, BlockSize);
        filt.processBlock(samples, output, nr);
        y.write(output, nr);
    } while (nr == BlockSize);
}

