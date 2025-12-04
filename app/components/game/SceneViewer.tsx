'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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
  currentSceneIndex: number;
  totalScenes: number;
  onNextScene: () => void;
  onPreviousScene: () => void;
}

export default function SceneViewer({
  scene,
  collectedClues,
  onClueClick,
  currentSceneIndex,
  totalScenes,
  onNextScene,
  onPreviousScene
}: SceneViewerProps) {
  const { playSound } = useSoundEffects();

  const handleClueClick = (clue: Clue) => {
    playSound('click');
    onClueClick(clue);
  };

  const handleNextScene = () => {
    playSound('whoosh');
    onNextScene();
  };

  const handlePreviousScene = () => {
    playSound('whoosh');
    onPreviousScene();
  };

  return (
    <motion.div
      className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-wider mb-1">{scene.name}</h2>
        <p className="text-slate-400 font-mono tracking-wide">&gt; {scene.description}</p>
      </motion.div>

      {/* Scene Image with Hotspots - Investigation Area */}
      <motion.div
        className="relative w-full aspect-video bg-black overflow-hidden border-2 border-amber-600/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Placeholder Scene Image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black">
          <div className="text-center">
            <motion.div
              className="text-8xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🏫
            </motion.div>
            <p className="text-amber-400 text-lg font-mono tracking-wider font-bold">{scene.name}</p>
            <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">» Click glowing markers to collect evidence «</p>
          </div>
        </div>

        {/* Clue Hotspots - Evidence Markers */}
        <AnimatePresence>
          {scene.clues.map((clue, index) => {
            const isCollected = collectedClues.includes(clue.id);
            const isLocked = clue.requiredPuzzleId !== null && !collectedClues.includes(clue.id);

            return (
              <motion.button
                key={clue.id}
                onClick={() => handleClueClick(clue)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${clue.positionX}%`,
                  top: `${clue.positionY}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1 + 0.5,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Hotspot Icon */}
                <motion.div
                  className={`
                    relative w-14 h-14 flex items-center justify-center text-2xl
                    transition-colors duration-300 cursor-pointer
                    ${
                      isCollected
                        ? 'bg-green-900/30 border-2 border-green-600'
                        : isLocked
                        ? 'bg-amber-900/30 border-2 border-amber-600'
                        : 'bg-amber-900/30 border-2 border-amber-400'
                    }
                  `}
                  animate={!isCollected ? {
                    boxShadow: [
                      '0 0 0 0 rgba(245, 158, 11, 0.4)',
                      '0 0 0 15px rgba(245, 158, 11, 0)',
                    ],
                  } : {}}
                  transition={!isCollected ? {
                    repeat: Infinity,
                    duration: 1.5,
                  } : {}}
                  whileHover={{ rotate: 12 }}
                >
                  <motion.span
                    animate={isCollected ? {} : { scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {isCollected ? '✓' : isLocked ? '🔒' : '🔍'}
                  </motion.span>

                  {/* Pulsing Ring Effect */}
                  {!isCollected && (
                    <motion.div
                      className={`
                        absolute inset-0
                        ${isLocked ? 'bg-amber-600' : 'bg-amber-400'}
                      `}
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>

                {/* Tooltip */}
                <motion.div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none whitespace-nowrap z-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-black border-2 border-amber-600 px-3 py-2 text-sm backdrop-blur-sm">
                    <p className="text-amber-50 font-mono font-bold tracking-wider">{clue.name}</p>
                    {isLocked && (
                      <p className="text-amber-400 text-xs mt-1 font-mono">🔒 PUZZLE REQUIRED</p>
                    )}
                    {isCollected && (
                      <p className="text-green-400 text-xs mt-1 font-mono">✓ COLLECTED</p>
                    )}
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(245, 158, 11, 0.02) 50%)',
            backgroundSize: '100% 4px',
          }}
        />
      </motion.div>

      {/* Scene Navigation */}
      <motion.div
        className="mt-4 flex items-center justify-between font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handlePreviousScene}
          disabled={currentSceneIndex === 0}
          className={`tracking-wider transition-colors ${
            currentSceneIndex === 0
              ? 'text-slate-600 opacity-50 cursor-not-allowed'
              : 'text-amber-400 hover:text-amber-300'
          }`}
          whileHover={currentSceneIndex > 0 ? { x: -5 } : {}}
          whileTap={currentSceneIndex > 0 ? { scale: 0.95 } : {}}
        >
          ← PREVIOUS
        </motion.button>
        <motion.span
          className="text-slate-500 text-sm tracking-widest"
          key={currentSceneIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SCENE {currentSceneIndex + 1} OF {totalScenes}
        </motion.span>
        <motion.button
          onClick={handleNextScene}
          disabled={currentSceneIndex === totalScenes - 1}
          className={`tracking-wider transition-colors ${
            currentSceneIndex === totalScenes - 1
              ? 'text-slate-600 opacity-50 cursor-not-allowed'
              : 'text-amber-400 hover:text-amber-300'
          }`}
          whileHover={currentSceneIndex < totalScenes - 1 ? { x: 5 } : {}}
          whileTap={currentSceneIndex < totalScenes - 1 ? { scale: 0.95 } : {}}
        >
          NEXT →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
