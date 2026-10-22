import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../data/palette';
import type { TimePhase } from '../../hooks/useTimeOfDay';
import { CameraRig } from './CameraRig';
import { City } from './City';
import { cameraConfig } from './layout';
import { Lighting } from './Lighting';
import { AmbientMotion } from './motion';

interface WorldProps {
  isMobile: boolean;
  reducedMotion: boolean;
  /** Play the opening shot; skipped when arriving on a deep link. */
  playIntro: boolean;
  /** Push in on the selected district while its case study opens. */
  pushIn: boolean;
  /** Stop rendering while a page covers the world. */
  paused: boolean;
  timeOfDay: TimePhase;
  onLoaded: () => void;
  onIntroComplete: () => void;
  onInteract: () => void;
}

/** Fires once the scene has mounted. */
function Loaded({ onLoaded }: { onLoaded: () => void }) {
  useEffect(onLoaded, [onLoaded]);
  return null;
}

/**
 * Everything that casts a shadow is still, so the shadow map is drawn over the
 * first few frames and then reused, instead of being redrawn every frame.
 */
function BakedShadows() {
  const frames = useRef(0);
  useFrame(({ gl }) => {
    if (frames.current > 3) return;
    frames.current += 1;
    gl.shadowMap.needsUpdate = true;
  });
  return null;
}

export default function World({
  isMobile,
  reducedMotion,
  playIntro,
  pushIn,
  paused,
  timeOfDay,
  onLoaded,
  onIntroComplete,
  onInteract,
}: WorldProps) {
  // Pixel density adapts to the device: it steps down when frames drop, and back up when there's headroom.
  const maxDpr = Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, isMobile ? 1.5 : 2);
  const [dpr, setDpr] = useState(maxDpr);
  const animating = !paused && !reducedMotion;

  return (
    <Canvas
      shadows="percentage"
      // Ambient animation needs a frame every tick; without it, render only when something changes.
      frameloop={paused ? 'never' : reducedMotion ? 'demand' : 'always'}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      camera={{ fov: cameraConfig.framing.wide.fov, near: 1, far: 600, position: [60, 50, 60] }}
      onCreated={({ gl, scene }) => {
        gl.shadowMap.autoUpdate = false;
        // Development only: lets tooling read renderer stats.
        if (import.meta.env.DEV) Object.assign(window, { __city: { gl, scene } });
      }}
    >
      <AmbientMotion.Provider value={!reducedMotion}>
        <fog attach="fog" args={[palette.background, 110, 320]} />
        <Lighting shadowMapSize={isMobile ? 2048 : 4096} phase={timeOfDay} instant={reducedMotion} />
        <BakedShadows />
        {animating && (
          <PerformanceMonitor
            // drei's default only steps up above 60 fps, which a 60 Hz screen never reports.
            bounds={() => [50, 58]}
            onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
            onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
          />
        )}
        <City />
        <CameraRig
          playIntro={playIntro}
          pushIn={pushIn}
          reducedMotion={reducedMotion}
          onIntroComplete={onIntroComplete}
          onInteract={onInteract}
        />
        <Loaded onLoaded={onLoaded} />
      </AmbientMotion.Provider>
    </Canvas>
  );
}
