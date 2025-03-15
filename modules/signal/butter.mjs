import * as math from 'mathjs'

export function buttap(N) {
  // Prototype analogue Butterworth low pass filter has poles on a unit circle.
  const j = math.complex(0,1);
  let p=[];
  for (let n=0; n<N; n++) {
    const angle = ((n + 0.5) / N + 0.5) * Math.PI;
    p.push(math.exp(math.multiply(j,angle)));
  }
  if (N%2==1) p[(N-1)/2] = math.complex(-1,0);

  return [[], p, 1];
}
