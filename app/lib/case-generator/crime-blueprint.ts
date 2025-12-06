/**
 * CRIME BLUEPRINT GENERATOR
 *
 * Creates detailed, procedurally-generated crime choreography that serves as
 * the foundation for all other case elements. This is the "short story" that
 * drives suspects, evidence, scenes, and puzzles.
 *
 * Philosophy: Generate a RICH story first, then derive everything else from it.
 */

import { nanoid } from 'nanoid';

// ============================================
// CORE TYPES
// ============================================

export type CrimeType = 'theft' | 'vandalism' | 'fraud' | 'sabotage' | 'cheating';

export interface TimeWindow {
  start: string;      // "14:30" format
  end: string;
  startMinutes: number;
  endMinutes: number;
}

export interface CrimeStep {
  id: string;
  time: string;
  timeMinutes: number;
  phase: 'preparation' | 'execution' | 'aftermath';
  action: string;           // What happened
  location: string;         // Where it happened
  details: string;          // Rich narrative description
  tracesLeft: string[];     // Evidence created by this step
  observableBy: string[];   // Who could have witnessed this
  soundsMade?: string;      // What sounds were made
  objectsInteracted?: string[]; // What objects were touched/moved
}

export interface TracePoint {
  id: string;
  type: 'physical' | 'digital' | 'testimonial' | 'material';
  category: string;         // fingerprint, footprint, cctv, witness, document, etc.
  location: string;
  description: string;
  linkedToStepId: string;
  discoveryDifficulty: 'obvious' | 'careful' | 'forensic';
  narrativeReveal: string;  // What this evidence tells the detective
  canContradict?: string;   // What alibi/claim this could contradict
}

export interface WitnessOpportunity {
  witnessRole: string;
  location: string;
  time: string;
  whatTheySaw: string;
  whatTheyHeard?: string;
  reliability: 'reliable' | 'partial' | 'unreliable';
}

export interface SceneLayout {
  name: string;
  description: string;          // Rich atmospheric description
  layout: string;               // Physical layout description
  normalActivity: string;       // What usually happens here
  accessPoints: AccessPoint[];
  keyAreas: SceneArea[];
  atmosphere: {
    lighting: string;
    sounds: string;
    smells: string;
    mood: string;
  };
}

export interface AccessPoint {
  name: string;
  type: 'main_entrance' | 'back_door' | 'window' | 'emergency_exit' | 'service_entrance';
  visibility: 'public' | 'semi-private' | 'hidden';
  requiresKey: boolean;
  monitored: boolean;           // Has CCTV or witnesses
}

export interface SceneArea {
  name: string;
  description: string;
  containsTarget: boolean;      // Is the crime target here?
  evidenceZone: boolean;        // Can evidence be found here?
  accessRestricted: boolean;
}

// ============================================
// CRIME BLUEPRINT - The Complete Crime Story
// ============================================

export interface CrimeBlueprint {
  id: string;

  // The Crime Story
  crimeType: CrimeType;
  title: string;                // "The Missing Science Project"
  opening: string;              // Noir-style opening paragraph

  // What Was Targeted
  target: {
    name: string;               // "The championship trophy"
    description: string;        // Rich description of the target
    value: number;              // Monetary/sentimental value
    significance: string;       // Why it matters
    location: string;           // Where it was kept
    normalSecurity: string;     // How it was normally protected
  };

  // Detailed Crime Choreography
  choreography: {
    preparation: CrimeStep[];   // Planning and setup (before crime window)
    execution: CrimeStep[];     // The crime itself
    aftermath: CrimeStep[];     // Cover-up and escape
  };

  // All Evidence Traces
  traces: {
    physical: TracePoint[];     // Fingerprints, footprints, DNA
    digital: TracePoint[];      // Access logs, CCTV, transactions
    testimonial: TracePoint[];  // Witness observations
    material: TracePoint[];     // Objects moved, damaged, missing
  };

  // Crime Timeline
  timeline: {
    dayContext: string;         // "The day of the Science Fair"
    normalStartTime: string;    // When the day began
    preparationWindow: TimeWindow;
    crimeWindow: TimeWindow;
    discoveryTime: string;
    discoveryCircumstances: string;  // How was it discovered?
  };

  // Scene Context
  primaryScene: SceneLayout;
  relatedScenes: SceneLayout[];

  // Witness Opportunities
  witnessOpportunities: WitnessOpportunity[];

  // Narrative Elements
  narrative: {
    hook: string;               // Opening mystery hook
    tension: string;            // What creates suspense
    twist: string;              // Surprising element
    resolution: string;         // How the case is solved
  };
}

// ============================================
// GENERATION COMPONENTS
// ============================================

interface CrimeTemplate {
  type: CrimeType;
  targets: TargetTemplate[];
  methods: MethodTemplate[];
  scenes: SceneTemplate[];
}

interface TargetTemplate {
  name: string;
  valueRange: [number, number];
  significance: string[];
  securityLevels: string[];
}

