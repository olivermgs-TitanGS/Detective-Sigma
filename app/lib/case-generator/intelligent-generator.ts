/**
 * INTELLIGENT CASE GENERATOR v2.0
 *
 * Creates TRULY UNIQUE detective cases through:
 * 1. Modular story building blocks that combine differently each time
 * 2. Procedurally generated puzzles with random numbers/contexts
 * 3. Dynamic character generation with varied backgrounds
 * 4. Multiple crime variants and twists
 * 5. Time-based and seasonal variations
 * 6. Singapore-specific cultural elements
 */

import { nanoid } from 'nanoid';
import {
  SyllabusTopic,
  fullSyllabus,
  getTopicsByGrade,
} from './syllabus';
import { GenerationRequest, GeneratedCase, Suspect, Clue, Puzzle, Scene } from './types';

// ============================================
// RANDOMIZATION UTILITIES
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
// BUILDING BLOCKS - SETTINGS
// ============================================

const settings = {
  school: [
    { name: 'Raffles Primary School', area: 'Bishan', type: 'school' },
    { name: 'Nanyang Primary School', area: 'Bukit Timah', type: 'school' },
    { name: 'Tao Nan School', area: 'Marine Parade', type: 'school' },
    { name: 'Fairfield Methodist Primary', area: 'Dover', type: 'school' },
    { name: 'CHIJ St. Nicholas Girls', area: 'Ang Mo Kio', type: 'school' },
  ],
  hawkerCentre: [
    { name: 'Old Airport Road Hawker', area: 'Geylang', type: 'hawker' },
    { name: 'Maxwell Food Centre', area: 'Chinatown', type: 'hawker' },
    { name: 'Tiong Bahru Market', area: 'Tiong Bahru', type: 'hawker' },
    { name: 'Chomp Chomp Food Centre', area: 'Serangoon', type: 'hawker' },
    { name: 'Adam Road Food Centre', area: 'Bukit Timah', type: 'hawker' },
  ],
  mall: [
    { name: 'Vivocity', area: 'HarbourFront', type: 'mall' },
    { name: 'NEX', area: 'Serangoon', type: 'mall' },
    { name: 'Jurong Point', area: 'Jurong', type: 'mall' },
    { name: 'Tampines Mall', area: 'Tampines', type: 'mall' },
    { name: 'Northpoint City', area: 'Yishun', type: 'mall' },
  ],
  nature: [
    { name: 'Singapore Botanic Gardens', area: 'Tanglin', type: 'nature' },
    { name: 'East Coast Park', area: 'East Coast', type: 'nature' },
    { name: 'Sungei Buloh Wetland', area: 'Kranji', type: 'nature' },
    { name: 'MacRitchie Reservoir', area: 'Bishan', type: 'nature' },
    { name: 'Labrador Nature Reserve', area: 'Labrador', type: 'nature' },
  ],
  hdb: [
    { name: 'Block 123', area: 'Ang Mo Kio', type: 'hdb' },
    { name: 'Block 456', area: 'Bedok', type: 'hdb' },
    { name: 'Block 789', area: 'Tampines', type: 'hdb' },
    { name: 'Block 234', area: 'Woodlands', type: 'hdb' },
    { name: 'Block 567', area: 'Jurong East', type: 'hdb' },
  ],
  community: [
    { name: 'Bishan Community Club', area: 'Bishan', type: 'cc' },
    { name: 'Tampines Hub', area: 'Tampines', type: 'cc' },
    { name: 'Our Tampines Hub', area: 'Tampines', type: 'cc' },
    { name: 'Pasir Ris Sports Centre', area: 'Pasir Ris', type: 'cc' },
  ],
};

// ============================================
// BUILDING BLOCKS - CRIMES
// ============================================

const crimeTypes = {
  theft: [
    { item: 'collection money', value: () => random(50, 500), unit: 'dollars' },
    { item: 'donation box funds', value: () => random(100, 800), unit: 'dollars' },
    { item: 'sports equipment', value: () => random(200, 1000), unit: 'dollars worth' },
    { item: 'camera equipment', value: () => random(500, 2000), unit: 'dollars worth' },
    { item: 'laptop', value: () => random(800, 1500), unit: 'dollar' },
    { item: 'science lab supplies', value: () => random(300, 700), unit: 'dollars worth' },
    { item: 'prize money', value: () => random(100, 500), unit: 'dollars' },
    { item: 'charity funds', value: () => random(200, 1000), unit: 'dollars' },
  ],
  sabotage: [
    { target: 'science project', description: 'data was tampered with' },
    { target: 'sports equipment', description: 'was deliberately damaged' },
    { target: 'competition entry', description: 'was mysteriously ruined' },
    { target: 'garden plants', description: 'were poisoned overnight' },
    { target: 'cooking ingredients', description: 'were spoiled intentionally' },
    { target: 'art installation', description: 'was vandalized' },
  ],
  mystery: [
    { event: 'Strange noises at night', clue: 'unusual sounds recorded' },
    { event: 'Missing pet', clue: 'paw prints found' },
    { event: 'Anonymous threats', clue: 'mysterious notes left' },
    { event: 'Power outages', clue: 'electrical tampering detected' },
    { event: 'Food contamination', clue: 'foreign substances found' },
  ],
  fraud: [
    { scheme: 'fake tickets', amount: () => random(20, 100) },
    { scheme: 'counterfeit coupons', amount: () => random(50, 200) },
    { scheme: 'altered receipts', amount: () => random(100, 500) },
    { scheme: 'false expense claims', amount: () => random(200, 800) },
  ],
};

