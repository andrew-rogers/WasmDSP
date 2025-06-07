export function rms(x) {
  let N = x.length;

  let acc = 0;
  for (let n=0; n<N; n++) {
    acc += x[n] * x[n]; // square
  }

  return Math.sqrt(acc / N);
}
