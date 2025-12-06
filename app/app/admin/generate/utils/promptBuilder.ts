/**
 * Prompt building utilities for image generation
 */

import { parsePersonInfo, inferEthnicity } from './personParser';
import type { GeneratedCase } from './types';

/**
 * Get occupation-specific clothing based on role
 */
export function getOccupationClothing(roleKeywords: string): string {
  if (/teacher|educator|professor|lecturer|tutor/i.test(roleKeywords)) {
    return 'teacher wearing professional work attire, formal shirt, neat appearance';
  } else if (/doctor|physician|surgeon/i.test(roleKeywords)) {
    return 'doctor wearing white coat, stethoscope around neck, professional medical attire';
  } else if (/nurse|healthcare|medical staff/i.test(roleKeywords)) {
    return 'nurse wearing medical scrubs, professional healthcare uniform';
  } else if (/engineer|technician|it|programmer|developer/i.test(roleKeywords)) {
    return 'engineer wearing smart casual office attire, polo shirt';
  } else if (/chef|cook|kitchen/i.test(roleKeywords)) {
    return 'chef wearing white double-breasted chef jacket, chef hat, professional kitchen attire';
  } else if (/police|cop|detective|inspector/i.test(roleKeywords)) {
    return 'police officer wearing Singapore Police Force uniform, professional law enforcement attire';
  } else if (/security|guard/i.test(roleKeywords)) {
    return 'security guard wearing security uniform, professional security attire';
  } else if (/student|pupil|school/i.test(roleKeywords)) {
    return 'student wearing neat school uniform, white shirt, tie';
  } else if (/ceo|director|chairman|president/i.test(roleKeywords)) {
    return 'executive wearing expensive formal suit and tie, luxury business attire';
  } else if (/manager|supervisor|executive|business/i.test(roleKeywords)) {
    return 'business professional wearing formal suit and tie, professional office attire';
  } else if (/lawyer|attorney|advocate/i.test(roleKeywords)) {
    return 'lawyer wearing formal black suit, professional legal attire';
  } else if (/accountant|banker|finance/i.test(roleKeywords)) {
    return 'finance professional wearing formal business suit, office attire';
  } else if (/scientist|researcher|lab/i.test(roleKeywords)) {
    return 'scientist wearing white lab coat, safety glasses, professional research attire';
  } else if (/pilot|captain|aviator/i.test(roleKeywords)) {
    return 'pilot wearing airline uniform with captain stripes, professional pilot attire';
  } else if (/flight attendant|cabin crew|steward/i.test(roleKeywords)) {
    return 'cabin crew wearing airline uniform, professional flight attendant attire';
  } else if (/construction|builder|contractor/i.test(roleKeywords)) {
    return 'construction worker wearing safety vest, hard hat, work boots';
  } else if (/worker|labor|factory/i.test(roleKeywords)) {
    return 'worker wearing work clothes, safety vest, practical work attire';
  } else if (/shopkeeper|vendor|seller|merchant|retail/i.test(roleKeywords)) {
    return 'shopkeeper wearing casual work clothes, store apron';
  } else if (/cleaner|janitor|maintenance/i.test(roleKeywords)) {
    return 'cleaner wearing work uniform, practical cleaning attire';
  } else if (/taxi|grab|driver|delivery/i.test(roleKeywords)) {
    return 'driver wearing casual work shirt, comfortable driving attire';
  } else if (/waiter|waitress|server|f&b/i.test(roleKeywords)) {
    return 'waiter wearing restaurant uniform, bow tie, server apron';
  } else if (/barista|coffee|cafe/i.test(roleKeywords)) {
    return 'barista wearing cafe apron, casual work attire';
  } else if (/hawker|food stall|kopitiam/i.test(roleKeywords)) {
    return 'hawker wearing casual clothes, cooking apron, practical food vendor attire';
  } else if (/artist|designer|creative/i.test(roleKeywords)) {
    return 'creative professional wearing trendy casual clothes, artistic attire';
  } else if (/journalist|reporter|media/i.test(roleKeywords)) {
    return 'journalist wearing smart casual office wear, press attire';
  } else if (/athlete|sportsman|coach/i.test(roleKeywords)) {
    return 'athlete wearing sports attire, athletic wear, tracksuit';
  } else if (/farmer|gardener|agriculture/i.test(roleKeywords)) {
    return 'farmer wearing practical outdoor clothes, sun hat, gardening attire';
  } else if (/fisherman|sailor/i.test(roleKeywords)) {
    return 'fisherman wearing practical waterproof clothes, fishing attire';
  } else if (/military|army|soldier|saf/i.test(roleKeywords)) {
    return 'soldier wearing Singapore Armed Forces uniform, military attire';
  } else if (/firefighter|scdf/i.test(roleKeywords)) {
    return 'firefighter wearing fire service uniform, SCDF attire';
  } else if (/paramedic|ambulance|emergency/i.test(roleKeywords)) {
    return 'paramedic wearing emergency medical uniform, ambulance crew attire';
  } else if (/librarian|archivist/i.test(roleKeywords)) {
    return 'librarian wearing smart casual professional attire, glasses';
  } else if (/receptionist|admin|secretary/i.test(roleKeywords)) {
    return 'office staff wearing smart casual office attire, professional appearance';
  } else if (/electrician|plumber|mechanic/i.test(roleKeywords)) {
    return 'tradesman wearing work clothes, tool belt, practical work attire';
  } else if (/postman|mailman|singpost/i.test(roleKeywords)) {
    return 'postman wearing postal uniform, SingPost delivery attire';
  } else if (/housewife|homemaker|stay-at-home/i.test(roleKeywords)) {
    return 'wearing comfortable casual home clothes, neat appearance';
  } else if (/retiree|retired|pensioner/i.test(roleKeywords)) {
    return 'wearing comfortable casual clothes, relaxed neat attire';
  }
  return 'professional business attire';
}

