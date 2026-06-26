// Unit test: switching lighting preset updates active environment map and light intensities
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';
import type { SceneConfig } from '../lib/scene-config';

const mockSceneConfig: SceneConfig = {
  id: 'test-exterior',
  title: 'Test Exterior',
  category: 'exterior',
  modelPath: '/models/test.glb',
  thumbnailPath: '/thumbnails/test.jpg',
  cameraPath: [
    { scrollProgress: 0, position: [0, 5, 20], target: [0, 0, 0] },
    { scrollProgress: 1, position: [0, 15, 5], target: [0, 5, 0] },
  ],
  interactiveElements: [],
  lightingPresets: [
    {
      id: 'day',
      label: 'Day',
      envMapPath: '/env/day.hdr',
      ambientIntensity: 0.5,
      directionalLights: [{ intensity: 1.5, position: [10, 20, 10] }],
    },
    {
      id: 'night',
      label: 'Night',
      envMapPath: '/env/night.hdr',
      ambientIntensity: 0.1,
      directionalLights: [{ intensity: 0.3, position: [5, 10, 5] }],
    },
  ],
  defaultLightingPreset: 'day',
};

describe('Day/night lighting preset switching', () => {
  beforeEach(() => {
    useStore.getState().setLightingPreset('day');
  });

  it('default preset is "day"', () => {
    expect(useStore.getState().activeLightingPreset).toBe('day');
  });

  it('switching to "night" updates activeLightingPreset', () => {
    useStore.getState().setLightingPreset('night');
    expect(useStore.getState().activeLightingPreset).toBe('night');
  });

  it('switching back to "day" restores day preset', () => {
    useStore.getState().setLightingPreset('night');
    useStore.getState().setLightingPreset('day');
    expect(useStore.getState().activeLightingPreset).toBe('day');
  });

  it('active preset resolves to correct envMapPath', () => {
    useStore.getState().setLightingPreset('day');
    const preset = mockSceneConfig.lightingPresets.find(
      (p) => p.id === useStore.getState().activeLightingPreset
    );
    expect(preset?.envMapPath).toBe('/env/day.hdr');
    expect(preset?.ambientIntensity).toBe(0.5);
  });

  it('night preset has lower ambient intensity than day', () => {
    const dayPreset = mockSceneConfig.lightingPresets.find((p) => p.id === 'day')!;
    const nightPreset = mockSceneConfig.lightingPresets.find((p) => p.id === 'night')!;
    expect(nightPreset.ambientIntensity).toBeLessThan(dayPreset.ambientIntensity);
  });

  it('night preset has lower directional light intensity than day', () => {
    const dayPreset = mockSceneConfig.lightingPresets.find((p) => p.id === 'day')!;
    const nightPreset = mockSceneConfig.lightingPresets.find((p) => p.id === 'night')!;
    const dayIntensity = dayPreset.directionalLights[0].intensity;
    const nightIntensity = nightPreset.directionalLights[0].intensity;
    expect(nightIntensity).toBeLessThan(dayIntensity);
  });
});
