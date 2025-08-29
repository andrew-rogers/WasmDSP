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

import {Ellip, R, K, F} from './ellip'

export function ellip(N, rp, rs, fc, bt, options) {
  // TODO: Check band
  // TODO: Check options, {analogue: false, zpk: true} etc.
  // TODO: Pre-warp

  // Prototype
  let [z, p, k] = ellipap(N, rp, rs);

  // Frequency scale
  [z, p, k] = frequencyScale(z, p, k, fc, bt);

  // TODO: BZT

  return [z, p, k];
}

export function ellipap(N, rp, rs) {
  // Prototype analogue Elliptic low pass filter.

  let eps = 0.5088;  // TODO: calc from riiple spec.
  let xi = 1.218699; // TODO: calc from riiple spec.

  // Zeros are the poles of the ellitic rational function mapped to the imaginary axis.
  let r = R(N, xi, [0]);
  let z = r.p.map((v) => [0, v])

  // Poles are from the zeros of the elliptic rational function with its argument being the complex frequency s = jw.
  let ml = 1 / (r.L * r.L);
  let Kl = K(ml);

  let m = 1 / (xi * xi);
  let Kxi = K(m);
  let el = new Ellip(m);
  let wi = - Kxi * F(Math.atan(-1/eps), 1-ml) / (N * Kl);

  let w = [];
  for (let n = 0; n < N; n++) w.push([(n * 2 + 1) * Kxi / N, wi]);

  let p = w.map((w_val) => el.cd_c(w_val));

  return [z, p, 1];
}

function complexDiv(num, den) {
  const a = num[0];
  const b = num[1];
  const c = den[0];
  const d = den[1];
  //
  //   a + ib       a + ib     c - id       ac - iad + ibc - iibd       ac + bd + i(bc-ad)
  //  --------  =  -------- * --------  =  -----------------------  =  --------------------
  //   c + id       c + id     c - id       cc - icd + icd - iidd            cc + dd
  //
  const scale = 1 / (c*c + d*d);
  const r = a*c + b*d;
  const i = b*c - a*d;
  return [scale*r, scale*i];
}

function frequencyScale(z, p, k, fc, bt) {
  bt = bt || 'L'; // Default to lowpass.

  // find first occurance of L,H,P or S
  // Lowpass Highpass bandPass bandStop
  bt = bt.toUpperCase().match(/[LHPS]/g);
  if (bt.length == 0) bt = 'L';
  else bt = bt[0];

  // Scale zeros and poles
  if (bt == 'H') { // TODO: 'P' and 'S'
    z = z.map((v) => complexDiv([fc, 0], v));
    p = p.map((v) => complexDiv([fc, 0], v));
  } else {
    // Lowpass default.
    z = z.map((v) => [fc * v[0], fc * v[1]]);
    p = p.map((v) => [fc * v[0], fc * v[1]]);
  }

  return [z, p, k];
}
