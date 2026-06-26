// Feature: geosite-developers
// Task 16.4: Unit tests for XR conditional rendering
// Requirements: 10.1, 10.2

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { XRSessionManager } from '../components/viewer/XRSessionManager';

function setWebXRSupported() {
  Object.defineProperty(navigator, 'xr', { value: {}, configurable: true, writable: true });
}

function setWebXRUnsupported() {
  // Delete the property so 'xr' in navigator is false
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).xr;
  } catch {
    Object.defineProperty(navigator, 'xr', { value: undefined, configurable: true, writable: true });
  }
}

describe('XR conditional rendering', () => {
  afterEach(() => {
    setWebXRUnsupported();
  });

  it('renders AR button for exterior scene when WebXR is supported', () => {
    setWebXRSupported();
    render(<XRSessionManager sceneCategory="exterior" />);
    expect(screen.getByTestId('ar-button')).toBeInTheDocument();
  });

  it('renders VR button for interior scene when WebXR is supported', () => {
    setWebXRSupported();
    render(<XRSessionManager sceneCategory="interior" />);
    expect(screen.getByTestId('vr-button')).toBeInTheDocument();
  });

  it('renders no buttons when WebXR is unsupported (exterior)', () => {
    setWebXRUnsupported();
    const { container } = render(<XRSessionManager sceneCategory="exterior" />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('ar-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vr-button')).not.toBeInTheDocument();
  });

  it('renders no buttons when WebXR is unsupported (interior)', () => {
    setWebXRUnsupported();
    const { container } = render(<XRSessionManager sceneCategory="interior" />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('ar-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vr-button')).not.toBeInTheDocument();
  });

  it('does not render VR button for exterior scene', () => {
    setWebXRSupported();
    render(<XRSessionManager sceneCategory="exterior" />);
    expect(screen.queryByTestId('vr-button')).not.toBeInTheDocument();
  });

  it('does not render AR button for interior scene', () => {
    setWebXRSupported();
    render(<XRSessionManager sceneCategory="interior" />);
    expect(screen.queryByTestId('ar-button')).not.toBeInTheDocument();
  });
});
