'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';
  duration?: number;
}

/**
 * Page transition wrapper component
 * Adds smooth animations when mounting/unmounting pages
 */
export function PageTransition({
  children,
  className = '',
  variant = 'fade',
  duration = 0.3,
}: PageTransitionProps) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  };

  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{ duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered children animation wrapper
 * Children animate in sequence with delay
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: initialDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item - use inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideIn';
}

export function StaggerItem({
  children,
  className = '',
  variant = 'fadeUp',
}: StaggerItemProps) {
  const itemVariants = {
    fadeUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    slideIn: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
  };

  return (
    <motion.div
      variants={itemVariants[variant]}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section reveal animation
 * Animates when element enters viewport
 */
interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export function RevealSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: RevealSectionProps) {
  const directionVariants = {
    up: { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    down: { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={directionVariants[direction]}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Modal/overlay transition
 */
interface ModalTransitionProps {
  show: boolean;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function ModalTransition({
  show,
  children,
  className = '',
  onClose,
}: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-50 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Card flip animation
 */
interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  className?: string;
}

export function FlipCard({
  front,
  back,
  isFlipped,
  className = '',
}: FlipCardProps) {
  return (
    <div className={`perspective-1000 ${className}`}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Accordion/collapse transition
 */
interface CollapseTransitionProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapseTransition({
  show,
  children,
  className = '',
}: CollapseTransitionProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Slide panel transition (for sidebars, drawers)
 */
interface SlidePanelProps {
  show: boolean;
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  onClose?: () => void;
}

export function SlidePanel({
  show,
  children,
  direction = 'right',
  className = '',
  onClose,
}: SlidePanelProps) {
  const directionConfig = {
    left: { initial: { x: '-100%' }, position: 'left-0 top-0 h-full' },
    right: { initial: { x: '100%' }, position: 'right-0 top-0 h-full' },
    top: { initial: { y: '-100%' }, position: 'top-0 left-0 w-full' },
    bottom: { initial: { y: '100%' }, position: 'bottom-0 left-0 w-full' },
  };

  const config = directionConfig[direction];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />
          {/* Panel */}
          <motion.div
            initial={config.initial}
            animate={{ x: 0, y: 0 }}
            exit={config.initial}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${config.position} ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Scene transition (for game scenes)
 */
interface SceneTransitionProps {
  children: ReactNode;
  sceneKey: string;
  className?: string;
}

export function SceneTransition({
  children,
  sceneKey,
  className = '',
}: SceneTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;

/**
 * Noir Cinematic Page Transition
 * Full-screen dramatic transition with magnifying glass reveal
 */
interface NoirTransitionProps {
  isTransitioning: boolean;
  message?: string;
}

export function NoirTransition({ isTransitioning, message = 'INVESTIGATING...' }: NoirTransitionProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.95)' }}
        >
          {/* Scanning lines effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 215, 0, 0.1) 2px, rgba(255, 215, 0, 0.1) 4px)',
              animation: 'scanlines 0.5s linear infinite',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Center content */}
          <div className="relative z-10 text-center">
            {/* Animated magnifying glass */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative mb-6"
            >
              <motion.div
                animate={{
                  filter: ['drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))', 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.8))', 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl md:text-9xl"
              >
                🔎
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-400"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i * 60 * Math.PI) / 180) * 60, 0],
                    y: [0, Math.sin((i * 60 * Math.PI) / 180) * 60, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>

            {/* Loading text with typewriter effect */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono tracking-[0.3em] text-lg text-amber-400"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {message}
              </motion.span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              className="mt-4 h-1 w-48 mx-auto bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
              style={{ transformOrigin: 'left' }}
            />

            {/* Golden pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 rounded-full border-2 border-amber-500/30"
                  animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes scanlines {
              0% { transform: translateY(0); }
              100% { transform: translateY(4px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Curtain Reveal Transition
 * Dramatic theater curtain opening/closing effect
 */
export function CurtainReveal({ isTransitioning, onComplete }: { isTransitioning: boolean; onComplete?: () => void }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isTransitioning && (
        <>
          {/* Left curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            exit={{ x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 w-1/2 z-[200] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 100%)',
              boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Curtain texture */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,215,0,0.05) 20px, rgba(255,215,0,0.05) 21px)',
              }}
            />
          </motion.div>

          {/* Right curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            exit={{ x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-1/2 z-[200] pointer-events-none"
            style={{
              background: 'linear-gradient(270deg, #0a0a0a 0%, #1a1a1a 100%)',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,215,0,0.05) 20px, rgba(255,215,0,0.05) 21px)',
              }}
            />
          </motion.div>

          {/* Center badge during close */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none"
          >
            <div
              className="text-8xl"
              style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))' }}
            >
              🔎
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Spotlight Reveal Transition
 * Circle wipe transition like a spotlight
 */
export function SpotlightReveal({ isTransitioning }: { isTransitioning: boolean }) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          animate={{ clipPath: 'circle(0% at 50% 50%)' }}
          exit={{ clipPath: 'circle(150% at 50% 50%)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

/**
 * Film Reel Transition
 * Classic film countdown bars effect
 */
export function FilmReelTransition({ isTransitioning }: { isTransitioning: boolean }) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          {/* Horizontal bars */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              exit={{ scaleX: 1 }}
              transition={{
                duration: 0.15,
                delay: i * 0.08,
                ease: 'linear',
              }}
              className="absolute left-0 right-0"
              style={{
                top: `${i * 20}%`,
                height: '20%',
                background: i % 2 === 0 ? '#000' : '#111',
                transformOrigin: i % 2 === 0 ? 'right' : 'left',
              }}
            />
          ))}

          {/* Film grain */}
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Countdown number */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-9xl font-black text-amber-500 font-mono" style={{ textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
              3
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Navigation Loading Overlay
 * Use with useTransition for route changes
 */
interface NavigationLoadingProps {
  isLoading: boolean;
  loadingText?: string;
}

export function NavigationLoading({ isLoading, loadingText = 'LOADING CASE FILE...' }: NavigationLoadingProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div className="text-center">
            {/* Animated folder/file icon */}
            <motion.div
              animate={{
                rotateY: [0, 10, 0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-7xl mb-6"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))' }}
            >
              📁
            </motion.div>

            {/* Loading text */}
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-amber-400 font-mono tracking-[0.2em] text-sm"
            >
              {loadingText}
            </motion.p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-amber-500"
                />
              ))}
            </div>

            {/* Typewriter line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-6 mx-auto max-w-xs"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
