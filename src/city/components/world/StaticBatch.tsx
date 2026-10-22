import { useLayoutEffect, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { materials } from './materials';

const shared = new Set<THREE.Material>(Object.values(materials));

/** Mark a subtree that moves, or comes and goes, so it is never baked into a batch. */
export const DYNAMIC = { dynamic: true };

/** Meshes that can be merged: visible, not instanced, using one of the shared materials. */
function mergeable(object: THREE.Object3D): object is THREE.Mesh {
  const mesh = object as THREE.Mesh;
  return Boolean(mesh.isMesh) && !(mesh as THREE.InstancedMesh).isInstancedMesh && mesh.visible && shared.has(mesh.material as THREE.Material);
}

/** Geometries merge only with others that have the same attributes and indexing. */
const signature = (geometry: THREE.BufferGeometry) => `${Object.keys(geometry.attributes).sort().join(',')}|${geometry.index ? 'i' : 'n'}`;

/**
 * Merges the static meshes inside it into one mesh per material, turning
 * hundreds of draw calls into a few dozen. It runs once, on mount: anything
 * that moves or mounts later must sit outside it or under a group marked
 * with `userData={DYNAMIC}`, and is left as it is.
 */
export function StaticBatch({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null);
  const batch = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const group = root.current;
    const target = batch.current;
    if (!group || !target) return;
    group.updateWorldMatrix(true, true);
    const toLocal = new THREE.Matrix4().copy(group.matrixWorld).invert();

    const buckets = new Map<string, { material: THREE.Material; castShadow: boolean; geometries: THREE.BufferGeometry[]; sources: THREE.Mesh[] }>();

    const visit = (object: THREE.Object3D) => {
      if (object.userData.dynamic) return;
      if (mergeable(object)) {
        const geometry = object.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(toLocal, object.matrixWorld));
        const material = object.material as THREE.Material;
        const key = `${material.uuid}|${object.castShadow}|${signature(geometry)}`;
        const bucket = buckets.get(key) ?? { material, castShadow: object.castShadow, geometries: [], sources: [] };
        bucket.geometries.push(geometry);
        bucket.sources.push(object);
        buckets.set(key, bucket);
      }
      object.children.forEach(visit);
    };
    group.children.forEach(visit);

    const created: THREE.Mesh[] = [];
    const replaced: THREE.Mesh[] = [];
    buckets.forEach(({ material, castShadow, geometries, sources }) => {
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      // If these can't merge, leave the originals showing.
      if (!geometry) return;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      target.add(mesh);
      created.push(mesh);
      replaced.push(...sources);
    });
    replaced.forEach((mesh) => {
      mesh.visible = false;
    });

    return () => {
      created.forEach((mesh) => {
        target.remove(mesh);
        mesh.geometry.dispose();
      });
      replaced.forEach((mesh) => {
        mesh.visible = true;
      });
    };
  }, []);

  return (
    <>
      <group ref={root}>{children}</group>
      <group ref={batch} />
    </>
  );
}