interface MethodTemplate {
  name: string;
  steps: {
    phase: 'preparation' | 'execution' | 'aftermath';
    actionTemplate: string;
    tracesCreated: string[];
    timeNeeded: number;       // minutes
  }[];
  requiredAccess: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SceneTemplate {
  type: string;
  names: string[];
  descriptions: string[];
  layouts: string[];
  accessPoints: AccessPoint[];
  areas: { name: string; description: string }[];
  atmospheres: {
    lighting: string;
    sounds: string;
    smells: string;
    mood: string;
  }[];
}

// ============================================
// CRIME TEMPLATES - Expandable Data Library
// ============================================

const CRIME_TEMPLATES: CrimeTemplate[] = [
  // ========== THEFT ==========
  {
    type: 'theft',
    targets: [
      {
        name: 'cash register money',
        valueRange: [50, 200],
        significance: [
          'The daily takings that the canteen depends on',
          'Money meant for the week\'s supplies',
          'Carefully counted earnings from a busy day',
        ],
        securityLevels: [
          'kept in an unlocked drawer during operating hours',
          'stored in a lockbox with a simple combination',
          'held in the register with a basic lock',
        ],
      },
      {
        name: 'rare book collection',
        valueRange: [500, 5000],
        significance: [
          'A first edition donated by a famous alumnus',
          'The library\'s most prized historical text',
          'An irreplaceable manuscript from the colonial era',
        ],
        securityLevels: [
          'displayed in a glass case with a simple lock',
          'kept in the restricted section behind the counter',
          'stored in a climate-controlled archive room',
        ],
      },
      {
        name: 'championship trophy',
        valueRange: [100, 500],
        significance: [
          'The symbol of three years of hard work',
          'The school\'s pride and joy won at nationals',
          'A legacy trophy passed between champions',
        ],
        securityLevels: [
          'displayed proudly in the front showcase',
          'kept in the sports office when not displayed',
          'stored in the principal\'s meeting room',
        ],
      },
      {
        name: 'science equipment',
        valueRange: [200, 1000],
        significance: [
          'New microscopes just purchased this term',
          'Specialized lab equipment for experiments',
          'The only working set of precision instruments',
        ],
        securityLevels: [
          'left on the lab bench after class',
          'stored in the equipment cabinet',
          'locked in the preparation room',
        ],
      },
      {
        name: 'exam papers',
        valueRange: [0, 0],
        significance: [
          'Next week\'s important final exam',
          'The PSLE practice papers kept confidential',
          'Answer sheets that would give unfair advantage',
        ],
        securityLevels: [
          'locked in the teacher\'s desk drawer',
          'stored in the staff room filing cabinet',
          'kept in the secure examination office',
        ],
      },
    ],
    methods: [
      {
        name: 'opportunistic grab',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Waited for the right moment when {location} was unattended',
            tracesCreated: ['nervous pacing footprints', 'fingerprints on nearby surfaces'],
            timeNeeded: 5,
          },
          {
            phase: 'execution',
            actionTemplate: 'Quickly grabbed {target} from {targetLocation}',
            tracesCreated: ['fingerprints on container', 'disturbed items', 'missing inventory'],
            timeNeeded: 2,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Hurried away, accidentally {mistake}',
            tracesCreated: ['dropped item', 'partial footprint', 'caught on peripheral CCTV'],
            timeNeeded: 3,
          },
        ],
        requiredAccess: 'normal visitor access',
        difficulty: 'easy',
      },
      {
        name: 'planned theft with key',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Obtained access to {accessMethod} through {accessReason}',
            tracesCreated: ['key access log', 'sign-out sheet anomaly'],
            timeNeeded: 10,
          },
          {
            phase: 'preparation',
            actionTemplate: 'Scouted the location to learn the timing of {routine}',
            tracesCreated: ['unusual presence noted by witness', 'questions asked about schedule'],
            timeNeeded: 15,
          },
          {
            phase: 'execution',
            actionTemplate: 'Used {accessMethod} to enter when {opportunityWindow}',
            tracesCreated: ['access log entry', 'door sensor timestamp'],
            timeNeeded: 2,
          },
          {
            phase: 'execution',
            actionTemplate: 'Carefully removed {target}, trying not to leave traces',
            tracesCreated: ['glove fibers', 'slight scratch marks', 'dust disturbance pattern'],
            timeNeeded: 5,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Attempted to make the scene look undisturbed, but {oversight}',
            tracesCreated: ['item slightly misaligned', 'cleaning supplies moved', 'time gap unexplained'],
            timeNeeded: 5,
          },
        ],
        requiredAccess: 'key or code access',
        difficulty: 'medium',
      },
      {
        name: 'distraction and grab',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Planned a distraction to draw attention away from {targetLocation}',
            tracesCreated: ['prepared distraction materials', 'communication with accomplice'],
            timeNeeded: 10,
          },
          {
            phase: 'execution',
            actionTemplate: 'Created distraction by {distractionMethod}',
            tracesCreated: ['distraction evidence', 'witness to unusual event'],
            timeNeeded: 3,
          },
          {
            phase: 'execution',
            actionTemplate: 'While everyone was distracted, quickly took {target}',
            tracesCreated: ['fingerprints', 'rushed footprints', 'timer overlap with distraction'],
            timeNeeded: 2,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Blended back into the crowd, but {behaviorChange}',
            tracesCreated: ['witness noticed return', 'bag suddenly heavier', 'nervous behavior'],
            timeNeeded: 5,
          },
        ],
        requiredAccess: 'public access',
        difficulty: 'medium',
      },
    ],
    scenes: [
      {
        type: 'canteen',
        names: ['Rainbow Primary School Canteen', 'Harmony School Cafeteria', 'Sunrise Primary Food Court'],
        descriptions: [
          'A bustling space filled with the aroma of freshly cooked food and the chatter of hungry students',
          'The heart of the school where everyone gathers during recess, lined with colorful food stalls',
          'A modern canteen with neat rows of tables and a central counter that never seems to rest',
        ],
        layouts: [
          'Five food stalls line the back wall, with the cashier counter positioned at the main entrance',
          'An L-shaped serving counter wraps around the corner, with the register near the exit',
          'The central kitchen area is flanked by ordering counters, with storage rooms behind',
        ],
        accessPoints: [
          { name: 'Main entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
          { name: 'Kitchen back door', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: false },
          { name: 'Service window', type: 'service_entrance', visibility: 'semi-private', requiresKey: false, monitored: false },
          { name: 'Storeroom entrance', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: false },
        ],
        areas: [
          { name: 'Cashier Counter', description: 'The busy payment point with a well-used cash register' },
          { name: 'Kitchen Area', description: 'Hot, steamy, and filled with the sounds of cooking' },
          { name: 'Storeroom', description: 'Shelves stacked high with ingredients and supplies' },
          { name: 'Seating Area', description: 'Rows of tables where students eat and chat' },
          { name: 'Dishwashing Station', description: 'A wet area with stacked trays and running water' },
        ],
        atmospheres: [
          { lighting: 'Bright fluorescent lights illuminate everything', sounds: 'The clatter of trays and hum of conversation', smells: 'A mix of fried rice, chicken, and sweet drinks', mood: 'Busy and energetic' },
          { lighting: 'Warm lighting from overhead fixtures', sounds: 'Sizzling from the wok station, coins clinking', smells: 'Fresh bread and curry aromas', mood: 'Comforting and chaotic' },
        ],
      },
      {
        type: 'library',
        names: ['Central Community Library', 'Heritage Public Library', 'Knowledge Hub Library'],
        descriptions: [
          'A quiet sanctuary of knowledge, where shelves reach toward the ceiling and the smell of old books fills the air',
          'A modern library with glass walls letting in natural light, mixed with cozy reading nooks',
          'Three floors of carefully organized books, from children\'s picture books to ancient manuscripts',
        ],
        layouts: [
          'The front desk faces the entrance, with the special collection room tucked in the back corner',
          'A circular layout with the librarian\'s station at the center, rare books kept in a locked display',
          'The ground floor is open and welcoming, with restricted sections requiring staff escort',
        ],
        accessPoints: [
          { name: 'Main entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
          { name: 'Staff entrance', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: true },
          { name: 'Emergency exit', type: 'emergency_exit', visibility: 'semi-private', requiresKey: false, monitored: false },
          { name: 'Special collection door', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: true },
        ],
        areas: [
          { name: 'Front Desk', description: 'Where librarians check out books and answer questions' },
          { name: 'Special Collection Room', description: 'A climate-controlled room with rare and valuable books' },
          { name: 'Reading Area', description: 'Comfortable chairs and quiet tables for study' },
          { name: 'Children\'s Section', description: 'Colorful and inviting, with small furniture and picture books' },
          { name: 'Staff Room', description: 'Where librarians take breaks and store personal items' },
        ],
        atmospheres: [
          { lighting: 'Soft, diffused lighting to protect the books', sounds: 'Hushed whispers and pages turning', smells: 'The unmistakable scent of old paper and leather', mood: 'Peaceful and scholarly' },
          { lighting: 'A mix of natural light from skylights and warm lamp glow', sounds: 'Quiet footsteps on carpet, distant keyboard typing', smells: 'Fresh coffee from the reading cafe', mood: 'Welcoming and focused' },
        ],
      },
      {
        type: 'science_lab',
        names: ['Science Discovery Lab', 'STEM Innovation Centre', 'Bright Minds Laboratory'],
        descriptions: [
          'A space where curiosity comes alive, with beakers bubbling and experiments in progress',
          'State-of-the-art equipment lines the walls, and the periodic table watches over everything',
          'Workbenches arranged in neat rows, each equipped for the next great discovery',
        ],
        layouts: [
          'Central demonstration table with student workbenches radiating outward, storage along the walls',
          'Two rows of lab benches face the smart board, with the prep room door at the back',
          'An open floor plan with mobile equipment stations and a secure chemical storage closet',
        ],
        accessPoints: [
          { name: 'Main door', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: false },
          { name: 'Prep room door', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: false },
          { name: 'Emergency exit', type: 'emergency_exit', visibility: 'semi-private', requiresKey: false, monitored: false },
          { name: 'Equipment storage', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: false },
        ],
        areas: [
          { name: 'Demonstration Table', description: 'Where the teacher shows experiments to the class' },
          { name: 'Student Workbenches', description: 'Individual stations with sinks, burners, and equipment' },
          { name: 'Chemical Storage', description: 'A locked closet with carefully organized chemicals' },
          { name: 'Equipment Cabinet', description: 'Glass-fronted cabinets showing microscopes and instruments' },
          { name: 'Prep Room', description: 'Where teachers prepare experiments before class' },
        ],
        atmospheres: [
          { lighting: 'Bright white lights for precise work', sounds: 'The hum of equipment and occasional bubbling', smells: 'A faint chemical tang mixed with hand sanitizer', mood: 'Curious and focused' },
          { lighting: 'Natural light from large windows, supplemented by desk lamps', sounds: 'Quiet concentration, pencils scratching on paper', smells: 'The green smell of growing plants from an experiment', mood: 'Inquisitive and orderly' },
        ],
      },
    ],
  },

  // ========== SABOTAGE ==========
  {
    type: 'sabotage',
    targets: [
      {
        name: 'science fair project',
        valueRange: [0, 100],
        significance: [
          'Weeks of careful work growing plants under different conditions',
          'A robotics project that took the whole term to build',
          'The volcano model that was certain to win first place',
        ],
        securityLevels: [
          'left overnight in the lab for the morning display',
          'stored in the project room with other entries',
          'kept on the display table already set up',
        ],
      },
      {
        name: 'sports equipment',
        valueRange: [50, 300],
        significance: [
          'The team\'s lucky rackets used in every championship',
          'New sports gear just purchased for the competition',
          'Carefully maintained equipment checked before every game',
        ],
        securityLevels: [
          'locked in the sports equipment room overnight',
          'stored in the team lockers with simple padlocks',
          'left in the changing room during practice',
        ],
      },
      {
        name: 'computer system',
        valueRange: [500, 2000],
        significance: [
          'The server running the school\'s examination system',
          'Computers set up for the upcoming coding competition',
          'The media room equipment for the school production',
        ],
        securityLevels: [
          'password protected but left logged in',
          'in a locked room with key access for staff',
          'protected by the school\'s network security',
        ],
      },
    ],
    methods: [
      {
        name: 'chemical sabotage',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Obtained {sabotageAgent} from {source}',
            tracesCreated: ['missing supplies from storage', 'search history on effects', 'residue on hands'],
            timeNeeded: 15,
          },
          {
            phase: 'execution',
            actionTemplate: 'Applied {sabotageAgent} to {target} while unobserved',
            tracesCreated: ['chemical traces on target', 'container hidden nearby', 'distinctive smell'],
            timeNeeded: 5,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Disposed of evidence by {disposalMethod}, but left {evidence}',
            tracesCreated: ['disposed container', 'chemical trace on personal items', 'unusual behavior afterward'],
            timeNeeded: 5,
          },
        ],
        requiredAccess: 'access to target location',
        difficulty: 'medium',
      },
      {
        name: 'physical tampering',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Learned how {target} works by {researchMethod}',
            tracesCreated: ['browsing history', 'questions asked to experts', 'observation noted'],
            timeNeeded: 20,
          },
          {
            phase: 'execution',
            actionTemplate: 'Physically modified {target} by {tamperMethod}',
            tracesCreated: ['tool marks', 'fingerprints on mechanism', 'subtle misalignment'],
            timeNeeded: 10,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Made the sabotage look like {coverStory}',
            tracesCreated: ['inconsistent damage pattern', 'timing doesn\'t match story', 'witness to presence'],
            timeNeeded: 5,
          },
        ],
        requiredAccess: 'access to target and time alone',
        difficulty: 'hard',
      },
    ],
    scenes: [
      {
        type: 'sports_facility',
        names: ['Champions Sports Hall', 'Victory Gymnasium', 'Athletics Excellence Centre'],
        descriptions: [
          'A massive indoor hall echoing with the squeak of shoes and the thwack of rackets',
          'Olympic-standard facilities with gleaming floors and championship banners hanging high',
          'A multi-purpose sports complex with courts, tracks, and state-of-the-art equipment',
        ],
        layouts: [
          'The main court dominates the center, with equipment rooms along the side walls',
          'Multiple badminton courts side by side, changing rooms at either end',
          'A central arena surrounded by spectator seating, equipment storage underneath',
        ],
        accessPoints: [
          { name: 'Main entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
          { name: 'Player entrance', type: 'back_door', visibility: 'semi-private', requiresKey: false, monitored: false },
          { name: 'Equipment room', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: false },
          { name: 'Emergency exit', type: 'emergency_exit', visibility: 'public', requiresKey: false, monitored: false },
        ],
        areas: [
          { name: 'Main Court', description: 'The competition floor with official markings and nets' },
          { name: 'Equipment Room', description: 'Racks of rackets, shuttlecocks, and team gear' },
          { name: 'Changing Rooms', description: 'Lockers and benches where players prepare' },
          { name: 'Coach\'s Office', description: 'A small room with strategy boards and video equipment' },
          { name: 'Spectator Area', description: 'Tiered seating for parents and supporters' },
        ],
        atmospheres: [
          { lighting: 'Powerful overhead lights illuminate every corner', sounds: 'The echo of bouncing balls and referee whistles', smells: 'Rubber mats and sports drinks', mood: 'Competitive and electric' },
          { lighting: 'Natural light from high windows during the day', sounds: 'Sneakers squeaking, encouragement being shouted', smells: 'Fresh sweat and floor polish', mood: 'Energetic and determined' },
        ],
      },
    ],
  },

  // ========== FRAUD ==========
  {
    type: 'fraud',
    targets: [
      {
        name: 'examination answers',
        valueRange: [0, 0],
        significance: [
          'The upcoming PSLE papers worth years of preparation',
          'End-of-year exams that determine class placement',
          'A competitive test for scholarship positions',
        ],
        securityLevels: [
          'kept in a sealed envelope in the staff room',
          'stored on a password-protected computer',
          'locked in the examination office safe',
        ],
      },
      {
        name: 'competition submission',
        valueRange: [0, 500],
        significance: [
          'The essay that would win the national writing award',
          'The coding solution for the programming olympiad',
          'The art piece submitted for the prestigious competition',
        ],
        securityLevels: [
          'submitted online through the school system',
          'handed in as a physical document',
          'stored on the school server',
        ],
      },
      {
        name: 'financial records',
        valueRange: [100, 5000],
        significance: [
          'The canteen\'s daily transaction records',
          'The school bookshop\'s inventory and sales',
          'The PTA fund collection records',
        ],
        securityLevels: [
          'recorded in a simple ledger book',
          'tracked on a basic spreadsheet',
          'managed through accounting software',
        ],
      },
    ],
    methods: [
      {
        name: 'document alteration',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Gained access to {target} through {accessMethod}',
            tracesCreated: ['access log entry', 'witness to unauthorized access', 'unusual login time'],
            timeNeeded: 10,
          },
          {
            phase: 'execution',
            actionTemplate: 'Modified {target} by {alterationMethod}',
            tracesCreated: ['file modification timestamp', 'version history', 'inconsistent formatting'],
            timeNeeded: 15,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Tried to cover tracks by {coverMethod}, but {mistake}',
            tracesCreated: ['deleted file in recycle bin', 'backup shows original', 'metadata preserved'],
            timeNeeded: 10,
          },
        ],
        requiredAccess: 'document or system access',
        difficulty: 'medium',
      },
      {
        name: 'scale manipulation',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Studied how {equipment} works and can be adjusted',
            tracesCreated: ['research evidence', 'questions asked about calibration'],
            timeNeeded: 30,
          },
          {
            phase: 'execution',
            actionTemplate: 'Adjusted {equipment} to {fraudMethod}',
            tracesCreated: ['calibration seal broken', 'adjustment evidence', 'inconsistent readings'],
            timeNeeded: 10,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Continued to use fraudulent {equipment} until {discovery}',
            tracesCreated: ['pattern of overcharges', 'customer complaints', 'comparison with other scales'],
            timeNeeded: 0,
          },
        ],
        requiredAccess: 'equipment access',
        difficulty: 'hard',
      },
    ],
    scenes: [
      {
        type: 'market_stall',
        names: ['Tiong Bahru Wet Market', 'Tampines Round Market', 'Tekka Fresh Market'],
        descriptions: [
          'A vibrant wet market where the morning\'s catch glistens on ice and vegetables are piled high',
          'The heartbeat of the neighborhood, where aunties haggle and uncles joke',
          'Rows of stalls offering everything fresh, from fish to fruit to flowers',
        ],
        layouts: [
          'Narrow aisles between stalls, with each vendor\'s territory clearly marked',
          'The seafood section in the center, vegetables around the edges, dry goods upstairs',
          'A circular arrangement with the most popular stalls near the main entrance',
        ],
        accessPoints: [
          { name: 'Main entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: false },
          { name: 'Loading bay', type: 'service_entrance', visibility: 'semi-private', requiresKey: false, monitored: false },
          { name: 'Market office', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: false },
        ],
        areas: [
          { name: 'Fish Stall', description: 'Gleaming scales and the briny smell of the sea' },
          { name: 'Vegetable Section', description: 'Mountains of fresh greens and colorful produce' },
          { name: 'Weighing Station', description: 'The official scales used to measure purchases' },
          { name: 'Market Office', description: 'Where the management handles permits and complaints' },
          { name: 'Loading Bay', description: 'Where deliveries arrive in the early morning' },
        ],
        atmospheres: [
          { lighting: 'Harsh fluorescent lights revealing every detail', sounds: 'Vendors calling out prices, choppers hitting cutting boards', smells: 'Fish, fresh vegetables, and the tang of ice', mood: 'Bustling and no-nonsense' },
          { lighting: 'Early morning light filtering through high windows', sounds: 'The clatter of crates and cheerful bargaining', smells: 'Fresh herbs and the earthiness of just-picked vegetables', mood: 'Energetic and traditional' },
        ],
      },
    ],
  },

  // ========== CHEATING ==========
  {
    type: 'cheating',
    targets: [
      {
        name: 'competition entry',
        valueRange: [0, 0],
        significance: [
          'The school\'s submission for the inter-school art competition',
          'The team entry for the science olympiad',
          'The essay submission for the national writing contest',
        ],
        securityLevels: [
          'submitted through the official online portal',
          'handed in as a sealed physical entry',
          'presented live at the competition venue',
        ],
      },
      {
        name: 'academic work',
        valueRange: [0, 0],
        significance: [
          'A major project worth 40% of the final grade',
          'The thesis required for graduation',
          'A group assignment that affected everyone\'s score',
        ],
        securityLevels: [
          'submitted through the school\'s learning management system',
          'handed in as a printed document',
          'presented to the class and graded',
        ],
      },
    ],
    methods: [
      {
        name: 'plagiarism',
        steps: [
          {
            phase: 'preparation',
            actionTemplate: 'Found {source} to copy from through {searchMethod}',
            tracesCreated: ['browser history', 'saved files', 'communication about source'],
            timeNeeded: 30,
          },
          {
            phase: 'execution',
            actionTemplate: 'Copied {source} with only {modifications}',
            tracesCreated: ['identical phrases', 'same structure', 'inconsistent writing style'],
            timeNeeded: 60,
          },
          {
            phase: 'aftermath',
            actionTemplate: 'Submitted work as original, but {discoveryMethod}',
            tracesCreated: ['plagiarism detection match', 'original author noticed', 'style comparison'],
            timeNeeded: 0,
          },
        ],
        requiredAccess: 'ability to submit work',
        difficulty: 'easy',
      },
    ],
    scenes: [
      {
        type: 'classroom',
        names: ['Room 3-5 (Primary 5 Class)', 'The Art Room', 'Computer Lab A'],
        descriptions: [
          'A typical classroom with desks arranged in rows facing the whiteboard',
          'A creative space splattered with paint and filled with half-finished masterpieces',
          'Rows of computers humming quietly, awaiting the next lesson',
        ],
        layouts: [
          'Traditional layout with teacher\'s desk at the front and student desks in neat rows',
          'Tables arranged in clusters for group work, supplies along the walls',
          'Computer stations in rows with the teacher\'s station having a view of all screens',
        ],
        accessPoints: [
          { name: 'Classroom door', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: false },
          { name: 'Back door', type: 'back_door', visibility: 'semi-private', requiresKey: false, monitored: false },
        ],
        areas: [
          { name: 'Teacher\'s Desk', description: 'Command central with the grade book and lesson plans' },
          { name: 'Student Desks', description: 'Where young minds work and wonder' },
          { name: 'Display Wall', description: 'Showcasing the best work from recent assignments' },
          { name: 'Supply Corner', description: 'Shelves of books, papers, and learning materials' },
        ],
        atmospheres: [
          { lighting: 'Bright overhead lights and natural light from large windows', sounds: 'Pencils scratching, pages turning, occasional whispers', smells: 'Whiteboard markers and fresh notebooks', mood: 'Focused and studious' },
          { lighting: 'Warm, creative lighting with colorful accents', sounds: 'Art supplies being moved, quiet concentration', smells: 'Paint, glue, and creativity', mood: 'Imaginative and expressive' },
        ],
      },
    ],
  },
];

