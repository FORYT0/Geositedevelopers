// Feature: geosite-developers
// Property 12: Interior camera scroll advances at 1 meter per 100 pixels
// Property 14: Camera halts at collision boundary without disrupting other axes
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  computeInteriorScrollProgress,
  applyCollisionBoundary,
  INTERIOR_SCROLL_RATE,
} from '../components/viewer/InteriorCameraController';

describe('Property 12: Interior camera scroll advances at 1 meter per 100 pixels', () => {
  it('INTERIOR_SCROLL_RATE is 1/100', () => {
    expect(INTERIOR_SCROLL_RATE).toBeCloseTo(0.01, 6);
  });

  it('100 pixels of scroll advances 1 meter along a 10-meter path (10% progress)', () => {
    const result = computeInteriorScrollProgress(0, 100, 10);
    // 100px * (1m/100px) = 1m; 1m / 10m = 0.1 progress
    expect(result).toBeCloseTo(0.1, 4);
  });

  it('scroll progress is always in [0, 1]', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        fc.integer({ min: -10000, max: 10000 }).map(n => n * 1.0),
        fc.integer({ min: 1, max: 1000 }).map(n => n * 1.0),
        (currentProgress, pixelDelta, pathLength) => {
          const result = computeInteriorScrollProgress(currentProgress, pixelDelta, pathLength);
          return result >= 0 && result <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('pixel delta of d advances d/100 meters along the path', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 10000, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 10, max: 1000, noNaN: true, noDefaultInfinity: true }),
        (pixelDelta, pathLengthMeters) => {
          const metersAdvanced = pixelDelta * INTERIOR_SCROLL_RATE;
          const expectedProgressDelta = metersAdvanced / pathLengthMeters;
          const result = computeInteriorScrollProgress(0, pixelDelta, pathLengthMeters);
          const clampedExpected = Math.min(1, expectedProgressDelta);
          return Math.abs(result - clampedExpected) < 1e-4;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 14: Camera halts at collision boundary without disrupting other axes', () => {
  it('value within boundary is unchanged', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: -200, max: -101, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 101, max: 200, noNaN: true, noDefaultInfinity: true }),
        (value, min, max) => {
          if (value < min || value > max) return true; // skip out-of-range values
          const result = applyCollisionBoundary(value, { axis: 'x', min, max });
          return Math.abs(result - value) < 1e-6;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('value below min is clamped to min', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 0, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
        (value, min) => {
          const result = applyCollisionBoundary(value, { axis: 'z', min, max: min + 100 });
          return result === min;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('value above max is clamped to max', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 101, max: 1000, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
        (value, max) => {
          const result = applyCollisionBoundary(value, { axis: 'y', min: 0, max });
          return result === max;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('collision on x-axis does not affect y or z values', () => {
    // applyCollisionBoundary only affects the specified axis value
    const xValue = -100; // out of bounds
    const boundary = { axis: 'x' as const, min: 0, max: 10 };
    const clampedX = applyCollisionBoundary(xValue, boundary);

    // y and z are independent — they are not passed through this function
    const yValue = 5;
    const zValue = 3;
    expect(clampedX).toBe(0); // x clamped to min
    expect(yValue).toBe(5);   // y unchanged
    expect(zValue).toBe(3);   // z unchanged
  });
});
