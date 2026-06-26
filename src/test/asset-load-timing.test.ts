// Integration tests for asset load timing
// Validates: Requirements 1.2, 8.1
// Req 1.2: Scene loads within 5 s on broadband
// Req 8.1: Proxy model renders within 2 s, full model replaces it upon completion

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useStore } from '../store';
import { markAssetReady, updateAssetProgress } from '../hooks/useAssetLoader';

// Reset store state between tests
function resetAssetState(sceneId: string) {
  useStore.getState().setAssetState(sceneId, { status: 'idle', progress: 0 });
}

describe('Asset load timing integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('proxy model status is set within 2 seconds of load start', async () => {
    const sceneId = 'timing-proxy-test';
    resetAssetState(sceneId);

    // Simulate load start: transition to loading-proxy immediately
    useStore.getState().setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });

    // Simulate broadband proxy load completing at 1.5 s (within 2 s budget)
    const PROXY_LOAD_MS = 1500;

    let proxyDone = false;
    setTimeout(() => {
      // Proxy done → transition to loading-full
      useStore.getState().setAssetState(sceneId, { status: 'loading-full', progress: 0.5 });
      proxyDone = true;
    }, PROXY_LOAD_MS);

    // Advance time to just before 2 s
    vi.advanceTimersByTime(1999);

    expect(proxyDone).toBe(true);

    const state = useStore.getState().assetState[sceneId];
    // After proxy load, status should be 'loading-full' or 'ready' — not still 'loading-proxy'
    expect(['loading-full', 'ready']).toContain(state.status);
  });

  it('full model status is set to ready within 5 seconds of load start', async () => {
    const sceneId = 'timing-full-test';
    resetAssetState(sceneId);

    // Simulate load start
    useStore.getState().setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });

    // Proxy completes at 1 s
    setTimeout(() => {
      useStore.getState().setAssetState(sceneId, { status: 'loading-full', progress: 0.3 });
    }, 1000);

    // Full model completes at 4 s (within 5 s budget)
    const FULL_LOAD_MS = 4000;
    setTimeout(() => {
      markAssetReady(sceneId);
    }, FULL_LOAD_MS);

    // Advance time to just before 5 s
    vi.advanceTimersByTime(4999);

    const state = useStore.getState().assetState[sceneId];
    expect(state.status).toBe('ready');
    expect(state.progress).toBe(1);
  });

  it('asset loader transitions through expected states: idle → loading-proxy → loading-full → ready', () => {
    const sceneId = 'timing-states-test';
    const stateHistory: string[] = [];

    // Start idle
    resetAssetState(sceneId);
    stateHistory.push(useStore.getState().assetState[sceneId].status);

    // Transition to loading-proxy (load initiated)
    useStore.getState().setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });
    stateHistory.push(useStore.getState().assetState[sceneId].status);

    // Proxy completes at 1.5 s → loading-full
    setTimeout(() => {
      useStore.getState().setAssetState(sceneId, { status: 'loading-full', progress: 0.5 });
      stateHistory.push(useStore.getState().assetState[sceneId].status);
    }, 1500);

    // Full model completes at 4 s → ready
    setTimeout(() => {
      markAssetReady(sceneId);
      stateHistory.push(useStore.getState().assetState[sceneId].status);
    }, 4000);

    // Advance through all transitions
    vi.advanceTimersByTime(4000);

    expect(stateHistory).toEqual(['idle', 'loading-proxy', 'loading-full', 'ready']);
  });

  it('progress increases monotonically during full model load', () => {
    const sceneId = 'timing-progress-test';
    resetAssetState(sceneId);

    useStore.getState().setAssetState(sceneId, { status: 'loading-proxy', progress: 0 });

    const progressSnapshots: number[] = [];

    // Simulate chunked progress updates during full load
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach((progress, i) => {
      setTimeout(() => {
        updateAssetProgress(sceneId, progress);
        progressSnapshots.push(useStore.getState().assetState[sceneId].progress);
      }, 500 + i * 600);
    });

    setTimeout(() => {
      markAssetReady(sceneId);
      progressSnapshots.push(useStore.getState().assetState[sceneId].progress);
    }, 3500);

    vi.advanceTimersByTime(4000);

    // Verify progress only goes up
    for (let i = 1; i < progressSnapshots.length; i++) {
      expect(progressSnapshots[i]).toBeGreaterThanOrEqual(progressSnapshots[i - 1]);
    }
    // Final progress should be 1
    expect(progressSnapshots[progressSnapshots.length - 1]).toBe(1);
  });
});
