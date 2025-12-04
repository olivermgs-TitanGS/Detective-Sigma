/**
 * EVIDENCE AND CLUE GENERATOR
 *
 * Generates detailed evidence and clues that are:
 * - Tied to syllabus topics (puzzles require solving to understand)
 * - Connected to the mystery narrative
 * - Visually represented with image generation requests
 */

import { nanoid } from 'nanoid';
import { Clue } from './types';
import { SyllabusTopic, getTopicById } from './syllabus';
import { createEvidenceImageRequest, EvidencePromptParams } from './image-generator';

// ============================================
// TYPES
// ============================================

export interface EnhancedClue extends Omit<Clue, 'imageRequest'> {
  // Visual representation (optional - matches types.ts ImageRequest)
  imageRequest?: {
    id: string;
    type: 'scene' | 'suspect' | 'evidence' | 'clue' | 'puzzle' | 'cover';
    prompt: string;
    negativePrompt: string;
    width: number;
    height: number;
    settings: {
      model: string;
      sampler: string;
      steps: number;
      cfgScale: number;
      seed?: number;
    };
    metadata: Record<string, unknown>;
    generatedUrl?: string;
    generatedBase64?: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
  };
  // Syllabus connection
  relatedTopicId?: string;
  puzzleHint?: string;  // Hint that connects to a puzzle
  // Investigation mechanics
  discoveryLocation: string;
  examinationDetails: string[];
  forensicAnalysis?: string;
}

