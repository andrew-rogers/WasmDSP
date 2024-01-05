export class Biquad {
    static _wasm = null;
    static BlockSize = 16;
    constructor(b0, b1, b2, a1, a2) {
        this.ptr = Biquad._wasm.exports.Biquad_new(b0, b1, b2, a1, a2);
        this.ptrX = Biquad._wasm.exports.Buffer(Biquad.BlockSize);
        this.ptrY = Biquad._wasm.exports.Buffer(Biquad.BlockSize);
        let buffer = Biquad._wasm.exports.memory.buffer;
        this.bufX  = new Float32Array(buffer, this.ptrX, Biquad.BlockSize);
        this.bufY  = new Float32Array(buffer, this.ptrY, Biquad.BlockSize);
    }

    process(x) {
        let y = [];
        for (let i=0; i<x.length; i+=Biquad.BlockSize) {
            let sub = x.slice(i,i+Biquad.BlockSize);
            this.bufX.set(sub);
            Biquad._wasm.exports.Biquad_processBlock(this.ptr, this.ptrX, this.ptrY, sub.length);
            y = y.concat(Array.from(this.bufY));
        }
        return y.slice(0,x.length);
    }
}

