import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow health check
  if (pathname === '/api/health') {
    return NextResponse.next();
  }
  
  // For production deployment, temporarily allow root access
  if (pathname === '/' && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect root to dashboard for development
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continue with the request - auth protection handled client-side
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
}; 