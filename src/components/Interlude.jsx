import { Component, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { Shape } from 'three';

function StarCharm() {
  const star = useMemo(() => {
    const shape = new Shape();
    for (let point = 0; point < 10; point++) {
      const angle = Math.PI / 2 + point * Math.PI / 5;
      const radius = point % 2 === 0 ? 1 : 0.49;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (point === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  return (
    <group rotation={[0.08, -0.2, 0.1]}>
      <mesh position={[0, 0, -0.16]}>
        <extrudeGeometry args={[star, { depth: 0.32, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.12, bevelThickness: 0.12, curveSegments: 24 }]} />
        <meshPhysicalMaterial color="#e99fbb" roughness={0.22} metalness={0.15} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <group rotation={[0.85, 0.4, -0.35]}>
        <mesh>
          <torusGeometry args={[1.55, 0.035, 12, 100]} />
          <meshStandardMaterial color="#ce98ad" metalness={0.45} roughness={0.3} />
        </mesh>
        {Array.from({ length: 24 }, (_, index) => {
          const angle = index * Math.PI / 12;
          return (
            <mesh key={index} position={[1.55 * Math.cos(angle), 1.55 * Math.sin(angle), 0]}>
              <sphereGeometry args={[0.085, 16, 16]} />
              <meshPhysicalMaterial color="#fff1e4" roughness={0.2} metalness={0.1} clearcoat={1} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

class CanvasFallback extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="flex h-full items-center justify-center text-secondary">The 3D charm couldn’t load in this browser.</p> : this.props.children;
  }
}

export default function Interlude() {
  const reducedMotion = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const controls = useRef();
  const rotate = (direction) => {
    setSpinning(false);
    if (controls.current) controls.current.setAzimuthalAngle(controls.current.getAzimuthalAngle() + direction * Math.PI / 6);
  };
  const reset = () => {
    setSpinning(false);
    controls.current?.reset();
  };

  return (
    <section aria-label="Interactive 3D star charm" className="mx-auto max-w-3xl px-6 pt-10 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-accent">A little spark of curiosity</p>
      <div
        className="mx-auto h-[320px] sm:h-[380px] max-w-lg cursor-grab active:cursor-grabbing rounded-[40px] outline-offset-4"
        tabIndex={0}
        role="group"
        aria-label="3D pink star with a pearl ring. Drag to rotate, or use left and right arrow keys."
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            rotate(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
      >
        <CanvasFallback>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.5, 5.8], fov: 42 }} frameloop={spinning ? 'always' : 'demand'}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[3, 4, 4]} intensity={3} color="#fff0e5" />
            <directionalLight position={[-3, 1, 2]} intensity={2} color="#f1b6d1" />
            <directionalLight position={[0, 0, -4]} intensity={1.5} />
            <StarCharm />
            <OrbitControls ref={controls} enableZoom={false} enablePan={false} enableDamping dampingFactor={0.08} rotateSpeed={0.8} autoRotate={spinning} autoRotateSpeed={1} onStart={() => setSpinning(false)} />
          </Canvas>
        </CanvasFallback>
      </div>
      <p className="editorial-title text-3xl italic text-accent">Give it a little spin.</p>
      <p className="mt-2 text-sm text-secondary">Drag with your mouse or swipe across the charm.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" className="charm-control" onClick={() => rotate(-1)} aria-label="Rotate charm left">↶ Left</button>
        <button type="button" className="charm-control" onClick={() => rotate(1)} aria-label="Rotate charm right">Right ↷</button>
        {!reducedMotion && <button type="button" className="charm-control" aria-pressed={spinning} onClick={() => setSpinning(!spinning)}>{spinning ? 'Pause spin' : 'Auto spin'}</button>}
        <button type="button" className="charm-control" onClick={reset}>Reset view</button>
      </div>
    </section>
  );
}
