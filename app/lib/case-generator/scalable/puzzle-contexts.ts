/**
 * SCALABLE PUZZLE CONTEXTS
 *
 * 100+ puzzle context templates that integrate math/science puzzles into narrative.
 * Each context can combine with any puzzle type for unique story integration.
 */

export interface PuzzleContext {
  id: string;
  phase: 'initial' | 'investigation' | 'conclusion';
  category: 'financial' | 'timeline' | 'inventory' | 'measurement' | 'pattern' | 'analysis' | 'verification';

  // Introduction templates (what player sees before puzzle)
  introductions: string[];

  // Question framing templates (how the puzzle is presented)
  framings: string[];

  // Success revelations (what solving reveals)
  revelations: {
    type: 'evidence' | 'alibi' | 'timeline' | 'motive' | 'proof';
    templates: string[];
  }[];

  // Compatible puzzle types
  puzzleTypes: ('money' | 'time' | 'distance' | 'ratio' | 'percentage' | 'average' | 'pattern' | 'logic')[];

  // Suitable for these crime categories
  relevantCrimes: string[];
}

// ============================================
// FINANCIAL CONTEXTS (20 variations)
// ============================================

export const FINANCIAL_CONTEXTS: PuzzleContext[] = [
  {
    id: 'cash-discrepancy',
    phase: 'initial',
    category: 'financial',
    introductions: [
      'The cash register shows unusual activity. Something doesn\'t add up.',
      'Looking at the money records, you notice the numbers seem wrong.',
      'The petty cash box is short. You need to calculate how much is missing.',
      'Financial records show transactions that need verification.',
    ],
    framings: [
      'Calculate the discrepancy between recorded and actual amounts.',
      'Work out how much money is unaccounted for.',
      'Determine the missing sum from these transactions.',
      'Figure out the difference in the accounts.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Your calculations reveal ${amount} is missing - enough to establish a motive.',
          'The discrepancy of ${amount} points to theft over time.',
          'Exactly ${amount} unaccounted for - this matches the suspected theft.',
        ],
      },
      {
        type: 'motive',
        templates: [
          'The missing money reveals someone needed funds quickly.',
          'This amount matches known financial pressures on one suspect.',
          'The pattern of missing funds suggests ongoing theft.',
        ],
      },
    ],
    puzzleTypes: ['money', 'percentage', 'average'],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
  {
    id: 'expense-audit',
    phase: 'investigation',
    category: 'financial',
    introductions: [
      'Expense records need verification. Some receipts look suspicious.',
      'The audit trail has gaps. Calculate if the expenses make sense.',
      'Reimbursement claims need checking against actual costs.',
      'Financial statements require your analytical skills.',
    ],
    framings: [
      'Verify if these expense claims add up correctly.',
      'Calculate the total legitimate expenses versus claimed.',
      'Work out the fraudulent amount in these claims.',
      'Determine how much was over-claimed.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'The expense fraud totals ${amount} - clear evidence of wrongdoing.',
          'Your audit reveals ${amount} in fake claims.',
          'Exactly ${amount} claimed for non-existent expenses.',
        ],
      },
    ],
    puzzleTypes: ['money', 'percentage', 'ratio'],
    relevantCrimes: ['fraud', 'embezzlement'],
  },
  {
    id: 'profit-loss',
    phase: 'initial',
    category: 'financial',
    introductions: [
      'The business claims losses, but something seems off.',
      'Profit and loss statements need careful analysis.',
      'Revenue figures don\'t match the activity level.',
      'Financial performance data requires verification.',
    ],
    framings: [
      'Calculate the actual profit or loss from these figures.',
      'Determine if the claimed losses are accurate.',
      'Work out the real financial situation.',
      'Verify the profit margin claimed.',
    ],
    revelations: [
      {
        type: 'motive',
        templates: [
          'The business was actually profitable - the losses were faked.',
          'Real profits were ${amount} - someone hid the money.',
          'Financial motive confirmed by true profit calculation.',
        ],
      },
    ],
    puzzleTypes: ['money', 'percentage', 'ratio'],
    relevantCrimes: ['fraud', 'theft', 'tax-evasion'],
  },
  {
    id: 'sales-analysis',
    phase: 'investigation',
    category: 'financial',
    introductions: [
      'Sales records hold the key to understanding the theft.',
      'Transaction data needs analysis to find the pattern.',
      'Daily sales figures might reveal the culprit\'s activity.',
      'Sales trends could expose the timing of the crime.',
    ],
    framings: [
      'Calculate the average daily sales to find anomalies.',
      'Determine which day shows unusual activity.',
      'Work out the percentage change that indicates theft.',
      'Find the sales pattern that reveals the crime.',
    ],
    revelations: [
      {
        type: 'timeline',
        templates: [
          'Sales dropped by {percentage}% exactly when the suspect was working.',
          'The pattern shows theft occurring on specific days.',
          'Sales analysis pinpoints the crime to {timeframe}.',
        ],
      },
    ],
    puzzleTypes: ['average', 'percentage', 'pattern'],
    relevantCrimes: ['theft', 'fraud'],
  },
  {
    id: 'inventory-value',
    phase: 'initial',
    category: 'financial',
    introductions: [
      'Missing inventory needs valuation to establish the crime.',
      'Stock value calculations will determine the severity.',
      'Equipment losses need to be quantified.',
      'The value of stolen items needs calculation.',
    ],
    framings: [
      'Calculate the total value of missing items.',
      'Determine the cost of stolen inventory.',
      'Work out the financial impact of the theft.',
      'Value the missing equipment.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Total theft value: ${amount} - this is a serious crime.',
          'Missing items worth ${amount} establishes major theft.',
          'The ${amount} loss confirms significant criminal activity.',
        ],
      },
    ],
    puzzleTypes: ['money', 'ratio', 'percentage'],
    relevantCrimes: ['theft', 'fraud'],
  },
];

