/**
 * CHARACTER WEB SYSTEM
 *
 * Generates interconnected suspects with:
 * - Relationships between each other
 * - Consistent backstories tied to the crime
 * - Rich dialogue trees with hidden information
 * - Alibis that can be verified or contradicted
 */

import { nanoid } from 'nanoid';
import { NarrativeCase, CulpritProfile, TimelineEvent } from './narrative-engine';

// ============================================
// TYPES
// ============================================

export interface CharacterRelationship {
  targetId: string;
  targetName: string;
  type: 'friendly' | 'neutral' | 'tense' | 'hostile' | 'professional' | 'family';
  description: string;
  knownToPlayer: boolean;  // Is this relationship obvious?
  relevantToCase: boolean; // Does this relationship matter for the case?
}

export interface DialogueNode {
  id: string;
  question: string;
  answer: string;
  emotion: 'calm' | 'nervous' | 'defensive' | 'helpful' | 'evasive' | 'angry';
  revealsInfo?: string;      // What key info does this reveal?
  contradictsId?: string;    // Does this contradict another suspect's statement?
  unlocksNodeId?: string;    // Unlocks a follow-up question
  requiresEvidence?: string; // Need specific evidence to ask this
}

export interface CharacterBackground {
  occupation: string;
  yearsAtLocation: number;
  personality: string[];
  reputation: string;
  secretOrWeakness?: string; // Something hidden that might be relevant
}

export interface SuspectCharacter {
  id: string;
  name: string;
  role: string;
  background: CharacterBackground;
  relationships: CharacterRelationship[];
  alibi: {
    claimed: string;
    truthful: boolean;
    verificationMethod?: string;  // How to verify if true
    contradictionEvidence?: string; // What proves it false
  };
  dialogue: DialogueNode[];
  isGuilty: boolean;
  suspicionLevel: 'low' | 'medium' | 'high'; // How suspicious they appear
  imagePromptDetails: string; // For image generation
}

// ============================================
// NAME POOLS (Singapore context - expanded)
// ============================================

const NAME_POOLS = {
  chinese: {
    male: ['Li Wei', 'Chen Jun', 'Wong Ming', 'Tan Ah Kow', 'Lee Hock', 'Lim Boon', 'Ng Chee', 'Ong Wei', 'Koh Seng', 'Teo Huat'],
    female: ['Zhang Mei', 'Wong Fang', 'Tan Hui Ling', 'Lee Mei Xin', 'Lim Ai Hua', 'Ng Siew Lan', 'Ong Bee Hoon', 'Koh Mei Fen', 'Teo Li Ping', 'Chen Xiu Ying'],
  },
  malay: {
    male: ['Ahmad bin Hassan', 'Farid Abdullah', 'Ismail bin Omar', 'Rashid bin Ali', 'Kamal bin Yusof', 'Hafiz bin Rahman'],
    female: ['Siti Nurhaliza', 'Aminah binti Osman', 'Fatimah binti Ahmad', 'Zainab binti Ismail', 'Noraini binti Hassan', 'Aishah binti Yusof'],
  },
  indian: {
    male: ['Rajesh Kumar', 'Suresh Menon', 'Vikram Pillai', 'Arjun Krishnan', 'Ravi Chandran', 'Deepak Nair'],
    female: ['Priya Devi', 'Lakshmi Nair', 'Anita Sharma', 'Kavitha Rani', 'Meera Pillai', 'Sunitha Kumar'],
  },
  eurasian: {
    male: ['David Pereira', 'Michael Santos', 'James Oliveiro', 'John Rodrigues', 'Peter Monteiro'],
    female: ['Sarah Pereira', 'Emma Santos', 'Rachel Oliveiro', 'Jessica Rodrigues', 'Amanda Monteiro'],
  },
};

// ============================================
// PERSONALITY TRAITS
// ============================================

const PERSONALITY_POOLS = {
  positive: ['helpful', 'organized', 'friendly', 'diligent', 'honest', 'calm', 'professional', 'reliable'],
  negative: ['nervous', 'secretive', 'impatient', 'disorganized', 'defensive', 'evasive', 'short-tempered'],
  neutral: ['quiet', 'observant', 'serious', 'traditional', 'methodical', 'reserved', 'pragmatic'],
};

