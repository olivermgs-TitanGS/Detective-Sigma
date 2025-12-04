/**
 * Security Module - Detective Sigma
 * Centralized exports for all security utilities
 */

// Audit Logging
export {
  createAuditLog,
  logLogin,
  logLoginFailed,
  logLogout,
  logSecurityEvent,
  logCreate,
  logUpdate,
  logDelete,
  getClientIp,
  getUserAgent,
  type AuditAction,
  type EntityType,
} from './audit';

// Rate Limiting
export {
  rateLimit,
  createRateLimiter,
  withRateLimit,
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
  getClientIdentifier,
  RateLimitPresets,
} from './rate-limit';

// Input Sanitization
export {
  sanitizeHtml,
  sanitizeRichText,
  escapeSqlString,
  sanitizePath,
  isValidFilename,
  sanitizedString,
  sanitizedUsername,
  sanitizedEmail,
  securePassword,
  sanitizedClassCode,
  sanitizeObject,
  InputLimits,
  isValidUrl,
  sanitizeUrl,
  safeJsonParse,
  enhancedLoginSchema,
  enhancedStudentRegisterSchema,
  enhancedTeacherRegisterSchema,
  type EnhancedLoginInput,
  type EnhancedStudentRegisterInput,
  type EnhancedTeacherRegisterInput,
} from './sanitize';

// CSRF Protection
export {
  generateCsrfToken,
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
  validateCsrfToken,
  setCsrfTokenCookie,
  csrfProtection,
  validateOrigin,
  securityHeaders,
  getCspHeader,
  addSecurityHeaders,
  generateNonce,
} from './csrf';

// Sentry Error Tracking
export {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  addBreadcrumb,
  startTransaction,
  withErrorTracking,
  flushSentry,
  Sentry,
} from './sentry';