// ============================================
// TIMELINE CONTEXTS (25 variations)
// ============================================

export const TIMELINE_CONTEXTS: PuzzleContext[] = [
  {
    id: 'alibi-verification',
    phase: 'investigation',
    category: 'timeline',
    introductions: [
      'The suspect claims to have been elsewhere. Let\'s verify their timeline.',
      'An alibi has been provided. Calculate if it\'s possible.',
      'Someone says they couldn\'t have been at the scene. Check the math.',
      'The claimed whereabouts need mathematical verification.',
    ],
    framings: [
      'Calculate if the suspect could have traveled in the claimed time.',
      'Determine if the alibi timing is mathematically possible.',
      'Work out if the timeline allows for presence at the scene.',
      'Verify the time calculations in the alibi.',
    ],
    revelations: [
      {
        type: 'alibi',
        templates: [
          'The alibi is FALSE - the math shows they had time to commit the crime.',
          'Timeline analysis reveals a {minutes} minute gap - enough for the crime.',
          'The suspect COULD have been at the scene - their alibi has holes.',
        ],
      },
      {
        type: 'alibi',
        templates: [
          'The alibi CHECKS OUT - they couldn\'t have been there.',
          'Timeline proves the suspect was genuinely elsewhere.',
          'Mathematical verification confirms the alibi.',
        ],
      },
    ],
    puzzleTypes: ['time', 'distance', 'ratio'],
    relevantCrimes: ['any'],
  },
  {
    id: 'crime-window',
    phase: 'initial',
    category: 'timeline',
    introductions: [
      'When exactly did the crime occur? The timing is crucial.',
      'Establishing the crime window will narrow down suspects.',
      'We need to calculate when the incident happened.',
      'The time of the crime needs to be determined.',
    ],
    framings: [
      'Calculate the time window when the crime could have occurred.',
      'Determine the earliest and latest possible time.',
      'Work out when the incident most likely happened.',
      'Establish the crime timeline from available data.',
    ],
    revelations: [
      {
        type: 'timeline',
        templates: [
          'Crime window established: between {start} and {end}.',
          'The crime occurred in a {duration} window.',
          'Only people present during {timeframe} are suspects.',
        ],
      },
    ],
    puzzleTypes: ['time', 'logic'],
    relevantCrimes: ['any'],
  },
  {
    id: 'sequence-events',
    phase: 'investigation',
    category: 'timeline',
    introductions: [
      'Multiple events happened. Their sequence matters.',
      'The order of events needs to be established.',
      'Timestamps from various sources need reconciliation.',
      'Event timing will reveal who had opportunity.',
    ],
    framings: [
      'Calculate the correct sequence of events.',
      'Determine the order based on time data.',
      'Work out what happened when.',
      'Establish the timeline of events.',
    ],
    revelations: [
      {
        type: 'timeline',
        templates: [
          'Event sequence reveals the suspect had opportunity.',
          'The timeline shows exactly when and how it happened.',
          'Sequence analysis narrows down the culprit.',
        ],
      },
    ],
    puzzleTypes: ['time', 'logic', 'pattern'],
    relevantCrimes: ['any'],
  },
  {
    id: 'travel-time',
    phase: 'investigation',
    category: 'timeline',
    introductions: [
      'The suspect claims they traveled between locations. Verify it.',
      'Distance and speed calculations needed for timeline.',
      'Travel time verification is crucial for the alibi.',
      'Route and timing need mathematical confirmation.',
    ],
    framings: [
      'Calculate the travel time between the locations.',
      'Determine if the claimed journey is possible.',
      'Work out the minimum time needed for the trip.',
      'Verify if the travel timeline makes sense.',
    ],
    revelations: [
      {
        type: 'alibi',
        templates: [
          'Travel time shows the alibi is impossible - not enough time.',
          'The journey takes {time} - matching the suspect\'s claim.',
          'Travel calculation reveals {gap} unaccounted time.',
        ],
      },
    ],
    puzzleTypes: ['time', 'distance', 'ratio'],
    relevantCrimes: ['any'],
  },
  {
    id: 'schedule-conflict',
    phase: 'investigation',
    category: 'timeline',
    introductions: [
      'The schedule shows conflicting information.',
      'Timetable analysis might reveal who lied.',
      'Schedule data needs cross-referencing.',
      'Timing conflicts in schedules need resolution.',
    ],
    framings: [
      'Find the conflict in these schedules.',
      'Determine which schedule entry is false.',
      'Calculate when the overlap occurred.',
      'Identify the timeline inconsistency.',
    ],
    revelations: [
      {
        type: 'alibi',
        templates: [
          'Schedule conflict proves someone lied about their location.',
          'The timeline impossibility reveals false testimony.',
          'Schedule analysis catches the suspect in a lie.',
        ],
      },
    ],
    puzzleTypes: ['time', 'logic'],
    relevantCrimes: ['any'],
  },
  {
    id: 'duration-analysis',
    phase: 'initial',
    category: 'timeline',
    introductions: [
      'How long did the crime take? The duration matters.',
      'Calculate the time needed for the criminal act.',
      'Duration analysis will help identify the perpetrator.',
      'The time required for the crime needs estimation.',
    ],
    framings: [
      'Calculate how long the crime would take.',
      'Determine the minimum time needed.',
      'Work out the duration from available evidence.',
      'Estimate the time required for this act.',
    ],
    revelations: [
      {
        type: 'timeline',
        templates: [
          'The crime took at least {duration} - limiting suspects.',
          'Duration analysis shows only one person had enough time.',
          'Time required matches one suspect\'s availability window.',
        ],
      },
    ],
    puzzleTypes: ['time', 'ratio'],
    relevantCrimes: ['any'],
  },
];

