import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '../../../data/palette';
import type { Project } from '../../../data/projects';
import { cylinder, roundedBox, sphere } from '../geometry';
import { materials } from '../materials';
import { useAmbientMotion } from '../motion';
import { Block, Rod, type Vec3 } from '../primitives';
import { DYNAMIC } from '../StaticBatch';

const TABLE = { w: 2.4, h: 0.35, d: 1.4 };
const NODE_Y = TABLE.h + 0.12;

/** A five-task pipeline: one source, two parallel tasks, a join, and a sink. */
const NODES: Vec3[] = [
  [-0.85, NODE_Y, 0],
  [-0.2, NODE_Y, -0.4],
  [-0.2, NODE_Y, 0.4],
  [0.45, NODE_Y, 0],
  [0.95, NODE_Y, 0],
];

/** Fractions of one run when each task is executing. Task 3 waits for both 1 and 2. */
const RUNNING: [number, number][] = [
  [0.0, 0.12],
  [0.3, 0.4],
  [0.3, 0.48],
  [0.62, 0.72],
  [0.84, 0.94],
];

/** Each edge carries its output once the upstream task finishes. */
const EDGES: { from: number; to: number; window: [number, number] }[] = [
  { from: 0, to: 1, window: [0.12, 0.3] },
  { from: 0, to: 2, window: [0.12, 0.3] },
  { from: 1, to: 3, window: [0.4, 0.55] },
  { from: 2, to: 3, window: [0.48, 0.62] },
  { from: 3, to: 4, window: [0.72, 0.84] },
];

const RUN_SECONDS = 6;
/** Moment shown when motion is reduced: the two parallel tasks running. */
const STILL = 0.35;

/** Data Pipeline Orchestrator: a tabletop DAG whose tasks run in dependency order. */
export function DagModel() {
  const animate = useAmbientMotion();
  const nodes = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const nodeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }), []);
  const running = useMemo(() => new THREE.Color(palette.accent), []);
  const idle = useMemo(() => new THREE.Color(palette.white), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Quaternion(), []);
  const from = useMemo(() => new THREE.Vector3(), []);
  const to = useMemo(() => new THREE.Vector3(), []);

  // Tasks never move, so place them once.
  useLayoutEffect(() => {
    const mesh = nodes.current;
    if (!mesh) return;
    NODES.forEach((node, i) => mesh.setMatrixAt(i, matrix.makeTranslation(...node)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrix]);

  useFrame(({ clock }) => {
    const t = animate ? (clock.elapsedTime / RUN_SECONDS) % 1 : STILL;
    const nodeMesh = nodes.current;
    const packetMesh = packets.current;
    if (!nodeMesh || !packetMesh) return;

    RUNNING.forEach(([start, end], i) => nodeMesh.setColorAt(i, t >= start && t < end ? running : idle));
    if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;

    EDGES.forEach(({ from: a, to: b, window: [start, end] }, i) => {
      const progress = (t - start) / (end - start);
      const visible = progress >= 0 && progress <= 1;
      from.set(...NODES[a]);
      to.set(...NODES[b]);
      position.lerpVectors(from, to, visible ? progress : 0);
      scale.setScalar(visible ? 1 : 0);
      packetMesh.setMatrixAt(i, matrix.compose(position, rotation, scale));
    });
    packetMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* A stone plinth with a dark display top, so the white graph reads clearly. */}
      <Block size={[TABLE.w, TABLE.h - 0.05, TABLE.d]} material={materials.stone} radius={0.05} />
      <Block size={[TABLE.w - 0.1, 0.05, TABLE.d - 0.1]} at={[0, TABLE.h - 0.05, 0]} material={materials.charcoal} radius={0.02} />
      {EDGES.map(({ from: a, to: b }) => (
        <Rod key={`${a}-${b}`} from={NODES[a]} to={NODES[b]} radius={0.018} material={materials.stone} />
      ))}
      <instancedMesh ref={nodes} args={[sphere(0.11), nodeMaterial, NODES.length]} castShadow frustumCulled={false} />
      <instancedMesh ref={packets} args={[roundedBox(0.08, 0.08, 0.08, 0.015), materials.white, EDGES.length]} frustumCulled={false} />
    </group>
  );
}

/** Pillora: a small polished prototype, a capsule turning inside a glass case. */
export function CapsuleModel() {
  const animate = useAmbientMotion();
  const capsule = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (animate && capsule.current) capsule.current.rotation.y += delta * 0.6;
  });
  const radius = 0.09;
  const half = 0.07;
  const hemisphere = useMemo(() => new THREE.SphereGeometry(radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), []);
  return (
    <group>
      <Block size={[0.7, 0.5, 0.7]} material={materials.white} radius={0.04} />
      <group ref={capsule} position={[0, 0.82, 0]} userData={DYNAMIC}>
        <group rotation-z={0.9}>
          {[
            { sign: 1, material: materials.accent },
            { sign: -1, material: materials.white },
          ].map(({ sign, material }) => (
            <group key={sign} rotation-x={sign < 0 ? Math.PI : 0}>
              <mesh geometry={cylinder(radius, radius, half, 16)} material={material} />
              <mesh geometry={hemisphere} material={material} position={[0, half, 0]} />
            </group>
          ))}
        </group>
      </group>
      <Block size={[0.62, 0.62, 0.62]} at={[0, 0.5, 0]} material={materials.glass} radius={0.03} shadow={false} />
      <Block size={[0.66, 0.04, 0.66]} at={[0, 1.12, 0]} material={materials.white} radius={0.01} />
    </group>
  );
}

const ghostMaterial = new THREE.LineBasicMaterial({ color: palette.charcoal, transparent: true, opacity: 0.45 });
const ghostGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.6, 0.6));

/** An empty plinth with the outline of whatever comes next. */
export function OpenSlot() {
  return (
    <group>
      <Block size={[0.8, 0.2, 0.8]} material={materials.stone} radius={0.03} />
      <lineSegments geometry={ghostGeometry} material={ghostMaterial} position={[0, 0.52, 0]} />
    </group>
  );
}

function DatabaseModel() {
  return (
    <group>
      <Block size={[0.8, 0.2, 0.8]} material={materials.stone} radius={0.03} />
      {[0, 1, 2].map((level) => (
        <mesh key={level} geometry={cylinder(0.32, 0.32, 0.2, 24)} material={level === 1 ? materials.accent : materials.white} position={[0, 0.32 + level * 0.25, 0]} castShadow />
      ))}
    </group>
  );
}

export const projectModels: Record<Project['model'], () => JSX.Element> = {
  dag: DagModel,
  capsule: CapsuleModel,
  database: DatabaseModel,
};

/** Pointer volume for each kind of model, as [width, height, depth]. */
export const projectHitSize: Record<Project['model'], Vec3> = {
  dag: [TABLE.w, 0.75, TABLE.d],
  capsule: [0.8, 1.2, 0.8],
  database: [0.8, 1.1, 0.8],
};
