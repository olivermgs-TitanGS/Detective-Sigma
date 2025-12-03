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
    <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-6 sticky top-24">
      <h3 className="text-xl font-bold text-amber-50 font-mono tracking-widest mb-4 flex items-center gap-2">
        📋 EVIDENCE BOARD
      </h3>

      {clues.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">🔍</div>
          <p className="text-slate-400 text-sm font-mono tracking-wider">NO EVIDENCE YET</p>
          <p className="text-slate-600 text-xs mt-1 font-mono tracking-wide">&gt; Collect clues from the scene</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clues.map((clue) => (
            <button
              key={clue.id}
              onClick={() => onClueClick(clue)}
              className="w-full text-left bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-4 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">📄</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-amber-50 font-mono font-bold text-sm group-hover:text-amber-400 transition-colors tracking-wide">
                    {clue.name}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2 font-mono leading-relaxed">
                    {clue.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Evidence Summary */}
      {clues.length > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-amber-600/30">
          <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-amber-400 tracking-wider">TOTAL EVIDENCE:</span>
            <span className="text-amber-50 font-bold text-lg">{clues.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