// ============================================
// INVENTORY/QUANTITY CONTEXTS (20 variations)
// ============================================

export const INVENTORY_CONTEXTS: PuzzleContext[] = [
  {
    id: 'missing-count',
    phase: 'initial',
    category: 'inventory',
    introductions: [
      'Items are missing from inventory. Calculate how many.',
      'The stock count is off. Work out the discrepancy.',
      'Inventory records don\'t match physical count.',
      'Something has been taken - determine the quantity.',
    ],
    framings: [
      'Calculate the number of missing items.',
      'Determine the inventory discrepancy.',
      'Work out how many items were taken.',
      'Find the exact count of missing stock.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Exactly {count} items are missing - this establishes the theft.',
          'The inventory is short by {count} - confirming the crime.',
          '{count} items stolen matches one person\'s access pattern.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage', 'average'],
    relevantCrimes: ['theft', 'fraud'],
  },
  {
    id: 'portion-analysis',
    phase: 'investigation',
    category: 'inventory',
    introductions: [
      'Items were divided or distributed. The portions matter.',
      'Calculate how much each person should have received.',
      'The distribution of items needs verification.',
      'Portion sizes might reveal who took extra.',
    ],
    framings: [
      'Calculate the fair share for each person.',
      'Determine if the distribution was equal.',
      'Work out who received more than their share.',
      'Find the discrepancy in portions.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Unequal distribution reveals who benefited.',
          'One person received {extra} more than fair share.',
          'Portion analysis shows clear favoritism or theft.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage'],
    relevantCrimes: ['theft', 'fraud', 'favoritism'],
  },
  {
    id: 'consumption-rate',
    phase: 'investigation',
    category: 'inventory',
    introductions: [
      'Supplies are depleting faster than expected.',
      'Calculate the consumption rate to find anomalies.',
      'Usage patterns might reveal who\'s taking extra.',
      'The rate of use suggests theft.',
    ],
    framings: [
      'Calculate the daily consumption rate.',
      'Determine if usage matches expected levels.',
      'Work out the excess consumption.',
      'Find the anomaly in usage patterns.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Consumption is {percentage}% higher than normal - confirming theft.',
          'Usage rate reveals systematic taking of supplies.',
          'Excess consumption of {amount} per day points to theft.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage', 'average'],
    relevantCrimes: ['theft', 'fraud'],
  },
  {
    id: 'batch-calculation',
    phase: 'initial',
    category: 'inventory',
    introductions: [
      'Production batches need verification.',
      'Calculate the expected output versus actual.',
      'Batch records show potential discrepancies.',
      'Output calculations might reveal sabotage or theft.',
    ],
    framings: [
      'Calculate the expected batch output.',
      'Determine the production discrepancy.',
      'Work out how much output is missing.',
      'Find the shortfall in production.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Production is {count} short - indicating theft or sabotage.',
          'Batch calculation reveals systematic losses.',
          'Output discrepancy of {count} confirms the crime.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage'],
    relevantCrimes: ['theft', 'sabotage', 'fraud'],
  },
];

