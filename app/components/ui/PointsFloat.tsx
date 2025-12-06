'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

interface FloatingPoint {
  id: string;
  value: number;
  x: number;
  y: number;
  type: 'points' | 'bonus' | 'streak' | 'combo';
}

interface PointsFloatProps {
  points: FloatingPoint[];
  onComplete?: (id: string) => void;
}

/**
 * Floating points animation component
 * Shows "+10 points" style animations floating upward
 */
export function PointsFloat({ points, onComplete }: PointsFloatProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{
              opacity: 0,
              y: 0,
              x: point.x,
              scale: 0.5
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -100,
              scale: [0.5, 1.2, 1, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              times: [0, 0.2, 0.8, 1]
            }}
            onAnimationComplete={() => onComplete?.(point.id)}
            className="absolute font-bold text-2xl"
            style={{
              top: point.y,
              left: point.x,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className={getPointStyle(point.type, point.value)}>
              {getPointText(point.type, point.value)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getPointStyle(type: FloatingPoint['type'], value: number): string {
  const baseStyle = 'drop-shadow-lg';

  switch (type) {
    case 'bonus':
      return `${baseStyle} text-purple-400 text-3xl`;
    case 'streak':
      return `${baseStyle} text-orange-400 text-3xl`;
    case 'combo':
      return `${baseStyle} text-pink-400 text-4xl`;
    case 'points':
    default:
      return value >= 20
        ? `${baseStyle} text-amber-400 text-3xl`
        : `${baseStyle} text-amber-300 text-2xl`;
  }
}

function getPointText(type: FloatingPoint['type'], value: number): string {
  switch (type) {
    case 'bonus':
      return `+${value} BONUS!`;
    case 'streak':
      return `+${value} STREAK!`;
    case 'combo':
      return `x${value} COMBO!`;
    case 'points':
    default:
      return `+${value}`;
  }
}

/**
 * Hook for managing floating points
 */
export function usePointsFloat() {
  const [points, setPoints] = useState<FloatingPoint[]>([]);

  const addPoints = useCallback((
    value: number,
    position?: { x: number; y: number },
    type: FloatingPoint['type'] = 'points'
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = position?.x ?? window.innerWidth / 2;
    const y = position?.y ?? window.innerHeight / 2;

    setPoints((prev) => [...prev, { id, value, x, y, type }]);

    // Auto-remove after animation
    setTimeout(() => {
      setPoints((prev) => prev.filter((p) => p.id !== id));
    }, 1600);
  }, []);

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { points, addPoints, removePoint };
}

/**
 * Single floating point component for simple usage
 */
interface SinglePointFloatProps {
  value: number;
  show: boolean;
  type?: FloatingPoint['type'];
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export function SinglePointFloat({
  value,
  show,
  type = 'points',
  position,
  onComplete
}: SinglePointFloatProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -80,
            scale: [0.5, 1.3, 1, 0.8]
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            times: [0, 0.15, 0.7, 1]
          }}
          onAnimationComplete={onComplete}
          className="absolute font-bold pointer-events-none z-50"
          style={position ? {
            top: position.y,
            left: position.x,
            transform: 'translate(-50%, -50%)'
          } : {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className={getPointStyle(type, value)}>
            {getPointText(type, value)}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PointsFloat;
