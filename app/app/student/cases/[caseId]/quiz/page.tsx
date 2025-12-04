'use client';

import { useState } from 'react';
import Link from 'next/link';
import MusicThemeSetter from '@/components/MusicThemeSetter';

const quizData = {
  caseId: '1',
  caseTitle: 'The Missing Canteen Money',
  questions: [
    {
      id: 'q1',
      question: 'What was the total amount of money missing from the canteen?',
      options: ['$30', '$40', '$50', '$60'],
      correctAnswer: '$50',
    },
    {
      id: 'q2',
      question: 'Who had access to the canteen after school hours?',
      options: [
        'Only Mrs. Tan',
        'Mr. Lim, Miss Chen, and Alex',
        'All teachers',
        'No one',
      ],
      correctAnswer: 'Mr. Lim, Miss Chen, and Alex',
    },
    {
      id: 'q3',
      question: 'If Friday\'s sales were $450 and $400 was counted, how much is missing?',
      options: ['$40', '$45', '$50', '$55'],
      correctAnswer: '$50',
    },
    {
      id: 'q4',
      question: 'Who signed in to the canteen at 6:00 PM?',
      options: ['Alex', 'Miss Chen', 'Mr. Lim', 'Mrs. Tan'],
      correctAnswer: 'Mr. Lim',
    },
    {
      id: 'q5',
      question: 'Based on the evidence, who is most likely responsible?',
      options: ['Mr. Lim', 'Miss Chen', 'Alex', 'Mrs. Tan'],
      correctAnswer: 'Alex',
    },
  ],
};

export default function QuizPage({ params }: { params: { caseId: string } }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Calculate score and redirect to results
    setTimeout(() => {
      window.location.href = `/student/cases/${params.caseId}/results`;
    }, 2000);
  };

  const allAnswered = Object.keys(answers).length === quizData.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <MusicThemeSetter theme="quiz" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Final Quiz 📝</h1>
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
              className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-700  flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{question.question}</h3>
                </div>
              </div>

              <div className="space-y-2 ml-14">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(question.id, option)}
                    disabled={submitted}
                    className={`w-full text-left p-4  border-2 transition-all ${
                      answers[question.id] === option
                        ? 'bg-amber-700 border-purple-500 text-white'
                        : 'bg-black/80/50 border-purple-500/20 text-purple-200 hover:border-purple-500/50'
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
        <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20  p-8">
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
                disabled={!allAnswered}
                className={`w-full font-bold py-4  text-lg transition-colors ${
                  allAnswered
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-black/80 text-slate-400 cursor-not-allowed'
                }`}
              >
                {allAnswered ? 'Submit Quiz & Solve Case!' : 'Answer All Questions First'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
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
              ← Back to Investigation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
