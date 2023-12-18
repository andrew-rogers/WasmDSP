#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" size_t resample(const float* in, const size_t num_in, float* out)
{
    // TODO put the resampling algorithm in here!
    return 10U;
}

