/**
 * SCENE-EVIDENCE MAPPER
 *
 * Maps evidence to appropriate scenes based on semantic location,
 * and calculates contextual positions for evidence hotspots.
 *
 * This ensures:
 * - CCTV footage appears in security room, not random scenes
 * - Fingerprints appear at the crime scene
 * - Documents appear on desks/surfaces
 * - Evidence hotspots are positioned contextually
 */

import { EvidenceItem } from './evidence-chain';

// ============================================
// TYPES
// ============================================

export type SceneType = 'primary' | 'security' | 'work_area' | 'investigation' | 'resolution';
export type PositionHint = 'floor' | 'surface' | 'wall' | 'screen' | 'desk' | 'cabinet' | 'locker' | 'lab_bench' | 'table';

export interface EvidencePlacement {
  evidenceId: string;
  sceneId: string;
  sceneType: SceneType;
  positionX: number;  // 0-100 percentage
  positionY: number;  // 0-100 percentage
  positionHint: PositionHint;
  requiredPuzzleId?: string;
}

export interface SceneInfo {
  id: string;
  name: string;
  sceneType: SceneType;
  locationType?: string;
}

// ============================================
// LOCATION KEYWORD TO SCENE TYPE MAPPING
// ============================================

const LOCATION_SCENE_MAP: Record<string, SceneType> = {
  // Crime scene / Primary locations
  'crime scene': 'primary',
  'incident location': 'primary',
  'incident': 'primary',
  'scene': 'primary',
  'where it happened': 'primary',
  'canteen': 'primary',
  'cafeteria': 'primary',
  'library': 'primary',
  'laboratory': 'primary',
  'classroom': 'primary',
  'hall': 'primary',
  'playground': 'primary',
  'corridor': 'primary',
  'hallway': 'primary',

  // Security locations
  'security office': 'security',
  'security room': 'security',
  'security': 'security',
  'cctv': 'security',
  'cctv room': 'security',
  'guard room': 'security',
  'monitoring': 'security',
  'surveillance': 'security',
  'access log': 'security',
  'access control': 'security',
  'reception': 'security',

  // Work area / Personal space locations
  'personal items': 'work_area',
  'personal belongings': 'work_area',
  'belongings': 'work_area',
  'desk': 'work_area',
  'locker': 'work_area',
  'workspace': 'work_area',
  'office': 'work_area',
  'cubicle': 'work_area',
  'staff room': 'work_area',
  'teacher\'s desk': 'work_area',
  'student desk': 'work_area',

  // Investigation / Forensic locations
  'investigation': 'investigation',
  'forensic': 'investigation',
  'analysis': 'investigation',
  'lab': 'investigation',
  'science lab': 'investigation',
  'investigation center': 'investigation',
  'analyzed': 'investigation',
  'examination': 'investigation',

  // Resolution / Confrontation locations
  'interview': 'resolution',
  'interview room': 'resolution',
  'confrontation': 'resolution',
  'principal office': 'resolution',
  'meeting room': 'resolution',
  'resolution': 'resolution',
};

// ============================================
// EVIDENCE TYPE TO SCENE TYPE DEFAULTS
// ============================================

const EVIDENCE_TYPE_SCENE_DEFAULTS: Record<string, SceneType> = {
  // Physical evidence usually at crime scene
  'physical': 'primary',

  // Digital evidence usually in security
  'digital': 'security',

  // Documentary can be anywhere but often work area
  'documentary': 'work_area',

  // Testimonial can be anywhere
  'testimonial': 'investigation',

  // Forensic analysis in investigation
  'forensic': 'investigation',

  // Circumstantial spreads across scenes
  'circumstantial': 'primary',
};

// ============================================
// EVIDENCE NAME PATTERNS TO SCENE TYPE
// ============================================

const EVIDENCE_NAME_SCENE_MAP: Array<{ pattern: RegExp; sceneType: SceneType }> = [
  // Security-related evidence
  { pattern: /cctv|camera|footage|surveillance|access.*(log|card|record)/i, sceneType: 'security' },

  // Crime scene evidence
  { pattern: /fingerprint|footprint|torn|fabric|blood|mark|damage/i, sceneType: 'primary' },

  // Work area / Personal evidence
  { pattern: /personal|belonging|desk|locker|diary|journal|letter/i, sceneType: 'work_area' },

  // Investigation/Forensic evidence
  { pattern: /forensic|analysis|chemical|residue|pattern|comparison/i, sceneType: 'investigation' },

  // Resolution evidence
  { pattern: /confession|motive|proof|conclusive|direct/i, sceneType: 'resolution' },

  // Witness/Testimonial often in investigation
  { pattern: /witness|statement|observation|testimony/i, sceneType: 'investigation' },
];

