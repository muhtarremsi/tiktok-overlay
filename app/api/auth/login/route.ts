import { NextResponse } from 'next/server';

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
  
  // Wir fordern nur user.info.basic an, wie besprochen
  const scope = 'user.info.basic';
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${clientKey}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri!)}` +
    `&state=${state}`;

  return NextResponse.redirect(authUrl);
}