const REPUTATION_POOLS = {
  good: [
    'Known for being reliable and hardworking',
    'Well-liked by colleagues and customers',
    'Has an excellent track record',
    'Respected for their expertise',
  ],
  mixed: [
    'Generally okay, but has had some conflicts',
    'Competent but keeps to themselves',
    'New to the job, still proving themselves',
    'Has both supporters and critics',
  ],
  concerning: [
    'Has been involved in past disputes',
    'Known for cutting corners',
    'Recently received warnings about performance',
    'Colleagues find them difficult to work with',
  ],
};

// ============================================
// GENERATION FUNCTIONS
// ============================================

/**
 * Generate a random name based on ethnicity
 */
function generateName(gender: 'male' | 'female' = 'male'): { name: string; ethnicity: string } {
  const ethnicities = Object.keys(NAME_POOLS) as (keyof typeof NAME_POOLS)[];
  const ethnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];
  const names = NAME_POOLS[ethnicity][gender];
  const name = names[Math.floor(Math.random() * names.length)];
  return { name, ethnicity };
}

/**
 * Generate personality traits
 */
function generatePersonality(isGuilty: boolean): string[] {
  const traits: string[] = [];

  if (isGuilty) {
    // Guilty characters have more negative/neutral traits
    traits.push(PERSONALITY_POOLS.negative[Math.floor(Math.random() * PERSONALITY_POOLS.negative.length)]);
    traits.push(PERSONALITY_POOLS.neutral[Math.floor(Math.random() * PERSONALITY_POOLS.neutral.length)]);
  } else {
    // Innocent characters have more positive/neutral traits
    traits.push(PERSONALITY_POOLS.positive[Math.floor(Math.random() * PERSONALITY_POOLS.positive.length)]);
    traits.push(PERSONALITY_POOLS.neutral[Math.floor(Math.random() * PERSONALITY_POOLS.neutral.length)]);
  }

  return traits;
}

/**
 * Generate dialogue tree for a suspect
 */
function generateDialogue(
  character: Partial<SuspectCharacter>,
  narrativeCase: NarrativeCase,
  isGuilty: boolean,
  otherSuspects: Partial<SuspectCharacter>[]
): DialogueNode[] {
  const nodes: DialogueNode[] = [];
  const role = character.role || 'Unknown';
  const name = character.name || 'Unknown';

  // 1. Introduction
  nodes.push({
    id: 'intro',
    question: 'Can you tell me about yourself?',
    answer: `I'm ${name}, the ${role} here. ${character.background?.reputation || 'I do my job well.'}`,
    emotion: 'calm',
    unlocksNodeId: 'role-details',
  });

  // 2. Role details
  nodes.push({
    id: 'role-details',
    question: `What exactly do you do as ${role}?`,
    answer: generateRoleDescription(role, character.background?.yearsAtLocation || 1),
    emotion: 'professional',
    revealsInfo: `${role}'s responsibilities and access`,
  });

  // 3. Alibi question
  nodes.push({
    id: 'alibi',
    question: `Where were you during the time of the incident (${narrativeCase.crime.crimeWindow.start} - ${narrativeCase.crime.crimeWindow.end})?`,
    answer: character.alibi?.claimed || 'I was here, doing my usual work.',
    emotion: isGuilty ? 'nervous' : 'calm',
    revealsInfo: isGuilty ? 'Alibi seems rehearsed' : 'Alibi sounds natural',
    unlocksNodeId: 'alibi-verify',
  });

  // 4. Alibi verification
  nodes.push({
    id: 'alibi-verify',
    question: 'Can anyone confirm where you were?',
    answer: isGuilty
      ? 'I... I was alone most of the time. But I definitely wasn\'t near there!'
      : `Yes, ${generateWitness()} can confirm. You can ask them.`,
    emotion: isGuilty ? 'defensive' : 'helpful',
    revealsInfo: isGuilty ? 'No solid alibi witness' : 'Has alibi witnesses',
  });

  // 5. About other suspects
  otherSuspects.forEach((other, index) => {
    if (other.name && other.name !== name) {
      const relationship = generateRelationshipDescription(role, other.role || 'colleague');
      nodes.push({
        id: `about-${index}`,
        question: `What can you tell me about ${other.name}?`,
        answer: relationship.description,
        emotion: relationship.emotion,
        revealsInfo: `Relationship with ${other.name}`,
      });
    }
  });

  // 6. Suspicious observation (everyone notices something)
  nodes.push({
    id: 'observation',
    question: 'Did you notice anything unusual that day?',
    answer: isGuilty
      ? 'No, nothing at all. It was a completely normal day until the discovery.'
      : generateObservation(narrativeCase, otherSuspects),
    emotion: isGuilty ? 'evasive' : 'helpful',
    revealsInfo: isGuilty ? 'Claims to have seen nothing' : 'Provides useful observation',
  });

  // 7. Confrontation (requires evidence)
  if (isGuilty) {
    nodes.push({
      id: 'confrontation',
      question: 'Evidence shows you were at the scene. Explain this.',
      answer: 'I... okay, I was there, but only for a moment! I didn\'t do anything wrong!',
      emotion: 'nervous',
      requiresEvidence: 'scene_access_proof',
      revealsInfo: 'Admits to being at scene',
    });
  }

  // 8. Final question
  nodes.push({
    id: 'final',
    question: 'Is there anything else you want to tell me?',
    answer: isGuilty
      ? 'No. I\'ve told you everything. I really have to get back to work now.'
      : 'I hope you find who did this. It\'s affected everyone here.',
    emotion: isGuilty ? 'evasive' : 'calm',
  });

  return nodes;
}

