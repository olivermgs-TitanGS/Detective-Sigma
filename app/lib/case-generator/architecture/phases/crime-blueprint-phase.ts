/**
 * PHASE 1: CRIME BLUEPRINT GENERATION
 *
 * This phase creates the foundation story that drives everything else.
 * It generates detailed crime choreography, traces, and narrative elements.
 */

import { nanoid } from 'nanoid';
import {
  IGenerationPhase,
  GenerationContext,
  ICrimeBlueprint,
  ICrimeStep,
  ITracePoint,
  TimePoint,
  TimeWindow,
  createTimePointFromMinutes,
  registry,
} from '../index';

// ============================================
// CRIME TEMPLATES DATA
// ============================================

interface CrimeTypeData {
  type: string;
  targets: TargetData[];
  methods: MethodData[];
  sceneTypes: string[];
  supportedDifficulties: string[];
  supportedSubjects: string[];
}

interface TargetData {
  name: string;
  valueRange: [number, number];
  significance: string[];
  security: string[];
}

interface MethodData {
  name: string;
  steps: MethodStepData[];
  requiredAccess: string;
  difficulty: string;
}

interface MethodStepData {
  phase: 'preparation' | 'execution' | 'aftermath';
  action: string;
  traces: string[];
  timeMinutes: number;
}

