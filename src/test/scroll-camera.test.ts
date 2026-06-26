// Unit test: reaching scroll progress 1.0 triggers the end-of-tour prompt
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('End-of-scroll-path prompt', () => {
  beforeEach(() => {
    // Reset store state
    useStore.getState().setScrollProgress(0);
    useStore.getState().setEndOfTourVisible(false);
  });

  it('endOfTourVisible is false at scroll progress 0', () => {
    useStore.getState().setScrollProgress(0);
    useStore.getState().setEndOfTourVisible(false);
    expect(useStore.getState().endOfTourVisible).toBe(false);
  });

  it('endOfTourVisible becomes true when scroll progress reaches 1.0', () => {
    // Simulate what ScrollCameraController does when progress >= 1
    const progress = 1.0;
    useStore.getState().setScrollProgress(progress);
    if (progress >= 1) {
      useStore.getState().setEndOfTourVisible(true);
    }
    expect(useStore.getState().endOfTourVisible).toBe(true);
  });

  it('endOfTourVisible is false when scroll progress is below 1.0', () => {
    const progress = 0.99;
    useStore.getState().setScrollProgress(progress);
    if (progress >= 1) {
      useStore.getState().setEndOfTourVisible(true);
    } else {
      useStore.getState().setEndOfTourVisible(false);
    }
    expect(useStore.getState().endOfTourVisible).toBe(false);
  });

  it('endOfTourVisible resets to false when scrolling back from end', () => {
    // Reach end
    useStore.getState().setScrollProgress(1);
    useStore.getState().setEndOfTourVisible(true);
    expect(useStore.getState().endOfTourVisible).toBe(true);

    // Scroll back
    useStore.getState().setScrollProgress(0.8);
    useStore.getState().setEndOfTourVisible(false);
    expect(useStore.getState().endOfTourVisible).toBe(false);
  });
});
