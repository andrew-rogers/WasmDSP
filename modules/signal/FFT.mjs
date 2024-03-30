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
}
