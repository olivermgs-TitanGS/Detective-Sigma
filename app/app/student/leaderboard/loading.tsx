'use client';

import { motion } from 'framer-motion';

export default function LeaderboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated trophy */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{ filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))' }}
        >
          🏆
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-lg mb-4"
        >
          LOADING RANKINGS...
        </motion.p>

        {/* Podium skeleton */}
        <div className="flex justify-center items-end gap-4 mt-8">
          {/* 2nd place */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 bg-slate-700/50 rounded-t border-t-4 border-slate-400"
          />
          {/* 1st place */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-16 bg-amber-900/50 rounded-t border-t-4 border-amber-500"
          />
          {/* 3rd place */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 32 }}
            transition={{ duration: 0.5 }}
            className="w-16 bg-orange-900/50 rounded-t border-t-4 border-orange-600"
          />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-amber-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