// Crime type definitions (extensible)
const CRIME_TYPES: CrimeTypeData[] = [
  {
    type: 'theft',
    supportedDifficulties: ['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF'],
    supportedSubjects: ['MATH', 'SCIENCE', 'INTEGRATED'],
    sceneTypes: ['canteen', 'library', 'office', 'lab', 'storeroom'],
    targets: [
      {
        name: 'cash register money',
        valueRange: [50, 200],
        significance: [
          'The daily takings meant for restocking supplies',
          'Money collected from a busy lunch period',
          'Coins and notes carefully counted that morning',
        ],
        security: [
          'kept in the register drawer during service',
          'stored in a lockbox under the counter',
          'held in a cash tray with a simple lock',
        ],
      },
      {
        name: 'valuable book',
        valueRange: [200, 2000],
        significance: [
          'A rare first edition treasured by the library',
          'A historical text donated by a famous alumnus',
          'An irreplaceable reference used by researchers',
        ],
        security: [
          'displayed in the special collection cabinet',
          'kept behind the librarian\'s counter',
          'stored in the restricted archive room',
        ],
      },
      {
        name: 'trophy',
        valueRange: [100, 500],
        significance: [
          'The championship trophy won after years of effort',
          'A symbol of the team\'s dedication and hard work',
          'The prize that inspired generations of students',
        ],
        security: [
          'displayed proudly in the main showcase',
          'kept in the sports office between events',
          'stored in the principal\'s meeting room',
        ],
      },
      {
        name: 'electronic device',
        valueRange: [300, 1500],
        significance: [
          'A new tablet purchased for classroom use',
          'Lab equipment essential for experiments',
          'A computer used for important work',
        ],
        security: [
          'left charging on a desk overnight',
          'stored in an unlocked cabinet',
          'placed in the equipment room',
        ],
      },
      {
        name: 'exam papers',
        valueRange: [0, 0],
        significance: [
          'Next week\'s important examination',
          'Confidential test questions kept secure',
          'Assessment papers worth protecting',
        ],
        security: [
          'locked in the teacher\'s desk drawer',
          'stored in the examination office',
          'kept in the staff room cabinet',
        ],
      },
    ],
    methods: [
      {
        name: 'opportunistic_grab',
        requiredAccess: 'public',
        difficulty: 'easy',
        steps: [
          {
            phase: 'preparation',
            action: 'Waited and watched for the right moment when no one was paying attention',
            traces: ['nervous pacing near the area', 'fingerprints on nearby surfaces'],
            timeMinutes: 5,
          },
          {
            phase: 'execution',
            action: 'Quickly grabbed the target when the opportunity arose',
            traces: ['fingerprints on the container', 'displaced nearby items', 'gap in inventory'],
            timeMinutes: 2,
          },
          {
            phase: 'aftermath',
            action: 'Hurried away from the scene, making small mistakes in their haste',
            traces: ['dropped personal item', 'rushed footprints', 'caught on peripheral camera'],
            timeMinutes: 3,
          },
        ],
      },
      {
        name: 'planned_with_key',
        requiredAccess: 'key_access',
        difficulty: 'medium',
        steps: [
          {
            phase: 'preparation',
            action: 'Obtained access through legitimate means, then waited for the right time',
            traces: ['access log showing entry', 'questions about security'],
            timeMinutes: 10,
          },
          {
            phase: 'preparation',
            action: 'Scouted the location to learn the daily routine',
            traces: ['seen in unusual places', 'asking about schedules'],
            timeMinutes: 15,
          },
          {
            phase: 'execution',
            action: 'Used their access to enter during a quiet period',
            traces: ['access log timestamp', 'door sensor record'],
            timeMinutes: 3,
          },
          {
            phase: 'execution',
            action: 'Carefully took the target while trying not to leave traces',
            traces: ['slight disturbance in dust pattern', 'item slightly misaligned', 'fiber from clothing'],
            timeMinutes: 5,
          },
          {
            phase: 'aftermath',
            action: 'Attempted to make everything look normal, but overlooked a detail',
            traces: ['item moved but not quite right', 'time gap in movements', 'cleaning supplies displaced'],
            timeMinutes: 5,
          },
        ],
      },
      {
        name: 'distraction_theft',
        requiredAccess: 'public',
        difficulty: 'medium',
        steps: [
          {
            phase: 'preparation',
            action: 'Planned a distraction to draw attention away',
            traces: ['prepared distraction materials', 'coordination with timing'],
            timeMinutes: 10,
          },
          {
            phase: 'execution',
            action: 'Created a distraction that drew everyone\'s attention',
            traces: ['evidence of distraction', 'witnesses to commotion'],
            timeMinutes: 3,
          },
          {
            phase: 'execution',
            action: 'Took the target while everyone was focused elsewhere',
            traces: ['fingerprints', 'timeline overlap with distraction', 'quick movements'],
            timeMinutes: 2,
          },
          {
            phase: 'aftermath',
            action: 'Blended back into the scene but showed subtle changes in behavior',
            traces: ['noticed returning to crowd', 'changed demeanor', 'nervous glances'],
            timeMinutes: 5,
          },
        ],
      },
    ],
  },
  {
    type: 'sabotage',
    supportedDifficulties: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
    supportedSubjects: ['SCIENCE', 'INTEGRATED'],
    sceneTypes: ['lab', 'sports_hall', 'workshop', 'art_room'],
    targets: [
      {
        name: 'science project',
        valueRange: [0, 100],
        significance: [
          'Weeks of careful experimentation and observation',
          'A project that was certain to win the fair',
          'The culmination of months of hard work',
        ],
        security: [
          'left in the lab overnight for morning display',
          'stored with other projects in the exhibition area',
          'placed on the display table already set up',
        ],
      },
      {
        name: 'sports equipment',
        valueRange: [50, 300],
        significance: [
          'Equipment used for important competition',
          'The team\'s carefully maintained gear',
          'New equipment purchased for championships',
        ],
        security: [
          'stored in the equipment room overnight',
          'kept in the team lockers',
          'left in the changing room during practice',
        ],
      },
      {
        name: 'art piece',
        valueRange: [0, 200],
        significance: [
          'A masterpiece for the school art exhibition',
          'The result of creative expression and skill',
          'An artwork that captured everyone\'s attention',
        ],
        security: [
          'displayed in the art gallery',
          'stored in the art room to dry',
          'placed in the exhibition space',
        ],
      },
    ],
    methods: [
      {
        name: 'chemical_sabotage',
        requiredAccess: 'lab_access',
        difficulty: 'medium',
        steps: [
          {
            phase: 'preparation',
            action: 'Obtained harmful substance from available supplies',
            traces: ['missing chemicals from storage', 'research on effects', 'residue on personal items'],
            timeMinutes: 15,
          },
          {
            phase: 'execution',
            action: 'Applied the substance to the target while unobserved',
            traces: ['chemical traces on target', 'container near scene', 'distinctive odor'],
            timeMinutes: 5,
          },
          {
            phase: 'aftermath',
            action: 'Disposed of evidence but left traces behind',
            traces: ['hidden container', 'traces on hands or clothes', 'change in behavior'],
            timeMinutes: 5,
          },
        ],
      },
      {
        name: 'physical_tampering',
        requiredAccess: 'location_access',
        difficulty: 'hard',
        steps: [
          {
            phase: 'preparation',
            action: 'Learned how the target worked through observation or research',
            traces: ['seen examining the item', 'questions asked about mechanism', 'search history'],
            timeMinutes: 20,
          },
          {
            phase: 'execution',
            action: 'Made subtle changes that would cause failure',
            traces: ['tool marks', 'fingerprints on mechanism', 'slight misalignment'],
            timeMinutes: 10,
          },
          {
            phase: 'aftermath',
            action: 'Made the damage look like an accident',
            traces: ['inconsistent damage pattern', 'timeline discrepancy', 'witness to presence'],
            timeMinutes: 5,
          },
        ],
      },
    ],
  },
  {
    type: 'fraud',
    supportedDifficulties: ['DETECTIVE', 'CHIEF'],
    supportedSubjects: ['MATH', 'INTEGRATED'],
    sceneTypes: ['office', 'market', 'canteen', 'shop'],
    targets: [
      {
        name: 'financial records',
        valueRange: [100, 5000],
        significance: [
          'The daily transaction records',
          'Important accounting documents',
          'Financial data that needed to be accurate',
        ],
        security: [
          'recorded in a ledger book',
          'tracked on spreadsheets',
          'managed in accounting software',
        ],
      },
      {
        name: 'weighing scale',
        valueRange: [0, 500],
        significance: [
          'Equipment used to measure purchases fairly',
          'The trusted measure for customer transactions',
          'An essential tool for honest trade',
        ],
        security: [
          'displayed for customers to see',
          'calibrated by certified technicians',
          'checked regularly for accuracy',
        ],
      },
    ],
    methods: [
      {
        name: 'document_alteration',
        requiredAccess: 'document_access',
        difficulty: 'medium',
        steps: [
          {
            phase: 'preparation',
            action: 'Gained access to the records through their role',
            traces: ['access log entry', 'unusual access time', 'witness to presence'],
            timeMinutes: 10,
          },
          {
            phase: 'execution',
            action: 'Altered the numbers to hide or create discrepancies',
            traces: ['file modification time', 'version history', 'calculation errors'],
            timeMinutes: 15,
          },
          {
            phase: 'aftermath',
            action: 'Tried to cover tracks but left digital evidence',
            traces: ['deleted files in recycle', 'backup shows original', 'metadata preserved'],
            timeMinutes: 10,
          },
        ],
      },
      {
        name: 'scale_manipulation',
        requiredAccess: 'equipment_access',
        difficulty: 'hard',
        steps: [
          {
            phase: 'preparation',
            action: 'Studied how the scale worked and could be adjusted',
            traces: ['research evidence', 'questions about calibration'],
            timeMinutes: 30,
          },
          {
            phase: 'execution',
            action: 'Adjusted the scale to show incorrect readings',
            traces: ['calibration seal broken', 'adjustment evidence', 'inconsistent readings'],
            timeMinutes: 10,
          },
          {
            phase: 'aftermath',
            action: 'Continued using the modified equipment until discovery',
            traces: ['pattern of overcharges', 'customer complaints', 'comparison discrepancy'],
            timeMinutes: 0,
          },
        ],
      },
    ],
  },
];

