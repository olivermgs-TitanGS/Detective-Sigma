'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetectiveLoaderProps {
  message?: string;
  variant?: 'magnifying' | 'fingerprint' | 'files' | 'typing' | 'analysis';
  progress?: number; // 0-100 for determinate progress
}

// Noir detective loading messages
const LOADING_MESSAGES = [
  'Examining the evidence...',
  'Cross-referencing alibis...',
  'Analyzing fingerprints...',
  'Reviewing witness statements...',
  'Connecting the clues...',
  'Checking suspect backgrounds...',
  'Studying the crime scene...',
  'Following the paper trail...',
  'Decoding the mystery...',
  'Piecing together the puzzle...',
];

export default function DetectiveLoader({
  message,
  variant = 'magnifying',
  progress,
}: DetectiveLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(message || LOADING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      setCurrentMessage(LOADING_MESSAGES[(messageIndex + 1) % LOADING_MESSAGES.length]);
    }, 3000);

    return () => clearInterval(interval);
  }, [message, messageIndex]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Loader animation based on variant */}
      <div className="relative w-24 h-24 mb-6">
        {variant === 'magnifying' && <MagnifyingGlassLoader />}
        {variant === 'fingerprint' && <FingerprintLoader />}
        {variant === 'files' && <FilesLoader />}
        {variant === 'typing' && <TypingLoader />}
        {variant === 'analysis' && <AnalysisLoader />}
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-amber-400 font-mono text-sm tracking-wider text-center"
        >
          {currentMessage}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar (if determinate) */}
      {progress !== undefined && (
        <div className="w-48 h-2 bg-slate-800 mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Dots animation */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-amber-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Magnifying glass loader
function MagnifyingGlassLoader() {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Glass circle */}
      <motion.div
        className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-amber-500 bg-amber-900/20"
        animate={{
          boxShadow: [
            '0 0 10px rgba(245,158,11,0.3)',
            '0 0 30px rgba(245,158,11,0.6)',
            '0 0 10px rgba(245,158,11,0.3)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full origin-top-left"
        style={{ transform: 'rotate(45deg) translate(20px, 20px)' }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute top-2 left-2 w-12 h-[2px] bg-amber-400"
        animate={{ y: [0, 44, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Fingerprint scanner loader
function FingerprintLoader() {
  return (
    <motion.div className="relative w-full h-full flex items-center justify-center">
      {/* Fingerprint icon */}
      <div className="text-6xl relative">
        <span className="opacity-30">👆</span>

        {/* Scanning line */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-green-500/50 to-transparent"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          />
        </motion.div>
      </div>

      {/* Scan lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] bg-green-500/50"
          style={{ width: '100%', top: `${20 + i * 15}%` }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.div>
  );
}

// Case files shuffling loader
function FilesLoader() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute w-16 h-20 bg-amber-100 border-2 border-amber-600 rounded-sm shadow-lg"
          style={{
            transformOrigin: 'bottom center',
          }}
          animate={{
            rotateZ: [0, i === 0 ? -15 : i === 1 ? 0 : 15, 0],
            y: [0, -10, 0],
            zIndex: [i, i + 3, i],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {/* File lines */}
          <div className="p-2 space-y-1">
            {[...Array(4)].map((_, j) => (
              <div
                key={j}
                className="h-1 bg-amber-300 rounded"
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
            ))}
          </div>

          {/* Stamp */}
          <div className="absolute bottom-2 right-2 w-6 h-6 border border-red-500 rounded flex items-center justify-center">
            <span className="text-red-500 text-[8px] font-bold">CASE</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Typewriter typing loader
function TypingLoader() {
  const text = 'ANALYZING...';
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        i = 0;
        setDisplayText('');
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-black/50 border border-amber-600 px-4 py-2">
        <span className="font-mono text-amber-400 tracking-widest">
          {displayText}
          <motion.span
            className="inline-block w-2 h-4 bg-amber-400 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </span>
      </div>
    </div>
  );
}

// Data analysis loader
function AnalysisLoader() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central circle */}
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbiting dots */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-amber-400"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-6px',
            marginTop: '-6px',
          }}
          animate={{
            x: Math.cos((i * Math.PI) / 2) * 40,
            y: Math.sin((i * Math.PI) / 2) * 40,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-500/50"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

// Full page loading overlay
export function FullPageLoader({
  message,
  variant = 'magnifying',
}: DetectiveLoaderProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, black 100%)',
        }}
      />

      <DetectiveLoader message={message} variant={variant} />
    </motion.div>
  );
}

// Skeleton components for content loading
export function CaseCardSkeleton() {
  return (
    <div className="bg-black/50 border-2 border-amber-600/20 p-4 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-40 bg-slate-800 mb-4" />

      {/* Title */}
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-2" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-slate-700 rounded w-20" />
        <div className="h-4 bg-amber-900/50 rounded w-16" />
      </div>
    </div>
  );
}

export function EvidenceSkeleton() {
  return (
    <div className="bg-black/50 border border-amber-600/30 p-3 animate-pulse flex gap-3">
      {/* Icon */}
      <div className="w-12 h-12 bg-slate-700 rounded" />

      {/* Content */}
      <div className="flex-1">
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-slate-800 rounded w-full" />
      </div>
    </div>
  );
}

export function SuspectSkeleton() {
  return (
    <div className="bg-black/50 border border-amber-600/30 p-4 animate-pulse text-center">
      {/* Avatar */}
      <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-3" />

      {/* Name */}
      <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto mb-2" />

      {/* Role */}
      <div className="h-3 bg-slate-800 rounded w-1/2 mx-auto" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-black/50 border border-amber-600/20 p-4">
            <div className="h-8 bg-slate-700 rounded w-16 mb-2" />
            <div className="h-4 bg-slate-800 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-black/50 border border-amber-600/20 p-6">
          <div className="h-6 bg-slate-700 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <EvidenceSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="bg-black/50 border border-amber-600/20 p-6">
          <div className="h-6 bg-slate-700 rounded w-40 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <SuspectSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
