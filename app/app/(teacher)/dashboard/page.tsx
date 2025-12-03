import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome, Teacher! 👨‍🏫</h1>
        <p className="text-blue-200 text-lg">Manage your classes and track student progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-blue-100">My Classes</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-green-100">Total Students</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-yellow-100">Cases Assigned</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0%</div>
          <div className="text-purple-100">Avg Completion</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/teacher/classes/create"
          className="group bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">➕</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            Create New Class
          </h3>
          <p className="text-blue-200">
            Set up a new class and generate a join code for students
          </p>
        </Link>

        <Link
          href="/teacher/classes"
          className="group bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/50 rounded-xl p-8 transition-all"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            Manage Classes
          </h3>
          <p className="text-blue-200">
            View your classes, assign cases, and track student progress
          </p>
        </Link>
      </div>

      {/* My Classes */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">My Classes</h2>
        <div className="text-center py-12 text-blue-200">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg">No classes yet.</p>
          <p className="text-sm mt-2">Create your first class to get started!</p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Create Class
          </Link>
        </div>
      </div>
    </div>
  );
}
