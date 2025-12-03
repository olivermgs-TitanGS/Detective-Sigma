export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      {/* Header - Rankings Board */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          DETECTIVE RANKINGS 🏆
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Compare your investigative prowess with fellow detectives
        </p>
      </div>

      {/* Top 3 Podium - Award Ceremony */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[2, 1, 3].map((position, index) => (
          <div
            key={position}
            className={`border-2 bg-black/60 backdrop-blur-sm p-8 text-center transition-colors hover:scale-105 ${
              position === 1
                ? 'border-amber-600 md:order-1'
                : position === 2
                ? 'border-slate-500 md:order-0'
                : 'border-orange-600 md:order-2'
            }`}
          >
            <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
            </div>
            <div className="text-3xl font-bold text-amber-500 mb-2 font-mono">#{position}</div>
            <div className="text-slate-400 mb-2 font-mono tracking-wider">NO DATA</div>
            <div className="text-slate-500 text-sm font-mono">0 POINTS</div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          TOP DETECTIVE BUREAU
        </h2>

        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg font-mono">LEADERBOARD EMPTY</p>
          <p className="text-sm mt-2 font-mono tracking-wide">
            &gt; Be the first to crack a case and claim the #1 ranking!
          </p>
        </div>

        {/* Table Header (for when there's data) */}
        {/* <table className="w-full">
          <thead className="border-b-2 border-amber-600/30">
            <tr className="text-left text-amber-400 text-sm font-mono tracking-wider">
              <th className="pb-4 pl-4">RANK</th>
              <th className="pb-4">DETECTIVE</th>
              <th className="pb-4">CASES CLOSED</th>
              <th className="pb-4">TOTAL POINTS</th>
              <th className="pb-4">SOLVE RATE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-amber-600/10 hover:bg-amber-600/5 transition-colors">
              <td className="py-4 pl-4">
                <span className="text-2xl">🥇</span>
                <span className="text-amber-500 font-bold ml-2 font-mono">1</span>
              </td>
              <td className="py-4 text-amber-50 font-semibold font-mono">DETECTIVE NAME</td>
              <td className="py-4 text-slate-400 font-mono">5</td>
              <td className="py-4 text-amber-400 font-bold font-mono">450</td>
              <td className="py-4 text-slate-400 font-mono">90%</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
}
