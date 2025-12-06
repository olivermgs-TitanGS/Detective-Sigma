import { nanoid } from 'nanoid';
import {
  GenerationRequest,
  GeneratedCase,
  Suspect,
  Clue,
  Puzzle,
  Scene,
  PuzzleComplexity,
} from './types';
import { generateUniquePuzzles } from './puzzle-generator';

// NEW NARRATIVE ENGINE IMPORTS
import {
  generateNarrativeCase as generateNarrativeCaseCore,
  NarrativeCase,
  STORY_SCENARIOS,
  selectScenario,
} from './narrative-engine';
import {
  generateCharacterWeb,
  SuspectCharacter,
} from './character-web';
import {
  generateEvidenceChain,
  EvidenceChain,
  getAllEvidence,
} from './evidence-chain';
import {
  mapEvidenceToScenes,
  redistributeEvidence,
  SceneInfo,
  SceneType,
} from './scene-evidence-mapper';
import {
  generateStoryPuzzleSet,
  StoryPuzzle,
  StoryPuzzleSet,
  formatStoryPuzzlePresentation,
} from './story-puzzles';
import {
  generateEvidenceBoundPuzzles,
  EvidenceBoundPuzzle,
  EvidenceBoundPuzzleSet,
} from './evidence-bound-puzzles';

// ============================================
// HELPER FUNCTIONS FOR IMAGE GENERATION
// ============================================

/**
 * Infer ethnicity from character name for accurate portrait generation
 */
function inferEthnicityFromCharacter(name: string): 'Chinese' | 'Malay' | 'Indian' | 'Eurasian' {
  const chinesePatterns = /^(Li|Chen|Wong|Tan|Lim|Lee|Ng|Goh|Ong|Koh|Chua|Zhang|Wang|Liu|Yang|Huang|Mei|Wei|Jun|Hui|Xin|Ai|Siew|Bee|Fen|Ping|Xiu|Hock|Boon|Chee|Seng|Huat)/i;
  const malayPatterns = /^(Ahmad|Muhammad|Farid|Ismail|Rashid|Kamal|Hafiz|Siti|Aminah|Fatimah|Zainab|Noraini|Aishah|bin|binti)/i;
  const indianPatterns = /^(Rajesh|Suresh|Vikram|Arjun|Ravi|Deepak|Priya|Lakshmi|Anita|Kavitha|Meera|Sunitha|Kumar|Menon|Pillai|Nair|Sharma|Devi|Rani)/i;
  const eurasianPatterns = /^(David|Michael|James|John|Peter|Sarah|Emma|Rachel|Jessica|Amanda|Pereira|Santos|Oliveiro|Rodrigues|Monteiro)/i;

  if (chinesePatterns.test(name)) return 'Chinese';
  if (malayPatterns.test(name)) return 'Malay';
  if (indianPatterns.test(name)) return 'Indian';
  if (eurasianPatterns.test(name)) return 'Eurasian';
  return 'Chinese'; // Default for Singapore context
}

/**
 * Infer gender from character name for accurate portrait generation
 */
function inferGenderFromCharacter(name: string): 'male' | 'female' {
  // Female name patterns
  const femalePatterns = /^(Zhang Mei|Wong Fang|Tan Hui|Lee Mei|Lim Ai|Ng Siew|Ong Bee|Koh Mei|Teo Li|Chen Xiu|Siti|Aminah|Fatimah|Zainab|Noraini|Aishah|Priya|Lakshmi|Anita|Kavitha|Meera|Sunitha|Sarah|Emma|Rachel|Jessica|Amanda|Mei|Fang|Hui|Xin|Ai|Siew|Bee|Fen|Ping|Xiu|Ying|Ling|Hua|Lan|Hoon|Frances|Dorothy|Eleanor|Gloria|Helen|Irene|Julia|Katherine|Margaret|Nancy|Olivia|Patricia|Rose|Susan|Victoria|Caroline)/i;

  // Male name patterns
  const malePatterns = /^(Li Wei|Chen Jun|Wong Ming|Tan Ah|Lee Hock|Lim Boon|Ng Chee|Ong Wei|Koh Seng|Teo Huat|Ahmad|Farid|Ismail|Rashid|Kamal|Hafiz|Rajesh|Suresh|Vikram|Arjun|Ravi|Deepak|David|Michael|James|John|Peter|Wei|Jun|Ming|Hock|Boon|Chee|Seng|Huat|Kow|bin|Francis|Gabriel|Sebastian|Dominic|Vincent|Patrick|Gerard|Bernard|Lawrence|Raymond|Kenneth|Robert|William|Charles|Edward|George|Henry|Thomas)/i;

  if (femalePatterns.test(name)) return 'female';
  if (malePatterns.test(name)) return 'male';

  // Check for common gendered words
  if (name.includes('binti')) return 'female';
  if (name.includes('bin')) return 'male';

  return 'male'; // Default
}

/**
 * Infer ethnicity from character name
 */