/**
 * Build suspect portrait prompt
 */
export function buildSuspectPrompt(suspect: { name: string; role: string; isGuilty: boolean }): {
  prompt: string;
  negativePrompt: string;
  metadata: { gender: string; age: string };
} {
  const ethnicityInfo = inferEthnicity(suspect.name);
  const personInfo = parsePersonInfo(suspect.name, suspect.role);
  const expression = suspect.isGuilty ? 'slightly nervous expression' : 'calm confident expression';

  // DEBUG: Log name parsing results
  console.log(`[PROMPT_BUILDER] Building prompt for: ${suspect.name}`);
  console.log(`[PROMPT_BUILDER] Detected gender: ${personInfo.gender}, age: ${personInfo.age}`);

  // For Realistic Vision V6.0 - use natural language prompts
  const occupationClothing = getOccupationClothing(suspect.role.toLowerCase());

  // Determine gender-specific descriptors for Realistic Vision
  const isMale = personInfo.gender === 'man' || personInfo.gender === 'boy' ||
                 personInfo.gender === 'teenage boy' || personInfo.gender === 'elderly man';
  const genderWord = isMale ? 'man' : 'woman';
  const genderAdjective = isMale ? 'male' : 'female';

  // Build natural language prompt for Realistic Vision
  const promptParts = [
    // 1. GENDER with emphasis - CRITICAL for correct generation
    `a ${genderWord}`,
    `${genderAdjective} person`,
    `${genderAdjective}`,
    // 2. AGE description
    personInfo.ageDescriptor,
    // 3. ETHNICITY
    `${ethnicityInfo.race} ethnicity`,
    ethnicityInfo.ethnicity,
    ethnicityInfo.skinTone,
    // 4. OCCUPATION and clothing
    suspect.role,
    occupationClothing,
    // 5. Expression
    expression,
  ];

  // Add religious attire if applicable
  if (personInfo.religiousAttire) {
    promptParts.push(personInfo.religiousAttire);
  }

  // Add photography style and quality tags for Realistic Vision
  promptParts.push(
    'RAW photo', 'professional portrait photograph',
    'corporate ID photo', 'passport photo style',
    'front facing', 'looking at camera',
    'soft natural lighting', 'plain background',
    'high quality', '8k uhd', 'dslr', 'sharp focus',
    'professional photography', 'natural skin texture'
  );

  // Negative prompt for Realistic Vision - emphasize OPPOSITE gender strongly
  const oppositeGender = isMale
    ? 'woman, women, female, girl, feminine, breasts, long hair, feminine features'
    : 'man, men, male, boy, masculine, beard, mustache, masculine features';

  const negativePrompt = [
    // OPPOSITE GENDER with high weight - most important
    `(${oppositeGender}:1.5)`,
    // Quality issues
    '(deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy',
    'extra limbs, missing limbs, floating limbs, mutated hands, extra fingers',
    // Inappropriate content
    'nsfw, nude, naked, revealing, suggestive',
    // Style issues
    'anime, cartoon, illustration, 3d render, cgi',
    // Other issues
    'blurry, low quality, watermark, text, signature',
    'multiple people, crowd, group',
  ].join(', ');

  return {
    prompt: promptParts.join(', '),
    negativePrompt,
    metadata: { gender: personInfo.gender, age: personInfo.age }
  };
}

