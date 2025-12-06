'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

export interface TimelineEvent {
  id: string;
  type: 'scene' | 'clue' | 'puzzle' | 'suspect' | 'revelation';
  title: string;
  description?: string;
  timestamp?: string | Date;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
}

interface CaseTimelineProps {
  events: TimelineEvent[];
  caseName?: string;
  onEventClick?: (eventId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_ICONS: Record<TimelineEvent['type'], string> = {
  scene: '🏢',
  clue: '🔍',
  puzzle: '🧩',
  suspect: '👤',
  revelation: '💡',
};

const EVENT_COLORS: Record<TimelineEvent['type'], { bg: string; border: string; text: string }> = {
  scene: { bg: 'bg-blue-900/50', border: 'border-blue-500', text: 'text-blue-400' },
  clue: { bg: 'bg-amber-900/50', border: 'border-amber-500', text: 'text-amber-400' },
  puzzle: { bg: 'bg-purple-900/50', border: 'border-purple-500', text: 'text-purple-400' },
  suspect: { bg: 'bg-red-900/50', border: 'border-red-500', text: 'text-red-400' },
  revelation: { bg: 'bg-green-900/50', border: 'border-green-500', text: 'text-green-400' },
};

export function CaseTimeline({
  events,
  caseTitle,
  caseName = 'Investigation Timeline',
  onEventClick,
  isOpen,
  onClose,
}: CaseTimelineProps & { caseTitle?: string }) {
  const { playSound } = useSoundEffects();
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      playSound('caseFileOpen');
    }
  }, [isOpen, playSound]);

  const handleClose = () => {
    playSound('modalClose');
    onClose();
  };

  const handleEventClick = (event: TimelineEvent) => {
    if (event.locked) {
      playSound('wrong');
      return;
    }
    playSound('click');
    onEventClick?.(event.id);
  };

  const handleEventHover = (eventId: string | null) => {
    if (eventId && eventId !== hoveredEvent) {
      playSound('hoverSubtle');
    }
    setHoveredEvent(eventId);
  };

  const completedCount = events.filter(e => e.completed).length;
  const progress = (completedCount / events.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-black border-2 border-amber-600 max-w-4xl w-full max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-6 border-b-2 border-amber-950">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📋</span>
                    <div>
                      <h2 className="text-xl font-bold text-amber-100 font-mono tracking-wider">
                        CASE TIMELINE
                      </h2>
                      <p className="text-amber-300 text-sm font-mono">{caseName}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-amber-200 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-mono text-amber-300 mb-2">
                  <span>INVESTIGATION PROGRESS</span>
                  <span>{completedCount} / {events.length} completed</span>
                </div>
                <div className="h-3 bg-black/50 border border-amber-600 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600/20" />

                {/* Events */}
                <div className="space-y-6">
                  {events.map((event, index) => {
                    const colors = EVENT_COLORS[event.type];
                    const isActive = event.current;
                    const isCompleted = event.completed;
                    const isLocked = event.locked;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-6"
                      >
                        {/* Node */}
                        <motion.button
                          onClick={() => handleEventClick(event)}
                          onMouseEnter={() => handleEventHover(event.id)}
                          onMouseLeave={() => handleEventHover(null)}
                          disabled={isLocked}
                          className={`
                            relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                            text-2xl border-4 transition-all
                            ${isCompleted
                              ? 'bg-green-900 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                              : isActive
                                ? `${colors.bg} ${colors.border} animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)]`
                                : isLocked
                                  ? 'bg-slate-900 border-slate-700 opacity-50'
                                  : `${colors.bg} ${colors.border}`
                            }
                            ${!isLocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                          `}
                          whileHover={!isLocked ? { scale: 1.1 } : {}}
                          whileTap={!isLocked ? { scale: 0.95 } : {}}
                        >
                          {isCompleted ? (
                            <span className="text-green-400">✓</span>
                          ) : isLocked ? (
                            <span className="text-slate-600">🔒</span>
                          ) : (
                            EVENT_ICONS[event.type]
                          )}

                          {/* Pulse ring for current */}
                          {isActive && (
                            <motion.div
                              className={`absolute inset-0 rounded-full ${colors.border} border-2`}
                              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </motion.button>

                        {/* Content */}
                        <motion.div
                          className={`
                            flex-1 p-4 border-2 transition-all
                            ${isCompleted
                              ? 'bg-green-900/20 border-green-600/50'
                              : isActive
                                ? `${colors.bg} ${colors.border} shadow-lg`
                                : isLocked
                                  ? 'bg-slate-900/50 border-slate-700'
                                  : `${colors.bg} ${colors.border}/30`
                            }
                          `}
                          animate={{
                            scale: hoveredEvent === event.id && !isLocked ? 1.02 : 1,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono tracking-wider ${colors.text}`}>
                                  {event.type.toUpperCase()}
                                </span>
                                {isActive && (
                                  <span className="text-xs font-mono tracking-wider text-amber-400 bg-amber-900/50 px-2 py-0.5">
                                    CURRENT
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-xs font-mono tracking-wider text-green-400">
                                    COMPLETED
                                  </span>
                                )}
                              </div>
                              <h3 className={`
                                font-mono font-bold tracking-wider mt-1
                                ${isLocked ? 'text-slate-500' : 'text-amber-100'}
                              `}>
                                {isLocked ? '???' : event.title}
                              </h3>
                              {event.description && !isLocked && (
                                <p className="text-slate-400 font-mono text-sm mt-2">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            {/* Event number */}
                            <span className={`
                              text-xs font-mono font-bold px-2 py-1 rounded
                              ${isCompleted
                                ? 'bg-green-900 text-green-400'
                                : isLocked
                                  ? 'bg-slate-800 text-slate-600'
                                  : 'bg-amber-900 text-amber-400'
                              }
                            `}>
                              #{index + 1}
                            </span>
                          </div>

                          {event.timestamp && (
                            <p className="text-xs text-slate-500 font-mono mt-2">
                              {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(event.timestamp)}
                            </p>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/50 border-t-2 border-amber-600/30 p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" /> Scene
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-500 rounded-full" /> Clue
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-purple-500 rounded-full" /> Puzzle
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full" /> Suspect
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full" /> Revelation
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-amber-600 text-amber-400 font-mono text-sm hover:bg-amber-600 hover:text-black transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mini timeline for inline display
export function MiniTimeline({
  events,
  className = '',
}: {
  events: TimelineEvent[];
  className?: string;
}) {
  const completedCount = events.filter(e => e.completed).length;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {events.map((event, index) => {
        const colors = EVENT_COLORS[event.type];
        return (
          <motion.div
            key={event.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              w-4 h-4 rounded-full border-2
              ${event.completed
                ? 'bg-green-500 border-green-400'
                : event.current
                  ? `${colors.bg} ${colors.border} animate-pulse`
                  : event.locked
                    ? 'bg-slate-800 border-slate-700'
                    : `${colors.bg} ${colors.border}`
              }
            `}
            title={event.title}
          />
        );
      })}
      <span className="ml-2 text-xs font-mono text-slate-500">
        {completedCount}/{events.length}
      </span>
    </div>
  );
}