function inferEthnicityFromName(name: string): 'Chinese' | 'Malay' | 'Indian' | 'Eurasian' {
  // Chinese surname patterns
  const chinesePatterns = /^(Tan|Lee|Lim|Ng|Ong|Wong|Koh|Teo|Chen|Zhang|Li|Wang|Liu|Yang|Huang|Wu|Zhou|Xu|Sun|Ma|Goh|Chua|Chan|Ho|Low|Yeo|Tay|Sim|Foo|Yap|Chong|Choo|Seow|Quek|Chia|Poh|Kok|Soh|Lau|Leong|Ang|Wee)/i;

  // Malay name patterns
  const malayPatterns = /^(Ahmad|Muhammad|Mohd|Abdul|Ismail|Ali|Hassan|Hussein|Omar|Yusof|Rashid|Kamal|Hafiz|Siti|Aminah|Fatimah|Zainab|Noraini|Aishah|Nurul|Nur|Wan|Nik|Tengku|Raja|Aziz|Ibrahim|bin|binti)/i;

  // Indian name patterns
  const indianPatterns = /^(Rajesh|Suresh|Vikram|Arjun|Ravi|Deepak|Ganesh|Krishna|Muthu|Kumar|Priya|Lakshmi|Anita|Kavitha|Meera|Sunitha|Devi|Nair|Pillai|Menon|Iyer|Rao|Sharma|Singh|Patel|Reddy|Naidu|Gopal|Venkat|Srinivas)/i;

  // Eurasian/Western name patterns
  const eurasianPatterns = /^(David|Michael|James|John|Peter|Sarah|Emma|Rachel|Jessica|Amanda|Daniel|Matthew|Andrew|Christopher|William|Robert|Thomas|Charles|Francis|Frances|Gabriel|Sebastian|Patrick|George|Henry|Edward|Caroline|Dorothy|Eleanor|Gloria|Helen|Margaret|Patricia|Victoria|Henderson|Hendricks|Smith|Brown|Williams|Johnson|Davis|Wilson|Moore|Taylor|Anderson)/i;

  if (chinesePatterns.test(name)) return 'Chinese';
  if (malayPatterns.test(name)) return 'Malay';
  if (indianPatterns.test(name)) return 'Indian';
  if (eurasianPatterns.test(name)) return 'Eurasian';

  // Check for Malay patterns anywhere in name
  if (/bin|binti/i.test(name)) return 'Malay';

  return 'Eurasian'; // Default for Western names
}

// ============================================
// AGE-OCCUPATION COMPATIBILITY SYSTEM
// ============================================

/**
 * Age categories with realistic age ranges
 */
type AgeCategory = 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';

interface AgeRange {
  category: AgeCategory;
  minAge: number;
  maxAge: number;
  displayRange: string;
}

const AGE_RANGES: Record<AgeCategory, AgeRange> = {
  child: { category: 'child', minAge: 7, maxAge: 12, displayRange: '7-12 years old' },
  teen: { category: 'teen', minAge: 13, maxAge: 17, displayRange: '13-17 years old' },
  young_adult: { category: 'young_adult', minAge: 18, maxAge: 29, displayRange: '18-29 years old' },
  adult: { category: 'adult', minAge: 30, maxAge: 45, displayRange: '30-45 years old' },
  middle_aged: { category: 'middle_aged', minAge: 46, maxAge: 60, displayRange: '46-60 years old' },
  senior: { category: 'senior', minAge: 61, maxAge: 80, displayRange: '61-80 years old' },
};

/**
 * Occupation definitions with valid age ranges
 * Each occupation specifies which age categories are valid for it
 */
interface OccupationAgeConstraint {
  role: string;
  validAges: AgeCategory[];
  preferredAges: AgeCategory[]; // More likely ages for this role
}

