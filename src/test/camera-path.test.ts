// Feature: geosite-developers, Property 5: Scroll progress maps linearly to camera position on the path
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { interpolateCameraPath } from '../lib/camera-path';
import type { CameraKeyframe } from '../lib/scene-config';

const EPSILON = 1e-4;

function approxEqual(a: number, b: number, eps = EPSILON): boolean {
  return Math.abs(a - b) <= eps;
}

function vec3ApproxEqual(
  a: [number, number, number],
  b: [number, number, number],
  eps = EPSILON
): boolean {
  return approxEqual(a[0], b[0], eps) && approxEqual(a[1], b[1], eps) && approxEqual(a[2], b[2], eps);
}

// Arbitrary for finite floats in a reasonable range
const finiteFloat = fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true });

// Arbitrary for a sorted pair of scroll progress values
const sortedProgressPair = fc
  .tuple(
    fc.float({ min: 0, max: 0.5, noNaN: true, noDefaultInfinity: true }),
    fc.float({ min: 0.5, max: 1, noNaN: true, noDefaultInfinity: true })
  )
  .filter(([a, b]) => b > a + 0.001); // ensure distinct

const keyframeArb = (scrollProgress: number): fc.Arbitrary<CameraKeyframe> =>
  fc.record({
    scrollProgress: fc.constant(scrollProgress),
    position: fc.tuple(finiteFloat, finiteFloat, finiteFloat) as fc.Arbitrary<[number, number, number]>,
    target: fc.tuple(finiteFloat, finiteFloat, finiteFloat) as fc.Arbitrary<[number, number, number]>,
  });

describe('Property 5: Scroll progress maps linearly to camera position on the path', () => {
  it('at progress=0, returns the first keyframe position', () => {
    fc.assert(
      fc.property(
        keyframeArb(0),
        keyframeArb(1),
        (kf0, kf1) => {
          const result = interpolateCameraPath([kf0, kf1], 0);
          return vec3ApproxEqual(result.position, kf0.position as [number, number, number]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('at progress=1, returns the last keyframe position', () => {
    fc.assert(
      fc.property(
        keyframeArb(0),
        keyframeArb(1),
        (kf0, kf1) => {
          const result = interpolateCameraPath([kf0, kf1], 1);
          return vec3ApproxEqual(result.position, kf1.position as [number, number, number]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('at progress=0.5 between two keyframes, returns midpoint (linear)', () => {
    fc.assert(
      fc.property(
        keyframeArb(0),
        keyframeArb(1),
        (kf0, kf1) => {
          const result = interpolateCameraPath([kf0, kf1], 0.5);
          const expected: [number, number, number] = [
            (kf0.position[0] + kf1.position[0]) / 2,
            (kf0.position[1] + kf1.position[1]) / 2,
            (kf0.position[2] + kf1.position[2]) / 2,
          ];
          return vec3ApproxEqual(result.position, expected, 0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('linear interpolation: position at progress p equals lerp(from, to, t)', () => {
    fc.assert(
      fc.property(
        fc.tuple(finiteFloat, finiteFloat, finiteFloat) as fc.Arbitrary<[number, number, number]>,
        fc.tuple(finiteFloat, finiteFloat, finiteFloat) as fc.Arbitrary<[number, number, number]>,
        fc.float({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        (pos0, pos1, progress) => {
          const from: CameraKeyframe = { scrollProgress: 0, position: pos0, target: [0, 0, 0] };
          const to: CameraKeyframe = { scrollProgress: 1, position: pos1, target: [0, 0, 0] };
          const result = interpolateCameraPath([from, to], progress);

          const t = progress; // linear, no easing
          const expectedX = pos0[0] + (pos1[0] - pos0[0]) * t;
          const expectedY = pos0[1] + (pos1[1] - pos0[1]) * t;
          const expectedZ = pos0[2] + (pos1[2] - pos0[2]) * t;

          return (
            approxEqual(result.position[0], expectedX, 0.01) &&
            approxEqual(result.position[1], expectedY, 0.01) &&
            approxEqual(result.position[2], expectedZ, 0.01)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('progress clamped below 0 returns first keyframe', () => {
    const kf0: CameraKeyframe = { scrollProgress: 0, position: [1, 2, 3], target: [0, 0, 0] };
    const kf1: CameraKeyframe = { scrollProgress: 1, position: [4, 5, 6], target: [0, 0, 0] };
    const result = interpolateCameraPath([kf0, kf1], -0.5);
    expect(result.position).toEqual([1, 2, 3]);
  });

  it('progress clamped above 1 returns last keyframe', () => {
    const kf0: CameraKeyframe = { scrollProgress: 0, position: [1, 2, 3], target: [0, 0, 0] };
    const kf1: CameraKeyframe = { scrollProgress: 1, position: [4, 5, 6], target: [0, 0, 0] };
    const result = interpolateCameraPath([kf0, kf1], 1.5);
    expect(result.position).toEqual([4, 5, 6]);
  });

  it('multi-keyframe path: interpolates within correct segment', () => {
    const keyframes: CameraKeyframe[] = [
      { scrollProgress: 0, position: [0, 0, 0], target: [0, 0, -1] },
      { scrollProgress: 0.5, position: [10, 0, 0], target: [10, 0, -1] },
      { scrollProgress: 1, position: [20, 0, 0], target: [20, 0, -1] },
    ];
    // At 0.25 (midpoint of first segment), x should be ~5
    const result = interpolateCameraPath(keyframes, 0.25);
    expect(result.position[0]).toBeCloseTo(5, 1);

    // At 0.75 (midpoint of second segment), x should be ~15
    const result2 = interpolateCameraPath(keyframes, 0.75);
    expect(result2.position[0]).toBeCloseTo(15, 1);
  });
});
