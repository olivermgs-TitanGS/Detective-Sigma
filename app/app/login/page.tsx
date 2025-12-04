'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = loginSchema.parse({ email, password });

      // Attempt login
      const result = await signIn('credentials', {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Redirect based on user role (will be handled by middleware)
      router.push('/student/dashboard');
      router.refresh();
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred during login');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#1a1510]">
      {/* Sherlock Holmes Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(26, 21, 16, 0.7), rgba(26, 21, 16, 0.9)),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3Cpattern id='victorian' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%23d4a574' stroke-width='0.5' opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%23d4a574' stroke-width='0.3' opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23victorian)'/%3E%3C/svg%3E")
          `,
          backgroundSize: 'cover, 200px 200px',
        }}
      />

      {/* Fog/Mist Effect */}
      <div className="absolute inset-0 z-1 opacity-30">
        <div className="absolute w-full h-full bg-gradient-to-t from-[#1a1510] via-transparent to-[#1a1510]" />
        <div
          className="absolute w-[200%] h-full animate-fog"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(200, 180, 160, 0.1), transparent)',
          }}
        />
      </div>

      {/* Decorative Elements - Victorian Style */}
      <div className="absolute top-8 left-8 text-amber-700/30 text-6xl z-10">🔍</div>
      <div className="absolute top-8 right-8 text-amber-700/30 text-5xl z-10">🎩</div>
      <div className="absolute bottom-8 left-8 text-amber-700/30 text-5xl z-10">🕯️</div>
      <div className="absolute bottom-8 right-8 text-amber-700/30 text-5xl z-10">📜</div>

      {/* Pipe Smoke Effect */}
      <div className="absolute top-1/4 right-1/4 z-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gray-400/20 animate-smoke"
            style={{
              animationDelay: `${i * 0.5}s`,
              left: `${i * 10}px`,
            }}
          />
        ))}
      </div>

      {/* Login Card - Victorian Study Style */}
      <div className="relative z-30 w-full max-w-md mx-4">
        {/* Decorative Frame */}
        <div className="absolute -inset-4 border-2 border-amber-800/30 rounded-sm" />
        <div className="absolute -inset-2 border border-amber-700/20 rounded-sm" />

        <div
          className="relative p-8 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(40, 32, 24, 0.98) 0%, rgba(30, 24, 18, 0.98) 100%)',
            boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(212, 165, 116, 0.3)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 text-5xl">🔎</div>
            <h1
              className="text-3xl font-bold tracking-widest mb-2"
              style={{
                fontFamily: "'Times New Roman', serif",
                color: '#d4a574',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              DETECTIVE SIGMA
            </h1>
            <p
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: '#8b7355' }}
            >
              221B Baker Street
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700/50" />
              <span className="text-amber-700/70 text-xs">EST. 2025</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700/50" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 text-center"
              style={{
                background: 'rgba(139, 69, 19, 0.2)',
                border: '1px solid rgba(139, 69, 19, 0.4)',
              }}
            >
              <p className="text-red-400 text-sm" style={{ fontFamily: "'Times New Roman', serif" }}>
                ⚠ {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs tracking-widest mb-2 uppercase"
                style={{ color: '#8b7355' }}
              >
                Electronic Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-amber-100 placeholder-amber-900/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(212, 165, 116, 0.3)',
                  fontFamily: "'Times New Roman', serif",
                }}
                placeholder="detective@bakerstreet.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs tracking-widest mb-2 uppercase"
                style={{ color: '#8b7355' }}
              >
                Secret Cipher
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-amber-100 placeholder-amber-900/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(212, 165, 116, 0.3)',
                  fontFamily: "'Times New Roman', serif",
                }}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #8b6914 0%, #6b4f0f 100%)',
                color: '#1a1510',
                fontFamily: "'Times New Roman', serif",
                boxShadow: '0 4px 15px rgba(139, 105, 20, 0.3)',
                border: '1px solid rgba(212, 165, 116, 0.5)',
              }}
            >
              {isLoading ? 'DEDUCING...' : 'ENTER THE STUDY'}
            </button>
          </form>

          {/* Register Links */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(212, 165, 116, 0.2)' }}>
            <p className="text-center text-xs tracking-widest mb-4 uppercase" style={{ color: '#6b5344' }}>
              New to the Agency?
            </p>
            <div className="space-y-3">
              <Link
                href="/register/student"
                className="block w-full py-3 text-center text-sm tracking-wider transition-all hover:brightness-125"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#d4a574',
                  border: '1px solid rgba(212, 165, 116, 0.3)',
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                Register as Student Detective
              </Link>
              <Link
                href="/register/teacher"
                className="block w-full py-3 text-center text-sm tracking-wider transition-all hover:brightness-125"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: '#8b7355',
                  border: '1px solid rgba(139, 115, 85, 0.3)',
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                Register as Master Detective
              </Link>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-6 text-center">
            <p
              className="text-xs italic"
              style={{ color: '#5a4a3a', fontFamily: "'Times New Roman', serif" }}
            >
              "The game is afoot!"
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 text-center">
          <p className="text-xs tracking-widest" style={{ color: '#4a3a2a' }}>
            CASE FILE #2025 • CONFIDENTIAL
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fog {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-fog {
          animation: fog 30s linear infinite;
        }
        @keyframes smoke {
          0% {
            opacity: 0.3;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(2);
          }
        }
        .animate-smoke {
          animation: smoke 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
