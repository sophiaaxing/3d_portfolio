import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { atmosphere } from '../atmosphere';
import { cylinder, sphere } from '../geometry';
import { materials } from '../materials';
import type { Vec3 } from '../primitives';
import { glowMaterial } from './glow';

const POLE = 1.0;
const POOL_SIZE = 2.4;

/** Lamps along both boulevards, clear of the lanes into each district, plus four around the plaza. */
function lampPositions(): Vec3[] {
  const lanes = { x: [-11, -9, 9, 11.5], z: [14.5, 15.5] };
  const clear = (value: number, list: number[]) => list.every((lane) => Math.abs(value - lane) > 1.2);
  const lamps: Vec3[] = [];
  for (const d of [7.75, 12.75, 17.75]) {
    for (const sign of [-1, 1]) {
      const along = d * sign;
      const side = sign * 0.95;
      if (clear(along, lanes.x)) lamps.push([along, 0, side]);
      if (clear(along, lanes.z)) lamps.push([-side, 0, along]);
    }
  }
  for (let i = 0; i < 4; i++) {
    const angle = Math.PI / 4 + (i * Math.PI) / 2;
    lamps.push([Math.cos(angle) * 5.9, 0, Math.sin(angle) * 5.9]);
  }
  return lamps;
}

/** Street lamps: thin posts with glowing heads, and pools of light on the ground after dark. */
export function Streetlights() {
  const lamps = useMemo(lampPositions, []);
  const pool = useMemo(glowMaterial, []);
  const poolGeometry = useMemo(() => new THREE.PlaneGeometry(POOL_SIZE, POOL_SIZE), []);
  const pools = useRef<THREE.Group>(null);

  useFrame(() => {
    pool.opacity = atmosphere.night * 0.55;
    if (pools.current) pools.current.visible = atmosphere.night > 0.01;
  });

  return (
    <group>
      <Instances geometry={cylinder(0.025, 0.03, POLE, 8)} material={materials.charcoal} castShadow frustumCulled={false}>
        {lamps.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      <Instances geometry={sphere(0.07, 12)} material={materials.lamp} frustumCulled={false}>
        {lamps.map(([x, , z], i) => (
          <Instance key={i} position={[x, POLE + 0.05, z]} />
        ))}
      </Instances>
      <group ref={pools}>
        <Instances geometry={poolGeometry} material={pool} frustumCulled={false}>
          {lamps.map(([x, , z], i) => (
            <Instance key={i} position={[x, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]} />
          ))}
        </Instances>
      </group>
    </group>
  );
}
