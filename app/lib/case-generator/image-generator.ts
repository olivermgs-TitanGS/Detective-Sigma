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
// PHOTOREALISTIC MODEL SETTINGS
// ============================================

// Photorealistic quality tags (prepended to all prompts)
const photoQualityTags = {
  highest: 'RAW photo, 8k uhd, DSLR, high quality, Fujifilm XT3, masterpiece, best quality',
  high: 'RAW photo, DSLR, high quality, professional photography, detailed',
  good: 'photo, high quality, detailed, sharp focus',
};

// Photorealistic negative quality tags
// NOTE: SD 1.5 models cannot generate readable text - avoid text in prompts
const photoNegativeQuality = 'cartoon, painting, illustration, drawing, art, anime, cgi, 3d render, doll, plastic, fake, unrealistic, text, words, letters, writing, signs, labels, captions';

const defaultSettings: ImageSettings = {
  model: 'realisticVisionV60B1_v51VAE',  // Realistic Vision V6.0 B1
  sampler: 'DPM++ 2M Karras',
  steps: 30,
  cfgScale: 5.5,  // Lower CFG for more natural results
  style: 'photorealistic',
};

const sceneSettings: ImageSettings = {
  ...defaultSettings,
  model: 'realisticVisionV60B1_v51VAE',
  sampler: 'DPM++ 2M Karras',
  steps: 35,
  cfgScale: 5.0,
};

const portraitSettings: ImageSettings = {
  ...defaultSettings,
  model: 'realisticVisionV60B1_v51VAE',
  sampler: 'DPM++ SDE Karras',
  steps: 30,
  cfgScale: 5.5,
};

const evidenceSettings: ImageSettings = {
  ...defaultSettings,
  model: 'realisticVisionV60B1_v51VAE',
  sampler: 'DPM++ 2M Karras',
  steps: 28,
  cfgScale: 6.0,
};

// ============================================
// NEGATIVE PROMPTS (Quality Control)
// ============================================

// Photorealistic optimized negative prompts
const baseNegativePrompt = `
${photoNegativeQuality},
(worst quality:2), (low quality:2), (normal quality:1.5),
bad anatomy, bad proportions, bad hands, extra fingers, fewer fingers, missing fingers,
text, watermark, signature, username, artist name, logo, copyright,
blurry, out of focus, motion blur, chromatic aberration,
oversaturated, undersaturated, overexposed, underexposed,
deformed, distorted, disfigured, mutated, ugly, duplicate,
cropped, frame, border, jpeg artifacts, compression artifacts
`.trim().replace(/\n/g, ' ');

const portraitNegativePrompt = `
${photoNegativeQuality},
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
${photoNegativeQuality},
(worst quality:2), (low quality:2), bad anatomy,
text, watermark, signature, logo, copyright,
blurry, out of focus, motion blur,
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
${photoQualityTags.highest},
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
${photoQualityTags.highest},
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
${photoQualityTags.highest},
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
${photoQualityTags.highest},
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
 * Scenes are realistic and only show disorder if explicitly required
 */
export function generateContextualScenePrompt(
  caseContext: CaseContext,
  sceneDescription: string,
  sceneName: string,
  options?: {
    isCrimeScene?: boolean;      // Only true for primary crime scene with physical evidence
    showDisorder?: boolean;       // Explicit disorder (struggle, break-in, etc.)
    disorderType?: 'minor' | 'major' | 'struggle';  // Type of disorder if any
  }
): ImageGenerationRequest {
  // Determine scene condition based on options
  const isCrimeScene = options?.isCrimeScene ?? false;
  const showDisorder = options?.showDisorder ?? false;

  // Build disorder description only if explicitly needed
  let conditionPrompt = 'clean, well-maintained, organized space';
  if (showDisorder && isCrimeScene) {
    const disorderDescriptions = {
      minor: 'slight disarray, some items out of place, subtle signs of disturbance',
      major: 'visible disorder, scattered items, clear signs of incident',
      struggle: 'signs of struggle, overturned furniture, items knocked over',
    };
    conditionPrompt = disorderDescriptions[options?.disorderType || 'minor'];
  } else if (isCrimeScene) {
    // Crime scene but no disorder - just subtle investigation atmosphere
    conditionPrompt = 'still and quiet atmosphere, preserved state, untouched since incident';
  }

  // Build atmosphere without forcing "crime scene" aesthetics
  const atmosphereDescriptions = {
    mysterious: 'quiet contemplative mood, subtle intrigue',
    tense: 'still atmosphere with underlying tension',
    calm: 'peaceful serene environment',
    urgent: 'dynamic energetic atmosphere',
  };

  // Build a prompt that shows a realistic Singapore location
  const prompt = `
