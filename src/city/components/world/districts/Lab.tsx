import { projects } from '../../../data/projects';
import { Item } from '../Item';
import { materials } from '../materials';
import { Block, PAD_H, Rod, type Vec3 } from '../primitives';
import { Dumpster } from './Dumpster';
import { OpenSlot, projectHitSize, projectModels } from './LabProjects';

const Y = PAD_H;
const LEVEL = 1.0;
const BUILDING = { x: -2.2, z: 0.2, w: 3.2, d: 2.4 };

/** A building still going up: slabs, columns, and only some of its walls. */
function UnfinishedBuilding() {
  const { x, z, w, d } = BUILDING;
  const columnXs = [-w / 2 + 0.1, 0, w / 2 - 0.1];
  const columnZs = [-d / 2 + 0.1, d / 2 - 0.1];
  return (
    <group position={[x, Y, z]}>
      {[0, 1, 2].map((level) => (
        <group key={level}>
          <Block size={[w, 0.12, d]} at={[0, level * LEVEL, 0]} material={materials.white} radius={0.02} />
          {columnXs.flatMap((cx) =>
            columnZs.map((cz) => <Block key={`${cx}-${cz}`} size={[0.12, LEVEL, 0.12]} at={[cx, level * LEVEL, cz]} material={materials.white} radius={0.02} />),
          )}
        </group>
      ))}
      <Block size={[w / 2, 0.12, d]} at={[-w / 4, 3 * LEVEL, 0]} material={materials.white} radius={0.02} />
      {[0, 1].map((level) => (
        <group key={level}>
          <Block size={[w, LEVEL, 0.08]} at={[0, level * LEVEL, -d / 2 + 0.04]} material={materials.stone} radius={0.02} />
          <Block size={[0.08, LEVEL, d]} at={[-w / 2 + 0.04, level * LEVEL, 0]} material={materials.stone} radius={0.02} />
        </group>
      ))}
    </group>
  );
}

function Scaffolding() {
  const z = BUILDING.z + BUILDING.d / 2 + 0.3;
  const poles = [-1.6, -0.8, 0, 0.8, 1.6].map((dx) => BUILDING.x + dx);
  return (
    <group>
      {poles.map((x) => <Block key={x} size={[0.04, 3.2, 0.04]} at={[x, Y, z]} material={materials.metal} radius={0.01} />)}
      {[1, 2, 3].map((level) => (
        <group key={level}>
          <Block size={[3.3, 0.04, 0.04]} at={[BUILDING.x, Y + level * LEVEL, z + 0.14]} material={materials.metal} radius={0.01} />
          <Block size={[3.3, 0.03, 0.3]} at={[BUILDING.x, Y + level * LEVEL - 0.05, z]} material={materials.wood} radius={0.01} />
        </group>
      ))}
    </group>
  );
}

function Crane() {
  const base: Vec3 = [1.2, Y, -1.6];
  const top = Y + 5.4;
  const hookX = -2.4;
  return (
    <group>
      <Block size={[0.24, 5.4, 0.24]} at={base} material={materials.accent} radius={0.03} />
      <Block size={[5.6, 0.18, 0.22]} at={[-0.3, top, base[2]]} material={materials.accent} radius={0.03} />
      <Block size={[0.55, 0.38, 0.46]} at={[2.1, top - 0.38, base[2]]} material={materials.charcoal} radius={0.04} />
      <Block size={[0.42, 0.36, 0.42]} at={[1.2, top - 0.5, base[2] + 0.35]} material={materials.white} radius={0.04} />
      <Rod from={[hookX, top, base[2]]} to={[hookX, Y + 3.55, base[2]]} radius={0.012} />
      <Block size={[0.44, 0.3, 0.44]} at={[hookX, Y + 3.25, base[2]]} material={materials.wood} radius={0.03} />
    </group>
  );
}

/**
 * Where projects stand in the lab, in order. Projects from data/projects.ts
 * take these slots one by one; any slot left over holds an open plinth.
 */
const SLOTS: Vec3[] = [
  [2.9, Y, 1.4],
  [3.9, Y, -1.5],
  [0.35, Y, 2.1],
];

/** Project Lab: prototypes under construction, and the projects that came out of it. */
export function LabDistrict() {
  return (
    <group>
      <UnfinishedBuilding />
      <Scaffolding />
      <Crane />
      {SLOTS.map((slot, i) => {
        const project = projects[i];
        if (!project) {
          return (
            <group key={i} position={slot}>
              <OpenSlot />
            </group>
          );
        }
        const Model = projectModels[project.model];
        return (
          <Item key={project.id} id={project.id} at={slot} hit={projectHitSize[project.model]}>
            <Model />
          </Item>
        );
      })}
      <Dumpster at={[-4.35, Y, -2.25]} />
      <Block size={[0.5, 0.4, 0.5]} at={[-4.3, Y, 2.3]} material={materials.wood} radius={0.03} />
      <Block size={[0.4, 0.3, 0.4]} at={[-3.8, Y, 2.55]} material={materials.wood} radius={0.03} />
    </group>
  );
}
