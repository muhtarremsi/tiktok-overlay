import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  
  // 1. Fehlerbehandlung bei Abbruch durch User oder Systemfehler
  if (error || !code) {
    console.error('TikTok Auth Error:', error, error_description);
    return NextResponse.redirect(new URL('/?error=access_denied', request.url));
  }

  try {
    // 2. Token Exchange
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/auth/token/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Token Error Data:', tokenData);
      throw new Error('Kein Access Token erhalten');
    }

    // 3. User Info abrufen
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,username', {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}` 
      },
    });

    const userData = await userResponse.json();
    const finalUsername = userData.data?.user?.display_name || userData.data?.user?.username || 'user';

    // 4. Erfolg: Zurück zum Dashboard
    return NextResponse.redirect(new URL(`/?u=${encodeURIComponent(finalUsername)}&connected=true`, request.url));

  } catch (err) {
    console.error('Callback Server Error:', err);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