// ============================================
// OPENING HOOKS - Noir-Style Narrative Openers
// ============================================

const OPENING_HOOKS = {
  theft: [
    'The {time} at {location} started like any other. But by the time the clock struck {discoveryTime}, everything had changed. The {target} was gone—and everyone was a suspect.',
    'They say you never know what you have until it\'s gone. At {location}, they learned that lesson the hard way when {target} vanished without a trace.',
    'The silence after the discovery was deafening. {location}, usually so {atmosphere}, now held only whispered accusations and nervous glances. Someone here was a thief.',
    '{dayContext}. A day that should have been remembered for achievement would instead be marked by betrayal. The {target} was missing, and the truth was hiding in plain sight.',
    'It was supposed to be a normal {timeOfDay} at {location}. Then came the moment that changed everything—the realization that {target} had disappeared.',
  ],
  sabotage: [
    'Weeks of hard work. Countless hours of dedication. All of it destroyed in a single act of sabotage. At {location}, someone had made sure that {target} would never succeed.',
    'The damage was deliberate. The timing was perfect. And somewhere in {location}, the saboteur was watching their handiwork unfold.',
    'When {discoverer} arrived at {location} that {timeOfDay}, they found only ruins where hope had stood. Someone had struck in the darkness.',
    'Victory was within reach. The {target} was ready for its moment of glory. Then someone decided that if they couldn\'t win, no one would.',
    '{dayContext}. It should have been a day of triumph. Instead, it became a day of investigation.',
  ],
  fraud: [
    'The numbers didn\'t lie—but someone had. At {location}, a careful deception was unraveling, and the truth was about to come to light.',
    'At first glance, everything looked normal. But look closer at {target}, and the cracks in the lie began to show.',
    'Trust is the foundation of any {locationType}. At {location}, that trust had been betrayed. Now it was time to find out by whom.',
    'Some crimes leave obvious traces. Others hide in plain sight, disguised as everyday transactions. The fraud at {location} was the second kind.',
    'The discovery came by accident—a simple check that revealed an uncomfortable truth. Someone at {location} had been cheating all along.',
  ],
  cheating: [
    'Hard work is supposed to be rewarded. But at {location}, someone had found a shortcut, and it was time to uncover the truth.',
    'The achievement seemed impressive—until you looked closer. At {location}, a carefully constructed illusion was about to fall apart.',
    'In a world where effort should matter, someone had decided to take the easy way out. The cheating would not go unnoticed.',
    'Pride before a fall. At {location}, the truth about {target} was about to emerge, and with it, the identity of the cheater.',
    'They thought no one would notice. They thought they\'d gotten away with it. They were wrong.',
  ],
  vandalism: [
    'The destruction was senseless. The motive was personal. At {location}, someone had left their mark in the worst possible way.',
    'Beauty had become ruin overnight. The {target} at {location} had been defaced, and somewhere, the vandal thought they\'d made their point.',
    'It takes time to build something meaningful. It takes moments to destroy it. At {location}, those moments had just passed.',
    'The damage told a story—of anger, of jealousy, or perhaps of something else entirely. At {location}, the investigation began.',
    '{dayContext}. What should have been a day of celebration became a scene of destruction.',
  ],
};

