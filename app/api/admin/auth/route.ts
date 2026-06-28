import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, verifyAdminToken, ADMIN_COOKIE } from '@/src/lib/auth';

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure:   process.env.NODE_ENV === 'production',
  maxAge:   60 * 60 * 24, // 24 h
  path:     '/',
};

/* ── GET: check if current cookie is valid ── */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ isAdmin: false });
  const ok = await verifyAdminToken(token);
  return NextResponse.json({ isAdmin: ok });
}

/* ── POST: login ── */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password: string };
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD env var not set.' },
        { status: 500 }
      );
    }
    if (password !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = await createAdminToken();
    const res   = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, COOKIE_OPTS);
    return res;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

/* ── DELETE: logout ── */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
