'use client';

import { useState } from 'react';
import { useConfetti } from '@/components/ui/Confetti';
import { SinglePointFloat } from '@/components/ui/PointsFloat';
import { SuccessPulse } from '@/components/ui/SuccessPulse';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';
import { toast } from '@/components/ui/Toast';

// Revelation type from the narrative engine
interface PuzzleRevelation {
  type: 'evidence' | 'alibi_check' | 'timeline' | 'motive' | 'confession_clue';
  description: string;
  storyText: string;
  importance: 'minor' | 'moderate' | 'major';
}

interface PuzzleModalProps {
  puzzle: {
    id: string;
    title: string;
    type: string;
    questionText: string;
    correctAnswer: string;
    hint?: string | null;
    points: number;
    options?: string[] | null;
    // Narrative revelation system
    narrativeContext?: string | null;
    investigationPhase?: string | null;
    revelation?: PuzzleRevelation | null;
    relatedCharacterName?: string | null;
  };
  onSolved: () => void;
  onClose: () => void;
}

// Get icon based on revelation type
function getRevelationIcon(type: string): string {
  switch (type) {
    case 'evidence': return '🔍';
    case 'alibi_check': return '⏰';
    case 'timeline': return '📅';
    case 'motive': return '💭';
    case 'confession_clue': return '🎯';
    default: return '📋';
  }
}

// Get importance styling
function getImportanceStyle(importance: string): { border: string; bg: string; glow: string } {
  switch (importance) {
    case 'major':
      return {
        border: 'border-yellow-500',
        bg: 'bg-yellow-900/40',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
      };
    case 'moderate':
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-900/30',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]'
      };
    default:
      return {
        border: 'border-green-600',
        bg: 'bg-green-900/30',
        glow: ''
      };
  }
}

// Get phase badge styling
function getPhaseBadge(phase: string): { text: string; color: string } {
  switch (phase) {
    case 'initial':
      return { text: 'INITIAL FINDINGS', color: 'bg-blue-600' };
    case 'investigation':
      return { text: 'INVESTIGATION', color: 'bg-amber-600' };
    case 'conclusion':
      return { text: 'KEY EVIDENCE', color: 'bg-red-600' };
    default:
      return { text: 'EVIDENCE', color: 'bg-slate-600' };
  }
}

