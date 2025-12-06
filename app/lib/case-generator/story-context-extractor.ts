/**
 * STORY CONTEXT EXTRACTOR
 *
 * Extracts puzzle-relevant data from the case generation context.
 * This provides the raw material for generating curriculum-aligned puzzles
 * that are deeply integrated with the storyline.
 *
 * The key insight: Every puzzle should HELP SOLVE THE CASE.
 * - Time calculations verify alibis
 * - Money calculations reveal discrepancies
 * - Data analysis exposes patterns
 * - Logic puzzles eliminate suspects
 */

import { GenerationContext, ICrimeBlueprint, ISuspectProfile, IEvidenceItem, ICulpritDetermination } from './architecture';

// ============================================
// STORY CONTEXT TYPES
// ============================================

export interface TimelineEntry {
  suspectId: string;
  suspectName: string;
  role: string;
  arrivalMinutes: number;  // Minutes from midnight (e.g., 14:30 = 870)
  departureMinutes: number;
  arrivalDisplay: string;  // "2:30 PM"
  departureDisplay: string;
  claimedActivity: string;
  isVerified: boolean;     // Does evidence support this?
  isGuilty: boolean;
}

export interface MoneyTransaction {
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'missing';
  linkedTo?: string;  // Suspect or evidence ID
}

export interface DistanceRoute {
  from: string;
  to: string;
  distanceMeters: number;
  typicalWalkMinutes: number;  // At 5 km/h
}

export interface InventoryItem {
  name: string;
  countBefore: number;
  countAfter: number;
  missing: number;
  unitValue?: number;
}

export interface StoryContext {
  // Case basics
  caseTitle: string;
  crimeType: string;
  crimeDescription: string;
  locationType: string;
  locationName: string;

  // TIME DATA - for Rate, Time calculations, alibi verification
  timeData: {
    crimeWindow: {
      startMinutes: number;
      endMinutes: number;
      durationMinutes: number;
      startDisplay: string;
      endDisplay: string;
    };
    timelines: TimelineEntry[];
    // Who was present during crime window?
    presentDuringCrime: string[];
    // Whose alibi is impossible?
    impossibleAlibis: string[];
  };

  // MONEY DATA - for Percentage, Ratio, basic operations
  moneyData: {
    totalInvolved: number;
    missingAmount: number;
    transactions: MoneyTransaction[];
    percentageMissing: number;
  };

  // LOCATION DATA - for Rate (speed/distance), Area
  locationData: {
    mainLocation: string;
    routes: DistanceRoute[];
    areas?: Array<{ name: string; areaSqM: number }>;
  };

  // QUANTITY DATA - for Multiplication, Division, Fractions
  quantityData: {
    inventory: InventoryItem[];
    totalMissing: number;
    totalValue: number;
  };

