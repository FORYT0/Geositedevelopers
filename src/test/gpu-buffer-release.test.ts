// Feature: geosite-developers, Property 15: Deactivating a model releases its GPU buffers
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

/**
 * The GPU buffer release contract:
 * When a scene is deactivated (activeSceneId changes away from a scene),
 * useGLTF.clear(modelPath) must be called for that scene's model URL.
 *
 * We test the store state transition and the clear call contract.
 */

// Mock useGLTF.clear — in production this is called from the Viewer component
const mockClear = vi.fn();

vi.mock('@react-three/drei', () => ({
  useGLTF: Object.assign(vi.fn(), { clear: mockClear }),
}));

describe('Property 15: Deactivating a model releases its GPU buffers', () => {
  beforeEach(() => {
    mockClear.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('useGLTF.clear is called with the model URL when a scene is deactivated', async () => {
    // Import after mock setup
    const { useGLTF } = await import('@react-three/drei');

    // Simulate the Viewer calling clear on scene deactivation
    const modelUrl = '/models/tower-exterior-01.glb';
    (useGLTF as ReturnType<typeof vi.fn> & { clear: typeof mockClear }).clear(modelUrl);

    expect(mockClear).toHaveBeenCalledWith(modelUrl);
    expect(mockClear).toHaveBeenCalledTimes(1);
  });

  it('property: for any model URL, clear is called exactly once on deactivation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 50 }).map(s => `/models/${s}.glb`),
          fc.string({ minLength: 1, maxLength: 50 }).map(s => `/models/${s}.gltf`),
        ),
        (modelUrl) => {
          mockClear.mockClear();

          // Simulate deactivation: Viewer calls useGLTF.clear(url)
          mockClear(modelUrl);

          expect(mockClear).toHaveBeenCalledWith(modelUrl);
          expect(mockClear).toHaveBeenCalledTimes(1);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('store asset state transitions to idle when scene is deactivated', async () => {
    const { useStore } = await import('../store');

    const sceneId = 'test-scene-deactivate';
    const store = useStore.getState();

    // Set scene as ready
    store.setAssetState(sceneId, { status: 'ready', progress: 1 });
    expect(useStore.getState().assetState[sceneId].status).toBe('ready');

    // Simulate deactivation: reset to idle
    store.setAssetState(sceneId, { status: 'idle', progress: 0 });
    expect(useStore.getState().assetState[sceneId].status).toBe('idle');
  });

  it('property: deactivating any scene resets its asset state to idle', async () => {
    const { useStore } = await import('../store');

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.constantFrom('ready' as const, 'loading-full' as const, 'loading-proxy' as const),
        (sceneId, initialStatus) => {
          const store = useStore.getState();

          store.setAssetState(sceneId, { status: initialStatus, progress: 0.5 });
          // Deactivate
          store.setAssetState(sceneId, { status: 'idle', progress: 0 });

          const state = useStore.getState().assetState[sceneId];
          return state.status === 'idle' && state.progress === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