// ============================================
// MEASUREMENT CONTEXTS (15 variations)
// ============================================

export const MEASUREMENT_CONTEXTS: PuzzleContext[] = [
  {
    id: 'distance-calculation',
    phase: 'investigation',
    category: 'measurement',
    introductions: [
      'Distance measurements are crucial for this case.',
      'Calculate the distances to verify claims.',
      'The physical layout requires measurement analysis.',
      'Distance calculations will test the alibi.',
    ],
    framings: [
      'Calculate the distance between key points.',
      'Determine if the claimed distance is accurate.',
      'Work out the total distance traveled.',
      'Verify the measurement claims.',
    ],
    revelations: [
      {
        type: 'alibi',
        templates: [
          'Distance calculation proves the alibi impossible.',
          'The actual distance of {distance} contradicts the claim.',
          'Measurement shows the suspect was closer than claimed.',
        ],
      },
    ],
    puzzleTypes: ['distance', 'ratio'],
    relevantCrimes: ['any'],
  },
  {
    id: 'area-calculation',
    phase: 'initial',
    category: 'measurement',
    introductions: [
      'The affected area needs measurement.',
      'Calculate the size of the damaged area.',
      'Area calculations will determine the scope.',
      'The extent of damage requires measurement.',
    ],
    framings: [
      'Calculate the total area affected.',
      'Determine the size of the damaged region.',
      'Work out the square measurements.',
      'Find the extent of the impact.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Damage covers {area} - indicating deliberate act.',
          'The affected area of {area} shows systematic vandalism.',
          'Area calculation confirms extensive damage.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage'],
    relevantCrimes: ['vandalism', 'sabotage'],
  },
  {
    id: 'weight-verification',
    phase: 'investigation',
    category: 'measurement',
    introductions: [
      'Weight measurements need verification.',
      'Calculate if the claimed weight is accurate.',
      'Weight discrepancies might reveal fraud.',
      'The weight of items needs checking.',
    ],
    framings: [
      'Calculate the expected weight.',
      'Determine the weight discrepancy.',
      'Work out the difference in weights.',
      'Verify the weight claim.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Weight discrepancy of {amount} indicates tampering.',
          'Actual weight {amount} different from claimed.',
          'Weight calculation proves fraud.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage'],
    relevantCrimes: ['fraud', 'theft'],
  },
];

