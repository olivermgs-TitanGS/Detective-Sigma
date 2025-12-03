'use client';

import { useState } from 'react';

interface PuzzleModalProps {
  puzzle: {
    id: string;
    title: string;
    type: string;
    questionText: string;
    correctAnswer: string;
    hint: string;
    points: number;
    options?: string[] | null;
  };
  onSolved: () => void;
  onClose: () => void;
}

export default function PuzzleModal({ puzzle, onSolved, onClose }: PuzzleModalProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = puzzle.correctAnswer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        onSolved();
      }, 2000);
    } else {
      setIsCorrect(false);
      setAttempts(attempts + 1);
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border-2 border-yellow-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-yellow-600 to-orange-600 p-6 border-b border-yellow-500/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-yellow-200 mb-1">🧩 Puzzle Challenge</div>
              <h2 className="text-2xl font-bold text-white">{puzzle.title}</h2>
              <div className="text-yellow-100 text-sm mt-2">Worth {puzzle.points} points</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-200 text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Puzzle Question */}
          <div className="bg-slate-900/50 rounded-lg p-6 border border-yellow-500/20">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              ❓ Question
            </h3>
            <p className="text-white text-lg leading-relaxed">{puzzle.questionText}</p>
          </div>

          {/* Answer Input */}
          {isCorrect === null && (
            <div className="space-y-4">
              {puzzle.options ? (
                // Multiple Choice
                <div className="space-y-2">
                  {puzzle.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answer === option
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700/50 border-purple-500/20 text-purple-200 hover:border-purple-500/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                // Text Input
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Your Answer:</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Type your answer here..."
                    className="w-full bg-slate-900 border border-purple-500/30 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!answer}
                className={`w-full font-bold py-3 rounded-lg transition-colors ${
                  answer
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {isCorrect === false && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 animate-shake">
              <p className="text-red-200 font-semibold flex items-center gap-2">
                <span className="text-2xl">❌</span>
                <span>Not quite right. Try again!</span>
              </p>
              {attempts >= 2 && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-3 text-yellow-300 hover:text-yellow-200 text-sm underline"
                >
                  Show Hint
                </button>
              )}
            </div>
          )}

          {isCorrect === true && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 font-semibold flex items-center gap-2 text-lg">
                <span className="text-3xl">✅</span>
                <span>Correct! You earned {puzzle.points} points!</span>
              </p>
              <p className="text-green-300 text-sm mt-2">Unlocking clue...</p>
            </div>
          )}

          {/* Hint Section */}
          {showHint && isCorrect !== true && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
              <h4 className="text-yellow-200 font-semibold mb-2 flex items-center gap-2">
                💡 Hint
              </h4>
              <p className="text-yellow-100">{puzzle.hint}</p>
            </div>
          )}

          {/* Help Text */}
          {isCorrect === null && (
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
              <p className="text-purple-200 text-sm flex items-start gap-2">
                <span className="text-lg">📚</span>
                <span>
                  Take your time and use your math skills. If you're stuck after a few attempts,
                  you can request a hint!
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
