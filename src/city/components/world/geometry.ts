import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Geometry is cached by shape so repeated blocks share one buffer.
const cache = new Map<string, THREE.BufferGeometry>();

function memo(key: string, make: () => THREE.BufferGeometry) {
  let geometry = cache.get(key);
  if (!geometry) {
    geometry = make();
    cache.set(key, geometry);
  }
  return geometry;
}

const key = (...values: number[]) => values.map((v) => v.toFixed(3)).join(',');

export function roundedBox(width: number, height: number, depth: number, radius: number) {
  const r = Math.min(radius, Math.min(width, height, depth) * 0.45);
  return memo(`box:${key(width, height, depth, r)}`, () => new RoundedBoxGeometry(width, height, depth, 2, r));
}

/** Cylinder whose base sits at y = 0. */
export function cylinder(radiusTop: number, radiusBottom: number, height: number, segments = 24) {
  return memo(`cyl:${key(radiusTop, radiusBottom, height, segments)}`, () => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
    geometry.translate(0, height / 2, 0);
    return geometry;
  });
}

/** Unit-height cylinder centred on the origin, scaled along y to span two points. */
export function rod(radius: number) {
  return memo(`rod:${key(radius)}`, () => new THREE.CylinderGeometry(radius, radius, 1, 8));
}

export function sphere(radius: number, segments = 16) {
  return memo(`sph:${key(radius, segments)}`, () => new THREE.SphereGeometry(radius, segments, Math.round(segments * 0.75)));
}

/** Pitched roof: ridge runs along x, spans z, base at y = 0. */
export function gable(length: number, span: number, rise: number) {
  return memo(`gable:${key(length, span, rise)}`, () => {
    const shape = new THREE.Shape();
    shape.moveTo(-span / 2, 0);
    shape.lineTo(span / 2, 0);
    shape.lineTo(0, rise);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    geometry.translate(0, 0, -length / 2);
    geometry.rotateY(Math.PI / 2);
    return geometry;
  });
}

/** Block with an arched passage through it along z, base at y = 0. */
export function archway(width: number, height: number, depth: number, openingWidth: number, springHeight: number) {
  return memo(`arch:${key(width, height, depth, openingWidth, springHeight)}`, () => {
    const half = openingWidth / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(-half, 0);
    shape.lineTo(-half, springHeight);
    shape.absarc(0, springHeight, half, Math.PI, 0, true);
    shape.lineTo(half, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  });
}

export const treeTrunk = () =>
  memo('tree:trunk', () => {
    const geometry = new THREE.CylinderGeometry(0.05, 0.07, 0.7, 6);
    geometry.translate(0, 0.35, 0);
    return geometry;
  });

export const treeCanopy = () =>
  memo('tree:canopy', () => {
    const geometry = new THREE.IcosahedronGeometry(0.55, 1);
    geometry.scale(1, 1.15, 1);
    geometry.translate(0, 1.15, 0);
    return geometry;
  });

/** Flat strip of the given width following points on the ground plane (y = 0). */
export function ribbon(name: string, points: [number, number][], width: number) {
  return memo(`ribbon:${name}:${key(width)}`, () => {
    const positions: number[] = [];
    const indices: number[] = [];
    points.forEach(([x, z], i) => {
      const [px, pz] = points[Math.max(0, i - 1)];
      const [nx, nz] = points[Math.min(points.length - 1, i + 1)];
      const length = Math.hypot(nx - px, nz - pz) || 1;
      // Offset each side along the normal to the direction of travel.
      const ox = (-(nz - pz) / length) * (width / 2);
      const oz = ((nx - px) / length) * (width / 2);
      positions.push(x + ox, 0, z + oz, x - ox, 0, z - oz);
      if (i > 0) {
        const a = (i - 1) * 2;
        // Wound so the strip faces up.
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  });
}