// Narrative hooks by crime type
const NARRATIVE_HOOKS: Record<string, string[]> = {
  theft: [
    'The {timeOfDay} at {location} started like any other. But by {discoveryTime}, everything had changed. The {target} was gone—and everyone was a suspect.',
    'They say you never know what you have until it\'s gone. At {location}, they learned that lesson the hard way when {target} vanished.',
    'The silence after the discovery was deafening. {location}, usually so {mood}, now held only whispered accusations and nervous glances.',
    '{dayContext}. A day meant to be ordinary would instead be remembered for what went missing.',
  ],
  sabotage: [
    'Weeks of work. Hours of dedication. All of it ruined in a single act. At {location}, someone made sure that success would not come easily.',
    'The damage was deliberate. The timing was calculated. And somewhere in {location}, the saboteur was watching.',
    'When the damage was discovered at {location} that {timeOfDay}, shock turned to suspicion. Someone had done this on purpose.',
    '{dayContext}. What should have been a triumph became an investigation.',
  ],
  fraud: [
    'The numbers didn\'t add up—but someone had made them seem right. At {location}, a careful deception was unraveling.',
    'At first glance, everything looked normal. But look closer at {target}, and the truth starts to show.',
    'Trust is the foundation of every transaction. At {location}, that trust had been betrayed.',
    'The discovery came unexpectedly—a simple check that revealed a complex scheme.',
  ],
};

const TENSION_ELEMENTS = [
  'Everyone has a motive. Everyone has an alibi. But only one of them is telling the whole truth.',
  'The clock is ticking. The evidence is waiting. And the truth is hiding in plain sight.',
  'Trust no one. Question everything. The answer is closer than you think.',
  'What seems obvious might not be. What seems impossible might be exactly what happened.',
  'Behind every smile lurks a secret. Behind every alibi hides a clue.',
];

