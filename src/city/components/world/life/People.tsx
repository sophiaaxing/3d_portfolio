import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '../../../data/palette';
import { cylinder, sphere } from '../geometry';
import { useAmbientMotion } from '../motion';

const WALK_RADIUS = 3.25;
const GROUND = 0.08;

/** A few figures strolling around the plaza, each at their own pace and direction. */
const walkers = [
  { start: 0.1, speed: 0.05, colour: palette.charcoal },
  { start: 0.7, speed: -0.04, colour: palette.stoneDark },
  { start: 1.9, speed: 0.035, colour: palette.white },
  { start: 2.05, speed: 0.035, colour: palette.accent },
  { start: 3.4, speed: -0.055, colour: palette.charcoal },
  { start: 4.8, speed: 0.045, colour: palette.stone },
];

export function People() {
  const animate = useAmbientMotion();
  const bodies = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 }), []);
  // Neutral like model figurines.
  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: palette.white, roughness: 0.8 }), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  useLayoutEffect(() => {
    const colour = new THREE.Color();
    walkers.forEach(({ colour: c }, i) => bodies.current?.setColorAt(i, colour.set(c)));
    if (bodies.current?.instanceColor) bodies.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    walkers.forEach(({ start, speed }, i) => {
      const angle = start + t * speed;
      const x = Math.cos(angle) * WALK_RADIUS;
      const z = Math.sin(angle) * WALK_RADIUS;
      // A slight bob in step.
      const bob = animate ? Math.abs(Math.sin(t * 6 + i)) * 0.012 : 0;
      bodies.current?.setMatrixAt(i, matrix.makeTranslation(x, GROUND + bob, z));
      heads.current?.setMatrixAt(i, matrix.makeTranslation(x, GROUND + 0.2 + bob, z));
    });
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true;
    if (heads.current) heads.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={bodies} args={[cylinder(0.035, 0.05, 0.17, 8), bodyMaterial, walkers.length]} frustumCulled={false} />
      <instancedMesh ref={heads} args={[sphere(0.035, 10), headMaterial, walkers.length]} frustumCulled={false} />
    </group>
  );
}
