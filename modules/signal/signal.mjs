import {b64} from './signal_wasm'
import {Biquad} from './Biquad'
import {FFT} from './FFT'
import {FIR} from './FIR'
import {Random32} from './Random'

export function onWasm(wasm) {
  Biquad._wasm = wasm;
  FFT._wasm = wasm;
  FIR._wasm = wasm;
  Random32._wasm = wasm;
}

export {b64, Biquad, FFT, FIR, Random32};

