import { NextResponse } from 'next/server';

/**
 * Middleware disabled on Vercel: the Edge bundle triggers ReferenceError: __dirname is not defined.
 * Route protection is handled in app/(protected)/layout.jsx (redirect to /login when unauthenticated).
 * Auth redirects (e.g. logged-in user on /login → /dashboard) are handled in the login/register pages.
 */
export function middleware() {
  return NextResponse.next();
}

// Empty matcher = middleware never runs. Avoids MIDDLEWARE_INVOCATION_FAILED on Vercel.
export const config = {
  matcher: ['/_disable_middleware_dummy_path'],
};
