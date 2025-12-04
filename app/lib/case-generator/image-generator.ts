/**
 * AI IMAGE GENERATION SERVICE
 *
 * Generates photo-realistic images for case content using AI image generation.
 * Designed for integration with ComfyUI, Stable Diffusion, DALL-E, or similar services.
 *
 * All prompts are crafted for maximum quality and realism.
 */

import { nanoid } from 'nanoid';

// ============================================
// TYPES
// ============================================

export interface ImageGenerationRequest {
  id: string;
  type: 'scene' | 'suspect' | 'evidence' | 'clue' | 'puzzle' | 'cover';
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  settings: ImageSettings;
  metadata: Record<string, unknown>;
}

export interface ImageSettings {
  model: string;
  sampler: string;
  steps: number;
  cfgScale: number;
  seed?: number;
  style?: string;
}

export interface GeneratedImage {
  id: string;
  requestId: string;
  type: ImageGenerationRequest['type'];
  url?: string;          // URL after generation
  base64?: string;       // Base64 data
  prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  metadata: Record<string, unknown>;
}

// ============================================
// IMAGE GENERATION SETTINGS
// ============================================

// ============================================
// PONY DIFFUSION MODEL SETTINGS
// ============================================

// Pony Diffusion quality tags (prepended to all prompts)
const ponyQualityTags = {
  highest: 'score_9, score_8_up, score_7_up, score_6_up, source_realistic',
  high: 'score_8_up, score_7_up, score_6_up, source_realistic',
  good: 'score_7_up, score_6_up, source_realistic',
};

// Pony Diffusion negative quality tags
const ponyNegativeQuality = 'score_6, score_5, score_4, source_pony, source_furry, source_cartoon';

const defaultSettings: ImageSettings = {
  model: 'ponyDiffusionV6XL',  // Pony Diffusion V6 XL
  sampler: 'Euler a',
  steps: 25,
  cfgScale: 7.0,
  style: 'realistic',
};

const sceneSettings: ImageSettings = {
  ...defaultSettings,
  model: 'ponyDiffusionV6XL',
  sampler: 'DPM++ 2M Karras',
  steps: 30,
  cfgScale: 6.5,
};

const portraitSettings: ImageSettings = {
  ...defaultSettings,
  model: 'ponyDiffusionV6XL',
  sampler: 'Euler a',
  steps: 28,
  cfgScale: 7.0,
};

const evidenceSettings: ImageSettings = {
  ...defaultSettings,
  model: 'ponyDiffusionV6XL',
  sampler: 'DPM++ SDE Karras',
  steps: 25,
  cfgScale: 7.0,
};

// ============================================
// NEGATIVE PROMPTS (Quality Control)
// ============================================

// Pony Diffusion V6 optimized negative prompts
const baseNegativePrompt = `
${ponyNegativeQuality},
(worst quality:2), (low quality:2), (normal quality:1.5),
bad anatomy, bad proportions, bad hands, extra fingers, fewer fingers, missing fingers,
text, watermark, signature, username, artist name, logo, copyright,
blurry, out of focus, motion blur, chromatic aberration,
oversaturated, undersaturated, overexposed, underexposed,
deformed, distorted, disfigured, mutated, ugly, duplicate,
cropped, frame, border, jpeg artifacts, compression artifacts
`.trim().replace(/\n/g, ' ');

const portraitNegativePrompt = `
${ponyNegativeQuality},
(worst quality:2), (low quality:2), bad anatomy, bad proportions,
bad face, ugly face, deformed face, asymmetrical face, asymmetrical eyes,
extra limbs, missing limbs, floating limbs, disconnected limbs,
poorly drawn face, poorly drawn hands, extra fingers, fewer fingers,
cross-eyed, strabismus, looking away, closed eyes,
bad teeth, crooked teeth, broken teeth,
watermark, signature, text, logo,
blurry, out of focus, grainy, noisy
`.trim().replace(/\n/g, ' ');

const sceneNegativePrompt = `
${ponyNegativeQuality},
(worst quality:2), (low quality:2), bad anatomy,
text, watermark, signature, logo, copyright,
blurry, out of focus, motion blur,
people, person, human figure, crowd, pedestrian,
cluttered, messy, disorganized,
dark, underexposed, overexposed,
jpeg artifacts, compression artifacts
`.trim().replace(/\n/g, ' ');

// ============================================
// SINGAPORE-SPECIFIC CONTEXT
// ============================================

const singaporeContext = {
  architecture: 'modern Singapore HDB flats, tropical architecture, covered walkways, void decks',
  vegetation: 'tropical plants, palm trees, rain trees, bougainvillea, frangipani',
  weather: 'tropical climate, humid atmosphere, occasional rain clouds',
  lighting: {
    day: 'bright tropical sunlight, harsh shadows, clear blue sky',
    morning: 'soft golden morning light, misty atmosphere, dew on surfaces',
    evening: 'warm orange sunset light, long shadows, golden hour',
    night: 'warm artificial lights, neon signs, street lamps, humid night air',
  },
  details: 'Singapore context, Southeast Asian setting, multicultural environment',
};

