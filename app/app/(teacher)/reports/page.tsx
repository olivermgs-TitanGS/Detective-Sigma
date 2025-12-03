export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Reports 📊</h1>
        <p className="text-blue-200 text-lg">View student progress and class performance</p>
      </div>

      {/* Reports Placeholder */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
        <div className="text-center py-12 text-blue-200">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No reports available yet.</p>
          <p className="text-sm mt-2">Reports will appear once students start solving cases!</p>
        </div>
      </div>
    </div>
  );
}
