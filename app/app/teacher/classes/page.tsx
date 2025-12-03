import Link from 'next/link';

export default function ClassesListPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">MY CLASSES 👥</h1>
          <p className="text-slate-400 text-lg font-mono tracking-wider">&gt; Manage your classes and students</p>
        </div>
        <Link
          href="/teacher/classes/create"
          className="border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-6 py-3 transition-all font-mono font-bold tracking-wider flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>CREATE NEW CLASS</span>
        </Link>
      </div>

      {/* Classes List */}
      <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">👥</div>
          <p className="text-amber-400 text-lg font-mono tracking-wider">NO CLASSES YET</p>
          <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">&gt; Create your first class to start managing students!</p>
          <Link
            href="/teacher/classes/create"
            className="inline-block mt-6 border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-3 transition-all font-mono font-bold tracking-wider"
          >
            CREATE FIRST CLASS
          </Link>
        </div>
      </div>
    </div>
  );
}
