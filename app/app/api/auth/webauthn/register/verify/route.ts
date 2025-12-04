import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { verifyPasskeyRegistration } from '@/lib/webauthn';
import { z } from 'zod';

const verifySchema = z.object({
  response: z.any(), // RegistrationResponseJSON
  deviceName: z.string().optional(),
});

/**
 * POST /api/auth/webauthn/register/verify
 * Verify registration response and save the passkey
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { response, deviceName } = verifySchema.parse(body);

    const result = await verifyPasskeyRegistration(
      session.user.id,
      response,
      deviceName
    );

    if (!result.verified) {
      return NextResponse.json(
        { error: result.error || 'Verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Passkey registered successfully',
    });
  } catch (error: any) {
    console.error('WebAuthn registration verify error:', error);

    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify registration' },
      { status: 500 }
    );
  }
}
