'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'gradient';
  showPercentage?: boolean;
  animated?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Circular/radial progress indicator
 * SVG-based with stroke animation
 */
export function ProgressRing({
  value,
  size = 'md',
  strokeWidth,
  color = 'amber',
  showPercentage = true,
  animated = true,
  children,
  className = ''
}: ProgressRingProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  const sizeConfig = {
    sm: { dimension: 48, stroke: 4, fontSize: 'text-xs' },
    md: { dimension: 80, stroke: 6, fontSize: 'text-lg' },
    lg: { dimension: 120, stroke: 8, fontSize: 'text-2xl' },
    xl: { dimension: 160, stroke: 10, fontSize: 'text-3xl' },
  };

  const colorConfig = {
    amber: { stroke: '#F59E0B', glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
    green: { stroke: '#22C55E', glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' },
    blue: { stroke: '#3B82F6', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' },
    purple: { stroke: '#A855F7', glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' },
    gradient: { stroke: 'url(#progressGradient)', glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];
  const actualStroke = strokeWidth || config.stroke;

  const radius = (config.dimension - actualStroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={config.dimension}
        height={config.dimension}
        className={`transform -rotate-90 ${colors.glow}`}
      >
        {color === 'gradient' && (
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        )}
        {/* Background circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={actualStroke}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={actualStroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={animated ? {
            duration: 1,
            ease: 'easeOut',
          } : { duration: 0 }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? children : showPercentage && (
          <motion.span
            className={`font-bold font-mono text-slate-200 ${config.fontSize}`}
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
      </div>
    </div>
  );
}

/**
 * Achievement ring with icon slot
 */
interface AchievementRingProps {
  progress: number;
  total: number;
  icon: ReactNode;
  label?: string;
  color?: 'amber' | 'green' | 'purple';
  className?: string;
}

export function AchievementRing({
  progress,
  total,
  icon,
  label,
  color = 'amber',
  className = ''
}: AchievementRingProps) {
  const percentage = (progress / total) * 100;
  const isComplete = progress >= total;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <ProgressRing
        value={percentage}
        size="md"
        color={isComplete ? 'green' : color}
        showPercentage={false}
      >
        <motion.div
          animate={isComplete ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isComplete ? Infinity : 0,
            repeatDelay: 2,
          }}
          className="text-2xl"
        >
          {icon}
        </motion.div>
      </ProgressRing>
      {label && (
        <span className="text-xs font-mono text-slate-400">{label}</span>
      )}
      <span className="text-sm font-mono text-slate-300">
        {progress}/{total}
      </span>
    </div>
  );
}

/**
 * Multiple progress rings in a row
 */
interface MultiRingProgressProps {
  rings: {
    value: number;
    label: string;
    color: 'amber' | 'green' | 'blue' | 'purple';
  }[];
  className?: string;
}

export function MultiRingProgress({ rings, className = '' }: MultiRingProgressProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {rings.map((ring, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <ProgressRing
            value={ring.value}
            size="sm"
            color={ring.color}
            showPercentage={true}
          />
          <span className="text-xs font-mono text-slate-400">{ring.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Countdown ring for timed events
 */
interface CountdownRingProps {
  timeLeft: number; // seconds remaining
  totalTime: number; // total seconds
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function CountdownRing({
  timeLeft,
  totalTime,
  size = 'md',
  showTime = true,
  className = ''
}: CountdownRingProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = percentage <= 20;
  const isCritical = percentage <= 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ProgressRing
      value={percentage}
      size={size}
      color={isCritical ? 'purple' : isLow ? 'amber' : 'green'}
      showPercentage={false}
      animated={false}
      className={className}
    >
      {showTime && (
        <motion.span
          className={`font-mono font-bold ${
            isCritical ? 'text-red-400' :
            isLow ? 'text-amber-400' :
            'text-slate-200'
          }`}
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {formatTime(timeLeft)}
        </motion.span>
      )}
    </ProgressRing>
  );
}

export default ProgressRing;
