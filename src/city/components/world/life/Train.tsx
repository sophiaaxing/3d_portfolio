import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ribbon } from '../geometry';
import { materials } from '../materials';
import { useAmbientMotion } from '../motion';
import { Route, headingBetween, roundedRectLoop } from '../paths';
import { Block } from '../primitives';

/** The loop sits just inside the edge of the board. */
const HALF = 22.3;
const CORNER = 2.2;
const SPEED = 2.2;
const CARS = 3;
const CAR_LENGTH = 1.05;
const GAP = 0.12;
const RAIL_Y = 0.012;

const loop = roundedRectLoop(HALF, CORNER);
const route = new Route(loop.map(([x, z]) => [x, 0.05, z]));
const bed = ribbon('train-bed', loop, 0.46);
const railA = ribbon('train-rail-a', roundedRectLoop(HALF + 0.1, CORNER + 0.1), 0.03);
const railB = ribbon('train-rail-b', roundedRectLoop(HALF - 0.1, CORNER - 0.1), 0.03);

function Carriage({ front }: { front: boolean }) {
  return (
    <group>
      <Block size={[CAR_LENGTH, 0.3, 0.34]} material={materials.white} radius={front ? 0.1 : 0.05} shadow={false} />
      {/* A band of windows that light up after dark. */}
      <Block size={[CAR_LENGTH - 0.14, 0.09, 0.35]} at={[0, 0.14, 0]} material={materials.window} radius={0.02} shadow={false} />
      <Block size={[CAR_LENGTH - 0.02, 0.04, 0.35]} at={[0, 0.03, 0]} material={materials.accent} radius={0.01} shadow={false} />
    </group>
  );
}

/** One train, running slowly around the edge of the city. */
export function Train() {
  const animate = useAmbientMotion();
  const carriages = useRef<(THREE.Group | null)[]>([]);
  const here = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const distance = (animate ? clock.elapsedTime : 30) * SPEED;
    carriages.current.forEach((carriage, i) => {
      if (!carriage) return;
      const t = (((distance - i * (CAR_LENGTH + GAP)) / route.length) % 1 + 1) % 1;
      route.at(t, here);
      route.at((t + 0.001) % 1, ahead);
      carriage.position.copy(here);
      carriage.rotation.y = headingBetween(here, ahead);
    });
  });

  return (
    <group>
      <mesh geometry={bed} material={materials.stoneDark} position={[0, RAIL_Y, 0]} receiveShadow />
      <mesh geometry={railA} material={materials.metal} position={[0, RAIL_Y + 0.002, 0]} />
      <mesh geometry={railB} material={materials.metal} position={[0, RAIL_Y + 0.002, 0]} />
      {Array.from({ length: CARS }, (_, i) => (
        <group
          key={i}
          ref={(group) => {
            carriages.current[i] = group;
          }}
        >
          <Carriage front={i === 0} />
        </group>
      ))}
    </group>
  );
}
