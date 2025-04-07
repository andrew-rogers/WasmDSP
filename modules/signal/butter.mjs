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


export function butter(N, wo, type) {
  type = type || 'lp';
  let [z, p, k] = buttap(N);

  // Pre-warp frequencies
  wo = math.multiply(2.0, math.tan(math.multiply(math.multiply(math.pi, wo), 0.5)));

  // Scale zeros and poles
  if (type=='lp') {
    z = math.multiply(wo, z);
    p = math.multiply(wo, p);
  } else {
    z = math.dotDivide(wo, z);
    p = math.dotDivide(wo, p);
  }

  // BZT
  z = math.dotDivide(math.add(2.0, z), math.subtract(2.0, z));
  p = math.dotDivide(math.add(2.0, p), math.subtract(2.0, p));

  return [z, p, k];
}