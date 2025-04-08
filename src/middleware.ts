import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware to protect admin routes
export async function middleware(request: NextRequest) {
  // Only run on admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for auth-related pages
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/api/auth')
    ) {
      return NextResponse.next();
    }

    // Get session token using NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated and has admin role
    if (!token || token.role !== 'admin') {
      // Redirect to sign-in page
      const signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // User is authenticated and has admin role, allow access
    return NextResponse.next();
  }

  // Not an admin route, allow request
  return NextResponse.next();
}

// Middleware matcher - only run on these paths
export const config = {
  matcher: ['/admin/:path*'],
}; 