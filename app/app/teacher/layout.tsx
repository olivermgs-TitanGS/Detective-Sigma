'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const [currentTime, setCurrentTime] = useState('');
  const [glitchText, setGlitchText] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 100);
    }, 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      {/* Matrix Rain Background (hidden on mobile for performance) */}
      <div className="hidden md:block fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 text-xs animate-matrix-rain"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            {[...Array(30)].map((_, j) => (
              <div key={j} className="opacity-50">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scanlines Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
        }}
      />

      {/* CRT Screen Glow */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-30"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 255, 0, 0.1)',
        }}
      />

      {/* Terminal Header Bar */}
      <nav className="bg-black border-b border-green-500/50 sticky top-0 z-40">
        {/* Terminal Title Bar */}
        <div className="bg-green-900/30 border-b border-green-500/30 px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-green-500/70 text-xs">root@detective-sigma:~/teacher</span>
          <span className="text-green-500/70 text-xs">{currentTime}</span>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-green-400 hover:text-green-300 p-2"
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

              <Link
                href="/teacher/dashboard"
                className={`text-base md:text-xl font-bold text-green-400 tracking-wider hover:text-green-300 transition-colors flex items-center gap-1 md:gap-2 ${glitchText ? 'animate-pulse' : ''}`}
              >
                <span className="text-green-500">&gt;_</span>
                <span className="text-green-400 hidden sm:inline">TEACHER_</span>
                <span className="text-green-400">TERMINAL</span>
                <span className="animate-pulse hidden sm:inline">█</span>
              </Link>
              <div className="hidden md:flex gap-1">
                <Link
                  href="/teacher/dashboard"
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10 px-3 py-1 transition-colors text-sm border border-transparent hover:border-green-500/30"
                >
                  [DASHBOARD]
                </Link>
                <Link
                  href="/teacher/classes"
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10 px-3 py-1 transition-colors text-sm border border-transparent hover:border-green-500/30"
                >
                  [CLASSES]
                </Link>
                <Link
                  href="/teacher/reports"
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10 px-3 py-1 transition-colors text-sm border border-transparent hover:border-green-500/30"
                >
                  [REPORTS]
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-green-600 text-xs hidden sm:block">
                ACCESS: <span className="text-green-400">ADMIN</span>
              </span>
              <button
                onClick={handleLogout}
                className="border border-red-500/50 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-2 md:px-4 py-1 transition-all text-xs md:text-sm"
              >
                [EXIT]
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-green-500/30">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/teacher/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors text-sm py-2 px-3 border border-transparent hover:border-green-500/30"
              >
                [DASHBOARD]
              </Link>
              <Link
                href="/teacher/classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors text-sm py-2 px-3 border border-transparent hover:border-green-500/30"
              >
                [CLASSES]
              </Link>
              <Link
                href="/teacher/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors text-sm py-2 px-3 border border-transparent hover:border-green-500/30"
              >
                [REPORTS]
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* System Status Bar */}
      <div className="bg-green-900/10 border-b border-green-500/20 px-4 py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-green-600">
          <div className="flex items-center gap-6">
            <span>◉ SYSTEM: <span className="text-green-400">ONLINE</span></span>
            <span>◉ DATABASE: <span className="text-green-400">CONNECTED</span></span>
            <span className="hidden sm:inline">◉ ENCRYPTION: <span className="text-green-400">AES-256</span></span>
          </div>
          <div className="animate-pulse text-green-500">
            █ SECURE CONNECTION ESTABLISHED █
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Terminal Window Frame */}
        <div className="border border-green-500/30 bg-black/80 min-h-[calc(100vh-200px)]">
          {/* Terminal Content Header */}
          <div className="border-b border-green-500/20 px-4 py-2 flex items-center gap-2 text-green-600 text-xs">
            <span>$</span>
            <span className="text-green-400">./run_dashboard.sh</span>
            <span className="animate-pulse">|</span>
          </div>

          {/* Content */}
          <div className="p-4 text-green-100">
            {children}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 text-center text-green-700 text-xs">
          <span>DETECTIVE SIGMA EDUCATIONAL SYSTEM v2.0.25 | </span>
          <span>SESSION ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes matrix-rain {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        .animate-matrix-rain {
          animation: matrix-rain linear infinite;
        }
      `}</style>
    </div>
  );
}
