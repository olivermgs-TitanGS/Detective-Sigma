/**
 * NARRATIVE ENGINE
 *
 * Generates cohesive crime stories where all elements connect:
 * - Crime with clear timeline, method, and motive
 * - Suspects with relationships and logical alibis
 * - Evidence that builds toward the truth
 * - Puzzles that unlock story revelations
 */

import { nanoid } from 'nanoid';

// ============================================
// TYPES
// ============================================

export interface TimelineEvent {
  id: string;
  time: string;           // "14:30" format
  timeMinutes: number;    // Minutes from midnight for calculations
  description: string;
  location: string;
  involvedCharacters: string[];
  isKeyEvent: boolean;    // Critical to solving the case
  discoverable: boolean;  // Can player discover this?
}

export interface CrimeDetails {
  type: 'theft' | 'vandalism' | 'fraud' | 'sabotage' | 'missing_item' | 'cheating';
  target: string;         // What was stolen/damaged/etc
  value?: number;         // Monetary value if applicable
  method: string;         // How the crime was committed
  discoveryTime: string;  // When the crime was discovered
  crimeWindow: {          // When the crime could have occurred
    start: string;
    end: string;
  };
}

export interface Motive {
  type: 'financial' | 'revenge' | 'jealousy' | 'pressure' | 'accident' | 'opportunity';
  description: string;
  backstory: string;      // Why this motive exists
  evidence: string[];     // What evidence reveals this motive
}

export interface CulpritProfile {
  suspectIndex: number;   // Which suspect is guilty
  motive: Motive;
  method: string;         // How they committed the crime
  opportunity: string;    // When/how they had access
  mistakes: string[];     // Errors that can expose them
}

export interface NarrativeCase {
  id: string;
  title: string;
  setting: CaseSetting;
  crime: CrimeDetails;
  timeline: TimelineEvent[];
  culprit: CulpritProfile;
  narrativeHook: string;  // Opening hook to grab attention
  resolution: string;     // How the case is solved
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
}

export interface CaseSetting {
  location: string;
  locationType: 'school' | 'community' | 'commercial' | 'residential';
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayContext: string;     // "During the science fair", "On sports day", etc
}

// ============================================
// STORY SCENARIOS - Rich, interconnected templates
// ============================================

interface StoryScenario {
  id: string;
  title: string;
  setting: CaseSetting;
  crime: CrimeDetails;
  possibleMotives: Motive[];
  suspectRoles: SuspectRole[];
  keyLocations: string[];
  subjects: ('MATH' | 'SCIENCE' | 'INTEGRATED')[];
  difficulties: ('ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF')[];
}

interface SuspectRole {
  role: string;
  relationship: string;   // Their relationship to the crime/location
  possibleMotive?: Motive;
  defaultAlibi: string;
  suspiciousBehavior?: string;
  clearingEvidence?: string; // What clears them if innocent
}

