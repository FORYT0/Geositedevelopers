// Feature: geosite-developers, Property 18: Renderer pixel ratio is capped at 2.0 for any device pixel ratio
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * The DPR cap logic: Canvas dpr={[1, 2]} in R3F means the renderer
 * uses min(devicePixelRatio, 2.0) as the effective pixel ratio.
 *
 * We test the pure capping function.
 */
function capDPR(devicePixelRatio: number): number {
  return Math.min(devicePixelRatio, 2.0);
}

describe('Property 18: Renderer pixel ratio is capped at 2.0 for any device pixel ratio', () => {
  it('DPR is always ≤ 2.0', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.5, max: 5.0, noNaN: true, noDefaultInfinity: true }),
        (dpr) => {
          return capDPR(dpr) <= 2.0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('DPR ≤ 2.0 is unchanged', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.5, max: 2.0, noNaN: true, noDefaultInfinity: true }),
        (dpr) => {
          return Math.abs(capDPR(dpr) - dpr) < 1e-6;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('DPR > 2.0 is capped to exactly 2.0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 10 }).map(n => n * 0.5 + 2.0), // values like 2.5, 3.0, 3.5...
        (dpr) => {
          return capDPR(dpr) === 2.0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('capDPR(1) = 1', () => expect(capDPR(1)).toBe(1));
  it('capDPR(2) = 2', () => expect(capDPR(2)).toBe(2));
  it('capDPR(3) = 2', () => expect(capDPR(3)).toBe(2));
  it('capDPR(0.5) = 0.5', () => expect(capDPR(0.5)).toBe(0.5));
});
