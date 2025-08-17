let wasm = null;

export function onWasm(w) {
  wasm = w;
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

function complexMult(a, b) {
  return [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
}

function sosEvalHz(coeffs, w) {
  //
  //   b[0]z + b[1] + b[2]/z       z = exp(i*w)  = cos(w) + i*sin(w)
  //  -----------------------
  //   a[0]z + a[1] + a[2]/z     1/z = exp(-i*w) = cos(w) - i*sin(w)
  //
  let c = Math.cos(w);
  let s = Math.sin(w);
  let num_r = (coeffs[0] + coeffs[2]) * c + coeffs[1];
  let num_i = (coeffs[0] - coeffs[2]) * s;
  let den_r = (coeffs[3] + coeffs[5]) * c + coeffs[4];
  let den_i = (coeffs[3] - coeffs[5]) * s;

  return complexDiv([num_r, num_i], [den_r, den_i]);
}

export function sosfilt(sos, x) {
  let sos5 = []
  for (let s = 0; s < sos.length; s++) {
    let c = sos[s];
    let scale = 1.0 / c[3];
    sos5.push(c[0] * scale);
    sos5.push(c[1] * scale);
    sos5.push(c[2] * scale);
    sos5.push(c[4] * scale);
    sos5.push(c[5] * scale);
  }
  let obj = {sos: sos5, x};
  let scope = wasm.newScope(obj);
  wasm.callCFunc('sosfilt', scope);
  return obj.y;
}

export function sosfreqz(sos, w) {
  w = w || 300;
  if (typeof w === 'number') {
    const N = w;
    w = [];
    const step = Math.PI * 2 / N;
    for(let n=0; n < N; n++) w.push(n*step);
  }
  let h = [];
  for (let n = 0; n < w.length; n++) {
    let hz = sosEvalHz(sos[0], w[n]);
    for (let s = 1; s < sos.length; s++) {
      hz = complexMult(hz, sosEvalHz(sos[s], w[n]));
    }
    h.push(hz);
  }
  return [h,w];
}