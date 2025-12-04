'use client';

import Link from 'next/link';
import MusicThemeSetter from '@/components/MusicThemeSetter';

// Demo results data - will be calculated from quiz submission
const resultsData = {
  caseId: '1',
  caseTitle: 'The Missing Canteen Money',
  score: 85,
  totalQuestions: 5,
  correctAnswers: 4,
  pointsEarned: 120,
  timeTaken: 28, // minutes
  feedback: {
    message: 'Excellent work, Detective!',
    summary: 'You successfully identified Alex as the person responsible and demonstrated strong mathematical reasoning throughout your investigation.',
    strengths: [
      'Accurately calculated the missing money',
      'Correctly analyzed the timeline',
      'Made logical deductions from the evidence',
    ],
    improvements: [
      'Review area calculations for similar cases',
    ],
  },
  nextRecommendation: {
    id: '2',
    title: 'The Mysterious Measurement Mix-Up',
    difficulty: 'INSPECTOR',
  },
};

export default function ResultsPage({ params }: { params: { caseId: string } }) {
  const scorePercentage = resultsData.score;
  const grade = scorePercentage >= 90 ? 'A' : scorePercentage >= 80 ? 'B' : scorePercentage >= 70 ? 'C' : scorePercentage >= 60 ? 'D' : 'F';
  const gradeColor = scorePercentage >= 90 ? 'text-green-400' : scorePercentage >= 80 ? 'text-blue-400' : scorePercentage >= 70 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <MusicThemeSetter theme="credits" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-green-600 to-green-800  p-12 text-center border-2 border-green-500/50">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-white mb-3">Case Solved!</h1>
          <p className="text-2xl text-green-100 mb-2">{resultsData.caseTitle}</p>
          <p className="text-green-200">{resultsData.feedback.message}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6 text-center">
            <div className={`text-5xl font-bold mb-2 ${gradeColor}`}>{grade}</div>
            <div className="text-purple-200 text-sm">Grade</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{resultsData.score}%</div>
            <div className="text-purple-200 text-sm">Score</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {resultsData.correctAnswers}/{resultsData.totalQuestions}
            </div>
            <div className="text-purple-200 text-sm">Correct Answers</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{resultsData.pointsEarned}</div>
            <div className="text-purple-200 text-sm">Points Earned</div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Performance Summary</h2>
          <p className="text-purple-100 mb-6 leading-relaxed">{resultsData.feedback.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                ✓ Strengths
              </h3>
              <ul className="space-y-2">
                {resultsData.feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-purple-200">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                💡 Keep Practicing
              </h3>
              <ul className="space-y-2">
                {resultsData.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-purple-200">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📈 Case Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-purple-200 text-sm mb-1">Time Taken</div>
              <div className="text-white text-xl font-bold">{resultsData.timeTaken} mins</div>
            </div>
            <div>
              <div className="text-purple-200 text-sm mb-1">Clues Collected</div>
              <div className="text-white text-xl font-bold">3/3</div>
            </div>
            <div>
              <div className="text-purple-200 text-sm mb-1">Puzzles Solved</div>
              <div className="text-white text-xl font-bold">1/1</div>
            </div>
          </div>
        </div>

        {/* Next Case Recommendation */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600  p-8">
          <h2 className="text-2xl font-bold text-white mb-3">🎯 Ready for Your Next Case?</h2>
          <p className="text-purple-100 mb-6">
            Based on your performance, we recommend this case next:
          </p>

          <div className="bg-white/10 backdrop-blur-sm  p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-yellow-600 text-white text-sm px-3 py-1  font-semibold">
                {resultsData.nextRecommendation.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {resultsData.nextRecommendation.title}
            </h3>
            <p className="text-purple-100 text-sm">Continue building your detective skills!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/student/cases/${resultsData.nextRecommendation.id}`}
              className="flex-1 bg-white text-purple-900 px-6 py-3  font-bold text-center hover:bg-purple-100 transition-colors"
            >
              Start Next Case →
            </Link>
            <Link
              href="/student/cases"
              className="flex-1 bg-transparent border-2 border-white text-white px-6 py-3  font-bold text-center hover:bg-white/10 transition-colors"
            >
              Browse All Cases
            </Link>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link
            href="/student/dashboard"
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
