import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCity } from '../../../state/cityStore';
import { WorldLabel } from '../Label';
import { materials } from '../materials';
import { Block, type Vec3 } from '../primitives';
import { DYNAMIC } from '../StaticBatch';

const LABEL_SECONDS = 5;

/** Every lab needs one. Hidden until someone types /dumpster. */
export function Dumpster({ at }: { at: Vec3 }) {
  const revealed = useCity((s) => s.dumpster);
  const group = useRef<THREE.Group>(null);
  const [labelled, setLabelled] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    setLabelled(true);
    const timer = window.setTimeout(() => setLabelled(false), LABEL_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  // Ease into existence rather than popping in.
  useFrame((_, delta) => {
    const current = group.current;
    if (!current || !revealed || current.scale.x >= 1) return;
    current.scale.setScalar(Math.min(1, current.scale.x + delta * 2.5));
  });

  if (!revealed) return null;
  return (
    <group position={at} userData={DYNAMIC}>
      <group ref={group} scale={0.001}>
        <Block size={[0.7, 0.4, 0.42]} material={materials.charcoal} radius={0.03} shadow={false} />
        <group position={[0, 0.4, -0.21]} rotation-x={-0.5}>
          <Block size={[0.72, 0.03, 0.44]} at={[0, 0, 0.22]} material={materials.accent} radius={0.01} shadow={false} />
        </group>
        <Block size={[0.12, 0.08, 0.12]} at={[0.1, 0.4, 0.02]} rotationY={0.4} material={materials.white} radius={0.02} shadow={false} />
      </group>
      {labelled && <WorldLabel position={[0, 0.8, 0]} name="Dumpster" lines={['where the first drafts go']} cta="every lab needs one" />}
    </group>
  );
}
