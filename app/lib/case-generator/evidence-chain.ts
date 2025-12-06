/**
 * EVIDENCE CHAIN SYSTEM
 *
 * Creates logical, interconnected evidence that:
 * - Builds progressively from discovery to solution
 * - Links directly to the crime narrative
 * - Connects evidence to character statements
 * - Provides verification/contradiction paths
 * - Integrates puzzle solutions as revelations
 */

import { nanoid } from 'nanoid';
import { NarrativeCase, TimelineEvent, CrimeDetails } from './narrative-engine';
import { SuspectCharacter } from './character-web';

// ============================================
// TYPES
// ============================================

export type EvidenceType =
  | 'physical'      // Object found at scene
  | 'testimonial'   // Statement from witness/suspect
  | 'documentary'   // Written record (logs, receipts, etc.)
  | 'digital'       // Electronic evidence (CCTV, access logs)
  | 'forensic'      // Scientific analysis result
  | 'circumstantial'; // Indirect evidence

export type EvidenceImportance = 'critical' | 'supporting' | 'misleading' | 'neutral';

export interface EvidenceItem {
  id: string;
  name: string;
  type: EvidenceType;
  importance: EvidenceImportance;
  description: string;
  location: string;
  discoveryMethod: string;

  // Narrative connections
  linkedCharacterId?: string;        // Which suspect this evidence relates to
  linkedTimelineEventId?: string;    // Which timeline event this proves/relates to

  // Evidence relationships
  leadsTo?: string[];                // IDs of evidence this unlocks
  requires?: string[];               // IDs of evidence needed to find this
  contradicts?: string;              // ID of character statement this contradicts
  verifies?: string;                 // ID of character statement this supports

  // Puzzle integration
  unlockedByPuzzle?: boolean;        // Is this revealed by solving a puzzle?
  puzzleContext?: string;            // How the puzzle reveals this

  // Visual clues for player
  visualCue: string;                 // What player sees/notices
  analysisResult: string;            // What detailed analysis reveals

  // For guilty determination
  pointsToGuilty: boolean;           // Does this point to the culprit?
  clearsInnocent?: string;           // ID of character this clears
}

export interface EvidenceChain {
  id: string;
  caseId: string;

  // All evidence organized by discovery phase
  initialEvidence: EvidenceItem[];   // Found at scene immediately
  discoveredEvidence: EvidenceItem[]; // Found through investigation
  conclusiveEvidence: EvidenceItem[]; // Final proof of guilt

  // Paths to solution
  mainPath: string[];                // IDs of evidence in optimal solving order
  alternativePaths: string[][];      // Other valid evidence combinations

  // Evidence summary
  evidenceCount: number;
  criticalEvidenceCount: number;
  misleadingEvidenceCount: number;
}

// ============================================
// EVIDENCE TEMPLATES BY CRIME TYPE
// ============================================

interface EvidenceTemplate {
  name: string;
  type: EvidenceType;
  importance: EvidenceImportance;
  visualCue: string;
  analysisResult: string;
  discoveryMethod: string;
  pointsToGuilty: boolean;
}

