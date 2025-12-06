'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

interface Suspect {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  isCulprit?: boolean;
}

interface Relationship {
  from: string; // suspect id
  to: string; // suspect id
  type: 'family' | 'colleague' | 'friend' | 'enemy' | 'romantic' | 'business' | 'unknown';
  description?: string;
  discovered?: boolean;
}

interface SuspectNetworkProps {
  suspects: Suspect[];
  relationships: Relationship[];
  isOpen: boolean;
  onClose: () => void;
  onSuspectClick?: (suspect: Suspect) => void;
}

const RELATIONSHIP_COLORS = {
  family: { color: '#22C55E', label: 'Family', icon: '👨‍👩‍👧' },
  colleague: { color: '#3B82F6', label: 'Colleague', icon: '💼' },
  friend: { color: '#8B5CF6', label: 'Friend', icon: '🤝' },
  enemy: { color: '#EF4444', label: 'Enemy', icon: '⚔️' },
  romantic: { color: '#EC4899', label: 'Romantic', icon: '❤️' },
  business: { color: '#F59E0B', label: 'Business', icon: '💰' },
  unknown: { color: '#6B7280', label: 'Unknown', icon: '❓' },
};

// Calculate positions in a circle
function calculatePositions(count: number, centerX: number, centerY: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  return positions;
}

