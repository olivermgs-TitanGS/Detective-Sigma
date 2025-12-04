'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  casesSolved: number;
  totalScore: number;
  totalClues: number;
  rank: number;
}

interface ActiveCase {
  id: string;
  caseId: string;
  status: string;
  score: number;
  currentSceneIndex: number;
  updatedAt: string;
  case: {
    title: string;
    difficulty: string;
    coverImage: string;
  };
}

interface RecentActivity {
  id: string;
  status: string;
  score: number;
  updatedAt: string;
  case: {
    title: string;
    difficulty: string;
    coverImage: string;
  };
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    casesSolved: 0,
    totalScore: 0,
    totalClues: 0,
    rank: 0,
  });
  const [activeCases, setActiveCases] = useState<ActiveCase[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard', {
          credentials: 'include',
        });
        if (res.status === 401) {
          // User not logged in, redirect to login
          window.location.href = '/api/auth/signin';
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActiveCases(data.activeCases || []);
          setRecentActivity(data.recentActivity || []);
        } else {
          console.error('Dashboard API error:', res.status);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'ROOKIE': return 'text-green-400 border-green-400';
      case 'INSPECTOR': return 'text-yellow-400 border-yellow-400';
      case 'DETECTIVE': return 'text-orange-400 border-orange-400';
      case 'CHIEF': return 'text-red-400 border-red-400';
      default: return 'text-purple-400 border-purple-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SOLVED':
        return <span className="text-green-400 font-mono text-xs">SOLVED</span>;
      case 'IN_PROGRESS':
        return <span className="text-yellow-400 font-mono text-xs">IN PROGRESS</span>;
      default:
        return <span className="text-slate-400 font-mono text-xs">NEW</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/student-dashboard-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark Overlay */}
        <div
          className="fixed inset-0 z-[1]"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
          }}
        />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <p className="text-amber-500 font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/student-dashboard-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark Overlay for readability */}
      <div
        className="fixed inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 space-y-8">
        {/* Welcome Section - Crime Scene Style */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          WELCOME BACK, DETECTIVE
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Ready to solve mysteries and close cases?
        </p>
      </div>

      {/* Stats Grid - Evidence Tags */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">{stats.casesSolved}</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CASES SOLVED</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">{stats.totalScore}</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL SCORE</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">{stats.totalClues}</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CLUES COLLECTED</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">
            {stats.rank > 0 ? `#${stats.rank}` : '-'}
          </div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CURRENT RANK</div>
        </div>
      </div>

      {/* Active Cases - Investigation Board */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          ACTIVE INVESTIGATIONS
        </h2>
        {activeCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCases.map((activeCase) => (
              <Link
                key={activeCase.id}
                href={`/student/cases/${activeCase.caseId}/play`}
                className="border-2 border-amber-600/30 bg-black/60 p-4 hover:border-amber-600 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{activeCase.case.coverImage || '📁'}</span>
                  <div>
                    <h3 className="text-amber-50 font-mono font-bold group-hover:text-amber-400 transition-colors">
                      {activeCase.case.title}
                    </h3>
                    <span className={`text-xs font-mono border px-2 py-0.5 ${getDifficultyColor(activeCase.case.difficulty)}`}>
                      {activeCase.case.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-mono">Scene {activeCase.currentSceneIndex + 1}</span>
                  <span className="text-amber-400 font-mono">CONTINUE →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-mono">NO ACTIVE CASES</p>
            <p className="text-sm mt-2 font-mono tracking-wide">
              &gt; Visit the Case Library to start your first investigation
            </p>
            <Link
              href="/student/cases"
              className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
            >
              BROWSE CASES
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activity - Case Log */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          CASE LOG - RECENT ACTIVITY
        </h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="border border-amber-600/20 bg-black/40 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{activity.case.coverImage || '📁'}</span>
                  <div>
                    <h3 className="text-amber-50 font-mono font-bold">{activity.case.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {getStatusBadge(activity.status)}
                      <span className="text-slate-500 font-mono text-xs">
                        {formatDate(activity.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-mono font-bold">{activity.score} pts</div>
                  <span className={`text-xs font-mono ${getDifficultyColor(activity.case.difficulty)}`}>
                    {activity.case.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-mono">NO ACTIVITY LOGGED</p>
            <p className="text-sm mt-2 font-mono tracking-wide">
              &gt; Start solving cases to track your progress here
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
