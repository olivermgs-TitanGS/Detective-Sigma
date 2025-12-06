'use client';

import { motion } from 'framer-motion';

export default function CaseLibraryLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated case file */}
        <motion.div
          animate={{
            rotateY: [0, 10, 0, -10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))' }}
        >
          📁
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-lg mb-4"
        >
          ACCESSING CASE ARCHIVE...
        </motion.p>

        {/* Simulated file rows */}
        <div className="space-y-3 w-80 mx-auto">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="h-12 bg-amber-900/20 rounded border border-amber-600/30"
            >
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="h-full bg-gradient-to-r from-amber-600/10 to-transparent"
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