// ============================================
// SCENE PROMPT TEMPLATES
// ============================================

interface SceneTemplate {
  name: string;
  basePrompt: string;
  details: string[];
  lighting: string;
  atmosphere: string;
  cameraAngle: string;
}

const sceneTemplates: Record<string, SceneTemplate[]> = {
  school: [
    {
      name: 'Classroom',
      basePrompt: 'photorealistic interior of a modern Singapore primary school classroom',
      details: [
        'rows of wooden desks with blue chairs',
        'large whiteboard on front wall',
        'educational posters and student artwork on walls',
        'air conditioning unit near ceiling',
        'fluorescent lighting',
        'textbooks and stationery on desks',
        'windows with venetian blinds',
        'clean tiled floor',
      ],
      lighting: 'bright fluorescent lighting mixed with natural daylight from windows',
      atmosphere: 'educational environment, quiet study atmosphere',
      cameraAngle: 'wide angle shot from back corner of classroom, eye level perspective',
    },
    {
      name: 'School Library',
      basePrompt: 'photorealistic interior of a modern Singapore school library',
      details: [
        'tall wooden bookshelves filled with books',
        'comfortable reading chairs and bean bags',
        'computer workstations along one wall',
        'librarian counter with computers',
        'quiet study tables with desk lamps',
        'carpet flooring in reading area',
        'educational displays and reading challenges posted',
      ],
      lighting: 'soft ambient lighting, reading lamps on tables, natural light from skylights',
      atmosphere: 'quiet, studious, welcoming for young readers',
      cameraAngle: 'medium shot showing depth of library, slightly elevated angle',
    },
    {
      name: 'Science Laboratory',
      basePrompt: 'photorealistic interior of a Singapore school science laboratory',
      details: [
        'lab benches with black resin tops',
        'scientific equipment: microscopes, beakers, test tubes',
        'safety equipment: fire extinguisher, eye wash station, first aid kit',
        'chemical storage cabinets with warning labels',
        'periodic table poster on wall',
        'lab stools tucked under benches',
        'safety goggles rack near door',
        'whiteboard with scientific diagrams',
      ],
      lighting: 'bright clinical lighting, some natural light from high windows',
      atmosphere: 'scientific, organized, slightly clinical',
      cameraAngle: 'wide angle shot from entrance, showing full lab layout',
    },
  ],

  neighborhood: [
    {
      name: 'HDB Void Deck',
      basePrompt: 'photorealistic Singapore HDB void deck ground floor common area',
      details: [
        'concrete pillars supporting the building',
        'stone benches and tables',
        'notice boards with community announcements',
        'letterboxes along one wall',
        'bicycle parking area',
        'lift lobby visible in background',
        'potted plants adding greenery',
        'polished granite floor tiles',
      ],
      lighting: singaporeContext.lighting.day,
      atmosphere: 'community space, quiet afternoon, typical Singapore heartland',
      cameraAngle: 'eye level shot looking through void deck, depth perspective',
    },
    {
      name: 'Neighborhood Park',
      basePrompt: 'photorealistic Singapore neighborhood park and playground',
      details: [
        'colorful modern playground equipment',
        'rubberized safety flooring under playground',
        'jogging path winding through',
        'fitness corner with exercise equipment',
        'park benches under shade',
        'lush tropical landscaping',
        'rain trees providing shade',
        'HDB blocks visible in background',
      ],
      lighting: singaporeContext.lighting.evening,
      atmosphere: 'peaceful community space, families and elderly residents',
      cameraAngle: 'wide angle shot showing playground and surrounding area',
    },
    {
      name: 'Hawker Centre',
      basePrompt: 'photorealistic Singapore hawker centre food court',
      details: [
        'rows of food stalls with lit signage',
        'shared tables and plastic stools',
        'ceiling fans spinning overhead',
        'trays and dishes on tables',
        'drinks stall with colorful display',
        'tray return station',
        'steam rising from cooking',
        'bustling atmosphere',
      ],
      lighting: 'warm fluorescent lights, steam catching the light, neon signs',
      atmosphere: 'busy lunch crowd, authentic Singapore food culture',
      cameraAngle: 'medium shot from seated perspective, showing food stalls in background',
    },
  ],

  commercial: [
    {
      name: 'Convenience Store',
      basePrompt: 'photorealistic interior of a Singapore 7-Eleven convenience store',
      details: [
        'well-lit aisles with snacks and drinks',
        'refrigerated drink display along wall',
        'cashier counter with register',
        'hot food warmer near counter',
        'magazine and newspaper rack',
        'ATM machine near entrance',
        'security camera dome on ceiling',
        'promotional displays and price tags',
      ],
      lighting: 'bright white LED lighting, refrigerator glow, 24-hour store atmosphere',
      atmosphere: 'late night convenience store, quiet moment',
      cameraAngle: 'from entrance looking toward cashier, wide angle',
    },
    {
      name: 'Shopping Mall Corridor',
      basePrompt: 'photorealistic Singapore shopping mall interior corridor',
      details: [
        'polished marble floor reflecting lights',
        'glass storefronts with displays',
        'escalators connecting floors',
        'digital directories and maps',
        'decorative plants in planters',
        'modern architectural design',
        'air-conditioned comfort',
        'subtle background music atmosphere',
      ],
      lighting: 'bright modern retail lighting, accent lights on displays, natural light from skylights',
      atmosphere: 'busy shopping environment, weekend crowd',
      cameraAngle: 'eye level walking perspective down corridor',
    },
  ],

  investigation: [
    {
      name: 'Detective Office',
      basePrompt: 'photorealistic detective office investigation room',
      details: [
        'large cork evidence board with photos and strings',
        'wooden desk covered in case files',
        'desktop computer with multiple monitors',
        'filing cabinets against wall',
        'desk lamp providing focused light',
        'coffee cup and takeaway containers',
        'blinds partially closed on window',
        'coatrack with jacket and hat',
      ],
      lighting: 'moody desk lamp lighting, some natural light through blinds, noir atmosphere',
      atmosphere: 'focused investigation, late night work session',
      cameraAngle: 'over the shoulder view of desk, evidence board in background',
    },
    {
      name: 'Crime Scene',
      basePrompt: 'photorealistic crime scene investigation area with evidence markers',
      details: [
        'yellow evidence markers on floor',
        'police tape cordoning area',
        'forensic equipment cases',
        'evidence bags and collection tools',
        'camera on tripod for documentation',
        'bright forensic lighting',
        'measuring tape laid out',
        'investigators in background (blurred)',
      ],
      lighting: 'harsh forensic lighting, camera flash effect, clinical brightness',
      atmosphere: 'serious investigation, professional forensic work',
      cameraAngle: 'low angle showing evidence markers, shallow depth of field',
    },
  ],
};

