'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';
import { PoliceTape, EvidenceMarker } from './CrimeSceneOverlays';

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
  // New: scene type for appropriate overlays
  sceneType?: 'crime' | 'investigation' | 'neutral';
}

interface SceneViewerProps {
  scene: Scene;
  collectedClues: string[];
  onClueClick: (clue: Clue) => void;
  currentSceneIndex: number;
  totalScenes: number;
  onNextScene: () => void;
  onPreviousScene: () => void;
  caseNumber?: string;
}

export default function SceneViewer({
  scene,
  collectedClues,
  onClueClick,
  currentSceneIndex,
  totalScenes,
  onNextScene,
  onPreviousScene,
  caseNumber = 'DS-2024-001'
}: SceneViewerProps) {
  const { playSound } = useSoundEffects();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClueClick = (clue: Clue) => {
    playSound('click');
    onClueClick(clue);
  };

  const handleNextScene = () => {
    playSound('sceneTransition');
    setImageLoaded(false);
    onNextScene();
  };

  const handlePreviousScene = () => {
    playSound('sceneTransition');
    setImageLoaded(false);
    onPreviousScene();
  };

  const handleButtonHover = () => {
    playSound('hoverSubtle');
  };

  const handleClueHover = () => {
    playSound('hoverSubtle');
  };

  // Determine if this scene should show crime scene tape
  const isCrimeScene = scene.sceneType === 'crime' ||
    scene.name.toLowerCase().includes('crime') ||
    scene.description.toLowerCase().includes('crime') ||
    scene.description.toLowerCase().includes('murder') ||
    scene.description.toLowerCase().includes('blood');

  // Check if scene has a valid image URL
  const hasImage = scene.imageUrl && scene.imageUrl.length > 0 && !imageError;

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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-50 font-mono tracking-wider mb-1">{scene.name}</h2>
          {isCrimeScene && (
            <motion.span
              className="text-xs font-mono text-red-400 border border-red-600 px-2 py-1 bg-red-900/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ⚠ ACTIVE CRIME SCENE
            </motion.span>
          )}
        </div>
        <p className="text-slate-400 font-mono tracking-wide">&gt; {scene.description}</p>
      </motion.div>

      {/* Scene Image with Hotspots - Investigation Area */}
      <motion.div
        className="relative w-full aspect-video bg-black overflow-hidden border-2 border-amber-600/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* AI-Generated Scene Image */}
        {hasImage ? (
          <>
            <img
              src={scene.imageUrl}
              alt={scene.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black">
                <motion.div
                  className="text-amber-400 font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  LOADING SCENE...
                </motion.div>
              </div>
            )}
          </>
        ) : (
          /* Placeholder when no image */
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black">
            <div className="text-center">
              <motion.div
                className="text-8xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {isCrimeScene ? '🚨' : '🏫'}
              </motion.div>
              <p className="text-amber-400 text-lg font-mono tracking-wider font-bold">{scene.name}</p>
              <p className="text-slate-500 text-sm mt-2 font-mono tracking-wide">» Click glowing markers to collect evidence «</p>
            </div>
          </div>
        )}

        {/* Police Tape Overlays - Only on crime scenes with loaded images */}
        {isCrimeScene && (hasImage && imageLoaded) && (
          <>
            <PoliceTape
              text="CRIME SCENE DO NOT CROSS"
              position="top"
              color="yellow"
            />
            <PoliceTape
              text="POLICE LINE DO NOT CROSS"
              position="bottom"
              color="yellow"
            />
          </>
        )}

        {/* Case Number Overlay */}
        {(hasImage && imageLoaded) && (
          <motion.div
            className="absolute top-2 left-2 bg-black/80 border border-amber-600 px-2 py-1 z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs font-mono text-amber-400">CASE: {caseNumber}</span>
          </motion.div>
        )}

        {/* Evidence Markers - Using new component when image is loaded */}
        <AnimatePresence>
          {scene.clues.map((clue, index) => {
            const isCollected = collectedClues.includes(clue.id);
            const isLocked = clue.requiredPuzzleId !== null && !collectedClues.includes(clue.id);

            // Use new EvidenceMarker component when image is loaded
            if (hasImage && imageLoaded) {
              return (
                <EvidenceMarker
                  key={clue.id}
                  number={index + 1}
                  x={clue.positionX}
                  y={clue.positionY}
                  size="md"
                  onClick={() => handleClueClick(clue)}
                  onHover={handleClueHover}
                  discovered={isCollected}
                />
              );
            }

            // Fallback to original hotspot style for placeholder
            return (
              <motion.button
                key={clue.id}
                onClick={() => handleClueClick(clue)}
                onMouseEnter={handleClueHover}
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
          onMouseEnter={currentSceneIndex > 0 ? handleButtonHover : undefined}
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
          onMouseEnter={currentSceneIndex < totalScenes - 1 ? handleButtonHover : undefined}
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
