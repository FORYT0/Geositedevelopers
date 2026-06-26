'use client';
// Geosite DEVELOPERS — Scroll-driven camera controller
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interpolateCameraPath } from '@/src/lib/camera-path';
import { useStore } from '@/src/store';
import type { SceneConfig } from '@/src/lib/scene-config';

interface ScrollCameraControllerProps {
  sceneConfig: SceneConfig;
}

/**
 * ScrollCameraController — maps window scroll progress to camera position
 * along the scene's predefined keyframe path.
 *
 * - Listens to window scroll events
 * - Maps scroll progress [0, 1] via interpolateCameraPath
 * - Writes position/target to the R3F camera each frame
 * - Halts at path end and triggers end-of-tour UI prompt
 */
export function ScrollCameraController({ sceneConfig }: ScrollCameraControllerProps) {
  const { camera } = useThree();
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setEndOfTourVisible = useStore((s) => s.setEndOfTourVisible);
  const scrollProgress = useStore((s) => s.scrollProgress);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      setScrollProgress(progress);

      // Trigger end-of-tour prompt when reaching the end
      if (progress >= 1) {
        setEndOfTourVisible(true);
      } else {
        setEndOfTourVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, setEndOfTourVisible]);

  useFrame(() => {
    const { position, target } = interpolateCameraPath(
      sceneConfig.cameraPath,
      scrollProgress
    );

    targetPosition.current.set(position[0], position[1], position[2]);
    targetLookAt.current.set(target[0], target[1], target[2]);

    // Smoothly move camera toward target (lerp for smooth rendering)
    camera.position.lerp(targetPosition.current, 0.1);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
