// Feature: geosite-developers, Property 4: Only .glb and .gltf paths are accepted by the Asset_Loader
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { isValidModelPath } from '../hooks/useAssetLoader';

// Arbitrary for valid extensions
const validExtArb = fc.constantFrom('.glb', '.gltf', '.GLB', '.GLTF', '.Glb', '.Gltf');
// Arbitrary for invalid extensions
const invalidExtArb = fc.string({ minLength: 1, maxLength: 10 })
  .filter(s => !s.toLowerCase().endsWith('.glb') && !s.toLowerCase().endsWith('.gltf'))
  .map(s => (s.startsWith('.') ? s : `.${s}`));

describe('Property 4: Only .glb and .gltf paths are accepted by the Asset_Loader', () => {
  it('accepts any path ending with .glb or .gltf (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        validExtArb,
        (base, ext) => {
          const path = `/models/${base}${ext}`;
          return isValidModelPath(path) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects paths with any other extension', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        invalidExtArb,
        (base, ext) => {
          const path = `/models/${base}${ext}`;
          return isValidModelPath(path) === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects empty string', () => {
    expect(isValidModelPath('')).toBe(false);
  });

  it('rejects paths with no extension', () => {
    expect(isValidModelPath('/models/mymodel')).toBe(false);
  });

  it('rejects .obj, .fbx, .dae, .stl paths', () => {
    expect(isValidModelPath('/models/test.obj')).toBe(false);
    expect(isValidModelPath('/models/test.fbx')).toBe(false);
    expect(isValidModelPath('/models/test.dae')).toBe(false);
    expect(isValidModelPath('/models/test.stl')).toBe(false);
  });

  it('accepts .glb paths', () => {
    expect(isValidModelPath('/models/tower.glb')).toBe(true);
  });

  it('accepts .gltf paths', () => {
    expect(isValidModelPath('/models/villa.gltf')).toBe(true);
  });
});
