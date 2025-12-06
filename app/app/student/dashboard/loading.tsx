'use client';

import { motion } from 'framer-motion';

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated badge */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))' }}
        >
          🎖️
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-lg mb-4"
        >
          LOADING HEADQUARTERS...
        </motion.p>

        {/* Progress bar */}
        <div className="relative w-64 h-2 mx-auto bg-amber-900/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          />
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-amber-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