const OCCUPATION_AGE_CONSTRAINTS: OccupationAgeConstraint[] = [
  // STUDENT ROLES (children and teens only)
  { role: 'Primary Student', validAges: ['child'], preferredAges: ['child'] },
  { role: 'Secondary Student', validAges: ['teen'], preferredAges: ['teen'] },
  { role: 'Student Helper', validAges: ['teen', 'young_adult'], preferredAges: ['teen'] },
  { role: 'Student Researcher', validAges: ['teen', 'young_adult'], preferredAges: ['young_adult'] },
  { role: 'Team Captain', validAges: ['teen', 'young_adult'], preferredAges: ['teen'] },
  { role: 'Student Witness', validAges: ['child', 'teen'], preferredAges: ['teen'] },

  // INTERN/TRAINEE ROLES (young adults primarily)
  { role: 'Intern', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'Trainee', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'Apprentice', validAges: ['teen', 'young_adult'], preferredAges: ['young_adult'] },

  // JUNIOR STAFF ROLES (young adults and adults)
  { role: 'Junior Staff', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Shop Assistant', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Library Assistant', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Lab Assistant', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Canteen Staff', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Cashier', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Waiter', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Receptionist', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult', 'adult'] },

  // GENERAL WORKER ROLES (adults primarily, some flexibility)
  { role: 'Cleaner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Security Guard', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Delivery Person', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Driver', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Maintenance Worker', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Construction Worker', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Factory Worker', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },

  // SKILLED WORKER ROLES (adults and middle-aged)
  { role: 'Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'IT Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['young_adult', 'adult'] },
  { role: 'Lab Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Equipment Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Electrician', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Plumber', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },

  // PROFESSIONAL ROLES (adults, middle-aged, some senior)
  { role: 'Teacher', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Teacher on Duty', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Science Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'PE Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Librarian', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Sports Coach', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Referee', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Safety Officer', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Nurse', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Accountant', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Visiting Scientist', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },

  // BUSINESS OWNER / VENDOR ROLES (adults, middle-aged, seniors)
  { role: 'Stall Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Market Vendor', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Canteen Vendor', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Shop Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Food Stall Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Hawker', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },

  // MANAGEMENT ROLES (middle-aged and senior primarily)
  { role: 'Manager', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Canteen Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['middle_aged'] },
  { role: 'Market Manager', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Office Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Department Head', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Sports Secretary', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },

  // SENIOR/EXECUTIVE ROLES (middle-aged and senior only)
  { role: 'Principal', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Vice Principal', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Director', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'CEO', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Chairman', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Professor', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Senior Manager', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },

  // CUSTOMER/VISITOR ROLES (flexible ages)
  { role: 'Regular Customer', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Regular Patron', validAges: ['teen', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Visitor', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Parent Volunteer', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Bystander', validAges: ['teen', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Witness', validAges: ['teen', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },

  // RETIREE ROLES (senior only)
  { role: 'Retiree', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Retired Teacher', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Elderly Resident', validAges: ['senior'], preferredAges: ['senior'] },
];

/**
 * Get age constraint for a role
 * Returns default constraints if role not found
 */
function getAgeConstraintForRole(role: string): OccupationAgeConstraint {
  const roleLower = role.toLowerCase();

  // Try exact match first
  const exactMatch = OCCUPATION_AGE_CONSTRAINTS.find(
    c => c.role.toLowerCase() === roleLower
  );
  if (exactMatch) return exactMatch;

  // Try partial match
  const partialMatch = OCCUPATION_AGE_CONSTRAINTS.find(
    c => roleLower.includes(c.role.toLowerCase()) || c.role.toLowerCase().includes(roleLower)
  );
  if (partialMatch) return partialMatch;

  // Check for keywords in role name
  if (/student|pupil|schoolchild/i.test(role)) {
    return { role, validAges: ['teen'], preferredAges: ['teen'] };
  }
  if (/child|kid|boy|girl/i.test(role) && !/childcare|children's/i.test(role)) {
    return { role, validAges: ['child', 'teen'], preferredAges: ['child'] };
  }
  if (/intern|trainee|apprentice/i.test(role)) {
    return { role, validAges: ['young_adult'], preferredAges: ['young_adult'] };
  }
  if (/junior|assistant/i.test(role)) {
    return { role, validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] };
  }
  if (/senior|head|director|chief|ceo|chairman|principal/i.test(role)) {
    return { role, validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] };
  }
  if (/manager|supervisor/i.test(role)) {
    return { role, validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] };
  }
  if (/retiree|retired|elderly|pensioner/i.test(role)) {
    return { role, validAges: ['senior'], preferredAges: ['senior'] };
  }

  // Default: adult roles (most common)
  return {
    role,
    validAges: ['young_adult', 'adult', 'middle_aged'],
    preferredAges: ['adult']
  };
}

/**
 * Get a compatible age for a given role
 * Uses preferred ages more often, but can use any valid age
 */
function getCompatibleAgeForRole(role: string): {
  ageCategory: AgeCategory;
  ageGroup: 'young' | 'middle' | 'senior';
  specificAge: number;
  displayAge: string;
} {
  const constraint = getAgeConstraintForRole(role);

  // 70% chance to use preferred age, 30% chance to use any valid age
  const usePreferred = Math.random() < 0.7;
  const agePool = usePreferred ? constraint.preferredAges : constraint.validAges;

  // Select random age category from pool
  const ageCategory = agePool[Math.floor(Math.random() * agePool.length)];
  const ageRange = AGE_RANGES[ageCategory];

  // Generate specific age within range
  const specificAge = ageRange.minAge + Math.floor(Math.random() * (ageRange.maxAge - ageRange.minAge + 1));

  // Map to simple age group for backwards compatibility
  let ageGroup: 'young' | 'middle' | 'senior';
  if (ageCategory === 'child' || ageCategory === 'teen' || ageCategory === 'young_adult') {
    ageGroup = 'young';
  } else if (ageCategory === 'adult' || ageCategory === 'middle_aged') {
    ageGroup = 'middle';
  } else {
    ageGroup = 'senior';
  }

  // Generate display age
  let displayAge: string;
  if (ageCategory === 'child') {
    displayAge = `${specificAge} year old child`;
  } else if (ageCategory === 'teen') {
    displayAge = `${specificAge} year old teenager`;
  } else if (specificAge < 30) {
    displayAge = `young adult in their ${Math.floor(specificAge / 10) * 10}s`;
  } else if (specificAge < 60) {
    displayAge = `${Math.floor(specificAge / 10) * 10}s`;
  } else {
    displayAge = `elderly, ${Math.floor(specificAge / 10) * 10}s`;
  }

  return { ageCategory, ageGroup, specificAge, displayAge };
}

/**
 * Filter roles to only include those valid for a specific age
 */
function filterRolesForAge(roles: string[], ageCategory: AgeCategory): string[] {
  return roles.filter(role => {
    const constraint = getAgeConstraintForRole(role);
    return constraint.validAges.includes(ageCategory);
  });
}

/**
 * Validate that a role-age combination is realistic
 */
function isValidRoleAgeCombination(role: string, ageCategory: AgeCategory): boolean {
  const constraint = getAgeConstraintForRole(role);
  return constraint.validAges.includes(ageCategory);
}

// Legacy function for backwards compatibility
function getAgeGroupForRole(role: string): 'young' | 'middle' | 'senior' {
  const { ageGroup } = getCompatibleAgeForRole(role);
  return ageGroup;
}

// Story-specific role mappings for narrative coherence
// Each story template ID maps to roles that make sense in that context
const STORY_SPECIFIC_ROLES: Record<string, string[]> = {
  'canteen-mystery': [
    'Canteen Manager', 'Canteen Vendor', 'Canteen Staff', 'Student Helper',
    'Cleaner', 'Security Guard', 'Teacher on Duty', 'Delivery Person'
  ],
  'library-case': [
    'Librarian', 'Library Assistant', 'Student Helper', 'Teacher',
    'IT Technician', 'Cleaner', 'Security Guard', 'Regular Patron'
  ],
  'science-lab': [
    'Science Teacher', 'Lab Assistant', 'Lab Technician', 'Student Researcher',
    'Department Head', 'Cleaner', 'Safety Officer', 'Visiting Scientist'
  ],
  'sports-event': [
    'Sports Coach', 'PE Teacher', 'Team Captain', 'Equipment Manager',
    'Referee', 'Security Guard', 'Sports Secretary', 'Parent Volunteer'
  ],
  'market-mystery': [
    'Stall Owner', 'Market Vendor', 'Shop Assistant', 'Delivery Person',
    'Cleaner', 'Security Guard', 'Market Manager', 'Regular Customer'
  ],
};
import {
  generatePuzzleForTopic,
  generatePuzzlesForTopics,
  getAvailablePuzzleTopics,
} from './curriculum-puzzles';
import {
  selectTopicsForCase,
  TopicProgress,
  getRecommendedTopics,
} from './learning-tracker';
import { GradeLevel, Subject, getTopicsByGrade, getTopicsBySubject } from './syllabus';
import {
  generateContextualCaseImages,
  CaseImageRequests,
  CaseContext,
} from './image-generator';
import {
  generateCaseClues,
  EnhancedClue,
} from './evidence-generator';

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

function narrativeToGeneratedCase(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  evidenceChain: EvidenceChain,
  puzzleSet: StoryPuzzleSet,
  request: GenerationRequest
): GeneratedCase {
  const caseId = narrativeCase.id;

  // Convert SuspectCharacter to Suspect
  const suspects: Suspect[] = characters.map(char => ({
    id: char.id,
    name: char.name,
    role: char.role,
    alibi: char.alibi.claimed,
    personality: char.background.personality,
    isGuilty: char.isGuilty,
    motive: char.isGuilty ? narrativeCase.culprit.motive.description : undefined,
    // Enhanced fields from character web
    dialogueTree: char.dialogue.map(d => ({
      id: d.id,
      question: d.question,
      answer: d.answer,
      emotion: d.emotion,
      revealsInfo: d.revealsInfo,
    })),
    relationships: char.relationships.map(r => ({
      targetId: r.targetId,
      targetName: r.targetName,
      type: r.type,
      description: r.description,
    })),
  }));

  // Convert evidence chain to clues (note: positions will be added after scene mapping)
  const allEvidenceItems = getAllEvidence(evidenceChain);
  const cluesWithoutPositions: Clue[] = allEvidenceItems.map(evidence => ({
    id: evidence.id,
    title: evidence.name,
    description: evidence.description,
    type: evidence.type === 'physical' ? 'physical' :
          evidence.type === 'documentary' ? 'document' :
          evidence.type === 'testimonial' ? 'testimony' : 'physical',
    relevance: evidence.importance === 'critical' ? 'critical' :
               evidence.importance === 'misleading' ? 'red-herring' : 'supporting',
    linkedTo: evidence.linkedCharacterId ? [evidence.linkedCharacterId] : [],
    // Enhanced fields
    visualCue: evidence.visualCue,
    analysisResult: evidence.analysisResult,
    discoveryMethod: evidence.discoveryMethod,
    discoveryLocation: evidence.location, // Use the evidence location for semantic placement
  }));

  // Convert story puzzles to puzzles with narrative context and MCQ options
  const puzzles: Puzzle[] = puzzleSet.puzzles.map(puzzle => ({
    id: puzzle.id,
    title: puzzle.title,
    type: puzzle.type,
    question: puzzle.question,
    answer: puzzle.answer,
    options: (puzzle as unknown as { options?: string[] }).options, // MCQ options from evidence-bound puzzles
    hint: puzzle.hint,
    points: puzzle.points,
    difficulty: puzzle.difficulty,
    complexity: puzzle.complexity,
    estimatedMinutes: puzzle.estimatedMinutes,
    requiresMultipleSteps: puzzle.requiresMultipleSteps,
    // Enhanced narrative fields
    narrativeContext: puzzle.narrativeContext,
    investigationPhase: puzzle.investigationPhase,
    revelation: puzzle.revelation,
    relatedCharacterName: puzzle.relatedCharacterName,
  }));

  // Generate immersive, story-connected scenes with distinct scene types
  const crimeTimeWindow = narrativeCase.crime.crimeWindow;
  const guiltyChar = characters.find(c => c.isGuilty);

  // Create 5 scenes with distinct scene types for semantic evidence placement
  const scenes: Scene[] = [
    // Scene 1: Primary Crime Scene - Where it all happened
    {
      id: `scene-${nanoid(6)}`,
      name: narrativeCase.setting.location,
      description: `${narrativeCase.setting.description} The ${narrativeCase.crime.type.replace('_', ' ')} occurred here between ${crimeTimeWindow.start} and ${crimeTimeWindow.end}. ${narrativeCase.setting.dayContext}. Signs of disturbance are visible.`,
      interactiveElements: [
        `Area where ${narrativeCase.crime.target} was last seen`,
        'Footprint marks on the floor',
        'Nearby furniture that may have been moved',
        'Window or door that could have been entry point',
      ],
      cluesAvailable: [], // Will be populated by semantic mapping
      locationType: narrativeCase.setting.locationType,
      sceneType: 'primary' as SceneType,
      ambiance: narrativeCase.setting.timeOfDay === 'morning' ? 'morning' :
                narrativeCase.setting.timeOfDay === 'afternoon' ? 'day' :
                narrativeCase.setting.timeOfDay === 'evening' ? 'evening' : 'day',
      mood: 'mysterious',
    },
    // Scene 2: Security Office - CCTV and access records
    {
      id: `scene-${nanoid(6)}`,
      name: 'Security Office',
      description: `The security monitoring station with CCTV screens and access logs. Digital evidence from the time of the incident (${crimeTimeWindow.start} - ${crimeTimeWindow.end}) can be reviewed here.`,
      interactiveElements: [
        'CCTV monitoring screens',
        'Access card log computer',
        'Security desk with records',
        'Visitor sign-in logbook',
      ],
      cluesAvailable: [], // Will be populated by semantic mapping
      locationType: narrativeCase.setting.locationType,
      sceneType: 'security' as SceneType,
      ambiance: 'day',
      mood: 'tense',
    },
    // Scene 3: Work Area - Personal belongings and workspace
    {
      id: `scene-${nanoid(6)}`,
      name: `${guiltyChar?.role || 'Staff'} Work Area`,
      description: `The workspace connected to the investigation. Personal belongings and work materials provide clues about who had access during the crime window. Look for anything out of place.`,
      interactiveElements: [
        'Work desk with personal items',
        'Personal locker area',
        'Schedule board showing timings',
        'Notice board with announcements',
      ],
      cluesAvailable: [], // Will be populated by semantic mapping
      locationType: narrativeCase.setting.locationType,
      sceneType: 'work_area' as SceneType,
      ambiance: 'day',
      mood: 'tense',
    },
    // Scene 4: Investigation Room - For analysis and interviews
    {
      id: `scene-${nanoid(6)}`,
      name: 'Investigation Room',
      description: `A dedicated space for analyzing collected evidence and interviewing suspects. The timeline board shows events between ${crimeTimeWindow.start} and ${crimeTimeWindow.end}. Suspect profiles are pinned to the wall.`,
      interactiveElements: [
        'Evidence analysis table',
        'Timeline reconstruction board',
        'Suspect interview notes',
        'Forensic analysis lab bench',
      ],
      cluesAvailable: [], // Will be populated by semantic mapping
      locationType: 'school',
      sceneType: 'investigation' as SceneType,
      ambiance: 'day',
      mood: 'calm',
    },
    // Scene 5: Resolution Chamber - Final evidence and confrontation
    {
      id: `scene-${nanoid(6)}`,
      name: 'Resolution Chamber',
      description: `The final piece of the puzzle. Conclusive evidence points to the culprit. ${narrativeCase.culprit.mistakes[0] || 'A critical mistake was made.'}`,
      interactiveElements: [
        'Final evidence display',
        'Accusation podium',
        'Truth revelation board',
        'Case closure documentation',
      ],
      cluesAvailable: [], // Will be populated by semantic mapping
      locationType: narrativeCase.setting.locationType,
      sceneType: 'resolution' as SceneType,
      ambiance: 'evening',
      mood: 'urgent',
    },
  ];

  // Create scene info for evidence mapper
  const sceneInfoList: SceneInfo[] = scenes.map(s => ({
    id: s.id,
    name: s.name,
    sceneType: s.sceneType || 'primary',
    locationType: s.locationType,
  }));

  // Map evidence to scenes based on semantic location
  let evidencePlacementMap = mapEvidenceToScenes(allEvidenceItems, sceneInfoList);

  // Redistribute to ensure all scenes have some evidence
  evidencePlacementMap = redistributeEvidence(allEvidenceItems, sceneInfoList, evidencePlacementMap);

  // Populate cluesAvailable for each scene based on semantic mapping
  scenes.forEach(scene => {
    scene.cluesAvailable = [];
    evidencePlacementMap.forEach((placement, evidenceId) => {
      if (placement.sceneId === scene.id) {
        scene.cluesAvailable.push(evidenceId);
      }
    });
  });

  // Add position data to clues from the evidence placement map
  const clues: Clue[] = cluesWithoutPositions.map(clue => {
    const placement = evidencePlacementMap.get(clue.id);
    return {
      ...clue,
      positionX: placement?.positionX,
      positionY: placement?.positionY,
      requiredPuzzleId: placement?.requiredPuzzleId,
    };
  });

  // Calculate estimated time
  const estimatedMinutes = puzzleSet.estimatedTotalMinutes + 10; // +10 for reading/exploration

  return {
    caseId,
    title: narrativeCase.title,
    briefing: `${narrativeCase.narrativeHook}\n\n${narrativeCase.setting.dayContext} at ${narrativeCase.setting.location}. ${narrativeCase.crime.method}.\n\nYour task: Interview suspects, gather evidence, solve puzzles, and identify the culprit.`,
    metadata: {
      difficulty: narrativeCase.difficulty,
      gradeLevel: request.gradeLevel,
      subjectFocus: request.subject,
      estimatedMinutes,
      puzzleComplexity: request.puzzleComplexity || 'STANDARD',
    },
    story: {
      setting: narrativeCase.setting.description,
      crime: `${narrativeCase.crime.type.replace('_', ' ')}: ${narrativeCase.crime.method}`,
      resolution: narrativeCase.resolution,
      // Enhanced narrative fields
      timeline: narrativeCase.timeline,
      crimeWindow: narrativeCase.crime.crimeWindow,
      culpritProfile: {
        motive: narrativeCase.culprit.motive,
        method: narrativeCase.culprit.method,
        mistakes: narrativeCase.culprit.mistakes,
      },
    },
    suspects,
    clues,
    puzzles,
    scenes,
    // Evidence chain for game logic
    evidenceChain: {
      mainPath: evidenceChain.mainPath,
      criticalCount: evidenceChain.criticalEvidenceCount,
    },
    // Puzzle phases for progressive revelation
    puzzlePhases: {
      initial: puzzleSet.puzzlesByPhase.initial.map(p => p.id),
      investigation: puzzleSet.puzzlesByPhase.investigation.map(p => p.id),
      conclusion: puzzleSet.puzzlesByPhase.conclusion.map(p => p.id),
    },
    imageRequests: undefined as any, // Will be generated separately if needed
  };
}

/**
 * Generate a fully narrative-driven case
 * Uses the new narrative engine for cohesive storytelling
 */
export async function generateNarrativeDrivenCase(
  request: GenerationRequest
): Promise<GeneratedCase> {
  const { subject, difficulty, gradeLevel } = request;
  const puzzleComplexity = (request.puzzleComplexity || 'STANDARD') as PuzzleComplexity;

  // Determine puzzle count based on difficulty
  const puzzleCounts: Record<string, number> = {
    ROOKIE: 4,
    INSPECTOR: 6,
    DETECTIVE: 8,
    CHIEF: 10,
  };
  const puzzleCount = request.constraints?.minPuzzles || puzzleCounts[difficulty] || 6;

  // 1. Generate core narrative case
  const narrativeCase = generateNarrativeCaseCore(subject, difficulty);

  // 2. Find the matching scenario to get suspect roles
  const scenario = STORY_SCENARIOS.find(s => s.id === narrativeCase.title.toLowerCase().replace(/ /g, '-'))
    || selectScenario(subject, difficulty);

  // 3. Generate character web with relationships
  const characters = generateCharacterWeb(narrativeCase, scenario.suspectRoles);

  // 4. Generate evidence chain
  const evidenceChain = generateEvidenceChain(narrativeCase, characters);

  // 5. Generate EVIDENCE-BOUND puzzles that directly test evidence and suspect statements
  // These puzzles are interconnected with the story - they verify alibis, test evidence, and reveal contradictions
  const evidenceBoundPuzzleSet = generateEvidenceBoundPuzzles(
    narrativeCase,
    characters,
    evidenceChain,
    subject,
    puzzleCount,
    puzzleComplexity
  );

  // Also generate some story puzzles for variety (will be merged)
  const storyPuzzleSet = generateStoryPuzzleSet(
    narrativeCase,
    characters,
    evidenceChain,
    subject,
    Math.max(1, puzzleCount - evidenceBoundPuzzleSet.puzzles.length)
  );

  // Merge puzzle sets - prioritize evidence-bound puzzles
  const mergedPuzzleSet: StoryPuzzleSet = {
    caseId: narrativeCase.id,
    puzzles: [
      // Convert evidence-bound puzzles to StoryPuzzle format
      ...evidenceBoundPuzzleSet.puzzles.map(p => ({
        ...p,
        locationInStory: narrativeCase.setting.location,
        narrativeContext: p.narrativeIntro,
        revelation: {
          type: 'evidence' as const,
          description: p.proves.truth,
          storyText: p.successNarrative,
          importance: p.proves.isContradiction ? 'major' as const : 'moderate' as const,
        },
      })),
      // Add remaining story puzzles if needed
      ...storyPuzzleSet.puzzles.slice(0, Math.max(0, puzzleCount - evidenceBoundPuzzleSet.puzzles.length)),
    ],
    totalPoints: evidenceBoundPuzzleSet.totalPoints + storyPuzzleSet.totalPoints,
    estimatedTotalMinutes: evidenceBoundPuzzleSet.estimatedMinutes + storyPuzzleSet.estimatedTotalMinutes,
    puzzlesByPhase: {
      initial: [
        ...evidenceBoundPuzzleSet.puzzlesByPhase.initial.map(p => ({ ...p, locationInStory: narrativeCase.setting.location, narrativeContext: p.narrativeIntro, revelation: { type: 'evidence' as const, description: p.proves.truth, storyText: p.successNarrative, importance: p.proves.isContradiction ? 'major' as const : 'moderate' as const } })),
        ...storyPuzzleSet.puzzlesByPhase.initial,
      ],
      investigation: [
        ...evidenceBoundPuzzleSet.puzzlesByPhase.investigation.map(p => ({ ...p, locationInStory: narrativeCase.setting.location, narrativeContext: p.narrativeIntro, revelation: { type: 'evidence' as const, description: p.proves.truth, storyText: p.successNarrative, importance: p.proves.isContradiction ? 'major' as const : 'moderate' as const } })),
        ...storyPuzzleSet.puzzlesByPhase.investigation,
      ],
      conclusion: [
        ...evidenceBoundPuzzleSet.puzzlesByPhase.conclusion.map(p => ({ ...p, locationInStory: narrativeCase.setting.location, narrativeContext: p.narrativeIntro, revelation: { type: 'evidence' as const, description: p.proves.truth, storyText: p.successNarrative, importance: p.proves.isContradiction ? 'major' as const : 'moderate' as const } })),
        ...storyPuzzleSet.puzzlesByPhase.conclusion,
      ],
    },
  };

  // Use merged puzzle set for case generation
  const puzzleSet = mergedPuzzleSet;

  // 6. Convert to GeneratedCase format
  const generatedCase = narrativeToGeneratedCase(
    narrativeCase,
    characters,
    evidenceChain,
    puzzleSet,
    request
  );

  // 7. Generate image requests with FULL narrative context
  // Use the rich data from narrative engine for precise, story-accurate images
  const caseContext = {
    title: generatedCase.title,
    subject: request.subject,
    difficulty: request.difficulty,
    gradeLevel: request.gradeLevel,
    story: {
      setting: generatedCase.story.setting,
      crime: generatedCase.story.crime,
      resolution: generatedCase.story.resolution,
      theme: narrativeCase.setting.dayContext,
      location: narrativeCase.setting.location,
      locationType: narrativeCase.setting.locationType,
    },
    timeOfDay: narrativeCase.setting.timeOfDay,
    atmosphere: 'mysterious' as const,
  };

  // Build RICH clue data with visual cues from evidence chain
  const allEvidenceItems = getAllEvidence(evidenceChain);
  const richClueData = allEvidenceItems.map(evidence => ({
    title: evidence.name,
    // Use visualCue + analysisResult for detailed image prompts
    description: `${evidence.visualCue}. ${evidence.analysisResult}`,
    type: evidence.type === 'physical' ? 'physical' as const :
          evidence.type === 'documentary' ? 'document' as const :
          evidence.type === 'testimonial' ? 'testimony' as const : 'digital' as const,
    relevance: evidence.importance === 'critical' ? 'critical' as const :
               evidence.importance === 'misleading' ? 'red-herring' as const : 'supporting' as const,
    discoveryLocation: evidence.location,
    // Pass specific visual details for image generation
    examinationDetails: [
      evidence.discoveryMethod,
      evidence.pointsToGuilty ? 'Evidence pointing to culprit' : 'General evidence',
    ].filter(Boolean),
  }));

  // Build RICH suspect data with demeanor from dialogue emotions
  const richSuspectData = characters.map(char => {
    // Get the primary emotion from their dialogue (alibi response is most telling)
    const alibiDialogue = char.dialogue.find(d => d.id === 'alibi');
    const demeanorEmotion = alibiDialogue?.emotion || 'calm';

    // Map dialogue emotion to expression for image
    const emotionToExpression: Record<string, 'neutral' | 'nervous' | 'confident' | 'worried' | 'suspicious'> = {
      calm: 'neutral',
      nervous: 'nervous',
      defensive: 'suspicious',
      helpful: 'confident',
      evasive: 'worried',
      angry: 'suspicious',
    };

    return {
      name: char.name,
      role: char.role,
      alibi: char.alibi.claimed,
      personality: char.background.personality,
      isGuilty: char.isGuilty,
      motive: char.isGuilty ? narrativeCase.culprit.motive.description : undefined,
      // Use character web data for accurate ethnicity
      ethnicity: inferEthnicityFromCharacter(char.name),
      gender: inferGenderFromCharacter(char.name),
      ageGroup: char.background.yearsAtLocation > 5 ? 'middle' as const : 'young' as const,
      // Pass the demeanor for accurate expression in portrait
      expression: emotionToExpression[demeanorEmotion] || 'neutral',
    };
  });

  // Build scene data with crime context
  const richSceneData = [
    {
      name: narrativeCase.setting.location,
      description: `${narrativeCase.setting.description}. ${narrativeCase.setting.dayContext}. Crime scene where ${narrativeCase.crime.type.replace('_', ' ')} occurred.`,
      isCrimeScene: true,
      crimeType: narrativeCase.crime.type,
    },
    {
      name: 'Investigation Room',
      description: 'A dedicated space for analyzing evidence and interviewing suspects. Evidence board with photos and notes, suspect profiles displayed.',
      isCrimeScene: false,
    },
  ];

  const imageRequests = generateContextualCaseImages(
    caseContext,
    richSuspectData,
    richClueData,
    richSceneData
  );

  generatedCase.imageRequests = {
    cover: {
      id: imageRequests.cover.id,
      type: 'cover',
      prompt: imageRequests.cover.prompt,
      negativePrompt: imageRequests.cover.negativePrompt,
      width: imageRequests.cover.width,
      height: imageRequests.cover.height,
      settings: imageRequests.cover.settings,
      metadata: imageRequests.cover.metadata,
      status: 'pending',
    },
    scenes: imageRequests.scenes.map(s => ({
      id: s.id,
      type: 'scene' as const,
      prompt: s.prompt,
      negativePrompt: s.negativePrompt,
      width: s.width,
      height: s.height,
      settings: s.settings,
      metadata: s.metadata,
      status: 'pending' as const,
    })),
    suspects: imageRequests.suspects.map(s => ({
      id: s.id,
      type: 'suspect' as const,
      prompt: s.prompt,
      negativePrompt: s.negativePrompt,
      width: s.width,
      height: s.height,
      settings: s.settings,
      metadata: s.metadata,
      status: 'pending' as const,
    })),
    evidence: imageRequests.evidence.map(e => ({
      id: e.id,
      type: 'evidence' as const,
      prompt: e.prompt,
      negativePrompt: e.negativePrompt,
      width: e.width,
      height: e.height,
      settings: e.settings,
      metadata: e.metadata,
      status: 'pending' as const,
    })),
  };

  return generatedCase;
}


// Main Generator Function - Uses narrative-driven generation only
export async function generateCase(request: GenerationRequest): Promise<GeneratedCase> {
  return generateNarrativeDrivenCase(request);
}

// Image data passed from UI after generation
interface GeneratedImages {
  cover?: string;
  suspects: Record<string, string>;  // suspectId -> imageUrl
  scenes: Record<string, string>;    // sceneId -> imageUrl
  clues: Record<string, string>;     // clueId -> imageUrl
}

// Result of saving a case - includes ID mappings for image uploads
export interface SaveCaseResult {
  caseId: string;
  idMappings: {
    suspects: Record<string, string>;  // generatedId -> databaseId
    scenes: Record<string, string>;    // generatedId -> databaseId
    clues: Record<string, string>;     // generatedId -> databaseId
  };
}

// Save generated case to database (WITHOUT images - use separate upload)
// Returns ID mappings so images can be uploaded separately
export async function saveGeneratedCase(
  generatedCase: GeneratedCase,
  prisma: any,
  images: GeneratedImages = { suspects: {}, scenes: {}, clues: {} }
): Promise<SaveCaseResult> {
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

  // ID mappings to return (generated ID -> database ID)
  const idMappings = {
    suspects: {} as Record<string, string>,
    scenes: {} as Record<string, string>,
    clues: {} as Record<string, string>,
  };

  // Create the case in database (cover image can be included if small/URL)
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
      coverImage: null, // Images uploaded separately to avoid payload size issues
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

  // Create scenes (without images initially)
  for (let i = 0; i < generatedCase.scenes.length; i++) {
    const scene = generatedCase.scenes[i];
    const dbScene = await prisma.scene.create({
      data: {
        caseId: newCase.id,
        name: scene.name,
        description: scene.description,
        imageUrl: '/images/scenes/default.png', // Placeholder, updated via separate upload
        isInitialScene: i === 0,
        orderIndex: i,
      },
    });
    // Map generated ID to database ID
    idMappings.scenes[scene.id] = dbScene.id;
  }

  // Create suspects (without images initially)
  for (const suspect of generatedCase.suspects) {
    const personalityArray = Array.isArray(suspect.personality) ? suspect.personality : [];
    const dbSuspect = await prisma.suspect.create({
      data: {
        caseId: newCase.id,
        name: suspect.name,
        role: suspect.role,
        imageUrl: null, // Placeholder, updated via separate upload
        bio: `${personalityArray.join(', ')} personality. ${suspect.alibi}`,
        isCulprit: suspect.isGuilty,
        dialogueTree: {
          nodes: [
            { id: 'start', question: 'Tell me about yourself', answer: `I am ${suspect.name}, the ${suspect.role}.` },
            { id: 'alibi', question: 'Where were you during the incident?', answer: suspect.alibi },
          ],
        },
      },
    });
    // Map generated ID to database ID
    idMappings.suspects[suspect.id] = dbSuspect.id;
  }

  // Create clues linked to scenes (clues belong to scenes, not cases directly)
  // Get the first scene ID (crime scene) to link clues
  const sceneIds = Object.values(idMappings.scenes) as string[];

  // Safety check: if no scenes were created, skip clue creation
  if (sceneIds.length === 0) {
    console.warn('No scenes created, skipping clue creation');
  }

  const defaultSceneId = sceneIds[0]; // First scene is the main crime scene

  // Create a map of clue IDs to their target scene (from cluesAvailable)
  const clueToSceneMap = new Map<string, string>();
  for (const scene of generatedCase.scenes) {
    const dbSceneId = idMappings.scenes[scene.id];
    for (const clueId of scene.cluesAvailable) {
      clueToSceneMap.set(clueId, dbSceneId);
    }
  }

  for (let i = 0; i < generatedCase.clues.length && sceneIds.length > 0; i++) {
    const clue = generatedCase.clues[i];

    // Use semantic scene mapping from cluesAvailable, fallback to distribution
    const targetSceneId = clueToSceneMap.get(clue.id) ||
      sceneIds[Math.floor(i / Math.ceil(generatedCase.clues.length / sceneIds.length))] ||
      defaultSceneId;

    // Use clue positions from semantic placement, fallback to reasonable defaults
    const positionX = clue.positionX ?? (20 + Math.random() * 60);
    const positionY = clue.positionY ?? (20 + Math.random() * 60);

    const dbClue = await prisma.clue.create({
      data: {
        sceneId: targetSceneId,
        name: clue.title,
        description: clue.description,
        imageUrl: null, // Placeholder, updated via separate upload
        // Use analysisResult as the revealed content when player examines the clue
        contentRevealed: clue.analysisResult || `This ${clue.type} evidence ${clue.relevance === 'critical' ? 'is crucial to the case' : 'may help with the investigation'}.`,
        isHidden: clue.relevance === 'red-herring', // Hide red herrings initially
        positionX: positionX,
        positionY: positionY,
      },
    });
    // Map generated ID to database ID
    idMappings.clues[clue.id] = dbClue.id;
  }

  // Create puzzles with narrative revelation data and MCQ options
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
        // MCQ options - stored as JSON array for the quiz interface
        options: puzzle.options && puzzle.options.length > 0 ? puzzle.options : null,
        // Narrative revelation system - story context for each puzzle
        narrativeContext: puzzle.narrativeContext || null,
        investigationPhase: puzzle.investigationPhase || null,
        revelation: puzzle.revelation ? {
          type: puzzle.revelation.type,
          description: puzzle.revelation.description,
          storyText: puzzle.revelation.storyText,
          importance: puzzle.revelation.importance,
        } : null,
        relatedCharacterName: puzzle.relatedCharacterName || null,
      },
    });
  }

  return {
    caseId: newCase.id,
    idMappings,
  };
}
