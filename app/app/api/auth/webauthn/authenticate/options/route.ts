import { NextResponse } from 'next/server';
import { generatePasskeyAuthenticationOptions } from '@/lib/webauthn';

/**
 * POST /api/auth/webauthn/authenticate/options
 * Generate authentication options for passkey login
 * Does not require authentication (this IS the login)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    const { options, challengeKey } = await generatePasskeyAuthenticationOptions(email);

    return NextResponse.json({
      options,
      challengeKey,
    });
  } catch (error) {
    console.error('WebAuthn authentication options error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication options' },
      { status: 500 }
    );
  }
}
