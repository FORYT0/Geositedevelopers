import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/src/lib/kv';
import { verifyAdminToken, ADMIN_COOKIE } from '@/src/lib/auth';

const KV_KEY = 'geosite_site_content';

/* ── GET: return stored content (public) ── */
export async function GET() {
  try {
    const raw = await kvGet(KV_KEY);
    if (!raw) return NextResponse.json({ content: {} });
    const content = JSON.parse(raw);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: {} });
  }
}

/* ── POST: save content (admin only) ── */
export async function POST(req: NextRequest) {
  /* Verify admin cookie */
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content } = await req.json() as { content: unknown };
    await kvSet(KV_KEY, JSON.stringify(content));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
