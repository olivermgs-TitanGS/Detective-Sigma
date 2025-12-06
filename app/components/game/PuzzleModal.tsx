'use client';

import { useState } from 'react';
import { useConfetti } from '@/components/ui/Confetti';
import { SinglePointFloat } from '@/components/ui/PointsFloat';
import { SuccessPulse } from '@/components/ui/SuccessPulse';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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
  const [showPoints, setShowPoints] = useState(false);

  const { fireSuccess } = useConfetti();
  const { playSound } = useSoundEffects();

  const handleSubmit = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = puzzle.correctAnswer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setShowPoints(true);
      // Play celebration effects
      fireSuccess();
      playSound('correct');
      playSound('confetti');
      setTimeout(() => {
        onSolved();
      }, 2000);
    } else {
      setIsCorrect(false);
      setAttempts(attempts + 1);
      playSound('wrong');
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-amber-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Puzzle Challenge */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 border-b-2 border-amber-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-black font-mono tracking-widest mb-1 font-bold">🧩 PUZZLE CHALLENGE</div>
              <h2 className="text-2xl font-bold text-black font-mono tracking-wider">{puzzle.title}</h2>
              <div className="text-black text-sm mt-2 font-mono tracking-wide">REWARD: {puzzle.points} POINTS</div>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:text-amber-950 text-3xl leading-none transition-colors font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Puzzle Question */}
          <div className="bg-black/50 p-6 border-2 border-amber-600/30">
            <h3 className="text-amber-400 font-mono font-bold mb-3 flex items-center gap-2 tracking-wider">
              ❓ QUESTION
            </h3>
            <p className="text-amber-50 text-lg leading-relaxed font-mono">{puzzle.questionText}</p>
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
                      className={`w-full text-left p-4 border-2 transition-all font-mono ${
                        answer === option
                          ? 'bg-amber-600 border-amber-500 text-black font-bold'
                          : 'bg-black/60 border-amber-600/30 text-amber-400 hover:border-amber-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                // Text Input
                <div>
                  <label className="block text-amber-400 mb-2 font-mono font-bold tracking-wider">YOUR ANSWER:</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Type your answer..."
                    className="w-full bg-black border-2 border-amber-600/30 px-4 py-3 text-amber-50 text-lg font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                    autoFocus
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!answer}
                className={`w-full font-mono font-bold py-3 transition-all tracking-wider ${
                  answer
                    ? 'border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400'
                    : 'border-2 border-slate-700 bg-black text-slate-600 cursor-not-allowed'
                }`}
              >
                SUBMIT ANSWER
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {isCorrect === false && (
            <div className="bg-red-900/30 border-2 border-red-600/50 p-4 animate-shake">
              <p className="text-red-200 font-mono font-bold flex items-center gap-2 tracking-wide">
                <span className="text-2xl">❌</span>
                <span>INCORRECT. TRY AGAIN!</span>
              </p>
              {attempts >= 2 && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-3 text-amber-300 hover:text-amber-200 text-sm font-mono tracking-wider underline"
                >
                  &gt; REQUEST HINT
                </button>
              )}
            </div>
          )}

          {isCorrect === true && (
            <SuccessPulse active={true} color="green" intensity="high">
              <div className="bg-green-900/30 border-2 border-green-600/50 p-4 relative">
                <p className="text-green-200 font-mono font-bold flex items-center gap-2 text-lg tracking-wide">
                  <span className="text-3xl">✅</span>
                  <span>CORRECT! +{puzzle.points} POINTS!</span>
                </p>
                <p className="text-green-300 text-sm mt-2 font-mono tracking-wide">&gt; Unlocking evidence...</p>
                <SinglePointFloat
                  value={puzzle.points}
                  show={showPoints}
                  type="points"
                  onComplete={() => setShowPoints(false)}
                />
              </div>
            </SuccessPulse>
          )}

          {/* Hint Section */}
          {showHint && isCorrect !== true && (
            <div className="bg-amber-900/30 border-2 border-amber-600/50 p-4">
              <h4 className="text-amber-400 font-mono font-bold mb-2 flex items-center gap-2 tracking-wider">
                💡 HINT
              </h4>
              <p className="text-amber-100 font-mono leading-relaxed">{puzzle.hint}</p>
            </div>
          )}

          {/* Help Text */}
          {isCorrect === null && (
            <div className="bg-amber-900/20 p-4 border-2 border-amber-600/30">
              <p className="text-amber-400 text-sm flex items-start gap-2 font-mono leading-relaxed">
                <span className="text-lg">📚</span>
                <span className="tracking-wide">
                  &gt; Apply your skills carefully. Request hint after multiple attempts if needed.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