// ============================================
// SUSPECT PORTRAIT PROMPTS
// ============================================

interface SuspectPromptParams {
  name: string;
  role: string;
  ethnicity: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
  gender: 'male' | 'female';
  ageGroup: 'young' | 'middle' | 'senior';
  expression: 'neutral' | 'nervous' | 'confident' | 'worried' | 'suspicious';
  isGuilty: boolean;
}

function generateSuspectPortraitPrompt(params: SuspectPromptParams): string {
  const ageDescriptions = {
    young: params.gender === 'male' ? 'young man in his 20s' : 'young woman in her 20s',
    middle: params.gender === 'male' ? 'middle-aged man in his 40s' : 'middle-aged woman in her 40s',
    senior: params.gender === 'male' ? 'elderly man in his 60s' : 'elderly woman in her 60s',
  };

  const ethnicFeatures = {
    Chinese: 'East Asian features, Singaporean Chinese',
    Malay: 'Southeast Asian Malay features',
    Indian: 'South Asian Indian features',
    Eurasian: 'mixed Eurasian features, Singaporean Eurasian',
  };

  const expressions = {
    neutral: 'neutral calm expression, direct gaze at camera',
    nervous: 'slightly nervous expression, avoiding direct eye contact, tense jaw',
    confident: 'confident relaxed expression, slight knowing smile',
    worried: 'worried concerned expression, furrowed brow, troubled eyes',
    suspicious: 'guarded suspicious expression, narrowed eyes, tight lips',
  };

  const occupationClothing: Record<string, string> = {
    teacher: 'wearing professional blouse/shirt, teacher ID lanyard',
    shopkeeper: 'wearing casual polo shirt with apron',
    student: 'wearing Singapore school uniform',
    'office worker': 'wearing formal business attire, office wear',
    chef: 'wearing white chef jacket and hat',
    security: 'wearing dark security guard uniform',
    cleaner: 'wearing work coveralls or cleaning uniform',
    delivery: 'wearing company branded polo shirt',
    default: 'wearing smart casual Singapore attire',
  };

  const clothing = occupationClothing[params.role.toLowerCase()] || occupationClothing.default;

  // Pony Diffusion V6 formatted portrait prompt
  return `
${ponyQualityTags.highest},
1person, solo, portrait, looking at viewer,
${ageDescriptions[params.ageGroup]},
${ethnicFeatures[params.ethnicity]},
${expressions[params.expression]},
${clothing},
photorealistic, realistic skin, detailed face, detailed eyes,
professional headshot, studio lighting, soft lighting,
sharp focus, shallow depth of field,
neutral grey background, clean background,
masterpiece, best quality, absurdres, 8k,
DSLR photo, RAW photo, 85mm portrait lens,
detailed skin texture, skin pores, natural skin tones
`.trim().replace(/\n/g, ' ');
}

