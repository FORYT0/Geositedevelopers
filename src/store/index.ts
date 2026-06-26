'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SceneConfig } from '@/src/lib/scene-config';

// ── Asset Loader ──────────────────────────────────────────────────────────────
export interface AssetLoaderState {
  status: 'idle' | 'loading-proxy' | 'loading-full' | 'ready' | 'error';
  progress: number; // 0.0 – 1.0
  errorMessage?: string;
}

// ── Camera / Interaction ──────────────────────────────────────────────────────
export interface DragState {
  isDragging: boolean;
  rotationX: number; // degrees, clamped ±45
  rotationY: number; // degrees, full 360
}

// ── Animation ─────────────────────────────────────────────────────────────────
export interface AnimationElementState {
  isPlaying: boolean;
  direction: 'forward' | 'reverse';
  clipName: string;
}

export type AnimationState = Record<string, AnimationElementState>;

// ── Performance ───────────────────────────────────────────────────────────────
export interface PerformanceState {
  fps: number; // rolling average over last 120 frames
  drawCalls: number;
  gpuMemoryMB: number;
  qualityTier: 'high' | 'medium' | 'low';
  devOverlayVisible: boolean;
}

// ── XR ────────────────────────────────────────────────────────────────────────
export interface XRState {
  supported: boolean;
  mode: 'none' | 'ar' | 'vr';
  sessionActive: boolean;
  arAnchorPosition: [number, number, number] | null;
}

// ── Persistent User Preferences ───────────────────────────────────────────────
export interface UserPreferences {
  qualityTierPreference: 'high' | 'medium' | 'low';
  lightingPresetPreference: string;
  devOverlayVisiblePreference: boolean;
}

// ── Global Store Interface ────────────────────────────────────────────────────
export interface GlobalStore {
  // Scene
  scenes: SceneConfig[];
  activeSceneId: string | null;
  setScenes: (scenes: SceneConfig[]) => void;
  setActiveScene: (id: string) => void;

  // Asset loading
  assetState: Record<string, AssetLoaderState>;
  setAssetState: (sceneId: string, state: AssetLoaderState) => void;

  // Camera / interaction
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
  dragState: DragState;
  setDragState: (s: DragState) => void;
  endOfTourVisible: boolean;
  setEndOfTourVisible: (v: boolean) => void;

  // Animations
  animationState: AnimationState;
  setAnimationElementState: (meshName: string, state: AnimationElementState) => void;

  // Performance
  performanceState: PerformanceState;
  setPerformanceState: (s: Partial<PerformanceState>) => void;
  setQualityTier: (tier: 'high' | 'medium' | 'low') => void;
  toggleDevOverlay: () => void;

  // XR
  xrState: XRState;
  setXRMode: (mode: 'none' | 'ar' | 'vr') => void;
  setXRSessionActive: (active: boolean) => void;
  setXRSupported: (supported: boolean) => void;
  setARAnchorPosition: (pos: [number, number, number] | null) => void;

  // Lighting
  activeLightingPreset: string;
  setLightingPreset: (id: string) => void;

  // User preferences (persisted)
  userPreferences: UserPreferences;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
}

/**
 * Cleanup middleware: when scene changes, abort pending loads for old scene
 * and clear GPU resources via useGLTF.clear().
 */
function createCleanupMiddleware(config: any) {
  return (set: any, get: any, api: any) => {
    const store = config(
      (state: Partial<GlobalStore>) => {
        const prevSceneId = get().activeSceneId;
        set(state);
        const nextSceneId = get().activeSceneId;

        // Scene changed: cleanup old scene resources
        if (prevSceneId !== nextSceneId && prevSceneId !== null) {
          // Clear asset state for old scene to abort pending loads
          const assetState = get().assetState;
          const newAssetState = { ...assetState };
          delete newAssetState[prevSceneId];
          set({ assetState: newAssetState });

          // In Viewer component, useGLTF.clear() should be called to release GPU resources
          // This middleware triggers the cleanup logic; Viewer handles the actual R3F cleanup
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('sceneChange', { detail: { oldSceneId: prevSceneId, newSceneId: nextSceneId } })
            );
          }
        }
      },
      get,
      api
    );
    return store;
  };
}

