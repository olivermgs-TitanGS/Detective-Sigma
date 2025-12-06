'use client';

import DetectiveLoader from '@/components/ui/DetectiveLoader';
import { motion } from 'framer-motion';

/**
 * Loading state for case detail page
 * Displays when navigating from case library to individual case
 */
export default function CaseDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      {/* Noir vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, black 100%)',
        }}
      />

      {/* Case folder opening animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 text-center"
      >
        {/* Manila folder frame */}
        <div className="bg-gradient-to-b from-amber-200 to-amber-100 p-8 rounded-t-lg shadow-2xl border-4 border-amber-700/50 min-w-[320px]">
          {/* Folder tab */}
          <div className="absolute -top-6 left-8 bg-amber-300 px-6 py-2 rounded-t-lg border-t-4 border-x-4 border-amber-700/50">
            <span className="text-amber-900 font-mono text-sm tracking-wider">CASE FILE</span>
          </div>

          {/* Folder content area */}
          <div className="bg-amber-50 border-2 border-amber-600/30 p-6">
            <DetectiveLoader
              variant="files"
              message="Opening case file..."
            />
          </div>

          {/* Confidential stamp */}
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: -12, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-4 -right-4 bg-red-700/90 text-white px-4 py-1 font-mono text-xs tracking-widest transform"
          >
            CONFIDENTIAL
          </motion.div>
        </div>

        {/* Coffee stain decoration */}
        <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-amber-900/20 blur-sm" />
      </motion.div>

      {/* Background desk texture hint */}
      <div className="absolute inset-0 bg-[url('/textures/wood-grain.png')] opacity-5" />
    </div>
  );
}
