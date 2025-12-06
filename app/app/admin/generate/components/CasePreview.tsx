/**
 * Case preview component showing generated case details
 */

import type { GeneratedCase, GeneratedImages, PuzzleComplexity } from '../utils/types';

interface CasePreviewProps {
  generatedCase: GeneratedCase;
  generatedImages: GeneratedImages;
  puzzleComplexity: PuzzleComplexity;
}

export function CasePreview({ generatedCase, generatedImages, puzzleComplexity }: CasePreviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-400 font-mono tracking-wider">
        GENERATED CASE PREVIEW
      </h2>

      {/* Case Overview */}
      <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            {generatedImages.cover ? (
              <img
                src={generatedImages.cover}
                alt="Case Cover"
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border-2 border-amber-600"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                <span className="text-slate-500 text-xs font-mono text-center px-2">
                  Click<br/>GENERATE<br/>IMAGES
                </span>
              </div>
            )}
          </div>

          {/* Case Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 break-words">{generatedCase.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-4">
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
            <div className="text-slate-300 whitespace-pre-line break-words text-sm md:text-base">{generatedCase.briefing}</div>
          </div>
        </div>
      </div>

      {/* Suspects */}
      <SuspectsSection suspects={generatedCase.suspects} images={generatedImages.suspects} />

      {/* Scenes */}
      {generatedCase.scenes && generatedCase.scenes.length > 0 && (
        <ScenesSection scenes={generatedCase.scenes} images={generatedImages.scenes} />
      )}

      {/* Clues */}
      {generatedCase.clues && generatedCase.clues.length > 0 && (
        <CluesSection clues={generatedCase.clues} images={generatedImages.clues} />
      )}

      {/* Puzzles */}
      <PuzzlesSection puzzles={generatedCase.puzzles} />

      {/* Story */}
      <StorySection story={generatedCase.story} />
    </div>
  );
}

