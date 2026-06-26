// Feature: geosite-developers
// Property 6: Horizontal drag delta produces proportional Y-axis rotation
// Property 7: Vertical drag input is clamped to ±45 degrees
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  computeYRotation,
  computeXRotation,
  ROTATION_SENSITIVITY,
  VERTICAL_CLAMP_DEG,
} from '../components/viewer/DragRotationController';

const finiteFloat = fc.float({ min: -10000, max: 10000, noNaN: true, noDefaultInfinity: true });

describe('Property 6: Horizontal drag delta produces proportional Y-axis rotation', () => {
  it('Y rotation delta equals dx * sensitivityFactor', () => {
    fc.assert(
      fc.property(
        finiteFloat, // currentRotY
        finiteFloat, // dx
        (currentRotY, dx) => {
          const result = computeYRotation(currentRotY, dx);
          const expected = currentRotY + dx * ROTATION_SENSITIVITY;
          return Math.abs(result - expected) < 1e-4;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Y rotation is unbounded (no clamp)', () => {
    // Large dx should produce large rotation
    const result = computeYRotation(0, 10000);
    expect(result).toBeGreaterThan(100);
  });

  it('zero dx produces no rotation change', () => {
    fc.assert(
      fc.property(finiteFloat, (currentRotY) => {
        return computeYRotation(currentRotY, 0) === currentRotY;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 7: Vertical drag input is clamped to ±45 degrees', () => {
  it('X rotation is always within [-45, +45] degrees', () => {
    fc.assert(
      fc.property(
        finiteFloat, // currentRotX (may be out of range initially)
        finiteFloat, // dy (any value including extremes)
        (currentRotX, dy) => {
          const result = computeXRotation(currentRotX, dy);
          return result >= -VERTICAL_CLAMP_DEG && result <= VERTICAL_CLAMP_DEG;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('extreme positive dy clamps to +45°', () => {
    const result = computeXRotation(0, 1e9);
    expect(result).toBe(VERTICAL_CLAMP_DEG);
  });

  it('extreme negative dy clamps to -45°', () => {
    const result = computeXRotation(0, -1e9);
    expect(result).toBe(-VERTICAL_CLAMP_DEG);
  });

  it('small dy within range produces proportional rotation', () => {
    const dy = 10; // 10 pixels
    const result = computeXRotation(0, dy);
    const expected = dy * ROTATION_SENSITIVITY;
    expect(result).toBeCloseTo(expected, 4);
  });

  it('VERTICAL_CLAMP_DEG is 45', () => {
    expect(VERTICAL_CLAMP_DEG).toBe(45);
  });
});
