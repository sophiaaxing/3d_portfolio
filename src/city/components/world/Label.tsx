import { useLayoutEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Vec3 } from './primitives';

/** Room, in pixels, the nav needs at the top of the screen. */
const NAV_CLEARANCE = 80;
const LEADER = 20;

type Placement = 'above' | 'right' | 'left';

interface WorldLabelProps {
  /** Point the label refers to, in the parent's coordinates. */
  position: Vec3;
  name: string;
  lines: string[];
  cta?: string;
}

/**
 * A small HTML label for something in the world. It sits above its anchor,
 * or beside it when a tall building leaves no room at the top of the screen.
 */
export function WorldLabel({ position, name, lines, cta = 'explore →' }: WorldLabelProps) {
  const anchor = useRef<THREE.Group>(null);
  const label = useRef<HTMLDivElement>(null);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const invalidate = useThree((state) => state.invalidate);

  // The label's size is known only once it is in the page, so render one more frame to place it.
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(frame);
  }, [invalidate]);

  useFrame(({ camera, size }) => {
    const element = label.current;
    if (!element || !element.offsetHeight || !anchor.current) return;
    anchor.current.getWorldPosition(projected).project(camera);
    const x = ((projected.x + 1) / 2) * size.width;
    const y = ((1 - projected.y) / 2) * size.height;
    let placement: Placement = 'above';
    if (y - element.offsetHeight - LEADER < NAV_CLEARANCE) {
      placement = x + LEADER + element.offsetWidth > size.width - 16 ? 'left' : 'right';
    }
    if (element.dataset.placement !== placement) element.dataset.placement = placement;
  });

  return (
    <group ref={anchor} position={position}>
      <Html zIndexRange={[2, 2]} style={{ pointerEvents: 'none' }}>
        <div ref={label} className="district-label" data-placement="above" role="presentation">
          <p className="district-label__name">{name}</p>
          {lines.map((line) => (
            <p key={line} className="district-label__meta">
              {line}
            </p>
          ))}
          <p className="district-label__cta">{cta}</p>
        </div>
      </Html>
    </group>
  );
}
