import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserAuthenticators, deleteAuthenticator } from '@/lib/webauthn';

/**
 * GET /api/auth/webauthn/passkeys
 * Get user's registered passkeys
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const passkeys = await getUserAuthenticators(session.user.id);

    return NextResponse.json({ passkeys });
  } catch (error) {
    console.error('Get passkeys error:', error);
    return NextResponse.json(
      { error: 'Failed to get passkeys' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/webauthn/passkeys
 * Delete a passkey
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const passkeyId = searchParams.get('id');

    if (!passkeyId) {
      return NextResponse.json(
        { error: 'Passkey ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteAuthenticator(session.user.id, passkeyId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete passkey' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Passkey deleted successfully',
    });
  } catch (error) {
    console.error('Delete passkey error:', error);
    return NextResponse.json(
      { error: 'Failed to delete passkey' },
      { status: 500 }
    );
  }
}
