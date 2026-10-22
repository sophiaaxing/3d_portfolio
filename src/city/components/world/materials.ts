import * as THREE from 'three';
import { palette } from '../../data/palette';

// Shared materials keep draw state small and give the day/night system
// (phase 5) one place to retune the whole world.
const standard = (color: string, options: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...options });

export const materials = {
  board: standard(palette.board, { roughness: 0.95 }),
  boardBase: standard(palette.boardBase, { roughness: 0.6 }),
  path: standard(palette.path, { roughness: 1 }),
  paving: standard(palette.paving, { roughness: 0.9 }),
  pad: standard(palette.pad, { roughness: 0.95 }),
  white: standard(palette.white, { roughness: 0.8 }),
  stone: standard(palette.stone),
  stoneDark: standard(palette.stoneDark),
  charcoal: standard(palette.charcoal, { roughness: 0.55 }),
  metal: standard(palette.metal, { metalness: 0.55, roughness: 0.35 }),
  bronze: standard(palette.bronze, { metalness: 0.7, roughness: 0.35 }),
  brick: standard(palette.brick, { roughness: 0.9 }),
  roof: standard(palette.roof, { roughness: 0.8 }),
  wood: standard(palette.wood, { roughness: 0.8 }),
  foliage: standard(palette.foliage, { roughness: 1, flatShading: true }),
  trunk: standard(palette.trunk),
  accent: standard(palette.accent, { roughness: 0.55 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: palette.glass,
    roughness: 0.06,
    metalness: 0.1,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    envMapIntensity: 1.4,
    emissive: palette.warmLight,
    emissiveIntensity: 0,
  }),
  // Emissive strengths below are set by the time of day (see Lighting.tsx).
  window: standard('#fff1d6', { emissive: palette.warmLight, emissiveIntensity: 0.7, roughness: 0.4 }),
  lamp: standard('#fff1d6', { emissive: palette.warmLight, emissiveIntensity: 0.5, roughness: 0.4 }),
  statusLight: new THREE.MeshBasicMaterial({ color: palette.accent, toneMapped: false }),
  /** Unlit accent for interface marks in the world, so they read by day and by night. */
  marker: new THREE.MeshBasicMaterial({ color: palette.accent }),
};

export type MaterialName = keyof typeof materials;
