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

// Puzzle complexity configurations
export const puzzleComplexityConfig = {
  BASIC: { minSteps: 1, maxSteps: 2, estimatedMinutes: 3, pointMultiplier: 1 },
  STANDARD: { minSteps: 2, maxSteps: 4, estimatedMinutes: 7, pointMultiplier: 1.5 },
  CHALLENGING: { minSteps: 4, maxSteps: 6, estimatedMinutes: 15, pointMultiplier: 2.5 },
  EXPERT: { minSteps: 6, maxSteps: 10, estimatedMinutes: 25, pointMultiplier: 4 },
};

// Puzzle Templates by subject and complexity
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
      complexity: 'STANDARD' as const,
    },
  ],
};

// CHALLENGING complexity puzzles (10-15 min each, multi-step with cross-referencing)
export const challengingPuzzles = {
  MATH: [
    {
      title: 'The Financial Discrepancy Investigation',
      question: `You've obtained financial records from three businesses suspected of money laundering.

BUSINESS A - "Lucky Fortune Trading"
Weekly Cash Flow:
| Day | Cash In | Cash Out | Claimed Customers |
|-----|---------|----------|-------------------|
| Mon | $2,340  | $1,890   | 156               |
| Tue | $3,120  | $2,450   | 208               |
| Wed | $2,890  | $2,100   | 193               |
| Thu | $4,560  | $3,200   | 304               |
| Fri | $5,230  | $4,100   | 349               |

BUSINESS B - "Golden Dragon Imports"
| Day | Cash In | Cash Out | Claimed Customers |
|-----|---------|----------|-------------------|
| Mon | $8,450  | $7,200   | 42                |
| Tue | $9,120  | $7,890   | 46                |
| Wed | $7,890  | $6,540   | 39                |
| Thu | $11,230 | $9,450   | 56                |
| Fri | $12,560 | $10,200  | 63                |

BUSINESS C - "Sunrise Café"
| Day | Cash In | Cash Out | Claimed Customers |
|-----|---------|----------|-------------------|
| Mon | $1,245  | $890     | 89                |
| Tue | $1,456  | $1,020   | 104               |
| Wed | $1,123  | $780     | 80                |
| Thu | $1,678  | $1,230   | 120               |
| Fri | $2,012  | $1,456   | 144               |

Industry averages: Retail stores average $15-20 per customer. Import businesses average $180-220 per customer. Cafés average $12-16 per customer.

TASKS:
1. Calculate the average revenue per customer for each business each day.
2. Identify which business has suspicious financial patterns and explain why.
3. Calculate the total amount of potentially laundered money over the week.
4. On which specific day was the largest discrepancy and by how much?`,
      answer: `Analysis:
Business A (Retail): Avg $15/customer - NORMAL (156×$15=$2,340 ✓)
Business B (Imports): Avg $200/customer on Mon ($8,450÷42=$201), BUT on Friday: $12,560÷63=$199 - seems normal BUT the cash OUT patterns are suspicious. The business keeps exactly 85% of cash in - money laundering sign.
Business C (Café): Mon: $1,245÷89=$13.99 ✓, but Thursday: $1,678÷120=$13.98, Friday: $2,012÷144=$13.97 - Suspicious! The per-customer revenue is TOO CONSISTENT (within $0.02), which is statistically improbable.

BUSINESS C is laundering money. Natural variation would cause $1-3 difference per customer between days.

Estimated laundered amount: If we assume 20% variance is normal, Business C's "perfect" numbers suggest artificial injection of roughly $800-1,200/week to hit exact targets.

Largest discrepancy: Friday - the busiest day with highest volume to hide transactions.`,
      hint: 'Calculate revenue per customer for each day. Look for patterns that are TOO perfect or statistically improbable.',
      type: 'math' as const,
      complexity: 'CHALLENGING' as const,
    },
    {
      title: 'The Warehouse Inventory Heist',
      question: `A warehouse reports theft. You have access to three data sources that don't quite match up.

DELIVERY LOGS (what came IN):
| Date | Product | Qty | Unit Weight | Truck ID |
|------|---------|-----|-------------|----------|
| 1st  | Phones  | 500 | 0.2 kg      | TRK-101  |
| 2nd  | Laptops | 200 | 2.5 kg      | TRK-102  |
| 3rd  | Tablets | 350 | 0.5 kg      | TRK-103  |
| 4th  | Phones  | 300 | 0.2 kg      | TRK-101  |
| 5th  | Laptops | 150 | 2.5 kg      | TRK-104  |

WEIGHT STATION RECORDS:
| Date | Truck ID | Entry Weight | Exit Weight |
|------|----------|--------------|-------------|
| 1st  | TRK-101  | 8,200 kg     | 8,100 kg    |
| 2nd  | TRK-102  | 8,700 kg     | 8,200 kg    |
| 3rd  | TRK-103  | 8,350 kg     | 8,175 kg    |
| 4th  | TRK-101  | 8,160 kg     | 8,100 kg    |
| 5th  | TRK-104  | 8,575 kg     | 8,200 kg    |

SALES RECORDS (what went OUT):
| Date | Product | Qty Sold | Customer |
|------|---------|----------|----------|
| 1st  | Phones  | 50       | RetailX  |
| 2nd  | Laptops | 30       | TechCo   |
| 3rd  | Tablets | 100      | MobileMart |
| 4th  | Phones  | 120      | RetailX  |
| 5th  | Laptops | 80       | TechCo   |

Current Inventory Count: Phones: 580, Laptops: 220, Tablets: 250

QUESTIONS:
1. Calculate expected inventory for each product based on deliveries and sales.
2. Calculate what the weight station should show for each delivery day.
3. Identify discrepancies between expected and actual inventory.
4. Identify discrepancies in weight station records.
5. Determine on which day(s) theft occurred and estimate what was stolen.`,
      answer: `Expected Inventory:
Phones: 500+300-50-120 = 630 (Actual: 580) → 50 MISSING
Laptops: 200+150-30-80 = 240 (Actual: 220) → 20 MISSING
Tablets: 350-100 = 250 (Actual: 250) → CORRECT

Weight Station Analysis:
Day 1: 500 phones × 0.2kg = 100kg. Entry-Exit = 100kg ✓
Day 2: 200 laptops × 2.5kg = 500kg. Entry-Exit = 500kg ✓
Day 3: 350 tablets × 0.5kg = 175kg. Entry-Exit = 175kg ✓
Day 4: 300 phones × 0.2kg = 60kg. But Entry-Exit = 60kg ✓
Day 5: 150 laptops × 2.5kg = 375kg. Entry-Exit = 375kg ✓

All weight station records match! Theft occurred INSIDE warehouse.

50 phones × $500 = $25,000
20 laptops × $1,200 = $24,000
Total theft: ~$49,000 in merchandise

Theft likely occurred between deliveries and inventory count - an inside job.`,
      hint: 'Create running totals. Check if weight delivered matches weight recorded. Compare final expected vs actual.',
      type: 'math' as const,
      complexity: 'CHALLENGING' as const,
    },
  ],
  SCIENCE: [
    {
      title: 'The Poisoning Timeline',
      question: `A victim shows symptoms of poisoning. Multiple substances were found at the scene. You must determine the poisoning timeline.

TOXICOLOGY REPORT:
| Substance | Blood Level | Half-life | Lethal Threshold | Symptom Onset |
|-----------|-------------|-----------|------------------|---------------|
| Compound A | 45 μg/mL   | 4 hours   | 80 μg/mL        | 30 min        |
| Compound B | 120 μg/mL  | 2 hours   | 200 μg/mL       | 15 min        |
| Compound C | 8 μg/mL    | 8 hours   | 15 μg/mL        | 2 hours       |

Victim was found unconscious at 6:00 PM.
Blood samples were taken at 6:30 PM (results above).

WITNESS TIMELINE:
- 12:00 PM: Victim ate lunch alone
- 2:00 PM: Victim met Suspect 1 for coffee
- 3:30 PM: Victim met Suspect 2 at office
- 4:45 PM: Victim reported feeling unwell
- 5:15 PM: Victim seen stumbling
- 6:00 PM: Found unconscious

QUESTIONS:
1. Working backwards from 6:30 PM blood levels, calculate the initial dose level for each compound.
2. Based on symptom onset times, determine when each substance was administered.
3. Which substance is the primary threat and why?
4. Which suspect had opportunity to administer the dangerous substance?`,
      answer: `Working backwards (Half-life calculations):
Compound A: At 6:30 PM = 45 μg/mL
- 2:30 PM (4 hours back) = 45 × 2 = 90 μg/mL (initial)
  Symptom onset 30 min after = symptoms at 3:00 PM

Compound B: At 6:30 PM = 120 μg/mL
- 4:30 PM (2 hours back) = 120 × 2 = 240 μg/mL
- 2:30 PM (4 hours back) = 240 × 2 = 480 μg/mL (initial)
  Symptom onset 15 min after = symptoms at 2:45 PM
  WAIT - victim was fine until 4:45 PM! So administered later.
  If symptoms at 4:45 PM, administered at 4:30 PM
  Initial dose: 120 × 2 = 240 μg/mL (ABOVE LETHAL!)

Compound C: At 6:30 PM = 8 μg/mL
- 8 hours back would be 10:30 AM = 16 μg/mL (barely above lethal)
  BUT 2-hour symptom onset = symptoms at 12:30 PM
  This doesn't match timeline - compound C is a RED HERRING from lunch.

PRIMARY THREAT: Compound B - administered at 4:30 PM, initial dose 240 μg/mL (above 200 μg/mL lethal threshold)

SUSPECT 2 (met at 3:30 PM, still with victim at 4:30 PM) had opportunity to administer Compound B.`,
      hint: 'Use half-life to work backwards. Match symptom onset times to the timeline. Look for contradictions.',
      type: 'deduction' as const,
      complexity: 'CHALLENGING' as const,
    },
  ],
  INTEGRATED: [
    {
      title: 'The Art Heist Reconstruction',
      question: `A museum was robbed. You must reconstruct exactly what happened using multiple evidence sources.

SECURITY SYSTEM LOG:
| Time | Event | Location |
|------|-------|----------|
| 22:00 | System armed | All zones |
| 22:47 | Motion detected | Zone B |
| 22:48 | Motion detected | Zone C |
| 22:52 | Motion detected | Zone A |
| 23:01 | Glass break sensor | Gallery 3 |
| 23:03 | Motion detected | Zone A |
| 23:15 | Fire door opened | Emergency Exit 2 |
| 23:16 | System breach detected | Control Room |

ZONE MAP:
- Zone A: Main entrance + Control room
- Zone B: Loading dock + Storage
- Zone C: Galleries 1-2
- Gallery 3: Special exhibition (Zone C)
- Emergency Exit 2: Between Zone A and Zone B

CCTV RECOVERY (partial, some corrupted):
- 22:45: [CORRUPTED]
- 22:50: Figure in dark clothing entering from loading dock
- 22:55: [CORRUPTED]
- 23:00: Same figure near Gallery 3
- 23:05: [CORRUPTED]
- 23:10: Two figures near Emergency Exit 2
- 23:18: Van leaving loading dock

STOLEN ITEMS:
- "Sunset Dreams" painting: 2m × 1.5m, 15kg
- "Bronze Warrior" sculpture: 45cm tall, 28kg
- "Jade Collection" (12 pieces): Various sizes, total 8kg

Staff interviews reveal the maximum one person can carry is approximately 25kg.

QUESTIONS:
1. Reconstruct the timeline of the heist minute by minute.
2. How many perpetrators were involved? Justify with evidence.
3. What was their entry and exit strategy?
4. The security breach at 23:16 came AFTER they left at 23:15 - why?
5. Which item was likely taken first and why?`,
      answer: `RECONSTRUCTION:
22:47 - Perpetrator 1 enters via loading dock (Zone B motion)
22:48 - Moves to galleries (Zone C motion)
22:50 - CCTV confirms figure from loading dock
22:52 - Perpetrator 2 enters via main entrance to disable security (Zone A motion)
23:00 - Perpetrator 1 at Gallery 3
23:01 - Glass case broken in Gallery 3 (Jade Collection taken - 8kg, fits in bag)
23:03 - Zone A motion = Perpetrator 2 moving to help carry
23:05 - Both perpetrators take painting (15kg) and sculpture (28kg)
23:10 - Two figures at Emergency Exit (confirms 2 people)
23:15 - Exit via fire door
23:16 - Security breach was a DELAYED TRIGGER planted by Perpetrator 2 as distraction
23:18 - Escape van leaves via loading dock

NUMBER OF PERPETRATORS: Minimum 2
Evidence:
- Two figures on CCTV at 23:10
- Weight analysis: Total stolen = 15+28+8 = 51kg (impossible for one person)
- Simultaneous motion in different zones (22:52 Zone A while P1 still in Zone C)

ENTRY: Split entry - P1 via loading dock (less monitored), P2 via main to access control room
EXIT: Emergency Exit 2 (between zones, direct path to loading dock for getaway van)

SECURITY BREACH TIMING: The 23:16 breach was a planted delayed trigger - possibly a timed device to corrupt recordings and create confusion AFTER escape.

FIRST ITEM: Jade Collection - smallest/lightest, could be secured in bag while preparing to carry larger items. Also most valuable per kilogram.`,
      hint: 'Map movements to zones. Calculate if weight could be carried by one person. Look for impossible simultaneous events.',
      type: 'logic' as const,
      complexity: 'CHALLENGING' as const,
    },
  ],
};

