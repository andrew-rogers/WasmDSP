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
  let opt = checkOptions(options);

  // Prototype
  let [z, p, k] = ellipap(N, rp, rs);

  // Frequency scale
  return frequencyScale(z, p, k, fc, bt, opt);
}

export function ellipap(N, rp, rs) {
  // Prototype analogue Elliptic low pass filter.

  rp = 10 ** (-rp / 20);
  rs = 10 ** (-rs / 20);
  let eps = Math.sqrt(1 / (rp * rp) - 1);
  let Lt  = Math.sqrt(1 / (rs * rs) - 1) / eps;

  // Zeros are the poles of the ellitic rational function mapped to the imaginary axis.
  let [r,xi] = findR(N, Lt);
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
  p = p.map((v) => [v[1], v[0]]); // Swap real and imaginary.

  // Compute gain at jw = 0
  let hz = 1;
  let hp = rp;
  if (N%2) hp = 1;
  z.forEach((v) => hz = hz * Math.sqrt(v[0]*v[0] + v[1]*v[1]));
  p.forEach((v) => hp = hp * Math.sqrt(v[0]*v[0] + v[1]*v[1]));

  return [z, p, hp / hz];
}

function bzt(z, p, k) {
  function f(a) {
    return complexDiv([2 + a[0], a[1]], [2 - a[0], -a[1]])
  }
  z = z.map(f);
  p = p.map(f);
  while (z.length < p.length) z.push([-1,0]) // Move zeros at infinity to -1
  return [z, p, k];
}

function checkOptions(options) {
  let opt = options || {};
  if (!opt.hasOwnProperty('digital')) opt.digital = true;
  if (!opt.hasOwnProperty('sos')) opt.sos = true;
  return opt;
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

function findR(N, L) {
  let xi_min = 1 + Number.EPSILON;
  let xi = xi_min;

  // Double xi until past target.
  for (let n = 0; n < 10; n++) {
    let r = R(N, xi, [0]);
    console.log({r,xi});
    if (r.L >= L) break;
    xi = xi * 2;
  }

  // Binary search.
  let ll = xi / 2;
  if (ll < xi_min) ll = xi_min;
  let ul = xi;
  let r = {};
  for (let n = 0; n < 60; n++) {
    r = R(N, xi, [0]);
    if(r.L < L) ll = xi;
    else ul = xi;
    xi = (ll + ul) / 2;
  }
  return [r, xi];
}

function frequencyScale(z, p, k, fc, bt, opt) {
  bt = bt || 'L'; // Default to lowpass.

  // find first occurance of L,H,P or S
  // Lowpass Highpass bandPass bandStop
  bt = bt.toUpperCase().match(/[LHPS]/g);
  if (bt.length == 0) bt = 'L';
  else bt = bt[0];

  if (opt.digital) fc = preWarp(fc); // TODO: handle two frequencies for bandpas / bandstop

  // Scale zeros and poles
  if (bt == 'H') { // TODO: 'P' and 'S'
    z = z.map((v) => complexDiv([fc, 0], v));
    p = p.map((v) => complexDiv([fc, 0], v));
    while (z.length < p.length) z.push([0,0]); // Move zeros from infinity to zero.
  } else {
    // Lowpass default.
    z = z.map((v) => [fc * v[0], fc * v[1]]);
    p = p.map((v) => [fc * v[0], fc * v[1]]);
  }

  if (opt.digital) [z, p, k] = bzt(z, p, k);

  if (opt.sos) return zpk2sos(z, p, k);
  return [z, p, k];
}

function preWarp(f) {
  return 2 * Math.tan(Math.PI * f * 0.5);
}

function sort(r) {
  // If odd number of roots put real root last.
  if ((r.length % 2) == 0) return r

  // Find root with smallest absolute imaginary.
  let min = r[0][1];
  let im = 0;
  for (let n = 0; n < r.length; n++) {
    let val = Math.abs(r[n][1]);
    if (val < min) {
      min = val;
      im = n;
    }
  }

  let ret = [];
  for (let n = 0; n < r.length; n++) {
    if (n != im) ret.push(r[n]);
  }
  ret.push(r[im]);

  return ret;
}

function zpk2sos(z,p,k) {

  // Create unity SOS array.
  let sos = [];
  while ((sos.length * 2) < z.length) sos.push([1, 0, 0, 1, 0, 0]);
  while ((sos.length * 2) < p.length) sos.push([1, 0, 0, 1, 0, 0]);

  // Sort roots
  z = sort(z);
  p = sort(p);

  // Modify sections for zeros
  let N = z.length;
  let odd = N % 2;
  let Npairs = (N - odd) / 2;
  for (let n = 0; n < Npairs; n++) {
    sos[n][1] = -2 * z[n][0];
    sos[n][2] = (z[n][0] ** 2) + (z[n][1] ** 2);
  }
  if(odd) sos[Npairs][1] = -z[Npairs*2][0];

  // Modify sections for poles
  N = p.length;
  odd = N % 2;
  Npairs = (N - odd) / 2;
  for (let n = 0; n < Npairs; n++) {
    sos[n][4] = -2 * p[n][0];
    sos[n][5] = (p[n][0] ** 2) + (p[n][1] ** 2);
  }
  if(odd) sos[Npairs][4] = -p[Npairs*2][0];

  let l = sos.length - 1;
  sos[l][0] *= k;
  sos[l][1] *= k;
  sos[l][2] *= k;

  return sos;
}
