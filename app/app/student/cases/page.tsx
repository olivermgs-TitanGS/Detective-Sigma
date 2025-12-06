'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CaseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subjectFocus: string;
  estimatedMinutes: number;
  coverImage: string;
  status: string;
  userProgress?: {
    status: string;
    score: number;
  };
}

const difficultyColors = {
  ROOKIE: { bg: 'bg-green-900/50', border: 'border-green-600', text: 'text-green-400', tab: 'bg-green-700' },
  INSPECTOR: { bg: 'bg-amber-900/50', border: 'border-amber-600', text: 'text-amber-400', tab: 'bg-amber-700' },
  DETECTIVE: { bg: 'bg-orange-900/50', border: 'border-orange-600', text: 'text-orange-400', tab: 'bg-orange-700' },
  CHIEF: { bg: 'bg-red-900/50', border: 'border-red-600', text: 'text-red-400', tab: 'bg-red-700' },
};

export default function CaseLibrary() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const router = useRouter();

  // Navigation with loading state
  const handleNavigate = (caseId: string, path: 'detail' | 'play') => {
    const url = path === 'detail'
      ? `/student/cases/${caseId}`
      : `/student/cases/${caseId}/play`;

    setNavigatingTo(`${caseId}-${path}`);
    startTransition(() => {
      router.push(url);
    });
  };

  useEffect(() => {
    async function fetchCasesAndProgress() {
      try {
        // Fetch cases and user progress in parallel
        const [casesRes, progressRes] = await Promise.all([
          fetch('/api/cases?published=true', { credentials: 'include' }),
          fetch('/api/progress', { credentials: 'include' }),
        ]);

        if (casesRes.ok) {
          const casesData = await casesRes.json();
          let casesWithProgress = casesData.cases || [];

          // Merge progress data if available
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            const progressMap = new Map(
              (progressData.progress || []).map((p: any) => [p.caseId, p])
            );

            casesWithProgress = casesWithProgress.map((c: CaseData) => ({
              ...c,
              userProgress: progressMap.get(c.id),
            }));
          }

          setCases(casesWithProgress);
          setFilteredCases(casesWithProgress);
        }
      } catch (err) {
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCasesAndProgress();
  }, []);

  const applyFilters = () => {
    let filtered = [...cases];

    if (subjectFilter) {
      filtered = filtered.filter(c => c.subjectFocus === subjectFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(c => c.difficulty === difficultyFilter);
    }

    setFilteredCases(filtered);
    setOpenFolder(null); // Close any open folders when filtering
  };

  const toggleFolder = (caseId: string) => {
    setOpenFolder(openFolder === caseId ? null : caseId);
  };

  const getCaseNumber = (index: number) => `CASE-${String(index + 1).padStart(3, '0')}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📁</div>
          <p className="text-amber-500 font-mono">Loading case files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Loading Overlay */}
      <AnimatePresence>
        {(navigatingTo || isPending) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {/* Magnifying glass animation */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🔍
              </motion.div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-amber-400 font-mono text-lg tracking-wider"
              >
                {navigatingTo?.includes('-play')
                  ? 'Entering investigation...'
                  : 'Opening case file...'}
              </motion.p>

              {/* Loading dots */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-600"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Evidence Board Style */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          CASE FILE ARCHIVE 📁
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Select a case folder to view investigation details and puzzles
        </p>
      </div>

      {/* Filters - Investigation Parameters */}
      <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">SUBJECT FOCUS</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
            >
              <option value="">ALL SUBJECTS</option>
              <option value="MATH">MATH</option>
              <option value="SCIENCE">SCIENCE</option>
              <option value="INTEGRATED">INTEGRATED</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">DIFFICULTY LEVEL</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
            >
              <option value="">ALL RANKS</option>
              <option value="ROOKIE">ROOKIE (P4)</option>
              <option value="INSPECTOR">INSPECTOR (P5)</option>
              <option value="DETECTIVE">DETECTIVE (P6)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-2 transition-all font-mono font-bold tracking-wider"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Case Folders - Manila Paper Style */}
      <div className="space-y-6">
        {filteredCases.map((caseItem, index) => {
          const colors = difficultyColors[caseItem.difficulty as keyof typeof difficultyColors] || difficultyColors.ROOKIE;
          const isOpen = openFolder === caseItem.id;
          const caseNumber = getCaseNumber(index);
          const isSolved = caseItem.userProgress?.status === 'SOLVED';

          return (
            <div key={caseItem.id} className="group relative">
              {/* Manila Folder */}
              <button
                onClick={() => toggleFolder(caseItem.id)}
                className="w-full text-left transition-all duration-300"
              >
                {/* Folder Tab - Like real manila folder tabs */}
                <div className="relative">
                  <div
                    className={`absolute -top-4 left-6 px-6 py-2 rounded-t-lg font-mono text-sm font-bold tracking-wider z-10
                      ${isSolved
                        ? 'bg-stone-600 text-stone-300'
                        : `${colors.tab} text-white`}`}
                    style={{ boxShadow: '0 -2px 4px rgba(0,0,0,0.2)' }}
                  >
                    {caseNumber}
                  </div>
                </div>

                {/* Main Folder Body - Paper texture */}
                <div
                  className={`relative p-6 transition-all cursor-pointer
                    ${isSolved
                      ? 'bg-gradient-to-br from-stone-400 to-stone-500 opacity-70'
                      : 'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-50 hover:to-amber-100'}
                    ${isOpen ? 'rounded-t-lg rounded-tr-lg' : 'rounded-lg'}`}
                  style={{
                    boxShadow: isOpen
                      ? '0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                      : '0 8px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                    backgroundImage: isSolved
                      ? 'none'
                      : 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
                  }}
                >
                  {/* CASE CLOSED Stamp Overlay */}
                  {isSolved && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg">
                      <div
                        className="border-4 border-red-700 text-red-700 font-mono font-black text-4xl md:text-6xl px-6 py-2 transform -rotate-12 select-none opacity-60"
                        style={{
                          textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                          borderRadius: '8px',
                        }}
                      >
                        CASE CLOSED
                      </div>
                    </div>
                  )}

                  {/* Paper clip decoration */}
                  <div className="absolute -top-2 right-8 text-3xl transform rotate-12 opacity-60">📎</div>

                  {/* Folder Content */}
                  <div className="flex items-start gap-6">
                    {/* Left side - Case icon/image */}
                    <div className={`w-20 h-20 flex-shrink-0 ${isSolved ? 'grayscale opacity-50' : ''}`}>
                      {caseItem.coverImage ? (
                        <img
                          src={caseItem.coverImage}
                          alt={caseItem.title}
                          className="w-full h-full object-cover rounded-lg border-2 border-stone-400 shadow-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-stone-300 rounded-lg">
                          🔍
                        </div>
                      )}
                    </div>

                    {/* Center - Case Info */}
                    <div className="flex-1">
                      {/* Status badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${colors.bg} border ${colors.border} ${colors.text} text-xs px-3 py-1 font-mono font-bold tracking-wider rounded`}>
                          {caseItem.difficulty}
                        </span>
                        <span className="bg-slate-800 border border-slate-600 text-slate-300 text-xs px-3 py-1 font-mono font-bold rounded">
                          {caseItem.subjectFocus}
                        </span>
                        <span className={`text-xs px-3 py-1 font-mono font-bold rounded ${
                          isSolved
                            ? 'bg-red-900 border border-red-600 text-red-300'
                            : caseItem.userProgress?.status === 'IN_PROGRESS'
                            ? 'bg-blue-900 border border-blue-600 text-blue-300'
                            : 'bg-green-900 border border-green-600 text-green-300'
                        }`}>
                          {isSolved
                            ? 'CLOSED'
                            : caseItem.userProgress?.status === 'IN_PROGRESS'
                            ? 'IN PROGRESS'
                            : 'OPEN'}
                        </span>
                      </div>

                      {/* Case title - typed on folder */}
                      <h3 className={`text-2xl font-bold mb-2 font-mono tracking-wide ${
                        isSolved
                          ? 'text-stone-600'
                          : 'text-stone-800 group-hover:text-stone-900'
                      }`}>
                        {caseItem.title}
                      </h3>

                      {/* Description - like handwritten notes */}
                      <p className={`text-sm font-mono leading-relaxed ${
                        isSolved ? 'text-stone-600' : 'text-stone-600'
                      }`}>
                        {caseItem.description}
                      </p>
                    </div>

                    {/* Right side - Meta info */}
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className={`text-sm font-mono px-3 py-1 rounded ${
                        isSolved ? 'bg-stone-300 text-stone-700' : 'bg-amber-300/50 text-stone-700'
                      }`}>
                        ⏱️ {caseItem.estimatedMinutes} min
                      </div>
                      {isSolved && caseItem.userProgress?.score && (
                        <div className="text-sm font-mono px-3 py-1 rounded bg-green-200 text-green-800">
                          Score: {caseItem.userProgress.score} pts
                        </div>
                      )}
                      {/* Open/Close Indicator */}
                      <div className={`text-2xl text-stone-600 transition-transform duration-300 mt-2 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Folder Contents - Evidence Inside */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {/* Inside of folder - darker manila color like inside of real folder */}
                <div
                  className={`relative p-6 rounded-b-lg ${
                    isSolved
                      ? 'bg-gradient-to-br from-stone-500 to-stone-600'
                      : 'bg-gradient-to-br from-amber-200 to-amber-300'
                  }`}
                  style={{
                    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Case Preview Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Case Cover Image */}
                    <div
                      className="bg-white p-2 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform"
                      style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                    >
                      {caseItem.coverImage ? (
                        <img
                          src={caseItem.coverImage}
                          alt="Case Preview"
                          className="w-full h-24 object-cover"
                        />
                      ) : (
                        <div className="bg-slate-200 h-24 flex items-center justify-center text-4xl">
                          📷
                        </div>
                      )}
                      <p className="text-xs text-stone-600 mt-1 font-mono text-center">Case Preview</p>
                    </div>

                    {/* Case Info Note */}
                    <div
                      className="bg-yellow-100 p-3 shadow-lg transform rotate-1 hover:rotate-0 transition-transform"
                      style={{
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e5e5e5 24px)',
                      }}
                    >
                      <p className="text-xs text-stone-700 font-mono leading-relaxed">
                        📝 {caseItem.subjectFocus} case • {caseItem.difficulty} difficulty • Est. {caseItem.estimatedMinutes} min
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className="bg-white p-2 shadow-lg transform rotate-2 hover:rotate-0 transition-transform"
                      style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                    >
                      <div className={`h-24 flex items-center justify-center text-4xl border-2 border-dashed ${
                        isSolved ? 'bg-green-100 border-green-300' : 'bg-amber-100 border-amber-300'
                      }`}>
                        {isSolved ? '✅' : '🔍'}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 font-mono text-center">
                        {isSolved ? 'Case Closed' : 'Investigation Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Case Briefing Document */}
                  <div
                    className="bg-white p-4 shadow-lg mb-6 transform -rotate-1"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                  >
                    <div className="border-b-2 border-stone-300 pb-2 mb-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-mono font-bold text-stone-800 text-lg">
                          📋 CASE BRIEFING
                        </h4>
                        <p className="text-stone-500 text-xs font-mono">
                          CLASSIFIED - FOR DETECTIVE EYES ONLY
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigate(caseItem.id, 'detail')}
                        disabled={!!navigatingTo}
                        className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 font-mono text-sm font-bold tracking-wider transition-all rounded disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                      >
                        {navigatingTo === `${caseItem.id}-detail` ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              ⏳
                            </motion.span>
                            LOADING...
                          </>
                        ) : (
                          'FULL REPORT →'
                        )}
                      </button>
                    </div>
                    <p className="text-stone-700 font-mono text-sm leading-relaxed">
                      {caseItem.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    {isSolved ? (
                      <div className="space-y-3">
                        <div className="inline-block bg-green-100 border-2 border-green-600 text-green-800 px-6 py-2 font-mono font-bold rounded transform -rotate-1">
                          ✅ CASE SOLVED - Score: {caseItem.userProgress?.score || 0} pts
                        </div>
                        <div>
                          <button
                            onClick={() => handleNavigate(caseItem.id, 'play')}
                            disabled={!!navigatingTo}
                            className="inline-block bg-stone-700 hover:bg-stone-600 text-white px-8 py-3 font-mono font-bold text-lg tracking-wider transition-all hover:scale-105 shadow-lg rounded disabled:opacity-50 disabled:cursor-wait"
                          >
                            {navigatingTo === `${caseItem.id}-play` ? (
                              <span className="flex items-center gap-2">
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  ⏳
                                </motion.span>
                                LOADING...
                              </span>
                            ) : (
                              '🔄 REVIEW CASE FILES'
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavigate(caseItem.id, 'play')}
                        disabled={!!navigatingTo}
                        className="inline-block bg-red-700 hover:bg-red-600 text-white px-10 py-4 font-mono font-bold text-lg tracking-wider transition-all hover:scale-105 shadow-lg rounded border-2 border-red-900 disabled:opacity-50 disabled:cursor-wait"
                        style={{ boxShadow: '0 4px 12px rgba(185, 28, 28, 0.4)' }}
                      >
                        {navigatingTo === `${caseItem.id}-play` ? (
                          <span className="flex items-center gap-2 justify-center">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              ⏳
                            </motion.span>
                            ENTERING INVESTIGATION...
                          </span>
                        ) : (
                          '🔍 BEGIN INVESTIGATION'
                        )}
                      </button>
                    )}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute bottom-4 right-4 text-2xl opacity-40">📌</div>
                  <div className="absolute top-4 left-4 text-xl opacity-30 transform -rotate-12">🔖</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (if no cases) */}
      {filteredCases.length === 0 && (
        <div className="border-2 border-amber-600/30 bg-black/60 p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-amber-50 mb-2 font-mono tracking-widest">
            {cases.length === 0 ? 'NO CASE FILES AVAILABLE' : 'NO MATCHING CASES'}
          </h3>
          <p className="text-slate-400 font-mono tracking-wide">
            {cases.length === 0
              ? '> Check back later for new investigations!'
              : '> Try adjusting your filters to find more cases.'}
          </p>
        </div>
      )}
    </div>
  );
}
