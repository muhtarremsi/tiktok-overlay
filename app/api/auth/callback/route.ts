import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  // TECHNICAL STEP: Exchange code for Access Token
  // This confirms the connection and allows us to pull your stickers
  try {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://tiktok-overlay-five.vercel.app/api/auth/callback',
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      // Login successful - Redirecting back to dashboard
      const res = NextResponse.redirect(new URL('/?logged=true', request.url));
      res.cookies.set('session_token', data.access_token, { httpOnly: true, secure: true });
      return res;
    }
  } catch (error) {
    console.error("Auth Error:", error);
  }

  return NextResponse.redirect(new URL('/?error=server_error', request.url));
}
