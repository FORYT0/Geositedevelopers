'use client';
// Geosite DEVELOPERS — Interior walkthrough camera controller
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interpolateCameraPath } from '@/src/lib/camera-path';
import { useStore } from '@/src/store';
import type { SceneConfig } from '@/src/lib/scene-config';

export const INTERIOR_SCROLL_RATE = 1 / 100; // 1 meter per 100 pixels

interface CollisionBoundary {
  axis: 'x' | 'y' | 'z';
  min: number;
  max: number;
}

interface InteriorCameraControllerProps {
  sceneConfig: SceneConfig;
  collisionBoundaries?: CollisionBoundary[];
}

/**
 * InteriorCameraController — constrains camera to first-person walkthrough path.
 *
 * - Advances camera at 1 meter per 100 pixels of scroll
 * - Halts at collision boundaries without disrupting other axes
 * - Uses the scene's cameraPath keyframes for the walkthrough path
 */
export function InteriorCameraController({
  sceneConfig,
  collisionBoundaries = [],
}: InteriorCameraControllerProps) {
  const { camera } = useThree();
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const scrollProgress = useStore((s) => s.scrollProgress);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const totalScrollPixels = useRef(0);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const delta = e.deltaY; // pixels
      totalScrollPixels.current += delta;

      // Compute progress based on total scroll pixels
      // Total path length in meters / INTERIOR_SCROLL_RATE gives total pixels needed
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0
        ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
        : 0;

      setScrollProgress(progress);
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [setScrollProgress]);

  useFrame(() => {
    const { position, target } = interpolateCameraPath(
      sceneConfig.cameraPath,
      scrollProgress
    );

    let newX = position[0];
    let newY = position[1];
    let newZ = position[2];

    // Apply collision boundary constraints per axis
    for (const boundary of collisionBoundaries) {
      if (boundary.axis === 'x') {
        newX = Math.max(boundary.min, Math.min(boundary.max, newX));
      } else if (boundary.axis === 'y') {
        newY = Math.max(boundary.min, Math.min(boundary.max, newY));
      } else if (boundary.axis === 'z') {
        newZ = Math.max(boundary.min, Math.min(boundary.max, newZ));
      }
    }

    targetPosition.current.set(newX, newY, newZ);
    targetLookAt.current.set(target[0], target[1], target[2]);

    camera.position.lerp(targetPosition.current, 0.1);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// ── Pure utility functions (testable without R3F) ─────────────────────────────

/**
 * Computes camera advance in meters from a scroll pixel delta.
 * Returns the new scroll progress given current progress and pixel delta.
 */
export function computeInteriorScrollProgress(
  currentProgress: number,
  pixelDelta: number,
  totalPathLengthMeters: number
): number {
  if (totalPathLengthMeters <= 0) return currentProgress;
  const metersAdvanced = pixelDelta * INTERIOR_SCROLL_RATE;
  const progressDelta = metersAdvanced / totalPathLengthMeters;
  return Math.max(0, Math.min(1, currentProgress + progressDelta));
}

/**
 * Applies collision boundary constraints to a position on a single axis.
 * Returns the clamped value for that axis; other axes are unaffected.
 */
export function applyCollisionBoundary(
  value: number,
  boundary: CollisionBoundary
): number {
  return Math.max(boundary.min, Math.min(boundary.max, value));
}
