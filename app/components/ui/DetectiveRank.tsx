'use client';

import { motion } from 'framer-motion';

interface DetectiveRankProps {
  score: number;
  casesSolved: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Rank definitions based on score and cases
const RANKS = [
  { name: 'ROOKIE', minScore: 0, minCases: 0, icon: '🔰', color: 'from-green-600 to-green-800', border: 'border-green-500' },
  { name: 'CADET', minScore: 100, minCases: 1, icon: '⭐', color: 'from-blue-600 to-blue-800', border: 'border-blue-500' },
  { name: 'CONSTABLE', minScore: 300, minCases: 3, icon: '🌟', color: 'from-purple-600 to-purple-800', border: 'border-purple-500' },
  { name: 'SERGEANT', minScore: 600, minCases: 5, icon: '🎖️', color: 'from-amber-600 to-amber-800', border: 'border-amber-500' },
  { name: 'INSPECTOR', minScore: 1000, minCases: 8, icon: '🏅', color: 'from-orange-500 to-orange-700', border: 'border-orange-500' },
  { name: 'DETECTIVE', minScore: 1500, minCases: 12, icon: '🔍', color: 'from-red-500 to-red-700', border: 'border-red-500' },
  { name: 'CHIEF', minScore: 2500, minCases: 18, icon: '👑', color: 'from-yellow-400 to-yellow-600', border: 'border-yellow-400' },
  { name: 'LEGEND', minScore: 5000, minCases: 25, icon: '🌟', color: 'from-pink-400 via-purple-500 to-indigo-500', border: 'border-pink-400' },
];

function getCurrentRank(score: number, casesSolved: number) {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore && casesSolved >= RANKS[i].minCases) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }

  return { currentRank, nextRank };
}

function getProgressToNextRank(score: number, casesSolved: number, nextRank: typeof RANKS[0] | null) {
  if (!nextRank) return { scoreProgress: 100, casesProgress: 100 };

  const prevRank = RANKS[RANKS.indexOf(nextRank) - 1];
  const scoreRange = nextRank.minScore - prevRank.minScore;
  const casesRange = nextRank.minCases - prevRank.minCases;

  const scoreProgress = Math.min(100, ((score - prevRank.minScore) / scoreRange) * 100);
  const casesProgress = Math.min(100, ((casesSolved - prevRank.minCases) / casesRange) * 100);

  return { scoreProgress, casesProgress };
}

export default function DetectiveRank({ score, casesSolved, showProgress = true, size = 'md' }: DetectiveRankProps) {
  const { currentRank, nextRank } = getCurrentRank(score, casesSolved);
  const { scoreProgress, casesProgress } = getProgressToNextRank(score, casesSolved, nextRank);
  const overallProgress = Math.min(scoreProgress, casesProgress);

  const sizeClasses = {
    sm: { badge: 'w-12 h-12', icon: 'text-2xl', text: 'text-xs' },
    md: { badge: 'w-20 h-20', icon: 'text-4xl', text: 'text-sm' },
    lg: { badge: 'w-28 h-28', icon: 'text-6xl', text: 'text-base' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className="text-center">
      {/* Rank Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        className="relative inline-block"
      >
        {/* Outer glow */}
        <div
          className={`absolute inset-0 ${sizes.badge} rounded-full blur-md opacity-50 bg-gradient-to-br ${currentRank.color}`}
        />

        {/* Badge container */}
        <div
          className={`relative ${sizes.badge} rounded-full bg-gradient-to-br ${currentRank.color} border-4 ${currentRank.border} flex items-center justify-center shadow-xl`}
        >
          {/* Rotating border animation for LEGEND rank */}
          {currentRank.name === 'LEGEND' && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Icon */}
          <motion.span
            className={sizes.icon}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentRank.icon}
          </motion.span>
        </div>

        {/* Rank number badge */}
        <div className="absolute -bottom-1 -right-1 bg-black border-2 border-amber-500 rounded-full w-7 h-7 flex items-center justify-center">
          <span className="text-amber-400 text-xs font-bold font-mono">
            {RANKS.indexOf(currentRank) + 1}
          </span>
        </div>
      </motion.div>

      {/* Rank Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3"
      >
        <h3 className={`font-mono font-bold tracking-widest text-amber-400 ${sizes.text}`}>
          {currentRank.name}
        </h3>
      </motion.div>

      {/* Progress to next rank */}
      {showProgress && nextRank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 max-w-xs mx-auto"
        >
          <div className="text-xs text-slate-400 font-mono mb-2 flex justify-between">
            <span>Next: {nextRank.name}</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${nextRank.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Requirements */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-500 font-mono">
              <span className="text-amber-400">{score}</span>/{nextRank.minScore} pts
            </div>
            <div className="text-slate-500 font-mono">
              <span className="text-amber-400">{casesSolved}</span>/{nextRank.minCases} cases
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Compact rank display for nav/headers
export function RankBadge({ score, casesSolved }: { score: number; casesSolved: number }) {
  const { currentRank } = getCurrentRank(score, casesSolved);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${currentRank.color} border ${currentRank.border}`}>
      <span className="text-lg">{currentRank.icon}</span>
      <span className="text-xs font-mono font-bold text-white tracking-wider">{currentRank.name}</span>
    </div>
  );
}
