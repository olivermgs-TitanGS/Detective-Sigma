export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard 🏆</h1>
        <p className="text-purple-200 text-lg">See how you rank against other detectives</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[2, 1, 3].map((position, index) => (
          <div
            key={position}
            className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-8 text-center ${
              position === 1
                ? 'border-yellow-500/50 md:order-1'
                : position === 2
                ? 'border-gray-400/50 md:order-0'
                : 'border-orange-500/50 md:order-2'
            }`}
          >
            <div className="text-6xl mb-4">
              {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
            </div>
            <div className="text-3xl font-bold text-white mb-2">#{position}</div>
            <div className="text-purple-300 mb-2">No data yet</div>
            <div className="text-purple-400 text-sm">0 points</div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Top Detectives</h2>

        <div className="text-center py-12 text-purple-200">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg">Leaderboard is empty.</p>
          <p className="text-sm mt-2">Be the first to solve a case and claim the top spot!</p>
        </div>

        {/* Table Header (for when there's data) */}
        {/* <table className="w-full">
          <thead className="border-b border-purple-500/20">
            <tr className="text-left text-purple-200 text-sm">
              <th className="pb-4 pl-4">Rank</th>
              <th className="pb-4">Detective</th>
              <th className="pb-4">Cases Solved</th>
              <th className="pb-4">Total Points</th>
              <th className="pb-4">Average Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-purple-500/10 hover:bg-slate-700/30 transition-colors">
              <td className="py-4 pl-4">
                <span className="text-2xl">🥇</span>
                <span className="text-white font-bold ml-2">1</span>
              </td>
              <td className="py-4 text-white font-semibold">Student Name</td>
              <td className="py-4 text-purple-200">5</td>
              <td className="py-4 text-green-400 font-bold">450</td>
              <td className="py-4 text-purple-200">90%</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
}
