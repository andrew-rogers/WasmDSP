import {b64} from './signal_wasm'
import {Biquad} from './Biquad'
import {buttap, butter, butter_zpk} from './butter'
import {FFT} from './FFT'
import {FIR} from './FIR'
import {Random32} from './Random'
import * as mod_sosfilt from './sosfilt'

export function onWasm(wasm) {
  Biquad._wasm = wasm;
  FFT._wasm = wasm;
  FIR._wasm = wasm;
  Random32._wasm = wasm;
  mod_sosfilt.onWasm(wasm);
}

const sosfilt  = mod_sosfilt.sosfilt;
const sosfreqz = mod_sosfilt.sosfreqz;

export {b64, Biquad, buttap, butter, butter_zpk, FFT, FIR, Random32, sosfilt, sosfreqz};
