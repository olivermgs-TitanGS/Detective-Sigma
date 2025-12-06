/**
 * PHASE 2: SUSPECT POOL GENERATION
 *
 * This phase generates detailed suspects with full timelines, alibis, and motives.
 * IMPORTANT: At this point, we don't choose the culprit yet.
 * All suspects are generated as potential culprits with opportunity assessment.
 */

import { nanoid } from 'nanoid';
import {
  IGenerationPhase,
  GenerationContext,
  ISuspectProfile,
  ISuspectMovement,
  ISuspectRelationship,
  IDialogueNode,
  TimePoint,
  TimeWindow,
  ICrimeBlueprint,
  createTimePointFromMinutes,
  registry,
} from '../index';

// ============================================
// SUSPECT TEMPLATES DATA
// ============================================

interface SuspectRoleTemplate {
  role: string;
  description: string;
  accessLevel: 'public' | 'staff' | 'key_holder' | 'management';
  typicalLocation: string;
  possibleMotives: MotiveTemplate[];
  personalityTypes: string[][];
  traits: string[];
}

interface MotiveTemplate {
  type: string;
  strength: 'weak' | 'moderate' | 'strong';
  description: string;
  backstoryTemplate: string;
  evidenceTypes: string[];
}

// Singapore-appropriate names
const NAMES = {
  chinese: {
    male: ['Wei Ming', 'Jun Wei', 'Zhi Hao', 'Jia Jun', 'Yi Xuan', 'Kai Wen', 'Jing Hong', 'Hao Yu'],
    female: ['Xiu Mei', 'Li Hua', 'Mei Ling', 'Hui Min', 'Jia Ying', 'Xin Yi', 'Wen Xin', 'Yu Shan'],
  },
  malay: {
    male: ['Ahmad', 'Hafiz', 'Rizwan', 'Faizal', 'Azman', 'Irfan', 'Danial', 'Syafiq'],
    female: ['Nurul', 'Fatimah', 'Aishah', 'Siti', 'Nadia', 'Farah', 'Amira', 'Zara'],
  },
  indian: {
    male: ['Rajesh', 'Arjun', 'Vikram', 'Suresh', 'Deepak', 'Karthik', 'Prasad', 'Ganesh'],
    female: ['Priya', 'Lakshmi', 'Anitha', 'Kavitha', 'Sumathi', 'Devi', 'Meena', 'Sarala'],
  },
  eurasian: {
    male: ['Michael', 'David', 'Jonathan', 'Adrian', 'Marcus', 'Daniel', 'Patrick', 'Vincent'],
    female: ['Michelle', 'Christine', 'Patricia', 'Vanessa', 'Natalie', 'Cynthia', 'Serena', 'Amanda'],
  },
};

const SURNAMES = {
  chinese: ['Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Ong', 'Chen', 'Goh', 'Koh', 'Teo'],
  malay: ['Bin Ahmad', 'Bin Hassan', 'Binti Ibrahim', 'Bin Ismail', 'Binti Rahman'],
  indian: ['Kumar', 'Pillai', 'Nair', 'Sharma', 'Menon', 'Rajan', 'Krishnan'],
  eurasian: ['Da Silva', 'De Souza', 'Rodrigues', 'Pereira', 'Fernandez'],
};

