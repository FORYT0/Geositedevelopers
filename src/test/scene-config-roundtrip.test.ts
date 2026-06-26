// Feature: geosite-developers, Property 22: Scene configuration round-trip serialization preserves equivalence
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SceneConfigSchema, ScenesFileSchema } from '../lib/scene-schema';
import type { SceneConfig } from '../lib/scene-config';

// Arbitraries
const easingArb = fc.constantFrom('linear' as const, 'easeIn' as const, 'easeOut' as const, 'easeInOut' as const);

const finiteFloatArb = fc.float({ noNaN: true, noDefaultInfinity: true });

const cameraKeyframeArb = fc.record({
  scrollProgress: fc.float({ min: 0, max: 1, noNaN: true }),
  position: fc.tuple(finiteFloatArb, finiteFloatArb, finiteFloatArb),
  target: fc.tuple(finiteFloatArb, finiteFloatArb, finiteFloatArb),
  easing: fc.option(easingArb, { nil: undefined }),
});

const interactiveElementArb = fc.record({
  meshName: fc.string({ minLength: 1, maxLength: 50 }),
  animationClipName: fc.string({ minLength: 1, maxLength: 50 }),
  reverseClipName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
});

const directionalLightArb = fc.record({
  intensity: fc.float({ min: 0, max: 10, noNaN: true, noDefaultInfinity: true }),
  position: fc.tuple(finiteFloatArb, finiteFloatArb, finiteFloatArb),
  color: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
});

const lightingPresetArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }),
  label: fc.string({ minLength: 1, maxLength: 30 }),
  envMapPath: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  ambientIntensity: fc.float({ min: 0, max: 2, noNaN: true, noDefaultInfinity: true }),
  directionalLights: fc.array(directionalLightArb, { maxLength: 5 }),
});

const sceneConfigArb: fc.Arbitrary<SceneConfig> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom('exterior' as const, 'interior' as const),
  modelPath: fc.oneof(
    fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}.glb`),
    fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}.gltf`),
  ),
  thumbnailPath: fc.string({ minLength: 1, maxLength: 100 }),
  cameraPath: fc.array(cameraKeyframeArb, { minLength: 2, maxLength: 10 }),
  interactiveElements: fc.array(interactiveElementArb, { maxLength: 10 }),
  lightingPresets: fc.array(lightingPresetArb, { minLength: 1, maxLength: 5 }),
  defaultLightingPreset: fc.string({ minLength: 1, maxLength: 30 }),
});

describe('Property 22: Scene configuration round-trip serialization preserves equivalence', () => {
  it('serializing then deserializing a SceneConfig produces a deeply equal object', () => {
    fc.assert(
      fc.property(sceneConfigArb, (config) => {
        const serialized = JSON.stringify(config);
        const deserialized = JSON.parse(serialized);
        // Validate through schema to ensure it's still valid
        const parsed = SceneConfigSchema.parse(deserialized);
        // Deep equality check (excluding undefined fields stripped by JSON)
        expect(parsed).toEqual(deserialized);
        // Key fields must match original
        expect(parsed.id).toBe(config.id);
        expect(parsed.title).toBe(config.title);
        expect(parsed.category).toBe(config.category);
        expect(parsed.modelPath).toBe(config.modelPath);
        expect(parsed.cameraPath.length).toBe(config.cameraPath.length);
      }),
      { numRuns: 100 }
    );
  });

  it('serializing then deserializing a ScenesFile preserves all scene entries', () => {
    fc.assert(
      fc.property(fc.array(sceneConfigArb, { minLength: 1, maxLength: 5 }), (scenes) => {
        const file = { scenes };
        const serialized = JSON.stringify(file);
        const deserialized = JSON.parse(serialized);
        const parsed = ScenesFileSchema.parse(deserialized);
        expect(parsed.scenes.length).toBe(scenes.length);
        parsed.scenes.forEach((scene, i) => {
          expect(scene.id).toBe(scenes[i].id);
          expect(scene.category).toBe(scenes[i].category);
        });
      }),
      { numRuns: 100 }
    );
  });
});