${photoQualityTags.highest},
photorealistic interior/exterior photography,
${sceneDescription},
location: ${sceneName}, ${caseContext.story.setting},
Singapore setting, ${singaporeContext.details},
${singaporeContext.lighting[caseContext.timeOfDay]},
${atmosphereDescriptions[caseContext.atmosphere]},
${conditionPrompt},
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
      isCrimeScene,
      showDisorder,
      disorderType: options?.disorderType,
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
${photoQualityTags.highest},
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
${photoQualityTags.highest},
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
${photoQualityTags.highest},
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

// ============================================
// STORY-ACCURATE IMAGE GENERATION
// ============================================
// These functions generate image prompts that are 100% accurate to the storyline.
// Every detail must match the case data exactly - no assumptions or additions.

import { NarrativeCase, CrimeDetails, CaseSetting } from './narrative-engine';

/**
 * Story-accurate scene types based on what actually happened in the story
 */
interface StorySceneConfig {
  /** The exact scene data from the case */
  sceneName: string;
  sceneDescription: string;
  /** What actually happened here according to the story */
  storyContext: {
    /** Is this where the crime occurred? */
    isCrimeLocation: boolean;
    /** What crime happened here (if any)? */
    crimeType?: CrimeDetails['type'];
    /** Was there physical disturbance? (theft rarely has mess, sabotage might) */
    physicalDisturbance?: 'none' | 'minimal' | 'moderate' | 'significant';
    /** Specific items that MUST be visible (from story) */
    requiredItems?: string[];
    /** Specific items that should NOT appear (would contradict story) */
    excludedItems?: string[];
    /** Time of day from story */
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    /** Weather/lighting from story */
    ambiance?: string;
  };
}

/**
 * Generate a scene image that is 100% accurate to the story
 * NO assumptions - only what's explicitly stated in the case
 */
