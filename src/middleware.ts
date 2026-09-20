import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes, excluding /admin/login and static assets
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSessionCookie = request.cookies.get('naqash_admin_session')?.value;
    
    // Check for Supabase session cookies (they usually start with sb-)
    const hasSupabaseCookie = Array.from(request.cookies.getAll()).some(c => 
      c.name.startsWith('sb-') && c.name.includes('-auth-token')
    );

    if (!adminSessionCookie && !hasSupabaseCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
