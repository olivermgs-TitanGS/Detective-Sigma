'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

// Film noir style wipe transition
export function FilmWipeTransition({
  isActive,
  direction = 'right',
  children,
  onComplete,
}: {
  isActive: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  children: ReactNode;
  onComplete?: () => void;
}) {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (isActive) {
      playSound('sceneTransition');
    }
  }, [isActive, playSound]);

  const directionVariants = {
    left: { initial: { x: '-100%' }, exit: { x: '100%' } },
    right: { initial: { x: '100%' }, exit: { x: '-100%' } },
    up: { initial: { y: '-100%' }, exit: { y: '100%' } },
    down: { initial: { y: '100%' }, exit: { y: '-100%' } },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isActive && (
        <motion.div
          key="film-wipe"
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Film grain overlay */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Wipe panels */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-slate-900 to-black border-x border-amber-900/30"
              style={{
                [direction === 'left' || direction === 'right' ? 'height' : 'width']: '100%',
                [direction === 'left' || direction === 'right' ? 'width' : 'height']: '20%',
                [direction === 'left' || direction === 'right' ? 'top' : 'left']: 0,
                [direction === 'left' ? 'left' : direction === 'right' ? 'right' : direction === 'up' ? 'top' : 'bottom']: 0,
              }}
              initial={directionVariants[direction].initial}
              animate={{ x: 0, y: 0 }}
              exit={directionVariants[direction].exit}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Content reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Typewriter scene title card
export function SceneTitleCard({
  title,
  subtitle,
  location,
  isVisible,
  onComplete,
}: {
  title: string;
  subtitle?: string;
  location?: string;
  isVisible: boolean;
  onComplete?: () => void;
}) {
  const { playSound } = useSoundEffects();
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedTitle('');
      setShowSubtitle(false);
      return;
    }

    playSound('sceneTransition');

    let i = 0;
    const interval = setInterval(() => {
      if (i < title.length) {
        setDisplayedTitle(title.slice(0, i + 1));
        if (i % 2 === 0) playSound('typewriter');
        i++;
      } else {
        clearInterval(interval);
        setShowSubtitle(true);
        setTimeout(() => onComplete?.(), 1500);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isVisible, title, playSound, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Film grain */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
            }}
          />

          {/* Content */}
          <div className="text-center relative">
            {location && (
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-amber-600 font-mono text-sm tracking-[0.5em] mb-4"
              >
                {location}
              </motion.p>
            )}

            <h1 className="text-amber-100 font-mono text-4xl md:text-6xl font-bold tracking-wider">
              {displayedTitle}
              <motion.span
                className="inline-block w-1 h-12 bg-amber-500 ml-2"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </h1>

            <AnimatePresence>
              {showSubtitle && subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-400 font-mono text-lg mt-4 tracking-wide"
                >
                  {subtitle}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Decorative lines */}
            <motion.div
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-amber-600" />
              <span className="text-amber-600">◆</span>
              <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-amber-600" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Dramatic iris/circle wipe (classic film noir)
export function IrisWipe({
  isOpen,
  centerX = 50,
  centerY = 50,
  onComplete,
}: {
  isOpen: boolean;
  centerX?: number;
  centerY?: number;
  onComplete?: () => void;
}) {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playSound('sceneTransition');
    }
  }, [isOpen, playSound]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <mask id="iris-mask">
                <rect width="100" height="100" fill="white" />
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  fill="black"
                  initial={{ r: 150 }}
                  animate={{ r: 0 }}
                  exit={{ r: 150 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </mask>
            </defs>
            <rect
              width="100"
              height="100"
              fill="black"
              mask="url(#iris-mask)"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Evidence reveal transition
export function EvidenceReveal({
  isActive,
  evidenceName,
  onComplete,
}: {
  isActive: boolean;
  evidenceName: string;
  onComplete?: () => void;
}) {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (isActive) {
      playSound('clueFound');
    }
  }, [isActive, playSound]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Spotlight effect */}
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 0.5 }}
          />

          {/* Evidence found text */}
          <motion.div
            className="text-center relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              🔍
            </motion.div>

            <motion.p
              className="text-amber-400 font-mono text-sm tracking-[0.5em] mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              EVIDENCE FOUND
            </motion.p>

            <motion.h2
              className="text-amber-100 font-mono text-3xl font-bold tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {evidenceName}
            </motion.h2>

            {/* Stamp effect */}
            <motion.div
              className="absolute -right-10 -top-10 text-red-600 font-mono text-xl font-bold border-4 border-red-600 px-4 py-2 rotate-12"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 12 }}
              transition={{ delay: 1, type: 'spring', stiffness: 500 }}
            >
              COLLECTED
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Case solved dramatic reveal
export function CaseSolvedTransition({
  isActive,
  caseName,
  onComplete,
}: {
  isActive: boolean;
  caseName: string;
  onComplete?: () => void;
}) {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (isActive) {
      playSound('achievement');
    }
  }, [isActive, playSound]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Golden rays */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 bg-gradient-to-t from-amber-600/0 via-amber-500/50 to-amber-600/0"
                style={{
                  height: '200%',
                  transformOrigin: 'center',
                }}
                initial={{ rotate: i * 30, scaleY: 0 }}
                animate={{ rotate: i * 30, scaleY: 1 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
              />
            ))}
          </motion.div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, delay: 1 }}
              >
                🎉
              </motion.div>

              <motion.p
                className="text-amber-400 font-mono text-2xl tracking-[0.5em] mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                CASE SOLVED
              </motion.p>

              <motion.h2
                className="text-amber-100 font-mono text-4xl font-bold tracking-wider"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                {caseName}
              </motion.h2>

              {/* Stamp */}
              <motion.div
                className="mt-8 inline-block border-4 border-green-500 text-green-500 font-mono text-xl font-bold px-6 py-3"
                initial={{ scale: 3, opacity: 0, rotate: 30 }}
                animate={{ scale: 1, opacity: 1, rotate: -5 }}
                transition={{ delay: 2.2, type: 'spring', stiffness: 500 }}
              >
                ✓ CLOSED
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                onClick={onComplete}
                className="block mx-auto mt-8 px-8 py-3 bg-amber-600 text-black font-mono font-bold tracking-wider hover:bg-amber-500 transition-colors"
              >
                VIEW RESULTS
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Dramatic flashback/memory transition
export function FlashbackTransition({
  isActive,
  children,
}: {
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Sepia overlay */}
          <div className="absolute inset-0 bg-amber-900/30 mix-blend-overlay pointer-events-none" />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Film scratches animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 h-full"
            initial={{ filter: 'blur(10px)' }}
            animate={{ filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>

          {/* "Flashback" label */}
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2 text-amber-300 font-mono text-sm tracking-[0.5em] opacity-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.5, y: 0 }}
          >
            — FLASHBACK —
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
