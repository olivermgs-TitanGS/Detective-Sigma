/**
 * ASSET GENERATOR
 *
 * Generates visual assets for cases including:
 * - Scene backgrounds
 * - Suspect portraits
 * - Evidence images
 * - Clue visuals
 * - Puzzle diagrams
 */

import { nanoid } from 'nanoid';

// ============================================
// TYPES
// ============================================

export interface GeneratedAsset {
  id: string;
  type: 'scene' | 'suspect' | 'evidence' | 'clue' | 'puzzle' | 'icon';
  name: string;
  description: string;
  // Visual representation options
  emoji: string;           // Emoji fallback
  svgData?: string;        // Inline SVG
  imageUrl?: string;       // External image URL
  cssGradient?: string;    // CSS gradient background
  aiPrompt?: string;       // Prompt for AI image generation
}

export interface SceneAsset extends GeneratedAsset {
  type: 'scene';
  locationType: string;
  ambiance: 'day' | 'night' | 'evening' | 'morning';
  mood: 'mysterious' | 'tense' | 'calm' | 'urgent';
  interactiveAreas: {
    name: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    emoji: string;
  }[];
}

export interface SuspectAsset extends GeneratedAsset {
  type: 'suspect';
  ethnicity: string;
  gender: 'male' | 'female';
  ageGroup: 'young' | 'middle' | 'senior';
  expression: 'neutral' | 'nervous' | 'confident' | 'angry' | 'worried';
  occupation: string;
  clothingStyle: string;
}

export interface EvidenceAsset extends GeneratedAsset {
  type: 'evidence';
  category: 'physical' | 'document' | 'digital' | 'testimony';
  condition: 'pristine' | 'worn' | 'damaged' | 'partial';
  importance: 'critical' | 'supporting' | 'red-herring';
}

// ============================================
// SCENE TEMPLATES
// ============================================

