/**
 * HMAC-SHA256 token helpers for admin auth.
 * Uses the built-in Web Crypto API — no external dependencies.
 */

export const ADMIN_COOKIE = 'geosite_admin';
const TTL_MS = 24 * 60 * 60 * 1_000; // 24 h

function secret(): ArrayBuffer {
  const bytes = new TextEncoder().encode(
    process.env.ADMIN_SECRET ?? 'geosite-dev-fallback-secret-change-me!!!'
  );
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
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
  const sigBytes = new TextEncoder().encode(payload);
  const sig = b64Encode(
    await crypto.subtle.sign('HMAC', await cryptoKey('sign'),
      sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer)
  );
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 1) return false;
    const payload = token.slice(0, dot);
    const sig     = b64Decode(token.slice(dot + 1));
    const payloadBytes = new TextEncoder().encode(payload);
    const ok = await crypto.subtle.verify(
      'HMAC', await cryptoKey('verify'),
      sig, payloadBytes.buffer.slice(payloadBytes.byteOffset, payloadBytes.byteOffset + payloadBytes.byteLength) as ArrayBuffer
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
