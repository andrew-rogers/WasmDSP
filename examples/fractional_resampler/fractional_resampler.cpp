#include "FractionalResampler.h"
#include "emjs.h"

#include <cstdint>
#include <emscripten.h>

class Mediator : public IMediator
{
public:
	virtual void notify(void* sender, const uint32_t id);
};

void Mediator::notify(void* sender, const uint32_t id)
{
	WasmDSP::emjs_event(sender, id);
}

Mediator m;
IMediator* mediator = &m;

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