// ============================================
// NARRATIVE TENSION ELEMENTS
// ============================================

const TENSION_ELEMENTS = [
  'Everyone has a motive. Everyone has an alibi. But only one of them is lying.',
  'The clock is ticking. The evidence is disappearing. And the truth is slipping away.',
  'Trust no one. Suspect everyone. The answer is closer than you think.',
  'What seems obvious isn\'t. What seems impossible is. The truth waits to be uncovered.',
  'Behind every smile lurks a secret. Behind every alibi hides a clue.',
  'The evidence tells a story. But someone has been editing the narrative.',
  'In a web of lies, one thread of truth can unravel everything.',
  'The culprit is watching. They think they\'re safe. They\'re not.',
];

const TWIST_ELEMENTS = [
  'But there\'s something no one noticed—a detail that changes everything.',
  'The obvious suspect is too obvious. The real answer lies elsewhere.',
  'What if the victim isn\'t as innocent as they seem?',
  'The timeline doesn\'t add up. Someone is covering for someone else.',
  'There\'s a connection between suspects that no one has mentioned.',
  'The evidence points one way, but the motive points another.',
  'Someone saw something. They just don\'t know they saw it yet.',
  'The culprit made one mistake. One small mistake that will be their undoing.',
];

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export function generateCrimeBlueprint(
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF',
  preferredCrimeType?: CrimeType
): CrimeBlueprint {
  // 1. Select crime type (random or preferred)
  const crimeTypes: CrimeType[] = ['theft', 'sabotage', 'fraud', 'cheating'];
  const crimeType = preferredCrimeType || crimeTypes[Math.floor(Math.random() * crimeTypes.length)];

  // 2. Find matching template
  const template = CRIME_TEMPLATES.find(t => t.type === crimeType) || CRIME_TEMPLATES[0];

  // 3. Select random components
  const target = template.targets[Math.floor(Math.random() * template.targets.length)];
  const method = template.methods[Math.floor(Math.random() * template.methods.length)];
  const sceneTemplate = template.scenes[Math.floor(Math.random() * template.scenes.length)];

  // 4. Generate time parameters
  const timeParams = generateTimeParameters(difficulty);

  // 5. Generate the primary scene
  const primaryScene = generateScene(sceneTemplate, target);

  // 6. Generate crime choreography
  const choreography = generateChoreography(method, target, primaryScene, timeParams);

  // 7. Generate traces from choreography
  const traces = generateTracesFromChoreography(choreography, primaryScene);

  // 8. Generate witness opportunities
  const witnessOpportunities = generateWitnessOpportunities(choreography, primaryScene);

  // 9. Generate narrative elements
  const narrative = generateNarrativeElements(crimeType, target, primaryScene, timeParams);

  // 10. Build the complete blueprint
  return {
    id: `blueprint-${nanoid(10)}`,
    crimeType,
    title: generateCrimeTitle(crimeType, target, primaryScene),
    opening: narrative.hook,
    target: {
      name: target.name,
      description: generateTargetDescription(target),
      value: target.valueRange[0] + Math.floor(Math.random() * (target.valueRange[1] - target.valueRange[0])),
      significance: target.significance[Math.floor(Math.random() * target.significance.length)],
      location: primaryScene.keyAreas.find(a => a.containsTarget)?.name || primaryScene.keyAreas[0].name,
      normalSecurity: target.securityLevels[Math.floor(Math.random() * target.securityLevels.length)],
    },
    choreography,
    traces,
    timeline: {
      dayContext: timeParams.dayContext,
      normalStartTime: timeParams.normalStart,
      preparationWindow: timeParams.preparationWindow,
      crimeWindow: timeParams.crimeWindow,
      discoveryTime: timeParams.discoveryTime,
      discoveryCircumstances: generateDiscoveryCircumstances(crimeType, target, primaryScene),
    },
    primaryScene,
    relatedScenes: [], // Will be populated when generating full case
    witnessOpportunities,
    narrative,
  };
}

