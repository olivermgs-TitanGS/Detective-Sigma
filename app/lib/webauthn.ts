import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
import { prisma } from '@/lib/db';

// WebAuthn configuration
const RP_NAME = 'Detective Sigma';
const RP_ID = process.env.WEBAUTHN_RP_ID || 'localhost';
const ORIGIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// In-memory challenge store (use Redis in production for multi-instance)
const challengeStore = new Map<string, { challenge: string; expiresAt: number }>();

function setChallenge(userId: string, challenge: string) {
  challengeStore.set(userId, {
    challenge,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
}

function getChallenge(userId: string): string | null {
  const stored = challengeStore.get(userId);
  if (!stored) return null;
  if (Date.now() > stored.expiresAt) {
    challengeStore.delete(userId);
    return null;
  }
  return stored.challenge;
}

function clearChallenge(userId: string) {
  challengeStore.delete(userId);
}

/**
 * Generate registration options for a user to register a new passkey
 */
export async function generatePasskeyRegistrationOptions(userId: string, userEmail: string, userName: string) {
  // Get existing authenticators for this user
  const existingAuthenticators = await prisma.authenticator.findMany({
    where: { userId },
    select: {
      credentialId: true,
      transports: true,
    },
  });

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: userId,
    userName: userEmail,
    userDisplayName: userName,
    attestationType: 'none',
    excludeCredentials: existingAuthenticators.map((auth) => ({
      id: Buffer.from(auth.credentialId, 'base64url'),
      transports: auth.transports?.split(',') as AuthenticatorTransportFuture[] | undefined,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform', // Prefer platform authenticators (biometrics)
    },
  });

  // Store challenge for verification
  setChallenge(userId, options.challenge);

  return options;
}

/**
 * Verify registration response and save the authenticator
 */
export async function verifyPasskeyRegistration(
  userId: string,
  response: RegistrationResponseJSON,
  deviceName?: string
): Promise<{ verified: boolean; error?: string }> {
  const expectedChallenge = getChallenge(userId);

  if (!expectedChallenge) {
    return { verified: false, error: 'Challenge expired or not found' };
  }

  try {
    const verification: VerifiedRegistrationResponse = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return { verified: false, error: 'Verification failed' };
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save the authenticator to database
    await prisma.authenticator.create({
      data: {
        userId,
        credentialId: credential.id,
        credentialPublicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        credentialDeviceType,
        credentialBackedUp,
        transports: response.response.transports?.join(','),
        deviceName: deviceName || 'Biometric Device',
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSKEY_REGISTERED',
        entityType: 'Authenticator',
        details: {
          deviceName: deviceName || 'Biometric Device',
          credentialDeviceType,
          registeredAt: new Date().toISOString(),
        },
      },
    });

    clearChallenge(userId);
    return { verified: true };
  } catch (error) {
    console.error('Passkey registration verification error:', error);
    return { verified: false, error: 'Verification failed' };
  }
}

/**
 * Generate authentication options for passkey login
 */
export async function generatePasskeyAuthenticationOptions(userEmail?: string) {
  let allowCredentials: { id: Uint8Array; transports?: AuthenticatorTransportFuture[] }[] | undefined;

  // If email provided, only allow that user's credentials
  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        authenticators: {
          select: {
            credentialId: true,
            transports: true,
          },
        },
      },
    });

    if (user && user.authenticators.length > 0) {
      allowCredentials = user.authenticators.map((auth) => ({
        id: Buffer.from(auth.credentialId, 'base64url'),
        transports: auth.transports?.split(',') as AuthenticatorTransportFuture[] | undefined,
      }));
    }
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'preferred',
    allowCredentials,
  });

  // Store challenge using a session identifier or credential ID
  const challengeKey = userEmail || 'anonymous';
  setChallenge(challengeKey, options.challenge);

  return { options, challengeKey };
}

/**
 * Verify authentication response and return user if valid
 */
export async function verifyPasskeyAuthentication(
  response: AuthenticationResponseJSON,
  challengeKey: string
): Promise<{ verified: boolean; user?: any; error?: string }> {
  const expectedChallenge = getChallenge(challengeKey);

  if (!expectedChallenge) {
    return { verified: false, error: 'Challenge expired or not found' };
  }

  try {
    // Find the authenticator by credential ID
    const authenticator = await prisma.authenticator.findUnique({
      where: { credentialId: response.id },
      include: { user: true },
    });

    if (!authenticator) {
      return { verified: false, error: 'Authenticator not found' };
    }

    const verification: VerifiedAuthenticationResponse = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: Buffer.from(authenticator.credentialId, 'base64url'),
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: Number(authenticator.counter),
        transports: authenticator.transports?.split(',') as AuthenticatorTransportFuture[] | undefined,
      },
    });

    if (!verification.verified) {
      return { verified: false, error: 'Verification failed' };
    }

    // Update counter and last used
    await prisma.authenticator.update({
      where: { id: authenticator.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Update user's last login
    await prisma.user.update({
      where: { id: authenticator.userId },
      data: { lastLogin: new Date() },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: authenticator.userId,
        userEmail: authenticator.user.email,
        action: 'PASSKEY_LOGIN',
        entityType: 'User',
        entityId: authenticator.userId,
        details: {
          deviceName: authenticator.deviceName,
          authenticatedAt: new Date().toISOString(),
        },
      },
    });

    clearChallenge(challengeKey);

    return {
      verified: true,
      user: {
        id: authenticator.user.id,
        email: authenticator.user.email,
        name: authenticator.user.username,
        role: authenticator.user.role,
      },
    };
  } catch (error) {
    console.error('Passkey authentication verification error:', error);
    return { verified: false, error: 'Verification failed' };
  }
}

/**
 * Get user's registered authenticators
 */
export async function getUserAuthenticators(userId: string) {
  return prisma.authenticator.findMany({
    where: { userId },
    select: {
      id: true,
      deviceName: true,
      credentialDeviceType: true,
      credentialBackedUp: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Delete an authenticator
 */
export async function deleteAuthenticator(userId: string, authenticatorId: string) {
  const authenticator = await prisma.authenticator.findFirst({
    where: { id: authenticatorId, userId },
  });

  if (!authenticator) {
    return { success: false, error: 'Authenticator not found' };
  }

  await prisma.authenticator.delete({
    where: { id: authenticatorId },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: 'PASSKEY_REMOVED',
      entityType: 'Authenticator',
      entityId: authenticatorId,
      details: {
        deviceName: authenticator.deviceName,
        removedAt: new Date().toISOString(),
      },
    },
  });

  return { success: true };
}

/**
 * Check if user has any passkeys registered
 */
export async function userHasPasskeys(userId: string): Promise<boolean> {
  const count = await prisma.authenticator.count({
    where: { userId },
  });
  return count > 0;
}
