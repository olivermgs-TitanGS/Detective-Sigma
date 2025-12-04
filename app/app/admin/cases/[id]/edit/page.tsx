'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'details' | 'scenes' | 'puzzles' | 'suspects';

interface Scene {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  isInitialScene: boolean;
  orderIndex: number;
  clues: Clue[];
}

interface Clue {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  contentRevealed: string | null;
  isHidden: boolean;
  positionX: number | null;
  positionY: number | null;
}

interface Puzzle {
  id: string;
  title: string;
  type: string;
  questionText: string;
  questionImage: string | null;
  correctAnswer: string;
  hint: string | null;
  options: string[] | null;
  points: number;
}

interface Suspect {
  id: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
  bio: string | null;
  isCulprit: boolean;
  dialogueTree: any;
}

interface CaseData {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  subjectFocus: string;
  difficulty: string;
  status: string;
  coverImage: string | null;
  estimatedMinutes: number;
  masterClueFragment: string | null;
  scenes: Scene[];
  puzzles: Puzzle[];
  suspects: Suspect[];
}

export default function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for case details
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    subjectFocus: 'MATH',
    difficulty: 'INSPECTOR',
    status: 'DRAFT',
    coverImage: '',
    estimatedMinutes: 30,
    masterClueFragment: '',
  });

  useEffect(() => {
    fetchCase();
  }, [resolvedParams.id]);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/cases/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Failed to fetch case');
      const data = await response.json();
      setCaseData(data.case);
      setFormData({
        title: data.case.title || '',
        description: data.case.description || '',
        subject: data.case.subject || 'Mathematics',
        subjectFocus: data.case.subjectFocus || 'MATH',
        difficulty: data.case.difficulty || 'INSPECTOR',
        status: data.case.status || 'DRAFT',
        coverImage: data.case.coverImage || '',
        estimatedMinutes: data.case.estimatedMinutes || 30,
        masterClueFragment: data.case.masterClueFragment || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/cases/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save case');
      setSuccessMessage('Case details saved successfully!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCase = async () => {
    if (!confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/cases/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete case');
      router.push('/admin/cases');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // Scene CRUD
  const handleAddScene = async () => {
    const name = prompt('Enter scene name:');
    if (!name) return;

    try {
      const response = await fetch(`/api/admin/scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: resolvedParams.id,
          name,
          description: '',
          imageUrl: '/images/scenes/default.png',
          orderIndex: caseData?.scenes.length || 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to add scene');
      setSuccessMessage('Scene added!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add scene');
    }
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (!confirm('Delete this scene and all its clues?')) return;

    try {
      const response = await fetch(`/api/admin/scenes/${sceneId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete scene');
      setSuccessMessage('Scene deleted!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete scene');
    }
  };

  // Puzzle CRUD
  const handleAddPuzzle = async () => {
    const title = prompt('Enter puzzle title:');
    if (!title) return;

    try {
      const response = await fetch(`/api/admin/puzzles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: resolvedParams.id,
          title,
          type: 'MATH_WORD',
          questionText: 'Enter question here',
          correctAnswer: '',
          hint: '',
          points: 10,
        }),
      });

      if (!response.ok) throw new Error('Failed to add puzzle');
      setSuccessMessage('Puzzle added!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add puzzle');
    }
  };

  const handleDeletePuzzle = async (puzzleId: string) => {
    if (!confirm('Delete this puzzle?')) return;

    try {
      const response = await fetch(`/api/admin/puzzles/${puzzleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete puzzle');
      setSuccessMessage('Puzzle deleted!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete puzzle');
    }
  };

  // Suspect CRUD
  const handleAddSuspect = async () => {
    const name = prompt('Enter suspect name:');
    if (!name) return;

    try {
      const response = await fetch(`/api/admin/suspects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: resolvedParams.id,
          name,
          role: '',
          bio: '',
          isCulprit: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to add suspect');
      setSuccessMessage('Suspect added!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add suspect');
    }
  };

  const handleDeleteSuspect = async (suspectId: string) => {
    if (!confirm('Delete this suspect?')) return;

    try {
      const response = await fetch(`/api/admin/suspects/${suspectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete suspect');
      setSuccessMessage('Suspect deleted!');
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete suspect');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-mono animate-pulse">Loading case...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Case not found</p>
        <Link href="/admin/cases" className="text-red-300 hover:text-white mt-4 inline-block">
          Back to Cases
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'details', label: 'Details' },
    { key: 'scenes', label: 'Scenes', count: caseData.scenes.length },
    { key: 'puzzles', label: 'Puzzles', count: caseData.puzzles.length },
    { key: 'suspects', label: 'Suspects', count: caseData.suspects.length },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/cases"
            className="text-red-300 hover:text-white transition-colors mb-2 inline-block"
          >
            ← Back to Cases
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Case</h1>
          <p className="text-red-200">{caseData.title}</p>
        </div>
        <div className="flex gap-3">
          <span className={`px-3 py-1 text-sm font-mono ${
            caseData.status === 'PUBLISHED'
              ? 'bg-green-900/50 text-green-300 border border-green-600'
              : 'bg-yellow-900/50 text-yellow-300 border border-yellow-600'
          }`}>
            {caseData.status}
          </span>
          <button
            onClick={handleDeleteCase}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 border border-red-600 transition-colors"
          >
            Delete Case
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 p-4 text-red-200">
          {error}
          <button onClick={() => setError(null)} className="float-right text-red-400 hover:text-white">×</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-900/50 border border-green-600 p-4 text-green-200">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className="float-right text-green-400 hover:text-white">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-red-800/50">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-mono text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-red-900/50 text-white border-t border-x border-red-600'
                  : 'text-red-400 hover:text-white hover:bg-red-900/20'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-red-800/50 text-xs">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-red-200 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-red-200 mb-2 font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Subject Focus */}
              <div>
                <label className="block text-red-200 mb-2 font-medium">Subject Focus</label>
                <select
                  value={formData.subjectFocus}
                  onChange={(e) => {
                    const subjectMap: Record<string, string> = {
                      'MATH': 'Mathematics',
                      'SCIENCE': 'Science',
                      'INTEGRATED': 'Integrated'
                    };
                    setFormData({
                      ...formData,
                      subjectFocus: e.target.value,
                      subject: subjectMap[e.target.value] || 'Integrated'
                    });
                  }}
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="MATH">Math</option>
                  <option value="SCIENCE">Science</option>
                  <option value="INTEGRATED">Integrated</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-red-200 mb-2 font-medium">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="ROOKIE">Rookie (P4)</option>
                  <option value="INSPECTOR">Inspector (P5)</option>
                  <option value="DETECTIVE">Detective (P6)</option>
                  <option value="CHIEF">Chief (Advanced)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-red-200 mb-2 font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              {/* Estimated Minutes */}
              <div>
                <label className="block text-red-200 mb-2 font-medium">Estimated Minutes</label>
                <input
                  type="number"
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 30 })}
                  min="10"
                  max="120"
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Cover Image/Emoji */}
              <div>
                <label className="block text-red-200 mb-2 font-medium">Cover Emoji</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="e.g., 🔍"
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Master Clue Fragment */}
              <div className="md:col-span-2">
                <label className="block text-red-200 mb-2 font-medium">Master Clue Fragment (Final Reveal)</label>
                <textarea
                  value={formData.masterClueFragment}
                  onChange={(e) => setFormData({ ...formData, masterClueFragment: e.target.value })}
                  rows={3}
                  placeholder="The final revelation when the case is solved..."
                  className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveDetails}
                disabled={isSaving}
                className={`px-8 py-3 font-bold transition-colors ${
                  isSaving
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        )}

        {/* Scenes Tab */}
        {activeTab === 'scenes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Scenes ({caseData.scenes.length})</h3>
              <button
                onClick={handleAddScene}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                + Add Scene
              </button>
            </div>

            {caseData.scenes.length === 0 ? (
              <p className="text-red-300 text-center py-8">No scenes yet. Add your first scene!</p>
            ) : (
              <div className="space-y-3">
                {caseData.scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="bg-black/40 border border-red-500/20 p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-mono">#{index + 1}</span>
                        <span className="text-white font-bold">{scene.name}</span>
                        {scene.isInitialScene && (
                          <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs">Initial</span>
                        )}
                      </div>
                      <p className="text-red-300 text-sm mt-1">{scene.description || 'No description'}</p>
                      <p className="text-red-400 text-xs mt-1">{scene.clues.length} clues</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/cases/${resolvedParams.id}/scenes/${scene.id}/edit`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteScene(scene.id)}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Puzzles Tab */}
        {activeTab === 'puzzles' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Puzzles ({caseData.puzzles.length})</h3>
              <button
                onClick={handleAddPuzzle}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                + Add Puzzle
              </button>
            </div>

            {caseData.puzzles.length === 0 ? (
              <p className="text-red-300 text-center py-8">No puzzles yet. Add your first puzzle!</p>
            ) : (
              <div className="space-y-3">
                {caseData.puzzles.map((puzzle, index) => (
                  <div
                    key={puzzle.id}
                    className="bg-black/40 border border-red-500/20 p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-mono">#{index + 1}</span>
                        <span className="text-white font-bold">{puzzle.title}</span>
                        <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs">{puzzle.type}</span>
                        <span className="px-2 py-0.5 bg-amber-900/50 text-amber-300 text-xs">{puzzle.points} pts</span>
                      </div>
                      <p className="text-red-300 text-sm mt-1 line-clamp-2">{puzzle.questionText}</p>
                      <p className="text-green-400 text-xs mt-1">Answer: {puzzle.correctAnswer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/cases/${resolvedParams.id}/puzzles/${puzzle.id}/edit`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePuzzle(puzzle.id)}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suspects Tab */}
        {activeTab === 'suspects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Suspects ({caseData.suspects.length})</h3>
              <button
                onClick={handleAddSuspect}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                + Add Suspect
              </button>
            </div>

            {caseData.suspects.length === 0 ? (
              <p className="text-red-300 text-center py-8">No suspects yet. Add your first suspect!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseData.suspects.map((suspect) => (
                  <div
                    key={suspect.id}
                    className={`bg-black/40 border p-4 ${
                      suspect.isCulprit
                        ? 'border-red-600 bg-red-900/20'
                        : 'border-red-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{suspect.name}</span>
                          {suspect.isCulprit && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs">CULPRIT</span>
                          )}
                        </div>
                        <p className="text-amber-400 text-sm">{suspect.role || 'No role'}</p>
                        <p className="text-red-300 text-sm mt-2 line-clamp-3">{suspect.bio || 'No bio'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/admin/cases/${resolvedParams.id}/suspects/${suspect.id}/edit`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteSuspect(suspect.id)}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
