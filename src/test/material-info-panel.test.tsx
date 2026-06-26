// Feature: geosite-developers, Property 13: Material surface click displays material name and finish in overlay
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import fc from 'fast-check';
import { MaterialInfoPanel } from '../components/ui/MaterialInfoPanel';

// Validates: Requirements 7.4

describe('Property 13: Material surface click displays material name and finish in overlay', () => {
  it('property: for any materialName and finishSpec, panel displays both values', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 80 }),
        fc.string({ minLength: 1, maxLength: 80 }),
        (materialName, finishSpec) => {
          const { unmount } = render(
            <MaterialInfoPanel materialName={materialName} finishSpec={finishSpec} />
          );

          const nameEl = screen.getByTestId('material-name');
          const specEl = screen.getByTestId('finish-spec');

          const nameOk = nameEl.textContent === materialName;
          const specOk = specEl.textContent === finishSpec;

          unmount();
          return nameOk && specOk;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Unit: material surface click shows MaterialInfoPanel with correct data', () => {
  // Parent component that simulates a click on a surface and shows the panel
  function SurfaceWithPanel({
    materialName,
    finishSpec,
  }: {
    materialName: string;
    finishSpec: string;
  }) {
    const [clicked, setClicked] = useState(false);

    return (
      <div>
        <div
          data-testid="material-surface"
          onClick={() => setClicked(true)}
          style={{ width: 100, height: 100, background: '#888' }}
        />
        {clicked && (
          <MaterialInfoPanel
            materialName={materialName}
            finishSpec={finishSpec}
            onClose={() => setClicked(false)}
          />
        )}
      </div>
    );
  }

  it('panel is not visible before click', () => {
    render(<SurfaceWithPanel materialName="Marble" finishSpec="Polished" />);
    expect(screen.queryByTestId('material-info-panel')).not.toBeInTheDocument();
  });

  it('clicking the surface shows MaterialInfoPanel with correct materialName and finishSpec', () => {
    render(<SurfaceWithPanel materialName="Oak Veneer" finishSpec="Matte Lacquer" />);

    fireEvent.click(screen.getByTestId('material-surface'));

    expect(screen.getByTestId('material-info-panel')).toBeInTheDocument();
    expect(screen.getByTestId('material-name')).toHaveTextContent('Oak Veneer');
    expect(screen.getByTestId('finish-spec')).toHaveTextContent('Matte Lacquer');
  });

  it('closing the panel hides it', () => {
    render(<SurfaceWithPanel materialName="Concrete" finishSpec="Raw" />);

    fireEvent.click(screen.getByTestId('material-surface'));
    expect(screen.getByTestId('material-info-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-button'));
    expect(screen.queryByTestId('material-info-panel')).not.toBeInTheDocument();
  });
});
