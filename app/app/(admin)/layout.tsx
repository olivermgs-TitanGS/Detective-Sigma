import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-white">
                🔐 Detective Sigma Admin
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/admin/dashboard"
                  className="text-red-200 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/cases"
                  className="text-red-200 hover:text-white transition-colors"
                >
                  Cases
                </Link>
                <Link
                  href="/admin/users"
                  className="text-red-200 hover:text-white transition-colors"
                >
                  Users
                </Link>
                <Link
                  href="/admin/bulk-import"
                  className="text-red-200 hover:text-white transition-colors"
                >
                  Bulk Import
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-200">Admin</span>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
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
