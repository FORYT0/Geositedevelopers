// Build-time validation tests for scenes.json schema
import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import { ScenesFileSchema, SceneConfigSchema } from '../lib/scene-schema';

const validScene = {
  id: 'test-scene',
  title: 'Test Scene',
  category: 'exterior' as const,
  modelPath: '/models/test.glb',
  thumbnailPath: '/thumbnails/test.jpg',
  cameraPath: [
    { scrollProgress: 0, position: [0, 0, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
    { scrollProgress: 1, position: [0, 5, 5] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
  ],
  interactiveElements: [],
  lightingPresets: [
    { id: 'day', label: 'Day', ambientIntensity: 0.5, directionalLights: [] },
  ],
  defaultLightingPreset: 'day',
};

describe('Build-time scene config validation', () => {
  it('valid scenes.json passes without errors', () => {
    const result = ScenesFileSchema.safeParse({ scenes: [validScene] });
    expect(result.success).toBe(true);
  });

  it('schema violations produce descriptive error messages', () => {
    const invalid = { ...validScene, category: 'rooftop' };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages.length).toBeGreaterThan(0);
      // Each message should be a non-empty string
      messages.forEach(msg => expect(msg.length).toBeGreaterThan(0));
    }
  });

  it('missing required fields are caught as build errors', () => {
    const missingTitle = { ...validScene };
    // @ts-expect-error intentionally removing required field
    delete missingTitle.title;
    const result = SceneConfigSchema.safeParse(missingTitle);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('title');
    }
  });

  it('invalid modelPath extension is caught', () => {
    const invalid = { ...validScene, modelPath: '/models/test.obj' };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('modelPath');
    }
  });

  it('cameraPath with fewer than 2 keyframes is caught', () => {
    const invalid = { ...validScene, cameraPath: [validScene.cameraPath[0]] };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('empty lightingPresets array is caught', () => {
    const invalid = { ...validScene, lightingPresets: [] };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('scrollProgress outside [0,1] is caught', () => {
    const invalid = {
      ...validScene,
      cameraPath: [
        { scrollProgress: -0.1, position: [0, 0, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
        { scrollProgress: 1, position: [0, 5, 5] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
      ],
    };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