export function generateStoryAccurateScenePrompt(
  narrativeCase: NarrativeCase,
  sceneConfig: StorySceneConfig
): ImageGenerationRequest {
  const { setting, crime } = narrativeCase;
  const { sceneName, sceneDescription, storyContext } = sceneConfig;

  // Build the scene condition based on EXACTLY what happened
  let sceneCondition = 'clean, well-maintained, organized, normal appearance';

  if (storyContext.isCrimeLocation && storyContext.crimeType) {
    // Determine visual impact based on crime type
    const crimeVisuals: Record<CrimeDetails['type'], string> = {
      theft: 'items may be missing from their usual places, otherwise undisturbed',
      vandalism: 'visible damage, defaced property, signs of destruction',
      fraud: 'normal appearance, no visible disturbance',
      sabotage: 'subtle signs of tampering, specific item appears damaged or altered',
      missing_item: 'empty space where item should be, otherwise normal',
      cheating: 'normal appearance, no physical evidence visible',
    };
    sceneCondition = crimeVisuals[storyContext.crimeType];

    // Override if story specifies physical disturbance
    if (storyContext.physicalDisturbance) {
      const disturbanceVisuals = {
        none: 'clean, undisturbed, normal organized state',
        minimal: 'very slight disarray, almost imperceptible changes',
        moderate: 'some items displaced, noticeable but not dramatic disorder',
        significant: 'clear signs of incident, scattered items, visible disorder',
      };
      sceneCondition = disturbanceVisuals[storyContext.physicalDisturbance];
    }
  }

  // Build required items list if specified
  const requiredItemsPrompt = storyContext.requiredItems?.length
    ? `clearly visible: ${storyContext.requiredItems.join(', ')},`
    : '';

  // Build excluded items (add to negative prompt)
  const excludedItemsNegative = storyContext.excludedItems?.length
    ? storyContext.excludedItems.join(', ') + ','
    : '';

  // Time-specific lighting
  const timeOfDayLighting = {
    morning: 'soft warm morning sunlight, golden hour, gentle shadows',
    afternoon: 'bright daylight, clear visibility, natural lighting',
    evening: 'warm orange sunset light, long shadows, golden atmosphere',
    night: 'artificial indoor lighting, darker outside windows, evening ambiance',
  };

  const prompt = `
${photoQualityTags.highest},
photorealistic interior photography of ${sceneName},
${setting.description},
${sceneDescription},
${requiredItemsPrompt}
${sceneCondition},
${timeOfDayLighting[storyContext.timeOfDay]},
${storyContext.ambiance || 'realistic everyday atmosphere'},
Singapore setting, Southeast Asian environment,
professional architectural photography, DSLR photo, RAW photo,
highly detailed, realistic textures, realistic lighting,
8k resolution, perfect composition
`.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const negativePrompt = `
${photoNegativeQuality},
${excludedItemsNegative}
${storyContext.physicalDisturbance === 'none' ? 'messy, cluttered, disorganized, scattered, overturned,' : ''}
(worst quality:2), (low quality:2),
blurry, out of focus, dark, underexposed,
people, humans, characters, figures,
jpeg artifacts, compression artifacts
`.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

  return {
    id: `story-scene-${nanoid(8)}`,
    type: 'scene',
    prompt,
    negativePrompt,
    width: 1024,
    height: 768,
    settings: sceneSettings,
    metadata: {
      storyAccurate: true,
      sceneName,
      isCrimeLocation: storyContext.isCrimeLocation,
      crimeType: storyContext.crimeType,
      physicalDisturbance: storyContext.physicalDisturbance,
      requiredItems: storyContext.requiredItems,
      timeOfDay: storyContext.timeOfDay,
    },
  };
}

/**
 * Story-accurate suspect configuration
 */
interface StorySuspectConfig {
  /** From case data */
  name: string;
  role: string;
  alibi: string;
  personality: string[];
  isGuilty: boolean;
  motive?: string;
  /** Visual specifics from story (if described) */
  appearance?: {
    ethnicity?: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
    gender?: 'male' | 'female';
    ageGroup?: 'young' | 'middle' | 'senior';
    /** Specific clothing mentioned in story */
    specificClothing?: string;
    /** Physical features mentioned in story */
    distinguishingFeatures?: string[];
  };
  /** Behavioral state during interview */
  demeanor: 'calm' | 'nervous' | 'defensive' | 'cooperative' | 'evasive';
}

/**
 * Generate a suspect portrait that matches EXACTLY what the story describes
 */