export const STORY_SCENARIOS: StoryScenario[] = [
  // ============================================
  // SCHOOL CANTEEN SCENARIOS
  // ============================================
  {
    id: 'canteen-money-missing',
    title: 'The Canteen Cash Mystery',
    setting: {
      location: 'Sunrise Primary School Canteen',
      locationType: 'school',
      description: 'A bustling school canteen serving over 500 students daily, with five food stalls and a central cashier counter.',
      timeOfDay: 'afternoon',
      dayContext: 'During the busy recess period',
    },
    crime: {
      type: 'theft',
      target: 'Cash from the canteen register',
      value: 85,
      method: 'Someone accessed the register during a brief unattended moment',
      discoveryTime: '14:15',
      crimeWindow: { start: '13:30', end: '14:00' },
    },
    possibleMotives: [
      {
        type: 'financial',
        description: 'Needed money urgently',
        backstory: 'Has been struggling with unexpected expenses',
        evidence: ['Bank statements showing low balance', 'Overheard conversation about money troubles'],
      },
      {
        type: 'revenge',
        description: 'Wanted to get the manager in trouble',
        backstory: 'Was passed over for a promotion last month',
        evidence: ['Complaint letter found in locker', 'Testimony about workplace conflict'],
      },
      {
        type: 'opportunity',
        description: 'Saw a chance and took it impulsively',
        backstory: 'No premeditation, just poor judgment',
        evidence: ['No prior planning evidence', 'Nervous behavior after the incident'],
      },
    ],
    suspectRoles: [
      {
        role: 'Canteen Auntie',
        relationship: 'Responsible for all cash handling at the main stall',
        defaultAlibi: 'Was doing inventory in the storeroom',
        suspiciousBehavior: 'Seemed nervous when questioned about the timeline',
        clearingEvidence: 'Inventory log with timestamps shows continuous work',
      },
      {
        role: 'Primary 6 Student Helper',
        relationship: 'Student volunteer who helps clear trays during recess',
        possibleMotive: {
          type: 'opportunity',
          description: 'Saw unattended cash and made an impulsive decision',
          backstory: 'Wanted to buy a new video game that parents refused',
          evidence: ['Search history for video game prices', 'Friend testimony about wanting the game'],
        },
        defaultAlibi: 'Was collecting trays from the far end of the canteen',
        suspiciousBehavior: 'Was seen near the counter when it was unattended',
      },
      {
        role: 'Uncle Security Guard',
        relationship: 'School security guard who patrols during recess',
        defaultAlibi: 'Was at the main gate checking visitor passes',
        clearingEvidence: 'Visitor logbook shows continuous entries',
      },
      {
        role: 'Primary 5 Prefect',
        relationship: 'Student prefect monitoring canteen behavior',
        defaultAlibi: 'Was supervising students at the water cooler area',
        suspiciousBehavior: 'Left monitoring post briefly',
        clearingEvidence: 'Multiple students confirm seeing the prefect there',
      },
    ],
    keyLocations: ['Main counter', 'Storeroom', 'Kitchen', 'Back entrance', 'Toilet'],
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR'],
  },

  // ============================================
  // SCIENCE LAB SCENARIOS
  // ============================================
  {
    id: 'science-fair-sabotage',
    title: 'The Science Fair Sabotage',
    setting: {
      location: 'Harmony Primary School Science Lab',
      locationType: 'school',
      description: 'A well-equipped science laboratory with workbenches, storage cabinets, and a display area for the upcoming Science Fair.',
      timeOfDay: 'afternoon',
      dayContext: 'The day before the annual Science Fair competition',
    },
    crime: {
      type: 'sabotage',
      target: 'A student\'s prize-winning plant growth experiment',
      method: 'Someone poured salt water into the experiment plants, killing them overnight',
      discoveryTime: '08:30',
      crimeWindow: { start: '15:00', end: '18:00' },
    },
    possibleMotives: [
      {
        type: 'jealousy',
        description: 'Wanted to eliminate competition',
        backstory: 'Their own project was not as impressive',
        evidence: ['Comparison photos of both projects', 'Testimony about competitive remarks'],
      },
      {
        type: 'revenge',
        description: 'Had a grudge against the project owner',
        backstory: 'Previous conflict between students',
        evidence: ['Teacher notes about past incidents', 'Witnesses to arguments'],
      },
      {
        type: 'pressure',
        description: 'Under extreme pressure to win',
        backstory: 'Parents have been demanding academic success',
        evidence: ['Parent messages about expectations', 'Teacher observations'],
      },
    ],
    suspectRoles: [
      {
        role: 'Primary 6 Science Club Member',
        relationship: 'Also entering the Science Fair with a similar plant project',
        possibleMotive: {
          type: 'jealousy',
          description: 'Wanted to win the Science Fair at any cost',
          backstory: 'Their plant project was growing slower than the victim\'s',
          evidence: ['Project comparison notes', 'Overheard saying "I need to win"'],
        },
        defaultAlibi: 'Went home at 15:30 after CCA',
        suspiciousBehavior: 'Was seen near the lab after claiming to have left',
      },
      {
        role: 'Primary 5 Student Lab Helper',
        relationship: 'Junior student who helps clean the lab after school',
        defaultAlibi: 'Was wiping down the tables in the back',
        suspiciousBehavior: 'Has been told off by the victim before for being careless',
        clearingEvidence: 'Multiple classmates saw them cleaning tables the whole time',
      },
      {
        role: 'Mrs Tan the Science Teacher',
        relationship: 'Supervises the lab and Science Fair competition',
        defaultAlibi: 'Was in a staff meeting from 15:30-17:00',
        clearingEvidence: 'Meeting attendance and multiple teacher witnesses',
      },
      {
        role: 'Mr Kumar the School Caretaker',
        relationship: 'Has master keys to all rooms including the lab',
        defaultAlibi: 'Was fixing a broken tap in the toilet block',
        suspiciousBehavior: 'Was seen entering the science block around 16:00',
        clearingEvidence: 'Work order log and repair completion timestamp',
      },
    ],
    keyLocations: ['Main lab', 'Storage cabinet', 'Plant display area', 'Lab entrance', 'Equipment room'],
    subjects: ['SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE'],
  },

  // ============================================
  // LIBRARY SCENARIOS
  // ============================================
  {
    id: 'library-book-theft',
    title: 'The Rare Book Disappearance',
    setting: {
      location: 'Central Community Library',
      locationType: 'community',
      description: 'A three-story public library with a special collection room housing rare and valuable books, accessible only to authorized personnel.',
      timeOfDay: 'evening',
      dayContext: 'During extended opening hours for exam season',
    },
    crime: {
      type: 'theft',
      target: 'A rare first-edition book worth $2,000',
      value: 2000,
      method: 'Book was removed from the special collection room and replaced with a replica',
      discoveryTime: '20:00',
      crimeWindow: { start: '17:00', end: '19:30' },
    },
    possibleMotives: [
      {
        type: 'financial',
        description: 'Planned to sell the rare book',
        backstory: 'Knew the book\'s value and had a buyer lined up',
        evidence: ['Online listing draft found', 'Messages to potential buyer'],
      },
      {
        type: 'jealousy',
        description: 'Book collector who couldn\'t afford to buy it legitimately',
        backstory: 'Had been trying to acquire this book for years',
        evidence: ['Collection obsession evidence', 'Previous purchase attempts'],
      },
    ],
    suspectRoles: [
      {
        role: 'Ms Wong the Senior Librarian',
        relationship: 'Has full access to special collection room',
        possibleMotive: {
          type: 'financial',
          description: 'Struggling with debts',
          backstory: 'Recently divorced and paying for children\'s tuition',
          evidence: ['Court documents', 'Loan statements'],
        },
        defaultAlibi: 'Was at the front desk most of the evening',
        suspiciousBehavior: 'Made several trips to the special collection room',
      },
      {
        role: 'Secondary School Student Volunteer',
        relationship: 'Teen volunteer who shelves books on weekends',
        defaultAlibi: 'Was shelving books in the children\'s section',
        clearingEvidence: 'CCTV shows continuous presence in children\'s area',
      },
      {
        role: 'Uncle Rajan the Security Guard',
        relationship: 'Veteran guard who patrols the building including special collection',
        defaultAlibi: 'Was doing rounds on the first floor',
        suspiciousBehavior: 'Patrol log shows a 20-minute gap',
      },
      {
        role: 'Primary 6 Student',
        relationship: 'Frequent library visitor studying for PSLE',
        defaultAlibi: 'Was in the study area doing homework with friends',
        suspiciousBehavior: 'Asked a lot of questions about the special collection room',
        clearingEvidence: 'Study group friends confirm being together the whole time',
      },
    ],
    keyLocations: ['Special collection room', 'Front desk', 'Reading room', 'Children\'s section', 'Staff room'],
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['DETECTIVE', 'CHIEF'],
  },

  // ============================================
  // SPORTS EVENT SCENARIOS
  // ============================================
  {
    id: 'sports-equipment-tampering',
    title: 'The Championship Equipment Mystery',
    setting: {
      location: 'Sports Excellence Academy',
      locationType: 'school',
      description: 'A prestigious sports school with Olympic-standard facilities, hosting the inter-school badminton championship.',
      timeOfDay: 'morning',
      dayContext: 'On the morning of the championship finals',
    },
    crime: {
      type: 'sabotage',
      target: 'Championship badminton rackets',
      method: 'Someone loosened the string tension on the favorite team\'s rackets',
      discoveryTime: '09:00',
      crimeWindow: { start: '06:00', end: '08:30' },
    },
    possibleMotives: [
      {
        type: 'pressure',
        description: 'Under pressure to ensure their team wins',
        backstory: 'Coach\'s job depends on winning this championship',
        evidence: ['Performance review documents', 'Overheard argument with principal'],
      },
      {
        type: 'revenge',
        description: 'Wanted to humiliate the star player',
        backstory: 'Personal conflict with the player',
        evidence: ['Social media posts', 'Witness accounts of bullying'],
      },
    ],
    suspectRoles: [
      {
        role: 'Mr Lee the Opposing Team Coach',
        relationship: 'Coach of the rival school team with strong motivation to win',
        possibleMotive: {
          type: 'pressure',
          description: 'Will be fired if team loses again',
          backstory: 'Has lost the last three championships to this school',
          evidence: ['Warning letter from school board', 'Desperate behavior'],
        },
        defaultAlibi: 'Claims to have arrived at 08:00 with the team',
        suspiciousBehavior: 'Security log shows entry at 06:45',
      },
      {
        role: 'Primary 6 Team Captain',
        relationship: 'Captain of the home team and main user of the sabotaged rackets',
        defaultAlibi: 'Was doing warm-up exercises on the court from 08:00',
        clearingEvidence: 'Coach and teammates confirm continuous presence',
      },
      {
        role: 'Primary 5 Reserve Player',
        relationship: 'Backup player who rarely gets to play in big matches',
        possibleMotive: {
          type: 'jealousy',
          description: 'Jealous of the star player getting all the attention',
          backstory: 'Has been overshadowed by the team captain for two years',
          evidence: ['Diary entries about feeling unappreciated', 'Friend testimony'],
        },
        defaultAlibi: 'Was at home until 08:30 with parents',
        suspiciousBehavior: 'Has expressed frustration about not playing',
        clearingEvidence: 'Parent drove them and confirms arrival time',
      },
      {
        role: 'Auntie Fatimah the Equipment Room Cleaner',
        relationship: 'Cleans the sports hall and has access to the equipment room',
        defaultAlibi: 'Was mopping the corridor from 06:00-07:30',
        suspiciousBehavior: 'Was seen near the equipment room early morning',
        clearingEvidence: 'CCTV shows her in corridor, not inside equipment room',
      },
    ],
    keyLocations: ['Equipment room', 'Main court', 'Locker rooms', 'Security office', 'Entrance gate'],
    subjects: ['MATH', 'SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE'],
  },

  // ============================================
  // MARKET SCENARIOS
  // ============================================
  {
    id: 'market-overcharging-scheme',
    title: 'The Wet Market Fraud',
    setting: {
      location: 'Tiong Bahru Wet Market',
      locationType: 'commercial',
      description: 'A traditional Singapore wet market with over 50 stalls selling fresh produce, meat, and seafood.',
      timeOfDay: 'morning',
      dayContext: 'During the busy weekend morning rush',
    },
    crime: {
      type: 'fraud',
      target: 'Customers being systematically overcharged',
      value: 500, // Estimated weekly fraud amount
      method: 'Rigged weighing scale showing heavier weights than actual',
      discoveryTime: '11:00',
      crimeWindow: { start: '06:00', end: '11:00' },
    },
    possibleMotives: [
      {
        type: 'financial',
        description: 'Trying to recover from business losses',
        backstory: 'Stall rental has increased significantly',
        evidence: ['Rental increase notice', 'Declining profit records'],
      },
      {
        type: 'opportunity',
        description: 'Discovered they could get away with small overcharges',
        backstory: 'Started small and got greedy',
        evidence: ['Pattern of increasing overcharges over time'],
      },
    ],
    suspectRoles: [
      {
        role: 'Uncle Ah Hock the Fishmonger',
        relationship: 'Owns and operates the fish stall for 20 years',
        possibleMotive: {
          type: 'financial',
          description: 'Facing bankruptcy if sales don\'t improve',
          backstory: 'Took out a large loan to renovate the stall after COVID',
          evidence: ['Bank loan documents', 'Desperate behavior'],
        },
        defaultAlibi: 'Claims the scale must have been broken',
        suspiciousBehavior: 'Recently replaced the weighing scale',
      },
      {
        role: 'Secondary School Part-Time Helper',
        relationship: 'Teen who helps at the stall on weekends for pocket money',
        defaultAlibi: 'Just follows boss instructions, doesn\'t handle the scale',
        clearingEvidence: 'Only works Saturdays, fraud happened on weekdays too',
      },
      {
        role: 'Ah Kow the Scale Repairman',
        relationship: 'Technician who maintains and calibrates market scales',
        defaultAlibi: 'Last serviced that scale two weeks ago',
        suspiciousBehavior: 'Service record doesn\'t match owner\'s claim about dates',
      },
      {
        role: 'Auntie Mary from the Next Stall',
        relationship: 'Competing vegetable seller who\'s been here 15 years',
        defaultAlibi: 'Was busy with own customers all morning',
        suspiciousBehavior: 'Has been complaining about Ah Hock stealing her customers',
        clearingEvidence: 'No access to competitor\'s equipment',
      },
    ],
    keyLocations: ['Fish stall', 'Market office', 'Storage area', 'Weighing station', 'Loading bay'],
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR'],
  },
];

