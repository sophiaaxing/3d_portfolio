import type { TimePhase } from '../../hooks/useTimeOfDay';

export interface AtmospherePreset {
  fog: string;
  hemiSky: string;
  hemiGround: string;
  hemi: number;
  sun: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  fill: string;
  fillIntensity: number;
  /** Strength of the studio-light reflections. */
  environment: number;
  /** Emissive strength of windows, lamps, and glass. */
  windows: number;
  lamps: number;
  glass: number;
  /** 0 by day, 1 at night: stars, light pools, headlights. */
  night: number;
}

export const presets: Record<TimePhase, AtmospherePreset> = {
  day: {
    fog: '#e8e1d6',
    hemiSky: '#fffaf1',
    hemiGround: '#bfae98',
    hemi: 0.55,
    sun: '#fff5ea',
    sunIntensity: 3.4,
    sunPosition: [-22, 34, 16],
    fill: '#e3ebf2',
    fillIntensity: 0.35,
    environment: 1,
    windows: 0.7,
    lamps: 0.5,
    glass: 0,
    night: 0,
  },
  // A low sun: warm light and long shadows.
  evening: {
    fog: '#e4c9b3',
    hemiSky: '#ffdcbc',
    hemiGround: '#8c705c',
    hemi: 0.5,
    sun: '#ffb47e',
    sunIntensity: 2.8,
    sunPosition: [-34, 15, 22],
    fill: '#b7c3e4',
    fillIntensity: 0.3,
    environment: 0.7,
    windows: 1.5,
    lamps: 1.6,
    glass: 0.12,
    night: 0.45,
  },
  // Blue moonlight, with the city's own lights doing the rest.
  night: {
    fog: '#1b2130',
    hemiSky: '#5c6c96',
    hemiGround: '#12141c',
    hemi: 0.12,
    sun: '#a9badf',
    sunIntensity: 0.2,
    sunPosition: [-22, 34, 16],
    fill: '#4a5a86',
    fillIntensity: 0.06,
    environment: 0.04,
    windows: 2.6,
    lamps: 3,
    glass: 0.5,
    night: 1,
  },
};

/**
 * The current blend, for things that animate every frame (light pools, stars,
 * headlights) to read without re-rendering.
 */
export const atmosphere = { night: 0 };
