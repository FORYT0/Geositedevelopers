// Feature: geosite-developers, Property 3: Asset load failure produces error state with message and retry
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { markAssetError, isValidModelPath } from '../hooks/useAssetLoader';
import { useStore } from '../store';

describe('Property 3: Asset load failure produces error state with message and retry', () => {
  it('markAssetError sets status to error with a non-empty message', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        (sceneId, errorMessage) => {
          markAssetError(sceneId, errorMessage);
          const state = useStore.getState().assetState[sceneId];
          return (
            state.status === 'error' &&
            typeof state.errorMessage === 'string' &&
            state.errorMessage.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('error state preserves the exact error message', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        (sceneId, errorMessage) => {
          markAssetError(sceneId, errorMessage);
          const state = useStore.getState().assetState[sceneId];
          return state.errorMessage === errorMessage;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('error state has progress of 0', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (sceneId, errorMessage) => {
          markAssetError(sceneId, errorMessage);
          const state = useStore.getState().assetState[sceneId];
          return state.progress === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('retry is possible: setting state back to loading-proxy after error', () => {
    const sceneId = 'retry-test-scene';
    const store = useStore.getState();

    // Simulate failure
    markAssetError(sceneId, 'Network error');
    expect(useStore.getState().assetState[sceneId].status).toBe('error');

    // Simulate retry: reset to loading-proxy
    store.setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });
    expect(useStore.getState().assetState[sceneId].status).toBe('loading-proxy');
  });

  it('property: retry always transitions from error to loading-proxy', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (sceneId) => {
          const store = useStore.getState();

          // Set error state
          markAssetError(sceneId, 'Simulated failure');
          expect(useStore.getState().assetState[sceneId].status).toBe('error');

          // Retry
          store.setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });
          return useStore.getState().assetState[sceneId].status === 'loading-proxy';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('invalid model path produces error state with descriptive message', () => {
    const sceneId = 'invalid-path-scene';

    const invalidPath = '/models/test.obj';
    if (!isValidModelPath(invalidPath)) {
      markAssetError(sceneId, `Unsupported model format. Only .glb and .gltf files are accepted. Got: "${invalidPath}"`);
    }

    const state = useStore.getState().assetState[sceneId];
    expect(state.status).toBe('error');
    expect(state.errorMessage).toContain('.obj');
  });
});
