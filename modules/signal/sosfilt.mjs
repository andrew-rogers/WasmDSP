let wasm = null;

export function onWasm(w) {
  wasm = w;
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