const EVIDENCE_TEMPLATES: Record<CrimeDetails['type'], EvidenceTemplate[]> = {
  theft: [
    // Physical evidence
    {
      name: 'Fingerprints on container',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Close-up fingerprint on glass surface, forensic powder dusted, visible ridge patterns, evidence marker number 1',
      analysisResult: 'Clear fingerprints that can be matched to suspects',
      discoveryMethod: 'Examining the container closely',
      pointsToGuilty: true,
    },
    {
      name: 'Torn fabric piece',
      type: 'physical',
      importance: 'supporting',
      visualCue: 'Small torn fabric piece caught on metal edge, colored clothing fiber, tweezers holding sample, evidence bag nearby',
      analysisResult: 'Material matches a specific type of clothing',
      discoveryMethod: 'Searching the area carefully',
      pointsToGuilty: true,
    },
    {
      name: 'Footprints',
      type: 'physical',
      importance: 'supporting',
      visualCue: 'Muddy shoe footprints on floor, visible tread pattern, measuring ruler alongside, numbered evidence markers',
      analysisResult: 'Shoe size and pattern can narrow down suspects',
      discoveryMethod: 'Following the trail from the scene',
      pointsToGuilty: true,
    },
    // Documentary evidence
    {
      name: 'Access log',
      type: 'documentary',
      importance: 'critical',
      visualCue: 'Open visitor logbook on desk, handwritten entries visible, pen nearby, highlighted signatures',
      analysisResult: 'Shows who was present during the crime window',
      discoveryMethod: 'Requesting records from management',
      pointsToGuilty: true,
    },
    {
      name: 'Receipt with timestamp',
      type: 'documentary',
      importance: 'supporting',
      visualCue: 'Crumpled thermal paper receipt, printed date and time visible, store name at top, transaction details',
      analysisResult: 'Timestamp contradicts alibi',
      discoveryMethod: 'Searching waste bins and surfaces',
      pointsToGuilty: true,
    },
    // Digital evidence
    {
      name: 'CCTV footage',
      type: 'digital',
      importance: 'critical',
      visualCue: 'CCTV monitor screen showing grainy security footage, timestamp overlay in corner, paused video frame of hallway',
      analysisResult: 'Shows movement during crime window',
      discoveryMethod: 'Reviewing security footage',
      pointsToGuilty: true,
    },
    // Misleading evidence
    {
      name: 'Wrong suspect\'s item',
      type: 'physical',
      importance: 'misleading',
      visualCue: 'Personal wallet or keys in evidence bag, labeled with case number, found near crime scene',
      analysisResult: 'Belongs to an innocent person who has an alibi',
      discoveryMethod: 'Found during initial search',
      pointsToGuilty: false,
    },
  ],

  sabotage: [
    {
      name: 'Tool marks',
      type: 'forensic',
      importance: 'critical',
      visualCue: 'Close-up metal surface with deep scratch marks, damaged machinery part, visible tool gouges, forensic lighting, evidence marker',
      analysisResult: 'Specific tool type required - check who has access',
      discoveryMethod: 'Close examination of damage',
      pointsToGuilty: true,
    },
    {
      name: 'Chemical residue',
      type: 'forensic',
      importance: 'critical',
      visualCue: 'Glass petri dish with chemical residue sample, white crystalline powder, cotton swab nearby, laboratory analysis setup',
      analysisResult: 'Specific chemical used that limited people have access to',
      discoveryMethod: 'Laboratory analysis',
      pointsToGuilty: true,
    },
    {
      name: 'Timeline inconsistency note',
      type: 'documentary',
      importance: 'supporting',
      visualCue: 'Printed weekly schedule on paper, highlighted time entries, handwritten corrections, red circle around conflicting times',
      analysisResult: 'Shows someone\'s claimed schedule doesn\'t match records',
      discoveryMethod: 'Cross-referencing multiple documents',
      pointsToGuilty: true,
    },
    {
      name: 'Witness observation log',
      type: 'testimonial',
      importance: 'supporting',
      visualCue: 'Handwritten witness statement on lined paper, dated signature at bottom, official letterhead, pen nearby',
      analysisResult: 'Places suspect at scene during crime window',
      discoveryMethod: 'Interviewing all potential witnesses',
      pointsToGuilty: true,
    },
    {
      name: 'Access card records',
      type: 'digital',
      importance: 'critical',
      visualCue: 'Computer monitor displaying access log spreadsheet, timestamps and names visible, security software interface, printed report',
      analysisResult: 'Electronic log of who entered secured areas',
      discoveryMethod: 'Obtaining system records',
      pointsToGuilty: true,
    },
    {
      name: 'Motive evidence',
      type: 'documentary',
      importance: 'supporting',
      visualCue: 'Folded personal letter or note, handwritten text visible, emotional content, evidence bag with label',
      analysisResult: 'Reveals underlying motivation for the crime',
      discoveryMethod: 'Searching personal belongings with permission',
      pointsToGuilty: true,
    },
  ],

  fraud: [
    {
      name: 'Modified equipment',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Weighing scale or measuring device on table, tampered internal mechanism exposed, screwdriver nearby, comparison with standard equipment',
      analysisResult: 'Has been tampered with to show incorrect readings',
      discoveryMethod: 'Comparing with standard equipment',
      pointsToGuilty: true,
    },
    {
      name: 'Financial discrepancy records',
      type: 'documentary',
      importance: 'critical',
      visualCue: 'Open ledger book or accounting spreadsheet, handwritten corrections in red ink, calculator nearby, highlighted number discrepancies',
      analysisResult: 'Numbers don\'t add up over time',
      discoveryMethod: 'Auditing financial records',
      pointsToGuilty: true,
    },
    {
      name: 'Comparison receipts',
      type: 'documentary',
      importance: 'supporting',
      visualCue: 'Multiple paper receipts spread on desk, different dates visible, circled prices, side-by-side comparison, price differences highlighted',
      analysisResult: 'Shows pattern of overcharging',
      discoveryMethod: 'Collecting customer complaints and receipts',
      pointsToGuilty: true,
    },
    {
      name: 'Calibration records',
      type: 'documentary',
      importance: 'supporting',
      visualCue: 'Service maintenance logbook open to entries, official stamps, dates of calibration, technician signatures, highlighted discrepancies',
      analysisResult: 'Equipment calibration doesn\'t match claimed service',
      discoveryMethod: 'Requesting service history',
      pointsToGuilty: true,
    },
    {
      name: 'Witness statement - customer',
      type: 'testimonial',
      importance: 'supporting',
      visualCue: 'Typed witness statement on official form, customer signature at bottom, dated document, attached receipt as exhibit',
      analysisResult: 'Confirms pattern of questionable transactions',
      discoveryMethod: 'Interviewing recent customers',
      pointsToGuilty: true,
    },
  ],

  vandalism: [
    {
      name: 'Paint/marker evidence',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Spray paint can in evidence bag, colored paint stains visible, matching color to vandalism, nozzle with residue, evidence label',
      analysisResult: 'Matches supplies found with suspect',
      discoveryMethod: 'Tracing purchase records',
      pointsToGuilty: true,
    },
    {
      name: 'Security footage',
      type: 'digital',
      importance: 'critical',
      visualCue: 'CCTV monitor screen showing night-time footage, figure silhouette near wall, timestamp overlay, security room setup',
      analysisResult: 'Captures figure near scene during crime window',
      discoveryMethod: 'Reviewing all available footage',
      pointsToGuilty: true,
    },
    {
      name: 'Witness account',
      type: 'testimonial',
      importance: 'supporting',
      visualCue: 'Witness statement form on clipboard, handwritten description of suspect, time noted, signed by witness, official header',
      analysisResult: 'Provides partial description or timing',
      discoveryMethod: 'Canvassing the area for witnesses',
      pointsToGuilty: true,
    },
  ],

  missing_item: [
    {
      name: 'Last seen location evidence',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Empty shelf or cabinet space, visible dust outline where item was, clean rectangle surrounded by dust, evidence marker nearby',
      analysisResult: 'Dust pattern shows item was recently moved',
      discoveryMethod: 'Examining the original location',
      pointsToGuilty: true,
    },
    {
      name: 'Access log',
      type: 'documentary',
      importance: 'critical',
      visualCue: 'Sign-out logbook open on desk, handwritten entries with names and times, last entry highlighted, pen nearby',
      analysisResult: 'Shows last person to access the item',
      discoveryMethod: 'Reviewing official logs',
      pointsToGuilty: true,
    },
    {
      name: 'Hidden item discovery',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Object partially hidden in drawer or bag, discovered during search, item label visible, evidence gloves handling it',
      analysisResult: 'Location links to specific person',
      discoveryMethod: 'Thorough search of premises',
      pointsToGuilty: true,
    },
  ],

  cheating: [
    {
      name: 'Cheat sheet or notes',
      type: 'physical',
      importance: 'critical',
      visualCue: 'Small folded paper with handwritten notes, formulas and answers visible, cramped tiny writing, found hidden under desk',
      analysisResult: 'Handwriting matches suspect',
      discoveryMethod: 'Searching desk or belongings',
      pointsToGuilty: true,
    },
    {
      name: 'Digital communication',
      type: 'digital',
      importance: 'critical',
      visualCue: 'Phone screen showing text message conversation, exam answers discussed, timestamps during test time, screenshot printout',
      analysisResult: 'Shows planning of cheating scheme',
      discoveryMethod: 'Reviewing communication logs',
      pointsToGuilty: true,
    },
    {
      name: 'Pattern analysis',
      type: 'forensic',
      importance: 'supporting',
      visualCue: 'Two answer sheets side by side, identical mistakes circled in red, statistical analysis report attached, percentage match shown',
      analysisResult: 'Statistical analysis shows copying',
      discoveryMethod: 'Comparing answer sheets',
      pointsToGuilty: true,
    },
  ],
};

