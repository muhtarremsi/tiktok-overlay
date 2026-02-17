import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) return NextResponse.redirect(new URL('/?error=no_code', request.url));

  try {
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error('Token failed');

    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,username', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    const tiktokUser = userData.data?.user?.display_name || userData.data?.user?.username || 'user';

    return NextResponse.redirect(new URL(`/?u=${encodeURIComponent(tiktokUser)}`, request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
