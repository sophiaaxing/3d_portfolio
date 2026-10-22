import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { TimePhase } from '../../hooks/useTimeOfDay';
import { atmosphere, presets, type AtmospherePreset } from './atmosphere';
import { materials } from './materials';

const SHADOW_EXTENT = 30;
const BLEND_SECONDS = 1.6;

/** A preset with its colours parsed, so blends can interpolate them. */
interface Resolved extends Omit<AtmospherePreset, 'fog' | 'hemiSky' | 'hemiGround' | 'sun' | 'fill' | 'sunPosition'> {
  fog: THREE.Color;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  sun: THREE.Color;
  fill: THREE.Color;
  sunPosition: THREE.Vector3;
}

const resolve = (preset: AtmospherePreset): Resolved => ({
  ...preset,
  fog: new THREE.Color(preset.fog),
  hemiSky: new THREE.Color(preset.hemiSky),
  hemiGround: new THREE.Color(preset.hemiGround),
  sun: new THREE.Color(preset.sun),
  fill: new THREE.Color(preset.fill),
  sunPosition: new THREE.Vector3(...preset.sunPosition),
});

const NUMBERS = ['hemi', 'sunIntensity', 'fillIntensity', 'environment', 'windows', 'lamps', 'glass', 'night'] as const;
const COLOURS = ['fog', 'hemiSky', 'hemiGround', 'sun', 'fill'] as const;

function blend(out: Resolved, from: Resolved, to: Resolved, t: number) {
  NUMBERS.forEach((key) => {
    out[key] = THREE.MathUtils.lerp(from[key], to[key], t);
  });
  COLOURS.forEach((key) => out[key].copy(from[key]).lerp(to[key], t));
  out.sunPosition.lerpVectors(from.sunPosition, to.sunPosition, t);
}

function copyOf(values: Resolved): Resolved {
  const copy = resolve(presets.day);
  blend(copy, values, values, 0);
  return copy;
}

/**
 * Reflections from a few light panels, with no network fetch. Memoised because
 * drei re-applies its scene settings (resetting the environment strength that
 * the time of day controls) and re-renders the cube map whenever its children
 * change, which inline JSX does on every render.
 */
const StudioEnvironment = memo(function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <color attach="background" args={['#e9e2d7']} />
      <Lightformer form="rect" intensity={1.1} position={[0, 6, -6]} scale={[12, 4, 1]} />
      <Lightformer form="rect" intensity={0.6} position={[-7, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={0.4} color="#ffe6cc" position={[7, 2, 3]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
    </Environment>
  );
});

interface LightingProps {
  shadowMapSize: number;
  phase: TimePhase;
  /** Change time of day instantly instead of blending. */
  instant: boolean;
}

/**
 * Studio lighting that follows the time of day: a key light (the sun, or the
 * moon), a fill, a sky light, and a procedural environment for reflections.
 */
export function Lighting({ shadowMapSize, phase, instant }: LightingProps) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const sky = useRef<THREE.HemisphereLight>(null);
  const { gl, scene, invalidate } = useThree();
  // The values currently on screen; blends start from here, even mid-blend.
  const current = useMemo(() => resolve(presets[phase]), []); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (values: Resolved) => {
    if (sky.current) {
      sky.current.color.copy(values.hemiSky);
      sky.current.groundColor.copy(values.hemiGround);
      sky.current.intensity = values.hemi;
    }
    if (sun.current) {
      sun.current.color.copy(values.sun);
      sun.current.intensity = values.sunIntensity;
      sun.current.position.copy(values.sunPosition);
    }
    if (fill.current) {
      fill.current.color.copy(values.fill);
      fill.current.intensity = values.fillIntensity;
    }
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(values.fog);
    scene.environmentIntensity = values.environment;
    materials.window.emissiveIntensity = values.windows;
    materials.lamp.emissiveIntensity = values.lamps;
    materials.glass.emissiveIntensity = values.glass;
    atmosphere.night = values.night;
    // The sun may have moved, so shadows need drawing again.
    gl.shadowMap.needsUpdate = true;
    invalidate();
  };

  // Fit the shadow camera to the whole board; it defaults to a small 10×10 box.
  useLayoutEffect(() => {
    const light = sun.current;
    if (!light) return;
    const camera = light.shadow.camera;
    camera.left = -SHADOW_EXTENT;
    camera.right = SHADOW_EXTENT;
    camera.top = SHADOW_EXTENT;
    camera.bottom = -SHADOW_EXTENT;
    camera.near = 1;
    camera.far = 110;
    camera.updateProjectionMatrix();
    light.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    light.shadow.map?.dispose();
    light.shadow.map = null;
    light.shadow.needsUpdate = true;
    apply(current);
    // `apply` only touches refs and shared three.js objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shadowMapSize]);

  // Blend to a new time of day.
  useEffect(() => {
    const from = copyOf(current);
    const to = resolve(presets[phase]);
    if (instant) {
      blend(current, to, to, 1);
      apply(current);
      return;
    }
    const progress = { value: 0 };
    const tween = gsap.to(progress, {
      value: 1,
      duration: BLEND_SECONDS,
      ease: 'power2.inOut',
      onUpdate: () => {
        blend(current, from, to, progress.value);
        apply(current);
      },
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <>
      <hemisphereLight ref={sky} />
      <directionalLight ref={sun} castShadow shadow-bias={-0.0003} shadow-normalBias={0.03} shadow-radius={3} />
      <directionalLight ref={fill} position={[24, 14, 26]} />
      <StudioEnvironment />
    </>
  );
}
