export interface StoryTemplate {
  id: string;
  subjects: string[];
  difficulties: string[];
  culturalContext: 'singapore' | 'any';
  themes: string[];
  locations: Location[];
  crimes: Crime[];
}

export interface Location {
  name: string;
  description: string;
  type: 'school' | 'community' | 'commercial' | 'residential';
}

export interface Crime {
  type: string;
  description: string;
  solution: string;
}

export const storyTemplates: StoryTemplate[] = [
  {
    id: 'canteen-mystery',
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR'],
    culturalContext: 'singapore',
    themes: ['Missing', 'Mysterious', 'Curious'],
    locations: [
      {
        name: 'Sunrise Primary School Canteen',
        description: 'A busy school canteen with multiple food stalls, serving hundreds of students daily.',
        type: 'school',
      },
      {
        name: 'Harmony Secondary School Cafeteria',
        description: 'A modern cafeteria with digital ordering systems and comfortable seating areas.',
        type: 'school',
      },
      {
        name: 'Green Valley Primary Canteen',
        description: 'A well-maintained canteen known for its cleanliness and variety of healthy food options.',
        type: 'school',
      },
    ],
    crimes: [
      {
        type: 'Money Disappearance',
        description: 'The canteen cash register is missing $50 from the morning sales. Three staff members had access.',
        solution: 'Students must use receipt timestamps, sales calculations, and witness statements to determine what happened.',
      },
      {
        type: 'Food Order Mix-up',
        description: 'Multiple students received wrong orders, and the payment records don\'t match the food served.',
        solution: 'Analyze order slips, calculate totals, and match timestamps to identify the pattern.',
      },
      {
        type: 'Missing Inventory',
        description: 'The canteen supplier delivered goods, but the inventory count doesn\'t add up correctly.',
        solution: 'Use arithmetic to verify delivery quantities, check storage records, and track usage patterns.',
      },
    ],
  },
  {
    id: 'library-case',
    subjects: ['MATH', 'SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE'],
    culturalContext: 'singapore',
    themes: ['Mysterious', 'Puzzling', 'Perplexing'],
    locations: [
      {
        name: 'Central Community Library',
        description: 'A three-story public library with computer labs, study rooms, and extensive book collections.',
        type: 'community',
      },
      {
        name: 'School Resource Center',
        description: 'A modern library with maker spaces, digital resources, and collaborative learning areas.',
        type: 'school',
      },
    ],
    crimes: [
      {
        type: 'Book Sequence Mystery',
        description: 'Rare reference books are being misplaced following a strange mathematical pattern.',
        solution: 'Identify the pattern in call numbers, predict the next target, and catch the perpetrator.',
      },
      {
        type: 'Computer Lab Incident',
        description: 'Someone used the library computers after hours, leaving behind cryptic digital clues.',
        solution: 'Analyze login times, decode password hints, and trace digital footprints.',
      },
    ],
  },
  {
    id: 'science-lab',
    subjects: ['SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
    culturalContext: 'singapore',
    themes: ['Puzzling', 'Scientific', 'Mysterious'],
    locations: [
      {
        name: 'School Science Laboratory',
        description: 'A well-equipped lab with microscopes, chemical supplies, and safety equipment.',
        type: 'school',
      },
      {
        name: 'Community Science Center',
        description: 'An interactive science museum with hands-on exhibits and educational workshops.',
        type: 'community',
      },
    ],
    crimes: [
      {
        type: 'Experiment Sabotage',
        description: 'A student\'s science fair project was tampered with before the competition.',
        solution: 'Use scientific method to analyze evidence, test hypotheses, and identify the culprit.',
      },
      {
        type: 'Chemical Mystery',
        description: 'Unknown substances were mixed in the lab, creating an unexpected reaction.',
        solution: 'Apply chemistry knowledge to identify substances and determine what happened.',
      },
      {
        type: 'Missing Equipment',
        description: 'Valuable lab equipment disappeared during a class field trip.',
        solution: 'Track movement patterns, analyze alibis, and use logical deduction.',
      },
    ],
  },
  {
    id: 'sports-event',
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR'],
    culturalContext: 'singapore',
    themes: ['Competitive', 'Suspicious', 'Curious'],
    locations: [
      {
        name: 'School Sports Hall',
        description: 'An indoor sports complex with basketball courts, badminton courts, and a spectator area.',
        type: 'school',
      },
      {
        name: 'Community Sports Complex',
        description: 'A modern facility with swimming pools, running tracks, and gym equipment.',
        type: 'community',
      },
    ],
    crimes: [
      {
        type: 'Score Discrepancy',
        description: 'The final scores of a sports competition don\'t match the recorded points.',
        solution: 'Calculate scores from each round, verify calculations, and identify where the error occurred.',
      },
      {
        type: 'Equipment Tampering',
        description: 'Sports equipment was altered before an important match.',
        solution: 'Measure specifications, compare to standards, and determine who had opportunity.',
      },
    ],
  },
  {
    id: 'market-mystery',
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR', 'DETECTIVE'],
    culturalContext: 'singapore',
    themes: ['Mysterious', 'Commercial', 'Puzzling'],
    locations: [
      {
        name: 'Neighborhood Wet Market',
        description: 'A traditional market with fresh produce, meat, and seafood stalls operated by friendly vendors.',
        type: 'commercial',
      },
      {
        name: 'HDB Void Deck Mini Mart',
        description: 'A small convenience store serving the residential community with daily necessities.',
        type: 'commercial',
      },
    ],
    crimes: [
      {
        type: 'Pricing Puzzle',
        description: 'Customers are being charged wrong amounts, but the pattern is hard to detect.',
        solution: 'Calculate correct prices, identify the pattern in errors, and find the cause.',
      },
      {
        type: 'Stock Mystery',
        description: 'Inventory records show discrepancies between deliveries and sales.',
        solution: 'Use addition/subtraction to track stock flow and identify where items went.',
      },
    ],
  },
  {
    id: 'community-center',
    subjects: ['MATH', 'SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE'],
    culturalContext: 'singapore',
    themes: ['Community', 'Mysterious', 'Puzzling'],
    locations: [
      {
        name: 'Residents\' Committee Center',
        description: 'A hub for community activities with multipurpose halls, meeting rooms, and a small library.',
        type: 'community',
      },
      {
        name: 'Youth Activity Center',
        description: 'A vibrant space with game rooms, study areas, and facilities for various clubs.',
        type: 'community',
      },
    ],
    crimes: [
      {
        type: 'Event Planning Mystery',
        description: 'The budget for a community event doesn\'t match the expenses recorded.',
        solution: 'Audit receipts, calculate totals, and identify unauthorized spending.',
      },
      {
        type: 'Booking Confusion',
        description: 'Room bookings overlap suspiciously, and some groups can\'t access their reserved spaces.',
        solution: 'Analyze scheduling times, identify conflicts, and determine if it was accidental or intentional.',
      },
    ],
  },
];
