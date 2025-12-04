export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-green-600 text-xs mb-1">$ ./generate_reports.sh --all</div>
        <h1 className="text-2xl font-bold text-green-400 tracking-wider mb-1">
          [ANALYTICS_MODULE] <span className="animate-pulse">█</span>
        </h1>
        <p className="text-green-700 text-sm">&gt; View student progress metrics and class performance data</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ metrics --solved</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0</div>
          <div className="text-green-700 text-xs mt-1">CASES_SOLVED</div>
        </div>
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ metrics --average</div>
          <div className="text-3xl font-bold text-green-400 font-mono">--</div>
          <div className="text-green-700 text-xs mt-1">AVG_SCORE</div>
        </div>
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ metrics --active</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0</div>
          <div className="text-green-700 text-xs mt-1">ACTIVE_USERS</div>
        </div>
      </div>

      {/* Reports Placeholder */}
      <div className="border border-green-500/30 bg-black/60 p-6">
        <div className="flex items-center gap-2 text-green-500 text-xs mb-4">
          <span>$</span>
          <span>cat ./reports/latest.log</span>
        </div>

        <div className="text-center py-12 border border-dashed border-green-500/20">
          <div className="text-5xl mb-4 opacity-60">📊</div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 inline-block px-4 py-2 mb-3">
            <p className="text-yellow-400 font-mono text-sm">WARNING: No data available</p>
          </div>
          <p className="text-green-700 text-sm mt-2">
            &gt; Report generation requires student activity data
          </p>
          <p className="text-green-800 text-xs mt-1">
            &gt; Data will populate when students begin solving cases
          </p>
        </div>
      </div>

      {/* Available Reports */}
      <div className="border border-green-500/30 bg-black/60 p-6">
        <div className="text-green-500 text-xs mb-4">$ ls ./reports/templates/</div>
        <h2 className="text-lg font-bold text-green-400 tracking-wider mb-4">[AVAILABLE_REPORTS]</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-500/20 bg-black/40 p-4 opacity-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">📄</span>
              <span className="text-green-400 text-sm">class_progress.csv</span>
            </div>
            <p className="text-green-700 text-xs">&gt; Per-class completion rates and scores</p>
          </div>
          <div className="border border-green-500/20 bg-black/40 p-4 opacity-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">📄</span>
              <span className="text-green-400 text-sm">student_analytics.csv</span>
            </div>
            <p className="text-green-700 text-xs">&gt; Individual student performance metrics</p>
          </div>
          <div className="border border-green-500/20 bg-black/40 p-4 opacity-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">📄</span>
              <span className="text-green-400 text-sm">case_difficulty.csv</span>
            </div>
            <p className="text-green-700 text-xs">&gt; Case completion statistics by difficulty</p>
          </div>
          <div className="border border-green-500/20 bg-black/40 p-4 opacity-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">📄</span>
              <span className="text-green-400 text-sm">skill_breakdown.csv</span>
            </div>
            <p className="text-green-700 text-xs">&gt; Math topic proficiency analysis</p>
          </div>
        </div>

        <p className="text-green-800 text-xs mt-4 text-center">
          &gt; Reports will be downloadable once sufficient data is collected
        </p>
      </div>

      {/* Terminal Log */}
      <div className="border border-green-500/20 bg-black/40 p-4 text-xs">
        <div className="text-green-700 mb-2">[SYSTEM_LOG]</div>
        <div className="space-y-1 text-green-600">
          <p>&gt; Analytics module initialized</p>
          <p>&gt; Waiting for student activity data...</p>
          <p className="animate-pulse">&gt; _</p>
        </div>
      </div>
    </div>
  );
}
