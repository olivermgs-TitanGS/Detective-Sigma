'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface Scene {
  id: string;
  caseId: string;
  name: string;
  description: string | null;
  imageUrl: string;
  isInitialScene: boolean;
  orderIndex: number;
  clues: Clue[];
}

export default function EditScenePage({
  params,
}: {
  params: Promise<{ id: string; sceneId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [scene, setScene] = useState<Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isInitialScene: false,
    orderIndex: 0,
  });

  useEffect(() => {
    fetchScene();
  }, [resolvedParams.sceneId]);

  const fetchScene = async () => {
    try {
      const response = await fetch(`/api/admin/scenes/${resolvedParams.sceneId}`);
      if (!response.ok) throw new Error('Failed to fetch scene');
      const data = await response.json();
      setScene(data.scene);
      setFormData({
        name: data.scene.name || '',
        description: data.scene.description || '',
        imageUrl: data.scene.imageUrl || '',
        isInitialScene: data.scene.isInitialScene || false,
        orderIndex: data.scene.orderIndex || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scene');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/scenes/${resolvedParams.sceneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save scene');
      setSuccessMessage('Scene saved successfully!');
      fetchScene();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClue = async () => {
    const name = prompt('Enter clue name:');
    if (!name) return;

    try {
      const response = await fetch(`/api/admin/clues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId: resolvedParams.sceneId,
          name,
          description: '',
          isHidden: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to add clue');
      setSuccessMessage('Clue added!');
      fetchScene();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add clue');
    }
  };

  const handleEditClue = async (clue: Clue) => {
    const name = prompt('Edit clue name:', clue.name);
    if (name === null) return; // User cancelled

    const description = prompt('Edit clue description:', clue.description || '');
    if (description === null) return;

    const contentRevealed = prompt('Edit content revealed (what the clue tells the player):', clue.contentRevealed || '');
    if (contentRevealed === null) return;

    try {
      const response = await fetch(`/api/admin/clues/${clue.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || clue.name,
          description: description || null,
          contentRevealed: contentRevealed || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update clue');
      setSuccessMessage('Clue updated!');
      fetchScene();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update clue');
    }
  };

  const handleDeleteClue = async (clueId: string) => {
    if (!confirm('Delete this clue?')) return;

    try {
      const response = await fetch(`/api/admin/clues/${clueId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete clue');
      setSuccessMessage('Clue deleted!');
      fetchScene();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete clue');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-mono animate-pulse">Loading scene...</div>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Scene not found</p>
        <Link
          href={`/admin/cases/${resolvedParams.id}/edit`}
          className="text-red-300 hover:text-white mt-4 inline-block"
        >
          Back to Case
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/cases/${resolvedParams.id}/edit`}
          className="text-red-300 hover:text-white transition-colors mb-2 inline-block"
        >
          ← Back to Case
        </Link>
        <h1 className="text-3xl font-bold text-white">Edit Scene</h1>
        <p className="text-red-200">{scene.name}</p>
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

      {/* Scene Details Form */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Scene Details</h2>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-red-200 mb-2 font-medium">Order Index</label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="isInitialScene"
              checked={formData.isInitialScene}
              onChange={(e) => setFormData({ ...formData, isInitialScene: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="isInitialScene" className="text-red-200 font-medium">
              Initial Scene
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 font-bold transition-colors ${
              isSaving
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Scene'}
          </button>
        </div>
      </div>

      {/* Clues Section */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Clues ({scene.clues.length})</h2>
          <button
            onClick={handleAddClue}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            + Add Clue
          </button>
        </div>

        {scene.clues.length === 0 ? (
          <p className="text-red-300 text-center py-8">No clues in this scene. Add your first clue!</p>
        ) : (
          <div className="space-y-3">
            {scene.clues.map((clue) => (
              <div
                key={clue.id}
                className="bg-black/40 border border-red-500/20 p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{clue.name}</span>
                    {clue.isHidden && (
                      <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs">Hidden</span>
                    )}
                  </div>
                  <p className="text-red-300 text-sm mt-1">{clue.description || 'No description'}</p>
                  {clue.contentRevealed && (
                    <p className="text-green-400 text-xs mt-1">Reveals: {clue.contentRevealed}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClue(clue)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClue(clue.id)}
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
    </div>
  );
}
