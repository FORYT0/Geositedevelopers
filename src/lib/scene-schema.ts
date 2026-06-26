// Geosite DEVELOPERS — Zod schemas for build-time scene config validation
import { z } from 'zod';

export const CameraKeyframeSchema = z.object({
  scrollProgress: z.number().min(0).max(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  target: z.tuple([z.number(), z.number(), z.number()]),
  easing: z.enum(['linear', 'easeIn', 'easeOut', 'easeInOut']).optional(),
});

export const InteractiveElementSchema = z.object({
  meshName: z.string().min(1),
  animationClipName: z.string().min(1),
  reverseClipName: z.string().optional(),
});

export const DirectionalLightConfigSchema = z.object({
  intensity: z.number(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  color: z.string().optional(),
});

export const LightingPresetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  envMapPath: z.string().optional(),
  ambientIntensity: z.number(),
  directionalLights: z.array(DirectionalLightConfigSchema),
});

export const SceneConfigSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['exterior', 'interior']),
  modelPath: z.string().regex(/\.(glb|gltf)$/i, 'modelPath must end with .glb or .gltf'),
  thumbnailPath: z.string().min(1),
  cameraPath: z.array(CameraKeyframeSchema).min(2),
  interactiveElements: z.array(InteractiveElementSchema),
  lightingPresets: z.array(LightingPresetSchema).min(1),
  defaultLightingPreset: z.string().min(1),
});

export const ScenesFileSchema = z.object({
  $schema: z.string().optional(),
  scenes: z.array(SceneConfigSchema),
});

export type SceneConfigInput = z.input<typeof SceneConfigSchema>;
export type ScenesFileInput = z.input<typeof ScenesFileSchema>;
