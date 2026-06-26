'use client';
// Geosite DEVELOPERS — Click interaction controller with raycasting
import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/src/store';
import type { InteractiveElement } from '@/src/lib/scene-config';

interface ClickInteractionControllerProps {
  elements: InteractiveElement[];
  sceneRef: React.RefObject<THREE.Group | null>;
}

/**
 * ClickInteractionController — detects clicks on interactive meshes via raycasting.
 *
 * - Uses Three.js Raycaster to detect clicks on interactive meshes
 * - Writes click state to store
 * - Ignores clicks on elements with isPlaying: true
 * - Shows hover affordance (cursor change + emissive highlight) on pointer-over
 */
export function ClickInteractionController({ elements, sceneRef }: ClickInteractionControllerProps) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const animationState = useStore((s) => s.animationState);
  const setAnimationElementState = useStore((s) => s.setAnimationElementState);

  const getMeshNames = useCallback(() => new Set(elements.map((e) => e.meshName)), [elements]);

  const findInteractiveMesh = useCallback(
    (intersects: THREE.Intersection[]): THREE.Mesh | null => {
      const meshNames = getMeshNames();
      for (const hit of intersects) {
        if (hit.object instanceof THREE.Mesh && meshNames.has(hit.object.name)) {
          return hit.object;
        }
      }
      return null;
    },
    [getMeshNames]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!sceneRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);
      const mesh = findInteractiveMesh(intersects);

      if (!mesh) return;

      const meshName = mesh.name;
      const currentState = animationState[meshName];

      // Ignore clicks while animation is playing
      if (currentState?.isPlaying) return;

      const element = elements.find((e) => e.meshName === meshName);
      if (!element) return;

      const direction = currentState?.direction === 'forward' && !currentState.isPlaying
        ? 'reverse'
        : 'forward';

      setAnimationElementState(meshName, {
        isPlaying: true,
        direction,
        clipName: direction === 'forward' ? element.animationClipName : (element.reverseClipName ?? element.animationClipName),
      });
    },
    [camera, gl, sceneRef, findInteractiveMesh, animationState, elements, setAnimationElementState]
  );

  const handlePointerOver = useCallback(
    (e: MouseEvent) => {
      if (!sceneRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);
      const mesh = findInteractiveMesh(intersects);

      if (mesh) {
        document.body.style.cursor = 'pointer';
        applyEmissiveHighlight(mesh);
      }
    },
    [camera, gl, sceneRef, findInteractiveMesh]
  );

  const handlePointerOut = useCallback(
    (e: MouseEvent) => {
      if (!sceneRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);
      const mesh = findInteractiveMesh(intersects);

      if (!mesh) {
        document.body.style.cursor = 'auto';
        // Restore all interactive meshes' emissive on pointer-out
        if (sceneRef.current) {
          sceneRef.current.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              removeEmissiveHighlight(obj);
            }
          });
        }
      }
    },
    [camera, gl, sceneRef, findInteractiveMesh]
  );

  useFrame(() => {
    const canvas = gl.domElement;
    if (!canvas.dataset.clickListeners) {
      canvas.dataset.clickListeners = 'true';
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('mousemove', handlePointerOver);
      canvas.addEventListener('mouseleave', handlePointerOut);
    }
  });

  return null;
}

/**
 * Apply a subtle emissive glow to a mesh on hover.
 * Only works on MeshStandardMaterial or MeshPhysicalMaterial.
 */
function applyEmissiveHighlight(mesh: THREE.Mesh): void {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (
    mat instanceof THREE.MeshStandardMaterial ||
    mat instanceof THREE.MeshPhysicalMaterial
  ) {
    mat.emissive.setHex(0x444444);
    mat.needsUpdate = true;
  }
}

/**
 * Remove the emissive highlight from a mesh (restore to black emissive).
 * Only works on MeshStandardMaterial or MeshPhysicalMaterial.
 */
function removeEmissiveHighlight(mesh: THREE.Mesh): void {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (
    mat instanceof THREE.MeshStandardMaterial ||
    mat instanceof THREE.MeshPhysicalMaterial
  ) {
    mat.emissive.setHex(0x000000);
    mat.needsUpdate = true;
  }
}
