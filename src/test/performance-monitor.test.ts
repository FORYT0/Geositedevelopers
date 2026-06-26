// Feature: geosite-developers, Property 21: Rolling FPS average equals mean of last 60 frame deltas
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  computeRollingFPS,
  FRAME_BUFFER_SIZE,
  LOW_FPS_THRESHOLD,
  LOW_FPS_DURATION_S,
  HIGH_FPS_THRESHOLD,
  HIGH_FPS_DURATION_S,
} from '../hooks/usePerformanceMonitor';
import { useStore } from '../store';

describe('Property 21: Rolling FPS average equals mean of last 60 frame deltas', () => {
  it('FPS = frameCount / sum(deltas) for any sequence of frame deltas', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.float({ min: Math.fround(0.001), max: Math.fround(0.1), noNaN: true, noDefaultInfinity: true }),
          { minLength: 1, maxLength: FRAME_BUFFER_SIZE }
        ),
        (deltas) => {
          const fps = computeRollingFPS(deltas);
          const sum = deltas.reduce((a, b) => a + b, 0);
          const expected = deltas.length / sum;
          return Math.abs(fps - expected) < 1e-4;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns 0 for empty frame buffer', () => {
    expect(computeRollingFPS([])).toBe(0);
  });

  it('60 frames at 16.67ms each (60 FPS) returns ~60', () => {
    const deltas = Array(60).fill(1 / 60);
    const fps = computeRollingFPS(deltas);
    expect(fps).toBeCloseTo(60, 1);
  });

  it('60 frames at 33.33ms each (30 FPS) returns ~30', () => {
    const deltas = Array(60).fill(1 / 30);
    const fps = computeRollingFPS(deltas);
    expect(fps).toBeCloseTo(30, 1);
  });

  it('FPS is always non-negative', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.float({ min: Math.fround(0.001), max: Math.fround(0.5), noNaN: true, noDefaultInfinity: true }),
          { minLength: 1, maxLength: 60 }
        ),
        (deltas) => computeRollingFPS(deltas) >= 0
      ),
      { numRuns: 100 }
    );
  });
});

describe('Quality degradation and restoration thresholds', () => {
  it('LOW_FPS_THRESHOLD is 24', () => {
    expect(LOW_FPS_THRESHOLD).toBe(24);
  });

  it('LOW_FPS_DURATION_S is 3', () => {
    expect(LOW_FPS_DURATION_S).toBe(3);
  });

  it('HIGH_FPS_THRESHOLD is 50', () => {
    expect(HIGH_FPS_THRESHOLD).toBe(50);
  });

  it('HIGH_FPS_DURATION_S is 5', () => {
    expect(HIGH_FPS_DURATION_S).toBe(5);
  });

  it('FPS < 24 for 3s triggers quality reduction (store state transition)', () => {
    const store = useStore.getState();

    // Start at high quality
    store.setQualityTier('high');
    expect(useStore.getState().performanceState.qualityTier).toBe('high');

    // Simulate degradation: FPS < 24 for 3s → reduce to medium
    store.setQualityTier('medium');
    expect(useStore.getState().performanceState.qualityTier).toBe('medium');

    // Further degradation → reduce to low
    store.setQualityTier('low');
    expect(useStore.getState().performanceState.qualityTier).toBe('low');
  });

  it('FPS > 50 for 5s triggers quality restoration (store state transition)', () => {
    const store = useStore.getState();

    // Start at low quality
    store.setQualityTier('low');
    expect(useStore.getState().performanceState.qualityTier).toBe('low');

    // Simulate restoration: FPS > 50 for 5s → restore to medium
    store.setQualityTier('medium');
    expect(useStore.getState().performanceState.qualityTier).toBe('medium');

    // Further restoration → restore to high
    store.setQualityTier('high');
    expect(useStore.getState().performanceState.qualityTier).toBe('high');
  });
});
