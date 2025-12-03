import MusicPlayer from '@/components/MusicPlayer';

// Force fresh deployment - Updated 2025-12-04
export default function Home() {
  return (
    <div className="min-h-screen crime-scene-bg relative overflow-hidden">
      {/* Chalk Body Outlines */}
      <div className="chalk-body-outline" style={{ top: '15%', left: '10%', transform: 'rotate(15deg)', width: '250px' }}></div>
      <div className="chalk-body-outline" style={{ top: '60%', right: '8%', transform: 'rotate(-20deg)', width: '280px' }}></div>
      <div className="chalk-body-outline" style={{ bottom: '5%', left: '50%', transform: 'rotate(45deg) translateX(-50%)', width: '200px' }}></div>

      {/* Floating Dust Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Scanner Lines */}
      <div className="scanner-line" style={{ animationDelay: '0s' }}></div>
      <div className="scanner-line" style={{ animationDelay: '2s', top: '33%' }}></div>
      <div className="scanner-line" style={{ animationDelay: '4s', top: '66%' }}></div>

      {/* Background Music */}
      <MusicPlayer />

      {/* Realistic Crime Scene Tape - Multiple Lines in Background */}
      <div
        className="absolute top-[5%] w-full py-3 overflow-hidden transform -rotate-2 shadow-2xl z-0 opacity-60"
        style={{
          background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 -3px 6px rgba(0,0,0,0.4)'
        }}
      >
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[1em] text-xl"
            style={{
              color: '#FFFFFF',
              WebkitTextStroke: '3px #000000',
              textShadow: '0 0 20px rgba(0,0,0,1), 4px 4px 0px #000000, -2px -2px 0px #000000',
              fontFamily: 'Impact, Arial Black, sans-serif',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,1))'
            }}
          >
            CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS •
          </span>
        </div>
      </div>

      <div
        className="absolute top-[20%] w-full py-3 overflow-hidden transform rotate-1 shadow-2xl z-0 opacity-50"
        style={{
          background: 'repeating-linear-gradient(-45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 -3px 6px rgba(0,0,0,0.4)'
        }}
      >
        <div className="animate-marquee-reverse whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[1em] text-xl"
            style={{
              color: '#FFFFFF',
              WebkitTextStroke: '3px #000000',
              textShadow: '0 0 20px rgba(0,0,0,1), 4px 4px 0px #000000, -2px -2px 0px #000000',
              fontFamily: 'Impact, Arial Black, sans-serif',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,1))'
            }}
          >
            POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS •
          </span>
        </div>
      </div>

      <div
        className="absolute top-[65%] w-full py-3 overflow-hidden transform -rotate-1 shadow-2xl z-0 opacity-50"
        style={{
          background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 -3px 6px rgba(0,0,0,0.4)'
        }}
      >
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[1em] text-xl"
            style={{
              color: '#FFFFFF',
              WebkitTextStroke: '3px #000000',
              textShadow: '0 0 20px rgba(0,0,0,1), 4px 4px 0px #000000, -2px -2px 0px #000000',
              fontFamily: 'Impact, Arial Black, sans-serif',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,1))'
            }}
          >
            CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS • CRIME SCENE DO NOT CROSS •
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-[10%] w-full py-3 overflow-hidden transform rotate-2 shadow-2xl z-0 opacity-60"
        style={{
          background: 'repeating-linear-gradient(-45deg, #FFD700 0px, #FFD700 60px, #000000 60px, #000000 120px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.7), inset 0 -3px 6px rgba(0,0,0,0.4)'
        }}
      >
        <div className="animate-marquee-reverse whitespace-nowrap inline-block">
          <span
            className="font-black tracking-[1em] text-xl"
            style={{
              color: '#FFFFFF',
              WebkitTextStroke: '3px #000000',
              textShadow: '0 0 20px rgba(0,0,0,1), 4px 4px 0px #000000, -2px -2px 0px #000000',
              fontFamily: 'Impact, Arial Black, sans-serif',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,1))'
            }}
          >
            POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS • POLICE LINE DO NOT CROSS •
          </span>
        </div>
      </div>

      <main className="relative z-30 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="max-w-5xl w-full">
          <div className="text-center">
            {/* Main Title - Crime Scene Style */}
            <div className="mb-8 relative z-40">
              <div className="absolute inset-0 bg-amber-500/5 blur-3xl"></div>
              <h1 className="relative text-7xl font-bold text-amber-50 mb-2 tracking-[0.3em] font-mono drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                DETECTIVE
              </h1>
              <h2 className="relative text-8xl font-black text-amber-500 tracking-[0.4em] font-mono drop-shadow-[0_0_50px_rgba(245,158,11,0.8)]">
                SIGMA
              </h2>
              <div className="mt-4 inline-block border-2 border-amber-600 bg-black/80 px-6 py-2">
                <p className="text-amber-400 font-mono tracking-widest text-sm">
                  ⚠️ CRIME SCENE • DO NOT CROSS ⚠️
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-xl text-slate-400 mb-4 font-mono tracking-wide">
              &gt; SOLVE MYSTERIES. UNCOVER TRUTH. MASTER KNOWLEDGE.
            </p>
            <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto font-mono border-l-4 border-amber-600 pl-4 text-left">
              An evidence-based educational platform for Singapore Primary School students (P4-P6)
              to learn through interactive murder mystery cases aligned with MOE syllabus.
            </p>

            {/* Portal Buttons - Evidence Tag Style */}
            <div className="flex gap-6 items-center justify-center flex-wrap mb-16">
              <a
                className="group relative overflow-hidden border-2 border-amber-600 bg-black/90 px-10 py-5 text-lg font-bold font-mono tracking-wider text-amber-400 transition-all hover:bg-amber-600 hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
                href="/student/dashboard"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -right-8 top-2 w-16 h-16 border-4 border-amber-600/30 rounded-full group-hover:border-amber-400 transition-colors"></div>
                STUDENT PORTAL →
              </a>
              <a
                className="group relative overflow-hidden border-2 border-slate-600 bg-black/90 px-10 py-5 text-lg font-bold font-mono tracking-wider text-slate-400 transition-all hover:bg-slate-700 hover:text-amber-400 hover:border-amber-600 hover:scale-105"
                href="/teacher/dashboard"
              >
                TEACHER DASHBOARD →
              </a>
              <a
                className="group relative overflow-hidden border-2 border-red-800 bg-black/90 px-10 py-5 text-lg font-bold font-mono tracking-wider text-red-400 transition-all hover:bg-red-900 hover:text-amber-400 hover:border-amber-600 hover:scale-105"
                href="/admin/dashboard"
              >
                ADMIN CONSOLE →
              </a>
            </div>

            {/* Features - Evidence Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-amber-500 font-mono font-bold text-lg mb-2 tracking-widest">INVESTIGATE</h3>
                <p className="text-slate-400 text-sm font-mono">Examine crime scenes, collect evidence, analyze clues</p>
              </div>
              <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
                <div className="text-4xl mb-3">🧩</div>
                <h3 className="text-amber-500 font-mono font-bold text-lg mb-2 tracking-widest">SOLVE PUZZLES</h3>
                <p className="text-slate-400 text-sm font-mono">Apply math & science skills to crack the case</p>
              </div>
              <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm hover:border-amber-600 transition-colors">
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="text-amber-500 font-mono font-bold text-lg mb-2 tracking-widest">BRING JUSTICE</h3>
                <p className="text-slate-400 text-sm font-mono">Identify the culprit and close the case</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Crime Scene Footer */}
      <footer className="relative z-10 border-t-2 border-amber-600/30 bg-black/90 py-6 text-center">
        <p className="text-slate-600 font-mono text-sm tracking-wider">
          CASE FILE #2025 • DETECTIVE SIGMA • CLASSIFIED • MOE APPROVED
        </p>
      </footer>
    </div>
  );
}
