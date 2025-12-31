import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/landing',
  '/login',
  '/register',
  '/signup',
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
  '/signup',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get auth token from cookies (adjust based on your auth implementation)
  const token = request.cookies.get('auth-token')?.value;
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If not authenticated and trying to access protected route
  // Only redirect if it's clearly a protected route (dashboard, projects, etc.)
  // Let client-side auth checks handle the actual verification
  const protectedRoutePatterns = ['/dashboard', '/projects', '/tasks', '/teams', '/documents', '/analytics', '/settings'];
  const isProtectedRoute = protectedRoutePatterns.some(pattern => pathname.startsWith(pattern));
  
  if (!token && isProtectedRoute && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
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
