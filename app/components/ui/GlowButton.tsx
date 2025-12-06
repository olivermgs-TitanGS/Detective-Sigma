'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'amber' | 'green' | 'blue' | 'purple' | 'red' | 'evidence' | 'classified' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  glowIntensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Detective-themed button with ambient glow effect
 * Evidence, classified, and badge styling variants
 */
export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(({
  children,
  onClick,
  disabled = false,
  variant = 'amber',
  size = 'md',
  glowIntensity = 'medium',
  pulse = false,
  fullWidth = false,
  className = '',
  type = 'button',
}, ref) => {
  const variantStyles = {
    amber: {
      bg: 'bg-gradient-to-r from-amber-700 to-amber-600',
      glow: 'shadow-amber-500',
      text: 'text-white',
      hover: 'hover:from-amber-600 hover:to-amber-500',
      border: 'border-amber-400',
    },
    green: {
      bg: 'bg-gradient-to-r from-green-700 to-emerald-600',
      glow: 'shadow-green-500',
      text: 'text-white',
      hover: 'hover:from-green-600 hover:to-emerald-500',
      border: 'border-green-400',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-700 to-cyan-600',
      glow: 'shadow-blue-500',
      text: 'text-white',
      hover: 'hover:from-blue-600 hover:to-cyan-500',
      border: 'border-blue-400',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-700 to-pink-600',
      glow: 'shadow-purple-500',
      text: 'text-white',
      hover: 'hover:from-purple-600 hover:to-pink-500',
      border: 'border-purple-400',
    },
    red: {
      bg: 'bg-gradient-to-r from-red-700 to-orange-600',
      glow: 'shadow-red-500',
      text: 'text-white',
      hover: 'hover:from-red-600 hover:to-orange-500',
      border: 'border-red-400',
    },
    evidence: {
      bg: 'bg-gradient-to-r from-amber-800 via-amber-700 to-yellow-700',
      glow: 'shadow-amber-400',
      text: 'text-white',
      hover: 'hover:from-amber-700 hover:via-amber-600 hover:to-yellow-600',
      border: 'border-amber-300',
    },
    classified: {
      bg: 'bg-gradient-to-r from-red-900 via-red-800 to-red-700',
      glow: 'shadow-red-600',
      text: 'text-white',
      hover: 'hover:from-red-800 hover:via-red-700 hover:to-red-600',
      border: 'border-red-400',
    },
    badge: {
      bg: 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700',
      glow: 'shadow-amber-400',
      text: 'text-white',
      hover: 'hover:from-amber-400 hover:via-amber-500 hover:to-amber-600',
      border: 'border-yellow-300',
    },
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const glowStyles = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl',
  };

  const styles = variantStyles[variant];

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      animate={pulse && !disabled ? {
        boxShadow: [
          `0 0 20px rgba(var(--glow-color), 0.3)`,
          `0 0 40px rgba(var(--glow-color), 0.5)`,
          `0 0 20px rgba(var(--glow-color), 0.3)`,
        ],
      } : {}}
      transition={pulse ? {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      } : {}}
      className={`
        relative font-mono font-bold tracking-wider border-2
        transition-all duration-300 ease-out
        ${styles.bg} ${styles.text} ${styles.hover} ${styles.border}
        ${sizeStyles[size]}
        ${glowStyles[glowIntensity]} ${styles.glow}
        ${fullWidth ? 'w-full' : ''}
        ${disabled
          ? 'opacity-50 cursor-not-allowed shadow-none'
          : 'cursor-pointer hover:shadow-2xl'
        }
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Glow overlay on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-t from-white/0 to-white/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ borderRadius: 'inherit' }}
        />
      )}
    </motion.button>
  );
});

GlowButton.displayName = 'GlowButton';

/**
 * Detective badge call to action button
 */
interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'xl';
  variant?: 'default' | 'investigate' | 'solve';
  className?: string;
}

export function CTAButton({
  children,
  onClick,
  disabled = false,
  size = 'lg',
  variant = 'default',
  className = '',
}: CTAButtonProps) {
  const sizeStyles = {
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const variantStyles = {
    default: {
      bg: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400',
      text: 'text-slate-900',
      shadow: 'shadow-amber-500/30',
    },
    investigate: {
      bg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400',
      text: 'text-white',
      shadow: 'shadow-amber-500/40',
    },
    solve: {
      bg: 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-400',
      text: 'text-white',
      shadow: 'shadow-green-500/40',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative overflow-hidden border-2 border-white/20
        ${styles.bg} ${styles.text}
        font-bold font-mono tracking-wider
        shadow-lg ${styles.shadow}
        transition-all duration-300
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Animated shine */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

/**
 * Outline button with glow border - Detective styled
 */
interface GlowOutlineButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'evidence';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlowOutlineButton({
  children,
  onClick,
  disabled = false,
  color = 'amber',
  size = 'md',
  className = '',
}: GlowOutlineButtonProps) {
  const colorStyles = {
    amber: {
      border: 'border-amber-500',
      text: 'text-amber-400',
      glow: 'hover:shadow-amber-500/50',
      bg: 'hover:bg-amber-500/10',
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-400',
      glow: 'hover:shadow-green-500/50',
      bg: 'hover:bg-green-500/10',
    },
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-400',
      glow: 'hover:shadow-blue-500/50',
      bg: 'hover:bg-blue-500/10',
    },
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-400',
      glow: 'hover:shadow-purple-500/50',
      bg: 'hover:bg-purple-500/10',
    },
    evidence: {
      border: 'border-amber-400',
      text: 'text-amber-300',
      glow: 'hover:shadow-amber-400/60',
      bg: 'hover:bg-amber-500/15',
    },
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const styles = colorStyles[color];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        bg-transparent border-2
        font-mono font-semibold tracking-wider
        transition-all duration-300
        ${styles.border} ${styles.text} ${styles.glow} ${styles.bg}
        ${sizeStyles[size]}
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-lg'
        }
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

/**
 * Icon button with glow - Detective styled
 */
interface GlowIconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'evidence';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function GlowIconButton({
  icon,
  onClick,
  disabled = false,
  color = 'amber',
  size = 'md',
  label,
  className = '',
}: GlowIconButtonProps) {
  const colorStyles = {
    amber: 'bg-amber-600 hover:bg-amber-500 border-amber-400 shadow-amber-500/40',
    green: 'bg-green-600 hover:bg-green-500 border-green-400 shadow-green-500/40',
    blue: 'bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-blue-500/40',
    purple: 'bg-purple-600 hover:bg-purple-500 border-purple-400 shadow-purple-500/40',
    evidence: 'bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-400 shadow-amber-500/50',
  };

  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`
        flex items-center justify-center border-2
        text-white shadow-lg
        transition-all duration-300
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:shadow-xl'}
        ${className}
      `}
      title={label}
    >
      {icon}
    </motion.button>
  );
}

/**
 * Evidence tag button
 */
interface EvidenceTagButtonProps {
  children: ReactNode;
  onClick?: () => void;
  importance?: 'minor' | 'moderate' | 'major';
  collected?: boolean;
  className?: string;
}

export function EvidenceTagButton({
  children,
  onClick,
  importance = 'moderate',
  collected = false,
  className = '',
}: EvidenceTagButtonProps) {
  const importanceStyles = {
    minor: {
      bg: collected ? 'bg-green-900/50' : 'bg-slate-800',
      border: collected ? 'border-green-600' : 'border-green-600/30',
      text: collected ? 'text-green-400' : 'text-green-500/70',
    },
    moderate: {
      bg: collected ? 'bg-amber-900/50' : 'bg-slate-800',
      border: collected ? 'border-amber-500' : 'border-amber-600/30',
      text: collected ? 'text-amber-400' : 'text-amber-500/70',
    },
    major: {
      bg: collected ? 'bg-red-900/50' : 'bg-slate-800',
      border: collected ? 'border-red-500' : 'border-red-600/30',
      text: collected ? 'text-red-400' : 'text-red-500/70',
    },
  };

  const styles = importanceStyles[importance];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-4 py-2 font-mono text-sm tracking-wider
        border-2 transition-all duration-200
        ${styles.bg} ${styles.border} ${styles.text}
        ${className}
      `}
    >
      {/* Evidence tag hole */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-900 border border-slate-600" />
      <span className="ml-2 flex items-center gap-2">
        {collected && <span>✓</span>}
        {children}
      </span>
    </motion.button>
  );
}

/**
 * Case file tab button
 */
interface CaseTabButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function CaseTabButton({
  children,
  onClick,
  active = false,
  className = '',
}: CaseTabButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: active ? 0 : -2 }}
      className={`
        relative px-6 py-3 font-mono font-bold text-sm tracking-wider
        border-t-2 border-l-2 border-r-2 transition-all duration-200
        ${active
          ? 'bg-slate-900 border-amber-500 text-amber-400 -mb-px z-10'
          : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:text-amber-400 hover:border-amber-600/50'
        }
        ${className}
      `}
      style={{
        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {children}
    </motion.button>
  );
}

export default GlowButton;
