// Story Templates
export interface StoryTemplate {
  id: string;
  subjects: string[];
  difficulties: string[];
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
    ],
    crimes: [
      {
        type: 'Money Disappearance',
        description: 'The canteen cash register is missing $50 from the morning sales. Three staff members had access.',
        solution: 'Students must use receipt timestamps, sales calculations, and witness statements to determine what happened.',
      },
      {
        type: 'Food Order Mix-up',
        description: "Multiple students received wrong orders, and the payment records don't match the food served.",
        solution: 'Analyze order slips, calculate totals, and match timestamps to identify the pattern.',
      },
    ],
  },
  {
    id: 'library-case',
    subjects: ['MATH', 'SCIENCE', 'INTEGRATED'],
    difficulties: ['INSPECTOR', 'DETECTIVE'],
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
        description: "A student's science fair project was tampered with before the competition.",
        solution: 'Use scientific method to analyze evidence, test hypotheses, and identify the culprit.',
      },
      {
        type: 'Chemical Mystery',
        description: 'Unknown substances were mixed in the lab, creating an unexpected reaction.',
        solution: 'Apply chemistry knowledge to identify substances and determine what happened.',
      },
    ],
  },
  {
    id: 'sports-event',
    subjects: ['MATH', 'INTEGRATED'],
    difficulties: ['ROOKIE', 'INSPECTOR'],
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
        description: "The final scores of a sports competition don't match the recorded points.",
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
];

// Suspect Templates
export interface SuspectTemplate {
  roles: string[];
  personalities: string[][];
  alibis: string[];
}

export const suspectTemplates: SuspectTemplate = {
  roles: [
    'Canteen Manager',
    'Cleaner',
    'Student Helper',
    'Security Guard',
    'Teacher',
    'Librarian',
    'Lab Assistant',
    'Sports Coach',
    'Shop Owner',
  ],
  personalities: [
    ['nervous', 'helpful'],
    ['confident', 'dismissive'],
    ['friendly', 'observant'],
    ['quiet', 'meticulous'],
    ['cheerful', 'distracted'],
  ],
  alibis: [
    'Was helping students with orders',
    'Cleaning the other end of the area',
    'On break at the time',
    'Attending a meeting',
    'Working in a different section',
    'Handling deliveries outside',
  ],
};

// Name Templates (Singapore context)
export const nameTemplates = {
  chinese: ['Li Wei', 'Zhang Mei', 'Chen Jun', 'Wong Fang', 'Tan Ming', 'Lee Hui'],
  malay: ['Ahmad bin Hassan', 'Siti Nurhaliza', 'Farid Abdullah', 'Aminah binti Osman'],
  indian: ['Rajesh Kumar', 'Priya Devi', 'Suresh Menon', 'Lakshmi Nair'],
  english: ['John Lim', 'Sarah Tan', 'David Wong', 'Emma Chen'],
};

// Clue Templates
export const clueTemplates = {
  physical: [
    { title: 'Receipt Fragment', description: 'A torn receipt with partial timestamps visible' },
    { title: 'Fingerprint Smudge', description: 'A partial fingerprint on a surface' },
    { title: 'Footprint Mark', description: 'A shoe print in an unusual location' },
  ],
  document: [
    { title: 'Logbook Entry', description: 'An entry in the daily log with suspicious timing' },
    { title: 'Schedule Sheet', description: 'A work schedule showing who was where' },
    { title: 'Sign-in Record', description: 'Names and times of people entering the area' },
  ],
  testimony: [
    { title: 'Witness Statement', description: 'An account from someone who saw something' },
    { title: 'Overheard Conversation', description: 'Something someone heard being discussed' },
  ],
  digital: [
    { title: 'Camera Timestamp', description: 'Security camera shows time of movement' },
    { title: 'Computer Log', description: 'Digital record of system access' },
  ],
};

// Puzzle Templates by subject
export const puzzleTemplates = {
  MATH: [
    {
      title: 'Calculate Missing Amount',
      question: 'The cash register started with $200. Sales receipts show $145 collected. The register now has $295. How much money is missing or extra?',
      answer: '$50 missing (200 + 145 = 345, but register has 295, so 345 - 295 = 50 missing)',
      hint: 'Calculate what should be in the register, then compare with actual amount.',
      type: 'math' as const,
    },
    {
      title: 'Time Analysis',
      question: 'Receipt A is stamped 9:15 AM, Receipt B at 9:47 AM. How many minutes passed between transactions?',
      answer: '32 minutes',
      hint: 'Subtract the start time from the end time.',
      type: 'math' as const,
    },
    {
      title: 'Pattern Recognition',
      question: 'Transactions occurred at 8:15, 8:30, 8:45, 9:00. If the pattern continues, when is the next transaction?',
      answer: '9:15 AM',
      hint: 'Look for the time difference between each transaction.',
      type: 'logic' as const,
    },
    {
      title: 'Price Calculation',
      question: 'A meal costs $3.50 and a drink costs $1.20. A student paid $10 for 2 meals and 2 drinks. How much change should they receive?',
      answer: '$0.60 (2 x $3.50 + 2 x $1.20 = $9.40, change = $10 - $9.40 = $0.60)',
      hint: 'Calculate the total cost first, then subtract from amount paid.',
      type: 'math' as const,
    },
  ],
  SCIENCE: [
    {
      title: 'Fingerprint Analysis',
      question: 'Three fingerprints were found. Two match suspects. What scientific method would you use to identify the third?',
      answer: 'Compare ridge patterns, minutiae points, and unique characteristics with known fingerprint samples.',
      hint: 'Think about how forensic scientists compare fingerprints.',
      type: 'observation' as const,
    },
    {
      title: 'Chemical Test',
      question: "A white powder was found. What safe tests could identify if it's salt, sugar, or flour?",
      answer: "Taste test (if safe), dissolve in water (salt and sugar dissolve, flour doesn't), or burn test.",
      hint: 'Consider the physical and chemical properties of each substance.',
      type: 'deduction' as const,
    },
    {
      title: 'Light and Shadow',
      question: 'A shadow was seen at 3 PM facing east. In which direction was the sun?',
      answer: 'West (shadows point opposite to the light source)',
      hint: 'Remember that shadows form on the opposite side of the light source.',
      type: 'observation' as const,
    },
  ],
  INTEGRATED: [
    {
      title: 'Timeline Reconstruction',
      question: 'Using the receipts, witness statements, and camera timestamps, arrange these 5 events in chronological order.',
      answer: 'Requires analyzing multiple evidence types to create correct sequence.',
      hint: 'Look for timestamps and references to other events.',
      type: 'logic' as const,
    },
    {
      title: 'Deduction Challenge',
      question: 'Based on alibis and evidence, which suspect had both opportunity and motive?',
      answer: 'Cross-reference timing, location, and personal motivations.',
      hint: 'Eliminate suspects who have solid alibis for the time of the incident.',
      type: 'deduction' as const,
    },
  ],
};
