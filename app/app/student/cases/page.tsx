'use client';

import Link from 'next/link';
import { useState } from 'react';
import MusicThemeSetter from '@/components/MusicThemeSetter';

// Demo case data with puzzles structure
const demoCases = [
  {
    id: '1',
    title: 'The Missing Canteen Money',
    description: '$50 missing from the school canteen register. Can you solve this mystery?',
    difficulty: 'ROOKIE',
    subjectFocus: 'MATH',
    estimatedMinutes: 30,
    coverImage: '💰',
    caseNumber: 'CASE-001',
    status: 'NEW',
    puzzles: [
      { id: 'p1', name: 'Receipt Analysis', icon: '🧾', type: 'clue', completed: false, description: 'Analyze the canteen receipts' },
      { id: 'p2', name: 'Time Detective', icon: '⏰', type: 'puzzle', completed: false, description: 'Calculate the timeline of events' },
      { id: 'p3', name: 'Money Trail', icon: '💵', type: 'puzzle', completed: false, description: 'Track the missing money' },
      { id: 'master', name: 'Solve the Mystery', icon: '🔍', type: 'master', completed: false, description: 'Identify who took the money' },
    ],
  },
  {
    id: '2',
    title: 'The Mysterious Measurement Mix-Up',
    description: 'The school garden dimensions are all wrong! Plants are dying. Find out why!',
    difficulty: 'INSPECTOR',
    subjectFocus: 'MATH',
    estimatedMinutes: 40,
    coverImage: '📏',
    caseNumber: 'CASE-002',
    status: 'NEW',
    puzzles: [
      { id: 'p1', name: 'Blueprint Examination', icon: '📐', type: 'clue', completed: false, description: 'Study the original garden plans' },
      { id: 'p2', name: 'Area Calculator', icon: '📊', type: 'puzzle', completed: false, description: 'Calculate correct garden areas' },
      { id: 'p3', name: 'Unit Converter', icon: '📏', type: 'puzzle', completed: false, description: 'Convert between measurement units' },
      { id: 'p4', name: 'Scale Model', icon: '🗺️', type: 'puzzle', completed: false, description: 'Work with scale drawings' },
      { id: 'master', name: 'Solve the Mystery', icon: '🔍', type: 'master', completed: false, description: 'Find the measurement error' },
    ],
  },
  {
    id: '3',
    title: 'The Fraction Fraud',
    description: 'Fundraiser money doesn\'t add up. Someone made calculation errors... or did they?',
    difficulty: 'DETECTIVE',
    subjectFocus: 'MATH',
    estimatedMinutes: 45,
    coverImage: '🔢',
    caseNumber: 'CASE-003',
    status: 'NEW',
    puzzles: [
      { id: 'p1', name: 'Donation Records', icon: '📋', type: 'clue', completed: false, description: 'Review class donation records' },
      { id: 'p2', name: 'Fraction Master', icon: '🔢', type: 'puzzle', completed: false, description: 'Calculate fraction donations' },
      { id: 'p3', name: 'Percentage Proof', icon: '📈', type: 'puzzle', completed: false, description: 'Verify percentage calculations' },
      { id: 'p4', name: 'Ratio Detective', icon: '⚖️', type: 'puzzle', completed: false, description: 'Analyze donation ratios' },
      { id: 'p5', name: 'Suspect Interviews', icon: '🗣️', type: 'clue', completed: false, description: 'Question the suspects' },
      { id: 'master', name: 'Solve the Mystery', icon: '🔍', type: 'master', completed: false, description: 'Identify the fraudster' },
    ],
  },
];

const difficultyColors = {
  ROOKIE: { bg: 'bg-green-900/50', border: 'border-green-600', text: 'text-green-400', folder: 'from-green-900 to-green-950' },
  INSPECTOR: { bg: 'bg-amber-900/50', border: 'border-amber-600', text: 'text-amber-400', folder: 'from-amber-900 to-amber-950' },
  DETECTIVE: { bg: 'bg-orange-900/50', border: 'border-orange-600', text: 'text-orange-400', folder: 'from-orange-900 to-orange-950' },
  CHIEF: { bg: 'bg-red-900/50', border: 'border-red-600', text: 'text-red-400', folder: 'from-red-900 to-red-950' },
};

