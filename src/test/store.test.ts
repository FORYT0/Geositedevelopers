import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/index';

describe('Global Store', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState({
      scenes: [],
      activeSceneId: null,
      assetState: {},
      animationState: {},
      xrState: { supported: false, mode: 'none', sessionActive: false, arAnchorPosition: null },
      performanceState: { fps: 60, drawCalls: 0, gpuMemoryMB: 0, qualityTier: 'high', devOverlayVisible: false }
    });
  });

  it('initializes with default values', () => {
    const state = useStore.getState();
    expect(state.scenes).toEqual([]);
    expect(state.activeSceneId).toBeNull();
    expect(state.xrState.mode).toBe('none');
    expect(state.performanceState.qualityTier).toBe('high');
  });

  it('updates XR mode and anchor position', () => {
    const { setXRMode, setARAnchorPosition } = useStore.getState();
    
    setXRMode('ar');
    expect(useStore.getState().xrState.mode).toBe('ar');
    
    setARAnchorPosition([1, 2, 3]);
    expect(useStore.getState().xrState.arAnchorPosition).toEqual([1, 2, 3]);
    
    setARAnchorPosition(null);
    expect(useStore.getState().xrState.arAnchorPosition).toBeNull();
  });

  it('updates asset loading state for scenes', () => {
    const { setAssetState } = useStore.getState();
    
    setAssetState('scene-1', { status: 'loading-proxy', progress: 0.5 });
    expect(useStore.getState().assetState['scene-1']).toEqual({ status: 'loading-proxy', progress: 0.5 });
    
    setAssetState('scene-1', { status: 'ready', progress: 1 });
    expect(useStore.getState().assetState['scene-1']).toEqual({ status: 'ready', progress: 1 });
  });

  it('toggles developer overlay', () => {
    const { toggleDevOverlay } = useStore.getState();
    
    expect(useStore.getState().performanceState.devOverlayVisible).toBe(false);
    toggleDevOverlay();
    expect(useStore.getState().performanceState.devOverlayVisible).toBe(true);
    toggleDevOverlay();
    expect(useStore.getState().performanceState.devOverlayVisible).toBe(false);
  });
});