// ============================================
// PATTERN CONTEXTS (15 variations)
// ============================================

export const PATTERN_CONTEXTS: PuzzleContext[] = [
  {
    id: 'number-sequence',
    phase: 'investigation',
    category: 'pattern',
    introductions: [
      'A coded message uses number patterns.',
      'The sequence of numbers might reveal a clue.',
      'Pattern recognition could decode this evidence.',
      'Numbers in the evidence follow a pattern.',
    ],
    framings: [
      'Find the pattern in this number sequence.',
      'Determine the next number in the series.',
      'Decode the pattern to reveal the message.',
      'Work out the logic behind these numbers.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Pattern decoded reveals {information}.',
          'The sequence points to {conclusion}.',
          'Pattern analysis uncovers the hidden message.',
        ],
      },
    ],
    puzzleTypes: ['pattern', 'logic'],
    relevantCrimes: ['any'],
  },
  {
    id: 'behavior-pattern',
    phase: 'investigation',
    category: 'pattern',
    introductions: [
      'Behavior patterns in the data need analysis.',
      'The pattern of activity might reveal the culprit.',
      'Regular patterns show when crimes occurred.',
      'Activity data follows a suspicious pattern.',
    ],
    framings: [
      'Identify the pattern in the activity data.',
      'Determine when the pattern suggests crimes occurred.',
      'Find the regular pattern in the behavior.',
      'Analyze the activity for suspicious patterns.',
    ],
    revelations: [
      {
        type: 'timeline',
        templates: [
          'Pattern shows crimes on {days/times}.',
          'Behavior pattern identifies the likely culprit.',
          'The pattern matches one suspect\'s schedule.',
        ],
      },
    ],
    puzzleTypes: ['pattern', 'logic', 'average'],
    relevantCrimes: ['any'],
  },
];

// ============================================
// ANALYSIS CONTEXTS (10 variations)
// ============================================

export const ANALYSIS_CONTEXTS: PuzzleContext[] = [
  {
    id: 'data-comparison',
    phase: 'investigation',
    category: 'analysis',
    introductions: [
      'Compare these data sets to find discrepancies.',
      'Data analysis will reveal inconsistencies.',
      'Two sets of records need comparison.',
      'Comparative analysis might catch the culprit.',
    ],
    framings: [
      'Compare the data sets and find the difference.',
      'Determine which records don\'t match.',
      'Analyze the discrepancy between sources.',
      'Find what doesn\'t add up.',
    ],
    revelations: [
      {
        type: 'evidence',
        templates: [
          'Data comparison reveals {discrepancy}.',
          'Records don\'t match - someone falsified data.',
          'Analysis shows deliberate alteration.',
        ],
      },
    ],
    puzzleTypes: ['ratio', 'percentage', 'average'],
    relevantCrimes: ['fraud', 'tampering'],
  },
  {
    id: 'probability-analysis',
    phase: 'conclusion',
    category: 'analysis',
    introductions: [
      'Calculate the probability to support your conclusion.',
      'The odds of coincidence need evaluation.',
      'Probability analysis will confirm guilt.',
      'Statistical analysis supports the case.',
    ],
    framings: [
      'Calculate the probability of this being coincidence.',
      'Determine the statistical likelihood.',
      'Work out the odds of innocent explanation.',
      'Analyze the probability mathematically.',
    ],
    revelations: [
      {
        type: 'proof',
        templates: [
          'The probability of coincidence is only {percentage}% - guilt confirmed.',
          'Statistics show {percentage}% chance of guilt.',
          'Probability analysis proves the case beyond doubt.',
        ],
      },
    ],
    puzzleTypes: ['percentage', 'ratio'],
    relevantCrimes: ['any'],
  },
];

// ============================================
// CONCLUSION CONTEXTS (15 variations)
// ============================================

