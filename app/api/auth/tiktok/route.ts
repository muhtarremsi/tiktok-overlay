import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  // Redirect URI muss exakt mit der im TikTok Developer Portal eingetragenen URL übereinstimmen
  const origin = request.headers.get('x-forwarded-host')
    ? `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host')}`
    : new URL(request.url).origin;
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || origin).replace(/\/$/, '');

  if (!clientKey || clientKey === 'YOUR_TIKTOK_CLIENT_KEY') {
    return NextResponse.json(
      { error: 'TikTok Login nicht konfiguriert. Bitte TIKTOK_CLIENT_KEY in den Umgebungsvariablen setzen (Vercel: Project → Settings → Environment Variables).' },
      { status: 500 }
    );
  }

  const redirectUri = `${baseUrl}/api/auth/callback`;
  const scope = 'user.info.basic,video.list';
  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.set('client_key', clientKey);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  return NextResponse.json({ url: authUrl.toString() });
}
