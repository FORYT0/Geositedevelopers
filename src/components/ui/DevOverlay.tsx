'use client';
// Geosite DEVELOPERS — Developer overlay (Shift+D to toggle)
import { useEffect } from 'react';
import { useStore } from '@/src/store';

/**
 * DevOverlay — displays FPS, draw calls, and GPU memory.
 * Toggled via Shift+D keyboard shortcut.
 * 
 * **Metrics:**
 * - FPS: Rolling average over 120 frames (harmonic mean)
 * - Draw Calls: WebGL draw call count per frame
 * - GPU Memory: Estimated from renderer.info.memory
 * - Quality Tier: Current adaptive quality level (high/medium/low)
 */
export function DevOverlay() {
  const toggleDevOverlay = useStore((s) => s.toggleDevOverlay);
  const devOverlayVisible = useStore((s) => s.performanceState.devOverlayVisible);
  const fps = useStore((s) => s.performanceState.fps);
  const drawCalls = useStore((s) => s.performanceState.drawCalls);
  const gpuMemoryMB = useStore((s) => s.performanceState.gpuMemoryMB);
  const qualityTier = useStore((s) => s.performanceState.qualityTier);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        toggleDevOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDevOverlay]);

  if (!devOverlayVisible) return null;

  return (
    <div
      data-testid="dev-overlay"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        background: 'rgba(0,0,0,0.75)',
        color: '#00ff88',
        fontFamily: 'monospace',
        fontSize: 13,
        padding: '12px 16px',
        borderRadius: 6,
        zIndex: 9999,
        minWidth: 180,
        pointerEvents: 'none',
      }}
    >
      <div data-testid="dev-fps">FPS: {fps.toFixed(1)}</div>
      <div data-testid="dev-draw-calls">Draw Calls: {drawCalls}</div>
      <div data-testid="dev-gpu-memory">GPU Memory: {gpuMemoryMB.toFixed(1)} MB</div>
      <div data-testid="dev-quality">Quality: {qualityTier}</div>
      <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>Shift+D to close</div>
    </div>
  );
}
