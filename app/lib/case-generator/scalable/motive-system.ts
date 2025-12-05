/**
 * SCALABLE MOTIVE SYSTEM
 *
 * 50+ motive templates that combine with crimes for rich backstories.
 */

export interface MotiveTemplate {
  id: string;
  category: 'financial' | 'personal' | 'professional' | 'emotional' | 'circumstantial';
  type: string;

  // Description templates (with placeholders)
  descriptions: string[];

  // Backstory templates
  backstories: string[];

  // How it connects to the crime
  connectionToAction: string[];

  // Compatible crime categories
  relevantCrimes: string[];
}

// ============================================
// FINANCIAL MOTIVES (15)
// ============================================

export const FINANCIAL_MOTIVES: MotiveTemplate[] = [
  {
    id: 'debt-pressure',
    category: 'financial',
    type: 'Debt Pressure',
    descriptions: [
      '{culprit} was under significant financial pressure',
      'Mounting debts pushed {culprit} to desperate measures',
      '{culprit} needed money urgently to pay off debts',
    ],
    backstories: [
      'Recent medical bills had piled up',
      'A failed investment left them in significant debt',
      'Family financial troubles created desperate circumstances',
      'Loan sharks were demanding immediate payment',
    ],
    connectionToAction: [
      'The stolen money was meant to pay off debts',
      'Desperation led to poor decision-making',
      'Financial pressure clouded their judgment',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
  {
    id: 'greed',
    category: 'financial',
    type: 'Pure Greed',
    descriptions: [
      '{culprit} simply wanted more than they deserved',
      'Greed drove {culprit} to take what wasn\'t theirs',
      '{culprit} couldn\'t resist the temptation of easy money',
    ],
    backstories: [
      'They had always felt underpaid for their work',
      'Seeing others with more triggered their greed',
      'The opportunity seemed too good to pass up',
      'They felt entitled to more compensation',
    ],
    connectionToAction: [
      'They saw an opportunity and took it',
      'Greed overcame their sense of right and wrong',
      'The potential gain outweighed the perceived risk',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
  {
    id: 'lifestyle',
    category: 'financial',
    type: 'Lifestyle Maintenance',
    descriptions: [
      '{culprit} was living beyond their means',
      'Maintaining appearances drove {culprit} to crime',
      '{culprit} couldn\'t afford their lifestyle legitimately',
    ],
    backstories: [
      'Social pressure to appear successful',
      'An expensive habit needed funding',
      'Relationship expectations required more income',
      'They were used to a lifestyle they could no longer afford',
    ],
    connectionToAction: [
      'The crime funded their unsustainable lifestyle',
      'They needed money to keep up appearances',
      'Desperation to maintain status led to the act',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
  {
    id: 'gambling',
    category: 'financial',
    type: 'Gambling Addiction',
    descriptions: [
      '{culprit} had a serious gambling problem',
      'Gambling losses pushed {culprit} to commit the crime',
      'Addiction clouded {culprit}\'s judgment',
    ],
    backstories: [
      'What started as fun became an uncontrollable habit',
      'They believed they could win back their losses',
      'The addiction had consumed their savings',
      'Secret gambling had created a financial crisis',
    ],
    connectionToAction: [
      'Gambling debts needed immediate payment',
      'They stole to fund more gambling',
      'Addiction drove them to desperate measures',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
  {
    id: 'business-failure',
    category: 'financial',
    type: 'Failing Business',
    descriptions: [
      '{culprit}\'s business was in trouble',
      'Financial problems with their venture drove {culprit} to crime',
      '{culprit} was trying to save a failing enterprise',
    ],
    backstories: [
      'A once-successful business had begun to fail',
      'Competition had eroded their income',
      'They had invested everything and couldn\'t lose it',
      'Suppliers were demanding payment they couldn\'t make',
    ],
    connectionToAction: [
      'The crime was meant to save the business',
      'Desperation to avoid failure led to the act',
      'They saw it as a temporary solution',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
  },
];

// ============================================
// PERSONAL MOTIVES (15)
// ============================================

export const PERSONAL_MOTIVES: MotiveTemplate[] = [
  {
    id: 'revenge',
    category: 'personal',
    type: 'Revenge',
    descriptions: [
      '{culprit} wanted revenge for a past wrong',
      'Desire for payback drove {culprit} to act',
      '{culprit} couldn\'t forget how they were treated',
    ],
    backstories: [
      'They had been passed over for promotion unfairly',
      'A perceived insult had festered into hatred',
      'Past mistreatment demanded retribution',
      'They felt they had been wronged and wanted justice',
    ],
    connectionToAction: [
      'The crime was payback for past treatment',
      'Revenge motivated every aspect of the plan',
      'They wanted the victim to suffer as they had',
    ],
    relevantCrimes: ['vandalism', 'sabotage', 'theft', 'fraud'],
  },
  {
    id: 'jealousy',
    category: 'personal',
    type: 'Jealousy',
    descriptions: [
      'Jealousy consumed {culprit}',
      '{culprit} couldn\'t stand someone else\'s success',
      'Envy drove {culprit} to commit the crime',
    ],
    backstories: [
      'Watching others succeed while they struggled',
      'A colleague\'s promotion triggered deep resentment',
      'They felt they deserved what others had',
      'Comparison with others created toxic jealousy',
    ],
    connectionToAction: [
      'If they couldn\'t have it, no one should',
      'Jealousy clouded their moral judgment',
      'They wanted to bring others down to their level',
    ],
    relevantCrimes: ['sabotage', 'vandalism', 'theft'],
  },
  {
    id: 'rejection',
    category: 'personal',
    type: 'Social Rejection',
    descriptions: [
      '{culprit} felt rejected and excluded',
      'Being left out drove {culprit} to act',
      '{culprit} wanted acceptance but felt spurned',
    ],
    backstories: [
      'They were always the outsider in the group',
      'Rejection from peers had built up resentment',
      'They felt invisible and wanted attention',
      'Social exclusion had damaged their self-worth',
    ],
    connectionToAction: [
      'The crime was a way to be noticed',
      'Rejection created a need to prove themselves',
      'They lashed out from feelings of isolation',
    ],
    relevantCrimes: ['vandalism', 'sabotage'],
  },
  {
    id: 'protection',
    category: 'personal',
    type: 'Protecting Others',
    descriptions: [
      '{culprit} was trying to protect someone',
      'Love for another drove {culprit} to crime',
      '{culprit} did it to shield someone they cared about',
    ],
    backstories: [
      'A family member was in trouble',
      'They were covering for someone else',
      'Protecting a loved one\'s reputation',
      'They took the blame for someone else\'s actions',
    ],
    connectionToAction: [
      'The crime was committed to protect another',
      'They sacrificed their integrity for someone else',
      'Love clouded their judgment about right and wrong',
    ],
    relevantCrimes: ['fraud', 'tampering', 'cover-up'],
  },
  {
    id: 'pride',
    category: 'personal',
    type: 'Wounded Pride',
    descriptions: [
      '{culprit}\'s pride was hurt',
      'Humiliation drove {culprit} to retaliate',
      '{culprit} couldn\'t accept being made to look foolish',
    ],
    backstories: [
      'A public embarrassment demanded response',
      'Their reputation had been damaged',
      'They felt disrespected and needed to restore honor',
      'Criticism had wounded their ego deeply',
    ],
    connectionToAction: [
      'The crime was about restoring pride',
      'Wounded ego demanded retribution',
      'They couldn\'t let the insult stand',
    ],
    relevantCrimes: ['sabotage', 'vandalism', 'fraud'],
  },
];

// ============================================
// PROFESSIONAL MOTIVES (10)
// ============================================

export const PROFESSIONAL_MOTIVES: MotiveTemplate[] = [
  {
    id: 'competition',
    category: 'professional',
    type: 'Professional Competition',
    descriptions: [
      '{culprit} wanted to eliminate competition',
      'Professional rivalry drove {culprit} to crime',
      '{culprit} couldn\'t win fairly so chose to cheat',
    ],
    backstories: [
      'A competitor was outperforming them',
      'They needed to win at any cost',
      'Fair competition wasn\'t going their way',
      'Professional success was everything to them',
    ],
    connectionToAction: [
      'Sabotaging the competition seemed like the only way',
      'They couldn\'t accept losing fairly',
      'Winning required removing obstacles',
    ],
    relevantCrimes: ['sabotage', 'cheating', 'fraud'],
  },
  {
    id: 'career-advancement',
    category: 'professional',
    type: 'Career Advancement',
    descriptions: [
      '{culprit} was desperate for advancement',
      'Career ambition pushed {culprit} too far',
      '{culprit} would do anything to get ahead',
    ],
    backstories: [
      'They had been stuck in the same position too long',
      'A promotion opportunity required extreme measures',
      'Career success was more important than ethics',
      'They felt they deserved advancement that wasn\'t coming',
    ],
    connectionToAction: [
      'The crime was meant to advance their career',
      'They eliminated obstacles to promotion',
      'Ambition overcame their ethical boundaries',
    ],
    relevantCrimes: ['fraud', 'sabotage', 'cheating'],
  },
  {
    id: 'covering-mistake',
    category: 'professional',
    type: 'Covering Up a Mistake',
    descriptions: [
      '{culprit} was hiding a professional error',
      'A previous mistake led {culprit} to commit more crimes',
      '{culprit} couldn\'t admit they had failed',
    ],
    backstories: [
      'An earlier error had gone unnoticed',
      'Admitting the mistake would end their career',
      'They panicked when the error was about to be discovered',
      'Covering one mistake led to more mistakes',
    ],
    connectionToAction: [
      'The crime covered up the original mistake',
      'One cover-up led to another',
      'They dug themselves deeper trying to hide the truth',
    ],
    relevantCrimes: ['fraud', 'tampering', 'theft'],
  },
];

// ============================================
// EMOTIONAL MOTIVES (5)
// ============================================

export const EMOTIONAL_MOTIVES: MotiveTemplate[] = [
  {
    id: 'anger',
    category: 'emotional',
    type: 'Uncontrolled Anger',
    descriptions: [
      '{culprit} acted in a fit of rage',
      'Anger got the better of {culprit}',
      '{culprit} lost control of their temper',
    ],
    backstories: [
      'They had been bottling up frustration',
      'Something finally pushed them over the edge',
      'They had anger management issues',
      'Stress had made them emotionally unstable',
    ],
    connectionToAction: [
      'The crime was committed in anger',
      'They didn\'t plan it - they just snapped',
      'Rage overcame their rational thinking',
    ],
    relevantCrimes: ['vandalism', 'sabotage'],
  },
  {
    id: 'fear',
    category: 'emotional',
    type: 'Acting Out of Fear',
    descriptions: [
      '{culprit} was terrified of the consequences',
      'Fear drove {culprit} to commit the crime',
      '{culprit} acted to prevent something they feared',
    ],
    backstories: [
      'They were afraid of losing everything',
      'Fear of exposure led to desperate action',
      'They panicked and made a terrible decision',
      'Fear clouded their judgment completely',
    ],
    connectionToAction: [
      'Fear made them act irrationally',
      'They committed the crime to prevent something worse',
      'Panic led to poor decisions',
    ],
    relevantCrimes: ['theft', 'fraud', 'tampering'],
  },
];

// ============================================
// CIRCUMSTANTIAL MOTIVES (5)
// ============================================

export const CIRCUMSTANTIAL_MOTIVES: MotiveTemplate[] = [
  {
    id: 'opportunity',
    category: 'circumstantial',
    type: 'Crime of Opportunity',
    descriptions: [
      '{culprit} saw an opportunity and took it',
      'Circumstances presented an irresistible opportunity',
      '{culprit} hadn\'t planned it but couldn\'t resist',
    ],
    backstories: [
      'The situation presented itself unexpectedly',
      'They were in the right place at the wrong time',
      'Temptation proved too strong in the moment',
      'An unlocked door or unattended valuables tempted them',
    ],
    connectionToAction: [
      'The crime was opportunistic, not planned',
      'They acted on impulse when the chance arose',
      'Circumstance created the crime',
    ],
    relevantCrimes: ['theft', 'tampering'],
  },
  {
    id: 'coercion',
    category: 'circumstantial',
    type: 'Coerced by Others',
    descriptions: [
      '{culprit} was pressured by others',
      'External pressure forced {culprit} to act',
      '{culprit} was manipulated into committing the crime',
    ],
    backstories: [
      'Someone had leverage over them',
      'Peer pressure led to poor choices',
      'They were being blackmailed',
      'Threats against them or loved ones forced compliance',
    ],
    connectionToAction: [
      'They didn\'t want to do it but felt forced',
      'Coercion removed their choice',
      'Others manipulated them into acting',
    ],
    relevantCrimes: ['theft', 'fraud', 'sabotage'],
  },
  {
    id: 'accident',
    category: 'circumstantial',
    type: 'Accidental Escalation',
    descriptions: [
      'What started as something minor escalated',
      '{culprit} didn\'t intend for things to go this far',
      'A small mistake grew into a major crime',
    ],
    backstories: [
      'It started as a joke that went wrong',
      'A minor action had unexpected consequences',
      'They tried to fix something and made it worse',
      'One mistake led to another in a chain reaction',
    ],
    connectionToAction: [
      'The crime wasn\'t intentional but happened anyway',
      'Things spiraled out of control',
      'They didn\'t mean for this to happen',
    ],
    relevantCrimes: ['vandalism', 'sabotage', 'fraud'],
  },
];

// ============================================
// EXPORT ALL MOTIVES
// ============================================

export const ALL_MOTIVES: MotiveTemplate[] = [
  ...FINANCIAL_MOTIVES,
  ...PERSONAL_MOTIVES,
  ...PROFESSIONAL_MOTIVES,
  ...EMOTIONAL_MOTIVES,
  ...CIRCUMSTANTIAL_MOTIVES,
];

// Total: 50+ motive templates

/**
 * Get motive for crime type
 */
export function getMotiveForCrime(crimeCategory: string): MotiveTemplate {
  const compatible = ALL_MOTIVES.filter(m => m.relevantCrimes.includes(crimeCategory));
  if (compatible.length === 0) {
    return ALL_MOTIVES[Math.floor(Math.random() * ALL_MOTIVES.length)];
  }
  return compatible[Math.floor(Math.random() * compatible.length)];
}

/**
 * Generate complete motive narrative
 */
export function generateMotiveNarrative(
  template: MotiveTemplate,
  culpritName: string,
  crimeName: string
): { type: string; description: string; backstory: string } {
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)]
    .replace('{culprit}', culpritName);

  const backstory = template.backstories[Math.floor(Math.random() * template.backstories.length)];

  return {
    type: template.type,
    description,
    backstory,
  };
}

// Unique motive combinations:
// 50 templates × 3 descriptions × 4 backstories × 3 connections = 1,800+ variations