function SuspectsSection({ suspects, images }: { suspects: GeneratedCase['suspects']; images: Record<string, string> }) {
  // Helper to format age display
  const getAgeDisplay = (suspect: GeneratedCase['suspects'][0]) => {
    if (suspect.displayAge) return suspect.displayAge;
    if (suspect.specificAge) return `${suspect.specificAge} years old`;
    if (suspect.ageCategory) {
      const categoryLabels: Record<string, string> = {
        child: 'Child (7-12)',
        teen: 'Teen (13-17)',
        young_adult: 'Young Adult (18-25)',
        adult: 'Adult (26-45)',
        middle_aged: 'Middle-Aged (46-65)',
        senior: 'Senior (65+)',
      };
      return categoryLabels[suspect.ageCategory] || suspect.ageCategory;
    }
    return null;
  };

  return (
    <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
      <h3 className="text-xl font-bold text-red-400 font-mono mb-4">SUSPECTS ({suspects.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suspects.map((suspect) => {
          const ageDisplay = getAgeDisplay(suspect);
          return (
            <div
              key={suspect.id}
              className={`p-4 rounded border-2 ${
                suspect.isGuilty ? 'bg-red-900/30 border-red-600' : 'bg-slate-800 border-slate-600'
              }`}
            >
              <div className="flex gap-3 mb-2">
                {images[suspect.id] ? (
                  <img src={images[suspect.id]} alt={suspect.name} className="w-16 h-16 object-cover rounded-lg border border-slate-500" />
                ) : (
                  <div className="w-16 h-16 bg-slate-700 rounded-lg border border-slate-500 flex items-center justify-center">
                    <span className="text-slate-500 text-2xl">?</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{suspect.name}</div>
                  <div className="text-amber-400 text-sm truncate">{suspect.role}</div>
                  {/* Age & Demographics Row */}
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {ageDisplay && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-blue-800/70 text-blue-200">
                        {suspect.specificAge ? `${suspect.specificAge}y` : ageDisplay}
                      </span>
                    )}
                    {suspect.gender && (
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        suspect.gender === 'female' ? 'bg-pink-800/70 text-pink-200' : 'bg-cyan-800/70 text-cyan-200'
                      }`}>
                        {suspect.gender === 'female' ? '♀' : '♂'}
                      </span>
                    )}
                    {suspect.ethnicity && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        {suspect.ethnicity}
                      </span>
                    )}
                  </div>
                  {suspect.isGuilty && <div className="text-red-400 font-mono text-xs mt-1">⚠ GUILTY</div>}
                </div>
              </div>
              {/* Full age description if available */}
              {suspect.displayAge && suspect.displayAge !== `${suspect.specificAge} years old` && (
                <div className="text-blue-300/80 text-xs mb-2 font-mono">
                  📅 {suspect.displayAge}
                </div>
              )}
              <div className="text-slate-400 text-sm line-clamp-2">{suspect.alibi}</div>
              {/* Personality traits */}
              {suspect.personality && suspect.personality.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {suspect.personality.slice(0, 3).map((trait, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScenesSection({ scenes, images }: { scenes: GeneratedCase['scenes']; images: Record<string, string> }) {
  return (
    <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
      <h3 className="text-xl font-bold text-green-400 font-mono mb-4">CRIME SCENES ({scenes.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene) => (
          <div key={scene.id} className="p-4 bg-slate-800 rounded border border-slate-600">
            <div className="flex gap-4">
              {images[scene.id] ? (
                <img src={images[scene.id]} alt={scene.name} className="w-32 h-24 object-cover rounded border border-slate-500 flex-shrink-0" />
              ) : (
                <div className="w-32 h-24 bg-slate-700 rounded border border-slate-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-500 text-xs text-center">No image</span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-bold text-white">{scene.name}</div>
                {scene.locationType && <div className="text-green-400 text-sm font-mono">{scene.locationType}</div>}
                <div className="text-slate-400 text-sm mt-1">{scene.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CluesSection({ clues, images }: { clues: GeneratedCase['clues']; images: Record<string, string> }) {
  return (
    <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
      <h3 className="text-xl font-bold text-cyan-400 font-mono mb-4">EVIDENCE ({clues.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clues.map((clue) => (
          <div
            key={clue.id}
            className={`p-4 rounded border-2 ${
              clue.relevance === 'critical' ? 'bg-amber-900/30 border-amber-600' :
              clue.relevance === 'red-herring' ? 'bg-red-900/20 border-red-600/50' :
              'bg-slate-800 border-slate-600'
            }`}
          >
            <div className="flex gap-3">
              {clue.type !== 'testimony' && images[clue.id] ? (
                <img src={images[clue.id]} alt={clue.title} className="w-16 h-16 object-cover rounded border border-slate-500 flex-shrink-0" />
              ) : clue.type !== 'testimony' ? (
                <div className="w-16 h-16 bg-slate-700 rounded border border-slate-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-500 text-xs">?</span>
                </div>
              ) : null}
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{clue.title}</div>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs font-mono px-1 rounded ${
                    clue.type === 'physical' ? 'bg-blue-800 text-blue-200' :
                    clue.type === 'document' ? 'bg-yellow-800 text-yellow-200' :
                    clue.type === 'testimony' ? 'bg-purple-800 text-purple-200' :
                    'bg-green-800 text-green-200'
                  }`}>
                    {clue.type}
                  </span>
                  <span className={`text-xs font-mono px-1 rounded ${
                    clue.relevance === 'critical' ? 'bg-amber-700 text-amber-100' :
                    clue.relevance === 'red-herring' ? 'bg-red-700 text-red-100' :
                    'bg-slate-600 text-slate-200'
                  }`}>
                    {clue.relevance}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mt-1 line-clamp-2">{clue.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PuzzlesSection({ puzzles }: { puzzles: GeneratedCase['puzzles'] }) {
  const phaseColors = {
    initial: 'bg-blue-600',
    investigation: 'bg-amber-600',
    conclusion: 'bg-red-600',
  };

  const typeColors = {
    math: 'bg-purple-700',
    logic: 'bg-green-700',
    observation: 'bg-cyan-700',
    deduction: 'bg-orange-700',
  };

  return (
    <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
      <h3 className="text-xl font-bold text-blue-400 font-mono mb-4">PUZZLES ({puzzles.length})</h3>
      <div className="space-y-4">
        {puzzles.map((puzzle, index) => (
          <div key={puzzle.id} className="p-4 bg-slate-800 rounded border border-slate-600">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{index + 1}. {puzzle.title}</span>
                  {puzzle.investigationPhase && (
                    <span className={`${phaseColors[puzzle.investigationPhase]} text-white text-xs px-2 py-0.5 font-mono rounded`}>
                      {puzzle.investigationPhase.toUpperCase()}
                    </span>
                  )}
                  {puzzle.type && (
                    <span className={`${typeColors[puzzle.type]} text-white text-xs px-2 py-0.5 font-mono rounded`}>
                      {puzzle.type}
                    </span>
                  )}
                </div>
                {puzzle.narrativeContext && (
                  <div className="text-amber-400/80 text-sm italic mb-2 border-l-2 border-amber-500 pl-2">
                    {puzzle.narrativeContext}
                  </div>
                )}
                <div className="text-slate-300">{puzzle.question}</div>
                <div className="text-green-400 text-sm mt-2">Answer: {puzzle.answer}</div>
                {puzzle.hint && (
                  <div className="text-slate-500 text-sm mt-1">Hint: {puzzle.hint}</div>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-amber-400 font-mono font-bold">{puzzle.points} pts</div>
                {puzzle.complexity && (
                  <div className="text-slate-500 text-xs font-mono">{puzzle.complexity}</div>
                )}
              </div>
            </div>
            {puzzle.revelation && (
              <div className={`mt-3 p-3 rounded border ${
                puzzle.revelation.importance === 'major' ? 'bg-yellow-900/30 border-yellow-600' :
                puzzle.revelation.importance === 'moderate' ? 'bg-blue-900/30 border-blue-600' :
                'bg-green-900/20 border-green-600/50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">REVEALS:</span>
                  <span className={`text-xs font-mono px-1 rounded ${
                    puzzle.revelation.importance === 'major' ? 'bg-yellow-700 text-yellow-100' :
                    puzzle.revelation.importance === 'moderate' ? 'bg-blue-700 text-blue-100' :
                    'bg-green-700 text-green-100'
                  }`}>
                    {puzzle.revelation.type.replace('_', ' ')}
                  </span>
                  {puzzle.revelation.importance === 'major' && (
                    <span className="text-yellow-400 text-xs font-bold">CRITICAL</span>
                  )}
                </div>
                <div className="text-sm text-slate-300">{puzzle.revelation.description}</div>
                <div className="text-xs text-slate-400 mt-1 italic">&quot;{puzzle.revelation.storyText}&quot;</div>
              </div>
            )}
            {puzzle.relatedCharacterName && (
              <div className="mt-2 text-xs text-amber-500">
                Related to: {puzzle.relatedCharacterName}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StorySection({ story }: { story: GeneratedCase['story'] }) {
  return (
    <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
      <h3 className="text-xl font-bold text-purple-400 font-mono mb-4">STORY DETAILS</h3>
      <div className="space-y-4 text-slate-300">
        <div>
          <span className="text-purple-400 font-mono">SETTING:</span>
          <p className="mt-1">{story.setting}</p>
        </div>
        <div>
          <span className="text-purple-400 font-mono">CRIME:</span>
          <p className="mt-1">{story.crime}</p>
        </div>
        <div>
          <span className="text-purple-400 font-mono">RESOLUTION:</span>
          <p className="mt-1">{story.resolution}</p>
        </div>
      </div>
    </div>
  );
}
