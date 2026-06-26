'use client';
// Geosite DEVELOPERS — Exterior scene features
import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/src/store';
import type { SceneConfig } from '@/src/lib/scene-config';

export const DOUBLE_CLICK_TRANSITION_MS = 800;

interface ExteriorSceneProps {
  sceneConfig: SceneConfig;
}

/**
 * ExteriorScene — renders exterior-specific features:
 * - Sky environment map and ground plane shadow
 * - 360-degree orbit controls
 * - Double-click surface → 800 ms smooth camera transition to close-up
 * - Day/night lighting preset switching
 */
export function ExteriorScene({ sceneConfig }: ExteriorSceneProps) {
  const { camera, gl } = useThree();
  const activeLightingPreset = useStore((s) => s.activeLightingPreset);
  const preset = sceneConfig.lightingPresets.find((p) => p.id === activeLightingPreset)
    ?? sceneConfig.lightingPresets[0];

  const transitionTarget = useRef<THREE.Vector3 | null>(null);
  const transitionStart = useRef<number | null>(null);
  const transitionStartPos = useRef(new THREE.Vector3());

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Move camera to a close-up position near the clicked point
      const ray = raycaster.ray;
      const closeUpPos = ray.origin.clone().add(ray.direction.clone().multiplyScalar(3));
      transitionTarget.current = closeUpPos;
      transitionStart.current = performance.now();
      transitionStartPos.current.copy(camera.position);
    },
    [camera, gl]
  );

  useFrame(() => {
    // Handle double-click camera transition
    if (transitionTarget.current && transitionStart.current !== null) {
      const elapsed = performance.now() - transitionStart.current;
      const t = Math.min(1, elapsed / DOUBLE_CLICK_TRANSITION_MS);
      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut

      camera.position.lerpVectors(transitionStartPos.current, transitionTarget.current, easedT);

      if (t >= 1) {
        transitionTarget.current = null;
        transitionStart.current = null;
      }
    }
  });

  // Register double-click listener
  useFrame(({ gl }) => {
    const canvas = gl.domElement;
    if (!canvas.dataset.exteriorListeners) {
      canvas.dataset.exteriorListeners = 'true';
      canvas.addEventListener('dblclick', handleDoubleClick);
    }
  });

  return (
    <>
      {/* Sky environment */}
      {preset.envMapPath ? (
        <Environment files={preset.envMapPath} background />
      ) : (
        <Sky sunPosition={[100, 20, 100]} />
      )}

      {/* Ground plane with shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {/* 360-degree orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={100}
      />
    </>
  );
}

// ── Pure utility: smooth camera transition ────────────────────────────────────

/**
 * Computes the camera position at a given elapsed time during an 800 ms transition.
 */
export function computeCameraTransitionPosition(
  startPos: [number, number, number],
  targetPos: [number, number, number],
  elapsedMs: number,
  durationMs = DOUBLE_CLICK_TRANSITION_MS
): [number, number, number] {
  const t = Math.min(1, elapsedMs / durationMs);
  const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  return [
    startPos[0] + (targetPos[0] - startPos[0]) * easedT,
    startPos[1] + (targetPos[1] - startPos[1]) * easedT,
    startPos[2] + (targetPos[2] - startPos[2]) * easedT,
  ];
}
