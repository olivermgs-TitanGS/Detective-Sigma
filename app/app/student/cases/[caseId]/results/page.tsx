'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MusicThemeSetter from '@/components/MusicThemeSetter';
import { useConfetti, CaseSolvedStamp } from '@/components/ui/Confetti';
import { toast } from '@/components/ui/Toast';
import { CaseFileLoader, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProgressRing, XPBar } from '@/components/ui/ProgressBar';
import { GlowButton, CTAButton } from '@/components/ui/GlowButton';
import { SuccessPulse, CaseClosedStamp } from '@/components/ui/SuccessPulse';

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
  const [showStamp, setShowStamp] = useState(false);
  const { fireSuccess, fireAchievement, fireStars } = useConfetti();

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

  // Trigger celebration effects when results load
  useEffect(() => {
    if (resultsData && !loading) {
      // Delay for dramatic effect
      setTimeout(() => {
        setShowStamp(true);
        fireSuccess();
        fireStars();
        toast.caseComplete(resultsData.caseTitle, resultsData.percentageScore >= 90 ? 3 : resultsData.percentageScore >= 70 ? 2 : 1);
        if (resultsData.percentageScore >= 80) {
          setTimeout(() => {
            fireAchievement();
            toast.achievement('Case Closed!', 'You solved the mystery');
          }, 1500);
        }
      }, 500);
    }
  }, [resultsData, loading, fireSuccess, fireStars, fireAchievement]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <CaseFileLoader message="COMPILING CASE REPORT" />
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
      {/* Case Solved Stamp Overlay */}
      <CaseSolvedStamp show={showStamp} onComplete={() => {}} />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Banner - Detective Styled */}
        <SuccessPulse active={true} color="evidence" intensity="high" variant="evidence">
          <div className="bg-gradient-to-br from-green-900/80 to-green-800/80 p-12 text-center border-2 border-green-500/50 relative">
            <div className="absolute top-4 right-4 transform rotate-12">
              <CaseClosedStamp size="md" />
            </div>
            <div className="text-8xl mb-4">📁</div>
            <h1 className="text-5xl font-bold text-green-400 font-mono tracking-wider mb-3">CASE SOLVED</h1>
            <p className="text-2xl text-green-100 font-mono mb-2">{resultsData.caseTitle}</p>
            <p className="text-green-300 font-mono">{resultsData.feedback.message}</p>
          </div>
        </SuccessPulse>

        {/* Score Cards - Detective Styled */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 border-2 border-amber-600/40 p-6 text-center">
            <div className="flex justify-center mb-2">
              <ProgressRing
                value={scorePercentage}
                max={100}
                size="lg"
                color="evidence"
                label="SCORE"
              />
            </div>
            <div className="text-amber-400 text-sm font-mono tracking-wider">CASE RATING</div>
          </div>
          <div className="bg-slate-900/80 border-2 border-amber-600/40 p-6 text-center">
            <div className={`text-5xl font-bold mb-2 font-mono ${gradeColor}`}>{grade}</div>
            <div className="text-amber-300 text-sm font-mono tracking-wider">GRADE</div>
          </div>
          <div className="bg-slate-900/80 border-2 border-amber-600/40 p-6 text-center">
            <div className="text-5xl font-bold text-amber-400 mb-2 font-mono">
              {correctAnswers}/{totalQuestions || '?'}
            </div>
            <div className="text-amber-300 text-sm font-mono tracking-wider">DEDUCTIONS</div>
          </div>
          <div className="bg-slate-900/80 border-2 border-green-600/40 p-6 text-center">
            <div className="text-5xl font-bold text-green-400 mb-2 font-mono">+{resultsData.score}</div>
            <div className="text-green-300 text-sm font-mono tracking-wider">POINTS EARNED</div>
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

        {/* Actions - Detective Styled */}
        <div className="bg-slate-900/80 border-2 border-amber-600/40 p-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-3 font-mono tracking-wider">NEXT ASSIGNMENT</h2>
          <p className="text-amber-200/80 mb-6 font-mono">
            Continue your detective journey with more cases!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/student/cases" className="flex-1">
              <CTAButton variant="investigate" size="lg" className="w-full">
                🔍 BROWSE MORE CASES
              </CTAButton>
            </Link>
            <Link href="/student/dashboard" className="flex-1">
              <GlowButton variant="amber" size="lg" fullWidth>
                📊 VIEW DASHBOARD
              </GlowButton>
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