// ============================================
// NARRATIVE GENERATION FUNCTIONS
// ============================================

/**
 * Selects an appropriate scenario based on subject and difficulty
 */
export function selectScenario(
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF'
): StoryScenario {
  const suitable = STORY_SCENARIOS.filter(
    s => s.subjects.includes(subject) && s.difficulties.includes(difficulty)
  );

  if (suitable.length === 0) {
    // Fallback to any scenario that matches subject
    const fallback = STORY_SCENARIOS.filter(s => s.subjects.includes(subject));
    return fallback[Math.floor(Math.random() * fallback.length)] || STORY_SCENARIOS[0];
  }

  return suitable[Math.floor(Math.random() * suitable.length)];
}

/**
 * Generates a complete crime timeline
 */
export function generateTimeline(
  scenario: StoryScenario,
  culpritIndex: number
): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const { crime, suspectRoles } = scenario;

  // Parse crime window times
  const crimeStart = parseTime(crime.crimeWindow.start);
  const crimeEnd = parseTime(crime.crimeWindow.end);
  const discoveryTime = parseTime(crime.discoveryTime);

  // 1. Scene setting - normal activities begin
  events.push({
    id: nanoid(6),
    time: subtractMinutes(crime.crimeWindow.start, 60),
    timeMinutes: crimeStart - 60,
    description: `Normal activities begin at ${scenario.setting.location}`,
    location: scenario.setting.location,
    involvedCharacters: suspectRoles.map(s => s.role),
    isKeyEvent: false,
    discoverable: true,
  });

  // 2. Each suspect's activities before the crime
  suspectRoles.forEach((suspect, index) => {
    const isCulprit = index === culpritIndex;
    const timeOffset = (index + 1) * 15;

    events.push({
      id: nanoid(6),
      time: subtractMinutes(crime.crimeWindow.start, timeOffset),
      timeMinutes: crimeStart - timeOffset,
      description: isCulprit
        ? `${suspect.role} seen near the scene, claims: "${suspect.defaultAlibi}"`
        : `${suspect.role}: ${suspect.defaultAlibi}`,
      location: isCulprit ? scenario.keyLocations[0] : scenario.keyLocations[index + 1] || scenario.keyLocations[0],
      involvedCharacters: [suspect.role],
      isKeyEvent: isCulprit,
      discoverable: true,
    });
  });

  // 3. The crime occurs
  const crimeTimeMinutes = crimeStart + Math.floor((crimeEnd - crimeStart) / 2);
  events.push({
    id: nanoid(6),
    time: formatMinutes(crimeTimeMinutes),
    timeMinutes: crimeTimeMinutes,
    description: `THE CRIME: ${crime.method}`,
    location: scenario.keyLocations[0],
    involvedCharacters: [suspectRoles[culpritIndex].role],
    isKeyEvent: true,
    discoverable: false, // Player must deduce this
  });

  // 4. Suspicious behavior (if culprit has one)
  const culprit = suspectRoles[culpritIndex];
  if (culprit.suspiciousBehavior) {
    events.push({
      id: nanoid(6),
      time: addMinutes(formatMinutes(crimeTimeMinutes), 10),
      timeMinutes: crimeTimeMinutes + 10,
      description: culprit.suspiciousBehavior,
      location: scenario.keyLocations[0],
      involvedCharacters: [culprit.role],
      isKeyEvent: true,
      discoverable: true,
    });
  }

  // 5. Crime discovered
  events.push({
    id: nanoid(6),
    time: crime.discoveryTime,
    timeMinutes: discoveryTime,
    description: `Crime discovered: ${crime.target} is ${crime.type === 'theft' ? 'missing' : 'damaged'}`,
    location: scenario.keyLocations[0],
    involvedCharacters: [],
    isKeyEvent: true,
    discoverable: true,
  });

  // Sort by time
  return events.sort((a, b) => a.timeMinutes - b.timeMinutes);
}

