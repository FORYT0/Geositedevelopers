'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/src/store';
import { loadFileChunked } from '@/src/lib/chunked-loader';
import type { AssetLoaderState } from '@/src/store';

const SUPPORTED_EXTENSIONS = ['.glb', '.gltf'] as const;

/**
 * Validates that a model path ends with .glb or .gltf.
 * Returns true if valid, false otherwise.
 */
export function isValidModelPath(path: string): boolean {
  const lower = path.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * useAssetLoader — fully manages model loading state for a given scene.
 *
 * **Lifecycle:**
 * 1. Format validation (.glb/.gltf only) → error if invalid
 * 2. Proxy model load → 'loading-proxy' state
 * 3. Full model load via chunked loader → 'loading-full' state with progress
 * 4. Ready → 'ready' state, ready for rendering
 * 5. Cleanup on unmount/sceneId change → abort pending requests, reset state
 *
 * **Error Handling:**
 * - Network errors, format errors, proxy/full load failures → 'error' state with message
 * - Errors abort all pending requests
 *
 * **Dependencies:**
 * - Must be called inside a client component
 * - Viewer/R3F canvas can call useGLTF separately to bind loaded model to scene
 *
 * @param sceneId - Unique scene identifier
 * @param modelPath - Path to full model (.glb or .gltf)
 * @returns Current AssetLoaderState for this scene
 */
export function useAssetLoader(sceneId: string, modelPath: string): AssetLoaderState {
  const setAssetState = useStore((s) => s.setAssetState);
  const assetState = useStore((s) => s.assetState[sceneId]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!sceneId || !modelPath) {
      return;
    }

    // Format validation
    if (!isValidModelPath(modelPath)) {
      setAssetState(sceneId, {
        status: 'error',
        progress: 0,
        errorMessage: `Unsupported model format. Only .glb and .gltf files are accepted. Got: "${modelPath}"`,
      });
      return;
    }

    // Create abort controller for this load cycle
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let isMounted = true;

    const loadModel = async () => {
      try {
        // Step 1: Load proxy (low-res placeholder)
        const proxyPath = modelPath.replace(/\.(glb|gltf)$/i, '.proxy.glb');
        setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });

        try {
          await fetch(proxyPath, { signal: abortController.signal });
          if (!isMounted) return;
          setAssetState(sceneId, { status: 'loading-proxy', progress: 0.5 });
        } catch (proxyErr) {
          if (abortController.signal.aborted) return;
          // Proxy is optional; warn but continue to full load
          console.warn(`[useAssetLoader] Proxy not found at "${proxyPath}", continuing to full load`);
        }

        if (!isMounted) return;

        // Step 2: Load full model with chunking
        setAssetState(sceneId, { status: 'loading-full', progress: 0 });

        await loadFileChunked(modelPath, (progress) => {
          if (!isMounted || abortController.signal.aborted) return;
          setAssetState(sceneId, {
            status: 'loading-full',
            progress: 0.5 + progress.progress * 0.5, // 50% for proxy, 50% for full
          });
        });

        if (!isMounted || abortController.signal.aborted) return;

        // Step 3: Mark ready
        setAssetState(sceneId, { status: 'ready', progress: 1 });
      } catch (err) {
        if (abortController.signal.aborted) return;
        if (!isMounted) return;

        const message = err instanceof Error ? err.message : String(err);
        setAssetState(sceneId, {
          status: 'error',
          progress: 0,
          errorMessage: `Failed to load model: ${message}`,
        });
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [sceneId, modelPath, setAssetState]);

  return assetState ?? { status: 'idle', progress: 0 };
}
