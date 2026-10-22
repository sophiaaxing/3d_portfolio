import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sphere } from '../geometry';
import { materials } from '../materials';
import { useAmbientMotion } from '../motion';
import { Route, edgeOfBox, groundStrip } from '../paths';
import { Block, PAD_H, Trees, type Vec3 } from '../primitives';

const TOWER = { x: -1.9, z: -1.3, size: 3.2, height: 10 };
const FLOOR_GAP = 0.78;

interface GlassVolumeProps {
  size: Vec3;
  at: Vec3;
}

/** Glass shell over visible floor plates and a stone core. */
function GlassVolume({ size: [w, h, d], at }: GlassVolumeProps) {
  const floors = Math.floor(h / FLOOR_GAP);
  return (
    <group position={at}>
      <Block size={[w * 0.32, h, d * 0.32]} material={materials.stoneDark} />
      {Array.from({ length: floors }, (_, i) => (
        <Block key={i} size={[w - 0.22, 0.08, d - 0.22]} at={[0, 0.04 + i * FLOOR_GAP, 0]} material={materials.white} radius={0.02} />
      ))}
      <Block size={[w, h, d]} material={materials.glass} radius={0.06} shadow={false} />
      <Block size={[w + 0.12, 0.16, d + 0.12]} at={[0, h, 0]} material={materials.white} radius={0.04} />
    </group>
  );
}

/** Data sources in the forecourt: small stacks of cards, each with a line running to the tower. */
const SOURCES: [number, number][] = [
  [-4.3, 0.9],
  [-2.6, 3.3],
  [4.5, 0.0],
  [-4.4, -3.4],
];
const NODES_PER_SOURCE = 2;
const TRAVEL_SECONDS = 3.4;
const NODE_Y = PAD_H + 0.09;

function Source({ at, seed }: { at: [number, number]; seed: number }) {
  return (
    <group position={[at[0], PAD_H, at[1]]} rotation-y={seed * 0.7}>
      {[0, 1, 2].map((i) => (
        <Block key={i} size={[0.5, 0.035, 0.36]} at={[0, i * 0.04, 0]} rotationY={(i - 1) * 0.12} material={materials.white} radius={0.01} />
      ))}
    </group>
  );
}

/**
 * Retrieval, drawn literally: information nodes travel from each source to the
 * tower, and a band of light rises through its core as they arrive.
 */
function Retrieval() {
  const animate = useAmbientMotion();
  const nodes = useRef<THREE.InstancedMesh>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, toneMapped: false }), []);
  const lines = useMemo(
    () =>
      SOURCES.map((source) => {
        const end = edgeOfBox(source, [TOWER.x, TOWER.z], TOWER.size / 2 + 0.05);
        return { strip: groundStrip(source, end), route: new Route([[source[0], NODE_Y, source[1]], [end[0], NODE_Y, end[1]]]) };
      }),
    [],
  );
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 1.3;
    const mesh = nodes.current;
    if (mesh) {
      lines.forEach(({ route }, line) => {
        for (let n = 0; n < NODES_PER_SOURCE; n++) {
          const progress = (t / TRAVEL_SECONDS + n / NODES_PER_SOURCE + line * 0.23) % 1;
          route.at(progress, position);
          // Shrink into the tower as the node arrives.
          scale.setScalar(progress > 0.9 ? (1 - progress) * 10 : Math.min(1, progress * 12));
          mesh.setMatrixAt(line * NODES_PER_SOURCE + n, matrix.compose(position, rotation, scale));
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
    if (pulse.current) {
      const cycle = (t / 2.6) % 1;
      pulse.current.position.y = PAD_H + 0.3 + cycle * (TOWER.height - 0.6);
      pulseMaterial.opacity = 0.85 * Math.sin(Math.PI * cycle);
    }
  });

  return (
    <group>
      {SOURCES.map((source, i) => (
        <Source key={i} at={source} seed={i} />
      ))}
      {lines.map(({ strip }, i) => (
        <Block
          key={i}
          size={[strip.length, 0.02, 0.05]}
          at={[strip.centre[0], PAD_H, strip.centre[1]]}
          rotationY={strip.rotationY}
          material={materials.charcoal}
          radius={0.005}
          shadow={false}
        />
      ))}
      <instancedMesh ref={nodes} args={[sphere(0.075, 12), materials.charcoal, SOURCES.length * NODES_PER_SOURCE]} frustumCulled={false} />
      <mesh ref={pulse} material={pulseMaterial} position={[TOWER.x, PAD_H, TOWER.z]}>
        <boxGeometry args={[TOWER.size * 0.36, 0.08, TOWER.size * 0.36]} />
      </mesh>
    </group>
  );
}

/** Google: clean glass architecture for AI and information retrieval. */
export function GoogleDistrict() {
  return (
    <group>
      <GlassVolume size={[TOWER.size, TOWER.height, TOWER.size]} at={[TOWER.x, PAD_H, TOWER.z]} />
      <GlassVolume size={[2.4, 5.5, 2.4]} at={[2.4, PAD_H, -2.1]} />
      <GlassVolume size={[4.6, 3.1, 2.6]} at={[1.6, PAD_H, 1.7]} />
      <Block size={[1.4, 0.1, 0.9]} at={[-0.5, PAD_H + 2.35, 0.2]} rotationY={-0.6} material={materials.white} radius={0.03} />
      <Retrieval />
      <Trees items={[[-4.4, 3.5, 0.7, PAD_H], [4.4, 3.4, 0.7, PAD_H], [-1.2, 3.6, 0.6, PAD_H]]} />
    </group>
  );
}
