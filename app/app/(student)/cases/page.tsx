import Link from 'next/link';

// This will be replaced with actual data from database
const demoCases = [
  {
    id: '1',
    title: 'The Missing Canteen Money',
    description: '$50 missing from the school canteen register. Can you solve this mystery?',
    difficulty: 'ROOKIE',
    subjectFocus: 'MATH',
    estimatedMinutes: 30,
    coverImage: '💰',
  },
  {
    id: '2',
    title: 'The Mysterious Measurement Mix-Up',
    description: 'The school garden dimensions are all wrong! Plants are dying. Find out why!',
    difficulty: 'INSPECTOR',
    subjectFocus: 'MATH',
    estimatedMinutes: 40,
    coverImage: '📏',
  },
  {
    id: '3',
    title: 'The Fraction Fraud',
    description: 'Fundraiser money doesn\'t add up. Someone made calculation errors... or did they?',
    difficulty: 'DETECTIVE',
    subjectFocus: 'MATH',
    estimatedMinutes: 45,
    coverImage: '🔢',
  },
];

const difficultyColors = {
  ROOKIE: 'bg-green-900/50 border-green-600',
  INSPECTOR: 'bg-amber-900/50 border-amber-600',
  DETECTIVE: 'bg-orange-900/50 border-orange-600',
  CHIEF: 'bg-red-900/50 border-red-600',
};

export default function CaseLibrary() {
  return (
    <div className="space-y-8">
      {/* Header - Evidence Board Style */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          CASE FILE LIBRARY 🔍
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Select your investigation and begin the pursuit of justice
        </p>
      </div>

      {/* Filters - Investigation Parameters */}
      <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">SUBJECT FOCUS</label>
            <select className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors">
              <option value="">ALL SUBJECTS</option>
              <option value="MATH">MATH</option>
              <option value="SCIENCE">SCIENCE</option>
              <option value="INTEGRATED">INTEGRATED</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">DIFFICULTY LEVEL</label>
            <select className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors">
              <option value="">ALL RANKS</option>
              <option value="ROOKIE">ROOKIE (P4)</option>
              <option value="INSPECTOR">INSPECTOR (P5)</option>
              <option value="DETECTIVE">DETECTIVE (P6)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-2 transition-all font-mono font-bold tracking-wider">
              APPLY FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Case Grid - Case File Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoCases.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/student/cases/${caseItem.id}`}
            className="group"
          >
            <div className="border-2 border-amber-600/30 bg-black/60 p-6 hover:border-amber-600 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
              {/* Case Icon */}
              <div className="text-6xl mb-4 text-center filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{caseItem.coverImage}</div>

              {/* Difficulty Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`${difficultyColors[caseItem.difficulty as keyof typeof difficultyColors]} border-2 text-white text-xs px-3 py-1 font-mono font-bold tracking-wider`}>
                  {caseItem.difficulty}
                </span>
                <span className="bg-slate-900/80 border-2 border-slate-600 text-slate-300 text-xs px-3 py-1 font-mono font-bold tracking-wider">
                  {caseItem.subjectFocus}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-amber-50 mb-2 group-hover:text-amber-400 transition-colors font-mono tracking-wide">
                {caseItem.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 mb-4 text-sm font-mono leading-relaxed">
                {caseItem.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-slate-400 text-sm font-mono">
                <span>⏱️ ~{caseItem.estimatedMinutes} MIN</span>
                <span className="text-amber-400 font-bold tracking-wider">● NEW</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State (if no cases) */}
      {demoCases.length === 0 && (
        <div className="border-2 border-amber-600/30 bg-black/60 p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-amber-50 mb-2 font-mono tracking-widest">NO CASE FILES AVAILABLE</h3>
          <p className="text-slate-400 font-mono tracking-wide">&gt; Check back later for new investigations!</p>
        </div>
      )}
    </div>
  );
}
