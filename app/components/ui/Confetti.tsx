'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  onComplete?: () => void;
}

/**
 * Confetti celebration component
 * Triggers confetti explosion on success events
 */
export function Confetti({
  trigger = false,
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.6 },
  colors = ['#FBBF24', '#22C55E', '#3B82F6', '#EC4899', '#F97316'],
  onComplete,
}: ConfettiProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fireConfetti = useCallback(() => {
    // Fire multiple bursts for a more impressive effect
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 60,
        spread,
        origin: { x: 0, y: origin.y },
        colors,
      });
      confetti({
        particleCount: Math.floor(particleCount / 10),
        angle: 120,
        spread,
        origin: { x: 1, y: origin.y },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    frame();
  }, [duration, particleCount, spread, origin, colors, onComplete]);

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

  return null; // This component doesn't render anything visible
}

/**
 * Hook for triggering confetti imperatively
 */
export function useConfetti() {
  const fire = useCallback((options?: Partial<ConfettiProps>) => {
    const {
      particleCount = 100,
      spread = 70,
      origin = { x: 0.5, y: 0.6 },
      colors = ['#FBBF24', '#22C55E', '#3B82F6', '#EC4899', '#F97316'],
    } = options || {};

    // Center burst
    confetti({
      particleCount,
      spread,
      origin,
      colors,
    });
  }, []);

  const fireSuccess = useCallback(() => {
    // Special success celebration
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#22C55E', '#FBBF24', '#10B981'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const fireAchievement = useCallback(() => {
    // Gold and purple for achievements
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#FBBF24', '#A855F7', '#F59E0B'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const fireStars = useCallback(() => {
    // Star-shaped confetti for special occasions
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['#FBBF24', '#FFD700', '#FFA500'],
      origin: { x: 0.5, y: 0.5 },
    });
  }, []);

  return { fire, fireSuccess, fireAchievement, fireStars };
}

export default Confetti;
