'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MusicThemeSetter from '@/components/MusicThemeSetter';

interface CaseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subjectFocus: string;
  estimatedMinutes: number;
  coverImage: string;
  status: string;
}

const difficultyColors = {
  ROOKIE: { bg: 'bg-green-900/50', border: 'border-green-600', text: 'text-green-400', folder: 'from-green-900 to-green-950' },
  INSPECTOR: { bg: 'bg-amber-900/50', border: 'border-amber-600', text: 'text-amber-400', folder: 'from-amber-900 to-amber-950' },
  DETECTIVE: { bg: 'bg-orange-900/50', border: 'border-orange-600', text: 'text-orange-400', folder: 'from-orange-900 to-orange-950' },
  CHIEF: { bg: 'bg-red-900/50', border: 'border-red-600', text: 'text-red-400', folder: 'from-red-900 to-red-950' },
};

export default function CaseLibrary() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await fetch('/api/cases?published=true', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setCases(data.cases || []);
        }
      } catch (err) {
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  const toggleFolder = (caseId: string) => {
    setOpenFolder(openFolder === caseId ? null : caseId);
  };

  const getCaseNumber = (index: number) => `CASE-${String(index + 1).padStart(3, '0')}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📁</div>
          <p className="text-amber-500 font-mono">Loading case files...</p>
        </div>
      </div>
    );
  }

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
        {cases.map((caseItem, index) => {
          const colors = difficultyColors[caseItem.difficulty as keyof typeof difficultyColors] || difficultyColors.ROOKIE;
          const isOpen = openFolder === caseItem.id;
          const caseNumber = getCaseNumber(index);

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
                    <span className="text-xs font-mono text-amber-400 tracking-wider">{caseNumber}</span>
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
                          {caseItem.status === 'PUBLISHED' ? 'AVAILABLE' : caseItem.status}
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
                      <div className="text-8xl mb-2">{caseItem.coverImage || '📁'}</div>
                      <div className="flex items-center gap-4 text-sm font-mono">
                        <span className="text-slate-400">⏱️ {caseItem.estimatedMinutes} min</span>
                      </div>
                    </div>

                    {/* Open/Close Indicator */}
                    <div className={`text-3xl ${colors.text} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>
              </button>

              {/* Folder Contents */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`border-2 ${colors.border} border-t-0 bg-black/90 backdrop-blur-sm rounded-b-lg p-6`}>
                  {/* Inside the Folder Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-600/30">
                    <div>
                      <h4 className="text-lg font-bold text-amber-400 font-mono tracking-wider">
                        📋 CASE BRIEFING
                      </h4>
                      <p className="text-slate-500 text-sm font-mono">
                        &gt; Investigate scenes, collect clues, and solve the mystery
                      </p>
                    </div>
                    <Link
                      href={`/student/cases/${caseItem.id}`}
                      className="border-2 border-amber-600 bg-amber-600/10 hover:bg-amber-600 hover:text-black text-amber-400 px-6 py-2 font-mono font-bold tracking-wider transition-all"
                    >
                      VIEW BRIEFING →
                    </Link>
                  </div>

                  {/* Case Details */}
                  <div className="text-slate-300 font-mono mb-6">
                    <p>{caseItem.description}</p>
                  </div>

                  {/* Start Investigation Button */}
                  <div className="text-center">
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
      {cases.length === 0 && (
        <div className="border-2 border-amber-600/30 bg-black/60 p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-amber-50 mb-2 font-mono tracking-widest">NO CASE FILES AVAILABLE</h3>
          <p className="text-slate-400 font-mono tracking-wide">&gt; Check back later for new investigations!</p>
        </div>
      )}
    </div>
  );
}