export function generateStoryAccurateSuspectPrompt(
  narrativeCase: NarrativeCase,
  suspectConfig: StorySuspectConfig
): ImageGenerationRequest {
  const { setting } = narrativeCase;
  const { name, role, appearance, demeanor, isGuilty, personality } = suspectConfig;

  // Determine ethnicity from name if not specified
  const ethnicity = appearance?.ethnicity || inferEthnicityFromName(name);
  const gender = appearance?.gender || 'male';
  const ageGroup = appearance?.ageGroup || 'middle';

  // Ethnic feature descriptions
  const ethnicFeatures: Record<string, string> = {
    Chinese: `${gender === 'male' ? 'Chinese Singaporean man' : 'Chinese Singaporean woman'}, East Asian features, black hair`,
    Malay: `${gender === 'male' ? 'Malay Singaporean man' : 'Malay Singaporean woman'}, Southeast Asian features, dark hair`,
    Indian: `${gender === 'male' ? 'Indian Singaporean man' : 'Indian Singaporean woman'}, South Asian features, dark hair`,
    Eurasian: `${gender === 'male' ? 'Eurasian Singaporean man' : 'Eurasian Singaporean woman'}, mixed heritage features`,
  };

  // Age descriptions
  const ageDescriptions: Record<string, string> = {
    young: 'young adult, 20s to early 30s',
    middle: 'middle-aged, 35 to 50 years old',
    senior: 'older adult, 55 to 65 years old',
  };

  // Demeanor to expression mapping (what camera would capture)
  const demeanorExpressions: Record<string, string> = {
    calm: 'calm neutral expression, composed demeanor, relaxed posture',
    nervous: 'slightly anxious expression, tense posture, avoiding direct eye contact',
    defensive: 'guarded expression, arms crossed or protective posture, wary eyes',
    cooperative: 'open friendly expression, engaged posture, making eye contact',
    evasive: 'shifty expression, looking away, uncomfortable body language',
  };

  // Guilty people may show subtle tells (but not obvious)
  const guiltyTells = isGuilty
    ? 'subtle tension in jaw, slight perspiration, micro-expressions of stress'
    : '';

  // Use specific clothing if provided, otherwise infer from role
  const clothing = appearance?.specificClothing ||
    getRoleClothing(role, setting.locationType);

  // Distinguishing features if any
  const distinguishingFeatures = appearance?.distinguishingFeatures?.length
    ? appearance.distinguishingFeatures.join(', ') + ','
    : '';

  const prompt = `
${photoQualityTags.highest},
professional portrait photograph,
1person, solo, portrait, looking at viewer,
${ethnicFeatures[ethnicity]},
${ageDescriptions[ageGroup]},
${clothing},
${distinguishingFeatures}
${demeanorExpressions[demeanor]},
${guiltyTells}
${role} at ${setting.location},
photorealistic, realistic skin texture, detailed face, detailed eyes,
professional headshot photography, soft studio lighting,
sharp focus, shallow depth of field,
neutral background, interview setting
`.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

  return {
    id: `story-suspect-${nanoid(8)}`,
    type: 'suspect',
    prompt,
    negativePrompt: portraitNegativePrompt,
    width: 512,
    height: 768,
    settings: portraitSettings,
    metadata: {
      storyAccurate: true,
      suspectName: name,
      role,
      isGuilty,
      demeanor,
      ethnicity,
      gender,
      ageGroup,
    },
  };
}

/**
 * Story-accurate evidence configuration
 */
interface StoryEvidenceConfig {
  /** From case data */
  clueTitle: string;
  clueDescription: string;
  clueType: 'physical' | 'document' | 'testimony' | 'digital';
  relevance: 'critical' | 'supporting' | 'red-herring';
  /** Where it was found */
  discoveryLocation: string;
  /** EXACT physical description from story */
  physicalDescription: {
    /** What is this item exactly? */
    itemType: string;
    /** Size/dimensions if relevant */
    size?: string;
    /** Color(s) */
    color?: string;
    /** Material */
    material?: string;
    /** Condition (pristine, worn, damaged, etc.) */
    condition: string;
    /** Any markings, text, or identifying features */
    identifyingFeatures?: string[];
    /** What's unusual about it (if anything) */
    anomalies?: string[];
  };
}

/**
 * Generate an evidence image that shows EXACTLY what the story describes
 */
export function generateStoryAccurateEvidencePrompt(
  narrativeCase: NarrativeCase,
  evidenceConfig: StoryEvidenceConfig
): ImageGenerationRequest {
  const { clueTitle, clueType, physicalDescription, discoveryLocation, relevance } = evidenceConfig;
  const pd = physicalDescription;

  // Build exact physical description
  const physicalDetails = [
    pd.itemType,
    pd.size ? `${pd.size} in size` : '',
    pd.color ? `${pd.color} colored` : '',
    pd.material ? `made of ${pd.material}` : '',
    pd.condition ? `in ${pd.condition} condition` : '',
    pd.identifyingFeatures?.length ? pd.identifyingFeatures.join(', ') : '',
    pd.anomalies?.length ? `notable: ${pd.anomalies.join(', ')}` : '',
  ].filter(Boolean).join(', ');

  // Evidence photography style based on type
  const photographyStyle: Record<string, string> = {
    physical: 'forensic evidence photography, clinical lighting, evidence scale ruler visible',
    document: 'document photography, flat lay, even lighting, readable details',
    digital: 'screen capture, device photography, clear display visible',
    testimony: 'interview setting photograph', // Rarely used for testimony
  };

  // Critical evidence should be clearly visible and well-lit
  const relevanceStyle = relevance === 'critical'
    ? 'clearly lit, center focus, high detail, important evidence'
    : relevance === 'red-herring'
      ? 'natural lighting, appears significant but misleading'
      : 'standard evidence documentation';

  const prompt = `
${photoQualityTags.highest},
${photographyStyle[clueType]},
no humans, still life, object focus,
photograph of ${clueTitle}: ${physicalDetails},
found at ${discoveryLocation},
${relevanceStyle},
photorealistic, realistic textures, sharp focus,
professional documentation photography,
evidence marker number visible nearby,
clean background, examination table or discovery location context
`.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

  return {
    id: `story-evidence-${nanoid(8)}`,
    type: 'evidence',
    prompt,
    negativePrompt: baseNegativePrompt,
    width: 768,
    height: 768,
    settings: evidenceSettings,
    metadata: {
      storyAccurate: true,
      clueTitle,
      clueType,
      relevance,
      discoveryLocation,
      physicalDescription: pd,
    },
  };
}