// ============================================
// EVIDENCE IMAGE PROMPTS
// ============================================

interface EvidencePromptParams {
  type: 'physical' | 'document' | 'digital';
  item: string;
  condition: 'pristine' | 'worn' | 'damaged' | 'partial';
  context?: string;
}

const evidenceItems: Record<string, Record<string, string>> = {
  physical: {
    fingerprint: 'close-up photograph of a fingerprint on glass surface, forensic lighting, evidence marker visible',
    footprint: 'photograph of shoe footprint in dust/dirt, measuring ruler alongside, evidence marker',
    key: 'photograph of a brass key on evidence bag, macro shot, detailed engravings visible',
    fabric: 'close-up of torn fabric fibers, forensic tweezers holding sample, evidence collection',
    hair: 'forensic photograph of hair strands in evidence bag, labeled and documented',
    glass: 'broken glass fragments on floor, evidence markers numbered, forensic lighting',
    weapon: 'photograph of potential weapon in evidence bag, case number label, forensic documentation',
    container: 'empty container or bottle as evidence, fingerprint dust visible, evidence tag',
  },
  document: {
    receipt: 'crumpled paper receipt, partial text visible, evidence bag, dated timestamp',
    note: 'handwritten note on paper, cryptic message, evidence photography, ruler for scale',
    photograph: 'printed photograph as evidence, showing location or person, evidence marker',
    map: 'hand-drawn or printed map with markings, circled locations, folded creases',
    schedule: 'printed schedule or calendar with annotations, highlighted times',
    letter: 'envelope and letter as evidence, evidence bag, forensic handling',
    id_card: 'identification card in evidence bag, some details obscured, official format',
    ticket: 'ticket stub or receipt, date and time visible, evidence documentation',
  },
  digital: {
    cctv: 'CCTV security camera footage still, timestamp overlay, grainy night vision quality',
    phone: 'smartphone screen showing messages or call log, evidence documentation',
    email: 'printed email screenshot, highlighted passages, evidence folder',
    computer: 'computer screen showing files or browser history, forensic analysis',
    social_media: 'screenshot of social media post, timestamp visible, printed for evidence',
    gps: 'GPS tracking data on map, route highlighted, location pins marked',
  },
};

function generateEvidencePrompt(params: EvidencePromptParams): string {
  const conditionModifiers = {
    pristine: 'clean and well-preserved condition',
    worn: 'showing signs of use and wear',
    damaged: 'partially damaged or deteriorated',
    partial: 'incomplete or partially visible',
  };

  const itemPrompt = evidenceItems[params.type]?.[params.item] ||
    `photograph of ${params.item} as evidence, forensic documentation style`;

  // Pony Diffusion V6 formatted evidence prompt
  return `
${ponyQualityTags.highest},
no humans, still life, object focus,
${itemPrompt},
${conditionModifiers[params.condition]},
photorealistic, realistic textures, realistic lighting,
forensic evidence photography, police evidence photo,
professional documentation lighting, clinical lighting,
evidence collection setting, evidence marker visible,
masterpiece, best quality, absurdres, 8k,
DSLR photo, macro photography, sharp focus,
high detail, detailed textures,
${params.context ? `context: ${params.context}` : ''}
`.trim().replace(/\n/g, ' ');
}

// ============================================
// MAIN GENERATION FUNCTIONS
// ============================================

export function createSceneImageRequest(
  category: keyof typeof sceneTemplates,
  sceneName?: string,
  timeOfDay: 'day' | 'morning' | 'evening' | 'night' = 'day'
): ImageGenerationRequest {
  const templates = sceneTemplates[category];
  const template = sceneName
    ? templates.find(t => t.name === sceneName) || templates[0]
    : templates[Math.floor(Math.random() * templates.length)];

  const selectedDetails = template.details
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .join(', ');

  // Pony Diffusion V6 formatted prompt with quality tags
  const prompt = `
${ponyQualityTags.highest},
${template.basePrompt},
${selectedDetails},
${template.lighting || singaporeContext.lighting[timeOfDay]},
${template.atmosphere},
${template.cameraAngle},
${singaporeContext.details},
photorealistic, realistic lighting, realistic textures,
8k UHD, masterpiece, best quality, absurdres,
professional photography, DSLR photo, RAW photo,
architectural photography, perfect composition, HDR
`.trim().replace(/\n/g, ' ');

  return {
    id: `scene-${nanoid(8)}`,
    type: 'scene',
    prompt,
    negativePrompt: sceneNegativePrompt,
    width: 1920,
    height: 1080,
    settings: sceneSettings,
    metadata: {
      category,
      sceneName: template.name,
      timeOfDay,
    },
  };
}

