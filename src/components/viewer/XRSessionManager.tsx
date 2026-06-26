'use client';
// Geosite DEVELOPERS — XR Session Manager
import { useStore } from '@/src/store';
import { xrStore } from './Viewer';

export interface XRSessionManagerProps {
  sceneCategory: 'exterior' | 'interior';
}

/**
 * Detects WebXR support.
 * Returns true if navigator.xr is available.
 */
export function isWebXRSupported(): boolean {
  return typeof navigator !== 'undefined' && 'xr' in navigator;
}

/**
 * XRSessionManager — manages AR/VR session entry for scenes.
 *
 * **XR Limitations & Known Issues:**
 *
 * **AR (Augmented Reality):**
 * - Only works on devices with ARCore (Android) or ARKit (iOS)
 * - Requires HTTPS origin (except localhost)
 * - Camera permissions must be granted by user
 * - AR anchor positioning may be inaccurate:
 *   - Relies on device's visual tracking system
 *   - May drift over time (minutes-level accuracy)
 *   - Works best in well-lit environments with rich visual features
 *   - Fails in featureless scenes (blank walls, uniform surfaces)
 * - Light estimation is device-dependent; may not match real environment
 * - Occlusion (objects behind real-world surfaces) is not supported
 *
 * **VR (Virtual Reality):**
 * - Requires VR headset (Oculus, PlayStation VR, SteamVR, etc.)
 * - Headset must be paired and detected by browser
 * - Some browsers require user gesture (click) to enter VR (security requirement)
 * - Controller input mapping varies by device; normalize in event handlers
 * - Eye tracking not supported (most headsets don't expose this)
 * - Hand tracking available on newer devices but inconsistent
 *
 * **General XR Limitations:**
 * - WebXR API still in draft status; implementations vary by browser
 * - Feature detection required; graceful degradation on unsupported platforms
 * - Session must be created in response to user gesture (security requirement)
 * - Multiple concurrent XR sessions not supported
 * - GPU/CPU overhead during XR sessions; monitor performance
 *
 * **Recommendations:**
 * - Test AR on actual mobile devices (emulators may not support WebXR)
 * - Provide fallback 2D experience when XR unavailable
 * - Use viewport-aware rendering: render lower LOD models in AR/VR to save GPU
 * - Monitor device battery during XR sessions; use power-saving mode if available
 * - Request minimal camera permissions; explain why they're needed
 */
export function XRSessionManager({ sceneCategory }: XRSessionManagerProps) {
  const setXRMode = useStore((s) => s.setXRMode);
  const setXRSessionActive = useStore((s) => s.setXRSessionActive);
  const webXRSupported = isWebXRSupported();

  const enterAR = () => {
    if (!webXRSupported) return;
    setXRMode('ar');
    setXRSessionActive(true);
    xrStore.enterAR();
  };

  const enterVR = () => {
    if (!webXRSupported) return;
    setXRMode('vr');
    setXRSessionActive(true);
    xrStore.enterVR();
  };

  if (!webXRSupported) return null;

  if (sceneCategory === 'exterior') {
    return (
      <button
        data-testid="ar-button"
        onClick={enterAR}
        className="fixed bottom-6 right-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Enter AR"
      >
        Enter AR
      </button>
    );
  }

  if (sceneCategory === 'interior') {
    return (
      <button
        data-testid="vr-button"
        onClick={enterVR}
        className="fixed bottom-6 right-6 bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 transition"
        aria-label="Enter VR"
      >
        Enter VR
      </button>
    );
  }

  return null;
}
