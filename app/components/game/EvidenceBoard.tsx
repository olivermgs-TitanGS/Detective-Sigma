'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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
  const { playSound } = useSoundEffects();

  const handleClueClick = (clue: Clue) => {
    playSound('paperRustle');
    onClueClick(clue);
  };

  return (
    <motion.div
      className="border-2 border-amber-600/50 bg-black/80 backdrop-blur-sm p-6 sticky top-24 overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cork board texture overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.3) 2px, rgba(139,90,43,0.3) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.3) 2px, rgba(139,90,43,0.3) 4px)
          `,
        }}
      />

      <motion.h3
        className="text-xl font-bold text-amber-50 font-mono tracking-widest mb-4 flex items-center gap-2 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-2xl">📋</span> EVIDENCE BOARD
      </motion.h3>

      {clues.length === 0 ? (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="text-5xl mb-3 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            🔍
          </motion.div>
          <p className="text-slate-400 text-sm font-mono tracking-wider">NO EVIDENCE YET</p>
          <p className="text-slate-600 text-xs mt-1 font-mono tracking-wide">&gt; Collect clues from the scene</p>
        </motion.div>
      ) : (
        <div className="space-y-3 relative">
          <AnimatePresence mode="popLayout">
            {clues.map((clue, index) => (
              <motion.button
                key={clue.id}
                onClick={() => handleClueClick(clue)}
                className="w-full text-left bg-black/60 hover:bg-black border-2 border-amber-600/30 hover:border-amber-600 p-4 transition-colors group relative"
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.1,
                }}
                whileHover={{
                  scale: 1.02,
                  x: 5,
                  transition: { type: 'spring', stiffness: 400 },
                }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {/* Push pin */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 shadow-lg z-10"
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.2 }}
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)',
                  }}
                />

                <div className="flex items-start gap-3">
                  <motion.div
                    className="flex-shrink-0 text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    📄
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-amber-50 font-mono font-bold text-sm group-hover:text-amber-400 transition-colors tracking-wide">
                      {clue.name}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2 font-mono leading-relaxed">
                      {clue.description}
                    </p>
                  </div>
                  <motion.div
                    className="flex-shrink-0 text-amber-400 font-mono"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Evidence Summary */}
      <AnimatePresence>
        {clues.length > 0 && (
          <motion.div
            className="mt-6 pt-4 border-t-2 border-amber-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-amber-400 tracking-wider">TOTAL EVIDENCE:</span>
              <motion.span
                className="text-amber-50 font-bold text-lg"
                key={clues.length}
                initial={{ scale: 1.5, color: '#22c55e' }}
                animate={{ scale: 1, color: '#fffbeb' }}
                transition={{ duration: 0.3 }}
              >
                {clues.length}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
