'use client';

interface Clue {
  id: string;
  name: string;
  description: string;
  contentRevealed?: string;
}

interface EvidenceBoardProps {
  clues: Clue[];
  onClueClick: (clue: Clue) => void;
}

export default function EvidenceBoard({ clues, onClueClick }: EvidenceBoardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📋 Evidence Board
      </h3>

      {clues.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-purple-300 text-sm">No evidence collected yet.</p>
          <p className="text-purple-400 text-xs mt-1">Click on hotspots to find clues!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clues.map((clue) => (
            <button
              key={clue.id}
              onClick={() => onClueClick(clue)}
              className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-purple-500/20 hover:border-purple-500/50 rounded-lg p-4 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">📄</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">
                    {clue.name}
                  </h4>
                  <p className="text-purple-300 text-xs mt-1 line-clamp-2">
                    {clue.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Evidence Summary */}
      {clues.length > 0 && (
        <div className="mt-6 pt-4 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-200">Total Evidence:</span>
            <span className="text-white font-bold">{clues.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