// ============================================
// BUILDING BLOCKS - CHARACTERS
// ============================================

const firstNames = {
  chinese: ['Wei Jie', 'Xiao Ming', 'Jia Hui', 'Zhi Wei', 'Mei Ling', 'Jun Hao', 'Xin Yi', 'Yi Xuan', 'Kai Wen', 'Yu Ting', 'Zi Yang', 'Hui Min', 'Jing Wen', 'Shi Jie', 'Xue Ying'],
  malay: ['Ahmad', 'Fatimah', 'Iskandar', 'Nurul', 'Hafiz', 'Aisyah', 'Rizwan', 'Siti', 'Amir', 'Zainab', 'Farhan', 'Nadia', 'Imran', 'Aishah', 'Danish'],
  indian: ['Priya', 'Raj', 'Ananya', 'Arjun', 'Kavitha', 'Vikram', 'Lakshmi', 'Karthik', 'Deepa', 'Suresh', 'Divya', 'Rahul', 'Meera', 'Arun', 'Shreya'],
  others: ['Daniel', 'Michelle', 'Adrian', 'Sophie', 'Marcus', 'Emma', 'Nathan', 'Chloe', 'Ryan', 'Sarah', 'Ethan', 'Olivia', 'Joshua', 'Grace', 'Lucas'],
};

const surnames = {
  chinese: ['Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Goh', 'Chua', 'Ong', 'Koh', 'Teo', 'Chen', 'Ho', 'Yeo', 'Sim', 'Chong'],
  malay: ['bin Ahmad', 'binti Hassan', 'bin Osman', 'binti Rahman', 'bin Yusof', 'binti Ali'],
  indian: ['Pillai', 'Nair', 'Menon', 'Kumar', 'Sharma', 'Patel', 'Singh', 'Rao'],
  others: ['Pereira', 'Rozario', 'Shepherdson', 'Clarke', 'Williams', 'Johnson'],
};

const occupations = {
  school: ['Teacher', 'Principal', 'Clerk', 'Canteen Vendor', 'Security Guard', 'Librarian', 'Lab Assistant', 'Gardener', 'Coach', 'Counsellor'],
  hawker: ['Stall Owner', 'Assistant', 'Cleaner', 'Delivery Rider', 'Regular Customer', 'Food Supplier', 'NEA Inspector'],
  mall: ['Shop Manager', 'Sales Assistant', 'Security Officer', 'Cleaner', 'Promoter', 'Customer Service'],
  nature: ['Park Ranger', 'Volunteer Guide', 'Photographer', 'Jogger', 'Bird Watcher', 'Maintenance Worker'],
  hdb: ['Town Council Staff', 'Resident', 'Cleaner', 'Security Guard', 'Delivery Person', 'Estate Manager'],
  cc: ['Manager', 'Instructor', 'Volunteer', 'Member', 'Event Organizer', 'Receptionist'],
};

const personalities = [
  ['nervous', 'fidgety'], ['calm', 'collected'], ['aggressive', 'defensive'],
  ['friendly', 'helpful'], ['quiet', 'reserved'], ['loud', 'attention-seeking'],
  ['suspicious', 'evasive'], ['confident', 'articulate'], ['confused', 'scattered'],
  ['angry', 'hostile'], ['sad', 'withdrawn'], ['cheerful', 'optimistic'],
];

const motives = [
  'needed money urgently for family medical bills',
  'was jealous of someone else\'s success',
  'wanted revenge for a past grievance',
  'was pressured by someone threatening them',
  'believed they deserved it more than others',
  'made a mistake and tried to cover it up',
  'wanted to impress someone important to them',
  'was struggling financially and saw an opportunity',
  'had a gambling debt to pay off',
  'wanted to sabotage a competitor',
  'felt underappreciated and resentful',
  'was blackmailed into doing it',
  'thought no one would notice or care',
  'did it as a prank that went too far',
  'was trying to help someone else in trouble',
];

const alibis = [
  'was at a doctor\'s appointment',
  'was picking up children from school',
  'was stuck in traffic on the PIE',
  'was attending a family gathering',
  'was on the phone with a client',
  'was working overtime in another location',
  'was at a religious service',
  'was grocery shopping at NTUC',
  'was exercising at the gym',
  'was meeting a friend for coffee',
  'was at the bank handling some matters',
  'was helping a neighbor move furniture',
  'was at the clinic waiting to see a doctor',
  'was attending a course at the CC',
];

// ============================================
// BUILDING BLOCKS - CLUES
// ============================================

