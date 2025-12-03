export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Detective! 🔍</h1>
        <p className="text-purple-200 text-lg">Ready to solve some mysteries and master your skills?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-blue-100">Cases Solved</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-green-100">Total Score</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-yellow-100">Clues Collected</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">-</div>
          <div className="text-purple-100">Current Rank</div>
        </div>
      </div>

      {/* Active Cases */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Continue Your Investigation</h2>
        <div className="text-center py-12 text-purple-200">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg">No active cases yet.</p>
          <p className="text-sm mt-2">Visit the Case Library to start your first investigation!</p>
          <a
            href="/student/cases"
            className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Browse Cases
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="text-center py-12 text-purple-200">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No activity yet.</p>
          <p className="text-sm mt-2">Start solving cases to track your progress here!</p>
        </div>
      </div>
    </div>
  );
}