export function createSuspectImageRequest(
  params: SuspectPromptParams
): ImageGenerationRequest {
  const prompt = generateSuspectPortraitPrompt(params);

  return {
    id: `suspect-${nanoid(8)}`,
    type: 'suspect',
    prompt,
    negativePrompt: portraitNegativePrompt,
    width: 768,
    height: 1024,
    settings: portraitSettings,
    metadata: {
      name: params.name,
      role: params.role,
      ethnicity: params.ethnicity,
      isGuilty: params.isGuilty,
    },
  };
}

export function createEvidenceImageRequest(
  params: EvidencePromptParams
): ImageGenerationRequest {
  const prompt = generateEvidencePrompt(params);

  return {
    id: `evidence-${nanoid(8)}`,
    type: 'evidence',
    prompt,
    negativePrompt: baseNegativePrompt,
    width: 1024,
    height: 1024,
    settings: evidenceSettings,
    metadata: {
      type: params.type,
      item: params.item,
      condition: params.condition,
    },
  };
}

export function createCoverImageRequest(
  title: string,
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  difficulty: string
): ImageGenerationRequest {
  const subjectElements = {
    MATH: 'mathematical equations, numbers, geometric shapes subtly visible',
    SCIENCE: 'scientific equipment, molecules, atoms subtly visible',
    INTEGRATED: 'blend of math symbols and science equipment subtly visible',
  };

  // Pony Diffusion V6 formatted cover prompt
  const prompt = `
${ponyQualityTags.highest},
no humans, still life, object focus,
manila case folder file, detective case file,
classified document, confidential folder,
red "CLASSIFIED" stamp on cover,
${subjectElements[subject]},
mysterious noir atmosphere, dramatic lighting,
vintage paper texture, aged paper,
photorealistic, realistic textures,
masterpiece, best quality, absurdres, 8k,
professional product photography,
dramatic side lighting, moody atmosphere
`.trim().replace(/\n/g, ' ');

  return {
    id: `cover-${nanoid(8)}`,
    type: 'cover',
    prompt,
    negativePrompt: baseNegativePrompt,
    width: 1024,
    height: 1024,
    settings: defaultSettings,
    metadata: {
      title,
      subject,
      difficulty,
    },
  };
}

// ============================================
// COMPLETE CASE IMAGE REQUESTS
// ============================================

export interface CaseImageRequests {
  cover: ImageGenerationRequest;
  scenes: ImageGenerationRequest[];
  suspects: ImageGenerationRequest[];
  evidence: ImageGenerationRequest[];
}

export function generateAllCaseImageRequests(
  caseData: {
    title: string;
    subject: 'MATH' | 'SCIENCE' | 'INTEGRATED';
    difficulty: string;
    suspects: SuspectPromptParams[];
    evidenceItems: EvidencePromptParams[];
    sceneCategories: (keyof typeof sceneTemplates)[];
  }
): CaseImageRequests {
  // Cover image
  const cover = createCoverImageRequest(
    caseData.title,
    caseData.subject,
    caseData.difficulty
  );

  // Scene images (2-3 scenes per case)
  const scenes = caseData.sceneCategories.map(category =>
    createSceneImageRequest(category)
  );

  // Suspect portraits
  const suspects = caseData.suspects.map(suspect =>
    createSuspectImageRequest(suspect)
  );

  // Evidence images
  const evidence = caseData.evidenceItems.map(item =>
    createEvidenceImageRequest(item)
  );

  return {
    cover,
    scenes,
    suspects,
    evidence,
  };
}

// ============================================
// API INTEGRATION HELPERS
// ============================================

export interface ImageGenerationAPI {
  name: 'comfyui' | 'automatic1111' | 'replicate' | 'dalle' | 'midjourney';
  endpoint: string;
  apiKey?: string;
}

/**
 * Convert our request format to ComfyUI workflow format
 */
export function toComfyUIWorkflow(request: ImageGenerationRequest): object {
  return {
    prompt: {
      '3': {
        class_type: 'KSampler',
        inputs: {
          seed: request.settings.seed || Math.floor(Math.random() * 2147483647),
          steps: request.settings.steps,
          cfg: request.settings.cfgScale,
          sampler_name: request.settings.sampler,
          scheduler: 'normal',
          denoise: 1,
        },
      },
      '6': {
        class_type: 'CLIPTextEncode',
        inputs: {
          text: request.prompt,
        },
      },
      '7': {
        class_type: 'CLIPTextEncode',
        inputs: {
          text: request.negativePrompt,
        },
      },
      '5': {
        class_type: 'EmptyLatentImage',
        inputs: {
          width: request.width,
          height: request.height,
          batch_size: 1,
        },
      },
    },
    // Additional ComfyUI specific configurations
    client_id: request.id,
  };
}

