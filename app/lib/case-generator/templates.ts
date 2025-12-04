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

// Puzzle Templates by subject (designed for P4-P6 students, 5-10 min each)
export const puzzleTemplates = {
  MATH: [
    {
      title: 'The Missing Money Mystery',
      question: `The canteen's cash register log shows:
- Opening balance: $150.00
- Chicken rice sold: 45 plates at $3.50 each
- Noodles sold: 32 bowls at $4.00 each
- Drinks sold: 78 cups at $1.50 each
- Closing balance: $512.50

The manager says $50 is missing. Is the manager correct? Show your working to prove it.`,
      answer: 'Total sales = (45 × $3.50) + (32 × $4.00) + (78 × $1.50) = $157.50 + $128.00 + $117.00 = $402.50. Expected closing = $150 + $402.50 = $552.50. Actual closing = $512.50. Missing = $552.50 - $512.50 = $40, NOT $50. The manager is wrong - only $40 is missing.',
      hint: 'Calculate each type of sale separately, then add to opening balance. Compare with actual closing.',
      type: 'math' as const,
    },
    {
      title: 'Suspect Timeline Puzzle',
      question: `Three suspects were seen at different times:
- Mr. Lim: Arrived at 2:45 PM, stayed for 1 hour 35 minutes
- Ms. Chen: Arrived 25 minutes after Mr. Lim left, stayed for 50 minutes
- Alex: Left the scene at 5:30 PM after staying for 2 hours 15 minutes

The crime happened between 4:00 PM and 4:30 PM. Which suspect(s) could have committed the crime?`,
      answer: 'Mr. Lim: 2:45 PM + 1h 35min = Left at 4:20 PM (was there during crime window). Ms. Chen: Mr. Lim left 4:20 PM + 25min = Arrived 4:45 PM (too late). Alex: 5:30 PM - 2h 15min = Arrived 3:15 PM (was there during crime). Both Mr. Lim AND Alex could have committed the crime.',
      hint: 'Calculate arrival and departure times for each suspect. Check who was present between 4:00-4:30 PM.',
      type: 'math' as const,
    },
    {
      title: 'The Ratio Riddle',
      question: `The stolen items were divided among 3 people in the ratio 2:3:5.
The person with the smallest share got items worth $48.
How much was the total value of stolen items?
How much did the person with the largest share receive?`,
      answer: 'Ratio 2:3:5 means 10 parts total. Smallest share (2 parts) = $48, so 1 part = $24. Total (10 parts) = $240. Largest share (5 parts) = 5 × $24 = $120.',
      hint: 'Find the value of one "part" first, then calculate the others.',
      type: 'math' as const,
    },
    {
      title: 'Percentage Problem',
      question: `A sports equipment shop reported theft. The stolen items:
- 15% of basketballs (they had 80 basketballs)
- 25% of footballs (they had 60 footballs)
- 40% of badminton rackets (they had 45 rackets)

Each basketball costs $35, football costs $28, and racket costs $42.
What is the total value of stolen items?`,
      answer: 'Basketballs: 15% of 80 = 12 balls × $35 = $420. Footballs: 25% of 60 = 15 balls × $28 = $420. Rackets: 40% of 45 = 18 rackets × $42 = $756. Total = $420 + $420 + $756 = $1,596.',
      hint: 'Find the quantity stolen for each item first (percentage × total), then multiply by price.',
      type: 'math' as const,
    },
    {
      title: 'Speed and Distance Clue',
      question: `A witness saw the suspect running away at 12 km/h. The police arrived 15 minutes later.
Another witness saw someone matching the description at a bus stop.
The bus stop is 2.5 km from the crime scene.
Could the suspect have reached the bus stop before police arrived?`,
      answer: 'Speed = 12 km/h = 12 km per 60 min = 0.2 km per minute. Time to reach bus stop = 2.5 km ÷ 0.2 km/min = 12.5 minutes. Police arrived after 15 minutes. 12.5 < 15, so YES, the suspect could have reached the bus stop 2.5 minutes before police arrived.',
      hint: 'Convert speed to km per minute. Then calculate time = distance ÷ speed.',
      type: 'math' as const,
    },
  ],
  SCIENCE: [
    {
      title: 'Footprint Analysis',
      question: `You found two sets of muddy footprints at the scene:
- Set A: Deep heel prints, shallow toe prints, stride length 45cm
- Set B: Even depth throughout, stride length 70cm, slight drag marks

Based on this evidence:
1. Was person A walking or running? Explain.
2. Was person B walking or running? Explain.
3. One person was carrying something heavy. Which one? How do you know?`,
      answer: '1. Person A was walking - deep heel prints and short stride indicate normal walking pace (heel strikes first). 2. Person B was running - even footprint depth, longer stride, and drag marks suggest running. 3. Person A was carrying something heavy - the VERY deep heel prints indicate extra weight pushing down, while Person B\'s even depth shows normal body weight.',
      hint: 'Think about how weight is distributed when walking vs running, and how carrying heavy items affects footprints.',
      type: 'observation' as const,
    },
    {
      title: 'Temperature Timeline',
      question: `A cup of hot tea was found spilled on the desk. The tea temperature was measured at 42°C when discovered at 3:30 PM.
Room temperature is 25°C.
Hot tea starts at 85°C and cools by approximately 15°C every 30 minutes until it reaches room temperature.

Approximately what time was the tea spilled?`,
      answer: 'Tea cools: 85°C → 70°C (30 min) → 55°C (60 min) → 40°C (90 min). At 42°C, it has cooled about 85-90 minutes. So if found at 3:30 PM, tea was spilled around 2:00 PM (90 minutes earlier).',
      hint: 'Work backwards from 85°C, subtracting 15°C for every 30 minutes until you get close to 42°C.',
      type: 'deduction' as const,
    },
    {
      title: 'Circuit Clue',
      question: `The alarm system was disabled. The circuit has:
- A battery (power source)
- A buzzer (makes sound when current flows)
- An electromagnet (holds the door closed when ON)
- A switch

The door was found open and silent.
The battery is still working (tested).
What TWO things could the culprit have done to disable the alarm and open the door?`,
      answer: '1. Opened/broke the switch - this stops current flow, so the electromagnet turns OFF (door can open) and buzzer stays silent. 2. Cut/disconnected the wire - same effect as opening the switch. The buzzer needs current to sound, and the electromagnet needs current to hold the door.',
      hint: 'Think about what makes a circuit work. Both the buzzer and electromagnet need current flowing through them.',
      type: 'deduction' as const,
    },
    {
      title: 'Plant Evidence',
      question: `Muddy shoes were found with plant material stuck to them. Identify which location the suspect visited:

Location A (Sunny garden): Grass with thin leaves, dry soil
Location B (Shady forest): Ferns, moss, damp soil
Location C (Pond area): Water lilies, reeds, waterlogged soil

Shoe evidence: Dark wet mud, small round leaf fragments, bits of spongy green material.

Which location did the suspect visit? Explain your reasoning using plant adaptations.`,
      answer: 'Location B (Shady forest). Evidence: 1) Dark wet mud = damp forest floor. 2) Spongy green material = moss (only grows in shady, damp places). 3) Round leaf fragments could be from ferns. The sunny garden would have dry soil, and pond area would have waterlogged (extremely wet) soil with different plants.',
      hint: 'Consider where each type of plant grows and what conditions they need.',
      type: 'observation' as const,
    },
  ],
  INTEGRATED: [
    {
      title: 'The Complete Timeline',
      question: `Reconstruct what happened using ALL the evidence:

CCTV timestamps:
- 2:15 PM: Mr. Tan enters building
- 2:45 PM: Power outage (cameras go dark for 20 minutes)
- 3:05 PM: Cameras back on, Mr. Tan seen leaving
- 3:12 PM: Ms. Lee enters, discovers theft

Witness statement: "I heard glass breaking around 2:50 PM"

Physical evidence:
- Broken display case (theft location)
- Mr. Tan's fingerprints on door handle (not display case)
- Fresh footprints in dust leading from window to display case

Questions:
1. Could Mr. Tan have committed the theft? Explain.
2. How did the real thief likely enter?
3. When did the theft most likely occur?`,
      answer: '1. Unlikely - Mr. Tan\'s fingerprints are only on the door (normal entry), not the display case. Footprints lead from the WINDOW, not the door. 2. The real thief entered through the window - footprints lead from window to display case. 3. Around 2:50 PM during the power outage - glass breaking was heard then, cameras were off, giving the thief cover.',
      hint: 'Match the physical evidence with the timeline. Who had opportunity AND left evidence at the crime scene?',
      type: 'logic' as const,
    },
    {
      title: 'The Alibi Test',
      question: `Three suspects, one thief. The theft occurred between 4:00-4:30 PM.

Suspect A claims: "I was at the library. I borrowed 3 books at 3:45 PM and returned them at 4:45 PM. The library is 2 km from the crime scene."

Suspect B claims: "I was jogging in the park from 3:30 PM to 5:00 PM. My fitness app shows I ran 7.5 km at 5 km/h average."

Suspect C claims: "I was watching a 90-minute movie that started at 3:15 PM at the cinema 500m away."

Which alibi has a problem? Show your working.`,
      answer: 'Suspect B\'s alibi is impossible! At 5 km/h, running 7.5 km would take 7.5÷5 = 1.5 hours = 90 minutes. But they claim to have jogged from 3:30-5:00 PM = 90 minutes... which exactly matches 7.5 km. However, the AVERAGE speed of 5 km/h for continuous jogging is suspiciously slow (that\'s walking pace). More importantly, if they stopped at all during the "jog" (to commit the crime), they couldn\'t cover 7.5 km. Suspect B\'s alibi is suspicious.',
      hint: 'Check if the math in each alibi adds up. Calculate distances, times, and speeds.',
      type: 'deduction' as const,
    },
  ],
};
