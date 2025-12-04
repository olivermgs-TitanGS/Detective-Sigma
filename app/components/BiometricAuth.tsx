'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

type BiometricStatus = 'idle' | 'scanning' | 'success' | 'error';

interface BiometricAuthProps {
  mode: 'login' | 'register';
  onSuccess?: (user?: any) => void;
  onError?: (error: string) => void;
  email?: string;
  deviceName?: string;
}

export function BiometricAuth({
  mode,
  onSuccess,
  onError,
  email,
  deviceName,
}: BiometricAuthProps) {
  const [status, setStatus] = useState<BiometricStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBiometricAuth = useCallback(async () => {
    setStatus('scanning');
    setErrorMessage('');

    try {
      if (mode === 'register') {
        // Get registration options
        const optionsRes = await fetch('/api/auth/webauthn/register/options', {
          method: 'POST',
        });

        if (!optionsRes.ok) {
          throw new Error('Failed to get registration options');
        }

        const options = await optionsRes.json();

        // Start registration ceremony
        const credential = await startRegistration({ optionsJSON: options });

        // Verify registration
        const verifyRes = await fetch('/api/auth/webauthn/register/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response: credential,
            deviceName: deviceName || 'Biometric Device',
          }),
        });

        if (!verifyRes.ok) {
          const error = await verifyRes.json();
          throw new Error(error.error || 'Registration failed');
        }

        setStatus('success');
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        // Get authentication options
        const optionsRes = await fetch('/api/auth/webauthn/authenticate/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!optionsRes.ok) {
          throw new Error('Failed to get authentication options');
        }

        const { options, challengeKey } = await optionsRes.json();

        // Start authentication ceremony
        const credential = await startAuthentication({ optionsJSON: options });

        // Verify authentication
        const verifyRes = await fetch('/api/auth/webauthn/authenticate/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response: credential,
            challengeKey,
          }),
        });

        if (!verifyRes.ok) {
          const error = await verifyRes.json();
          throw new Error(error.error || 'Authentication failed');
        }

        const result = await verifyRes.json();
        setStatus('success');
        setTimeout(() => {
          onSuccess?.(result.user);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Biometric auth error:', error);
      setStatus('error');
      const message = error.name === 'NotAllowedError'
        ? 'Biometric authentication was cancelled'
        : error.message || 'Authentication failed';
      setErrorMessage(message);
      onError?.(message);

      // Reset after error
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  }, [mode, email, deviceName, onSuccess, onError]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Biometric Scanner Animation */}
      <motion.button
        onClick={handleBiometricAuth}
        disabled={status === 'scanning'}
        className="relative w-32 h-32 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        whileHover={{ scale: status === 'idle' ? 1.05 : 1 }}
        whileTap={{ scale: status === 'idle' ? 0.95 : 1 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: status === 'scanning'
              ? ['0 0 20px rgba(139, 92, 246, 0.5)', '0 0 40px rgba(139, 92, 246, 0.8)', '0 0 20px rgba(139, 92, 246, 0.5)']
              : status === 'success'
                ? '0 0 40px rgba(34, 197, 94, 0.8)'
                : status === 'error'
                  ? '0 0 40px rgba(239, 68, 68, 0.8)'
                  : '0 0 20px rgba(139, 92, 246, 0.3)',
          }}
          transition={{
            duration: 1.5,
            repeat: status === 'scanning' ? Infinity : 0,
          }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4"
          animate={{
            borderColor: status === 'success'
              ? '#22c55e'
              : status === 'error'
                ? '#ef4444'
                : '#8b5cf6',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Scanning ring animation */}
        <AnimatePresence>
          {status === 'scanning' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-purple-500"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Inner circle */}
        <motion.div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          animate={{
            backgroundColor: status === 'success'
              ? 'rgba(34, 197, 94, 0.2)'
              : status === 'error'
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(139, 92, 246, 0.2)',
          }}
        >
          {/* Fingerprint Icon */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.svg
                key="check"
                className="w-16 h-16 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.svg>
            ) : status === 'error' ? (
              <motion.svg
                key="x"
                className="w-16 h-16 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="fingerprint"
                className="w-16 h-16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                animate={{
                  color: status === 'scanning' ? '#a78bfa' : '#8b5cf6',
                }}
              >
                {/* Fingerprint paths */}
                <motion.path
                  d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [1, 0.5, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.path
                  d="M12 6c-3.3 0-6 2.7-6 6 0 1.2.4 2.4 1 3.4"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [0.5, 1, 0.5],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.path
                  d="M17 12c0-2.8-2.2-5-5-5"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [1, 0.5, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
                <motion.path
                  d="M12 2C6.5 2 2 6.5 2 12c0 2.5.9 4.8 2.4 6.5"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [0.5, 1, 0.5],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                />
                <motion.path
                  d="M22 12c0-5.5-4.5-10-10-10"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [1, 0.5, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
                />
                <motion.path
                  d="M19.5 17.5c1.6-1.6 2.5-3.8 2.5-6.2"
                  strokeLinecap="round"
                  animate={status === 'scanning' ? {
                    opacity: [0.5, 1, 0.5],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scanning line */}
        <AnimatePresence>
          {status === 'scanning' && (
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              initial={{ top: '15%', opacity: 0 }}
              animate={{
                top: ['15%', '85%', '15%'],
                opacity: [0, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          className="text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            color: status === 'success'
              ? '#22c55e'
              : status === 'error'
                ? '#ef4444'
                : '#a78bfa',
          }}
        >
          {status === 'idle' && (mode === 'login' ? 'Tap to sign in with biometrics' : 'Tap to register biometrics')}
          {status === 'scanning' && 'Scanning...'}
          {status === 'success' && (mode === 'login' ? 'Welcome back!' : 'Biometrics registered!')}
          {status === 'error' && errorMessage}
        </motion.p>
      </AnimatePresence>

      {/* Particles on success */}
      <AnimatePresence>
        {status === 'success' && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-green-400"
                style={{
                  left: '50%',
                  top: '40%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: i * 0.02,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BiometricAuth;
