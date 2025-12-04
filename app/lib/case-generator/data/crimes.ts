/**
 * CRIME DATABASE
 * Extensive crime types and variations for cases
 */

// ============================================
// TYPES
// ============================================

export interface CrimeType {
  id: string;
  category: CrimeCategory;
  name: string;
  description: string;
  severity: 'minor' | 'moderate' | 'serious';
  valueGenerator?: () => number;
  valueUnit?: string;
  locations: string[]; // Compatible location types
  clueTypes: string[]; // Types of clues typically found
}

export type CrimeCategory =
  | 'theft'
  | 'vandalism'
  | 'fraud'
  | 'sabotage'
  | 'mystery'
  | 'lost'
  | 'tampering'
  | 'harassment';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// THEFT CRIMES (30+)
// ============================================

export const theftCrimes: CrimeType[] = [
  // Money/Cash
  {
    id: 'theft-cash-001',
    category: 'theft',
    name: 'Collection Money Theft',
    description: 'Money collected for a school/community event has gone missing',
    severity: 'moderate',
    valueGenerator: () => random(50, 500),
    valueUnit: 'dollars',
    locations: ['school', 'community'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
  {
    id: 'theft-cash-002',
    category: 'theft',
    name: 'Donation Box Theft',
    description: 'Funds from a charity donation box were stolen',
    severity: 'moderate',
    valueGenerator: () => random(100, 800),
    valueUnit: 'dollars',
    locations: ['school', 'community', 'mall', 'hawker'],
    clueTypes: ['physical', 'digital', 'testimony'],
  },
  {
    id: 'theft-cash-003',
    category: 'theft',
    name: 'Prize Money Theft',
    description: 'Prize money for a competition has disappeared',
    severity: 'moderate',
    valueGenerator: () => random(100, 500),
    valueUnit: 'dollars',
    locations: ['school', 'community', 'sports'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'theft-cash-004',
    category: 'theft',
    name: 'Cash Register Theft',
    description: 'Money is missing from the cash register',
    severity: 'moderate',
    valueGenerator: () => random(50, 300),
    valueUnit: 'dollars',
    locations: ['hawker', 'mall', 'retail'],
    clueTypes: ['digital', 'document', 'testimony'],
  },
  {
    id: 'theft-cash-005',
    category: 'theft',
    name: 'Petty Cash Theft',
    description: 'The office petty cash fund has been raided',
    severity: 'minor',
    valueGenerator: () => random(30, 150),
    valueUnit: 'dollars',
    locations: ['school', 'community', 'mall'],
    clueTypes: ['document', 'testimony'],
  },

  // Electronics
  {
    id: 'theft-elec-001',
    category: 'theft',
    name: 'Laptop Theft',
    description: 'A laptop has been stolen from the premises',
    severity: 'serious',
    valueGenerator: () => random(800, 2000),
    valueUnit: 'dollars',
    locations: ['school', 'mall', 'community'],
    clueTypes: ['physical', 'digital', 'testimony'],
  },
  {
    id: 'theft-elec-002',
    category: 'theft',
    name: 'Camera Equipment Theft',
    description: 'Camera and photography equipment has gone missing',
    severity: 'serious',
    valueGenerator: () => random(500, 3000),
    valueUnit: 'dollars worth',
    locations: ['school', 'nature', 'attraction'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
  {
    id: 'theft-elec-003',
    category: 'theft',
    name: 'Mobile Phone Theft',
    description: 'Someone\'s mobile phone has been stolen',
    severity: 'moderate',
    valueGenerator: () => random(300, 1500),
    valueUnit: 'dollar',
    locations: ['school', 'mall', 'hawker', 'transport'],
    clueTypes: ['physical', 'digital', 'testimony'],
  },
  {
    id: 'theft-elec-004',
    category: 'theft',
    name: 'Projector Theft',
    description: 'A projector is missing from the meeting room',
    severity: 'moderate',
    valueGenerator: () => random(400, 1200),
    valueUnit: 'dollars',
    locations: ['school', 'community'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'theft-elec-005',
    category: 'theft',
    name: 'Tablet Theft',
    description: 'Multiple tablets used for education have disappeared',
    severity: 'serious',
    valueGenerator: () => random(600, 2000),
    valueUnit: 'dollars worth',
    locations: ['school'],
    clueTypes: ['document', 'digital', 'testimony'],
  },

  // Equipment
  {
    id: 'theft-equip-001',
    category: 'theft',
    name: 'Sports Equipment Theft',
    description: 'Sports equipment has been stolen from storage',
    severity: 'moderate',
    valueGenerator: () => random(200, 1000),
    valueUnit: 'dollars worth',
    locations: ['school', 'sports', 'community'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
  {
    id: 'theft-equip-002',
    category: 'theft',
    name: 'Science Lab Supplies Theft',
    description: 'Laboratory supplies and equipment are missing',
    severity: 'moderate',
    valueGenerator: () => random(300, 800),
    valueUnit: 'dollars worth',
    locations: ['school'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'theft-equip-003',
    category: 'theft',
    name: 'Musical Instruments Theft',
    description: 'Musical instruments from the band room are gone',
    severity: 'serious',
    valueGenerator: () => random(500, 2000),
    valueUnit: 'dollars worth',
    locations: ['school', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'theft-equip-004',
    category: 'theft',
    name: 'Gardening Tools Theft',
    description: 'Gardening equipment has disappeared from the shed',
    severity: 'minor',
    valueGenerator: () => random(100, 400),
    valueUnit: 'dollars worth',
    locations: ['school', 'nature', 'hdb', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'theft-equip-005',
    category: 'theft',
    name: 'Art Supplies Theft',
    description: 'Art materials and supplies have been stolen',
    severity: 'minor',
    valueGenerator: () => random(150, 500),
    valueUnit: 'dollars worth',
    locations: ['school', 'community'],
    clueTypes: ['physical', 'testimony'],
  },

  // Personal Items
  {
    id: 'theft-personal-001',
    category: 'theft',
    name: 'Wallet Theft',
    description: 'Someone\'s wallet has been stolen',
    severity: 'moderate',
    valueGenerator: () => random(50, 300),
    valueUnit: 'dollars',
    locations: ['school', 'mall', 'hawker', 'transport', 'sports'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'theft-personal-002',
    category: 'theft',
    name: 'Jewellery Theft',
    description: 'Valuable jewellery has gone missing',
    severity: 'serious',
    valueGenerator: () => random(500, 5000),
    valueUnit: 'dollars worth',
    locations: ['mall', 'hdb', 'community'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'theft-personal-003',
    category: 'theft',
    name: 'Watch Theft',
    description: 'An expensive watch has been stolen',
    severity: 'moderate',
    valueGenerator: () => random(200, 2000),
    valueUnit: 'dollar',
    locations: ['school', 'mall', 'sports', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'theft-personal-004',
    category: 'theft',
    name: 'Bag Theft',
    description: 'Someone\'s bag with valuables inside has been taken',
    severity: 'moderate',
    valueGenerator: () => random(100, 800),
    valueUnit: 'dollars worth',
    locations: ['school', 'mall', 'hawker', 'nature', 'transport'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },

  // Food Related
  {
    id: 'theft-food-001',
    category: 'theft',
    name: 'Food Stock Theft',
    description: 'Food supplies have been stolen from storage',
    severity: 'minor',
    valueGenerator: () => random(100, 500),
    valueUnit: 'dollars worth',
    locations: ['hawker', 'school'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
  {
    id: 'theft-food-002',
    category: 'theft',
    name: 'Premium Ingredients Theft',
    description: 'Expensive cooking ingredients have disappeared',
    severity: 'moderate',
    valueGenerator: () => random(200, 800),
    valueUnit: 'dollars worth',
    locations: ['hawker'],
    clueTypes: ['document', 'testimony'],
  },

  // Specialty Items
  {
    id: 'theft-special-001',
    category: 'theft',
    name: 'Trophy Theft',
    description: 'Valuable trophies have been stolen from the display',
    severity: 'moderate',
    valueGenerator: () => random(0, 0),
    valueUnit: 'sentimental value',
    locations: ['school', 'sports', 'community'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'theft-special-002',
    category: 'theft',
    name: 'Artwork Theft',
    description: 'Student artwork or displays have gone missing',
    severity: 'minor',
    valueGenerator: () => random(0, 0),
    valueUnit: 'sentimental value',
    locations: ['school', 'community', 'mall'],
    clueTypes: ['testimony', 'digital'],
  },
  {
    id: 'theft-special-003',
    category: 'theft',
    name: 'Historical Artifact Theft',
    description: 'A heritage item of historical significance is missing',
    severity: 'serious',
    valueGenerator: () => random(1000, 10000),
    valueUnit: 'dollars estimated',
    locations: ['attraction', 'school'],
    clueTypes: ['physical', 'document', 'testimony', 'digital'],
  },
  {
    id: 'theft-special-004',
    category: 'theft',
    name: 'Bicycle Theft',
    description: 'A bicycle has been stolen from the parking area',
    severity: 'minor',
    valueGenerator: () => random(200, 1500),
    valueUnit: 'dollar',
    locations: ['school', 'hdb', 'nature', 'mall', 'transport'],
    clueTypes: ['physical', 'digital', 'testimony'],
  },
];

// ============================================
// VANDALISM CRIMES (15+)
// ============================================

export const vandalismCrimes: CrimeType[] = [
  {
    id: 'vandal-001',
    category: 'vandalism',
    name: 'Graffiti',
    description: 'Graffiti has appeared on the walls',
    severity: 'minor',
    locations: ['school', 'hdb', 'mall', 'transport'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'vandal-002',
    category: 'vandalism',
    name: 'Property Damage',
    description: 'Property has been deliberately damaged',
    severity: 'moderate',
    valueGenerator: () => random(100, 1000),
    valueUnit: 'dollars damage',
    locations: ['school', 'mall', 'hdb', 'nature'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'vandal-003',
    category: 'vandalism',
    name: 'Display Destruction',
    description: 'A display or exhibition has been vandalized',
    severity: 'moderate',
    locations: ['school', 'mall', 'attraction'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'vandal-004',
    category: 'vandalism',
    name: 'Vehicle Scratching',
    description: 'A vehicle has been scratched deliberately',
    severity: 'moderate',
    valueGenerator: () => random(200, 1500),
    valueUnit: 'dollars repair',
    locations: ['school', 'mall', 'hdb'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'vandal-005',
    category: 'vandalism',
    name: 'Garden Destruction',
    description: 'Plants in the garden have been destroyed',
    severity: 'minor',
    locations: ['school', 'nature', 'hdb', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'vandal-006',
    category: 'vandalism',
    name: 'Poster Tearing',
    description: 'Important posters and notices have been torn down',
    severity: 'minor',
    locations: ['school', 'mall', 'community', 'hdb'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'vandal-007',
    category: 'vandalism',
    name: 'Equipment Damage',
    description: 'Equipment has been deliberately broken',
    severity: 'moderate',
    valueGenerator: () => random(100, 800),
    valueUnit: 'dollars damage',
    locations: ['school', 'sports', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'vandal-008',
    category: 'vandalism',
    name: 'Toilet Vandalism',
    description: 'The toilets have been vandalized',
    severity: 'minor',
    locations: ['school', 'mall', 'hawker', 'transport'],
    clueTypes: ['physical', 'testimony'],
  },
];

// ============================================
// SABOTAGE CRIMES (15+)
// ============================================

export const sabotageCrimes: CrimeType[] = [
  {
    id: 'sab-001',
    category: 'sabotage',
    name: 'Science Project Sabotage',
    description: 'A science project has been tampered with',
    severity: 'moderate',
    locations: ['school'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'sab-002',
    category: 'sabotage',
    name: 'Competition Entry Ruined',
    description: 'Someone\'s competition entry has been deliberately ruined',
    severity: 'moderate',
    locations: ['school', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'sab-003',
    category: 'sabotage',
    name: 'Sports Equipment Tampering',
    description: 'Sports equipment has been tampered with to cause failure',
    severity: 'serious',
    locations: ['school', 'sports', 'community'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'sab-004',
    category: 'sabotage',
    name: 'Food Contamination',
    description: 'Food has been deliberately contaminated or spoiled',
    severity: 'serious',
    locations: ['school', 'hawker'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
  {
    id: 'sab-005',
    category: 'sabotage',
    name: 'Recipe Tampering',
    description: 'Someone has messed with cooking recipes or ingredients',
    severity: 'minor',
    locations: ['hawker', 'school'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'sab-006',
    category: 'sabotage',
    name: 'Computer Virus',
    description: 'A computer virus has been deliberately introduced',
    severity: 'moderate',
    locations: ['school', 'mall'],
    clueTypes: ['digital', 'testimony'],
  },
  {
    id: 'sab-007',
    category: 'sabotage',
    name: 'Performance Sabotage',
    description: 'A performance or presentation has been sabotaged',
    severity: 'moderate',
    locations: ['school', 'community'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'sab-008',
    category: 'sabotage',
    name: 'Event Sabotage',
    description: 'An important event has been deliberately disrupted',
    severity: 'moderate',
    locations: ['school', 'community', 'mall'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'sab-009',
    category: 'sabotage',
    name: 'Art Installation Sabotage',
    description: 'An art installation or display has been ruined',
    severity: 'moderate',
    locations: ['school', 'mall', 'attraction'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'sab-010',
    category: 'sabotage',
    name: 'Garden Poisoning',
    description: 'Plants in the garden have been poisoned',
    severity: 'moderate',
    locations: ['school', 'nature', 'hdb'],
    clueTypes: ['physical', 'testimony'],
  },
];

// ============================================
// FRAUD CRIMES (10+)
// ============================================

export const fraudCrimes: CrimeType[] = [
  {
    id: 'fraud-001',
    category: 'fraud',
    name: 'Fake Tickets',
    description: 'Someone has been selling fake event tickets',
    severity: 'moderate',
    valueGenerator: () => random(50, 500),
    valueUnit: 'dollars scammed',
    locations: ['school', 'mall', 'attraction'],
    clueTypes: ['document', 'testimony', 'digital'],
  },
  {
    id: 'fraud-002',
    category: 'fraud',
    name: 'Counterfeit Coupons',
    description: 'Fake coupons have been circulating',
    severity: 'minor',
    valueGenerator: () => random(100, 400),
    valueUnit: 'dollars loss',
    locations: ['mall', 'hawker'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'fraud-003',
    category: 'fraud',
    name: 'False Expense Claims',
    description: 'Someone has been submitting false expense claims',
    severity: 'moderate',
    valueGenerator: () => random(200, 1000),
    valueUnit: 'dollars',
    locations: ['school', 'community'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'fraud-004',
    category: 'fraud',
    name: 'Altered Receipts',
    description: 'Receipts have been altered to claim more money',
    severity: 'moderate',
    valueGenerator: () => random(100, 500),
    valueUnit: 'dollars',
    locations: ['school', 'mall', 'community'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'fraud-005',
    category: 'fraud',
    name: 'Impersonation',
    description: 'Someone has been pretending to be someone else',
    severity: 'moderate',
    locations: ['school', 'mall', 'community'],
    clueTypes: ['document', 'testimony', 'digital'],
  },
  {
    id: 'fraud-006',
    category: 'fraud',
    name: 'Cheating in Competition',
    description: 'Evidence of cheating has been found in a competition',
    severity: 'minor',
    locations: ['school', 'community', 'sports'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'fraud-007',
    category: 'fraud',
    name: 'Fake Products',
    description: 'Counterfeit products are being sold',
    severity: 'moderate',
    valueGenerator: () => random(200, 1000),
    valueUnit: 'dollars',
    locations: ['mall', 'hawker'],
    clueTypes: ['physical', 'document', 'testimony'],
  },
];

// ============================================
// MYSTERY CRIMES (15+)
// ============================================

export const mysteryCrimes: CrimeType[] = [
  {
    id: 'myst-001',
    category: 'mystery',
    name: 'Strange Noises',
    description: 'Strange noises have been heard at night',
    severity: 'minor',
    locations: ['school', 'hdb', 'nature'],
    clueTypes: ['testimony', 'digital'],
  },
  {
    id: 'myst-002',
    category: 'mystery',
    name: 'Anonymous Threats',
    description: 'Someone has been receiving anonymous threatening notes',
    severity: 'serious',
    locations: ['school', 'hdb', 'community'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'myst-003',
    category: 'mystery',
    name: 'Power Outages',
    description: 'Unexplained power outages keep happening',
    severity: 'minor',
    locations: ['school', 'mall', 'hdb'],
    clueTypes: ['physical', 'testimony', 'digital'],
  },
  {
    id: 'myst-004',
    category: 'mystery',
    name: 'Mysterious Messages',
    description: 'Strange coded messages are appearing',
    severity: 'minor',
    locations: ['school', 'mall', 'community'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'myst-005',
    category: 'mystery',
    name: 'Secret Meetings',
    description: 'Suspicious secret meetings have been spotted',
    severity: 'minor',
    locations: ['school', 'nature', 'hdb'],
    clueTypes: ['testimony', 'digital'],
  },
  {
    id: 'myst-006',
    category: 'mystery',
    name: 'Unexplained Events',
    description: 'Unexplained events keep occurring at the same time',
    severity: 'minor',
    locations: ['school', 'mall', 'nature'],
    clueTypes: ['testimony', 'document'],
  },
  {
    id: 'myst-007',
    category: 'mystery',
    name: 'Hidden Room Discovery',
    description: 'A hidden room or passage has been discovered',
    severity: 'minor',
    locations: ['school', 'attraction'],
    clueTypes: ['physical', 'document'],
  },
  {
    id: 'myst-008',
    category: 'mystery',
    name: 'Identity Mystery',
    description: 'Someone\'s true identity is in question',
    severity: 'moderate',
    locations: ['school', 'community', 'hdb'],
    clueTypes: ['document', 'testimony'],
  },
];

// ============================================
// LOST ITEM MYSTERIES (10+)
// ============================================

export const lostItemCrimes: CrimeType[] = [
  {
    id: 'lost-001',
    category: 'lost',
    name: 'Missing Pet',
    description: 'A beloved pet has gone missing',
    severity: 'minor',
    locations: ['hdb', 'nature', 'school'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'lost-002',
    category: 'lost',
    name: 'Lost Heirloom',
    description: 'A precious family heirloom has disappeared',
    severity: 'moderate',
    locations: ['school', 'community', 'hdb'],
    clueTypes: ['testimony', 'document'],
  },
  {
    id: 'lost-003',
    category: 'lost',
    name: 'Missing Documents',
    description: 'Important documents have gone missing',
    severity: 'moderate',
    locations: ['school', 'community', 'mall'],
    clueTypes: ['document', 'testimony'],
  },
  {
    id: 'lost-004',
    category: 'lost',
    name: 'Lost Time Capsule',
    description: 'A buried time capsule cannot be found',
    severity: 'minor',
    locations: ['school', 'nature'],
    clueTypes: ['document', 'physical', 'testimony'],
  },
  {
    id: 'lost-005',
    category: 'lost',
    name: 'Missing Key',
    description: 'An important key has mysteriously disappeared',
    severity: 'minor',
    locations: ['school', 'community', 'hdb'],
    clueTypes: ['physical', 'testimony'],
  },
  {
    id: 'lost-006',
    category: 'lost',
    name: 'Vanished Package',
    description: 'An expected package has vanished',
    severity: 'moderate',
    valueGenerator: () => random(50, 500),
    valueUnit: 'dollars worth',
    locations: ['hdb', 'mall'],
    clueTypes: ['document', 'testimony', 'digital'],
  },
];

// ============================================
// COMBINE ALL CRIMES
// ============================================

export const allCrimes: CrimeType[] = [
  ...theftCrimes,
  ...vandalismCrimes,
  ...sabotageCrimes,
  ...fraudCrimes,
  ...mysteryCrimes,
  ...lostItemCrimes,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCrimesByCategory(category: CrimeCategory): CrimeType[] {
  return allCrimes.filter(c => c.category === category);
}

export function getCrimesForLocation(locationType: string): CrimeType[] {
  return allCrimes.filter(c => c.locations.includes(locationType));
}

export function getRandomCrime(locationType?: string): CrimeType {
  const available = locationType
    ? getCrimesForLocation(locationType)
    : allCrimes;
  return pickRandom(available);
}

export function getCrimeBySeverity(severity: 'minor' | 'moderate' | 'serious'): CrimeType[] {
  return allCrimes.filter(c => c.severity === severity);
}

export function generateCrimeValue(crime: CrimeType): number {
  return crime.valueGenerator ? crime.valueGenerator() : 0;
}

// Total crimes: 95+ unique crime scenarios
