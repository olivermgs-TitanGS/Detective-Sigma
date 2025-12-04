'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'document' | 'note' | 'clue';
  title: string;
  description?: string;
  imageUrl?: string;
  position: { x: number; y: number };
  connections?: string[]; // IDs of connected evidence
}

interface Connection {
  from: string;
  to: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

// Demo evidence data
const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'e1',
    type: 'photo',
    title: 'Crime Scene Photo',
    description: 'Canteen entrance at 7:15 AM',
    position: { x: 15, y: 20 },
    connections: ['e2', 'e4'],
  },
  {
    id: 'e2',
    type: 'document',
    title: 'Witness Statement',
    description: 'Mrs. Chen saw suspicious activity',
    position: { x: 45, y: 15 },
    connections: ['e3'],
  },
  {
    id: 'e3',
    type: 'clue',
    title: 'Torn Fabric',
    description: 'Dark navy blue, cotton blend',
    position: { x: 75, y: 25 },
    connections: ['e5'],
  },
  {
    id: 'e4',
    type: 'note',
    title: 'Time of Incident',
    description: '6:45 AM - matches witness report',
    position: { x: 25, y: 55 },
    connections: ['e5'],
  },
  {
    id: 'e5',
    type: 'photo',
    title: 'Suspect Silhouette',
    description: 'CCTV capture - dark hoodie',
    position: { x: 55, y: 60 },
    connections: [],
  },
  {
    id: 'e6',
    type: 'clue',
    title: 'Footprint',
    description: 'Size 8 shoe print near exit',
    position: { x: 80, y: 65 },
    connections: ['e5'],
  },
];

const typeIcons = {
  photo: '📷',
  document: '📄',
  note: '📝',
  clue: '🔍',
};

const typeColors = {
  photo: 'border-blue-500 bg-blue-950/50',
  document: 'border-amber-500 bg-amber-950/50',
  note: 'border-yellow-500 bg-yellow-950/50',
  clue: 'border-green-500 bg-green-950/50',
};

interface EvidenceBoardProps {
  evidence?: EvidenceItem[];
  onEvidenceClick?: (item: EvidenceItem) => void;
}

