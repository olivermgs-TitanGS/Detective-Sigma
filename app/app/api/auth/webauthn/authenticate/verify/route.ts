import { NextResponse } from 'next/server';
import { verifyPasskeyAuthentication } from '@/lib/webauthn';
import { z } from 'zod';
import { encode } from 'next-auth/jwt';

const verifySchema = z.object({
  response: z.any(), // AuthenticationResponseJSON
  challengeKey: z.string(),
});

/**
 * POST /api/auth/webauthn/authenticate/verify
 * Verify authentication response and create session
 * Does not require authentication (this IS the login)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { response, challengeKey } = verifySchema.parse(body);

    const result = await verifyPasskeyAuthentication(response, challengeKey);

    if (!result.verified || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Create a session token
    const token = await encode({
      token: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Create response with session cookie
    const res = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });

    // Set the session cookie
    res.cookies.set({
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return res;
  } catch (error: any) {
    console.error('WebAuthn authentication verify error:', error);

    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify authentication' },
      { status: 500 }
    );
  }
}
