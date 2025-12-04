import { nanoid } from 'nanoid';
import {
  GenerationRequest,
  GeneratedCase,
  Suspect,
  Clue,
  Puzzle,
  Scene,
} from './types';
import {
  storyTemplates,
  suspectTemplates,
  nameTemplates,
  clueTemplates,
  puzzleTemplates,
} from './templates';

function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate Story
function generateStory(request: GenerationRequest) {
  const { difficulty, subject } = request;

  // Filter templates by subject and difficulty
  const suitableTemplates = storyTemplates.filter(
    (t) =>
      t.subjects.includes(subject) &&
      t.difficulties.includes(difficulty)
  );

  if (suitableTemplates.length === 0) {
    throw new Error(`No suitable templates found for ${subject} ${difficulty}`);
  }

  const template = selectRandom(suitableTemplates);
  const location = selectRandom(template.locations);
  const crime = selectRandom(template.crimes);
  const theme = selectRandom(template.themes);

  const title = `The ${theme} ${crime.type}`;

  const briefing = `
You are called to investigate a mysterious incident at ${location.name}.
${crime.description}

Your task is to analyze the evidence, interview suspects, and use your ${subject.toLowerCase()} skills to solve this case.

Grade Level: ${request.gradeLevel}
Difficulty: ${difficulty}
Estimated Time: ${request.constraints?.estimatedMinutes || 45} minutes
  `.trim();

  return {
    title,
    briefing,
    setting: location.description,
    crime: crime.description,
    resolution: crime.solution,
    theme,
    location: location.name,
    locationType: location.type,
  };
}

// Generate Suspects
function generateSuspects(request: GenerationRequest, suspectCount: number = 3): Suspect[] {
  const suspects: Suspect[] = [];
  const usedNames: string[] = [];

  // Get all names and shuffle
  const allNames = [
    ...nameTemplates.chinese,
    ...nameTemplates.malay,
    ...nameTemplates.indian,
    ...nameTemplates.english,
  ];
  const shuffledNames = shuffleArray(allNames);

  // Randomly select which suspect is guilty
  const guiltyIndex = Math.floor(Math.random() * suspectCount);

  for (let i = 0; i < suspectCount; i++) {
    const name = shuffledNames[i] || `Suspect ${i + 1}`;
    usedNames.push(name);

    const isGuilty = i === guiltyIndex;
    const role = selectRandom(suspectTemplates.roles);
    const personality = selectRandom(suspectTemplates.personalities);
    const alibi = isGuilty
      ? 'Claims to have been working alone in a back room'
      : selectRandom(suspectTemplates.alibis);

    suspects.push({
      id: `suspect-${nanoid(6)}`,
      name,
      role,
      alibi,
      personality,
      isGuilty,
      motive: isGuilty ? 'Had access and opportunity' : undefined,
    });
  }

  return suspects;
}

// Generate Clues
function generateClues(suspects: Suspect[], clueCount: number = 5): Clue[] {
  const clues: Clue[] = [];
  const guiltySuspect = suspects.find((s) => s.isGuilty);

  // Critical clue pointing to guilty suspect
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: 'Key Evidence',
    description: `Evidence that places ${guiltySuspect?.name} at the scene during the incident.`,
    type: 'physical',
    relevance: 'critical',
    linkedTo: [guiltySuspect?.id || ''],
  });

  // Supporting clues
  const physicalClues = clueTemplates.physical;
  const documentClues = clueTemplates.document;
  const testimonyClues = clueTemplates.testimony;

  // Add physical clue
  const physClue = selectRandom(physicalClues);
  clues.push({
    id: `clue-${nanoid(6)}`,
    ...physClue,
    type: 'physical',
    relevance: 'supporting',
    linkedTo: [],
  });

  // Add document clue
  const docClue = selectRandom(documentClues);
  clues.push({
    id: `clue-${nanoid(6)}`,
    ...docClue,
    type: 'document',
    relevance: 'supporting',
    linkedTo: [],
  });

  // Add testimony clue
  const testClue = selectRandom(testimonyClues);
  clues.push({
    id: `clue-${nanoid(6)}`,
    ...testClue,
    type: 'testimony',
    relevance: 'supporting',
    linkedTo: [],
  });

  // Add red herring
  const innocentSuspect = suspects.find((s) => !s.isGuilty);
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: 'Suspicious Note',
    description: `A note that seems to implicate ${innocentSuspect?.name}, but further investigation reveals it's unrelated.`,
    type: 'document',
    relevance: 'red-herring',
    linkedTo: [innocentSuspect?.id || ''],
  });

  return clues.slice(0, clueCount);
}

// Generate Puzzles
function generatePuzzles(request: GenerationRequest, puzzleCount: number = 4): Puzzle[] {
  const { subject, difficulty } = request;

  const difficultyMultiplier: Record<string, number> = {
    ROOKIE: 1,
    INSPECTOR: 1.5,
    DETECTIVE: 2,
    CHIEF: 2.5,
  };

  const templates = puzzleTemplates[subject as keyof typeof puzzleTemplates] || puzzleTemplates.INTEGRATED;
  const puzzles: Puzzle[] = [];

  for (let i = 0; i < puzzleCount; i++) {
    const template = templates[i % templates.length];
    const points = Math.round(20 * (difficultyMultiplier[difficulty] || 1));

    puzzles.push({
      id: `puzzle-${nanoid(6)}`,
      title: template.title,
      type: template.type,
      question: template.question,
      answer: template.answer,
      hint: template.hint,
      points,
      difficulty: difficultyMultiplier[difficulty] || 1,
    });
  }

  return puzzles;
}

