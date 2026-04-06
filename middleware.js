import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'zyndrx_session';
const protectedPrefixes = [
  '/activity',
  '/analytics',
  '/ci-cd',
  '/dashboard',
  '/documents',
  '/email-test',
  '/feedback',
  '/handoffs',
  '/integrations',
  '/kanban',
  '/notifications',
  '/prd-designer',
  '/projects',
  '/settings',
  '/support',
  '/tasks',
  '/teams',
];
const guestOnlyPrefixes = ['/login', '/register'];

const matchesPrefix = (pathname, prefixes) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname, search } = nextUrl;
  const hasSession = Boolean(cookies.get(SESSION_COOKIE_NAME)?.value);

  if (matchesPrefix(pathname, protectedPrefixes) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesPrefix(pathname, guestOnlyPrefixes) && hasSession) {
    const redirectTo = nextUrl.searchParams.get('returnTo') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/activity/:path*',
    '/analytics/:path*',
    '/ci-cd/:path*',
    '/dashboard/:path*',
    '/documents/:path*',
    '/email-test/:path*',
    '/feedback/:path*',
    '/handoffs/:path*',
    '/integrations/:path*',
    '/kanban/:path*',
    '/login',
    '/notifications/:path*',
    '/prd-designer/:path*',
    '/projects/:path*',
    '/register',
    '/settings/:path*',
    '/support/:path*',
    '/tasks/:path*',
    '/teams/:path*',
  ],
};
