import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generatePasskeyRegistrationOptions } from '@/lib/webauthn';

/**
 * POST /api/auth/webauthn/register/options
 * Generate registration options for adding a new passkey
 * Requires authentication
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const options = await generatePasskeyRegistrationOptions(
      session.user.id,
      session.user.email!,
      session.user.name || session.user.email!
    );

    return NextResponse.json(options);
  } catch (error) {
    console.error('WebAuthn registration options error:', error);
    return NextResponse.json(
      { error: 'Failed to generate registration options' },
      { status: 500 }
    );
  }
}