const sceneTemplates = {
  school: {
    locations: [
      {
        name: 'School Classroom',
        emoji: '🏫',
        cssGradient: 'linear-gradient(135deg, #f5f5dc 0%, #deb887 100%)',
        description: 'A typical Singapore primary school classroom with rows of desks, a whiteboard, and educational posters on the walls.',
        interactiveAreas: [
          { name: "Teacher's Desk", position: { x: 10, y: 20 }, size: { width: 20, height: 15 }, emoji: '🗄️' },
          { name: 'Student Desks', position: { x: 30, y: 40 }, size: { width: 40, height: 30 }, emoji: '📚' },
          { name: 'Whiteboard', position: { x: 10, y: 5 }, size: { width: 30, height: 10 }, emoji: '📋' },
          { name: 'Bookshelf', position: { x: 70, y: 20 }, size: { width: 15, height: 40 }, emoji: '📖' },
        ],
      },
      {
        name: 'School Library',
        emoji: '📚',
        cssGradient: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
        description: 'A quiet library with tall bookshelves, reading tables, and a librarian counter.',
        interactiveAreas: [
          { name: 'Bookshelves', position: { x: 5, y: 10 }, size: { width: 25, height: 60 }, emoji: '📕' },
          { name: 'Reading Area', position: { x: 40, y: 30 }, size: { width: 30, height: 25 }, emoji: '📖' },
          { name: 'Librarian Counter', position: { x: 60, y: 70 }, size: { width: 25, height: 15 }, emoji: '🖥️' },
          { name: 'Computer Section', position: { x: 70, y: 20 }, size: { width: 20, height: 20 }, emoji: '💻' },
        ],
      },
      {
        name: 'Science Laboratory',
        emoji: '🔬',
        cssGradient: 'linear-gradient(135deg, #e0e0e0 0%, #a8d5e2 100%)',
        description: 'A school science lab with workbenches, microscopes, and safety equipment.',
        interactiveAreas: [
          { name: 'Lab Bench', position: { x: 20, y: 30 }, size: { width: 40, height: 20 }, emoji: '🧪' },
          { name: 'Chemical Cabinet', position: { x: 5, y: 20 }, size: { width: 12, height: 30 }, emoji: '⚗️' },
          { name: 'Microscope Station', position: { x: 65, y: 35 }, size: { width: 20, height: 15 }, emoji: '🔬' },
          { name: 'Safety Station', position: { x: 80, y: 60 }, size: { width: 15, height: 20 }, emoji: '🧯' },
        ],
      },
    ],
    ambiance: ['day', 'morning'] as const,
    mood: ['calm', 'mysterious'] as const,
  },

  neighborhood: {
    locations: [
      {
        name: 'HDB Void Deck',
        emoji: '🏢',
        cssGradient: 'linear-gradient(135deg, #808080 0%, #a9a9a9 100%)',
        description: 'The ground floor common area of an HDB block, with benches and notice boards.',
        interactiveAreas: [
          { name: 'Notice Board', position: { x: 10, y: 15 }, size: { width: 15, height: 20 }, emoji: '📌' },
          { name: 'Stone Benches', position: { x: 30, y: 50 }, size: { width: 25, height: 15 }, emoji: '🪑' },
          { name: 'Letterboxes', position: { x: 70, y: 20 }, size: { width: 20, height: 30 }, emoji: '📬' },
          { name: 'Lift Lobby', position: { x: 50, y: 10 }, size: { width: 20, height: 20 }, emoji: '🛗' },
        ],
      },
      {
        name: 'Neighborhood Park',
        emoji: '🌳',
        cssGradient: 'linear-gradient(135deg, #228b22 0%, #90ee90 100%)',
        description: 'A small park with a playground, benches, and walking paths.',
        interactiveAreas: [
          { name: 'Playground', position: { x: 20, y: 30 }, size: { width: 30, height: 25 }, emoji: '🎠' },
          { name: 'Park Bench', position: { x: 60, y: 50 }, size: { width: 15, height: 10 }, emoji: '🪑' },
          { name: 'Jogging Path', position: { x: 10, y: 60 }, size: { width: 50, height: 10 }, emoji: '🛤️' },
          { name: 'Fitness Corner', position: { x: 70, y: 25 }, size: { width: 20, height: 20 }, emoji: '🏋️' },
        ],
      },
      {
        name: 'Hawker Centre',
        emoji: '🍜',
        cssGradient: 'linear-gradient(135deg, #ff6347 0%, #ffa07a 100%)',
        description: 'A busy hawker centre with food stalls and communal dining tables.',
        interactiveAreas: [
          { name: 'Food Stalls', position: { x: 5, y: 10 }, size: { width: 90, height: 20 }, emoji: '🍲' },
          { name: 'Dining Tables', position: { x: 20, y: 40 }, size: { width: 50, height: 30 }, emoji: '🪑' },
          { name: 'Drinks Stall', position: { x: 75, y: 40 }, size: { width: 15, height: 15 }, emoji: '🧋' },
          { name: 'Tray Return', position: { x: 10, y: 75 }, size: { width: 15, height: 10 }, emoji: '🗑️' },
        ],
      },
    ],
    ambiance: ['day', 'evening', 'morning'] as const,
    mood: ['calm', 'mysterious', 'tense'] as const,
  },

  shop: {
    locations: [
      {
        name: 'Convenience Store',
        emoji: '🏪',
        cssGradient: 'linear-gradient(135deg, #ffd700 0%, #ffec8b 100%)',
        description: 'A 7-Eleven style convenience store with aisles of snacks and a cashier counter.',
        interactiveAreas: [
          { name: 'Cashier Counter', position: { x: 60, y: 10 }, size: { width: 30, height: 15 }, emoji: '💰' },
          { name: 'Snack Aisle', position: { x: 10, y: 30 }, size: { width: 20, height: 40 }, emoji: '🍿' },
          { name: 'Drinks Fridge', position: { x: 35, y: 25 }, size: { width: 15, height: 35 }, emoji: '🧃' },
          { name: 'Magazine Rack', position: { x: 75, y: 50 }, size: { width: 15, height: 25 }, emoji: '📰' },
        ],
      },
      {
        name: 'Shopping Mall',
        emoji: '🛒',
        cssGradient: 'linear-gradient(135deg, #dda0dd 0%, #da70d6 100%)',
        description: 'A modern shopping mall with multiple floors and various stores.',
        interactiveAreas: [
          { name: 'Escalator', position: { x: 45, y: 30 }, size: { width: 15, height: 25 }, emoji: '📶' },
          { name: 'Store Front', position: { x: 10, y: 20 }, size: { width: 25, height: 30 }, emoji: '🏬' },
          { name: 'Information Desk', position: { x: 70, y: 60 }, size: { width: 20, height: 15 }, emoji: 'ℹ️' },
          { name: 'Food Court', position: { x: 20, y: 65 }, size: { width: 40, height: 20 }, emoji: '🍔' },
        ],
      },
    ],
    ambiance: ['day', 'evening'] as const,
    mood: ['calm', 'tense'] as const,
  },

  investigation: {
    locations: [
      {
        name: 'Detective Office',
        emoji: '🕵️',
        cssGradient: 'linear-gradient(135deg, #2f4f4f 0%, #556b2f 100%)',
        description: 'A detective office with a large desk, evidence board, and filing cabinets.',
        interactiveAreas: [
          { name: 'Evidence Board', position: { x: 5, y: 10 }, size: { width: 30, height: 40 }, emoji: '📋' },
          { name: 'Detective Desk', position: { x: 40, y: 40 }, size: { width: 35, height: 25 }, emoji: '🖥️' },
          { name: 'Filing Cabinet', position: { x: 80, y: 20 }, size: { width: 15, height: 35 }, emoji: '🗄️' },
          { name: 'Waiting Area', position: { x: 15, y: 65 }, size: { width: 25, height: 20 }, emoji: '🪑' },
        ],
      },
      {
        name: 'Interrogation Room',
        emoji: '💡',
        cssGradient: 'linear-gradient(135deg, #4a4a4a 0%, #696969 100%)',
        description: 'A stark interrogation room with a table, chairs, and a one-way mirror.',
        interactiveAreas: [
          { name: 'Interview Table', position: { x: 30, y: 35 }, size: { width: 30, height: 20 }, emoji: '🪑' },
          { name: 'One-Way Mirror', position: { x: 10, y: 10 }, size: { width: 40, height: 15 }, emoji: '🪞' },
          { name: 'Recording Equipment', position: { x: 70, y: 15 }, size: { width: 15, height: 15 }, emoji: '🎥' },
          { name: 'Door', position: { x: 80, y: 50 }, size: { width: 10, height: 25 }, emoji: '🚪' },
        ],
      },
    ],
    ambiance: ['day', 'night', 'evening'] as const,
    mood: ['mysterious', 'tense', 'urgent'] as const,
  },
};

