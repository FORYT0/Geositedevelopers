// Feature: geosite-developers, Property 20: All UI_Overlay interactive controls have touch targets ≥ 44 × 44 CSS pixels
// Validates: Requirements 9.5
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import fc from 'fast-check';
import { ModelCatalog } from '../components/ui/ModelCatalog';
import { LightingPresetToggle } from '../components/ui/LightingPresetToggle';
import { ErrorCard } from '../components/ui/ErrorCard';
import { MaterialInfoPanel } from '../components/ui/MaterialInfoPanel';
import { useStore } from '../store';
import type { LightingPreset, SceneConfig } from '../lib/scene-config';

/** Parse a CSS pixel value like "44px" → 44. Returns 0 if unparseable. */
function parsePx(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

/** Extract a pixel value from either style or tailwind min-w-[XXpx]/min-h-[XXpx] classes. */
function getMinTouchTarget(btn: HTMLElement, axis: 'w' | 'h'): number {
  const inline = parsePx(axis === 'w' ? btn.style.minWidth : btn.style.minHeight);
  if (inline >= 44) return inline;
  const match = btn.className.match(new RegExp(`min-${axis}-\\[(\\d+)px\\]`));
  if (match) return parsePx(match[1]);
  // Also handle hardcoded tailwind spacing if applicable, e.g. w-11 = 44px
  if (btn.className.includes(`${axis}-11`)) return 44;
  return 0;
}

/** Assert every button in the container has minWidth and minHeight ≥ 44 px. */
function assertTouchTargets(container: HTMLElement): void {
  const buttons = container.querySelectorAll<HTMLElement>('button, [role="button"]');
  expect(buttons.length).toBeGreaterThan(0);
  for (const btn of buttons) {
    const minW = getMinTouchTarget(btn, 'w');
    const minH = getMinTouchTarget(btn, 'h');
    expect(minW, `button "${btn.textContent?.trim()}" minWidth should be ≥ 44`).toBeGreaterThanOrEqual(44);
    expect(minH, `button "${btn.textContent?.trim()}" minHeight should be ≥ 44`).toBeGreaterThanOrEqual(44);
  }
}

// ── Arbitraries ──────────────────────────────────────────────────────────────

const lightingPresetArb: fc.Arbitrary<LightingPreset> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 12 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  label: fc.string({ minLength: 1, maxLength: 20 }),
  ambientIntensity: fc.float({ min: 0, max: 2 }),
  directionalLights: fc.constant([]),
});

const presetsArb: fc.Arbitrary<LightingPreset[]> = fc
  .array(lightingPresetArb, { minLength: 1, maxLength: 5 })
  // Deduplicate by id
  .map(presets => presets.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i))
  .filter(presets => presets.length >= 1);

const errorMessageArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 200 });

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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Property 20: All UI_Overlay interactive controls have touch targets ≥ 44 × 44 CSS pixels', () => {

  describe('ModelCatalog', () => {
    beforeEach(() => {
      useStore.getState().setScenes([
        makeScene('ext-1', 'exterior'),
        makeScene('int-1', 'interior'),
      ]);
    });

    it('filter buttons and scene cards have minWidth/minHeight ≥ 44px', () => {
      const { container } = render(<ModelCatalog />);
      assertTouchTargets(container);
    });
  });

  describe('LightingPresetToggle', () => {
    it('preset buttons have minWidth/minHeight ≥ 44px (static)', () => {
      const presets: LightingPreset[] = [
        { id: 'day', label: 'Day', ambientIntensity: 0.8, directionalLights: [] },
        { id: 'night', label: 'Night', ambientIntensity: 0.1, directionalLights: [] },
      ];
      const { container } = render(
        <LightingPresetToggle presets={presets} activePresetId="day" onSelect={() => {}} />
      );
      assertTouchTargets(container);
    });

    it('property: for any array of presets, all preset buttons have touch targets ≥ 44px', () => {
      fc.assert(
        fc.property(presetsArb, (presets) => {
          const { container, unmount } = render(
            <LightingPresetToggle
              presets={presets}
              activePresetId={presets[0].id}
              onSelect={() => {}}
            />
          );
          const buttons = container.querySelectorAll<HTMLElement>('button');
          let allValid = buttons.length === presets.length;
          for (const btn of buttons) {
            if (getMinTouchTarget(btn, 'w') < 44 || getMinTouchTarget(btn, 'h') < 44) {
              allValid = false;
              break;
            }
          }
          unmount();
          return allValid;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('ErrorCard', () => {
    it('retry button has minWidth/minHeight ≥ 44px (static)', () => {
      const { container } = render(
        <ErrorCard errorMessage="Failed to load model." onRetry={() => {}} />
      );
      assertTouchTargets(container);
    });

    it('property: for any error message, retry button has touch targets ≥ 44px', () => {
      fc.assert(
        fc.property(errorMessageArb, (msg) => {
          const { container, unmount } = render(
            <ErrorCard errorMessage={msg} onRetry={() => {}} />
          );
          const buttons = container.querySelectorAll<HTMLElement>('button');
          let allValid = buttons.length > 0;
          for (const btn of buttons) {
            if (getMinTouchTarget(btn, 'w') < 44 || getMinTouchTarget(btn, 'h') < 44) {
              allValid = false;
              break;
            }
          }
          unmount();
          return allValid;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('MaterialInfoPanel', () => {
    it('close button has minWidth/minHeight ≥ 44px when onClose is provided', () => {
      const { container } = render(
        <MaterialInfoPanel
          materialName="Polished Concrete"
          finishSpec="Matte, 600 grit"
          onClose={() => {}}
        />
      );
      assertTouchTargets(container);
    });
  });
});
