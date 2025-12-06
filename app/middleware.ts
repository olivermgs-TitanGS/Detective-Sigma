import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from '@/lib/auth.config';

// Get the NextAuth middleware
const { auth } = NextAuth(authConfig);

// Security headers to add to all responses
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting state (in-memory, for production use Redis/Upstash)
// Note: In serverless environments, this is per-instance and not shared
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, path: string): string {
  // Different limits for different paths
  if (path.startsWith('/api/auth')) return `auth:${ip}`;
  if (path.startsWith('/api')) return `api:${ip}`;
  return `page:${ip}`;
}

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // Clean expired entries opportunistically (instead of setInterval)
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(key);
  }

  const currentEntry = rateLimitMap.get(key);
  if (!currentEntry) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (currentEntry.count >= limit) {
    return false;
  }

  currentEntry.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    const isAuthRoute = pathname.startsWith('/api/auth');
    const limit = isAuthRoute ? 10 : 60; // 10 req/15min for auth, 60 req/min for API
    const windowMs = isAuthRoute ? 15 * 60 * 1000 : 60 * 1000;

    const key = getRateLimitKey(ip, pathname);
    if (!checkRateLimit(key, limit, windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            ...securityHeaders,
          },
        }
      );
    }
  }

  // Run NextAuth middleware for protected routes
  const protectedPaths = ['/student', '/teacher', '/admin'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // @ts-expect-error - NextAuth types are complex
    const authResult = await auth(request);
    if (authResult instanceof Response) {
      // Auth middleware returned a redirect or error
      const response = NextResponse.next();
      // Add security headers
      for (const [header, value] of Object.entries(securityHeaders)) {
        response.headers.set(header, value);
      }
      return authResult;
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  return response;
}

export const config = {
  matcher: [
    // Protected routes
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    // API routes (for rate limiting)
    '/api/:path*',
  ],
};
