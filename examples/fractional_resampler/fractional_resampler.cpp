#include "FractionalResampler.h"
#include "JsMediator.h"
#include "emjs.h"

#include <cstdint>
#include <emscripten.h>

WasmDSP::IMediator* mediator = &WasmDSP::g_mediator;

EMSCRIPTEN_KEEPALIVE
extern "C" void* allocFloat32(const size_t size)
{
	return new float[size];
}

EMSCRIPTEN_KEEPALIVE
extern "C" FractionalResampler* FractionalResampler_new(const float rate, float* input, size_t input_len, float* output, size_t output_max)
{
	return new FractionalResampler(rate, mediator, input, input_len, output, output_max);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void FractionalResampler_resample(FractionalResampler* fr)
{
    fr->resample();
}

