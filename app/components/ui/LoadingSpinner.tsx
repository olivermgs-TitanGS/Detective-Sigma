'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'detective' | 'fingerprint' | 'evidence' | 'dots' | 'pulse';
  color?: 'amber' | 'blue' | 'green' | 'white' | 'red';
  text?: string;
  className?: string;
}

/**
 * Detective-themed loading spinner with multiple variants
 * Includes magnifying glass, fingerprint, and evidence animations
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
    red: { stroke: '#EF4444', text: 'text-red-400' },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'detective':
        return <MagnifyingGlassSpinner size={config.dimension} color={colors.stroke} />;
      case 'fingerprint':
        return <FingerprintSpinner size={config.dimension} color={colors.stroke} />;
      case 'evidence':
        return <EvidenceSpinner size={config.dimension} color={colors.stroke} />;
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
        <span className={`font-mono ${colors.text} ${config.fontSize} tracking-wider`}>
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Default circle spinner with detective styling
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
        stroke="rgba(100, 116, 139, 0.2)"
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
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
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
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
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
 * Fingerprint scanning spinner
 */
function FingerprintSpinner({ size, color }: { size: number; color: string }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Fingerprint pattern */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fingerprint arcs */}
        {[12, 16, 20, 24].map((r, i) => (
          <motion.path
            key={i}
            d={`M ${24 - r} 24 A ${r} ${r} 0 0 1 ${24 + r} 24`}
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity={0.3 + i * 0.15}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      {/* Scanning line */}
      <motion.div
        className="absolute inset-x-0 h-0.5"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        initial={{ top: '10%' }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/**
 * Evidence collection spinner
 */
function EvidenceSpinner({ size, color }: { size: number; color: string }) {
  const icons = ['🔍', '📋', '🔎', '📁'];
  const iconSize = size / 4;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Rotating icons */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {icons.map((icon, i) => {
          const angle = (i * 360) / icons.length;
          const rad = (angle * Math.PI) / 180;
          const x = size / 2 + (size / 3) * Math.cos(rad) - iconSize / 2;
          const y = size / 2 + (size / 3) * Math.sin(rad) - iconSize / 2;
          return (
            <motion.span
              key={i}
              className="absolute"
              style={{
                left: x,
                top: y,
                fontSize: iconSize,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            >
              {icon}
            </motion.span>
          );
        })}
      </motion.div>
      {/* Center dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: size / 6,
          height: size / 6,
          left: size / 2 - size / 12,
          top: size / 2 - size / 12,
          boxShadow: `0 0 ${size / 8}px ${color}`,
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
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
            boxShadow: `0 0 ${dotSize / 2}px ${color}80`,
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
          boxShadow: `0 0 ${size / 4}px ${color}`,
        }}
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </div>
  );
}

/**
 * Full page loading overlay with detective styling
 */
interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  variant?: 'default' | 'detective' | 'fingerprint' | 'evidence';
  priority?: 'routine' | 'urgent' | 'classified';
  className?: string;
}

export function LoadingOverlay({
  show,
  text = 'ANALYZING...',
  variant = 'detective',
  priority = 'routine',
  className = ''
}: LoadingOverlayProps) {
  if (!show) return null;

  const priorityStyles = {
    routine: {
      border: 'border-amber-600/50',
      text: 'text-amber-400',
      bg: 'bg-amber-600/10',
    },
    urgent: {
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      bg: 'bg-yellow-600/10',
    },
    classified: {
      border: 'border-red-600/50',
      text: 'text-red-400',
      bg: 'bg-red-600/10',
    },
  };

  const styles = priorityStyles[priority];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm ${className}`}
    >
      <div className={`${styles.bg} border-2 ${styles.border} p-8 flex flex-col items-center gap-6`}>
        {/* Priority indicator */}
        {priority !== 'routine' && (
          <div className={`${styles.text} font-mono text-xs tracking-widest animate-pulse`}>
            {priority === 'classified' ? '⚠ CLASSIFIED ACCESS' : '⚡ PRIORITY TASK'}
          </div>
        )}

        <LoadingSpinner size="lg" variant={variant} />

        <div className="text-center">
          <span className={`${styles.text} font-mono font-bold tracking-widest`}>
            {text}
          </span>
          {/* Animated dots */}
          <motion.span
            className={styles.text}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </div>

        {/* Scanning effect */}
        <div className="w-48 h-1 bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Inline loading indicator with detective styling
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
      {text && (
        <span className="text-amber-400 font-mono text-sm tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Button loading state with detective styling
 */
export function ButtonLoader({
  color = 'white',
  size = 'sm'
}: {
  color?: 'white' | 'amber';
  size?: 'sm' | 'md';
}) {
  return <LoadingSpinner size={size} variant="default" color={color} />;
}

/**
 * Case file loading indicator
 */
export function CaseFileLoader({
  message = 'ACCESSING CASE FILES',
  className = ''
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 p-8 ${className}`}>
      <LoadingSpinner size="lg" variant="evidence" />
      <div className="text-center">
        <div className="text-amber-400 font-mono font-bold text-sm tracking-widest mb-1">
          {message}
        </div>
        <motion.div
          className="text-slate-500 font-mono text-xs"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PLEASE STAND BY
        </motion.div>
      </div>
      {/* Progress bar */}
      <div className="w-48 h-1 bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: '0%' }}
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

export default LoadingSpinner;