// ============================================
// SUSPECT TEMPLATES
// ============================================

const suspectTemplates = {
  portraits: {
    male: {
      young: ['👦', '🧑', '👨‍🎓'],
      middle: ['👨', '👨‍💼', '👨‍🔧', '👨‍🍳', '👨‍🏫'],
      senior: ['👴', '🧓'],
    },
    female: {
      young: ['👧', '🧑', '👩‍🎓'],
      middle: ['👩', '👩‍💼', '👩‍🔧', '👩‍🍳', '👩‍🏫'],
      senior: ['👵', '🧓'],
    },
  },

  expressions: {
    neutral: { emoji: '😐', description: 'calm and composed' },
    nervous: { emoji: '😰', description: 'sweating and fidgeting' },
    confident: { emoji: '😏', description: 'relaxed with a slight smirk' },
    angry: { emoji: '😠', description: 'frowning and tense' },
    worried: { emoji: '😟', description: 'brow furrowed with concern' },
  },

  occupations: {
    teacher: { emoji: '👨‍🏫', clothing: 'formal shirt and pants' },
    shopkeeper: { emoji: '🧑‍💼', clothing: 'apron over casual clothes' },
    student: { emoji: '🧑‍🎓', clothing: 'school uniform' },
    office_worker: { emoji: '👔', clothing: 'business attire' },
    chef: { emoji: '👨‍🍳', clothing: 'chef whites and apron' },
    security: { emoji: '👮', clothing: 'security uniform' },
    cleaner: { emoji: '🧹', clothing: 'work coveralls' },
    delivery: { emoji: '📦', clothing: 'company polo shirt' },
  },

  ethnicities: ['Chinese', 'Malay', 'Indian', 'Eurasian'],
};

