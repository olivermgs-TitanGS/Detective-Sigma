/**
 * CRIME SCENE UI OVERLAYS
 *
 * Since SD 1.5 models cannot generate readable text, these components
 * overlay realistic text elements on AI-generated crime scene images.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ============================================
// POLICE TAPE OVERLAY
// ============================================

interface PoliceTapeProps {
  text?: string;
  position?: 'top' | 'bottom' | 'diagonal-left' | 'diagonal-right';
  color?: 'yellow' | 'red';
  animated?: boolean;
}

export function PoliceTape({
  text = 'CRIME SCENE DO NOT CROSS',
  position = 'bottom',
  color = 'yellow',
  animated = true,
}: PoliceTapeProps) {
  const colorStyles = {
    yellow: 'bg-yellow-400 text-black border-black',
    red: 'bg-red-600 text-white border-white',
  };

  const positionStyles = {
    top: 'top-4 left-0 right-0 rotate-0',
    bottom: 'bottom-4 left-0 right-0 rotate-0',
    'diagonal-left': 'top-1/2 left-0 right-0 -rotate-12 origin-left',
    'diagonal-right': 'top-1/2 left-0 right-0 rotate-12 origin-right',
  };

  const tapeContent = (
    <div
      className={`
        absolute ${positionStyles[position]} z-10
        ${colorStyles[color]}
        py-2 px-4
        font-bold text-sm tracking-widest
        border-y-2
        shadow-lg
        overflow-hidden
        whitespace-nowrap
      `}
    >
      <div className="flex gap-8">
        {/* Repeat text for seamless scrolling effect */}
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="inline-block">
            {t} ★
          </span>
        ))}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tapeContent}
      </motion.div>
    );
  }

  return tapeContent;
}

// ============================================
// EVIDENCE MARKER
// ============================================

interface EvidenceMarkerProps {
  number: number;
  x: number; // percentage position
  y: number; // percentage position
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  discovered?: boolean;
}

export function EvidenceMarker({
  number,
  x,
  y,
  size = 'md',
  onClick,
  discovered = false,
}: EvidenceMarkerProps) {
  const sizeStyles = {
    sm: 'w-6 h-8 text-xs',
    md: 'w-8 h-10 text-sm',
    lg: 'w-10 h-12 text-base',
  };

  return (
    <motion.button
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        ${sizeStyles[size]}
        bg-yellow-400 text-black font-bold
        flex items-center justify-center
        rounded-t-sm
        shadow-lg
        cursor-pointer
        hover:scale-110 transition-transform
        ${discovered ? 'ring-2 ring-green-500' : ''}
      `}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {number}
    </motion.button>
  );
}

// ============================================
// EVIDENCE TAG / LABEL
// ============================================

interface EvidenceTagProps {
  caseNumber?: string;
  itemNumber: string;
  date?: string;
  description?: string;
  className?: string;
}

export function EvidenceTag({
  caseNumber = 'DS-2024-001',
  itemNumber,
  date = new Date().toLocaleDateString(),
  description,
  className = '',
}: EvidenceTagProps) {
  return (
    <div
      className={`
        inline-block bg-white border-2 border-red-600
        px-3 py-2 font-mono text-xs
        shadow-md transform rotate-2
        ${className}
      `}
    >
      <div className="text-red-600 font-bold text-center border-b border-red-300 pb-1 mb-1">
        EVIDENCE
      </div>
      <div className="space-y-0.5 text-black">
        <div>CASE: {caseNumber}</div>
        <div>ITEM: {itemNumber}</div>
        <div>DATE: {date}</div>
        {description && (
          <div className="text-gray-600 text-[10px] mt-1 border-t border-gray-200 pt-1">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// FORENSIC RULER OVERLAY
// ============================================

interface ForensicRulerProps {
  length?: number; // in cm
  position?: 'horizontal' | 'vertical';
  x: number;
  y: number;
}

export function ForensicRuler({
  length = 15,
  position = 'horizontal',
  x,
  y,
}: ForensicRulerProps) {
  const marks = Array.from({ length: length + 1 }, (_, i) => i);

  return (
    <div
      className={`
        absolute bg-yellow-300 border border-black
        ${position === 'horizontal' ? 'h-6' : 'w-6'}
        flex ${position === 'horizontal' ? 'flex-row' : 'flex-col'}
      `}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: position === 'horizontal' ? `${length * 10}px` : '24px',
        height: position === 'vertical' ? `${length * 10}px` : '24px',
      }}
    >
      {marks.map((mark) => (
        <div
          key={mark}
          className={`
            relative
            ${position === 'horizontal' ? 'w-[10px] h-full border-r border-black' : 'h-[10px] w-full border-b border-black'}
          `}
        >
          {mark % 5 === 0 && (
            <span className="absolute text-[6px] font-bold text-black"
              style={{
                [position === 'horizontal' ? 'bottom' : 'right']: '2px',
                [position === 'horizontal' ? 'left' : 'top']: '1px',
              }}
            >
              {mark}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// CLASSIFIED STAMP
// ============================================

interface ClassifiedStampProps {
  text?: string;
  color?: 'red' | 'black';
  rotation?: number;
}

export function ClassifiedStamp({
  text = 'CLASSIFIED',
  color = 'red',
  rotation = -15,
}: ClassifiedStampProps) {
  const colorStyles = {
    red: 'text-red-600 border-red-600',
    black: 'text-gray-800 border-gray-800',
  };

  return (
    <div
      className={`
        inline-block
        ${colorStyles[color]}
        border-4 px-4 py-2
        font-bold text-2xl tracking-wider
        opacity-80
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {text}
    </div>
  );
}

// ============================================
// CRIME SCENE WRAPPER
// ============================================

interface CrimeSceneImageProps {
  src: string;
  alt: string;
  showTape?: boolean;
  tapeText?: string;
  evidenceMarkers?: Array<{
    number: number;
    x: number;
    y: number;
    onClick?: () => void;
    discovered?: boolean;
  }>;
  children?: React.ReactNode;
}

export function CrimeSceneImage({
  src,
  alt,
  showTape = true,
  tapeText,
  evidenceMarkers = [],
  children,
}: CrimeSceneImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* AI-generated background image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Police tape overlay */}
      {showTape && (
        <>
          <PoliceTape text={tapeText} position="top" />
          <PoliceTape text={tapeText} position="bottom" />
        </>
      )}

      {/* Evidence markers */}
      {evidenceMarkers.map((marker) => (
        <EvidenceMarker
          key={marker.number}
          number={marker.number}
          x={marker.x}
          y={marker.y}
          onClick={marker.onClick}
          discovered={marker.discovered}
        />
      ))}

      {/* Additional overlays */}
      {children}
    </div>
  );
}

export default CrimeSceneImage;
