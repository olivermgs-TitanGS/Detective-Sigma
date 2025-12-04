/**
 * Rate Limiting Utility
 * In-memory rate limiting for API routes
 * For production, consider using Redis-based rate limiting
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { logSecurityEvent } from './audit';

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  keyGenerator?: (identifier: string) => string; // Custom key generator
}

// In-memory store for rate limiting
// In production, use Redis or similar for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup(windowMs: number): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.firstRequest > windowMs * 2) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

// Default configurations for different route types
export const RateLimitPresets = {
  // Authentication routes - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again later.',
  },
  // Registration routes
  register: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour per IP
    message: 'Too many registration attempts. Please try again later.',
  },
  // Standard API routes
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  // Heavy operations (case generation, etc.)
  heavy: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: 'Too many requests for this operation. Please wait.',
  },
  // Quiz submissions
  quiz: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 submissions per minute
    message: 'Too many quiz submissions. Please slow down.',
  },
} as const;

/**
 * Get client identifier (IP address or fallback)
 */
export async function getClientIdentifier(): Promise<string> {
  try {
    const headersList = await headers();
    // Check proxy headers first
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    const realIp = headersList.get('x-real-ip');
    if (realIp) {
      return realIp;
    }
    const clientIp = headersList.get('x-client-ip');
    if (clientIp) {
      return clientIp;
    }
    // Fallback to a hash of user agent as last resort
    const userAgent = headersList.get('user-agent') || 'unknown';
    return `ua-${hashString(userAgent)}`;
  } catch {
    return 'unknown';
  }
}

/**
 * Simple string hash for fallback identifier
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  routeKey: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const key = config.keyGenerator
    ? config.keyGenerator(identifier)
    : `${routeKey}:${identifier}`;

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Start cleanup if not already running
  startCleanup(config.windowMs);

  // No existing entry - create new one
  if (!entry) {
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Check if window has expired
  if (now - entry.firstRequest > config.windowMs) {
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Within window - check count
  entry.count++;
  entry.lastRequest = now;

  const limited = entry.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetTime = entry.firstRequest + config.windowMs;

  return { limited, remaining, resetTime };
}

/**
 * Rate limiting middleware for API routes
 * Returns null if not rate limited, or a NextResponse if limited
 */
export async function rateLimit(
  routeKey: string,
  config: RateLimitConfig = RateLimitPresets.api
): Promise<NextResponse | null> {
  const identifier = await getClientIdentifier();
  const result = checkRateLimit(identifier, routeKey, config);

  if (result.limited) {
    // Log the rate limit event
    await logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      routeKey,
      identifier,
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
    });

    return NextResponse.json(
      {
        error: config.message || 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(
            (result.resetTime - Date.now()) / 1000
          ).toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetTime.toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Create a rate limiter for a specific route
 */
export function createRateLimiter(
  routeKey: string,
  config: RateLimitConfig = RateLimitPresets.api
) {
  return async function (): Promise<NextResponse | null> {
    return rateLimit(routeKey, config);
  };
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T,
  routeKey: string,
  config: RateLimitConfig = RateLimitPresets.api
): T {
  return (async (...args: unknown[]) => {
    const rateLimitResponse = await rateLimit(routeKey, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    return handler(...args);
  }) as T;
}

/**
 * Reset rate limit for a specific identifier and route
 * Useful after successful authentication
 */
export function resetRateLimit(identifier: string, routeKey: string): void {
  const key = `${routeKey}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status for an identifier
 */
export function getRateLimitStatus(
  identifier: string,
  routeKey: string,
  config: RateLimitConfig
): { count: number; remaining: number; resetTime: number } | null {
  const key = `${routeKey}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now - entry.firstRequest > config.windowMs) {
    return null;
  }

  return {
    count: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.firstRequest + config.windowMs,
  };
}
