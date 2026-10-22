import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Fog, MathUtils, Matrix4, PerspectiveCamera, Spherical, Vector3 } from 'three';
import gsap from 'gsap';
import { districtById, type DistrictId } from '../../data/districts';
import { cityStore, useCity } from '../../state/cityStore';
import { cameraConfig, districtFrames, districtHeight } from './layout';

const TALL_ASPECT = 0.9;
const UP = new Vector3(0, 1, 0);

/** Where the camera rests: distance and angles around a target, plus how far visitors may drag. */
interface Shot {
  radius: number;
  polar: number;
  azimuth: number;
  target: Vector3;
  range: { polar: number; azimuth: number };
}

const lensFor = (aspect: number) => (aspect < TALL_ASPECT ? cameraConfig.framing.tall : cameraConfig.framing.wide);
const tanHalf = (fov: number) => Math.tan(MathUtils.degToRad(fov / 2));
const wrapAngle = (angle: number) => MathUtils.euclideanModulo(angle + Math.PI, Math.PI * 2) - Math.PI;

function overviewShot(aspect: number): Shot {
  const { fov, halfWidth, halfHeight } = lensFor(aspect);
  const tan = tanHalf(fov);
  return {
    radius: Math.max(halfWidth / (tan * aspect), halfHeight / tan),
    polar: cameraConfig.polar,
    azimuth: cameraConfig.azimuth,
    target: new Vector3(...cameraConfig.target),
    range: cameraConfig.orbitRange,
  };
}

/** Camera right and up vectors for a view from these angles. */
function cameraBasis(polar: number, azimuth: number) {
  const eye = new Vector3().setFromSphericalCoords(1, polar, azimuth);
  const rotation = new Matrix4().lookAt(eye, new Vector3(), UP);
  return { right: new Vector3().setFromMatrixColumn(rotation, 0), up: new Vector3().setFromMatrixColumn(rotation, 1) };
}

/**
 * Close-up of one district, framed in the part of the screen the info panel
 * leaves free: the left of wide screens, the top of tall ones.
 */
/**
 * Pushed in on a district, centred, on the way into its case study: the
 * building fills the frame before the page opens out of it.
 */
function pushInShot(id: DistrictId, aspect: number): Shot {
  const { position } = districtById[id];
  const frame = districtFrames[id];
  const tan = tanHalf(lensFor(aspect).fov);
  const radius = 0.55 * Math.max(frame.size / (tan * aspect), (frame.size * 0.9) / tan);
  return {
    radius,
    polar: (frame.polar ?? cameraConfig.district.polar) - 0.12,
    azimuth: (frame.azimuth ?? cameraConfig.azimuth) + 0.12,
    target: new Vector3(position[0], districtHeight(id) * 0.35, position[1]),
    range: cameraConfig.district.orbitRange,
  };
}

function districtShot(id: DistrictId, aspect: number): Shot {
  const { position } = districtById[id];
  const frame = districtFrames[id];
  const tall = aspect < TALL_ASPECT;
  const tan = tanHalf(lensFor(aspect).fov);
  const room = tall ? { width: 1, height: 0.55 } : { width: 0.6, height: 1 };
  const radius = Math.max(frame.size / (tan * aspect * room.width), (frame.size * 0.9) / (tan * room.height));
  const polar = frame.polar ?? cameraConfig.district.polar;
  const azimuth = frame.azimuth ?? cameraConfig.azimuth;

  const halfWidth = radius * tan * aspect;
  const halfHeight = radius * tan;
  const { right, up } = cameraBasis(polar, azimuth);
  const target = new Vector3(position[0], districtHeight(id) * 0.3, position[1])
    .addScaledVector(right, tall ? 0 : 0.4 * halfWidth)
    .addScaledVector(up, tall ? -0.45 * halfHeight : 0);

  return { radius, polar, azimuth, target, range: cameraConfig.district.orbitRange };
}

interface CameraRigProps {
  playIntro: boolean;
  /** Push in on the selected district, while its case study opens. */
  pushIn: boolean;
  reducedMotion: boolean;
  onIntroComplete: () => void;
  onInteract: () => void;
}

