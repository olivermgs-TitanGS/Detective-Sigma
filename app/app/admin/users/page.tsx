export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">User Management 👥</h1>
        <p className="text-red-200 text-lg">Manage students, teachers, and admin accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-blue-100">Students</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">0</div>
          <div className="text-green-100">Teachers</div>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">1</div>
          <div className="text-red-100">Admins</div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
        <div className="text-center py-12 text-red-200">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg">No users yet.</p>
          <p className="text-sm mt-2">Users will appear here once they register.</p>
        </div>
      </div>
    </div>
  );
}
