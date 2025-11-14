/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2025  Andrew Rogers
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

import {registerOnWasm} from './signal_init'

let wasm = null;

registerOnWasm((w) => {
  wasm = w;
  Random32._wasm = w;
});

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