/**
 * Generate ALL images for a case with 100% story accuracy
 * Call this when generating a case to ensure visual consistency
 */
export function generateAllStoryAccurateImages(
  narrativeCase: NarrativeCase,
  scenes: StorySceneConfig[],
  suspects: StorySuspectConfig[],
  evidence: StoryEvidenceConfig[]
): {
  scenes: ImageGenerationRequest[];
  suspects: ImageGenerationRequest[];
  evidence: ImageGenerationRequest[];
} {
  return {
    scenes: scenes.map(scene => generateStoryAccurateScenePrompt(narrativeCase, scene)),
    suspects: suspects.map(suspect => generateStoryAccurateSuspectPrompt(narrativeCase, suspect)),
    evidence: evidence
      .filter(e => e.clueType !== 'testimony') // No images for testimony
      .map(e => generateStoryAccurateEvidencePrompt(narrativeCase, e)),
  };
}

// Export types for use in generator
export type { StorySceneConfig, StorySuspectConfig, StoryEvidenceConfig };

// ============================================
// REALITY VALIDATION SYSTEM
// ============================================
// Ensures all generated images are grounded in reality
// No fantasy, impossible scenarios, or illogical combinations

/**
 * Reality check rules for image prompts
 */
interface RealityViolation {
  type: 'impossible' | 'improbable' | 'fantasy' | 'anachronism' | 'logical';
  description: string;
  severity: 'error' | 'warning';
}

/**
 * Validates that a scene configuration is realistic
 */
export function validateSceneReality(config: StorySceneConfig): RealityViolation[] {
  const violations: RealityViolation[] = [];

  // Check for impossible combinations
  const impossibleScenarios = [
    { pattern: /underwater.*fire/i, reason: 'Fire cannot exist underwater' },
    { pattern: /freezing.*tropical/i, reason: 'Tropical climates are not freezing' },
    { pattern: /midnight.*bright sunlight/i, reason: 'No sunlight at midnight' },
    { pattern: /ancient.*smartphone/i, reason: 'Anachronistic technology' },
  ];

  const fullDescription = `${config.sceneName} ${config.sceneDescription}`;
  for (const scenario of impossibleScenarios) {
    if (scenario.pattern.test(fullDescription)) {
      violations.push({
        type: 'impossible',
        description: scenario.reason,
        severity: 'error',
      });
    }
  }

  // Singapore-specific reality checks
  if (config.sceneDescription.toLowerCase().includes('snow') &&
      !config.sceneDescription.toLowerCase().includes('fake') &&
      !config.sceneDescription.toLowerCase().includes('artificial')) {
    violations.push({
      type: 'impossible',
      description: 'Singapore does not have natural snow',
      severity: 'error',
    });
  }

  // Time of day logic
  if (config.storyContext.timeOfDay === 'night' &&
      config.storyContext.ambiance?.toLowerCase().includes('bright sunshine')) {
    violations.push({
      type: 'logical',
      description: 'Cannot have bright sunshine at night',
      severity: 'error',
    });
  }

  return violations;
}

/**
 * Validates that a suspect configuration is realistic
 */
