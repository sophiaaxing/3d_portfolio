import * as THREE from 'three';
import { palette } from '../../../data/palette';

let texture: THREE.Texture | null = null;

/** A soft round gradient, for pools of lamplight on the ground. */
export function glowTexture() {
  if (texture) return texture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Additive warm light, faded in and out with the night. */
export const glowMaterial = () =>
  new THREE.MeshBasicMaterial({
    map: glowTexture(),
    color: palette.warmLight,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
