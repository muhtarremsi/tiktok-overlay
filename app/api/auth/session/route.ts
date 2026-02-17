import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const loggedIn = cookieStore.get('tiktok_logged_in')?.value === '1';
  const openId = cookieStore.get('tiktok_open_id')?.value ?? '';
  return NextResponse.json({ loggedIn: !!loggedIn, openId: loggedIn ? openId : undefined });
}
