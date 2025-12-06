'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded' | 'evidence' | 'caseFile';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'scanline' | 'none';
}

/**
 * Detective-themed skeleton loading placeholder
 * Shows animated placeholder while content loads
 */
export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'wave'
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
    evidence: 'rounded-none border-2 border-amber-600/20',
    caseFile: 'rounded-none border border-amber-600/30',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? 40 : '100%'),
    height: height ?? (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
  };

  // Scanline animation (detective computer effect)
  if (animation === 'scanline') {
    return (
      <div
        className={`relative overflow-hidden bg-slate-800/80 ${variantStyles[variant]} ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-x-0 h-1 bg-gradient-to-b from-amber-500/30 via-amber-400/10 to-transparent"
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>
    );
  }

  // Wave animation
  if (animation === 'wave') {
    return (
      <div
        className={`relative overflow-hidden bg-slate-800/70 ${variantStyles[variant]} ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/40 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  // Pulse animation
  if (animation === 'pulse') {
    return (
      <div
        className={`bg-slate-800/70 animate-pulse ${variantStyles[variant]} ${className}`}
        style={style}
      />
    );
  }

  // No animation
  return (
    <div
      className={`bg-slate-800/70 ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

/**
 * Case file card skeleton with detective styling
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/60 border-2 border-amber-600/20 p-4 ${className}`}>
      {/* Case file header tape */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-16 bg-amber-600/30" />
        <Skeleton variant="text" width="40%" height={12} animation="scanline" />
      </div>
      {/* Cover image placeholder */}
      <Skeleton variant="caseFile" height={140} className="mb-4" animation="wave" />
      {/* Title */}
      <Skeleton variant="text" width="70%" className="mb-2" animation="wave" />
      {/* Description */}
      <Skeleton variant="text" width="90%" className="mb-2" animation="wave" />
      <Skeleton variant="text" width="60%" className="mb-3" animation="wave" />
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={60} height={22} animation="pulse" />
        <Skeleton variant="rectangular" width={50} height={22} animation="pulse" />
      </div>
    </div>
  );
}

/**
 * Evidence item skeleton
 */
export function EvidenceSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/50 border border-amber-600/30 p-3 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" width={40} height={40} animation="scanline" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" animation="wave" />
          <Skeleton variant="text" width="40%" height={10} animation="wave" />
        </div>
      </div>
      <Skeleton variant="evidence" height={80} className="mb-2" animation="wave" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="30%" height={10} animation="pulse" />
        <Skeleton variant="rectangular" width={24} height={24} animation="pulse" />
      </div>
    </div>
  );
}

/**
 * Suspect profile skeleton
 */
export function SuspectSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/60 border-2 border-slate-700 p-4 ${className}`}>
      {/* Mugshot style header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Skeleton variant="rectangular" width={64} height={80} animation="scanline" />
          {/* Photo corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-600/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-600/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-600/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-600/50" />
        </div>
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" animation="wave" />
          <Skeleton variant="text" width="40%" height={12} animation="wave" />
          <div className="flex gap-2 mt-2">
            <Skeleton variant="rectangular" width={50} height={18} animation="pulse" />
          </div>
        </div>
      </div>
      {/* Info lines */}
      <div className="space-y-2 border-t border-slate-700 pt-3">
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="85%" animation="wave" />
        <Skeleton variant="text" width="70%" animation="wave" />
      </div>
    </div>
  );
}

/**
 * Dashboard stat skeleton with case file styling
 */
export function StatSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/60 border-2 border-amber-600/20 p-4 ${className}`}>
      {/* Label */}
      <Skeleton variant="text" width="50%" height={10} className="mb-3" animation="wave" />
      {/* Value */}
      <Skeleton variant="text" width="40%" height={28} className="mb-2" animation="scanline" />
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-1 bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-amber-600/30"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '60%', '40%', '60%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <Skeleton variant="text" width={30} height={10} animation="pulse" />
      </div>
    </div>
  );
}

/**
 * Investigation list item skeleton
 */
export function ListItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 border-b border-slate-800 ${className}`}>
      <Skeleton variant="circular" width={48} height={48} animation="scanline" />
      <div className="flex-1">
        <Skeleton variant="text" width="60%" className="mb-2" animation="wave" />
        <Skeleton variant="text" width="40%" height={12} animation="wave" />
      </div>
      <Skeleton variant="rectangular" width={80} height={32} animation="pulse" />
    </div>
  );
}

/**
 * Evidence board skeleton
 */
export function EvidenceBoardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <EvidenceSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Profile skeleton with detective badge
 */
export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Badge/Avatar */}
      <div className="relative">
        <Skeleton variant="circular" width={64} height={64} animation="scanline" />
        <div className="absolute -bottom-1 -right-1">
          <Skeleton variant="circular" width={20} height={20} animation="pulse" />
        </div>
      </div>
      <div>
        <Skeleton variant="text" width={120} height={20} className="mb-2" animation="wave" />
        <Skeleton variant="text" width={80} height={14} animation="wave" />
      </div>
    </div>
  );
}

/**
 * Table skeleton for case logs
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className = '' }: TableSkeletonProps) {
  return (
    <div className={`border-2 border-amber-600/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-900 p-3 flex gap-4 border-b border-amber-600/30">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={`${100 / columns - 2}%`}
            height={14}
            animation="wave"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`p-3 flex gap-4 ${rowIndex % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20'}`}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / columns - 2}%`}
              height={16}
              animation="wave"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton with detective HQ styling
 */
export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header with classified stamp */}
      <div className="flex items-center justify-between border-b-2 border-amber-600/30 pb-4">
        <div>
          <Skeleton variant="text" width={200} height={28} className="mb-2" animation="scanline" />
          <Skeleton variant="text" width={300} height={16} animation="wave" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" width={100} height={36} animation="pulse" />
          <Skeleton variant="circular" width={40} height={40} animation="pulse" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

/**
 * Inline loading text skeleton
 */
export function InlineTextSkeleton({
  width = 100,
  className = ''
}: {
  width?: number | string;
  className?: string;
}) {
  return (
    <span className={`inline-block align-middle ${className}`}>
      <Skeleton variant="text" width={width} height={14} animation="wave" />
    </span>
  );
}

/**
 * Case file loading skeleton
 */
export function CaseFileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-900/70 border-2 border-amber-600/30 ${className}`}>
      {/* File tab */}
      <div className="bg-amber-600/20 px-4 py-2 flex items-center gap-2">
        <Skeleton variant="rectangular" width={12} height={12} animation="pulse" />
        <Skeleton variant="text" width={120} height={14} animation="wave" />
      </div>
      {/* File content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="text-center border-b border-amber-600/20 pb-4">
          <Skeleton variant="text" width="60%" height={24} className="mx-auto mb-2" animation="scanline" />
          <Skeleton variant="text" width="30%" height={12} className="mx-auto" animation="wave" />
        </div>
        {/* Content */}
        <div className="space-y-3">
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="95%" animation="wave" />
          <Skeleton variant="text" width="88%" animation="wave" />
          <Skeleton variant="text" width="92%" animation="wave" />
          <Skeleton variant="text" width="75%" animation="wave" />
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-amber-600/20">
          <Skeleton variant="text" width={100} height={12} animation="pulse" />
          <Skeleton variant="rectangular" width={80} height={28} animation="pulse" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
