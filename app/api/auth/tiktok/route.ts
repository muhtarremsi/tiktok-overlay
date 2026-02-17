import { NextResponse } from 'next/server';

export async function GET() {
  const client_key = 'YOUR_TIKTOK_CLIENT_KEY'; // Ersetzen durch Portal Key
  const redirect_uri = 'https://your-domain.vercel.app/api/auth/callback';
  const scope = 'user.info.basic,video.list';
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${client_key}&scope=${scope}&response_type=code&redirect_uri=${redirect_uri}&state=${state}`;

  return NextResponse.json({ url: authUrl });
}
