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

#ifndef JSARRAY_H
#define JSARRAY_H

#include <cstdint>

namespace WasmDSP {

int32_t jsArrayOpen(const char* name);
void jsArrayWrite(int32_t id, int32_t type, const void* ptr, uint32_t cnt);

class JSArray
{
public:
    enum Type{ STRING, INT8, UINT8, INT16, UINT16, INT32, UINT32, INT64, UINT64, FLOAT32, FLOAT64 };

    JSArray(const char* name)
    {
        m_id = jsArrayOpen(name);
        m_pos = 0U;
    }

    int32_t read(float* ptr, uint32_t cnt);
    int32_t read(char* ptr, uint32_t cnt);

    int32_t size();

    void write(const float* ptr, uint32_t cnt)
    {
        jsArrayWrite(m_id, Type::FLOAT32, ptr, cnt);
    }

    void write(const double* ptr, uint32_t cnt)
    {
        jsArrayWrite(m_id, Type::FLOAT64, ptr, cnt);
    }

    void write(const char* ptr, uint32_t cnt)
    {
        jsArrayWrite(m_id, Type::STRING, ptr, cnt);
    }

private:
    int32_t m_id;
    uint32_t m_pos;
};

} // namespace WasmDSP

#endif // JSARRAY_H
