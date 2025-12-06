/**
 * NARRATIVE TEMPLATES
 *
 * Rich, kid-friendly noir-style templates for procedural story generation.
 * These templates are the building blocks for immersive detective narratives
 * that make players feel like real investigators.
 *
 * Design Principles:
 * - Kid-friendly (Primary School appropriate)
 * - Mysterious but not scary
 * - Encouraging and empowering
 * - Educational through discovery
 */

import { CrimeBlueprint, CrimeType } from './crime-blueprint';

// ============================================
// SCENE ATMOSPHERE TEMPLATES
// ============================================

export interface AtmosphereTemplate {
  visual: string;
  sensory: string;
  emotional: string;
  investigationHint: string;
}

export const SCENE_ATMOSPHERES: Record<string, AtmosphereTemplate[]> = {
  crime_scene: [
    {
      visual: 'Something felt wrong the moment you stepped inside. {visual_details}. The usual order had been disturbed.',
      sensory: 'The air was thick with unanswered questions. {sensory_details}.',
      emotional: 'A detective\'s instinct kicked in—someone had been here who shouldn\'t have been.',
      investigationHint: 'Look carefully. The truth is hiding in the details.',
    },
    {
      visual: 'At first glance, everything seemed normal. But look closer at {focus_area}. See how {observation}?',
      sensory: '{sensory_details}. The scene was trying to tell its story.',
      emotional: 'The puzzle pieces were scattered here. Your job was to put them together.',
      investigationHint: 'What\'s out of place? What doesn\'t belong?',
    },
    {
      visual: 'Evidence of the incident was everywhere—if you knew where to look. {visual_details}.',
      sensory: 'The {time_of_day} light revealed {sensory_details}.',
      emotional: 'This was where it happened. Now the walls held secrets.',
      investigationHint: 'Start at the center and work outward. What story does the evidence tell?',
    },
  ],

  security_office: [
    {
      visual: 'Rows of monitors flickered with frozen images of the past. Somewhere in these recordings was the truth.',
      sensory: 'The hum of electronics filled the small room. The glow of screens illuminated your face.',
      emotional: 'Time could be rewound here. The cameras had seen everything.',
      investigationHint: 'Check the timestamps. The timeline holds the key.',
    },
    {
      visual: 'The access logs lay open on the desk. Every entry and exit was recorded here.',
      sensory: 'Papers rustled as you turned the pages. The clock on the wall ticked steadily.',
      emotional: 'Someone had been careless. They forgot that everything leaves a trace.',
      investigationHint: 'Look for gaps in the records. Absence of evidence is also evidence.',
    },
  ],

  suspect_workspace: [
    {
      visual: 'This was where {suspect_name} spent their days. Personal items sat on the desk. Photos on the wall.',
      sensory: '{sensory_details}. Small details that paint a picture of the person.',
      emotional: 'Everyone has a story. Sometimes that story includes a motive.',
      investigationHint: 'What does this space tell you about the person who uses it?',
    },
    {
      visual: 'A workspace tells many tales. {suspect_name}\'s area was {state}—{interpretation}.',
      sensory: 'You noticed {detail}. An interesting clue to their state of mind.',
      emotional: 'Understanding someone helps you understand their choices.',
      investigationHint: 'Is there anything here that seems out of character?',
    },
  ],

  aftermath: [
    {
      visual: 'The dust had settled. The chaos had subsided. Now only questions remained.',
      sensory: '{sensory_details}. The scene was quieter now, but not silent.',
      emotional: 'What happened here? The evidence would speak if you listened carefully.',
      investigationHint: 'Reconstruct the sequence. What happened first? What came after?',
    },
  ],
};

// ============================================
// SUSPECT INTRODUCTION TEMPLATES
// ============================================

export interface SuspectIntroTemplate {
  guilty: string[];
  innocent: string[];
  nervous: string[];
  confident: string[];
}