// Role templates organized by scene type
const ROLE_TEMPLATES: Record<string, SuspectRoleTemplate[]> = {
  canteen: [
    {
      role: 'Canteen Manager',
      description: 'Responsible for overseeing all canteen operations and staff',
      accessLevel: 'management',
      typicalLocation: 'Office or main counter',
      possibleMotives: [
        {
          type: 'financial',
          strength: 'moderate',
          description: 'Pressure to meet financial targets',
          backstoryTemplate: 'The canteen has been struggling with increasing costs. There is pressure to show better numbers.',
          evidenceTypes: ['financial documents', 'stressed behavior'],
        },
        {
          type: 'cover-up',
          strength: 'weak',
          description: 'Hiding previous mistakes',
          backstoryTemplate: 'There were discrepancies in past records that needed to stay hidden.',
          evidenceTypes: ['old records', 'nervous when asked about past'],
        },
      ],
      personalityTypes: [
        ['organized', 'strict', 'professional'],
        ['friendly', 'hardworking', 'detail-oriented'],
        ['stressed', 'overworked', 'dedicated'],
      ],
      traits: ['knows everyone', 'has all the keys', 'keeps detailed records'],
    },
    {
      role: 'Cashier',
      description: 'Handles all cash transactions at the main counter',
      accessLevel: 'staff',
      typicalLocation: 'Cash register',
      possibleMotives: [
        {
          type: 'financial',
          strength: 'strong',
          description: 'Personal financial difficulties',
          backstoryTemplate: 'Facing unexpected expenses at home. The bills keep piling up.',
          evidenceTypes: ['worried phone calls', 'mentions of money problems'],
        },
        {
          type: 'opportunity',
          strength: 'moderate',
          description: 'Saw a chance and took it',
          backstoryTemplate: 'No plan, just poor judgment in a moment of temptation.',
          evidenceTypes: ['impulsive behavior', 'regret shown afterward'],
        },
      ],
      personalityTypes: [
        ['friendly', 'chatty', 'reliable'],
        ['quiet', 'efficient', 'punctual'],
        ['tired', 'overworked', 'distracted'],
      ],
      traits: ['handles all the money', 'knows customer patterns', 'leaves for breaks'],
    },
    {
      role: 'Kitchen Staff',
      description: 'Prepares food in the back kitchen area',
      accessLevel: 'staff',
      typicalLocation: 'Kitchen',
      possibleMotives: [
        {
          type: 'revenge',
          strength: 'moderate',
          description: 'Grievance against management',
          backstoryTemplate: 'Passed over for promotion despite years of hard work.',
          evidenceTypes: ['complaints to colleagues', 'tension with manager'],
        },
      ],
      personalityTypes: [
        ['hardworking', 'skilled', 'team player'],
        ['grumpy', 'experienced', 'traditional'],
      ],
      traits: ['rarely leaves kitchen', 'busy during rush hour', 'knows back areas well'],
    },
    {
      role: 'Delivery Person',
      description: 'External vendor who delivers supplies',
      accessLevel: 'public',
      typicalLocation: 'Loading bay and storage',
      possibleMotives: [
        {
          type: 'opportunity',
          strength: 'weak',
          description: 'Outsider who saw an opening',
          backstoryTemplate: 'Not a regular face here, which makes them harder to suspect—or easier to blame.',
          evidenceTypes: ['unfamiliarity with layout', 'limited access'],
        },
      ],
      personalityTypes: [
        ['friendly', 'efficient', 'punctual'],
        ['rushed', 'business-like', 'professional'],
      ],
      traits: ['arrives at specific times', 'has delivery records', 'known schedule'],
    },
  ],
  library: [
    {
      role: 'Head Librarian',
      description: 'Senior staff member in charge of library operations',
      accessLevel: 'management',
      typicalLocation: 'Main desk and offices',
      possibleMotives: [
        {
          type: 'collector',
          strength: 'moderate',
          description: 'Personal interest in rare books',
          backstoryTemplate: 'A lifelong passion for books has sometimes crossed professional boundaries.',
          evidenceTypes: ['extensive personal collection', 'knowledge of book values'],
        },
      ],
      personalityTypes: [
        ['scholarly', 'precise', 'reserved'],
        ['passionate', 'dedicated', 'knowledgeable'],
      ],
      traits: ['knows every book', 'has all access', 'works late often'],
    },
    {
      role: 'Library Assistant',
      description: 'Helps with daily library operations and shelving',
      accessLevel: 'staff',
      typicalLocation: 'Stacks and reading areas',
      possibleMotives: [
        {
          type: 'financial',
          strength: 'moderate',
          description: 'Student loans to pay off',
          backstoryTemplate: 'The salary is not enough to cover mounting debts from education.',
          evidenceTypes: ['financial stress mentioned', 'working extra hours'],
        },
      ],
      personalityTypes: [
        ['helpful', 'organized', 'bookish'],
        ['shy', 'efficient', 'reliable'],
      ],
      traits: ['moves around library freely', 'knows patron patterns', 'often alone in stacks'],
    },
    {
      role: 'Security Guard',
      description: 'Responsible for library security and patrols',
      accessLevel: 'key_holder',
      typicalLocation: 'Entrance and patrol routes',
      possibleMotives: [
        {
          type: 'opportunity',
          strength: 'weak',
          description: 'Access without supervision',
          backstoryTemplate: 'Night shifts mean no one is watching. Trust can be abused.',
          evidenceTypes: ['patrol gaps', 'access to restricted areas'],
        },
      ],
      personalityTypes: [
        ['vigilant', 'professional', 'observant'],
        ['bored', 'routine-focused', 'reliable'],
      ],
      traits: ['knows all entry points', 'has security logs', 'patrols alone'],
    },
    {
      role: 'Researcher',
      description: 'Regular visitor with special collection access for academic work',
      accessLevel: 'public',
      typicalLocation: 'Reading rooms and special collection',
      possibleMotives: [
        {
          type: 'academic',
          strength: 'moderate',
          description: 'Pressure to publish or access rare materials',
          backstoryTemplate: 'Career depends on accessing certain materials. Sometimes shortcuts seem necessary.',
          evidenceTypes: ['research requests', 'interest in specific items'],
        },
      ],
      personalityTypes: [
        ['focused', 'intellectual', 'obsessive'],
        ['friendly', 'curious', 'persistent'],
      ],
      traits: ['frequent visitor', 'takes many notes', 'asks many questions'],
    },
  ],
  lab: [
    {
      role: 'Science Teacher',
      description: 'Supervises the lab and Science Fair preparation',
      accessLevel: 'management',
      typicalLocation: 'Lab and prep room',
      possibleMotives: [
        {
          type: 'reputation',
          strength: 'weak',
          description: 'Pressure for students to succeed',
          backstoryTemplate: 'Performance evaluations are tied to student achievements. There is pressure to deliver results.',
          evidenceTypes: ['performance records', 'stress about rankings'],
        },
      ],
      personalityTypes: [
        ['enthusiastic', 'caring', 'knowledgeable'],
        ['strict', 'perfectionist', 'dedicated'],
      ],
      traits: ['has all keys', 'knows all projects', 'stays late'],
    },
    {
      role: 'Student Competitor',
      description: 'A student also entering the Science Fair',
      accessLevel: 'public',
      typicalLocation: 'Lab during allowed hours',
      possibleMotives: [
        {
          type: 'competition',
          strength: 'strong',
          description: 'Desperate to win at any cost',
          backstoryTemplate: 'Second place is not an option. The pressure to win has become overwhelming.',
          evidenceTypes: ['competitive remarks', 'jealousy observed', 'parental pressure'],
        },
      ],
      personalityTypes: [
        ['ambitious', 'hardworking', 'competitive'],
        ['anxious', 'pressured', 'focused'],
      ],
      traits: ['knows other projects', 'competitive history', 'stays after hours'],
    },
    {
      role: 'Lab Assistant',
      description: 'Helps maintain the lab and assist with experiments',
      accessLevel: 'key_holder',
      typicalLocation: 'Lab and storage areas',
      possibleMotives: [
        {
          type: 'revenge',
          strength: 'moderate',
          description: 'Unfair treatment by teachers',
          backstoryTemplate: 'Feels undervalued and overlooked despite all the hard work.',
          evidenceTypes: ['complaints made', 'tension observed'],
        },
      ],
      personalityTypes: [
        ['reliable', 'quiet', 'methodical'],
        ['resentful', 'hardworking', 'overlooked'],
      ],
      traits: ['after-hours access', 'knows lab chemicals', 'often alone'],
    },
    {
      role: 'Parent Volunteer',
      description: 'Helping with Science Fair preparations',
      accessLevel: 'public',
      typicalLocation: 'Fair setup areas',
      possibleMotives: [
        {
          type: 'parental pressure',
          strength: 'moderate',
          description: 'Wants their child to win',
          backstoryTemplate: 'The child\'s success has become too important. Judgment has been clouded by love.',
          evidenceTypes: ['overinvolved behavior', 'child in competition'],
        },
      ],
      personalityTypes: [
        ['involved', 'helpful', 'well-meaning'],
        ['pushy', 'competitive', 'protective'],
      ],
      traits: ['comes and goes freely', 'knows whose project is whose', 'opportunity during setup'],
    },
  ],
  default: [
    {
      role: 'Staff Member',
      description: 'Regular employee with normal access',
      accessLevel: 'staff',
      typicalLocation: 'Various work areas',
      possibleMotives: [
        {
          type: 'financial',
          strength: 'moderate',
          description: 'Financial difficulties',
          backstoryTemplate: 'Life has become expensive. Desperation makes people do things they normally would not.',
          evidenceTypes: ['money concerns mentioned', 'lifestyle changes'],
        },
      ],
      personalityTypes: [
        ['reliable', 'hardworking', 'friendly'],
        ['quiet', 'observant', 'professional'],
      ],
      traits: ['knows the routine', 'regular schedule', 'trusted by others'],
    },
    {
      role: 'Supervisor',
      description: 'In charge of daily operations',
      accessLevel: 'management',
      typicalLocation: 'Office and main areas',
      possibleMotives: [
        {
          type: 'cover-up',
          strength: 'weak',
          description: 'Hiding past mistakes',
          backstoryTemplate: 'Previous errors could come to light. Protecting reputation has become paramount.',
          evidenceTypes: ['old incidents', 'defensive behavior'],
        },
      ],
      personalityTypes: [
        ['organized', 'authoritative', 'experienced'],
        ['stressed', 'detail-focused', 'responsible'],
      ],
      traits: ['has master keys', 'knows everything', 'often first to arrive'],
    },
    {
      role: 'Visitor',
      description: 'Someone with temporary access to the location',
      accessLevel: 'public',
      typicalLocation: 'Public areas',
      possibleMotives: [
        {
          type: 'opportunity',
          strength: 'weak',
          description: 'Saw a chance and acted',
          backstoryTemplate: 'An outsider without attachment, making it easier to take risks.',
          evidenceTypes: ['unfamiliarity with area', 'strange behavior noted'],
        },
      ],
      personalityTypes: [
        ['nervous', 'unfamiliar', 'out of place'],
        ['confident', 'purposeful', 'observant'],
      ],
      traits: ['not a regular', 'limited knowledge', 'noticeable if acting oddly'],
    },
    {
      role: 'Maintenance Worker',
      description: 'Handles building maintenance and repairs',
      accessLevel: 'key_holder',
      typicalLocation: 'Various areas including restricted',
      possibleMotives: [
        {
          type: 'opportunity',
          strength: 'moderate',
          description: 'Access to areas others cannot reach',
          backstoryTemplate: 'Having keys to everywhere is both a privilege and a temptation.',
          evidenceTypes: ['access records', 'presence in areas'],
        },
      ],
      personalityTypes: [
        ['practical', 'skilled', 'unassuming'],
        ['observant', 'quiet', 'goes unnoticed'],
      ],
      traits: ['master key access', 'moves around freely', 'often overlooked'],
    },
  ],
};

