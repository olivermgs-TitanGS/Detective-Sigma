'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MusicThemeSetter from '@/components/MusicThemeSetter';

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleEnter = () => {
    setShowOptions(true);
  };

  return (
    <div className="min-h-screen crime-scene-bg relative overflow-hidden flex items-center justify-center">
      <MusicThemeSetter theme="registration" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-90" />

      {/* Floating Dust Particles */}
      {[...Array(20)].map((_, i) => (
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
      <div className="scanner-line" style={{ animationDelay: '0s' }} />
      <div className="scanner-line" style={{ animationDelay: '3s', top: '60%' }} />

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo/Badge */}
        <div className="mb-8">
          <div className="inline-block border-4 border-amber-600 bg-black/80 p-6 transform rotate-[-2deg] shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            <div className="text-7xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              🔍
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-amber-500 tracking-[0.2em] font-mono">
              DETECTIVE
            </h1>
            <h1 className="text-5xl md:text-7xl font-black text-amber-400 tracking-[0.3em] font-mono mt-2">
              SIGMA
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-slate-400 font-mono text-lg tracking-wider mb-2">
          MATHEMATICS MYSTERY ACADEMY
        </p>
        <p className="text-slate-500 font-mono text-sm tracking-wide mb-12">
          Solve Mysteries. Master Math. Become a Detective.
        </p>

        {/* Enter Button - shows before clicking */}
        {!showOptions && (
          <div className={`transition-all duration-500 ${showOptions ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <button
              onClick={handleEnter}
              className="group relative px-16 py-6 bg-black border-4 border-amber-600
                hover:bg-amber-600 hover:text-black text-amber-400 font-mono font-bold text-2xl
                tracking-[0.3em] transition-all duration-300
                hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]
                hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">ENTER</span>
              {/* Animated border glow */}
              <div className="absolute inset-0 border-2 border-amber-400 opacity-0 group-hover:opacity-100 animate-pulse" />
            </button>

            {/* Hint */}
            <p className="mt-8 text-slate-600 font-mono text-xs tracking-wider animate-pulse">
              🔊 CLICK TO ENABLE AUDIO
            </p>
          </div>
        )}

        {/* Login/Register Options - shows after clicking ENTER */}
        {showOptions && (
          <div className="transition-all duration-500 animate-fadeIn space-y-6">
            {/* Login Button */}
            <Link
              href="/login"
              className="block w-full max-w-md mx-auto px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-700
                hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xl
                tracking-[0.2em] transition-all duration-300
                hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]
                hover:scale-105 active:scale-95 border-2 border-amber-400"
            >
              🔓 LOGIN
            </Link>

            {/* Register Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link
                href="/register/student"
                className="flex-1 px-8 py-4 bg-black border-2 border-green-500
                  hover:bg-green-500 hover:text-black text-green-400 font-mono font-bold text-lg
                  tracking-wider transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]
                  hover:scale-105 active:scale-95"
              >
                🎓 STUDENT
              </Link>

              <Link
                href="/register/teacher"
                className="flex-1 px-8 py-4 bg-black border-2 border-blue-500
                  hover:bg-blue-500 hover:text-black text-blue-400 font-mono font-bold text-lg
                  tracking-wider transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
                  hover:scale-105 active:scale-95"
              >
                👨‍🏫 TEACHER
              </Link>
            </div>

            {/* Back button */}
            <button
              onClick={() => setShowOptions(false)}
              className="text-slate-500 hover:text-amber-400 font-mono text-sm tracking-wider transition-colors mt-4"
            >
              ← BACK
            </button>
          </div>
        )}

        {/* Crime Scene Tape */}
        <div className="mt-16 opacity-30">
          <div className="inline-block bg-amber-500 text-black font-mono font-bold text-xs tracking-[0.5em] px-8 py-2 transform -rotate-2">
            CASE FILES PENDING
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-slate-700 font-mono text-xs tracking-wider">
          FOR SINGAPORE PRIMARY SCHOOLS • P4-P6 CURRICULUM ALIGNED
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
