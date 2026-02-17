import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('tiktok_logged_in', '', { maxAge: 0, path: '/' });
  res.cookies.set('tiktok_open_id', '', { maxAge: 0, path: '/' });
  return res;
}