// ============================================
// EVIDENCE TEMPLATES
// ============================================

const evidenceTemplates = {
  physical: [
    { name: 'Fingerprint', emoji: '👆', description: 'A partial fingerprint found on a smooth surface' },
    { name: 'Footprint', emoji: '👟', description: 'A shoe print with distinctive tread pattern' },
    { name: 'Torn Paper', emoji: '📄', description: 'A piece of torn paper with partial writing' },
    { name: 'Key', emoji: '🔑', description: 'A small key with an unusual shape' },
    { name: 'Fabric Scrap', emoji: '🧵', description: 'A small piece of fabric caught on a nail' },
    { name: 'Hair Sample', emoji: '💇', description: 'A few strands of hair found at the scene' },
    { name: 'Broken Glass', emoji: '🔍', description: 'Fragments of broken glass' },
    { name: 'Dropped Item', emoji: '📱', description: 'A personal item left behind' },
  ],

  document: [
    { name: 'Receipt', emoji: '🧾', description: 'A crumpled receipt with date and time' },
    { name: 'Note', emoji: '📝', description: 'A handwritten note with cryptic message' },
    { name: 'Photograph', emoji: '📷', description: 'A photograph showing important details' },
    { name: 'Map', emoji: '🗺️', description: 'A map with marked locations' },
    { name: 'Schedule', emoji: '📅', description: 'A schedule showing times and activities' },
    { name: 'Letter', emoji: '✉️', description: 'A sealed or opened letter' },
    { name: 'ID Card', emoji: '🪪', description: 'An identification card' },
    { name: 'Ticket', emoji: '🎫', description: 'A ticket stub with date and location' },
  ],

  digital: [
    { name: 'CCTV Footage', emoji: '📹', description: 'Security camera recording' },
    { name: 'Phone Records', emoji: '📱', description: 'Call and message logs' },
    { name: 'Email', emoji: '📧', description: 'An email thread with important information' },
    { name: 'Computer Files', emoji: '💻', description: 'Files found on a computer' },
    { name: 'Social Media Post', emoji: '📲', description: 'A relevant social media post' },
    { name: 'GPS Data', emoji: '📍', description: 'Location tracking data' },
  ],

  testimony: [
    { name: 'Witness Statement', emoji: '👁️', description: 'An eyewitness account of events' },
    { name: 'Alibi', emoji: '🗣️', description: 'A claimed whereabouts during the incident' },
    { name: 'Character Reference', emoji: '👥', description: 'Information about a person\'s character' },
    { name: 'Expert Opinion', emoji: '🧑‍🔬', description: 'A professional\'s analysis' },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomChoice<T>(array: readonly T[] | T[]): T {
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

// ============================================
// SCENE GENERATION
// ============================================

export function generateSceneAsset(
  locationType: keyof typeof sceneTemplates,
  specificLocation?: string
): SceneAsset {
  const template = sceneTemplates[locationType];
  const location = specificLocation
    ? template.locations.find(l => l.name === specificLocation) || randomChoice(template.locations)
    : randomChoice(template.locations);

  const ambiance = randomChoice(template.ambiance);
  const mood = randomChoice(template.mood);

  return {
    id: `scene-${nanoid(6)}`,
    type: 'scene',
    name: location.name,
    description: location.description,
    emoji: location.emoji,
    cssGradient: location.cssGradient,
    aiPrompt: `A ${ambiance} scene of ${location.name} in Singapore. ${location.description} The atmosphere is ${mood}. Illustration style, detailed background, no people visible.`,
    locationType,
    ambiance,
    mood,
    interactiveAreas: location.interactiveAreas,
  };
}

export function generateMultipleScenes(count: number = 2): SceneAsset[] {
  const locationTypes = Object.keys(sceneTemplates) as (keyof typeof sceneTemplates)[];
  const selectedTypes = shuffleArray(locationTypes).slice(0, count);

  return selectedTypes.map(type => generateSceneAsset(type));
}

// ============================================
// SUSPECT GENERATION
// ============================================

export function generateSuspectAsset(
  name: string,
  role: string,
  isGuilty: boolean
): SuspectAsset {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const ageGroup = randomChoice(['young', 'middle', 'senior'] as const);
  const ethnicity = randomChoice(suspectTemplates.ethnicities);

  // Guilty suspects tend to look more nervous
  const expression = isGuilty
    ? randomChoice(['nervous', 'worried', 'confident'] as const)
    : randomChoice(['neutral', 'confident', 'worried'] as const);

  const occupation = Object.keys(suspectTemplates.occupations).find(
    occ => role.toLowerCase().includes(occ)
  ) || 'office_worker';

  const occData = suspectTemplates.occupations[occupation as keyof typeof suspectTemplates.occupations];
  const portraitEmojis = suspectTemplates.portraits[gender][ageGroup];

  return {
    id: `suspect-${nanoid(6)}`,
    type: 'suspect',
    name,
    description: `A ${ageGroup} ${ethnicity} ${gender} who works as a ${role}. They appear ${suspectTemplates.expressions[expression].description}.`,
    emoji: randomChoice(portraitEmojis),
    aiPrompt: `Portrait of a ${ageGroup} ${ethnicity} ${gender} from Singapore, working as ${role}. They are wearing ${occData.clothing}. Their expression is ${expression}. Illustration style, bust shot, neutral background.`,
    ethnicity,
    gender,
    ageGroup,
    expression,
    occupation: role,
    clothingStyle: occData.clothing,
  };
}

// ============================================
// EVIDENCE GENERATION
// ============================================

export function generateEvidenceAsset(
  category: 'physical' | 'document' | 'digital' | 'testimony',
  importance: 'critical' | 'supporting' | 'red-herring',
  linkedToTopic?: string
): EvidenceAsset {
  const templates = evidenceTemplates[category];
  const template = randomChoice(templates);

  // Modify description based on importance
  let modifiedDescription = template.description;
  if (importance === 'critical') {
    modifiedDescription += ' This appears to be crucial evidence.';
  } else if (importance === 'red-herring') {
    modifiedDescription += ' However, it may not be what it seems.';
  }

  // Add topic-specific context if provided
  if (linkedToTopic) {
    modifiedDescription += ` It seems related to ${linkedToTopic}.`;
  }

  const condition = importance === 'critical'
    ? randomChoice(['pristine', 'worn'] as const)
    : randomChoice(['worn', 'damaged', 'partial'] as const);

  return {
    id: `evidence-${nanoid(6)}`,
    type: 'evidence',
    name: template.name,
    description: modifiedDescription,
    emoji: template.emoji,
    aiPrompt: `A ${condition} ${template.name.toLowerCase()} used as evidence. ${modifiedDescription} Realistic style, detailed, dramatic lighting, evidence photography style.`,
    category,
    condition,
    importance,
  };
}

export function generateEvidenceSet(
  clueCount: number,
  guiltySuspectId: string
): EvidenceAsset[] {
  const evidence: EvidenceAsset[] = [];

  // Always include one critical physical evidence
  evidence.push(generateEvidenceAsset('physical', 'critical'));

  // Add supporting evidence
  const categories: ('physical' | 'document' | 'digital' | 'testimony')[] =
    ['document', 'testimony', 'digital'];

  for (let i = 1; i < clueCount - 1; i++) {
    const category = categories[i % categories.length];
    evidence.push(generateEvidenceAsset(category, 'supporting'));
  }

  // Add one red herring
  evidence.push(generateEvidenceAsset(
    randomChoice(['physical', 'document'] as const),
    'red-herring'
  ));

  return evidence;
}

// ============================================
// PUZZLE VISUAL GENERATION
// ============================================

export interface PuzzleVisual {
  id: string;
  type: 'diagram' | 'table' | 'chart' | 'image' | 'map';
  title: string;
  content: string; // SVG or structured data
  emoji: string;
  description: string;
}

export function generatePuzzleVisual(
  puzzleType: 'math' | 'logic' | 'observation' | 'deduction',
  topicId?: string
): PuzzleVisual {
  const visualTypes = {
    math: ['table', 'chart', 'diagram'],
    logic: ['diagram', 'table', 'map'],
    observation: ['image', 'diagram', 'map'],
    deduction: ['table', 'diagram', 'chart'],
  };

  const type = randomChoice(visualTypes[puzzleType]) as PuzzleVisual['type'];

  const templates = {
    table: {
      emoji: '📊',
      title: 'Data Table',
      description: 'A table of important data to analyze',
    },
    chart: {
      emoji: '📈',
      title: 'Evidence Chart',
      description: 'A chart showing patterns in the evidence',
    },
    diagram: {
      emoji: '📐',
      title: 'Case Diagram',
      description: 'A diagram showing relationships and connections',
    },
    image: {
      emoji: '🖼️',
      title: 'Crime Scene Photo',
      description: 'A photograph from the investigation',
    },
    map: {
      emoji: '🗺️',
      title: 'Location Map',
      description: 'A map showing relevant locations',
    },
  };

  const template = templates[type];

  return {
    id: `visual-${nanoid(6)}`,
    type,
    title: template.title,
    content: '', // Would be populated with actual SVG/data
    emoji: template.emoji,
    description: template.description,
  };
}

// ============================================
// COMPLETE CASE ASSETS
// ============================================

export interface CaseAssets {
  scenes: SceneAsset[];
  suspects: SuspectAsset[];
  evidence: EvidenceAsset[];
  puzzleVisuals: PuzzleVisual[];
  coverImage: GeneratedAsset;
}

export function generateCaseAssets(
  suspectData: { name: string; role: string; isGuilty: boolean }[],
  puzzleTypes: ('math' | 'logic' | 'observation' | 'deduction')[],
  clueCount: number = 5
): CaseAssets {
  // Generate scenes
  const scenes = generateMultipleScenes(2);

  // Generate suspect assets
  const suspects = suspectData.map(s =>
    generateSuspectAsset(s.name, s.role, s.isGuilty)
  );

  // Find guilty suspect for evidence linking
  const guiltySuspect = suspectData.find(s => s.isGuilty);

  // Generate evidence
  const evidence = generateEvidenceSet(clueCount, guiltySuspect?.name || '');

  // Generate puzzle visuals
  const puzzleVisuals = puzzleTypes.map(type => generatePuzzleVisual(type));

  // Generate cover image
  const coverImage: GeneratedAsset = {
    id: `cover-${nanoid(6)}`,
    type: 'icon',
    name: 'Case File Cover',
    description: 'The cover of this mystery case file',
    emoji: '🔍',
    cssGradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #DEB887 100%)',
    aiPrompt: 'A mysterious detective case file folder, manila colored, with "CLASSIFIED" stamp, dramatic lighting, illustration style',
  };

  return {
    scenes,
    suspects,
    evidence,
    puzzleVisuals,
    coverImage,
  };
}

// ============================================
// EXPORTS FOR SPECIFIC NEEDS
// ============================================

export { sceneTemplates, suspectTemplates, evidenceTemplates };
