// Geosite DEVELOPERS — Camera path interpolation utility
import type { CameraKeyframe, EasingFunction } from './scene-config';

export type Vec3 = [number, number, number];

export interface CameraState {
  position: Vec3;
  target: Vec3;
}

// ── Easing functions ──────────────────────────────────────────────────────────

function applyEasing(t: number, easing?: EasingFunction): number {
  switch (easing) {
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'linear':
    default:
      return t;
  }
}

// ── Linear interpolation helpers ─────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// ── Main interpolation function ───────────────────────────────────────────────

/**
 * Interpolates camera position and target along a keyframe path.
 *
 * @param keyframes - Array of CameraKeyframe objects sorted by scrollProgress.
 *                    Must have at least 2 keyframes.
 * @param progress  - Scroll progress in [0, 1].
 * @returns Interpolated CameraState (position and target).
 */
export function interpolateCameraPath(
  keyframes: CameraKeyframe[],
  progress: number
): CameraState {
  if (keyframes.length === 0) {
    return { position: [0, 0, 0], target: [0, 0, 0] };
  }
  if (keyframes.length === 1) {
    return {
      position: keyframes[0].position as Vec3,
      target: keyframes[0].target as Vec3,
    };
  }

  // Clamp progress to [0, 1]
  const p = Math.max(0, Math.min(1, progress));

  // Find surrounding keyframes
  const sorted = [...keyframes].sort((a, b) => a.scrollProgress - b.scrollProgress);

  // Before first keyframe
  if (p <= sorted[0].scrollProgress) {
    return {
      position: sorted[0].position as Vec3,
      target: sorted[0].target as Vec3,
    };
  }

  // After last keyframe
  if (p >= sorted[sorted.length - 1].scrollProgress) {
    const last = sorted[sorted.length - 1];
    return {
      position: last.position as Vec3,
      target: last.target as Vec3,
    };
  }

  // Find the two surrounding keyframes
  let fromIdx = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (p >= sorted[i].scrollProgress && p <= sorted[i + 1].scrollProgress) {
      fromIdx = i;
      break;
    }
  }

  const from = sorted[fromIdx];
  const to = sorted[fromIdx + 1];

  // Compute local t within this segment
  const segmentLength = to.scrollProgress - from.scrollProgress;
  const localT = segmentLength === 0 ? 0 : (p - from.scrollProgress) / segmentLength;

  // Apply easing from the "to" keyframe (easing applies to the transition into that keyframe)
  const easedT = applyEasing(localT, to.easing);

  return {
    position: lerpVec3(from.position as Vec3, to.position as Vec3, easedT),
    target: lerpVec3(from.target as Vec3, to.target as Vec3, easedT),
  };
}