export const useStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // Scene
      scenes: [],
      activeSceneId: null,
      setScenes: (scenes) => set({ scenes }),
      setActiveScene: (id) =>
        set((state) => {
          // Cleanup old scene on change
          const prevSceneId = state.activeSceneId;
          if (prevSceneId !== null && prevSceneId !== id) {
            const assetState = { ...state.assetState };
            delete assetState[prevSceneId];
            set({ assetState });
            // Dispatch cleanup event for Viewer to handle useGLTF.clear()
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('scene:cleanup', {
                  detail: { sceneId: prevSceneId },
                })
              );
            }
          }
          return { activeSceneId: id };
        }),

      // Asset loading
      assetState: {},
      setAssetState: (sceneId, state) =>
        set((s) => ({ assetState: { ...s.assetState, [sceneId]: state } })),

      // Camera / interaction
      scrollProgress: 0,
      setScrollProgress: (p) => set({ scrollProgress: p }),
      dragState: { isDragging: false, rotationX: 0, rotationY: 0 },
      setDragState: (dragState) => set({ dragState }),
      endOfTourVisible: false,
      setEndOfTourVisible: (endOfTourVisible) => set({ endOfTourVisible }),

      // Animations
      animationState: {},
      setAnimationElementState: (meshName, state) =>
        set((s) => ({ animationState: { ...s.animationState, [meshName]: state } })),

      // Performance
      performanceState: {
        fps: 60,
        drawCalls: 0,
        gpuMemoryMB: 0,
        qualityTier: 'high',
        devOverlayVisible: false,
      },
      setPerformanceState: (partial) =>
        set((s) => ({ performanceState: { ...s.performanceState, ...partial } })),
      setQualityTier: (tier) =>
        set((s) => {
          // Also update persistent preference
          return {
            performanceState: { ...s.performanceState, qualityTier: tier },
            userPreferences: { ...s.userPreferences, qualityTierPreference: tier },
          };
        }),
      toggleDevOverlay: () =>
        set((s) => ({
          performanceState: {
            ...s.performanceState,
            devOverlayVisible: !s.performanceState.devOverlayVisible,
          },
          userPreferences: {
            ...s.userPreferences,
            devOverlayVisiblePreference: !s.performanceState.devOverlayVisible,
          },
        })),

      // XR
      xrState: { supported: false, mode: 'none', sessionActive: false, arAnchorPosition: null },
      setXRMode: (mode) => set((s) => ({ xrState: { ...s.xrState, mode } })),
      setXRSessionActive: (sessionActive) =>
        set((s) => ({ xrState: { ...s.xrState, sessionActive } })),
      setXRSupported: (supported) =>
        set((s) => ({ xrState: { ...s.xrState, supported } })),
      setARAnchorPosition: (arAnchorPosition) =>
        set((s) => ({ xrState: { ...s.xrState, arAnchorPosition } })),

      // Lighting
      activeLightingPreset: 'day',
      setLightingPreset: (id) =>
        set((s) => ({
          activeLightingPreset: id,
          userPreferences: { ...s.userPreferences, lightingPresetPreference: id },
        })),

      // User preferences (persisted)
      userPreferences: {
        qualityTierPreference: 'high',
        lightingPresetPreference: 'day',
        devOverlayVisiblePreference: false,
      },
      setUserPreferences: (prefs) =>
        set((s) => {
          const updated = { ...s.userPreferences, ...prefs };
          // Apply preferences to current state
          return {
            userPreferences: updated,
            performanceState: prefs.qualityTierPreference
              ? { ...s.performanceState, qualityTier: prefs.qualityTierPreference }
              : s.performanceState,
            activeLightingPreset: prefs.lightingPresetPreference || s.activeLightingPreset,
          };
        }),
    }),
    {
      name: 'geosite-store',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
      }),
    }
  )
);