export const SUSPECT_INTRODUCTIONS: SuspectIntroTemplate = {
  guilty: [
    '{name} smiled, but there was something off about it. Like a mask that didn\'t quite fit.',
    'There was a flicker in {name}\'s eyes when you mentioned the {crime}. Just for a second. Then it was gone.',
    '{name} spoke too quickly, words tumbling out like they\'d been rehearsed. "I don\'t know anything about it."',
    'Watch {name}\'s hands. They keep finding things to fidget with. Nervous energy seeking an outlet.',
    '{name} had all the right answers. Almost too right. As if they\'d prepared for these questions.',
    'Something about {name}\'s posture changed when you entered. Defensive. Guarded.',
    '{name}\'s alibi was perfect. Suspiciously perfect. Real life is rarely so neat.',
  ],

  innocent: [
    '{name} looked genuinely puzzled. "That\'s terrible. How can I help?"',
    'Concern was evident in {name}\'s voice. They wanted answers just as much as you did.',
    '{name} answered without hesitation, their story consistent and straightforward.',
    '"Of course I\'ll cooperate," {name} said, leaning forward helpfully. "Ask me anything."',
    '{name}\'s surprise at the news seemed authentic. Either they were innocent, or very skilled.',
    'There was openness in {name}\'s manner. No walls, no barriers. Nothing to hide.',
    '{name} tried to help, offering information without being asked.',
  ],

  nervous: [
    '{name} shifted uncomfortably, eyes darting around the room.',
    'A bead of sweat appeared on {name}\'s forehead despite the cool temperature.',
    '{name} kept glancing at the door, as if planning an escape route.',
    'The coffee cup trembled slightly in {name}\'s hands.',
    '{name} crossed their arms defensively, a barrier against your questions.',
  ],

  confident: [
    '{name} met your gaze steadily, radiating calm assurance.',
    'There was almost a challenge in {name}\'s eyes. "Go ahead. Ask your questions."',
    '{name} settled back in their chair, comfortable and at ease.',
    'A slight smile played on {name}\'s lips. They seemed almost amused.',
    '{name} spoke with the confidence of someone with nothing to hide.',
  ],
};

// ============================================
// DIALOGUE PATTERNS
// ============================================

export interface DialoguePattern {
  question: string;
  responseTemplates: {
    honest: string[];
    evasive: string[];
    defensive: string[];
    helpful: string[];
  };
}

export const DIALOGUE_PATTERNS: DialoguePattern[] = [
  {
    question: 'Where were you when it happened?',
    responseTemplates: {
      honest: [
        'I was at {location}. {verification_detail}.',
        'Let me think... I was {activity} at {location}. You can check with {witness}.',
        'I remember exactly—I was {activity}. It was around {time}.',
      ],
      evasive: [
        'I was around... somewhere. It\'s hard to remember exactly.',
        'Why does that matter? I\'m sure lots of people were nearby.',
        'I\'d have to check my calendar. These days blur together.',
      ],
      defensive: [
        'Why are you asking me? I wasn\'t the only one here!',
        'I don\'t have to answer that. Am I being accused of something?',
        'That\'s none of your business, is it?',
      ],
      helpful: [
        'I was at {location}. Actually, I might have seen something useful...',
        'At {location}. I remember because {memorable_detail}. What else can I tell you?',
        'I can show you exactly where I was. Let me take you there.',
      ],
    },
  },
  {
    question: 'Did you notice anything unusual?',
    responseTemplates: {
      honest: [
        'Now that you mention it, I did see {observation}.',
        'I thought I heard {sound} around {time}, but I didn\'t think much of it.',
        'Actually, yes. {observation}. Is that important?',
      ],
      evasive: [
        'Unusual? No, nothing unusual. Everything was completely normal.',
        'I wasn\'t really paying attention. I had my own things to worry about.',
        'Define unusual. What exactly are you looking for?',
      ],
      defensive: [
        'Why would I notice anything? I wasn\'t watching!',
        'Are you suggesting I should have seen something? What are you implying?',
        'I see lots of things. That doesn\'t make me responsible.',
      ],
      helpful: [
        'Yes! I noticed {observation}. I should have said something earlier.',
        'Something was definitely off. {observation}. Does that help?',
        'I\'ve been thinking about it, and I did notice {observation}.',
      ],
    },
  },
  {
    question: 'What is your relationship with the victim/target?',
    responseTemplates: {
      honest: [
        'We\'re colleagues. We work together on {shared_activity}.',
        'We\'ve known each other for {time_period}. {relationship_detail}.',
        'Honestly, we\'re not close, but we\'ve always been professional.',
      ],
      evasive: [
        'We know each other. Same as everyone else here.',
        'I wouldn\'t call it a relationship. We just... coexist.',
        'Why does that matter? Lots of people know each other.',
      ],
      defensive: [
        'We had our differences. So what? That doesn\'t mean anything!',
        'If you\'re asking if I had a grudge, the answer is no!',
        'Our past issues have nothing to do with this!',
      ],
      helpful: [
        'We\'re quite close actually. I can tell you about their habits...',
        'We work together often. Let me tell you what I know about their routine.',
        'We\'ve had a good relationship. I want to help figure this out.',
      ],
    },
  },
  {
    question: 'Can anyone verify your whereabouts?',
    responseTemplates: {
      honest: [
        'Yes, {witness} was with me. They can confirm.',
        'I signed in at {location}. There should be a record.',
        'I spoke with {witness} at {time}. They\'ll remember.',
      ],
      evasive: [
        'I... might have been alone. Or maybe someone saw me. I\'m not sure.',
        'There might be someone. I\'d have to think about it.',
        'Does it matter? Do I really need someone to vouch for me?',
      ],
      defensive: [
        'Why should I need an alibi? I\'m not the criminal here!',
        'So now I need witnesses? What kind of investigation is this?',
        'I don\'t keep track of who sees me every minute!',
      ],
      helpful: [
        'Absolutely. Talk to {witness}. And {second_witness} too if needed.',
        'I can give you a complete list of everyone I spoke with.',
        'Check the security footage—I\'ll be clearly visible at {location}.',
      ],
    },
  },
];

