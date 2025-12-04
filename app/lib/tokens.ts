import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';
import { TokenType } from '@prisma/client';

// Token expiration times (in milliseconds)
const TOKEN_EXPIRATION = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
};

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a verification token for email verification
 */
export async function createEmailVerificationToken(email: string, userId?: string) {
  // Invalidate any existing tokens for this email
  await prisma.verificationToken.updateMany({
    where: {
      email,
      type: 'EMAIL_VERIFICATION',
      usedAt: null,
    },
    data: {
      usedAt: new Date(), // Mark as used to invalidate
    },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.EMAIL_VERIFICATION);

  await prisma.verificationToken.create({
    data: {
      token,
      type: 'EMAIL_VERIFICATION',
      email,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Create a password reset token
 */
export async function createPasswordResetToken(email: string, userId?: string) {
  // Invalidate any existing password reset tokens for this email
  await prisma.verificationToken.updateMany({
    where: {
      email,
      type: 'PASSWORD_RESET',
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.PASSWORD_RESET);

  await prisma.verificationToken.create({
    data: {
      token,
      type: 'PASSWORD_RESET',
      email,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify and consume a token
 * Returns the token data if valid, null if invalid or expired
 */
export async function verifyToken(token: string, expectedType: TokenType) {
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!tokenRecord) {
    return { valid: false, error: 'Invalid token' };
  }

  if (tokenRecord.type !== expectedType) {
    return { valid: false, error: 'Invalid token type' };
  }

  if (tokenRecord.usedAt) {
    return { valid: false, error: 'Token already used' };
  }

  if (tokenRecord.expiresAt < new Date()) {
    return { valid: false, error: 'Token expired' };
  }

  return {
    valid: true,
    tokenRecord,
  };
}

/**
 * Mark a token as used
 */
export async function consumeToken(token: string) {
  await prisma.verificationToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });
}

/**
 * Check if an email has been verified recently (rate limiting)
 */
export async function hasRecentVerificationToken(
  email: string,
  type: TokenType,
  withinMinutes: number = 1
) {
  const since = new Date(Date.now() - withinMinutes * 60 * 1000);

  const recentToken = await prisma.verificationToken.findFirst({
    where: {
      email,
      type,
      createdAt: { gte: since },
    },
  });

  return !!recentToken;
}

/**
 * Clean up expired tokens (can be run as a cron job)
 */
export async function cleanupExpiredTokens() {
  const result = await prisma.verificationToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null } },
      ],
    },
  });

  return result.count;
}
