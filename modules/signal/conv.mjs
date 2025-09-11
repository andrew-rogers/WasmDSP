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

export function conv(x, y) {
  let r = [];
  let K = x.length + y.length - 1;
  for (let k = 0; k < K; k++) {
    let sum = 0;
    let N = y.length;
    for (let n = 0; n < N; n++) {
      if (n > k) break;
      if ((k - n) >= x.length) continue;
      sum += x[k - n] * y[n];
    }
    r.push(sum);
  }
  return r;
}

export function fir(h, x, state) {
  let buf = [];
  let y = [];
  state = state || 0;
  if (state.constructor === Array) state.forEach((v) => buf.push(v));
  while (buf.length < (h.length - 1)) buf.push(0);
  x.forEach((v) => buf.push(v));
  for (let n = h.length - 1; n < buf.length; n++) {
    let sum = 0;
    for (let k = 0; k < h.length; k++) sum += buf[n - k] * h[k];
    y.push(sum);
  }
  if (state.constructor === Array) {
    let rs = [];
    for (let k = x.length; k < buf.length; k++) rs.push(buf[k]);
    return [y, rs];
  }
  return y;
}

export function xcorr(x, y) {
  let r = [];
  for (let lag = (1 - y.length); lag < x.length; lag ++) {
    let sum = 0;
    let n0 = 0;
    if (lag < 0) n0 = -lag;
    let n1 = y.length;
    if ((n1+lag) >= x.length) n1 = x.length - lag; 
    for (let n = n0; n < n1; n++) sum += x[n + lag] * y[n];
    r.push(sum);
  }
  return r;
}
