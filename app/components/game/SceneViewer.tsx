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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">{scene.name}</h2>
        <p className="text-purple-200">{scene.description}</p>
      </div>

      {/* Scene Image with Hotspots */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/30">
        {/* Placeholder Scene Image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-center">
            <div className="text-8xl mb-4">🏫</div>
            <p className="text-purple-300 text-lg font-semibold">{scene.name}</p>
            <p className="text-purple-400 text-sm mt-2">Click the glowing hotspots to discover clues!</p>
          </div>
        </div>

        {/* Clue Hotspots */}
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
                  relative w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  transition-all duration-300 cursor-pointer
                  ${
                    isCollected
                      ? 'bg-green-500/30 border-2 border-green-400 opacity-50'
                      : isLocked
                      ? 'bg-yellow-500/30 border-2 border-yellow-400 animate-pulse'
                      : 'bg-purple-500/30 border-2 border-purple-400 animate-pulse'
                  }
                  group-hover:scale-125 group-hover:rotate-12
                `}
              >
                {isCollected ? '✓' : isLocked ? '🔒' : '🔍'}

                {/* Pulsing Ring Effect */}
                {!isCollected && (
                  <div
                    className={`
                      absolute inset-0 rounded-full animate-ping
                      ${isLocked ? 'bg-yellow-400' : 'bg-purple-400'}
                    `}
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="bg-slate-900 border border-purple-500/30 rounded-lg px-3 py-2 text-sm">
                  <p className="text-white font-semibold">{clue.name}</p>
                  {isLocked && (
                    <p className="text-yellow-400 text-xs mt-1">🔒 Solve puzzle to unlock</p>
                  )}
                  {isCollected && (
                    <p className="text-green-400 text-xs mt-1">✓ Collected</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scene Navigation (if multiple scenes) */}
      <div className="mt-4 flex items-center justify-between">
        <button className="text-purple-300 hover:text-white transition-colors opacity-50 cursor-not-allowed">
          ← Previous Scene
        </button>
        <span className="text-purple-200 text-sm">Scene 1 of 3</span>
        <button className="text-purple-300 hover:text-white transition-colors">
          Next Scene →
        </button>
      </div>
    </div>
  );
}
