'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MusicThemeSetter from '@/components/MusicThemeSetter';

interface ResultsData {
  score: number;
  maxScore: number;
  percentageScore: number;
  results: Record<string, boolean>;
  feedback: {
    message: string;
    summary: string;
    strengths: string[];
    improvements: string[];
  };
  caseTitle: string;
}

interface ProgressData {
  timeSpent: number;
  cluesCollected: string[];
  puzzlesSolved: string[];
}

export default function ResultsPage({ params }: { params: { caseId: string } }) {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        // Try to get results from sessionStorage first
        const storedResults = sessionStorage.getItem(`quiz_results_${params.caseId}`);
        if (storedResults) {
          setResultsData(JSON.parse(storedResults));
        }

        // Fetch progress data from API
        const progressRes = await fetch(`/api/progress?caseId=${params.caseId}`, {
          credentials: 'include',
        });
        if (progressRes.ok) {
          const data = await progressRes.json();
          if (data.progress) {
            setProgressData({
              timeSpent: data.progress.timeSpent || 0,
              cluesCollected: data.progress.cluesCollected || [],
              puzzlesSolved: data.progress.puzzlesSolved || [],
            });

            // If no stored results but progress exists with score, build basic results
            if (!storedResults && data.progress.score > 0) {
              setResultsData({
                score: data.progress.score,
                maxScore: 100,
                percentageScore: data.progress.score,
                results: {},
                feedback: {
                  message: data.progress.score >= 80 ? 'Excellent work, Detective!' : 'Good job, Detective!',
                  summary: 'You completed this case successfully.',
                  strengths: ['Completed the investigation'],
                  improvements: ['Keep practicing!'],
                },
                caseTitle: data.progress.case?.title || 'Case',
              });
            }
          }
        }
      } catch (err) {
        console.error('Error loading results:', err);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [params.caseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔍</div>
          <p className="text-amber-500 font-mono">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-500 font-mono">No results found</p>
          <Link href={`/student/cases/${params.caseId}/quiz`} className="text-amber-500 hover:underline mt-4 inline-block">
            Take the Quiz
          </Link>
        </div>
      </div>
    );
  }

  const scorePercentage = resultsData.percentageScore;
  const grade = scorePercentage >= 90 ? 'A' : scorePercentage >= 80 ? 'B' : scorePercentage >= 70 ? 'C' : scorePercentage >= 60 ? 'D' : 'F';
  const gradeColor = scorePercentage >= 90 ? 'text-green-400' : scorePercentage >= 80 ? 'text-blue-400' : scorePercentage >= 70 ? 'text-yellow-400' : 'text-orange-400';

  const correctAnswers = Object.values(resultsData.results).filter(Boolean).length;
  const totalQuestions = Object.keys(resultsData.results).length;
  const timeTaken = progressData ? Math.ceil(progressData.timeSpent / 60) : 0;
  const cluesCount = progressData?.cluesCollected.length || 0;
  const puzzlesCount = progressData?.puzzlesSolved.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <MusicThemeSetter theme="results" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-12 text-center border-2 border-green-500/50">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-white mb-3">Case Solved!</h1>
          <p className="text-2xl text-green-100 mb-2">{resultsData.caseTitle}</p>
          <p className="text-green-200">{resultsData.feedback.message}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6 text-center">
            <div className={`text-5xl font-bold mb-2 ${gradeColor}`}>{grade}</div>
            <div className="text-purple-200 text-sm">Grade</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{scorePercentage}%</div>
            <div className="text-purple-200 text-sm">Score</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {correctAnswers}/{totalQuestions || '?'}
            </div>
            <div className="text-purple-200 text-sm">Correct Answers</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6 text-center">
            <div className="text-5xl font-bold text-white mb-2">{resultsData.score}</div>
            <div className="text-purple-200 text-sm">Points Earned</div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Performance Summary</h2>
          <p className="text-purple-100 mb-6 leading-relaxed">{resultsData.feedback.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                Strengths
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
                Keep Practicing
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
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Case Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-purple-200 text-sm mb-1">Time Taken</div>
              <div className="text-white text-xl font-bold">{timeTaken} mins</div>
            </div>
            <div>
              <div className="text-purple-200 text-sm mb-1">Clues Collected</div>
              <div className="text-white text-xl font-bold">{cluesCount}</div>
            </div>
            <div>
              <div className="text-purple-200 text-sm mb-1">Puzzles Solved</div>
              <div className="text-white text-xl font-bold">{puzzlesCount}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8">
          <h2 className="text-2xl font-bold text-white mb-3">What's Next?</h2>
          <p className="text-purple-100 mb-6">
            Continue your detective journey with more cases!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/student/cases"
              className="flex-1 bg-white text-purple-900 px-6 py-3 font-bold text-center hover:bg-purple-100 transition-colors"
            >
              Browse More Cases
            </Link>
            <Link
              href="/student/dashboard"
              className="flex-1 bg-transparent border-2 border-white text-white px-6 py-3 font-bold text-center hover:bg-white/10 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link
            href="/student/dashboard"
            className="text-purple-300 hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
