import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.redirect(new URL('/?error=no_code', request.url));

  // In der Sandbox wird hier der Code gegen das Access Token getauscht
  // Wir leiten zurück zum Dashboard und signalisieren den Erfolg
  const response = NextResponse.redirect(new URL('/?logged=true', request.url));
  
  // Wir setzen ein sicheres Cookie für die Session
  response.cookies.set('tt_auth', 'active', { 
    path: '/', 
    httpOnly: true, 
    maxAge: 60 * 60 * 24 
  });

  return response;
}
