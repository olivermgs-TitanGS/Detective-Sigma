export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              🔍 Detective Sigma
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Solve Mysteries. Master Math & Science.
            </p>
            <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
              An educational platform for Singapore Primary School students (P4-P6)
              to learn through interactive detective cases aligned with MOE syllabus.
            </p>

            <div className="flex gap-4 items-center justify-center flex-wrap">
              <a
                className="rounded-lg border border-white bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-all hover:bg-transparent hover:text-white"
                href="/student"
              >
                Student Portal
              </a>
              <a
                className="rounded-lg border border-purple-300 px-8 py-4 text-lg font-semibold text-purple-200 transition-all hover:bg-purple-300 hover:text-slate-900"
                href="/teacher"
              >
                Teacher Dashboard
              </a>
              <a
                className="rounded-lg border border-purple-500 px-8 py-4 text-lg font-semibold text-purple-400 transition-all hover:bg-purple-500 hover:text-white"
                href="/admin"
              >
                Admin Console
              </a>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-3xl mb-2">🧮</div>
                <h3 className="text-lg font-semibold text-white mb-2">Math Mastery</h3>
                <p className="text-sm text-slate-400">
                  Solve puzzles using P4-P6 Math concepts aligned with PSLE syllabus
                </p>
              </div>

              <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-3xl mb-2">🔬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Science Inquiry</h3>
                <p className="text-sm text-slate-400">
                  Investigate using scientific method and process skills
                </p>
              </div>

              <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-3xl mb-2">📖</div>
                <h3 className="text-lg font-semibold text-white mb-2">English Embedded</h3>
                <p className="text-sm text-slate-400">
                  Practice comprehension through reading narratives and clues
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full py-6 text-center text-slate-500">
        <p>Detective Sigma © 2025 | Built for Singapore MOE Syllabus</p>
      </footer>
    </div>
  );
}
