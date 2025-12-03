export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">REPORTS 📊</h1>
        <p className="text-slate-400 text-lg font-mono tracking-wider">&gt; View student progress and class performance</p>
      </div>

      {/* Reports Placeholder */}
      <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">📊</div>
          <p className="text-amber-400 text-lg font-mono tracking-wider">NO REPORTS AVAILABLE YET</p>
          <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">&gt; Reports will appear once students start solving cases!</p>
        </div>
      </div>
    </div>
  );
}