export interface EvidenceCategory {
  type: 'physical' | 'document' | 'digital' | 'testimony';
  items: EvidenceItem[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  discoveryText: string;  // What player sees when finding it
  examinationTexts: string[];  // Progressive examination details
  relatedTopics: string[];  // Syllabus topic IDs this evidence relates to
  imageParams: EvidencePromptParams;
}

// ============================================
// EVIDENCE TEMPLATES BY TOPIC
// ============================================

// Math-related evidence
const mathEvidence: Record<string, EvidenceItem[]> = {
  'whole-numbers': [
    {
      id: 'receipt-calc',
      name: 'Suspicious Receipt',
      description: 'A receipt with suspicious calculations',
      discoveryText: 'You find a crumpled receipt on the floor. The numbers seem off...',
      examinationTexts: [
        'The receipt shows a purchase totaling $XXX but the items listed add up differently.',
        'Looking closer, you notice the digit in the hundreds place seems altered.',
        'The original price was changed - this is evidence of tampering!',
      ],
      relatedTopics: ['p4-math-whole-numbers', 'p5-math-whole-numbers'],
      imageParams: {
        type: 'document',
        item: 'receipt',
        condition: 'worn',
        context: 'crumpled receipt with handwritten corrections',
      },
    },
    {
      id: 'locker-combo',
      name: 'Locker Combination Clue',
      description: 'A note with hints about a locker combination',
      discoveryText: 'A torn note falls from a book. It mentions factors and multiples...',
      examinationTexts: [
        'The note reads: "The combination is a factor of 48..."',
        'There\'s more: "...and a multiple of 4, less than 20."',
        'You need to find numbers that satisfy both conditions!',
      ],
      relatedTopics: ['p4-math-factors-multiples'],
      imageParams: {
        type: 'document',
        item: 'note',
        condition: 'partial',
        context: 'torn handwritten note with math hints',
      },
    },
  ],

  'fractions': [
    {
      id: 'pie-chart',
      name: 'Incomplete Pie Chart',
      description: 'A pie chart showing budget allocation with missing sections',
      discoveryText: 'You discover a financial chart on the desk. Some sections are torn off...',
      examinationTexts: [
        'The chart shows 1/4 for supplies, 2/8 for equipment...',
        'Wait - these fractions need to be compared and added!',
        'If you can calculate the missing portion, you\'ll know where the money went.',
      ],
      relatedTopics: ['p4-math-fractions', 'p5-math-fractions'],
      imageParams: {
        type: 'document',
        item: 'map',
        condition: 'damaged',
        context: 'pie chart document with torn sections',
      },
    },
  ],

  'ratio': [
    {
      id: 'recipe-card',
      name: 'Altered Recipe Card',
      description: 'A recipe with changed ingredient ratios',
      discoveryText: 'A recipe card in the kitchen has been modified...',
      examinationTexts: [
        'The original ratio of flour to sugar was 3:2.',
        'Someone changed it to 6:5 - that\'s not an equivalent ratio!',
        'This sabotaged recipe could be the key to understanding the motive.',
      ],
      relatedTopics: ['p5-math-ratio'],
      imageParams: {
        type: 'document',
        item: 'note',
        condition: 'worn',
        context: 'handwritten recipe card with corrections',
      },
    },
  ],

  'percentage': [
    {
      id: 'discount-sign',
      name: 'Misleading Sale Sign',
      description: 'A store sign with confusing discount percentages',
      discoveryText: 'A sale sign catches your eye. The math doesn\'t add up...',
      examinationTexts: [
        'The sign says "30% off!" but the crossed-out price is suspicious.',
        'Original: $80, Sale: $60. Is that really 30% off?',
        'Someone is either bad at math or trying to deceive customers!',
      ],
      relatedTopics: ['p5-math-percentage'],
      imageParams: {
        type: 'physical',
        item: 'key',
        condition: 'pristine',
        context: 'store sale sign with percentage discount',
      },
    },
  ],

  'speed': [
    {
      id: 'travel-log',
      name: 'Suspicious Travel Log',
      description: 'A travel log with impossible journey times',
      discoveryText: 'The suspect\'s travel log is on the table...',
      examinationTexts: [
        'Entry: "Left at 2pm, arrived 60km away at 2:30pm"',
        'That would require traveling at 120 km/h!',
        'Either the times are wrong, or this alibi is fabricated.',
      ],
      relatedTopics: ['p6-math-speed'],
      imageParams: {
        type: 'document',
        item: 'schedule',
        condition: 'worn',
        context: 'handwritten travel log with times and distances',
      },
    },
  ],

  'algebra': [
    {
      id: 'coded-message',
      name: 'Algebraic Code',
      description: 'A message written in algebraic symbols',
      discoveryText: 'A strange note with letters and numbers is hidden in the drawer...',
      examinationTexts: [
        'The note reads: "Meet at location 3x + 5 when x = 7"',
        'You need to solve for the actual location number!',
        '3(7) + 5 = 21 + 5 = 26. Location 26 must be significant!',
      ],
      relatedTopics: ['p6-math-algebra'],
      imageParams: {
        type: 'document',
        item: 'note',
        condition: 'pristine',
        context: 'note with algebraic equation code',
      },
    },
  ],
};

// Science-related evidence
const scienceEvidence: Record<string, EvidenceItem[]> = {
  'matter': [
    {
      id: 'melted-ice',
      name: 'Melted Ice Clue',
      description: 'Water puddle from recently melted ice',
      discoveryText: 'A puddle of water on the floor seems out of place...',
      examinationTexts: [
        'The water is cold - this was ice recently!',
        'The ice melted (solid → liquid) but when?',
        'Based on the remaining coldness, it melted within the last hour.',
      ],
      relatedTopics: ['p4-sci-matter'],
      imageParams: {
        type: 'physical',
        item: 'glass',
        condition: 'pristine',
        context: 'puddle of water on floor, melted ice evidence',
      },
    },
  ],

  'electrical': [
    {
      id: 'broken-circuit',
      name: 'Sabotaged Alarm',
      description: 'An alarm system with a broken circuit',
      discoveryText: 'The security alarm was disabled. You examine the wires...',
      examinationTexts: [
        'One wire has been cut - breaking the circuit.',
        'Without a complete circuit, electricity cannot flow.',
        'This was deliberate sabotage, not an accident!',
      ],
      relatedTopics: ['p5-sci-electrical'],
      imageParams: {
        type: 'physical',
        item: 'weapon',
        condition: 'damaged',
        context: 'cut electrical wires, broken circuit',
      },
    },
  ],

  'food-chain': [
    {
      id: 'ecosystem-diagram',
      name: 'Research Notes',
      description: 'Environmental research showing food chain disruption',
      discoveryText: 'Scientific notes about the local ecosystem...',
      examinationTexts: [
        'The notes show a food chain: plants → insects → frogs → snakes',
        'Someone circled "remove frogs" - disrupting the chain!',
        'Without frogs, insects overpopulate and snakes starve.',
      ],
      relatedTopics: ['p6-sci-food-chains'],
      imageParams: {
        type: 'document',
        item: 'map',
        condition: 'worn',
        context: 'scientific diagram showing food chain',
      },
    },
  ],
};

// ============================================
// CLUE GENERATION FUNCTIONS
// ============================================

function randomChoice<T>(array: T[]): T {
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

/**
 * Generate evidence items related to specific syllabus topics
 */
export function generateTopicRelatedEvidence(
  topicId: string
): EvidenceItem | null {
  const topic = getTopicById(topicId);
  if (!topic) return null;

  // Find evidence related to this topic's strand
  const strandKey = topic.strand.toLowerCase().replace(/\s+/g, '-');

  // Check math evidence
  for (const [key, items] of Object.entries(mathEvidence)) {
    const matching = items.filter(item =>
      item.relatedTopics.includes(topicId) ||
      key.includes(strandKey)
    );
    if (matching.length > 0) {
      return randomChoice(matching);
    }
  }

  // Check science evidence
  for (const [key, items] of Object.entries(scienceEvidence)) {
    const matching = items.filter(item =>
      item.relatedTopics.includes(topicId) ||
      key.includes(strandKey)
    );
    if (matching.length > 0) {
      return randomChoice(matching);
    }
  }

  return null;
}

/**
 * Create an enhanced clue from evidence item
 */
export function createEnhancedClue(
  evidence: EvidenceItem,
  location: string,
  relevance: 'critical' | 'supporting' | 'red-herring',
  linkedSuspectId?: string
): EnhancedClue {
  const generatedRequest = createEvidenceImageRequest(evidence.imageParams);

  return {
    id: `clue-${nanoid(6)}`,
    title: evidence.name,
    description: evidence.description,
    type: evidence.imageParams.type,
    relevance,
    linkedTo: linkedSuspectId ? [linkedSuspectId] : [],
    // Enhanced fields
    imageRequest: {
      ...generatedRequest,
      status: 'pending' as const,
    },
    relatedTopicId: evidence.relatedTopics[0],
    puzzleHint: evidence.examinationTexts[evidence.examinationTexts.length - 1],
    discoveryLocation: location,
    examinationDetails: evidence.examinationTexts,
  };
}

/**
 * Generate a complete set of clues for a case
 */
export function generateCaseClues(
  topicIds: string[],
  suspects: { id: string; name: string; isGuilty: boolean }[],
  locations: string[],
  clueCount: number = 5
): EnhancedClue[] {
  const clues: EnhancedClue[] = [];
  const guiltySuspect = suspects.find(s => s.isGuilty);
  const innocentSuspects = suspects.filter(s => !s.isGuilty);

  // Generate topic-related clues (critical and supporting)
  for (let i = 0; i < Math.min(topicIds.length, clueCount - 1); i++) {
    const evidence = generateTopicRelatedEvidence(topicIds[i]);
    if (evidence) {
      const relevance = i === 0 ? 'critical' : 'supporting';
      const linkedTo = i === 0 ? guiltySuspect?.id : undefined;

      clues.push(createEnhancedClue(
        evidence,
        randomChoice(locations),
        relevance,
        linkedTo
      ));
    }
  }

  // Add a red herring that points to innocent suspect
  const redHerringEvidence = generateGenericEvidence('red-herring');
  if (redHerringEvidence && innocentSuspects.length > 0) {
    clues.push(createEnhancedClue(
      redHerringEvidence,
      randomChoice(locations),
      'red-herring',
      randomChoice(innocentSuspects).id
    ));
  }

  // Fill remaining slots with supporting evidence
  while (clues.length < clueCount) {
    const genericEvidence = generateGenericEvidence('supporting');
    if (genericEvidence) {
      clues.push(createEnhancedClue(
        genericEvidence,
        randomChoice(locations),
        'supporting'
      ));
    }
  }

  return clues.slice(0, clueCount);
}

/**
 * Generate generic evidence not tied to specific topic
 */
function generateGenericEvidence(
  purpose: 'critical' | 'supporting' | 'red-herring'
): EvidenceItem {
  const genericItems: EvidenceItem[] = [
    {
      id: 'fingerprint-1',
      name: 'Fingerprint Evidence',
      description: 'A partial fingerprint found at the scene',
      discoveryText: 'You notice a smudged fingerprint on the surface...',
      examinationTexts: [
        'The fingerprint is partial but may be matchable.',
        'It appears to be from a thumb or index finger.',
        'This could identify who was here!',
      ],
      relatedTopics: [],
      imageParams: {
        type: 'physical',
        item: 'fingerprint',
        condition: purpose === 'red-herring' ? 'partial' : 'worn',
      },
    },
    {
      id: 'footprint-1',
      name: 'Footprint Trail',
      description: 'Footprints leading from the scene',
      discoveryText: 'Muddy footprints lead away from the area...',
      examinationTexts: [
        'The footprints appear to be size 8 or 9.',
        'The tread pattern is distinctive - possibly sports shoes.',
        'The direction suggests they left in a hurry.',
      ],
      relatedTopics: [],
      imageParams: {
        type: 'physical',
        item: 'footprint',
        condition: 'worn',
      },
    },
    {
      id: 'witness-1',
      name: 'Witness Statement',
      description: 'A witness account of suspicious activity',
      discoveryText: 'A neighbor mentions seeing something unusual...',
      examinationTexts: [
        '"I saw someone running past around 3pm."',
        '"They were carrying something under their arm."',
        '"I didn\'t see their face, but they seemed nervous."',
      ],
      relatedTopics: [],
      imageParams: {
        type: 'document',  // Witness statements are documented as written statements
        item: 'note',
        condition: 'pristine',
        context: 'written witness statement document, signed testimony',
      },
    },
    {
      id: 'cctv-1',
      name: 'CCTV Footage',
      description: 'Security camera recording from nearby',
      discoveryText: 'You check the security footage...',
      examinationTexts: [
        'The timestamp shows activity at 2:45pm.',
        'A figure is visible but the resolution is low.',
        'The clothing color and build might help identify them.',
      ],
      relatedTopics: [],
      imageParams: {
        type: 'digital',
        item: 'cctv',
        condition: purpose === 'red-herring' ? 'damaged' : 'worn',
      },
    },
  ];

  return randomChoice(genericItems);
}

// ============================================
// EXPORTS
// ============================================

export { mathEvidence, scienceEvidence };
