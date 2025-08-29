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
