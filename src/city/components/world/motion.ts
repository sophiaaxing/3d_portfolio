import { createContext, useContext } from 'react';

/** False when the visitor prefers reduced motion: ambient animations hold a still pose. */
export const AmbientMotion = createContext(true);

export const useAmbientMotion = () => useContext(AmbientMotion);

/** Smooth 0 → 1 → 0 over one period, for things that go and come back. */
export const pingPong = (t: number) => 0.5 - 0.5 * Math.cos(t * Math.PI * 2);

/** Ease in and out over 0 → 1. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Cheap deterministic pseudo-random number in [0, 1) for a given seed. */
export const hash = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