/**
 * Convert our request format to Automatic1111 API format
 */
export function toAutomatic1111Format(request: ImageGenerationRequest): object {
  return {
    prompt: request.prompt,
    negative_prompt: request.negativePrompt,
    width: request.width,
    height: request.height,
    steps: request.settings.steps,
    cfg_scale: request.settings.cfgScale,
    sampler_name: request.settings.sampler,
    seed: request.settings.seed || -1,
    batch_size: 1,
    n_iter: 1,
  };
}

// Export templates for customization
export { sceneTemplates, evidenceItems };

// Export types for external use
export type { SuspectPromptParams, EvidencePromptParams };

// ============================================
// CASE-SPECIFIC CONTEXTUAL PROMPTS
// ============================================

/**
 * Full case context for generating 100% relevant images
 */
export interface CaseContext {
  title: string;
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED';
  difficulty: string;
  gradeLevel: string;
  story: {
    setting: string;      // Full scene description
    crime: string;        // Crime details
    resolution: string;   // How case is solved
    theme: string;        // Mystery theme
    location: string;     // Location name
    locationType: string; // Type of location (school, neighborhood, etc.)
  };
  timeOfDay: 'day' | 'morning' | 'evening' | 'night';
  atmosphere: 'mysterious' | 'tense' | 'calm' | 'urgent';
}

/**
 * Generate a scene image prompt that is 100% specific to the case context
 */
export function generateContextualScenePrompt(
  caseContext: CaseContext,
  sceneDescription: string,
  sceneName: string
): ImageGenerationRequest {
  // Build a prompt that incorporates exact case details
  const prompt = `
${ponyQualityTags.highest},
photorealistic scene photography,
${sceneDescription},
location: ${sceneName}, ${caseContext.story.setting},
Singapore setting, ${singaporeContext.details},
${singaporeContext.lighting[caseContext.timeOfDay]},
${caseContext.atmosphere} atmosphere,
investigation scene, mystery setting,
evidence of: ${caseContext.story.crime},
masterpiece, best quality, absurdres, 8k,
professional photography, DSLR photo, RAW photo,
architectural photography, perfect composition, HDR,
highly detailed environment, realistic textures, realistic lighting
`.trim().replace(/\n/g, ' ');

  return {
    id: `scene-${nanoid(8)}`,
    type: 'scene',
    prompt,
    negativePrompt: sceneNegativePrompt,
    width: 1920,
    height: 1080,
    settings: sceneSettings,
    metadata: {
      caseTitle: caseContext.title,
      sceneName,
      sceneDescription,
      location: caseContext.story.location,
      timeOfDay: caseContext.timeOfDay,
      atmosphere: caseContext.atmosphere,
    },
  };
}

/**
 * Generate suspect portrait specific to the case and their role in it
 */
export function generateContextualSuspectPrompt(
  caseContext: CaseContext,
  suspect: {
    name: string;
    role: string;
    alibi: string;
    personality: string[];
    isGuilty: boolean;
    motive?: string;
    ethnicity?: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
    gender?: 'male' | 'female';
    ageGroup?: 'young' | 'middle' | 'senior';
  }
): ImageGenerationRequest {
  // Determine ethnicity from name if not specified
  const ethnicity = suspect.ethnicity || inferEthnicityFromName(suspect.name);
  const gender = suspect.gender || 'male';
  const ageGroup = suspect.ageGroup || 'middle';

  // Build expression based on guilt status and personality
  let expression: 'neutral' | 'nervous' | 'confident' | 'worried' | 'suspicious' = 'neutral';
  if (suspect.isGuilty) {
    expression = suspect.personality.includes('Nervous') ? 'nervous' : 'suspicious';
  } else if (suspect.personality.includes('Confident')) {
    expression = 'confident';
  } else if (suspect.personality.includes('Worried')) {
    expression = 'worried';
  }

  // Generate personality-based clothing and appearance
  const personalityTraits = suspect.personality.join(', ').toLowerCase();

  const ageDescriptions = {
    young: gender === 'male' ? 'young man in his 20s' : 'young woman in her 20s',
    middle: gender === 'male' ? 'middle-aged man in his 40s' : 'middle-aged woman in her 40s',
    senior: gender === 'male' ? 'elderly man in his 60s' : 'elderly woman in her 60s',
  };

  const ethnicFeatures = {
    Chinese: 'East Asian features, Singaporean Chinese',
    Malay: 'Southeast Asian Malay features',
    Indian: 'South Asian Indian features',
    Eurasian: 'mixed Eurasian features, Singaporean Eurasian',
  };

  const expressions = {
    neutral: 'neutral calm expression, direct gaze at camera',
    nervous: 'slightly nervous expression, avoiding direct eye contact, tense jaw, subtle sweat',
    confident: 'confident relaxed expression, slight knowing smile, steady gaze',
    worried: 'worried concerned expression, furrowed brow, troubled eyes',
    suspicious: 'guarded suspicious expression, narrowed eyes, tight lips, defensive posture',
  };

  // Role-specific clothing that matches the case setting
  const roleClothing = getRoleClothing(suspect.role, caseContext.story.locationType);

  const prompt = `
${ponyQualityTags.highest},
1person, solo, portrait, looking at viewer,
${ageDescriptions[ageGroup]},
${ethnicFeatures[ethnicity]},
${expressions[expression]},
${roleClothing},
personality traits: ${personalityTraits},
${suspect.role} at ${caseContext.story.location},
photorealistic, realistic skin, detailed face, detailed eyes,
professional headshot, studio lighting, soft lighting,
sharp focus, shallow depth of field,
neutral grey background, clean background,
masterpiece, best quality, absurdres, 8k,
DSLR photo, RAW photo, 85mm portrait lens,
detailed skin texture, skin pores, natural skin tones
`.trim().replace(/\n/g, ' ');

  return {
    id: `suspect-${nanoid(8)}`,
    type: 'suspect',
    prompt,
    negativePrompt: portraitNegativePrompt,
    width: 768,
    height: 1024,
    settings: portraitSettings,
    metadata: {
      caseTitle: caseContext.title,
      name: suspect.name,
      role: suspect.role,
      ethnicity,
      gender,
      ageGroup,
      expression,
      isGuilty: suspect.isGuilty,
      personality: suspect.personality,
    },
  };
}

