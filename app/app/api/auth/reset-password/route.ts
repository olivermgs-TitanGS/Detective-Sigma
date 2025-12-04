import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requestPasswordResetSchema, resetPasswordSchema } from '@/lib/validations/auth';
import {
  createPasswordResetToken,
  verifyToken,
  consumeToken,
  hasRecentVerificationToken,
} from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';

/**
 * POST /api/auth/reset-password
 *
 * Two use cases:
 * 1. Request reset: { email: "..." } - sends reset email
 * 2. Confirm reset: { token: "...", newPassword: "..." } - resets password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Determine which flow based on request body
    if (body.token) {
      // Confirm reset flow
      return handleResetConfirmation(body);
    } else {
      // Request reset flow
      return handleResetRequest(body);
    }
  } catch (error: any) {
    console.error('Reset password error:', error);

    // Handle validation errors
    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}

/**
 * Handle password reset request (send email)
 */
async function handleResetRequest(body: any) {
  // Validate input
  const validatedData = requestPasswordResetSchema.parse(body);

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  // Always return success to prevent email enumeration attacks
  if (!user) {
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent',
      },
      { status: 200 }
    );
  }

  // Rate limiting: prevent spam
  const hasRecent = await hasRecentVerificationToken(
    validatedData.email,
    'PASSWORD_RESET',
    2 // 2 minutes
  );

  if (hasRecent) {
    return NextResponse.json(
      { error: 'Please wait before requesting another reset email' },
      { status: 429 }
    );
  }

  // Create reset token
  const token = await createPasswordResetToken(validatedData.email, user.id);

  // Send reset email
  await sendPasswordResetEmail(validatedData.email, user.username, token);

  // Log the action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'User',
      entityId: user.id,
      details: {
        requestedAt: new Date().toISOString(),
      },
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent',
    },
    { status: 200 }
  );
}

/**
 * Handle password reset confirmation (update password)
 */
async function handleResetConfirmation(body: any) {
  // Validate input
  const validatedData = resetPasswordSchema.parse(body);

  // Verify token
  const tokenResult = await verifyToken(validatedData.token, 'PASSWORD_RESET');

  if (!tokenResult.valid) {
    return NextResponse.json(
      { error: tokenResult.error || 'Invalid or expired reset token' },
      { status: 400 }
    );
  }

  const { tokenRecord } = tokenResult;

  // Find user by email from token
  const user = await prisma.user.findUnique({
    where: { email: tokenRecord!.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Hash new password
  const hashedPassword = await hash(validatedData.newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword },
  });

  // Consume token (mark as used)
  await consumeToken(validatedData.token);

  // Log the action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'User',
      entityId: user.id,
      details: {
        completedAt: new Date().toISOString(),
      },
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Password has been reset successfully',
    },
    { status: 200 }
  );
}