// ============================================
// EVIDENCE DISCOVERY TEMPLATES
// ============================================

export interface EvidenceDiscoveryTemplate {
  initial: string;
  examination: string;
  revelation: string;
}

export const EVIDENCE_DISCOVERY: Record<string, EvidenceDiscoveryTemplate[]> = {
  physical: [
    {
      initial: 'Something glinted in the corner of your eye. There, near {location}—{evidence_name}.',
      examination: 'You examined it carefully. {examination_detail}. This was definitely significant.',
      revelation: 'This {evidence_name} proved that {revelation}. A crucial piece of the puzzle.',
    },
    {
      initial: 'At first it seemed ordinary. But upon closer inspection, {evidence_name} revealed its secrets.',
      examination: '{examination_detail}. Your detective instincts had been right to look closer.',
      revelation: 'The implications were clear: {revelation}. The net was closing.',
    },
    {
      initial: 'Hidden in plain sight—{evidence_name}. How had everyone else missed it?',
      examination: 'The {evidence_name} showed clear signs of {examination_detail}.',
      revelation: 'Only one person could have left this here. {revelation}.',
    },
  ],

  digital: [
    {
      initial: 'The computer logs told a story. There—an entry from {time}.',
      examination: 'The timestamp was unmistakable. {examination_detail}.',
      revelation: 'Digital evidence doesn\'t lie. {revelation}.',
    },
    {
      initial: 'In the age of technology, everything leaves a trace. This time, it was {evidence_name}.',
      examination: 'The data showed {examination_detail}. Someone had tried to hide this, but failed.',
      revelation: 'The digital footprint was clear: {revelation}.',
    },
  ],

  document: [
    {
      initial: 'A piece of paper, crumpled and discarded. But important things are often thrown away.',
      examination: 'The document revealed {examination_detail}. Why had someone wanted to hide this?',
      revelation: 'Written proof that {revelation}. The case was building.',
    },
    {
      initial: 'Among the ordinary papers, one stood out. {evidence_name}.',
      examination: 'Reading carefully, you noticed {examination_detail}.',
      revelation: 'This document proved {revelation}. Another piece of the truth.',
    },
  ],

  testimony: [
    {
      initial: '"{quote}" The words hung in the air. Someone was lying.',
      examination: 'You compared this statement to the others. {examination_detail}.',
      revelation: 'The contradiction was clear: {revelation}. Someone hadn\'t told the truth.',
    },
    {
      initial: 'A witness came forward with information. What they revealed was surprising.',
      examination: 'According to their account, {examination_detail}.',
      revelation: 'This testimony contradicted the official story. {revelation}.',
    },
  ],
};

// ============================================
// REVELATION MOMENT TEMPLATES
// ============================================

