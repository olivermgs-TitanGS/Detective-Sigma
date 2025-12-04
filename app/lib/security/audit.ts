/**
 * Audit Logging Utility
 * Centralized audit logging for security-sensitive actions
 */
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export type AuditAction =
  // Auth actions
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'STUDENT_REGISTER'
  | 'TEACHER_REGISTER'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_COMPLETE'
  | 'EMAIL_VERIFIED'
  // User actions
  | 'PROFILE_UPDATE'
  | 'PASSWORD_CHANGE'
  | 'ACCOUNT_DELETE'
  // Class actions
  | 'CLASS_CREATE'
  | 'CLASS_UPDATE'
  | 'CLASS_DELETE'
  | 'CLASS_JOIN'
  | 'CLASS_LEAVE'
  // Case actions
  | 'CASE_CREATE'
  | 'CASE_UPDATE'
  | 'CASE_DELETE'
  | 'CASE_PUBLISH'
  | 'CASE_START'
  | 'CASE_COMPLETE'
  // Quiz actions
  | 'QUIZ_SUBMIT'
  | 'QUIZ_CREATE'
  // Assignment actions
  | 'ASSIGNMENT_CREATE'
  | 'ASSIGNMENT_DELETE'
  // Admin actions
  | 'ADMIN_USER_UPDATE'
  | 'ADMIN_USER_DELETE'
  | 'ADMIN_ROLE_CHANGE'
  // Security events
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_TOKEN'
  | 'SUSPICIOUS_ACTIVITY';

export type EntityType =
  | 'User'
  | 'Class'
  | 'Case'
  | 'Quiz'
  | 'Progress'
  | 'Assignment'
  | 'Session';

interface AuditLogOptions {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Get client IP address from request headers
 */
export async function getClientIp(): Promise<string | undefined> {
  try {
    const headersList = await headers();
    // Check common proxy headers
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    const realIp = headersList.get('x-real-ip');
    if (realIp) {
      return realIp;
    }
    return headersList.get('x-client-ip') || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Get user agent from request headers
 */
export async function getUserAgent(): Promise<string | undefined> {
  try {
    const headersList = await headers();
    return headersList.get('user-agent') || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(options: AuditLogOptions): Promise<void> {
  const { userId, userEmail, action, entityType, entityId, details } = options;

  // Get IP and user agent if not provided
  const ipAddress = options.ipAddress ?? (await getClientIp());
  const userAgent = options.userAgent ?? (await getUserAgent());

  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action,
        entityType,
        entityId,
        details: details ?? undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main flow
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Log a successful authentication
 */
export async function logLogin(
  userId: string,
  userEmail: string,
  method: 'credentials' | 'oauth' = 'credentials'
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: 'LOGIN',
    entityType: 'User',
    entityId: userId,
    details: { method, timestamp: new Date().toISOString() },
  });
}

/**
 * Log a failed authentication attempt
 */
export async function logLoginFailed(
  email: string,
  reason: string
): Promise<void> {
  await createAuditLog({
    userEmail: email,
    action: 'LOGIN_FAILED',
    entityType: 'User',
    details: { reason, timestamp: new Date().toISOString() },
  });
}

/**
 * Log a logout event
 */
export async function logLogout(userId: string, userEmail: string): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action: 'LOGOUT',
    entityType: 'Session',
    details: { timestamp: new Date().toISOString() },
  });
}

/**
 * Log a security event (rate limiting, suspicious activity, etc.)
 */
export async function logSecurityEvent(
  action: 'RATE_LIMIT_EXCEEDED' | 'INVALID_TOKEN' | 'SUSPICIOUS_ACTIVITY',
  details: Record<string, unknown>,
  userId?: string,
  userEmail?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    action,
    details: { ...details, timestamp: new Date().toISOString() },
  });
}

/**
 * Log entity creation
 */
export async function logCreate(
  entityType: EntityType,
  entityId: string,
  userId: string,
  userEmail: string,
  details?: Record<string, unknown>
): Promise<void> {
  const actionMap: Record<EntityType, AuditAction> = {
    User: 'STUDENT_REGISTER',
    Class: 'CLASS_CREATE',
    Case: 'CASE_CREATE',
    Quiz: 'QUIZ_CREATE',
    Progress: 'CASE_START',
    Assignment: 'ASSIGNMENT_CREATE',
    Session: 'LOGIN',
  };

  await createAuditLog({
    userId,
    userEmail,
    action: actionMap[entityType],
    entityType,
    entityId,
    details,
  });
}

/**
 * Log entity update
 */
export async function logUpdate(
  entityType: EntityType,
  entityId: string,
  userId: string,
  userEmail: string,
  changes?: Record<string, unknown>
): Promise<void> {
  const actionMap: Record<EntityType, AuditAction> = {
    User: 'PROFILE_UPDATE',
    Class: 'CLASS_UPDATE',
    Case: 'CASE_UPDATE',
    Quiz: 'QUIZ_CREATE',
    Progress: 'CASE_COMPLETE',
    Assignment: 'ASSIGNMENT_CREATE',
    Session: 'LOGIN',
  };

  await createAuditLog({
    userId,
    userEmail,
    action: actionMap[entityType],
    entityType,
    entityId,
    details: { changes },
  });
}

/**
 * Log entity deletion
 */
export async function logDelete(
  entityType: EntityType,
  entityId: string,
  userId: string,
  userEmail: string
): Promise<void> {
  const actionMap: Record<EntityType, AuditAction> = {
    User: 'ACCOUNT_DELETE',
    Class: 'CLASS_DELETE',
    Case: 'CASE_DELETE',
    Quiz: 'QUIZ_CREATE',
    Progress: 'CASE_START',
    Assignment: 'ASSIGNMENT_DELETE',
    Session: 'LOGOUT',
  };

  await createAuditLog({
    userId,
    userEmail,
    action: actionMap[entityType],
    entityType,
    entityId,
  });
}