// ============================================
// CLUE CLEARING EVIDENCE
// ============================================

const CLEARING_EVIDENCE_TEMPLATES: EvidenceTemplate[] = [
  {
    name: 'Confirmed alibi document',
    type: 'documentary',
    importance: 'neutral',
    visualCue: 'Official receipt or booking confirmation, printed with date and time, business letterhead, timestamp matching alibi period',
    analysisResult: 'Proves suspect was elsewhere during crime window',
    discoveryMethod: 'Verifying alibi claims',
    pointsToGuilty: false,
  },
  {
    name: 'CCTV alibi footage',
    type: 'digital',
    importance: 'neutral',
    visualCue: 'CCTV monitor showing different location footage, person clearly visible at counter or door, timestamp overlay matching crime time',
    analysisResult: 'Shows suspect in different location during crime',
    discoveryMethod: 'Reviewing security footage',
    pointsToGuilty: false,
  },
  {
    name: 'Witness confirmation',
    type: 'testimonial',
    importance: 'neutral',
    visualCue: 'Signed witness statement on official paper, confirming alibi details, multiple signatures, notarized stamp visible',
    analysisResult: 'Multiple witnesses confirm suspect\'s alibi',
    discoveryMethod: 'Interviewing witnesses',
    pointsToGuilty: false,
  },
  {
    name: 'Physical impossibility',
    type: 'forensic',
    importance: 'neutral',
    visualCue: 'Medical report or physical assessment document, doctor letterhead, dated examination results, official medical stamp',
    analysisResult: 'Suspect physically couldn\'t have committed the crime',
    discoveryMethod: 'Analysis of crime requirements',
    pointsToGuilty: false,
  },
];

