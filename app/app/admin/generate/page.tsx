'use client';

import { useState } from 'react';

type Difficulty = 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';
type GradeLevel = 'P4' | 'P5' | 'P6' | 'SECONDARY' | 'ADULT';
type PuzzleComplexity = 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';

interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
    puzzleComplexity?: string;
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

interface GeneratedImages {
  cover?: string;
  suspects: Record<string, string>;
  scenes: string[];
}

interface ImageGenProgress {
  current: string;
  completed: number;
  total: number;
}

export default function GenerateCasePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('INSPECTOR');
  const [subject, setSubject] = useState<Subject>('MATH');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('P5');
  const [puzzleComplexity, setPuzzleComplexity] = useState<PuzzleComplexity>('STANDARD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  // Image generation state
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ suspects: {}, scenes: [] });
  const [imageGenProgress, setImageGenProgress] = useState<ImageGenProgress | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCase(null);
    setSavedCaseId(null);
    // Reset images when generating new case
    setGeneratedImages({ suspects: {}, scenes: [] });
    setImageGenError(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          subject,
          gradeLevel,
          puzzleComplexity,
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

  // Generate images for the case
  const handleGenerateImages = async () => {
    if (!generatedCase) return;

    setIsGeneratingImages(true);
    setImageGenError(null);

    const newImages: GeneratedImages = { suspects: {}, scenes: [] };
    const totalImages = 1 + generatedCase.suspects.length; // Cover + suspects

    try {
      let completed = 0;

      // Generate cover image - use case story setting for context
      setImageGenProgress({ current: 'Case Cover', completed, total: totalImages });
      const storyKeywords = generatedCase.story.setting.split(' ').slice(0, 10).join(' ');
      const coverResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageRequest: {
            id: `cover-${generatedCase.caseId}`,
            type: 'cover',
            prompt: `score_9, score_8_up, score_7_up, manila case folder file, detective case file, classified document, confidential folder, red CLASSIFIED stamp, ${storyKeywords}, ${subject === 'MATH' ? 'mathematical equations subtly visible' : subject === 'SCIENCE' ? 'scientific equipment subtly visible' : 'math and science elements'}, mysterious noir atmosphere, dramatic lighting, vintage paper texture, masterpiece, best quality, 8k`,
            negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human',
            width: 512,
            height: 512,
            settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
            metadata: { caseId: generatedCase.caseId },
          },
          saveToPublic: false,
        }),
      });

      if (coverResponse.ok) {
        const coverData = await coverResponse.json();
        if (coverData.success && coverData.imageUrl) {
          newImages.cover = coverData.imageUrl;
        }
      }
      completed++;

      // Generate suspect portraits - use name and role for context
      for (const suspect of generatedCase.suspects) {
        setImageGenProgress({ current: `Suspect: ${suspect.name}`, completed, total: totalImages });

        // Infer ethnicity from name for Singapore context
        const inferEthnicity = (name: string) => {
          if (/^(Tan|Lim|Lee|Ng|Wong|Chan|Goh|Ong|Koh|Chua|Chen)/i.test(name)) return 'East Asian Singaporean Chinese';
          if (/^(Ahmad|Muhammad|Siti|Nur|Abdul|Ibrahim)/i.test(name)) return 'Southeast Asian Malay';
          if (/^(Raj|Kumar|Sharma|Singh|Devi|Muthu)/i.test(name)) return 'South Asian Indian';
          return 'Singaporean';
        };

        const ethnicity = inferEthnicity(suspect.name);
        const expression = suspect.isGuilty ? 'slightly nervous expression, avoiding eye contact' : 'calm confident expression';

        const suspectResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `suspect-${suspect.id}`,
              type: 'suspect',
              prompt: `score_9, score_8_up, score_7_up, 1person, solo, portrait, looking at viewer, ${ethnicity} ${suspect.role}, ${expression}, professional headshot, studio lighting, neutral grey background, photorealistic, detailed face, detailed eyes, Singapore setting, masterpiece, best quality, 8k, DSLR photo, 85mm portrait lens`,
              negativePrompt: 'score_6, score_5, worst quality, low quality, bad anatomy, bad face, deformed, blurry, watermark, text, multiple people',
              width: 512,
              height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { suspectId: suspect.id, name: suspect.name, role: suspect.role },
            },
            saveToPublic: false,
          }),
        });

        if (suspectResponse.ok) {
          const suspectData = await suspectResponse.json();
          if (suspectData.success && suspectData.imageUrl) {
            newImages.suspects[suspect.id] = suspectData.imageUrl;
          }
        }
        completed++;

        // Update state progressively so images appear as they're generated
        setGeneratedImages({ ...newImages });
      }

      setGeneratedImages(newImages);
      setImageGenProgress(null);
    } catch (err) {
      setImageGenError(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setIsGeneratingImages(false);
      setImageGenProgress(null);
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
              <option value="SECONDARY">Secondary</option>
              <option value="ADULT">Adult</option>
            </select>
          </div>

          {/* Puzzle Complexity */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              PUZZLE COMPLEXITY
            </label>
            <select
              value={puzzleComplexity}
              onChange={(e) => setPuzzleComplexity(e.target.value as PuzzleComplexity)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="BASIC">Basic (Quick, 1-2 steps)</option>
              <option value="STANDARD">Standard (Multi-step reasoning)</option>
              <option value="CHALLENGING">Challenging (Data analysis required)</option>
              <option value="EXPERT">Expert (Adult difficulty)</option>
            </select>
            <p className="text-slate-500 text-xs mt-1">
              {puzzleComplexity === 'BASIC' && 'Simple single-step problems for younger students'}
              {puzzleComplexity === 'STANDARD' && 'Multi-step problems requiring reasoning'}
              {puzzleComplexity === 'CHALLENGING' && 'Complex puzzles with data tables and cross-referencing'}
              {puzzleComplexity === 'EXPERT' && 'Layered analysis with red herrings - challenges adults!'}
            </p>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              TIME (auto-calculated)
            </label>
            <div className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-slate-400">
              {puzzleComplexity === 'BASIC' && '~12-15 min'}
              {puzzleComplexity === 'STANDARD' && '~20-25 min'}
              {puzzleComplexity === 'CHALLENGING' && '~45-60 min'}
              {puzzleComplexity === 'EXPERT' && '~60-90 min'}
            </div>
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

          {generatedCase && (
            <button
              onClick={handleGenerateImages}
              disabled={isGeneratingImages}
              className={`px-8 py-3 font-mono font-bold tracking-wider rounded transition-all ${
                isGeneratingImages
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isGeneratingImages ? 'GENERATING IMAGES...' : 'GENERATE IMAGES'}
            </button>
          )}
        </div>

        {/* Image Generation Progress */}
        {imageGenProgress && (
          <div className="bg-purple-900/30 border border-purple-600 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-mono">
                Generating: {imageGenProgress.current}
              </span>
              <span className="text-purple-400 font-mono">
                {imageGenProgress.completed}/{imageGenProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(imageGenProgress.completed / imageGenProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {imageGenError && (
          <div className="bg-red-900/50 border border-red-600 rounded p-4 text-red-300">
            Image Error: {imageGenError}
          </div>
        )}

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
            <div className="flex gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                {generatedImages.cover ? (
                  <img
                    src={generatedImages.cover}
                    alt="Case Cover"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-amber-600"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                    <span className="text-slate-500 text-xs font-mono text-center px-2">
                      Click<br/>GENERATE<br/>IMAGES
                    </span>
                  </div>
                )}
              </div>

              {/* Case Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-4">{generatedCase.title}</h3>
                <div className="grid grid-cols-5 gap-4 mb-4">
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
                <div className="text-amber-400 font-mono text-sm">COMPLEXITY</div>
                <div className="text-white font-bold">{generatedCase.metadata.puzzleComplexity || puzzleComplexity}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">EST. TIME</div>
                <div className="text-white font-bold">{generatedCase.metadata.estimatedMinutes} min</div>
              </div>
                </div>
                <div className="text-slate-300 whitespace-pre-line">{generatedCase.briefing}</div>
              </div>
            </div>
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
                  {/* Suspect Portrait */}
                  <div className="flex gap-3 mb-2">
                    {generatedImages.suspects[suspect.id] ? (
                      <img
                        src={generatedImages.suspects[suspect.id]}
                        alt={suspect.name}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-700 rounded-lg border border-slate-500 flex items-center justify-center">
                        <span className="text-slate-500 text-2xl">?</span>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white">{suspect.name}</div>
                      <div className="text-amber-400 text-sm">{suspect.role}</div>
                      {suspect.isGuilty && (
                        <div className="text-red-400 font-mono text-xs">GUILTY</div>
                      )}
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm">{suspect.alibi}</div>
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