const TWIST_ELEMENTS = [
  'But there\'s something no one noticed—a detail that changes everything.',
  'The obvious suspect is too obvious. The real answer lies elsewhere.',
  'The timeline doesn\'t add up. Someone is hiding something.',
  'There\'s a connection between the suspects that no one has mentioned yet.',
  'The culprit made one mistake. Just one. But it will be their undoing.',
];

// ============================================
// PHASE IMPLEMENTATION
// ============================================

export class CrimeBlueprintPhase implements IGenerationPhase<void, ICrimeBlueprint> {
  readonly name = 'crime-blueprint';
  readonly order = 10;  // First phase

  canExecute(context: GenerationContext): boolean {
    // This phase can always run as the first step
    return !context.crimeBlueprint;
  }

  async execute(context: GenerationContext): Promise<ICrimeBlueprint> {
    const { params } = context;

    // 1. Select crime type based on parameters
    const crimeType = this.selectCrimeType(params);

    // 2. Select target
    const target = this.selectTarget(crimeType);

    // 3. Select method
    const method = this.selectMethod(crimeType, params.difficulty);

    // 4. Generate time parameters
    const timeParams = this.generateTimeParameters(params.difficulty);

    // 5. Generate choreography
    const choreography = this.generateChoreography(method, target, timeParams);

    // 6. Generate traces from choreography
    const traces = this.generateTraces(choreography);

    // 7. Generate narrative elements
    const narrative = this.generateNarrative(crimeType.type, target, timeParams);

    // 8. Build the blueprint
    const blueprint: ICrimeBlueprint = {
      id: `blueprint-${nanoid(10)}`,
      crimeType: crimeType.type,
      title: this.generateTitle(crimeType.type, target),
      target: {
        name: target.name,
        description: this.selectRandom(target.significance),
        value: this.randomInRange(target.valueRange),
        significance: this.selectRandom(target.significance),
        location: 'Primary Scene',
      },
      choreography,
      traces,
      timeline: {
        dayContext: timeParams.dayContext,
        crimeWindow: timeParams.crimeWindow,
        discoveryTime: timeParams.discoveryTime,
      },
      primarySceneType: this.selectRandom(crimeType.sceneTypes),
      sceneContext: {
        timeOfDay: timeParams.timeOfDay,
        mood: 'tense',
      },
      narrative,
    };

    // Store in context
    context.crimeBlueprint = blueprint;

    return blueprint;
  }

  // Helper methods
  private selectCrimeType(params: GenerationContext['params']): CrimeTypeData {
    const suitable = CRIME_TYPES.filter(ct =>
      ct.supportedDifficulties.includes(params.difficulty) &&
      ct.supportedSubjects.includes(params.subject)
    );

    if (suitable.length === 0) {
      return CRIME_TYPES[0]; // Default to theft
    }

    return this.selectRandom(suitable);
  }

  private selectTarget(crimeType: CrimeTypeData): TargetData {
    return this.selectRandom(crimeType.targets);
  }

  private selectMethod(crimeType: CrimeTypeData, difficulty: string): MethodData {
    const suitable = crimeType.methods.filter(m => {
      if (difficulty === 'ROOKIE') return m.difficulty === 'easy';
      if (difficulty === 'INSPECTOR') return m.difficulty !== 'hard';
      return true;
    });

    return this.selectRandom(suitable.length > 0 ? suitable : crimeType.methods);
  }

  private generateTimeParameters(difficulty: string) {
    const timeOfDay = this.selectRandom(['morning', 'afternoon', 'evening']);
    let baseHour: number;
    let dayContext: string;

    switch (timeOfDay) {
      case 'morning':
        baseHour = 8 + Math.floor(Math.random() * 3);
        dayContext = 'During the busy morning rush';
        break;
      case 'afternoon':
        baseHour = 13 + Math.floor(Math.random() * 3);
        dayContext = 'On a typical afternoon';
        break;
      default:
        baseHour = 17 + Math.floor(Math.random() * 2);
        dayContext = 'As the day wound down';
    }

    const windowDuration = difficulty === 'ROOKIE' ? 30 : difficulty === 'INSPECTOR' ? 60 : 90;
    const crimeStartMinutes = baseHour * 60 + Math.floor(Math.random() * 30);
    const crimeEndMinutes = crimeStartMinutes + windowDuration;
    const discoveryMinutes = crimeEndMinutes + 15 + Math.floor(Math.random() * 45);

    return {
      timeOfDay,
      dayContext,
      crimeWindow: {
        start: createTimePointFromMinutes(crimeStartMinutes),
        end: createTimePointFromMinutes(crimeEndMinutes),
      },
      discoveryTime: createTimePointFromMinutes(discoveryMinutes),
    };
  }

