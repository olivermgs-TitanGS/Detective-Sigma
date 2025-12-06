'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  type: string;
}

interface QuizData {
  caseId: string;
  caseTitle: string;
  questions: Question[];
}

export default function QuizPage({ params }: { params: { caseId: string } }) {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz?caseId=${params.caseId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch quiz');
        const data = await res.json();
        setQuizData(data.quiz);
        setLoading(false);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('Failed to load quiz');
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [params.caseId]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };

  const handleSubmit = async () => {
    if (!quizData || submitting) return;

    setSubmitting(true);
    setSubmitted(true);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caseId: params.caseId,
          answers: answers,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit quiz');

      const data = await res.json();

      // Store results in sessionStorage for results page
      sessionStorage.setItem(
        `quiz_results_${params.caseId}`,
        JSON.stringify(data.submission)
      );

      // Redirect to results after brief delay
      setTimeout(() => {
        router.push(`/student/cases/${params.caseId}/results`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setSubmitted(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📝</div>
          <p className="text-amber-500 font-mono">Preparing quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-500 font-mono">{error || 'Quiz not found'}</p>
          <Link href={`/student/cases/${params.caseId}/play`} className="text-amber-500 hover:underline mt-4 inline-block">
            Back to Investigation
          </Link>
        </div>
      </div>
    );
  }

  const allAnswered = Object.keys(answers).length === quizData.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Final Quiz</h1>
          <p className="text-xl text-purple-200 mb-4">{quizData.caseTitle}</p>
          <p className="text-purple-300">
            Answer all questions to solve the case and see your final score!
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quizData.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-700 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{question.question}</h3>
                  <span className="text-xs text-purple-400">{question.points} points</span>
                </div>
              </div>

              <div className="space-y-2 ml-14">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(question.id, option)}
                    disabled={submitted}
                    className={`w-full text-left p-4 border-2 transition-all ${
                      answers[question.id] === option
                        ? 'bg-amber-700 border-purple-500 text-white'
                        : 'bg-black/50 border-purple-500/20 text-purple-200 hover:border-purple-500/50'
                    } ${submitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 p-8">
          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <p className="text-purple-200">
                  Questions answered: {Object.keys(answers).length} / {quizData.questions.length}
                </p>
                {!allAnswered && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Please answer all questions before submitting
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className={`w-full font-bold py-4 text-lg transition-colors ${
                  allAnswered && !submitting
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-black/80 text-slate-400 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Submitting...' : allAnswered ? 'Submit Quiz & Solve Case!' : 'Answer All Questions First'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Analyzing your answers...</h3>
              <p className="text-purple-200">Calculating your detective score!</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        {!submitted && (
          <div className="text-center">
            <Link
              href={`/student/cases/${params.caseId}/play`}
              className="text-purple-300 hover:text-white transition-colors"
            >
              Back to Investigation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
