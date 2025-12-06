'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'red' | 'evidence' | 'classified';
  animated?: boolean;
  className?: string;
  variant?: 'default' | 'caseFile' | 'evidence' | 'classified';
}

/**
 * Detective-themed progress bar component
 * Evidence collection and case file progress tracking
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'amber',
  animated = true,
  className = '',
  variant = 'default'
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
      track: 'bg-slate-800',
    },
    green: {
      bg: 'bg-green-500',
      glow: 'shadow-green-500/50',
      track: 'bg-slate-800',
    },
    blue: {
      bg: 'bg-blue-500',
      glow: 'shadow-blue-500/50',
      track: 'bg-slate-800',
    },
    purple: {
      bg: 'bg-purple-500',
      glow: 'shadow-purple-500/50',
      track: 'bg-slate-800',
    },
    red: {
      bg: 'bg-red-500',
      glow: 'shadow-red-500/50',
      track: 'bg-slate-800',
    },
    evidence: {
      bg: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      glow: 'shadow-amber-500/60',
      track: 'bg-slate-900 border border-amber-600/30',
    },
    classified: {
      bg: 'bg-gradient-to-r from-red-600 to-red-500',
      glow: 'shadow-red-500/60',
      track: 'bg-slate-900 border border-red-600/30',
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  // Case file variant with evidence markers
  if (variant === 'caseFile') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <span className={`text-amber-400 font-mono font-bold tracking-wider ${config.text}`}>
                ▸ {label.toUpperCase()}
              </span>
            )}
            {showPercentage && (
              <span className={`text-amber-500 font-mono font-bold ${config.text}`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className="relative">
          {/* Track with evidence tape styling */}
          <div className={`w-full ${config.height} bg-slate-900 border-2 border-amber-600/40 overflow-hidden`}>
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500"
              initial={animated ? { width: 0 } : { width: `${percentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          </div>
          {/* Evidence markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute top-0 bottom-0 w-px bg-amber-600/30"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Classified variant with red tape styling
  if (variant === 'classified') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <span className={`text-red-400 font-mono font-bold tracking-wider ${config.text}`}>
                ⚠ {label.toUpperCase()}
              </span>
            )}
            {showPercentage && (
              <span className={`text-red-500 font-mono font-bold ${config.text}`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className={`w-full ${config.height} bg-slate-900 border-2 border-red-600/40 overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500"
            initial={animated ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
          />
        </div>
        <div className="mt-1 text-red-500/60 font-mono text-xs tracking-widest">
          CLASSIFIED INTEL
        </div>
      </div>
    );
  }

  // Evidence variant with collection progress
  if (variant === 'evidence') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <span className={`text-amber-300 font-mono font-bold tracking-wide ${config.text} flex items-center gap-2`}>
                <span>🔍</span> {label.toUpperCase()}
              </span>
            )}
            {showPercentage && (
              <span className={`text-amber-400 font-mono font-bold ${config.text}`}>
                {value}/{max} COLLECTED
              </span>
            )}
          </div>
        )}
        <div className={`w-full ${config.height} bg-slate-900 border border-amber-500/30 overflow-hidden`}>
          <motion.div
            className={`h-full ${colors.bg} ${animated ? `shadow-lg ${colors.glow}` : ''}`}
            initial={animated ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
          />
        </div>
      </div>
    );
  }

  // Default variant
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
      <div className={`w-full ${config.height} ${colors.track} overflow-hidden`}>
        <motion.div
          className={`h-full ${colors.bg} ${animated ? `shadow-lg ${colors.glow}` : ''}`}
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
 * Circular progress ring - Evidence collection progress
 */
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  color?: 'amber' | 'green' | 'blue' | 'evidence';
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  color = 'amber',
  showValue = true,
  label,
  className = ''
}: ProgressRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeConfig = {
    sm: { dimension: 48, fontSize: 'text-xs' },
    md: { dimension: 64, fontSize: 'text-sm' },
    lg: { dimension: 96, fontSize: 'text-lg' },
    xl: { dimension: 128, fontSize: 'text-xl' },
  };

  const colorConfig = {
    amber: { stroke: '#F59E0B', text: 'text-amber-400' },
    green: { stroke: '#22C55E', text: 'text-green-400' },
    blue: { stroke: '#3B82F6', text: 'text-blue-400' },
    evidence: { stroke: '#FBBF24', text: 'text-yellow-400' },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];
  const radius = (config.dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={config.dimension}
        height={config.dimension}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-30"
        />
        {/* Evidence markers at quarters */}
        {[0, 90, 180, 270].map((angle) => (
          <circle
            key={angle}
            cx={config.dimension / 2 + radius * Math.cos((angle - 90) * Math.PI / 180)}
            cy={config.dimension / 2 + radius * Math.sin((angle - 90) * Math.PI / 180)}
            r={2}
            fill="rgba(251, 191, 36, 0.3)"
          />
        ))}
        {/* Progress arc */}
        <motion.circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.stroke}40)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className={`${colors.text} font-mono font-bold ${config.fontSize}`}>
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-slate-500 font-mono text-xs tracking-wider mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Investigation phase progress - Segmented progress for case phases
 */
interface InvestigationProgressProps {
  current: number;
  phases: string[];
  color?: 'amber' | 'green' | 'blue';
  className?: string;
}

