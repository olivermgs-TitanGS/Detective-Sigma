'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Puzzle {
  id: string;
  caseId: string;
  title: string;
  type: string;
  questionText: string;
  questionImage: string | null;
  correctAnswer: string;
  hint: string | null;
  options: string[] | null;
  points: number;
}

const puzzleTypes = [
  { value: 'MATH_WORD', label: 'Math Word Problem' },
  { value: 'SCIENCE_INQUIRY', label: 'Science Inquiry' },
  { value: 'LOGIC_CIPHER', label: 'Logic/Cipher' },
  { value: 'PATTERN_RECOGNITION', label: 'Pattern Recognition' },
];

export default function EditPuzzlePage({
  params,
}: {
  params: Promise<{ id: string; puzzleId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'MATH_WORD',
    questionText: '',
    questionImage: '',
    correctAnswer: '',
    hint: '',
    points: 10,
    options: ['', '', '', ''],
    hasOptions: false,
  });

  useEffect(() => {
    fetchPuzzle();
  }, [resolvedParams.puzzleId]);

  const fetchPuzzle = async () => {
    try {
      const response = await fetch(`/api/admin/puzzles/${resolvedParams.puzzleId}`);
      if (!response.ok) throw new Error('Failed to fetch puzzle');
      const data = await response.json();
      setPuzzle(data.puzzle);

      const options = data.puzzle.options || ['', '', '', ''];
      setFormData({
        title: data.puzzle.title || '',
        type: data.puzzle.type || 'MATH_WORD',
        questionText: data.puzzle.questionText || '',
        questionImage: data.puzzle.questionImage || '',
        correctAnswer: data.puzzle.correctAnswer || '',
        hint: data.puzzle.hint || '',
        points: data.puzzle.points || 10,
        options: Array.isArray(options) ? options : ['', '', '', ''],
        hasOptions: Array.isArray(data.puzzle.options) && data.puzzle.options.length > 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle');
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
        title: formData.title,
        type: formData.type,
        questionText: formData.questionText,
        questionImage: formData.questionImage || null,
        correctAnswer: formData.correctAnswer,
        hint: formData.hint || null,
        points: formData.points,
        options: formData.hasOptions ? formData.options.filter(o => o.trim()) : null,
      };

      const response = await fetch(`/api/admin/puzzles/${resolvedParams.puzzleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error('Failed to save puzzle');
      setSuccessMessage('Puzzle saved successfully!');
      fetchPuzzle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 font-mono animate-pulse">Loading puzzle...</div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Puzzle not found</p>
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
        <h1 className="text-3xl font-bold text-white">Edit Puzzle</h1>
        <p className="text-red-200">{puzzle.title}</p>
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

      {/* Puzzle Form */}
      <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Puzzle Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-red-200 mb-2 font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-red-200 mb-2 font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            >
              {puzzleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Question</label>
          <textarea
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            rows={6}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Question Image URL (optional)</label>
          <input
            type="text"
            value={formData.questionImage}
            onChange={(e) => setFormData({ ...formData, questionImage: e.target.value })}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-red-200 mb-2 font-medium">Correct Answer</label>
            <input
              type="text"
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-red-200 mb-2 font-medium">Points</label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
              min="1"
              max="100"
              className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-red-200 mb-2 font-medium">Hint (optional)</label>
          <input
            type="text"
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            className="w-full bg-black border border-red-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Multiple Choice Options */}
        <div className="border-t border-red-500/20 pt-4 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="hasOptions"
              checked={formData.hasOptions}
              onChange={(e) => setFormData({ ...formData, hasOptions: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="hasOptions" className="text-red-200 font-medium">
              Multiple Choice (MCQ)
            </label>
          </div>

          {formData.hasOptions && (
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-red-400 font-mono w-8">{String.fromCharCode(65 + index)}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 bg-black border border-red-500/30 px-4 py-2 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}
              <p className="text-red-400 text-sm">
                Make sure the correct answer matches one of the options exactly.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 font-bold transition-colors ${
              isSaving
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Puzzle'}
          </button>
        </div>
      </div>
    </div>
  );
}
