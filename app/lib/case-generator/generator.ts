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

// NEW ARCHITECTURE V2 - Crime-First, Evidence-Driven Generation
import { generateCaseFromArchitecture } from './architecture/orchestrator';

// LEGACY NARRATIVE ENGINE IMPORTS (kept for gradual migration)
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
 * Age categories with realistic age ranges - SINGAPORE EDUCATION SYSTEM
 *
 * Singapore Education Pathway:
 * - Nursery/Kindergarten: 3-6 years (pre-school)
 * - Primary School: 7-12 years (P1-P6, PSLE at P6)
 * - Secondary School: 13-16 years (Sec 1-4, O-Levels)
 * - Secondary 5: 17 years (Normal stream only)
 * - JC: 17-18 years (2 years, A-Levels)
 * - Polytechnic: 17-20 years (3 years diploma)
 * - ITE: 17-19 years (2 years NITEC/Higher NITEC)
 * - National Service: 18-20 years (males, 2 years)
 * - University: 21-25 years (3-5 years depending on course)
 * - Working Adults: 22-65 years
 * - Seniors/Retirees: 66+ years
 */
type AgeCategory = 'toddler' | 'kindergarten' | 'lower_primary' | 'upper_primary' | 'lower_secondary' | 'upper_secondary' | 'post_secondary' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';

// Simplified mapping for backwards compatibility
type SimplifiedAgeCategory = 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';

interface AgeRange {
  category: AgeCategory;
  simplifiedCategory: SimplifiedAgeCategory;
  minAge: number;
  maxAge: number;
  displayRange: string;
  schoolLevel: string;
  description: string;
}

const AGE_RANGES: Record<AgeCategory, AgeRange> = {
  toddler: {
    category: 'toddler',
    simplifiedCategory: 'child',
    minAge: 3,
    maxAge: 4,
    displayRange: '3-4 years old',
    schoolLevel: 'Nursery',
    description: 'nursery-age toddler, very young child'
  },
  kindergarten: {
    category: 'kindergarten',
    simplifiedCategory: 'child',
    minAge: 5,
    maxAge: 6,
    displayRange: '5-6 years old',
    schoolLevel: 'Kindergarten K1-K2',
    description: 'kindergarten student, young child'
  },
  lower_primary: {
    category: 'lower_primary',
    simplifiedCategory: 'child',
    minAge: 7,
    maxAge: 9,
    displayRange: '7-9 years old',
    schoolLevel: 'Primary 1-3',
    description: 'lower primary school student'
  },
  upper_primary: {
    category: 'upper_primary',
    simplifiedCategory: 'child',
    minAge: 10,
    maxAge: 12,
    displayRange: '10-12 years old',
    schoolLevel: 'Primary 4-6',
    description: 'upper primary school student, preparing for PSLE'
  },
  lower_secondary: {
    category: 'lower_secondary',
    simplifiedCategory: 'teen',
    minAge: 13,
    maxAge: 14,
    displayRange: '13-14 years old',
    schoolLevel: 'Secondary 1-2',
    description: 'lower secondary school teenager'
  },
  upper_secondary: {
    category: 'upper_secondary',
    simplifiedCategory: 'teen',
    minAge: 15,
    maxAge: 17,
    displayRange: '15-17 years old',
    schoolLevel: 'Secondary 3-5 / JC Year 1',
    description: 'upper secondary or JC student, preparing for O/A-Levels'
  },
  post_secondary: {
    category: 'post_secondary',
    simplifiedCategory: 'young_adult',
    minAge: 17,
    maxAge: 20,
    displayRange: '17-20 years old',
    schoolLevel: 'JC/Polytechnic/ITE/NS',
    description: 'post-secondary student or NS enlistee'
  },
  young_adult: {
    category: 'young_adult',
    simplifiedCategory: 'young_adult',
    minAge: 21,
    maxAge: 30,
    displayRange: '21-30 years old',
    schoolLevel: 'University/Early Career',
    description: 'university student or young professional'
  },
  adult: {
    category: 'adult',
    simplifiedCategory: 'adult',
    minAge: 31,
    maxAge: 45,
    displayRange: '31-45 years old',
    schoolLevel: 'Working Adult',
    description: 'working adult in prime career'
  },
  middle_aged: {
    category: 'middle_aged',
    simplifiedCategory: 'middle_aged',
    minAge: 46,
    maxAge: 65,
    displayRange: '46-65 years old',
    schoolLevel: 'Senior Professional',
    description: 'middle-aged professional, possibly in leadership'
  },
  senior: {
    category: 'senior',
    simplifiedCategory: 'senior',
    minAge: 66,
    maxAge: 85,
    displayRange: '66-85 years old',
    schoolLevel: 'Retired',
    description: 'senior citizen, possibly retired'
  },
};

