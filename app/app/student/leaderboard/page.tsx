'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface LeaderboardEntry {
  rank: number;
  username: string;
  gradeLevel: string;
  totalScore: number;
  casesSolved: number;
}

// Rank titles based on position
const getRankTitle = (rank: number) => {
  switch (rank) {
    case 1: return 'CHIEF DETECTIVE';
    case 2: return 'SENIOR INSPECTOR';
    case 3: return 'MASTER INVESTIGATOR';
    default: return rank <= 10 ? 'ELITE DETECTIVE' : 'DETECTIVE';
  }
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedRanks, setRevealedRanks] = useState<number[]>([]);
  const soundPlayedRef = useRef(false);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard?limit=50');

        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (err) {
        console.error('[Leaderboard Page] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  // Play rank sounds when podium entries are revealed
  useEffect(() => {
    if (loading || leaderboard.length === 0 || soundPlayedRef.current) return;
    soundPlayedRef.current = true;

    // Staggered reveal with sounds for top 3
    const timers = [
      setTimeout(() => {
        setRevealedRanks(prev => [...prev, 3]);
        if (leaderboard[2]) playSound('bronzeRank');
      }, 500),
      setTimeout(() => {
        setRevealedRanks(prev => [...prev, 2]);
        if (leaderboard[1]) playSound('silverRank');
      }, 1200),
      setTimeout(() => {
        setRevealedRanks(prev => [...prev, 1]);
        if (leaderboard[0]) playSound('goldRank');
      }, 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [loading, leaderboard, playSound]);

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏆</div>
          <p className="text-amber-500 font-mono">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header - Rankings Board */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          DETECTIVE RANKINGS
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Compare your investigative prowess with fellow detectives
        </p>
      </div>

      {/* Top 3 Podium - Award Ceremony */}
      {/* Visual order: [2nd, 1st, 3rd] so 1st place is in the middle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 0, 2].map((rank) => {
          const entry = top3[rank];
          const displayPosition = rank + 1;
          const isRevealed = revealedRanks.includes(displayPosition);

          const podiumColors = {
            1: { border: 'border-amber-500', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.4)]', bg: 'bg-gradient-to-b from-amber-900/40 to-black/60' },
            2: { border: 'border-slate-400', glow: 'shadow-[0_0_30px_rgba(148,163,184,0.3)]', bg: 'bg-gradient-to-b from-slate-800/40 to-black/60' },
            3: { border: 'border-orange-700', glow: 'shadow-[0_0_25px_rgba(194,65,12,0.3)]', bg: 'bg-gradient-to-b from-orange-900/40 to-black/60' },
          };
          const colors = podiumColors[displayPosition as 1 | 2 | 3];

          return (
            <AnimatePresence key={rank}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.3, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className={`border-2 backdrop-blur-sm p-8 text-center transition-all ${colors.border} ${colors.bg} ${
                  displayPosition === 1 ? 'md:order-1' : displayPosition === 2 ? 'md:order-0' : 'md:order-2'
                } ${isRevealed ? colors.glow : ''}`}
              >
                {/* Medal with animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isRevealed ? { scale: 1, rotate: 0 } : {}}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="text-7xl mb-4"
                >
                  {displayPosition === 1 ? '🥇' : displayPosition === 2 ? '🥈' : '🥉'}
                </motion.div>

                {/* Sparkle effects for 1st place */}
                {displayPosition === 1 && isRevealed && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Rank number */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-amber-500 mb-2 font-mono"
                >
                  #{displayPosition}
                </motion.div>

                {entry ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Rank title */}
                    <div className="text-xs text-amber-600 font-mono tracking-widest mb-2">
                      {getRankTitle(displayPosition)}
                    </div>
                    <div className="text-amber-50 mb-2 font-mono tracking-wider text-xl font-bold">
                      {entry.username}
                    </div>
                    <div className="text-slate-400 text-sm font-mono mb-2">
                      Grade {entry.gradeLevel}
                    </div>
                    <div className="text-amber-400 font-bold font-mono text-2xl">
                      <AnimatedCounter value={entry.totalScore} suffix=" PTS" delay={isRevealed ? 0.5 : 10} />
                    </div>
                    <div className="text-slate-500 text-xs font-mono mt-2">
                      {entry.casesSolved} case{entry.casesSolved !== 1 ? 's' : ''} solved
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isRevealed ? { opacity: 1 } : {}}
                  >
                    <div className="text-slate-500 mb-2 font-mono tracking-wider">UNCLAIMED</div>
                    <div className="text-slate-600 text-sm font-mono">0 POINTS</div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          TOP DETECTIVE BUREAU
        </h2>

        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-amber-600/30">
                <tr className="text-left text-amber-400 text-sm font-mono tracking-wider">
                  <th className="pb-4 pl-4">RANK</th>
                  <th className="pb-4">DETECTIVE</th>
                  <th className="pb-4">GRADE</th>
                  <th className="pb-4">CASES CLOSED</th>
                  <th className="pb-4 pr-4 text-right">TOTAL POINTS</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-amber-600/10 hover:bg-amber-600/5 transition-colors ${
                      entry.rank <= 3 ? 'bg-amber-900/10' : ''
                    }`}
                  >
                    <td className="py-4 pl-4">
                      {getMedal(entry.rank) && (
                        <span className="text-2xl mr-2">{getMedal(entry.rank)}</span>
                      )}
                      <span className={`font-mono font-bold ${
                        entry.rank === 1 ? 'text-amber-400' :
                        entry.rank === 2 ? 'text-slate-300' :
                        entry.rank === 3 ? 'text-orange-400' :
                        'text-slate-500'
                      }`}>
                        {entry.rank}
                      </span>
                    </td>
                    <td className="py-4 text-amber-50 font-semibold font-mono">
                      {entry.username}
                    </td>
                    <td className="py-4 text-slate-400 font-mono">
                      {entry.gradeLevel}
                    </td>
                    <td className="py-4 text-slate-400 font-mono">
                      {entry.casesSolved}
                    </td>
                    <td className="py-4 pr-4 text-right text-amber-400 font-bold font-mono">
                      {entry.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-lg font-mono">LEADERBOARD EMPTY</p>
            <p className="text-sm mt-2 font-mono tracking-wide">
              &gt; Be the first to crack a case and claim the #1 ranking!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
