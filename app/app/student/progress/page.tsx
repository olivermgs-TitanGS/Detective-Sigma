export default function ProgressPage() {
  return (
    <div className="space-y-8">
      {/* Header - Investigation Report */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          DETECTIVE DOSSIER 📊
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Your investigative record and case closure statistics
        </p>
      </div>

      {/* Overall Stats - Evidence Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0</div>
          <div className="text-amber-400 mb-1 font-mono tracking-wider">CASES CLOSED</div>
          <div className="text-slate-500 text-sm font-mono tracking-wide">&gt; Out of 3 available</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0</div>
          <div className="text-amber-400 mb-1 font-mono tracking-wider">EVIDENCE POINTS</div>
          <div className="text-slate-500 text-sm font-mono tracking-wide">&gt; Keep investigating!</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
          <div className="text-4xl font-bold text-amber-500 mb-2 font-mono">0%</div>
          <div className="text-amber-400 mb-1 font-mono tracking-wider">SOLVE RATE</div>
          <div className="text-slate-500 text-sm font-mono tracking-wide">&gt; Complete cases to track</div>
        </div>
      </div>

      {/* Case Progress - Investigation Log */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6">
          INVESTIGATION HISTORY
        </h2>
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-mono">NO INVESTIGATIONS LOGGED</p>
          <p className="text-sm mt-2 font-mono tracking-wide">
            &gt; Your case files will appear here once you begin investigating
          </p>
          <a
            href="/student/cases"
            className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
          >
            OPEN CASE FILES →
          </a>
        </div>
      </div>
    </div>
  );
}
