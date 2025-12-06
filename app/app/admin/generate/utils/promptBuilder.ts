/**
 * Prompt building utilities for image generation
 *
 * ENHANCED FOR MAXIMUM ACCURACY with Realistic Vision V6.0 and similar models
 * - More specific visual descriptors
 * - Better camera angles and composition
 * - Improved lighting descriptions
 * - Singapore-accurate details
 */

import { parsePersonInfo, inferEthnicity } from './personParser';
import type { GeneratedCase } from './types';

// ============================================
// ENHANCED QUALITY TAGS
// ============================================

const QUALITY_PRESETS = {
  portrait: 'RAW photo, (masterpiece:1.2), (best quality:1.2), (photorealistic:1.4), DSLR, 85mm lens, f/2.8 aperture, natural skin texture, skin pores, subsurface scattering',
  scene: 'RAW photo, (masterpiece:1.2), (best quality:1.2), (photorealistic:1.4), DSLR, wide angle lens, HDR, high dynamic range, architectural photography',
  evidence: 'RAW photo, (masterpiece:1.2), (best quality:1.2), (photorealistic:1.4), macro photography, forensic documentation, sharp focus, high detail',
  cover: 'RAW photo, (masterpiece:1.2), (best quality:1.2), product photography, dramatic lighting, noir aesthetic',
};

const ENHANCED_NEGATIVE = {
  portrait: '(worst quality:2), (low quality:2), (normal quality:1.5), bad anatomy, bad hands, extra fingers, fewer fingers, missing fingers, bad face, ugly face, deformed face, asymmetrical face, cross-eyed, bad teeth, watermark, signature, text, logo, blurry, out of focus, cartoon, painting, illustration, drawing, art, anime, cgi, 3d render, doll, plastic, unrealistic, duplicate, clone, twins',
  scene: '(worst quality:2), (low quality:2), (normal quality:1.5), blurry, out of focus, dark, underexposed, overexposed, cluttered, messy, people, humans, figures, watermark, signature, text, logo, cartoon, painting, illustration, anime, cgi, 3d render, jpeg artifacts',
  evidence: '(worst quality:2), (low quality:2), (normal quality:1.5), blurry, out of focus, dark, overexposed, watermark, signature, text, logo, cartoon, illustration, anime, hands, fingers, human body parts',
};

/**
 * Get occupation-specific clothing based on role - ENHANCED with more detail
 */
export function getOccupationClothing(roleKeywords: string): string {
  if (/teacher|educator|professor|lecturer|tutor/i.test(roleKeywords)) {
    return 'wearing crisp button-up shirt, smart office pants, lanyard with ID badge around neck, neat professional teacher appearance';
  } else if (/doctor|physician|surgeon/i.test(roleKeywords)) {
    return 'wearing pristine white lab coat over formal shirt, stethoscope draped around neck, hospital ID badge clipped to pocket';
  } else if (/nurse|healthcare|medical staff/i.test(roleKeywords)) {
    return 'wearing clean medical scrubs in teal or navy blue, comfortable nursing shoes, hospital ID badge';
  } else if (/engineer|technician|it|programmer|developer/i.test(roleKeywords)) {
    return 'wearing smart casual polo shirt, khaki pants, company lanyard, slightly casual tech worker appearance';
  } else if (/chef|cook|kitchen/i.test(roleKeywords)) {
    return 'wearing traditional white double-breasted chef jacket with buttons, tall white chef toque hat, clean kitchen apron';
  } else if (/police|cop|detective|inspector/i.test(roleKeywords)) {
    return 'wearing Singapore Police Force uniform, dark blue formal shirt with shoulder epaulettes, police badge visible, professional law enforcement look';
  } else if (/security|guard/i.test(roleKeywords)) {
    return 'wearing dark navy security uniform with company patch on shoulder, utility belt, walkie-talkie clipped, alert posture';
  } else if (/student|pupil|school/i.test(roleKeywords)) {
    return 'wearing Singapore school uniform with white short-sleeve shirt, school tie or pinafore, neat and tidy student appearance';
  } else if (/ceo|director|chairman|president/i.test(roleKeywords)) {
    return 'wearing expensive tailored dark suit with silk tie, luxury wristwatch visible, executive presence, confident posture';
  } else if (/manager|supervisor|executive|business/i.test(roleKeywords)) {
    return 'wearing formal business suit with tie, professional office attire, polished appearance, manager demeanor';
  } else if (/lawyer|attorney|advocate/i.test(roleKeywords)) {
    return 'wearing formal black or charcoal suit, conservative tie, leather briefcase nearby, professional legal appearance';
  } else if (/accountant|banker|finance/i.test(roleKeywords)) {
    return 'wearing conservative business suit, reading glasses perhaps, neat meticulous appearance, finance professional look';
  } else if (/scientist|researcher|lab/i.test(roleKeywords)) {
    return 'wearing white laboratory coat, safety goggles pushed up on forehead, pen in coat pocket, analytical expression';
  } else if (/pilot|captain|aviator/i.test(roleKeywords)) {
    return 'wearing airline pilot uniform with gold captain stripes on epaulettes, pilot wings badge, professional aviator appearance';
  } else if (/flight attendant|cabin crew|steward/i.test(roleKeywords)) {
    return 'wearing neat airline cabin crew uniform, silk scarf or tie, name tag, pleasant welcoming appearance';
  } else if (/construction|builder|contractor/i.test(roleKeywords)) {
    return 'wearing high-visibility orange safety vest, white hard hat, dusty work boots, rugged outdoor worker appearance';
  } else if (/worker|labor|factory/i.test(roleKeywords)) {
    return 'wearing practical work coveralls, safety boots, work gloves tucked in pocket, hardworking laborer appearance';
  } else if (/shopkeeper|vendor|seller|merchant|retail/i.test(roleKeywords)) {
    return 'wearing casual polo shirt with shop apron, comfortable shoes, name tag, friendly neighborhood shopkeeper appearance';
  } else if (/cleaner|janitor|maintenance/i.test(roleKeywords)) {
    return 'wearing practical cleaning uniform or coveralls, comfortable work shoes, cleaning supplies nearby, humble worker appearance';
  } else if (/taxi|grab|driver|delivery/i.test(roleKeywords)) {
    return 'wearing casual collared shirt, comfortable pants, driver appearance, perhaps with company lanyard or ID';
  } else if (/waiter|waitress|server|f&b/i.test(roleKeywords)) {
    return 'wearing restaurant uniform with black vest and bow tie, white dress shirt, server apron, attentive service appearance';
  } else if (/barista|coffee|cafe/i.test(roleKeywords)) {
    return 'wearing hipster cafe apron over casual shirt, rolled up sleeves, coffee shop worker aesthetic';
  } else if (/hawker|food stall|kopitiam/i.test(roleKeywords)) {
    return 'wearing casual t-shirt under cooking apron, sweat towel around neck, hardworking hawker appearance';
  } else if (/artist|designer|creative/i.test(roleKeywords)) {
    return 'wearing trendy casual clothes, perhaps paint-stained or artistic accessories, creative bohemian style';
  } else if (/journalist|reporter|media/i.test(roleKeywords)) {
    return 'wearing smart casual business attire, press ID lanyard, notebook visible, inquisitive journalist appearance';
  } else if (/athlete|sportsman|coach/i.test(roleKeywords)) {
    return 'wearing sports tracksuit or athletic wear, sports brand visible, fit athletic appearance';
  } else if (/farmer|gardener|agriculture/i.test(roleKeywords)) {
    return 'wearing practical outdoor clothes, wide-brimmed sun hat, gardening gloves, outdoor worker appearance';
  } else if (/fisherman|sailor/i.test(roleKeywords)) {
    return 'wearing practical waterproof jacket, weathered cap, tanned skin, seasoned maritime worker appearance';
  } else if (/military|army|soldier|saf/i.test(roleKeywords)) {
    return 'wearing Singapore Armed Forces No.4 uniform, camouflage pattern, military beret, disciplined soldier posture';
  } else if (/firefighter|scdf/i.test(roleKeywords)) {
    return 'wearing SCDF blue duty uniform, fire service badge, ready and alert firefighter appearance';
  } else if (/paramedic|ambulance|emergency/i.test(roleKeywords)) {
    return 'wearing emergency medical uniform, stethoscope, medical equipment pouch, alert paramedic appearance';
  } else if (/librarian|archivist/i.test(roleKeywords)) {
    return 'wearing smart casual cardigan over blouse, reading glasses, quiet studious librarian appearance';
  } else if (/receptionist|admin|secretary/i.test(roleKeywords)) {
    return 'wearing smart office blouse and skirt or pants, professional makeup, organized admin appearance';
  } else if (/electrician|plumber|mechanic/i.test(roleKeywords)) {
    return 'wearing work coveralls with tool belt, practical boots, skilled tradesman appearance';
  } else if (/postman|mailman|singpost/i.test(roleKeywords)) {
    return 'wearing SingPost red uniform shirt, postal cap, mail bag, friendly postman appearance';
  } else if (/housewife|homemaker|stay-at-home/i.test(roleKeywords)) {
    return 'wearing comfortable casual home clothes, neat maternal appearance, warm and approachable';
  } else if (/retiree|retired|pensioner/i.test(roleKeywords)) {
    return 'wearing comfortable casual clothes like polo shirt and slacks, relaxed elderly appearance, reading glasses perhaps';
  }
  return 'wearing smart casual Singapore attire, neat professional appearance';
}