// Generate Scenes
function generateScenes(story: ReturnType<typeof generateStory>, clues: Clue[]): Scene[] {
  const scenes: Scene[] = [];

  // Main scene
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: story.location,
    description: story.setting,
    interactiveElements: ['Evidence Board', 'Witness Area', 'Investigation Zone'],
    cluesAvailable: clues.slice(0, 3).map((c) => c.id),
  });

  // Secondary scene
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: 'Investigation Room',
    description: 'A quiet room where you can review evidence and interview suspects.',
    interactiveElements: ['Evidence Table', 'Suspect Profiles', 'Timeline Board'],
    cluesAvailable: clues.slice(3).map((c) => c.id),
  });

  return scenes;
}

// Main Generator Function
export async function generateCase(request: GenerationRequest): Promise<GeneratedCase> {
  const caseId = `case-${nanoid(10)}`;

  // Determine counts based on difficulty
  const suspectCount = { ROOKIE: 3, INSPECTOR: 3, DETECTIVE: 4, CHIEF: 4 }[request.difficulty] || 3;
  const puzzleCount = { ROOKIE: 3, INSPECTOR: 4, DETECTIVE: 5, CHIEF: 6 }[request.difficulty] || 4;
  const clueCount = { ROOKIE: 4, INSPECTOR: 5, DETECTIVE: 6, CHIEF: 7 }[request.difficulty] || 5;

  // Generate all components
  const story = generateStory(request);
  const suspects = generateSuspects(request, suspectCount);
  const clues = generateClues(suspects, clueCount);
  const puzzles = generatePuzzles(request, puzzleCount);
  const scenes = generateScenes(story, clues);

  return {
    caseId,
    title: story.title,
    briefing: story.briefing,
    metadata: {
      difficulty: request.difficulty,
      gradeLevel: request.gradeLevel,
      subjectFocus: request.subject,
      estimatedMinutes: request.constraints?.estimatedMinutes || 45,
    },
    story: {
      setting: story.setting,
      crime: story.crime,
      resolution: story.resolution,
    },
    suspects,
    clues,
    puzzles,
    scenes,
  };
}

// Save generated case to database
export async function saveGeneratedCase(
  generatedCase: GeneratedCase,
  prisma: any
): Promise<string> {
  // Map difficulty to Prisma enum
  const difficultyMap: Record<string, string> = {
    ROOKIE: 'ROOKIE',
    INSPECTOR: 'INSPECTOR',
    DETECTIVE: 'DETECTIVE',
    CHIEF: 'CHIEF',
  };

  // Map subject to Prisma enum
  const subjectMap: Record<string, string> = {
    MATH: 'MATH',
    SCIENCE: 'SCIENCE',
    INTEGRATED: 'INTEGRATED',
  };

  // Create the case in database
  const newCase = await prisma.case.create({
    data: {
      title: generatedCase.title,
      description: generatedCase.briefing,
      subject: generatedCase.metadata.subjectFocus === 'MATH' ? 'Mathematics' :
               generatedCase.metadata.subjectFocus === 'SCIENCE' ? 'Science' : 'Integrated',
      subjectFocus: subjectMap[generatedCase.metadata.subjectFocus] || 'INTEGRATED',
      difficulty: difficultyMap[generatedCase.metadata.difficulty] || 'INSPECTOR',
      estimatedMinutes: generatedCase.metadata.estimatedMinutes,
      masterClueFragment: generatedCase.story.resolution,
      status: 'DRAFT',
      learningObjectives: {
        primary: `Solve the mystery using ${generatedCase.metadata.subjectFocus.toLowerCase()} skills`,
        secondary: ['Critical thinking', 'Evidence analysis', 'Logical deduction'],
      },
      skillsAssessed: {
        problem_solving: 40,
        computation: 30,
        reasoning: 30,
      },
    },
  });

  // Create scenes
  for (let i = 0; i < generatedCase.scenes.length; i++) {
    const scene = generatedCase.scenes[i];
    await prisma.scene.create({
      data: {
        caseId: newCase.id,
        name: scene.name,
        description: scene.description,
        imageUrl: '/images/scenes/default.png',
        isInitialScene: i === 0,
        orderIndex: i,
      },
    });
  }

  // Create suspects
  for (const suspect of generatedCase.suspects) {
    await prisma.suspect.create({
      data: {
        caseId: newCase.id,
        name: suspect.name,
        role: suspect.role,
        bio: `${suspect.personality.join(', ')} personality. ${suspect.alibi}`,
        isCulprit: suspect.isGuilty,
        dialogueTree: {
          nodes: [
            { id: 'start', question: 'Tell me about yourself', answer: `I am ${suspect.name}, the ${suspect.role}.` },
            { id: 'alibi', question: 'Where were you during the incident?', answer: suspect.alibi },
          ],
        },
      },
    });
  }

  // Create puzzles
  for (const puzzle of generatedCase.puzzles) {
    await prisma.puzzle.create({
      data: {
        caseId: newCase.id,
        title: puzzle.title,
        type: puzzle.type === 'math' ? 'MATH_WORD' :
              puzzle.type === 'logic' ? 'LOGIC_CIPHER' :
              puzzle.type === 'observation' ? 'PATTERN_RECOGNITION' : 'SCIENCE_INQUIRY',
        questionText: puzzle.question,
        correctAnswer: puzzle.answer,
        hint: puzzle.hint,
        points: puzzle.points,
      },
    });
  }

  return newCase.id;
}
