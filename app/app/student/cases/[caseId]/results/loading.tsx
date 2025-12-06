'use client';

import DetectiveLoader from '@/components/ui/DetectiveLoader';
import { motion } from 'framer-motion';

/**
 * Loading state for case results page
 * Shows when calculating/displaying final results
 */
export default function CaseResultsLoading() {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Results dossier */}
        <div className="relative bg-amber-100 p-8 shadow-2xl min-w-[400px]">
          {/* Paper clip */}
          <div className="absolute -top-3 left-8 w-8 h-12 border-4 border-slate-400 rounded-full bg-transparent" />
          <div className="absolute -top-1 left-10 w-4 h-4 bg-slate-400 rounded-full" />

          {/* Dossier header */}
          <div className="bg-slate-900 text-amber-500 py-3 px-6 -mx-8 -mt-8 mb-6">
            <h2 className="font-mono tracking-wider text-lg">CASE RESULTS</h2>
          </div>

          {/* Main content */}
          <div className="bg-white border-2 border-slate-300 p-6">
            <DetectiveLoader
              variant="typing"
              message="Compiling investigation results..."
            />

            {/* Score calculation animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 space-y-3"
            >
              <ResultLine label="Evidence collected" />
              <ResultLine label="Suspects interviewed" />
              <ResultLine label="Puzzles solved" />
              <ResultLine label="Deductions made" />
            </motion.div>
          </div>

          {/* Stamp effect */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ delay: 1.5, type: 'spring', bounce: 0.5 }}
            className="absolute bottom-4 right-4"
          >
            <div className="border-4 border-amber-700 text-amber-700 px-4 py-2 font-mono text-lg tracking-widest transform">
              PROCESSING
            </div>
          </motion.div>

          {/* Coffee ring stain */}
          <div className="absolute bottom-8 left-4 w-12 h-12 rounded-full border-4 border-amber-900/20" />
        </div>
      </motion.div>
    </div>
  );
}

function ResultLine({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