// ============================================
// HELPER GENERATION FUNCTIONS
// ============================================

function generateTimeParameters(difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF') {
  // Simpler timelines for lower difficulty, more complex for higher
  const timeOfDay = ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)];

  let baseHour: number;
  let dayContext: string;

  switch (timeOfDay) {
    case 'morning':
      baseHour = 8 + Math.floor(Math.random() * 3); // 8-10 AM
      dayContext = 'During the busy morning rush';
      break;
    case 'afternoon':
      baseHour = 13 + Math.floor(Math.random() * 3); // 1-3 PM
      dayContext = 'On a typical afternoon';
      break;
    case 'evening':
      baseHour = 17 + Math.floor(Math.random() * 2); // 5-6 PM
      dayContext = 'As the day wound down';
      break;
    default:
      baseHour = 14;
      dayContext = 'During the day';
  }

  const crimeWindowDuration = difficulty === 'ROOKIE' ? 30 : difficulty === 'INSPECTOR' ? 60 : difficulty === 'DETECTIVE' ? 90 : 120;
  const prepTimeBeforeCrime = 30 + Math.floor(Math.random() * 30); // 30-60 min before

  const crimeStartMinutes = baseHour * 60 + Math.floor(Math.random() * 30);
  const crimeEndMinutes = crimeStartMinutes + crimeWindowDuration;
  const prepStartMinutes = crimeStartMinutes - prepTimeBeforeCrime;
  const discoveryMinutes = crimeEndMinutes + 15 + Math.floor(Math.random() * 45);

  return {
    timeOfDay,
    dayContext,
    normalStart: formatTime(baseHour * 60 - 60),
    preparationWindow: {
      start: formatTime(prepStartMinutes),
      end: formatTime(crimeStartMinutes),
      startMinutes: prepStartMinutes,
      endMinutes: crimeStartMinutes,
    },
    crimeWindow: {
      start: formatTime(crimeStartMinutes),
      end: formatTime(crimeEndMinutes),
      startMinutes: crimeStartMinutes,
      endMinutes: crimeEndMinutes,
    },
    discoveryTime: formatTime(discoveryMinutes),
  };
}

