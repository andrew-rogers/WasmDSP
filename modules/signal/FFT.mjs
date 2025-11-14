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
  FFT._wasm = w;
});

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
