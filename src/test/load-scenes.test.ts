// Feature: geosite-developers, Property 23: Scene configs with unresolvable model paths are excluded from the catalog
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

// We test the filtering logic directly by mocking fetch
// The loadScenes function uses fetch internally

const makeScene = (id: string, modelPath: string) => ({
  id,
  title: `Scene ${id}`,
  category: 'exterior' as const,
  modelPath,
  thumbnailPath: `/thumbnails/${id}.jpg`,
  cameraPath: [
    { scrollProgress: 0, position: [0, 0, 10] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
    { scrollProgress: 1, position: [0, 5, 5] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
  ],
  interactiveElements: [],
  lightingPresets: [{ id: 'day', label: 'Day', ambientIntensity: 0.5, directionalLights: [] }],
  defaultLightingPreset: 'day',
});

describe('Property 23: Scene configs with unresolvable model paths are excluded from the catalog', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('excludes scenes with unresolvable model paths and logs a warning', async () => {
    const { loadScenes } = await import('../lib/load-scenes');

    const goodScene = makeScene('good-scene', '/models/good.glb');
    const badScene = makeScene('bad-scene', '/models/bad.glb');
    const scenesJson = { scenes: [goodScene, badScene] };

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string, opts?: RequestInit) => {
      if (opts?.method === 'HEAD') {
        // good.glb resolves, bad.glb does not
        if (url.includes('good.glb')) return Promise.resolve({ ok: true });
        return Promise.resolve({ ok: false, status: 404 });
      }
      // scenes.json fetch
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(scenesJson),
      });
    });

    const result = await loadScenes();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('good-scene');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('bad-scene'),
    );

    warnSpy.mockRestore();
  });

  it('returns empty array when all model paths are unresolvable', async () => {
    // Re-import to get fresh module (vi.resetModules not needed since we mock fetch)
    const { loadScenes } = await import('../lib/load-scenes');

    const scenes = [
      makeScene('scene-a', '/models/a.glb'),
      makeScene('scene-b', '/models/b.gltf'),
    ];

    (fetch as ReturnType<typeof vi.fn>).mockImplementation((_url: string, opts?: RequestInit) => {
      if (opts?.method === 'HEAD') return Promise.resolve({ ok: false, status: 404 });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ scenes }) });
    });

    const result = await loadScenes();
    expect(result).toHaveLength(0);
  });

  it('property: for any mix of resolvable/unresolvable paths, only resolvable ones are returned', async () => {
    const { loadScenes } = await import('../lib/load-scenes');

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
            resolvable: fc.boolean(),
          }),
          { minLength: 1, maxLength: 8 }
        ),
        async (entries) => {
          const scenes = entries.map(({ id, resolvable: _ }) =>
            makeScene(id, `/models/${id}.glb`)
          );
          const resolvableIds = new Set(
            entries.filter(e => e.resolvable).map(e => e.id)
          );

          (fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string, opts?: RequestInit) => {
            if (opts?.method === 'HEAD') {
              // Match exact path: /models/{id}.glb
              const match = entries.find(e => url === `/models/${e.id}.glb`);
              const ok = match ? resolvableIds.has(match.id) : false;
              return Promise.resolve({ ok, status: ok ? 200 : 404 });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ scenes }) });
          });

          const result = await loadScenes();
          const resultIds = new Set(result.map(s => s.id));

          // Every returned scene must have been resolvable
          for (const id of resultIds) {
            if (!resolvableIds.has(id)) return false;
          }
          // Every resolvable scene must be in the result
          for (const id of resolvableIds) {
            if (!resultIds.has(id)) return false;
          }
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