export function CameraRig({ playIntro, pushIn, reducedMotion, onIntroComplete, onInteract }: CameraRigProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const aspect = useThree((state) => state.size.width / state.size.height);
  const selected = useCity((state) => state.selected);
  const fov = lensFor(aspect).fov;

  const shot = useMemo(() => {
    if (!selected) return overviewShot(aspect);
    return pushIn ? pushInShot(selected, aspect) : districtShot(selected, aspect);
  }, [selected, pushIn, aspect]);
  // Which view is wanted, independent of screen shape: a change here means a flight.
  const view = `${selected ?? ''}|${selected && pushIn ? 'in' : ''}`;
  const [settled, setSettled] = useState(false);
  // The shot the camera last came to rest on. While it differs from `shot`, the camera is in flight.
  const [arrived, setArrived] = useState<Shot | null>(null);
  const flying = !settled || arrived !== shot;
  const flight = useRef<gsap.core.Tween | null>(null);
  const lastView = useRef(view);

  const spherical = useMemo(() => new Spherical(), []);
  const place = (radius: number, polar: number, azimuth: number, lookAt: Vector3) => {
    camera.position.setFromSpherical(spherical.set(radius, polar, azimuth)).add(lookAt);
    camera.lookAt(lookAt);
    if (controls.current) {
      controls.current.target.copy(lookAt);
      controls.current.update();
    }
    // Fog tracks the camera distance, so on a close-up the rest of the city softens into the background.
    if (scene.fog instanceof Fog) {
      scene.fog.near = radius + 8;
      scene.fog.far = radius * 2.4 + 30;
    }
    invalidate();
  };

  useLayoutEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, fov, invalidate]);

  // Opening shot: start low over the SX inlay, then rise and pull back to reveal the city.
  useLayoutEffect(() => {
    const end = shot;
    const finish = () => {
      setSettled(true);
      cityStore.setReady(true);
      onIntroComplete();
    };
    if (!playIntro) {
      place(end.radius, end.polar, end.azimuth, end.target);
      finish();
      return;
    }

    const { intro } = cameraConfig;
    const fromTarget = new Vector3(...intro.target);
    const lookAt = new Vector3();
    const progress = { value: 0 };
    place(intro.radius, intro.polar, intro.azimuth, fromTarget);

    const tween = gsap.to(progress, {
      value: 1,
      duration: intro.duration,
      delay: 0.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        const p = progress.value;
        lookAt.lerpVectors(fromTarget, end.target, p);
        // Interpolating the radius geometrically keeps the dolly speed feeling even.
        place(
          intro.radius * Math.pow(end.radius / intro.radius, p),
          MathUtils.lerp(intro.polar, end.polar, p),
          MathUtils.lerp(intro.azimuth, end.azimuth, p),
          lookAt,
        );
      },
      onComplete: finish,
    });
    return () => {
      tween.kill();
    };
    // The intro runs once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to a new shot when the wanted view changes; cut straight to it when only the viewport changed.
  useEffect(() => {
    const orbit = controls.current;
    if (!settled || !orbit) return;
    const viewChanged = lastView.current !== view;
    lastView.current = view;
    flight.current?.kill();

    if (!viewChanged || reducedMotion) {
      place(shot.radius, shot.polar, shot.azimuth, shot.target);
      setArrived(shot);
      return;
    }

    const from = new Spherical().setFromVector3(camera.position.clone().sub(orbit.target));
    const fromTarget = orbit.target.clone();
    const turn = wrapAngle(shot.azimuth - from.theta);
    const travel = fromTarget.distanceTo(shot.target);
    // Rise a little when crossing the city, so the move reads as a flight rather than a slide.
    const lift = Math.min(0.35, travel / 60);
    const lookAt = new Vector3();
    const progress = { value: 0 };

    flight.current = gsap.to(progress, {
      value: 1,
      duration: 1.2 + Math.min(0.6, travel / 60),
      ease: 'power3.inOut',
      onUpdate: () => {
        const p = progress.value;
        lookAt.lerpVectors(fromTarget, shot.target, p);
        place(
          from.radius * Math.pow(shot.radius / from.radius, p) * (1 + lift * Math.sin(Math.PI * p)),
          MathUtils.lerp(from.phi, shot.polar, p),
          from.theta + turn * p,
          lookAt,
        );
      },
      onComplete: () => setArrived(shot),
    });
    // `place` only touches refs and stable three.js objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shot, view, settled, reducedMotion]);

  useEffect(() => () => void flight.current?.kill(), []);

  const { range } = shot;
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={!flying}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.45}
      // Limits apply only at rest; during a flight they would clamp the camera mid-move.
      minPolarAngle={flying ? 0 : shot.polar - range.polar}
      maxPolarAngle={flying ? Math.PI : shot.polar + range.polar * 0.5}
      minAzimuthAngle={flying ? -Infinity : shot.azimuth - range.azimuth}
      maxAzimuthAngle={flying ? Infinity : shot.azimuth + range.azimuth}
      onStart={onInteract}
    />
  );
}
