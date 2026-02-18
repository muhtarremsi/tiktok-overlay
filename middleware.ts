import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('seker_admin_session');
  const path = request.nextUrl.pathname;

  // Wir schützen NUR den Pfad "/dashboard"
  const isProtectedPath = path.startsWith('/dashboard');

  // 1. Wenn User ins Dashboard will, aber nicht eingeloggt ist -> Login
  if (isProtectedPath && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Wenn User schon eingeloggt ist und auf /login geht -> Ab ins Dashboard
  if (hasSession && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Die Middleware hört auf alles, damit wir flexibel bleiben,
    // aber die Logik oben entscheidet, was blockiert wird.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
