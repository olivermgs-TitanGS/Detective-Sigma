/**
 * CSRF Protection Utility
 * Additional CSRF protection beyond NextAuth defaults
 */
import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_COOKIE = 'csrf-token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Get the CSRF token from cookies
 */
export async function getCsrfTokenFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CSRF_TOKEN_COOKIE);
    return token?.value || null;
  } catch {
    return null;
  }
}

/**
 * Get the CSRF token from request header
 */
export async function getCsrfTokenFromHeader(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get(CSRF_TOKEN_HEADER);
  } catch {
    return null;
  }
}

/**
 * Validate CSRF token (cookie must match header)
 */
export async function validateCsrfToken(): Promise<boolean> {
  const cookieToken = await getCsrfTokenFromCookie();
  const headerToken = await getCsrfTokenFromHeader();

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}

/**
 * Set CSRF token cookie in response
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

/**
 * CSRF protection middleware for API routes
 * Returns null if valid, or an error response if invalid
 */
export async function csrfProtection(): Promise<NextResponse | null> {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  const headersList = await headers();
  const method = headersList.get('x-http-method') || 'GET';

  if (['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    return null;
  }

  const isValid = await validateCsrfToken();

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Validate origin/referer for additional CSRF protection
 */
export async function validateOrigin(allowedOrigins: string[]): Promise<boolean> {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const referer = headersList.get('referer');

  // Check origin header first
  if (origin) {
    return allowedOrigins.some((allowed) => origin.startsWith(allowed));
  }

  // Fall back to referer
  if (referer) {
    return allowedOrigins.some((allowed) => referer.startsWith(allowed));
  }

  // No origin or referer - could be same-origin request
  // In production, you might want to reject these
  return process.env.NODE_ENV !== 'production';
}

/**
 * Security headers to add to responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Content Security Policy header value
 */
export function getCspHeader(nonce?: string): string {
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${nonce ? `'nonce-${nonce}'` : ''} 'unsafe-eval'`, // unsafe-eval for Next.js dev
    "style-src 'self' 'unsafe-inline'", // unsafe-inline for CSS-in-JS
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return csp.join('; ');
}

/**
 * Add security headers to a response
 */
export function addSecurityHeaders(response: NextResponse, nonce?: string): NextResponse {
  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  // Add CSP header
  response.headers.set('Content-Security-Policy', getCspHeader(nonce));

  return response;
}

/**
 * Generate a nonce for inline scripts
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}