export const REVELATION_TEMPLATES = {
  connection_made: [
    'Wait. If {fact_a}, and {fact_b}... then {conclusion}!',
    'The pieces clicked into place. {fact_a} plus {fact_b} could only mean one thing.',
    'Suddenly it all made sense. {fact_a}. {fact_b}. Therefore, {conclusion}.',
    'You\'d missed it before, but now you saw the connection. {conclusion}!',
  ],

  alibi_broken: [
    '{suspect}\'s alibi had a hole you could walk through. They claimed {claim}, but the evidence showed {truth}.',
    'The timeline didn\'t lie: {suspect} wasn\'t where they claimed to be. {truth}.',
    '{suspect} said {claim}. The {evidence} said otherwise. Someone was lying.',
    'A gap in {suspect}\'s story: {time_gap}. What were they really doing?',
  ],

  motive_revealed: [
    'So that was the reason. {suspect} had {motive}. Suddenly their behavior made sense.',
    'The motive was finally clear: {motive}. {suspect} had the most to gain.',
    'Hidden beneath the surface was {motive}. {suspect}\'s true reason for acting.',
    'It all came down to {motive}. The oldest reason in the book.',
  ],

  culprit_identified: [
    'The evidence was undeniable. {culprit} had the means, the motive, and the opportunity.',
    'All paths led to one person: {culprit}. The case was solved.',
    '{culprit}\'s carefully constructed story had fallen apart. They were the one.',
    'Justice would be served. {culprit} couldn\'t hide from the truth any longer.',
  ],
};

// ============================================
// PUZZLE NARRATIVE CONTEXT TEMPLATES
// ============================================

export const PUZZLE_CONTEXTS = {
  math: {
    introduction: [
      'The numbers tell a story. But first, you need to decode them.',
      'Mathematics never lies. Let\'s see what the calculations reveal.',
      'Time to put your math skills to work. The answer will unlock a clue.',
      'Numbers are the key to this mystery. Can you solve it?',
    ],
    success: [
      'Excellent work! The calculation reveals: {revelation}.',
      'Your math skills have uncovered the truth: {revelation}.',
      'The numbers add up—literally. {revelation}.',
      'Correct! The mathematics prove that {revelation}.',
    ],
    hint: [
      'Think about what the numbers represent. What are they measuring?',
      'Break the problem into smaller steps. What do you know for certain?',
      'Sometimes the simplest approach is the right one. What does the question really ask?',
    ],
  },

  logic: {
    introduction: [
      'This puzzle requires careful reasoning. What can you deduce?',
      'The facts are before you. Now apply logic to find the truth.',
      'Not everything is as it appears. Think critically about the evidence.',
      'A logical mind can see through any deception. Show us yours.',
    ],
    success: [
      'Brilliant deduction! You\'ve proven that {revelation}.',
      'Your logical reasoning is spot-on: {revelation}.',
      'Elementary, but effective. The conclusion is clear: {revelation}.',
      'Logic prevails! The answer reveals that {revelation}.',
    ],
    hint: [
      'Consider what must be true given the evidence. What\'s impossible?',
      'If A leads to B, and B leads to C, then A leads to...',
      'Sometimes it\'s easier to eliminate what can\'t be true.',
    ],
  },

  observation: {
    introduction: [
      'A detective must notice what others miss. What do you see?',
      'The answer is hiding in plain sight. Can you spot it?',
      'Sharp eyes are a detective\'s best tool. Look carefully.',
      'Something is out of place. What doesn\'t belong?',
    ],
    success: [
      'Eagle-eyed! You spotted {revelation}.',
      'Excellent observation! The detail you noticed proves {revelation}.',
      'Your keen eyes didn\'t miss it: {revelation}.',
      'Well spotted! That detail reveals {revelation}.',
    ],
    hint: [
      'Compare what you expect to see with what\'s actually there.',
      'Look at the edges and corners. Details often hide there.',
      'What would be different if everything was normal?',
    ],
  },

  deduction: {
    introduction: [
      'Use what you know to figure out what you don\'t. Deduce the truth.',
      'The clues are connected. Can you see how?',
      'Put the pieces together. What picture do they form?',
      'A true detective doesn\'t guess—they deduce. Show your skills.',
    ],
    success: [
      'Outstanding deduction! From the evidence, you proved {revelation}.',
      'You\'ve connected the dots masterfully: {revelation}.',
      'Your deductive reasoning is impressive. The truth is {revelation}.',
      'Case closed on this puzzle! The deduction shows {revelation}.',
    ],
    hint: [
      'What do all the clues have in common?',
      'Think about who benefits from each piece of evidence.',
      'Sometimes the missing piece is as important as what\'s present.',
    ],
  },
};

