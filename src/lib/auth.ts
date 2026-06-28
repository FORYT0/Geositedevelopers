/**
 * HMAC-SHA256 token helpers for admin auth.
 * Uses the built-in Web Crypto API — no external dependencies.
 */

export const ADMIN_COOKIE = 'geosite_admin';
const TTL_MS = 24 * 60 * 60 * 1_000; // 24 h

function secret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.ADMIN_SECRET ?? 'geosite-dev-fallback-secret-change-me!!!'
  );
}

async function cryptoKey(usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw', secret(),
    { name: 'HMAC', hash: 'SHA-256' },
    false, [usage]
  );
}

function b64Encode(buf: ArrayBuffer): string {
  return Buffer.from(buf).toString('base64url');
}
function b64Decode(s: string): Uint8Array {
  return Buffer.from(s, 'base64url');
}

export async function createAdminToken(): Promise<string> {
  const payload = b64Encode(
    Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + TTL_MS }))
  );
  const sig = b64Encode(
    await crypto.subtle.sign('HMAC', await cryptoKey('sign'),
      new TextEncoder().encode(payload))
  );
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 1) return false;
    const payload = token.slice(0, dot);
    const sig     = b64Decode(token.slice(dot + 1));
    const ok = await crypto.subtle.verify(
      'HMAC', await cryptoKey('verify'),
      sig, new TextEncoder().encode(payload)
    );
    if (!ok) return false;
    const { exp } = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    ) as { exp: number };
    return exp > Date.now();
  } catch {
    return false;
  }
}
