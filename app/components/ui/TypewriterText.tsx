'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  cursor?: boolean;
  /** Enable subtle typewriter sound effects */
  sound?: boolean;
  /** Minimum interval between sounds in ms (prevents audio overload) */
  soundInterval?: number;
}

export function TypewriterText({
  text,
  delay = 0,
  speed = 100,
  className = '',
  style = {},
  onComplete,
  cursor = true,
  sound = true,
  soundInterval = 60,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const lastSoundTime = useRef(0);
  const { playSound, isMuted } = useSoundEffects();

  // Throttled sound player to prevent audio overload
  const playTypingSound = useCallback(() => {
    if (!sound || isMuted) return;

    const now = Date.now();
    if (now - lastSoundTime.current >= soundInterval) {
      lastSoundTime.current = now;
      playSound('typewriter');
    }
  }, [sound, isMuted, soundInterval, playSound]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        const nextChar = text[displayedText.length];
        setDisplayedText(text.slice(0, displayedText.length + 1));

        // Play sound for non-space characters to feel more natural
        if (nextChar && nextChar !== ' ' && nextChar !== '\n') {
          playTypingSound();
        }
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, hasStarted, onComplete, playTypingSound]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-1"
          style={{ color: 'inherit' }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  style = {},
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, hasStarted]);

  return (
    <span className={className} style={style}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default TypewriterText;
