/**
 * Thin wrapper around the Vercel KV REST API (Upstash-compatible).
 * Falls back to an in-process Map when env vars are absent (local dev).
 *
 * Required env vars (auto-added when you link a Vercel KV database):
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

/** In-process fallback — persists for the lifetime of the Node.js process only */
const mem = new Map<string, string>();

export async function kvGet(key: string): Promise<string | null> {
  if (!KV_URL || !KV_TOKEN) return mem.get(key) ?? null;
  try {
    const res  = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    const json = await res.json() as { result: string | null };
    return json.result ?? null;
  } catch {
    return mem.get(key) ?? null;
  }
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (!KV_URL || !KV_TOKEN) { mem.set(key, value); return; }
  try {
    await fetch(`${KV_URL}/pipeline`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['SET', key, value]]),
    });
  } catch {
    mem.set(key, value);
  }
}
