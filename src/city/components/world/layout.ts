import type { DistrictId } from '../../data/districts';
import type { TreeSpec } from './primitives';

export const BOARD_SIZE = 46;
const EDGE = BOARD_SIZE / 2 - 1.5;

export interface Street {
  from: [number, number];
  to: [number, number];
  width: number;
}

export const streets: Street[] = [
  // Two boulevards cross at the plaza.
  { from: [-EDGE, 0], to: [EDGE, 0], width: 1.4 },
  { from: [0, -EDGE], to: [0, EDGE], width: 1.4 },
  // Short lanes from the boulevards into each district.
  { from: [-9, -0.7], to: [-9, -4.5], width: 0.7 },
  { from: [9, -0.7], to: [9, -4.5], width: 0.7 },
  { from: [-11, 0.7], to: [-11, 2.5], width: 0.7 },
  { from: [11.5, 0.7], to: [11.5, 2.5], width: 0.7 },
  { from: [0.7, 14.5], to: [5.5, 14.5], width: 0.7 },
  { from: [-0.7, 15.5], to: [-5.5, 15.5], width: 0.7 },
];

const laneCrossings = { x: [-11, -9, 9, 11.5], z: [14.5, 15.5] };
const clearOf = (value: number, lanes: number[]) => lanes.every((lane) => Math.abs(value - lane) > 0.9);

function boulevardTrees(): TreeSpec[] {
  const trees: TreeSpec[] = [];
  // Stop short of the edge, where the train runs.
  for (let d = 6.5; d <= EDGE - 1; d += 2.5) {
    for (const sign of [-1, 1]) {
      const along = d * sign;
      if (clearOf(along, laneCrossings.x)) trees.push([along, -1.3, 0.8], [along, 1.3, 0.8]);
      if (clearOf(along, laneCrossings.z)) trees.push([-1.3, along, 0.8], [1.3, along, 0.8]);
    }
  }
  return trees;
}

export const trees: TreeSpec[] = [
  ...boulevardTrees(),
  // Groves near the corners of the board.
  [-19, -18, 1.1], [-17.2, -19.6, 0.9], [-20.2, -15.8, 0.8], [-19.4, -9.5, 0.9], [-20.1, -7.2, 0.75],
  [18.6, -19, 1], [20.2, -16.8, 0.8], [16.8, -20.2, 0.9], [19.8, -9, 0.85],
  [-17.4, 15.2, 1], [-19, 17, 0.85], [-16, 18.4, 0.9], [-20.2, 20.2, 0.8],
  [19.4, 20, 1], [20.4, 17.6, 0.8], [17.6, 21, 0.85],
];

/** Camera framing. Angles are OrbitControls spherical angles in radians. */
export const cameraConfig = {
  target: [1.5, -1, 3.5] as [number, number, number],
  polar: 0.96,
  azimuth: 0.68,
  /**
   * How much of the board must stay in view, in world units from the target.
   * Wide screens frame the whole board; tall screens use a wider lens and frame
   * the districts, letting the edges of the board run off the sides.
   */
  framing: {
    wide: { fov: 26, halfWidth: 41, halfHeight: 22 },
    tall: { fov: 38, halfWidth: 25, halfHeight: 30 },
  },
  /** How far visitors may drag away from the resting view. */
  orbitRange: { polar: 0.28, azimuth: 0.5 },
  /** Close-up of a single district. */
  district: {
    polar: 0.9,
    orbitRange: { polar: 0.18, azimuth: 0.35 },
  },
  intro: {
    target: [0, 0, 0] as [number, number, number],
    radius: 8,
    polar: 0.5,
    azimuth: 0.2,
    duration: 2.6,
  },
};

/** [x, z, width, depth, height] in district-local units. */
export type HitBox = [number, number, number, number, number];

export interface DistrictFrame {
  /** Invisible volumes that catch the pointer: a low slab plus any towers. */
  hit: HitBox[];
  /** Half the extent, in world units, the close-up must keep in view. */
  size: number;
  azimuth?: number;
  polar?: number;
}

export const districtFrames: Record<DistrictId, DistrictFrame> = {
  google: { hit: [[0, 0, 10, 8, 3.2], [-1.9, -1.3, 3.4, 3.4, 10.3], [2.4, -2.1, 2.6, 2.6, 5.7]], size: 9.6, polar: 0.98 },
  nvidia: { hit: [[0, 0, 10, 8, 3], [-2.6, -2.8, 2.2, 2.2, 5.8]], size: 8.8 },
  aws: { hit: [[0, 0, 11, 7, 2.6]], size: 8.4 },
  rice: { hit: [[0, 0, 12, 8, 3.4]], size: 9.2 },
  lab: { hit: [[0, 0, 10, 6, 3.2]], size: 8.2 },
  studio: { hit: [[0, 0, 7, 5, 2.6]], size: 5.2, azimuth: 0.55 },
};

export const districtHeight = (id: DistrictId) => Math.max(...districtFrames[id].hit.map((box) => box[4]));
