'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ProgressLoaderProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'bar' | 'circle' | 'steps';
  steps?: string[];
  currentStep?: number;
  className?: string;
}

/**
 * Determinate progress loader
 * For operations with known progress percentage
 */
export function ProgressLoader({
  progress,
  label,
  showPercentage = true,
  variant = 'bar',
  steps,
  currentStep = 0,
  className = ''
}: ProgressLoaderProps) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  if (variant === 'steps' && steps) {
    return (
      <StepsLoader
        steps={steps}
        currentStep={currentStep}
        className={className}
      />
    );
  }

  if (variant === 'circle') {
    return (
      <CircleLoader
        progress={percentage}
        label={label}
        showPercentage={showPercentage}
        className={className}
      />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-slate-300 font-mono text-sm">{label}</span>
          )}
          {showPercentage && (
            <span className="text-amber-400 font-mono text-sm font-bold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Circular progress loader
 */
function CircleLoader({
  progress,
  label,
  showPercentage,
  className
}: {
  progress: number;
  label?: string;
  showPercentage: boolean;
  className: string;
}) {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#334155"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-2xl font-bold font-mono text-amber-400"
              key={Math.round(progress)}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-slate-300 font-mono text-sm">{label}</span>
      )}
    </div>
  );
}

/**
 * Steps loader for multi-step operations
 */
function StepsLoader({
  steps,
  currentStep,
  className
}: {
  steps: string[];
  currentStep: number;
  className: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <motion.div
            key={index}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step indicator */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                font-mono text-sm font-bold transition-colors duration-300
                ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-400'
                }
              `}
            >
              {isCompleted ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  ✓
                </motion.span>
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <span
              className={`
                font-mono text-sm transition-colors duration-300
                ${isCompleted
                  ? 'text-green-400'
                  : isActive
                    ? 'text-amber-400'
                    : 'text-slate-500'
                }
              `}
            >
              {step}
            </span>

            {/* Loading indicator for active step */}
            {isActive && (
              <motion.div
                className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Upload progress with file info
 */
interface UploadProgressProps {
  fileName: string;
  progress: number;
  size?: string;
  onCancel?: () => void;
  className?: string;
}

export function UploadProgress({
  fileName,
  progress,
  size,
  onCancel,
  className = ''
}: UploadProgressProps) {
  const isComplete = progress >= 100;

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">
          {isComplete ? '✓' : '📄'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 font-mono text-sm truncate">{fileName}</p>
          {size && (
            <p className="text-slate-500 text-xs font-mono">{size}</p>
          )}
        </div>
        {!isComplete && onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      <ProgressLoader progress={progress} showPercentage={true} />
    </div>
  );
}

/**
 * Multi-file upload progress
 */
interface MultiUploadProgressProps {
  files: {
    name: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
  }[];
  className?: string;
}

export function MultiUploadProgress({ files, className = '' }: MultiUploadProgressProps) {
  const completed = files.filter(f => f.status === 'complete').length;
  const total = files.length;
  const overallProgress = (completed / total) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall progress */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-mono text-sm">Overall Progress</span>
          <span className="text-amber-400 font-mono text-sm">
            {completed}/{total} files
          </span>
        </div>
        <ProgressLoader progress={overallProgress} showPercentage={false} />
      </div>

      {/* Individual files */}
      <div className="space-y-2">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2 bg-slate-800/30 rounded"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              file.status === 'complete' ? 'bg-green-500 text-white' :
              file.status === 'error' ? 'bg-red-500 text-white' :
              file.status === 'uploading' ? 'bg-amber-500 text-slate-900' :
              'bg-slate-600 text-slate-400'
            }`}>
              {file.status === 'complete' ? '✓' :
               file.status === 'error' ? '✕' :
               file.status === 'uploading' ? '⟳' : '○'}
            </div>
            <span className="flex-1 text-slate-300 font-mono text-sm truncate">
              {file.name}
            </span>
            <span className="text-slate-500 font-mono text-xs">
              {file.progress}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook for managing progress state
 */
export function useProgress(initialValue = 0) {
  const [progress, setProgress] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const start = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const update = (value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  };

  const increment = (amount: number = 10) => {
    setProgress(prev => Math.min(prev + amount, 100));
  };

  const complete = () => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  };

  const reset = () => {
    setProgress(0);
    setIsLoading(false);
  };

  return {
    progress,
    isLoading,
    start,
    update,
    increment,
    complete,
    reset,
  };
}

export default ProgressLoader;
