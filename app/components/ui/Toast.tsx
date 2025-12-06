'use client';

import { toast as sonnerToast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

/**
 * Toast provider component - add to root layout
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          color: '#e2e8f0',
          fontFamily: 'ui-monospace, monospace',
        },
        className: 'detective-toast',
      }}
    />
  );
}

/**
 * Custom toast functions with Detective Sigma styling
 */
export const toast = {
  // Standard toasts
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: '✓',
      style: {
        borderLeft: '4px solid #22c55e',
      },
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: '✕',
      style: {
        borderLeft: '4px solid #ef4444',
      },
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: '⚠',
      style: {
        borderLeft: '4px solid #f59e0b',
      },
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: 'ℹ',
      style: {
        borderLeft: '4px solid #3b82f6',
      },
    });
  },

  // Game-specific toasts
  points: (points: number, reason?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-slate-800/95 border border-amber-500/30 rounded-lg"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          ⭐
        </motion.span>
        <div>
          <span className="text-amber-400 font-bold font-mono text-lg">
            +{points} Points
          </span>
          {reason && (
            <p className="text-slate-400 text-sm font-mono">{reason}</p>
          )}
        </div>
      </motion.div>
    ), {
      duration: 3000,
    });
  },

  xp: (amount: number, reason?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-slate-800/95 border border-purple-500/30 rounded-lg"
      >
        <span className="text-2xl">🏆</span>
        <div>
          <span className="text-purple-400 font-bold font-mono text-lg">
            +{amount} XP
          </span>
          {reason && (
            <p className="text-slate-400 text-sm font-mono">{reason}</p>
          )}
        </div>
      </motion.div>
    ), {
      duration: 3000,
    });
  },

  achievement: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-amber-900/90 to-amber-800/90 border border-amber-500/50 rounded-lg shadow-lg shadow-amber-500/20"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-3xl"
        >
          🏅
        </motion.div>
        <div>
          <span className="text-amber-300 font-bold font-mono text-lg block">
            Achievement Unlocked!
          </span>
          <span className="text-amber-100 font-mono">{title}</span>
          {description && (
            <p className="text-amber-200/70 text-sm font-mono mt-1">{description}</p>
          )}
        </div>
      </motion.div>
    ), {
      duration: 5000,
    });
  },

  levelUp: (newLevel: number, rankTitle: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-purple-900/90 to-indigo-800/90 border border-purple-500/50 rounded-lg shadow-lg shadow-purple-500/20"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"
        >
          <span className="text-2xl font-bold text-slate-900 font-mono">{newLevel}</span>
        </motion.div>
        <div>
          <span className="text-purple-300 font-bold font-mono text-lg block">
            LEVEL UP!
          </span>
          <span className="text-purple-100 font-mono">You are now a {rankTitle}</span>
        </div>
      </motion.div>
    ), {
      duration: 6000,
    });
  },

  clueFound: (clueName: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-slate-800/95 border border-green-500/30 rounded-lg"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          🔍
        </motion.span>
        <div>
          <span className="text-green-400 font-bold font-mono">Clue Found!</span>
          <p className="text-slate-300 text-sm font-mono">{clueName}</p>
        </div>
      </motion.div>
    ), {
      duration: 3000,
    });
  },

  streak: (streakCount: number) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.5, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400 }}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-900/90 to-red-800/90 border border-orange-500/50 rounded-lg"
      >
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.3, repeat: 3 }}
          className="text-2xl"
        >
          🔥
        </motion.span>
        <div>
          <span className="text-orange-300 font-bold font-mono text-lg">
            {streakCount} Day Streak!
          </span>
          <p className="text-orange-200/70 text-sm font-mono">Keep it up, Detective!</p>
        </div>
      </motion.div>
    ), {
      duration: 4000,
    });
  },

  caseComplete: (caseName: string, stars: number) => {
    const starEmojis = '⭐'.repeat(stars);
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-emerald-900/90 to-green-800/90 border border-emerald-500/50 rounded-lg shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl"
        >
          🎉
        </motion.div>
        <div>
          <span className="text-emerald-300 font-bold font-mono text-lg block">
            Case Solved!
          </span>
          <span className="text-emerald-100 font-mono">{caseName}</span>
          <p className="text-amber-400 font-mono mt-1">{starEmojis}</p>
        </div>
      </motion.div>
    ), {
      duration: 5000,
    });
  },

  // Loading toast with promise
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  // Dismiss toast
  dismiss: (id?: string | number) => {
    if (id) {
      sonnerToast.dismiss(id);
    } else {
      sonnerToast.dismiss();
    }
  },
};

export default toast;
