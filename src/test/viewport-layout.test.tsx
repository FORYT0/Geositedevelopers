// Feature: geosite-developers, Property 17: Layout is valid for all viewport widths in [320, 3840]
// Validates: Requirements 9.1
import { describe, it, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import fc from 'fast-check';

// Mock the Viewer and other heavy components to avoid WebGL/XR initialization in jsdom
vi.mock('../components/viewer/Viewer', () => ({
  Viewer: () => null,
}));
vi.mock('../components/ui/ModelCatalog', () => ({
  ModelCatalog: () => null,
  filterByCategory: (scenes: unknown[], cat: string) => scenes,
}));
vi.mock('../components/viewer/XRSessionManager', () => ({
  XRSessionManager: () => null,
  isWebXRSupported: () => false,
}));
vi.mock('../components/ui/DevOverlay', () => ({
  DevOverlay: () => null,
}));
vi.mock('../lib/load-scenes', () => ({
  loadScenes: () => Promise.resolve([]),
}));

import Home from '../../app/page';

afterEach(() => {
  cleanup();
});

describe('Property 17: Layout is valid for all viewport widths in [320, 3840]', () => {
  it('main container enforces no horizontal overflow for any viewport width in [320, 3840]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (width) => {
          // Simulate the viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
          });

          const { container, unmount } = render(<Home />);

          const main = container.querySelector('main') as HTMLElement | null;

          // main element must exist
          if (!main) {
            unmount();
            return false;
          }

          const classList = Array.from(main.classList);

          // width must be `w-full`
          const widthOk = classList.includes('w-full');

          // maxWidth must be `max-w-full`
          const maxWidthOk = classList.includes('max-w-full');

          // overflow must prevent horizontal scrolling
          const overflowOk = classList.includes('overflow-hidden') || classList.includes('overflow-x-hidden');

          unmount();
          return widthOk && maxWidthOk && overflowOk;
        }
      ),
      { numRuns: 100 }
    );
  });
});
