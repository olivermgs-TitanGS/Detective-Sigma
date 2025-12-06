'use client';

import { motion } from 'framer-motion';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-amber-950/20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        {/* Animated magnifying glass */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-9xl mb-6"
        >
          <motion.span
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
                'drop-shadow(0 0 40px rgba(255, 215, 0, 0.8))',
                'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            🔎
          </motion.span>
        </motion.div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400 font-mono tracking-[0.3em] text-xl mb-4"
        >
          ACCESSING SECURE PORTAL...
        </motion.p>

        {/* Progress line */}
        <div className="relative w-64 h-1 mx-auto bg-amber-900/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          />
        </div>

        {/* Scan lines effect */}
        <motion.div
          animate={{ opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 215, 0, 0.03) 2px, rgba(255, 215, 0, 0.03) 4px)',
          }}
        />
      </motion.div>
    </div>
  );
}
