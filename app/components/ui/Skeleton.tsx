'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading placeholder component
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
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: '',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? 40 : '100%'),
    height: height ?? (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
  };

  if (animation === 'wave') {
    return (
      <div
        className={`relative overflow-hidden bg-slate-700 ${variantStyles[variant]} ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"
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

  return (
    <div
      className={`bg-slate-700 ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
}

/**
 * Card skeleton for case cards
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <Skeleton variant="rounded" height={160} className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="80%" className="mb-2" />
      <Skeleton variant="text" width="40%" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-3 ${className}`}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" width="70%" className="mb-2" />
        <Skeleton variant="text" width="50%" height={12} />
      </div>
      <Skeleton variant="rounded" width={80} height={32} />
    </div>
  );
}

/**
 * Dashboard stat skeleton
 */
export function StatSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <Skeleton variant="text" width="40%" height={12} className="mb-3" />
      <Skeleton variant="text" width="60%" height={32} className="mb-2" />
      <div className="flex items-center gap-2">
        <Skeleton variant="rounded" width={60} height={8} />
        <Skeleton variant="text" width={40} height={12} />
      </div>
    </div>
  );
}

/**
 * Profile skeleton
 */
export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Skeleton variant="circular" width={64} height={64} />
      <div>
        <Skeleton variant="text" width={120} height={20} className="mb-2" />
        <Skeleton variant="text" width={80} height={14} />
      </div>
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
        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <Skeleton variant="rounded" height={100} className="mb-3" />
          <Skeleton variant="text" width="80%" className="mb-1" />
          <Skeleton variant="text" width="60%" height={12} />
        </div>
      ))}
    </div>
  );
}

/**
 * Suspect card skeleton
 */
export function SuspectSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width={56} height={56} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="text" width="100%" className="mb-1" />
      <Skeleton variant="text" width="90%" className="mb-1" />
      <Skeleton variant="text" width="70%" />
    </div>
  );
}

/**
 * Table skeleton
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className = '' }: TableSkeletonProps) {
  return (
    <div className={`border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-800 p-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns - 2}%`} height={14} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`p-3 flex gap-4 ${rowIndex % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'}`}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / columns - 2}%`}
              height={16}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton
 */
export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" width={200} height={28} className="mb-2" />
          <Skeleton variant="text" width={300} height={16} />
        </div>
        <Skeleton variant="rounded" width={120} height={40} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export default Skeleton;
