/**
 * INTELLIGENT CASE GENERATOR v3.0
 *
 * Designed to generate 1,000,000+ unique cases through:
 * - 130+ Singapore locations
 * - 95+ crime types
 * - 10,000+ character name combinations
 * - 120+ clue templates
 * - 15 plot structures
 * - 10 briefing formats
 * - 68,600 context combinations (time × season × event × day × weather)
 * - Procedurally generated puzzles with random numbers
 *
 * Total theoretical combinations: 10^15+ unique cases
 */

import { nanoid } from 'nanoid';
import { GenerationRequest, GeneratedCase, Suspect, Clue, Puzzle, Scene } from './types';
import { fullSyllabus, SyllabusTopic } from './syllabus';

// Import modular data
import {
  allLocations,
  getRandomLocation,
  getLocationsByType,
  Location,
} from './data/locations';

import {
  plotTemplates,
  briefingTemplates,
  getRandomPlot,
  getBriefingTemplate,
  PlotTemplate,
  BriefingFormat,
} from './data/plots';

import {
  generateCharacterName,
  getFullName,
  getOccupationsForLocation,
  getRandomPersonality,
  getRandomMotive,
  getRandomAlibi,
  getRandomRelationship,
  CharacterName,
  Occupation,
} from './data/characters';

import {
  allCrimes,
  getRandomCrime,
  getCrimesForLocation,
  generateCrimeValue,
  CrimeType,
} from './data/crimes';

import {
  allClueTemplates,
  getRandomClue,
  getCluesByType,
  generateClueDescription,
  ClueTemplate,
} from './data/clues';

import {
  getRandomTimeContext,
  getRandomSeasonContext,
  getRandomEventContext,
  getRandomWeatherContext,
  getDayContext,
  TimeContext,
  SeasonContext,
  EventContext,
  WeatherContext,
} from './data/contexts';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ============================================
// CASE SEED GENERATOR
// ============================================

interface CaseSeed {
  location: Location;
  crime: CrimeType;
  crimeValue: number;
  plot: PlotTemplate;
  timeContext: TimeContext;
  seasonContext: SeasonContext;
  eventContext: EventContext | null;
  weatherContext: WeatherContext;
  dayOfWeek: string;
}

function generateCaseSeed(): CaseSeed {
  const location = getRandomLocation();
  const crimes = getCrimesForLocation(location.type);
  const crime = crimes.length > 0 ? pickRandom(crimes) : getRandomCrime();
  const crimeValue = generateCrimeValue(crime);
  const plot = getRandomPlot();

  const timeContext = getRandomTimeContext();
  const seasonContext = getRandomSeasonContext();
  const weatherContext = getRandomWeatherContext();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayOfWeek = pickRandom(days);

  // 50% chance of having a special event context
  const eventContext = Math.random() > 0.5
    ? getRandomEventContext(location.type)
    : null;

  return {
    location,
    crime,
    crimeValue,
    plot,
    timeContext,
    seasonContext,
    eventContext,
    weatherContext,
    dayOfWeek,
  };
}

// ============================================
// CHARACTER GENERATOR
// ============================================

interface GeneratedCharacter {
  id: string;
  name: string;
  role: string;
  age: number;
  personality: [string, string];
  alibi: string;
  isGuilty: boolean;
  motive?: string;
  relationship?: string;
}

function generateCharacters(
  location: Location,
  count: number,
  guiltyIndex: number
): GeneratedCharacter[] {
  const characters: GeneratedCharacter[] = [];
  const occupations = shuffle(getOccupationsForLocation(location.type));
  const ethnicities = shuffle(['chinese', 'malay', 'indian', 'eurasian'] as const);

  for (let i = 0; i < count; i++) {
    const ethnicity = ethnicities[i % ethnicities.length];
    const gender = pickRandom(['male', 'female'] as const);
    const charName = generateCharacterName(ethnicity, gender);
    const occupation = occupations[i % occupations.length];
    const isGuilty = i === guiltyIndex;

    const [minAge, maxAge] = occupation.ageRange;
    const age = random(minAge, maxAge);

    characters.push({
      id: `suspect-${nanoid(6)}`,
      name: getFullName(charName),
      role: occupation.title,
      age,
      personality: getRandomPersonality(),
      alibi: isGuilty
        ? pickRandom([
            'Claims to have been alone in a back room',
            'Says they were doing inventory by themselves',
            'Insists they were in the toilet',
            'Claims they were on a personal phone call',
            'Says they stepped out for fresh air',
          ])
        : getRandomAlibi(),
      isGuilty,
      motive: isGuilty ? getRandomMotive() : undefined,
      relationship: i > 0 ? getRandomRelationship() : undefined,
    });
  }

  return characters;
}

