'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'investigation' | 'puzzle' | 'speed' | 'accuracy' | 'streak' | 'special';
  earnedAt?: Date;
  progress?: number; // 0-100, if not earned
  requirement?: string;
}

interface DetectiveBadgesProps {
  badges: Badge[];
  isOpen: boolean;
  onClose: () => void;
  onBadgeClick?: (badge: Badge) => void;
}

const RARITY_STYLES = {
  common: {
    bg: 'bg-slate-700',
    border: 'border-slate-500',
    text: 'text-slate-300',
    glow: '',
    label: 'COMMON',
  },
  uncommon: {
    bg: 'bg-green-900',
    border: 'border-green-500',
    text: 'text-green-400',
    glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    label: 'UNCOMMON',
  },
  rare: {
    bg: 'bg-blue-900',
    border: 'border-blue-500',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    label: 'RARE',
  },
  epic: {
    bg: 'bg-purple-900',
    border: 'border-purple-500',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    label: 'EPIC',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900',
    border: 'border-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
    label: 'LEGENDARY',
  },
};

const CATEGORY_ICONS = {
  investigation: '🔍',
  puzzle: '🧩',
  speed: '⚡',
  accuracy: '🎯',
  streak: '🔥',
  special: '⭐',
};

export default function DetectiveBadges({
  badges,
  isOpen,
  onClose,
  onBadgeClick,
}: DetectiveBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeCategory, setActiveCategory] = useState<Badge['category'] | 'all'>('all');
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playSound('caseFileOpen');
    }
  }, [isOpen, playSound]);

  const handleClose = () => {
    playSound('modalClose');
    onClose();
  };

  const handleBadgeClick = (badge: Badge) => {
    playSound('click');
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  const handleCategoryChange = (category: typeof activeCategory) => {
    playSound('tabSwitch');
    setActiveCategory(category);
  };

  const filteredBadges = activeCategory === 'all'
    ? badges
    : badges.filter(b => b.category === activeCategory);

  const earnedBadges = badges.filter(b => b.earnedAt);
  const lockedBadges = badges.filter(b => !b.earnedAt);

  const categories = ['all', 'investigation', 'puzzle', 'speed', 'accuracy', 'streak', 'special'] as const;

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
            className="bg-gradient-to-b from-slate-900 to-black border-2 border-amber-600 max-w-5xl w-full max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-6 border-b-2 border-amber-950 relative overflow-hidden">
              {/* Decorative badge icons */}
              <div className="absolute inset-0 opacity-10">
                {['🏆', '🎖️', '🌟', '👑', '🔰'].map((icon, i) => (
                  <span
                    key={i}
                    className="absolute text-6xl"
                    style={{
                      left: `${i * 25}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {icon}
                  </span>
                ))}
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-5xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏅
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-100 font-mono tracking-wider">
                      DETECTIVE BADGES
                    </h2>
                    <p className="text-amber-300 text-sm font-mono">
                      {earnedBadges.length} of {badges.length} badges earned
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-amber-200 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Category filters */}
              <div className="flex gap-2 mt-4 flex-wrap relative">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`
                      px-3 py-1 font-mono text-xs tracking-wider transition-all
                      ${activeCategory === category
                        ? 'bg-amber-600 text-black'
                        : 'bg-black/30 text-amber-300 hover:bg-black/50'
                      }
                    `}
                  >
                    {category === 'all' ? '📋 ALL' : `${CATEGORY_ICONS[category]} ${category.toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge grid */}
            <div className="p-6 max-h-[55vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredBadges.map((badge, index) => {
                    const isEarned = !!badge.earnedAt;
                    const style = RARITY_STYLES[badge.rarity];

                    return (
                      <motion.button
                        key={badge.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleBadgeClick(badge)}
                        onMouseEnter={() => playSound('hoverSubtle')}
                        className={`
                          relative p-4 border-2 transition-all text-center group
                          ${isEarned
                            ? `${style.bg} ${style.border} ${style.glow}`
                            : 'bg-slate-900/50 border-slate-700'
                          }
                        `}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Badge icon */}
                        <div className={`
                          text-5xl mb-2 transition-all
                          ${isEarned ? '' : 'grayscale opacity-40'}
                        `}>
                          {badge.icon}
                        </div>

                        {/* Badge name */}
                        <h3 className={`
                          font-mono text-xs font-bold tracking-wider truncate
                          ${isEarned ? style.text : 'text-slate-500'}
                        `}>
                          {badge.name}
                        </h3>

                        {/* Rarity label */}
                        <span className={`
                          absolute top-1 right-1 text-[8px] font-mono font-bold px-1
                          ${isEarned ? style.text : 'text-slate-600'}
                        `}>
                          {style.label}
                        </span>

                        {/* Lock icon for unearned */}
                        {!isEarned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-2xl">🔒</span>
                          </div>
                        )}

                        {/* Progress bar for unearned with progress */}
                        {!isEarned && badge.progress !== undefined && badge.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                            <div
                              className="h-full bg-amber-600"
                              style={{ width: `${badge.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Shine effect for legendary */}
                        {isEarned && badge.rarity === 'legendary' && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              {filteredBadges.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block opacity-50">🏅</span>
                  <p className="text-slate-500 font-mono">
                    No badges in this category yet.
                  </p>
                </div>
              )}
            </div>

            {/* Badge detail modal */}
            <AnimatePresence>
              {selectedBadge && (
                <motion.div
                  className="absolute inset-0 bg-black/80 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBadge(null)}
                >
                  <motion.div
                    className={`
                      max-w-md w-full p-6 border-2
                      ${selectedBadge.earnedAt
                        ? `${RARITY_STYLES[selectedBadge.rarity].bg} ${RARITY_STYLES[selectedBadge.rarity].border} ${RARITY_STYLES[selectedBadge.rarity].glow}`
                        : 'bg-slate-900 border-slate-700'
                      }
                    `}
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <motion.div
                        className={`text-8xl mb-4 ${!selectedBadge.earnedAt && 'grayscale opacity-50'}`}
                        animate={selectedBadge.earnedAt ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {selectedBadge.icon}
                      </motion.div>

                      <h3 className={`
                        text-2xl font-mono font-bold tracking-wider mb-2
                        ${selectedBadge.earnedAt
                          ? RARITY_STYLES[selectedBadge.rarity].text
                          : 'text-slate-400'
                        }
                      `}>
                        {selectedBadge.name}
                      </h3>

                      <span className={`
                        inline-block px-3 py-1 font-mono text-xs tracking-wider mb-4
                        ${selectedBadge.earnedAt
                          ? `bg-black/30 ${RARITY_STYLES[selectedBadge.rarity].text}`
                          : 'bg-slate-800 text-slate-500'
                        }
                      `}>
                        {RARITY_STYLES[selectedBadge.rarity].label}
                      </span>

                      <p className="text-slate-300 font-mono text-sm mb-4">
                        {selectedBadge.description}
                      </p>

                      {selectedBadge.requirement && !selectedBadge.earnedAt && (
                        <div className="bg-black/30 p-3 mb-4">
                          <p className="text-amber-400 font-mono text-xs tracking-wider">
                            HOW TO EARN:
                          </p>
                          <p className="text-slate-400 font-mono text-sm mt-1">
                            {selectedBadge.requirement}
                          </p>
                          {selectedBadge.progress !== undefined && (
                            <div className="mt-2">
                              <div className="h-2 bg-slate-800 rounded">
                                <div
                                  className="h-full bg-amber-600 rounded"
                                  style={{ width: `${selectedBadge.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-500 font-mono mt-1">
                                {selectedBadge.progress}% complete
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedBadge.earnedAt && (
                        <p className="text-slate-500 font-mono text-xs">
                          Earned on {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'long',
                          }).format(selectedBadge.earnedAt)}
                        </p>
                      )}

                      <button
                        onClick={() => setSelectedBadge(null)}
                        className="mt-4 px-6 py-2 border border-amber-600 text-amber-400 font-mono text-sm hover:bg-amber-600 hover:text-black transition-all"
                      >
                        CLOSE
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer stats */}
            <div className="bg-black/50 border-t-2 border-amber-600/30 p-4">
              <div className="flex justify-between items-center text-sm font-mono">
                <div className="flex gap-4 text-slate-500">
                  <span>🏅 {earnedBadges.length} earned</span>
                  <span>🔒 {lockedBadges.length} locked</span>
                </div>
                <div className="flex gap-2">
                  {Object.entries(RARITY_STYLES).map(([rarity, style]) => {
                    const count = earnedBadges.filter(b => b.rarity === rarity).length;
                    return count > 0 ? (
                      <span key={rarity} className={`${style.text} text-xs`}>
                        {count} {style.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact badge display for dashboard
export function BadgeShowcase({
  badges,
  maxDisplay = 5,
  onViewAll,
}: {
  badges: Badge[];
  maxDisplay?: number;
  onViewAll?: () => void;
}) {
  const earnedBadges = badges.filter(b => b.earnedAt);
  const displayBadges = earnedBadges.slice(0, maxDisplay);

  return (
    <div className="flex items-center gap-2">
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            border-2 ${RARITY_STYLES[badge.rarity].border} ${RARITY_STYLES[badge.rarity].bg}
          `}
          title={badge.name}
        >
          <span className="text-lg">{badge.icon}</span>
        </motion.div>
      ))}

      {earnedBadges.length > maxDisplay && onViewAll && (
        <button
          onClick={onViewAll}
          className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-400 font-mono text-xs hover:bg-slate-700 transition-colors"
        >
          +{earnedBadges.length - maxDisplay}
        </button>
      )}

      {earnedBadges.length === 0 && (
        <span className="text-slate-500 font-mono text-sm">No badges yet</span>
      )}
    </div>
  );
}

// New badge unlock animation
export function BadgeUnlockAnimation({
  badge,
  onComplete,
}: {
  badge: Badge;
  onComplete: () => void;
}) {
  const { playSound } = useSoundEffects();
  const style = RARITY_STYLES[badge.rarity];

  useEffect(() => {
    playSound('achievement');
  }, [playSound]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Radial glow */}
        <motion.div
          className={`absolute inset-0 ${style.bg} rounded-full blur-3xl`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        />

        {/* Badge icon */}
        <motion.div
          className="text-9xl mb-6 relative"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {badge.icon}
        </motion.div>

        {/* Badge unlocked text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-amber-400 font-mono text-2xl tracking-[0.3em] mb-2">
            BADGE UNLOCKED
          </h2>
          <h3 className={`text-3xl font-mono font-bold ${style.text}`}>
            {badge.name}
          </h3>
          <p className="text-slate-400 font-mono text-sm mt-2 max-w-md mx-auto">
            {badge.description}
          </p>
          <span className={`inline-block mt-4 px-4 py-1 ${style.bg} ${style.text} font-mono text-sm`}>
            {style.label}
          </span>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onComplete}
          className="mt-8 px-8 py-3 bg-amber-600 text-black font-mono font-bold tracking-wider hover:bg-amber-500 transition-colors"
        >
          CONTINUE
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
