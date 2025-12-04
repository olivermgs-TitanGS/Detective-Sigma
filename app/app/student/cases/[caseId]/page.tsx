import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getCaseData(caseId: string) {
  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      scenes: {
        orderBy: { orderIndex: 'asc' },
      },
      puzzles: true,
      suspects: true,
    },
  });

  return caseData;
}

export default async function CaseDetail({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const caseData = await getCaseData(caseId);

  if (!caseData) {
    notFound();
  }

  const difficultyColors: Record<string, string> = {
    ROOKIE: 'bg-green-600',
    INSPECTOR: 'bg-yellow-600',
    DETECTIVE: 'bg-orange-600',
    CHIEF: 'bg-red-600',
  };

  // Parse learning objectives if stored as JSON
  const learningObjectives = caseData.learningObjectives as {
    primary?: string;
    secondary?: string[];
  } | null;

  const objectives = learningObjectives
    ? [
        learningObjectives.primary,
        ...(learningObjectives.secondary || []),
      ].filter(Boolean)
    : ['Solve the mystery using critical thinking skills'];

  // Parse skills assessed
  const skillsAssessed = caseData.skillsAssessed as Record<string, number> | null;
  const skills = skillsAssessed
    ? Object.keys(skillsAssessed).map((s) => s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
    : ['Problem Solving', 'Critical Thinking'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/student/cases"
        className="inline-flex items-center text-amber-400 hover:text-white transition-colors font-mono"
      >
        ← Back to Case Library
      </Link>

      {/* Case Header */}
      <div className="bg-black/60 backdrop-blur-sm border-2 border-amber-600/30 p-8 text-center">
        <div className="text-8xl mb-6">{caseData.coverImage || '🔍'}</div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            className={`${difficultyColors[caseData.difficulty] || 'bg-gray-600'} text-white text-sm px-4 py-1 font-semibold font-mono`}
          >
            {caseData.difficulty}
          </span>
          <span className="bg-red-600 text-white text-sm px-4 py-1 font-semibold font-mono">
            {caseData.subjectFocus}
          </span>
          <span className="bg-amber-700 text-white text-sm px-4 py-1 font-semibold font-mono">
            ⏱️ {caseData.estimatedMinutes} mins
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 font-mono tracking-wide">
          {caseData.title}
        </h1>
        <p className="text-xl text-slate-300">{caseData.description?.slice(0, 200)}...</p>
      </div>

      {/* Case Briefing */}
      <div className="bg-black/60 backdrop-blur-sm border-2 border-amber-600/30 p-8">
        <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2 font-mono tracking-wider">
          📋 CASE BRIEFING
        </h2>
        <div className="text-slate-200 leading-relaxed whitespace-pre-line font-mono">
          {caseData.description}
        </div>
      </div>

      {/* Case Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/60 border-2 border-amber-600/30 p-4 text-center">
          <div className="text-3xl mb-2">🏛️</div>
          <div className="text-2xl font-bold text-white">{caseData.scenes.length}</div>
          <div className="text-slate-400 text-sm font-mono">SCENES</div>
        </div>
        <div className="bg-black/60 border-2 border-amber-600/30 p-4 text-center">
          <div className="text-3xl mb-2">🧩</div>
          <div className="text-2xl font-bold text-white">{caseData.puzzles.length}</div>
          <div className="text-slate-400 text-sm font-mono">PUZZLES</div>
        </div>
        <div className="bg-black/60 border-2 border-amber-600/30 p-4 text-center">
          <div className="text-3xl mb-2">👤</div>
          <div className="text-2xl font-bold text-white">{caseData.suspects.length}</div>
          <div className="text-slate-400 text-sm font-mono">SUSPECTS</div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-black/60 backdrop-blur-sm border-2 border-amber-600/30 p-8">
        <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2 font-mono tracking-wider">
          🎯 LEARNING OBJECTIVES
        </h2>
        <ul className="space-y-2">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-200">
              <span className="text-green-400 mt-1">✓</span>
              <span className="font-mono">{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills Practiced */}
      <div className="bg-black/60 backdrop-blur-sm border-2 border-amber-600/30 p-8">
        <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2 font-mono tracking-wider">
          💡 SKILLS YOU'LL PRACTICE
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-amber-700/30 text-amber-200 px-4 py-2 border border-amber-600/30 font-mono"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-800 border-2 border-amber-600 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-wider">
          READY TO SOLVE THIS MYSTERY?
        </h3>
        <p className="text-amber-200 mb-6 font-mono">
          Put on your detective hat and start investigating!
        </p>
        <Link
          href={`/student/cases/${caseData.id}/play`}
          className="inline-block bg-white text-amber-900 px-12 py-4 font-bold text-lg hover:bg-amber-100 transition-colors font-mono tracking-wider"
        >
          START INVESTIGATION 🔍
        </Link>
      </div>
    </div>
  );
}
