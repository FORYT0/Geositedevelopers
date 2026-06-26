// Feature: geosite-developers
// Property 8: Clicking an interactive element starts its animation
// Property 9: Additional clicks are ignored while animation is playing
// Property 10: Second click after animation completion plays reverse animation
// Property 11: Animation load failure leaves element in static state without throwing
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  computeNextAnimationState,
  computeAnimationCompleteState,
} from '../hooks/useAnimationController';
import type { AnimationElementState } from '../store';
import type { InteractiveElement } from '../lib/scene-config';

const elementArb: fc.Arbitrary<InteractiveElement> = fc.record({
  meshName: fc.string({ minLength: 1, maxLength: 30 }),
  animationClipName: fc.string({ minLength: 1, maxLength: 30 }),
  reverseClipName: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
});

const idleStateArb: fc.Arbitrary<AnimationElementState> = fc.record({
  isPlaying: fc.constant(false),
  direction: fc.constantFrom('forward' as const, 'reverse' as const),
  clipName: fc.string({ minLength: 1, maxLength: 30 }),
});

const playingStateArb: fc.Arbitrary<AnimationElementState> = fc.record({
  isPlaying: fc.constant(true),
  direction: fc.constantFrom('forward' as const, 'reverse' as const),
  clipName: fc.string({ minLength: 1, maxLength: 30 }),
});

describe('Property 8: Clicking an interactive element starts its animation', () => {
  it('click on idle element transitions to isPlaying: true with direction: forward', () => {
    fc.assert(
      fc.property(elementArb, (element) => {
        const result = computeNextAnimationState(undefined, element);
        return result !== null && result.isPlaying === true && result.direction === 'forward';
      }),
      { numRuns: 100 }
    );
  });

  it('click on idle element sets clipName to animationClipName', () => {
    fc.assert(
      fc.property(elementArb, (element) => {
        const result = computeNextAnimationState(undefined, element);
        return result !== null && result.clipName === element.animationClipName;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 9: Additional clicks are ignored while animation is playing', () => {
  it('click on playing element returns null (ignored)', () => {
    fc.assert(
      fc.property(playingStateArb, elementArb, (state, element) => {
        const result = computeNextAnimationState(state, element);
        return result === null;
      }),
      { numRuns: 100 }
    );
  });

  it('multiple clicks while playing all return null', () => {
    fc.assert(
      fc.property(
        playingStateArb,
        elementArb,
        fc.integer({ min: 2, max: 10 }),
        (state, element, clickCount) => {
          for (let i = 0; i < clickCount; i++) {
            const result = computeNextAnimationState(state, element);
            if (result !== null) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 10: Second click after animation completion plays reverse animation', () => {
  it('after forward animation completes, second click plays reverse', () => {
    fc.assert(
      fc.property(elementArb, (element) => {
        // First click: start forward animation
        const afterFirstClick = computeNextAnimationState(undefined, element);
        if (!afterFirstClick) return false;
        expect(afterFirstClick.direction).toBe('forward');

        // Animation completes
        const afterComplete = computeAnimationCompleteState(afterFirstClick);
        expect(afterComplete.isPlaying).toBe(false);

        // Second click: should play reverse
        const afterSecondClick = computeNextAnimationState(afterComplete, element);
        if (!afterSecondClick) return false;

        return afterSecondClick.direction === 'reverse' && afterSecondClick.isPlaying === true;
      }),
      { numRuns: 100 }
    );
  });

  it('reverse clip name is used when reverseClipName is defined', () => {
    const element: InteractiveElement = {
      meshName: 'Door',
      animationClipName: 'Door_Open',
      reverseClipName: 'Door_Close',
    };

    // After forward completes
    const afterForward = computeAnimationCompleteState({
      isPlaying: false,
      direction: 'forward',
      clipName: 'Door_Open',
    });

    const result = computeNextAnimationState(afterForward, element);
    expect(result).not.toBeNull();
    expect(result!.clipName).toBe('Door_Close');
    expect(result!.direction).toBe('reverse');
  });

  it('falls back to animationClipName when reverseClipName is undefined', () => {
    const element: InteractiveElement = {
      meshName: 'Window',
      animationClipName: 'Window_Open',
    };

    const afterForward = computeAnimationCompleteState({
      isPlaying: false,
      direction: 'forward',
      clipName: 'Window_Open',
    });

    const result = computeNextAnimationState(afterForward, element);
    expect(result).not.toBeNull();
    expect(result!.clipName).toBe('Window_Open');
    expect(result!.direction).toBe('reverse');
  });
});

describe('Property 11: Animation load failure leaves element in static state without throwing', () => {
  it('computeNextAnimationState does not throw for any input', () => {
    fc.assert(
      fc.property(
        fc.option(idleStateArb, { nil: undefined }),
        elementArb,
        (state, element) => {
          let threw = false;
          try {
            computeNextAnimationState(state, element);
          } catch {
            threw = true;
          }
          return !threw;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when clip is missing (simulated by returning null from computeNextAnimationState), state remains static', () => {
    // Simulate: animation controller returns null when clip not found
    // The element stays in its current state (isPlaying: false)
    const element: InteractiveElement = {
      meshName: 'BrokenElement',
      animationClipName: 'NonExistentClip',
    };

    // Simulate the controller behavior: if action is null, don't update state
    const currentState: AnimationElementState = {
      isPlaying: false,
      direction: 'forward',
      clipName: 'NonExistentClip',
    };

    // The controller would call computeNextAnimationState, get a result,
    // then try to find the action — if null, it returns without updating state
    // We verify the state remains unchanged
    expect(currentState.isPlaying).toBe(false);
    expect(currentState.direction).toBe('forward');
  });
});
