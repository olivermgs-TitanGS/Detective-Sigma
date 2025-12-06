'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'amber' | 'green' | 'blue' | 'purple' | 'red' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  glowIntensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button with ambient glow effect on hover
 * Multiple color variants with pulsing option
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
      bg: 'bg-gradient-to-r from-amber-600 to-amber-500',
      glow: 'shadow-amber-500',
      text: 'text-white',
      hover: 'hover:from-amber-500 hover:to-amber-400',
    },
    green: {
      bg: 'bg-gradient-to-r from-green-600 to-emerald-500',
      glow: 'shadow-green-500',
      text: 'text-white',
      hover: 'hover:from-green-500 hover:to-emerald-400',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      glow: 'shadow-blue-500',
      text: 'text-white',
      hover: 'hover:from-blue-500 hover:to-cyan-400',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-600 to-pink-500',
      glow: 'shadow-purple-500',
      text: 'text-white',
      hover: 'hover:from-purple-500 hover:to-pink-400',
    },
    red: {
      bg: 'bg-gradient-to-r from-red-600 to-orange-500',
      glow: 'shadow-red-500',
      text: 'text-white',
      hover: 'hover:from-red-500 hover:to-orange-400',
    },
    gradient: {
      bg: 'bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500',
      glow: 'shadow-purple-500',
      text: 'text-white',
      hover: 'hover:from-amber-400 hover:via-purple-400 hover:to-blue-400',
    },
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
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
        relative font-mono font-bold
        transition-all duration-300 ease-out
        ${styles.bg} ${styles.text} ${styles.hover}
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
          className={`
            absolute inset-0 rounded-inherit opacity-0
            bg-gradient-to-t from-white/0 to-white/20
          `}
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
 * Call to action button with extra emphasis
 */
interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export function CTAButton({
  children,
  onClick,
  disabled = false,
  size = 'lg',
  className = '',
}: CTAButtonProps) {
  const sizeStyles = {
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400
        text-slate-900 font-bold font-mono
        rounded-xl shadow-lg shadow-amber-500/30
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
 * Outline button with glow border
 */
interface GlowOutlineButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'amber' | 'green' | 'blue' | 'purple';
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
        bg-transparent border-2 rounded-lg
        font-mono font-semibold
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
 * Icon button with glow
 */
interface GlowIconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'amber' | 'green' | 'blue' | 'purple';
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
    amber: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/40',
    green: 'bg-green-600 hover:bg-green-500 shadow-green-500/40',
    blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/40',
    purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/40',
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
        rounded-full flex items-center justify-center
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

export default GlowButton;
