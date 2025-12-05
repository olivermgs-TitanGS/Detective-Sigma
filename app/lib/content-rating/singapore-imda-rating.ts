/**
 * SINGAPORE IMDA VIDEO GAME CONTENT RATING SYSTEM
 *
 * Based on Singapore's Infocomm Media Development Authority (IMDA) guidelines
 * for video game classification.
 *
 * References:
 * - https://www.imda.gov.sg/regulations-and-licensing-listing/content-standards-and-classification/standards-and-classification/video-games
 * - https://iris.imda.gov.sg/guide/video-game-classification-guide
 *
 * Rating Levels:
 * - GENERAL: Suitable for all ages (default for educational games)
 * - PG13: Parental guidance for children below 13 (advisory, borrowed from film)
 * - ADV16: Advisory for persons 16 and above
 * - M18: Mature content, restricted to persons 18 and above
 */

// ============================================
// RATING TYPES
// ============================================

export type ContentRating = 'GENERAL' | 'PG13' | 'ADV16' | 'M18';

export interface RatingConfig {
  rating: ContentRating;
  label: string;
  description: string;
  minAge: number;
  isRestricted: boolean; // Requires age verification
  consumerAdvice?: string[];
}

export const RATING_CONFIGS: Record<ContentRating, RatingConfig> = {
  GENERAL: {
    rating: 'GENERAL',
    label: 'G',
    description: 'Suitable for all ages',
    minAge: 0,
    isRestricted: false,
  },
  PG13: {
    rating: 'PG13',
    label: 'PG13',
    description: 'Parental guidance advised for children below 13',
    minAge: 13,
    isRestricted: false, // Advisory only
  },
  ADV16: {
    rating: 'ADV16',
    label: 'ADV16',
    description: 'Advisory for persons 16 and above',
    minAge: 16,
    isRestricted: false, // Advisory only (as per IMDA)
    consumerAdvice: ['Moderate Violence', 'Some Mature Themes'],
  },
  M18: {
    rating: 'M18',
    label: 'M18',
    description: 'Restricted to persons 18 years and above',
    minAge: 18,
    isRestricted: true, // Age verification required
    consumerAdvice: ['Violence', 'Mature Themes', 'Some Coarse Language'],
  },
};

// ============================================
// CONTENT RULES BY RATING
// ============================================

/**
 * Content categories that can be controlled by rating
 */
export interface ContentRules {
  // Violence
  violence: {
    mildViolence: boolean;      // Cartoon/slapstick violence
    moderateViolence: boolean;  // Realistic but not graphic
    bloodEvidence: boolean;     // Blood at crime scenes (detective context)
    crimeScenes: boolean;       // Murder mystery themes
    realisticViolence: boolean; // Realistic depiction with impact
    gore: boolean;              // Detailed gore (never allowed in games)
  };
  // Themes
  themes: {
    mystery: boolean;           // Mystery/detective themes
    crime: boolean;             // Crime-related content
    death: boolean;             // References to death
    matureThemes: boolean;      // Complex adult themes
    horror: boolean;            // Horror/scary elements
    paranormal: boolean;        // Ghosts, supernatural
  };
  // Language
  language: {
    mildLanguage: boolean;      // "damn", "hell"
    moderateLanguage: boolean;  // Stronger but not explicit
    coarseLanguage: boolean;    // Strong coarse language
  };
  // Substances
  substances: {
    medicineReference: boolean; // Medicine, prescription drugs
    alcoholReference: boolean;  // Alcohol mentioned/shown
    drugReference: boolean;     // Illegal drugs mentioned
    drugUse: boolean;           // Depiction of drug use
  };
  // Nudity/Sex
  nudity: {
    none: boolean;              // No nudity allowed
    artisticNudity: boolean;    // Non-sexual artistic context
  };
  // Image generation specifics
  imageGeneration: {
    // What can be generated at this rating
    allowBlood: boolean;
    allowWeapons: boolean;
    allowCrimeScenes: boolean;
    allowForensicEvidence: boolean;
    allowScaryAtmosphere: boolean;
    allowDarkThemes: boolean;
  };
}

/**
 * Content rules for each rating level
 * Based on Singapore IMDA Video Game Classification Guidelines
 */
