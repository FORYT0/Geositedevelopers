// Geosite DEVELOPERS — Preload next catalog scene when memory allows
'use client';
import { useEffect } from 'react';
import { useStore } from '@/src/store';

const MEMORY_THRESHOLD_MB = 256;

/**
 * Estimates available JS heap memory in MB.
 * Uses the non-standard `performance.memory` API when available (Chrome/Edge).
 * Returns Infinity when the API is unavailable (conservative: always allow preload).
 */
function getAvailableMemoryMB(): number {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const mem = (performance as Performance & { memory: { jsHeapSizeLimit: number; usedJSHeapSize: number } }).memory;
    const availableMB = (mem.jsHeapSizeLimit - mem.usedJSHeapSize) / (1024 * 1024);
    return availableMB;
  }
  return Infinity;
}

/**
 * usePreloadNext — preloads the next scene in the catalog sequence.
 *
 * Triggers preloading when:
 * - There is a next scene after the current one in the catalog
 * - Available memory exceeds 256 MB
 *
 * Uses useGLTF.preload (from @react-three/drei) to warm the asset cache.
 */
export function usePreloadNext(currentSceneId: string): void {
  const scenes = useStore((s) => s.scenes);

  useEffect(() => {
    if (!currentSceneId || scenes.length === 0) return;

    const currentIndex = scenes.findIndex((s) => s.id === currentSceneId);
    if (currentIndex === -1 || currentIndex >= scenes.length - 1) return;

    const nextScene = scenes[currentIndex + 1];
    if (!nextScene) return;

    const availableMB = getAvailableMemoryMB();
    if (availableMB < MEMORY_THRESHOLD_MB) {
      console.log(
        `[usePreloadNext] Skipping preload of "${nextScene.id}": available memory ${availableMB.toFixed(0)} MB < ${MEMORY_THRESHOLD_MB} MB threshold`
      );
      return;
    }

    // Dynamically import useGLTF to avoid issues outside R3F Canvas context
    import('@react-three/drei').then(({ useGLTF }) => {
      if (typeof useGLTF.preload === 'function') {
        useGLTF.preload(nextScene.modelPath);
        console.log(`[usePreloadNext] Preloading next scene: "${nextScene.id}" (${nextScene.modelPath})`);
      }
    }).catch((err) => {
      console.warn('[usePreloadNext] Failed to preload next scene:', err);
    });
  }, [currentSceneId, scenes]);
}
