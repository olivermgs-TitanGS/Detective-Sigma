import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Console 🔐</h1>
        <p className="text-red-200 text-lg">Manage cases, users, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">3</div>
          <div className="text-blue-100">Total Cases</div>
          <div className="text-blue-200 text-xs mt-1">2 published, 1 draft</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-green-100">Total Students</div>
          <div className="text-green-200 text-xs mt-1">Active users</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-yellow-100">Total Teachers</div>
          <div className="text-yellow-200 text-xs mt-1">Registered educators</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-purple-100">Cases Completed</div>
          <div className="text-purple-200 text-xs mt-1">All students</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/cases/create"
          className="group bg-slate-800/50 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">➕</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
            Create New Case
          </h3>
          <p className="text-red-200">
            Build a new detective case with scenes, clues, puzzles, and suspects
          </p>
        </Link>

        <Link
          href="/admin/cases"
          className="group bg-slate-800/50 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
            Manage Cases
          </h3>
          <p className="text-red-200">
            Edit existing cases, manage content, and publish/unpublish cases
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="group bg-slate-800/50 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
            Manage Users
          </h3>
          <p className="text-red-200">
            View and manage student, teacher, and admin accounts
          </p>
        </Link>

        <Link
          href="/admin/bulk-import"
          className="group bg-slate-800/50 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
            Bulk Import
          </h3>
          <p className="text-red-200">
            Import cases, users, or content from CSV files
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="text-center py-12 text-red-200">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No recent activity.</p>
          <p className="text-sm mt-2">System activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}