/**
 * Creates the culprit profile with motive and method
 */
export function createCulpritProfile(
  scenario: StoryScenario,
  culpritIndex: number
): CulpritProfile {
  const culprit = scenario.suspectRoles[culpritIndex];

  // Use the suspect's specific motive if they have one, otherwise pick from scenario motives
  const motive = culprit.possibleMotive ||
    scenario.possibleMotives[Math.floor(Math.random() * scenario.possibleMotives.length)];

  return {
    suspectIndex: culpritIndex,
    motive,
    method: scenario.crime.method,
    opportunity: `Had access during the crime window while claiming: "${culprit.defaultAlibi}"`,
    mistakes: [
      `${culprit.suspiciousBehavior || 'Inconsistent alibi timeline'}`,
      `Physical evidence linking them to the scene`,
      `Motive evidence: ${motive.evidence[0]}`,
    ],
  };
}

/**
 * Generates a compelling narrative hook
 */
export function generateNarrativeHook(scenario: StoryScenario): string {
  const hooks = [
    `The morning started like any other at ${scenario.setting.location}. But by ${scenario.crime.discoveryTime}, everything had changed.`,
    `${scenario.setting.dayContext}, no one expected trouble. Then came the discovery that would shake everyone.`,
    `It was supposed to be a normal day. ${scenario.setting.description} But someone had other plans.`,
    `When the ${scenario.crime.type} was discovered at ${scenario.crime.discoveryTime}, fingers started pointing. But who really did it?`,
  ];

  return hooks[Math.floor(Math.random() * hooks.length)];
}

