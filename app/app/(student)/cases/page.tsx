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
  ROOKIE: 'bg-green-600',
  INSPECTOR: 'bg-yellow-600',
  DETECTIVE: 'bg-orange-600',
  CHIEF: 'bg-red-600',
};

export default function CaseLibrary() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Case Library 📚</h1>
        <p className="text-purple-200 text-lg">Choose a mystery to solve and master your skills!</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-purple-200 mb-2 text-sm font-medium">Subject</label>
            <select className="w-full bg-slate-900 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Subjects</option>
              <option value="MATH">Math</option>
              <option value="SCIENCE">Science</option>
              <option value="INTEGRATED">Integrated</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-purple-200 mb-2 text-sm font-medium">Difficulty</label>
            <select className="w-full bg-slate-900 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Levels</option>
              <option value="ROOKIE">Rookie (P4)</option>
              <option value="INSPECTOR">Inspector (P5)</option>
              <option value="DETECTIVE">Detective (P6)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-colors font-semibold">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoCases.map((caseItem) => (
          <Link
            key={caseItem.id}
            href={`/student/cases/${caseItem.id}`}
            className="group"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer">
              {/* Case Icon */}
              <div className="text-6xl mb-4 text-center">{caseItem.coverImage}</div>

              {/* Difficulty Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`${difficultyColors[caseItem.difficulty as keyof typeof difficultyColors]} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                  {caseItem.difficulty}
                </span>
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {caseItem.subjectFocus}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {caseItem.title}
              </h3>

              {/* Description */}
              <p className="text-purple-200 mb-4 text-sm">
                {caseItem.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-purple-300 text-sm">
                <span>⏱️ ~{caseItem.estimatedMinutes} mins</span>
                <span className="text-green-400 font-semibold">NEW</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State (if no cases) */}
      {demoCases.length === 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Cases Available</h3>
          <p className="text-purple-200">Check back later for new mysteries to solve!</p>
        </div>
      )}
    </div>
  );
}