// ============================================
// POSITION ZONES BY SCENE TYPE
// ============================================

interface PositionZone {
  x: [number, number];  // [min, max] percentage
  y: [number, number];  // [min, max] percentage
}

const SCENE_POSITION_ZONES: Record<SceneType, Record<PositionHint, PositionZone>> = {
  primary: {
    floor: { x: [15, 85], y: [65, 90] },       // Floor area (bottom portion)
    surface: { x: [25, 75], y: [40, 65] },     // Tables/counters (middle)
    wall: { x: [10, 90], y: [10, 35] },        // Wall-mounted/high items
    screen: { x: [40, 60], y: [25, 45] },      // Monitor area
    desk: { x: [30, 70], y: [45, 65] },        // Desk surface
    cabinet: { x: [10, 25], y: [30, 70] },     // Side cabinet
    locker: { x: [75, 90], y: [30, 70] },      // Side locker
    lab_bench: { x: [20, 80], y: [45, 65] },   // Lab bench
    table: { x: [30, 70], y: [50, 70] },       // Table surface
  },
  security: {
    floor: { x: [20, 80], y: [70, 90] },
    surface: { x: [30, 70], y: [50, 70] },
    wall: { x: [10, 90], y: [15, 35] },
    screen: { x: [25, 75], y: [20, 50] },      // CCTV monitors - prominent
    desk: { x: [40, 80], y: [55, 75] },        // Security desk
    cabinet: { x: [10, 25], y: [40, 75] },     // Filing cabinet
    locker: { x: [80, 95], y: [35, 70] },      // Equipment locker
    lab_bench: { x: [20, 80], y: [45, 65] },
    table: { x: [35, 65], y: [55, 75] },
  },
  work_area: {
    floor: { x: [20, 80], y: [70, 90] },
    surface: { x: [25, 75], y: [45, 65] },
    wall: { x: [10, 90], y: [10, 30] },
    screen: { x: [35, 55], y: [30, 50] },      // Computer monitor
    desk: { x: [20, 80], y: [45, 70] },        // Main desk - larger area
    cabinet: { x: [5, 20], y: [35, 75] },
    locker: { x: [80, 95], y: [25, 80] },      // Personal locker
    lab_bench: { x: [15, 85], y: [50, 70] },
    table: { x: [30, 70], y: [50, 70] },
  },
  investigation: {
    floor: { x: [15, 85], y: [70, 90] },
    surface: { x: [20, 80], y: [45, 65] },
    wall: { x: [5, 95], y: [10, 30] },         // Evidence board on wall
    screen: { x: [60, 85], y: [25, 50] },      // Analysis screen
    desk: { x: [35, 75], y: [50, 70] },
    cabinet: { x: [5, 20], y: [30, 80] },      // Evidence cabinet
    locker: { x: [80, 95], y: [30, 80] },
    lab_bench: { x: [15, 55], y: [45, 65] },   // Main lab bench
    table: { x: [25, 65], y: [50, 70] },
  },
  resolution: {
    floor: { x: [20, 80], y: [75, 90] },
    surface: { x: [25, 75], y: [50, 70] },
    wall: { x: [10, 90], y: [10, 35] },        // Evidence board
    screen: { x: [70, 90], y: [20, 45] },      // Presentation screen
    desk: { x: [30, 70], y: [55, 75] },        // Interview table
    cabinet: { x: [5, 18], y: [35, 75] },
    locker: { x: [82, 95], y: [35, 75] },
    lab_bench: { x: [20, 80], y: [50, 70] },
    table: { x: [25, 75], y: [50, 75] },       // Main interview table
  },
};

// ============================================
// EVIDENCE TYPE TO POSITION HINT MAPPING
// ============================================

const EVIDENCE_TYPE_POSITION_DEFAULTS: Record<string, PositionHint> = {
  'physical': 'floor',
  'documentary': 'desk',
  'digital': 'screen',
  'testimonial': 'table',
  'forensic': 'lab_bench',
  'circumstantial': 'surface',
};

