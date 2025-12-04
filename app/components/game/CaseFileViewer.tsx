'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaseFileData } from './CaseFileItem';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

export interface FileContent {
  title: string;
  description?: string;
  photos?: {
    id: string;
    url: string;
    caption: string;
  }[];
  documents?: {
    id: string;
    title: string;
    content: string;
  }[];
  notes?: string[];
  clueRevealed?: string;
}

interface CaseFileViewerProps {
  file: CaseFileData;
  content: FileContent;
  onClose: () => void;
}

export default function CaseFileViewer({ file, content, onClose }: CaseFileViewerProps) {
  const [showStamp, setShowStamp] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [showClue, setShowClue] = useState(false);
  const { playSound } = useSoundEffects();

  // Play folder open sound on mount
  useEffect(() => {
    playSound('folderOpen');
  }, [playSound]);

  // Typewriter effect for title
  useEffect(() => {
    let index = 0;
    const text = content.title;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypewriterText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setShowStamp(true);
          playSound('stamp');
        }, 300);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [content.title, playSound]);

  // Show clue after delay
  useEffect(() => {
    if (content.clueRevealed) {
      const timer = setTimeout(() => {
        setShowClue(true);
        playSound('clueFound');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content.clueRevealed, playSound]);

  const handleClose = () => {
    playSound('folderClose');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
        />

        {/* Spotlight effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Main file content */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.5, rotateX: -30, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotateX: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Folder opening animation wrapper */}
          <motion.div
            className="aged-paper rounded-lg overflow-hidden"
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            style={{ transformOrigin: 'top center', perspective: 1000 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-6 border-b-4 border-amber-950">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Case file label */}
                  <motion.div
                    className="inline-block bg-amber-400 text-black px-3 py-1 text-xs font-bold font-mono tracking-widest mb-2"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    CASE FILE #{file.id}
                  </motion.div>

                  {/* Typewriter title */}
                  <h2 className="text-2xl font-bold text-amber-100 font-mono tracking-wider">
                    <span>{typewriterText}</span>
                    <span className="inline-block w-0.5 h-6 bg-amber-400 ml-1 animate-pulse" />
                  </h2>
                </div>

                {/* Close button */}
                <motion.button
                  onClick={handleClose}
                  className="text-amber-400 hover:text-amber-200 text-3xl leading-none transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>

              {/* Classified stamp */}
              <AnimatePresence>
                {showStamp && (
                  <motion.div
                    className="absolute top-4 right-16 pointer-events-none"
                    initial={{ scale: 4, rotate: -25, opacity: 0 }}
                    animate={{ scale: 1, rotate: -12, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div className="border-4 border-red-600 text-red-600 px-4 py-2 font-bold text-xl font-mono tracking-widest transform opacity-80">
                      CLASSIFIED
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto bg-amber-50/95">
              {/* Description */}
              {content.description && (
                <motion.div
                  className="mb-6 p-4 bg-white/80 border-l-4 border-amber-600 shadow-md"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-stone-800 font-mono leading-relaxed">
                    {content.description}
                  </p>
                </motion.div>
              )}

              {/* Photos grid */}
              {content.photos && content.photos.length > 0 && (
                <div className="mb-6">
                  <motion.h3
                    className="text-amber-900 font-bold font-mono tracking-wider mb-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-xl">📷</span> PHOTOGRAPHIC EVIDENCE
                  </motion.h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {content.photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        className="polaroid cursor-pointer hover:z-10"
                        style={{ '--rotation': `${(index % 2 === 0 ? 1 : -1) * (2 + index)}deg` } as React.CSSProperties}
                        initial={{ y: -100, rotate: 0, opacity: 0, scale: 0 }}
                        animate={{
                          y: 0,
                          rotate: (index % 2 === 0 ? 1 : -1) * (2 + index),
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.7 + index * 0.15,
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 0,
                          zIndex: 10,
                          transition: { type: 'spring', stiffness: 300 },
                        }}
                        onClick={() => setCurrentPhotoIndex(index)}
                      >
                        {/* Photo placeholder */}
                        <div className="w-full aspect-square bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center">
                          <span className="text-4xl filter drop-shadow-lg">
                            {photo.url ? '🖼️' : '📷'}
                          </span>
                        </div>
                        {/* Caption */}
                        <p className="text-center text-stone-600 text-xs font-mono mt-2 px-1">
                          {photo.caption}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {content.documents && content.documents.length > 0 && (
                <div className="mb-6">
                  <motion.h3
                    className="text-amber-900 font-bold font-mono tracking-wider mb-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-xl">📄</span> DOCUMENTS
                  </motion.h3>

                  <div className="space-y-4">
                    {content.documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        className="paper-texture p-4 shadow-lg border border-amber-200"
                        initial={{
                          x: index % 2 === 0 ? -100 : 100,
                          rotate: index % 2 === 0 ? -5 : 5,
                          opacity: 0,
                        }}
                        animate={{ x: 0, rotate: 0, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 150,
                          damping: 15,
                          delay: 0.9 + index * 0.2,
                        }}
                      >
                        <h4 className="text-amber-900 font-bold font-mono text-sm tracking-wider mb-2 border-b border-amber-300 pb-2">
                          {doc.title}
                        </h4>
                        <p className="text-stone-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                          {doc.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Handwritten notes */}
              {content.notes && content.notes.length > 0 && (
                <div className="mb-6">
                  <motion.h3
                    className="text-amber-900 font-bold font-mono tracking-wider mb-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <span className="text-xl">📝</span> INVESTIGATOR NOTES
                  </motion.h3>

                  <div className="space-y-3">
                    {content.notes.map((note, index) => (
                      <motion.div
                        key={index}
                        className="bg-yellow-100 p-3 shadow-md transform"
                        style={{ rotate: `${(index % 2 === 0 ? 1 : -1) * 1}deg` }}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: (index % 2 === 0 ? 1 : -1) * 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          delay: 1.1 + index * 0.1,
                        }}
                      >
                        {/* Push pin */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <motion.div
                            className="push-pin"
                            initial={{ y: -30, scale: 0 }}
                            animate={{ y: 0, scale: 1 }}
                            transition={{ type: 'spring', delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                        <p className="text-stone-800 font-mono text-sm italic">
                          "{note}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clue revealed */}
              <AnimatePresence>
                {showClue && content.clueRevealed && (
                  <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-2 border-green-500 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.span
                        className="text-3xl"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: 2, duration: 0.5 }}
                      >
                        💡
                      </motion.span>
                      <div>
                        <h4 className="text-green-400 font-bold font-mono tracking-wider mb-1">
                          CLUE DISCOVERED!
                        </h4>
                        <p className="text-green-100 font-mono leading-relaxed">
                          {content.clueRevealed}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-amber-900/90 border-t-2 border-amber-950">
              <motion.button
                onClick={handleClose}
                className="w-full border-2 border-amber-400 bg-transparent hover:bg-amber-400 hover:text-black text-amber-400 font-mono font-bold py-3 transition-all tracking-wider"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                CLOSE FILE →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