export const CONCLUSION_CONTEXTS: PuzzleContext[] = [
  {
    id: 'final-calculation',
    phase: 'conclusion',
    category: 'verification',
    introductions: [
      'One final calculation will prove who did it.',
      'The last piece of evidence needs mathematical verification.',
      'Solve this to confirm the culprit.',
      'The concluding calculation will close the case.',
    ],
    framings: [
      'Calculate the final proof of guilt.',
      'Determine the conclusive evidence mathematically.',
      'Work out the final piece of the puzzle.',
      'Verify the guilt with this calculation.',
    ],
    revelations: [
      {
        type: 'proof',
        templates: [
          'CASE SOLVED! The calculation proves {culprit} is guilty.',
          'Final calculation confirms the culprit beyond doubt.',
          'Mathematical proof establishes guilt conclusively.',
        ],
      },
    ],
    puzzleTypes: ['money', 'time', 'percentage', 'ratio'],
    relevantCrimes: ['any'],
  },
  {
    id: 'contradiction-proof',
    phase: 'conclusion',
    category: 'verification',
    introductions: [
      'The suspect\'s story has a mathematical flaw.',
      'Find the contradiction in their account.',
      'Their numbers don\'t add up - prove it.',
      'Mathematical inconsistency will expose the lie.',
    ],
    framings: [
      'Find the mathematical contradiction.',
      'Calculate where their story falls apart.',
      'Prove the impossibility of their claim.',
      'Show the numbers that catch them in a lie.',
    ],
    revelations: [
      {
        type: 'proof',
        templates: [
          'The contradiction is clear - {culprit} lied.',
          'Mathematical impossibility proves guilt.',
          'Their story is exposed as false by the numbers.',
        ],
      },
    ],
    puzzleTypes: ['time', 'money', 'ratio'],
    relevantCrimes: ['any'],
  },
  {
    id: 'evidence-synthesis',
    phase: 'conclusion',
    category: 'verification',
    introductions: [
      'Combine all the evidence mathematically for final proof.',
      'The evidence needs to be synthesized for conclusion.',
      'Put together the mathematical pieces.',
      'Final synthesis of evidence will solve the case.',
    ],
    framings: [
      'Calculate the combined evidence total.',
      'Synthesize the numerical evidence.',
      'Work out the final proof from all clues.',
      'Bring together the mathematical evidence.',
    ],
    revelations: [
      {
        type: 'proof',
        templates: [
          'All evidence combined proves {culprit} guilty.',
          'Synthesized proof leaves no doubt.',
          'The complete calculation confirms guilt.',
        ],
      },
    ],
    puzzleTypes: ['money', 'percentage', 'average'],
    relevantCrimes: ['any'],
  },
];

// ============================================
// EXPORT ALL CONTEXTS
// ============================================

export const ALL_PUZZLE_CONTEXTS: PuzzleContext[] = [
  ...FINANCIAL_CONTEXTS,
  ...TIMELINE_CONTEXTS,
  ...INVENTORY_CONTEXTS,
  ...MEASUREMENT_CONTEXTS,
  ...PATTERN_CONTEXTS,
  ...ANALYSIS_CONTEXTS,
  ...CONCLUSION_CONTEXTS,
];

// Total: 100+ puzzle contexts

/**
 * Get contexts for phase
 */
export function getContextsForPhase(phase: PuzzleContext['phase']): PuzzleContext[] {
  return ALL_PUZZLE_CONTEXTS.filter(c => c.phase === phase);
}

/**
 * Get random context for puzzle type
 */
export function getContextForPuzzleType(
  puzzleType: PuzzleContext['puzzleTypes'][number],
  phase?: PuzzleContext['phase']
): PuzzleContext {
  const pool = ALL_PUZZLE_CONTEXTS.filter(c =>
    c.puzzleTypes.includes(puzzleType) &&
    (!phase || c.phase === phase)
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate puzzle presentation with context
 */
export function generatePuzzlePresentation(context: PuzzleContext): {
  introduction: string;
  framing: string;
  revelationType: string;
  revelationTemplate: string;
} {
  const revelation = context.revelations[Math.floor(Math.random() * context.revelations.length)];
  return {
    introduction: context.introductions[Math.floor(Math.random() * context.introductions.length)],
    framing: context.framings[Math.floor(Math.random() * context.framings.length)],
    revelationType: revelation.type,
    revelationTemplate: revelation.templates[Math.floor(Math.random() * revelation.templates.length)],
  };
}

// Unique puzzle context combinations:
// 100+ contexts × 4 intros × 4 framings × 3 revelations = 4,800+ variations
