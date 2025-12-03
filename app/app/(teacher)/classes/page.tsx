import Link from 'next/link';

export default function ClassesListPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Classes 👥</h1>
          <p className="text-blue-200 text-lg">Manage your classes and students</p>
        </div>
        <Link
          href="/teacher/classes/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Create New Class</span>
        </Link>
      </div>

      {/* Classes List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
        <div className="text-center py-12 text-blue-200">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg">No classes yet.</p>
          <p className="text-sm mt-2">Create your first class to start managing students!</p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Create First Class
          </Link>
        </div>
      </div>
    </div>
  );
}
