import { NextResponse } from 'next/server';

/**
 * Middleware for route protection and authentication
 * 
 * SEC-002 FIX: Enhanced token validation and route protection
 * - Validates token format (basic check)
 * - Clears invalid tokens
 * - Provides better security for protected routes
 */

// Define public routes that don't require authentication
const publicRoutes = [
  '/landing',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/reset-password-success',
  '/verify-2fa',
  '/auth/callback',
  '/accept-invite',
  '/accept-company-invite',
  '/pricing',
];

// Define routes that should redirect to dashboard if authenticated
const authRoutes = [
  '/login',
  '/register',
];

/**
 * Basic token format validation
 * Checks if token looks valid (not empty, has reasonable length)
 * Full validation happens on backend
 * @param {string} token - Auth token to validate
 * @returns {boolean} True if token format looks valid
 */
const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  // Basic format check: should be non-empty and have reasonable length
  // JWT tokens are typically 100+ characters
  return token.trim().length > 10;
};

/**
 * Middleware function to handle route protection
 * @param {Request} request - Next.js request object
 * @returns {NextResponse} Response with potential redirects
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // SEC-002 FIX: Validate token format
  const hasValidToken = token && isValidTokenFormat(token);
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (hasValidToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If not authenticated and trying to access protected route
  const protectedRoutePatterns = [
    '/dashboard',
    '/projects',
    '/tasks',
    '/teams',
    '/documents',
    '/analytics',
    '/settings',
    '/prd-designer',
    '/handoffs',
    '/integrations',
    '/ci-cd',
    '/feedback',
    '/support',
    '/notifications',
    '/activity',
  ];
  const isProtectedRoute = protectedRoutePatterns.some(pattern => pathname.startsWith(pattern));
  
  if (!hasValidToken && isProtectedRoute && !isPublicRoute && pathname !== '/') {
    // Clear potentially invalid token cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
  
  // If token exists but format is invalid, clear it
  if (token && !hasValidToken && isProtectedRoute) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
