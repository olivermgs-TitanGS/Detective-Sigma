'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { teacherRegisterSchema } from '@/lib/validations/auth';

export default function TeacherRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    schoolName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = teacherRegisterSchema.parse(formData);

      // Call registration API
      const response = await fetch('/api/auth/register/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Redirect to login on success
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.errors) {
        // Zod validation error
        setError(err.errors[0].message);
      } else if (err.message) {
        // Network or other error with message
        setError(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen crime-scene-bg relative overflow-hidden flex items-center justify-center py-12">
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

      {/* Registration Form */}
      <div className="relative z-30 w-full max-w-md mx-4">
        <div className="border-4 border-slate-600/50 bg-black/95 p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(100,116,139,0.3)]">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-3xl font-black text-amber-500 tracking-[0.3em] font-mono hover:text-amber-400 transition-colors">
                DETECTIVE SIGMA
              </h1>
            </Link>
            <div className="border-2 border-slate-600/50 bg-black px-4 py-2 inline-block">
              <p className="text-slate-400 font-mono text-xs tracking-wider">
                👨‍🏫 TEACHER REGISTRATION
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 border-2 border-red-600 bg-red-900/20 p-4">
              <p className="text-red-400 font-mono text-xs text-center">⚠️ {error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-slate-400 font-mono text-xs tracking-wider mb-2">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-black border-2 border-slate-600/50 text-slate-50 px-4 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all"
                placeholder="teacher_name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-400 font-mono text-xs tracking-wider mb-2">
                MOE EMAIL (@moe.edu.sg)
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border-2 border-slate-600/50 text-slate-50 px-4 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all"
                placeholder="name@moe.edu.sg"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-400 font-mono text-xs tracking-wider mb-2">
                PASSWORD (MIN. 6 CHARACTERS)
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black border-2 border-slate-600/50 text-slate-50 px-4 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-slate-400 font-mono text-xs tracking-wider mb-2">
                SCHOOL NAME (OPTIONAL)
              </label>
              <input
                id="schoolName"
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full bg-black border-2 border-slate-600/50 text-slate-50 px-4 py-2 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all"
                placeholder="School Name"
                disabled={isLoading}
              />
            </div>

            <div className="border-2 border-slate-700 bg-slate-900/30 p-4">
              <p className="text-slate-500 font-mono text-xs leading-relaxed">
                📋 Note: Teacher accounts require MOE email verification. You will have access to create classes, assign cases, and monitor student progress.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-50 font-mono font-bold py-3 tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(100,116,139,0.6)]"
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER →'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-600/30 text-center">
            <p className="text-slate-500 font-mono text-xs tracking-wider">
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link href="/login" className="text-slate-400 hover:text-slate-300 transition-colors">
                LOGIN
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
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
            CASE FILE #REG-TEACHER-2025 • CLEARANCE: EDUCATOR
          </p>
        </div>
      </div>
    </div>
  );
}