  // SUSPECT DATA - for narrative context
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    alibiClaim: string;
    alibiTime: string;
    isGuilty: boolean;
    motive?: string;
    hasContradiction: boolean;
    contradictionDetails?: string;
  }>;

  // EVIDENCE DATA - for puzzle connections
  evidence: Array<{
    id: string;
    name: string;
    type: 'physical' | 'digital' | 'testimonial' | 'documentary';
    description: string;
    revealedData?: Record<string, any>;  // Numeric data that can be used in puzzles
    pointsTo?: string;  // Suspect ID this evidence implicates
  }>;

  // CULPRIT DATA - for conclusion puzzles
  culprit: {
    id: string;
    name: string;
    motive: string;
    method: string;
    keyMistake: string;  // The error that proves guilt
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function minutesToDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

function displayToMinutes(display: string): number {
  // Parse "2:30 PM" format
  const match = display.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;

  let hours = parseInt(match[1]);
  const mins = parseInt(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + mins;
}

function calculateWalkTime(distanceMeters: number, speedKmh: number = 5): number {
  const distanceKm = distanceMeters / 1000;
  const timeHours = distanceKm / speedKmh;
  return Math.round(timeHours * 60);  // Return minutes
}

// ============================================
// MAIN EXTRACTOR
// ============================================

export function extractStoryContext(context: GenerationContext): StoryContext {
  const blueprint = context.crimeBlueprint!;
  const suspects = context.suspectPool || [];
  const evidence = context.evidenceSet || [];
  const culpritDetermination = context.culpritDetermination!;

  // Find the guilty suspect
  const guiltySuspect = suspects.find(s => s.id === culpritDetermination.culpritId);

  // Extract crime window
  const crimeWindow = blueprint.timeline.crimeWindow;
  const crimeStartMinutes = crimeWindow.start.hours * 60 + crimeWindow.start.minutes;
  const crimeEndMinutes = crimeWindow.end.hours * 60 + crimeWindow.end.minutes;

  // Build timeline entries from suspects
  const timelines: TimelineEntry[] = suspects.map(suspect => {
    // Parse alibi times from the alibi string or generate reasonable times
    const alibiMatch = suspect.alibi.claimed.match(/(\d+:\d+\s*(?:AM|PM)?)/gi);
    const arrivalTime = alibiMatch?.[0] || minutesToDisplay(crimeStartMinutes - 30);
    const departureTime = alibiMatch?.[1] || minutesToDisplay(crimeEndMinutes + 30);

    const arrivalMinutes = displayToMinutes(arrivalTime);
    const departureMinutes = displayToMinutes(departureTime);

    // Check if this alibi places them at crime scene during crime window
    const wasPresent = arrivalMinutes <= crimeEndMinutes && departureMinutes >= crimeStartMinutes;

    return {
      suspectId: suspect.id,
      suspectName: suspect.name,
      role: suspect.role,
      arrivalMinutes,
      departureMinutes,
      arrivalDisplay: minutesToDisplay(arrivalMinutes),
      departureDisplay: minutesToDisplay(departureMinutes),
      claimedActivity: suspect.alibi.claimed,
      isVerified: suspect.alibi.verifiable,
      isGuilty: suspect.id === culpritDetermination.culpritId,
    };
  });

  // Determine who was present during crime
  const presentDuringCrime = timelines
    .filter(t => {
      const wasPresent = t.arrivalMinutes <= crimeEndMinutes && t.departureMinutes >= crimeStartMinutes;
      return wasPresent;
    })
    .map(t => t.suspectName);

  // Find impossible alibis (alibi contradicts evidence)
  const impossibleAlibis = suspects
    .filter(s => {
      // Check if evidence contradicts their alibi using proper IEvidenceItem fields
      const contradictingEvidence = evidence.find(e =>
        e.linkedToSuspects?.includes(s.id) && e.contradicts?.suspectId === s.id
      );
      return contradictingEvidence !== undefined;
    })
    .map(s => s.name);

  // Extract money data from crime
  const missingAmount = blueprint.crimeDetails.value?.amount ||
    (Math.floor(Math.random() * 20) + 5) * 10;  // $50-$250 range

  const transactions: MoneyTransaction[] = [
    {
      description: `Total ${blueprint.crimeDetails.target} before incident`,
      amount: missingAmount * 3,  // Assume 3x total was there
      type: 'income',
    },
    {
      description: 'Amount confirmed missing',
      amount: missingAmount,
      type: 'missing',
      linkedTo: culpritDetermination.culpritId,
    },
  ];

  // Generate location routes
  const routes: DistanceRoute[] = [
    {
      from: 'Main Gate',
      to: blueprint.crimeDetails.location,
      distanceMeters: 200 + Math.floor(Math.random() * 300),
      typicalWalkMinutes: 0,  // Will be calculated
    },
    {
      from: blueprint.crimeDetails.location,
      to: 'Staff Room',
      distanceMeters: 100 + Math.floor(Math.random() * 200),
      typicalWalkMinutes: 0,
    },
    {
      from: 'Library',
      to: blueprint.crimeDetails.location,
      distanceMeters: 150 + Math.floor(Math.random() * 250),
      typicalWalkMinutes: 0,
    },
  ];

  // Calculate walk times
  routes.forEach(r => {
    r.typicalWalkMinutes = calculateWalkTime(r.distanceMeters);
  });

  // Extract inventory data
  const inventory: InventoryItem[] = [
    {
      name: blueprint.crimeDetails.target || 'items',
      countBefore: Math.floor(Math.random() * 50) + 20,
      countAfter: 0,
      missing: 0,
      unitValue: missingAmount > 100 ? Math.floor(missingAmount / 5) : 10,
    },
  ];
  inventory[0].countAfter = inventory[0].countBefore - Math.floor(Math.random() * 10) - 3;
  inventory[0].missing = inventory[0].countBefore - inventory[0].countAfter;

  // Build suspect summaries
  const suspectSummaries = suspects.map(s => {
    // Check if evidence contradicts this suspect's alibi using proper IEvidenceItem fields
    const contradictingEvidence = evidence.find(e =>
      e.linkedToSuspects?.includes(s.id) && e.contradicts?.suspectId === s.id
    );
    const hasContradiction = contradictingEvidence !== undefined;

    return {
      id: s.id,
      name: s.name,
      role: s.role,
      alibiClaim: s.alibi.claimed,
      alibiTime: s.alibi.timeRange || `${minutesToDisplay(crimeStartMinutes - 30)} - ${minutesToDisplay(crimeEndMinutes + 30)}`,
      isGuilty: s.id === culpritDetermination.culpritId,
      motive: s.id === culpritDetermination.culpritId ? culpritDetermination.motive : undefined,
      hasContradiction,
      // Use the contradiction details from IEvidenceItem.contradicts
      contradictionDetails: contradictingEvidence?.contradicts?.truth || contradictingEvidence?.description,
    };
  });

  // Build evidence summaries with extractable data using proper IEvidenceItem fields
  const evidenceSummaries = evidence.map(e => ({
    id: e.id,
    name: e.title,  // IEvidenceItem uses 'title', not 'name'
    type: e.type,   // IEvidenceItem uses 'type', not 'category'
    description: e.description,
    revealedData: extractNumericData(e),
    // Check if this evidence contradicts a suspect (points to culprit)
    pointsTo: e.contradicts?.suspectId || (e.linkedToSuspects?.includes(culpritDetermination.culpritId) ? culpritDetermination.culpritId : undefined),
  }));

  return {
    caseTitle: blueprint.title,
    crimeType: blueprint.crimeDetails.type,
    crimeDescription: blueprint.crimeDetails.description || `${blueprint.crimeDetails.type} at ${blueprint.crimeDetails.location}`,
    locationType: blueprint.setting.type,
    locationName: blueprint.crimeDetails.location,

    timeData: {
      crimeWindow: {
        startMinutes: crimeStartMinutes,
        endMinutes: crimeEndMinutes,
        durationMinutes: crimeEndMinutes - crimeStartMinutes,
        startDisplay: minutesToDisplay(crimeStartMinutes),
        endDisplay: minutesToDisplay(crimeEndMinutes),
      },
      timelines,
      presentDuringCrime,
      impossibleAlibis,
    },

    moneyData: {
      totalInvolved: missingAmount * 3,
      missingAmount,
      transactions,
      percentageMissing: Math.round((missingAmount / (missingAmount * 3)) * 100),
    },

    locationData: {
      mainLocation: blueprint.crimeDetails.location,
      routes,
    },

    quantityData: {
      inventory,
      totalMissing: inventory.reduce((sum, i) => sum + i.missing, 0),
      totalValue: inventory.reduce((sum, i) => sum + (i.missing * (i.unitValue || 0)), 0),
    },

    suspects: suspectSummaries,

    evidence: evidenceSummaries,

    culprit: {
      id: culpritDetermination.culpritId,
      name: guiltySuspect?.name || 'Unknown',
      motive: culpritDetermination.motive,
      method: culpritDetermination.method,
      keyMistake: culpritDetermination.keyMistake || 'Left evidence at the scene',
    },
  };
}

/**
 * Extract numeric data from evidence for use in puzzles
 */
function extractNumericData(evidence: IEvidenceItem): Record<string, any> | undefined {
  const data: Record<string, any> = {};

  // Try to extract times
  const timeMatches = evidence.description.match(/(\d+:\d+\s*(?:AM|PM)?)/gi);
  if (timeMatches) {
    data.times = timeMatches.map(t => ({
      display: t,
      minutes: displayToMinutes(t),
    }));
  }

  // Try to extract money amounts
  const moneyMatches = evidence.description.match(/\$(\d+(?:\.\d{2})?)/g);
  if (moneyMatches) {
    data.amounts = moneyMatches.map(m => parseFloat(m.replace('$', '')));
  }

  // Try to extract quantities
  const quantityMatches = evidence.description.match(/(\d+)\s*(items?|pieces?|units?|boxes?|bags?)/gi);
  if (quantityMatches) {
    data.quantities = quantityMatches;
  }

  // Try to extract percentages
  const percentMatches = evidence.description.match(/(\d+(?:\.\d+)?)\s*%/g);
  if (percentMatches) {
    data.percentages = percentMatches.map(p => parseFloat(p.replace('%', '')));
  }

  return Object.keys(data).length > 0 ? data : undefined;
}

/**
 * Get puzzle-relevant facts from story context
 * These are the key pieces of information that puzzles can verify
 */
export function getPuzzleRelevantFacts(context: StoryContext): string[] {
  const facts: string[] = [];

  // Time-based facts
  facts.push(`The crime occurred between ${context.timeData.crimeWindow.startDisplay} and ${context.timeData.crimeWindow.endDisplay}`);
  facts.push(`The crime window was ${context.timeData.crimeWindow.durationMinutes} minutes long`);

  // Presence facts
  if (context.timeData.presentDuringCrime.length > 0) {
    facts.push(`The following people were present during the crime window: ${context.timeData.presentDuringCrime.join(', ')}`);
  }

  // Money facts
  if (context.moneyData.missingAmount > 0) {
    facts.push(`$${context.moneyData.missingAmount} is missing`);
    facts.push(`${context.moneyData.percentageMissing}% of the total was taken`);
  }

  // Location facts
  context.locationData.routes.forEach(r => {
    facts.push(`The distance from ${r.from} to ${r.to} is ${r.distanceMeters}m (${r.typicalWalkMinutes} min walk)`);
  });

  // Inventory facts
  context.quantityData.inventory.forEach(i => {
    if (i.missing > 0) {
      facts.push(`${i.missing} ${i.name} are missing (was ${i.countBefore}, now ${i.countAfter})`);
    }
  });

  // Alibi contradiction facts
  context.suspects.filter(s => s.hasContradiction).forEach(s => {
    facts.push(`${s.name}'s alibi contradicts the evidence: ${s.contradictionDetails}`);
  });

  return facts;
}
