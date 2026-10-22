import { useMemo } from 'react';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { cylinder, rod, roundedBox, sphere, treeCanopy, treeTrunk } from './geometry';
import { materials } from './materials';

export type Vec3 = [number, number, number];

/** Height of every district's base; buildings stand on top of it. */
export const PAD_H = 0.12;

interface BlockProps {
  size: Vec3;
  /** Position of the block's base centre. */
  at?: Vec3;
  rotationY?: number;
  material: THREE.Material;
  radius?: number;
  shadow?: boolean;
}

/** Softly bevelled box anchored at its base, the basic unit of the model. */
export function Block({ size, at = [0, 0, 0], rotationY = 0, material, radius = 0.05, shadow = true }: BlockProps) {
  const [w, h, d] = size;
  return (
    <mesh
      geometry={roundedBox(w, h, d, radius)}
      material={material}
      position={[at[0], at[1] + h / 2, at[2]]}
      rotation-y={rotationY}
      castShadow={shadow}
      receiveShadow
    />
  );
}

interface CylProps {
  radius: number;
  height: number;
  at?: Vec3;
  material: THREE.Material;
  radiusBottom?: number;
  segments?: number;
}

export function Cyl({ radius, height, at = [0, 0, 0], material, radiusBottom, segments }: CylProps) {
  return (
    <mesh
      geometry={cylinder(radius, radiusBottom ?? radius, height, segments)}
      material={material}
      position={at}
      castShadow
      receiveShadow
    />
  );
}

export function Ball({ radius, at, material }: { radius: number; at: Vec3; material: THREE.Material }) {
  return <mesh geometry={sphere(radius)} material={material} position={at} castShadow />;
}

/** Thin cylinder between two points. */
export function Rod({ from, to, radius = 0.02, material = materials.charcoal }: { from: Vec3; to: Vec3; radius?: number; material?: THREE.Material }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    return {
      length: direction.length(),
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
    };
  }, [from, to]);
  return <mesh geometry={rod(radius)} material={material} position={position} quaternion={quaternion} scale={[1, length, 1]} castShadow />;
}

/** Raised base that defines a district's footprint. */
export function Pad({ size }: { size: [number, number] }) {
  return <Block size={[size[0], PAD_H, size[1]]} material={materials.pad} radius={0.05} shadow={false} />;
}

/** [x, z, scale, baseY] */
export type TreeSpec = [number, number, number?, number?];

/**
 * Instanced model trees: one draw call for trunks, one for canopies. Culling is
 * off because it would use one tree's bounds, hiding every tree when that one is off-screen.
 */
export function Trees({ items }: { items: TreeSpec[] }) {
  const placed = items.map(([x, z, scale = 1, y = 0]) => ({ position: [x, y, z] as Vec3, scale }));
  return (
    <>
      <Instances limit={placed.length} geometry={treeTrunk()} material={materials.trunk} castShadow receiveShadow frustumCulled={false}>
        {placed.map((tree, i) => (
          <Instance key={i} position={tree.position} scale={tree.scale} />
        ))}
      </Instances>
      <Instances limit={placed.length} geometry={treeCanopy()} material={materials.foliage} castShadow receiveShadow frustumCulled={false}>
        {placed.map((tree, i) => (
          <Instance key={i} position={tree.position} scale={tree.scale} />
        ))}
      </Instances>
    </>
  );
}