/**
 * Derive expression from storyline elements (personality, dialogue emotions)
 * Returns undefined if no storyline data available - allows fallback to defaults
 */
function deriveStorylineExpression(
  personality?: string[],
  dialogueEmotions?: string[],
  motive?: string,
  isChild?: boolean
): string | undefined {
  // For children, always use natural expressions regardless of storyline
  if (isChild) {
    return undefined; // Will use default child expression
  }

  // Emotion priority mapping - what expression should show for each emotion/trait
  const expressionMap: Record<string, string> = {
    // Dialogue emotions (from dialogueTree)
    'nervous': 'subtly nervous expression, slight tension in jaw, fidgeting hands',
    'defensive': 'guarded defensive expression, crossed arms body language, wary eyes',
    'angry': 'controlled anger expression, tightened lips, intense focused gaze',
    'evasive': 'evasive shifty expression, avoiding direct eye contact, uncomfortable posture',
    'helpful': 'open helpful expression, friendly demeanor, engaged and attentive',
    'calm': 'calm composed expression, relaxed facial muscles, steady gaze',
    // Personality traits
    'anxious': 'anxious worried expression, furrowed brow, tense shoulders',
    'suspicious': 'suspicious guarded expression, narrowed eyes, skeptical look',
    'confident': 'confident self-assured expression, direct eye contact, upright posture',
    'friendly': 'warm friendly expression, slight smile, approachable demeanor',
    'reserved': 'reserved neutral expression, measured demeanor, professional distance',
    'aggressive': 'assertive intense expression, firm jaw, challenging gaze',
    'timid': 'timid uncertain expression, downcast eyes, submissive posture',
    'cheerful': 'pleasant cheerful expression, genuine smile, bright eyes',
    'stern': 'stern serious expression, firm set mouth, authoritative presence',
    'worried': 'worried concerned expression, creased forehead, troubled eyes',
    'secretive': 'secretive guarded expression, knowing look, slight tension',
    'professional': 'professional neutral expression, composed demeanor, business-like',
    'impatient': 'impatient restless expression, slight irritation visible, checking time',
    'cooperative': 'cooperative open expression, willing demeanor, attentive posture',
    'resentful': 'resentful bitter expression, tight-lipped, underlying frustration visible',
  };

  // Collect all storyline indicators
  const indicators: string[] = [];

  // Add dominant dialogue emotion (take first/most common)
  if (dialogueEmotions && dialogueEmotions.length > 0) {
    // Count emotion frequencies
    const emotionCounts: Record<string, number> = {};
    dialogueEmotions.forEach(e => {
      emotionCounts[e.toLowerCase()] = (emotionCounts[e.toLowerCase()] || 0) + 1;
    });
    // Find dominant emotion
    const dominant = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominant) indicators.push(dominant);
  }

  // Add personality traits
  if (personality && personality.length > 0) {
    personality.forEach(trait => indicators.push(trait.toLowerCase()));
  }

  // Check for motive-related expressions
  if (motive) {
    const motiveLower = motive.toLowerCase();
    if (/revenge|grudge|hate/i.test(motiveLower)) indicators.push('resentful');
    if (/fear|afraid|scared/i.test(motiveLower)) indicators.push('anxious');
    if (/jealous|envy/i.test(motiveLower)) indicators.push('resentful');
    if (/greed|money|profit/i.test(motiveLower)) indicators.push('secretive');
  }

  // Find first matching expression from storyline data
  for (const indicator of indicators) {
    if (expressionMap[indicator]) {
      return expressionMap[indicator];
    }
  }

  return undefined; // No storyline data found, use defaults
}

/**
 * Build suspect portrait prompt - ENHANCED with quality presets and explicit age support
 * Supports Singapore education system ages:
 * - Kindergarten: 3-6 years (young child)
 * - Primary school: 7-12 years (child)
 * - Secondary school: 13-16 years (teen)
 * - JC/Poly/ITE: 17-19 years (older teen)
 * - University: 20-25 years (young adult)
 *
 * Expression is now storyline-inspired (from personality/dialogue) with guilt-based fallback
 */