// ============================================
// GENERATION FUNCTIONS
// ============================================

/**
 * Generate a unique evidence item from template
 */
function createEvidenceFromTemplate(
  template: EvidenceTemplate,
  narrativeCase: NarrativeCase,
  linkedCharacterId?: string,
  clearsInnocent?: string
): EvidenceItem {
  return {
    id: `evidence-${nanoid(8)}`,
    name: template.name,
    type: template.type,
    importance: template.importance,
    description: `${template.visualCue}. ${template.analysisResult}`,
    location: narrativeCase.setting.location,
    discoveryMethod: template.discoveryMethod,
    linkedCharacterId,
    visualCue: template.visualCue,
    analysisResult: template.analysisResult,
    pointsToGuilty: template.pointsToGuilty,
    clearsInnocent,
  };
}

/**
 * Generate initial evidence found at the scene
 */
function generateInitialEvidence(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[]
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];
  const crimeType = narrativeCase.crime.type;
  const templates = EVIDENCE_TEMPLATES[crimeType] || EVIDENCE_TEMPLATES.theft;

  // Get the guilty character
  const guiltyChar = characters.find(c => c.isGuilty);

  // Add 1-2 initial physical/visual evidence items
  const physicalTemplates = templates.filter(t =>
    t.type === 'physical' && t.importance !== 'misleading'
  );

  if (physicalTemplates.length > 0) {
    const firstEvidence = createEvidenceFromTemplate(
      physicalTemplates[0],
      narrativeCase,
      guiltyChar?.id
    );
    firstEvidence.location = `${narrativeCase.setting.location} - crime scene`;
    evidence.push(firstEvidence);
  }

  // Add one misleading evidence to create initial doubt
  const misleadingTemplates = templates.filter(t => t.importance === 'misleading');
  if (misleadingTemplates.length > 0) {
    const innocentChar = characters.find(c => !c.isGuilty);
    const misleadingEvidence = createEvidenceFromTemplate(
      misleadingTemplates[0],
      narrativeCase,
      innocentChar?.id
    );
    misleadingEvidence.description = `${misleadingEvidence.visualCue}. Initially suspicious, but ${innocentChar?.name || 'this person'} has a verified alibi.`;
    evidence.push(misleadingEvidence);
  }

  return evidence;
}

