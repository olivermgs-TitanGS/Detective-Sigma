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
import {
  storyTemplates,
  suspectTemplates,
  nameTemplates,
  clueTemplates,
  puzzleTemplates,
  challengingPuzzles,
  expertPuzzles,
  puzzleComplexityConfig,
} from './templates';
import {
  getOccupationsForLocation,
} from './data/characters';
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
  generateStoryPuzzleSet,
  StoryPuzzle,
  StoryPuzzleSet,
  formatStoryPuzzlePresentation,
} from './story-puzzles';

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
Estimated Time: ${request.constraints?.estimatedMinutes || 25} minutes
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
    templateId: template.id,
  };
}

// Generate Suspects with context-appropriate roles
function generateSuspects(
  request: GenerationRequest, 
  suspectCount: number = 3,
  storyContext?: { templateId: string; locationType: string }
): Suspect[] {
  const suspects: Suspect[] = [];
  const usedRoles: string[] = [];

  // Get all names and shuffle
  const allNames = [
    ...nameTemplates.chinese,
    ...nameTemplates.malay,
    ...nameTemplates.indian,
    ...nameTemplates.english,
  ];
  const shuffledNames = shuffleArray(allNames);

  // Get context-appropriate roles based on story template
  let availableRoles: string[];
  if (storyContext?.templateId && STORY_SPECIFIC_ROLES[storyContext.templateId]) {
    // Use story-specific roles for narrative coherence
    availableRoles = [...STORY_SPECIFIC_ROLES[storyContext.templateId]];
  } else if (storyContext?.locationType) {
    // Fall back to location-based roles
    const occupations = getOccupationsForLocation(storyContext.locationType);
    availableRoles = occupations.map(o => o.title);
  } else {
    // Last resort: use generic roles
    availableRoles = [...suspectTemplates.roles];
  }

  // Shuffle available roles
  const shuffledRoles = shuffleArray(availableRoles);

  // Randomly select which suspect is guilty
  const guiltyIndex = Math.floor(Math.random() * suspectCount);

  for (let i = 0; i < suspectCount; i++) {
    const name = shuffledNames[i] || `Suspect ${i + 1}`;
    
    // Get a unique role (don't repeat roles if possible)
    let role: string;
    if (i < shuffledRoles.length) {
      role = shuffledRoles[i];
    } else {
      // If we need more suspects than available roles, pick randomly
      role = selectRandom(availableRoles);
    }
    usedRoles.push(role);

    const isGuilty = i === guiltyIndex;
    const personality = selectRandom(suspectTemplates.personalities);
    const alibi = isGuilty
      ? 'Claims to have been working alone in a back room'
      : selectRandom(suspectTemplates.alibis);

    // Infer demographics from name and role with FULL age-role compatibility
    const gender = inferGenderFromCharacter(name);
    const ethnicity = inferEthnicityFromName(name);

    // Use new age compatibility system for contextually appropriate ages
    const ageInfo = getCompatibleAgeForRole(role);

    suspects.push({
      id: `suspect-${nanoid(6)}`,
      name,
      role,
      alibi,
      personality,
      isGuilty,
      motive: isGuilty ? 'Had access and opportunity' : undefined,
      // Demographics for image generation (enhanced with specific age info)
      gender,
      ethnicity,
      ageGroup: ageInfo.ageGroup,
      // New detailed age fields for better context
      ageCategory: ageInfo.ageCategory,
      specificAge: ageInfo.specificAge,
      displayAge: ageInfo.displayAge,
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

// Generate Puzzles based on complexity (designed for 20-30 min total solve time)
// Supports two modes:
// 1. Syllabus-based: Uses curriculum topics and learning progression
// 2. Legacy: Uses template-based generation for backward compatibility
function generatePuzzles(
  request: GenerationRequest,
  puzzleCount: number = 3,
  studentProgress?: Record<string, TopicProgress>
): Puzzle[] {
  const { subject, difficulty, gradeLevel } = request;
  const complexity = (request.puzzleComplexity || 'STANDARD') as PuzzleComplexity;
  const useSyllabus = request.useSyllabus !== false; // Default to true

  // Map grade level to syllabus grade
  const gradeLevelMap: Record<string, GradeLevel> = {
    'P4': 'P4',
    'P5': 'P5',
    'P6': 'P6',
    'SECONDARY': 'SECONDARY',
    'ADULT': 'ADULT',
  };
  const syllabusGrade = gradeLevelMap[gradeLevel] || 'P5';

  // Map subject to syllabus subject
  const subjectMap: Record<string, Subject> = {
    'MATH': 'MATH',
    'SCIENCE': 'SCIENCE',
    'INTEGRATED': 'MATH', // Default to MATH for integrated
  };
  const syllabusSubject = subjectMap[subject] || 'MATH';

  // TRY SYLLABUS-BASED GENERATION FIRST
  if (useSyllabus) {
    // Get available topic IDs that have puzzle generators
    const availableTopics = getAvailablePuzzleTopics();

    // Select topics based on student progress or grade level
    let selectedTopicIds: string[];

    if (studentProgress && Object.keys(studentProgress).length > 0) {
      // Use learning tracker to select appropriate topics
      selectedTopicIds = selectTopicsForCase(
        syllabusGrade,
        syllabusSubject,
        studentProgress,
        puzzleCount
      );
    } else {
      // No student progress - select topics for the grade level
      const gradeTopics = getTopicsByGrade(syllabusGrade);
      const subjectTopics = subject === 'INTEGRATED'
        ? gradeTopics
        : gradeTopics.filter(t => t.subject === syllabusSubject);

      // Filter to topics that have generators
      const availableForGrade = subjectTopics
        .filter(t => availableTopics.includes(t.id))
        .map(t => t.id);

      // Shuffle and select
      selectedTopicIds = shuffleArray(availableForGrade).slice(0, puzzleCount);
    }

    // Generate puzzles for selected topics
    if (selectedTopicIds.length > 0) {
      const syllabusBasedPuzzles = generatePuzzlesForTopics(selectedTopicIds, complexity);

      // If we got enough puzzles, return them
      if (syllabusBasedPuzzles.length >= puzzleCount) {
        return syllabusBasedPuzzles.slice(0, puzzleCount);
      }

      // If we got some but not enough, supplement with legacy puzzles
      if (syllabusBasedPuzzles.length > 0) {
        const remaining = puzzleCount - syllabusBasedPuzzles.length;
        const legacyPuzzles = generateLegacyPuzzles(request, remaining, complexity);
        return [...syllabusBasedPuzzles, ...legacyPuzzles];
      }
    }
  }

  // FALLBACK TO LEGACY GENERATION
  return generateLegacyPuzzles(request, puzzleCount, complexity);
}

// Legacy puzzle generation for backward compatibility
function generateLegacyPuzzles(
  request: GenerationRequest,
  puzzleCount: number,
  complexity: PuzzleComplexity
): Puzzle[] {
  const { subject, difficulty } = request;

  // For MATH subject: Use the modular generator for unique puzzles
  if (subject === 'MATH') {
    return generateUniquePuzzles('MATH', complexity, puzzleCount);
  }

  // For SCIENCE and INTEGRATED: Use static templates
  const complexityConfig = puzzleComplexityConfig[complexity as keyof typeof puzzleComplexityConfig] || puzzleComplexityConfig.STANDARD;

  // Points per puzzle based on difficulty and complexity
  const basePoints: Record<string, number> = {
    ROOKIE: 15,
    INSPECTOR: 20,
    DETECTIVE: 25,
    CHIEF: 30,
  };

  // Difficulty multiplier for puzzle selection
  const difficultyMultiplier: Record<string, number> = {
    ROOKIE: 1,
    INSPECTOR: 2,
    DETECTIVE: 3,
    CHIEF: 4,
  };

  // Select puzzle templates based on complexity
  let templates: Array<{
    title: string;
    question: string;
    answer: string;
    hint: string;
    type: 'math' | 'logic' | 'observation' | 'deduction';
    complexity?: string;
  }>;

  if (complexity === 'EXPERT') {
    templates = expertPuzzles[subject as keyof typeof expertPuzzles] || expertPuzzles.INTEGRATED;
  } else if (complexity === 'CHALLENGING') {
    templates = challengingPuzzles[subject as keyof typeof challengingPuzzles] || challengingPuzzles.INTEGRATED;
  } else {
    templates = puzzleTemplates[subject as keyof typeof puzzleTemplates] || puzzleTemplates.INTEGRATED;
  }

  const puzzles: Puzzle[] = [];
  const shuffledTemplates = shuffleArray([...templates]);

  for (let i = 0; i < puzzleCount; i++) {
    const template = shuffledTemplates[i % shuffledTemplates.length];
    const points = Math.round((basePoints[difficulty] || 20) * complexityConfig.pointMultiplier);

    puzzles.push({
      id: `puzzle-${nanoid(6)}`,
      title: template.title,
      type: template.type,
      question: template.question,
      answer: template.answer,
      hint: template.hint,
      points,
      difficulty: difficultyMultiplier[difficulty] || 1,
      complexity: complexity as 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT',
      estimatedMinutes: complexityConfig.estimatedMinutes,
      requiresMultipleSteps: complexity !== 'BASIC',
    });
  }

  return puzzles;
}

// ============================================
// NEW NARRATIVE-DRIVEN CASE GENERATION
// ============================================

/**
 * Convert NarrativeCase + characters to GeneratedCase format
 * This bridges the new narrative engine with the existing case structure
 */
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

  // Convert evidence chain to clues
  const allEvidence = getAllEvidence(evidenceChain);
  const clues: Clue[] = allEvidence.map(evidence => ({
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
  }));

  // Convert story puzzles to puzzles with narrative context
  const puzzles: Puzzle[] = puzzleSet.puzzles.map(puzzle => ({
    id: puzzle.id,
    title: puzzle.title,
    type: puzzle.type,
    question: puzzle.question,
    answer: puzzle.answer,
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

  // Generate scenes from narrative setting
  const scenes: Scene[] = [
    {
      id: `scene-${nanoid(6)}`,
      name: narrativeCase.setting.location,
      description: narrativeCase.setting.description,
      interactiveElements: ['Crime Scene', 'Evidence Board', 'Witness Area'],
      cluesAvailable: evidenceChain.initialEvidence.map(e => e.id),
    },
    {
      id: `scene-${nanoid(6)}`,
      name: 'Investigation Room',
      description: 'A dedicated space for analyzing evidence and interviewing suspects.',
      interactiveElements: ['Evidence Table', 'Suspect Profiles', 'Timeline Board'],
      cluesAvailable: evidenceChain.discoveredEvidence.map(e => e.id),
    },
  ];

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

  // 5. Generate story-integrated puzzles
  const puzzleSet = generateStoryPuzzleSet(
    narrativeCase,
    characters,
    evidenceChain,
    subject,
    puzzleCount
  );

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
  // Use narrative-driven generation if requested (new default)
  // Set useNarrativeEngine: false to use legacy generation
  if (request.useNarrativeEngine !== false) {
    return generateNarrativeDrivenCase(request);
  }

  // === LEGACY GENERATION (kept for backward compatibility) ===
  const caseId = `case-${nanoid(10)}`;
  const puzzleComplexity = request.puzzleComplexity || 'STANDARD';

  // Get complexity config for time estimation
  const complexityConfig = puzzleComplexityConfig[puzzleComplexity as keyof typeof puzzleComplexityConfig] || puzzleComplexityConfig.STANDARD;

  // Determine puzzle counts based on difficulty level
  // Higher difficulty = more puzzles to solve
  const difficultyPuzzleCounts: Record<string, number> = {
    ROOKIE: 6,       // Entry level - fewer puzzles
    INSPECTOR: 10,   // Intermediate - moderate puzzles
    DETECTIVE: 15,   // Advanced - many puzzles
    CHIEF: 20,       // Expert - maximum puzzles
  };

  // Determine other counts based on puzzle complexity
  const complexityCounts: Record<string, { suspects: number; clues: number }> = {
    BASIC: { suspects: 3, clues: 4 },
    STANDARD: { suspects: 3, clues: 5 },
    CHALLENGING: { suspects: 4, clues: 6 },
    EXPERT: { suspects: 4, clues: 7 },
  };

  const counts = complexityCounts[puzzleComplexity] || complexityCounts.STANDARD;
  const suspectCount = counts.suspects;
  const puzzleCount = request.constraints?.minPuzzles || difficultyPuzzleCounts[request.difficulty] || 10;
  const clueCount = counts.clues;

  // Generate all components
  const story = generateStory(request);
  // Pass story context to generate contextually-appropriate suspects
  const suspects = generateSuspects(request, suspectCount, {
    templateId: story.templateId,
    locationType: story.locationType,
  });
  const clues = generateClues(suspects, clueCount);
  const puzzles = generatePuzzles(request, puzzleCount);
  const scenes = generateScenes(story, clues);

  // Build case context for 100% relevant image generation
  const caseContext: CaseContext = {
    title: story.title,
    subject: request.subject,
    difficulty: request.difficulty,
    gradeLevel: request.gradeLevel,
    story: {
      setting: story.setting,
      crime: story.crime,
      resolution: story.resolution,
      theme: story.theme,
      location: story.location,
      locationType: story.locationType,
    },
    timeOfDay: selectRandom(['day', 'morning', 'evening', 'night'] as const),
    atmosphere: selectRandom(['mysterious', 'tense', 'calm', 'urgent'] as const),
  };

  // Generate contextual image requests (100% case-specific)
  const imageRequests = generateContextualCaseImages(
    caseContext,
    suspects,
    clues.map(c => ({
      title: c.title,
      description: c.description,
      type: c.type,
      relevance: c.relevance,
      discoveryLocation: scenes[0]?.name,
      examinationDetails: [],
    })),
    scenes.map(s => ({
      name: s.name,
      description: s.description,
    }))
  );

  return {
    caseId,
    title: story.title,
    briefing: story.briefing,
    metadata: {
      difficulty: request.difficulty,
      gradeLevel: request.gradeLevel,
      subjectFocus: request.subject,
      // Calculate estimated time based on puzzle complexity and count
      estimatedMinutes: request.constraints?.estimatedMinutes || (puzzleCount * complexityConfig.estimatedMinutes),
      puzzleComplexity: puzzleComplexity,
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
    // Include image requests for Pony Diffusion V6 generation
    imageRequests: {
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
    },
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
