'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, MouseEvent, ReactNode } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'evidence' | 'classified' | 'caseFile';
  size?: 'sm' | 'md' | 'lg';
  rippleColor?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

/**
 * Detective-themed button with ripple effect
 * Crime scene and evidence styling variants
 */
export function RippleButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  rippleColor,
  className = '',
  type = 'button',
  fullWidth = false,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const variantStyles = {
    primary: {
      base: 'bg-amber-600 hover:bg-amber-500 text-white border-2 border-amber-500',
      ripple: 'rgba(255, 255, 255, 0.4)',
    },
    secondary: {
      base: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600',
      ripple: 'rgba(255, 255, 255, 0.3)',
    },
    outline: {
      base: 'bg-transparent border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10',
      ripple: 'rgba(245, 158, 11, 0.3)',
    },
    ghost: {
      base: 'bg-transparent text-slate-300 hover:bg-slate-800/50 border-2 border-transparent',
      ripple: 'rgba(255, 255, 255, 0.2)',
    },
    danger: {
      base: 'bg-red-700 hover:bg-red-600 text-white border-2 border-red-500',
      ripple: 'rgba(255, 255, 255, 0.4)',
    },
    evidence: {
      base: 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-2 border-amber-400',
      ripple: 'rgba(251, 191, 36, 0.5)',
    },
    classified: {
      base: 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white border-2 border-red-500',
      ripple: 'rgba(239, 68, 68, 0.4)',
    },
    caseFile: {
      base: 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-2 border-amber-600/50 hover:border-amber-500',
      ripple: 'rgba(245, 158, 11, 0.3)',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  }, [disabled, onClick]);

  const styles = variantStyles[variant];
  const actualRippleColor = rippleColor || styles.ripple;

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative overflow-hidden font-mono font-semibold tracking-wider
        transition-all duration-200
        ${styles.base}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              backgroundColor: actualRippleColor,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Evidence action button with ripple
 */
interface EvidenceButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  importance?: 'minor' | 'moderate' | 'major';
  className?: string;
}

export function EvidenceButton({
  children,
  onClick,
  disabled = false,
  size = 'md',
  importance = 'moderate',
  className = '',
}: EvidenceButtonProps) {
  const importanceStyles = {
    minor: {
      base: 'bg-slate-800 hover:bg-slate-700 text-green-400 border-green-600/50 hover:border-green-500',
      icon: '📋',
    },
    moderate: {
      base: 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-600/50 hover:border-amber-500',
      icon: '🔍',
    },
    major: {
      base: 'bg-slate-800 hover:bg-slate-700 text-red-400 border-red-600/50 hover:border-red-500',
      icon: '⚠️',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const styles = importanceStyles[importance];

  return (
    <RippleButton
      onClick={onClick}
      disabled={disabled}
      className={`border-2 ${styles.base} ${sizeStyles[size]} ${className}`}
      variant="caseFile"
    >
      <span className="mr-2">{styles.icon}</span>
      {children}
    </RippleButton>
  );
}

/**
 * Icon button with ripple effect - Detective styled
 */
interface RippleIconButtonProps {
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost' | 'evidence';
  label?: string;
  className?: string;
}

export function RippleIconButton({
  icon,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  className = '',
}: RippleIconButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const sizeConfig = {
    sm: { dimension: 32, iconSize: 'text-sm' },
    md: { dimension: 40, iconSize: 'text-base' },
    lg: { dimension: 48, iconSize: 'text-lg' },
  };

  const variantStyles = {
    default: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600',
    primary: 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 border-transparent',
    evidence: 'bg-amber-900/50 hover:bg-amber-800/50 text-amber-400 border-amber-600/50',
  };

  const config = sizeConfig[size];

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  }, [disabled, onClick]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`
        relative overflow-hidden border-2
        flex items-center justify-center
        transition-all duration-200
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        width: config.dimension,
        height: config.dimension,
      }}
      title={label}
    >
      <span className={`relative z-10 ${config.iconSize}`}>{icon}</span>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: config.dimension,
              height: config.dimension,
              marginLeft: -config.dimension / 2,
              marginTop: -config.dimension / 2,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Floating action button with detective styling
 */
interface FABProps {
  icon: ReactNode;
  onClick?: () => void;
  color?: 'amber' | 'green' | 'blue' | 'red' | 'evidence';
  size?: 'md' | 'lg';
  label?: string;
  className?: string;
}

export function FAB({
  icon,
  onClick,
  color = 'amber',
  size = 'md',
  label,
  className = '',
}: FABProps) {
  const colorStyles = {
    amber: 'bg-amber-600 hover:bg-amber-500 border-amber-400 shadow-amber-500/30',
    green: 'bg-green-600 hover:bg-green-500 border-green-400 shadow-green-500/30',
    blue: 'bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-blue-500/30',
    red: 'bg-red-600 hover:bg-red-500 border-red-400 shadow-red-500/30',
    evidence: 'bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-400 shadow-amber-500/40',
  };

  const sizeStyles = {
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center justify-center
        text-white shadow-lg border-2
        transition-colors duration-200
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${className}
      `}
      title={label}
    >
      {icon}
    </motion.button>
  );
}

/**
 * Case file action button
 */
interface CaseActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  action?: 'investigate' | 'interrogate' | 'analyze' | 'close';
  className?: string;
}

export function CaseActionButton({
  children,
  onClick,
  disabled = false,
  action = 'investigate',
  className = '',
}: CaseActionButtonProps) {
  const actionStyles = {
    investigate: {
      bg: 'bg-amber-900/50 hover:bg-amber-800/50',
      border: 'border-amber-600',
      text: 'text-amber-400',
      icon: '🔍',
    },
    interrogate: {
      bg: 'bg-blue-900/50 hover:bg-blue-800/50',
      border: 'border-blue-600',
      text: 'text-blue-400',
      icon: '💬',
    },
    analyze: {
      bg: 'bg-purple-900/50 hover:bg-purple-800/50',
      border: 'border-purple-600',
      text: 'text-purple-400',
      icon: '🧪',
    },
    close: {
      bg: 'bg-green-900/50 hover:bg-green-800/50',
      border: 'border-green-600',
      text: 'text-green-400',
      icon: '✅',
    },
  };

  const styles = actionStyles[action];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative px-6 py-3 font-mono font-bold tracking-wider
        border-2 transition-all duration-200
        ${styles.bg} ${styles.border} ${styles.text}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        <span>{styles.icon}</span>
        {children}
      </span>
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${styles.border}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${styles.border}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${styles.border}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${styles.border}`} />
    </motion.button>
  );
}

export default RippleButton;
