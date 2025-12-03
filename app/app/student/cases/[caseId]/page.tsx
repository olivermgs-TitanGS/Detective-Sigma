import Link from 'next/link';

// Demo case data - will be fetched from database
const getCaseData = (caseId: string) => {
  const cases: Record<string, any> = {
    '1': {
      id: '1',
      title: 'The Missing Canteen Money',
      description: '$50 missing from the school canteen register. Can you solve this mystery?',
      difficulty: 'ROOKIE',
      subjectFocus: 'MATH',
      estimatedMinutes: 30,
      coverImage: '💰',
      storyIntro: `It's a typical Monday morning at Sunrise Primary School. Mrs. Tan, the canteen manager, arrives to find something shocking: $50 is missing from yesterday's register!

The canteen had a busy day on Friday, with lunch and recess sales. The money should have been locked in the cash box, but when Mrs. Tan counted it this morning, she found $50 less than expected.

Three people had access to the canteen after school hours: the cleaner (Mr. Lim), the science teacher (Miss Chen), and a student helper (Alex). Each has an alibi, but the numbers don't add up.

Your mission: Investigate the canteen, collect clues, solve puzzles, and figure out what really happened to the missing money. Along the way, you'll need to use your math skills to crack this case!`,
      learningObjectives: [
        'Apply addition and subtraction with money',
        'Understand time calculations',
        'Analyze data from receipts',
        'Practice problem-solving with real-world scenarios',
      ],
      skills: ['Addition', 'Subtraction', 'Money', 'Time', 'Data Analysis'],
    },
    '2': {
      id: '2',
      title: 'The Mysterious Measurement Mix-Up',
      description: 'The school garden dimensions are all wrong! Plants are dying. Find out why!',
      difficulty: 'INSPECTOR',
      subjectFocus: 'MATH',
      estimatedMinutes: 40,
      coverImage: '📏',
      storyIntro: `Green Valley Primary School has a beautiful garden that students planted last month. But something strange is happening: the plants are dying, and the garden looks nothing like the plan!

Mr. Wong, the science teacher, is confused. The garden was supposed to be 8 meters by 5 meters, but measurements show it's actually much smaller. The irrigation system isn't reaching all the plants, and the fence doesn't fit properly.

Three people were involved in measuring and building the garden: the school gardener (Mr. Kumar), a parent volunteer (Mrs. Lee), and Mr. Wong himself. Someone made a serious measurement error, but who?

Your mission: Investigate the garden, tool shed, and office. Use your measurement and area calculation skills to find out what went wrong!`,
      learningObjectives: [
        'Calculate area and perimeter',
        'Convert between units (cm, m, km)',
        'Understand scale and proportion',
        'Apply measurement in real contexts',
      ],
      skills: ['Area', 'Perimeter', 'Unit Conversion', 'Measurement', 'Problem Solving'],
    },
    '3': {
      id: '3',
      title: 'The Fraction Fraud',
      description: 'Fundraiser money doesn\'t add up. Someone made calculation errors... or did they?',
      difficulty: 'DETECTIVE',
      subjectFocus: 'MATH',
      estimatedMinutes: 45,
      coverImage: '🔢',
      storyIntro: `Eagle Primary School just finished a huge fundraiser to buy new library books. Each class contributed money, and the total should be $1,500. But when Mrs. Ang counted the donations, she only found $1,200!

The class monitor, Sarah, was responsible for collecting and recording donations. She says she checked everything twice. The teacher, Mr. Tan, reviewed her work and approved it. The librarian, Miss Lim, received the final amount.

Each class donated different fractions of the total goal, but the percentages don't match the actual amounts collected. Someone made calculation errors - or worse, someone might have taken money on purpose!

Your mission: Analyze the donation data, calculate fractions and percentages, interview suspects, and solve this complex case using advanced math skills!`,
      learningObjectives: [
        'Calculate fractions and percentages',
        'Understand ratios and proportions',
        'Analyze financial data',
        'Practice critical thinking with numbers',
      ],
      skills: ['Fractions', 'Percentages', 'Ratios', 'Data Analysis', 'Critical Thinking'],
    },
  };

  return cases[caseId] || null;
};

export default function CaseDetail({ params }: { params: { caseId: string } }) {
  const caseData = getCaseData(params.caseId);

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Case Not Found</h1>
          <p className="text-purple-200 mb-6">This mystery doesn't exist yet!</p>
          <Link
            href="/student/cases"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Back to Case Library
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    ROOKIE: 'bg-green-600',
    INSPECTOR: 'bg-yellow-600',
    DETECTIVE: 'bg-orange-600',
    CHIEF: 'bg-red-600',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/student/cases"
        className="inline-flex items-center text-purple-300 hover:text-white transition-colors"
      >
        ← Back to Case Library
      </Link>

      {/* Case Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 text-center">
        <div className="text-8xl mb-6">{caseData.coverImage}</div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`${difficultyColors[caseData.difficulty as keyof typeof difficultyColors]} text-white text-sm px-4 py-1 rounded-full font-semibold`}>
            {caseData.difficulty}
          </span>
          <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold">
            {caseData.subjectFocus}
          </span>
          <span className="bg-purple-600 text-white text-sm px-4 py-1 rounded-full font-semibold">
            ⏱️ {caseData.estimatedMinutes} mins
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{caseData.title}</h1>
        <p className="text-xl text-purple-200">{caseData.description}</p>
      </div>

      {/* Case Briefing */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          📋 Case Briefing
        </h2>
        <div className="text-purple-100 leading-relaxed whitespace-pre-line">
          {caseData.storyIntro}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          🎯 Learning Objectives
        </h2>
        <ul className="space-y-2">
          {caseData.learningObjectives.map((objective: string, index: number) => (
            <li key={index} className="flex items-start gap-3 text-purple-100">
              <span className="text-green-400 mt-1">✓</span>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills Practiced */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          💡 Skills You'll Practice
        </h2>
        <div className="flex flex-wrap gap-2">
          {caseData.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="bg-purple-600/30 text-purple-200 px-4 py-2 rounded-lg border border-purple-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Ready to Solve This Mystery?</h3>
        <p className="text-purple-100 mb-6">Put on your detective hat and start investigating!</p>
        <Link
          href={`/student/cases/${caseData.id}/play`}
          className="inline-block bg-white text-purple-900 px-12 py-4 rounded-lg font-bold text-lg hover:bg-purple-100 transition-colors"
        >
          Start Investigation 🔍
        </Link>
      </div>
    </div>
  );
}
