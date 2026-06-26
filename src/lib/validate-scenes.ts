#!/usr/bin/env tsx
// Build-time scene config validator — run via `npm run validate-scenes`
import { readFileSync } from 'fs';
import { join } from 'path';
import { ZodError } from 'zod';
import { ScenesFileSchema } from './scene-schema';

const scenesPath = join(process.cwd(), 'public', 'scenes.json');

let raw: string;
try {
  raw = readFileSync(scenesPath, 'utf-8');
} catch (err) {
  console.error(`[validate-scenes] Could not read ${scenesPath}:`, err);
  process.exit(1);
}

let json: unknown;
try {
  json = JSON.parse(raw);
} catch (err) {
  console.error('[validate-scenes] scenes.json is not valid JSON:', err);
  process.exit(1);
}

try {
  const result = ScenesFileSchema.parse(json);
  console.log(`[validate-scenes] ✓ scenes.json is valid (${result.scenes.length} scene(s))`);
} catch (err) {
  if (err instanceof ZodError) {
    console.error('[validate-scenes] ✗ scenes.json schema violations:');
    for (const issue of err.issues) {
      console.error(`  - [${issue.path.join('.')}] ${issue.message}`);
    }
  } else {
    console.error('[validate-scenes] Unexpected error:', err);
  }
  process.exit(1);
}