export default function CaseLibrary() {
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const toggleFolder = (caseId: string) => {
    setOpenFolder(openFolder === caseId ? null : caseId);
  };

  return (
    <div className="space-y-8">
      <MusicThemeSetter theme="cases" />

      {/* Header - Evidence Board Style */}
      <div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
          CASE FILE ARCHIVE 📁
        </h1>
        <p className="text-slate-400 font-mono tracking-wide">
          &gt; Select a case folder to view investigation details and puzzles
        </p>
      </div>

      {/* Filters - Investigation Parameters */}
      <div className="border-2 border-amber-600/30 bg-black/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">SUBJECT FOCUS</label>
            <select className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors">
              <option value="">ALL SUBJECTS</option>
              <option value="MATH">MATH</option>
              <option value="SCIENCE">SCIENCE</option>
              <option value="INTEGRATED">INTEGRATED</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-amber-400 mb-2 text-sm font-mono tracking-wider">DIFFICULTY LEVEL</label>
            <select className="w-full bg-black border-2 border-amber-600/30 px-4 py-2 text-amber-400 font-mono focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors">
              <option value="">ALL RANKS</option>
              <option value="ROOKIE">ROOKIE (P4)</option>
              <option value="INSPECTOR">INSPECTOR (P5)</option>
              <option value="DETECTIVE">DETECTIVE (P6)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="border-2 border-amber-600 bg-black hover:bg-amber-600 hover:text-black text-amber-400 px-8 py-2 transition-all font-mono font-bold tracking-wider">
              APPLY FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Case Folders */}
      <div className="space-y-4">
        {demoCases.map((caseItem) => {
          const colors = difficultyColors[caseItem.difficulty as keyof typeof difficultyColors];
          const isOpen = openFolder === caseItem.id;
          const completedPuzzles = caseItem.puzzles.filter(p => p.completed).length;
          const totalPuzzles = caseItem.puzzles.length;

          return (
            <div key={caseItem.id} className="group">
              {/* Case Folder Tab */}
              <button
                onClick={() => toggleFolder(caseItem.id)}
                className={`w-full text-left transition-all duration-300 ${isOpen ? 'mb-0' : ''}`}
              >
                <div
                  className={`relative border-2 ${colors.border} bg-gradient-to-br ${colors.folder} p-6
                    hover:scale-[1.01] transition-all cursor-pointer backdrop-blur-sm
                    ${isOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg'}`}
                  style={{
                    boxShadow: isOpen ? '0 -10px 40px rgba(245, 158, 11, 0.1)' : '0 5px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Folder Tab */}
                  <div
                    className={`absolute -top-3 left-8 ${colors.bg} border-2 ${colors.border} border-b-0 px-4 py-1 rounded-t-md`}
                  >
                    <span className="text-xs font-mono text-amber-400 tracking-wider">{caseItem.caseNumber}</span>
                  </div>

                  {/* Folder Content */}
                  <div className="flex items-center gap-6">
                    {/* Folder Icon */}
                    <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                      {isOpen ? '📂' : '📁'}
                    </div>

                    {/* Case Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`${colors.bg} border ${colors.border} ${colors.text} text-xs px-3 py-1 font-mono font-bold tracking-wider`}>
                          {caseItem.difficulty}
                        </span>
                        <span className="bg-black/80 border border-slate-600 text-slate-300 text-xs px-3 py-1 font-mono font-bold">
                          {caseItem.subjectFocus}
                        </span>
                        <span className="bg-amber-600/20 border border-amber-600 text-amber-400 text-xs px-3 py-1 font-mono font-bold">
                          {caseItem.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-amber-50 mb-1 font-mono tracking-wide group-hover:text-amber-400 transition-colors">
                        {caseItem.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-mono">
                        {caseItem.description}
                      </p>
                    </div>

                    {/* Case Meta */}
                    <div className="text-right">
                      <div className="text-8xl mb-2">{caseItem.coverImage}</div>
                      <div className="flex items-center gap-4 text-sm font-mono">
                        <span className="text-slate-400">⏱️ {caseItem.estimatedMinutes} min</span>
                        <span className={colors.text}>{completedPuzzles}/{totalPuzzles} puzzles</span>
                      </div>
                    </div>

                    {/* Open/Close Indicator */}
                    <div className={`text-3xl ${colors.text} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>
              </button>

              {/* Folder Contents (Puzzles) */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`border-2 ${colors.border} border-t-0 bg-black/90 backdrop-blur-sm rounded-b-lg p-6`}>
                  {/* Inside the Folder Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-600/30">
                    <div>
                      <h4 className="text-lg font-bold text-amber-400 font-mono tracking-wider">
                        📋 CASE CONTENTS
                      </h4>
                      <p className="text-slate-500 text-sm font-mono">
                        &gt; Complete all puzzles to unlock the Master Mystery
                      </p>
                    </div>
                    <Link
                      href={`/student/cases/${caseItem.id}`}
                      className="border-2 border-amber-600 bg-amber-600/10 hover:bg-amber-600 hover:text-black text-amber-400 px-6 py-2 font-mono font-bold tracking-wider transition-all"
                    >
                      VIEW BRIEFING →
                    </Link>
                  </div>

                  {/* Puzzles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseItem.puzzles.map((puzzle, index) => {
                      const isMaster = puzzle.type === 'master';
                      const isClue = puzzle.type === 'clue';
                      const isPuzzle = puzzle.type === 'puzzle';

                      return (
                        <div
                          key={puzzle.id}
                          className={`relative p-4 rounded border-2 transition-all cursor-pointer hover:scale-105 ${
                            isMaster
                              ? 'border-amber-500 bg-amber-900/20 col-span-full md:col-span-2 lg:col-span-3'
                              : isClue
                              ? 'border-blue-500/50 bg-blue-900/10 hover:border-blue-500'
                              : 'border-purple-500/50 bg-purple-900/10 hover:border-purple-500'
                          } ${puzzle.completed ? 'opacity-50' : ''}`}
                        >
                          {/* Puzzle Number */}
                          {!isMaster && (
                            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-black border border-amber-600 flex items-center justify-center">
                              <span className="text-xs text-amber-400 font-mono font-bold">{index + 1}</span>
                            </div>
                          )}

                          <div className={`flex items-center gap-4 ${isMaster ? 'justify-center text-center' : ''}`}>
                            <div className={`text-4xl ${isMaster ? 'text-6xl' : ''}`}>{puzzle.icon}</div>
                            <div className={isMaster ? '' : 'flex-1'}>
                              <div className={`flex items-center gap-2 mb-1 ${isMaster ? 'justify-center' : ''}`}>
                                <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                                  isMaster
                                    ? 'bg-amber-600 text-black font-bold'
                                    : isClue
                                    ? 'bg-blue-600/30 text-blue-300'
                                    : 'bg-purple-600/30 text-purple-300'
                                }`}>
                                  {isMaster ? '⭐ MASTER MYSTERY' : isClue ? 'CLUE' : 'PUZZLE'}
                                </span>
                                {puzzle.completed && (
                                  <span className="text-green-400 text-lg">✓</span>
                                )}
                              </div>
                              <h5 className={`font-bold font-mono ${isMaster ? 'text-xl text-amber-400' : 'text-white'}`}>
                                {puzzle.name}
                              </h5>
                              <p className={`text-sm ${isMaster ? 'text-amber-200' : 'text-slate-400'}`}>
                                {puzzle.description}
                              </p>
                              {isMaster && (
                                <p className="text-amber-500 text-xs mt-2 font-mono">
                                  🔒 Complete all puzzles above to unlock
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Start Investigation Button */}
                  <div className="mt-6 pt-4 border-t border-amber-600/30 text-center">
                    <Link
                      href={`/student/cases/${caseItem.id}/play`}
                      className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black px-12 py-4 font-mono font-bold text-lg tracking-wider transition-all hover:scale-105 shadow-lg shadow-amber-600/30"
                    >
                      🔍 START INVESTIGATION
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (if no cases) */}
      {demoCases.length === 0 && (
        <div className="border-2 border-amber-600/30 bg-black/60 p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-amber-50 mb-2 font-mono tracking-widest">NO CASE FILES AVAILABLE</h3>
          <p className="text-slate-400 font-mono tracking-wide">&gt; Check back later for new investigations!</p>
        </div>
      )}
    </div>
  );
}