export default function PuzzleModal({ puzzle, onSolved, onClose }: PuzzleModalProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [showRevelation, setShowRevelation] = useState(false);
  const [revelationRead, setRevelationRead] = useState(false);

  const { fireSuccess, fireEvidence, fireCaseStamp } = useConfetti();
  const { playSound } = useSoundEffects();

  const hasRevelation = puzzle.revelation && puzzle.revelation.storyText;
  const phaseBadge = puzzle.investigationPhase ? getPhaseBadge(puzzle.investigationPhase) : null;

  const handleSubmit = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = puzzle.correctAnswer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setShowPoints(true);
      // Play detective celebration effects
      fireEvidence();
      fireCaseStamp();
      playSound('correct');
      playSound('confetti');

      // Show detective toast notification
      toast.points(puzzle.points, 'Puzzle solved');

      // Show revelation after a short delay if available
      if (hasRevelation) {
        setTimeout(() => {
          setShowRevelation(true);
          playSound('clueFound'); // Play discovery sound for revelation
        }, 1500);
      } else {
        // No revelation - proceed after shorter delay
        setTimeout(() => {
          onSolved();
        }, 2000);
      }
    } else {
      setIsCorrect(false);
      setAttempts(attempts + 1);
      playSound('wrong');
      toast.error('Incorrect answer', 'Review the evidence and try again');
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  // Handle continue after reading revelation
  const handleContinueAfterRevelation = () => {
    setRevelationRead(true);
    setTimeout(() => {
      onSolved();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-amber-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Puzzle Challenge */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 border-b-2 border-amber-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-black font-mono tracking-widest font-bold">🧩 PUZZLE CHALLENGE</span>
                {phaseBadge && (
                  <span className={`${phaseBadge.color} text-white text-xs px-2 py-0.5 font-mono font-bold`}>
                    {phaseBadge.text}
                  </span>
                )}
              </div>
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
          {/* Narrative Context - Why this puzzle matters to the case */}
          {puzzle.narrativeContext && !isCorrect && (
            <div className="bg-slate-900/60 p-4 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h4 className="text-amber-400 font-mono font-bold text-sm tracking-wider mb-1">CASE CONTEXT</h4>
                  <p className="text-slate-300 font-mono text-sm leading-relaxed italic">
                    {puzzle.narrativeContext}
                  </p>
                  {puzzle.relatedCharacterName && (
                    <p className="text-amber-500 font-mono text-xs mt-2 tracking-wide">
                      &gt; Related to: {puzzle.relatedCharacterName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                      onClick={() => {
                        playSound('optionSelect');
                        setAnswer(option);
                      }}
                      onMouseEnter={() => playSound('hoverSubtle')}
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
                    onFocus={() => playSound('textFocus')}
                    placeholder="Type your answer..."
                    className="w-full bg-black border-2 border-amber-600/30 px-4 py-3 text-amber-50 text-lg font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                    autoFocus
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                onMouseEnter={() => answer && playSound('hoverSubtle')}
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

          {isCorrect === true && !showRevelation && (
            <SuccessPulse active={true} color="evidence" intensity="high" variant="evidence">
              <div className="bg-green-900/30 border-2 border-green-600/50 p-4 relative">
                <p className="text-green-200 font-mono font-bold flex items-center gap-2 text-lg tracking-wide">
                  <span className="text-3xl">✅</span>
                  <span>CORRECT! +{puzzle.points} POINTS!</span>
                </p>
                <p className="text-green-300 text-sm mt-2 font-mono tracking-wide">
                  {hasRevelation ? '> Analyzing evidence...' : '> Unlocking evidence...'}
                </p>
                <SinglePointFloat
                  value={puzzle.points}
                  show={showPoints}
                  type="points"
                  onComplete={() => setShowPoints(false)}
                />
              </div>
            </SuccessPulse>
          )}

          {/* REVELATION SECTION - The key story moment when solving reveals case info */}
          {showRevelation && puzzle.revelation && !revelationRead && (
            <div className="animate-fadeIn space-y-4">
              {/* Success banner */}
              <div className="bg-green-900/30 border-2 border-green-600/50 p-3">
                <p className="text-green-200 font-mono font-bold flex items-center gap-2 tracking-wide">
                  <span className="text-2xl">✅</span>
                  <span>PUZZLE SOLVED! +{puzzle.points} POINTS</span>
                </p>
              </div>

              {/* Revelation Card - What the student discovers */}
              {(() => {
                const style = getImportanceStyle(puzzle.revelation.importance);
                const icon = getRevelationIcon(puzzle.revelation.type);
                return (
                  <div className={`${style.bg} ${style.border} ${style.glow} border-2 p-6 animate-slideUp`}>
                    {/* Revelation Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-amber-300 font-mono font-bold tracking-wider text-lg">
                            CASE BREAKTHROUGH
                          </h4>
                          {puzzle.revelation.importance === 'major' && (
                            <span className="bg-yellow-600 text-black text-xs px-2 py-0.5 font-mono font-bold animate-pulse">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 font-mono text-xs tracking-wide uppercase">
                          {puzzle.revelation.type.replace('_', ' ')} discovered
                        </p>
                      </div>
                    </div>

                    {/* What was discovered */}
                    <div className="bg-black/40 p-4 border border-amber-600/30 mb-4">
                      <p className="text-amber-100 font-mono font-bold text-sm mb-2 tracking-wide">
                        {puzzle.revelation.description}
                      </p>
                    </div>

                    {/* Story narrative - The immersive reveal */}
                    <div className="bg-black/30 p-4 border-l-4 border-amber-500">
                      <p className="text-slate-200 font-mono leading-relaxed italic">
                        &quot;{puzzle.revelation.storyText}&quot;
                      </p>
                    </div>

                    {/* Related character if any */}
                    {puzzle.relatedCharacterName && (
                      <p className="text-amber-500/80 font-mono text-xs mt-3 tracking-wide">
                        &gt; This evidence relates to: {puzzle.relatedCharacterName}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Continue Button */}
              <button
                onClick={handleContinueAfterRevelation}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold py-4 tracking-wider transition-all text-lg"
              >
                CONTINUE INVESTIGATION →
              </button>
            </div>
          )}

          {/* Hint Section */}
          {showHint && isCorrect !== true && puzzle.hint && (
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
