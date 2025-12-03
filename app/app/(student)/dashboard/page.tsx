export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section - Crime Scene Style */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          WELCOME BACK, DETECTIVE 🔍
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Ready to solve mysteries and close cases?
        </p>
      </div>

      {/* Stats Grid - Evidence Tags */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CASES SOLVED</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL SCORE</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CLUES COLLECTED</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">-</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CURRENT RANK</div>
        </div>
      </div>

      {/* Active Cases - Investigation Board */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          ACTIVE INVESTIGATIONS
        </h2>
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-mono">NO ACTIVE CASES</p>
          <p className="text-sm mt-2 font-mono tracking-wide">
            &gt; Visit the Case Library to start your first investigation
          </p>
          <a
            href="/student/cases"
            className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
          >
            BROWSE CASES →
          </a>
        </div>
      </div>

      {/* Recent Activity - Case Log */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          CASE LOG • RECENT ACTIVITY
        </h2>
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-mono">NO ACTIVITY LOGGED</p>
          <p className="text-sm mt-2 font-mono tracking-wide">
            &gt; Start solving cases to track your progress here
          </p>
        </div>
      </div>
    </div>
  );
}
