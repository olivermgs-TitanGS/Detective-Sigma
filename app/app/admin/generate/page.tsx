'use client';

import { useState } from 'react';
import { GeneratorForm, CasePreview } from './components';
import { useImageGeneration } from './hooks';
import type { Difficulty, Subject, GradeLevel, PuzzleComplexity, GeneratedCase } from './utils/types';

export default function GenerateCasePage() {
  // Form state
  const [difficulty, setDifficulty] = useState<Difficulty>('INSPECTOR');
  const [subject, setSubject] = useState<Subject>('MATH');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('P5');
  const [puzzleComplexity, setPuzzleComplexity] = useState<PuzzleComplexity>('STANDARD');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  // Image generation hook
  const {
    isGeneratingImages,
    generatedImages,
    imageGenProgress,
    imageGenError,
    setImageGenError,
    resetImages,
    generateImagesForCase,
  } = useImageGeneration();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCase(null);
    setSavedCaseId(null);
    resetImages();

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, subject, gradeLevel, puzzleComplexity }),
      });

      if (!response.ok) throw new Error('Failed to generate case');

      const data = await response.json();
      setGeneratedCase(data.case);

      // Auto-start image generation if available
      if (data.case) {
        try {
          const healthCheck = await fetch('/api/generate-image');
          const health = await healthCheck.json();
          if (health.status === 'online') {
            generateImagesForCase(data.case, subject);
          } else {
            setImageGenError('Image generation unavailable (ComfyUI not connected). Click "Generate Images" when ready.');
          }
        } catch {
          setImageGenError('Image generation unavailable. Run ComfyUI locally and click "Generate Images".');
        }
      }
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
        body: JSON.stringify({
          case: generatedCase,
          images: {
            cover: generatedImages.cover,
            suspects: generatedImages.suspects,
            scenes: generatedImages.scenes,
            clues: generatedImages.clues,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to save case');

      const data = await response.json();
      setSavedCaseId(data.caseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save case');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateImages = () => {
    if (generatedCase) {
      generateImagesForCase(generatedCase, subject);
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
      <GeneratorForm
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        subject={subject}
        setSubject={setSubject}
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        puzzleComplexity={puzzleComplexity}
        setPuzzleComplexity={setPuzzleComplexity}
        isGenerating={isGenerating}
        isGeneratingImages={isGeneratingImages}
        isSaving={isSaving}
        hasCase={!!generatedCase}
        savedCaseId={savedCaseId}
        imageGenProgress={imageGenProgress}
        imageGenError={imageGenError}
        error={error}
        onGenerate={handleGenerate}
        onSave={handleSave}
        onGenerateImages={handleGenerateImages}
      />

      {/* Case Preview */}
      {generatedCase && (
        <CasePreview
          generatedCase={generatedCase}
          generatedImages={generatedImages}
          puzzleComplexity={puzzleComplexity}
        />
      )}
    </div>
  );
}