// EXPERT complexity puzzles (15-25 min each, layered with multiple red herrings)
export const expertPuzzles = {
  MATH: [
    {
      title: 'The Cryptocurrency Fraud Network',
      question: `You're investigating a cryptocurrency fraud ring. Analyze the transaction data to identify the mastermind.

WALLET TRANSACTIONS (amounts in ETH):
| Tx ID | From Wallet | To Wallet | Amount | Time | Gas Fee |
|-------|-------------|-----------|--------|------|---------|
| 001 | W-Alpha | W-Beta | 12.5 | 09:00 | 0.003 |
| 002 | W-Beta | W-Gamma | 10.0 | 09:15 | 0.004 |
| 003 | W-Alpha | W-Delta | 8.0 | 09:22 | 0.003 |
| 004 | W-Gamma | W-Echo | 9.5 | 09:30 | 0.005 |
| 005 | W-Delta | W-Echo | 7.5 | 09:35 | 0.003 |
| 006 | W-Echo | W-Foxtrot | 16.0 | 09:45 | 0.006 |
| 007 | W-Beta | W-Foxtrot | 2.3 | 09:50 | 0.002 |
| 008 | W-Foxtrot | W-Golf | 18.0 | 10:00 | 0.007 |
| 009 | W-Alpha | W-Hotel | 5.0 | 10:05 | 0.003 |
| 010 | W-Hotel | W-Golf | 4.8 | 10:15 | 0.003 |
| 011 | W-Golf | EXCHANGE | 22.5 | 10:30 | 0.010 |

KNOWN WALLET OWNERSHIP:
- W-Alpha: "TechStartup Inc." (registered company)
- W-Beta: Unknown
- W-Gamma: "CryptoConsult LLC" (registered company)
- W-Delta: Unknown
- W-Echo: Unknown
- W-Foxtrot: Unknown
- W-Golf: Unknown
- W-Hotel: "InnovateTech" (registered company)
- EXCHANGE: Licensed cryptocurrency exchange

KYC RECORDS FROM EXCHANGE:
Wallet W-Golf submitted ID for: "James Chen" (Singapore resident)

COMPANY REGISTRY SEARCH:
- TechStartup Inc.: Directors - Sarah Lim, James Chen
- CryptoConsult LLC: Director - Michael Tan (sole)
- InnovateTech: Directors - James Chen, David Wong

TAX FILINGS (declared crypto holdings):
- Sarah Lim: 25 ETH
- James Chen: 5 ETH (declared)
- Michael Tan: 15 ETH
- David Wong: 0 ETH

QUESTIONS:
1. Trace the flow of funds from origin to exchange. Create a flow diagram.
2. Calculate the total amount laundered and the "fees" retained by intermediaries.
3. Identify which wallets are likely controlled by the same person based on patterns.
4. Who is the mastermind? Provide at least 3 pieces of evidence.
5. Calculate the tax evasion amount if ETH = $2,000.
6. Why would the mastermind use their real name at the exchange?`,
      answer: `FUND FLOW:
W-Alpha (TechStartup) → W-Beta → W-Gamma → W-Echo → W-Foxtrot → W-Golf → EXCHANGE
                     ↘ W-Delta ↗                    ↗
W-Alpha → W-Hotel ──────────────────────────────────────┘

AMOUNTS ANALYSIS:
Total from W-Alpha: 12.5 + 8.0 + 5.0 = 25.5 ETH
Reached Exchange: 22.5 ETH
"Lost" to fees/retained: 3.0 ETH (by intermediaries)

PATTERN ANALYSIS:
W-Beta & W-Delta: Both receive from Alpha, send to convergence point = likely SAME CONTROLLER (splitting to obscure source)
W-Echo: Convergence point = Key intermediary
W-Foxtrot: Brief holding wallet
W-Golf: Final collection before exchange = MASTERMIND WALLET

MASTERMIND: JAMES CHEN
Evidence:
1. W-Golf is registered to James Chen at exchange
2. James Chen is director at BOTH source companies (TechStartup AND InnovateTech)
3. He declared only 5 ETH but received 22.5 ETH at exchange = hiding wealth
4. The two "unknown" source streams both trace to companies he directs
5. Transaction timing shows coordinated movement (all within 90 minutes)

TAX EVASION:
Received: 22.5 ETH × $2,000 = $45,000
Declared: 5 ETH × $2,000 = $10,000
Evaded: $35,000

WHY USE REAL NAME: Singapore exchanges require KYC. He calculated that small-ish transactions wouldn't trigger automated alerts, and using his real identity lets him legally convert to fiat currency. The layered transactions obscure the source (TechStartup/InnovateTech company funds).`,
      hint: 'Follow the money. Look for convergence points. Cross-reference wallet ownership with company directors. Check declared vs actual holdings.',
      type: 'math' as const,
      complexity: 'EXPERT' as const,
    },
  ],
  SCIENCE: [
    {
      title: 'The Laboratory Sabotage',
      question: `A pharmaceutical company's vaccine batch was sabotaged. You must determine what happened, when, and who had the means.

BATCH CONTAMINATION REPORT:
| Sample | Contamination Level | Contaminant Type | pH Level |
|--------|--------------------:|------------------|----------|
| B-001  | 0.00%              | None             | 7.2      |
| B-002  | 0.00%              | None             | 7.2      |
| B-003  | 2.34%              | Bacterial        | 6.8      |
| B-004  | 8.91%              | Bacterial        | 6.1      |
| B-005  | 15.67%             | Bacterial        | 5.6      |
| B-006  | 18.23%             | Bacterial        | 5.4      |

Samples taken every 4 hours. B-001 at batch start (8:00 AM Monday).

ENVIRONMENTAL DATA:
| Time | Location | Temperature | Humidity | Personnel Present |
|------|----------|-------------|----------|-------------------|
| 08:00 | Lab A | 4°C | 45% | Dr. Singh, Tech Wang |
| 12:00 | Lab A | 4°C | 45% | Dr. Singh |
| 16:00 | Lab A | 4°C | 46% | Tech Wang, Tech Kumar |
| 20:00 | Lab A | 12°C | 52% | Dr. Patel |
| 00:00 | Lab A | 18°C | 58% | Security only |
| 04:00 | Lab A | 22°C | 61% | Security only |

STAFF ACCESS LOGS:
| Person | Entry Time | Exit Time | Areas Accessed |
|--------|------------|-----------|----------------|
| Dr. Singh | 07:45 | 13:30 | Lab A, Storage, Office |
| Tech Wang | 07:50 | 09:15 | Lab A |
| Tech Wang | 15:30 | 17:45 | Lab A, Incubation Room |
| Tech Kumar | 15:45 | 17:30 | Lab A |
| Dr. Patel | 19:30 | 21:00 | Lab A, Cold Storage |
| Dr. Patel | 03:00 | 03:45 | Lab A |

MAINTENANCE RECORDS:
- Refrigeration unit serviced at 18:00 Monday (scheduled)
- Backup power tested at 19:00 (routine)

BACTERIAL GROWTH MODEL:
At optimal conditions (20-25°C), this bacteria doubles every 2 hours.
At 4°C, bacterial growth is essentially stopped (doubling time >48 hours).
At 10-15°C, bacterial growth is slow (doubling time ~8 hours).

QUESTIONS:
1. When was the contamination introduced? Show calculations.
2. What was the sabotage mechanism?
3. Who had means, motive, and opportunity?
4. What evidence clears the other suspects?
5. Why didn't security notice anything wrong?`,
      answer: `CONTAMINATION TIMELINE ANALYSIS:
B-003 (16:00): 2.34% - First detection
B-004 (20:00): 8.91% - Growing
B-005 (00:00): 15.67% - Rapid growth
B-006 (04:00): 18.23% - Slowing (approaching saturation)

Growth rate 16:00→20:00: 2.34% to 8.91% = 3.8× in 4 hours
This matches the temperature rise (12°C at 20:00 = slow growth beginning)

Growth rate 20:00→00:00: 8.91% to 15.67% = 1.76× in 4 hours
Temperature was 18°C then 22°C - optimal growth range

WORKING BACKWARDS:
If we had 2.34% at 16:00 and doubling time at low temp is ~8 hours...
The bacteria was introduced when levels would have been ~0.5-1%
At 4°C (stopped growth), contamination must have been introduced at 16:00 OR...
The refrigeration was sabotaged to ALLOW growth of pre-existing low-level contamination.

SABOTAGE MECHANISM:
The refrigeration unit was "serviced" at 18:00 - but temperature spiked to 12°C by 20:00.
The saboteur disabled or reduced the refrigeration during the "service" window.

SUSPECT ANALYSIS:
- Dr. Singh: Left at 13:30, before any temperature issues. CLEARED.
- Tech Wang: Second visit 15:30-17:45, accessed INCUBATION ROOM. Could introduce bacteria AND was present during maintenance window.
- Tech Kumar: Left at 17:30, didn't access incubation room. CLEARED.
- Dr. Patel: First visit ended before contamination detected, returned at 03:00 AFTER damage done. However, returned at odd hour - suspicious but contamination already present.

CULPRIT: Tech Wang
Evidence:
1. Accessed Incubation Room (source of bacteria)
2. Present during maintenance window (opportunity to tamper)
3. Second visit on same day (unusual - sets up alibi of "working late")
4. Left at 17:45, just before maintenance at 18:00 - timing allows sabotage to be discovered later

SECURITY DIDN'T NOTICE: Temperature changes are gradual and within "acceptable" range initially. No alarm triggered until well above 20°C.`,
      hint: 'Work backwards from contamination levels using growth rates. Cross-reference timing with access logs and maintenance windows.',
      type: 'deduction' as const,
      complexity: 'EXPERT' as const,
    },
  ],
  INTEGRATED: [
    {
      title: 'The Election Manipulation',
      question: `You're investigating suspected electronic voting manipulation. Analyze multiple data sources to find the fraud.

OFFICIAL RESULTS (10 polling stations):
| Station | Candidate A | Candidate B | Candidate C | Total Votes | Registered |
|---------|-------------|-------------|-------------|-------------|------------|
| PS-01   | 1,245       | 987         | 456         | 2,688       | 3,100      |
| PS-02   | 1,567       | 1,234       | 523         | 3,324       | 3,800      |
| PS-03   | 2,100       | 450         | 350         | 2,900       | 3,200      |
| PS-04   | 1,890       | 1,456       | 654         | 4,000       | 4,500      |
| PS-05   | 1,432       | 1,123       | 445         | 3,000       | 3,500      |
| PS-06   | 2,340       | 320         | 240         | 2,900       | 3,100      |
| PS-07   | 1,654       | 1,287       | 559         | 3,500       | 4,000      |
| PS-08   | 1,876       | 1,534       | 590         | 4,000       | 4,400      |
| PS-09   | 1,543       | 1,234       | 523         | 3,300       | 3,700      |
| PS-10   | 1,678       | 1,356       | 566         | 3,600       | 4,100      |

PRE-ELECTION POLLS (margin of error ±3%):
| Region | Candidate A | Candidate B | Candidate C |
|--------|-------------|-------------|-------------|
| North (PS-01,02,03) | 42% | 38% | 20% |
| South (PS-04,05,06) | 44% | 40% | 16% |
| East (PS-07,08) | 45% | 39% | 16% |
| West (PS-09,10) | 43% | 40% | 17% |

VOTING MACHINE LOGS:
| Station | Machine Model | Last Calibration | Total Logged | Error Count |
|---------|---------------|------------------|--------------|-------------|
| PS-01   | VoteSafe 2.1  | 2024-01-15      | 2,688        | 0           |
| PS-02   | VoteSafe 2.1  | 2024-01-15      | 3,324        | 0           |
| PS-03   | VoteSafe 3.0  | 2024-01-10      | 2,901        | 1           |
| PS-04   | VoteSafe 2.1  | 2024-01-15      | 4,000        | 0           |
| PS-05   | VoteSafe 2.1  | 2024-01-15      | 3,000        | 0           |
| PS-06   | VoteSafe 3.0  | 2024-01-10      | 2,899        | 2           |
| PS-07   | VoteSafe 2.1  | 2024-01-15      | 3,500        | 0           |
| PS-08   | VoteSafe 2.1  | 2024-01-15      | 4,000        | 0           |
| PS-09   | VoteSafe 2.1  | 2024-01-15      | 3,300        | 0           |
| PS-10   | VoteSafe 2.1  | 2024-01-15      | 3,600        | 0           |

BENFORD'S LAW ANALYSIS (Expected first-digit distribution for natural data):
| Digit | Expected % | Candidate A | Candidate B | Candidate C |
|-------|------------|-------------|-------------|-------------|
| 1     | 30.1%      | 60%         | 30%         | 0%          |
| 2     | 17.6%      | 20%         | 10%         | 10%         |
| 3     | 12.5%      | 0%          | 10%         | 10%         |
| 4     | 9.7%       | 10%         | 20%         | 30%         |
| 5     | 7.9%       | 10%         | 20%         | 30%         |
| 6     | 6.7%       | 0%          | 10%         | 20%         |

QUESTIONS:
1. Calculate the actual vote percentages per station and compare to pre-election polls. Which stations show anomalies beyond margin of error?
2. Analyze the voting machine log discrepancies. What do they indicate?
3. Apply Benford's Law analysis. Which candidate's results show signs of fabrication?
4. Calculate voter turnout per station. Which stations have suspicious turnout?
5. Synthesize all evidence: Which stations were manipulated and how?
6. Estimate how many fraudulent votes were added/removed.`,
      answer: `1. VOTE PERCENTAGE ANALYSIS:
PS-03: A=72%, B=16%, C=12% vs Poll (A=42%, B=38%, C=20%)
  Deviation: A +30%, B -22% = MASSIVE ANOMALY
PS-06: A=81%, B=11%, C=8% vs Poll (A=44%, B=40%, C=16%)
  Deviation: A +37%, B -29% = MASSIVE ANOMALY

All other stations within ±5% of polls (acceptable).

2. MACHINE LOG DISCREPANCIES:
PS-03: Logged 2,901 but reported 2,900 (1 vote discrepancy, 1 error)
PS-06: Logged 2,899 but reported 2,900 (-1 vote discrepancy, 2 errors)
Both anomaly stations use VoteSafe 3.0 (older model) with earlier calibration.
ERROR LOGS indicate machine tampering attempts.

3. BENFORD'S LAW:
Candidate A: 60% of results start with "1" (expected 30.1%) = FABRICATED
The numbers 1,245/1,567/1,890/1,432/1,654/1,876/1,543/1,678 = 8/10 start with 1
Natural data wouldn't cluster like this.
Candidates B and C follow more natural distribution.

4. VOTER TURNOUT:
PS-03: 2,900/3,200 = 90.6% - Suspiciously high
PS-06: 2,900/3,100 = 93.5% - Suspiciously high
Others: 75-91% - Normal range

5. SYNTHESIS:
Stations PS-03 and PS-06 were manipulated using VoteSafe 3.0 machines.
Method: Votes were digitally transferred from Candidate B to Candidate A.
The older machines with earlier calibration were specifically targeted.

6. FRAUD ESTIMATION:
PS-03: Expected A votes (42% of 2,900) = 1,218 | Actual = 2,100 | Fraud: +882
        Expected B votes (38% of 2,900) = 1,102 | Actual = 450 | Fraud: -652
PS-06: Expected A votes (44% of 2,900) = 1,276 | Actual = 2,340 | Fraud: +1,064
        Expected B votes (40% of 2,900) = 1,160 | Actual = 320 | Fraud: -840

Total fraudulent votes shifted: Approximately 1,900-2,000 votes moved from B to A.`,
      hint: 'Compare results to polls. Check for statistical anomalies (Benford\'s Law). Look for machine discrepancies. High turnout + statistical anomaly = manipulation.',
      type: 'logic' as const,
      complexity: 'EXPERT' as const,
    },
  ],
};