/**
 * Generate evidence image specific to the case clue
 */
export function generateContextualEvidencePrompt(
  caseContext: CaseContext,
  clue: {
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
    discoveryLocation?: string;
    examinationDetails?: string[];
    puzzleHint?: string;
  }
): ImageGenerationRequest {
  // Build evidence prompt based on exact clue description
  const condition = clue.relevance === 'critical' ? 'worn' :
                    clue.relevance === 'red-herring' ? 'damaged' : 'pristine';

  // Map clue type to evidence photography style
  const evidenceStyle = {
    physical: 'forensic evidence photography, physical evidence on examination table',
    document: 'document photography, paper evidence, magnified text visible',
    testimony: 'interview setting, witness statement visualization',
    digital: 'screen capture, digital evidence, device photography',
  };

  // Create highly specific prompt based on exact clue details
  const prompt = `
${ponyQualityTags.highest},
no humans, still life, object focus,
${clue.title}: ${clue.description},
${evidenceStyle[clue.type]},
found at ${clue.discoveryLocation || caseContext.story.location},
evidence related to: ${caseContext.story.crime},
${condition} condition, shows signs of use,
${clue.relevance === 'critical' ? 'key evidence, clearly important, highlighted' : ''},
${clue.relevance === 'red-herring' ? 'misleading clue, suspicious appearance' : ''},
${clue.examinationDetails?.join(', ') || ''},
forensic documentation lighting, clinical lighting,
evidence collection setting, evidence marker visible,
masterpiece, best quality, absurdres, 8k,
DSLR photo, macro photography, sharp focus,
high detail, detailed textures, photorealistic
`.trim().replace(/\n/g, ' ');

  return {
    id: `evidence-${nanoid(8)}`,
    type: 'evidence',
    prompt,
    negativePrompt: baseNegativePrompt,
    width: 1024,
    height: 1024,
    settings: evidenceSettings,
    metadata: {
      caseTitle: caseContext.title,
      clueTitle: clue.title,
      clueDescription: clue.description,
      clueType: clue.type,
      relevance: clue.relevance,
      condition,
      discoveryLocation: clue.discoveryLocation,
    },
  };
}

/**
 * Generate case cover image specific to the case story
 */
export function generateContextualCoverPrompt(
  caseContext: CaseContext
): ImageGenerationRequest {
  // Create cover that visually represents the specific case
  const subjectElements = {
    MATH: 'mathematical equations, numbers, geometric shapes subtly visible',
    SCIENCE: 'scientific equipment, molecules, atoms subtly visible',
    INTEGRATED: 'blend of math symbols and science equipment subtly visible',
  };

  // Incorporate case-specific elements
  const prompt = `
${ponyQualityTags.highest},
no humans, still life, object focus,
manila case folder file, detective case file,
title: "${caseContext.title}",
case involves: ${caseContext.story.crime},
location hints: ${caseContext.story.location} elements visible,
${subjectElements[caseContext.subject]},
classified document, confidential folder,
red "CLASSIFIED" stamp on cover,
${caseContext.atmosphere} mysterious noir atmosphere,
${caseContext.story.theme} theme visual elements,
dramatic lighting, vintage paper texture, aged paper,
photorealistic, realistic textures,
masterpiece, best quality, absurdres, 8k,
professional product photography,
dramatic side lighting, moody atmosphere
`.trim().replace(/\n/g, ' ');

  return {
    id: `cover-${nanoid(8)}`,
    type: 'cover',
    prompt,
    negativePrompt: baseNegativePrompt,
    width: 1024,
    height: 1024,
    settings: defaultSettings,
    metadata: {
      caseTitle: caseContext.title,
      subject: caseContext.subject,
      difficulty: caseContext.difficulty,
      theme: caseContext.story.theme,
      crime: caseContext.story.crime,
    },
  };
}

