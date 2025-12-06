'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'red';
  animated?: boolean;
  className?: string;
}

/**
 * Linear progress bar component
 * Animated fill with customizable colors and labels
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'amber',
  animated = true,
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeConfig = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' },
    lg: { height: 'h-4', text: 'text-base' },
  };

  const colorConfig = {
    amber: {
      bg: 'bg-amber-500',
      glow: 'shadow-amber-500/50',
      track: 'bg-slate-700',
    },
    green: {
      bg: 'bg-green-500',
      glow: 'shadow-green-500/50',
      track: 'bg-slate-700',
    },
    blue: {
      bg: 'bg-blue-500',
      glow: 'shadow-blue-500/50',
      track: 'bg-slate-700',
    },
    purple: {
      bg: 'bg-purple-500',
      glow: 'shadow-purple-500/50',
      track: 'bg-slate-700',
    },
    red: {
      bg: 'bg-red-500',
      glow: 'shadow-red-500/50',
      track: 'bg-slate-700',
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className={`text-slate-300 font-mono ${config.text}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-slate-400 font-mono ${config.text}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${config.height} ${colors.track} rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colors.bg} rounded-full ${animated ? `shadow-lg ${colors.glow}` : ''}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? {
            duration: 0.8,
            ease: 'easeOut',
          } : { duration: 0 }}
        />
      </div>
    </div>
  );
}

/**
 * Segmented progress bar for multi-step processes
 */
interface SegmentedProgressProps {
  current: number;
  total: number;
  labels?: string[];
  color?: 'amber' | 'green' | 'blue';
  className?: string;
}

export function SegmentedProgress({
  current,
  total,
  labels,
  color = 'amber',
  className = ''
}: SegmentedProgressProps) {
  const colorConfig = {
    amber: {
      active: 'bg-amber-500',
      completed: 'bg-amber-600',
      inactive: 'bg-slate-700',
      text: 'text-amber-400',
    },
    green: {
      active: 'bg-green-500',
      completed: 'bg-green-600',
      inactive: 'bg-slate-700',
      text: 'text-green-400',
    },
    blue: {
      active: 'bg-blue-500',
      completed: 'bg-blue-600',
      inactive: 'bg-slate-700',
      text: 'text-blue-400',
    },
  };

  const colors = colorConfig[color];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current;
          const isActive = index === current;

          return (
            <motion.div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                isCompleted ? colors.completed :
                isActive ? colors.active :
                colors.inactive
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          );
        })}
      </div>
      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span
              key={index}
              className={`text-xs font-mono ${
                index <= current ? colors.text : 'text-slate-500'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Case progress bar with clue collection visualization
 */
interface CaseProgressBarProps {
  cluesFound: number;
  totalClues: number;
  suspectsTalked: number;
  totalSuspects: number;
  className?: string;
}

export function CaseProgressBar({
  cluesFound,
  totalClues,
  suspectsTalked,
  totalSuspects,
  className = ''
}: CaseProgressBarProps) {
  const cluePercent = (cluesFound / totalClues) * 100;
  const suspectPercent = (suspectsTalked / totalSuspects) * 100;
  const overallPercent = ((cluePercent + suspectPercent) / 2);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-amber-400 text-sm font-mono w-24">Clues</span>
        <div className="flex-1">
          <ProgressBar
            value={cluesFound}
            max={totalClues}
            showPercentage={false}
            size="sm"
            color="amber"
          />
        </div>
        <span className="text-slate-400 text-sm font-mono w-12 text-right">
          {cluesFound}/{totalClues}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-blue-400 text-sm font-mono w-24">Suspects</span>
        <div className="flex-1">
          <ProgressBar
            value={suspectsTalked}
            max={totalSuspects}
            showPercentage={false}
            size="sm"
            color="blue"
          />
        </div>
        <span className="text-slate-400 text-sm font-mono w-12 text-right">
          {suspectsTalked}/{totalSuspects}
        </span>
      </div>
      <div className="pt-2 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-sm font-mono w-24">Overall</span>
          <div className="flex-1">
            <ProgressBar
              value={overallPercent}
              max={100}
              showPercentage={true}
              size="md"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
