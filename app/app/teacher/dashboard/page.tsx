import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-8">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">WELCOME BACK, INSTRUCTOR 👨‍🏫</h1>
        <p className="text-slate-400 text-lg font-mono tracking-wider">&gt; Manage your classes and track student progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border-2 border-amber-600/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-amber-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">MY CLASSES</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-amber-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">TOTAL STUDENTS</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-amber-500 font-mono mb-2">0</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">CASES ASSIGNED</div>
        </div>
        <div className="border-2 border-amber-600/30 bg-black/60 backdrop-blur-sm p-6">
          <div className="text-4xl font-bold text-amber-500 font-mono mb-2">0%</div>
          <div className="text-slate-400 font-mono text-sm tracking-wider">AVG COMPLETION</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/teacher/classes/create"
          className="group border-2 border-amber-600/30 hover:border-amber-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">➕</div>
          <h3 className="text-2xl font-bold text-amber-50 font-mono tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
            CREATE NEW CLASS
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; Set up a new class and generate a join code for students
          </p>
        </Link>

        <Link
          href="/teacher/classes"
          className="group border-2 border-amber-600/30 hover:border-amber-600 bg-black/60 backdrop-blur-sm p-8 transition-all"
        >
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">👥</div>
          <h3 className="text-2xl font-bold text-amber-50 font-mono tracking-wider mb-2 group-hover:text-amber-400 transition-colors">
            MANAGE CLASSES
          </h3>
          <p className="text-slate-400 font-mono text-sm leading-relaxed">
            &gt; View your classes, assign cases, and track student progress
          </p>
        </Link>
      </div>

      {/* My Classes */}
      <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-widest mb-6 flex items-center gap-2">
          📚 MY CLASSES
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">👥</div>
          <p className="text-amber-400 text-lg font-mono tracking-wider">NO CLASSES YET</p>
          <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">&gt; Create your first class to get started!</p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
          >
            CREATE CLASS
          </Link>
        </div>
      </div>
    </div>
  );
}
