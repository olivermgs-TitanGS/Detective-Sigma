'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@/lib/validations/auth';
import MusicThemeSetter from '@/components/MusicThemeSetter';

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
      const validatedData = loginSchema.parse({ email, password });

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
        className="absolute inset-0 z-1"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Gold accent glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 z-2"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Login Card */}
      <div className="relative z-30 w-full max-w-md mx-4">
        {/* Glowing Border Effect */}
        <div
          className="absolute -inset-1 rounded-lg opacity-75 blur-sm"
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
              className="mb-4 text-6xl"
              style={{ filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' }}
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
              DETECTIVE SIGMA
            </h1>
            <p
              className="text-lg tracking-[0.4em] uppercase font-bold"
              style={{
                color: '#ff9500',
                textShadow: '0 0 10px rgba(255, 149, 0, 0.6)',
              }}
            >
              221B Baker Street
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <span className="text-amber-400 text-sm font-bold tracking-widest">EST. 2025</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 text-center rounded"
              style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid #dc2626',
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              <p className="text-red-400 font-bold text-sm tracking-wider">
                ⚠ {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold tracking-[0.2em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                Electronic Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="detective@bakerstreet.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold tracking-[0.2em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                Secret Cipher
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded font-black text-lg tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: '#000000',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
                border: '2px solid #ffea00',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              {isLoading ? '🔄 DEDUCING...' : '🔓 ENTER THE STUDY'}
            </button>
          </form>

          {/* Register Links */}
          <div className="mt-8 pt-6" style={{ borderTop: '2px solid rgba(255, 215, 0, 0.3)' }}>
            <p
              className="text-center text-sm font-bold tracking-[0.2em] mb-4 uppercase"
              style={{ color: '#ff9500' }}
            >
              New to the Agency?
            </p>
            <div className="space-y-3">
              <Link
                href="/register/student"
                className="block w-full py-3 text-center font-bold tracking-wider rounded transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
                }}
              >
                🎓 REGISTER AS STUDENT
              </Link>
              <Link
                href="/register/teacher"
                className="block w-full py-3 text-center font-bold tracking-wider rounded transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 149, 0, 0.1)',
                  color: '#ff9500',
                  border: '2px solid #ff9500',
                  boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)',
                }}
              >
                👨‍🏫 REGISTER AS TEACHER
              </Link>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-6 text-center">
            <p
              className="text-base italic font-medium"
              style={{
                color: '#ffd700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            >
              "Every math problem is a mystery waiting to be solved."
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 text-center">
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase"
            style={{
              color: '#ff9500',
              textShadow: '0 0 10px rgba(255, 149, 0, 0.5)',
            }}
          >
            CASE FILE #2025 • CONFIDENTIAL
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
      `}</style>
    </div>
  );
}
