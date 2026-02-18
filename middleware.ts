import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Prüfen, ob der Admin-Cookie existiert
  const hasSession = request.cookies.has('seker_admin_session');
  
  // Welche Seite wird gerade aufgerufen?
  const path = request.nextUrl.pathname;

  // Definieren, welche Pfade öffentlich sind (JEDER darf sie sehen)
  const isPublicPath = 
    path === '/login' || 
    path === '/terms' || 
    path === '/privacy' || 
    path === '/licenses' ||
    path.startsWith('/_next') || // Systemdateien
    path.startsWith('/static') || // Bilder etc.
    path.includes('.'); // Dateien wie favicon.ico

  // 1. Wenn User NICHT eingeloggt ist und eine geschützte Seite (Dashboard) will:
  if (!hasSession && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Wenn User BEREITS eingeloggt ist und auf /login geht:
  if (hasSession && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Hier konfigurieren wir, auf welche Pfade die Middleware hören soll
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) -> Die wollen wir evtl. auch schützen, aber für Overlays vllt offen lassen?
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
