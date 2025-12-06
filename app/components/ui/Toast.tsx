'use client';

import { toast as sonnerToast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

/**
 * Detective-themed Toast provider component - add to root layout
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
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(217, 119, 6, 0.5)',
          color: '#fef3c7',
          fontFamily: 'ui-monospace, monospace',
          boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)',
          borderRadius: '0',
        },
        className: 'detective-toast',
      }}
    />
  );
}

/**
 * Detective-themed toast functions
 * Styled like case file notes and detective radio communications
 */
export const toast = {
  // Standard notifications with detective flair
  success: (message: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-start gap-3 px-4 py-3 bg-slate-900/95 border-2 border-green-600/50"
        style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
      >
        <div className="text-2xl">✅</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 font-bold font-mono text-xs tracking-wider">
              CONFIRMED
            </span>
          </div>
          <p className="text-green-200 font-mono text-sm">{message}</p>
          {description && (
            <p className="text-green-300/70 text-xs font-mono mt-1">&gt; {description}</p>
          )}
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  error: (message: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-start gap-3 px-4 py-3 bg-slate-900/95 border-2 border-red-600/50"
        style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
      >
        <div className="text-2xl">🚫</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 font-bold font-mono text-xs tracking-wider">
              ERROR
            </span>
          </div>
          <p className="text-red-200 font-mono text-sm">{message}</p>
          {description && (
            <p className="text-red-300/70 text-xs font-mono mt-1">&gt; {description}</p>
          )}
        </div>
      </motion.div>
    ), { duration: 5000 });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-start gap-3 px-4 py-3 bg-slate-900/95 border-2 border-amber-600/50"
        style={{ boxShadow: '0 0 15px rgba(217, 119, 6, 0.2)' }}
      >
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-bold font-mono text-xs tracking-wider">
              CAUTION
            </span>
          </div>
          <p className="text-amber-200 font-mono text-sm">{message}</p>
          {description && (
            <p className="text-amber-300/70 text-xs font-mono mt-1">&gt; {description}</p>
          )}
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  info: (message: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-start gap-3 px-4 py-3 bg-slate-900/95 border-2 border-blue-600/50"
        style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}
      >
        <div className="text-2xl">📋</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-bold font-mono text-xs tracking-wider">
              INTEL
            </span>
          </div>
          <p className="text-blue-200 font-mono text-sm">{message}</p>
          {description && (
            <p className="text-blue-300/70 text-xs font-mono mt-1">&gt; {description}</p>
          )}
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  // === DETECTIVE-THEMED GAME TOASTS ===

  // Evidence points earned - evidence tag styling
  points: (points: number, reason?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-900/90 to-amber-800/90 border-2 border-amber-500/50">
          {/* Evidence tag hole */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-slate-900 rounded-full border border-amber-600/50" />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.4 }}
            className="text-2xl ml-3"
          >
            🏷️
          </motion.div>
          <div>
            <span className="text-amber-200 font-bold font-mono text-lg">
              +{points} POINTS
            </span>
            {reason && (
              <p className="text-amber-300/80 text-xs font-mono">&gt; {reason}</p>
            )}
          </div>
        </div>
      </motion.div>
    ), { duration: 3000 });
  },

  // XP gained - detective rank style
  xp: (amount: number, reason?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-2 border-purple-500/50"
        style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 1 }}
          className="text-2xl"
        >
          ⭐
        </motion.div>
        <div>
          <span className="text-purple-200 font-bold font-mono text-lg">
            +{amount} XP
          </span>
          {reason && (
            <p className="text-purple-300/80 text-xs font-mono">&gt; {reason}</p>
          )}
        </div>
      </motion.div>
    ), { duration: 3000 });
  },

  // Clue/Evidence found - evidence log style
  clueFound: (clueName: string, importance?: 'minor' | 'moderate' | 'major') => {
    const importanceStyles = {
      minor: { border: 'border-green-600/50', glow: 'rgba(34, 197, 94, 0.2)', badge: 'bg-green-700' },
      moderate: { border: 'border-blue-600/50', glow: 'rgba(59, 130, 246, 0.2)', badge: 'bg-blue-700' },
      major: { border: 'border-amber-500/50', glow: 'rgba(245, 158, 11, 0.3)', badge: 'bg-amber-600' },
    };
    const style = importanceStyles[importance || 'minor'];

    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`flex items-start gap-3 px-4 py-3 bg-slate-900/95 border-2 ${style.border}`}
        style={{ boxShadow: `0 0 20px ${style.glow}` }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          🔍
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-bold font-mono text-xs tracking-wider">
              EVIDENCE LOGGED
            </span>
            {importance === 'major' && (
              <span className={`${style.badge} text-white text-xs px-2 py-0.5 font-mono font-bold animate-pulse`}>
                CRITICAL
              </span>
            )}
          </div>
          <p className="text-amber-100 font-mono text-sm">{clueName}</p>
          <p className="text-slate-400 text-xs font-mono mt-1">&gt; Added to evidence board</p>
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  // Achievement unlocked - detective badge style
  achievement: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-br from-amber-800/95 via-amber-700/95 to-yellow-600/95 border-2 border-amber-400/70"
          style={{
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(0,0,0,0.3)',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)'
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="text-4xl"
          >
            🎖️
          </motion.div>
          <div>
            <span className="text-amber-100 font-bold font-mono text-xs tracking-wider block mb-1">
              BADGE EARNED
            </span>
            <span className="text-white font-mono font-bold text-lg">{title}</span>
            {description && (
              <p className="text-amber-200/80 text-sm font-mono mt-1">{description}</p>
            )}
          </div>
        </div>
      </motion.div>
    ), { duration: 6000 });
  },

  // Level up - rank promotion style
  levelUp: (newLevel: number, rankTitle: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative overflow-hidden"
      >
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900 bg-[length:200%_100%]"
        />
        <div className="relative flex items-center gap-4 px-5 py-4 border-2 border-purple-400/50">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-amber-300"
          >
            <span className="text-2xl font-bold text-slate-900 font-mono">{newLevel}</span>
          </motion.div>
          <div>
            <span className="text-purple-200 font-bold font-mono text-xs tracking-wider block">
              RANK PROMOTION
            </span>
            <span className="text-white font-mono font-bold text-lg">{rankTitle}</span>
            <p className="text-purple-300/80 text-xs font-mono mt-1">
              &gt; New clearance level unlocked
            </p>
          </div>
        </div>
      </motion.div>
    ), { duration: 6000 });
  },

  // Streak notification - investigation momentum
  streak: (streakCount: number) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0.5, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400 }}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-900/95 to-red-900/95 border-2 border-orange-500/50"
        style={{ boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)' }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -3, 0] }}
          transition={{ duration: 0.4, repeat: 3 }}
          className="text-3xl"
        >
          🔥
        </motion.div>
        <div>
          <span className="text-orange-200 font-bold font-mono text-lg">
            {streakCount} DAY STREAK
          </span>
          <p className="text-orange-300/80 text-xs font-mono">
            &gt; Investigation momentum maintained
          </p>
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  // Case complete - case file styling
  caseComplete: (caseName: string, stars: number) => {
    const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    sonnerToast.custom((id) => (
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-600/50 p-4"
          style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.3)' }}
        >
          {/* Paper clip effect */}
          <div className="absolute -top-1 left-4 w-6 h-8 bg-slate-400"
            style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
          <div className="flex items-center gap-4 pt-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl"
            >
              📁
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-700 text-white text-xs px-2 py-1 font-mono font-bold">
                  CASE CLOSED
                </span>
              </div>
              <span className="text-green-100 font-mono font-bold block">{caseName}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-400 text-lg">{starDisplay}</span>
                <span className="text-slate-400 text-xs font-mono">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ), { duration: 6000 });
  },

  // Radio dispatch message style
  dispatch: (message: string, priority?: 'routine' | 'urgent' | 'critical') => {
    const priorityStyles = {
      routine: { bg: 'from-slate-800 to-slate-900', border: 'border-slate-600', text: 'text-slate-300' },
      urgent: { bg: 'from-amber-900 to-orange-900', border: 'border-amber-500', text: 'text-amber-200' },
      critical: { bg: 'from-red-900 to-red-950', border: 'border-red-500', text: 'text-red-200' },
    };
    const style = priorityStyles[priority || 'routine'];

    sonnerToast.custom((id) => (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`flex items-start gap-3 px-4 py-3 bg-gradient-to-r ${style.bg} border-l-4 ${style.border}`}
      >
        <motion.div
          animate={priority === 'critical' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-xl"
        >
          📻
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${style.text} font-bold font-mono text-xs tracking-wider`}>
              DISPATCH
            </span>
            {priority === 'critical' && (
              <span className="bg-red-600 text-white text-xs px-1 font-mono animate-pulse">
                PRIORITY
              </span>
            )}
          </div>
          <p className={`${style.text} font-mono text-sm italic`}>"{message}"</p>
        </div>
      </motion.div>
    ), { duration: priority === 'critical' ? 6000 : 4000 });
  },

  // Suspect identified notification
  suspectIdentified: (suspectName: string) => {
    sonnerToast.custom((id) => (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 border-2 border-red-500/50"
        style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-2xl"
        >
          🎯
        </motion.div>
        <div>
          <span className="text-red-400 font-bold font-mono text-xs tracking-wider block">
            SUSPECT IDENTIFIED
          </span>
          <p className="text-red-100 font-mono text-sm">{suspectName}</p>
          <p className="text-slate-400 text-xs font-mono">&gt; Added to persons of interest</p>
        </div>
      </motion.div>
    ), { duration: 4000 });
  },

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return sonnerToast.promise(promise, {
      loading: `🔍 ${messages.loading}`,
      success: `✅ ${messages.success}`,
      error: `🚫 ${messages.error}`,
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
