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

let state = (2**31)-5;

// https://en.wikipedia.org/wiki/Xorshift
export function rand() {
  /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
	state ^= state << 13;
  if (state < 0) state += 2**32; // Convert signed to unsigned.
	state ^= state >> 17;
	state ^= state << 5;
  if (state < 0) state += 2**32; // Convert signed to unsigned.
	return state;
}

export function random(N) {
  N = N || 0;
  let scale = 1/(2**32);
  if (N == 0) {
    return scale * rand();
  }
  let y = [];
  for (let n = 0; n < N; n++) { 
    y.push(scale * rand());
  }
  return y;
}

// Box-Muller Transform https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
export function randomn(N) {
  N = N | 0;
  if (N == 0) {
    let radius = Math.sqrt(-2.0 * Math.log(random()));
    let angle = Math.PI * 2.0 * random();
    return radius * Math.cos(angle);
  }
  let y = [];
  for (let n = 0; n < (N/2); n++) {
    let radius = Math.sqrt(-2.0 * Math.log(random()));
    let angle = Math.PI * 2.0 * random();
    y.push(radius * Math.cos(angle));
    y.push(radius * Math.sin(angle));
  }
  if (y.length < N) {
    let radius = Math.sqrt(-2.0 * Math.log(random()));
    let angle = Math.PI * 2.0 * random();
    y.push(radius * Math.cos(angle));
  }
  return y;
}

export function srand(s) {
  state = s || 1;
  state = state | 0;              // Limit to 32-bit range
  if (state < 0) state += 2**32;  // Convert signed to unsigned.
}
