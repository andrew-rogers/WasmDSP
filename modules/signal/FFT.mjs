export class FFT {
  static _wasm = null;

  constructor(N, inv) {
    inv = inv || 0;
    let alloc = FFT._wasm.exports.Buffer;
    this.ptrX = alloc(N*2);
    this.ptrY = alloc(N*2);
    const buffer = FFT._wasm.exports.memory.buffer;
    this.bufX = new Float32Array(buffer, this.ptrX, N*2);
    this.bufY = new Float32Array(buffer, this.ptrY, N*2);
    this.ptr = FFT._wasm.exports.FFT_new(N, inv);
  }

  process(x) {
    this.bufX.set(x);
    FFT._wasm.exports.FFT_processBlock(this.ptr, this.ptrX, this.ptrY);
    return Array.from(this.bufY);
  }

  specgram(x) {
    let y = []
    for (let i=0; i<x.length; i+=this.bufY.length) {
      let sub = x.slice(i,i+this.bufY.length);
      let frame = [];
      this.bufX.set(sub);
      FFT._wasm.exports.FFT_processBlock(this.ptr, this.ptrX, this.ptrY);
      for (let j = 0; j < this.bufY.length; j+=2) frame.push(Math.sqrt(this.bufY[j] * this.bufY[j] + this.bufY[j+1] * this.bufY[j+1]));
      y.push(frame);
    }
    return y;
  }
}
