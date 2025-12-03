import Link from 'next/link';
import { ReactNode } from 'react';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen crime-scene-bg relative overflow-hidden">
      {/* Navigation Bar - Dark Crime Scene Theme */}
      <nav className="bg-black/90 backdrop-blur-sm border-b-2 border-amber-600/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/teacher/dashboard" className="text-2xl font-bold text-amber-400 font-mono tracking-widest hover:text-amber-300 transition-colors">
                👨‍🏫 TEACHER PORTAL
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/teacher/dashboard"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-amber-600"
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/teacher/classes"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-amber-600"
                >
                  MY CLASSES
                </Link>
                <Link
                  href="/teacher/reports"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-mono tracking-wider border-b-2 border-transparent hover:border-amber-600"
                >
                  REPORTS
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-mono text-sm tracking-wider">INSTRUCTOR ACCESS</span>
              <button className="border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-4 py-2 transition-all font-mono font-bold tracking-wider">
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Crime Scene Tape Strips */}
      <div className="relative w-full h-16 overflow-hidden pointer-events-none">
        <div
          className="absolute top-2 left-0 w-full h-12 flex items-center justify-center transform -rotate-2"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.5)'
          }}
        >
          <div className="whitespace-nowrap animate-marquee">
            <span
              className="inline-block font-black tracking-[1em] text-lg px-8"
              style={{
                color: '#000000',
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: '1px 1px 0px rgba(255,215,0,0.3), -1px -1px 0px rgba(0,0,0,0.3)'
              }}
            >
              TEACHER ZONE DO NOT DISTURB • TEACHER ZONE DO NOT DISTURB • TEACHER ZONE DO NOT DISTURB • TEACHER ZONE DO NOT DISTURB •
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
