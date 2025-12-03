export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-red-400 font-mono tracking-[0.2em] mb-2">USER MANAGEMENT 👥</h1>
        <p className="text-slate-400 text-lg font-mono tracking-wider">&gt; Manage students, teachers, and admin accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">STUDENTS</div>
        </div>
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TEACHERS</div>
        </div>
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">1</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">ADMINS</div>
        </div>
      </div>

      {/* User List */}
      <div className="border-2 border-red-800/50 bg-black/80 backdrop-blur-sm p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">👥</div>
          <p className="text-red-400 text-lg font-mono tracking-wider">NO USERS YET</p>
          <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">&gt; Users will appear here once they register</p>
        </div>
      </div>
    </div>
  );
}
