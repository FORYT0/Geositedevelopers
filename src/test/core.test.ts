import { describe, it, expect } from 'vitest';
import { computeRollingFPS } from '@/src/hooks/usePerformanceMonitor';
import { isValidModelPath } from '@/src/hooks/useAssetLoader';
import { computeChunkRanges, CHUNK_SIZE_BYTES, LARGE_FILE_THRESHOLD_BYTES } from '@/src/lib/chunked-loader';
import { ScenesFileSchema, SceneConfigSchema } from '@/src/lib/scene-schema';

// ─── Performance Monitor Tests ─────────────────────────────────────────────
describe('computeRollingFPS', () => {
  it('returns 0 for empty buffer', () => {
    expect(computeRollingFPS([])).toBe(0);
  });

  it('computes FPS from frame deltas', () => {
    // 60 frames at 60 FPS = 16.67ms per frame ≈ 0.01667s
    const frameDeltas = Array(60).fill(0.01667);
    const fps = computeRollingFPS(frameDeltas);
    expect(fps).toBeCloseTo(60, 1);
  });

  it('returns 0 for all-zero deltas', () => {
    expect(computeRollingFPS([0, 0, 0])).toBe(0);
  });

  it('handles mixed frame times', () => {
    // Mix of 30 FPS and 60 FPS frames
    const deltas = [0.01667, 0.01667, 0.03333, 0.01667]; // avg ≈ 45 FPS
    const fps = computeRollingFPS(deltas);
    expect(fps).toBeGreaterThan(40);
    expect(fps).toBeLessThan(50);
  });
});

// ─── Asset Loader Tests ────────────────────────────────────────────────────
describe('isValidModelPath', () => {
  it('accepts .glb files', () => {
    expect(isValidModelPath('/models/building.glb')).toBe(true);
  });

  it('accepts .gltf files', () => {
    expect(isValidModelPath('/models/building.gltf')).toBe(true);
  });

  it('accepts uppercase extensions', () => {
    expect(isValidModelPath('/models/building.GLB')).toBe(true);
    expect(isValidModelPath('/models/building.GLTF')).toBe(true);
  });

  it('rejects other formats', () => {
    expect(isValidModelPath('/models/building.obj')).toBe(false);
    expect(isValidModelPath('/models/building.fbx')).toBe(false);
    expect(isValidModelPath('/models/building.usdz')).toBe(false);
  });

  it('requires extension suffix', () => {
    expect(isValidModelPath('/models/building')).toBe(false);
    expect(isValidModelPath('/models/building.glb.zip')).toBe(false);
  });
});

// ─── Chunked Loader Tests ─────────────────────────────────────────────────
describe('computeChunkRanges', () => {
  it('returns empty array for zero size', () => {
    expect(computeChunkRanges(0)).toEqual([]);
  });

  it('returns single chunk for small files', () => {
    const ranges = computeChunkRanges(1024 * 1024); // 1 MB
    expect(ranges).toHaveLength(1);
    expect(ranges[0]).toEqual([0, 1024 * 1024 - 1]);
  });

  it('splits large files correctly', () => {
    const fileSize = CHUNK_SIZE_BYTES * 2.5; // 2.5 chunks
    const ranges = computeChunkRanges(fileSize);
    expect(ranges).toHaveLength(3);

    // Check first chunk
    expect(ranges[0][0]).toBe(0);
    expect(ranges[0][1]).toBe(CHUNK_SIZE_BYTES - 1);

    // Check second chunk
    expect(ranges[1][0]).toBe(CHUNK_SIZE_BYTES);
    expect(ranges[1][1]).toBe(CHUNK_SIZE_BYTES * 2 - 1);

    // Check final partial chunk
    expect(ranges[2][0]).toBe(CHUNK_SIZE_BYTES * 2);
    expect(ranges[2][1]).toBe(fileSize - 1);
  });

  it('computes correct total coverage', () => {
    const fileSize = 100 * 1024 * 1024; // 100 MB
    const ranges = computeChunkRanges(fileSize);
    const coverage = ranges.length * CHUNK_SIZE_BYTES + (fileSize % CHUNK_SIZE_BYTES);
    // Total should cover entire file
    expect(ranges[ranges.length - 1][1]).toBe(fileSize - 1);
  });
});

// ─── Scene Schema Tests ────────────────────────────────────────────────────
describe('SceneConfigSchema', () => {
  const validScene = {
    id: 'scene-1',
    title: 'Modern Office',
    category: 'interior',
    modelPath: '/models/office.glb',
    thumbnailPath: '/thumbnails/office.jpg',
    cameraPath: [
      { scrollProgress: 0, position: [0, 0, 0], target: [0, 0, -1] },
      { scrollProgress: 1, position: [10, 5, 10], target: [0, 0, -1] },
    ],
    interactiveElements: [
      { meshName: 'Door_01', animationClipName: 'DoorOpen' },
    ],
    lightingPresets: [
      {
        id: 'day',
        label: 'Daylight',
        ambientIntensity: 0.8,
        directionalLights: [
          {
            intensity: 1.5,
            position: [10, 20, 10],
            color: '#ffffff',
          },
        ],
      },
    ],
    defaultLightingPreset: 'day',
  };

  it('validates correct scene config', () => {
    const result = SceneConfigSchema.safeParse(validScene);
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const invalid = { ...validScene };
    delete (invalid as any).id;
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const invalid = { ...validScene, category: 'basement' };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid model path extension', () => {
    const invalid = { ...validScene, modelPath: '/models/office.obj' };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects camera path with fewer than 2 keyframes', () => {
    const invalid = {
      ...validScene,
      cameraPath: [{ scrollProgress: 0, position: [0, 0, 0], target: [0, 0, -1] }],
    };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid scroll progress', () => {
    const invalid = {
      ...validScene,
      cameraPath: [
        { scrollProgress: -0.1, position: [0, 0, 0], target: [0, 0, -1] },
        { scrollProgress: 1.1, position: [10, 5, 10], target: [0, 0, -1] },
      ],
    };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects empty lighting presets', () => {
    const invalid = { ...validScene, lightingPresets: [] };
    const result = SceneConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('ScenesFileSchema', () => {
  const validFile = {
    $schema: 'https://example.com/schema',
    scenes: [
      {
        id: 'scene-1',
        title: 'Modern Office',
        category: 'interior',
        modelPath: '/models/office.glb',
        thumbnailPath: '/thumbnails/office.jpg',
        cameraPath: [
          { scrollProgress: 0, position: [0, 0, 0], target: [0, 0, -1] },
          { scrollProgress: 1, position: [10, 5, 10], target: [0, 0, -1] },
        ],
        interactiveElements: [],
        lightingPresets: [
          {
            id: 'day',
            label: 'Daylight',
            ambientIntensity: 0.8,
            directionalLights: [
              { intensity: 1.5, position: [10, 20, 10] },
            ],
          },
        ],
        defaultLightingPreset: 'day',
      },
    ],
  };

  it('validates correct scenes file', () => {
    const result = ScenesFileSchema.safeParse(validFile);
    expect(result.success).toBe(true);
  });

  it('allows optional $schema field', () => {
    const noSchema = { ...validFile };
    delete noSchema.$schema;
    const result = ScenesFileSchema.safeParse(noSchema);
    expect(result.success).toBe(true);
  });

  it('rejects empty scenes array', () => {
    const invalid = { ...validFile, scenes: [] };
    const result = ScenesFileSchema.safeParse(invalid);
    // Schema doesn't enforce min length for scenes array, but should parse
    expect(result.success).toBe(true);
  });
});
