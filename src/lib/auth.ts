/**
 * HMAC-SHA256 token helpers for admin auth.
 * Uses the built-in Web Crypto API — no external dependencies.
 */

export const ADMIN_COOKIE = 'geosite_admin';
const TTL_MS = 24 * 60 * 60 * 1_000; // 24 h

/* ─── Type-safe buffer helpers ─────────────────────────────── */

/**
 * Encode a string to a guaranteed plain ArrayBuffer (never SharedArrayBuffer).
 * crypto.subtle requires ArrayBuffer, but TextEncoder returns Uint8Array<ArrayBufferLike>
 * which TypeScript won't allow directly.
 */
function strToBuffer(s: string): ArrayBuffer {
  const u8  = new TextEncoder().encode(s);
  const out = new ArrayBuffer(u8.length);
  new Uint8Array(out).set(u8);
  return out;
}

/**
 * Copy any Uint8Array into a guaranteed plain ArrayBuffer.
 */
function u8ToBuffer(u8: Uint8Array): ArrayBuffer {
  const out = new ArrayBuffer(u8.length);
  new Uint8Array(out).set(u8);
  return out;
}

/** Encode any ArrayBuffer to base64url */
function b64Encode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary  = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decode a base64url string to a plain ArrayBuffer */
function b64Decode(s: string): ArrayBuffer {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary  = atob(base64);
  const out     = new ArrayBuffer(binary.length);
  const u8      = new Uint8Array(out);
  for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
  return out;
}

/** Build a CryptoKey from the ADMIN_SECRET env var */
async function cryptoKey(usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    strToBuffer(process.env.ADMIN_SECRET ?? 'geosite-dev-fallback-secret-change-me!!!'),
    { name: 'HMAC', hash: 'SHA-256' },
    false, [usage]
  );
}

/* ─── Public API ───────────────────────────────────────────── */

export async function createAdminToken(): Promise<string> {
  const payloadJson = JSON.stringify({ role: 'admin', exp: Date.now() + TTL_MS });
  const payload     = b64Encode(strToBuffer(payloadJson));
  const sigBuf      = await crypto.subtle.sign('HMAC', await cryptoKey('sign'), strToBuffer(payload));
  const sig         = b64Encode(sigBuf);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 1) return false;
    const payload  = token.slice(0, dot);
    const sigBuf   = b64Decode(token.slice(dot + 1));
    const ok = await crypto.subtle.verify(
      'HMAC', await cryptoKey('verify'),
      sigBuf, strToBuffer(payload)
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

/* re-export to suppress unused-import in case u8ToBuffer is needed elsewhere */
export { u8ToBuffer };