/**
 * Generate evidence discovered through investigation
 */
function generateDiscoveredEvidence(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  initialEvidence: EvidenceItem[]
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];
  const crimeType = narrativeCase.crime.type;
  const templates = EVIDENCE_TEMPLATES[crimeType] || EVIDENCE_TEMPLATES.theft;

  const guiltyChar = characters.find(c => c.isGuilty);
  const innocentChars = characters.filter(c => !c.isGuilty);

  // Add documentary evidence that requires initial evidence to find
  const docTemplates = templates.filter(t =>
    t.type === 'documentary' && t.importance === 'critical'
  );

  if (docTemplates.length > 0 && initialEvidence.length > 0) {
    const docEvidence = createEvidenceFromTemplate(
      docTemplates[0],
      narrativeCase,
      guiltyChar?.id
    );
    docEvidence.requires = [initialEvidence[0].id];
    docEvidence.description = `${docEvidence.visualCue}. ${docEvidence.analysisResult} This evidence becomes relevant after examining the initial scene.`;
    evidence.push(docEvidence);
  }

  // Add digital evidence (CCTV, logs)
  const digitalTemplates = templates.filter(t => t.type === 'digital');
  if (digitalTemplates.length > 0) {
    const digitalEvidence = createEvidenceFromTemplate(
      digitalTemplates[0],
      narrativeCase,
      guiltyChar?.id
    );
    digitalEvidence.location = 'Security office';
    evidence.push(digitalEvidence);
  }

  // Add evidence that clears innocent suspects
  innocentChars.slice(0, 2).forEach((innocentChar, index) => {
    const clearingTemplate = CLEARING_EVIDENCE_TEMPLATES[index % CLEARING_EVIDENCE_TEMPLATES.length];
    const clearingEvidence = createEvidenceFromTemplate(
      clearingTemplate,
      narrativeCase,
      innocentChar.id,
      innocentChar.id
    );
    clearingEvidence.description = `${clearingEvidence.visualCue}. This proves ${innocentChar.name} (${innocentChar.role}) ${innocentChar.alibi.claimed.toLowerCase()}.`;
    clearingEvidence.verifies = innocentChar.id;
    evidence.push(clearingEvidence);
  });

  // Add testimonial evidence that points to suspicious behavior
  const testimonialEvidence: EvidenceItem = {
    id: `evidence-${nanoid(8)}`,
    name: 'Witness observation',
    type: 'testimonial',
    importance: 'supporting',
    description: `A witness recalls seeing ${guiltyChar?.role || 'someone'} acting suspiciously during the crime window.`,
    location: narrativeCase.setting.location,
    discoveryMethod: 'Interviewing witnesses',
    linkedCharacterId: guiltyChar?.id,
    visualCue: 'Handwritten witness statement on lined notepad, describing suspicious behavior, time and date noted, witness signature at bottom',
    analysisResult: 'Places the suspect near the scene when they claimed to be elsewhere',
    pointsToGuilty: true,
    contradicts: guiltyChar?.id, // Contradicts the guilty character's alibi
  };
  evidence.push(testimonialEvidence);

  return evidence;
}

