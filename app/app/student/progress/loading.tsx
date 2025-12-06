'use client';

import { motion } from 'framer-motion';

export default function ProgressLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated chart */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))' }}
        >
          📊
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-lg mb-6"
        >
          ANALYZING PROGRESS...
        </motion.p>

        {/* Animated progress bars */}
        <div className="space-y-3 w-64 mx-auto">
          {[80, 60, 90].map((width, i) => (
            <div key={i} className="relative">
              <div className="h-3 bg-amber-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Circular progress indicator */}
        <div className="mt-8 flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
