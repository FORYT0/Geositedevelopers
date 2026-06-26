// Geosite DEVELOPERS — Scene configuration TypeScript interfaces
// Updated imports to use @/ alias for consistency

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export interface CameraKeyframe {
  scrollProgress: number; // 0.0 – 1.0
  position: [number, number, number];
  target: [number, number, number];
  easing?: EasingFunction;
}

export interface InteractiveElement {
  meshName: string;
  animationClipName: string;
  reverseClipName?: string;
}

export interface DirectionalLightConfig {
  intensity: number;
  position: [number, number, number];
  color?: string;
}

export interface LightingPreset {
  id: string;
  label: string; // e.g. "Day", "Night"
  envMapPath?: string;
  ambientIntensity: number;
  directionalLights: DirectionalLightConfig[];
}

export interface SceneConfig {
  id: string;
  title: string;
  category: 'exterior' | 'interior';
  modelPath: string; // path to .glb/.gltf
  thumbnailPath: string;
  cameraPath: CameraKeyframe[];
  interactiveElements: InteractiveElement[];
  lightingPresets: LightingPreset[];
  defaultLightingPreset: string;
}

export interface ScenesFile {
  $schema?: string;
  scenes: SceneConfig[];
}
