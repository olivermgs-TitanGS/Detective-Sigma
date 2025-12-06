'use client';

import { motion } from 'framer-motion';

export default function AdminDashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated chief badge */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{ filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))' }}
        >
          👑
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-lg mb-4"
        >
          LOADING COMMAND CENTER...
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

        {/* Security clearance animation */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-green-500 font-mono text-xs tracking-widest"
        >
          🔓 CLEARANCE: ALPHA
        </motion.div>
      </motion.div>
    </div>
  );
}