/**
 * Build cover image prompt - Realistic Vision V6.0 format
 */
export function buildCoverPrompt(caseData: GeneratedCase, subject: string): string {
  const storyKeywords = caseData.story.setting.split(' ').slice(0, 10).join(' ');
  const subjectElements = subject === 'MATH' ? 'mathematical equations written on paper' :
                          subject === 'SCIENCE' ? 'scientific equipment and lab notes' : 'math and science elements';

  // Realistic Vision V6.0 - natural language prompts with quality tags
  return `RAW photo, manila case folder file, detective case file, classified document, ${storyKeywords}, ${subjectElements}, mysterious noir atmosphere, dramatic lighting, vintage paper texture, high quality, 8k uhd, dslr, sharp focus, professional photography, photorealistic`;
}

/**
 * Build scene image prompt - Realistic Vision V6.0 format
 */
export function buildScenePrompt(scene: { description: string; locationType?: string }): string {
  // Realistic Vision V6.0 - natural language prompts with quality tags
  return `RAW photo, ${scene.description}, ${scene.locationType || 'indoor location'}, Singapore setting, crime scene investigation area, evidence markers visible, forensic lighting, photorealistic, detailed environment, high quality, 8k uhd, dslr, sharp focus, professional photography, architectural photography`;
}

/**
 * Evidence type visual descriptions for different categories
 */
const EVIDENCE_TYPE_VISUALS: Record<string, {
  style: string;
  lighting: string;
  composition: string;
  details: string;
}> = {
  physical: {
    style: 'forensic evidence photograph, police evidence documentation',
    lighting: 'clinical forensic lighting, bright even illumination',
    composition: 'close-up macro shot, evidence marker with number visible, measuring ruler for scale',
    details: 'detailed surface textures, visible fingerprint dust, evidence collection setting',
  },
  document: {
    style: 'document photography, paper evidence documentation',
    lighting: 'soft diffused lighting to avoid glare, even paper illumination',
    composition: 'flat lay top-down view, full document visible, evidence tag nearby',
    details: 'readable text visible, paper texture, creases and folds shown, dated timestamp',
  },
  digital: {
    style: 'screen capture photograph, digital forensics documentation',
    lighting: 'screen glow visible, ambient office lighting',
    composition: 'device screen clearly visible, timestamp overlay, forensic software interface',
    details: 'clear readable display, evidence of digital analysis, metadata visible',
  },
  testimony: {
    style: 'interview documentation, witness statement setting',
    lighting: 'soft indoor lighting, professional office setting',
    composition: 'document or notepad visible, pen nearby, official letterhead',
    details: 'handwritten or typed notes, signature area, official stamp',
  },
};

/**
 * Keyword detection for specific evidence items
 */
