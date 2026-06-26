'use client';
// Geosite DEVELOPERS — Drag rotation controller (mouse + touch) + pinch-to-zoom FOV
import { useRef, useCallback, RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/src/store';

export const ROTATION_SENSITIVITY = 0.3; // degrees per pixel
export const VERTICAL_CLAMP_DEG = 45;
export const EASE_OUT_DURATION_MS = 600;
export const FOV_MIN = 30;
export const FOV_MAX = 90;
export const FOV_DEFAULT = 60;
export const FOV_SENSITIVITY = 0.05; // FOV degrees per pixel of pinch distance change

/**
 * Clamps a FOV value to the allowed range [30°, 90°].
 * Returns FOV_DEFAULT (60) for non-finite or NaN inputs.
 */
export function clampFov(fov: number): number {
  if (!isFinite(fov) || isNaN(fov)) return FOV_DEFAULT;
  return Math.min(FOV_MAX, Math.max(FOV_MIN, fov));
}

interface DragRotationControllerProps {
  targetRef: RefObject<THREE.Group | null>;
}

/**
 * DragRotationController — maps pointer drag gestures to model rotation.
 *
 * - Horizontal drag → Y-axis rotation (proportional to delta)
 * - Vertical drag → X-axis rotation (clamped to ±45°)
 * - On drag end → 600 ms ease-out return to default orientation
 * - Supports both mouse and touch via pointer events
 */
export function DragRotationController({ targetRef }: DragRotationControllerProps) {
  const setDragState = useStore((s) => s.setDragState);
  const dragState = useStore((s) => s.dragState);

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const currentRotX = useRef(0);
  const currentRotY = useRef(0);
  const returnStartTime = useRef<number | null>(null);
  const returnStartRotX = useRef(0);
  const returnStartRotY = useRef(0);
  const isReturning = useRef(false);

  // Pinch-to-zoom state
  const lastPinchDistance = useRef<number | null>(null);
  const currentFov = useRef(FOV_DEFAULT);

  const { camera } = useThree();

  const onPointerDown = useCallback((e: PointerEvent) => {
    isDragging.current = true;
    isReturning.current = false;
    returnStartTime.current = null;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setDragState({ isDragging: true, rotationX: currentRotX.current, rotationY: currentRotY.current });
  }, [setDragState]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    currentRotY.current += dx * ROTATION_SENSITIVITY;
    currentRotX.current = Math.max(
      -VERTICAL_CLAMP_DEG,
      Math.min(VERTICAL_CLAMP_DEG, currentRotX.current + dy * ROTATION_SENSITIVITY)
    );

    setDragState({
      isDragging: true,
      rotationX: currentRotX.current,
      rotationY: currentRotY.current,
    });
  }, [setDragState]);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    isReturning.current = true;
    returnStartTime.current = performance.now();
    returnStartRotX.current = currentRotX.current;
    returnStartRotY.current = currentRotY.current;
    setDragState({ isDragging: false, rotationX: currentRotX.current, rotationY: currentRotY.current });
  }, [setDragState]);

  // Pinch-to-zoom touch handlers
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2 || lastPinchDistance.current === null) return;

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDistance = Math.sqrt(dx * dx + dy * dy);
    const delta = newDistance - lastPinchDistance.current;
    lastPinchDistance.current = newDistance;

    // Spreading fingers (positive delta) → zoom in → decrease FOV
    // Pinching fingers (negative delta) → zoom out → increase FOV
    const newFov = clampFov(currentFov.current - delta * FOV_SENSITIVITY);
    currentFov.current = newFov;

    if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
      (camera as THREE.PerspectiveCamera).fov = newFov;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      lastPinchDistance.current = null;
    }
  }, []);

  // Register pointer events on the canvas element
  useFrame(({ gl }) => {
    const canvas = gl.domElement;
    // Attach listeners once (idempotent via data attribute)
    if (!canvas.dataset.dragListeners) {
      canvas.dataset.dragListeners = 'true';
      canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('touchstart', onTouchStart, { passive: true });
      canvas.addEventListener('touchmove', onTouchMove, { passive: true });
      canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    // Apply rotation to target object
    if (!targetRef.current) return;

    if (isReturning.current && returnStartTime.current !== null) {
      const elapsed = performance.now() - returnStartTime.current;
      const t = Math.min(1, elapsed / EASE_OUT_DURATION_MS);
      // Ease-out: t * (2 - t)
      const easedT = t * (2 - t);

      currentRotX.current = returnStartRotX.current * (1 - easedT);
      currentRotY.current = returnStartRotY.current * (1 - easedT);

      if (t >= 1) {
        isReturning.current = false;
        currentRotX.current = 0;
        currentRotY.current = 0;
        setDragState({ isDragging: false, rotationX: 0, rotationY: 0 });
      }
    }

    targetRef.current.rotation.x = THREE.MathUtils.degToRad(currentRotX.current);
    targetRef.current.rotation.y = THREE.MathUtils.degToRad(currentRotY.current);
  });

  return null;
}

// ── Pure utility functions (testable without R3F) ─────────────────────────────

/**
 * Computes the new Y rotation given a horizontal drag delta.
 */
export function computeYRotation(currentRotY: number, dx: number, sensitivity = ROTATION_SENSITIVITY): number {
  return currentRotY + dx * sensitivity;
}

/**
 * Computes the new X rotation given a vertical drag delta, clamped to ±45°.
 */
export function computeXRotation(currentRotX: number, dy: number, sensitivity = ROTATION_SENSITIVITY): number {
  return Math.max(-VERTICAL_CLAMP_DEG, Math.min(VERTICAL_CLAMP_DEG, currentRotX + dy * sensitivity));
}