export function validateSuspectReality(config: StorySuspectConfig): RealityViolation[] {
  const violations: RealityViolation[] = [];

  // Age-role logic checks
  const roleAgeConstraints: Record<string, { minAge: string; maxAge: string }> = {
    'student': { minAge: 'young', maxAge: 'young' },
    'principal': { minAge: 'middle', maxAge: 'senior' },
    'retiree': { minAge: 'senior', maxAge: 'senior' },
    'intern': { minAge: 'young', maxAge: 'young' },
  };

  const roleKey = Object.keys(roleAgeConstraints).find(key =>
    config.role.toLowerCase().includes(key)
  );

  if (roleKey && config.appearance?.ageGroup) {
    const constraint = roleAgeConstraints[roleKey];
    const ageOrder = ['young', 'middle', 'senior'];
    const actualAge = ageOrder.indexOf(config.appearance.ageGroup);
    const minAge = ageOrder.indexOf(constraint.minAge);
    const maxAge = ageOrder.indexOf(constraint.maxAge);

    if (actualAge < minAge || actualAge > maxAge) {
      violations.push({
        type: 'improbable',
        description: `A ${config.appearance.ageGroup} person is unlikely to be a ${config.role}`,
        severity: 'warning',
      });
    }
  }

  // Physical impossibilities
  if (config.appearance?.distinguishingFeatures) {
    const features = config.appearance.distinguishingFeatures.join(' ').toLowerCase();

    if (features.includes('wings') || features.includes('horns') ||
        features.includes('glowing eyes') || features.includes('purple skin')) {
      violations.push({
        type: 'fantasy',
        description: 'Fantasy/supernatural physical features are not realistic',
        severity: 'error',
      });
    }
  }

  return violations;
}

/**
 * Validates that evidence configuration is realistic
 */
export function validateEvidenceReality(config: StoryEvidenceConfig): RealityViolation[] {
  const violations: RealityViolation[] = [];
  const pd = config.physicalDescription;

  // Material-property checks
  const materialProperties: Record<string, { cantBe: string[] }> = {
    paper: { cantBe: ['unburnable', 'waterproof'] },
    glass: { cantBe: ['flexible', 'soft'] },
    wood: { cantBe: ['transparent', 'magnetic'] },
    metal: { cantBe: ['soft like cotton', 'edible'] },
  };

  if (pd.material) {
    const materialKey = Object.keys(materialProperties).find(key =>
      pd.material?.toLowerCase().includes(key)
    );

    if (materialKey) {
      const cantBe = materialProperties[materialKey].cantBe;
      const fullDesc = `${pd.condition} ${pd.identifyingFeatures?.join(' ') || ''}`.toLowerCase();

      for (const property of cantBe) {
        if (fullDesc.includes(property)) {
          violations.push({
            type: 'impossible',
            description: `${materialKey} cannot be ${property}`,
            severity: 'error',
          });
        }
      }
    }
  }

  // Size logic
  if (pd.size) {
    const sizeDesc = pd.size.toLowerCase();
    const itemType = pd.itemType.toLowerCase();

    // Check for illogical sizes
    if ((itemType.includes('building') || itemType.includes('car')) &&
        (sizeDesc.includes('tiny') || sizeDesc.includes('pocket-sized'))) {
      violations.push({
        type: 'impossible',
        description: `A ${itemType} cannot be ${sizeDesc}`,
        severity: 'error',
      });
    }

    if ((itemType.includes('bacteria') || itemType.includes('atom')) &&
        (sizeDesc.includes('large') || sizeDesc.includes('huge'))) {
      violations.push({
        type: 'impossible',
        description: `${itemType} cannot be ${sizeDesc}`,
        severity: 'error',
      });
    }
  }

  return violations;
}

/**
 * Validate an entire image request prompt for realistic content
 */
