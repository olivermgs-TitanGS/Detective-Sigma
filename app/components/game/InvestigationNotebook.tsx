'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '@/contexts/SoundEffectsContext';

interface NotebookEntry {
  id: string;
  type: 'note' | 'suspect' | 'clue' | 'theory';
  content: string;
  timestamp: Date;
}

interface InvestigationNotebookProps {
  caseId: string;
  caseName?: string;
  isOpen: boolean;
  onClose: () => void;
  /** Collected clues to display */
  collectedClues?: Array<{ id: string; name: string; description: string }>;
  /** Suspects for quick reference */
  suspects?: Array<{ id: string; name: string; role: string }>;
}

// Notebook tabs
const TABS = [
  { id: 'notes', label: 'NOTES', icon: '📝' },
  { id: 'clues', label: 'CLUES', icon: '🔍' },
  { id: 'suspects', label: 'SUSPECTS', icon: '👤' },
  { id: 'theories', label: 'THEORIES', icon: '💡' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function InvestigationNotebook({
  caseId,
  caseName = 'Case File',
  isOpen,
  onClose,
  collectedClues = [],
  suspects = [],
}: InvestigationNotebookProps) {
  const [activeTab, setActiveTab] = useState<TabId>('notes');
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTheory, setNewTheory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { playSound } = useSoundEffects();

  // Load saved entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`notebook_${caseId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed.map((e: NotebookEntry) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load notebook entries:', e);
      }
    }
  }, [caseId]);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(`notebook_${caseId}`, JSON.stringify(entries));
    }
  }, [entries, caseId]);

  // Play sound on open
  useEffect(() => {
    if (isOpen) {
      playSound('caseFileOpen');
    }
  }, [isOpen, playSound]);

  const handleTabChange = (tab: TabId) => {
    playSound('pageTurn');
    setActiveTab(tab);
  };

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;

    const entry: NotebookEntry = {
      id: `note_${Date.now()}`,
      type: 'note',
      content: newNote.trim(),
      timestamp: new Date(),
    };

    setEntries(prev => [entry, ...prev]);
    setNewNote('');
    playSound('typewriter');
  }, [newNote, playSound]);

  const handleAddTheory = useCallback(() => {
    if (!newTheory.trim()) return;

    const entry: NotebookEntry = {
      id: `theory_${Date.now()}`,
      type: 'theory',
      content: newTheory.trim(),
      timestamp: new Date(),
    };

    setEntries(prev => [entry, ...prev]);
    setNewTheory('');
    playSound('stamp');
  }, [newTheory, playSound]);

  const handleDeleteEntry = (id: string) => {
    playSound('paperRustle');
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleClose = () => {
    playSound('modalClose');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      action();
    }
  };

  const handleTextChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 100);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const noteEntries = entries.filter(e => e.type === 'note');
  const theoryEntries = entries.filter(e => e.type === 'theory');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden"
            initial={{ scale: 0.8, rotateY: -90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotateY: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Notebook binding spine */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-r-4 border-amber-950 z-10">
              {/* Spiral binding holes */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-amber-950"
                  style={{ top: `${8 + i * 7.5}%` }}
                />
              ))}
            </div>

            {/* Main notebook content */}
            <div className="ml-8 bg-amber-50 border-2 border-amber-900 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-4 border-b-2 border-amber-950">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-mono tracking-wider">
                      INVESTIGATION NOTEBOOK
                    </h2>
                    <p className="text-amber-300 text-sm font-mono mt-1">
                      {caseName}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-amber-200 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        px-4 py-2 font-mono text-sm tracking-wider transition-all
                        ${activeTab === tab.id
                          ? 'bg-amber-50 text-amber-900 border-t-2 border-x-2 border-amber-900 -mb-[2px]'
                          : 'bg-amber-700/50 text-amber-200 hover:bg-amber-700 border-t-2 border-x-2 border-transparent'
                        }
                      `}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content area with paper texture */}
              <div
                className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      transparent,
                      transparent 27px,
                      #d4c4a8 28px
                    )
                  `,
                  backgroundSize: '100% 28px',
                }}
              >
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {/* New note input */}
                    <div className="bg-white/60 p-4 border border-amber-300 rounded shadow-sm">
                      <label className="block text-amber-800 font-mono text-sm mb-2 tracking-wider">
                        ADD NEW NOTE
                      </label>
                      <textarea
                        ref={textareaRef}
                        value={newNote}
                        onChange={handleTextChange(setNewNote)}
                        onKeyDown={e => handleKeyDown(e, handleAddNote)}
                        placeholder="Write your observations here..."
                        className="w-full bg-transparent border-none outline-none resize-none font-mono text-amber-900 placeholder-amber-400"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-amber-500 font-mono">Ctrl+Enter to save</span>
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className={`
                            px-4 py-1 font-mono text-sm tracking-wider transition-all
                            ${newNote.trim()
                              ? 'bg-amber-700 text-amber-100 hover:bg-amber-800'
                              : 'bg-amber-200 text-amber-400 cursor-not-allowed'
                            }
                          `}
                        >
                          SAVE NOTE
                        </button>
                      </div>
                    </div>

                    {/* Existing notes */}
                    <AnimatePresence mode="popLayout">
                      {noteEntries.map(entry => (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-white/40 p-3 border-l-4 border-amber-600 group relative"
                        >
                          <p className="font-mono text-amber-900 text-sm leading-relaxed pr-8">
                            {entry.content}
                          </p>
                          <span className="text-xs text-amber-500 font-mono mt-2 block">
                            {formatTime(entry.timestamp)}
                          </span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="absolute top-2 right-2 text-amber-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {noteEntries.length === 0 && (
                      <p className="text-center text-amber-500 font-mono italic py-8">
                        No notes yet. Start documenting your observations.
                      </p>
                    )}
                  </div>
                )}

                {/* Clues Tab */}
                {activeTab === 'clues' && (
                  <div className="space-y-3">
                    {collectedClues.length > 0 ? (
                      collectedClues.map((clue, index) => (
                        <motion.div
                          key={clue.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/50 p-4 border border-amber-400 relative"
                        >
                          <div className="absolute -left-2 -top-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                          <h4 className="font-mono font-bold text-amber-900 tracking-wider">
                            {clue.name}
                          </h4>
                          <p className="font-mono text-amber-700 text-sm mt-1">
                            {clue.description}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-amber-600 font-mono">
                          No clues collected yet.
                        </p>
                        <p className="text-amber-500 font-mono text-sm mt-2">
                          Explore crime scenes to find evidence.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Suspects Tab */}
                {activeTab === 'suspects' && (
                  <div className="grid grid-cols-2 gap-4">
                    {suspects.length > 0 ? (
                      suspects.map((suspect, index) => (
                        <motion.div
                          key={suspect.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/50 p-4 border-2 border-amber-400 text-center"
                        >
                          <div className="w-16 h-16 mx-auto bg-amber-200 rounded-full flex items-center justify-center text-3xl mb-3">
                            👤
                          </div>
                          <h4 className="font-mono font-bold text-amber-900">
                            {suspect.name}
                          </h4>
                          <p className="font-mono text-amber-600 text-sm">
                            {suspect.role}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12">
                        <span className="text-6xl mb-4 block">👥</span>
                        <p className="text-amber-600 font-mono">
                          No suspects identified yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Theories Tab */}
                {activeTab === 'theories' && (
                  <div className="space-y-4">
                    {/* New theory input */}
                    <div className="bg-yellow-100/80 p-4 border-2 border-dashed border-amber-500 rounded">
                      <label className="block text-amber-800 font-mono text-sm mb-2 tracking-wider flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        FORM A THEORY
                      </label>
                      <textarea
                        value={newTheory}
                        onChange={handleTextChange(setNewTheory)}
                        onKeyDown={e => handleKeyDown(e, handleAddTheory)}
                        placeholder="Based on the evidence, I believe..."
                        className="w-full bg-transparent border-none outline-none resize-none font-mono text-amber-900 placeholder-amber-500 italic"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddTheory}
                          disabled={!newTheory.trim()}
                          className={`
                            px-4 py-2 font-mono text-sm tracking-wider transition-all flex items-center gap-2
                            ${newTheory.trim()
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-amber-200 text-amber-400 cursor-not-allowed'
                            }
                          `}
                        >
                          <span>📌</span>
                          PIN THEORY
                        </button>
                      </div>
                    </div>

                    {/* Existing theories */}
                    <AnimatePresence mode="popLayout">
                      {theoryEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, rotate: -2 }}
                          animate={{ opacity: 1, rotate: index % 2 === 0 ? 1 : -1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-yellow-200/80 p-4 border border-amber-400 shadow-md relative group"
                          style={{
                            transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)`,
                          }}
                        >
                          {/* Push pin */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-red-700 shadow-md" />

                          <p className="font-mono text-amber-900 text-sm leading-relaxed italic">
                            &ldquo;{entry.content}&rdquo;
                          </p>
                          <span className="text-xs text-amber-600 font-mono mt-2 block">
                            Theory #{theoryEntries.length - theoryEntries.indexOf(entry)}
                          </span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="absolute top-2 right-2 text-amber-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {theoryEntries.length === 0 && (
                      <p className="text-center text-amber-500 font-mono italic py-8">
                        No theories recorded yet. What do you think happened?
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer with stats */}
              <div className="bg-amber-100 border-t-2 border-amber-300 px-6 py-3 flex justify-between items-center">
                <div className="flex gap-6 text-sm font-mono text-amber-700">
                  <span>📝 {noteEntries.length} notes</span>
                  <span>🔍 {collectedClues.length} clues</span>
                  <span>👤 {suspects.length} suspects</span>
                  <span>💡 {theoryEntries.length} theories</span>
                </div>
                <span className="text-xs text-amber-500 font-mono">
                  Auto-saved
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