function generateScene(template: SceneTemplate, target: TargetTemplate): SceneLayout {
  const nameIndex = Math.floor(Math.random() * template.names.length);
  const atmosphereIndex = Math.floor(Math.random() * template.atmospheres.length);

  // Convert template areas to SceneAreas with proper flags
  const keyAreas: SceneArea[] = template.areas.map((area, index) => ({
    name: area.name,
    description: area.description,
    containsTarget: index === 0, // First area contains target by default
    evidenceZone: index < 3, // First 3 areas can have evidence
    accessRestricted: index > 2, // Later areas are restricted
  }));

  return {
    name: template.names[nameIndex],
    description: template.descriptions[nameIndex] || template.descriptions[0],
    layout: template.layouts[nameIndex] || template.layouts[0],
    normalActivity: `The usual ${template.type} activities were in full swing`,
    accessPoints: template.accessPoints,
    keyAreas,
    atmosphere: template.atmospheres[atmosphereIndex],
  };
}

function generateChoreography(
  method: MethodTemplate,
  target: TargetTemplate,
  scene: SceneLayout,
  timeParams: ReturnType<typeof generateTimeParameters>
): CrimeBlueprint['choreography'] {
  const preparation: CrimeStep[] = [];
  const execution: CrimeStep[] = [];
  const aftermath: CrimeStep[] = [];

  let currentTime = timeParams.preparationWindow.startMinutes;

  for (const step of method.steps) {
    const crimeStep: CrimeStep = {
      id: nanoid(6),
      time: formatTime(currentTime),
      timeMinutes: currentTime,
      phase: step.phase,
      action: fillTemplate(step.actionTemplate, { target: target.name, location: scene.name }),
      location: scene.keyAreas[Math.floor(Math.random() * Math.min(3, scene.keyAreas.length))].name,
      details: generateStepDetails(step, target, scene),
      tracesLeft: step.tracesCreated,
      observableBy: generateObservers(step.phase, scene),
      soundsMade: generateSounds(step.phase),
      objectsInteracted: generateObjects(step.phase, target),
    };

    currentTime += step.timeNeeded;

    switch (step.phase) {
      case 'preparation':
        preparation.push(crimeStep);
        break;
      case 'execution':
        execution.push(crimeStep);
        break;
      case 'aftermath':
        aftermath.push(crimeStep);
        break;
    }
  }

  return { preparation, execution, aftermath };
}