const EVIDENCE_NAME_POSITION_MAP: Array<{ pattern: RegExp; hint: PositionHint }> = [
  // Floor evidence
  { pattern: /footprint|muddy|track|floor|ground/i, hint: 'floor' },
  { pattern: /dropped|fallen|discarded/i, hint: 'floor' },

  // Screen evidence
  { pattern: /cctv|footage|camera|monitor|screen|digital|computer/i, hint: 'screen' },

  // Desk/surface evidence
  { pattern: /document|receipt|log|record|paper|file|ledger/i, hint: 'desk' },
  { pattern: /diary|journal|letter|note/i, hint: 'desk' },

  // Wall evidence
  { pattern: /board|poster|calendar|schedule|mounted/i, hint: 'wall' },

  // Cabinet/locker evidence
  { pattern: /locker|personal|hidden|belongings/i, hint: 'locker' },
  { pattern: /cabinet|filing|stored/i, hint: 'cabinet' },

  // Lab bench evidence
  { pattern: /analysis|forensic|chemical|residue|sample|test/i, hint: 'lab_bench' },

  // Table evidence
  { pattern: /witness|statement|interview|testimony/i, hint: 'table' },

  // Surface evidence
  { pattern: /fingerprint|mark|stain|trace/i, hint: 'surface' },
  { pattern: /torn|fabric|fiber/i, hint: 'surface' },
];

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Determine the appropriate scene type for an evidence item
 */
export function determineSceneType(evidence: EvidenceItem): SceneType {
  // 1. Check evidence location against location keywords
  const locationLower = evidence.location?.toLowerCase() || '';
  for (const [keyword, sceneType] of Object.entries(LOCATION_SCENE_MAP)) {
    if (locationLower.includes(keyword)) {
      return sceneType;
    }
  }

  // 2. Check evidence name against name patterns
  const nameLower = evidence.name?.toLowerCase() || '';
  for (const { pattern, sceneType } of EVIDENCE_NAME_SCENE_MAP) {
    if (pattern.test(nameLower) || pattern.test(evidence.description || '')) {
      return sceneType;
    }
  }

  // 3. Fall back to evidence type default
  return EVIDENCE_TYPE_SCENE_DEFAULTS[evidence.type] || 'primary';
}

/**
 * Determine the appropriate position hint for an evidence item
 */
export function determinePositionHint(evidence: EvidenceItem): PositionHint {
  const nameLower = evidence.name?.toLowerCase() || '';
  const visualCueLower = evidence.visualCue?.toLowerCase() || '';
  const combinedText = `${nameLower} ${visualCueLower}`;

  // Check against name/description patterns
  for (const { pattern, hint } of EVIDENCE_NAME_POSITION_MAP) {
    if (pattern.test(combinedText)) {
      return hint;
    }
  }

  // Fall back to evidence type default
  return EVIDENCE_TYPE_POSITION_DEFAULTS[evidence.type] || 'surface';
}

/**
 * Calculate position (x, y) for evidence within a scene
 * Ensures no overlapping positions
 */
export function calculateEvidencePosition(
  evidence: EvidenceItem,
  sceneType: SceneType,
  positionHint: PositionHint,
  existingPositions: Array<{ x: number; y: number }>
): { x: number; y: number } {
  const zones = SCENE_POSITION_ZONES[sceneType];
  const zone = zones[positionHint] || zones.surface;

  // Calculate position within zone, avoiding existing positions
  let attempts = 0;
  const maxAttempts = 20;
  const minDistance = 12; // Minimum distance between evidence (percentage)

  while (attempts < maxAttempts) {
    // Random position within zone
    const x = zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]);
    const y = zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]);

    // Check distance from existing positions
    const tooClose = existingPositions.some(pos => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      return distance < minDistance;
    });

    if (!tooClose) {
      return { x: Math.round(x), y: Math.round(y) };
    }

    attempts++;
  }

  // Fallback: return center of zone (slightly randomized)
  return {
    x: Math.round((zone.x[0] + zone.x[1]) / 2 + (Math.random() - 0.5) * 10),
    y: Math.round((zone.y[0] + zone.y[1]) / 2 + (Math.random() - 0.5) * 10),
  };
}

/**
 * Find the best matching scene for an evidence item
 */
export function findMatchingScene(
  evidence: EvidenceItem,
  scenes: SceneInfo[]
): SceneInfo | null {
  const targetSceneType = determineSceneType(evidence);

  // First, try to find exact scene type match
  const exactMatch = scenes.find(s => s.sceneType === targetSceneType);
  if (exactMatch) {
    return exactMatch;
  }

  // Fall back to first scene (usually primary/crime scene)
  return scenes[0] || null;
}

/**
 * Map all evidence items to scenes with positions
 */
