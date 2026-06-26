// Feature: geosite-developers
// Property 1: Catalog renders required fields for all scene configs
// Property 2: Category filter returns only matching models
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import fc from 'fast-check';
import { ModelCatalog, filterByCategory } from '../components/ui/ModelCatalog';
import { useStore } from '../store';
import type { SceneConfig } from '../lib/scene-config';

// Install @testing-library/user-event if needed — use fireEvent as fallback
import { fireEvent } from '@testing-library/react';

const makeScene = (id: string, category: 'exterior' | 'interior'): SceneConfig => ({
  id,
  title: `Scene ${id}`,
  category,
  modelPath: `/models/${id}.glb`,
  thumbnailPath: `/thumbnails/${id}.jpg`,
  cameraPath: [
    { scrollProgress: 0, position: [0, 0, 10], target: [0, 0, 0] },
    { scrollProgress: 1, position: [0, 5, 5], target: [0, 0, 0] },
  ],
  interactiveElements: [],
  lightingPresets: [{ id: 'day', label: 'Day', ambientIntensity: 0.5, directionalLights: [] }],
  defaultLightingPreset: 'day',
});

const sceneConfigArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  category: fc.constantFrom('exterior' as const, 'interior' as const),
}).map(({ id, category }) => makeScene(id, category));

describe('Property 1: Catalog renders required fields for all scene configs', () => {
  beforeEach(() => {
    useStore.getState().setScenes([]);
  });

  it('renders thumbnail, title, and category badge for each scene', () => {
    const scenes = [
      makeScene('tower-01', 'exterior'),
      makeScene('villa-01', 'interior'),
    ];
    useStore.getState().setScenes(scenes);

    render(<ModelCatalog />);

    for (const scene of scenes) {
      // Thumbnail
      const thumbnail = screen.getByTestId(`thumbnail-${scene.id}`);
      expect(thumbnail).toBeInTheDocument();
      expect(thumbnail).toHaveAttribute('src', scene.thumbnailPath);

      // Title
      expect(screen.getByTestId(`title-${scene.id}`)).toHaveTextContent(scene.title);

      // Category badge
      const badge = screen.getByTestId(`category-badge-${scene.id}`);
      expect(badge).toHaveTextContent(scene.category);
    }
  });

  it('property: for any array of scenes, each card has thumbnail, title, and category', () => {
    fc.assert(
      fc.property(
        fc.array(sceneConfigArb, { minLength: 1, maxLength: 5 }),
        (scenes) => {
          // Deduplicate by id
          const unique = scenes.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
          useStore.getState().setScenes(unique);

          const { unmount } = render(<ModelCatalog />);

          let allPresent = true;
          for (const scene of unique) {
            if (!screen.queryByTestId(`thumbnail-${scene.id}`)) { allPresent = false; break; }
            if (!screen.queryByTestId(`title-${scene.id}`)) { allPresent = false; break; }
            if (!screen.queryByTestId(`category-badge-${scene.id}`)) { allPresent = false; break; }
          }

          unmount();
          return allPresent;
        }
      ),
      { numRuns: 100 } // minimum 100 iterations per spec requirement
    );
  });
});

describe('Property 2: Category filter returns only matching models', () => {
  it('filterByCategory returns only exterior scenes', () => {
    fc.assert(
      fc.property(
        fc.array(sceneConfigArb, { minLength: 1, maxLength: 10 }),
        (scenes) => {
          const unique = scenes.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
          const result = filterByCategory(unique, 'exterior');
          return result.every(s => s.category === 'exterior');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filterByCategory returns only interior scenes', () => {
    fc.assert(
      fc.property(
        fc.array(sceneConfigArb, { minLength: 1, maxLength: 10 }),
        (scenes) => {
          const unique = scenes.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
          const result = filterByCategory(unique, 'interior');
          return result.every(s => s.category === 'interior');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filterByCategory does not drop matching scenes', () => {
    fc.assert(
      fc.property(
        fc.array(sceneConfigArb, { minLength: 1, maxLength: 10 }),
        fc.constantFrom('exterior' as const, 'interior' as const),
        (scenes, category) => {
          const unique = scenes.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
          const matching = unique.filter(s => s.category === category);
          const result = filterByCategory(unique, category);
          return result.length === matching.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('UI filter button shows only matching scenes', () => {
    const scenes = [
      makeScene('ext-1', 'exterior'),
      makeScene('ext-2', 'exterior'),
      makeScene('int-1', 'interior'),
    ];
    useStore.getState().setScenes(scenes);

    render(<ModelCatalog />);

    // Click exterior filter
    fireEvent.click(screen.getByTestId('filter-exterior'));

    expect(screen.getByTestId('scene-card-ext-1')).toBeInTheDocument();
    expect(screen.getByTestId('scene-card-ext-2')).toBeInTheDocument();
    expect(screen.queryByTestId('scene-card-int-1')).not.toBeInTheDocument();
  });
});
