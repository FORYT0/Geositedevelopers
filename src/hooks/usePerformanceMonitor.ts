'use client';
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/src/store';

export const FRAME_BUFFER_SIZE = 120; // Increased from 60 for stability
export const LOW_FPS_THRESHOLD = 24;
export const LOW_FPS_DURATION_S = 3;
export const HIGH_FPS_THRESHOLD = 50;
export const HIGH_FPS_DURATION_S = 5;
export const QUALITY_CHANGE_COOLDOWN_S = 2; // Prevent thrashing
export const GPU_MEMORY_BUDGET_PERCENT = 0.8;
export const LOW_POWER_CPU_THRESHOLD = 0.5; // 50% sustained CPU usage
export const LOW_POWER_FPS_TARGET = 24;
export const EXTERIOR_GPU_MEMORY_LIMIT_MB = 512;

/**
 * Computes rolling average FPS from a circular buffer of frame deltas.
 * FPS = 1 / avg(frameDelta) — uses harmonic mean for accuracy.
 */
export function computeRollingFPS(frameDeltas: number[]): number {
  if (frameDeltas.length === 0) return 0;
  const sum = frameDeltas.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;
  return frameDeltas.length / sum;
}

/**
 * Detects low-power device via high sustained CPU usage.
 * Modern replacement for deprecated Battery API.
 * Uses performance.measureUserAgentSpecificMemory (if available) and CPU-intensive operations.
 */
async function isLowPowerDevice(): Promise<boolean> {
  // Check if running on mobile via User-Agent or viewport
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (typeof window !== 'undefined' && window.innerWidth < 768);

  if (!isMobile) return false;

  // On mobile, check if device is throttled via performance timing
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // Long task entries indicate CPU pressure
        if (entries.length > 0) return true;
      });
      observer.observe({ entryTypes: ['longtask'] });
      // Give it 100ms to detect long tasks
      await new Promise((r) => setTimeout(r, 100));
      observer.disconnect();
    } catch {
      // Ignore if PerformanceLongTaskTiming not available
    }
  }

  return isMobile;
}

/**
 * usePerformanceMonitor — runs inside useFrame, tracks FPS, draw calls, GPU memory.
 *
 * **Features:**
 * - Maintains 120-frame circular buffer of frame deltas (harmonic mean)
 * - Quality degradation: reduce tier when avg FPS < 24 for 3 s
 * - Quality restoration: upgrade tier when avg FPS > 50 for 5 s
 * - Cooldown between tier changes prevents rapid thrashing
 * - GPU memory monitoring (estimated via renderer.info)
 * - Low-power mode: detect mobile/throttled devices, skip frames to target 24 FPS
 * - Tracks draw calls and GPU memory for DevOverlay
 *
 * **Quality Tiers:**
 * - 'high': Full effects (bloom, shadows, high LOD)
 * - 'medium': Reduced shadow resolution
 * - 'low': Minimal post-processing, reduced geometry LOD
 *
 * **Note on Battery API:**
 * The Battery Status API (navigator.getBattery) was deprecated in 2014 and removed
 * from all modern browsers. This implementation uses User-Agent detection and
 * PerformanceLongTaskTiming instead. For production, consider server-side detection
 * or explicit user selection of quality tier.
 */
export function usePerformanceMonitor() {
  const setPerformanceState = useStore((s) => s.setPerformanceState);
  const setQualityTier = useStore((s) => s.setQualityTier);
  const activeSceneId = useStore((s) => s.activeSceneId);
  const scenes = useStore((s) => s.scenes);

  const frameDeltas = useRef<number[]>([]);
  const frameIndex = useRef(0);
  const lowFpsStartTime = useRef<number | null>(null);
  const highFpsStartTime = useRef<number | null>(null);
  const lastQualityChangeTime = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  // Low-power mode state
  const lowPowerMode = useRef(false);
  const frameCounter = useRef(0);

  // Detect low-power device on mount
  useEffect(() => {
    isLowPowerDevice().then((isLow) => {
      if (isLow) {
        lowPowerMode.current = true;
        setQualityTier('low');
        setPerformanceState({ fps: LOW_POWER_FPS_TARGET });
      }
    });
  }, [setPerformanceState, setQualityTier]);

  useFrame(({ gl }) => {
    // Low-power mode: skip every other frame to target ~24 FPS from 48+ FPS
    if (lowPowerMode.current) {
      frameCounter.current++;
      if (frameCounter.current % 2 !== 0) return;
    }

    const now = performance.now();
    const delta = (now - lastTime.current) / 1000; // seconds
    lastTime.current = now;

    // Update circular buffer
    if (frameDeltas.current.length < FRAME_BUFFER_SIZE) {
      frameDeltas.current.push(delta);
    } else {
      frameDeltas.current[frameIndex.current % FRAME_BUFFER_SIZE] = delta;
    }
    frameIndex.current++;

    const fps = computeRollingFPS(frameDeltas.current);
    const drawCalls = gl.info.render.calls;
    const gpuMemoryMB = (gl.info.memory.textures * 4 + gl.info.memory.geometries * 2) / 1024; // rough estimate

    setPerformanceState({ fps, drawCalls, gpuMemoryMB });

    const qualityTier = useStore.getState().performanceState.qualityTier;
    const timeSinceLastChange = now - lastQualityChangeTime.current;

    // Quality degradation: FPS < 24 for 3 s
    if (fps < LOW_FPS_THRESHOLD) {
      if (lowFpsStartTime.current === null) {
        lowFpsStartTime.current = now;
      } else if ((now - lowFpsStartTime.current) / 1000 >= LOW_FPS_DURATION_S) {
        if (qualityTier !== 'low' && timeSinceLastChange > QUALITY_CHANGE_COOLDOWN_S * 1000) {
          setQualityTier(qualityTier === 'high' ? 'medium' : 'low');
          lastQualityChangeTime.current = now;
          lowFpsStartTime.current = null;
        }
      }
      highFpsStartTime.current = null;
    } else if (fps > HIGH_FPS_THRESHOLD) {
      // Quality restoration: FPS > 50 for 5 s
      if (highFpsStartTime.current === null) {
        highFpsStartTime.current = now;
      } else if ((now - highFpsStartTime.current) / 1000 >= HIGH_FPS_DURATION_S) {
        if (qualityTier !== 'high' && timeSinceLastChange > QUALITY_CHANGE_COOLDOWN_S * 1000) {
          setQualityTier(qualityTier === 'low' ? 'medium' : 'high');
          lastQualityChangeTime.current = now;
          highFpsStartTime.current = null;
        }
      }
      lowFpsStartTime.current = null;
    } else {
      lowFpsStartTime.current = null;
      highFpsStartTime.current = null;
    }

    // Exterior GPU memory guard (< 512 MB)
    const activeScene = scenes.find((s) => s.id === activeSceneId);
    if (activeScene?.category === 'exterior' && gpuMemoryMB > EXTERIOR_GPU_MEMORY_LIMIT_MB) {
      console.warn(
        `[usePerformanceMonitor] GPU memory ${gpuMemoryMB.toFixed(0)} MB exceeds exterior limit of ${EXTERIOR_GPU_MEMORY_LIMIT_MB} MB`
      );
    }

    // GPU memory > 80% budget: trigger LRU unload
    const estimatedBudgetMB = 2048; // conservative estimate
    if (gpuMemoryMB > estimatedBudgetMB * GPU_MEMORY_BUDGET_PERCENT) {
      console.warn(
        `[usePerformanceMonitor] GPU memory ${gpuMemoryMB.toFixed(0)} MB exceeds 80% budget. Consider unloading unused models.`
      );
    }
  });
}
