'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { loginSchema } from '@/lib/validations/auth';
import { FloatingParticles, FogEffect, MysteryOrbs, Vignette } from '@/components/ui/FloatingParticles';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { SoundLink } from '@/components/ui/SoundButton';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('folderOpen');
    setError('');
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse({ email, password });
      const result = await signIn('credentials', {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();

      if (session?.user?.role === 'TEACHER') {
        router.push('/teacher/dashboard');
      } else if (session?.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodErr = err as { errors: Array<{ message: string }> };
        setError(zodErr.errors[0].message);
      } else {
        setError('System error');
      }
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    playSound('buttonClick');
    signIn(provider, { callbackUrl: '/student/dashboard' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black p-4">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/detective-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Effects */}
      <Vignette className="z-[2]" intensity={0.5} />
      <MysteryOrbs className="z-[3]" />
      <FloatingParticles count={30} color="rgba(255, 215, 0, 0.3)" className="z-[4]" />
      <FogEffect className="z-[5]" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-30 w-full max-w-sm"
      >
        {/* Glow Border */}
        <div
          className="absolute -inset-0.5 rounded-lg blur-sm opacity-60"
          style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
        />

        <div
          className="relative p-5 sm:p-6 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '2px solid #ffd700',
          }}
        >
          {/* Header - Compact */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🔎</div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider"
              style={{ color: '#ffd700', textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
            >
              {showContent ? <TypewriterText text="DETECTIVE SIGMA" speed={60} cursor={false} /> : 'DETECTIVE SIGMA'}
            </h1>
            <p className="text-xs tracking-widest text-amber-500/80 mt-1">CLASSIFIED INVESTIGATIONS</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 text-center rounded bg-red-900/30 border border-red-600">
              <p className="text-red-400 text-xs font-mono">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm font-mono bg-black/80 border border-amber-600/50 text-white placeholder-amber-400/40 focus:border-amber-400 focus:outline-none"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm font-mono bg-black/80 border border-amber-600/50 text-white placeholder-amber-400/40 focus:border-amber-400 focus:outline-none"
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <SoundLink
                href="/forgot-password"
                clickSound="paperRustle"
                className="text-amber-400/60 hover:text-amber-400 text-xs font-mono"
              >
                Forgot password?
              </SoundLink>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded font-bold text-sm tracking-wider transition-all disabled:opacity-50"
              style={{
                background: isLoading ? '#333' : 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: isLoading ? '#00ff00' : '#000',
                border: isLoading ? '1px solid #00ff00' : 'none',
              }}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* SSO Buttons - Icon only, super compact */}
          <div className="flex items-center justify-center gap-3 my-3">
            <span className="text-amber-400/40 text-[9px] font-mono">OR</span>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              title="Sign in with Google"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('microsoft-entra-id')}
              disabled={isLoading}
              title="Sign in with Microsoft"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={isLoading}
              title="Sign in with Apple"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>

          {/* Register Links - Compact */}
          <div className="mt-4 pt-3 border-t border-amber-500/20">
            <p className="text-center text-[10px] text-amber-500/60 font-mono mb-2">NEW RECRUIT?</p>
            <div className="flex gap-2">
              <SoundLink
                href="/register/student"
                clickSound="paperRustle"
                className="flex-1 py-2 text-center text-xs font-mono rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                Student
              </SoundLink>
              <SoundLink
                href="/register/teacher"
                clickSound="folderOpen"
                className="flex-1 py-2 text-center text-xs font-mono rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors"
              >
                Teacher
              </SoundLink>
            </div>
          </div>

          {/* Dev Backdoor - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-3 pt-2 border-t border-white/10">
              <p className="text-center text-[9px] text-gray-500 font-mono mb-1">DEV ACCESS</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const result = await signIn('credentials', { redirect: false, email: 'admin@example.com', password: 'admin123' });
                    if (!result?.error) { router.push('/admin/dashboard'); router.refresh(); }
                    else { setError('Check seed data'); setIsLoading(false); }
                  }}
                  className="flex-1 py-1 text-[9px] font-mono rounded bg-red-900/30 border border-red-600/50 text-red-400 hover:bg-red-900/50"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const result = await signIn('credentials', { redirect: false, email: 'teacher@example.com', password: 'teacher123' });
                    if (!result?.error) { router.push('/teacher/dashboard'); router.refresh(); }
                    else { setError('Check seed data'); setIsLoading(false); }
                  }}
                  className="flex-1 py-1 text-[9px] font-mono rounded bg-blue-900/30 border border-blue-600/50 text-blue-400 hover:bg-blue-900/50"
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const result = await signIn('credentials', { redirect: false, email: 'student@example.com', password: 'student123' });
                    if (!result?.error) { router.push('/student/dashboard'); router.refresh(); }
                    else { setError('Check seed data'); setIsLoading(false); }
                  }}
                  className="flex-1 py-1 text-[9px] font-mono rounded bg-green-900/30 border border-green-600/50 text-green-400 hover:bg-green-900/50"
                >
                  Student
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-amber-400/40 font-mono mt-3">
          SIGMA HQ • EST. 2025
        </p>
      </motion.div>
    </div>
  );
}
