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

  // IMPORTANT: For Pony Diffusion, gender token MUST be first, followed by age, then occupation
  const occupationClothing = getOccupationClothing(suspect.role.toLowerCase());

  const promptParts = [
    // 1. GENDER FIRST (most important for Pony)
    `1${personInfo.gender}`, 'solo',
    // 2. AGE second
    personInfo.ageDescriptor,
    personInfo.agePrompt,
    // 3. OCCUPATION third
    suspect.role, occupationClothing,
    // 4. Quality/safety tags
    'score_9, score_8_up, score_7_up',
    'rating_safe', 'safe_for_work', 'sfw',
    'single person', 'one person only', 'alone',
  ];

  if (personInfo.religiousAttire && personInfo.religion === 'Muslim') {
    promptParts.push(personInfo.religiousAttire);
  }

  promptParts.push(
    'photorealistic', 'realistic', 'real life photo', 'photograph', 'real person',
    'dignified', 'respectful portrayal', 'professional appearance',
    'non-glamorous', 'documentary style', 'news photo style',
    'professional portrait', 'corporate ID photo', 'passport photo style',
    'neutral appearance', 'ordinary person', 'average looking person',
    'plain appearance', 'normal person'
  );

  promptParts.push(
    `${ethnicityInfo.race} ethnicity`,
    ethnicityInfo.ethnicity,
    ethnicityInfo.skinTone,
    'natural realistic human skin color',
    'accurate ethnic skin tone',
    'beautiful natural complexion',
    ethnicityInfo.features
  );

  if (personInfo.religiousAttire && personInfo.religion !== 'Muslim') {
    promptParts.push(personInfo.religiousAttire);
  }

  // Add expression (occupation already added at the top)
  promptParts.push(expression);

  promptParts.push(
    'FULLY CLOTHED', 'wearing complete conservative outfit',
    'MODEST clothing', 'CONSERVATIVE attire', 'appropriate family-friendly attire',
    'professional formal attire', 'covered shoulders', 'covered arms',
    'long sleeves preferred', 'high neckline', 'no skin showing',
    'buttoned up shirt', 'formal professional look',
    'professional ID photo', 'passport photo style', 'corporate headshot',
    'front facing', 'looking at camera',
    'neutral professional expression', 'natural dignified pose',
    'soft natural lighting', 'plain white background',
    'natural human skin only', 'realistic skin texture', 'natural skin pores',
    'normal human eyes', 'natural eye color brown or black',
    'NO fantasy colors', 'NO unnatural skin',
    'high resolution', 'sharp focus', 'detailed',
    '35mm photograph', 'natural colors only',
    'family friendly', 'appropriate for children', 'educational content'
  );

  const isMale = personInfo.gender === 'man' || personInfo.gender === 'boy' ||
                 personInfo.gender === 'teenage boy' || personInfo.gender === 'elderly man';
  const oppositeGender = isMale
    ? '1woman, 1girl, female, woman, girl, feminine, breasts, long hair, makeup, lipstick'
    : '1man, 1boy, male, man, boy, masculine, beard, mustache, stubble, adam\'s apple';

  const negativePrompt = [
    oppositeGender,
    'score_6, score_5, worst quality, low quality, blurry, jpeg artifacts',
    'nsfw, nude, naked, revealing, suggestive, inappropriate',
    'anime, cartoon, manga, illustration, 3d, cgi, digital art',
    'unnatural skin, fantasy colors, glowing eyes, deformed, bad anatomy',
    'extra limbs, missing fingers, bad hands, ugly, distorted',
    'watermark, text, logo, multiple people, crowd, two people, 2people, duo, pair, group, couple',
  ].join(', ');

  return {
    prompt: promptParts.join(', '),
    negativePrompt,
    metadata: { gender: personInfo.gender, age: personInfo.age }
  };
}

/**
 * Build cover image prompt
 */
export function buildCoverPrompt(caseData: GeneratedCase, subject: string): string {
  const storyKeywords = caseData.story.setting.split(' ').slice(0, 10).join(' ');
  const subjectElements = subject === 'MATH' ? 'mathematical equations' :
                          subject === 'SCIENCE' ? 'scientific equipment' : 'math and science elements';

  return `score_9, score_8_up, score_7_up, manila case folder file, detective case file, classified document, ${storyKeywords}, ${subjectElements}, mysterious noir atmosphere, dramatic lighting, vintage paper texture, masterpiece, best quality, 8k`;
}

/**
 * Build scene image prompt
 */
export function buildScenePrompt(scene: { description: string; locationType?: string }): string {
  return `score_9, score_8_up, score_7_up, ${scene.description}, ${scene.locationType || 'indoor location'}, Singapore setting, crime scene investigation area, evidence markers visible, forensic lighting, photorealistic, detailed environment, masterpiece, best quality, 8k, architectural photography`;
}

/**
 * Build clue/evidence image prompt
 */
export function buildCluePrompt(clue: { description: string; type: string; relevance: string }): string {
  const highlight = clue.relevance === 'critical' ? 'key evidence highlighted' : '';
  return `score_9, score_8_up, score_7_up, ${clue.description}, ${clue.type} evidence, forensic evidence photography, evidence marker visible, close-up documentation shot, ${highlight}, photorealistic, detailed textures, masterpiece, best quality, 8k, macro photography`;
}
