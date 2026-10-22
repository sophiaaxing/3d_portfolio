import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '../../data/palette';
import { cylinder } from './geometry';
import { materials } from './materials';
import { Block, Trees } from './primitives';

const RADIUS = 4.6;
const PAVING_H = 0.08;
const MARK_ASPECT = 305 / 534;

/** Loads the monogram without suspending, so the city can appear before it arrives. */
function useMonogramTexture() {
  const invalidate = useThree((state) => state.invalidate);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    let loaded: THREE.Texture | null = null;
    new THREE.TextureLoader().load('/city/sx-mark-hd.png', (t) => {
      loaded = t;
      if (cancelled) {
        t.dispose();
        return;
      }
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTexture(t);
      invalidate();
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [invalidate]);
  return texture;
}

/** SX Plaza: the centre of the world, with the monogram inlaid in the paving. */
export function Plaza() {
  const mark = useMonogramTexture();

  const benches = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2 + Math.PI / 4);

  return (
    <group>
      <mesh geometry={cylinder(RADIUS, RADIUS, PAVING_H, 96)} material={materials.paving} receiveShadow />
      <mesh rotation-x={-Math.PI / 2} position={[0, PAVING_H + 0.004, 0]} material={materials.bronze} receiveShadow>
        <ringGeometry args={[2.72, 2.8, 96]} />
      </mesh>

      {/* Monogram inlay, turned to read from the resting camera. */}
      {mark && (
        <group rotation-y={Math.PI / 4} position={[0, PAVING_H + 0.006, 0]}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[3.4, 3.4 * MARK_ASPECT]} />
            <meshStandardMaterial
              map={mark}
              color={palette.charcoal}
              transparent
              depthWrite={false}
              roughness={0.45}
              metalness={0.2}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </mesh>
        </group>
      )}

      {benches.map((angle) => (
        <Block
          key={angle}
          size={[1.1, 0.16, 0.34]}
          at={[Math.sin(angle) * 3.7, PAVING_H, Math.cos(angle) * 3.7]}
          rotationY={angle}
          material={materials.stone}
          radius={0.04}
        />
      ))}
      <Trees items={[[4.1, 1.6, 0.7, PAVING_H], [-1.6, 4.1, 0.7, PAVING_H], [-4.1, -1.6, 0.7, PAVING_H], [1.6, -4.1, 0.7, PAVING_H]]} />
    </group>
  );
}
