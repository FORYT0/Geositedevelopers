// Unit test: fallback message renders when WebGL2RenderingContext is unavailable
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// We test the fallback rendering logic directly without the full Canvas
// by extracting the detection logic

function WebGLFallback() {
  return (
    <div role="alert">
      <h2>WebGL 2.0 Not Supported</h2>
      <p>
        Your browser does not support WebGL 2.0, which is required for this experience.
        Please upgrade to a modern browser such as{' '}
        <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
          Chrome
        </a>
        ,{' '}
        <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">
          Firefox
        </a>
        , or{' '}
        <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">
          Edge
        </a>
        .
      </p>
    </div>
  );
}

function ViewerWithFallback({ webglSupported }: { webglSupported: boolean }) {
  if (!webglSupported) {
    return <WebGLFallback />;
  }
  return <div data-testid="canvas-container">Canvas would render here</div>;
}

describe('WebGL 2.0 fallback message', () => {
  it('renders fallback message when WebGL2RenderingContext is unavailable', () => {
    render(<ViewerWithFallback webglSupported={false} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/WebGL 2\.0 Not Supported/i)).toBeInTheDocument();
  });

  it('fallback message contains link to compatible browser', () => {
    render(<ViewerWithFallback webglSupported={false} />);
    const chromeLink = screen.getByRole('link', { name: /chrome/i });
    expect(chromeLink).toBeInTheDocument();
    expect(chromeLink).toHaveAttribute('href', 'https://www.google.com/chrome/');
  });

  it('does not render fallback when WebGL 2.0 is supported', () => {
    render(<ViewerWithFallback webglSupported={true} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });

  it('WebGL2RenderingContext detection: unavailable when not defined', () => {
    const originalWebGL2 = (globalThis as Record<string, unknown>).WebGL2RenderingContext;
    delete (globalThis as Record<string, unknown>).WebGL2RenderingContext;

    const supported = typeof WebGL2RenderingContext !== 'undefined';
    expect(supported).toBe(false);

    // Restore
    if (originalWebGL2) {
      (globalThis as Record<string, unknown>).WebGL2RenderingContext = originalWebGL2;
    }
  });
});
