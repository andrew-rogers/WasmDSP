/*
 * WasmDSP - Class to write to JavaScript arrays.
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

#include "JSArray.h"

#include <emscripten.h>

EM_JS( int32_t, jsArrayOpen, (const char* name), {
    // Body defined in runtime.
});

EM_JS( int32_t, jsArrayRead, (int32_t id, int32_t type, void* ptr, uint32_t index, uint32_t cnt), {
    // Body defined in runtime.
});

EM_JS( void, jsArrayWrite, (int32_t id, int32_t type, const void* ptr, uint32_t cnt), {
    // Body defined in runtime.
});

namespace WasmDSP
{

int32_t jsArrayOpen(const char* name)
{
    return ::jsArrayOpen(name);
}

int32_t JSArray::read(float* ptr, uint32_t cnt)
{
    int32_t nread = jsArrayRead(m_id, Type::FLOAT32, ptr, m_pos, cnt);
    if (nread > 0) m_pos += nread;
    return nread;
}

int32_t JSArray::read(char* ptr, uint32_t cnt)
{
    int32_t nread = jsArrayRead(m_id, Type::STRING, ptr, m_pos, cnt);
    if (nread > 0) m_pos += nread;
    return nread;
}

void jsArrayWrite(int32_t id, int32_t type, const void* ptr, uint32_t cnt)
{
    ::jsArrayWrite(id, type, ptr, cnt);
}

} // namespace WasmDSP
