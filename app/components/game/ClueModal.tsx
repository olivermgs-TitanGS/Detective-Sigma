'use client';

interface ClueModalProps {
  clue: {
    id: string;
    name: string;
    description: string;
    contentRevealed?: string;
  };
  onClose: () => void;
}

export default function ClueModal({ clue, onClose }: ClueModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-amber-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Evidence Tag */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 p-6 border-b-2 border-amber-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-black font-mono tracking-widest mb-1 font-bold">✓ EVIDENCE COLLECTED</div>
              <h2 className="text-2xl font-bold text-black font-mono tracking-wider">{clue.name}</h2>
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
          {/* Clue Image Placeholder */}
          <div className="relative w-full aspect-video bg-black overflow-hidden border-2 border-amber-600/30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">📄</div>
              <p className="text-amber-400 font-mono tracking-wider">{clue.name}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-black/50 p-4 border-2 border-amber-600/30">
            <h3 className="text-amber-400 font-mono font-bold mb-2 flex items-center gap-2 tracking-wider">
              🔍 INITIAL OBSERVATION
            </h3>
            <p className="text-slate-400 font-mono leading-relaxed">{clue.description}</p>
          </div>

          {/* Revealed Content */}
          {clue.contentRevealed && (
            <div className="bg-gradient-to-r from-green-900/30 to-amber-900/30 p-4 border-2 border-green-600/50">
              <h3 className="text-green-400 font-mono font-bold mb-2 flex items-center gap-2 tracking-wider">
                ✨ ANALYSIS COMPLETE
              </h3>
              <p className="text-green-100 font-mono leading-relaxed">{clue.contentRevealed}</p>
            </div>
          )}

          {/* Action Note */}
          <div className="bg-amber-900/20 p-4 border-2 border-amber-600/30">
            <p className="text-amber-400 text-sm flex items-start gap-2 font-mono leading-relaxed">
              <span className="text-lg">💡</span>
              <span className="tracking-wide">
                &gt; Evidence logged to your board. Access anytime during investigation.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/50 border-t-2 border-amber-600/30">
          <button
            onClick={onClose}
            className="w-full border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 font-mono font-bold py-3 transition-all tracking-wider"
          >
            CONTINUE INVESTIGATION →
          </button>
        </div>
      </div>
    </div>
  );
}
