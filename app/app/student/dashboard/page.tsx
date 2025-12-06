'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar, ProgressRing } from '@/components/ui/ProgressBar';
import { PageSkeleton, StatSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { StreakFire } from '@/components/ui/StreakFire';
import { StaggerContainer, StaggerItem } from '@/components/ui/PageTransition';
import DetectiveRank from '@/components/ui/DetectiveRank';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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

interface ProgressData {
  id: string;
  caseId: string;
  status: string;
  score: number;
  cluesCollected: string[];
  puzzlesSolved: string[];
  timeSpent: number;
  startedAt: string;
  completedAt: string | null;
  case: {
    id: string;
    title: string;
    difficulty: string;
    coverImage: string;
  };
}

// Daily detective tips
const DETECTIVE_TIPS = [
  "A good detective always checks the timeline twice.",
  "Never assume - let the evidence guide you.",
  "The smallest clue can crack the biggest case.",
  "Listen carefully - suspects often reveal more than they intend.",
  "Mathematics is your ally in verifying alibis.",
  "Cross-reference every statement with physical evidence.",
  "Patience and persistence solve cases.",
  "Trust the data, but question everything else.",
];

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    casesSolved: 0,
    totalScore: 0,
    totalClues: 0,
    rank: 0,
  });
  const [activeCases, setActiveCases] = useState<ActiveCase[]>([]);
  const [allProgress, setAllProgress] = useState<ProgressData[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [dailyTip] = useState(() => DETECTIVE_TIPS[Math.floor(Math.random() * DETECTIVE_TIPS.length)]);

  const router = useRouter();
  const { playSound } = useSoundEffects();

  // Navigation with loading state and sound
  const handleNavigate = (path: string, caseId?: string) => {
    playSound('caseFileOpen');
    setNavigatingTo(caseId || path);
    router.push(path);
  };

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch dashboard, progress, and total cases in parallel
        const [dashboardRes, progressRes, casesRes] = await Promise.all([
          fetch('/api/dashboard', { credentials: 'include' }),
          fetch('/api/progress', { credentials: 'include' }),
          fetch('/api/cases?published=true', { credentials: 'include' }),
        ]);

        if (dashboardRes.status === 401) {
          window.location.href = '/api/auth/signin';
          return;
        }

        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setStats(data.stats);
          setActiveCases(data.activeCases || []);
        }

        if (progressRes.ok) {
          const data = await progressRes.json();
          setAllProgress(data.progress || []);
        }

        if (casesRes.ok) {
          const data = await casesRes.json();
          setTotalCases(data.cases?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const solveRate = totalCases > 0 && stats
    ? Math.round((stats.casesSolved / totalCases) * 100)
    : 0;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton header */}
        <div className="border-2 border-amber-600/50 bg-black/80 p-8">
          <div className="h-10 w-64 bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-slate-700 rounded animate-pulse" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <StaggerContainer className="space-y-8" staggerDelay={0.1}>
      {/* Navigation Loading Overlay */}
      <AnimatePresence>
        {navigatingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🔍
              </motion.div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-amber-400 font-mono text-lg tracking-wider"
              >
                Opening case file...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Section with Rank Badge */}
      <StaggerItem>
        <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Left - Rank Badge */}
            <div className="flex-shrink-0">
              <DetectiveRank
                score={stats.totalScore}
                casesSolved={stats.casesSolved}
                size="lg"
                showProgress={true}
              />
            </div>

            {/* Right - Welcome Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
                DETECTIVE DOSSIER
              </h1>
              <p className="text-slate-400 font-mono tracking-wide mb-4">
                &gt; Your investigative record and case statistics
              </p>

              {/* Daily Tip */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-900/30 border-l-4 border-amber-500 p-4 mt-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-amber-400 font-mono font-bold text-xs tracking-wider mb-1">
                      DETECTIVE TIP OF THE DAY
                    </h4>
                    <p className="text-amber-100 font-mono text-sm italic">
                      &quot;{dailyTip}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Stats Grid - Evidence Tags with Animated Counters */}
      <StaggerItem>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgb(217, 119, 6)' }}
            className="border-2 border-amber-600/30 bg-black/60 p-6 transition-colors"
          >
            <AnimatedCounter
              value={stats.casesSolved}
              className="text-4xl font-bold text-amber-500 mb-2 font-mono block"
              delay={0.2}
            />
            <div className="text-amber-400 font-mono text-sm tracking-wider">CASES CLOSED</div>
            <div className="mt-2">
              <ProgressBar value={stats.casesSolved} max={totalCases || 1} showPercentage={false} size="sm" color="amber" />
            </div>
            <div className="text-slate-500 text-xs font-mono mt-1">
              &gt; Out of {totalCases}
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgb(217, 119, 6)' }}
            className="border-2 border-amber-600/30 bg-black/60 p-6 transition-colors"
          >
            <AnimatedCounter
              value={stats.totalScore}
              className="text-4xl font-bold text-amber-500 mb-2 font-mono block"
              delay={0.4}
            />
            <div className="text-amber-400 font-mono text-sm tracking-wider">TOTAL SCORE</div>
            <div className="text-slate-500 text-xs font-mono mt-1">
              &gt; Points earned
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgb(217, 119, 6)' }}
            className="border-2 border-amber-600/30 bg-black/60 p-6 transition-colors"
          >
            <AnimatedCounter
              value={stats.totalClues}
              className="text-4xl font-bold text-amber-500 mb-2 font-mono block"
              delay={0.6}
            />
            <div className="text-amber-400 font-mono text-sm tracking-wider">CLUES FOUND</div>
            <div className="text-slate-500 text-xs font-mono mt-1">
              &gt; Evidence collected
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgb(217, 119, 6)' }}
            className="border-2 border-amber-600/30 bg-black/60 p-6 transition-colors"
          >
            <AnimatedCounter
              value={solveRate}
              suffix="%"
              className="text-4xl font-bold text-amber-500 mb-2 font-mono block"
              delay={0.8}
            />
            <div className="text-amber-400 font-mono text-sm tracking-wider">SOLVE RATE</div>
            <div className="mt-2">
              <ProgressBar value={solveRate} max={100} showPercentage={false} size="sm" color="green" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgb(217, 119, 6)' }}
            className="border-2 border-amber-600/30 bg-black/60 p-6 transition-colors col-span-2 md:col-span-1"
          >
            <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">
              {stats.rank > 0 ? (
                <AnimatedCounter value={stats.rank} prefix="#" delay={1.0} />
              ) : '-'}
            </div>
            <div className="text-amber-400 font-mono text-sm tracking-wider">RANK</div>
            <div className="text-slate-500 text-xs font-mono mt-1">
              &gt; Leaderboard position
            </div>
          </motion.div>
        </div>
      </StaggerItem>

      {/* Active Cases - Investigation Board */}
      {activeCases.length > 0 && (
        <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
            ACTIVE INVESTIGATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCases.map((activeCase) => (
              <Link
                key={activeCase.id}
                href={`/student/cases/${activeCase.caseId}/play`}
                className="border-2 border-amber-600/30 bg-black/60 p-4 hover:border-amber-600 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    {activeCase.case.coverImage ? (
                      <img
                        src={activeCase.case.coverImage}
                        alt={activeCase.case.title}
                        className="w-full h-full object-cover rounded border border-amber-600/50"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl bg-slate-800 rounded">
                        📁
                      </div>
                    )}
                  </div>
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
        </div>
      )}

      {/* Investigation History - Full Case Log */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          INVESTIGATION HISTORY
        </h2>

        {allProgress.length > 0 ? (
          <div className="space-y-4">
            {allProgress.map((item) => (
              <div
                key={item.id}
                className={`border-2 p-4 transition-all ${
                  item.status === 'SOLVED'
                    ? 'border-green-600/50 bg-green-900/20'
                    : 'border-amber-600/30 bg-amber-900/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Case Icon */}
                  <div className="w-16 h-16 flex-shrink-0">
                    {item.case.coverImage ? (
                      <img
                        src={item.case.coverImage}
                        alt={item.case.title}
                        className="w-full h-full object-cover rounded border-2 border-amber-600/50"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-800 rounded">
                        📁
                      </div>
                    )}
                  </div>

                  {/* Case Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-amber-50 font-mono">
                        {item.case.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 font-mono font-bold rounded ${
                        item.status === 'SOLVED'
                          ? 'bg-green-900 border border-green-600 text-green-300'
                          : 'bg-blue-900 border border-blue-600 text-blue-300'
                      }`}>
                        {item.status === 'SOLVED' ? 'CLOSED' : 'IN PROGRESS'}
                      </span>
                      <span className={`text-xs font-mono border px-2 py-0.5 ${getDifficultyColor(item.case.difficulty)}`}>
                        {item.case.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                      <span>Started: {formatDate(item.startedAt)}</span>
                      {item.completedAt && (
                        <span>Completed: {formatDate(item.completedAt)}</span>
                      )}
                      <span>Time: {formatTime(item.timeSpent || 0)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-amber-400 font-mono">
                      {item.score} pts
                    </div>
                    <div className="text-sm text-slate-400 font-mono">
                      {item.cluesCollected?.length || 0} clues · {item.puzzlesSolved?.length || 0} puzzles
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/student/cases/${item.caseId}/play`}
                    className={`px-4 py-2 font-mono font-bold text-sm transition-all rounded ${
                      item.status === 'SOLVED'
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        : 'bg-amber-600 hover:bg-amber-500 text-black'
                    }`}
                  >
                    {item.status === 'SOLVED' ? 'REVIEW' : 'CONTINUE'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-mono">NO INVESTIGATIONS LOGGED</p>
            <p className="text-sm mt-2 font-mono tracking-wide">
              &gt; Your case files will appear here once you begin investigating
            </p>
            <Link
              href="/student/cases"
              className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
            >
              OPEN CASE FILES →
            </Link>
          </div>
        )}
      </div>
    </StaggerContainer>
  );
}
