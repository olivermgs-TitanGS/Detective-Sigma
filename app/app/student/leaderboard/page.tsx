'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  gradeLevel: string;
  totalScore: number;
  casesSolved: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        console.log('[Leaderboard Page] Fetching...');
        const res = await fetch('/api/leaderboard?limit=50');
        console.log('[Leaderboard Page] Response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          console.log('[Leaderboard Page] Data received:', data);
          setLeaderboard(data.leaderboard || []);
        } else {
          console.error('[Leaderboard Page] API error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('[Leaderboard Page] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 0, 2].map((podiumIndex) => {
          const entry = top3[podiumIndex];
          const position = podiumIndex + 1;
          const displayPosition = podiumIndex === 0 ? 2 : podiumIndex === 1 ? 1 : 3;

          return (
            <div
              key={position}
              className={`border-2 bg-black/60 backdrop-blur-sm p-8 text-center transition-all hover:scale-105 ${
                displayPosition === 1
                  ? 'border-amber-500 md:order-1 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                  : displayPosition === 2
                  ? 'border-slate-400 md:order-0'
                  : 'border-orange-700 md:order-2'
              }`}
            >
              <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {displayPosition === 1 ? '🥇' : displayPosition === 2 ? '🥈' : '🥉'}
              </div>
              <div className="text-3xl font-bold text-amber-500 mb-2 font-mono">#{displayPosition}</div>
              {entry ? (
                <>
                  <div className="text-amber-50 mb-2 font-mono tracking-wider text-lg">
                    {entry.username}
                  </div>
                  <div className="text-slate-400 text-sm font-mono mb-1">
                    Grade {entry.gradeLevel}
                  </div>
                  <div className="text-amber-400 font-bold font-mono text-xl">
                    {entry.totalScore} PTS
                  </div>
                  <div className="text-slate-500 text-xs font-mono mt-1">
                    {entry.casesSolved} case{entry.casesSolved !== 1 ? 's' : ''} solved
                  </div>
                </>
              ) : (
                <>
                  <div className="text-slate-500 mb-2 font-mono tracking-wider">UNCLAIMED</div>
                  <div className="text-slate-600 text-sm font-mono">0 POINTS</div>
                </>
              )}
            </div>
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
