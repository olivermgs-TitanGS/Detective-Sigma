'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Detective-themed color palettes
const DETECTIVE_COLORS = {
  evidence: ['#FBBF24', '#F59E0B', '#D97706'], // Gold/amber evidence markers
  caseFile: ['#DC2626', '#EF4444', '#F87171'], // Red case file stamps
  magnifyingGlass: ['#60A5FA', '#3B82F6', '#2563EB'], // Blue lens effects
  fingerprint: ['#A3A3A3', '#737373', '#525252'], // Gray fingerprint dust
  success: ['#22C55E', '#16A34A', '#15803D'], // Green success
  badge: ['#FBBF24', '#F59E0B', '#92400E'], // Gold detective badge
};

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  variant?: 'default' | 'evidence' | 'caseSolved' | 'clueFound' | 'badge';
  onComplete?: () => void;
}

/**
 * Detective-themed confetti celebration component
 * Triggers themed particle explosions on success events
 */
export function Confetti({
  trigger = false,
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.6 },
  colors,
  variant = 'default',
  onComplete,
}: ConfettiProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get colors based on variant
  const getColors = () => {
    if (colors) return colors;
    switch (variant) {
      case 'evidence': return DETECTIVE_COLORS.evidence;
      case 'caseSolved': return [...DETECTIVE_COLORS.success, ...DETECTIVE_COLORS.badge];
      case 'clueFound': return DETECTIVE_COLORS.magnifyingGlass;
      case 'badge': return DETECTIVE_COLORS.badge;
      default: return DETECTIVE_COLORS.evidence;
    }
  };

  const fireConfetti = useCallback(() => {
    const end = Date.now() + duration;
    const themeColors = getColors();

    const frame = () => {
      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 60,
        spread,
        origin: { x: 0, y: origin.y },
        colors: themeColors,
        shapes: ['circle', 'square'],
        scalar: 0.8,
      });
      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 120,
        spread,
        origin: { x: 1, y: origin.y },
        colors: themeColors,
        shapes: ['circle', 'square'],
        scalar: 0.8,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    frame();
  }, [duration, particleCount, spread, origin, colors, variant, onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trigger, fireConfetti]);

  return null;
}

/**
 * Detective-themed confetti hooks
 */
export function useConfetti() {
  // Basic confetti burst
  const fire = useCallback((options?: Partial<ConfettiProps>) => {
    const {
      particleCount = 100,
      spread = 70,
      origin = { x: 0.5, y: 0.6 },
      colors = DETECTIVE_COLORS.evidence,
    } = options || {};

    confetti({
      particleCount,
      spread,
      origin,
      colors,
      shapes: ['circle', 'square'],
    });
  }, []);

  // Case Solved celebration - big dramatic effect
  const fireSuccess = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: [...DETECTIVE_COLORS.success, ...DETECTIVE_COLORS.badge],
      shapes: ['circle', 'square'] as confetti.Shape[],
    };

    function burst(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Multiple bursts for dramatic effect
    burst(0.25, { spread: 26, startVelocity: 55 });
    burst(0.2, { spread: 60 });
    burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    burst(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  // Evidence Found - subtle sparkle effect
  const fireEvidence = useCallback(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: 0.5, y: 0.5 },
      colors: DETECTIVE_COLORS.evidence,
      shapes: ['circle'],
      scalar: 0.6,
      gravity: 0.8,
      ticks: 100,
    });
  }, []);

  // Clue Found - magnifying glass sparkle
  const fireClueFound = useCallback(() => {
    // Center burst with blue tint
    confetti({
      particleCount: 40,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
      colors: DETECTIVE_COLORS.magnifyingGlass,
      shapes: ['circle'],
      scalar: 0.5,
      gravity: 0.3,
      ticks: 80,
      startVelocity: 15,
    });
  }, []);

  // Achievement/Badge unlock - gold shower
  const fireAchievement = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: DETECTIVE_COLORS.badge,
        shapes: ['circle', 'square'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: DETECTIVE_COLORS.badge,
        shapes: ['circle', 'square'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  // Star confetti for special occasions
  const fireStars = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: DETECTIVE_COLORS.badge,
      origin: { x: 0.5, y: 0.5 },
    });
  }, []);

  // Case File stamp effect - rapid burst
  const fireCaseStamp = useCallback(() => {
    confetti({
      particleCount: 60,
      spread: 40,
      origin: { x: 0.5, y: 0.6 },
      colors: DETECTIVE_COLORS.caseFile,
      shapes: ['square'],
      scalar: 0.7,
      startVelocity: 25,
      gravity: 1.2,
    });
  }, []);

  return {
    fire,
    fireSuccess,
    fireEvidence,
    fireClueFound,
    fireAchievement,
    fireStars,
    fireCaseStamp,
  };
}

/**
 * Floating Evidence Markers - detective themed floating elements
 */
interface EvidenceMarker {
  id: string;
  x: number;
  y: number;
  type: 'magnifier' | 'fingerprint' | 'file' | 'badge' | 'star';
}

interface EvidenceRainProps {
  show: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function EvidenceRain({ show, duration = 3000, onComplete }: EvidenceRainProps) {
  const [markers, setMarkers] = useState<EvidenceMarker[]>([]);

  useEffect(() => {
    if (show) {
      // Generate random evidence markers
      const types: EvidenceMarker['type'][] = ['magnifier', 'fingerprint', 'file', 'badge', 'star'];
      const newMarkers: EvidenceMarker[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        type: types[Math.floor(Math.random() * types.length)],
      }));
      setMarkers(newMarkers);

      const timer = setTimeout(() => {
        setMarkers([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  const getEmoji = (type: EvidenceMarker['type']) => {
    switch (type) {
      case 'magnifier': return '🔍';
      case 'fingerprint': return '👆';
      case 'file': return '📁';
      case 'badge': return '🎖️';
      case 'star': return '⭐';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {markers.map((marker) => (
          <motion.div
            key={marker.id}
            initial={{ y: `${marker.y}vh`, x: `${marker.x}vw`, opacity: 1, rotate: 0 }}
            animate={{
              y: '110vh',
              rotate: Math.random() > 0.5 ? 360 : -360,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random() * 2,
              ease: 'linear',
            }}
            className="absolute text-2xl"
          >
            {getEmoji(marker.type)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Case Solved Stamp Animation
 */
interface CaseSolvedStampProps {
  show: boolean;
  onComplete?: () => void;
}

export function CaseSolvedStamp({ show, onComplete }: CaseSolvedStampProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 3, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: -15 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
          onAnimationComplete={onComplete}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="relative">
            {/* Stamp border */}
            <div className="border-8 border-red-600 rounded-lg px-8 py-4 bg-transparent">
              <span className="text-red-600 text-4xl md:text-6xl font-mono font-black tracking-[0.3em]">
                CASE SOLVED
              </span>
            </div>
            {/* Ink splatter effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full opacity-50"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-600 rounded-full opacity-40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Confetti;
