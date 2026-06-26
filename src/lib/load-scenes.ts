// Geosite DEVELOPERS — Runtime scene config loader with unresolvable path filtering
import { ScenesFileSchema } from '@/src/lib/scene-schema';
import type { SceneConfig } from '@/src/lib/scene-config';

/**
 * Checks whether a model path resolves by issuing a HEAD request.
 * Returns true if the server responds with 200-299 status.
 */
async function modelPathExists(modelPath: string): Promise<boolean> {
  try {
    const res = await fetch(modelPath, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetches and validates scenes.json, then filters out entries whose
 * modelPath does not resolve. Logs a console.warn for each excluded entry.
 *
 * Returns the array of valid SceneConfig objects.
 * On error, logs detailed error messages to help with debugging.
 */
export async function loadScenes(): Promise<SceneConfig[]> {
  let raw: unknown;
  try {
    const res = await fetch('/scenes.json');
    if (!res.ok) {
      console.error(
        `[load-scenes] Failed to fetch scenes.json: ${res.status} ${res.statusText}`
      );
      return [];
    }
    raw = await res.json();
  } catch (err) {
    console.error('[load-scenes] Error fetching scenes.json:', err instanceof Error ? err.message : String(err));
    return [];
  }

  const parsed = ScenesFileSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(
      '[load-scenes] scenes.json failed schema validation:',
      parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
    );
    return [];
  }

  const scenes = parsed.data.scenes;

  // Filter out entries with unresolvable model paths
  const results = await Promise.all(
    scenes.map(async (scene) => {
      const exists = await modelPathExists(scene.modelPath);
      if (!exists) {
        console.warn(
          `[load-scenes] Excluding scene "${scene.id}": model path "${scene.modelPath}" could not be resolved.`
        );
        return null;
      }
      return scene;
    })
  );

  return results.filter((s): s is SceneConfig => s !== null);
}
