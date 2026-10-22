import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sphere } from '../geometry';
import { materials } from '../materials';
import { useAmbientMotion } from '../motion';
import { Route } from '../paths';
import { Block, Cyl, PAD_H } from '../primitives';

const Y = PAD_H;
const POD = 1.3;
const HUB_X = -3.6;
const HUB_EDGE = HUB_X + 0.9;
const COLUMNS = [-0.6, 1.5, 3.6];
const ROWS = [-1.8, 1.8];
/** Columns inside the Kubernetes cluster. */
const CLUSTER_COLUMNS = [1, 2];

const pods = COLUMNS.flatMap((x, c) =>
  ROWS.map((z, r) => ({
    x,
    z,
    height: [1.2, 2.0, 0.9, 1.6, 2.4, 1.1][c * 2 + r],
    clustered: CLUSTER_COLUMNS.includes(c),
    // Marked as managed through infrastructure-as-code.
    iac: (c * 2 + r) % 3 === 0,
  })),
);

const PACKET_Y = Y + 0.09;
const PACKET_SPEED = 2.4;
const LAUNCH_INTERVAL = 0.7;
const CYCLE = LAUNCH_INTERVAL * pods.length;

/** Requests leaving the load balancer in turn for each resource. */
function Requests() {
  const animate = useAmbientMotion();
  const packets = useRef<THREE.InstancedMesh>(null);
  const routes = useMemo(
    () =>
      pods.map(({ x, z }) => {
        const edge = z - Math.sign(z) * (POD / 2);
        return new Route([[HUB_EDGE, PACKET_Y, 0], [x, PACKET_Y, 0], [x, PACKET_Y, edge]]);
      }),
    [],
  );
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    const mesh = packets.current;
    if (!mesh) return;
    const t = animate ? clock.elapsedTime : 2.2;
    routes.forEach((route, i) => {
      // Round robin: pod i receives a request every cycle, offset by its turn.
      const age = (((t - i * LAUNCH_INTERVAL) % CYCLE) + CYCLE) % CYCLE;
      const progress = (age * PACKET_SPEED) / route.length;
      route.at(progress, position);
      scale.setScalar(progress <= 1 ? Math.min(1, (1 - progress) * 12) : 0);
      mesh.setMatrixAt(i, matrix.compose(position, rotation, scale));
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={packets} args={[sphere(0.075, 12), materials.charcoal, pods.length]} frustumCulled={false} />;
}

/** Dashed boundary on the ground around the pods that belong to the cluster. */
function ClusterOutline() {
  const margin = POD / 2 + 0.4;
  const x0 = COLUMNS[CLUSTER_COLUMNS[0]] - margin;
  const x1 = COLUMNS[CLUSTER_COLUMNS[CLUSTER_COLUMNS.length - 1]] + margin;
  const z0 = ROWS[0] - margin;
  const z1 = ROWS[ROWS.length - 1] + margin;
  const dash = 0.28;
  const step = 0.5;
  const dashes: { at: [number, number]; alongX: boolean }[] = [];
  for (let x = x0; x <= x1 - dash; x += step) dashes.push({ at: [x + dash / 2, z0], alongX: true }, { at: [x + dash / 2, z1], alongX: true });
  for (let z = z0; z <= z1 - dash; z += step) dashes.push({ at: [x0, z + dash / 2], alongX: false }, { at: [x1, z + dash / 2], alongX: false });
  return (
    <group>
      {dashes.map(({ at, alongX }, i) => (
        <Block
          key={i}
          size={alongX ? [dash, 0.02, 0.04] : [0.04, 0.02, dash]}
          at={[at[0], Y, at[1]]}
          material={materials.charcoal}
          radius={0.005}
          shadow={false}
        />
      ))}
    </group>
  );
}

const CONTAINERS: [number, number][] = [[-0.3, -0.3], [0.05, -0.3], [-0.3, 0.05]];

/** AWS: a load balancer routing to resources, with part of them running in a Kubernetes cluster. */
export function AwsDistrict() {
  const spineLength = COLUMNS[COLUMNS.length - 1] - HUB_EDGE;
  return (
    <group>
      {/* Load balancer */}
      <Block size={[1.8, 1.5, 1.8]} at={[HUB_X, Y, 0]} material={materials.white} radius={0.08} />
      <Block size={[1.84, 0.16, 1.84]} at={[HUB_X, Y + 1.5, 0]} material={materials.charcoal} radius={0.03} />
      <Cyl radius={0.35} height={0.3} at={[HUB_X, Y + 1.66, 0]} material={materials.metal} segments={20} />

      {/* Routing: one spine, one branch per column of resources. */}
      <Block size={[spineLength, 0.03, 0.07]} at={[HUB_EDGE + spineLength / 2, Y, 0]} material={materials.charcoal} radius={0.01} shadow={false} />
      {COLUMNS.map((x) => (
        <group key={x}>
          <Block size={[0.07, 0.03, 2.3]} at={[x, Y, 0]} material={materials.charcoal} radius={0.01} shadow={false} />
          <Cyl radius={0.1} height={0.05} at={[x, Y, 0]} material={materials.charcoal} segments={16} />
        </group>
      ))}
      <Requests />
      <ClusterOutline />

      {pods.map(({ x, z, height, clustered, iac }, i) => (
        <group key={`${x}-${z}`}>
          <Block size={[POD, height, POD]} at={[x, Y, z]} material={i % 2 ? materials.stone : materials.white} radius={0.07} />
          {clustered &&
            CONTAINERS.map(([dx, dz]) => (
              <Block key={`${dx}${dz}`} size={[0.26, 0.2, 0.26]} at={[x + dx, Y + height, z + dz]} material={materials.stoneDark} radius={0.03} />
            ))}
          {iac && <Block size={[0.3, 0.04, 0.3]} at={[x + 0.33, Y + height, z + 0.33]} material={materials.accent} radius={0.01} shadow={false} />}
        </group>
      ))}
    </group>
  );
}
