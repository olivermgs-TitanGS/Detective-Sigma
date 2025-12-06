/**
 * Generator form component with parameter controls
 */

import type { Difficulty, Subject, GradeLevel, PuzzleComplexity, ContentRating, ImageGenProgress } from '../utils/types';

interface GeneratorFormProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  subject: Subject;
  setSubject: (s: Subject) => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (g: GradeLevel) => void;
  puzzleComplexity: PuzzleComplexity;
  setPuzzleComplexity: (p: PuzzleComplexity) => void;
  contentRating: ContentRating;
  setContentRating: (r: ContentRating) => void;
  isGenerating: boolean;
  isGeneratingImages: boolean;
  isSaving: boolean;
  hasCase: boolean;
  savedCaseId: string | null;
  imageGenProgress: ImageGenProgress | null;
  imageGenError: string | null;
  error: string | null;
  onGenerate: () => void;
  onSave: () => void;
  onGenerateImages: () => void;
}

const CONTENT_RATINGS: { value: ContentRating; label: string; description: string }[] = [
  { value: 'GENERAL', label: 'General', description: 'Suitable for all ages (P4-P6 students)' },
  { value: 'PG13', label: 'PG13', description: 'Parental guidance for below 13' },
  { value: 'ADV16', label: 'ADV16', description: 'Advisory for 16+ (IMDA rating)' },
  { value: 'M18', label: 'M18', description: 'Mature 18+ (restricted)' },
];

export function GeneratorForm({
  difficulty, setDifficulty,
  subject, setSubject,
  gradeLevel, setGradeLevel,
  puzzleComplexity, setPuzzleComplexity,
  contentRating, setContentRating,
  isGenerating, isGeneratingImages, isSaving,
  hasCase, savedCaseId,
  imageGenProgress, imageGenError, error,
  onGenerate, onSave, onGenerateImages,
}: GeneratorFormProps) {
  const currentRatingInfo = CONTENT_RATINGS.find(r => r.value === contentRating) || CONTENT_RATINGS[0];
  return (
    <div className="bg-black/60 border-2 border-amber-600/50 rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-amber-400 font-mono">Generation Parameters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Difficulty */}
        <div>
          <label className="block text-slate-300 font-mono text-sm mb-2">DIFFICULTY</label>
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
          <label className="block text-slate-300 font-mono text-sm mb-2">SUBJECT</label>
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
          <label className="block text-slate-300 font-mono text-sm mb-2">GRADE LEVEL</label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
            className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="P1">Primary 1</option>
            <option value="P2">Primary 2</option>
            <option value="P3">Primary 3</option>
            <option value="P4">Primary 4</option>
            <option value="P5">Primary 5</option>
            <option value="P6">Primary 6</option>
          </select>
        </div>

        {/* Puzzle Complexity */}
        <div>
          <label className="block text-slate-300 font-mono text-sm mb-2">PUZZLE COMPLEXITY</label>
          <select
            value={puzzleComplexity}
            onChange={(e) => setPuzzleComplexity(e.target.value as PuzzleComplexity)}
            className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="BASIC">Basic (P1-P2 level)</option>
            <option value="STANDARD">Standard (P3-P4 level)</option>
            <option value="CHALLENGING">Challenging (P5-P6 level)</option>
            <option value="EXPERT">Advanced (Gifted/Olympiad)</option>
          </select>
          <p className="text-slate-500 text-xs mt-1">
            {puzzleComplexity === 'BASIC' && 'Simple single-step problems for younger students'}
            {puzzleComplexity === 'STANDARD' && 'Multi-step problems requiring reasoning'}
            {puzzleComplexity === 'CHALLENGING' && 'Complex puzzles with data tables and cross-referencing'}
            {puzzleComplexity === 'EXPERT' && 'Advanced puzzles for gifted students - Math Olympiad style'}
          </p>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-slate-300 font-mono text-sm mb-2">TIME (auto-calculated)</label>
          <div className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-slate-400">
            {puzzleComplexity === 'BASIC' && '~12-15 min'}
            {puzzleComplexity === 'STANDARD' && '~20-25 min'}
            {puzzleComplexity === 'CHALLENGING' && '~45-60 min'}
            {puzzleComplexity === 'EXPERT' && '~60-90 min'}
          </div>
        </div>
      </div>

      {/* Content Rating Slider */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-slate-300 font-mono text-sm">CONTENT RATING (IMDA)</label>
          <span className={`px-3 py-1 rounded font-mono font-bold text-sm ${
            contentRating === 'GENERAL' ? 'bg-green-600 text-white' :
            contentRating === 'PG13' ? 'bg-yellow-600 text-black' :
            contentRating === 'ADV16' ? 'bg-orange-600 text-white' :
            'bg-red-600 text-white'
          }`}>
            {currentRatingInfo.label}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          value={CONTENT_RATINGS.findIndex(r => r.value === contentRating)}
          onChange={(e) => setContentRating(CONTENT_RATINGS[parseInt(e.target.value)].value)}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
          {CONTENT_RATINGS.map(r => (
            <span key={r.value} className={contentRating === r.value ? 'text-amber-400' : ''}>
              {r.label}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-xs mt-2">{currentRatingInfo.description}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || isGeneratingImages}
          className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
            isGenerating || isGeneratingImages
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-black'
          }`}
        >
          {isGenerating ? 'GENERATING...' : isGeneratingImages ? 'WAIT...' : 'GENERATE CASE'}
        </button>

        {hasCase && !savedCaseId && (
          <button
            onClick={onSave}
            disabled={isSaving || isGeneratingImages}
            className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
              isSaving || isGeneratingImages
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isSaving ? 'SAVING...' : isGeneratingImages ? 'WAIT...' : 'SAVE'}
          </button>
        )}

        {savedCaseId && (
          <a
            href={`/admin/cases/${savedCaseId}/edit`}
            className="px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded bg-blue-600 hover:bg-blue-500 text-white transition-all text-sm md:text-base"
          >
            VIEW SAVED
          </a>
        )}

        {hasCase && (
          <button
            onClick={onGenerateImages}
            disabled={isGeneratingImages || isGenerating}
            className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
              isGeneratingImages || isGenerating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isGeneratingImages ? 'IMAGES...' : 'GEN IMAGES'}
          </button>
        )}
      </div>

      {/* Progress */}
      {imageGenProgress && (
        <div className="bg-purple-900/30 border border-purple-600 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 font-mono">Generating: {imageGenProgress.current}</span>
            <span className="text-purple-400 font-mono">{imageGenProgress.completed}/{imageGenProgress.total}</span>
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
  );
}
