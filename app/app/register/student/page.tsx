'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { studentRegisterSchema } from '@/lib/validations/auth';

export default function StudentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gradeLevel: 'P4' as 'P4' | 'P5' | 'P6',
    parentConsent: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const validatedData = studentRegisterSchema.parse(formData);

      const response = await fetch('/api/auth/register/student', {
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
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

      {/* Registration Card */}
      <div className="relative z-30 w-full max-w-md mx-4 my-8">
        {/* Glowing Border */}
        <div
          className="absolute -inset-1 rounded-lg opacity-60 blur-sm"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700)',
          }}
        />

        <div
          className="relative p-6 md:p-8 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
            border: '2px solid #ffd700',
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.3), inset 0 0 80px rgba(0, 0, 0, 0.9)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1
              className="text-2xl md:text-3xl font-black tracking-[0.15em] mb-2"
              style={{
                color: '#ffd700',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              JOIN THE AGENCY
            </h1>
            <p
              className="text-sm tracking-[0.2em] uppercase font-bold"
              style={{ color: '#ff9500', textShadow: '0 0 10px rgba(255, 149, 0, 0.5)' }}
            >
              Student Detective Registration
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 text-center rounded"
              style={{
                background: 'rgba(220, 38, 38, 0.3)',
                border: '2px solid #ff4444',
                boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)',
              }}
            >
              <p className="text-red-400 font-bold text-sm">⚠ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold tracking-[0.15em] mb-1.5 uppercase"
                style={{ color: '#ffd700' }}
              >
                Detective Codename
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded font-medium focus:outline-none transition-all text-sm"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="Enter your codename"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold tracking-[0.15em] mb-1.5 uppercase"
                style={{ color: '#ffd700' }}
              >
                Secure Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded font-medium focus:outline-none transition-all text-sm"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="your.email@school.edu.sg"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold tracking-[0.15em] mb-1.5 uppercase"
                style={{ color: '#ffd700' }}
              >
                Secret Cipher (Password)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded font-medium focus:outline-none transition-all text-sm"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="Minimum 6 characters"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold tracking-[0.15em] mb-1.5 uppercase"
                style={{ color: '#ffd700' }}
              >
                Detective Rank
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value as 'P4' | 'P5' | 'P6' })}
                className="w-full px-4 py-2.5 rounded font-medium focus:outline-none transition-all text-sm"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
                }}
                required
                disabled={isLoading}
              >
                <option value="P4">PRIMARY 4 - Rookie</option>
                <option value="P5">PRIMARY 5 - Junior</option>
                <option value="P6">PRIMARY 6 - Senior</option>
              </select>
            </div>

            <div
              className="flex items-start gap-3 p-3 rounded"
              style={{
                background: 'rgba(255, 215, 0, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.4)',
              }}
            >
              <input
                type="checkbox"
                checked={formData.parentConsent}
                onChange={(e) => setFormData({ ...formData, parentConsent: e.target.checked })}
                className="mt-0.5 w-5 h-5 rounded"
                style={{ accentColor: '#ffd700' }}
                required
                disabled={isLoading}
              />
              <label className="text-xs leading-relaxed" style={{ color: '#dddddd' }}>
                I confirm my parent/guardian has approved my registration to Detective Sigma for educational mystery-solving.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded font-black text-base tracking-[0.15em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: '#000000',
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
                border: '2px solid #ffea00',
              }}
            >
              {isLoading ? '🔄 PROCESSING...' : '🔍 BEGIN INVESTIGATION'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 pt-4 text-center" style={{ borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <p className="text-sm" style={{ color: '#aaaaaa' }}>
              Already recruited?{' '}
              <Link
                href="/login"
                className="font-bold hover:underline transition-all"
                style={{ color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}
              >
                ACCESS YOUR FILE
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-4 text-center">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: '#ff9500', textShadow: '0 0 15px rgba(255, 149, 0, 0.5)' }}
          >
            🔒 CLASSIFIED • CASE FILE #2025
          </p>
        </div>
      </div>

      <style jsx>{`
        input::placeholder {
          color: rgba(255, 200, 0, 0.4);
        }
        input:focus, select:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
