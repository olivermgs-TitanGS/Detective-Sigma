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
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    locationType?: string;
  }>;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
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
  scenes: Record<string, string>;
  clues: Record<string, string>;
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
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ suspects: {}, scenes: {}, clues: {} });
  const [imageGenProgress, setImageGenProgress] = useState<ImageGenProgress | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCase(null);
    setSavedCaseId(null);
    // Reset images when generating new case
    setGeneratedImages({ suspects: {}, scenes: {}, clues: {} });
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
      // Auto-start image generation
      if (data.case) {
        generateImagesForCase(data.case);
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

  // Parse suspect description for age and gender
  const parsePersonInfo = (name: string, role: string): { gender: string; age: string; ageDescriptor: string } => {
    const text = `${name} ${role}`.toLowerCase();

    // Detect gender from name or role
    const femaleNames = /^(siti|nur|fatimah|aminah|mary|sarah|elizabeth|priya|lakshmi|devi|mei|ling|hui|xin|yan)/i;
    const femaleRoles = /\b(mother|wife|sister|daughter|aunt|grandmother|mrs|ms|miss|woman|lady|girl|waitress|actress|hostess|saleswoman|businesswoman|female)\b/i;
    const maleRoles = /\b(father|husband|brother|son|uncle|grandfather|mr|man|boy|waiter|actor|host|salesman|businessman|male)\b/i;

    let gender = 'person';
    if (femaleNames.test(name) || femaleRoles.test(role)) {
      gender = 'woman';
    } else if (maleRoles.test(role)) {
      gender = 'man';
    }

    // Detect age from role
    const childRoles = /\b(child|kid|boy|girl|student|pupil|teen|teenager|youth|young)\b/i;
    const elderRoles = /\b(elderly|old|senior|grandfather|grandmother|grandpa|grandma|retired)\b/i;

    let age = 'adult';
    let ageDescriptor = '30-40 years old';
    if (childRoles.test(role)) {
      age = 'young';
      ageDescriptor = '10-16 years old';
      gender = gender === 'woman' ? 'girl' : gender === 'man' ? 'boy' : 'young person';
    } else if (elderRoles.test(role)) {
      age = 'elderly';
      ageDescriptor = '60-70 years old';
      gender = gender === 'woman' ? 'elderly woman' : gender === 'man' ? 'elderly man' : 'elderly person';
    }

    return { gender, age, ageDescriptor };
  };

  // Infer ethnicity from name for Singapore context - detailed for realistic portraits
  const inferEthnicity = (name: string): { ethnicity: string; skinTone: string; features: string } => {
    // Chinese names
    if (/^(Tan|Lim|Lee|Ng|Wong|Chan|Goh|Ong|Koh|Chua|Chen|Teo|Yeo|Sim|Foo|Ho|Ang|Seah|Tay|Chew|Low|Yap|Mei|Ling|Hui|Xin|Yan)/i.test(name)) {
      return {
        ethnicity: 'Chinese Singaporean',
        skinTone: 'natural light tan East Asian skin, realistic human skin color',
        features: 'East Asian facial features, natural brown or dark brown eyes, straight black hair'
      };
    }
    // Malay names
    if (/^(Ahmad|Muhammad|Siti|Nur|Abdul|Ibrahim|Mohamed|Ismail|Hassan|Ali|Fatimah|Aminah|Razak|Rahman|Yusof|Hamid|Zainal)/i.test(name)) {
      return {
        ethnicity: 'Malay Singaporean',
        skinTone: 'natural warm brown Southeast Asian skin, realistic human skin color',
        features: 'Southeast Asian Malay facial features, natural dark brown eyes, black hair'
      };
    }
    // Indian names
    if (/^(Raj|Kumar|Sharma|Singh|Devi|Muthu|Suresh|Ramesh|Lakshmi|Priya|Venkat|Krishnan|Nair|Pillai|Menon|Gopal)/i.test(name)) {
      return {
        ethnicity: 'Indian Singaporean',
        skinTone: 'natural brown South Asian skin, realistic human skin color',
        features: 'South Asian Indian facial features, natural dark brown eyes, black hair'
      };
    }
    // Eurasian or Western names
    if (/^(James|John|Mary|Michael|David|Sarah|Peter|Paul|George|Elizabeth|William|Richard)/i.test(name)) {
      return {
        ethnicity: 'Eurasian Singaporean',
        skinTone: 'natural olive mixed heritage skin, realistic human skin color',
        features: 'mixed Eurasian facial features, natural eye color'
      };
    }
    // Default to generic Singaporean
    return {
      ethnicity: 'Singaporean',
      skinTone: 'natural Asian skin, realistic human skin color',
      features: 'Asian facial features, natural dark eyes'
    };
  };

  // Generate images for a case (called automatically after case generation)
  const generateImagesForCase = async (caseData: GeneratedCase) => {
    setIsGeneratingImages(true);
    setImageGenError(null);

    const newImages: GeneratedImages = { suspects: {}, scenes: {}, clues: {} };

    // Count total images: cover + suspects + scenes + clues (excluding testimony type)
    const cluesWithImages = (caseData.clues || []).filter(c => c.type !== 'testimony');
    const totalImages = 1 + (caseData.suspects?.length || 0) + (caseData.scenes?.length || 0) + cluesWithImages.length;

    try {
      let completed = 0;

      // 1. Generate cover image
      setImageGenProgress({ current: 'Case Cover', completed, total: totalImages });
      const storyKeywords = caseData.story.setting.split(' ').slice(0, 10).join(' ');
      const coverResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageRequest: {
            id: `cover-${caseData.caseId}`,
            type: 'cover',
            prompt: `score_9, score_8_up, score_7_up, manila case folder file, detective case file, classified document, ${storyKeywords}, ${subject === 'MATH' ? 'mathematical equations' : subject === 'SCIENCE' ? 'scientific equipment' : 'math and science elements'}, mysterious noir atmosphere, dramatic lighting, vintage paper texture, masterpiece, best quality, 8k`,
            negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human',
            width: 512, height: 512,
            settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
            metadata: { caseId: caseData.caseId },
          },
          saveToPublic: false,
        }),
      });
      if (coverResponse.ok) {
        const data = await coverResponse.json();
        if (data.success && data.imageUrl) newImages.cover = data.imageUrl;
      }
      completed++;
      setGeneratedImages({ ...newImages });

      // 2. Generate crime scene images
      for (const scene of (caseData.scenes || [])) {
        setImageGenProgress({ current: `Scene: ${scene.name}`, completed, total: totalImages });
        const sceneResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `scene-${scene.id}`,
              type: 'scene',
              prompt: `score_9, score_8_up, score_7_up, ${scene.description}, ${scene.locationType || 'indoor location'}, Singapore setting, crime scene investigation area, evidence markers visible, forensic lighting, photorealistic, detailed environment, masterpiece, best quality, 8k, architectural photography`,
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human figure',
              width: 768, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { sceneId: scene.id, name: scene.name },
            },
            saveToPublic: false,
          }),
        });
        if (sceneResponse.ok) {
          const data = await sceneResponse.json();
          if (data.success && data.imageUrl) newImages.scenes[scene.id] = data.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 3. Generate suspect portraits
      for (const suspect of (caseData.suspects || [])) {
        setImageGenProgress({ current: `Suspect: ${suspect.name}`, completed, total: totalImages });
        const ethnicityInfo = inferEthnicity(suspect.name);
        const personInfo = parsePersonInfo(suspect.name, suspect.role);
        const expression = suspect.isGuilty ? 'slightly nervous expression' : 'calm confident expression';

        // Build an ULTRA-realistic portrait prompt with exact age/gender
        const portraitPrompt = [
          // Quality tags for Pony Diffusion
          'score_9, score_8_up, score_7_up',
          // CRITICAL: Force realism
          'photorealistic', 'realistic', 'real life photo', 'photograph',
          // Person details - exact match to description
          `1${personInfo.gender}`, 'solo',
          personInfo.ageDescriptor,
          ethnicityInfo.ethnicity,
          ethnicityInfo.skinTone,
          ethnicityInfo.features,
          // Role context
          suspect.role,
          expression,
          // Photography style
          'professional ID photo', 'passport photo style',
          'front facing', 'looking at camera',
          'neutral expression', 'natural pose',
          'soft natural lighting', 'plain white background',
          // Skin realism
          'natural human skin', 'realistic skin texture', 'natural skin pores',
          'normal human eyes', 'natural eye color brown or black',
          // Technical
          'high resolution', 'sharp focus', 'detailed',
          '35mm photograph', 'natural colors'
        ].join(', ');

        // ULTRA-strong negative prompt - block ALL fantasy/anime/unnatural elements
        const negativePrompt = [
          // Quality
          'score_6, score_5, score_4, score_3',
          'worst quality, low quality, blurry, jpeg artifacts',
          // BLOCK ALL FANTASY/ANIME
          'anime, cartoon, comic, manga, illustration, drawing, painting, sketch, rendered, 3d',
          'cgi, digital art, concept art, fan art, deviantart',
          // BLOCK UNNATURAL FEATURES - CRITICAL
          'glowing eyes, glowing, luminous eyes, bright eyes, shiny eyes',
          'unnatural eyes, fantasy eyes, magical eyes, anime eyes, big eyes',
          'colored eyes, red eyes, yellow eyes, purple eyes, blue eyes, green eyes, orange eyes, pink eyes, white eyes, black sclera',
          'cat eyes, slit pupils, unusual pupils',
          // BLOCK UNNATURAL SKIN - CRITICAL
          'blue skin, green skin, purple skin, red skin, grey skin, gray skin, white skin, pale skin',
          'unnatural skin color, fantasy skin, alien skin, zombie skin, undead',
          'glowing skin, shiny skin, plastic skin, waxy skin, doll skin',
          // BLOCK NON-HUMAN
          'alien, monster, creature, demon, elf, orc, vampire, zombie, ghost',
          'robot, android, cyborg, mechanical',
          'furry, animal, animal ears, cat ears, fox ears, horns, wings, tail, scales, fur',
          // BLOCK DEFORMITIES
          'deformed, disfigured, mutated, ugly, distorted',
          'bad anatomy, bad proportions, extra limbs, missing limbs, extra fingers, fewer fingers',
          'bad hands, bad face, asymmetrical face, crooked face',
          // BLOCK STYLE ISSUES
          'oversaturated, overexposed, underexposed, high contrast',
          'watermark, text, logo, signature, border, frame',
          'multiple people, crowd, group',
          'nsfw, nude, inappropriate'
        ].join(', ');

        const suspectResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `suspect-${suspect.id}`,
              type: 'suspect',
              prompt: portraitPrompt,
              negativePrompt: negativePrompt,
              width: 512, height: 512,
              // Use lower CFG for more natural results
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 30, cfgScale: 6 },
              metadata: { suspectId: suspect.id, name: suspect.name, gender: personInfo.gender, age: personInfo.age },
            },
            saveToPublic: false,
          }),
        });
        if (suspectResponse.ok) {
          const data = await suspectResponse.json();
          if (data.success && data.imageUrl) newImages.suspects[suspect.id] = data.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 4. Generate evidence/clue images (skip testimony type)
      for (const clue of cluesWithImages) {
        setImageGenProgress({ current: `Evidence: ${clue.title}`, completed, total: totalImages });
        const clueResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `clue-${clue.id}`,
              type: 'evidence',
              prompt: `score_9, score_8_up, score_7_up, ${clue.description}, ${clue.type} evidence, forensic evidence photography, evidence marker visible, close-up documentation shot, ${clue.relevance === 'critical' ? 'key evidence highlighted' : ''}, photorealistic, detailed textures, masterpiece, best quality, 8k, macro photography`,
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human hands',
              width: 512, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { clueId: clue.id, title: clue.title },
            },
            saveToPublic: false,
          }),
        });
        if (clueResponse.ok) {
          const data = await clueResponse.json();
          if (data.success && data.imageUrl) newImages.clues[clue.id] = data.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      setImageGenProgress(null);
    } catch (err) {
      setImageGenError(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setIsGeneratingImages(false);
      setImageGenProgress(null);
    }
  };

  // Re-generate images button handler
  const handleGenerateImages = () => {
    if (generatedCase) {
      generateImagesForCase(generatedCase);
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

          {/* Scenes / Locations */}
          {generatedCase.scenes && generatedCase.scenes.length > 0 && (
            <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 font-mono mb-4">CRIME SCENES ({generatedCase.scenes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedCase.scenes.map((scene) => (
                  <div key={scene.id} className="p-4 bg-slate-800 rounded border border-slate-600">
                    <div className="flex gap-4">
                      {generatedImages.scenes[scene.id] ? (
                        <img
                          src={generatedImages.scenes[scene.id]}
                          alt={scene.name}
                          className="w-32 h-24 object-cover rounded border border-slate-500 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-32 h-24 bg-slate-700 rounded border border-slate-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-500 text-xs text-center">No image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-white">{scene.name}</div>
                        {scene.locationType && (
                          <div className="text-green-400 text-sm font-mono">{scene.locationType}</div>
                        )}
                        <div className="text-slate-400 text-sm mt-1">{scene.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clues / Evidence */}
          {generatedCase.clues && generatedCase.clues.length > 0 && (
            <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-4">EVIDENCE ({generatedCase.clues.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedCase.clues.map((clue) => (
                  <div
                    key={clue.id}
                    className={`p-4 rounded border-2 ${
                      clue.relevance === 'critical'
                        ? 'bg-amber-900/30 border-amber-600'
                        : clue.relevance === 'red-herring'
                        ? 'bg-red-900/20 border-red-600/50'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <div className="flex gap-3">
                      {clue.type !== 'testimony' && generatedImages.clues[clue.id] ? (
                        <img
                          src={generatedImages.clues[clue.id]}
                          alt={clue.title}
                          className="w-16 h-16 object-cover rounded border border-slate-500 flex-shrink-0"
                        />
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
          )}

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
