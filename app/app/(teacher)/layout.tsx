import Link from 'next/link';
import { ReactNode } from 'react';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/teacher/dashboard" className="text-2xl font-bold text-white">
                👨‍🏫 Detective Sigma Teacher
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/teacher/dashboard"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/teacher/classes"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  My Classes
                </Link>
                <Link
                  href="/teacher/reports"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Reports
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-blue-200">Teacher Portal</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
