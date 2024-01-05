/*
    Fractional Resampler - Performs a fractional change of sample rate
    Copyright (C) 2024  Andrew Rogers

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

#include "FractionalResampler.h"

FractionalResampler::FractionalResampler(const float rate, IMediator* mediator, const float* input, const size_t input_len, float* output, const size_t output_max) : m_step(1.0F / rate), m_mediator(mediator), m_input(input), m_input_len(input_len), m_output(output), m_output_max(output_max), m_index(0.0F), m_prev(0.0F), m_cnt(0U)
{
}

void FractionalResampler::resample()
{
	for (size_t n = 0U; n<m_input_len; n++)
	{
		float curr = m_input[n];

		while (m_index < 1.0F)
		{
			// Linear interpolation between two adjacent entries in input
			m_output[m_cnt] = m_prev + (curr-m_prev) * m_index;
			m_cnt++;

			if (m_cnt >= m_output_max)
			{
				m_cnt = 0U;
				notify(0U);
			}

			m_index += m_step;
		}
		m_index -= 1.0F;

		m_prev = curr;
	}
}