export function buildSuspectPrompt(suspect: {
  name: string;
  role: string;
  isGuilty: boolean;
  // Optional explicit age fields from case generator
  specificAge?: number;
  displayAge?: string;
  ageCategory?: 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';
  gender?: 'male' | 'female';
  // Storyline fields for expression derivation
  personality?: string[];
  motive?: string;
  dialogueTree?: Array<{
    emotion?: 'calm' | 'nervous' | 'defensive' | 'helpful' | 'evasive' | 'angry';
  }>;
}): {
  prompt: string;
  negativePrompt: string;
  metadata: { gender: string; age: string; specificAge?: number };
} {
  const ethnicityInfo = inferEthnicity(suspect.name);

  // Parse basic info from name and role
  let personInfo = parsePersonInfo(suspect.name, suspect.role);

  // Override with explicit age if provided from case data
  if (suspect.specificAge !== undefined) {
    const age = suspect.specificAge;
    if (age <= 6) {
      // Kindergarten age (3-6)
      personInfo.age = 'young_child';
      personInfo.ageDescriptor = `${age} years old kindergarten child`;
      personInfo.agePrompt = `${age} year old very young child, kindergarten age, tiny child face, very small stature, innocent toddler appearance`;
      personInfo.gender = personInfo.gender === 'woman' ? 'little girl' : personInfo.gender === 'man' ? 'little boy' : 'young child';
    } else if (age <= 12) {
      // Primary school age (7-12)
      personInfo.age = 'child';
      personInfo.ageDescriptor = `${age} years old primary school student`;
      personInfo.agePrompt = `${age} year old child, primary school age, childlike face, small child stature, innocent school child appearance`;
      personInfo.gender = personInfo.gender === 'woman' ? 'girl' : personInfo.gender === 'man' ? 'boy' : 'child';
    } else if (age <= 16) {
      // Secondary school age (13-16)
      personInfo.age = 'teenager';
      personInfo.ageDescriptor = `${age} years old secondary school student`;
      personInfo.agePrompt = `${age} year old teenager, secondary school age, teenage appearance, adolescent face, youthful student`;
      personInfo.gender = personInfo.gender === 'woman' ? 'teenage girl' : personInfo.gender === 'man' ? 'teenage boy' : 'teenager';
    } else if (age <= 19) {
      // JC/Poly/ITE age (17-19)
      personInfo.age = 'older_teen';
      personInfo.ageDescriptor = `${age} years old JC/polytechnic student`;
      personInfo.agePrompt = `${age} year old older teenager, young adult appearance, late teens, college student face`;
      personInfo.gender = personInfo.gender === 'woman' ? 'young woman' : personInfo.gender === 'man' ? 'young man' : 'young person';
    } else if (age <= 25) {
      // University/young adult (20-25)
      personInfo.age = 'young';
      personInfo.ageDescriptor = `${age} years old young adult`;
      personInfo.agePrompt = `${age} year old young adult, fresh face, energetic youthful appearance`;
    } else if (age <= 40) {
      personInfo.age = 'adult';
      personInfo.ageDescriptor = `${age} years old`;
      personInfo.agePrompt = `${age} year old adult, mature appearance`;
    } else if (age <= 60) {
      personInfo.age = 'middle-aged';
      personInfo.ageDescriptor = `${age} years old`;
      personInfo.agePrompt = `${age} year old adult, mature middle-aged appearance, some fine lines`;
    } else {
      personInfo.age = 'elderly';
      personInfo.ageDescriptor = `${age} years old elderly`;
      personInfo.agePrompt = `${age} year old elderly person, gray hair, wrinkles, wise appearance, aged face`;
      personInfo.gender = personInfo.gender === 'woman' ? 'elderly woman' : personInfo.gender === 'man' ? 'elderly man' : 'elderly person';
    }
    console.log(`[PROMPT_BUILDER] Using explicit age: ${age} → ${personInfo.ageDescriptor}`);
  } else if (suspect.displayAge) {
    // Use displayAge string if provided
    personInfo.ageDescriptor = suspect.displayAge;
    console.log(`[PROMPT_BUILDER] Using displayAge: ${suspect.displayAge}`);
  } else if (suspect.ageCategory) {
    // Map ageCategory to age details (Singapore education system)
    const ageCategoryMap: Record<string, { age: string; descriptor: string; prompt: string; genderMod?: boolean }> = {
      'child': { age: 'child', descriptor: '8-11 years old primary school child', prompt: 'primary school age child, childlike face, small stature, innocent school child appearance', genderMod: true },
      'teen': { age: 'teenager', descriptor: '14-16 years old secondary school student', prompt: 'secondary school teenager, teenage appearance, adolescent, youthful student face', genderMod: true },
      'young_adult': { age: 'young', descriptor: '22-26 years old young adult', prompt: 'young adult, fresh face, energetic appearance' },
      'adult': { age: 'adult', descriptor: '32-38 years old', prompt: 'adult, mature professional appearance' },
      'middle_aged': { age: 'middle-aged', descriptor: '48-55 years old', prompt: 'middle-aged adult, mature appearance, some fine lines visible' },
      'senior': { age: 'elderly', descriptor: '65-75 years old elderly', prompt: 'elderly person, gray hair, wrinkles, wise senior appearance', genderMod: true },
    };
    const mapped = ageCategoryMap[suspect.ageCategory];
    if (mapped) {
      personInfo.age = mapped.age;
      personInfo.ageDescriptor = mapped.descriptor;
      personInfo.agePrompt = mapped.prompt;
      if (mapped.genderMod && suspect.ageCategory === 'child') {
        personInfo.gender = personInfo.gender === 'woman' ? 'girl' : personInfo.gender === 'man' ? 'boy' : 'child';
      } else if (mapped.genderMod && suspect.ageCategory === 'teen') {
        personInfo.gender = personInfo.gender === 'woman' ? 'teenage girl' : personInfo.gender === 'man' ? 'teenage boy' : 'teenager';
      } else if (mapped.genderMod && suspect.ageCategory === 'senior') {
        personInfo.gender = personInfo.gender === 'woman' ? 'elderly woman' : personInfo.gender === 'man' ? 'elderly man' : 'elderly person';
      }
    }
    console.log(`[PROMPT_BUILDER] Using ageCategory: ${suspect.ageCategory} → ${personInfo.ageDescriptor}`);
  }

  // Override gender if explicitly provided
  if (suspect.gender) {
    const baseGender = suspect.gender === 'female' ? 'woman' : 'man';
    // Keep age-appropriate gender if already set (boy/girl/teenage boy/etc)
    if (!['boy', 'girl', 'little boy', 'little girl', 'teenage boy', 'teenage girl', 'elderly man', 'elderly woman', 'young man', 'young woman'].includes(personInfo.gender)) {
      personInfo.gender = baseGender;
    }
  }

  // Expression logic: Storyline-inspired (personality/dialogue) with guilt-based fallback
  // For children, expressions are always natural/innocent
  const isYoungChild = personInfo.age === 'young_child' || personInfo.age === 'child';

  // Extract dialogue emotions from dialogueTree
  const dialogueEmotions = suspect.dialogueTree
    ?.map(d => d.emotion)
    .filter((e): e is NonNullable<typeof e> => e !== undefined) || [];

  // Try storyline-derived expression first
  const storylineExpression = deriveStorylineExpression(
    suspect.personality,
    dialogueEmotions,
    suspect.motive,
    isYoungChild
  );

  // Final expression: storyline > child default > guilt-based fallback
  const expression = isYoungChild
    ? 'natural child expression, innocent face, school photo pose'
    : storylineExpression
    ? storylineExpression
    : suspect.isGuilty
    ? 'slightly tense expression, avoiding direct eye contact, subtle nervousness in eyes'
    : 'calm composed expression, confident posture, direct eye contact with camera';

  // Log expression source for debugging
  console.log(`[PROMPT_BUILDER] Expression for ${suspect.name}: ${storylineExpression ? 'storyline-derived' : isYoungChild ? 'child-default' : 'guilt-fallback'} → "${expression.substring(0, 50)}..."`);

  // DEBUG: Log name parsing results
  console.log(`[PROMPT_BUILDER] Building prompt for: ${suspect.name}`);
  console.log(`[PROMPT_BUILDER] Detected gender: ${personInfo.gender}, age: ${personInfo.age}, descriptor: ${personInfo.ageDescriptor}`);

  // For Realistic Vision V6.0 - use natural language prompts
  const occupationClothing = getOccupationClothing(suspect.role.toLowerCase());

  // Determine gender-specific descriptors for Realistic Vision
  const isMale = ['man', 'boy', 'little boy', 'teenage boy', 'elderly man', 'young man'].includes(personInfo.gender);
  const isFemale = ['woman', 'girl', 'little girl', 'teenage girl', 'elderly woman', 'young woman'].includes(personInfo.gender);

  // Display gender based on age
  const displayGender = personInfo.gender; // Already age-appropriate from above
  const genderAdjective = isMale ? 'male' : isFemale ? 'female' : 'person';

  // Age-specific face details - ENHANCED for all age groups
  const ageDetails = personInfo.age === 'elderly'
    ? 'aged facial features, wrinkles, grey hair, weathered skin'
    : personInfo.age === 'middle-aged'
    ? 'mature facial features, some fine lines, professional appearance'
    : personInfo.age === 'young'
    ? 'youthful facial features, smooth skin, energetic appearance'
    : personInfo.age === 'older_teen'
    ? 'late teenage facial features, young adult appearance, smooth skin'
    : personInfo.age === 'teenager'
    ? 'teenage facial features, youthful adolescent appearance, smooth young skin'
    : personInfo.age === 'child'
    ? 'childlike facial features, young innocent face, small child appearance, baby fat cheeks'
    : personInfo.age === 'young_child'
    ? 'very young childlike features, toddler/kindergarten face, very small, baby face, round cheeks'
    : 'adult facial features';

  // Build natural language prompt for Realistic Vision - START WITH QUALITY PRESET
  const promptParts = [
    // QUALITY PRESET FIRST - critical for best results
    QUALITY_PRESETS.portrait,
    // 1. SUBJECT TYPE
    'solo portrait', 'single person', 'one person only',
    // 2. GENDER with emphasis - CRITICAL for correct generation
    `(${displayGender}:1.4)`,
    `(${genderAdjective}:1.3)`,
    // 3. AGE description with details
    `(${personInfo.ageDescriptor}:1.2)`,
    ageDetails,
    // 4. ETHNICITY with emphasis
    `(${ethnicityInfo.race} ethnicity:1.2)`,
    ethnicityInfo.ethnicity,
    ethnicityInfo.skinTone,
    'natural skin texture with visible pores',
    // 5. OCCUPATION and clothing - detailed
    `${suspect.role} occupation`,
    occupationClothing,
    // 6. Expression and pose
    expression,
    'head and shoulders portrait',
    'centered composition',
    // 7. Photography settings for ID photo look
    'corporate ID photo style',
    'plain neutral grey background',
    'front facing camera',
    'soft studio lighting from above',
    'catch light in eyes',
    'slight shadow under chin',
  ];

  // Add religious attire if applicable
  if (personInfo.religiousAttire) {
    promptParts.push(personInfo.religiousAttire);
  }

  // Negative prompt for Realistic Vision - USE ENHANCED PRESET + gender-specific
  const oppositeGender = isMale
    ? '(woman:1.8), (women:1.8), (female:1.8), (girl:1.8), (feminine:1.6), breasts, long feminine hair, feminine features, makeup, lipstick, feminine clothing'
    : '(man:1.8), (men:1.8), (male:1.8), (boy:1.8), (masculine:1.6), beard, mustache, masculine features, adam\'s apple, masculine jaw';

  const negativePrompt = [
    // ENHANCED PRESET FIRST
    ENHANCED_NEGATIVE.portrait,
    // OPPOSITE GENDER with very high weight
    oppositeGender,
    // Multiple people prevention
    '(multiple people:1.8), (two people:1.8), (crowd:1.5), (group:1.5), (couple:1.5)',
    // Inappropriate content
    '(nsfw:2), (nude:2), (naked:2), (revealing:1.5), (suggestive:1.5), cleavage',
    // Wrong age
    personInfo.age === 'elderly' ? '(young:1.3), (youthful:1.3)' : '',
    personInfo.age === 'young' ? '(old:1.3), (elderly:1.3), wrinkles' : '',
  ].filter(Boolean).join(', ');

  return {
    prompt: promptParts.join(', '),
    negativePrompt,
    metadata: { gender: personInfo.gender, age: personInfo.age }
  };
}

