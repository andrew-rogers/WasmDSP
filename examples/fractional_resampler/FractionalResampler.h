/*
    Fractional Resampler - Performs a fractional change of sample rate
    Copyright (C) 2020  Andrew Rogers

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

#ifndef FRACTIONAL_RESAMPLER_H
#define FRACTIONAL_RESAMPLER_H

#include "IMediator.h"

#include <cstdlib>

class FractionalResampler
{
public:
	FractionalResampler(const float rate, WasmDSP::IMediator* mediator, const float* input, const size_t input_len, float* output, const size_t output_max);
	void resample();

private:
	float m_step;
	WasmDSP::IMediator* m_mediator;
	const float* m_input;
	size_t m_input_len;
	float* m_output;
	size_t m_output_max;
	float m_index;
	float m_prev;
	size_t m_cnt;

	void notify(uint32_t id)
	{
		m_mediator->notify(this, id);
	}
};

#endif // FRACTIONAL_RESAMPLER_H

