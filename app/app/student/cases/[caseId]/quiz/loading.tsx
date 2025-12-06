'use client';

import DetectiveLoader from '@/components/ui/DetectiveLoader';
import { motion } from 'framer-motion';

/**
 * Loading state for case quiz page
 * Shows when transitioning to puzzle/quiz section
 */
export default function CaseQuizLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      {/* Noir vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, black 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center"
      >
        {/* Puzzle/Analysis frame */}
        <div className="bg-slate-900 border-4 border-amber-600 p-8 min-w-[360px] shadow-2xl">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6 border-b border-amber-600/30 pb-4">
            <span className="text-amber-500 font-mono text-sm tracking-wider">ANALYSIS MODE</span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-500 text-xs font-mono">ACTIVE</span>
            </motion.div>
          </div>

          {/* Main loader */}
          <DetectiveLoader
            variant="analysis"
            message="Preparing evidence analysis..."
          />

          {/* Data streams */}
          <div className="mt-6 space-y-2">
            {['Clue data', 'Suspect profiles', 'Timeline'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.3, duration: 0.8 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 h-1 bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ delay: i * 0.3 + 0.2, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-mono w-24 text-right">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-amber-500" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-amber-500" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-amber-500" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-amber-500" />
      </motion.div>
    </div>
  );
}
