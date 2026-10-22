import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { atmosphere } from '../atmosphere';
import { hash } from '../motion';

const COUNT = 420;

/**
 * Stars all around the model, as if it floats in a night sky. The camera looks
 * down at the board, so a dome overhead would never be in view.
 */
export function Stars() {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const azimuth = hash(i) * Math.PI * 2;
      const elevation = Math.asin(hash(i + 1000) * 2 - 1);
      const radius = 180 + hash(i + 2000) * 60;
      positions.set(
        [Math.cos(azimuth) * Math.cos(elevation) * radius, Math.sin(elevation) * radius, Math.sin(azimuth) * Math.cos(elevation) * radius],
        i * 3,
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: '#f4f1ff',
      size: 2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    });
    return { geometry, material };
  }, []);

  useFrame(() => {
    material.opacity = (Math.max(0, atmosphere.night - 0.4) / 0.6) * 0.9;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
