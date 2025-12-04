import Link from 'next/link';

export default function ClassesListPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-green-600 text-xs mb-1">$ ls -la ./classes/</div>
          <h1 className="text-2xl font-bold text-green-400 tracking-wider mb-1">
            [CLASS_DIRECTORY] <span className="animate-pulse">█</span>
          </h1>
          <p className="text-green-700 text-sm">&gt; Manage class instances and student connections</p>
        </div>
        <Link
          href="/teacher/classes/create"
          className="border border-green-500/50 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 transition-all text-sm flex items-center gap-2"
        >
          <span className="text-green-500">+</span>
          <span>[NEW_CLASS]</span>
        </Link>
      </div>

      {/* Classes List */}
      <div className="border border-green-500/30 bg-black/60 p-6">
        <div className="flex items-center gap-2 text-green-500 text-xs mb-4">
          <span>$</span>
          <span>find ./classes -type d -maxdepth 1</span>
        </div>

        <div className="text-center py-12 border border-dashed border-green-500/20">
          <div className="text-5xl mb-4 opacity-60">📂</div>
          <div className="bg-red-900/20 border border-red-500/30 inline-block px-4 py-2 mb-3">
            <p className="text-red-400 font-mono text-sm">ERROR 404: Directory empty</p>
          </div>
          <p className="text-green-700 text-sm mt-2">
            &gt; No class instances found in current directory
          </p>
          <p className="text-green-800 text-xs mt-1">
            &gt; Initialize new class to begin student tracking
          </p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-6 border border-green-500/50 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-6 py-2 transition-all text-sm"
          >
            [./create_class.sh]
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="border border-green-500/20 bg-black/40 p-4 text-xs">
        <div className="text-green-600 mb-2">[HELP: class_commands]</div>
        <div className="space-y-1 text-green-700">
          <p><span className="text-green-500">create</span> - Initialize new class with unique join_code</p>
          <p><span className="text-green-500">assign</span> - Deploy cases to class students</p>
          <p><span className="text-green-500">monitor</span> - Track student progress in real-time</p>
          <p><span className="text-green-500">export</span> - Generate CSV report of class data</p>
        </div>
      </div>
    </div>
  );
}