export function InvestigationProgress({
  current,
  phases,
  color = 'amber',
  className = ''
}: InvestigationProgressProps) {
  const total = phases.length;

  const colorConfig = {
    amber: {
      active: 'bg-amber-500 border-amber-400',
      completed: 'bg-amber-600 border-amber-500',
      inactive: 'bg-slate-800 border-slate-700',
      text: 'text-amber-400',
      line: 'bg-amber-500',
      lineBg: 'bg-slate-700',
    },
    green: {
      active: 'bg-green-500 border-green-400',
      completed: 'bg-green-600 border-green-500',
      inactive: 'bg-slate-800 border-slate-700',
      text: 'text-green-400',
      line: 'bg-green-500',
      lineBg: 'bg-slate-700',
    },
    blue: {
      active: 'bg-blue-500 border-blue-400',
      completed: 'bg-blue-600 border-blue-500',
      inactive: 'bg-slate-800 border-slate-700',
      text: 'text-blue-400',
      line: 'bg-blue-500',
      lineBg: 'bg-slate-700',
    },
  };

  const colors = colorConfig[color];

  return (
    <div className={`w-full ${className}`}>
      {/* Phase indicators */}
      <div className="flex items-center justify-between mb-3">
        {phases.map((phase, index) => {
          const isCompleted = index < current;
          const isActive = index === current;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${
                  isCompleted ? colors.completed :
                  isActive ? colors.active :
                  colors.inactive
                } ${isActive ? 'shadow-lg' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? '✓' : index + 1}
              </motion.div>
              <span className={`mt-2 text-xs font-mono tracking-wider ${
                index <= current ? colors.text : 'text-slate-500'
              }`}>
                {phase}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress line */}
      <div className={`h-1 ${colors.lineBg} relative overflow-hidden`}>
        <motion.div
          className={`h-full ${colors.line}`}
          initial={{ width: 0 }}
          animate={{ width: `${(current / (total - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

/**
 * Case progress bar with evidence and suspect tracking
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
    <div className={`space-y-4 p-4 bg-slate-900/50 border border-amber-600/30 ${className}`}>
      <div className="text-amber-400 font-mono font-bold text-sm tracking-widest mb-3">
        📋 CASE PROGRESS
      </div>

      {/* Evidence collected */}
      <div className="flex items-center gap-3">
        <span className="text-amber-400 text-sm font-mono w-28 flex items-center gap-2">
          <span>🔍</span> EVIDENCE
        </span>
        <div className="flex-1">
          <ProgressBar
            value={cluesFound}
            max={totalClues}
            showPercentage={false}
            size="sm"
            color="evidence"
          />
        </div>
        <span className="text-amber-500 text-sm font-mono w-14 text-right font-bold">
          {cluesFound}/{totalClues}
        </span>
      </div>

      {/* Suspects interrogated */}
      <div className="flex items-center gap-3">
        <span className="text-blue-400 text-sm font-mono w-28 flex items-center gap-2">
          <span>👤</span> SUSPECTS
        </span>
        <div className="flex-1">
          <ProgressBar
            value={suspectsTalked}
            max={totalSuspects}
            showPercentage={false}
            size="sm"
            color="blue"
          />
        </div>
        <span className="text-blue-500 text-sm font-mono w-14 text-right font-bold">
          {suspectsTalked}/{totalSuspects}
        </span>
      </div>

      {/* Overall case progress */}
      <div className="pt-3 border-t border-amber-600/30">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-sm font-mono w-28 flex items-center gap-2">
            <span>📁</span> CASE STATUS
          </span>
          <div className="flex-1">
            <ProgressBar
              value={overallPercent}
              max={100}
              showPercentage={true}
              size="md"
              color="green"
              variant="caseFile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * XP/Experience bar for detective rank progression
 */
interface XPBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  rankTitle?: string;
  className?: string;
}

export function XPBar({
  currentXP,
  levelXP,
  level,
  rankTitle = 'DETECTIVE',
  className = ''
}: XPBarProps) {
  const percentage = (currentXP / levelXP) * 100;

  return (
    <div className={`bg-slate-900/60 border border-amber-600/40 p-4 ${className}`}>
      {/* Rank header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎖️</span>
          <div>
            <div className="text-amber-400 font-mono font-bold text-xs tracking-widest">
              {rankTitle}
            </div>
            <div className="text-amber-500 font-mono font-bold text-lg">
              RANK {level}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 font-mono text-xs">XP TO NEXT RANK</div>
          <div className="text-amber-400 font-mono font-bold">
            {currentXP} / {levelXP}
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="relative">
        <div className="w-full h-4 bg-slate-800 border border-amber-600/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        </div>
        {/* Percentage badge */}
        <div className="absolute -top-1 -right-1 bg-amber-600 text-black font-mono font-bold text-xs px-2 py-0.5">
          {Math.round(percentage)}%
        </div>
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
      inactive: 'bg-slate-800',
      text: 'text-amber-400',
    },
    green: {
      active: 'bg-green-500',
      completed: 'bg-green-600',
      inactive: 'bg-slate-800',
      text: 'text-green-400',
    },
    blue: {
      active: 'bg-blue-500',
      completed: 'bg-blue-600',
      inactive: 'bg-slate-800',
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
              className={`flex-1 h-2 ${
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
              className={`text-xs font-mono tracking-wider ${
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

export default ProgressBar;