/**
 * Generate ALL case images with full context awareness
 * This is the main function that creates 100% case-relevant images
 */
export function generateContextualCaseImages(
  caseContext: CaseContext,
  suspects: Array<{
    name: string;
    role: string;
    alibi: string;
    personality: string[];
    isGuilty: boolean;
    motive?: string;
    ethnicity?: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
    gender?: 'male' | 'female';
    ageGroup?: 'young' | 'middle' | 'senior';
  }>,
  clues: Array<{
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
    discoveryLocation?: string;
    examinationDetails?: string[];
    puzzleHint?: string;
  }>,
  scenes: Array<{
    name: string;
    description: string;
  }>
): CaseImageRequests {
  // Generate case-specific cover
  const cover = generateContextualCoverPrompt(caseContext);

  // Generate case-specific scene images
  const sceneImages = scenes.map(scene =>
    generateContextualScenePrompt(caseContext, scene.description, scene.name)
  );

  // Generate case-specific suspect portraits
  const suspectImages = suspects.map(suspect =>
    generateContextualSuspectPrompt(caseContext, suspect)
  );

  // Generate case-specific evidence images (excluding testimony type - no images for witness statements)
  const evidenceImages = clues
    .filter(clue => clue.type !== 'testimony')
    .map(clue => generateContextualEvidencePrompt(caseContext, clue));

  return {
    cover,
    scenes: sceneImages,
    suspects: suspectImages,
    evidence: evidenceImages,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function inferEthnicityFromName(name: string): 'Chinese' | 'Malay' | 'Indian' | 'Eurasian' {
  // Simple heuristic based on common Singapore name patterns
  const chinesePatterns = /^(Tan|Lim|Lee|Ng|Wong|Chan|Goh|Ong|Koh|Chua|Chen|Zhang|Wang|Li|Liu|Yang|Huang)/i;
  const malayPatterns = /^(Ahmad|Muhammad|Siti|Nur|Abdul|Ibrahim|Ismail|Hassan|Fatimah|Aminah|Zul|Rahim)/i;
  const indianPatterns = /^(Raj|Prav|Kumar|Sharma|Singh|Devi|Muthu|Lakshmi|Ganesh|Anand|Rajan|Nair)/i;

  if (chinesePatterns.test(name)) return 'Chinese';
  if (malayPatterns.test(name)) return 'Malay';
  if (indianPatterns.test(name)) return 'Indian';
  return 'Chinese'; // Default to Chinese (majority in Singapore)
}

function getRoleClothing(role: string, locationType: string): string {
  const roleClothingMap: Record<string, string> = {
    teacher: 'wearing professional blouse/shirt, teacher ID lanyard, smart appearance',
    shopkeeper: 'wearing casual polo shirt with shop apron, name tag',
    student: 'wearing Singapore school uniform, white shirt, dark pants/skirt',
    'office worker': 'wearing formal business attire, office ID badge, professional look',
    chef: 'wearing white chef jacket and hat, kitchen attire',
    'security guard': 'wearing dark security guard uniform with badge and radio',
    cleaner: 'wearing work coveralls or cleaning uniform, simple attire',
    'delivery person': 'wearing company branded polo shirt, delivery bag/box',
    librarian: 'wearing smart casual, reading glasses, lanyard with ID',
    'lab assistant': 'wearing lab coat, safety goggles on head, professional look',
    'cafe owner': 'wearing casual apron, friendly neighborhood appearance',
    principal: 'wearing formal suit or dress, authoritative appearance',
    parent: 'wearing casual smart attire, everyday Singaporean clothing',
    technician: 'wearing work uniform with tool belt, practical attire',
  };

  const lowercaseRole = role.toLowerCase();
  for (const [key, clothing] of Object.entries(roleClothingMap)) {
    if (lowercaseRole.includes(key)) return clothing;
  }

  // Default based on location type
  const locationClothing: Record<string, string> = {
    school: 'wearing smart casual appropriate for school environment',
    neighborhood: 'wearing casual everyday Singapore attire',
    commercial: 'wearing smart casual or business casual attire',
    investigation: 'wearing professional attire',
  };

  return locationClothing[locationType] || 'wearing smart casual Singapore attire';
}
