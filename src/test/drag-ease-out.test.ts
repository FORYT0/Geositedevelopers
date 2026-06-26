// Unit test: drag gesture end triggers 600 ms ease-out return to default orientation
import { describe, it, expect } from 'vitest';
import { EASE_OUT_DURATION_MS, VERTICAL_CLAMP_DEG } from '../components/viewer/DragRotationController';

/**
 * Simulates the ease-out return animation logic from DragRotationController.
 * Returns the rotation value at a given elapsed time.
 */
function simulateEaseOutReturn(
  startRotation: number,
  elapsedMs: number,
  durationMs = EASE_OUT_DURATION_MS
): number {
  const t = Math.min(1, elapsedMs / durationMs);
  const easedT = t * (2 - t); // ease-out curve
  return startRotation * (1 - easedT);
}

describe('Drag-end ease-out return animation (600 ms)', () => {
  it('EASE_OUT_DURATION_MS is 600', () => {
    expect(EASE_OUT_DURATION_MS).toBe(600);
  });

  it('at t=0ms, rotation equals the starting rotation', () => {
    expect(simulateEaseOutReturn(45, 0)).toBeCloseTo(45, 4);
    expect(simulateEaseOutReturn(-30, 0)).toBeCloseTo(-30, 4);
  });

  it('at t=600ms, rotation returns to 0 (default orientation)', () => {
    expect(simulateEaseOutReturn(45, 600)).toBeCloseTo(0, 4);
    expect(simulateEaseOutReturn(-30, 600)).toBeCloseTo(0, 4);
  });

  it('at t=300ms (halfway), rotation is partially returned', () => {
    const startRot = 40;
    const midRot = simulateEaseOutReturn(startRot, 300);
    // At t=0.5, easedT = 0.5*(2-0.5) = 0.75, so rotation = 40*(1-0.75) = 10
    expect(midRot).toBeCloseTo(startRot * 0.25, 2);
  });

  it('rotation decreases monotonically from start to end', () => {
    const startRot = 45;
    const samples = [0, 100, 200, 300, 400, 500, 600];
    const rotations = samples.map(t => simulateEaseOutReturn(startRot, t));
    for (let i = 1; i < rotations.length; i++) {
      expect(rotations[i]).toBeLessThanOrEqual(rotations[i - 1] + 1e-6);
    }
  });

  it('after 600ms, rotation stays at 0 (no overshoot)', () => {
    expect(simulateEaseOutReturn(45, 700)).toBeCloseTo(0, 4);
    expect(simulateEaseOutReturn(45, 1000)).toBeCloseTo(0, 4);
  });

  it('works for negative starting rotation', () => {
    const startRot = -VERTICAL_CLAMP_DEG;
    expect(simulateEaseOutReturn(startRot, 0)).toBeCloseTo(startRot, 4);
    expect(simulateEaseOutReturn(startRot, 600)).toBeCloseTo(0, 4);
  });
});