/**
 * Build cover image prompt - ENHANCED for noir detective case file aesthetic
 */
export function buildCoverPrompt(caseData: GeneratedCase, subject: string): string {
  const storyKeywords = caseData.story.setting.split(' ').slice(0, 10).join(' ');

  // Subject-specific elements with more detail
  const subjectElements = subject === 'MATH'
    ? 'handwritten mathematical equations on yellowed paper, algebra formulas, geometry diagrams, calculation notes'
    : subject === 'SCIENCE'
    ? 'scientific lab report papers, molecular diagrams, experiment data tables, measurement notes'
    : 'academic papers with equations and diagrams';

  // Crime type specific elements
  const crimeElements = caseData.story.setting.toLowerCase().includes('theft')
    ? 'photos of missing items, inventory lists'
    : caseData.story.setting.toLowerCase().includes('fraud')
    ? 'financial documents, receipts, bank statements'
    : 'crime scene photographs, evidence photos';

  // Build comprehensive noir cover prompt
  const promptParts = [
    // Quality preset
    QUALITY_PRESETS.cover,
    // Main subject - case file
    'detective case folder', 'manila envelope file',
    'TOP SECRET stamp in red ink', 'CLASSIFIED document',
    'police case file number visible',
    // Contents spilling out
    `contents visible: ${subjectElements}`,
    crimeElements,
    'handwritten detective notes', 'red string connecting clues',
    // Story context
    storyKeywords,
    // Noir atmosphere
    'film noir aesthetic', 'moody dramatic lighting',
    'single desk lamp illumination', 'dark wooden desk surface',
    'shadows and highlights', 'vintage 1940s detective office feel',
    // Paper and texture details
    'aged yellowed paper', 'coffee ring stains on documents',
    'paper clips and staples', 'bent corners',
    // Composition
    'top-down view', 'flat lay arrangement',
    'scattered documents composition',
    // Technical quality
    'professional product photography',
    'sharp focus on documents', '8k uhd detail',
  ];

  return promptParts.join(', ');
}

// ============================================
// LOCATION-SPECIFIC SCENE TEMPLATES
// ============================================

