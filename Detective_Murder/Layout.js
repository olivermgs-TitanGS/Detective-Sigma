import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Briefcase, Map, FileText, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isGamePage = location.pathname.includes('/Game');

  const handleLogout = async () => {
      await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-900 selection:text-white overflow-x-hidden">
       {/* Noir Ambience Overlay */}
       <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
       
       {/* Header / Navigation - Hidden on Game Page for immersion, or minimal */}
      {!isGamePage && (
        <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:bg-amber-600 transition-colors">
                 <Briefcase className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-slate-100 tracking-tight leading-none">NOIR ACADEMY</h1>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Detective Division</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
               <Link to={createPageUrl('Dashboard')} className={`text-sm font-medium transition-colors hover:text-amber-500 ${currentPageName === 'Dashboard' ? 'text-amber-500' : 'text-slate-400'}`}>
                 CASE FILES
               </Link>
               <Link to={createPageUrl('Leaderboard')} className={`text-sm font-medium transition-colors hover:text-amber-500 ${currentPageName === 'Leaderboard' ? 'text-amber-500' : 'text-slate-400'}`}>
                 TOP DETECTIVES
               </Link>
               <Link to={createPageUrl('MasterMystery')} className={`text-sm font-medium transition-colors hover:text-amber-500 ${currentPageName === 'MasterMystery' ? 'text-amber-500' : 'text-slate-400'}`}>
                 MASTER DEDUCTION
               </Link>
            </nav>

            <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right mr-2">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="text-sm font-semibold text-amber-500">Detective</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-amber-500 hover:bg-slate-800">
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      <Toaster position="top-center" theme="dark" />
      
      {/* Global Scanlines Effect for retro feel */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}