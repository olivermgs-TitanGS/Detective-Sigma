'use client';

import { useState } from 'react';

type Difficulty = 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';
type GradeLevel = 'P4' | 'P5' | 'P6';
type Complexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';

interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
  };
  story: {
    setting: string;
    crime: string;
    resolution: string;
  };
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    alibi: string;
    isGuilty: boolean;
  }>;
  puzzles: Array<{
    id: string;
    title: string;
    question: string;
    answer: string;
    points: number;
  }>;
}

export default function GenerateCasePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('INSPECTOR');
  const [subject, setSubject] = useState<Subject>('MATH');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('P5');
  const [complexity, setComplexity] = useState<Complexity>('MEDIUM');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCase(null);
    setSavedCaseId(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          subject,
          gradeLevel,
          complexity,
          constraints: { estimatedMinutes },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate case');
      }

      const data = await response.json();
      setGeneratedCase(data.case);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedCase) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case: generatedCase }),
      });

      if (!response.ok) {
        throw new Error('Failed to save case');
      }

      const data = await response.json();
      setSavedCaseId(data.caseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save case');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-400 font-mono tracking-wider">
            CASE GENERATOR
          </h1>
          <p className="text-slate-400 mt-2">
            Procedurally generate new detective cases
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-black/60 border-2 border-amber-600/50 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-amber-400 font-mono">Generation Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Difficulty */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              DIFFICULTY
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ROOKIE">Rookie (P4)</option>
              <option value="INSPECTOR">Inspector (P5)</option>
              <option value="DETECTIVE">Detective (P6)</option>
              <option value="CHIEF">Chief (Advanced)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              SUBJECT
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="MATH">Mathematics</option>
              <option value="SCIENCE">Science</option>
              <option value="INTEGRATED">Integrated</option>
            </select>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              GRADE LEVEL
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="P4">Primary 4</option>
              <option value="P5">Primary 5</option>
              <option value="P6">Primary 6</option>
            </select>
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              COMPLEXITY
            </label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as Complexity)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="SIMPLE">Simple (2-step)</option>
              <option value="MEDIUM">Medium (3-4 step)</option>
              <option value="COMPLEX">Complex (5+ step)</option>
            </select>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              TIME (minutes)
            </label>
            <input
              type="number"
              min={20}
              max={30}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value))}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-8 py-3 font-mono font-bold tracking-wider rounded transition-all ${
              isGenerating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-black'
            }`}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE CASE'}
          </button>

          {generatedCase && !savedCaseId && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-8 py-3 font-mono font-bold tracking-wider rounded transition-all ${
                isSaving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              {isSaving ? 'SAVING...' : 'SAVE TO DATABASE'}
            </button>
          )}

          {savedCaseId && (
            <a
              href={`/admin/cases/${savedCaseId}`}
              className="px-8 py-3 font-mono font-bold tracking-wider rounded bg-blue-600 hover:bg-blue-500 text-white transition-all"
            >
              VIEW SAVED CASE
            </a>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded p-4 text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Generated Case Preview */}
      {generatedCase && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-400 font-mono tracking-wider">
            GENERATED CASE PREVIEW
          </h2>

          {/* Case Overview */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">{generatedCase.title}</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">DIFFICULTY</div>
                <div className="text-white font-bold">{generatedCase.metadata.difficulty}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">SUBJECT</div>
                <div className="text-white font-bold">{generatedCase.metadata.subjectFocus}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">GRADE</div>
                <div className="text-white font-bold">{generatedCase.metadata.gradeLevel}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">TIME</div>
                <div className="text-white font-bold">{generatedCase.metadata.estimatedMinutes} min</div>
              </div>
            </div>
            <div className="text-slate-300 whitespace-pre-line">{generatedCase.briefing}</div>
          </div>

          {/* Suspects */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-400 font-mono mb-4">SUSPECTS ({generatedCase.suspects.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedCase.suspects.map((suspect) => (
                <div
                  key={suspect.id}
                  className={`p-4 rounded border-2 ${
                    suspect.isGuilty
                      ? 'bg-red-900/30 border-red-600'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white">{suspect.name}</div>
                  <div className="text-amber-400 text-sm">{suspect.role}</div>
                  <div className="text-slate-400 text-sm mt-2">{suspect.alibi}</div>
                  {suspect.isGuilty && (
                    <div className="mt-2 text-red-400 font-mono text-xs">GUILTY</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Puzzles */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-400 font-mono mb-4">PUZZLES ({generatedCase.puzzles.length})</h3>
            <div className="space-y-4">
              {generatedCase.puzzles.map((puzzle, index) => (
                <div key={puzzle.id} className="p-4 bg-slate-800 rounded border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white">
                        {index + 1}. {puzzle.title}
                      </div>
                      <div className="text-slate-300 mt-2">{puzzle.question}</div>
                      <div className="text-green-400 text-sm mt-2">
                        Answer: {puzzle.answer}
                      </div>
                    </div>
                    <div className="text-amber-400 font-mono">{puzzle.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story Details */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-400 font-mono mb-4">STORY DETAILS</h3>
            <div className="space-y-4 text-slate-300">
              <div>
                <span className="text-purple-400 font-mono">SETTING:</span>
                <p className="mt-1">{generatedCase.story.setting}</p>
              </div>
              <div>
                <span className="text-purple-400 font-mono">CRIME:</span>
                <p className="mt-1">{generatedCase.story.crime}</p>
              </div>
              <div>
                <span className="text-purple-400 font-mono">RESOLUTION:</span>
                <p className="mt-1">{generatedCase.story.resolution}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
