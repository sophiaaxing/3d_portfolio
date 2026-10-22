import { gable } from '../geometry';
import { Item } from '../Item';
import { materials } from '../materials';
import { Ball, Block, Cyl, PAD_H, Rod, Trees, type Vec3 } from '../primitives';

const Y = PAD_H;
const HOUSE = { x: -0.7, z: -0.3, w: 2.6, h: 1.4, d: 2.0 };
const FRONT = HOUSE.z + HOUSE.d / 2 + 0.01;
const PORCH_TOP = 0.08;

/** Photography: a camera on a tripod in the garden. */
function Camera() {
  const head = 0.62;
  return (
    <group>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <Rod key={angle} from={[0, head, 0]} to={[Math.sin(angle) * 0.2, 0, Math.cos(angle) * 0.2]} radius={0.012} />
      ))}
      <Block size={[0.26, 0.16, 0.14]} at={[0, head, 0]} rotationY={0.8} material={materials.charcoal} radius={0.02} />
      <mesh position={[0.09, head + 0.08, 0.09]} rotation={[Math.PI / 2, 0, -0.8]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#1f1d1b" roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Writing: an open notebook on the garden bench. */
function Notebook() {
  return (
    <group>
      <Block size={[0.9, 0.16, 0.28]} material={materials.wood} radius={0.03} />
      <group position={[0.1, 0.16, 0]} rotation-y={0.2}>
        <Block size={[0.14, 0.02, 0.2]} at={[-0.07, 0, 0]} material={materials.white} radius={0.005} />
        <Block size={[0.14, 0.02, 0.2]} at={[0.07, 0, 0]} material={materials.white} radius={0.005} />
        <Block size={[0.006, 0.024, 0.2]} material={materials.charcoal} radius={0.001} shadow={false} />
      </group>
    </group>
  );
}

/** Travel: a suitcase packed by the door. */
function Suitcase() {
  return (
    <group rotation-y={-0.3}>
      <Block size={[0.34, 0.26, 0.14]} material={materials.roof} radius={0.03} />
      <Block size={[0.12, 0.05, 0.02]} at={[0, 0.26, 0]} material={materials.charcoal} radius={0.008} />
    </group>
  );
}

/** Sports: a ping pong table in the garden. */
function PingPongTable() {
  const top = 0.3;
  const legs: [number, number][] = [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]];
  return (
    <group>
      {legs.map(([x, z]) => (
        <Block key={`${x}${z}`} size={[0.04, top, 0.04]} at={[x, 0, z]} material={materials.charcoal} radius={0.005} />
      ))}
      <Block size={[1.1, 0.04, 0.6]} at={[0, top, 0]} material={materials.charcoal} radius={0.01} />
      <Block size={[1.08, 0.005, 0.015]} at={[0, top + 0.04, 0]} material={materials.white} radius={0.001} shadow={false} />
      <Block size={[0.015, 0.08, 0.64]} at={[0, top + 0.04, 0]} material={materials.white} radius={0.002} />
      <Ball radius={0.025} at={[0.28, top + 0.12, 0.08]} material={materials.white} />
    </group>
  );
}

/** Making: the workbench inside the glass workshop. */
function Workshop() {
  return (
    <group>
      <Block size={[1.0, 0.4, 0.4]} at={[0, 0, -0.2]} material={materials.wood} radius={0.03} />
      <Block size={[0.22, 0.12, 0.16]} at={[-0.2, 0.4, -0.2]} material={materials.charcoal} radius={0.02} />
      <Block size={[0.14, 0.2, 0.14]} at={[0.22, 0.4, -0.25]} material={materials.accent} radius={0.02} />
      <Block size={[1.4, 1.1, 1.2]} material={materials.glass} radius={0.05} shadow={false} />
      <Block size={[1.48, 0.06, 1.28]} at={[0, 1.1, 0]} material={materials.white} radius={0.02} />
    </group>
  );
}

/** The house itself: warm, small, with the door left open to the garden. */
function House() {
  return (
    <group>
      <Block size={[HOUSE.w, HOUSE.h, HOUSE.d]} at={[HOUSE.x, Y, HOUSE.z]} material={materials.white} radius={0.05} />
      <mesh geometry={gable(HOUSE.w + 0.2, HOUSE.d + 0.3, 0.9)} material={materials.roof} position={[HOUSE.x, Y + HOUSE.h, HOUSE.z]} castShadow receiveShadow />
      <Block size={[0.26, 0.7, 0.26]} at={[HOUSE.x - 0.7, Y + HOUSE.h + 0.1, HOUSE.z - 0.4]} material={materials.stone} radius={0.03} />
      <Block size={[0.5, 0.45, 0.04]} at={[HOUSE.x - 0.75, Y + 0.55, FRONT]} material={materials.window} radius={0.01} shadow={false} />
      <Block size={[0.5, 0.45, 0.04]} at={[HOUSE.x + 0.75, Y + 0.55, FRONT]} material={materials.window} radius={0.01} shadow={false} />
      <Block size={[0.4, 0.8, 0.04]} at={[HOUSE.x, Y, FRONT]} material={materials.accent} radius={0.01} shadow={false} />
      <Block size={[0.04, 0.45, 0.6]} at={[HOUSE.x + HOUSE.w / 2 + 0.01, Y + 0.55, HOUSE.z]} material={materials.window} radius={0.01} shadow={false} />
      <Block size={[HOUSE.w, PORCH_TOP, 0.7]} at={[HOUSE.x, Y, FRONT + 0.35]} material={materials.wood} radius={0.02} />
    </group>
  );
}

const objects: { id: string; at: Vec3; hit: Vec3; model: () => JSX.Element }[] = [
  { id: 'camera', at: [-2.4, Y, 1.75], hit: [0.5, 0.85, 0.5], model: Camera },
  { id: 'notebook', at: [0.9, Y, 1.95], hit: [0.95, 0.35, 0.4], model: Notebook },
  { id: 'suitcase', at: [0.25, Y + PORCH_TOP, 1.05], hit: [0.45, 0.4, 0.35], model: Suitcase },
  { id: 'table', at: [2.05, Y, 1.1], hit: [1.2, 0.45, 0.7], model: PingPongTable },
  { id: 'workbench', at: [1.9, Y, -0.6], hit: [1.4, 1.15, 1.2], model: Workshop },
];

/** Sophia's studio: a small, warm house, with the things she does outside work around it. */
export function StudioDistrict() {
  return (
    <group>
      <House />
      {objects.map(({ id, at, hit, model: Model }) => (
        <Item key={id} id={id} at={at} hit={hit}>
          <Model />
        </Item>
      ))}
      <Cyl radius={0.03} height={1.1} at={[-0.05, Y, 1.95]} material={materials.charcoal} segments={8} />
      <Ball radius={0.08} at={[-0.05, Y + 1.14, 1.95]} material={materials.lamp} />
      <Trees items={[[-2.7, -1.4, 0.85, Y], [-2.9, 0.6, 0.7, Y], [3.0, 2.0, 0.7, Y]]} />
    </group>
  );
}