export const CONTENT_RULES: Record<ContentRating, ContentRules> = {
  // GENERAL: Suitable for all ages (Primary school children P4-P6)
  GENERAL: {
    violence: {
      mildViolence: true,       // Cartoon violence OK
      moderateViolence: false,
      bloodEvidence: false,      // No blood
      crimeScenes: true,         // Mystery without graphic elements
      realisticViolence: false,
      gore: false,
    },
    themes: {
      mystery: true,             // Detective mysteries OK
      crime: true,               // Non-violent crimes (theft, fraud)
      death: false,              // No death references
      matureThemes: false,
      horror: false,
      paranormal: false,
    },
    language: {
      mildLanguage: false,
      moderateLanguage: false,
      coarseLanguage: false,
    },
    substances: {
      medicineReference: true,
      alcoholReference: false,
      drugReference: false,
      drugUse: false,
    },
    nudity: {
      none: true,
      artisticNudity: false,
    },
    imageGeneration: {
      allowBlood: false,
      allowWeapons: false,       // No weapons in images
      allowCrimeScenes: true,    // Clean crime scenes only
      allowForensicEvidence: true,
      allowScaryAtmosphere: false,
      allowDarkThemes: false,
    },
  },

  // PG13: Parental guidance for below 13 (Secondary school)
  PG13: {
    violence: {
      mildViolence: true,
      moderateViolence: true,    // Some realistic violence
      bloodEvidence: true,       // Blood evidence OK (not graphic)
      crimeScenes: true,
      realisticViolence: false,
      gore: false,
    },
    themes: {
      mystery: true,
      crime: true,               // Murder mysteries allowed
      death: true,               // Death can be referenced
      matureThemes: false,
      horror: false,             // No horror
      paranormal: false,
    },
    language: {
      mildLanguage: true,        // "damn", "hell" OK
      moderateLanguage: false,
      coarseLanguage: false,
    },
    substances: {
      medicineReference: true,
      alcoholReference: true,    // Can mention alcohol
      drugReference: false,
      drugUse: false,
    },
    nudity: {
      none: true,
      artisticNudity: false,
    },
    imageGeneration: {
      allowBlood: true,          // Blood stains OK
      allowWeapons: true,        // Weapons as evidence
      allowCrimeScenes: true,
      allowForensicEvidence: true,
      allowScaryAtmosphere: true, // Suspenseful OK
      allowDarkThemes: false,
    },
  },

  // ADV16: Advisory for 16+ (IMDA video game rating)
  // "May contain moderate graphic violence, some drug use, implied sexual activity,
  //  partial nudity and some strong language"
  ADV16: {
    violence: {
      mildViolence: true,
      moderateViolence: true,
      bloodEvidence: true,
      crimeScenes: true,
      realisticViolence: true,   // Realistic violence allowed
      gore: false,               // No gore
    },
    themes: {
      mystery: true,
      crime: true,
      death: true,
      matureThemes: true,        // Mature themes allowed
      horror: true,              // Horror elements OK
      paranormal: true,
    },
    language: {
      mildLanguage: true,
      moderateLanguage: true,    // Stronger language
      coarseLanguage: false,
    },
    substances: {
      medicineReference: true,
      alcoholReference: true,
      drugReference: true,       // Drug references allowed
      drugUse: false,
    },
    nudity: {
      none: true,                // Still no nudity
      artisticNudity: false,
    },
    imageGeneration: {
      allowBlood: true,
      allowWeapons: true,
      allowCrimeScenes: true,
      allowForensicEvidence: true,
      allowScaryAtmosphere: true,
      allowDarkThemes: true,     // Dark themes OK
    },
  },

  // M18: Mature 18+ (IMDA restricted rating)
  // "Realistic depiction of violence and gore with strong impact"
  // "Sexual activity may be portrayed if justified by context"
  M18: {
    violence: {
      mildViolence: true,
      moderateViolence: true,
      bloodEvidence: true,
      crimeScenes: true,
      realisticViolence: true,
      gore: true,                // Gore allowed (not excessive)
    },
    themes: {
      mystery: true,
      crime: true,
      death: true,
      matureThemes: true,
      horror: true,
      paranormal: true,
    },
    language: {
      mildLanguage: true,
      moderateLanguage: true,
      coarseLanguage: true,      // Strong language allowed
    },
    substances: {
      medicineReference: true,
      alcoholReference: true,
      drugReference: true,
      drugUse: true,             // Drug use depiction allowed
    },
    nudity: {
      none: false,
      artisticNudity: true,      // Artistic nudity allowed (no explicit)
    },
    imageGeneration: {
      allowBlood: true,
      allowWeapons: true,
      allowCrimeScenes: true,
      allowForensicEvidence: true,
      allowScaryAtmosphere: true,
      allowDarkThemes: true,
    },
  },
};

// ============================================
// BLOCKED TERMS BY RATING
// ============================================

/**
 * Terms that are ALWAYS blocked regardless of rating
 * (Content that would be "Refused Classification" in Singapore)
 */
export const ALWAYS_BLOCKED_TERMS = {
  // Sexual content - Always blocked
  sexual: [
    'nude', 'naked', 'nudity', 'topless', 'bottomless', 'nsfw', 'explicit',
    'erotic', 'sensual', 'seductive', 'sexy', 'provocative',
    'sex', 'sexual', 'intercourse', 'porn', 'pornographic', 'xxx',
    'hentai', 'lewd', 'obscene', 'fetish', 'bondage', 'bdsm',
  ],
  // Extreme violence - Always blocked
  extremeViolence: [
    'dismember', 'decapitate', 'mutilate', 'disembowel',
    'torture', 'tortured', 'sadistic', 'cruel abuse',
    'child abuse', 'pedophile', 'paedophile',
  ],
  // Banned content in Singapore
  banned: [
    'terrorism', 'terrorist attack', 'genocide', 'ethnic cleansing',
    'suicide instruction', 'self-harm tutorial',
  ],
};