// ============================================
// CASE RESOLUTION TEMPLATES
// ============================================

export const RESOLUTION_TEMPLATES = {
  accusation: [
    'The evidence was overwhelming. It was time to confront {culprit}.',
    'All roads led to {culprit}. There was no escaping the truth now.',
    '{culprit} had made mistakes. Those mistakes had led you here.',
    'The case was solved. {culprit} was the one—and you could prove it.',
  ],

  confrontation: [
    '{culprit}\'s expression changed when you laid out the evidence. They knew it was over.',
    '"How did you figure it out?" {culprit} asked, shoulders slumping in defeat.',
    'There was no point in denial anymore. The evidence spoke for itself.',
    '{culprit} tried one last defense, but the facts were irrefutable.',
  ],

  explanation: [
    'Here\'s how it happened: {explanation}',
    'The sequence of events was clear: {explanation}',
    'Looking back, the clues had been there all along: {explanation}',
    '{culprit}\'s plan was clever, but not clever enough: {explanation}',
  ],

  moral: [
    'The truth always comes out in the end. Good detective work made sure of that.',
    'Justice was served. Honesty would always be the better path.',
    'Another case closed. But the best detectives know that truth matters.',
    'The mystery was solved. Your skills had made the difference.',
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function fillTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

export function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSceneAtmosphere(
  sceneType: 'crime_scene' | 'security_office' | 'suspect_workspace' | 'aftermath',
  values: Record<string, string>
): AtmosphereTemplate {
  const templates = SCENE_ATMOSPHERES[sceneType] || SCENE_ATMOSPHERES.crime_scene;
  const template = selectRandom(templates);

  return {
    visual: fillTemplate(template.visual, values),
    sensory: fillTemplate(template.sensory, values),
    emotional: template.emotional,
    investigationHint: template.investigationHint,
  };
}

export function generateSuspectIntro(
  name: string,
  isGuilty: boolean,
  demeanor: 'nervous' | 'confident' | 'neutral',
  crime: string
): string {
  let templates: string[];

  if (isGuilty) {
    templates = SUSPECT_INTRODUCTIONS.guilty;
  } else if (demeanor === 'nervous') {
    templates = SUSPECT_INTRODUCTIONS.nervous;
  } else if (demeanor === 'confident') {
    templates = SUSPECT_INTRODUCTIONS.confident;
  } else {
    templates = SUSPECT_INTRODUCTIONS.innocent;
  }

  return fillTemplate(selectRandom(templates), { name, crime });
}

export function generateRevelation(
  type: 'connection_made' | 'alibi_broken' | 'motive_revealed' | 'culprit_identified',
  values: Record<string, string>
): string {
  const templates = REVELATION_TEMPLATES[type];
  return fillTemplate(selectRandom(templates), values);
}

export function generatePuzzleContext(
  puzzleType: 'math' | 'logic' | 'observation' | 'deduction',
  contextType: 'introduction' | 'success' | 'hint',
  values: Record<string, string> = {}
): string {
  const contexts = PUZZLE_CONTEXTS[puzzleType];
  const templates = contexts[contextType];
  return fillTemplate(selectRandom(templates), values);
}

export function generateResolutionNarrative(
  culprit: string,
  explanation: string
): string {
  const accusation = fillTemplate(selectRandom(RESOLUTION_TEMPLATES.accusation), { culprit });
  const confrontation = fillTemplate(selectRandom(RESOLUTION_TEMPLATES.confrontation), { culprit });
  const explain = fillTemplate(selectRandom(RESOLUTION_TEMPLATES.explanation), { explanation, culprit });
  const moral = selectRandom(RESOLUTION_TEMPLATES.moral);

  return `${accusation}\n\n${confrontation}\n\n${explain}\n\n${moral}`;
}

// ============================================
// BRIEFING GENERATION
// ============================================

export function generateCaseBriefing(blueprint: CrimeBlueprint): string {
  const parts = [
    blueprint.opening,
    '',
    blueprint.narrative.tension,
    '',
    `Your mission: Examine the evidence, interview the suspects, and uncover the truth.`,
    '',
    blueprint.narrative.twist,
  ];

  return parts.join('\n');
}
