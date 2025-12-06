'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function FloatingParticles({
  count = 30,
  color = 'rgba(255, 215, 0, 0.3)',
  minSize = 2,
  maxSize = 6,
  className = '',
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile for performance optimization
    setIsMobile(window.innerWidth < 768);

    // Reduce particle count on mobile
    const adjustedCount = window.innerWidth < 768 ? Math.floor(count * 0.5) : count;

    const newParticles: Particle[] = Array.from({ length: adjustedCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.4,
    }));
    setParticles(newParticles);
  }, [count, minSize, maxSize]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function DustParticles({ className = '' }: { className?: string }) {
  return (
    <FloatingParticles
      count={40}
      color="rgba(255, 215, 0, 0.2)"
      minSize={1}
      maxSize={4}
      className={className}
    />
  );
}

export function FogEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Primary fog layer */}
      <motion.div
        className="absolute w-[200%] h-full opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-50%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Secondary gold fog */}
      <motion.div
        className="absolute w-[200%] h-full opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Enhanced smoke effect for mystery atmosphere
export function SmokeEffect({ className = '' }: { className?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Reduce smoke layers on mobile
  const smokeCount = isMobile ? 3 : 5;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Multiple smoke layers for depth */}
      {Array.from({ length: smokeCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(ellipse at ${30 + i * 15}% ${50 + i * 10}%, rgba(100,100,100,${0.03 + i * 0.01}) 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 50 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 30 * (i % 2 === 0 ? -1 : 1), 0],
            scale: [1, 1.1, 1],
            opacity: [0.3 + i * 0.1, 0.5 + i * 0.1, 0.3 + i * 0.1],
          }}
          transition={{
            duration: 15 + i * 5,
            delay: i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Ground fog effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Mysterious glowing orbs
export function MysteryOrbs({ className = '' }: { className?: string }) {
  const [orbs, setOrbs] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const orbCount = isMobile ? 3 : 6;

    setOrbs(
      Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 100 + Math.random() * 150,
        delay: i * 1.5,
      }))
    );
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            duration: 12 + orb.id * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Flickering light effect (like candlelight)
export function FlickeringLight({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,180,0,0.15) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.35, 0.55, 0.4],
          scale: [1, 1.02, 0.98, 1.01, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Scan line effect for retro detective feel
export function ScanLines({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none opacity-[0.02] ${className}`}
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
        backgroundSize: '100% 4px',
      }}
    />
  );
}

// Vignette effect for cinematic feel
export function Vignette({ className = '', intensity = 0.6 }: { className?: string; intensity?: number }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
}

export default FloatingParticles;
