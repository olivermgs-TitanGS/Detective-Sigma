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
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  rippleColor?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

/**
 * Button with Material-style ripple effect
 * Click creates expanding circle animation
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
      base: 'bg-amber-600 hover:bg-amber-500 text-white',
      ripple: 'rgba(255, 255, 255, 0.4)',
    },
    secondary: {
      base: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
      ripple: 'rgba(255, 255, 255, 0.3)',
    },
    outline: {
      base: 'bg-transparent border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10',
      ripple: 'rgba(245, 158, 11, 0.3)',
    },
    ghost: {
      base: 'bg-transparent text-slate-300 hover:bg-slate-700/50',
      ripple: 'rgba(255, 255, 255, 0.2)',
    },
    danger: {
      base: 'bg-red-600 hover:bg-red-500 text-white',
      ripple: 'rgba(255, 255, 255, 0.4)',
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
        relative overflow-hidden rounded-lg font-mono font-semibold
        transition-colors duration-200
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
            className="absolute rounded-full pointer-events-none"
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
 * Icon button with ripple effect
 */
interface RippleIconButtonProps {
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost';
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
    default: 'bg-slate-700 hover:bg-slate-600 text-slate-300',
    primary: 'bg-amber-600 hover:bg-amber-500 text-white',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-400',
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
        relative overflow-hidden rounded-full
        flex items-center justify-center
        transition-colors duration-200
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
            className="absolute rounded-full pointer-events-none bg-white/30"
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
 * Floating action button with ripple
 */
interface FABProps {
  icon: ReactNode;
  onClick?: () => void;
  color?: 'amber' | 'green' | 'blue' | 'purple';
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
    amber: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/30',
    green: 'bg-green-600 hover:bg-green-500 shadow-green-500/30',
    blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30',
    purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30',
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
        rounded-full flex items-center justify-center
        text-white shadow-lg
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

export default RippleButton;
