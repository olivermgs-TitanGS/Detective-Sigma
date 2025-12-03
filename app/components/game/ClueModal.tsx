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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border-2 border-purple-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-purple-800 p-6 border-b border-purple-500/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-purple-200 mb-1">✓ Clue Discovered</div>
              <h2 className="text-2xl font-bold text-white">{clue.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Clue Image Placeholder */}
          <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">📄</div>
              <p className="text-purple-300">{clue.name}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              🔍 Initial Observation
            </h3>
            <p className="text-purple-200">{clue.description}</p>
          </div>

          {/* Revealed Content */}
          {clue.contentRevealed && (
            <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                ✨ What You Learned
              </h3>
              <p className="text-green-100">{clue.contentRevealed}</p>
            </div>
          )}

          {/* Action Note */}
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
            <p className="text-purple-200 text-sm flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                This clue has been added to your Evidence Board. You can review it anytime during
                your investigation.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Continue Investigation →
          </button>
        </div>
      </div>
    </div>
  );
}