  private generateChoreography(
    method: MethodData,
    target: TargetData,
    timeParams: ReturnType<typeof this.generateTimeParameters>
  ): ICrimeStep[] {
    const steps: ICrimeStep[] = [];
    let currentMinutes = timeParams.crimeWindow.start.minutes - 30;

    for (const stepData of method.steps) {
      const step: ICrimeStep = {
        id: nanoid(6),
        time: createTimePointFromMinutes(currentMinutes),
        phase: stepData.phase,
        action: stepData.action.replace('{target}', target.name),
        location: 'Scene Location',
        details: `This step left evidence: ${stepData.traces.join(', ')}`,
        tracesCreated: stepData.traces,
        observableBy: this.generateObservers(stepData.phase),
      };

      steps.push(step);
      currentMinutes += stepData.timeMinutes;
    }

    return steps;
  }

  private generateTraces(choreography: ICrimeStep[]): ITracePoint[] {
    const traces: ITracePoint[] = [];

    for (const step of choreography) {
      for (const traceDesc of step.tracesCreated) {
        const trace: ITracePoint = {
          id: nanoid(6),
          type: this.categorizeTrace(traceDesc),
          category: this.extractCategory(traceDesc),
          location: step.location,
          description: traceDesc,
          linkedToStepId: step.id,
          discoveryDifficulty: step.phase === 'execution' ? 'careful' : 'obvious',
          narrativeReveal: `This evidence indicates activity at ${step.time.formatted}`,
        };
        traces.push(trace);
      }
    }

    return traces;
  }

  private generateNarrative(
    crimeType: string,
    target: TargetData,
    timeParams: ReturnType<typeof this.generateTimeParameters>
  ) {
    const hooks = NARRATIVE_HOOKS[crimeType] || NARRATIVE_HOOKS.theft;
    const hookTemplate = this.selectRandom(hooks);

    const hook = hookTemplate
      .replace('{timeOfDay}', timeParams.timeOfDay)
      .replace('{location}', 'the scene')
      .replace('{discoveryTime}', timeParams.discoveryTime.formatted)
      .replace('{target}', target.name)
      .replace('{dayContext}', timeParams.dayContext)
      .replace('{mood}', 'peaceful');

    return {
      hook,
      tension: this.selectRandom(TENSION_ELEMENTS),
      twist: this.selectRandom(TWIST_ELEMENTS),
    };
  }

  private generateTitle(crimeType: string, target: TargetData): string {
    const formats = [
      `The Mystery of the Missing ${this.capitalize(target.name)}`,
      `The Case of the ${this.capitalize(target.name)}`,
      `The ${this.capitalize(target.name)} Incident`,
    ];
    return this.selectRandom(formats);
  }

  private generateObservers(phase: 'preparation' | 'execution' | 'aftermath'): string[] {
    const observers: Record<string, string[]> = {
      preparation: ['Staff member', 'Security guard', 'Passerby'],
      execution: ['Witness', 'CCTV camera', 'Person nearby'],
      aftermath: ['First discoverer', 'Manager', 'Colleague'],
    };
    return [this.selectRandom(observers[phase])];
  }

  private categorizeTrace(trace: string): ITracePoint['type'] {
    const lower = trace.toLowerCase();
    if (lower.includes('fingerprint') || lower.includes('footprint') || lower.includes('fiber') || lower.includes('residue')) return 'physical';
    if (lower.includes('cctv') || lower.includes('log') || lower.includes('record') || lower.includes('timestamp')) return 'digital';
    if (lower.includes('witness') || lower.includes('seen') || lower.includes('heard')) return 'testimonial';
    return 'material';
  }

  private extractCategory(trace: string): string {
    const lower = trace.toLowerCase();
    if (lower.includes('fingerprint')) return 'fingerprint';
    if (lower.includes('footprint')) return 'footprint';
    if (lower.includes('cctv') || lower.includes('camera')) return 'video';
    if (lower.includes('log')) return 'access_log';
    return 'physical_evidence';
  }

  private selectRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomInRange([min, max]: [number, number]): number {
    return min + Math.floor(Math.random() * (max - min));
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Register this phase
export function registerCrimeBlueprintPhase(): void {
  registry.registerPhase(new CrimeBlueprintPhase());
}