export function mapEvidenceToScenes(
  evidenceItems: EvidenceItem[],
  scenes: SceneInfo[]
): Map<string, EvidencePlacement> {
  const placementMap = new Map<string, EvidencePlacement>();
  const scenePositions = new Map<string, Array<{ x: number; y: number }>>();

  // Initialize position tracking for each scene
  scenes.forEach(scene => {
    scenePositions.set(scene.id, []);
  });

  // Map each evidence item
  for (const evidence of evidenceItems) {
    const matchingScene = findMatchingScene(evidence, scenes);
    if (!matchingScene) continue;

    const sceneType = matchingScene.sceneType;
    const positionHint = determinePositionHint(evidence);
    const existingPositions = scenePositions.get(matchingScene.id) || [];

    const position = calculateEvidencePosition(
      evidence,
      sceneType,
      positionHint,
      existingPositions
    );

    // Track this position
    existingPositions.push(position);
    scenePositions.set(matchingScene.id, existingPositions);

    // Create placement
    const placement: EvidencePlacement = {
      evidenceId: evidence.id,
      sceneId: matchingScene.id,
      sceneType,
      positionX: position.x,
      positionY: position.y,
      positionHint,
      requiredPuzzleId: evidence.unlockedByPuzzle ? undefined : undefined, // Will be set later
    };

    placementMap.set(evidence.id, placement);
  }

  return placementMap;
}

/**
 * Validate scene evidence distribution
 * Returns issues if any validation fails
 */
export function validateSceneEvidence(
  scenes: SceneInfo[],
  placementMap: Map<string, EvidencePlacement>
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Count evidence per scene
  const sceneEvidenceCounts = new Map<string, number>();
  scenes.forEach(s => sceneEvidenceCounts.set(s.id, 0));

  placementMap.forEach(placement => {
    const count = sceneEvidenceCounts.get(placement.sceneId) || 0;
    sceneEvidenceCounts.set(placement.sceneId, count + 1);
  });

  // Check each scene has at least 1 clue
  scenes.forEach(scene => {
    const count = sceneEvidenceCounts.get(scene.id) || 0;
    if (count === 0) {
      issues.push(`Scene "${scene.name}" has no evidence assigned`);
    }
    if (count > 8) {
      issues.push(`Scene "${scene.name}" has too many evidence items (${count}), may cause visual clutter`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Redistribute evidence to ensure all scenes have content
 */
export function redistributeEvidence(
  evidenceItems: EvidenceItem[],
  scenes: SceneInfo[],
  currentMap: Map<string, EvidencePlacement>
): Map<string, EvidencePlacement> {
  const validation = validateSceneEvidence(scenes, currentMap);

  if (validation.valid) {
    return currentMap;
  }

  // Find scenes with no evidence
  const emptyScenes = scenes.filter(scene => {
    const hasEvidence = Array.from(currentMap.values()).some(p => p.sceneId === scene.id);
    return !hasEvidence;
  });

  if (emptyScenes.length === 0) {
    return currentMap;
  }

  // Find scenes with too much evidence
  const sceneEvidence = new Map<string, EvidencePlacement[]>();
  currentMap.forEach((placement, evidenceId) => {
    const list = sceneEvidence.get(placement.sceneId) || [];
    list.push(placement);
    sceneEvidence.set(placement.sceneId, list);
  });

  // Move evidence from crowded scenes to empty ones
  for (const emptyScene of emptyScenes) {
    // Find the scene with most evidence
    let maxScene: string | null = null;
    let maxCount = 0;

    sceneEvidence.forEach((list, sceneId) => {
      if (list.length > maxCount) {
        maxCount = list.length;
        maxScene = sceneId;
      }
    });

    if (maxScene && maxCount > 1) {
      const sourceList = sceneEvidence.get(maxScene)!;
      const toMove = sourceList.pop()!; // Move the last one

      // Update the placement
      const newPlacement: EvidencePlacement = {
        ...toMove,
        sceneId: emptyScene.id,
        sceneType: emptyScene.sceneType,
      };

      // Recalculate position for new scene
      const position = calculateEvidencePosition(
        evidenceItems.find(e => e.id === toMove.evidenceId)!,
        emptyScene.sceneType,
        toMove.positionHint,
        []
      );
      newPlacement.positionX = position.x;
      newPlacement.positionY = position.y;

      currentMap.set(toMove.evidenceId, newPlacement);

      // Update tracking
      const emptyList = sceneEvidence.get(emptyScene.id) || [];
      emptyList.push(newPlacement);
      sceneEvidence.set(emptyScene.id, emptyList);
    }
  }

  return currentMap;
}

/**
 * Get evidence grouped by position zone for scene image prompts
 */
export function groupEvidenceByZone(
  placements: EvidencePlacement[]
): { floor: EvidencePlacement[]; surface: EvidencePlacement[]; wall: EvidencePlacement[] } {
  return {
    floor: placements.filter(p => p.positionY > 65),
    surface: placements.filter(p => p.positionY >= 40 && p.positionY <= 65),
    wall: placements.filter(p => p.positionY < 40),
  };
}
