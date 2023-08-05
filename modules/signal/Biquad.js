export class Biquad {
    static _wasm = null;
    constructor(b0, b1, b2, a1, a2) {
        Biquad._wasm.exports.Biquad_new(b0, b1, b2, a0, a1);
    }
}

