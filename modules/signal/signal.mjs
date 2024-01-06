import {b64} from './signal_wasm'
import {Biquad} from './Biquad'
import {FIR} from './FIR'

WasmDSP.compileWasm(b64).then(function(w){
    Biquad._wasm = w;
    FIR._wasm = w;
});

export {b64, Biquad, FIR};