// ============================================
// PHASE IMPLEMENTATION
// ============================================

export class SuspectPoolPhase implements IGenerationPhase<void, ISuspectProfile[]> {
  readonly name = 'suspect-pool';
  readonly order = 20;  // After crime blueprint

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint && !context.suspectPool;
  }

  async execute(context: GenerationContext): Promise<ISuspectProfile[]> {
    const blueprint = context.crimeBlueprint!;
    const { params } = context;

    // Determine number of suspects based on difficulty
    const suspectCount = this.getSuspectCount(params.difficulty);

    // Get role templates for this scene type
    const roleTemplates = this.getRoleTemplates(blueprint.primarySceneType);

    // Generate suspects
    const suspects: ISuspectProfile[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < suspectCount; i++) {
      const roleTemplate = roleTemplates[i % roleTemplates.length];
      const suspect = this.generateSuspect(
        roleTemplate,
        blueprint,
        usedNames,
        params.difficulty
      );
      suspects.push(suspect);
    }

    // Generate relationships between suspects
    this.generateRelationships(suspects);

    // Store in context
    context.suspectPool = suspects;

    return suspects;
  }

  private getSuspectCount(difficulty: string): number {
    switch (difficulty) {
      case 'ROOKIE': return 3;
      case 'INSPECTOR': return 4;
      case 'DETECTIVE': return 4;
      case 'CHIEF': return 5;
      default: return 4;
    }
  }

  private getRoleTemplates(sceneType: string): SuspectRoleTemplate[] {
    return ROLE_TEMPLATES[sceneType] || ROLE_TEMPLATES.default;
  }

  private generateSuspect(
    template: SuspectRoleTemplate,
    blueprint: ICrimeBlueprint,
    usedNames: Set<string>,
    difficulty: string
  ): ISuspectProfile {
    // Generate name
    const { name, ethnicity, gender } = this.generateName(usedNames);
    usedNames.add(name);

    // Select personality
    const personality = this.selectRandom(template.personalityTypes);

    // Generate age
    const ageCategory = this.generateAgeCategory(template.role);
    const specificAge = this.generateSpecificAge(ageCategory);

    // Generate timeline
    const timeline = this.generateTimeline(
      template,
      blueprint.timeline.crimeWindow,
      difficulty
    );

    // Generate alibi
    const alibi = this.generateAlibi(template, timeline, blueprint.timeline.crimeWindow);

    // Select and generate motive
    const motiveTemplate = this.selectMotive(template.possibleMotives);
    const motive = this.generateMotiveDetails(motiveTemplate);

    // Assess opportunity
    const opportunity = this.assessOpportunity(
      template,
      timeline,
      blueprint.timeline.crimeWindow
    );

    // Generate dialogue tree
    const dialogueTree = this.generateDialogueTree(
      name,
      template,
      alibi,
      motive,
      opportunity,
      difficulty
    );

    return {
      id: `suspect-${nanoid(8)}`,
      name,
      role: template.role,
      description: template.description,
      personality,
      traits: template.traits,
      appearance: {
        ethnicity,
        gender,
        ageCategory,
        specificAge,
      },
      timeline,
      alibi: {
        claim: alibi.claim,
        location: alibi.location,
        timeWindow: alibi.timeWindow,
        verifiable: alibi.verifiable,
        witnesses: alibi.witnesses,
      },
      motive,
      opportunity,
      relationships: [],  // Will be filled in later
      dialogueTree,
    };
  }

  private generateName(usedNames: Set<string>): { name: string; ethnicity: string; gender: string } {
    const ethnicities = ['chinese', 'malay', 'indian', 'eurasian'] as const;
    const genders = ['male', 'female'] as const;

    let attempts = 0;
    while (attempts < 20) {
      const ethnicity = this.selectRandom([...ethnicities]);
      const gender = this.selectRandom([...genders]);

      const firstNames = NAMES[ethnicity][gender];
      const surnames = SURNAMES[ethnicity];

      const firstName = this.selectRandom(firstNames);
      const surname = this.selectRandom(surnames);
      const fullName = ethnicity === 'malay'
        ? `${firstName} ${surname}` // Malay naming convention
        : `${firstName} ${surname}`;

      if (!usedNames.has(fullName)) {
        return { name: fullName, ethnicity, gender };
      }
      attempts++;
    }

    // Fallback
    const unique = `Person ${nanoid(4)}`;
    return { name: unique, ethnicity: 'chinese', gender: 'male' };
  }

  /**
   * Generate age category based on role - Singapore Education System
   *
   * Singapore Education Pathway:
   * - Nursery/Kindergarten: 3-6 years
   * - Primary School: 7-12 years (P1-P6, PSLE at P6)
   * - Secondary School: 13-16 years (Sec 1-4, O-Levels)
   * - Secondary 5: 17 years (Normal stream only)
   * - JC: 17-18 years (2 years, A-Levels)
   * - Polytechnic: 17-20 years (3 years diploma)
   * - ITE: 17-19 years (2 years NITEC/Higher NITEC)
   * - National Service: 18-20 years (males, 2 years)
   * - University: 21-25 years (3-5 years depending on course)
   */
  private generateAgeCategory(role: string): string {
    const roleLower = role.toLowerCase();

    // Pre-school roles (3-6 years)
    if (/nursery|kindergarten|k1|k2|preschool|childcare/i.test(roleLower)) return 'child';

    // Primary school students (7-12 years)
    if (/primary|p1|p2|p3|p4|p5|p6|psle/i.test(roleLower) && /student/i.test(roleLower)) return 'child';

    // Secondary school students (13-17 years)
    if (/secondary|sec\s*[1-5]|o-level/i.test(roleLower) && /student/i.test(roleLower)) return 'teen';

    // JC students (17-18 years)
    if (/jc|junior college|a-level/i.test(roleLower) && /student/i.test(roleLower)) return 'teen';

    // Post-secondary (17-20 years)
    if (/polytechnic|poly|ite|nitec|nsf|ns recruit/i.test(roleLower)) return 'young_adult';

    // University students (21-25 years)
    if (/university|undergraduate|nus|ntu|smu|sutd/i.test(roleLower) && /student/i.test(roleLower)) return 'young_adult';

    // Generic student - default to teen
    if (/student|pupil/i.test(roleLower)) return 'teen';

    // Child/kid roles (not childcare worker)
    if (/\b(child|kid|boy|girl)\b/i.test(roleLower) && !/childcare|children's/i.test(roleLower)) return 'child';

    // Intern/trainee roles
    if (/intern|trainee|apprentice/i.test(roleLower)) return 'young_adult';

    // Junior staff roles
    if (/junior|assistant|cashier|waiter|waitress|barista|receptionist/i.test(roleLower)) return 'young_adult';

    // Teaching/education professionals
    if (/teacher|librarian|coach/i.test(roleLower)) return 'adult';

    // General workers
    if (/cleaner|security|driver|technician|nurse|mechanic|worker/i.test(roleLower)) return 'adult';

    // Business owners/vendors
    if (/owner|vendor|hawker|stall|kopitiam/i.test(roleLower)) return 'middle_aged';

    // Management roles
    if (/manager|supervisor|coordinator/i.test(roleLower)) return 'adult';

    // Senior/executive roles
    if (/senior|head|director|principal|vice principal|ceo|chairman|professor|hod/i.test(roleLower)) return 'middle_aged';

    // Retiree roles
    if (/retiree|retired|elderly|pensioner|ah ma|ah gong|grandparent/i.test(roleLower)) return 'senior';

    // Parent/family roles
    if (/parent|guardian/i.test(roleLower)) return 'adult';

    // Default: adult (most common)
    return this.selectRandom(['young_adult', 'adult', 'middle_aged']);
  }

  /**
   * Generate specific age within category - Singapore context
   */
  private generateSpecificAge(category: string): number {
    const ranges: Record<string, [number, number]> = {
      // Singapore education system ages
      child: [7, 12],         // Primary school (P1-P6)
      teen: [13, 17],         // Secondary school (Sec 1-5)
      young_adult: [18, 29],  // Post-secondary, NS, University, early career
      adult: [30, 45],        // Working adults
      middle_aged: [46, 65],  // Senior professionals
      senior: [66, 80],       // Retirees
    };
    const [min, max] = ranges[category] || [30, 45];
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  private generateTimeline(
    template: SuspectRoleTemplate,
    crimeWindow: TimeWindow,
    difficulty: string
  ): ISuspectMovement[] {
    const movements: ISuspectMovement[] = [];

    // Start 2 hours before crime window
    let currentMinutes = crimeWindow.start.minutes - 120;
    const endMinutes = crimeWindow.end.minutes + 60;

    // Generate movements every 15-30 minutes
    while (currentMinutes < endMinutes) {
      const interval = 15 + Math.floor(Math.random() * 15);

      // Determine if this movement is during crime window
      const duringCrime = currentMinutes >= crimeWindow.start.minutes &&
                         currentMinutes <= crimeWindow.end.minutes;

      // Higher difficulty = less certain alibi during crime window
      const verifiable = duringCrime
        ? (difficulty === 'ROOKIE' ? Math.random() > 0.3 : Math.random() > 0.6)
        : Math.random() > 0.4;

      movements.push({
        time: createTimePointFromMinutes(currentMinutes),
        location: duringCrime
          ? this.selectRandom([template.typicalLocation, 'Near the scene', 'Unknown location'])
          : template.typicalLocation,
        action: this.generateAction(template, duringCrime),
        witnesses: verifiable ? [this.generateWitness()] : [],
        verifiable,
      });

      currentMinutes += interval;
    }

    return movements;
  }

  private generateAction(template: SuspectRoleTemplate, duringCrime: boolean): string {
    const normalActions = [
      `Working at ${template.typicalLocation}`,
      'Taking a break',
      'Speaking with a colleague',
      'Checking on something',
      'Doing regular duties',
    ];

    const vagueActions = [
      'Away from work area',
      'Not at usual post',
      'Location unclear',
      'Moving between areas',
    ];

    return duringCrime
      ? this.selectRandom([...normalActions, ...vagueActions])
      : this.selectRandom(normalActions);
  }

  private generateWitness(): string {
    const witnesses = [
      'A colleague',
      'Another staff member',
      'A visitor',
      'Someone passing by',
      'CCTV footage',
      'Sign-in record',
    ];
    return this.selectRandom(witnesses);
  }

  private generateAlibi(
    template: SuspectRoleTemplate,
    timeline: ISuspectMovement[],
    crimeWindow: TimeWindow
  ): {
    claim: string;
    location: string;
    timeWindow: TimeWindow;
    verifiable: boolean;
    witnesses: string[];
  } {
    // Find movements during crime window
    const duringCrime = timeline.filter(m =>
      m.time.minutes >= crimeWindow.start.minutes &&
      m.time.minutes <= crimeWindow.end.minutes
    );

    const verifiable = duringCrime.some(m => m.verifiable);
    const witnesses = duringCrime
      .flatMap(m => m.witnesses)
      .filter((w, i, arr) => arr.indexOf(w) === i);

    const location = duringCrime[0]?.location || template.typicalLocation;

    const claims = [
      `I was at ${location} the whole time`,
      `I was working on ${this.selectRandom(['regular tasks', 'an important job', 'my duties'])} at ${location}`,
      `I remember being at ${location} during that time`,
    ];

    return {
      claim: this.selectRandom(claims),
      location,
      timeWindow: crimeWindow,
      verifiable,
      witnesses,
    };
  }

  private selectMotive(motives: MotiveTemplate[]): MotiveTemplate {
    return this.selectRandom(motives);
  }

  private generateMotiveDetails(template: MotiveTemplate): ISuspectProfile['motive'] {
    return {
      type: template.type,
      strength: template.strength,
      description: template.description,
      backstory: template.backstoryTemplate,
      evidence: template.evidenceTypes,
    };
  }

  private assessOpportunity(
    template: SuspectRoleTemplate,
    timeline: ISuspectMovement[],
    crimeWindow: TimeWindow
  ): ISuspectProfile['opportunity'] {
    // Check access level
    const hadAccess = template.accessLevel !== 'public';

    // Check for gaps in timeline during crime window
    const duringCrime = timeline.filter(m =>
      m.time.minutes >= crimeWindow.start.minutes &&
      m.time.minutes <= crimeWindow.end.minutes
    );

    const unverifiedMovements = duringCrime.filter(m => !m.verifiable);
    const hasGap = unverifiedMovements.length > 0;

    // Calculate gap window if exists
    let gapWindow: TimeWindow | undefined;
    if (hasGap && unverifiedMovements.length > 0) {
      const gapStart = unverifiedMovements[0].time;
      const gapEnd = unverifiedMovements[unverifiedMovements.length - 1].time;
      gapWindow = { start: gapStart, end: gapEnd };
    }

    return {
      hadAccess,
      hasGap,
      gapWindow,
      accessMethod: hadAccess ? `Through ${template.accessLevel} privileges` : undefined,
    };
  }

  private generateDialogueTree(
    name: string,
    template: SuspectRoleTemplate,
    alibi: { claim: string; witnesses: string[] },
    motive: ISuspectProfile['motive'],
    opportunity: ISuspectProfile['opportunity'],
    difficulty: string
  ): IDialogueNode[] {
    const nodes: IDialogueNode[] = [];

    // Standard question about whereabouts
    nodes.push({
      id: 'whereabouts',
      question: 'Where were you during the incident?',
      answer: alibi.claim,
      emotion: opportunity.hasGap ? 'nervous' : 'calm',
      revealsInfo: opportunity.hasGap
        ? 'Their alibi has gaps that cannot be verified'
        : 'Their alibi seems solid',
    });

    // Question about noticing anything
    nodes.push({
      id: 'observations',
      question: 'Did you notice anything unusual?',
      answer: opportunity.hasGap
        ? "I wasn't really paying attention to my surroundings..."
        : "I was focused on my work. Everything seemed normal to me.",
      emotion: opportunity.hasGap ? 'evasive' : 'helpful',
    });

    // Question about relationships
    nodes.push({
      id: 'relationships',
      question: 'How would you describe your relationship with others here?',
      answer: motive.strength === 'strong'
        ? "We have our... differences. But that's normal, isn't it?"
        : "We all get along well enough. It's a professional environment.",
      emotion: motive.strength === 'strong' ? 'defensive' : 'calm',
      revealsInfo: motive.strength === 'strong'
        ? `${name} seems to have tensions with others`
        : undefined,
    });

    // Follow-up about witnesses (if applicable)
    if (alibi.witnesses.length > 0) {
      nodes.push({
        id: 'witnesses',
        question: 'Can anyone confirm where you were?',
        answer: `Yes, ${alibi.witnesses[0]} can vouch for me.`,
        emotion: 'confident',
        revealsInfo: 'They have a potential witness',
      });
    } else {
      nodes.push({
        id: 'no_witnesses',
        question: 'Can anyone confirm where you were?',
        answer: "I... I'm not sure if anyone saw me. I was alone for part of the time.",
        emotion: 'nervous',
        revealsInfo: 'Their alibi cannot be verified by witnesses',
      });
    }

    // Motive-revealing question (higher difficulty reveals more)
    if (difficulty !== 'ROOKIE' && motive.strength !== 'none') {
      nodes.push({
        id: 'motive_probe',
        question: "I've heard there might have been some... difficulties recently?",
        answer: motive.backstory,
        emotion: motive.strength === 'strong' ? 'angry' : 'defensive',
        revealsInfo: `${name} has a potential ${motive.type} motive`,
      });
    }

    return nodes;
  }

  private generateRelationships(suspects: ISuspectProfile[]): void {
    for (let i = 0; i < suspects.length; i++) {
      const relationships: ISuspectRelationship[] = [];

      for (let j = 0; j < suspects.length; j++) {
        if (i === j) continue;

        const other = suspects[j];
        const relationType = this.generateRelationType(suspects[i], other);

        relationships.push({
          targetId: other.id,
          targetName: other.name,
          type: relationType.type,
          description: relationType.description,
          tension: relationType.tension,
        });
      }

      suspects[i].relationships = relationships;
    }
  }

  private generateRelationType(
    suspect: ISuspectProfile,
    other: ISuspectProfile
  ): { type: string; description: string; tension: number } {
    const types = [
      { type: 'professional', description: 'Work together regularly', tension: 2 },
      { type: 'friendly', description: 'Get along well', tension: 1 },
      { type: 'neutral', description: 'Know each other but not close', tension: 3 },
      { type: 'tense', description: 'Have had disagreements', tension: 7 },
      { type: 'hostile', description: 'Do not get along at all', tension: 9 },
    ];

    // Higher motive strength increases chance of tense relationships
    const weights = suspect.motive.strength === 'strong'
      ? [1, 1, 2, 4, 2]
      : [2, 3, 3, 1, 1];

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < types.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return types[i];
      }
    }

    return types[2]; // Default to neutral
  }

  private selectRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// Register this phase
export function registerSuspectPoolPhase(): void {
  registry.registerPhase(new SuspectPoolPhase());
}
