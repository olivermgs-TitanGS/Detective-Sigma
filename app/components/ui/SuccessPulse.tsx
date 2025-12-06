'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface SuccessPulseProps {
  children: ReactNode;
  active?: boolean;
  color?: 'green' | 'gold' | 'blue' | 'purple' | 'evidence' | 'classified';
  intensity?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'stamp' | 'evidence' | 'classified';
  className?: string;
}

/**
 * Detective-themed success pulse wrapper
 * Adds evidence stamp and case file effects
 */
export function SuccessPulse({
  children,
  active = false,
  color = 'green',
  intensity = 'medium',
  variant = 'default',
  className = ''
}: SuccessPulseProps) {
  const colorClasses = {
    green: {
      glow: 'shadow-green-500/50',
      ring: 'ring-green-500/30',
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
    },
    gold: {
      glow: 'shadow-amber-500/50',
      ring: 'ring-amber-500/30',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50',
    },
    blue: {
      glow: 'shadow-blue-500/50',
      ring: 'ring-blue-500/30',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
    },
    purple: {
      glow: 'shadow-purple-500/50',
      ring: 'ring-purple-500/30',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/50',
    },
    evidence: {
      glow: 'shadow-amber-400/60',
      ring: 'ring-amber-400/40',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/60',
    },
    classified: {
      glow: 'shadow-red-500/50',
      ring: 'ring-red-500/30',
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
    },
  };

  const intensityConfig = {
    low: { blur: '10px', scale: 1.02, duration: 1.5 },
    medium: { blur: '20px', scale: 1.05, duration: 1 },
    high: { blur: '30px', scale: 1.08, duration: 0.7 },
  };

  const colors = colorClasses[color];
  const config = intensityConfig[intensity];

  // Evidence stamp variant
  if (variant === 'stamp') {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence>
          {active && (
            <>
              {/* Stamp effect border */}
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 border-4 ${colors.border} ${colors.bg}`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)',
                }}
              />
              {/* Corner stamps */}
              {[
                'top-0 left-0',
                'top-0 right-0',
                'bottom-0 left-0',
                'bottom-0 right-0',
              ].map((position, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={`absolute ${position} w-3 h-3 ${colors.bg} border ${colors.border}`}
                />
              ))}
            </>
          )}
        </AnimatePresence>
        <div className={`relative z-10 ${active ? colors.glow : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  // Evidence collection variant
  if (variant === 'evidence') {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence>
          {active && (
            <>
              {/* Evidence tag effect */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-2 -left-2 bg-amber-600 text-black text-xs font-mono font-bold px-2 py-0.5 z-20"
              >
                EVIDENCE
              </motion.div>
              {/* Glow pulse */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, config.scale, 1],
                }}
                transition={{
                  duration: config.duration,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`absolute inset-0 ${colors.bg} border-2 ${colors.border}`}
                style={{ filter: `blur(${config.blur})` }}
              />
              {/* Evidence tape corners */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                className="absolute top-0 left-0 h-1 bg-amber-500/60"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                className="absolute bottom-0 right-0 h-1 bg-amber-500/60"
              />
            </>
          )}
        </AnimatePresence>
        <div className={`relative z-10 ${active ? `shadow-lg ${colors.glow}` : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  // Classified variant
  if (variant === 'classified') {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence>
          {active && (
            <>
              {/* Classified stamp overlay */}
              <motion.div
                initial={{ opacity: 0, rotate: -15, scale: 1.5 }}
                animate={{ opacity: 0.2, rotate: -12, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <div className="border-4 border-red-600 text-red-600 font-mono font-bold text-2xl px-4 py-2 tracking-widest">
                  CLASSIFIED
                </div>
              </motion.div>
              {/* Red glow pulse */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-red-500/10 border-2 border-red-600/40"
              />
            </>
          )}
        </AnimatePresence>
        <div className={`relative z-10 ${active ? 'shadow-lg shadow-red-500/30' : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  // Default variant
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
            className={`absolute inset-0 ${colors.bg} ${colors.ring} ring-4`}
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
 * Evidence verified stamp animation
 */
interface EvidenceVerifiedProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
  className?: string;
}

export function EvidenceVerified({
  show,
  size = 'md',
  onComplete,
  className = ''
}: EvidenceVerifiedProps) {
  const sizes = {
    sm: { width: 80, height: 40, fontSize: 'text-xs' },
    md: { width: 120, height: 60, fontSize: 'text-sm' },
    lg: { width: 160, height: 80, fontSize: 'text-base' },
  };

  const config = sizes[size];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: -12, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          onAnimationComplete={onComplete}
          className={`flex items-center justify-center ${className}`}
          style={{ width: config.width, height: config.height }}
        >
          <div className="border-4 border-green-600 bg-green-900/30 px-3 py-1">
            <span className={`text-green-400 font-mono font-bold ${config.fontSize} tracking-widest`}>
              VERIFIED
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Case closed stamp animation
 */
interface CaseClosedStampProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
  className?: string;
}

export function CaseClosedStamp({
  show,
  size = 'md',
  onComplete,
  className = ''
}: CaseClosedStampProps) {
  const sizes = {
    sm: { dimension: 60, fontSize: 'text-[8px]' },
    md: { dimension: 100, fontSize: 'text-xs' },
    lg: { dimension: 140, fontSize: 'text-sm' },
  };

  const config = sizes[size];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 2, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: -15, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          onAnimationComplete={onComplete}
          className={`flex items-center justify-center ${className}`}
        >
          <div
            className="border-4 border-red-600 rounded-full flex items-center justify-center bg-red-900/20"
            style={{ width: config.dimension, height: config.dimension }}
          >
            <div className="text-center">
              <div className={`text-red-500 font-mono font-bold ${config.fontSize} tracking-widest leading-tight`}>
                CASE
              </div>
              <div className={`text-red-500 font-mono font-bold ${config.fontSize} tracking-widest leading-tight`}>
                CLOSED
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Success flash component with detective styling
 */
interface SuccessFlashProps {
  trigger: boolean;
  color?: 'green' | 'gold' | 'blue' | 'evidence';
  variant?: 'default' | 'camera' | 'evidence';
  onComplete?: () => void;
  children: ReactNode;
  className?: string;
}

export function SuccessFlash({
  trigger,
  color = 'green',
  variant = 'default',
  onComplete,
  children,
  className = ''
}: SuccessFlashProps) {
  const flashColors = {
    green: 'bg-green-500',
    gold: 'bg-amber-500',
    blue: 'bg-blue-500',
    evidence: 'bg-amber-400',
  };

  // Camera flash variant (like evidence photo)
  if (variant === 'camera') {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence>
          {trigger && (
            <>
              {/* Camera flash */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={onComplete}
                className="absolute inset-0 bg-white z-20"
              />
              {/* Flash border effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute inset-0 border-4 border-white/80 z-20"
              />
            </>
          )}
        </AnimatePresence>
        {children}
      </div>
    );
  }

  // Evidence collection flash
  if (variant === 'evidence') {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence>
          {trigger && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onAnimationComplete={onComplete}
                className="absolute inset-0 bg-amber-500/40"
              />
              {/* Evidence marker effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-amber-500 rounded-full"
              />
            </>
          )}
        </AnimatePresence>
        {children}
      </div>
    );
  }

  // Default flash
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
            className={`absolute inset-0 ${flashColors[color]}`}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

/**
 * Detective badge checkmark animation
 */
interface SuccessCheckProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'badge' | 'evidence';
  color?: string;
  onComplete?: () => void;
}

export function SuccessCheck({
  show,
  size = 'md',
  variant = 'default',
  color = '#22C55E',
  onComplete
}: SuccessCheckProps) {
  const sizes = {
    sm: 24,
    md: 48,
    lg: 72,
  };

  const s = sizes[size];

  // Badge variant
  if (variant === 'badge') {
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
            <div
              className="relative flex items-center justify-center"
              style={{ width: s, height: s }}
            >
              {/* Badge shape */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-amber-500 to-amber-700"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              />
              {/* Checkmark */}
              <svg
                width={s * 0.5}
                height={s * 0.5}
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10"
              >
                <motion.path
                  d="M5 13l4 4 10-10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Evidence variant
  if (variant === 'evidence') {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            onAnimationComplete={onComplete}
            className="flex items-center justify-center"
          >
            <div
              className="relative flex items-center justify-center border-4 border-amber-500 rounded-full bg-amber-900/30"
              style={{ width: s, height: s }}
            >
              <svg
                width={s * 0.5}
                height={s * 0.5}
                viewBox="0 0 24 24"
                fill="none"
              >
                <motion.path
                  d="M5 13l4 4 10-10"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default checkmark
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