/**
 * Generate conclusive evidence that proves guilt
 */
function generateConclusiveEvidence(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  discoveredEvidence: EvidenceItem[]
): EvidenceItem[] {
  const evidence: EvidenceItem[] = [];
  const guiltyChar = characters.find(c => c.isGuilty);

  // Critical evidence that directly proves guilt
  const conclusive: EvidenceItem = {
    id: `evidence-${nanoid(8)}`,
    name: 'Direct proof of involvement',
    type: 'forensic',
    importance: 'critical',
    description: `Conclusive evidence linking ${guiltyChar?.name || 'the culprit'} to the crime. ${narrativeCase.culprit.mistakes[0]}.`,
    location: 'Analyzed at investigation center',
    discoveryMethod: 'Thorough analysis of all collected evidence',
    linkedCharacterId: guiltyChar?.id,
    linkedTimelineEventId: narrativeCase.timeline.find(t => t.isKeyEvent)?.id,
    requires: discoveredEvidence.filter(e => e.pointsToGuilty).map(e => e.id),
    visualCue: 'Forensic analysis report with fingerprint match, DNA results document, official laboratory letterhead, conclusive findings highlighted',
    analysisResult: `This proves ${guiltyChar?.role || 'the suspect'} committed the ${narrativeCase.crime.type}. Motive: ${narrativeCase.culprit.motive.description}`,
    pointsToGuilty: true,
  };
  evidence.push(conclusive);

  // Motive evidence
  const motiveEvidence: EvidenceItem = {
    id: `evidence-${nanoid(8)}`,
    name: 'Motive documentation',
    type: 'documentary',
    importance: 'critical',
    description: `Evidence revealing why the crime was committed: ${narrativeCase.culprit.motive.backstory}`,
    location: guiltyChar?.role ? `${guiltyChar.role}'s personal items` : 'Personal belongings',
    discoveryMethod: 'Searching personal effects with authorization',
    linkedCharacterId: guiltyChar?.id,
    visualCue: 'Personal diary or journal open on desk, handwritten emotional entries, private letters and documents, revealing personal motive',
    analysisResult: narrativeCase.culprit.motive.description,
    pointsToGuilty: true,
    unlockedByPuzzle: true,
    puzzleContext: 'Solving a puzzle reveals where this evidence was hidden',
  };
  evidence.push(motiveEvidence);

  return evidence;
}

/**
 * Create the main investigation path
 */
function createMainPath(
  initial: EvidenceItem[],
  discovered: EvidenceItem[],
  conclusive: EvidenceItem[]
): string[] {
  const path: string[] = [];

  // Start with non-misleading initial evidence
  initial
    .filter(e => e.importance !== 'misleading')
    .forEach(e => path.push(e.id));

  // Add critical discovered evidence
  discovered
    .filter(e => e.importance === 'critical' || e.pointsToGuilty)
    .forEach(e => path.push(e.id));

  // End with conclusive evidence
  conclusive.forEach(e => path.push(e.id));

  return path;
}

/**
 * Create alternative solving paths
 */
function createAlternativePaths(
  initial: EvidenceItem[],
  discovered: EvidenceItem[],
  conclusive: EvidenceItem[]
): string[][] {
  const paths: string[][] = [];

  // Path through testimonial evidence
  const testimonialPath = [
    ...initial.filter(e => e.importance !== 'misleading').map(e => e.id),
    ...discovered.filter(e => e.type === 'testimonial').map(e => e.id),
    ...conclusive.map(e => e.id),
  ];
  if (testimonialPath.length >= 3) {
    paths.push(testimonialPath);
  }

  // Path through digital evidence
  const digitalPath = [
    ...initial.filter(e => e.importance !== 'misleading').map(e => e.id),
    ...discovered.filter(e => e.type === 'digital').map(e => e.id),
    ...conclusive.map(e => e.id),
  ];
  if (digitalPath.length >= 3) {
    paths.push(digitalPath);
  }

  return paths;
}

// ============================================
// MAIN EXPORTS
// ============================================

/**
 * Main function: Generate complete evidence chain for a case
 */
