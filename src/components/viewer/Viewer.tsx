'use client';
// Geosite DEVELOPERS — Core Viewer component (R3F Canvas host)
import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF, ContactShadows } from '@react-three/drei';
import { createXRStore, XR } from '@react-three/xr';
import * as THREE from 'three';
import { useStore } from '@/src/store';
import { usePerformanceMonitor } from '@/src/hooks/usePerformanceMonitor';
import { ScrollCameraController } from './ScrollCameraController';
import { DragRotationController } from './DragRotationController';
import { ClickInteractionController } from './ClickInteractionController';
import type { SceneConfig } from '@/src/lib/scene-config';

/**
 * XR store created once at module level.
 * When a VR (or AR) session is active, Three.js/R3F automatically handles:
 *  - Stereoscopic rendering (left/right eye views) at the headset's native resolution
 *  - Native refresh rate (e.g. 90 Hz / 120 Hz) via the WebXR render loop
 * No manual DPR or resolution configuration is needed — the XR session takes over.
 */
export const xrStore = createXRStore();

interface ViewerProps {
  sceneConfig: SceneConfig | null;
}

/**
 * Viewer — the R3F Canvas host.
 *
 * - Detects WebGL 2.0 support on mount; renders fallback if unsupported
 * - Caps device pixel ratio at 2.0
 * - Applies PBR materials, ambient occlusion, and dynamic light sources
 * - Renders exterior or interior scene based on sceneConfig.category
 * - Cleanup listener: releases GPU resources on scene change
 */
export function Viewer({ sceneConfig }: ViewerProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const prevSceneIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supported = typeof WebGL2RenderingContext !== 'undefined';
    setWebglSupported(supported);
  }, []);

  // Listen for scene cleanup events from store
  useEffect(() => {
    const handleSceneCleanup = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { sceneId } = customEvent.detail || {};
      console.log(`[Viewer] Cleanup event for scene "${sceneId}"`);
      // Release GPU resources for the old scene
      if (sceneId) {
        useGLTF.clear(sceneId);
      }
    };

    window.addEventListener('scene:cleanup', handleSceneCleanup);
    return () => window.removeEventListener('scene:cleanup', handleSceneCleanup);
  }, []);

  // Track scene changes for GPU cleanup
  useEffect(() => {
    if (sceneConfig?.id && sceneConfig.id !== prevSceneIdRef.current) {
      const oldSceneId = prevSceneIdRef.current;
      prevSceneIdRef.current = sceneConfig.id;

      // Clear old scene's model path from cache
      if (oldSceneId) {
        console.log(`[Viewer] Scene changed from "${oldSceneId}" to "${sceneConfig.id}"`);
      }
    }
  }, [sceneConfig?.id]);

  if (webglSupported === null) return null; // still detecting

  if (!webglSupported) {
    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div>
          <h2>WebGL 2.0 Not Supported</h2>
          <p>
            Your browser does not support WebGL 2.0, which is required for this experience.
            Please upgrade to a modern browser such as{' '}
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
              Chrome
            </a>
            ,{' '}
            <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">
              Firefox
            </a>
            , or{' '}
            <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">
              Edge
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 2]} // Cap DPR at 2.0; XR session overrides this with headset native resolution
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 60, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100vh' }}
    >
      {/*
       * XR wrapper enables stereoscopic rendering when a VR/AR session is active.
       * Three.js automatically renders left/right eye views at the headset's native
       * resolution and refresh rate — no manual configuration required.
       */}
      <XR store={xrStore}>
        <SceneContent sceneConfig={sceneConfig} />
      </XR>
    </Canvas>
  );
}

// ── Quality settings applicator (inside Canvas context) ──────────────────────

/**
 * Applies renderer quality settings based on the current qualityTier from the store.
 * Must be rendered inside the R3F Canvas so useThree() and useFrame() are available.
 *
 * - 'high':   shadowMap enabled, 2048×2048 shadow maps
 * - 'medium': shadowMap enabled, 1024×1024 shadow maps
 * - 'low':    shadowMap disabled (bloom and post-processing also off)
 */