// ============================================
// BRIEFING GENERATOR
// ============================================

function generateBriefing(
  seed: CaseSeed,
  characters: GeneratedCharacter[],
  caseNumber: string
): string {
  const template = getBriefingTemplate(seed.plot.briefingFormat);
  const dayContext = getDayContext(seed.dayOfWeek);

  // Build context description
  const contextDesc = [
    seed.timeContext.description,
    seed.weatherContext.description,
    seed.seasonContext.description,
  ].join('. ');

  // Build crime description
  let crimeDesc = seed.crime.description;
  if (seed.crimeValue > 0) {
    crimeDesc += ` Estimated value: $${seed.crimeValue} ${seed.crime.valueUnit || ''}.`;
  }

  // Event context if applicable
  const eventDesc = seed.eventContext
    ? `This occurred during ${seed.eventContext.name}, when the area was ${seed.eventContext.crowdLevel === 'high' ? 'very crowded' : seed.eventContext.crowdLevel === 'medium' ? 'moderately busy' : 'relatively quiet'}.`
    : '';

  // Generate witness/reporter
  const reporter = pickRandom(characters);

  // Build briefing using template structure
  const header = pickRandom(template.header)
    .replace('{caseNumber}', caseNumber)
    .replace('{date}', `${seed.dayOfWeek}, ${pickRandom(seed.seasonContext.months)} ${random(1, 28)}`);

  const bodyStart = pickRandom(template.bodyStart)
    .replace('{date}', seed.dayOfWeek)
    .replace('{time}', seed.timeContext.name)
    .replace('{location}', `${seed.location.name}, ${seed.location.area}`)
    .replace('{officer}', `Officer ${pickRandom(['Tan', 'Lim', 'Lee', 'Ahmad', 'Singh'])}`)
    .replace('{headline}', seed.crime.name)
    .replace('{caseNumber}', caseNumber);

  const bodyMiddle = `
${crimeDesc}

${contextDesc}
${eventDesc}

The incident was reported by ${reporter.name} (${reporter.role}). Initial assessment suggests ${pickRandom([
    'this was a planned action',
    'someone with inside knowledge was involved',
    'the timing was deliberate',
    'multiple opportunities existed',
    'security measures were bypassed',
  ])}.

SUSPECTS IDENTIFIED:
${characters.map(c => `• ${c.name} - ${c.role}, ${c.age} years old`).join('\n')}
  `.trim();

  const bodyEnd = pickRandom(template.bodyEnd);
  const signature = pickRandom(template.signature)
    .replace('{officer}', `Detective ${pickRandom(['Wong', 'Goh', 'Kumar', 'Hassan'])}`)
    .replace('{station}', `${seed.location.area} Division`)
    .replace('{classification}', 'PRIORITY');

  return `${header}

${bodyStart}

${bodyMiddle}

${bodyEnd}

${signature}

---
Case Difficulty: ${seed.plot.difficulty.join('/')}
Structure: ${seed.plot.structure.toUpperCase()}
Location Type: ${seed.location.type}
  `.trim();
}

// ============================================
// CLUE GENERATOR
// ============================================

function generateClues(
  seed: CaseSeed,
  characters: GeneratedCharacter[],
  count: number
): Clue[] {
  const clues: Clue[] = [];
  const guiltyCharacter = characters.find(c => c.isGuilty)!;
  const innocentCharacters = characters.filter(c => !c.isGuilty);

  // Get clue types relevant to the crime
  const relevantTypes = seed.crime.clueTypes;

  // 1. Critical clue pointing to guilty party
  const criticalTemplate = getRandomClue(pickRandom(relevantTypes) as any);
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: `Key Evidence: ${criticalTemplate.name}`,
    description: `${generateClueDescription(criticalTemplate)} This evidence strongly suggests ${guiltyCharacter.name}'s involvement.`,
    type: criticalTemplate.type,
    relevance: 'critical',
    linkedTo: [guiltyCharacter.id],
  });

  // 2. Supporting clues
  const supportingCount = Math.min(count - 2, 4);
  for (let i = 0; i < supportingCount; i++) {
    const type = pickRandom(relevantTypes) as any;
    const template = getRandomClue(type);
    clues.push({
      id: `clue-${nanoid(6)}`,
      title: template.name,
      description: generateClueDescription(template),
      type: template.type,
      relevance: 'supporting',
      linkedTo: [],
    });
  }

  // 3. Red herring pointing to innocent person
  if (innocentCharacters.length > 0) {
    const redHerringTarget = pickRandom(innocentCharacters);
    const redHerringTemplate = getRandomClue();
    clues.push({
      id: `clue-${nanoid(6)}`,
      title: 'Suspicious Finding',
      description: `${generateClueDescription(redHerringTemplate)} This initially seems to implicate ${redHerringTarget.name}, but further investigation may reveal an innocent explanation.`,
      type: redHerringTemplate.type,
      relevance: 'red-herring',
      linkedTo: [redHerringTarget.id],
    });
  }

  return clues;
}

