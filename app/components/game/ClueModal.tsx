'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

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
  const [showRevealed, setShowRevealed] = useState(false);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    playSound('clueFound');
    // Delay showing revealed content for dramatic effect
    if (clue.contentRevealed) {
      const timer = setTimeout(() => setShowRevealed(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [clue.contentRevealed, playSound]);

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black border-2 border-amber-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Header - Evidence Tag */}
          <motion.div
            className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 p-6 border-b-2 border-amber-800"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  className="text-sm text-black font-mono tracking-widest mb-1 font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ✓ EVIDENCE COLLECTED
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold text-black font-mono tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {clue.name}
                </motion.h2>
              </div>
              <motion.button
                onClick={handleClose}
                className="text-black hover:text-amber-950 text-3xl leading-none transition-colors font-bold"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Clue Image Placeholder */}
            <motion.div
              className="relative w-full aspect-video bg-black overflow-hidden border-2 border-amber-600/30 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-8xl mb-4 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                >
                  📄
                </motion.div>
                <motion.p
                  className="text-amber-400 font-mono tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {clue.name}
                </motion.p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="bg-black/50 p-4 border-2 border-amber-600/30"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-amber-400 font-mono font-bold mb-2 flex items-center gap-2 tracking-wider">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: 2, duration: 0.5 }}
                >
                  🔍
                </motion.span>
                INITIAL OBSERVATION
              </h3>
              <p className="text-slate-400 font-mono leading-relaxed">{clue.description}</p>
            </motion.div>

            {/* Revealed Content */}
            <AnimatePresence>
              {showRevealed && clue.contentRevealed && (
                <motion.div
                  className="bg-gradient-to-r from-green-900/30 to-amber-900/30 p-4 border-2 border-green-600/50"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h3 className="text-green-400 font-mono font-bold mb-2 flex items-center gap-2 tracking-wider">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1 }}
                    >
                      ✨
                    </motion.span>
                    ANALYSIS COMPLETE
                  </h3>
                  <p className="text-green-100 font-mono leading-relaxed">{clue.contentRevealed}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Note */}
            <motion.div
              className="bg-amber-900/20 p-4 border-2 border-amber-600/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-amber-400 text-sm flex items-start gap-2 font-mono leading-relaxed">
                <motion.span
                  className="text-lg"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  💡
                </motion.span>
                <span className="tracking-wide">
                  &gt; Evidence logged to your board. Access anytime during investigation.
                </span>
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="p-6 bg-black/50 border-t-2 border-amber-600/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleClose}
              className="w-full border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 font-mono font-bold py-3 transition-all tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              CONTINUE INVESTIGATION →
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
