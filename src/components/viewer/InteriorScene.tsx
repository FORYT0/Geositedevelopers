'use client';
// Geosite DEVELOPERS — Interior scene rendering
import * as THREE from 'three';
import { useStore } from '@/src/store';
import { InteriorCameraController } from './InteriorCameraController';
import type { SceneConfig } from '@/src/lib/scene-config';

interface InteriorSceneProps {
  sceneConfig: SceneConfig;
}

/**
 * InteriorScene — renders interior-specific features:
 * - Baked ambient occlusion (via AO map on materials)
 * - At least two interior light sources (ceiling + accent)
 * - First-person walkthrough camera
 */
export function InteriorScene({ sceneConfig }: InteriorSceneProps) {
  const activeLightingPreset = useStore((s) => s.activeLightingPreset);
  const preset = sceneConfig.lightingPresets.find((p) => p.id === activeLightingPreset)
    ?? sceneConfig.lightingPresets[0];

  return (
    <>
      {/* Ambient light for baked AO simulation */}
      <ambientLight intensity={preset.ambientIntensity} />

      {/* Ceiling light (primary interior light source) */}
      <pointLight
        position={[0, 3, 0]}
        intensity={preset.directionalLights[0]?.intensity ?? 1.0}
        color={preset.directionalLights[0]?.color ?? '#fff5e0'}
        castShadow
        shadow-mapSize={[512, 512]}
      />

      {/* Accent light (secondary interior light source) */}
      <pointLight
        position={[3, 2, -3]}
        intensity={preset.directionalLights[1]?.intensity ?? 0.5}
        color={preset.directionalLights[1]?.color ?? '#ffffff'}
      />

      {/* Additional directional lights from preset */}
      {preset.directionalLights.slice(2).map((light, i) => (
        <directionalLight
          key={i}
          intensity={light.intensity}
          position={light.position}
          color={light.color ?? '#ffffff'}
        />
      ))}

      {/* Interior walkthrough camera */}
      <InteriorCameraController sceneConfig={sceneConfig} />
    </>
  );
}