export default function EvidenceBoard({
  evidence = DEMO_EVIDENCE,
  onEvidenceClick,
}: EvidenceBoardProps) {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showConnections, setShowConnections] = useState(false);
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate connections between evidence items
  useEffect(() => {
    const newConnections: Connection[] = [];
    evidence.forEach((item) => {
      if (item.connections) {
        item.connections.forEach((targetId) => {
          const target = evidence.find((e) => e.id === targetId);
          if (target) {
            // Check if this connection already exists (in reverse)
            const exists = newConnections.some(
              (c) => (c.from === targetId && c.to === item.id)
            );
            if (!exists) {
              newConnections.push({
                from: item.id,
                to: targetId,
                fromPos: item.position,
                toPos: target.position,
              });
            }
          }
        });
      }
    });
    setConnections(newConnections);

    // Animate connections appearing
    const timer = setTimeout(() => setShowConnections(true), 1000);
    return () => clearTimeout(timer);
  }, [evidence]);

  // Reveal items one by one
  useEffect(() => {
    evidence.forEach((item, index) => {
      setTimeout(() => {
        setRevealedItems((prev) => new Set(prev).add(item.id));
      }, index * 200 + 500);
    });
  }, [evidence]);

  const handleItemClick = (item: EvidenceItem) => {
    setSelectedItem(item);
    onEvidenceClick?.(item);
  };

  return (
    <div className="relative w-full">
      {/* Board Header */}
      <motion.div
        className="mb-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-xl font-bold text-amber-400 font-mono tracking-widest flex items-center gap-3">
            <span className="text-2xl">🕵️</span>
            EVIDENCE BOARD
          </h2>
          <p className="text-slate-500 text-sm font-mono mt-1">
            » Connect the clues to solve the mystery «
          </p>
        </div>
        <div className="text-slate-400 font-mono text-sm">
          {evidence.length} pieces of evidence
        </div>
      </motion.div>

      {/* Cork Board */}
      <motion.div
        ref={boardRef}
        className="relative w-full aspect-[16/10] rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 90, 43, 0.1) 2px,
              rgba(139, 90, 43, 0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 90, 43, 0.1) 2px,
              rgba(139, 90, 43, 0.1) 4px
            ),
            linear-gradient(135deg, #5c4033 0%, #8b5a2b 50%, #5c4033 100%)
          `,
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Board frame */}
        <div className="absolute inset-0 border-8 border-amber-900/80 rounded-lg pointer-events-none" />

        {/* SVG for red string connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <defs>
            <filter id="string-shadow">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          {showConnections &&
            connections.map((conn, index) => {
              // Calculate center points (evidence items are at percentage positions)
              const x1 = `${conn.fromPos.x + 5}%`;
              const y1 = `${conn.fromPos.y + 7}%`;
              const x2 = `${conn.toPos.x + 5}%`;
              const y2 = `${conn.toPos.y + 7}%`;

              return (
                <motion.line
                  key={`${conn.from}-${conn.to}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#dc2626"
                  strokeWidth="2"
                  filter="url(#string-shadow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.3 + 0.5,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
        </svg>

        {/* Evidence Items */}
        {evidence.map((item, index) => (
          <AnimatePresence key={item.id}>
            {revealedItems.has(item.id) && (
              <motion.div
                className="absolute cursor-pointer"
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  zIndex: selectedItem?.id === item.id ? 20 : 10,
                }}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{
                  scale: 1,
                  rotate: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5)),
                  opacity: 1,
                }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: 0,
                  zIndex: 30,
                  transition: { type: 'spring', stiffness: 300 },
                }}
                onClick={() => handleItemClick(item)}
              >
                {/* Push Pin */}
                <motion.div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
                  initial={{ y: -30, scale: 0 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
                >
                  <div className="push-pin" />
                </motion.div>

                {/* Evidence Card */}
                <div
                  className={`
                    w-28 p-3 rounded shadow-lg border-2
                    ${typeColors[item.type]}
                    backdrop-blur-sm
                    transition-shadow duration-300
                    hover:shadow-xl hover:shadow-black/30
                  `}
                >
                  {/* Icon */}
                  <div className="text-2xl text-center mb-1">
                    {typeIcons[item.type]}
                  </div>

                  {/* Title */}
                  <p className="text-amber-100 text-xs font-mono font-bold text-center truncate">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 text-2xl opacity-30">📌</div>
        <div className="absolute top-2 right-2 text-2xl opacity-30">📌</div>
        <div className="absolute bottom-2 left-2 text-2xl opacity-30">📌</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-30">📌</div>
      </motion.div>

      {/* Selected Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />

            {/* Detail Card */}
            <motion.div
              className={`
                relative max-w-md w-full p-6 rounded-lg border-2
                ${typeColors[selectedItem.type]}
                shadow-2xl
              `}
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>

              {/* Content */}
              <div className="text-center mb-4">
                <span className="text-5xl">{typeIcons[selectedItem.type]}</span>
              </div>

              <h3 className="text-xl font-bold text-amber-100 font-mono tracking-wider text-center mb-2">
                {selectedItem.title}
              </h3>

              {selectedItem.description && (
                <p className="text-slate-300 font-mono text-sm text-center mb-4">
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.connections && selectedItem.connections.length > 0 && (
                <div className="border-t border-slate-600 pt-4 mt-4">
                  <p className="text-amber-400 text-xs font-mono tracking-wider mb-2">
                    CONNECTED TO:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.connections.map((connId) => {
                      const connItem = evidence.find((e) => e.id === connId);
                      return connItem ? (
                        <span
                          key={connId}
                          className="bg-red-900/50 border border-red-600 text-red-300 text-xs px-2 py-1 rounded font-mono"
                        >
                          {typeIcons[connItem.type]} {connItem.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full mt-4 border-2 border-amber-600 bg-transparent hover:bg-amber-600 hover:text-black text-amber-400 font-mono font-bold py-2 transition-all tracking-wider"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        className="mt-4 flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {Object.entries(typeIcons).map(([type, icon]) => (
          <div
            key={type}
            className="flex items-center gap-2 text-slate-400 font-mono text-xs"
          >
            <span>{icon}</span>
            <span className="uppercase">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
          <div className="w-4 h-0.5 bg-red-600" />
          <span>CONNECTION</span>
        </div>
      </motion.div>
    </div>
  );
}
