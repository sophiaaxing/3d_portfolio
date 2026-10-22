import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { districtById, type District, type DistrictId } from '../../data/districts';
import { cityStore, useCity } from '../../state/cityStore';
import { WorldLabel } from './Label';
import { districtFrames } from './layout';
import { materials } from './materials';
import { Block, PAD_H, type Vec3 } from './primitives';
import { DYNAMIC } from './StaticBatch';

export const hitGeometry = new THREE.BoxGeometry(1, 1, 1);
/** Pointer travel, in pixels, beyond which a press counts as a drag, not a click. */
export const CLICK_TOLERANCE = 6;

/**
 * Invisible volumes that make a district hoverable and clickable. They stand
 * down while the district is open, so the objects inside it can be picked.
 */
export function DistrictHitArea({ district }: { district: District }) {
  const { id } = district;
  const open = useCity((s) => s.selected === id);
  if (open) return null;

  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    cityStore.hover(id);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta <= CLICK_TOLERANCE) cityStore.select(id);
  };
  return (
    <group onPointerOver={onOver} onPointerOut={() => cityStore.unhover(id)} onClick={onClick}>
      {districtFrames[id].hit.map(([x, z, w, d, h], i) => (
        <mesh key={i} geometry={hitGeometry} position={[x, h / 2, z]} scale={[w, h, d]} visible={false} />
      ))}
    </group>
  );
}

const MARK = { length: 1.2, width: 0.08, margin: 0.35 };

/** Corner crop marks around a district's footprint, shown while it is hovered or selected. */
export function DistrictMarks({ district }: { district: District }) {
  const active = useCity((s) => s.hovered === district.id || s.selected === district.id);
  if (!active) return null;
  const hx = district.padSize[0] / 2 + MARK.margin;
  const hz = district.padSize[1] / 2 + MARK.margin;
  const y = PAD_H + 0.005;
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return (
    <group userData={DYNAMIC}>
      {corners.map(([sx, sz]) => (
        <group key={`${sx}${sz}`}>
          <Block size={[MARK.length, 0.02, MARK.width]} at={[sx * (hx - MARK.length / 2), y, sz * hz]} material={materials.marker} radius={0.005} shadow={false} />
          <Block size={[MARK.width, 0.02, MARK.length]} at={[sx * hx, y, sz * (hz - MARK.length / 2)]} material={materials.marker} radius={0.005} shadow={false} />
        </group>
      ))}
    </group>
  );
}

/** The top of a district's tallest volume, where its label points. */
function labelAnchor(id: DistrictId): Vec3 {
  const { position } = districtById[id];
  const [bx, bz, , , height] = districtFrames[id].hit.reduce((tallest, box) => (box[4] > tallest[4] ? box : tallest));
  return [position[0] + bx, height + 0.3, position[1] + bz];
}

/** Label for the hovered district. */
export function HoverLabel() {
  const id = useCity((s) => (s.hovered && s.hovered !== s.selected ? s.hovered : null));
  if (!id) return null;
  const district = districtById[id];
  return (
    <WorldLabel
      key={id}
      position={labelAnchor(id)}
      name={district.name}
      lines={[district.year ? `${district.role} · ${district.year}` : district.role, district.tags]}
    />
  );
}