const LOCATION_TEMPLATES: Record<string, {
  architecture: string;
  furniture: string;
  lighting: string;
  atmosphere: string;
  singaporeDetails: string;
}> = {
  // ============================================
  // SCHOOL CANTEEN LOCATIONS
  // ============================================
  canteen: {
    architecture: 'Singapore school canteen, open-air covered area, tiled floor, multiple food stalls in a row',
    furniture: 'stainless steel food counters, plastic tables and stools, tray return stations, drink coolers',
    lighting: 'bright fluorescent lights overhead, natural light from open sides, ceiling fans spinning',
    atmosphere: 'bustling school canteen, students queuing for food, trays clattering, meal time energy',
    singaporeDetails: 'typical Singapore primary school canteen, recess period atmosphere, multilingual menu signs',
  },
  main_counter: {
    architecture: 'school canteen main service counter, stainless steel serving area, menu boards above',
    furniture: 'cash register on counter, food warmers, beverage dispensers, stacked plastic cups and bowls',
    lighting: 'bright overhead fluorescent lights, food display lighting, well-lit service area',
    atmosphere: 'busy canteen counter, queue of students, auntie serving food, bustling service',
    singaporeDetails: 'Singapore school canteen counter, plastic money tray, laminated price list',
  },
  storeroom: {
    architecture: 'school canteen storeroom, concrete walls, industrial shelving, single door entrance',
    furniture: 'metal shelving racks with supplies, stacked boxes of ingredients, refrigerator unit, cleaning supplies',
    lighting: 'single fluorescent tube light, slightly dim storage area, utilitarian lighting',
    atmosphere: 'quiet storage space, organized inventory, behind-the-scenes canteen area',
    singaporeDetails: 'typical Singapore school storeroom, inventory labels in Chinese and English',
  },
  kitchen: {
    architecture: 'school canteen kitchen, stainless steel work surfaces, commercial cooking area, ventilation hood',
    furniture: 'industrial wok station, prep tables, ingredient storage, utensil racks, gas stoves',
    lighting: 'bright kitchen lighting, heat lamps over serving area, functional illumination',
    atmosphere: 'active cooking environment, steam rising, busy food preparation, sizzling sounds implied',
    singaporeDetails: 'Singapore hawker-style kitchen, wok hei cooking, local food preparation',
  },
  back_entrance: {
    architecture: 'service entrance behind canteen, concrete loading area, metal roller door, delivery access',
    furniture: 'empty crates stacked, delivery trolley, waste bins, staff bicycles parked nearby',
    lighting: 'natural daylight from open area, minimal artificial lighting, utilitarian access point',
    atmosphere: 'quiet service area, staff coming and going, deliveries being unloaded',
    singaporeDetails: 'Singapore school back entrance, delivery timing board, staff notice board',
  },

  // ============================================
  // SCIENCE LAB LOCATIONS
  // ============================================
  laboratory: {
    architecture: 'modern science laboratory, fume hood, safety shower visible, chemical storage',
    furniture: 'lab benches with sinks, high stools, equipment shelves, glassware cabinets',
    lighting: 'bright clinical lab lighting, no shadows for safety, well-illuminated workspace',
    atmosphere: 'sterile research environment, scientific equipment, safety signs visible',
    singaporeDetails: 'Singapore school science lab, A*STAR style equipment, safety first posters',
  },
  main_lab: {
    architecture: 'primary school science laboratory, lab benches in rows, fume cupboard at side, emergency shower',
    furniture: 'black resin lab benches with gas taps and sinks, high stools, microscopes, beakers on shelves',
    lighting: 'bright overhead fluorescent lighting, natural light from high windows, safety lighting',
    atmosphere: 'organized science classroom, experiment in progress, student workstations ready',
    singaporeDetails: 'Singapore MOE school science lab, periodic table poster, safety goggles rack',
  },
  storage_cabinet: {
    architecture: 'locked chemical storage area within lab, glass-fronted cabinets, hazard warning signs',
    furniture: 'chemical storage cabinets with safety locks, specimen jars, reagent bottles organized by type',
    lighting: 'bright safety lighting, clearly illuminated hazard labels, clinical environment',
    atmosphere: 'secure storage area, chemicals properly labeled, restricted access implied',
    singaporeDetails: 'Singapore school lab storage, bilingual safety labels, SCDF compliance stickers',
  },
  plant_display: {
    architecture: 'science fair display area, folding tables arranged in rows, project display boards',
    furniture: 'student experiment displays, potted plants in various stages, measurement equipment, labels',
    lighting: 'bright exhibition lighting, natural light from windows, spotlight on displays',
    atmosphere: 'science fair competition setup, student projects on display, academic excitement',
    singaporeDetails: 'Singapore primary school science fair, STEM competition display, student name cards',
  },
  equipment_room: {
    architecture: 'science equipment storage room, industrial shelving, locked cabinets, narrow access',
    furniture: 'microscopes in cases, scientific instruments, spare glassware, calibration equipment',
    lighting: 'functional fluorescent lighting, organized workspace, maintenance area feel',
    atmosphere: 'quiet storage and maintenance area, equipment ready for class, organized inventory',
    singaporeDetails: 'Singapore school equipment store, MOE inventory tags, maintenance schedule posted',
  },

  // ============================================
  // LIBRARY LOCATIONS
  // ============================================
  library: {
    architecture: 'Singapore community library, modern interior, reading areas, book stacks',
    furniture: 'tall bookshelves, comfortable reading chairs, computer workstations, librarian desk',
    lighting: 'soft ambient library lighting, reading lamps on tables, natural light from skylights',
    atmosphere: 'quiet study environment, patrons reading, peaceful academic space',
    singaporeDetails: 'Singapore NLB style library, multilingual book sections, self-checkout kiosks',
  },
  special_collection: {
    architecture: 'rare books room, climate-controlled space, glass display cases, secure access door',
    furniture: 'rare book display cabinets, reading pedestals, white cotton gloves on table, archive boxes',
    lighting: 'controlled UV-filtered lighting, display case illumination, preservation-focused',
    atmosphere: 'hushed reverence for rare materials, scholarly atmosphere, restricted access',
    singaporeDetails: 'Singapore heritage collection room, valuable Singapore history books displayed',
  },
  front_desk: {
    architecture: 'library main service desk, circular or L-shaped counter, behind-desk offices visible',
    furniture: 'library counter with computers, book scanner, return slot, staff workstations',
    lighting: 'bright service area lighting, screen glow from computers, welcoming desk lamps',
    atmosphere: 'helpful library service, patrons checking books, quiet professional assistance',
    singaporeDetails: 'Singapore NLB service counter, membership card reader, multilingual staff',
  },
  reading_room: {
    architecture: 'quiet study area with individual carrels, group study tables, comfortable seating nooks',
    furniture: 'study desks with desk lamps, comfortable armchairs, magazine racks, power outlets for laptops',
    lighting: 'soft reading-friendly lighting, individual desk lamps, diffused overhead light',
    atmosphere: 'focused study environment, students and adults reading, exam preparation mood',
    singaporeDetails: 'Singapore library study area, silent zone signs, popular with PSLE students',
  },
  children_section: {
    architecture: 'colorful children library area, low bookshelves, story corner with cushions, activity space',
    furniture: 'child-sized tables and chairs, picture book displays, puppet theater, reading nooks',
    lighting: 'warm welcoming lighting, playful ceiling fixtures, natural light emphasized',
    atmosphere: 'joyful learning environment, children browsing books, story time setup',
    singaporeDetails: 'Singapore library children zone, Malay Tamil Chinese English books mixed',
  },

  // ============================================
  // SPORTS FACILITY LOCATIONS
  // ============================================
  sports_hall: {
    architecture: 'school sports hall, high ceiling, basketball court markings, stage at one end',
    furniture: 'basketball hoops, bleacher seating, equipment storage along walls, scoreboard',
    lighting: 'bright sports lighting, high-mounted fixtures, competition-grade illumination',
    atmosphere: 'athletic environment, sports practice setup, competition ready',
    singaporeDetails: 'Singapore school sports hall, POSB badminton court lines, air-conditioned',
  },
  main_court: {
    architecture: 'competition badminton court, professional flooring, umpire high chair, player benches',
    furniture: 'badminton net setup, umpire chair, score display, player waiting area with benches',
    lighting: 'competition-grade sports lighting, no shadows on court, camera-ready illumination',
    atmosphere: 'championship match setup, competitive tension, audience seating visible',
    singaporeDetails: 'Singapore inter-school competition, SSSBA banners, school flags displayed',
  },
  locker_room: {
    architecture: 'sports facility locker room, rows of metal lockers, benches between rows, showers visible',
    furniture: 'metal lockers with combination locks, wooden benches, sports bags on hooks, mirror area',
    lighting: 'bright functional lighting, fluorescent strips, shower area lighting',
    atmosphere: 'athletes changing space, pre-game preparation, team energy',
    singaporeDetails: 'Singapore school locker room, PE uniforms visible, team photos on wall',
  },

  // ============================================
  // WET MARKET LOCATIONS
  // ============================================
  wet_market: {
    architecture: 'traditional Singapore wet market, high ceiling with fans, concrete floor with drains',
    furniture: 'vendor stalls with display tables, weighing scales, ice boxes, hanging hooks for meat',
    lighting: 'bright fluorescent overhead lighting, individual stall lights, morning market brightness',
    atmosphere: 'bustling market morning, vendors calling, fresh produce displayed, early shoppers',
    singaporeDetails: 'classic Singapore wet market, Tiong Bahru or Tekka style, auntie bargaining',
  },
  fish_stall: {
    architecture: 'fresh fish vendor stall, display counter with ice bed, running water, seafood on display',
    furniture: 'fish display on ice, weighing scale, cutting board, knife set, live seafood tanks',
    lighting: 'bright white lighting to show freshness, ice reflecting light, professional food display',
    atmosphere: 'busy fish stall, customers selecting seafood, vendor skillfully cutting fish',
    singaporeDetails: 'Singapore wet market fish stall, fresh catch signage, Chinese price tags',
  },
  market_office: {
    architecture: 'market management office, small enclosed room, window facing market floor, filing cabinets',
    furniture: 'office desk with computer, filing cabinets, license display board, CCTV monitors',
    lighting: 'office fluorescent lighting, computer screen glow, functional workspace',
    atmosphere: 'administrative space, market management, official documentation area',
    singaporeDetails: 'Singapore market NEA office, hawker license display, complaint forms',
  },
  weighing_station: {
    architecture: 'official market weighing area, certified scale on counter, NEA calibration sticker',
    furniture: 'certified weighing scale, display counter, calibration tools, weight verification equipment',
    lighting: 'bright clinical lighting for accurate weighing, well-illuminated for customer trust',
    atmosphere: 'official verification area, customers checking weights, fair trade enforcement',
    singaporeDetails: 'Singapore NEA certified weighing station, consumer protection signage',
  },
  loading_bay: {
    architecture: 'market loading and delivery area, concrete platform, roller shutters, truck access',
    furniture: 'delivery trolleys, stacked crates, pallet jacks, unloading platform',
    lighting: 'early morning natural light, loading bay overhead lights, functional work area',
    atmosphere: 'early morning delivery rush, goods being unloaded, market preparation',
    singaporeDetails: 'Singapore market loading dock, delivery time restrictions sign, HDB parking nearby',
  },

  // ============================================
  // GENERIC LOCATIONS (FALLBACK)
  // ============================================
  office: {
    architecture: 'modern Singapore office interior, glass partitions, dropped ceiling with recessed lighting',
    furniture: 'ergonomic office chairs, computer workstations, filing cabinets, desk dividers',
    lighting: 'fluorescent office lighting, natural light from windows, air-conditioned environment',
    atmosphere: 'professional corporate atmosphere, busy workplace, organized office space',
    singaporeDetails: 'Singaporean office building, CBD area feel, multi-storey commercial building',
  },
  school: {
    architecture: 'Singapore school classroom, whiteboard at front, ceiling fans, louvered windows',
    furniture: 'student desks in rows, teacher desk, notice board with posters, lockers in corridor',
    lighting: 'bright classroom lighting, natural daylight from windows, well-lit educational space',
    atmosphere: 'academic environment, school supplies visible, educational posters on walls',
    singaporeDetails: 'typical Singapore MOE school design, HDB area school, covered walkways',
  },
  hospital: {
    architecture: 'Singapore hospital interior, clean white walls, medical equipment bays',
    furniture: 'medical equipment, hospital beds, nurses station, wheeled equipment',
    lighting: 'bright clinical lighting, 24-hour lighting, emergency lighting visible',
    atmosphere: 'sterile medical environment, antiseptic smell implied, professional healthcare',
    singaporeDetails: 'Singapore General Hospital style, public healthcare facility',
  },
  hawker_center: {
    architecture: 'open-air hawker center, high ceiling with industrial fans, concrete floor',
    furniture: 'food stalls with signboards, plastic tables and chairs, shared seating areas',
    lighting: 'bright fluorescent hawker lighting, neon food stall signs, well-lit eating area',
    atmosphere: 'bustling food court atmosphere, steam from cooking, busy meal time',
    singaporeDetails: 'iconic Singapore hawker center, HDB void deck nearby, multilingual signs',
  },
  mrt_station: {
    architecture: 'underground MRT station platform, platform screen doors, directional signs',
    furniture: 'platform benches, fare gates visible, escalators, information displays',
    lighting: 'bright station lighting, LED displays, platform safety lighting',
    atmosphere: 'busy commuter environment, organized public transport, clean and efficient',
    singaporeDetails: 'Singapore MRT station, Circle Line or North-South Line style',
  },
  hdb_flat: {
    architecture: 'HDB flat interior, typical Singapore public housing layout, corridor windows',
    furniture: 'practical home furniture, TV console, dining table, shoe cabinet at entrance',
    lighting: 'residential warm lighting, ceiling lights, natural light from windows',
    atmosphere: 'lived-in family home, personal belongings, homey environment',
    singaporeDetails: 'typical HDB 4-room flat, common corridor outside, void deck visible',
  },
  shopping_mall: {
    architecture: 'air-conditioned shopping mall interior, marble floors, high ceilings',
    furniture: 'retail displays, benches, escalators, decorative plants',
    lighting: 'bright retail lighting, accent lighting on displays, skylight areas',
    atmosphere: 'busy shopping environment, consumers walking, retail activity',
    singaporeDetails: 'Singaporean shopping mall like VivoCity or Ion style',
  },
  warehouse: {
    architecture: 'industrial warehouse interior, high metal roof, loading dock doors',
    furniture: 'metal shelving racks, pallets, forklifts, inventory boxes',
    lighting: 'industrial high-bay lighting, some darker corners, dock door light',
    atmosphere: 'working industrial space, logistics environment, organized storage',
    singaporeDetails: 'Tuas or Jurong industrial area warehouse',
  },
  restaurant: {
    architecture: 'restaurant dining area, decorative interior, kitchen pass visible',
    furniture: 'dining tables with tablecloths, chairs, service station, bar area',
    lighting: 'ambient restaurant lighting, pendant lights, mood lighting',
    atmosphere: 'dining establishment, food service environment, hospitality setting',
    singaporeDetails: 'Singapore restaurant, could be any cuisine, kopitiam to fine dining',
  },
  park: {
    architecture: 'Singapore park outdoor area, walking paths, park benches, sheltered areas',
    furniture: 'park benches, exercise equipment, waste bins, lamp posts',
    lighting: 'natural daylight, dappled sunlight through trees, park lamp posts',
    atmosphere: 'peaceful outdoor recreation, nature surroundings, public park',
    singaporeDetails: 'Singapore park like East Coast or Bishan Park, well-maintained greenery',
  },
};

