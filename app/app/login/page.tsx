'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@/lib/validations/auth';
import MusicThemeSetter from '@/components/MusicThemeSetter';
import { FloatingParticles, FogEffect, SmokeEffect, MysteryOrbs, FlickeringLight, Vignette } from '@/components/ui/FloatingParticles';
import { TypewriterText, AnimatedCounter } from '@/components/ui/TypewriterText';
import { useStats } from '@/lib/hooks/useStats';
import { SoundButton, SoundLink } from '@/components/ui/SoundButton';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { stats } = useStats();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    // Trigger animations after mount
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
        setError('Access denied. Invalid credentials.');
        setIsLoading(false);
        return;
      }

      // Fetch user session to determine role-based redirect
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
        setError('Investigation halted. System error detected.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
      <MusicThemeSetter theme="registration" />

      {/* Detective Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/detective-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark Overlay for readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Atmospheric Effects - Layered for depth */}
      <Vignette className="z-[2]" intensity={0.6} />
      <SmokeEffect className="z-[3]" />
      <MysteryOrbs className="z-[4]" />
      <FloatingParticles count={50} color="rgba(255, 215, 0, 0.3)" className="z-[5]" />
      <FogEffect className="z-[6]" />
      <FlickeringLight className="z-[7]" />

      {/* Gold accent glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 z-[4]"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Login Card */}
      <div className={`relative z-30 w-full max-w-md mx-4 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Glowing Border Effect */}
        <div
          className="absolute -inset-1 rounded-lg opacity-75 blur-sm animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700)',
          }}
        />

        <div
          className="relative p-8 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '2px solid #ffd700',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="mb-4 text-6xl animate-bounce"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))',
                animationDuration: '3s',
              }}
            >
              🔎
            </div>
            <h1
              className="text-4xl font-black tracking-[0.2em] mb-2"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              {showContent ? (
                <TypewriterText text="DETECTIVE SIGMA" speed={80} cursor={false} />
              ) : (
                'DETECTIVE SIGMA'
              )}
            </h1>
            <p
              className="text-lg tracking-[0.3em] uppercase font-bold"
              style={{
                color: '#ff9500',
                textShadow: '0 0 10px rgba(255, 149, 0, 0.6)',
              }}
            >
              CLASSIFIED INVESTIGATIONS UNIT
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <span className="text-amber-400/80 text-xs font-mono tracking-widest">CASE FILE #221B</span>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </div>
          </div>

          {/* Stats Bar - Real data from database */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-6 py-3 border-y border-amber-500/20">
            <div className="text-center">
              <div className="text-amber-400 font-bold text-base sm:text-lg font-mono">
                {showContent && stats ? <AnimatedCounter end={stats.casesSolved} duration={2000} /> : '0'}
              </div>
              <div className="text-amber-400/60 text-[9px] sm:text-[10px] tracking-widest uppercase">Cases Cracked</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-base sm:text-lg font-mono">
                {showContent && stats ? <AnimatedCounter end={stats.solveRate} duration={2000} suffix="%" /> : '0'}
              </div>
              <div className="text-amber-400/60 text-[9px] sm:text-[10px] tracking-widest uppercase">Solve Rate</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-base sm:text-lg font-mono">
                {showContent && stats ? <AnimatedCounter end={stats.detectivesCount} duration={2000} /> : '0'}
              </div>
              <div className="text-amber-400/60 text-[9px] sm:text-[10px] tracking-widest uppercase">Detectives</div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 text-center rounded relative overflow-hidden"
              style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid #dc2626',
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              <p className="text-red-400 font-bold text-sm tracking-wider font-mono">
                ⛔ ALERT: {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase font-mono"
                style={{ color: '#ffd700' }}
              >
                🔑 Agent Identifier
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="agent.codename@sigma.hq"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase font-mono"
                style={{ color: '#ffd700' }}
              >
                🔐 Classified Passphrase
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded font-mono focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-amber-500 bg-black/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                />
                <span className="text-amber-400/70 group-hover:text-amber-400 transition-colors font-mono text-xs tracking-wider">
                  REMEMBER AGENT
                </span>
              </label>
              <SoundLink
                href="/forgot-password"
                clickSound="paperRustle"
                className="text-amber-400/70 hover:text-amber-400 transition-colors font-mono text-xs tracking-wider"
              >
                LOST CREDENTIALS?
              </SoundLink>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => playSound('buttonHover')}
              className="w-full py-4 rounded font-black text-lg tracking-[0.2em] uppercase transition-all disabled:cursor-not-allowed hover:scale-[1.02] relative overflow-hidden group"
              style={{
                background: isLoading
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)'
                  : 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: isLoading ? '#00ff00' : '#000000',
                boxShadow: isLoading
                  ? '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1)'
                  : '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
                border: isLoading ? '2px solid #00ff00' : '2px solid #ffea00',
                textShadow: isLoading ? '0 0 10px rgba(0, 255, 0, 0.8)' : '0 1px 0 rgba(255, 255, 255, 0.3)',
                fontFamily: "'Courier New', monospace",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-2 h-2 bg-green-400 rounded-full"
                    style={{ animation: 'pulse 1s ease-in-out infinite' }}
                  />
                  <span style={{ animation: 'pulse 2s ease-in-out infinite' }}>DECRYPTING ACCESS</span>
                  <span className="inline-flex tracking-[0.3em]">
                    <span style={{ animation: 'blink 1s ease-in-out infinite' }}>.</span>
                    <span style={{ animation: 'blink 1s ease-in-out 0.2s infinite' }}>.</span>
                    <span style={{ animation: 'blink 1s ease-in-out 0.4s infinite' }}>.</span>
                  </span>
                </span>
              ) : (
                <>
                  <span className="relative z-10">⚡ ENTER THE INVESTIGATION</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <span className="text-amber-400/60 text-xs font-bold tracking-widest font-mono">ALTERNATE ACCESS</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => {
                playSound('buttonClick');
                signIn('google', { callbackUrl: '/student/dashboard' });
              }}
              onMouseEnter={() => playSound('buttonHover')}
              disabled={isLoading}
              className="w-full py-3 rounded font-bold tracking-wider transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-mono tracking-wider">GOOGLE CLEARANCE</span>
            </button>
          </form>

          {/* Register Links */}
          <div className="mt-8 pt-6" style={{ borderTop: '2px solid rgba(255, 215, 0, 0.3)' }}>
            <p
              className="text-center text-sm font-bold tracking-[0.15em] mb-4 uppercase font-mono"
              style={{ color: '#ff9500' }}
            >
              🕵️ RECRUIT NEW OPERATIVES
            </p>
            <div className="space-y-3">
              <SoundLink
                href="/register/student"
                clickSound="paperRustle"
                className="block w-full py-3 text-center font-bold tracking-wider rounded transition-all hover:scale-[1.02] font-mono group relative overflow-hidden"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
                }}
              >
                <span className="relative z-10">🎓 ENLIST AS JUNIOR DETECTIVE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </SoundLink>
              <SoundLink
                href="/register/teacher"
                clickSound="folderOpen"
                className="block w-full py-3 text-center font-bold tracking-wider rounded transition-all hover:scale-[1.02] font-mono group relative overflow-hidden"
                style={{
                  background: 'rgba(255, 149, 0, 0.1)',
                  color: '#ff9500',
                  border: '2px solid #ff9500',
                  boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)',
                }}
              >
                <span className="relative z-10">🎖️ APPLY AS SENIOR INVESTIGATOR</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </SoundLink>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-6 text-center">
            <p
              className="text-sm italic font-medium font-mono"
              style={{
                color: '#ffd700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            >
              "When you have eliminated the impossible, whatever remains,
              <br />however improbable, must be the truth."
            </p>
            <p className="text-amber-400/50 text-xs mt-1 font-mono">— Sherlock Holmes</p>
          </div>

          {/* Dev-only Quick Access */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p className="text-center text-xs text-gray-500 font-mono mb-2">⚙️ DEV BACKDOOR ACCESS</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    playSound('achievement');
                    setIsLoading(true);
                    setError('');
                    const result = await signIn('credentials', {
                      redirect: false,
                      email: 'admin@example.com',
                      password: 'admin123',
                    });
                    if (result?.error) {
                      setError('Admin login failed - check seed data');
                      setIsLoading(false);
                    } else {
                      router.push('/admin/dashboard');
                      router.refresh();
                    }
                  }}
                  onMouseEnter={() => playSound('buttonHover')}
                  disabled={isLoading}
                  className="flex-1 py-2 text-center text-xs font-mono tracking-wider rounded transition-all hover:scale-[1.02] opacity-70 hover:opacity-100"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px dashed #dc2626',
                  }}
                >
                  🔐 CHIEF
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    playSound('achievement');
                    setIsLoading(true);
                    setError('');
                    const result = await signIn('credentials', {
                      redirect: false,
                      email: 'teacher@example.com',
                      password: 'teacher123',
                    });
                    if (result?.error) {
                      setError('Teacher login failed - check seed data');
                      setIsLoading(false);
                    } else {
                      router.push('/teacher/dashboard');
                      router.refresh();
                    }
                  }}
                  onMouseEnter={() => playSound('buttonHover')}
                  disabled={isLoading}
                  className="flex-1 py-2 text-center text-xs font-mono tracking-wider rounded transition-all hover:scale-[1.02] opacity-70 hover:opacity-100"
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px dashed #2563eb',
                  }}
                >
                  🎖️ SENIOR
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    playSound('achievement');
                    setIsLoading(true);
                    setError('');
                    const result = await signIn('credentials', {
                      redirect: false,
                      email: 'student@example.com',
                      password: 'student123',
                    });
                    if (result?.error) {
                      setError('Student login failed - check seed data');
                      setIsLoading(false);
                    } else {
                      router.push('/student/dashboard');
                      router.refresh();
                    }
                  }}
                  onMouseEnter={() => playSound('buttonHover')}
                  disabled={isLoading}
                  className="flex-1 py-2 text-center text-xs font-mono tracking-wider rounded transition-all hover:scale-[1.02] opacity-70 hover:opacity-100"
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    border: '1px dashed #16a34a',
                  }}
                >
                  🎓 ROOKIE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 text-center">
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase font-mono"
            style={{
              color: '#ff9500',
              textShadow: '0 0 10px rgba(255, 149, 0, 0.5)',
            }}
          >
            ⚠️ AUTHORIZED PERSONNEL ONLY ⚠️
          </p>
          <p className="text-amber-400/40 text-xs mt-1 font-mono tracking-widest">
            SIGMA HQ • TANJONG PAGAR • EST. 2025
          </p>
        </div>
      </div>

      <style jsx>{`
        input::placeholder {
          color: rgba(255, 200, 0, 0.4);
        }
        input:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.5) !important;
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