const clueTemplates = {
  physical: [
    { name: 'Fingerprint', desc: () => `A partial fingerprint was found on the ${pickRandom(['door handle', 'window', 'desk drawer', 'locker', 'cabinet'])}` },
    { name: 'Footprint', desc: () => `A ${pickRandom(['muddy', 'dusty', 'wet'])} footprint (size ${random(36, 44)}) was discovered near the scene` },
    { name: 'Fabric', desc: () => `A small piece of ${pickRandom(['blue', 'red', 'green', 'black', 'white'])} ${pickRandom(['cotton', 'polyester', 'denim'])} was caught on a ${pickRandom(['nail', 'fence', 'door hinge'])}` },
    { name: 'Hair Strand', desc: () => `A ${pickRandom(['black', 'brown', 'grey'])} hair was found at the scene` },
    { name: 'Dropped Item', desc: () => `A ${pickRandom(['pen', 'button', 'coin', 'keychain', 'card'])} was found on the floor` },
  ],
  document: [
    { name: 'Receipt', desc: () => `A receipt from ${pickRandom(['7-Eleven', 'NTUC', 'Cold Storage', 'a coffee shop'])} dated ${randomDate()} at ${randomTime()}` },
    { name: 'Note', desc: () => `A handwritten note with ${pickRandom(['a phone number', 'an address', 'a cryptic message', 'a to-do list'])}` },
    { name: 'Schedule', desc: () => `A printed schedule showing activities from ${randomTime()} to ${randomTime()}` },
    { name: 'Log Book Entry', desc: () => `An entry in the ${pickRandom(['visitor', 'security', 'maintenance'])} log at ${randomTime()}` },
    { name: 'Photo', desc: () => `A ${pickRandom(['blurry', 'clear', 'partially obscured'])} photo from a ${pickRandom(['phone', 'security camera', 'CCTV'])}` },
  ],
  testimony: [
    { name: 'Witness Account', desc: () => `Someone saw a person ${pickRandom(['running', 'walking quickly', 'acting suspiciously', 'carrying something'])} at around ${randomTime()}` },
    { name: 'Sound Evidence', desc: () => `A ${pickRandom(['loud noise', 'argument', 'door slamming', 'footsteps'])} was heard at approximately ${randomTime()}` },
    { name: 'Sighting', desc: () => `The suspect was spotted at ${pickRandom(['the void deck', 'the carpark', 'the stairwell', 'near the scene'])} before the incident` },
  ],
  digital: [
    { name: 'CCTV Footage', desc: () => `CCTV captured movement at ${randomTime()}, showing a figure ${pickRandom(['entering', 'leaving', 'lingering near'])} the area` },
    { name: 'Access Log', desc: () => `The access card system recorded an entry at ${randomTime()} using card #${random(1000, 9999)}` },
    { name: 'Phone Records', desc: () => `Phone records show a ${random(2, 15)} minute call at ${randomTime()}` },
    { name: 'Transaction History', desc: () => `A ${pickRandom(['cash withdrawal', 'transfer', 'payment'])} of $${random(20, 500)} was made at ${randomTime()}` },
  ],
};

function randomDate(): string {
  const day = random(1, 28);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${pickRandom(months)}`;
}

function randomTime(): string {
  const hour = random(6, 22);
  const minute = random(0, 59);
  const period = hour < 12 ? 'am' : 'pm';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// ============================================
// PUZZLE GENERATION - TRULY RANDOM
// ============================================

interface PuzzleContext {
  setting: string;
  characters: string[];
  items: string[];
  crimeValue: number;
}

function generateMathPuzzle(topic: SyllabusTopic, difficulty: number, ctx: PuzzleContext): Puzzle {
  const puzzleId = `puzzle-${nanoid(6)}`;
  const strand = topic.strand;

  // Generate completely unique puzzles based on strand
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
  const puzzleTypes = [
    // Addition/Subtraction word problems
    () => {
      const n1 = random(100 * diff, 500 * diff);
      const n2 = random(50 * diff, 300 * diff);
      const n3 = random(20 * diff, 100 * diff);
      const char = pickRandom(ctx.characters);
      return {
        question: `${char} collected evidence items over 3 days: ${n1} on Monday, ${n2} on Tuesday, and ${n3} on Wednesday. How many items were collected in total?`,
        answer: String(n1 + n2 + n3),
        hint: 'Add all three numbers together',
      };
    },
    // Multiplication
    () => {
      const boxes = random(3 * diff, 8 * diff);
      const itemsPerBox = random(10, 30 + diff * 10);
      return {
        question: `The evidence room has ${boxes} boxes, each containing ${itemsPerBox} items. How many items are there in total?`,
        answer: String(boxes * itemsPerBox),
        hint: 'Multiply the number of boxes by items per box',
      };
    },
    // Division
    () => {
      const people = random(3, 6 + diff);
      const total = people * random(10 * diff, 30 * diff);
      return {
        question: `$${total} was split equally among ${people} suspects as their share of the stolen money. How much did each person receive?`,
        answer: String(total / people),
        hint: 'Divide the total by the number of people',
      };
    },
    // Multi-step
    () => {
      const initial = random(500 * diff, 1000 * diff);
      const spent = random(100 * diff, 300 * diff);
      const received = random(50 * diff, 200 * diff);
      const char = pickRandom(ctx.characters);
      return {
        question: `${char} had $${initial} in their account. They withdrew $${spent} and later deposited $${received}. How much is in the account now?`,
        answer: String(initial - spent + received),
        hint: 'First subtract, then add',
      };
    },
    // Fraction of quantity
    () => {
      const fractionNum = pickRandom([1, 2, 3]);
      const fractionDen = pickRandom([2, 3, 4, 5]);
      const total = fractionDen * random(10 * diff, 30 * diff);
      return {
        question: `${fractionNum}/${fractionDen} of the ${total} fingerprints found at the scene belonged to staff members. How many fingerprints were from staff?`,
        answer: String((total * fractionNum) / fractionDen),
        hint: `Multiply ${total} by ${fractionNum}/${fractionDen}`,
      };
    },
    // Percentage
    () => {
      const total = random(5, 20) * 10 * diff;
      const pct = pickRandom([10, 20, 25, 30, 40, 50, 60, 75]);
      const char = pickRandom(ctx.characters);
      return {
        question: `${char}'s alibi checks out for ${pct}% of the ${total} minutes they claimed to be elsewhere. For how many minutes is the alibi verified?`,
        answer: String((pct * total) / 100),
        hint: `${pct}% of ${total} = ${pct}/100 × ${total}`,
      };
    },
    // Ratio
    () => {
      const ratio1 = random(2, 5);
      const ratio2 = random(2, 5);
      const multiplier = random(3 * diff, 8 * diff);
      const total = (ratio1 + ratio2) * multiplier;
      const char1 = ctx.characters[0];
      const char2 = ctx.characters[1] || 'another suspect';
      return {
        question: `${char1} and ${char2} divided the stolen goods in the ratio ${ratio1}:${ratio2}. If there were ${total} items in total, how many did ${char1} take?`,
        answer: String(ratio1 * multiplier),
        hint: `Total parts = ${ratio1 + ratio2}. One part = ${total}/${ratio1 + ratio2}`,
      };
    },
  ];

  const selected = pickRandom(puzzleTypes)();
  return {
    id,
    title: pickRandom(['Evidence Analysis', 'Number Investigation', 'Calculation Clue', 'The Numbers Game', 'Mathematical Evidence']),
    type: 'math',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 3 + diff * 2,
    requiresMultipleSteps: diff > 2,
  };
}

function generateMeasurementPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const puzzleTypes = [
    // Time duration
    () => {
      const startHour = random(8, 16);
      const startMin = random(0, 5) * 10;
      const durationHours = random(1, 4);
      const durationMins = random(1, 5) * 10;
      const endHour = startHour + durationHours + Math.floor((startMin + durationMins) / 60);
      const endMin = (startMin + durationMins) % 60;
      return {
        question: `The incident occurred between ${startHour}:${startMin.toString().padStart(2, '0')} and ${endHour}:${endMin.toString().padStart(2, '0')}. How long was this time window in minutes?`,
        answer: String(durationHours * 60 + durationMins),
        hint: 'Convert hours to minutes, then add the extra minutes',
      };
    },
    // Area
    () => {
      const length = random(5 * diff, 15 * diff);
      const width = random(3 * diff, 10 * diff);
      return {
        question: `The crime scene is a rectangular area measuring ${length}m by ${width}m. What is the total area that needs to be searched?`,
        answer: String(length * width),
        hint: 'Area = length × width',
      };
    },
    // Perimeter
    () => {
      const length = random(8 * diff, 20 * diff);
      const width = random(4 * diff, 12 * diff);
      return {
        question: `Security tape needs to surround a ${length}m by ${width}m area. How many meters of tape are needed?`,
        answer: String(2 * (length + width)),
        hint: 'Perimeter = 2 × (length + width)',
      };
    },
    // Speed/Distance/Time
    () => {
      const speed = pickRandom([30, 40, 50, 60, 80]);
      const time = random(1, 3);
      return {
        question: `The suspect's vehicle traveled at ${speed} km/h for ${time} hour${time > 1 ? 's' : ''}. How far did they travel?`,
        answer: String(speed * time),
        hint: 'Distance = Speed × Time',
      };
    },
    // Volume/Capacity
    () => {
      const length = random(2 * diff, 5 * diff);
      const width = random(2 * diff, 4 * diff);
      const height = random(1 * diff, 3 * diff);
      return {
        question: `A box measuring ${length}cm × ${width}cm × ${height}cm was used to hide the stolen items. What is its volume in cm³?`,
        answer: String(length * width * height),
        hint: 'Volume = length × width × height',
      };
    },
    // Money calculation
    () => {
      const notes50 = random(2, 8);
      const notes10 = random(3, 12);
      const notes5 = random(5, 20);
      return {
        question: `The recovered money consisted of ${notes50} fifty-dollar notes, ${notes10} ten-dollar notes, and ${notes5} five-dollar notes. What was the total amount?`,
        answer: String(notes50 * 50 + notes10 * 10 + notes5 * 5),
        hint: 'Calculate each denomination and add them up',
      };
    },
  ];

  const selected = pickRandom(puzzleTypes)();
  return {
    id,
    title: pickRandom(['Time Analysis', 'Measurement Mystery', 'Distance Detective', 'Area Investigation', 'Dimension Clue']),
    type: 'math',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + diff * 2,
    requiresMultipleSteps: diff > 2,
  };
}

function generateGeometryPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const puzzleTypes = [
    // Angles on straight line
    () => {
      const angle1 = random(30 * diff, 70 * diff);
      const answer = 180 - angle1;
      return {
        question: `Two pieces of evidence were found forming angles on a straight line. If one angle measures ${angle1}°, what is the other angle?`,
        answer: String(answer),
        hint: 'Angles on a straight line add up to 180°',
      };
    },
    // Triangle angles
    () => {
      const a1 = random(30, 80);
      const a2 = random(30, 80);
      const a3 = 180 - a1 - a2;
      return {
        question: `A triangular piece of evidence has two angles measuring ${a1}° and ${a2}°. What is the third angle?`,
        answer: String(a3),
        hint: 'The angles in a triangle add up to 180°',
      };
    },
    // Quadrilateral angles
    () => {
      const angles = [random(70, 100), random(70, 100), random(70, 100)];
      const fourth = 360 - angles[0] - angles[1] - angles[2];
      return {
        question: `A quadrilateral-shaped mark has three angles: ${angles[0]}°, ${angles[1]}°, and ${angles[2]}°. What is the fourth angle?`,
        answer: String(fourth),
        hint: 'The angles in a quadrilateral add up to 360°',
      };
    },
    // Triangle area
    () => {
      const base = random(6 * diff, 16 * diff);
      const height = random(4 * diff, 12 * diff);
      return {
        question: `A triangular piece of broken glass has a base of ${base}cm and a height of ${height}cm. What is its area?`,
        answer: String((base * height) / 2),
        hint: 'Triangle area = ½ × base × height',
      };
    },
    // Circle (P6)
    () => {
      const radius = random(3, 10) * diff;
      return {
        question: `A circular mark with radius ${radius}cm was found. What is its circumference? (Use π = 3.14)`,
        answer: String((2 * 3.14 * radius).toFixed(2)),
        hint: 'Circumference = 2 × π × radius',
      };
    },
  ];

  const selected = pickRandom(puzzleTypes)();
  return {
    id,
    title: pickRandom(['Angle Analysis', 'Shape Evidence', 'Geometric Clue', 'The Shape Mystery', 'Angular Evidence']),
    type: 'math',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 10 + diff * 5,
    difficulty: diff,
    complexity: diff <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + diff,
    requiresMultipleSteps: false,
  };
}

function generateDataPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const puzzleTypes = [
    // Average
    () => {
      const count = random(3, 5 + diff);
      const values = Array.from({ length: count }, () => random(10 * diff, 50 * diff));
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / count;
      return {
        question: `Incident reports for ${count} days showed: ${values.join(', ')} reports. What was the average number of reports per day?`,
        answer: String(avg),
        hint: `Sum all values and divide by ${count}`,
      };
    },
    // Reading from data
    () => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const values = days.map(() => random(5 * diff, 30 * diff));
      const maxDay = days[values.indexOf(Math.max(...values))];
      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);
      return {
        question: `Visitor log:\n${days.map((d, i) => `${d}: ${values[i]}`).join('\n')}\n\nWhat is the difference between the highest and lowest number of visitors?`,
        answer: String(maxVal - minVal),
        hint: 'Find the highest and lowest, then subtract',
      };
    },
    // Total from average
    () => {
      const avg = random(10 * diff, 30 * diff);
      const count = random(4, 8);
      return {
        question: `The average number of clues found per scene was ${avg} across ${count} scenes. How many clues were found in total?`,
        answer: String(avg * count),
        hint: 'Total = Average × Number of items',
      };
    },
    // Missing value from average
    () => {
      const values = [random(20, 50), random(20, 50), random(20, 50)];
      const targetAvg = random(30, 45);
      const missingVal = targetAvg * 4 - values.reduce((a, b) => a + b, 0);
      return {
        question: `Three test scores are ${values.join(', ')}. What must the fourth score be to get an average of ${targetAvg}?`,
        answer: String(missingVal),
        hint: 'Total needed = Average × 4. Then subtract the known values.',
      };
    },
  ];

  const selected = pickRandom(puzzleTypes)();
  return {
    id,
    title: pickRandom(['Data Analysis', 'Statistics Clue', 'Average Investigation', 'The Data Trail', 'Number Patterns']),
    type: 'math',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 15 + diff * 5,
    difficulty: diff,
    complexity: 'CHALLENGING',
    estimatedMinutes: 5 + diff * 2,
    requiresMultipleSteps: true,
  };
}

function generateAlgebraPuzzle(id: string, diff: number, ctx: PuzzleContext): Puzzle {
  const puzzleTypes = [
    // Simple equation
    () => {
      const x = random(3, 15);
      const constant = random(5, 20);
      const result = 2 * x + constant;
      return {
        question: `If 2x + ${constant} = ${result}, what is the value of x?`,
        answer: String(x),
        hint: 'First subtract the constant, then divide by 2',
      };
    },
    // Word problem to equation
    () => {
      const x = random(5, 20);
      const extra = random(10, 30);
      const total = 3 * x + extra;
      const char = pickRandom(ctx.characters);
      return {
        question: `${char} has some items. If we triple the number and add ${extra}, we get ${total}. How many items does ${char} have?`,
        answer: String(x),
        hint: 'Let the items be x. Solve: 3x + ' + extra + ' = ' + total,
      };
    },
    // Two unknowns (substitution)
    () => {
      const x = random(5, 15);
      const y = random(3, 12);
      return {
        question: `If x + y = ${x + y} and x = ${x}, what is y?`,
        answer: String(y),
        hint: 'Substitute x into the first equation',
      };
    },
    // Pattern finding
    () => {
      const start = random(2, 10);
      const diff_seq = random(3, 7);
      const seq = [start, start + diff_seq, start + 2 * diff_seq, start + 3 * diff_seq];
      return {
        question: `A coded message shows: ${seq.join(', ')}, ?. What number comes next?`,
        answer: String(start + 4 * diff_seq),
        hint: 'Find the pattern - what is added each time?',
      };
    },
  ];

  const selected = pickRandom(puzzleTypes)();
  return {
    id,
    title: pickRandom(['Code Breaker', 'Algebra Evidence', 'The Unknown Variable', 'Pattern Detective', 'Equation Mystery']),
    type: 'math',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 15 + diff * 5,
    difficulty: diff,
    complexity: 'CHALLENGING',
    estimatedMinutes: 5 + diff * 2,
    requiresMultipleSteps: true,
  };
}