export function generateEvidenceChain(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[]
): EvidenceChain {
  // Generate evidence in phases
  const initialEvidence = generateInitialEvidence(narrativeCase, characters);
  const discoveredEvidence = generateDiscoveredEvidence(narrativeCase, characters, initialEvidence);
  const conclusiveEvidence = generateConclusiveEvidence(narrativeCase, characters, discoveredEvidence);

  // Create solving paths
  const mainPath = createMainPath(initialEvidence, discoveredEvidence, conclusiveEvidence);
  const alternativePaths = createAlternativePaths(initialEvidence, discoveredEvidence, conclusiveEvidence);

  // Count evidence types
  const allEvidence = [...initialEvidence, ...discoveredEvidence, ...conclusiveEvidence];

  return {
    id: `chain-${nanoid(8)}`,
    caseId: narrativeCase.id,
    initialEvidence,
    discoveredEvidence,
    conclusiveEvidence,
    mainPath,
    alternativePaths,
    evidenceCount: allEvidence.length,
    criticalEvidenceCount: allEvidence.filter(e => e.importance === 'critical').length,
    misleadingEvidenceCount: allEvidence.filter(e => e.importance === 'misleading').length,
  };
}

/**
 * Get evidence that clears a specific character
 */
export function getClearingEvidence(
  chain: EvidenceChain,
  characterId: string
): EvidenceItem[] {
  const allEvidence = [
    ...chain.initialEvidence,
    ...chain.discoveredEvidence,
    ...chain.conclusiveEvidence,
  ];
  return allEvidence.filter(e => e.clearsInnocent === characterId);
}

/**
 * Get evidence that points to the culprit
 */
export function getGuiltyEvidence(chain: EvidenceChain): EvidenceItem[] {
  const allEvidence = [
    ...chain.initialEvidence,
    ...chain.discoveredEvidence,
    ...chain.conclusiveEvidence,
  ];
  return allEvidence.filter(e => e.pointsToGuilty);
}

/**
 * Get evidence by type
 */
export function getEvidenceByType(
  chain: EvidenceChain,
  type: EvidenceType
): EvidenceItem[] {
  const allEvidence = [
    ...chain.initialEvidence,
    ...chain.discoveredEvidence,
    ...chain.conclusiveEvidence,
  ];
  return allEvidence.filter(e => e.type === type);
}

/**
 * Get all evidence as flat array
 */
export function getAllEvidence(chain: EvidenceChain): EvidenceItem[] {
  return [
    ...chain.initialEvidence,
    ...chain.discoveredEvidence,
    ...chain.conclusiveEvidence,
  ];
}

/**
 * Get evidence that contradicts a character's statement
 */
export function getContradictingEvidence(
  chain: EvidenceChain,
  characterId: string
): EvidenceItem[] {
  const allEvidence = getAllEvidence(chain);
  return allEvidence.filter(e => e.contradicts === characterId);
}

/**
 * Check if enough evidence exists to solve the case
 */
export function canSolveCase(chain: EvidenceChain, foundEvidenceIds: string[]): boolean {
  // Need at least one conclusive evidence piece
  const hasConclusive = chain.conclusiveEvidence.some(e =>
    foundEvidenceIds.includes(e.id)
  );

  // Need at least 2 supporting evidence
  const supportingFound = [
    ...chain.initialEvidence,
    ...chain.discoveredEvidence,
  ].filter(e =>
    foundEvidenceIds.includes(e.id) &&
    e.pointsToGuilty &&
    e.importance !== 'misleading'
  ).length;

  return hasConclusive && supportingFound >= 2;
}

/**
 * Get the next recommended evidence to find
 */
export function getNextRecommendedEvidence(
  chain: EvidenceChain,
  foundEvidenceIds: string[]
): EvidenceItem | null {
  // Follow the main path
  for (const evidenceId of chain.mainPath) {
    if (!foundEvidenceIds.includes(evidenceId)) {
      return getAllEvidence(chain).find(e => e.id === evidenceId) || null;
    }
  }
  return null;
}
