import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('seker_admin_session');
  const path = request.nextUrl.pathname;

  // 1. SCHUTZ: Dashboard Zugriff NUR mit Session
  if (path.startsWith('/dashboard')) {
    if (!hasSession) {
      // Kein Keks? Ab zum Login!
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. KOMFORT: Wer eingeloggt ist, braucht kein Login/Landing mehr sehen
  if (path === '/' || path === '/login') {
    if (hasSession) {
      // Schon eingeloggt? Ab ins Dashboard!
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
