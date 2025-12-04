/**
 * Input Sanitization Utility
 * Enhanced sanitization beyond Zod validation
 */
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// ============= XSS Prevention =============

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML by default
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize HTML but allow basic formatting
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

// ============= SQL Injection Prevention =============

/**
 * Escape special characters that could be used in SQL injection
 * Note: Always use Prisma parameterized queries - this is defense in depth
 */
export function escapeSqlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
}

// ============= Path Traversal Prevention =============

/**
 * Sanitize file paths to prevent directory traversal
 */
export function sanitizePath(path: string): string {
  // Remove path traversal sequences
  return path
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
}

/**
 * Validate filename (no path components)
 */
export function isValidFilename(filename: string): boolean {
  // Only allow alphanumeric, dash, underscore, dot
  const validPattern = /^[a-zA-Z0-9_\-\.]+$/;
  // Must not contain path separators or traversal
  const invalidPattern = /[\/\\]|\.\./;
  return validPattern.test(filename) && !invalidPattern.test(filename);
}

// ============= Custom Zod Transformers =============

/**
 * Zod transformer that sanitizes string input
 */
export const sanitizedString = z.string().transform((val) => sanitizeHtml(val));

/**
 * Zod transformer for usernames
 */
export const sanitizedUsername = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )
  .transform((val) => val.toLowerCase());

/**
 * Zod transformer for email with sanitization
 */
export const sanitizedEmail = z
  .string()
  .email('Invalid email address')
  .transform((val) => val.toLowerCase().trim());

/**
 * Zod schema for secure password
 */
export const securePassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Zod transformer for class codes (6 alphanumeric characters)
 */
export const sanitizedClassCode = z
  .string()
  .length(6, 'Class code must be exactly 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Class code must be uppercase alphanumeric')
  .transform((val) => val.toUpperCase());

// ============= Object Sanitization =============

/**
 * Recursively sanitize all string values in an object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeHtml(item)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

// ============= Input Length Limits =============

export const InputLimits = {
  username: { min: 3, max: 30 },
  email: { min: 5, max: 254 },
  password: { min: 8, max: 100 },
  classCode: { exact: 6 },
  className: { min: 1, max: 100 },
  caseTitle: { min: 1, max: 200 },
  caseDescription: { min: 0, max: 2000 },
  questionText: { min: 1, max: 1000 },
  hint: { min: 0, max: 500 },
  bio: { min: 0, max: 500 },
} as const;

// ============= URL Validation =============

/**
 * Validate and sanitize URLs
 */
export function isValidUrl(url: string, allowedProtocols = ['https:', 'http:']): boolean {
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL - only allow safe protocols
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

// ============= JSON Validation =============

/**
 * Safely parse JSON with size limit
 */
export function safeJsonParse<T>(
  json: string,
  maxSize = 1024 * 1024 // 1MB default
): T | null {
  if (json.length > maxSize) {
    return null;
  }
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// ============= Enhanced Auth Schemas =============

/**
 * Enhanced login schema with sanitization
 */
export const enhancedLoginSchema = z.object({
  email: sanitizedEmail,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Enhanced student registration schema
 */
export const enhancedStudentRegisterSchema = z.object({
  username: sanitizedUsername,
  email: sanitizedEmail,
  password: securePassword,
  gradeLevel: z.enum(['P4', 'P5', 'P6'], {
    errorMap: () => ({ message: 'Grade level must be P4, P5, or P6' }),
  }),
  parentConsent: z.boolean().refine((val) => val === true, {
    message: 'Parent consent is required',
  }),
});

/**
 * Enhanced teacher registration schema
 */
export const enhancedTeacherRegisterSchema = z.object({
  username: sanitizedUsername,
  email: sanitizedEmail,
  password: securePassword,
  schoolName: z
    .string()
    .max(200, 'School name too long')
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : undefined)),
});

export type EnhancedLoginInput = z.infer<typeof enhancedLoginSchema>;
export type EnhancedStudentRegisterInput = z.infer<typeof enhancedStudentRegisterSchema>;
export type EnhancedTeacherRegisterInput = z.infer<typeof enhancedTeacherRegisterSchema>;