function generateTracesFromChoreography(
  choreography: CrimeBlueprint['choreography'],
  scene: SceneLayout
): CrimeBlueprint['traces'] {
  const physical: TracePoint[] = [];
  const digital: TracePoint[] = [];
  const testimonial: TracePoint[] = [];
  const material: TracePoint[] = [];

  const allSteps = [
    ...choreography.preparation,
    ...choreography.execution,
    ...choreography.aftermath,
  ];

  for (const step of allSteps) {
    for (const trace of step.tracesLeft) {
      const tracePoint: TracePoint = {
        id: nanoid(6),
        type: categorizeTrace(trace),
        category: extractCategory(trace),
        location: step.location,
        description: trace,
        linkedToStepId: step.id,
        discoveryDifficulty: step.phase === 'execution' ? 'careful' : step.phase === 'aftermath' ? 'obvious' : 'forensic',
        narrativeReveal: generateNarrativeReveal(trace, step),
        canContradict: step.phase === 'execution' ? 'alibi timing' : undefined,
      };

      switch (tracePoint.type) {
        case 'physical':
          physical.push(tracePoint);
          break;
        case 'digital':
          digital.push(tracePoint);
          break;
        case 'testimonial':
          testimonial.push(tracePoint);
          break;
        case 'material':
          material.push(tracePoint);
          break;
      }
    }
  }

  return { physical, digital, testimonial, material };
}

