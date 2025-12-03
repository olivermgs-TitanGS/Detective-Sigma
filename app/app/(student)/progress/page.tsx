export default function ProgressPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Progress 📊</h1>
        <p className="text-purple-200 text-lg">Track your detective journey and achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">0</div>
          <div className="text-blue-100 mb-1">Cases Solved</div>
          <div className="text-blue-200 text-sm">Out of 3 available</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">0</div>
          <div className="text-green-100 mb-1">Total Points</div>
          <div className="text-green-200 text-sm">Keep solving cases!</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">0%</div>
          <div className="text-purple-100 mb-1">Average Score</div>
          <div className="text-purple-200 text-sm">Complete quizzes to see</div>
        </div>
      </div>

      {/* Case Progress */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Case History</h2>
        <div className="text-center py-12 text-purple-200">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg">No cases started yet.</p>
          <p className="text-sm mt-2">Your progress will appear here once you start investigating!</p>
          <a
            href="/student/cases"
            className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Start Your First Case
          </a>
        </div>
      </div>
    </div>
  );
}
