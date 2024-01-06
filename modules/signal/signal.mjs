import {b64} from './signal_wasm'
import {Biquad} from './Biquad'
import {FIR} from './FIR'

export function onWasm(wasm) {
	Biquad._wasm = wasm;
	FIR._wasm = wasm;
}

export {b64, Biquad, FIR};