function generateWitnessOpportunities(
  choreography: CrimeBlueprint['choreography'],
  scene: SceneLayout
): WitnessOpportunity[] {
  const opportunities: WitnessOpportunity[] = [];

  // Generate witnesses for execution phase (most important)
  for (const step of choreography.execution) {
    if (step.observableBy && step.observableBy.length > 0) {
      opportunities.push({
        witnessRole: step.observableBy[0],
        location: step.location,
        time: step.time,
        whatTheySaw: `Someone near ${step.location}`,
        whatTheyHeard: step.soundsMade,
        reliability: 'partial',
      });
    }
  }

  // Add at least one witness from scene
  if (opportunities.length === 0) {
    opportunities.push({
      witnessRole: 'A passerby',
      location: scene.keyAreas[0].name,
      time: choreography.execution[0]?.time || '14:00',
      whatTheySaw: 'Movement in the area',
      reliability: 'unreliable',
    });
  }

  return opportunities;
}

function generateNarrativeElements(
  crimeType: CrimeType,
  target: TargetTemplate,
  scene: SceneLayout,
  timeParams: ReturnType<typeof generateTimeParameters>
): CrimeBlueprint['narrative'] {
  const hooks = OPENING_HOOKS[crimeType] || OPENING_HOOKS.theft;
  const hookTemplate = hooks[Math.floor(Math.random() * hooks.length)];

  const hook = fillTemplate(hookTemplate, {
    time: timeParams.timeOfDay,
    location: scene.name,
    discoveryTime: timeParams.discoveryTime,
    target: target.name,
    atmosphere: scene.atmosphere.mood.toLowerCase(),
    dayContext: timeParams.dayContext,
    timeOfDay: timeParams.timeOfDay,
    locationType: 'community',
    discoverer: 'Someone',
  });

  return {
    hook,
    tension: TENSION_ELEMENTS[Math.floor(Math.random() * TENSION_ELEMENTS.length)],
    twist: TWIST_ELEMENTS[Math.floor(Math.random() * TWIST_ELEMENTS.length)],
    resolution: 'By following the evidence trail, piecing together the timeline, and confronting the contradictions in the alibis, the truth was finally revealed.',
  };
}

function generateCrimeTitle(crimeType: CrimeType, target: TargetTemplate, scene: SceneLayout): string {
  const titleFormats = [
    `The Mystery of the Missing ${capitalizeFirst(target.name)}`,
    `The ${scene.name} ${capitalizeFirst(crimeType)}`,
    `The Case of the ${capitalizeFirst(target.name)}`,
    `Trouble at ${scene.name}`,
    `The ${capitalizeFirst(target.name)} Incident`,
  ];
  return titleFormats[Math.floor(Math.random() * titleFormats.length)];
}

function generateTargetDescription(target: TargetTemplate): string {
  return target.significance[Math.floor(Math.random() * target.significance.length)];
}

function generateDiscoveryCircumstances(crimeType: CrimeType, target: TargetTemplate, scene: SceneLayout): string {
  const circumstances = [
    `When the staff arrived to open up, they found ${target.name} was missing`,
    `A routine check revealed that something was terribly wrong`,
    `The first visitor of the day made the shocking discovery`,
    `During the regular inspection, the ${crimeType} was uncovered`,
    `Someone noticed something was off—and upon closer inspection, the truth emerged`,
  ];
  return circumstances[Math.floor(Math.random() * circumstances.length)];
}

function generateStepDetails(step: MethodTemplate['steps'][0], target: TargetTemplate, scene: SceneLayout): string {
  const details = [
    `This happened near ${scene.keyAreas[0].name}, where ${target.name} was normally kept`,
    `The area was ${scene.atmosphere.mood.toLowerCase()}, making it ${step.phase === 'execution' ? 'risky' : 'convenient'}`,
    `At this moment, the fate of ${target.name} hung in the balance`,
  ];
  return details[Math.floor(Math.random() * details.length)];
}

function generateObservers(phase: 'preparation' | 'execution' | 'aftermath', scene: SceneLayout): string[] {
  if (phase === 'preparation') return ['Staff member', 'Security'];
  if (phase === 'execution') return ['Passerby', 'Witness'];
  return ['First responder', 'Manager'];
}

function generateSounds(phase: 'preparation' | 'execution' | 'aftermath'): string {
  const sounds = {
    preparation: 'Quiet footsteps, careful movements',
    execution: 'Quick, hurried sounds',
    aftermath: 'Running footsteps fading away',
  };
  return sounds[phase];
}

function generateObjects(phase: 'preparation' | 'execution' | 'aftermath', target: TargetTemplate): string[] {
  if (phase === 'execution') return [target.name, 'container', 'nearby items'];
  return ['doorhandle', 'nearby surfaces'];
}

function categorizeTrace(trace: string): 'physical' | 'digital' | 'testimonial' | 'material' {
  const lower = trace.toLowerCase();
  if (lower.includes('fingerprint') || lower.includes('footprint') || lower.includes('dna') || lower.includes('fiber') || lower.includes('residue')) return 'physical';
  if (lower.includes('cctv') || lower.includes('log') || lower.includes('timestamp') || lower.includes('record') || lower.includes('history')) return 'digital';
  if (lower.includes('witness') || lower.includes('seen') || lower.includes('heard') || lower.includes('noticed') || lower.includes('testimony')) return 'testimonial';
  return 'material';
}

function extractCategory(trace: string): string {
  const lower = trace.toLowerCase();
  if (lower.includes('fingerprint')) return 'fingerprint';
  if (lower.includes('footprint')) return 'footprint';
  if (lower.includes('cctv')) return 'video';
  if (lower.includes('log')) return 'access_log';
  if (lower.includes('witness')) return 'witness_statement';
  return 'physical_evidence';
}

function generateNarrativeReveal(trace: string, step: CrimeStep): string {
  return `This ${trace} proves that someone was at ${step.location} around ${step.time}`;
}

function fillTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// EXPORT FOR USE BY OTHER MODULES
// ============================================

export { CRIME_TEMPLATES, OPENING_HOOKS, TENSION_ELEMENTS, TWIST_ELEMENTS };
