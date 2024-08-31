export class Random32 {
  static _wasm = null;
  static BlockSize = 128;
  constructor(seed) {
    seed = seed || 0;  
    this.ptr = Random32._wasm.exports.Random32_new(seed);
    this.ptrY = Random32._wasm.exports.Buffer(Random32.BlockSize * 2);
    let buffer = Random32._wasm.exports.memory.buffer;
    this.bufY  = new Float64Array(buffer, this.ptrY, Random32.BlockSize);
  }

  normal(N) {
    let y = [];
    for (let i=0; i<N; i+=Random32.BlockSize) {
      let len = N-i;
      if (len>Random32.BlockSize) len = Random32.BlockSize;
      Random32._wasm.exports.Random32_normal(this.ptr, this.ptrY, len);
      y = y.concat(Array.from(this.bufY));
    }
    return y.slice(0,N);
  }

  uniform(N) {
    let y = [];
    for (let i=0; i<N; i+=Random32.BlockSize) {
      let len = N-i;
      if (len>Random32.BlockSize) len = Random32.BlockSize;
      Random32._wasm.exports.Random32_uniform(this.ptr, this.ptrY, len);
      y = y.concat(Array.from(this.bufY));
    }
    return y.slice(0,N);
  }
}

