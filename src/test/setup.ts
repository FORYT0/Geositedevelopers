import "@testing-library/jest-dom";

// Stub WebGL2RenderingContext so @react-three/xr's emulator doesn't throw in jsdom
if (typeof WebGL2RenderingContext === 'undefined') {
  (globalThis as Record<string, unknown>).WebGL2RenderingContext = class WebGL2RenderingContext {};
}
