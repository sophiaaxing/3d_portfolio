import type { ReactNode } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { itemById } from '../../data/items';
import { cityStore, useCity } from '../../state/cityStore';
import { CLICK_TOLERANCE, hitGeometry } from './Interaction';
import { WorldLabel } from './Label';
import { materials } from './materials';
import type { Vec3 } from './primitives';
import { DYNAMIC } from './StaticBatch';

interface ItemProps {
  id: string;
  /** Base centre of the object, in district-local coordinates. */
  at: Vec3;
  /** Size of the invisible pointer volume: [width, height, depth]. */
  hit: Vec3;
  children: ReactNode;
}

/**
 * An object inside a district that opens on its own. It responds to the pointer
 * only while its district is selected, so from the overview a click still picks the district.
 */
export function Item({ id, at, hit, children }: ItemProps) {
  const item = itemById[id];
  const active = useCity((s) => s.selected === item.district);
  const hovered = useCity((s) => active && s.hoveredItem === id && s.item !== id);
  const open = useCity((s) => s.item === id);
  const ringRadius = Math.max(hit[0], hit[2]) * 0.62;

  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    cityStore.hoverItem(id);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta <= CLICK_TOLERANCE) cityStore.selectItem(id);
  };

  return (
    <group position={at}>
      {children}
      {open && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 0]} material={materials.marker} userData={DYNAMIC}>
          <ringGeometry args={[ringRadius, ringRadius + 0.05, 64]} />
        </mesh>
      )}
      {active && (
        <mesh
          geometry={hitGeometry}
          position={[0, hit[1] / 2, 0]}
          scale={hit}
          visible={false}
          onPointerOver={onOver}
          onPointerOut={() => cityStore.unhoverItem(id)}
          onClick={onClick}
        />
      )}
      {hovered && <WorldLabel position={[0, hit[1] + 0.15, 0]} name={item.name} lines={[item.kicker]} cta="open →" />}
    </group>
  );
}
