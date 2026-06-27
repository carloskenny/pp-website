import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE_NAME } from '@/lib/auth-session';

function buildLoginUrl(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return loginUrl;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(ACCESS_COOKIE_NAME)?.value);

  if (pathname.startsWith('/admin') && !hasSession) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
