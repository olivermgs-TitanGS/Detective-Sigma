'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'detective' | 'dots' | 'pulse';
  color?: 'amber' | 'blue' | 'green' | 'white';
  text?: string;
  className?: string;
}

/**
 * Loading spinner with multiple variants
 * Includes detective-themed magnifying glass animation
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  color = 'amber',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: { dimension: 24, strokeWidth: 2, fontSize: 'text-xs' },
    md: { dimension: 40, strokeWidth: 3, fontSize: 'text-sm' },
    lg: { dimension: 64, strokeWidth: 4, fontSize: 'text-base' },
    xl: { dimension: 96, strokeWidth: 5, fontSize: 'text-lg' },
  };

  const colorConfig = {
    amber: { stroke: '#F59E0B', text: 'text-amber-400' },
    blue: { stroke: '#3B82F6', text: 'text-blue-400' },
    green: { stroke: '#22C55E', text: 'text-green-400' },
    white: { stroke: '#F8FAFC', text: 'text-slate-200' },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'detective':
        return <MagnifyingGlassSpinner size={config.dimension} color={colors.stroke} />;
      case 'dots':
        return <DotsSpinner size={config.dimension} color={colors.stroke} />;
      case 'pulse':
        return <PulseSpinner size={config.dimension} color={colors.stroke} />;
      default:
        return <CircleSpinner size={config.dimension} strokeWidth={config.strokeWidth} color={colors.stroke} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderSpinner()}
      {text && (
        <span className={`font-mono ${colors.text} ${config.fontSize}`}>
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Default circle spinner
 */
function CircleSpinner({
  size,
  strokeWidth,
  color
}: {
  size: number;
  strokeWidth: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(100, 116, 139, 0.3)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Spinning arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
      />
    </motion.svg>
  );
}

/**
 * Detective magnifying glass spinner
 */
function MagnifyingGlassSpinner({ size, color }: { size: number; color: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        rotate: [0, -15, 15, -15, 0],
        x: [0, -3, 3, -3, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Glass circle */}
      <motion.circle
        cx="20"
        cy="20"
        r="14"
        stroke={color}
        strokeWidth="3"
        fill="none"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.75,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Handle */}
      <line
        x1="30"
        y1="30"
        x2="42"
        y2="42"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Shine effect */}
      <motion.path
        d="M12 14 Q14 10, 18 12"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.svg>
  );
}

/**
 * Dots loading animation
 */
function DotsSpinner({ size, color }: { size: number; color: string }) {
  const dotSize = size / 5;
  const gap = size / 8;

  return (
    <div className="flex gap-1" style={{ gap }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            borderRadius: '50%',
          }}
          animate={{
            y: [0, -dotSize, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Pulse loading animation
 */
function PulseSpinner({ size, color }: { size: number; color: string }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [0.5, 1],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size / 2,
          height: size / 2,
          backgroundColor: color,
          top: size / 4,
          left: size / 4,
        }}
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </div>
  );
}

/**
 * Full page loading overlay
 */
interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  variant?: 'default' | 'detective';
  className?: string;
}

export function LoadingOverlay({
  show,
  text = 'Loading...',
  variant = 'detective',
  className = ''
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm ${className}`}
    >
      <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" variant={variant} />
        <span className="text-slate-300 font-mono">{text}</span>
      </div>
    </motion.div>
  );
}

/**
 * Inline loading indicator
 */
export function InlineLoader({
  text,
  size = 'sm',
  className = ''
}: {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <LoadingSpinner size={size} variant="dots" />
      {text && <span className="text-slate-400 font-mono text-sm">{text}</span>}
    </div>
  );
}

/**
 * Button loading state
 */
export function ButtonLoader({ color = 'white' }: { color?: 'white' | 'amber' }) {
  return <LoadingSpinner size="sm" variant="default" color={color} />;
}

export default LoadingSpinner;
