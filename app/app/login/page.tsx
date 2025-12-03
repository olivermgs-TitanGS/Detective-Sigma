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
    <div className="min-h-screen crime-scene-bg relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="chalk-body-outline" style={{ top: '10%', left: '5%', transform: 'rotate(25deg)', width: '200px', opacity: 0.1 }}></div>
      <div className="chalk-body-outline" style={{ bottom: '15%', right: '10%', transform: 'rotate(-15deg)', width: '180px', opacity: 0.1 }}></div>

      {/* Floating Dust Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Scanner Lines */}
      <div className="scanner-line" style={{ animationDelay: '0s' }}></div>
      <div className="scanner-line" style={{ animationDelay: '2s', top: '50%' }}></div>

      {/* Login Form */}
      <div className="relative z-30 w-full max-w-md mx-4">
        <div className="border-4 border-amber-600/50 bg-black/95 p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(245,158,11,0.3)]">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-4xl font-black text-amber-500 tracking-[0.3em] font-mono hover:text-amber-400 transition-colors">
                DETECTIVE SIGMA
              </h1>
            </Link>
            <div className="border-2 border-amber-600/50 bg-black px-4 py-2 inline-block">
              <p className="text-amber-400 font-mono text-sm tracking-wider">
                🔐 SECURE ACCESS REQUIRED
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 border-2 border-red-600 bg-red-900/20 p-4">
              <p className="text-red-400 font-mono text-sm text-center">⚠️ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-amber-400 font-mono text-sm tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border-2 border-amber-600/50 text-amber-50 px-4 py-3 font-mono focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all"
                placeholder="detective@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-amber-400 font-mono text-sm tracking-wider mb-2">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border-2 border-amber-600/50 text-amber-50 px-4 py-3 font-mono focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold py-4 tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
            >
              {isLoading ? 'ACCESSING...' : 'LOGIN →'}
            </button>
          </form>

          {/* Register Links */}
          <div className="mt-8 pt-6 border-t border-amber-600/30">
            <p className="text-slate-500 font-mono text-xs text-center mb-4 tracking-wider">
              NEW DETECTIVE?
            </p>
            <div className="space-y-3">
              <Link
                href="/register/student"
                className="block w-full border-2 border-amber-600/50 bg-black hover:bg-amber-600/10 text-amber-400 py-3 text-center font-mono text-sm tracking-wider transition-all hover:border-amber-600"
              >
                REGISTER AS STUDENT
              </Link>
              <Link
                href="/register/teacher"
                className="block w-full border-2 border-slate-600/50 bg-black hover:bg-slate-700/10 text-slate-400 py-3 text-center font-mono text-sm tracking-wider transition-all hover:border-slate-500"
              >
                REGISTER AS TEACHER
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-slate-600 hover:text-amber-400 font-mono text-xs tracking-wider transition-colors"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>

        {/* Case File Number */}
        <div className="mt-4 text-center">
          <p className="text-slate-700 font-mono text-xs tracking-wider">
            CASE FILE #AUTH-2025 • CLASSIFIED ACCESS
          </p>
        </div>
      </div>
    </div>
  );
}
