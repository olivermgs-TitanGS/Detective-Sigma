import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="border-2 border-red-800/50 bg-black/80 backdrop-blur-sm p-8">
        <h1 className="text-4xl font-bold text-red-400 font-mono tracking-[0.2em] mb-2">ADMIN CONSOLE 🔐</h1>
        <p className="text-slate-400 text-lg font-mono tracking-wider">&gt; Manage cases, users, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">3</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL CASES</div>
          <div className="text-slate-500 text-xs mt-1 font-mono">2 published, 1 draft</div>
        </div>
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL STUDENTS</div>
          <div className="text-slate-500 text-xs mt-1 font-mono">Active users</div>
        </div>
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL TEACHERS</div>
          <div className="text-slate-500 text-xs mt-1 font-mono">Registered educators</div>
        </div>
        <div className="border-2 border-red-800/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-red-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CASES COMPLETED</div>
          <div className="text-slate-500 text-xs mt-1 font-mono">All students</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/cases/create"
          className="group border-2 border-red-800/30 hover:border-red-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">➕</div>
          <h3 className="text-2xl font-bold text-red-400 font-mono tracking-wider mb-2 group-hover:text-red-300 transition-colors">
            CREATE NEW CASE
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; Build a new detective case with scenes, clues, puzzles, and suspects
          </p>
        </Link>

        <Link
          href="/admin/cases"
          className="group border-2 border-red-800/30 hover:border-red-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">📚</div>
          <h3 className="text-2xl font-bold text-red-400 font-mono tracking-wider mb-2 group-hover:text-red-300 transition-colors">
            MANAGE CASES
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; Edit existing cases, manage content, and publish/unpublish cases
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="group border-2 border-red-800/30 hover:border-red-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">👥</div>
          <h3 className="text-2xl font-bold text-red-400 font-mono tracking-wider mb-2 group-hover:text-red-300 transition-colors">
            MANAGE USERS
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; View and manage student, teacher, and admin accounts
          </p>
        </Link>

        <Link
          href="/admin/bulk-import"
          className="group border-2 border-red-800/30 hover:border-red-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">📤</div>
          <h3 className="text-2xl font-bold text-red-400 font-mono tracking-wider mb-2 group-hover:text-red-300 transition-colors">
            BULK IMPORT
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; Import cases, users, or content from CSV files
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="border-2 border-red-800/50 bg-black/80 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-bold text-red-400 font-mono tracking-widest mb-6 flex items-center gap-2">
          📊 RECENT ACTIVITY
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">📊</div>
          <p className="text-red-400 text-lg font-mono tracking-wider">NO RECENT ACTIVITY</p>
          <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">&gt; System activity will appear here</p>
        </div>
      </div>
    </div>
  );
}
