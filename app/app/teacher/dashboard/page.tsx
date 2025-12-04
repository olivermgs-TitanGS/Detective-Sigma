import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border border-green-500/30 bg-green-900/10 p-6">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <span className="text-green-500">$</span>
          <span>whoami</span>
        </div>
        <h1 className="text-2xl font-bold text-green-300 tracking-wider mb-1">
          INSTRUCTOR_TERMINAL <span className="animate-pulse">█</span>
        </h1>
        <p className="text-green-600 text-sm">
          &gt; Session active. Manage classes and track student progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ count --classes</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0</div>
          <div className="text-green-700 text-xs mt-1">ACTIVE_CLASSES</div>
        </div>
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ count --students</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0</div>
          <div className="text-green-700 text-xs mt-1">TOTAL_STUDENTS</div>
        </div>
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ count --cases</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0</div>
          <div className="text-green-700 text-xs mt-1">CASES_ASSIGNED</div>
        </div>
        <div className="border border-green-500/30 bg-black/60 p-4">
          <div className="text-xs text-green-600 mb-1">$ stats --completion</div>
          <div className="text-3xl font-bold text-green-400 font-mono">0%</div>
          <div className="text-green-700 text-xs mt-1">AVG_COMPLETION</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/teacher/classes/create"
          className="group border border-green-500/30 hover:border-green-500 hover:bg-green-500/5 bg-black/60 p-6 transition-all"
        >
          <div className="text-green-600 text-xs mb-2">$ ./create_class.sh</div>
          <div className="text-4xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">📁</div>
          <h3 className="text-lg font-bold text-green-400 tracking-wider mb-1 group-hover:text-green-300 transition-colors">
            [NEW_CLASS]
          </h3>
          <p className="text-green-700 text-sm">
            &gt; Initialize new class instance and generate join_code
          </p>
        </Link>

        <Link
          href="/teacher/classes"
          className="group border border-green-500/30 hover:border-green-500 hover:bg-green-500/5 bg-black/60 p-6 transition-all"
        >
          <div className="text-green-600 text-xs mb-2">$ ls -la ./classes/</div>
          <div className="text-4xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">📂</div>
          <h3 className="text-lg font-bold text-green-400 tracking-wider mb-1 group-hover:text-green-300 transition-colors">
            [MANAGE_CLASSES]
          </h3>
          <p className="text-green-700 text-sm">
            &gt; View classes, assign cases, monitor student_progress
          </p>
        </Link>
      </div>

      {/* My Classes */}
      <div className="border border-green-500/30 bg-black/60 p-6">
        <div className="flex items-center gap-2 text-green-500 text-xs mb-4">
          <span>$</span>
          <span>cat ./classes/active.log</span>
        </div>
        <h2 className="text-xl font-bold text-green-400 tracking-wider mb-4 flex items-center gap-2">
          [ACTIVE_CLASSES]
        </h2>
        <div className="text-center py-8 border border-dashed border-green-500/20">
          <div className="text-4xl mb-3 opacity-60">📁</div>
          <p className="text-green-500 font-mono">ERROR: No classes found</p>
          <p className="text-green-700 text-xs mt-2">
            &gt; Run ./create_class.sh to initialize first class
          </p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-4 border border-green-500/50 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-6 py-2 transition-all text-sm"
          >
            [EXECUTE]
          </Link>
        </div>
      </div>

      {/* System Log */}
      <div className="border border-green-500/20 bg-black/40 p-4 text-xs">
        <div className="text-green-700 mb-2">[SYSTEM_LOG]</div>
        <div className="space-y-1 text-green-600">
          <p>&gt; Session initialized successfully</p>
          <p>&gt; Database connection: ACTIVE</p>
          <p>&gt; Awaiting instructor commands...</p>
          <p className="animate-pulse">&gt; _</p>
        </div>
      </div>
    </div>
  );
}
