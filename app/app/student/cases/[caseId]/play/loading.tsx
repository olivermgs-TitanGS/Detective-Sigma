'use client';

import DetectiveLoader from '@/components/ui/DetectiveLoader';
import { motion } from 'framer-motion';

/**
 * Loading state for case play/investigation page
 * Shows when transitioning into active investigation mode
 */
export default function CasePlayLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Noir vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, black 100%)',
        }}
      />

      {/* Crime scene tape animation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-0 right-0 h-8 bg-yellow-500 flex items-center justify-center transform -rotate-3 z-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #000 0, #000 10px, transparent 10px, transparent 20px)',
          backgroundSize: '40px 100%',
        }}
      >
        <span className="text-black font-bold tracking-[0.3em] text-sm">
          CRIME SCENE DO NOT CROSS
        </span>
      </motion.div>

      {/* Main loading content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-30 text-center"
      >
        {/* Investigation badge */}
        <div className="mb-8">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(245, 158, 11, 0.3)',
                '0 0 40px rgba(245, 158, 11, 0.5)',
                '0 0 20px rgba(245, 158, 11, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-slate-900 border-4 border-amber-600 p-1 rounded-full"
          >
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 w-24 h-24 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
          </motion.div>
        </div>

        {/* Loading indicator */}
        <div className="bg-black/80 border-2 border-amber-600/50 p-8 backdrop-blur-sm">
          <DetectiveLoader
            variant="magnifying"
            message="Entering investigation..."
          />

          {/* Progress hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 space-y-2"
          >
            <LoadingStep text="Preparing crime scene" delay={0} />
            <LoadingStep text="Loading evidence" delay={0.5} />
            <LoadingStep text="Briefing suspects" delay={1} />
          </motion.div>
        </div>

        {/* Case number flicker */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-amber-600/70 font-mono text-xs tracking-widest"
        >
          INITIALIZING INVESTIGATION PROTOCOL
        </motion.p>
      </motion.div>

      {/* Atmospheric elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

      {/* Floating dust particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 + delay }}
      className="flex items-center gap-2 text-slate-400 text-sm"
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-amber-500"
      >
        ⚙
      </motion.span>
      <span>{text}</span>
    </motion.div>
  );
}
