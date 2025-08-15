let wasm = null;

export function onWasm(w) {
  wasm = w;
}

export function sosfilt(sos, x) {
  let y= wasm.getArray('y');
  y.length = 0;
  wasm.callCFunc('sosfilt');
  return y; 
}
