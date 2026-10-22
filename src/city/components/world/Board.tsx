import { ContactShadows } from '@react-three/drei';
import { BOARD_SIZE, streets, trees } from './layout';
import { materials } from './materials';
import { Block, Trees } from './primitives';

const TOP = 0.5;
const BASE = 1.6;

/** The model board: a cream top on a dark base, resting on a studio table. */
export function Board() {
  return (
    <group>
      <Block size={[BOARD_SIZE, TOP, BOARD_SIZE]} at={[0, -TOP, 0]} material={materials.board} radius={0.18} shadow={false} />
      <Block size={[BOARD_SIZE - 0.6, BASE, BOARD_SIZE - 0.6]} at={[0, -TOP - BASE, 0]} material={materials.boardBase} radius={0.12} shadow={false} />
      <ContactShadows position={[0, -TOP - BASE - 0.02, 0]} scale={BOARD_SIZE * 1.9} blur={2.8} far={8} opacity={0.4} color="#3b3129" frames={1} resolution={512} />
      <Streets />
      <Trees items={trees} />
    </group>
  );
}

function Streets() {
  return (
    <>
      {streets.map(({ from, to, width }, i) => {
        const horizontal = from[1] === to[1];
        const length = Math.abs(horizontal ? to[0] - from[0] : to[1] - from[1]);
        const size: [number, number, number] = horizontal ? [length, 0.03, width] : [width, 0.03, length];
        return (
          <Block
            key={i}
            size={size}
            at={[(from[0] + to[0]) / 2, 0, (from[1] + to[1]) / 2]}
            material={materials.path}
            radius={0.01}
            shadow={false}
          />
        );
      })}
    </>
  );
}
