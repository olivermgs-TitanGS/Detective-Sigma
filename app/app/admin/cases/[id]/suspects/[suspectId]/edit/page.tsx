'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Suspect {
  id: string;
  caseId: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
  bio: string | null;
  isCulprit: boolean;
  dialogueTree: any;
}

export default function EditSuspectPage({
  params,
}: {
  params: Promise<{ id: string; suspectId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [suspect, setSuspect] = useState<Suspect | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    imageUrl: '',
    bio: '',
    isCulprit: false,
  });

  const [dialogueNodes, setDialogueNodes] = useState<Array<{
    id: string;
    question: string;
    answer: string;
  }>>([]);

  useEffect(() => {
    fetchSuspect();
  }, [resolvedParams.suspectId]);

  const fetchSuspect = async () => {
    try {
      const response = await fetch(`/api/admin/suspects/${resolvedParams.suspectId}`);
      if (!response.ok) throw new Error('Failed to fetch suspect');
      const data = await response.json();
      setSuspect(data.suspect);
      setFormData({
        name: data.suspect.name || '',
        role: data.suspect.role || '',
        imageUrl: data.suspect.imageUrl || '',
        bio: data.suspect.bio || '',
        isCulprit: data.suspect.isCulprit || false,
      });

      // Parse dialogue tree
      if (data.suspect.dialogueTree?.nodes) {
        setDialogueNodes(data.suspect.dialogueTree.nodes);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suspect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const dataToSave = {
        name: formData.name,
        role: formData.role || null,
        imageUrl: formData.imageUrl || null,
        bio: formData.bio || null,
        isCulprit: formData.isCulprit,
        dialogueTree: dialogueNodes.length > 0 ? { nodes: dialogueNodes } : null,
      };

      const response = await fetch(`/api/admin/suspects/${resolvedParams.suspectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error('Failed to save suspect');
      setSuccessMessage('Suspect saved successfully!');
      fetchSuspect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDialogueNode = () => {
    setDialogueNodes([
      ...dialogueNodes,
      { id: `node-${Date.now()}`, question: '', answer: '' },
    ]);
  };

  const handleUpdateDialogueNode = (index: number, field: 'question' | 'answer', value: string) => {
    const newNodes = [...dialogueNodes];
    newNodes[index][field] = value;
    setDialogueNodes(newNodes);
  };

  const handleRemoveDialogueNode = (index: number) => {
    setDialogueNodes(dialogueNodes.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-mono animate-pulse">Loading suspect...</div>
      </div>
    );
  }

  if (!suspect) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Suspect not found</p>
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
        <h1 className="text-3xl font-bold text-white">Edit Suspect</h1>
        <p className="text-red-200">{suspect.name}</p>
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

      {/* Suspect Form */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Suspect Details</h2>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-red-200 mb-2 font-medium">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Canteen Manager, Cleaner"
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Image URL (optional)</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Bio / Background</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            placeholder="Background information and personality traits..."
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isCulprit"
            checked={formData.isCulprit}
            onChange={(e) => setFormData({ ...formData, isCulprit: e.target.checked })}
            className="w-5 h-5"
          />
          <label htmlFor="isCulprit" className="text-red-200 font-medium">
            This suspect is the culprit
          </label>
        </div>
      </div>

      {/* Dialogue Tree */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Dialogue Tree</h2>
          <button
            onClick={handleAddDialogueNode}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            + Add Dialogue
          </button>
        </div>

        {dialogueNodes.length === 0 ? (
          <p className="text-red-300 text-center py-8">
            No dialogue nodes yet. Add questions and answers for this suspect.
          </p>
        ) : (
          <div className="space-y-4">
            {dialogueNodes.map((node, index) => (
              <div
                key={node.id}
                className="bg-black/40 border border-red-500/20 p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-red-400 font-mono">Dialogue #{index + 1}</span>
                  <button
                    onClick={() => handleRemoveDialogueNode(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="block text-red-200 mb-1 text-sm">Question</label>
                  <input
                    type="text"
                    value={node.question}
                    onChange={(e) => handleUpdateDialogueNode(index, 'question', e.target.value)}
                    placeholder="What the player asks..."
                    className="w-full bg-black border border-red-500/30 px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-red-200 mb-1 text-sm">Answer</label>
                  <textarea
                    value={node.answer}
                    onChange={(e) => handleUpdateDialogueNode(index, 'answer', e.target.value)}
                    placeholder="How the suspect responds..."
                    rows={3}
                    className="w-full bg-black border border-red-500/30 px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
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
          {isSaving ? 'Saving...' : 'Save Suspect'}
        </button>
      </div>
    </div>
  );
}
