import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../../data/palette';
import { roundedBox } from '../geometry';
import { materials } from '../materials';
import { hash, smoothstep, useAmbientMotion } from '../motion';
import { Block, Cyl, PAD_H, type Vec3 } from '../primitives';
import { DYNAMIC } from '../StaticBatch';

const Y = PAD_H;
const HALL = { x: -0.6, z: 0.4, w: 7.2, h: 2.6, d: 3.8 };
const FRONT = HALL.z + HALL.d / 2;
const SIDE = HALL.x + HALL.w / 2;
const BAY_BASE = Y + 0.35;
const FANS = [-3.2, -1.7, -0.2, 1.3];

interface Bay {
  x: number;
  z: number;
  front: boolean;
}

const bays: Bay[] = [
  ...Array.from({ length: 7 }, (_, i) => ({ x: HALL.x - 2.7 + i * 0.9, z: FRONT, front: true })),
  ...Array.from({ length: 3 }, (_, i) => ({ x: SIDE, z: HALL.z - 0.9 + i * 0.9, front: false })),
];

/** Offset within a bay's face: `along` runs across the bay, `out` points out of the wall. */
const inBay = ({ x, z, front }: Bay, along: number, y: number, out: number): Vec3 =>
  front ? [x + along, y, z + out] : [x + out, y, z + along];