/**
 * Build scene image prompt - ENHANCED with location templates
 * Better location accuracy and Singapore-specific details
 */
export function buildScenePrompt(
  scene: { description: string; locationType?: string; id?: string; sceneType?: string },
  embeddedClues?: Array<{
    title: string;
    visualCue?: string;
    type: string;
    positionX?: number;
    positionY?: number;
  }>
): string {
  // Detect location type from description - prioritize specific crime scene locations
  const desc = scene.description.toLowerCase();
  let locationKey = 'school'; // default for primary school stories

  // SPECIFIC CRIME SCENE LOCATIONS (check first for accuracy)
  // Canteen locations
  if (/main counter|service counter|cash register|canteen counter/i.test(desc)) locationKey = 'main_counter';
  else if (/storeroom|store room|storage area|inventory/i.test(desc)) locationKey = 'storeroom';
  else if (/kitchen|cooking|wok|food prep/i.test(desc)) locationKey = 'kitchen';
  else if (/back entrance|service entrance|delivery|loading/i.test(desc)) locationKey = 'back_entrance';
  else if (/canteen|recess|food stall|lunch/i.test(desc)) locationKey = 'canteen';

  // Science lab locations
  else if (/main lab|laboratory|lab bench|experiment/i.test(desc)) locationKey = 'main_lab';
  else if (/storage cabinet|chemical storage|reagent/i.test(desc)) locationKey = 'storage_cabinet';
  else if (/plant display|science fair|project display|exhibit/i.test(desc)) locationKey = 'plant_display';
  else if (/equipment room|instrument storage|lab equipment/i.test(desc)) locationKey = 'equipment_room';

  // Library locations
  else if (/special collection|rare book|archive|heritage/i.test(desc)) locationKey = 'special_collection';
  else if (/front desk|service desk|librarian|checkout/i.test(desc)) locationKey = 'front_desk';
  else if (/reading room|study area|quiet zone|carrel/i.test(desc)) locationKey = 'reading_room';
  else if (/children.?s section|kids.?area|picture book/i.test(desc)) locationKey = 'children_section';
  else if (/library|book|reading|nlb/i.test(desc)) locationKey = 'library';

  // Sports locations
  else if (/main court|badminton|competition court|championship/i.test(desc)) locationKey = 'main_court';
  else if (/locker room|changing room|shower/i.test(desc)) locationKey = 'locker_room';
  else if (/sports hall|gymnasium|basketball/i.test(desc)) locationKey = 'sports_hall';

  // Market locations
  else if (/fish stall|seafood|fishmonger/i.test(desc)) locationKey = 'fish_stall';
  else if (/market office|management office|nea office/i.test(desc)) locationKey = 'market_office';
  else if (/weighing station|certified scale|calibration/i.test(desc)) locationKey = 'weighing_station';
  else if (/loading bay|delivery area|unloading/i.test(desc)) locationKey = 'loading_bay';
  else if (/wet market|market|vendor|stall/i.test(desc)) locationKey = 'wet_market';

  // GENERIC LOCATIONS (fallback)
  else if (/school|classroom|teacher|student|education/i.test(desc)) locationKey = 'school';
  else if (/lab|laboratory|science|research/i.test(desc)) locationKey = 'laboratory';
  else if (/hospital|clinic|medical|doctor|nurse|patient/i.test(desc)) locationKey = 'hospital';
  else if (/hawker|food court|kopitiam|eating/i.test(desc)) locationKey = 'hawker_center';
  else if (/mrt|train|station|platform|commuter/i.test(desc)) locationKey = 'mrt_station';
  else if (/hdb|flat|apartment|home|residence/i.test(desc)) locationKey = 'hdb_flat';
  else if (/mall|shopping|retail|store/i.test(desc)) locationKey = 'shopping_mall';
  else if (/warehouse|industrial|factory/i.test(desc)) locationKey = 'warehouse';
  else if (/restaurant|cafe|dining/i.test(desc)) locationKey = 'restaurant';
  else if (/park|garden|outdoor|nature/i.test(desc)) locationKey = 'park';
  else if (/office|corporate|meeting|board/i.test(desc)) locationKey = 'office';

  const locationTemplate = LOCATION_TEMPLATES[locationKey] || LOCATION_TEMPLATES['school'];

  // Build zone-based evidence description for embedding in scene
  let evidenceDescription = '';
  if (embeddedClues && embeddedClues.length > 0) {
    const floorClues = embeddedClues.filter(c => (c.positionY ?? 50) > 65);
    const surfaceClues = embeddedClues.filter(c => {
      const y = c.positionY ?? 50;
      return y >= 40 && y <= 65;
    });
    const wallClues = embeddedClues.filter(c => (c.positionY ?? 50) < 40);

    const zoneParts: string[] = [];

    if (floorClues.length > 0) {
      const floorItems = floorClues.slice(0, 2).map(clue =>
        (clue.visualCue?.split(',')[0].trim() || clue.title).toLowerCase()
      ).filter(Boolean);
      if (floorItems.length > 0) {
        zoneParts.push(`on the floor in foreground: ${floorItems.join(', ')}`);
      }
    }

    if (surfaceClues.length > 0) {
      const surfaceItems = surfaceClues.slice(0, 2).map(clue =>
        (clue.visualCue?.split(',')[0].trim() || clue.title).toLowerCase()
      ).filter(Boolean);
      if (surfaceItems.length > 0) {
        zoneParts.push(`on table/desk surface: ${surfaceItems.join(', ')}`);
      }
    }

    if (wallClues.length > 0) {
      const wallItems = wallClues.slice(0, 2).map(clue =>
        (clue.visualCue?.split(',')[0].trim() || clue.title).toLowerCase()
      ).filter(Boolean);
      if (wallItems.length > 0) {
        zoneParts.push(`on wall/background: ${wallItems.join(', ')}`);
      }
    }

    if (zoneParts.length > 0) {
      evidenceDescription = `visible evidence items: ${zoneParts.join(', ')}, yellow evidence markers with numbers`;
    }
  }

  // Scene type specific enhancements
  let sceneTypeDetails = '';
  if (scene.sceneType === 'security') {
    sceneTypeDetails = 'security monitoring room, multiple CCTV screens, access control panel, surveillance equipment rack';
  } else if (scene.sceneType === 'work_area') {
    sceneTypeDetails = 'personal work station area, employee belongings, storage lockers, name tags visible';
  } else if (scene.sceneType === 'investigation') {
    sceneTypeDetails = 'forensic investigation setup, evidence collection in progress, crime scene markers';
  } else if (scene.sceneType === 'resolution') {
    sceneTypeDetails = 'confrontation scene, evidence laid out on table, interview setting';
  }

  // Build comprehensive scene prompt
  const promptParts = [
    // QUALITY PRESET FIRST
    QUALITY_PRESETS.scene,
    // Main scene description
    scene.description,
    // Location-specific details
    locationTemplate.architecture,
    locationTemplate.furniture,
    locationTemplate.lighting,
    locationTemplate.atmosphere,
    locationTemplate.singaporeDetails,
    // Scene type details
    sceneTypeDetails,
    // Evidence in scene
    evidenceDescription,
    // Crime scene elements
    'police investigation in progress',
    'yellow crime scene tape cordoning area',
    'forensic markers on floor',
    // Composition
    'wide angle interior shot',
    'centered symmetrical composition',
    'eye-level camera angle',
    'no people visible in frame',
    // Technical quality
    'sharp focus throughout',
    '8k uhd resolution',
    'HDR lighting',
  ].filter(Boolean);

  return promptParts.join(', ');
}

