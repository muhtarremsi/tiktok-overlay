import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('seker_admin_session');
  const path = request.nextUrl.pathname;

  // Wenn man aufs Dashboard will, aber nicht eingeloggt ist -> Zur Startseite (wo man das Modal öffnen kann)
  if (path.startsWith('/dashboard')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Alte Login Seite abfangen und zur Home leiten
  if (path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
