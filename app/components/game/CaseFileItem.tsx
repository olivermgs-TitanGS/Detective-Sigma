'use client';

import { motion } from 'framer-motion';

export interface CaseFileData {
  id: string;
  label: string;
  type: 'folder' | 'photo' | 'document' | 'evidence';
  color?: 'manila' | 'red' | 'blue' | 'green';
  isNew?: boolean;
  isLocked?: boolean;
}

interface CaseFileItemProps {
  file: CaseFileData;
  index: number;
  onClick: (file: CaseFileData) => void;
}

const colorVariants = {
  manila: {
    folder: 'from-amber-700 via-amber-800 to-amber-900',
    tab: 'from-amber-600 to-amber-700',
  },
  red: {
    folder: 'from-red-800 via-red-900 to-red-950',
    tab: 'from-red-700 to-red-800',
  },
  blue: {
    folder: 'from-blue-800 via-blue-900 to-blue-950',
    tab: 'from-blue-700 to-blue-800',
  },
  green: {
    folder: 'from-green-800 via-green-900 to-green-950',
    tab: 'from-green-700 to-green-800',
  },
};

const fileIcons = {
  folder: '📁',
  photo: '📷',
  document: '📄',
  evidence: '🔍',
};

export default function CaseFileItem({ file, index, onClick }: CaseFileItemProps) {
  const colors = colorVariants[file.color || 'manila'];
  const rotation = (index % 2 === 0 ? 1 : -1) * (2 + (index % 3));

  return (
    <motion.button
      onClick={() => !file.isLocked && onClick(file)}
      className="relative group cursor-pointer"
      style={{ rotate: rotation }}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -15,
        rotate: 0,
        scale: 1.05,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Folder Tab */}
      <div
        className={`
          absolute -top-3 left-3 w-16 h-4
          bg-gradient-to-r ${colors.tab}
          rounded-t-md
          shadow-sm
        `}
      />

      {/* Main Folder Body */}
      <div
        className={`
          relative w-32 h-40
          bg-gradient-to-br ${colors.folder}
          rounded-sm
          shadow-lg
          transition-shadow duration-300
          group-hover:shadow-2xl
          group-hover:shadow-amber-900/30
          overflow-hidden
        `}
      >
        {/* Paper stack effect inside folder */}
        <div className="absolute top-2 left-2 right-2 bottom-8">
          <div className="absolute inset-0 bg-amber-50/90 rounded-sm transform rotate-1" />
          <div className="absolute inset-0 bg-amber-100/90 rounded-sm transform -rotate-1 translate-y-1" />
          <div className="absolute inset-0 bg-amber-50 rounded-sm" />
        </div>

        {/* File icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-4xl filter drop-shadow-lg"
            animate={file.isNew ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {fileIcons[file.type]}
          </motion.span>
        </div>

        {/* Label strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-2">
          <p className="text-amber-100 text-xs font-mono font-bold tracking-wider truncate text-center">
            {file.label}
          </p>
        </div>

        {/* NEW badge */}
        {file.isNew && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
          >
            NEW
          </motion.div>
        )}

        {/* Lock overlay */}
        {file.isLocked && (
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <span className="text-4xl">🔒</span>
              <p className="text-amber-400 text-xs font-mono mt-1">LOCKED</p>
            </div>
          </motion.div>
        )}

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-amber-400/0 via-amber-400/0 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </div>

      {/* Shadow underneath */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-3 bg-black/30 rounded-full blur-md"
        initial={{ opacity: 0.3, scaleX: 1 }}
        whileHover={{ opacity: 0.5, scaleX: 1.1, y: 5 }}
      />

      {/* Hover tooltip */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        initial={{ y: 5 }}
        whileHover={{ y: 0 }}
      >
        <div className="bg-black/90 border border-amber-600/50 px-3 py-1 rounded">
          <p className="text-amber-400 text-xs font-mono">
            {file.isLocked ? '🔒 Solve puzzle to unlock' : 'Click to examine'}
          </p>
        </div>
      </motion.div>
    </motion.button>
  );
}
