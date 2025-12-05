'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen crime-scene-bg relative overflow-hidden">
      {/* Navigation Bar - Dark Crime Scene Theme */}
      <nav className="bg-black/90 backdrop-blur-sm border-b-2 border-red-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-red-400 hover:text-red-300 p-2"
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

              <Link href="/admin/dashboard" className="text-lg md:text-2xl font-bold text-red-400 font-mono tracking-widest hover:text-red-300 transition-colors">
                🔐 <span className="hidden sm:inline">ADMIN </span>CONSOLE
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/admin/dashboard"
                  className="text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-red-600"
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/admin/cases"
                  className="text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-red-600"
                >
                  CASES
                </Link>
                <Link
                  href="/admin/users"
                  className="text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-red-600"
                >
                  USERS
                </Link>
                <Link
                  href="/admin/bulk-import"
                  className="text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-red-600"
                >
                  BULK IMPORT
                </Link>
                <Link
                  href="/admin/generate"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-amber-600"
                >
                  GENERATE
                </Link>
                <Link
                  href="/admin/syllabus"
                  className="text-green-400 hover:text-green-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-green-600"
                >
                  SYLLABUS
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:block text-slate-400 font-mono text-xs md:text-sm tracking-wider">ADMIN</span>
              <button className="border-2 border-red-600 bg-black hover:bg-red-600 hover:text-black text-red-400 px-2 md:px-4 py-1 md:py-2 transition-all font-mono font-bold tracking-wider text-xs md:text-sm">
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-red-800/30">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                📊 DASHBOARD
              </Link>
              <Link
                href="/admin/cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                📁 CASES
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                👥 USERS
              </Link>
              <Link
                href="/admin/bulk-import"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-red-400 hover:text-red-300 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                📥 BULK IMPORT
              </Link>
              <Link
                href="/admin/generate"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-amber-400 hover:text-amber-300 transition-colors font-mono tracking-wider text-sm py-2 border-b border-slate-800"
              >
                ⚡ GENERATE
              </Link>
              <Link
                href="/admin/syllabus"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-green-400 hover:text-green-300 transition-colors font-mono tracking-wider text-sm py-2"
              >
                📚 SYLLABUS
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Crime Scene Tape Strips (hidden on mobile for space) */}
      <div className="hidden md:block relative w-full h-16 overflow-hidden pointer-events-none">
        <div
          className="absolute top-2 left-0 w-full h-12 flex items-center justify-center transform -rotate-2"
          style={{
            background: 'repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 60px, #000000 60px, #000000 120px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.5)'
          }}
        >
          <div className="whitespace-nowrap animate-marquee">
            <span
              className="inline-block font-black tracking-[1em] text-lg px-8"
              style={{
                color: '#000000',
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: '1px 1px 0px rgba(220,38,38,0.3), -1px -1px 0px rgba(0,0,0,0.3)'
              }}
            >
              ADMIN RESTRICTED AREA • ADMIN RESTRICTED AREA • ADMIN RESTRICTED AREA • ADMIN RESTRICTED AREA •
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
