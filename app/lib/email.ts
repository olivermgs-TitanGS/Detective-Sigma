import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const APP_NAME = 'Detective Sigma';
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@detective-sigma.com';
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!resend) {
    console.warn('Email service not configured. RESEND_API_KEY is missing.');
    // In development, log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', { to, subject, html: html.substring(0, 200) + '...' });
      return { success: true, messageId: 'dev-mode' };
    }
    throw new Error('Email service not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Email Templates

export function getVerificationEmailHtml(username: string, token: string) {
  const verifyUrl = `${BASE_URL}/auth/verify-email?token=${token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔍 ${APP_NAME}</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Welcome, Detective ${username}!</h2>
    <p>Thanks for signing up! Please verify your email address to start solving cases.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
        Verify Email Address
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="color: #667eea; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmailHtml(username: string, token: string) {
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔍 ${APP_NAME}</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
    <p>Hi ${username},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="color: #667eea; font-size: 12px; word-break: break-all;">${resetUrl}</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}

// Convenience functions

export async function sendVerificationEmail(email: string, username: string, token: string) {
  return sendEmail({
    to: email,
    subject: `Verify your email - ${APP_NAME}`,
    html: getVerificationEmailHtml(username, token),
  });
}

export async function sendPasswordResetEmail(email: string, username: string, token: string) {
  return sendEmail({
    to: email,
    subject: `Reset your password - ${APP_NAME}`,
    html: getPasswordResetEmailHtml(username, token),
  });
}

