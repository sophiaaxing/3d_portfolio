import { archway, gable, ribbon } from '../geometry';
import { materials } from '../materials';
import { Ball, Block, Cyl, PAD_H, Trees } from '../primitives';

const Y = PAD_H;
const RANGE_H = 1.5;

function Roof({ at, length, span, rise, alongZ = false }: { at: [number, number, number]; length: number; span: number; rise: number; alongZ?: boolean }) {
  return <mesh geometry={gable(length, span, rise)} material={materials.roof} position={at} rotation-y={alongZ ? Math.PI / 2 : 0} castShadow receiveShadow />;
}

/** Golden spiral, r = a·φ^(2θ/π), sampled out to the given radius. */
function goldenSpiral(maxRadius: number, turns: number): [number, number][] {
  const growth = Math.log((1 + Math.sqrt(5)) / 2) / (Math.PI / 2);
  const end = turns * Math.PI * 2;
  const a = maxRadius / Math.exp(growth * end);
  const points: [number, number][] = [];
  for (let theta = 0; theta <= end; theta += 0.04) {
    const r = a * Math.exp(growth * theta);
    points.push([Math.cos(theta) * r, Math.sin(theta) * r]);
  }
  return points;
}

const spiral = ribbon('golden-spiral', goldenSpiral(1.25, 2), 0.035);

/** Rows of windows along a wall: pale by day, lit at night. `along` is the axis the wall runs on. */
function Windows({ from, to, fixed, along, y }: { from: number; to: number; fixed: number; along: 'x' | 'z'; y: number }) {
  const count = Math.floor((to - from) / 0.55);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const p = from + 0.3 + i * 0.55;
        return (
          <Block
            key={i}
            size={along === 'x' ? [0.22, 0.34, 0.03] : [0.03, 0.34, 0.22]}
            at={along === 'x' ? [p, y, fixed] : [fixed, y, p]}
            material={materials.window}
            radius={0.01}
            shadow={false}
          />
        );
      })}
    </>
  );
}

function Lamp({ x, z }: { x: number; z: number }) {
  return (
    <group>
      <Cyl radius={0.025} height={0.85} at={[x, Y, z]} material={materials.charcoal} segments={8} />
      <Ball radius={0.07} at={[x, Y + 0.9, z]} material={materials.lamp} />
    </group>
  );
}

/** Rice: a quiet brick quad with an arched gate and a small mathematical sculpture. */
export function RiceDistrict() {
  const arcadeColumns = [-4.2, -3.5, -2.8, -2.1, -1.5, 1.5, 2.1, 2.8, 3.5, 4.2];
  return (
    <group>
      {/* Back range with a central archway */}
      {[-2.9, 2.9].map((x) => (
        <group key={x}>
          <Block size={[3.2, RANGE_H, 1.7]} at={[x, Y, -2.9]} material={materials.brick} radius={0.04} />
          <Roof at={[x, Y + RANGE_H, -2.9]} length={3.3} span={1.9} rise={0.55} />
        </group>
      ))}
      <mesh geometry={archway(2.6, 2.5, 2.1, 1.0, 1.1)} material={materials.brick} position={[0, Y, -2.9]} castShadow receiveShadow />
      <Roof at={[0, Y + 2.5, -2.9]} length={2.3} span={2.8} rise={0.85} alongZ />

      {/* Windows on the courtyard side of the back range, and the outer faces of the side ranges. */}
      <Windows from={-4.5} to={-1.4} fixed={-2.04} along="x" y={Y + 0.55} />
      <Windows from={1.4} to={4.5} fixed={-2.04} along="x" y={Y + 0.55} />
      <Windows from={-1.9} to={3.1} fixed={-2.84} along="z" y={Y + 0.55} />
      <Windows from={-1.95} to={1.3} fixed={4.56} along="z" y={Y + 0.4} />

      {/* Side ranges */}
      <Block size={[1.7, RANGE_H, 5.2]} at={[-3.7, Y, 0.55]} material={materials.brick} radius={0.04} />
      <Roof at={[-3.7, Y + RANGE_H, 0.55]} length={5.3} span={1.9} rise={0.55} alongZ />
      <Block size={[1.7, 1.2, 3.4]} at={[3.7, Y, -0.35]} material={materials.brick} radius={0.04} />
      <Roof at={[3.7, Y + 1.2, -0.35]} length={3.5} span={1.9} rise={0.5} alongZ />

      {/* Arcade along the back range */}
      {arcadeColumns.map((x) => (
        <Block key={x} size={[0.1, 1.05, 0.1]} at={[x, Y, -1.8]} material={materials.white} radius={0.02} />
      ))}
      {[-2.85, 2.85].map((x) => (
        <Block key={x} size={[3.1, 0.08, 0.5]} at={[x, Y + 1.05, -1.85]} material={materials.white} radius={0.02} />
      ))}

      {/* Courtyard */}
      <Block size={[0.5, 0.02, 5.2]} at={[0, Y, 1.2]} material={materials.paving} radius={0.005} shadow={false} />
      <Block size={[5.6, 0.02, 0.5]} at={[0, Y, 0.9]} material={materials.paving} radius={0.005} shadow={false} />
      <Block size={[0.5, 0.4, 0.5]} at={[0, Y, 0.9]} material={materials.stone} radius={0.04} />
      <mesh position={[0, Y + 0.95, 0.9]} rotation={[0.4, 0.3, 0]} material={materials.bronze} castShadow>
        <torusKnotGeometry args={[0.26, 0.07, 96, 12, 2, 3]} />
      </mesh>
      {/* A golden spiral inlaid in the paving around the sculpture. */}
      <mesh geometry={spiral} material={materials.bronze} position={[0, Y + 0.025, 0.9]} rotation-y={0.6} receiveShadow />

      {/* Entrance: hedges, lamps, and a pair of benches facing the sculpture. */}
      {[-1.65, 1.65].map((x) => (
        <Block key={x} size={[2.0, 0.3, 0.34]} at={[x, Y, 3.62]} material={materials.foliage} radius={0.1} />
      ))}
      <Lamp x={-0.5} z={3.75} />
      <Lamp x={0.5} z={3.75} />
      {[-1.05, 1.05].map((x) => (
        <Block key={x} size={[0.34, 0.14, 0.8]} at={[x, Y, 2.35]} material={materials.stone} radius={0.03} />
      ))}
      <Trees
        items={[
          [-1.4, -0.4, 0.7, Y], [1.4, -0.4, 0.7, Y], [-1.4, 2.2, 0.7, Y], [1.4, 2.2, 0.7, Y],
          [4.6, 2.6, 0.9, Y],
        ]}
      />
    </group>
  );
}