export default function SuspectNetwork({
  suspects,
  relationships,
  isOpen,
  onClose,
  onSuspectClick,
}: SuspectNetworkProps) {
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [hoveredRelationship, setHoveredRelationship] = useState<Relationship | null>(null);
  const { playSound } = useSoundEffects();

  const centerX = 300;
  const centerY = 250;
  const radius = 180;

  const positions = useMemo(
    () => calculatePositions(suspects.length, centerX, centerY, radius),
    [suspects.length]
  );

  useEffect(() => {
    if (isOpen) {
      playSound('caseFileOpen');
    }
  }, [isOpen, playSound]);

  const handleClose = () => {
    playSound('modalClose');
    onClose();
  };

  const handleSuspectClick = (suspect: Suspect) => {
    playSound('suspectSelect');
    setSelectedSuspect(suspect.id === selectedSuspect ? null : suspect.id);
    onSuspectClick?.(suspect);
  };

  const handleSuspectHover = () => {
    playSound('hoverSubtle');
  };

  const getPositionById = useCallback(
    (id: string) => {
      const index = suspects.findIndex(s => s.id === id);
      return positions[index] || { x: centerX, y: centerY };
    },
    [suspects, positions]
  );

  const discoveredRelationships = relationships.filter(r => r.discovered !== false);
  const relatedToSelected = selectedSuspect
    ? discoveredRelationships.filter(
        r => r.from === selectedSuspect || r.to === selectedSuspect
      )
    : [];

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
            className="bg-gradient-to-b from-slate-900 to-black border-2 border-amber-600 max-w-4xl w-full max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 to-red-800 p-6 border-b-2 border-red-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🕸️</span>
                  <div>
                    <h2 className="text-xl font-bold text-red-100 font-mono tracking-wider">
                      SUSPECT NETWORK
                    </h2>
                    <p className="text-red-300 text-sm font-mono">
                      {suspects.length} suspects • {discoveredRelationships.length} connections discovered
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-red-200 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Network visualization */}
            <div className="p-6 flex gap-6">
              {/* SVG Network */}
              <div className="flex-1 bg-black/50 border border-slate-800 rounded-lg overflow-hidden">
                <svg
                  viewBox="0 0 600 500"
                  className="w-full h-[400px]"
                  style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)' }}
                >
                  {/* Grid pattern background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#333"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Relationship lines */}
                  {discoveredRelationships.map((rel, index) => {
                    const fromPos = getPositionById(rel.from);
                    const toPos = getPositionById(rel.to);
                    const relStyle = RELATIONSHIP_COLORS[rel.type];
                    const isHighlighted =
                      selectedSuspect === rel.from ||
                      selectedSuspect === rel.to ||
                      hoveredRelationship === rel;
                    const isActive = !selectedSuspect || isHighlighted;

                    return (
                      <motion.g
                        key={`${rel.from}-${rel.to}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0.2 }}
                        onMouseEnter={() => setHoveredRelationship(rel)}
                        onMouseLeave={() => setHoveredRelationship(null)}
                        className="cursor-pointer"
                      >
                        {/* Line */}
                        <motion.line
                          x1={fromPos.x}
                          y1={fromPos.y}
                          x2={toPos.x}
                          y2={toPos.y}
                          stroke={relStyle.color}
                          strokeWidth={isHighlighted ? 3 : 2}
                          strokeDasharray={rel.type === 'unknown' ? '5,5' : 'none'}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />

                        {/* Relationship icon at midpoint */}
                        <text
                          x={(fromPos.x + toPos.x) / 2}
                          y={(fromPos.y + toPos.y) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="16"
                          className="pointer-events-none"
                        >
                          {relStyle.icon}
                        </text>
                      </motion.g>
                    );
                  })}

                  {/* Suspect nodes */}
                  {suspects.map((suspect, index) => {
                    const pos = positions[index];
                    const isSelected = selectedSuspect === suspect.id;
                    const isRelated = relatedToSelected.some(
                      r => r.from === suspect.id || r.to === suspect.id
                    );
                    const isActive = !selectedSuspect || isSelected || isRelated;

                    return (
                      <motion.g
                        key={suspect.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: isActive ? 1 : 0.3,
                        }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuspectClick(suspect)}
                        onMouseEnter={handleSuspectHover}
                        className="cursor-pointer"
                      >
                        {/* Glow effect for selected */}
                        {isSelected && (
                          <motion.circle
                            cx={pos.x}
                            cy={pos.y}
                            r={45}
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            animate={{ r: [45, 55, 45], opacity: [0.8, 0.3, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={40}
                          fill={isSelected ? '#F59E0B' : suspect.isCulprit ? '#EF4444' : '#374151'}
                          stroke={isSelected ? '#FCD34D' : '#6B7280'}
                          strokeWidth="3"
                        />

                        {/* Suspect initial or icon */}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? 'black' : 'white'}
                          fontSize="24"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {suspect.name.charAt(0)}
                        </text>

                        {/* Name label */}
                        <text
                          x={pos.x}
                          y={pos.y + 55}
                          textAnchor="middle"
                          fill={isSelected ? '#FCD34D' : '#9CA3AF'}
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          {suspect.name.length > 12
                            ? suspect.name.substring(0, 12) + '...'
                            : suspect.name}
                        </text>

                        {/* Role label */}
                        <text
                          x={pos.x}
                          y={pos.y + 68}
                          textAnchor="middle"
                          fill="#6B7280"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {suspect.role}
                        </text>
                      </motion.g>
                    );
                  })}
                </svg>
              </div>

              {/* Details panel */}
              <div className="w-64 space-y-4">
                {/* Selected suspect info */}
                <AnimatePresence mode="wait">
                  {selectedSuspect ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-slate-900/80 border border-amber-600 p-4"
                    >
                      <h3 className="text-amber-400 font-mono font-bold tracking-wider mb-2">
                        SELECTED
                      </h3>
                      {(() => {
                        const suspect = suspects.find(s => s.id === selectedSuspect);
                        if (!suspect) return null;
                        return (
                          <>
                            <p className="text-amber-100 font-mono font-bold text-lg">
                              {suspect.name}
                            </p>
                            <p className="text-slate-400 font-mono text-sm">
                              {suspect.role}
                            </p>

                            {relatedToSelected.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className="text-amber-400 font-mono text-xs tracking-wider">
                                  CONNECTIONS:
                                </p>
                                {relatedToSelected.map((rel, i) => {
                                  const otherId = rel.from === selectedSuspect ? rel.to : rel.from;
                                  const other = suspects.find(s => s.id === otherId);
                                  const relStyle = RELATIONSHIP_COLORS[rel.type];
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <span>{relStyle.icon}</span>
                                      <span className="text-slate-300 font-mono">
                                        {other?.name}
                                      </span>
                                      <span
                                        className="text-xs font-mono"
                                        style={{ color: relStyle.color }}
                                      >
                                        ({relStyle.label})
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-slate-900/50 border border-slate-700 p-4 text-center"
                    >
                      <p className="text-slate-500 font-mono text-sm">
                        Click on a suspect to view their connections
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hovered relationship info */}
                <AnimatePresence>
                  {hoveredRelationship && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-900/80 border border-slate-600 p-4"
                    >
                      <h3 className="text-slate-400 font-mono text-xs tracking-wider mb-2">
                        RELATIONSHIP
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {RELATIONSHIP_COLORS[hoveredRelationship.type].icon}
                        </span>
                        <span
                          className="font-mono font-bold"
                          style={{ color: RELATIONSHIP_COLORS[hoveredRelationship.type].color }}
                        >
                          {RELATIONSHIP_COLORS[hoveredRelationship.type].label}
                        </span>
                      </div>
                      {hoveredRelationship.description && (
                        <p className="text-slate-400 font-mono text-sm">
                          {hoveredRelationship.description}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Legend */}
                <div className="bg-slate-900/50 border border-slate-700 p-4">
                  <h3 className="text-slate-400 font-mono text-xs tracking-wider mb-3">
                    LEGEND
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(RELATIONSHIP_COLORS).map(([type, style]) => (
                      <div key={type} className="flex items-center gap-2 text-xs">
                        <span>{style.icon}</span>
                        <div
                          className="w-4 h-[2px]"
                          style={{ backgroundColor: style.color }}
                        />
                        <span className="text-slate-400 font-mono">{style.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/50 border-t-2 border-amber-600/30 p-4 flex justify-between items-center">
              <p className="text-slate-500 font-mono text-sm">
                Click suspects to highlight their connections
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-amber-600 text-amber-400 font-mono text-sm hover:bg-amber-600 hover:text-black transition-all"
              >
                CLOSE NETWORK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