function detectEvidenceKeywords(description: string, title: string): string {
  const text = `${description} ${title}`.toLowerCase();

  // Physical evidence keywords
  if (/fingerprint|print|finger/i.test(text)) {
    return 'fingerprint on surface, forensic powder dusted, ridge patterns visible, lifted print';
  }
  if (/footprint|shoe|track|step/i.test(text)) {
    return 'shoe impression in dust or dirt, tread pattern visible, measuring tape alongside';
  }
  if (/key|lock/i.test(text)) {
    return 'metal key on evidence bag, detailed engravings, brass or steel finish';
  }
  if (/fabric|cloth|fiber|thread/i.test(text)) {
    return 'fabric fibers under magnification, tweezers holding sample, microscopic detail';
  }
  if (/hair|strand/i.test(text)) {
    return 'hair strands in clear evidence bag, labeled specimen, microscopic quality';
  }
  if (/glass|broken|shatter/i.test(text)) {
    return 'broken glass fragments, sharp edges visible, scattered pattern';
  }
  if (/blood|stain|spot/i.test(text)) {
    return 'dark stain on surface, swab nearby, evidence marker, forensic collection';
  }
  if (/weapon|knife|tool/i.test(text)) {
    return 'object in evidence bag, case number label, protective packaging';
  }

  // Document evidence keywords
  if (/receipt|bill|invoice/i.test(text)) {
    return 'crumpled paper receipt, printed text visible, date and amount shown, thermal paper';
  }
  if (/note|letter|message|writing/i.test(text)) {
    return 'handwritten note on paper, pen strokes visible, paper texture, personal handwriting';
  }
  if (/schedule|calendar|appointment|time/i.test(text)) {
    return 'printed schedule or planner, highlighted entries, dates and times marked';
  }
  if (/map|diagram|plan|layout/i.test(text)) {
    return 'hand-drawn or printed map, marked locations, circled areas, annotations';
  }
  if (/photo|picture|image/i.test(text)) {
    return 'printed photograph as evidence, showing location or scene, glossy paper';
  }
  if (/id|card|badge|pass/i.test(text)) {
    return 'identification card, official format, photo visible, some details obscured';
  }
  if (/ticket|stub|pass/i.test(text)) {
    return 'ticket stub or entry pass, date and venue visible, torn perforation';
  }

  // Digital evidence keywords
  if (/cctv|camera|footage|video|surveillance/i.test(text)) {
    return 'CCTV still frame, timestamp overlay, grainy surveillance quality, security camera view';
  }
  if (/phone|mobile|text|message|call/i.test(text)) {
    return 'smartphone screen showing messages or call log, notification visible';
  }
  if (/email|inbox|sent/i.test(text)) {
    return 'email screenshot printed out, highlighted passages, sender and timestamp visible';
  }
  if (/computer|laptop|screen|browser|file/i.test(text)) {
    return 'computer monitor showing files or data, forensic analysis software visible';
  }
  if (/social|post|account|profile/i.test(text)) {
    return 'social media screenshot, profile visible, post timestamp shown';
  }
  if (/gps|location|tracking|route/i.test(text)) {
    return 'GPS map printout, route highlighted, location pins marked, coordinates visible';
  }
  if (/log|record|data|entry/i.test(text)) {
    return 'printed data log, entries highlighted, timestamps and values visible';
  }

  // Default - use the description directly
  return '';
}

/**
 * Build clue/evidence image prompt - Realistic Vision V6.0 format
 * Enhanced for story-accurate, detailed evidence images
 */
export function buildCluePrompt(clue: {
  title: string;
  description: string;
  type: string;
  relevance: string;
  /** Visual description from evidence templates - prioritized for image generation */
  visualCue?: string;
  analysisResult?: string;
}): string {
  // Get type-specific visual settings
  const typeVisuals = EVIDENCE_TYPE_VISUALS[clue.type] || EVIDENCE_TYPE_VISUALS.physical;

  // PRIORITIZE visualCue if available - it's specifically designed for images
  // Examples: "Visible fingerprint ridges on clear glass", "Metal screwdriver on floor"
  const primaryVisual = clue.visualCue || clue.description;

  // Detect specific evidence keywords for more detailed prompts
  const keywordDetails = detectEvidenceKeywords(primaryVisual, clue.title);

  // Relevance affects visual prominence
  const relevanceStyle = clue.relevance === 'critical'
    ? 'key evidence, prominently displayed, clear focus, important clue'
    : clue.relevance === 'red-herring'
    ? 'suspicious looking, appears significant, misleading evidence'
    : 'supporting evidence, documented carefully';

  // Build comprehensive prompt - visualCue FIRST for strongest influence
  const promptParts = [
    // Core quality tags for Realistic Vision
    'RAW photo',
    'professional forensic evidence photography',
    // VISUAL CUE FIRST - most important for image accuracy
    primaryVisual,
    // Evidence title for context
    clue.title,
    // Detected specific details (from keyword matching)
    keywordDetails,
    // Type-specific styling
    typeVisuals.style,
    typeVisuals.lighting,
    typeVisuals.composition,
    typeVisuals.details,
    // Relevance styling
    relevanceStyle,
    // Quality tags
    'photorealistic', 'highly detailed textures', 'sharp focus',
    'high quality', '8k uhd', 'dslr', 'macro photography',
    'evidence documentation', 'Singapore Police Force standards',
  ].filter(Boolean);

  return promptParts.join(', ');
}