/**
 * Evidence type visual descriptions for different categories - ENHANCED
 */
const EVIDENCE_TYPE_VISUALS: Record<string, {
  style: string;
  lighting: string;
  composition: string;
  details: string;
  background: string;
  props: string;
}> = {
  physical: {
    style: 'forensic evidence photograph, police evidence documentation, crime scene investigation photo',
    lighting: 'clinical forensic flash lighting, bright even illumination with no shadows, professional evidence lighting setup',
    composition: 'close-up macro shot centered on evidence, yellow evidence marker with number prominently visible, measuring ruler for scale alongside item',
    details: 'highly detailed surface textures, visible forensic powder dust if fingerprint-related, evidence bag edge visible, sharp focus on key features',
    background: 'sterile grey evidence examination table, clean neutral backdrop, forensic lab surface',
    props: 'yellow numbered evidence marker, metric measuring ruler, evidence collection tweezers nearby, latex gloves visible at edge',
  },
  document: {
    style: 'document photography, paper evidence archival documentation, official police record photo',
    lighting: 'soft diffused lighting to eliminate glare, even illumination across entire document, copy stand lighting setup',
    composition: 'flat lay top-down bird eye view, entire document visible within frame, straight edges aligned, evidence tag in corner',
    details: 'readable text clearly visible, paper texture and grain shown, any creases folds or damage documented, date stamps visible',
    background: 'clean document examination surface, archival grey backdrop, evidence photography mat',
    props: 'evidence tag with case number, scale reference card, document examination magnifier nearby',
  },
  digital: {
    style: 'digital forensics documentation, screen capture photograph, cyber evidence photo',
    lighting: 'screen glow as primary light source, ambient office lighting supplement, realistic monitor illumination',
    composition: 'device screen clearly visible and readable, timestamp overlay on screen, forensic analysis software interface shown',
    details: 'clear readable display text, evidence of digital analysis tools, metadata visible, file properties shown',
    background: 'digital forensics workstation, dark cyber lab environment, multiple monitors visible',
    props: 'forensic write-blocker device, evidence hard drive, USB forensic tools, digital chain of custody form',
  },
  testimony: {
    style: 'interview documentation photograph, witness statement record, official declaration photo',
    lighting: 'soft professional indoor lighting, interview room ambiance, formal documentation setting',
    composition: 'official document or statement form visible, signing pen nearby, formal letterhead shown',
    details: 'handwritten or typed statement text, signature line visible, official stamps and seals, date and time recorded',
    background: 'interview room table surface, police station desk, formal office setting',
    props: 'official statement form, black signing pen, witness badge, recording device indicator',
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
 * Build clue/evidence image prompt - STORY-ACCURATE version
 * Prioritizes the actual description from the case narrative
 * The visual should match EXACTLY what's described in the story
 */
export function buildCluePrompt(clue: {
  title: string;
  description: string;
  type: string;
  relevance: string;
  /** Visual description from evidence templates - HIGHEST PRIORITY for image generation */
  visualCue?: string;
  analysisResult?: string;
}): {
  prompt: string;
  negativePrompt: string;
} {
  // Get type-specific visual settings
  const typeVisuals = EVIDENCE_TYPE_VISUALS[clue.type] || EVIDENCE_TYPE_VISUALS.physical;

  // HIGHEST PRIORITY: visualCue is the most specific visual description
  // It should describe EXACTLY what the evidence looks like
  const visualCue = clue.visualCue || '';

  // Parse the description for specific visual elements
  // This is the actual story description that should be matched
  const storyDescription = clue.description;

  // Extract key visual nouns and adjectives from description
  const visualElements = extractVisualElements(storyDescription);

  // Detect specific evidence keywords for detailed prompts
  const keywordDetails = detectEvidenceKeywords(storyDescription, clue.title);

  // Build prompt with STORY ACCURACY as the TOP priority
  // Using weighted tags to ensure the description content dominates
  const promptParts = [
    // 1. QUALITY PRESET - technical foundation
    QUALITY_PRESETS.evidence,

    // 2. PRIMARY CONTENT - HIGHEST WEIGHT - what the image MUST show
    // The visualCue is the most specific description
    visualCue ? `(${visualCue}:1.5)` : '',
    // The actual story description with high weight
    `(${storyDescription}:1.4)`,
    // The title describes what this evidence IS
    `(${clue.title}:1.3)`,

    // 3. DETECTED KEYWORDS - specific visual details from content
    keywordDetails ? `(${keywordDetails}:1.2)` : '',

    // 4. EXTRACTED VISUAL ELEMENTS - key objects/colors/materials
    visualElements,

    // 5. Photography style - lower weight, just for quality
    'evidence photograph',
    typeVisuals.style,
    typeVisuals.lighting,
    typeVisuals.composition,

    // 6. Basic quality tags
    'sharp focus', 'high detail', 'photorealistic',
  ].filter(Boolean);

  // Build negative prompt - prevent things that contradict the description
  const negativePrompt = [
    ENHANCED_NEGATIVE.evidence,
    // No people unless specifically in description
    !storyDescription.toLowerCase().includes('person') && !storyDescription.toLowerCase().includes('human')
      ? '(person:1.8), (people:1.8), (face:1.8), (human:1.8)' : '',
    // No hands unless specifically mentioned
    !storyDescription.toLowerCase().includes('hand')
      ? '(hands:1.5), (fingers:1.5)' : '',
    // General quality issues
    'blurry, out of focus, low quality',
    'wrong item, different object, incorrect evidence',
    'cartoon, anime, illustration, drawing',
  ].filter(Boolean).join(', ');

  return {
    prompt: promptParts.join(', '),
    negativePrompt,
  };
}

/**
 * Extract visual elements (objects, colors, materials) from description
 * Helps ensure the prompt includes specific visual details from the story
 */
function extractVisualElements(description: string): string {
  const elements: string[] = [];

  // Colors
  const colors = description.match(/\b(red|blue|green|yellow|black|white|brown|grey|gray|orange|purple|pink|silver|gold|metallic|transparent|clear)\b/gi);
  if (colors) elements.push(...colors.map(c => c.toLowerCase()));

  // Materials
  const materials = description.match(/\b(paper|metal|plastic|glass|wood|fabric|leather|rubber|ceramic|cardboard|digital|electronic)\b/gi);
  if (materials) elements.push(...materials.map(m => m.toLowerCase()));

  // Common evidence objects
  const objects = description.match(/\b(note|letter|receipt|phone|laptop|computer|key|card|badge|document|file|folder|photo|photograph|bottle|container|bag|box|tool|knife|weapon|money|cash|coin)\b/gi);
  if (objects) elements.push(...objects.map(o => o.toLowerCase()));

  // Conditions/states
  const states = description.match(/\b(broken|torn|crumpled|folded|stained|dusty|dirty|clean|new|old|worn|damaged)\b/gi);
  if (states) elements.push(...states.map(s => s.toLowerCase()));

  return elements.length > 0 ? elements.join(', ') : '';
}