// ============================================
// PUZZLE GENERATORS (WITH RANDOM VALUES)
// ============================================

interface PuzzleContext {
  setting: string;
  characters: string[];
  crimeValue: number;
  timeContext: TimeContext;
}

function generateMathPuzzle(
  topic: SyllabusTopic,
  difficulty: number,
  ctx: PuzzleContext
): Puzzle {
  const puzzleId = `puzzle-${nanoid(6)}`;
  const strand = topic.strand;

  switch (strand) {
    case 'numbers': return generateNumbersPuzzle(puzzleId, difficulty, ctx);
    case 'measurement': return generateMeasurementPuzzle(puzzleId, difficulty, ctx);
    case 'geometry': return generateGeometryPuzzle(puzzleId, difficulty, ctx);
    case 'data': return generateDataPuzzle(puzzleId, difficulty, ctx);
    case 'algebra': return generateAlgebraPuzzle(puzzleId, difficulty, ctx);
    default: return generateNumbersPuzzle(puzzleId, difficulty, ctx);
  }
}

function generateNumbersPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const types = [
    // Addition/Subtraction
    () => {
      const n1 = random(100 * diff, 500 * diff);
      const n2 = random(50 * diff, 300 * diff);
      const n3 = random(20 * diff, 100 * diff);
      const char = pickRandom(ctx.characters);
      return {
        q: `${char} collected evidence items over 3 days: ${n1} on Day 1, ${n2} on Day 2, and ${n3} on Day 3. What is the total?`,
        a: String(n1 + n2 + n3),
        h: 'Add all three numbers together',
      };
    },
    // Multiplication
    () => {
      const boxes = random(3 * diff, 8 * diff);
      const items = random(10, 30 + diff * 10);
      return {
        q: `The evidence room has ${boxes} boxes with ${items} items each. How many items total?`,
        a: String(boxes * items),
        h: 'Multiply boxes by items per box',
      };
    },
    // Division
    () => {
      const people = random(3, 6 + diff);
      const total = people * random(10 * diff, 30 * diff);
      return {
        q: `$${total} was divided equally among ${people} people. How much did each receive?`,
        a: String(total / people),
        h: 'Divide total by number of people',
      };
    },
    // Multi-step
    () => {
      const initial = random(500 * diff, 1000 * diff);
      const spent = random(100 * diff, 300 * diff);
      const received = random(50 * diff, 200 * diff);
      return {
        q: `An account started with $${initial}. After withdrawing $${spent} and depositing $${received}, what's the balance?`,
        a: String(initial - spent + received),
        h: 'First subtract, then add',
      };
    },
    // Fractions
    () => {
      const num = pickRandom([1, 2, 3]);
      const den = pickRandom([2, 3, 4, 5]);
      const total = den * random(10 * diff, 30 * diff);
      return {
        q: `${num}/${den} of the ${total} fingerprints found belonged to staff. How many fingerprints were from staff?`,
        a: String((total * num) / den),
        h: `Multiply ${total} by ${num}/${den}`,
      };
    },
    // Percentage
    () => {
      const total = random(5, 20) * 10 * diff;
      const pct = pickRandom([10, 20, 25, 30, 40, 50, 60, 75]);
      return {
        q: `An alibi is verified for ${pct}% of ${total} minutes claimed. How many minutes verified?`,
        a: String((pct * total) / 100),
        h: `${pct}% of ${total} = ${pct}/100 × ${total}`,
      };
    },
    // Ratio
    () => {
      const r1 = random(2, 5);
      const r2 = random(2, 5);
      const mult = random(3 * diff, 8 * diff);
      const total = (r1 + r2) * mult;
      return {
        q: `Items were divided in ratio ${r1}:${r2}. With ${total} items total, how many in the first share?`,
        a: String(r1 * mult),
        h: `Total parts = ${r1 + r2}. One part = ${total}/${r1 + r2}`,
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id,
    title: pickRandom(['Evidence Analysis', 'Number Investigation', 'Calculation Clue', 'The Numbers Game']),
    type: 'math',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 3 + diff * 2,
    requiresMultipleSteps: diff > 2,
  };
}

function generateMeasurementPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const types = [
    // Time
    () => {
      const hours = random(1, 4);
      const mins = random(1, 5) * 10;
      return {
        q: `The incident window was ${hours} hour${hours > 1 ? 's' : ''} and ${mins} minutes. How many minutes total?`,
        a: String(hours * 60 + mins),
        h: 'Convert hours to minutes, then add',
      };
    },
    // Area
    () => {
      const l = random(5 * diff, 15 * diff);
      const w = random(3 * diff, 10 * diff);
      return {
        q: `The search area is ${l}m by ${w}m. What's the total area in m²?`,
        a: String(l * w),
        h: 'Area = length × width',
      };
    },
    // Perimeter
    () => {
      const l = random(8 * diff, 20 * diff);
      const w = random(4 * diff, 12 * diff);
      return {
        q: `Security tape surrounds a ${l}m by ${w}m area. How many meters of tape needed?`,
        a: String(2 * (l + w)),
        h: 'Perimeter = 2 × (length + width)',
      };
    },
    // Speed/Distance
    () => {
      const speed = pickRandom([30, 40, 50, 60, 80]);
      const time = random(1, 3);
      return {
        q: `A vehicle traveled at ${speed} km/h for ${time} hour${time > 1 ? 's' : ''}. How far?`,
        a: String(speed * time),
        h: 'Distance = Speed × Time',
      };
    },
    // Volume
    () => {
      const l = random(2 * diff, 5 * diff);
      const w = random(2 * diff, 4 * diff);
      const h = random(1 * diff, 3 * diff);
      return {
        q: `A box measuring ${l}cm × ${w}cm × ${h}cm was used. What's its volume in cm³?`,
        a: String(l * w * h),
        h: 'Volume = length × width × height',
      };
    },
    // Money
    () => {
      const n50 = random(2, 8);
      const n10 = random(3, 12);
      const n5 = random(5, 20);
      return {
        q: `Recovered money: ${n50} fifty-dollar notes, ${n10} ten-dollar notes, ${n5} five-dollar notes. Total?`,
        a: String(n50 * 50 + n10 * 10 + n5 * 5),
        h: 'Calculate each denomination and add',
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id,
    title: pickRandom(['Measurement Mystery', 'Distance Detective', 'Time Analysis', 'Area Investigation']),
    type: 'math',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + diff * 2,
    requiresMultipleSteps: diff > 2,
  };
}

function generateGeometryPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const types = [
    // Angles on line
    () => {
      const a1 = random(30, 150);
      return {
        q: `Two angles on a straight line: one is ${a1}°. What's the other?`,
        a: String(180 - a1),
        h: 'Angles on a straight line = 180°',
      };
    },
    // Triangle angles
    () => {
      const a1 = random(30, 80);
      const a2 = random(30, 80);
      return {
        q: `A triangle has angles ${a1}° and ${a2}°. What's the third angle?`,
        a: String(180 - a1 - a2),
        h: 'Triangle angles sum to 180°',
      };
    },
    // Quadrilateral
    () => {
      const angles = [random(70, 100), random(70, 100), random(70, 100)];
      return {
        q: `A quadrilateral has angles ${angles[0]}°, ${angles[1]}°, ${angles[2]}°. Fourth angle?`,
        a: String(360 - angles[0] - angles[1] - angles[2]),
        h: 'Quadrilateral angles sum to 360°',
      };
    },
    // Triangle area
    () => {
      const base = random(6 * diff, 16 * diff);
      const height = random(4 * diff, 12 * diff);
      return {
        q: `A triangular evidence piece: base ${base}cm, height ${height}cm. Area?`,
        a: String((base * height) / 2),
        h: 'Triangle area = ½ × base × height',
      };
    },
    // Circle
    () => {
      const r = random(3, 10) * diff;
      return {
        q: `A circular mark has radius ${r}cm. Circumference? (π = 3.14)`,
        a: String((2 * 3.14 * r).toFixed(2)),
        h: 'Circumference = 2 × π × radius',
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id,
    title: pickRandom(['Shape Evidence', 'Angle Analysis', 'Geometric Clue', 'Angular Evidence']),
    type: 'math',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + diff,
    requiresMultipleSteps: false,
  };
}

function generateDataPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const types = [
    // Average
    () => {
      const count = random(3, 5 + diff);
      const values = Array.from({ length: count }, () => random(10 * diff, 50 * diff));
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        q: `Reports over ${count} days: ${values.join(', ')}. Average per day?`,
        a: String(sum / count),
        h: `Sum all values, divide by ${count}`,
      };
    },
    // Range
    () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const values = days.map(() => random(5 * diff, 30 * diff));
      return {
        q: `Visitors: ${days.map((d, i) => `${d}:${values[i]}`).join(', ')}. Difference between highest and lowest?`,
        a: String(Math.max(...values) - Math.min(...values)),
        h: 'Find highest and lowest, then subtract',
      };
    },
    // Total from average
    () => {
      const avg = random(10 * diff, 30 * diff);
      const count = random(4, 8);
      return {
        q: `Average ${avg} clues across ${count} scenes. Total clues found?`,
        a: String(avg * count),
        h: 'Total = Average × Number',
      };
    },
    // Missing value
    () => {
      const values = [random(20, 50), random(20, 50), random(20, 50)];
      const targetAvg = random(30, 45);
      const missing = targetAvg * 4 - values.reduce((a, b) => a + b, 0);
      return {
        q: `Three scores: ${values.join(', ')}. Fourth score needed for average ${targetAvg}?`,
        a: String(missing),
        h: 'Total needed = Average × 4, then subtract known values',
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id,
    title: pickRandom(['Data Analysis', 'Statistics Clue', 'Average Investigation', 'Number Patterns']),
    type: 'math',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 15 + diff * 5,
    difficulty: diff,
    complexity: 'CHALLENGING',
    estimatedMinutes: 5 + diff * 2,
    requiresMultipleSteps: true,
  };
}

function generateAlgebraPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const types = [
    // Simple equation
    () => {
      const x = random(3, 15);
      const c = random(5, 20);
      const result = 2 * x + c;
      return {
        q: `If 2x + ${c} = ${result}, what is x?`,
        a: String(x),
        h: 'Subtract constant, then divide by 2',
      };
    },
    // Word problem
    () => {
      const x = random(5, 20);
      const extra = random(10, 30);
      const total = 3 * x + extra;
      return {
        q: `Triple a number and add ${extra} gives ${total}. What's the number?`,
        a: String(x),
        h: 'Solve: 3x + ' + extra + ' = ' + total,
      };
    },
    // Pattern
    () => {
      const start = random(2, 10);
      const step = random(3, 7);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return {
        q: `Pattern: ${seq.join(', ')}, ?. What comes next?`,
        a: String(start + 4 * step),
        h: 'Find what\'s added each time',
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id,
    title: pickRandom(['Code Breaker', 'Pattern Detective', 'Equation Mystery', 'The Unknown Variable']),
    type: 'math',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 15 + diff * 5,
    difficulty: diff,
    complexity: 'CHALLENGING',
    estimatedMinutes: 5 + diff * 2,
    requiresMultipleSteps: true,
  };
}

function generateSciencePuzzle(topic: SyllabusTopic, diff: number, ctx: PuzzleContext): Puzzle {
  const puzzleId = `puzzle-${nanoid(6)}`;

  const types = [
    // Classification
    () => {
      const animals = [
        { name: 'dolphin', group: 'mammal' },
        { name: 'penguin', group: 'bird' },
        { name: 'crocodile', group: 'reptile' },
        { name: 'frog', group: 'amphibian' },
        { name: 'whale', group: 'mammal' },
        { name: 'bat', group: 'mammal' },
        { name: 'salamander', group: 'amphibian' },
        { name: 'turtle', group: 'reptile' },
      ];
      const animal = pickRandom(animals);
      return {
        q: `A ${animal.name} was spotted. What animal group? (mammal/bird/reptile/amphibian/fish)`,
        a: animal.group,
        h: 'Think about its characteristics',
      };
    },
    // Life cycles
    () => {
      const cycles = [
        { org: 'butterfly', stages: 'egg → caterpillar → pupa → adult', missing: 'pupa' },
        { org: 'frog', stages: 'egg → tadpole → froglet → adult', missing: 'tadpole' },
        { org: 'mosquito', stages: 'egg → larva → pupa → adult', missing: 'larva' },
      ];
      const cycle = pickRandom(cycles);
      return {
        q: `${cycle.org} life cycle: egg → ? → adult. What's missing?`,
        a: cycle.missing,
        h: `Think about ${cycle.org} development`,
      };
    },
    // Food chain
    () => {
      const chains = [
        { q: 'grass → grasshopper → ? → snake', a: 'frog' },
        { q: 'algae → ? → big fish → shark', a: 'small fish' },
        { q: 'plant → caterpillar → bird → ?', a: 'cat' },
        { q: '? → rabbit → fox → eagle', a: 'grass' },
      ];
      const chain = pickRandom(chains);
      return {
        q: `Complete the food chain: ${chain.q}`,
        a: chain.a,
        h: 'What eats what?',
      };
    },
    // Energy
    () => {
      const conv = [
        { device: 'solar panel', from: 'light', to: 'electrical' },
        { device: 'fan', from: 'electrical', to: 'kinetic' },
        { device: 'light bulb', from: 'electrical', to: 'light' },
        { device: 'battery toy', from: 'chemical', to: 'kinetic' },
      ];
      const c = pickRandom(conv);
      return {
        q: `A ${c.device} converts what energy to what? (from ___ to ___)`,
        a: `${c.from} to ${c.to}`,
        h: 'What goes in? What comes out?',
      };
    },
    // Body systems
    () => {
      const sys = [
        { parts: 'heart, arteries, blood', system: 'circulatory' },
        { parts: 'lungs, trachea', system: 'respiratory' },
        { parts: 'stomach, intestines', system: 'digestive' },
      ];
      const s = pickRandom(sys);
      return {
        q: `These organs: ${s.parts}. What system?`,
        a: s.system,
        h: 'What do they do together?',
      };
    },
    // Circuits
    () => ({
      q: 'A bulb in a circuit doesn\'t light. The battery is new. What\'s likely wrong?',
      a: 'circuit not complete',
      h: 'Electricity needs a complete path',
    }),
    // Materials
    () => {
      const mat = [
        { item: 'copper wire', property: 'conductor' },
        { item: 'rubber', property: 'insulator' },
        { item: 'metal spoon', property: 'conductor' },
        { item: 'plastic', property: 'insulator' },
      ];
      const m = pickRandom(mat);
      return {
        q: `Is ${m.item} a conductor or insulator?`,
        a: m.property,
        h: 'Does it let electricity/heat pass?',
      };
    },
  ];

  const selected = pickRandom(types)();
  return {
    id: puzzleId,
    title: pickRandom(['Scientific Evidence', 'Nature Clue', 'Science Investigation', 'Biology Evidence']),
    type: 'logic',
    question: selected.q,
    answer: selected.a,
    hint: selected.h,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + diff,
    requiresMultipleSteps: false,
  };
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

export async function generateIntelligentCase(request: GenerationRequest): Promise<GeneratedCase> {
  const caseId = `case-${nanoid(10)}`;
  const caseNumber = `SG${random(10000, 99999)}`;
  const { difficulty, subject, gradeLevel, puzzleComplexity = 'STANDARD' } = request;

  // 1. Generate unique case seed
  const seed = generateCaseSeed();

  // 2. Determine suspect count based on difficulty
  const diffMap: Record<string, number> = { ROOKIE: 1, INSPECTOR: 2, DETECTIVE: 3, CHIEF: 4 };
  const diffNum = diffMap[difficulty] || 2;
  const suspectCount = Math.max(3, Math.min(seed.plot.suspectCount.min + diffNum - 1, seed.plot.suspectCount.max));
  const guiltyIndex = random(0, suspectCount - 1);

  // 3. Generate characters
  const characters = generateCharacters(seed.location, suspectCount, guiltyIndex);
  const guiltyCharacter = characters[guiltyIndex];

  // 4. Generate case title
  const titleAdjectives = ['Mysterious', 'Strange', 'Puzzling', 'Curious', 'Baffling', 'Perplexing', 'Intriguing'];
  const titleNouns = ['Case', 'Mystery', 'Incident', 'Affair', 'Investigation', 'Enigma'];
  const title = `The ${pickRandom(titleAdjectives)} ${pickRandom(titleNouns)} at ${seed.location.name}`;

  // 5. Generate briefing
  const briefing = generateBriefing(seed, characters, caseNumber);

  // 6. Generate clues
  const clueCount = Math.max(4, Math.min(seed.plot.clueCount.min + diffNum, seed.plot.clueCount.max));
  const clues = generateClues(seed, characters, clueCount);

  // 7. Generate puzzles based on syllabus
  const gradeTopics = fullSyllabus.filter(t => t.gradeLevel === gradeLevel);
  const subjectTopics = subject === 'INTEGRATED'
    ? gradeTopics
    : gradeTopics.filter(t => t.subject === subject);
  const selectedTopics = pickMultiple(subjectTopics, 3);
  const puzzleCount = puzzleComplexity === 'BASIC' ? 4 : puzzleComplexity === 'STANDARD' ? 3 : 2;

  const puzzleContext: PuzzleContext = {
    setting: seed.location.name,
    characters: characters.map(c => c.name),
    crimeValue: seed.crimeValue,
    timeContext: seed.timeContext,
  };

  const puzzles: Puzzle[] = [];
  for (let i = 0; i < puzzleCount; i++) {
    const topic = selectedTopics[i % selectedTopics.length];
    const puzzle = topic.subject === 'MATH'
      ? generateMathPuzzle(topic, diffNum, puzzleContext)
      : generateSciencePuzzle(topic, diffNum, puzzleContext);
    puzzles.push(puzzle);
  }

  // 8. Generate scenes
  const scenes: Scene[] = [
    {
      id: `scene-${nanoid(6)}`,
      name: seed.location.name,
      description: `${seed.location.name} in ${seed.location.area}. ${pickRandom(seed.timeContext.atmosphere)} ${seed.weatherContext.description.toLowerCase()}. ${pickRandom([
        'The area shows signs of recent activity.',
        'Everything appears normal at first glance.',
        'Subtle clues are scattered around.',
        'The atmosphere is tense.',
      ])}`,
      interactiveElements: ['Evidence Board', 'Witness Area', 'Investigation Zone', 'Clue Collection'],
      cluesAvailable: clues.slice(0, Math.ceil(clues.length / 2)).map(c => c.id),
    },
    {
      id: `scene-${nanoid(6)}`,
      name: 'Investigation Room',
      description: 'A quiet space to review evidence, interview suspects, and piece together the mystery.',
      interactiveElements: ['Evidence Table', 'Suspect Profiles', 'Timeline Board', 'Puzzle Station'],
      cluesAvailable: clues.slice(Math.ceil(clues.length / 2)).map(c => c.id),
    },
  ];

  // 9. Convert characters to suspects
  const suspects: Suspect[] = characters.map(c => ({
    id: c.id,
    name: c.name,
    role: c.role,
    alibi: c.alibi,
    personality: c.personality,
    isGuilty: c.isGuilty,
    motive: c.motive,
  }));

  // 10. Build story summary
  const crimeDescription = seed.crimeValue > 0
    ? `${seed.crime.name} - ${seed.crime.description} Value: $${seed.crimeValue}`
    : `${seed.crime.name} - ${seed.crime.description}`;

  // 11. Return complete case
  return {
    caseId,
    title,
    briefing,
    metadata: {
      difficulty,
      gradeLevel,
      subjectFocus: subject,
      estimatedMinutes: puzzleCount * (puzzleComplexity === 'BASIC' ? 5 : puzzleComplexity === 'STANDARD' ? 8 : 12),
      puzzleComplexity,
    },
    story: {
      setting: `${seed.location.name}, ${seed.location.area}`,
      crime: crimeDescription,
      resolution: `Through careful analysis of the evidence and solving the puzzles, you discovered that ${guiltyCharacter.name} (${guiltyCharacter.role}) was responsible. ${guiltyCharacter.motive ? `They did it because they ${guiltyCharacter.motive}.` : ''}`,
    },
    suspects,
    clues,
    puzzles,
    scenes,
  };
}

// Export for statistics
export const generatorStats = {
  locations: allLocations.length,
  crimes: allCrimes.length,
  clueTemplates: allClueTemplates.length,
  plotTemplates: plotTemplates.length,
  briefingFormats: Object.keys(briefingTemplates).length,
  estimatedUniqueCases: '10^15+',
};