/**
 * Terms blocked at specific rating levels
 * Lower ratings block more terms
 */
export const RATING_BLOCKED_TERMS: Record<ContentRating, {
  violence: string[];
  themes: string[];
  language: string[];
  substances: string[];
}> = {
  GENERAL: {
    violence: [
      'blood', 'bloody', 'bleeding', 'gore', 'gory',
      'murder', 'killed', 'killing', 'stabbing', 'shooting',
      'corpse', 'dead body', 'death', 'dying',
      'violence', 'violent', 'attack', 'assault',
      'weapon', 'gun', 'knife', 'sword',
    ],
    themes: [
      'horror', 'scary', 'terrifying', 'nightmare', 'haunted',
      'ghost', 'demon', 'monster', 'zombie', 'vampire',
      'dark', 'sinister', 'evil', 'satanic', 'occult',
    ],
    language: [
      'damn', 'hell', 'crap', 'bastard',
    ],
    substances: [
      'alcohol', 'beer', 'wine', 'drunk', 'bar', 'pub',
      'drugs', 'cocaine', 'heroin', 'marijuana', 'meth',
      'smoking', 'cigarette',
    ],
  },
  PG13: {
    violence: [
      'gore', 'gory', 'gruesome', 'graphic violence',
      'brutal', 'savage', 'massacre',
    ],
    themes: [
      'satanic', 'demonic', 'occult', 'cult ritual',
    ],
    language: [
      'fuck', 'shit', 'bitch', 'cunt', 'cock', 'pussy',
    ],
    substances: [
      'drugs', 'cocaine', 'heroin', 'marijuana', 'meth',
      'drug use', 'injection', 'overdose',
    ],
  },
  ADV16: {
    violence: [
      'gore', 'gory', 'gruesome',
    ],
    themes: [
      // Less restrictions
    ],
    language: [
      'fuck', 'cunt', // Only most extreme
    ],
    substances: [
      'drug use', 'injection', 'overdose', 'shooting up',
    ],
  },
  M18: {
    violence: [
      // Only extreme stuff blocked
    ],
    themes: [
      // Minimal restrictions
    ],
    language: [
      // Minimal restrictions
    ],
    substances: [
      // Minimal restrictions
    ],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the content rules for a specific rating
 */
export function getContentRules(rating: ContentRating): ContentRules {
  return CONTENT_RULES[rating];
}

/**
 * Get blocked terms for a specific rating
 */
export function getBlockedTerms(rating: ContentRating): string[] {
  const alwaysBlocked = Object.values(ALWAYS_BLOCKED_TERMS).flat();
  const ratingBlocked = Object.values(RATING_BLOCKED_TERMS[rating]).flat();
  return [...new Set([...alwaysBlocked, ...ratingBlocked])];
}

/**
 * Check if content is allowed at a given rating
 */
export function isContentAllowed(
  content: string,
  rating: ContentRating
): { allowed: boolean; violations: string[] } {
  const blockedTerms = getBlockedTerms(rating);
  const violations: string[] = [];
  const lowerContent = content.toLowerCase();

  for (const term of blockedTerms) {
    // Use word boundary matching
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
    if (regex.test(lowerContent)) {
      violations.push(term);
    }
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Get the negative prompt additions for a rating
 */
export function getNegativePromptForRating(rating: ContentRating): string {
  const rules = getContentRules(rating);
  const negativeTerms: string[] = [
    // Always include
    'nsfw', 'nude', 'naked', 'explicit', 'sexual', 'erotic',
    'dismemberment', 'torture', 'mutilation',
  ];

  // Add rating-specific restrictions
  if (!rules.violence.gore) {
    negativeTerms.push('gore', 'gory', 'gruesome', 'graphic violence');
  }
  if (!rules.violence.bloodEvidence) {
    negativeTerms.push('blood', 'bloody', 'bleeding');
  }
  if (!rules.themes.horror) {
    negativeTerms.push('horror', 'scary', 'terrifying', 'nightmare');
  }
  if (!rules.substances.drugUse) {
    negativeTerms.push('drug use', 'drug injection', 'overdose');
  }

  return negativeTerms.join(', ');
}

/**
 * Validate rating for Singapore compliance
 */
export function validateSingaporeCompliance(rating: ContentRating): {
  isCompliant: boolean;
  requiresAgeVerification: boolean;
  consumerAdvice: string[];
} {
  const config = RATING_CONFIGS[rating];
  return {
    isCompliant: true, // All our ratings are IMDA-compliant
    requiresAgeVerification: config.isRestricted,
    consumerAdvice: config.consumerAdvice || [],
  };
}

// Export rating order for slider
export const RATING_ORDER: ContentRating[] = ['GENERAL', 'PG13', 'ADV16', 'M18'];

export function getRatingIndex(rating: ContentRating): number {
  return RATING_ORDER.indexOf(rating);
}

export function getRatingFromIndex(index: number): ContentRating {
  return RATING_ORDER[Math.min(Math.max(0, index), RATING_ORDER.length - 1)];
}
