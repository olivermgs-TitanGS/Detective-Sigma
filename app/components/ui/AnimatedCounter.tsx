'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now() + delay * 1000;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * endValue);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView, delay]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Percentage counter with ring
export function PercentageRing({
  value,
  size = 80,
  strokeWidth = 8,
  color = 'amber',
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: 'amber' | 'green' | 'blue' | 'red';
  label?: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref as any, { once: true });
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const colors = {
    amber: { stroke: 'stroke-amber-500', text: 'text-amber-400' },
    green: { stroke: 'stroke-green-500', text: 'text-green-400' },
    blue: { stroke: 'stroke-blue-500', text: 'text-blue-400' },
    red: { stroke: 'stroke-red-500', text: 'text-red-400' },
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-700 fill-none"
        />
        {/* Progress circle */}
        <motion.circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${colors[color].stroke} fill-none`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedCounter
          value={value}
          suffix="%"
          className={`text-lg font-bold font-mono ${colors[color].text}`}
          duration={1.5}
        />
        {label && (
          <span className="text-xs text-slate-400 font-mono mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}
