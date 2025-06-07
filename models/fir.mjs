export function fir(h, x) {
  let N = h.length - 1;
  if (x.length < N) N = x.length;
  
  let y = [];
  for (let n=0; n<N; n++) {
    let acc = 0;
    for (let j=0; j<=n; j++) acc += h[j] * x[n-j];
    y.push(acc);
  }

  N = h.length - 1;
  for (let n=N; n<x.length; n++) {
    let acc = 0;
    for (let j=0; j<=N; j++) acc += h[j] * x[n-j];
    y.push(acc);
  }
  return y;
}
