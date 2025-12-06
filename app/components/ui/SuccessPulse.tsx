'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface SuccessPulseProps {
  children: ReactNode;
  active?: boolean;
  color?: 'green' | 'gold' | 'blue' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

/**
 * Success pulse wrapper component
 * Adds a glowing pulse effect to indicate success states
 */
export function SuccessPulse({
  children,
  active = false,
  color = 'green',
  intensity = 'medium',
  className = ''
}: SuccessPulseProps) {
  const colorClasses = {
    green: {
      glow: 'shadow-green-500/50',
      ring: 'ring-green-500/30',
      bg: 'bg-green-500/10',
    },
    gold: {
      glow: 'shadow-amber-500/50',
      ring: 'ring-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    blue: {
      glow: 'shadow-blue-500/50',
      ring: 'ring-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    purple: {
      glow: 'shadow-purple-500/50',
      ring: 'ring-purple-500/30',
      bg: 'bg-purple-500/10',
    },
  };

  const intensityConfig = {
    low: { blur: '10px', scale: 1.02, duration: 1.5 },
    medium: { blur: '20px', scale: 1.05, duration: 1 },
    high: { blur: '30px', scale: 1.08, duration: 0.7 },
  };

  const colors = colorClasses[color];
  const config = intensityConfig[intensity];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [1, config.scale, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`absolute inset-0 rounded-lg ${colors.bg} ${colors.ring} ring-4`}
            style={{ filter: `blur(${config.blur})` }}
          />
        )}
      </AnimatePresence>
      <div className={`relative z-10 ${active ? colors.glow : ''}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * Success flash component
 * One-time flash effect for instant feedback
 */
interface SuccessFlashProps {
  trigger: boolean;
  color?: 'green' | 'gold' | 'blue';
  onComplete?: () => void;
  children: ReactNode;
  className?: string;
}

export function SuccessFlash({
  trigger,
  color = 'green',
  onComplete,
  children,
  className = ''
}: SuccessFlashProps) {
  const flashColors = {
    green: 'bg-green-500',
    gold: 'bg-amber-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {trigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={onComplete}
            className={`absolute inset-0 rounded-lg ${flashColors[color]}`}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

/**
 * Checkmark success animation
 */
interface SuccessCheckProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  onComplete?: () => void;
}

export function SuccessCheck({
  show,
  size = 'md',
  color = '#22C55E',
  onComplete
}: SuccessCheckProps) {
  const sizes = {
    sm: 24,
    md: 48,
    lg: 72,
  };

  const s = sizes[size];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          onAnimationComplete={onComplete}
          className="flex items-center justify-center"
        >
          <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke={color}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M6 12l4 4 8-8"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SuccessPulse;
