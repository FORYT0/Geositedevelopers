// Feature: geosite-developers, Property 19: Pinch-to-zoom FOV is clamped to [30°, 90°]
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { clampFov, FOV_MIN, FOV_MAX } from '../components/viewer/DragRotationController';

/**
 * Validates: Requirements 9.3
 * Property 19: Pinch-to-zoom FOV is clamped to [30°, 90°]
 *
 * For any pinch gesture input (including extreme values), the resulting
 * camera field-of-view should always remain within the range [30°, 90°].
 */
describe('Property 19: Pinch-to-zoom FOV is clamped to [30°, 90°]', () => {
  it('clampFov always returns a value in [30, 90] for arbitrary float inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: false }),
        (input) => {
          const result = clampFov(input);
          return result >= FOV_MIN && result <= FOV_MAX;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('clampFov(30) === 30 (lower boundary)', () => {
    expect(clampFov(30)).toBe(30);
  });

  it('clampFov(90) === 90 (upper boundary)', () => {
    expect(clampFov(90)).toBe(90);
  });

  it('clampFov(60) === 60 (midpoint)', () => {
    expect(clampFov(60)).toBe(60);
  });

  it('clampFov clamps values below 30 to 30', () => {
    expect(clampFov(-1000)).toBe(30);
    expect(clampFov(0)).toBe(30);
    expect(clampFov(29.99)).toBe(30);
  });

  it('clampFov clamps values above 90 to 90', () => {
    expect(clampFov(1000)).toBe(90);
    expect(clampFov(90.01)).toBe(90);
  });

  it('clampFov returns FOV_DEFAULT for non-finite inputs', () => {
    expect(clampFov(-Infinity)).toBe(60);
    expect(clampFov(Infinity)).toBe(60);
    expect(clampFov(NaN)).toBe(60);
  });
});