/**
 * Main function: Generate a complete narrative case
 */
export function generateNarrativeCase(
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF'
): NarrativeCase {
  // 1. Select appropriate scenario
  const scenario = selectScenario(subject, difficulty);

  // 2. Determine the culprit (random from suspects with motives, or any suspect)
  const suspectsWithMotives = scenario.suspectRoles
    .map((s, i) => ({ suspect: s, index: i }))
    .filter(s => s.suspect.possibleMotive);

  const culpritIndex = suspectsWithMotives.length > 0
    ? suspectsWithMotives[Math.floor(Math.random() * suspectsWithMotives.length)].index
    : Math.floor(Math.random() * scenario.suspectRoles.length);

  // 3. Generate timeline
  const timeline = generateTimeline(scenario, culpritIndex);

  // 4. Create culprit profile
  const culprit = createCulpritProfile(scenario, culpritIndex);

  // 5. Generate narrative hook
  const narrativeHook = generateNarrativeHook(scenario);

  // 6. Create resolution
  const resolution = `By analyzing the evidence, you discovered that the ${scenario.suspectRoles[culpritIndex].role} committed the ${scenario.crime.type}. ${culprit.motive.description}. The key evidence was: ${culprit.mistakes.join('; ')}.`;

  return {
    id: `case-${nanoid(10)}`,
    title: scenario.title,
    setting: scenario.setting,
    crime: scenario.crime,
    timeline,
    culprit,
    narrativeHook,
    resolution,
    difficulty,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function subtractMinutes(timeStr: string, minutes: number): string {
  return formatMinutes(parseTime(timeStr) - minutes);
}

function addMinutes(timeStr: string, minutes: number): string {
  return formatMinutes(parseTime(timeStr) + minutes);
}

export { STORY_SCENARIOS as StoryScenarios };
