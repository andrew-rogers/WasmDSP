let wasm = null;

export function onWasm(w) {
  wasm = w;
}

export function sosfilt(sos, x) {
  let obj = {sos, x};
  let scope = wasm.newScope(obj);
  wasm.callCFunc('sosfilt', scope);
  return obj.y;
}
