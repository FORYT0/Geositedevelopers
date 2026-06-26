// Geosite DEVELOPERS — Animation_Controller subsystem
'use client';
import { useCallback } from 'react';
import { useStore } from '@/src/store';
import type { InteractiveElement } from '@/src/lib/scene-config';
import type { AnimationElementState } from '@/src/store';

// Type for the GLTF animations result from @react-three/drei useAnimations
interface AnimationsResult {
  actions: Record<string, { play: () => void; stop: () => void; reset: () => void; paused: boolean } | null>;
}

/**
 * useAnimationController — manages keyframe animations on interactive elements.
 *
 * Built on useAnimations from @react-three/drei.
 * Tracks per-element play state to enforce:
 * - Ignore clicks while animation is playing
 * - On completion, flip direction for next trigger
 * - Catch missing/failed clips, log warning, leave element in static state
 */
export function useAnimationController(
  animations: AnimationsResult,
  elements: InteractiveElement[]
) {
  const animationState = useStore((s) => s.animationState);
  const setAnimationElementState = useStore((s) => s.setAnimationElementState);

  const triggerAnimation = useCallback(
    (meshName: string) => {
      const element = elements.find((e) => e.meshName === meshName);
      if (!element) return;

      const currentState = animationState[meshName];

      // Ignore clicks while animation is playing
      if (currentState?.isPlaying) return;

      // Determine direction
      const direction: 'forward' | 'reverse' =
        currentState?.direction === 'forward' && !currentState.isPlaying
          ? 'reverse'
          : 'forward';

      const clipName =
        direction === 'forward'
          ? element.animationClipName
          : (element.reverseClipName ?? element.animationClipName);

      // Try to play the animation clip
      const action = animations.actions[clipName];
      if (!action) {
        console.warn(
          `[useAnimationController] Animation clip "${clipName}" not found for mesh "${meshName}". Leaving in static state.`
        );
        // Leave element in static state — do not update isPlaying
        return;
      }

      try {
        action.reset();
        action.play();

        setAnimationElementState(meshName, {
          isPlaying: true,
          direction,
          clipName,
        });
      } catch (err) {
        console.warn(
          `[useAnimationController] Failed to play animation "${clipName}" for mesh "${meshName}":`,
          err
        );
        // Leave element in static state
      }
    },
    [animations, elements, animationState, setAnimationElementState]
  );

  /**
   * Called when an animation completes (e.g., from a Three.js 'finished' event).
   * Flips the direction for the next trigger.
   */
  const onAnimationComplete = useCallback(
    (meshName: string) => {
      const currentState = animationState[meshName];
      if (!currentState) return;

      setAnimationElementState(meshName, {
        ...currentState,
        isPlaying: false,
        // Direction stays as-is; next click will flip it
      });
    },
    [animationState, setAnimationElementState]
  );

  return { triggerAnimation, onAnimationComplete, animationState };
}

// ── Pure state transition functions (testable without R3F) ────────────────────

/**
 * Computes the next animation state after a click.
 * Returns null if the click should be ignored (animation is playing).
 */
export function computeNextAnimationState(
  current: AnimationElementState | undefined,
  element: InteractiveElement
): AnimationElementState | null {
  // Ignore clicks while playing
  if (current?.isPlaying) return null;

  const direction: 'forward' | 'reverse' =
    current?.direction === 'forward' && !current.isPlaying ? 'reverse' : 'forward';

  const clipName =
    direction === 'forward'
      ? element.animationClipName
      : (element.reverseClipName ?? element.animationClipName);

  return { isPlaying: true, direction, clipName };
}

/**
 * Computes the state after an animation completes.
 */
export function computeAnimationCompleteState(
  current: AnimationElementState
): AnimationElementState {
  return { ...current, isPlaying: false };
}
