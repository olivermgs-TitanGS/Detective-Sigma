'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StreakFireProps {
  streak: number;
  show?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'badge';
}

/**
 * Streak fire effect component
 * Shows animated flames with intensity based on streak count
 */
export function StreakFire({
  streak,
  show = true,
  size = 'md',
  position = 'inline'
}: StreakFireProps) {
  if (!show || streak < 2) return null;

  const sizeConfig = {
    sm: { height: 20, fontSize: 'text-sm' },
    md: { height: 32, fontSize: 'text-lg' },
    lg: { height: 48, fontSize: 'text-2xl' },
  };

  const config = sizeConfig[size];
  const intensity = Math.min(streak / 10, 1); // 0-1 based on streak up to 10

  // Color progression: orange -> red -> purple as streak increases
  const getFireColor = () => {
    if (streak >= 20) return ['#A855F7', '#EC4899', '#F97316']; // Purple fire
    if (streak >= 10) return ['#EF4444', '#F97316', '#FBBF24']; // Red fire
    if (streak >= 5) return ['#F97316', '#FBBF24', '#FDE047']; // Orange fire
    return ['#FBBF24', '#FDE047', '#FEF08A']; // Yellow fire
  };

  const colors = getFireColor();

  if (position === 'badge') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600"
      >
        <FireIcon colors={colors} height={config.height * 0.6} intensity={intensity} />
        <span className={`font-bold text-white ${config.fontSize}`}>
          {streak} STREAK
        </span>
        <FireIcon colors={colors} height={config.height * 0.6} intensity={intensity} />
      </motion.div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <FireIcon colors={colors} height={config.height} intensity={intensity} />
      <span className={`font-bold text-orange-400 ${config.fontSize}`}>
        {streak}
      </span>
    </div>
  );
}

/**
 * Animated fire icon
 */
interface FireIconProps {
  colors: string[];
  height: number;
  intensity: number;
}

function FireIcon({ colors, height, intensity }: FireIconProps) {
  return (
    <motion.svg
      width={height * 0.7}
      height={height}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        scale: [1, 1.1 + intensity * 0.1, 1],
        y: [0, -2, 0],
      }}
      transition={{
        duration: 0.5 - intensity * 0.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Outer flame */}
      <motion.path
        d="M12 2C12 2 4 12 4 20C4 26 8 30 12 30C16 30 20 26 20 20C20 12 12 2 12 2Z"
        fill={colors[0]}
        animate={{
          d: [
            "M12 2C12 2 4 12 4 20C4 26 8 30 12 30C16 30 20 26 20 20C20 12 12 2 12 2Z",
            "M12 4C12 4 5 12 5 19C5 25 8 29 12 29C16 29 19 25 19 19C19 12 12 4 12 4Z",
            "M12 2C12 2 4 12 4 20C4 26 8 30 12 30C16 30 20 26 20 20C20 12 12 2 12 2Z",
          ],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Middle flame */}
      <motion.path
        d="M12 8C12 8 7 14 7 20C7 24 9 27 12 27C15 27 17 24 17 20C17 14 12 8 12 8Z"
        fill={colors[1]}
        animate={{
          d: [
            "M12 8C12 8 7 14 7 20C7 24 9 27 12 27C15 27 17 24 17 20C17 14 12 8 12 8Z",
            "M12 10C12 10 8 15 8 20C8 23 9 26 12 26C15 26 16 23 16 20C16 15 12 10 12 10Z",
            "M12 8C12 8 7 14 7 20C7 24 9 27 12 27C15 27 17 24 17 20C17 14 12 8 12 8Z",
          ],
        }}
        transition={{
          duration: 0.35,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.1,
        }}
      />
      {/* Inner flame */}
      <motion.path
        d="M12 14C12 14 9 18 9 22C9 24 10 25 12 25C14 25 15 24 15 22C15 18 12 14 12 14Z"
        fill={colors[2]}
        animate={{
          d: [
            "M12 14C12 14 9 18 9 22C9 24 10 25 12 25C14 25 15 24 15 22C15 18 12 14 12 14Z",
            "M12 16C12 16 10 19 10 22C10 23 10 24 12 24C14 24 14 23 14 22C14 19 12 16 12 16Z",
            "M12 14C12 14 9 18 9 22C9 24 10 25 12 25C14 25 15 24 15 22C15 18 12 14 12 14Z",
          ],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
    </motion.svg>
  );
}

/**
 * Streak counter with fire effect
 */
interface StreakCounterProps {
  streak: number;
  label?: string;
  showFireAbove?: number; // Show fire when streak >= this value
}

export function StreakCounter({
  streak,
  label = 'Day Streak',
  showFireAbove = 2
}: StreakCounterProps) {
  const showFire = streak >= showFireAbove;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {showFire && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <StreakFire streak={streak} size="md" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.span
          key={streak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-bold text-3xl ${showFire ? 'text-orange-400' : 'text-slate-300'}`}
        >
          {streak}
        </motion.span>
        <AnimatePresence>
          {showFire && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <StreakFire streak={streak} size="md" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm text-slate-400 font-mono">{label}</span>
    </div>
  );
}

export default StreakFire;
