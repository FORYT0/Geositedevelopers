/**
 * HMAC-SHA256 token helpers for admin auth.
 * Uses the built-in Web Crypto API — no external dependencies.
 */

export const ADMIN_COOKIE = 'geosite_admin';
const TTL_MS = 24 * 60 * 60 * 1_000; // 24 h

/* ── helpers ── */
const enc = new TextEncoder();

/** Encode any Uint8Array or ArrayBuffer to base64url */
function b64Encode(input: Uint8Array | ArrayBuffer): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decode a base64url string to Uint8Array */
function b64Decode(s: string): Uint8Array {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Build a CryptoKey from the ADMIN_SECRET env var */
async function cryptoKey(usage: 'sign' | 'verify'): Promise<CryptoKey> {
  const raw = enc.encode(
    process.env.ADMIN_SECRET ?? 'geosite-dev-fallback-secret-change-me!!!'
  );
  return crypto.subtle.importKey(
    'raw', raw,
    { name: 'HMAC', hash: 'SHA-256' },
    false, [usage]
  );
}

/* ── public API ── */

export async function createAdminToken(): Promise<string> {
  const payloadJson  = JSON.stringify({ role: 'admin', exp: Date.now() + TTL_MS });
  const payload      = b64Encode(enc.encode(payloadJson));
  const sigBuf       = await crypto.subtle.sign('HMAC', await cryptoKey('sign'), enc.encode(payload));
  const sig          = b64Encode(sigBuf);
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
      sig, enc.encode(payload)
    );
    if (!ok) return false;
    const decoded = JSON.parse(
      new TextDecoder().decode(b64Decode(payload))
    ) as { exp: number };
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
}