/** Rack openings: dark bays with rack units, and status lights that blink on their own schedules. */
function Racks() {
  const animate = useAmbientMotion();
  const lights = useRef<THREE.InstancedMesh>(null);
  const on = useMemo(() => new THREE.Color(palette.accent), []);
  const off = useMemo(() => new THREE.Color(palette.charcoal).lerp(new THREE.Color(palette.accent), 0.25), []);
  const colour = useMemo(() => new THREE.Color(), []);
  // Instance colours multiply the material colour, so the material itself stays white.
  const lightMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), []);
  const lightPositions = useMemo(() => bays.flatMap((bay) => [-0.18, 0, 0.18].map((a) => inBay(bay, a, BAY_BASE + 1.55, 0.05))), []);

  useFrame(({ clock }) => {
    const mesh = lights.current;
    if (!mesh) return;
    const t = animate ? clock.elapsedTime : 0;
    lightPositions.forEach((_, i) => {
      // Each light has its own rate and phase; most are on most of the time.
      const cycle = (t * (0.3 + hash(i) * 0.9) + hash(i + 50)) % 1;
      mesh.setColorAt(i, colour.copy(cycle < 0.78 ? on : off));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  const matrices = useMemo(() => {
    const matrix = new THREE.Matrix4();
    return lightPositions.map((p) => matrix.makeTranslation(p[0], p[1], p[2]).clone());
  }, [lightPositions]);

  return (
    <group>
      {bays.map((bay, i) => (
        <Block
          key={i}
          size={bay.front ? [0.62, 1.9, 0.08] : [0.08, 1.9, 0.62]}
          at={inBay(bay, 0, BAY_BASE, 0)}
          material={materials.charcoal}
          radius={0.02}
          shadow={false}
        />
      ))}
      {/* Rack units: thin light bars across each bay. */}
      {[true, false].map((front) => (
        <Instances key={String(front)} geometry={roundedBox(front ? 0.5 : 0.02, 0.03, front ? 0.02 : 0.5, 0.005)} material={materials.stoneDark} frustumCulled={false}>
          {bays
            .filter((bay) => bay.front === front)
            .flatMap((bay) => [0.25, 0.6, 0.95, 1.3].map((h) => <Instance key={`${bay.x}-${bay.z}-${h}`} position={inBay(bay, 0, BAY_BASE + h, 0.05)} />))}
        </Instances>
      ))}
      <instancedMesh
        ref={lights}
        frustumCulled={false}
        args={[roundedBox(0.06, 0.06, 0.06, 0.01), lightMaterial, lightPositions.length]}
        onUpdate={(mesh) => {
          matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
    </group>
  );
}

const RAIL = { z: FRONT + 0.6, from: -4.1, to: 4.2 };
const CART_CYCLE = 10;

/** A cart shuttling a storage module along the front of the hall. */
function Cart() {
  const animate = useAmbientMotion();
  const cart = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!cart.current) return;
    const t = animate ? (clock.elapsedTime % CART_CYCLE) / CART_CYCLE : 0;
    // Hold, travel out, hold, travel back.
    const leg = t < 0.1 ? 0 : t < 0.45 ? smoothstep((t - 0.1) / 0.35) : t < 0.55 ? 1 : t < 0.9 ? 1 - smoothstep((t - 0.55) / 0.35) : 0;
    cart.current.position.x = THREE.MathUtils.lerp(RAIL.to, RAIL.from, leg);
  });
  const length = RAIL.to - RAIL.from;
  return (
    <group>
      {[-0.13, 0.13].map((dz) => (
        <Block key={dz} size={[length, 0.02, 0.03]} at={[(RAIL.from + RAIL.to) / 2, Y, RAIL.z + dz]} material={materials.metal} radius={0.005} shadow={false} />
      ))}
      <group ref={cart} position={[RAIL.to, 0, RAIL.z]} userData={DYNAMIC}>
        <Block size={[0.5, 0.1, 0.36]} at={[0, Y + 0.02, 0]} material={materials.charcoal} radius={0.02} shadow={false} />
        <Block size={[0.34, 0.34, 0.34]} at={[0, Y + 0.12, 0]} material={materials.white} radius={0.04} shadow={false} />
      </group>
    </group>
  );
}

/** Rooftop cooling units with slowly turning fans. */
function Cooling() {
  const animate = useAmbientMotion();
  const fans = useRef<(THREE.Group | null)[]>([]);
  useFrame((_, delta) => {
    if (!animate) return;
    fans.current.forEach((fan, i) => {
      if (fan) fan.rotation.y += delta * (0.8 + i * 0.15);
    });
  });
  const top = Y + HALL.h + 0.32;
  return (
    <group>
      {FANS.map((x, i) => (
        <group key={x}>
          <Cyl radius={0.4} height={0.32} at={[x, Y + HALL.h, HALL.z]} material={materials.charcoal} segments={20} />
          <Cyl radius={0.3} height={0.02} at={[x, top, HALL.z]} material={materials.stoneDark} segments={20} />
          <group
            ref={(g) => {
              fans.current[i] = g;
            }}
            userData={DYNAMIC}
            position={[x, top + 0.02, HALL.z]}>
            <Block size={[0.54, 0.03, 0.08]} material={materials.metal} radius={0.01} shadow={false} />
            <Block size={[0.08, 0.03, 0.54]} material={materials.metal} radius={0.01} shadow={false} />
          </group>
        </group>
      ))}
    </group>
  );
}

/** NVIDIA: an industrial GPU compute facility. */
export function NvidiaDistrict() {
  const storage = [
    [3.8, -0.2, 3], [4.5, -0.2, 2], [3.8, 0.5, 2], [4.5, 0.5, 1], [3.8, 1.2, 1], [4.5, 1.2, 1],
  ];

  return (
    <group>
      {/* Compute hall */}
      <Block size={[HALL.w, HALL.h, HALL.d]} at={[HALL.x, Y, HALL.z]} material={materials.stone} radius={0.08} />
      <Racks />
      <Cooling />
      <Cart />

      {/* Compute tower */}
      <group position={[-2.6, Y, -2.8]}>
        <Block size={[2.0, 4.6, 2.0]} material={materials.charcoal} radius={0.06} />
        {Array.from({ length: 8 }, (_, i) => (
          <Block key={i} size={[2.04, 0.05, 2.04]} at={[0, 0.5 + i * 0.52, 0]} material={materials.white} radius={0.01} shadow={false} />
        ))}
      </group>
      <Cyl radius={0.16} height={5.6} at={[-0.9, Y, -2.9]} material={materials.metal} segments={16} />
      <Cyl radius={0.16} height={5.0} at={[-0.3, Y, -2.9]} material={materials.metal} segments={16} />

      {/* Modular storage */}
      {storage.flatMap(([x, z, levels]) =>
        Array.from({ length: levels }, (_, level) => (
          <Block
            key={`${x}-${z}-${level}`}
            size={[0.6, 0.6, 0.6]}
            at={[x, Y + level * 0.64, z]}
            material={(level + Math.round(x * 2)) % 2 ? materials.white : materials.stoneDark}
            radius={0.05}
          />
        )),
      )}
      {[1.2, 2.3, 3.4].map((x) => (
        <Block key={x} size={[0.9, 0.8, 1.5]} at={[x, Y, -2.9]} material={materials.stoneDark} radius={0.05} />
      ))}
    </group>
  );
}
