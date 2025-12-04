/**
 * Sentry Error Tracking Configuration
 * Production-ready error monitoring for Detective Sigma
 */
import * as Sentry from '@sentry/nextjs';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Initialize Sentry for the application
 * Call this in instrumentation.ts or _app.tsx
 */
export function initSentry(): void {
  // Only initialize if DSN is provided
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    if (isDevelopment) {
      console.log('Sentry: Skipping initialization (no DSN configured)');
    }
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Session Replay (optional)
    replaysSessionSampleRate: isProduction ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

    // Only enable in production
    enabled: isProduction,

    // Debug in development
    debug: isDevelopment,

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Don't send events in development
      if (isDevelopment) {
        console.log('Sentry would send:', event);
        return null;
      }

      // Scrub sensitive data
      if (event.request) {
        // Remove cookies
        delete event.request.cookies;
        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
      }

      // Scrub user email domain for privacy
      if (event.user?.email) {
        const [localPart] = event.user.email.split('@');
        event.user.email = `${localPart.slice(0, 2)}***@***`;
      }

      return event;
    },

    // Filter out noisy errors
    ignoreErrors: [
      // Browser extensions
      /ResizeObserver loop/,
      /Non-Error promise rejection/,
      // Network errors (these are expected)
      /Failed to fetch/,
      /NetworkError/,
      /Load failed/,
      // User actions
      /AbortError/,
      // Third-party scripts
      /Script error/,
    ],

    // Integrate with Next.js
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

/**
 * Capture an error with additional context
 */
export function captureError(
  error: Error | string,
  context?: {
    userId?: string;
    action?: string;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  }
): string | undefined {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN || isDevelopment) {
    console.error('Error:', error, context);
    return undefined;
  }

  const eventId = Sentry.captureException(error instanceof Error ? error : new Error(error), {
    user: context?.userId ? { id: context.userId } : undefined,
    tags: {
      action: context?.action,
      ...context?.tags,
    },
    extra: context?.extra,
    level: context?.level || 'error',
  });

  return eventId;
}

/**
 * Capture a message (non-error events)
 */
export function captureMessage(
  message: string,
  context?: {
    level?: Sentry.SeverityLevel;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): string | undefined {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN || isDevelopment) {
    console.log('Message:', message, context);
    return undefined;
  }

  return Sentry.captureMessage(message, {
    level: context?.level || 'info',
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; role?: string } | null): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (user) {
    Sentry.setUser({
      id: user.id,
      // Don't send full email for privacy
      email: user.email ? `${user.email.split('@')[0].slice(0, 2)}***@***` : undefined,
      role: user.role,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = 'info'
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  op: string
): Sentry.Span | undefined {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN || isDevelopment) return undefined;

  return Sentry.startInactiveSpan({
    name,
    op,
  });
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: { action?: string; tags?: Record<string, string> }
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error as Error, {
        action: context?.action || fn.name,
        tags: context?.tags,
        extra: { args: JSON.stringify(args).slice(0, 1000) },
      });
      throw error;
    }
  }) as T;
}

/**
 * Flush pending events (useful before process exit)
 */
export async function flushSentry(timeout = 2000): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return true;
  return Sentry.flush(timeout);
}

/**
 * Create error boundary wrapper for React components
 * Usage: wrap your component with withSentryErrorBoundary
 */
export { Sentry };