export function validatePromptReality(prompt: string): RealityViolation[] {
  const violations: RealityViolation[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Fantasy/supernatural elements that should never appear
  const fantasyElements = [
    { pattern: /dragon|unicorn|fairy|elf|dwarf|ogre|troll|goblin/i, type: 'fantasy' as const },
    { pattern: /magic|spell|wizard|witch|sorcerer|enchanted/i, type: 'fantasy' as const },
    { pattern: /flying human|levitating|teleporting/i, type: 'fantasy' as const },
    { pattern: /ghost|vampire|zombie|werewolf|demon|angel/i, type: 'fantasy' as const },
    { pattern: /glowing eyes|supernatural|mystical powers/i, type: 'fantasy' as const },
  ];

  for (const element of fantasyElements) {
    if (element.pattern.test(prompt)) {
      violations.push({
        type: element.type,
        description: `Fantasy element detected: ${prompt.match(element.pattern)?.[0]}`,
        severity: 'error',
      });
    }
  }

  // Physically impossible scenarios
  const impossibleScenarios = [
    { pattern: /human.*with.*six arms/i, reason: 'Humans have two arms' },
    { pattern: /walking.*on.*water/i, reason: 'Humans cannot walk on water' },
    { pattern: /breathing.*underwater.*without.*equipment/i, reason: 'Humans cannot breathe underwater' },
    { pattern: /lifting.*a.*car.*with.*bare.*hands/i, reason: 'Superhuman strength is unrealistic' },
    { pattern: /running.*at.*100.*mph/i, reason: 'Humans cannot run at 100 mph' },
  ];

  for (const scenario of impossibleScenarios) {
    if (scenario.pattern.test(prompt)) {
      violations.push({
        type: 'impossible',
        description: scenario.reason,
        severity: 'error',
      });
    }
  }

  // Singapore-specific reality
  if (lowerPrompt.includes('singapore')) {
    if (lowerPrompt.includes('snow') && !lowerPrompt.includes('fake') && !lowerPrompt.includes('artificial')) {
      violations.push({
        type: 'impossible',
        description: 'Natural snow does not occur in Singapore',
        severity: 'error',
      });
    }
    if (lowerPrompt.includes('mountain') && !lowerPrompt.includes('bukit')) {
      violations.push({
        type: 'improbable',
        description: 'Singapore does not have mountains',
        severity: 'warning',
      });
    }
  }

  return violations;
}

/**
 * Sanitize a prompt by removing unrealistic elements
 * Returns the cleaned prompt and list of removed elements
 */
export function sanitizePromptForReality(prompt: string): {
  sanitizedPrompt: string;
  removedElements: string[];
} {
  const removedElements: string[] = [];
  let sanitizedPrompt = prompt;

  // Elements to remove
  const elementsToRemove = [
    /\b(magical|enchanted|mystical|supernatural)\b/gi,
    /\b(glowing|luminescent)\s+(eyes|hands|body)/gi,
    /\b(flying|hovering|levitating)\s+(human|person|man|woman)/gi,
    /\b(dragon|unicorn|fairy|elf|wizard|witch)\b/gi,
  ];

  for (const pattern of elementsToRemove) {
    const matches = sanitizedPrompt.match(pattern);
    if (matches) {
      removedElements.push(...matches);
      sanitizedPrompt = sanitizedPrompt.replace(pattern, '');
    }
  }

  // Clean up extra spaces and commas
  sanitizedPrompt = sanitizedPrompt
    .replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  return { sanitizedPrompt, removedElements };
}

/**
 * Full reality check for a story-accurate image request
 * Call this before generating any image
 */
export function performRealityCheck(
  request: ImageGenerationRequest
): {
  isValid: boolean;
  violations: RealityViolation[];
  sanitizedPrompt?: string;
} {
  const promptViolations = validatePromptReality(request.prompt);

  // If there are errors, try to sanitize
  if (promptViolations.some(v => v.severity === 'error')) {
    const { sanitizedPrompt, removedElements } = sanitizePromptForReality(request.prompt);

    // Re-check the sanitized prompt
    const recheckViolations = validatePromptReality(sanitizedPrompt);

    return {
      isValid: !recheckViolations.some(v => v.severity === 'error'),
      violations: [...promptViolations, ...recheckViolations],
      sanitizedPrompt: sanitizedPrompt !== request.prompt ? sanitizedPrompt : undefined,
    };
  }

  return {
    isValid: !promptViolations.some(v => v.severity === 'error'),
    violations: promptViolations,
  };
}
