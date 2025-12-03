import Link from 'next/link';
import { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Crime Scene Tape Header - Repeating Text */}
      <div className="relative border-y-4 border-amber-500 bg-amber-500/20 py-2 overflow-hidden transform -rotate-1">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="text-black font-mono font-black tracking-[0.5em] text-sm mx-8">⚠️ CRIME SCENE DO NOT CROSS ⚠️ CRIME SCENE DO NOT CROSS ⚠️ CRIME SCENE DO NOT CROSS ⚠️ CRIME SCENE DO NOT CROSS ⚠️ CRIME SCENE DO NOT CROSS ⚠️ CRIME SCENE DO NOT CROSS ⚠️</span>
        </div>
      </div>
      <div className="relative border-y-4 border-amber-500 bg-amber-500/20 py-2 overflow-hidden transform rotate-1 mt-2">
        <div className="animate-marquee-reverse whitespace-nowrap inline-block">
          <span className="text-black font-mono font-black tracking-[0.5em] text-sm mx-8">⚠️ POLICE LINE DO NOT CROSS ⚠️ POLICE LINE DO NOT CROSS ⚠️ POLICE LINE DO NOT CROSS ⚠️ POLICE LINE DO NOT CROSS ⚠️ POLICE LINE DO NOT CROSS ⚠️ POLICE LINE DO NOT CROSS ⚠️</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-black border-b-2 border-amber-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/student/dashboard" className="text-2xl font-bold font-mono tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                🔍 DETECTIVE SIGMA
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
                  href="/student/progress"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm"
                >
                  MY PROGRESS
                </Link>
                <Link
                  href="/student/leaderboard"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-mono tracking-wider text-sm"
                >
                  LEADERBOARD
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-mono text-sm tracking-wider">DETECTIVE</span>
              <button className="border-2 border-red-800 bg-black hover:bg-red-900 text-red-400 px-4 py-2 font-mono tracking-wider text-sm transition-colors">
                LOGOUT
              </button>
            </div>
          </div>
        </div>
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