function generateSciencePuzzle(topic: SyllabusTopic, difficulty: number, ctx: PuzzleContext): Puzzle {
  const puzzleId = `puzzle-${nanoid(6)}`;

  // Generate based on topic strand
  const sciencePuzzles = [
    // Classification
    () => {
      const animals = [
        { name: 'dolphin', group: 'mammal', reason: 'breathes air, gives birth to live young, feeds milk' },
        { name: 'penguin', group: 'bird', reason: 'has feathers, lays eggs, has beak' },
        { name: 'crocodile', group: 'reptile', reason: 'has scales, cold-blooded, lays eggs on land' },
        { name: 'frog', group: 'amphibian', reason: 'moist skin, lives in water and land, undergoes metamorphosis' },
        { name: 'whale', group: 'mammal', reason: 'breathes air, feeds milk to young' },
        { name: 'bat', group: 'mammal', reason: 'has fur, gives birth to live young' },
      ];
      const animal = pickRandom(animals);
      return {
        question: `A ${animal.name} was spotted near the crime scene. What group of animals does it belong to? (mammal/bird/reptile/amphibian/fish)`,
        answer: animal.group,
        hint: animal.reason,
      };
    },
    // Life cycles
    () => {
      const cycles = [
        { organism: 'butterfly', stages: 'egg, caterpillar (larva), pupa (chrysalis), adult butterfly', missing: 'pupa' },
        { organism: 'frog', stages: 'egg, tadpole, tadpole with legs, froglet, adult frog', missing: 'tadpole' },
        { organism: 'plant', stages: 'seed, germination, seedling, adult plant, flowering, fruiting', missing: 'germination' },
      ];
      const cycle = pickRandom(cycles);
      return {
        question: `Evidence shows a ${cycle.organism} life cycle with a missing stage: egg → ? → adult. What stage comes in between? (Hint: ${cycle.organism} life cycle)`,
        answer: cycle.missing,
        hint: `Think about the ${cycle.organism} life cycle: ${cycle.stages}`,
      };
    },
    // Food chains
    () => {
      const chains = [
        { chain: ['grass', 'grasshopper', 'frog', 'snake', 'eagle'], question: 'grass → grasshopper → ? → snake', answer: 'frog' },
        { chain: ['algae', 'small fish', 'big fish', 'shark'], question: 'algae → ? → big fish → shark', answer: 'small fish' },
        { chain: ['plant', 'caterpillar', 'bird', 'cat'], question: 'plant → caterpillar → bird → ?', answer: 'cat' },
      ];
      const fc = pickRandom(chains);
      return {
        question: `Complete this food chain found in the evidence: ${fc.question}`,
        answer: fc.answer,
        hint: 'Think about what eats what in the food chain',
      };
    },
    // Energy conversion
    () => {
      const conversions = [
        { device: 'solar panel', from: 'light/solar', to: 'electrical' },
        { device: 'electric fan', from: 'electrical', to: 'kinetic' },
        { device: 'light bulb', from: 'electrical', to: 'light and heat' },
        { device: 'battery-powered toy car', from: 'chemical', to: 'kinetic' },
        { device: 'microphone', from: 'sound', to: 'electrical' },
      ];
      const conv = pickRandom(conversions);
      return {
        question: `A ${conv.device} was found at the scene. What energy conversion occurs in a ${conv.device}? (from ___ energy to ___ energy)`,
        answer: `${conv.from} to ${conv.to}`,
        hint: `Think about what goes IN and what comes OUT of a ${conv.device}`,
      };
    },
    // Body systems
    () => {
      const systems = [
        { parts: 'heart, arteries, veins, blood', system: 'circulatory' },
        { parts: 'lungs, trachea, diaphragm', system: 'respiratory' },
        { parts: 'stomach, intestines, liver', system: 'digestive' },
      ];
      const sys = pickRandom(systems);
      return {
        question: `Medical evidence mentions: ${sys.parts}. What body system do these belong to?`,
        answer: sys.system,
        hint: 'Think about what these organs do together',
      };
    },
    // Circuits
    () => {
      const scenarios = [
        { setup: 'battery connected to bulb with wire, but bulb doesn\'t light', reason: 'circuit is not complete/closed', fix: 'complete the circuit' },
        { setup: 'two bulbs in series, one burns out', result: 'both bulbs go out', reason: 'series circuit breaks when one component fails' },
        { setup: 'wire connected to both terminals of same battery end', result: 'short circuit', reason: 'electricity takes the shortest path' },
      ];
      const scenario = pickRandom(scenarios);
      return {
        question: `The electrical evidence shows: ${scenario.setup}. What happened and why?`,
        answer: scenario.reason,
        hint: 'Think about how electricity flows in circuits',
      };
    },
    // Materials and properties
    () => {
      const materials = [
        { material: 'copper wire', property: 'conductor', test: 'electricity flows through it' },
        { material: 'rubber gloves', property: 'insulator', test: 'electricity does not flow through' },
        { material: 'metal spoon', property: 'conductor', test: 'heat transfers quickly' },
        { material: 'wooden handle', property: 'insulator', test: 'stays cool to touch' },
      ];
      const mat = pickRandom(materials);
      return {
        question: `${pickRandom(['A', 'Evidence shows a'])} ${mat.material} was used. Is it a conductor or insulator of ${mat.test.includes('electricity') ? 'electricity' : 'heat'}?`,
        answer: mat.property,
        hint: mat.test,
      };
    },
  ];

  const selected = pickRandom(sciencePuzzles)();
  return {
    id: puzzleId,
    title: pickRandom(['Scientific Evidence', 'Nature Clue', 'Science Investigation', 'Biology Evidence', 'Energy Analysis']),
    type: 'logic',
    question: selected.question,
    answer: selected.answer,
    hint: selected.hint,
    points: 10 + difficulty * 5,
    difficulty,
    complexity: difficulty <= 2 ? 'STANDARD' : 'CHALLENGING',
    estimatedMinutes: 4 + difficulty,
    requiresMultipleSteps: false,
  };
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

export async function generateIntelligentCase(request: GenerationRequest): Promise<GeneratedCase> {
  const caseId = `case-${nanoid(10)}`;
  const { difficulty, subject, gradeLevel, puzzleComplexity = 'STANDARD' } = request;

  const diffMap: Record<string, number> = { ROOKIE: 1, INSPECTOR: 2, DETECTIVE: 3, CHIEF: 4 };
  const diffNum = diffMap[difficulty] || 2;

  // 1. Pick random setting
  const settingType = pickRandom(Object.keys(settings)) as keyof typeof settings;
  const location = pickRandom(settings[settingType]);

  // 2. Pick crime type and generate details
  const crimeCategory = pickRandom(['theft', 'sabotage', 'mystery'] as const);
  const crime = crimeCategory === 'theft'
    ? pickRandom(crimeTypes.theft)
    : crimeCategory === 'sabotage'
    ? pickRandom(crimeTypes.sabotage)
    : pickRandom(crimeTypes.mystery);

  const crimeValue = 'value' in crime ? crime.value() : 0;
  const crimeItem = 'item' in crime ? crime.item : 'target' in crime ? crime.target : 'event' in crime ? crime.event : 'evidence';

  // 3. Generate unique characters
  const ethnicities = shuffle(['chinese', 'malay', 'indian', 'others'] as const);
  const suspectCount = diffNum >= 3 ? 4 : 3;
  const suspects: Suspect[] = [];
  const characterNames: string[] = [];

  const availableOccupations = shuffle([...(occupations[settingType as keyof typeof occupations] || occupations.school)]);

  for (let i = 0; i < suspectCount; i++) {
    const ethnicity = ethnicities[i % ethnicities.length];
    const firstName = pickRandom(firstNames[ethnicity]);
    const surname = pickRandom(surnames[ethnicity]);
    const fullName = ethnicity === 'malay' ? `${firstName} ${surname}` : `${firstName} ${surname}`;

    characterNames.push(fullName);

    const isGuilty = i === random(0, suspectCount - 1);
    const personality = pickRandom(personalities);

    suspects.push({
      id: `suspect-${nanoid(6)}`,
      name: fullName,
      role: availableOccupations[i] || 'Staff Member',
      alibi: isGuilty ? pickRandom(['Claims to have been alone in the back room', 'Says they were doing inventory', 'Insists they were in the toilet']) : pickRandom(alibis),
      personality,
      isGuilty,
      motive: isGuilty ? pickRandom(motives) : undefined,
    });
  }

  // Ensure exactly one guilty
  const guiltyCount = suspects.filter(s => s.isGuilty).length;
  if (guiltyCount === 0) {
    suspects[random(0, suspects.length - 1)].isGuilty = true;
    suspects[suspects.length - 1].motive = pickRandom(motives);
  } else if (guiltyCount > 1) {
    let foundFirst = false;
    for (const s of suspects) {
      if (s.isGuilty) {
        if (foundFirst) {
          s.isGuilty = false;
          s.motive = undefined;
        }
        foundFirst = true;
      }
    }
  }

  const guiltySuspect = suspects.find(s => s.isGuilty)!;

  // 4. Generate story
  const title = `The ${pickRandom(['Mysterious', 'Strange', 'Puzzling', 'Curious', 'Baffling'])} ${pickRandom(['Case', 'Mystery', 'Incident', 'Affair'])} at ${location.name}`;

  const timeOfDay = pickRandom(['early morning', 'mid-morning', 'afternoon', 'evening', 'night']);
  const dayOfWeek = pickRandom(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

  const briefing = `
CASE FILE #${random(1000, 9999)}
Location: ${location.name}, ${location.area}
Time: ${dayOfWeek}, ${timeOfDay}
Reported by: ${pickRandom(characterNames)}

INCIDENT SUMMARY:
${crimeCategory === 'theft'
  ? `${crimeItem.charAt(0).toUpperCase() + crimeItem.slice(1)} worth ${'value' in crime ? crimeValue : 'unknown'} ${crime.unit || ''} has gone missing from ${location.name}.`
  : crimeCategory === 'sabotage'
  ? `The ${'target' in crime ? crime.target : 'evidence'} ${'description' in crime ? crime.description : 'was tampered with'}.`
  : `${'event' in crime ? crime.event : 'Something strange happened'}. ${'clue' in crime ? crime.clue : 'Investigation needed'}.`
}

The incident was discovered when staff arrived ${timeOfDay}. Initial inspection shows signs of ${pickRandom(['forced entry', 'inside knowledge', 'careful planning', 'opportunistic action'])}.

YOUR MISSION:
Interview the ${suspectCount} suspects, collect clues, and solve the puzzles to identify the culprit.

SUSPECTS:
${suspects.map(s => `• ${s.name} (${s.role})`).join('\n')}

Grade Level: ${gradeLevel}
Difficulty: ${difficulty}
Estimated Time: ${request.constraints?.estimatedMinutes || 25} minutes
  `.trim();

  // 5. Generate clues
  const clues: Clue[] = [];

  // Critical clue pointing to guilty
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: 'Key Evidence',
    description: pickRandom(clueTemplates.physical).desc() + ` This evidence strongly suggests ${guiltySuspect.name}'s involvement.`,
    type: 'physical',
    relevance: 'critical',
    linkedTo: [guiltySuspect.id],
  });

  // Supporting clues
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: pickRandom(clueTemplates.document).name,
    description: pickRandom(clueTemplates.document).desc(),
    type: 'document',
    relevance: 'supporting',
    linkedTo: [],
  });

  clues.push({
    id: `clue-${nanoid(6)}`,
    title: pickRandom(clueTemplates.testimony).name,
    description: pickRandom(clueTemplates.testimony).desc(),
    type: 'testimony',
    relevance: 'supporting',
    linkedTo: [],
  });

  clues.push({
    id: `clue-${nanoid(6)}`,
    title: pickRandom(clueTemplates.digital).name,
    description: pickRandom(clueTemplates.digital).desc(),
    type: 'digital',
    relevance: 'supporting',
    linkedTo: [],
  });

  // Red herring
  const innocentSuspect = suspects.find(s => !s.isGuilty)!;
  clues.push({
    id: `clue-${nanoid(6)}`,
    title: 'Suspicious Finding',
    description: `Evidence that initially seems to implicate ${innocentSuspect.name}, but upon closer inspection, has an innocent explanation.`,
    type: 'physical',
    relevance: 'red-herring',
    linkedTo: [innocentSuspect.id],
  });

  // 6. Generate puzzles based on syllabus
  const gradeTopics = fullSyllabus.filter(t => t.gradeLevel === gradeLevel);
  const subjectTopics = subject === 'INTEGRATED'
    ? gradeTopics
    : gradeTopics.filter(t => t.subject === subject);

  const selectedTopics = pickMultiple(subjectTopics, 3);
  const puzzleCount = puzzleComplexity === 'BASIC' ? 4 : puzzleComplexity === 'STANDARD' ? 3 : 2;

  const puzzleContext: PuzzleContext = {
    setting: location.name,
    characters: characterNames,
    items: [crimeItem, 'evidence', 'clue', 'document'],
    crimeValue,
  };

  const puzzles: Puzzle[] = [];
  for (let i = 0; i < puzzleCount; i++) {
    const topic = selectedTopics[i % selectedTopics.length];
    const puzzle = topic.subject === 'MATH'
      ? generateMathPuzzle(topic, diffNum, puzzleContext)
      : generateSciencePuzzle(topic, diffNum, puzzleContext);
    puzzles.push(puzzle);
  }

  // 7. Generate scenes
  const scenes: Scene[] = [
    {
      id: `scene-${nanoid(6)}`,
      name: location.name,
      description: `${location.name} in ${location.area}. ${pickRandom([
        'The area shows signs of recent activity.',
        'Everything appears normal at first glance.',
        'There are subtle clues scattered around.',
        'The atmosphere is tense as investigation begins.',
      ])}`,
      interactiveElements: ['Evidence Board', 'Witness Area', 'Investigation Zone', 'Clue Collection Point'],
      cluesAvailable: clues.slice(0, 3).map(c => c.id),
    },
    {
      id: `scene-${nanoid(6)}`,
      name: 'Investigation Room',
      description: 'A quiet space to review evidence, interview suspects, and piece together the mystery.',
      interactiveElements: ['Evidence Table', 'Suspect Profiles', 'Timeline Board', 'Puzzle Station'],
      cluesAvailable: clues.slice(3).map(c => c.id),
    },
  ];

  // 8. Return complete case
  return {
    caseId,
    title,
    briefing,
    metadata: {
      difficulty,
      gradeLevel,
      subjectFocus: subject,
      estimatedMinutes: puzzleCount * (puzzleComplexity === 'BASIC' ? 3 : puzzleComplexity === 'STANDARD' ? 7 : 15),
      puzzleComplexity,
    },
    story: {
      setting: `${location.name}, ${location.area}`,
      crime: crimeCategory === 'theft'
        ? `${crimeItem} worth $${crimeValue} was stolen`
        : crimeCategory === 'sabotage'
        ? `${'target' in crime ? crime.target : 'The target'} ${'description' in crime ? crime.description : 'was sabotaged'}`
        : `${'event' in crime ? crime.event : 'A mysterious incident occurred'}`,
      resolution: `Through careful analysis of the evidence and solving the puzzles, you discovered that ${guiltySuspect.name} (${guiltySuspect.role}) was responsible. ${guiltySuspect.motive ? `They did it because they ${guiltySuspect.motive}.` : ''}`,
    },
    suspects,
    clues,
    puzzles,
    scenes,
  };
}

// Export for API
export { settings, crimeTypes, clueTemplates };
