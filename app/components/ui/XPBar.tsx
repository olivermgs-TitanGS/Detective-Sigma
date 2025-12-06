'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface XPBarProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  showLevelUp?: boolean;
  onLevelUpComplete?: () => void;
  className?: string;
}

/**
 * Experience bar with level indicators
 * Glow effect on level up with animated fill
 */
export function XPBar({
  currentXP,
  xpToNextLevel,
  level,
  showLevelUp = false,
  onLevelUpComplete,
  className = ''
}: XPBarProps) {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);

  useEffect(() => {
    if (showLevelUp) {
      setIsLevelingUp(true);
      const timer = setTimeout(() => {
        setIsLevelingUp(false);
        onLevelUpComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, onLevelUpComplete]);

  return (
    <div className={`relative ${className}`}>
      {/* Level badges */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              font-bold text-lg font-mono
              ${isLevelingUp
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900'
                : 'bg-slate-700 text-amber-400 border-2 border-amber-500/50'
              }
            `}
            animate={isLevelingUp ? {
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {level}
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-mono">LEVEL</span>
            <span className="text-sm text-slate-300 font-mono">
              {getRankTitle(level)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-amber-400 font-mono text-sm">
            {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
        {/* Background glow on level up */}
        <AnimatePresence>
          {isLevelingUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-amber-500/50 via-yellow-400/50 to-amber-500/50"
            />
          )}
        </AnimatePresence>

        {/* Progress fill */}
        <motion.div
          className={`
            h-full rounded-full
            bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400
            ${isLevelingUp ? 'shadow-lg shadow-amber-500/70' : 'shadow-md shadow-amber-500/30'}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Level up celebration overlay */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg shadow-lg">
              <span className="font-bold text-slate-900 font-mono">
                LEVEL UP!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Get detective rank title based on level
 */
function getRankTitle(level: number): string {
  if (level >= 50) return 'Master Detective';
  if (level >= 40) return 'Chief Inspector';
  if (level >= 30) return 'Senior Detective';
  if (level >= 20) return 'Detective';
  if (level >= 15) return 'Inspector';
  if (level >= 10) return 'Sergeant';
  if (level >= 5) return 'Officer';
  return 'Cadet';
}

/**
 * Compact XP display for headers/navbars
 */
interface CompactXPProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
}

export function CompactXP({
  currentXP,
  xpToNextLevel,
  level,
  className = ''
}: CompactXPProps) {
  const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
        <span className="text-amber-400 font-bold text-sm font-mono">{level}</span>
      </div>
      <div className="w-24">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {currentXP}/{xpToNextLevel}
        </span>
      </div>
    </div>
  );
}

/**
 * XP gain animation component
 */
interface XPGainProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
  className?: string;
}

export function XPGain({
  amount,
  show,
  onComplete,
  className = ''
}: XPGainProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 500);
          }}
          className={`inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full ${className}`}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.3 }}
            className="text-amber-400"
          >
            ⭐
          </motion.span>
          <span className="text-amber-400 font-bold font-mono">
            +{amount} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Daily XP progress tracker
 */
interface DailyXPProps {
  earned: number;
  goal: number;
  bonusMultiplier?: number;
  className?: string;
}

export function DailyXP({
  earned,
  goal,
  bonusMultiplier = 1,
  className = ''
}: DailyXPProps) {
  const percentage = Math.min((earned / goal) * 100, 100);
  const isComplete = earned >= goal;

  return (
    <div className={`p-4 bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-mono text-slate-400">Daily XP Goal</span>
        {bonusMultiplier > 1 && (
          <span className="text-xs font-mono text-purple-400 px-2 py-0.5 bg-purple-500/20 rounded">
            {bonusMultiplier}x BONUS
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isComplete
                ? 'bg-gradient-to-r from-green-600 to-emerald-400'
                : 'bg-gradient-to-r from-amber-600 to-yellow-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className={`text-sm font-mono ${isComplete ? 'text-green-400' : 'text-slate-300'}`}>
          {earned}/{goal}
        </span>
      </div>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-green-400 text-sm font-mono"
        >
          Daily Goal Complete!
        </motion.div>
      )}
    </div>
  );
}

export default XPBar;