// Legacy mapping for backwards compatibility
const SIMPLIFIED_AGE_RANGES: Record<SimplifiedAgeCategory, AgeRange> = {
  child: AGE_RANGES.upper_primary,
  teen: AGE_RANGES.upper_secondary,
  young_adult: AGE_RANGES.young_adult,
  adult: AGE_RANGES.adult,
  middle_aged: AGE_RANGES.middle_aged,
  senior: AGE_RANGES.senior,
};

/**
 * Occupation definitions with valid age ranges - GRANULAR SINGAPORE SYSTEM
 * Each occupation specifies which age categories are valid for it
 */
interface OccupationAgeConstraint {
  role: string;
  validAges: AgeCategory[];
  preferredAges: AgeCategory[]; // More likely ages for this role
}

const OCCUPATION_AGE_CONSTRAINTS: OccupationAgeConstraint[] = [
  // ============================================
  // STUDENT ROLES - Singapore Education System
  // ============================================

  // Pre-school students (3-6 years)
  { role: 'Nursery Student', validAges: ['toddler'], preferredAges: ['toddler'] },
  { role: 'Kindergarten Student', validAges: ['kindergarten'], preferredAges: ['kindergarten'] },
  { role: 'K1 Student', validAges: ['kindergarten'], preferredAges: ['kindergarten'] },
  { role: 'K2 Student', validAges: ['kindergarten'], preferredAges: ['kindergarten'] },

  // Primary school students (7-12 years)
  { role: 'Primary Student', validAges: ['lower_primary', 'upper_primary'], preferredAges: ['upper_primary'] },
  { role: 'P1 Student', validAges: ['lower_primary'], preferredAges: ['lower_primary'] },
  { role: 'P2 Student', validAges: ['lower_primary'], preferredAges: ['lower_primary'] },
  { role: 'P3 Student', validAges: ['lower_primary'], preferredAges: ['lower_primary'] },
  { role: 'P4 Student', validAges: ['upper_primary'], preferredAges: ['upper_primary'] },
  { role: 'P5 Student', validAges: ['upper_primary'], preferredAges: ['upper_primary'] },
  { role: 'P6 Student', validAges: ['upper_primary'], preferredAges: ['upper_primary'] },
  { role: 'PSLE Student', validAges: ['upper_primary'], preferredAges: ['upper_primary'] },
  { role: 'Primary School Student', validAges: ['lower_primary', 'upper_primary'], preferredAges: ['upper_primary'] },

  // Secondary school students (13-17 years)
  { role: 'Secondary Student', validAges: ['lower_secondary', 'upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'Sec 1 Student', validAges: ['lower_secondary'], preferredAges: ['lower_secondary'] },
  { role: 'Sec 2 Student', validAges: ['lower_secondary'], preferredAges: ['lower_secondary'] },
  { role: 'Sec 3 Student', validAges: ['upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'Sec 4 Student', validAges: ['upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'Sec 5 Student', validAges: ['upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'O-Level Student', validAges: ['upper_secondary'], preferredAges: ['upper_secondary'] },

  // Post-secondary students (17-20 years)
  { role: 'JC Student', validAges: ['upper_secondary', 'post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'JC1 Student', validAges: ['upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'JC2 Student', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'A-Level Student', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'Polytechnic Student', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'ITE Student', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'NSF', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },
  { role: 'NS Recruit', validAges: ['post_secondary'], preferredAges: ['post_secondary'] },

  // University students (21-25 years)
  { role: 'University Student', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'Undergraduate', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'NUS Student', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'NTU Student', validAges: ['young_adult'], preferredAges: ['young_adult'] },
  { role: 'SMU Student', validAges: ['young_adult'], preferredAges: ['young_adult'] },

  // Generic student roles
  { role: 'Student Helper', validAges: ['upper_secondary', 'post_secondary', 'young_adult'], preferredAges: ['upper_secondary'] },
  { role: 'Student Researcher', validAges: ['upper_secondary', 'post_secondary', 'young_adult'], preferredAges: ['young_adult'] },
  { role: 'Team Captain', validAges: ['upper_primary', 'lower_secondary', 'upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'Student Witness', validAges: ['upper_primary', 'lower_secondary', 'upper_secondary'], preferredAges: ['lower_secondary'] },
  { role: 'Student Prefect', validAges: ['upper_primary', 'lower_secondary', 'upper_secondary'], preferredAges: ['upper_secondary'] },
  { role: 'Class Monitor', validAges: ['lower_primary', 'upper_primary', 'lower_secondary', 'upper_secondary'], preferredAges: ['upper_primary'] },

  // ============================================
  // INTERN/TRAINEE ROLES
  // ============================================
  { role: 'Intern', validAges: ['post_secondary', 'young_adult'], preferredAges: ['young_adult'] },
  { role: 'Trainee', validAges: ['post_secondary', 'young_adult'], preferredAges: ['young_adult'] },
  { role: 'Apprentice', validAges: ['upper_secondary', 'post_secondary', 'young_adult'], preferredAges: ['post_secondary'] },
  { role: 'Relief Teacher', validAges: ['young_adult'], preferredAges: ['young_adult'] },

  // ============================================
  // JUNIOR STAFF ROLES
  // ============================================
  { role: 'Junior Staff', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Shop Assistant', validAges: ['post_secondary', 'young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Library Assistant', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Lab Assistant', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Canteen Staff', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Cashier', validAges: ['post_secondary', 'young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Waiter', validAges: ['post_secondary', 'young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Waitress', validAges: ['post_secondary', 'young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Receptionist', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult', 'adult'] },
  { role: 'Barista', validAges: ['post_secondary', 'young_adult'], preferredAges: ['young_adult'] },

  // ============================================
  // GENERAL WORKER ROLES
  // ============================================
  { role: 'Cleaner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Security Guard', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Delivery Person', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Driver', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Taxi Driver', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Grab Driver', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Bus Driver', validAges: ['adult', 'middle_aged'], preferredAges: ['middle_aged'] },
  { role: 'Maintenance Worker', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Construction Worker', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Factory Worker', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },

  // ============================================
  // SKILLED WORKER ROLES
  // ============================================
  { role: 'Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'IT Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['young_adult', 'adult'] },
  { role: 'Lab Technician', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Equipment Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Electrician', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Plumber', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Mechanic', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },

  // ============================================
  // EDUCATION PROFESSIONALS
  // ============================================
  { role: 'Teacher', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Teacher on Duty', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Science Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Math Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'English Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'PE Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Art Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Music Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Form Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Discipline Master', validAges: ['adult', 'middle_aged'], preferredAges: ['middle_aged'] },
  { role: 'Kindergarten Teacher', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult', 'adult'] },
  { role: 'Childcare Teacher', validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] },
  { role: 'Librarian', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Sports Coach', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Tuition Teacher', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },

  // ============================================
  // OTHER PROFESSIONALS
  // ============================================
  { role: 'Referee', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Safety Officer', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Nurse', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Doctor', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Accountant', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Lawyer', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Engineer', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'Visiting Scientist', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Police Officer', validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] },

  // ============================================
  // BUSINESS OWNER / VENDOR ROLES
  // ============================================
  { role: 'Stall Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Market Vendor', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Canteen Vendor', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Shop Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Food Stall Owner', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Hawker', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Kopitiam Auntie', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Kopitiam Uncle', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },

  // ============================================
  // MANAGEMENT ROLES
  // ============================================
  { role: 'Manager', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Canteen Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['middle_aged'] },
  { role: 'Market Manager', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Office Manager', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Department Head', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Sports Secretary', validAges: ['adult', 'middle_aged'], preferredAges: ['adult'] },
  { role: 'HOD', validAges: ['adult', 'middle_aged'], preferredAges: ['middle_aged'] },

  // ============================================
  // SENIOR/EXECUTIVE ROLES
  // ============================================
  { role: 'Principal', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Vice Principal', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },
  { role: 'Director', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'CEO', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Chairman', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Professor', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] },
  { role: 'Senior Manager', validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged'] },

  // ============================================
  // FAMILY/VISITOR ROLES
  // ============================================
  { role: 'Parent', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Parent Volunteer', validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Grandparent', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Guardian', validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Regular Customer', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult', 'middle_aged'] },
  { role: 'Regular Patron', validAges: ['upper_secondary', 'post_secondary', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Visitor', validAges: ['young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Bystander', validAges: ['upper_secondary', 'post_secondary', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },
  { role: 'Witness', validAges: ['upper_primary', 'lower_secondary', 'upper_secondary', 'post_secondary', 'young_adult', 'adult', 'middle_aged', 'senior'], preferredAges: ['adult'] },

  // ============================================
  // RETIREE ROLES
  // ============================================
  { role: 'Retiree', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Retired Teacher', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Elderly Resident', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Ah Ma', validAges: ['senior'], preferredAges: ['senior'] },
  { role: 'Ah Gong', validAges: ['senior'], preferredAges: ['senior'] },
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

  // Convert SuspectCharacter to Suspect with proper demographics
  const suspects: Suspect[] = characters.map(char => {
    // Get age data based on role for accurate image generation
    const ageData = getCompatibleAgeForRole(char.role);

    // Map detailed ageCategory to simplified for backwards compatibility
    const simplifiedAgeCategory = AGE_RANGES[ageData.ageCategory]?.simplifiedCategory || 'adult';

    return {
      id: char.id,
      name: char.name,
      role: char.role,
      alibi: char.alibi.claimed,
      personality: char.background.personality,
      isGuilty: char.isGuilty,
      motive: char.isGuilty ? narrativeCase.culprit.motive.description : undefined,
      // Demographic fields for accurate image generation
      ethnicity: inferEthnicityFromCharacter(char.name),
      gender: inferGenderFromCharacter(char.name),
      ageGroup: ageData.ageGroup,
      ageCategory: simplifiedAgeCategory as 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior',
      specificAge: ageData.specificAge,
      displayAge: ageData.displayAge,
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
    };
  });

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

  // Generate immersive, story-connected scenes using ACTUAL CRIME SCENE LOCATIONS
  const crimeTimeWindow = narrativeCase.crime.crimeWindow;
  const guiltyChar = characters.find(c => c.isGuilty);

  // Use keyLocations from the story scenario (e.g., 'Main counter', 'Storeroom', 'Kitchen')
  // These are the actual locations in the crime scene, NOT generic office templates
  const keyLocations = narrativeCase.keyLocations || [];
  const mainLocation = narrativeCase.setting.location; // e.g., "Sunrise Primary School Canteen"
  const locationType = narrativeCase.setting.locationType; // e.g., "school"

  // Helper: Generate DETAILED scene description for accurate image prompts
  // These descriptions drive the AI image generation - they must be visually specific
  const generateSceneDescription = (locationName: string, role: string): string => {
    const crimeType = narrativeCase.crime.type.replace('_', ' ');
    const timeContext = narrativeCase.setting.timeOfDay;
    const dayContext = narrativeCase.setting.dayContext;

    const locationDescriptions: Record<string, string> = {
      // ============================================
      // CANTEEN LOCATIONS - Visual details for image prompts
      // ============================================
      'main counter': `Singapore school canteen main service counter with stainless steel serving area, laminated menu boards with prices in multiple languages above, plastic money tray on counter, food warmers with local dishes visible, stack of melamine plates and bowls, beverage dispenser with iced drinks, canteen auntie workspace behind counter. ${dayContext}. Fluorescent lights overhead, tiled floor, queue barrier ropes.`,

      'storeroom': `School canteen storeroom with industrial metal shelving racks stacked with ingredient boxes labeled in Chinese and English, large refrigerator unit humming, cleaning supplies in corner, inventory clipboard on wall, single fluorescent tube light casting shadows, concrete floor with drainage, locked metal door with small window, staff aprons hanging on hooks.`,

      'kitchen': `Commercial school canteen kitchen with stainless steel wok stations, industrial gas stoves with blue flames, ventilation hoods above, prep tables with cutting boards and knives, ingredient containers labeled, utensil racks, staff in aprons cooking, steam rising from woks, floor drains, time card machine on wall, staff notice board with schedules.`,

      'back entrance': `Service entrance behind school canteen with concrete loading area, metal roller shutter half-open, stacked empty delivery crates, trolley with supplies, waste bins for food recycling, staff bicycles parked against wall, delivery timing board, morning sunlight streaming in, worn floor markings, staff notice board with delivery schedules.`,

      'toilet': `School restroom near canteen area with tiled walls and floor, row of wash basins with mirrors, hand dryer on wall, paper towel dispenser, wet floor near sinks, fluorescent lighting, student notices on wall, maintenance log near door, ventilation grilles, cleaning supplies cupboard.`,

      // ============================================
      // SCIENCE LAB LOCATIONS - Visual details for image prompts
      // ============================================
      'main lab': `Primary school science laboratory with rows of black resin lab benches fitted with gas taps and ceramic sinks, high wooden stools, fume cupboard at side wall, emergency shower station with red handle, periodic table poster on wall, safety goggles rack near door, microscopes on shelves, beakers and test tubes in racks, student experiment notebooks on benches. ${dayContext}. Natural light from high windows, safety first posters in multiple languages.`,

      'storage cabinet': `Locked chemical storage area within science lab with glass-fronted cabinets showing organized reagent bottles with hazard labels, specimen jars with preserved samples, flammable storage cabinet in yellow, chemical inventory log on clipboard, safety data sheets folder, restricted access warning signs, bright safety lighting, SCDF compliance stickers on cabinet doors.`,

      'plant display area': `Science fair display area with folding tables arranged in rows, tri-fold project boards with student names and experiment details, potted plants at various growth stages with measurement rulers beside them, data collection notebooks, plant labels with scientific names, competition judging sheets, natural light from windows highlighting the displays, excited academic atmosphere. ${dayContext}.`,

      'lab entrance': `Science laboratory entrance area with safety protocol signs, student sign-in sheet on clipboard, safety goggles dispensing station, lab coat hooks, hand sanitizer dispenser, emergency procedures poster, fire extinguisher in red cabinet, glass window looking into main lab, tiled floor with caution markings.`,

      'equipment room': `Science equipment storage room with industrial shelving holding microscopes in protective cases, balances and scales, spare glassware in organized boxes, calibration equipment, maintenance tools, MOE inventory tags on all items, maintenance schedule posted on wall, key cabinet for restricted equipment, fluorescent lighting, organized workspace atmosphere.`,

      // ============================================
      // LIBRARY LOCATIONS - Visual details for image prompts
      // ============================================
      'special collection room': `Climate-controlled rare books room with glass display cases showing valuable first editions, reading pedestals with book supports, white cotton gloves on examination table, archive boxes with acid-free tissue, humidity and temperature monitors, UV-filtered lighting, secure access door with keypad, heritage collection signage, hushed scholarly atmosphere, Singapore history books prominently displayed.`,

      'front desk': `Library main service desk with L-shaped counter, computer terminals for catalogue searches, barcode scanner for book loans, book return slot, staff workstations behind counter, membership card reader, multilingual signage, queue management system, lost and found box, reserved books shelf, helpful librarian workspace. ${dayContext}.`,

      'reading room': `Quiet library study area with individual study carrels along walls, group study tables in center, comfortable reading armchairs in corners, desk lamps on tables, power outlets for laptops, magazine racks, natural light from large windows, silent zone signs, students and adults focused on reading and study, PSLE preparation materials visible. ${dayContext}.`,

      "children's section": `Colorful children's library area with low bookshelves at child height, bright picture book displays, story corner with floor cushions and bean bags, child-sized tables and chairs in primary colors, puppet theater setup, interactive reading nooks, warm welcoming lighting, playful ceiling decorations, Malay Tamil Chinese English books mixed on shelves, joyful learning atmosphere.`,

      'staff room': `Library staff room with personal lockers, duty roster on wall, staff belongings on shelves, small kitchenette area, schedule board with assignments, filing cabinets with administrative documents, staff notice board, comfortable break area with chairs, fluorescent lighting, professional workspace atmosphere.`,

      // ============================================
      // SPORTS FACILITY LOCATIONS - Visual details for image prompts
      // ============================================
      'main court': `Competition badminton court with professional wooden flooring, white court line markings, badminton net at regulation height, umpire high chair at side, player benches with team banners, electronic scoreboard, competition-grade overhead lighting with no shadows, audience bleacher seating visible, school flags and SSSBA banners displayed, championship atmosphere. ${dayContext}.`,

      'locker rooms': `Sports facility locker room with rows of green metal lockers with combination locks, wooden benches between rows, sports bags on hooks, PE uniforms visible through open lockers, mirror area for athletes, team photos on wall, shower area visible at back, fluorescent strip lighting, floor mats, pre-game energy atmosphere.`,

      'security office': `Sports facility security office with CCTV monitoring screens showing multiple camera feeds, access card log computer, security desk with patrol schedule, visitor sign-in logbook, key cabinet on wall, radio communication equipment, security guard workspace, fluorescent lighting, professional monitoring atmosphere.`,

      'entrance gate': `Sports facility main entrance with security checkpoint, visitor registration desk, turnstile gates, event banner overhead, directional signage, crowd control barriers, early morning light, competition day setup, school buses arriving in background, excited atmosphere. ${dayContext}.`,

      // ============================================
      // WET MARKET LOCATIONS - Visual details for image prompts
      // ============================================
      'fish stall': `Traditional Singapore wet market fish stall with stainless steel display counter covered in crushed ice, fresh fish arranged in rows with price tags in Chinese, weighing scale prominently displayed, cutting board with professional knife set, running water hose, live seafood tanks with prawns and crabs, fishmonger in rubber boots and apron, overhead fluorescent lights, morning market bustle. ${dayContext}.`,

      'market office': `Market management office with small enclosed room, glass window facing market floor, NEA license display board, CCTV monitors showing stall areas, filing cabinets with vendor records, office desk with computer, complaint forms on counter, vendor payment records, official atmosphere, fluorescent office lighting.`,

      'storage area': `Market cold storage area with walk-in refrigerator visible, stacked styrofoam boxes with ice, inventory shelving, temperature monitoring equipment, loading trolleys, drainage on floor, bright overhead lights, organized inventory labels, morning delivery boxes being sorted.`,

      'weighing station': `Official NEA market weighing station with certified scale on counter with calibration sticker, consumer protection signage, weight verification equipment, complaint procedure poster, bright clinical lighting, customers verifying purchases, official government atmosphere.`,

      'loading bay': `Market loading and delivery area with concrete platform, roller shutters opening to truck access, stacked delivery crates, pallet jacks, delivery personnel unloading goods, early morning natural light, delivery timing restrictions sign, HDB carpark visible in background, market preparation bustle. ${dayContext}.`,
    };

    const lowerLocation = locationName.toLowerCase();
    const baseDescription = locationDescriptions[lowerLocation];

    if (baseDescription) {
      return baseDescription;
    }

    // Fallback with detailed generic description based on location type
    const locTypeDescriptions: Record<string, string> = {
      'school': `A location within ${mainLocation} with typical Singapore school features - notice boards, student work displays, fluorescent lighting, tiled floors. ${dayContext}. ${role === 'primary' ? `This is where the ${crimeType} occurred.` : 'Witnesses and evidence may be found here.'}`,
      'community': `A public community space at ${mainLocation} with Singapore community centre features - notice boards, plastic chairs, fluorescent lighting. ${dayContext}. ${role === 'primary' ? `This is where the ${crimeType} occurred.` : 'Witnesses and evidence may be found here.'}`,
      'commercial': `A commercial area at ${mainLocation} with typical Singapore retail features - signage, display counters, air conditioning. ${dayContext}. ${role === 'primary' ? `This is where the ${crimeType} occurred.` : 'Witnesses and evidence may be found here.'}`,
    };

    return locTypeDescriptions[locationType] ||
      `The ${locationName} at ${mainLocation}. ${dayContext}. ${role === 'primary' ? `This is where the ${crimeType} occurred.` : 'Witnesses and evidence may be found here.'}`;
  };

  // Helper: Generate VENUE-SPECIFIC interactive elements
  // These are realistic items that could contain evidence or be interaction points
  const generateInteractiveElements = (locationName: string): string[] => {
    const lowerLocation = locationName.toLowerCase();
    const elements: Record<string, string[]> = {
      // Canteen locations - where theft/fraud evidence would be found
      'main counter': [
        'Cash register with receipt rolls (check transaction times)',
        'Staff schedule board (verify who was working)',
        'CCTV camera angle (footage of counter area)',
        'Money tray with coin slots (fingerprint evidence)',
      ],
      'storeroom': [
        'Inventory clipboard with sign-out log (access records)',
        'Delivery receipt box (verify delivery times)',
        'Staff locker area (personal belongings)',
        'Refrigerator temperature log (timestamp evidence)',
      ],
      'kitchen': [
        'Time card machine (staff clock-in records)',
        'Staff notice board with duty roster',
        'Ingredient order forms (handwriting samples)',
        'CCTV camera covering prep area',
      ],
      'back entrance': [
        'Delivery log book (who entered when)',
        'Staff bicycle parking sign-in',
        'Waste disposal schedule board',
        'Security camera blind spot markers',
      ],
      'toilet': [
        'Maintenance log on door (cleaning times)',
        'Hand dryer (fingerprint surface)',
        'Waste bin (discarded evidence)',
        'Mirror reflection (hidden camera check)',
      ],

      // Science lab locations - where sabotage evidence would be found
      'main lab': [
        'Experiment logbooks (tampering evidence)',
        'Safety goggles sign-out sheet (who was in lab)',
        'Fume cupboard usage log',
        'Water tap handles (fingerprint evidence)',
      ],
      'storage cabinet': [
        'Chemical checkout log (who accessed what)',
        'Key sign-out register',
        'Reagent bottle labels (tampering signs)',
        'MSDS folder (unusual chemical research)',
      ],
      'plant display area': [
        'Project labels with student names',
        'Watering schedule and care log',
        'Competition judging criteria sheet',
        'Before/after photo documentation',
      ],
      'lab entrance': [
        'Student sign-in sheet (entry times)',
        'Safety equipment checkout log',
        'Emergency contact list',
        'After-hours access log',
      ],
      'equipment room': [
        'Equipment checkout register',
        'Maintenance schedule calendar',
        'Key cabinet access log',
        'Inventory audit trail',
      ],

      // Library locations - where theft evidence would be found
      'special collection room': [
        'Access log terminal (entry timestamps)',
        'Climate control readings (door open times)',
        'Security camera footage archive',
        'Rare book handling gloves (DNA evidence)',
      ],
      'front desk': [
        'Library computer loan history',
        'Staff shift handover notes',
        'Lost and found log book',
        'Membership card swipe records',
      ],
      'reading room': [
        'Study room booking system',
        'Student sign-in registry',
        'CCTV camera positions',
        'Desk lamp touch surfaces',
      ],
      "children's section": [
        'Story time attendance sheet',
        'Parent sign-in log',
        'Activity corner supervision notes',
        'Book return trolley',
      ],
      'staff room': [
        'Personal lockers (search with permission)',
        'Duty roster and leave records',
        'Staff meeting minutes',
        'Personal belongings storage',
      ],

      // Sports locations - where equipment tampering evidence would be found
      'main court': [
        'Scoreboard control panel access',
        'Equipment storage cabinet',
        'Umpire observation notes',
        'Player bench area',
      ],
      'locker rooms': [
        'Locker assignment list',
        'Personal belongings storage',
        'Shower room access times',
        'Team equipment storage',
      ],
      'security office': [
        'CCTV playback terminal',
        'Visitor log book',
        'Access card swipe records',
        'Patrol schedule and notes',
      ],
      'entrance gate': [
        'Visitor registration forms',
        'School bus arrival log',
        'Event ticket stubs',
        'Security checkpoint notes',
      ],

      // Market locations - where fraud evidence would be found
      'fish stall': [
        'Weighing scale (check calibration)',
        'Daily sales record book',
        'Price tag display (original vs current)',
        'Receipt carbon copies',
      ],
      'market office': [
        'Vendor complaint files',
        'License renewal records',
        'CCTV monitoring system',
        'Cash handling records',
      ],
      'storage area': [
        'Cold storage temperature log',
        'Inventory delivery receipts',
        'Vendor access sign-in sheet',
        'Quality inspection records',
      ],
      'weighing station': [
        'Calibration certificate log',
        'Customer complaint forms',
        'NEA inspection records',
        'Verification test weights',
      ],
      'loading bay': [
        'Delivery truck log book',
        'Goods receiving checklist',
        'Time-stamped delivery photos',
        'Vendor identification records',
      ],
    };

    return elements[lowerLocation] || [
      `Evidence collection area in ${locationName}`,
      'Notice board with schedules and announcements',
      'Storage area for personal belongings',
      'CCTV camera coverage zone',
    ];
  };

  // Create scenes from ACTUAL story locations instead of generic templates
  const scenes: Scene[] = [];

  // Scene 1: Primary Crime Scene (keyLocations[0]) - Where the crime happened
  const primaryLocation = keyLocations[0] || 'Main Area';
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: `${primaryLocation} - ${mainLocation}`,
    description: `${narrativeCase.setting.description} The ${narrativeCase.crime.type.replace('_', ' ')} occurred here between ${crimeTimeWindow.start} and ${crimeTimeWindow.end}. ${narrativeCase.setting.dayContext}. This is where ${narrativeCase.crime.target} was last seen.`,
    interactiveElements: [
      `Area where ${narrativeCase.crime.target} was last seen`,
      ...generateInteractiveElements(primaryLocation).slice(0, 3),
    ],
    cluesAvailable: [],
    locationType: locationType,
    sceneType: 'primary' as SceneType,
    ambiance: narrativeCase.setting.timeOfDay === 'morning' ? 'morning' :
              narrativeCase.setting.timeOfDay === 'afternoon' ? 'day' :
              narrativeCase.setting.timeOfDay === 'evening' ? 'evening' : 'day',
    mood: 'mysterious',
  });

  // Scene 2: Secondary location (keyLocations[1]) - Related area
  const secondaryLocation = keyLocations[1] || 'Storage Area';
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: secondaryLocation,
    description: generateSceneDescription(secondaryLocation, 'secondary'),
    interactiveElements: generateInteractiveElements(secondaryLocation),
    cluesAvailable: [],
    locationType: locationType,
    sceneType: 'security' as SceneType,
    ambiance: 'day',
    mood: 'tense',
  });

  // Scene 3: Third location (keyLocations[2]) - Work/activity area
  const tertiaryLocation = keyLocations[2] || 'Work Area';
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: tertiaryLocation,
    description: generateSceneDescription(tertiaryLocation, 'work'),
    interactiveElements: generateInteractiveElements(tertiaryLocation),
    cluesAvailable: [],
    locationType: locationType,
    sceneType: 'work_area' as SceneType,
    ambiance: 'day',
    mood: 'tense',
  });

  // Scene 4: Fourth location (keyLocations[3]) - Investigation focus area
  const quaternaryLocation = keyLocations[3] || 'Investigation Area';
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: quaternaryLocation,
    description: generateSceneDescription(quaternaryLocation, 'investigation'),
    interactiveElements: generateInteractiveElements(quaternaryLocation),
    cluesAvailable: [],
    locationType: locationType,
    sceneType: 'investigation' as SceneType,
    ambiance: 'day',
    mood: 'calm',
  });

  // Scene 5: Fifth location (keyLocations[4]) - Resolution area
  const finalLocation = keyLocations[4] || 'Exit Area';
  scenes.push({
    id: `scene-${nanoid(6)}`,
    name: finalLocation,
    description: `${generateSceneDescription(finalLocation, 'resolution')} ${narrativeCase.culprit.mistakes[0] || 'A critical mistake was made here.'}`,
    interactiveElements: [
      ...generateInteractiveElements(finalLocation).slice(0, 2),
      'Evidence that reveals the truth',
      'Final clue location',
    ],
    cluesAvailable: [],
    locationType: locationType,
    sceneType: 'resolution' as SceneType,
    ambiance: 'evening',
    mood: 'urgent',
  });

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

  // Build RICH suspect data with demeanor from dialogue emotions and PROPER age demographics
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

    // Get PROPER age data based on role - NOT a flimsy heuristic!
    const ageData = getCompatibleAgeForRole(char.role);
    const simplifiedAgeCategory = AGE_RANGES[ageData.ageCategory]?.simplifiedCategory || 'adult';

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
      // PROPER age data from role-based age constraints
      ageGroup: ageData.ageGroup,
      ageCategory: simplifiedAgeCategory as 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior',
      specificAge: ageData.specificAge,
      displayAge: ageData.displayAge,
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


// Main Generator Function
// Uses the new Crime-First, Evidence-Driven Architecture (V2)
// The legacy narrative engine is kept as fallback
export async function generateCase(request: GenerationRequest): Promise<GeneratedCase> {
  // Check if we should use the new architecture (V2)
  // New architecture provides:
  // - Crime-First generation (detailed crime story drives everything)
  // - Evidence-Driven guilt (culprit determined by evidence intersection, not random)
  // - Rich narratives (atmospheric descriptions, dialogue trees)
  // - Scalable and extensible (plugin-based phases)
  const useNewArchitecture = request.useNarrativeEngine !== false; // Default to new architecture

  if (useNewArchitecture) {
    try {
      console.log('[CaseGenerator] Using new Crime-First Architecture (V2)');
      const generatedCase = await generateCaseFromArchitecture({
        difficulty: request.difficulty,
        subject: request.subject,
        gradeLevel: request.gradeLevel,
        puzzleComplexity: request.puzzleComplexity || 'STANDARD',
        constraints: request.constraints,
      });

      // Generate image requests for the case
      const caseContext = {
        title: generatedCase.title,
        subject: request.subject,
        difficulty: request.difficulty,
        gradeLevel: request.gradeLevel,
        story: {
          setting: generatedCase.story.setting,
          crime: generatedCase.story.crime,
          resolution: generatedCase.story.resolution,
          theme: generatedCase.story.backstory || '',
          location: generatedCase.story.setting,
          locationType: 'school' as const,
        },
        timeOfDay: 'afternoon' as const,
        atmosphere: 'mysterious' as const,
      };

      // Build rich suspect data with full age demographics
      const richSuspectData = generatedCase.suspects.map(suspect => {
        // If suspect already has age data, use it; otherwise derive from role
        const hasAgeData = suspect.specificAge !== undefined;
        const ageData = hasAgeData ? {
          ageGroup: suspect.ageGroup || 'middle',
          specificAge: suspect.specificAge!,
          displayAge: suspect.displayAge!,
          ageCategory: suspect.ageCategory!,
        } : getCompatibleAgeForRole(suspect.role);

        // Map ageCategory to simplified ageGroup for backwards compatibility
        const derivedAgeGroup = (suspect.ageCategory === 'child' || suspect.ageCategory === 'teen' || suspect.ageCategory === 'young_adult') ? 'young' as const :
                      (suspect.ageCategory === 'senior') ? 'senior' as const : 'middle' as const;

        return {
          name: suspect.name,
          role: suspect.role,
          alibi: suspect.alibi,
          personality: suspect.personality,
          isGuilty: suspect.isGuilty,
          motive: suspect.motive,
          ethnicity: suspect.ethnicity || inferEthnicityFromCharacter(suspect.name),
          gender: suspect.gender || inferGenderFromCharacter(suspect.name),
          ageGroup: hasAgeData ? derivedAgeGroup : (ageData as ReturnType<typeof getCompatibleAgeForRole>).ageGroup,
          ageCategory: suspect.ageCategory || (ageData as { ageCategory?: string }).ageCategory,
          specificAge: suspect.specificAge || (ageData as { specificAge?: number }).specificAge,
          displayAge: suspect.displayAge || (ageData as { displayAge?: string }).displayAge,
          expression: suspect.isGuilty ? 'nervous' as const : 'neutral' as const,
        };
      });

      // Build rich clue data
      const richClueData = generatedCase.clues.map(clue => ({
        title: clue.title,
        description: `${clue.visualCue || ''}. ${clue.analysisResult || clue.description}`,
        type: clue.type,
        relevance: clue.relevance,
        discoveryLocation: clue.discoveryLocation,
        examinationDetails: clue.examinationDetails || [],
      }));

      // Build scene data
      const richSceneData = generatedCase.scenes.map(scene => ({
        name: scene.name,
        description: scene.description,
        isCrimeScene: scene.sceneType === 'primary',
        crimeType: generatedCase.story.crime,
      }));

      // Generate image requests
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
    } catch (error) {
      console.error('[CaseGenerator] V2 Architecture failed, falling back to legacy:', error);
      // Fall back to legacy engine if new architecture fails
    }
  }

  // Fallback to legacy narrative-driven generation
  console.log('[CaseGenerator] Using legacy narrative engine');
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
