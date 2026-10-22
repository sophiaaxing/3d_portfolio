import * as THREE from 'three';

/** A polyline that can be sampled by distance, for things that travel along routes. */
export class Route {
  readonly points: THREE.Vector3[];
  readonly length: number;
  private readonly cumulative: number[];

  constructor(points: [number, number, number][]) {
    this.points = points.map((p) => new THREE.Vector3(...p));
    this.cumulative = [0];
    for (let i = 1; i < this.points.length; i++) {
      this.cumulative.push(this.cumulative[i - 1] + this.points[i].distanceTo(this.points[i - 1]));
    }
    this.length = this.cumulative[this.cumulative.length - 1];
  }

  /** Position at fraction `t` (0–1) of the way along the route. */
  at(t: number, out: THREE.Vector3) {
    const distance = THREE.MathUtils.clamp(t, 0, 1) * this.length;
    let i = 1;
    while (i < this.cumulative.length - 1 && this.cumulative[i] < distance) i++;
    const span = this.cumulative[i] - this.cumulative[i - 1] || 1;
    return out.lerpVectors(this.points[i - 1], this.points[i], (distance - this.cumulative[i - 1]) / span);
  }
}

/** Where a line from `from` towards the centre of an axis-aligned box first meets the box, on the ground plane. */
export function edgeOfBox(from: [number, number], centre: [number, number], half: number): [number, number] {
  const dx = from[0] - centre[0];
  const dz = from[1] - centre[1];
  const scale = half / Math.max(Math.abs(dx), Math.abs(dz));
  return [centre[0] + dx * scale, centre[1] + dz * scale];
}

/** Flat strip lying on the ground between two points: its centre, length and rotation about y. */
export function groundStrip(from: [number, number], to: [number, number]) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  return {
    centre: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2] as [number, number],
    length: Math.hypot(dx, dz),
    rotationY: Math.atan2(-dz, dx),
  };
}

/** Points around a rounded rectangle centred on the origin, as a closed loop on the ground plane. */
export function roundedRectLoop(half: number, radius: number, segments = 8): [number, number][] {
  const inner = half - radius;
  const corners: [number, number, number][] = [
    [inner, inner, 0],
    [-inner, inner, Math.PI / 2],
    [-inner, -inner, Math.PI],
    [inner, -inner, (Math.PI * 3) / 2],
  ];
  const points: [number, number][] = [];
  corners.forEach(([cx, cz, start]) => {
    for (let i = 0; i <= segments; i++) {
      const angle = start + (i / segments) * (Math.PI / 2);
      points.push([cx + Math.cos(angle) * radius, cz + Math.sin(angle) * radius]);
    }
  });
  points.push(points[0]);
  return points;
}

/** Rotation about y that points a model built lengthwise along +x from `a` towards `b`. */
export const headingBetween = (a: THREE.Vector3, b: THREE.Vector3) => Math.atan2(-(b.z - a.z), b.x - a.x);