/**
 * Generate role-specific description
 */
function generateRoleDescription(role: string, years: number): string {
  const roleDescriptions: Record<string, string[]> = {
    'Canteen Manager': [
      `I manage the entire canteen operation. Been here ${years} years.`,
      `I oversee the staff, handle inventory, and manage the finances.`,
    ],
    'Cashier': [
      `I handle all the payments at the counter.`,
      `Every transaction goes through me. Been doing this for ${years} years.`,
    ],
    'Lab Assistant': [
      `I help prepare experiments and maintain lab equipment.`,
      `I have keys to the storage cabinets and help students with their projects.`,
    ],
    'Science Teacher': [
      `I teach P5 and P6 Science classes. Been at this school ${years} years.`,
      `I supervise the lab and oversee student projects.`,
    ],
    'Librarian': [
      `I manage the library collections and help patrons find resources.`,
      `I have access to all areas including the special collection room.`,
    ],
    'Security Guard': [
      `I patrol the premises and monitor the security cameras.`,
      `I keep logs of who enters and exits, especially after hours.`,
    ],
  };

  const descriptions = roleDescriptions[role] || [
    `I've been working here for ${years} years.`,
    `My job involves various responsibilities in this area.`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Generate a relationship description
 */
function generateRelationshipDescription(
  role1: string,
  role2: string
): { description: string; emotion: DialogueNode['emotion'] } {
  const relationships = [
    { description: `We work together sometimes. They seem alright.`, emotion: 'calm' as const },
    { description: `We don't interact much. They keep to themselves.`, emotion: 'neutral' as const },
    { description: `Honestly? We've had some disagreements in the past.`, emotion: 'defensive' as const },
    { description: `They're good at their job. I respect that.`, emotion: 'professional' as const },
    { description: `We're quite friendly. Sometimes have lunch together.`, emotion: 'helpful' as const },
  ];

  return relationships[Math.floor(Math.random() * relationships.length)];
}

/**
 * Generate a witness name
 */
function generateWitness(): string {
  const witnesses = [
    'the security guard',
    'my colleague',
    'the cleaner who was nearby',
    'a student who walked past',
    'the person at the next counter',
  ];
  return witnesses[Math.floor(Math.random() * witnesses.length)];
}

/**
 * Generate an observation about the incident
 */
function generateObservation(narrativeCase: NarrativeCase, suspects: Partial<SuspectCharacter>[]): string {
  const observations = [
    `I thought I saw someone near the ${narrativeCase.setting.location.split(' ')[0]} area around ${narrativeCase.crime.crimeWindow.start}.`,
    `There was some unusual activity earlier, but I didn't think much of it at the time.`,
    `I remember hearing a door close when it shouldn't have been used.`,
    `Someone was acting nervously before the incident was discovered.`,
    `I noticed ${suspects[0]?.name || 'someone'} was in a hurry earlier that day.`,
  ];

  return observations[Math.floor(Math.random() * observations.length)];
}

/**
 * Generate character relationships based on narrative context
 */
function generateRelationships(
  character: Partial<SuspectCharacter>,
  allCharacters: Partial<SuspectCharacter>[],
  isGuilty: boolean
): CharacterRelationship[] {
  const relationships: CharacterRelationship[] = [];

  allCharacters.forEach(other => {
    if (other.id === character.id) return;

    const types: CharacterRelationship['type'][] = ['friendly', 'neutral', 'tense', 'professional'];
    const type = types[Math.floor(Math.random() * types.length)];

    const descriptions: Record<typeof type, string[]> = {
      friendly: ['They often chat during breaks', 'Known to help each other out', 'Seem to get along well'],
      neutral: ['Not much interaction', 'Professional acquaintances', 'Keep to themselves mostly'],
      tense: ['Have had disagreements before', 'Some underlying friction', 'Avoid each other when possible'],
      professional: ['Work together when needed', 'Strictly business relationship', 'Respect each other\'s work'],
      hostile: ['Open conflict', 'Known to argue', 'Avoid each other'],
      family: ['Related', 'Family connection', 'Close personal ties'],
    };

    relationships.push({
      targetId: other.id || '',
      targetName: other.name || '',
      type,
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      knownToPlayer: type !== 'neutral',
      relevantToCase: isGuilty && type === 'tense',
    });
  });

  return relationships;
}

// ============================================
// MAIN EXPORT: Generate Character Web
// ============================================

/**
 * Main function: Generate complete character web for a case
 */
export function generateCharacterWeb(
  narrativeCase: NarrativeCase,
  suspectRoles: { role: string; defaultAlibi: string; clearingEvidence?: string; suspiciousBehavior?: string }[]
): SuspectCharacter[] {
  const characters: Partial<SuspectCharacter>[] = [];
  const usedNames: string[] = [];

  // First pass: Create basic character info
  suspectRoles.forEach((roleInfo, index) => {
    const isGuilty = index === narrativeCase.culprit.suspectIndex;
    let nameInfo = generateName(Math.random() > 0.5 ? 'male' : 'female');

    // Ensure unique names
    while (usedNames.includes(nameInfo.name)) {
      nameInfo = generateName(Math.random() > 0.5 ? 'male' : 'female');
    }
    usedNames.push(nameInfo.name);

    const personality = generatePersonality(isGuilty);
    const yearsAtLocation = Math.floor(Math.random() * 10) + 1;

    characters.push({
      id: `suspect-${nanoid(6)}`,
      name: nameInfo.name,
      role: roleInfo.role,
      background: {
        occupation: roleInfo.role,
        yearsAtLocation,
        personality,
        reputation: isGuilty
          ? REPUTATION_POOLS.concerning[Math.floor(Math.random() * REPUTATION_POOLS.concerning.length)]
          : REPUTATION_POOLS.good[Math.floor(Math.random() * REPUTATION_POOLS.good.length)],
        secretOrWeakness: isGuilty ? narrativeCase.culprit.motive.backstory : undefined,
      },
      alibi: {
        claimed: roleInfo.defaultAlibi,
        truthful: !isGuilty,
        verificationMethod: !isGuilty ? roleInfo.clearingEvidence : undefined,
        contradictionEvidence: isGuilty ? roleInfo.suspiciousBehavior : undefined,
      },
      isGuilty,
      suspicionLevel: isGuilty ? 'high' : (roleInfo.suspiciousBehavior ? 'medium' : 'low'),
      imagePromptDetails: `${nameInfo.ethnicity} ${roleInfo.role}, ${personality.join(', ')} expression`,
    });
  });

  // Second pass: Add relationships and dialogue
  const completeCharacters: SuspectCharacter[] = characters.map((char, index) => {
    const otherChars = characters.filter(c => c.id !== char.id);

    return {
      ...char,
      relationships: generateRelationships(char, characters, char.isGuilty || false),
      dialogue: generateDialogue(char, narrativeCase, char.isGuilty || false, otherChars),
    } as SuspectCharacter;
  });

  return completeCharacters;
}

/**
 * Get dialogue for a specific topic
 */
export function getDialogueForTopic(
  character: SuspectCharacter,
  topic: 'intro' | 'alibi' | 'observation' | 'confrontation'
): DialogueNode | undefined {
  return character.dialogue.find(d => d.id === topic);
}

/**
 * Check if character's alibi can be verified
 */
export function canVerifyAlibi(character: SuspectCharacter): boolean {
  return character.alibi.truthful && !!character.alibi.verificationMethod;
}

/**
 * Get character by ID
 */
export function getCharacterById(
  characters: SuspectCharacter[],
  id: string
): SuspectCharacter | undefined {
  return characters.find(c => c.id === id);
}

/**
 * Get guilty character
 */
export function getGuiltyCharacter(characters: SuspectCharacter[]): SuspectCharacter | undefined {
  return characters.find(c => c.isGuilty);
}
