export function resampleCubic(rate, x) {
  return null;
}

export function resampleLinear(rate, x) {
  const step = 1.0 / rate;
  let index = 0.0;
  let y = [];
  let prev = 0.0;
  for (let n=0; n<x.length; n++) {
    let val = x[n];
    while (index < 1) {
      y.push(prev * (1.0 - index) + val * index);
      index += step;
    }
    prev = val;
    index -= 1.0;
  }

  return y;
}
