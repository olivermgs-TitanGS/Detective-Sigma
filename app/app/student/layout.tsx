'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
// MusicPlayer is in root layout - removed here to prevent overlapping audio

// Pre-computed particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 5, delay: 0.5, duration: 12 },
  { left: 15, delay: 3.2, duration: 14 },
  { left: 25, delay: 7.8, duration: 11 },
  { left: 35, delay: 1.1, duration: 16 },
  { left: 45, delay: 9.4, duration: 13 },
  { left: 55, delay: 4.6, duration: 15 },
  { left: 65, delay: 12.3, duration: 18 },
  { left: 75, delay: 6.7, duration: 10 },
  { left: 85, delay: 2.9, duration: 17 },
  { left: 95, delay: 8.1, duration: 12 },
  { left: 10, delay: 5.5, duration: 14 },
  { left: 30, delay: 11.2, duration: 16 },
  { left: 50, delay: 0.8, duration: 13 },
  { left: 70, delay: 14.1, duration: 11 },
  { left: 90, delay: 3.9, duration: 15 },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
  return (
    <div className="min-h-screen crime-scene-bg relative">
      {/* Chalk Outline Decorations */}
      <div className="chalk-body-outline" style={{ top: '20%', right: '5%', transform: 'rotate(-15deg)' }}></div>
      <div className="chalk-body-outline" style={{ bottom: '10%', left: '10%', transform: 'rotate(25deg)' }}></div>

      {/* Floating Dust Particles - only render after mount to avoid hydration mismatch */}
      {isMounted && PARTICLE_POSITIONS.map((particle, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Scanner Line Effect */}
      <div className="scanner-line" style={{ animationDelay: '0s' }}></div>
      <div className="scanner-line" style={{ animationDelay: '1.5s', top: '50%' }}></div>

      {/* Music Player is in root layout */}
      {/* Realistic Crime Scene Tape - Physical Look (hidden on mobile for space) */}
      <div
        className="hidden md:block relative py-4 overflow-hidden transform -rotate-2 shadow-lg"
        style={{
          background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)'
        }}
      >
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[0.8em] text-xl mx-12"
            style={{
              color: '#000000',
              textShadow: '2px 2px 0px rgba(255,215,0,0.3), -1px -1px 0px rgba(0,0,0,0.5)',
              fontFamily: 'Impact, Arial Black, sans-serif'
            }}
          >
            CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS •
          </span>
        </div>
      </div>

      <div
        className="hidden md:block relative py-4 overflow-hidden transform rotate-1 shadow-lg"
        style={{
          background: 'repeating-linear-gradient(-45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
          marginTop: '8px'
        }}
      >
        <div className="animate-marquee-reverse whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[0.8em] text-xl mx-12"
            style={{
              color: '#000000',
              textShadow: '2px 2px 0px rgba(255,215,0,0.3), -1px -1px 0px rgba(0,0,0,0.5)',
              fontFamily: 'Impact, Arial Black, sans-serif'
            }}
          >
            POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS •
          </span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-black border-b-2 border-amber-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-amber-500 hover:text-amber-400 p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <Link href="/student/dashboard" className="text-lg md:text-2xl font-bold font-mono tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                🔍 <span className="hidden sm:inline">DETECTIVE </span>SIGMA
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/student/dashboard"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm"
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/student/cases"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm"
                >
                  CASE LIBRARY
                </Link>
                <Link
                  href="/student/leaderboard"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm"
                >
                  LEADERBOARD
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:block text-slate-500 font-mono text-sm tracking-wider">DETECTIVE</span>
              <button
                onClick={handleLogout}
                className="border-2 border-red-800 bg-black hover:bg-red-900 text-red-400 px-2 md:px-4 py-1 md:py-2 font-mono tracking-wider text-xs md:text-sm transition-colors"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-amber-600/30">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                📊 DASHBOARD
              </Link>
              <Link
                href="/student/cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                📁 CASE LIBRARY
              </Link>
              <Link
                href="/student/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm py-2"
              >
                🏆 LEADERBOARD
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer - Case File Info */}
      <footer className="border-t-2 border-amber-600/30 bg-black mt-12 py-4">
        <p className="text-center text-slate-700 font-mono text-xs tracking-wider">
          DETECTIVE SIGMA • CLASSIFIED ACCESS • SESSION ACTIVE
        </p>
      </footer>
    </div>
  );
}