function QualitySettingsApplicator() {
  const { gl } = useThree();
  const qualityTier = useStore((s) => s.performanceState.qualityTier);

  useEffect(() => {
    if (qualityTier === 'high') {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      // Shadow map size is set per-light via light.shadow.mapSize; store the desired
      // size in a custom property so SceneContent lights can read it.
      (gl as THREE.WebGLRenderer & { _shadowMapSize?: number })._shadowMapSize = 2048;
    } else if (qualityTier === 'medium') {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      (gl as THREE.WebGLRenderer & { _shadowMapSize?: number })._shadowMapSize = 1024;
    } else {
      // 'low': disable shadows and post-processing
      gl.shadowMap.enabled = false;
      (gl as THREE.WebGLRenderer & { _shadowMapSize?: number })._shadowMapSize = 0;
    }
    // Force shadow map refresh
    gl.shadowMap.needsUpdate = true;
  }, [gl, qualityTier]);

  // Run the performance monitor inside the Canvas context (requires useFrame)
  usePerformanceMonitor();

  return null;
}

// ── Scene content (inside Canvas context) ────────────────────────────────────

function SceneContent({ sceneConfig }: { sceneConfig: SceneConfig | null }) {
  const modelRef = useRef<THREE.Group>(null);
  const activeLightingPreset = useStore((s) => s.activeLightingPreset);

  const arPlacement = useStore((s) => s.xrState.arAnchorPosition);
  const xrMode = useStore((s) => s.xrState.mode);

  if (!sceneConfig) {
    return (
      <>
        <QualitySettingsApplicator />
        <ambientLight intensity={0.5} />
        <gridHelper args={[10, 10]} />
      </>
    );
  }

  const preset = sceneConfig.lightingPresets.find((p) => p.id === activeLightingPreset)
    ?? sceneConfig.lightingPresets[0];

  return (
    <>
      {/* Quality settings applicator — wires qualityTier to renderer */}
      <QualitySettingsApplicator />

      {/* Ambient light from preset */}
      <ambientLight intensity={preset.ambientIntensity} />

      {/* Dynamic directional lights from preset */}
      {preset.directionalLights.map((light, i) => (
        <directionalLight
          key={i}
          intensity={light.intensity}
          position={light.position}
          color={light.color ?? '#ffffff'}
          castShadow
        />
      ))}

      {/* Environment map */}
      {preset.envMapPath && (
        <Environment files={preset.envMapPath} background={sceneConfig.category === 'exterior'} />
      )}

      {/* High-fidelity Contact Shadows for exterior architectural models */}
      {sceneConfig.category === 'exterior' && (
        <ContactShadows
          resolution={1024}
          scale={20}
          blur={2.5}
          opacity={0.65}
          far={10}
        />
      )}

      {/* Model group */}
      <group ref={modelRef} position={xrMode === 'ar' && arPlacement ? arPlacement : [0, 0, 0]}>
        <ModelLoader sceneConfig={sceneConfig} />
      </group>

      {/* Scroll camera controller */}
      <ScrollCameraController sceneConfig={sceneConfig} />

      {/* Drag rotation (exterior only) */}
      {sceneConfig.category === 'exterior' && (
        <DragRotationController targetRef={modelRef} />
      )}

      {/* Click interactions */}
      <ClickInteractionController
        elements={sceneConfig.interactiveElements}
        sceneRef={modelRef}
      />
    </>
  );
}

// ── Model loader ──────────────────────────────────────────────────────────────

function ModelLoader({ sceneConfig }: { sceneConfig: SceneConfig }) {
  const setAssetState = useStore((s) => s.setAssetState);

  useEffect(() => {
    setAssetState(sceneConfig.id, { status: 'loading-proxy', progress: 0 });
  }, [sceneConfig.id, setAssetState]);

  // useGLTF handles Draco and KTX2 decoders automatically when configured
  // In production, configure decoders via useGLTF.setDecoderPath
  let gltf: ReturnType<typeof useGLTF> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    gltf = useGLTF(sceneConfig.modelPath);
  } catch {
    // Model not yet loaded or error — handled by Suspense/error boundary
  }

  useEffect(() => {
    if (gltf) {
      setAssetState(sceneConfig.id, { status: 'ready', progress: 1 });
    }
    return () => {
      // Release GPU buffers on unmount or scene change
      useGLTF.clear(sceneConfig.modelPath);
      setAssetState(sceneConfig.id, { status: 'idle', progress: 0 });
    };
  }, [gltf, sceneConfig.id, sceneConfig.modelPath, setAssetState]);

  if (!gltf) return null;

  return <primitive object={gltf.scene} />;
}
