'use client';

interface Clue {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  description: string;
  requiredPuzzleId: string | null;
  isCollected?: boolean;
}

interface Scene {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  clues: Clue[];
}

interface SceneViewerProps {
  scene: Scene;
  collectedClues: string[];
  onClueClick: (clue: Clue) => void;
}

export default function SceneViewer({ scene, collectedClues, onClueClick }: SceneViewerProps) {
  return (
    <div className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-wider mb-1">{scene.name}</h2>
        <p className="text-slate-400 font-mono tracking-wide">&gt; {scene.description}</p>
      </div>

      {/* Scene Image with Hotspots - Investigation Area */}
      <div className="relative w-full aspect-video bg-black overflow-hidden border-2 border-amber-600/30">
        {/* Placeholder Scene Image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black">
          <div className="text-center">
            <div className="text-8xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">🏫</div>
            <p className="text-amber-400 text-lg font-mono tracking-wider font-bold">{scene.name}</p>
            <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">» Click glowing markers to collect evidence «</p>
          </div>
        </div>

        {/* Clue Hotspots - Evidence Markers */}
        {scene.clues.map((clue) => {
          const isCollected = collectedClues.includes(clue.id);
          const isLocked = clue.requiredPuzzleId !== null;

          return (
            <button
              key={clue.id}
              onClick={() => onClueClick(clue)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${clue.positionX}%`,
                top: `${clue.positionY}%`,
              }}
            >
              {/* Hotspot Icon */}
              <div
                className={`
                  relative w-14 h-14 flex items-center justify-center text-2xl
                  transition-all duration-300 cursor-pointer
                  ${
                    isCollected
                      ? 'bg-green-900/30 border-2 border-green-600 opacity-50'
                      : isLocked
                      ? 'bg-amber-900/30 border-2 border-amber-600 animate-pulse'
                      : 'bg-amber-900/30 border-2 border-amber-400 animate-pulse'
                  }
                  group-hover:scale-125 group-hover:rotate-12
                `}
              >
                {isCollected ? '✓' : isLocked ? '🔒' : '🔍'}

                {/* Pulsing Ring Effect */}
                {!isCollected && (
                  <div
                    className={`
                      absolute inset-0 animate-ping
                      ${isLocked ? 'bg-amber-600' : 'bg-amber-400'}
                    `}
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="bg-black border-2 border-amber-600 px-3 py-2 text-sm backdrop-blur-sm">
                  <p className="text-amber-50 font-mono font-bold tracking-wider">{clue.name}</p>
                  {isLocked && (
                    <p className="text-amber-400 text-xs mt-1 font-mono">🔒 PUZZLE REQUIRED</p>
                  )}
                  {isCollected && (
                    <p className="text-green-400 text-xs mt-1 font-mono">✓ COLLECTED</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scene Navigation */}
      <div className="mt-4 flex items-center justify-between font-mono">
        <button className="text-slate-600 hover:text-amber-400 transition-colors opacity-50 cursor-not-allowed tracking-wider">
          ← PREVIOUS
        </button>
        <span className="text-slate-500 text-sm tracking-widest">SCENE 1 OF 3</span>
        <button className="text-amber-400 hover:text-amber-300 transition-colors tracking-wider">
          NEXT →
        </button>
      </div>
    </div>
  );
}
