import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '../../../data/palette';
import { atmosphere } from '../atmosphere';
import { ribbon } from '../geometry';
import { materials } from '../materials';
import { useAmbientMotion } from '../motion';
import { Route, headingBetween } from '../paths';
import { Block } from '../primitives';

/** Radius of the roundabout around the plaza. */
const RING = 5.1;
const LANE = 0.35;
const END = 21;
const CAR_Y = 0.045;
const SPEED = 1.5;

/** Heading angle on the ring, measured in the ground plane from +x towards +z. */
const angleOf = (x: number, z: number) => Math.atan2(z, x);

/**
 * A drive along one boulevard: in on the right-hand lane, round the plaza, and out the far side.
 * Every car circles the same way, so the roundabout reads as one.
 */
function driveRoute(axis: 'x' | 'z', direction: 1 | -1): Route {
  // Right-hand lane: offset to the driver's right.
  const lane = axis === 'x' ? LANE * direction : -LANE * direction;
  const onRing = Math.sqrt(RING * RING - LANE * LANE);
  const point = (along: number): [number, number] => (axis === 'x' ? [along, lane] : [lane, along]);
  const [sx, sz] = point(-END * direction);
  const [ex, ez] = point(-onRing * direction);
  const [xx, xz] = point(onRing * direction);
  const enter = angleOf(ex, ez);
  let leave = angleOf(xx, xz);
  // Always go round clockwise in this angle (angle decreasing).
  while (leave > enter) leave -= Math.PI * 2;
  const points: [number, number, number][] = [[sx, CAR_Y, sz]];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const a = enter + ((leave - enter) * i) / steps;
    points.push([Math.cos(a) * RING, CAR_Y, Math.sin(a) * RING]);
  }
  const [fx, fz] = point(END * direction);
  points.push([fx, CAR_Y, fz]);
  return new Route(points);
}

const cars = [
  { route: driveRoute('x', 1), colour: materials.white, offset: 0 },
  { route: driveRoute('x', -1), colour: materials.stone, offset: 0.45 },
  { route: driveRoute('z', 1), colour: materials.charcoal, offset: 0.2 },
  { route: driveRoute('z', -1), colour: materials.white, offset: 0.7 },
];

function Car({ route, colour, offset }: (typeof cars)[number]) {
  const animate = useAmbientMotion();
  const car = useRef<THREE.Group>(null);
  const lights = useMemo(
    () => new THREE.MeshBasicMaterial({ color: palette.warmLight, transparent: true, opacity: 0, toneMapped: false }),
    [],
  );
  const here = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const duration = route.length / SPEED;

  useFrame(({ clock }) => {
    const group = car.current;
    if (!group) return;
    const t = ((animate ? clock.elapsedTime : 4) / duration + offset) % 1;
    route.at(t, here);
    route.at(t + 0.002, ahead);
    group.position.copy(here);
    group.rotation.y = headingBetween(here, ahead);
    // Fade in and out at the edges of the board.
    group.scale.setScalar(Math.min(1, t * 25, (1 - t) * 25));
    lights.opacity = atmosphere.night;
  });

  return (
    <group ref={car}>
      <Block size={[0.5, 0.13, 0.26]} material={colour} radius={0.04} shadow={false} />
      <Block size={[0.26, 0.1, 0.22]} at={[-0.03, 0.13, 0]} material={colour} radius={0.03} shadow={false} />
      {[-0.08, 0.08].map((z) => (
        <mesh key={z} position={[0.255, 0.07, z]} material={lights}>
          <boxGeometry args={[0.02, 0.035, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

const roundabout = ribbon(
  'roundabout',
  Array.from({ length: 97 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    return [Math.cos(a) * RING, Math.sin(a) * RING] as [number, number];
  }),
  0.8,
);

/** A few cars on the boulevards, taking the roundabout at the plaza. */
export function Traffic() {
  return (
    <group>
      <mesh geometry={roundabout} material={materials.path} position={[0, 0.038, 0]} receiveShadow />
      {cars.map((car, i) => (
        <Car key={i} {...car} />
      ))}
    </group>
  );
}
