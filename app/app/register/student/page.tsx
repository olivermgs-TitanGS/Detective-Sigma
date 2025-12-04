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
      if (err.errors) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred during registration');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black py-8">
      {/* Dramatic Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 180, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(255, 200, 0, 0.1) 0%, transparent 40%),
            linear-gradient(180deg, #000000 0%, #0a0a0a 100%)
          `,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-1 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 200, 0, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 200, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Decorative Icons */}
      <div className="absolute top-6 left-6 text-6xl z-10 drop-shadow-[0_0_20px_rgba(255,200,0,0.8)]">🎓</div>
      <div className="absolute top-6 right-6 text-5xl z-10 drop-shadow-[0_0_20px_rgba(255,200,0,0.8)]">🔍</div>
      <div className="absolute bottom-6 left-6 text-5xl z-10 drop-shadow-[0_0_15px_rgba(255,150,0,0.6)]">📚</div>
      <div className="absolute bottom-6 right-6 text-5xl z-10 drop-shadow-[0_0_15px_rgba(255,150,0,0.6)]">🏆</div>

      {/* Registration Card */}
      <div className="relative z-30 w-full max-w-md mx-4">
        {/* Glowing Border */}
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
          <div className="text-center mb-6">
            <div
              className="mb-3 text-5xl"
              style={{ filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' }}
            >
              🎓
            </div>
            <h1
              className="text-3xl font-black tracking-[0.15em] mb-2"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              STUDENT REGISTRATION
            </h1>
            <p
              className="text-sm tracking-[0.3em] uppercase font-bold"
              style={{ color: '#ff9500' }}
            >
              Join the Detective Agency
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 text-center rounded"
              style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid #dc2626',
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              <p className="text-red-400 font-bold text-sm">⚠ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                Detective Name
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="Enter your detective name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                School Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="name@students.edu.sg"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                Secret Cipher (Password)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                placeholder="Min. 6 characters"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold tracking-[0.15em] mb-2 uppercase"
                style={{ color: '#ffd700' }}
              >
                Grade Level
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value as 'P4' | 'P5' | 'P6' })}
                className="w-full px-4 py-3 rounded font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #ff9500',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                }}
                required
                disabled={isLoading}
              >
                <option value="P4">PRIMARY 4 (Rookie Detective)</option>
                <option value="P5">PRIMARY 5 (Junior Detective)</option>
                <option value="P6">PRIMARY 6 (Senior Detective)</option>
              </select>
            </div>

            <div
              className="flex items-start gap-3 p-3 rounded"
              style={{
                background: 'rgba(255, 215, 0, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              <input
                type="checkbox"
                checked={formData.parentConsent}
                onChange={(e) => setFormData({ ...formData, parentConsent: e.target.checked })}
                className="mt-1 w-5 h-5"
                style={{ accentColor: '#ffd700' }}
                required
                disabled={isLoading}
              />
              <label className="text-sm" style={{ color: '#cccccc' }}>
                I confirm my parent/guardian has given consent for me to join Detective Sigma for educational purposes.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded font-black text-lg tracking-[0.15em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: '#000000',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                border: '2px solid #ffea00',
              }}
            >
              {isLoading ? '🔄 REGISTERING...' : '🎓 CREATE ACCOUNT'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 text-center" style={{ borderTop: '2px solid rgba(255, 215, 0, 0.3)' }}>
            <p className="text-sm" style={{ color: '#999999' }}>
              Already a detective?{' '}
              <Link
                href="/login"
                className="font-bold hover:underline"
                style={{ color: '#ffd700' }}
              >
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-4 text-center">
          <p
            className="text-sm font-bold tracking-[0.2em]"
            style={{ color: '#ff9500', textShadow: '0 0 10px rgba(255, 149, 0, 0.5)' }}
          >
            CASE FILE #REG-2025 • CADET CLEARANCE
          </p>
        </div>
      </div>

      <style jsx>{`
        input::placeholder, select::placeholder {
          color: rgba(255, 200, 0, 0.4);
        }
        input:focus, select:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
