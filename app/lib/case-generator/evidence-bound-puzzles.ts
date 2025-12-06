/**
 * EVIDENCE-BOUND PUZZLE SYSTEM
 *
 * Creates puzzles that are DIRECTLY connected to case evidence and suspects.
 * Each puzzle tests specific evidence, verifies alibis, or reveals contradictions.
 *
 * Key principles:
 * 1. Puzzles use ACTUAL case data (times, amounts, names)
 * 2. Solving reveals specific evidence connections
 * 3. Players feel achievement by discovering real inconsistencies
 * 4. Progressive unlocking - some puzzles require earlier evidence
 */

import { nanoid } from 'nanoid';
import { Puzzle, PuzzleComplexity } from './types';
import { NarrativeCase, TimelineEvent } from './narrative-engine';
import { SuspectCharacter } from './character-web';
import { EvidenceChain, EvidenceItem } from './evidence-chain';

// ============================================
// TYPES
// ============================================

export interface EvidenceBoundPuzzle extends Puzzle {
  // Core binding - what this puzzle tests
  bindingType: 'alibi_verification' | 'timeline_check' | 'financial_analysis' | 'contradiction_detection' | 'evidence_analysis';

  // What solving this puzzle proves
  proves: {
    claim: string;         // What was claimed (e.g., "Suspect left at 3pm")
    truth: string;         // What's actually true (e.g., "Evidence shows 3:15pm departure")
    isContradiction: boolean;
  };

  // Linked elements
  linkedEvidence: {
    id: string;
    name: string;
    type: EvidenceItem['type'];
  }[];

  linkedSuspect?: {
    id: string;
    name: string;
    isCulprit: boolean;
  };

  linkedTimelineEvent?: {
    id: string;
    time: string;
    description: string;
  };

  // MCQ options generated from actual case data
  options: string[];
  correctAnswer: string;

  // Story integration
  narrativeIntro: string;
  successNarrative: string;
  investigationPhase: 'initial' | 'investigation' | 'conclusion';

  // Unlocks
  unlocksEvidenceId?: string;
  requiresEvidenceIds?: string[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function parseTimeToMinutes(timeStr: string): number {
  // Parse times like "14:30" or "2:30 PM"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// ALIBI VERIFICATION PUZZLE GENERATOR
// ============================================

function generateAlibiVerificationPuzzle(
  suspect: SuspectCharacter,
  timeline: TimelineEvent[],
  crimeWindow: { start: string; end: string },
  complexity: PuzzleComplexity
): EvidenceBoundPuzzle | null {
  // Find timeline events involving this suspect
  const suspectEvents = timeline.filter(e =>
    e.involvedCharacters.includes(suspect.id) ||
    e.involvedCharacters.includes(suspect.name)
  );

  if (suspectEvents.length < 2) return null;

  // Parse crime window
  const crimeStart = parseTimeToMinutes(crimeWindow.start);
  const crimeEnd = parseTimeToMinutes(crimeWindow.end);

  // Get suspect's claimed alibi timing from alibi.claimed string
  const alibiClaimed = suspect.alibi.claimed;
  const alibiMatch = alibiClaimed.match(/(\d{1,2}:\d{2})\s*(AM|PM)?/gi);
  const claimedDeparture = alibiMatch?.[alibiMatch.length - 1] || crimeWindow.end;
  const claimedDepartureMinutes = parseTimeToMinutes(claimedDeparture);

  // Find actual evidence of when they could have been at crime scene
  const nearCrimeEvent = suspectEvents.find(e =>
    Math.abs(e.timeMinutes - crimeStart) < 30 ||
    Math.abs(e.timeMinutes - crimeEnd) < 30
  );

  // Create the puzzle based on whether this suspect is guilty
  const isGuilty = suspect.isGuilty;

  // Calculate travel time or presence window
  const travelTimeMinutes = randomInt(5, 15);
  const actualPresenceStart = (nearCrimeEvent?.timeMinutes || crimeStart) - travelTimeMinutes;
  const actualPresenceEnd = (nearCrimeEvent?.timeMinutes || crimeEnd) + travelTimeMinutes;

  // Check if alibi holds
  const alibiHolds = claimedDepartureMinutes < crimeStart || actualPresenceStart > crimeEnd;

  // Build puzzle question using actual case data
  const question = `${suspect.name} (${suspect.role}) claims: "${suspect.alibi}"

The crime occurred between ${crimeWindow.start} and ${crimeWindow.end}.

Evidence shows:
- ${suspect.name} was seen at ${formatTime(Math.floor(actualPresenceStart / 60), actualPresenceStart % 60)}
- Travel time to crime scene: ${travelTimeMinutes} minutes
- ${nearCrimeEvent ? `Security log: "${nearCrimeEvent.description}" at ${nearCrimeEvent.time}` : `No direct evidence of location during crime window`}

Calculate: Could ${suspect.name} have been at the crime scene during the crime window?`;

  // Generate answer
  const couldBePresent = !alibiHolds;
  const correctAnswer = couldBePresent
    ? `Yes - ${suspect.name} had opportunity`
    : `No - ${suspect.name}'s alibi is solid`;

  const answer = `Analysis:
- Crime window: ${crimeWindow.start} to ${crimeWindow.end} (${crimeEnd - crimeStart} minutes)
- ${suspect.name} was at ${formatTime(Math.floor(actualPresenceStart / 60), actualPresenceStart % 60)}
- With ${travelTimeMinutes} min travel time, they could reach crime scene by ${formatTime(Math.floor((actualPresenceStart + travelTimeMinutes) / 60), (actualPresenceStart + travelTimeMinutes) % 60)}
- ${couldBePresent ? 'This OVERLAPS with the crime window!' : 'This does NOT overlap with the crime window.'}

CONCLUSION: ${correctAnswer}
${isGuilty && couldBePresent ? '⚠️ This suspect had OPPORTUNITY to commit the crime!' : ''}`;

  // Generate MCQ options
  const options = shuffleArray([
    correctAnswer,
    couldBePresent ? `No - ${suspect.name}'s alibi is solid` : `Yes - ${suspect.name} had opportunity`,
    `Insufficient evidence to determine`,
    `${suspect.name} was definitely at the crime scene`,
  ]);

  const narrativeIntro = `You need to verify ${suspect.name}'s alibi. They claim to have been elsewhere during the crime, but the evidence might tell a different story.`;

  const successNarrative = couldBePresent && isGuilty
    ? `Your calculations reveal a critical finding! ${suspect.name}'s alibi has a hole - they COULD have been at the crime scene during the critical window. This is a major breakthrough in the investigation!`
    : couldBePresent && !isGuilty
    ? `Your analysis shows ${suspect.name} could technically have been present, but other evidence may clear them.`
    : `Your analysis confirms ${suspect.name}'s alibi holds up. They couldn't have been at the crime scene during the crime window.`;

  return {
    id: `puzzle-alibi-${suspect.id}-${nanoid(4)}`,
    title: `Alibi Check: ${suspect.name}`,
    type: 'math',
    question,
    answer,
    options,
    correctAnswer,
    hint: 'Calculate when the suspect could reach the crime scene and compare to the crime window.',
    points: complexity === 'BASIC' ? 15 : complexity === 'STANDARD' ? 25 : 40,
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : 3,
    complexity,
    estimatedMinutes: complexity === 'BASIC' ? 3 : complexity === 'STANDARD' ? 5 : 8,
    requiresMultipleSteps: complexity !== 'BASIC',

    bindingType: 'alibi_verification',
    proves: {
      claim: suspect.alibi.claimed,
      truth: couldBePresent ? `${suspect.name} could have been at the crime scene` : `${suspect.name}'s alibi is verified`,
      isContradiction: couldBePresent && isGuilty,
    },
    linkedEvidence: nearCrimeEvent ? [{
      id: `evidence-timeline-${nearCrimeEvent.id}`,
      name: nearCrimeEvent.description,
      type: 'digital',
    }] : [],
    linkedSuspect: {
      id: suspect.id,
      name: suspect.name,
      isCulprit: isGuilty,
    },
    linkedTimelineEvent: nearCrimeEvent ? {
      id: nearCrimeEvent.id,
      time: nearCrimeEvent.time,
      description: nearCrimeEvent.description,
    } : undefined,
    narrativeIntro,
    successNarrative,
    investigationPhase: 'investigation',
  };
}

// ============================================
// FINANCIAL EVIDENCE PUZZLE GENERATOR
// ============================================

function generateFinancialEvidencePuzzle(
  evidence: EvidenceItem,
  suspect: SuspectCharacter | undefined,
  crimeType: string,
  complexity: PuzzleComplexity
): EvidenceBoundPuzzle | null {
  if (evidence.type !== 'documentary' && evidence.type !== 'digital') return null;

  // Generate financial puzzle based on crime type
  const isTheft = crimeType === 'theft' || crimeType === 'fraud';

  // Create realistic financial scenario from evidence
  const baseAmount = randomInt(50, 200);
  const items = randomInt(3, 6);
  const pricePerItem = randomInt(5, 25);
  const expectedTotal = items * pricePerItem;
  const discrepancy = randomInt(15, 50);
  const actualTotal = isTheft ? expectedTotal - discrepancy : expectedTotal;

  const question = `You're examining ${evidence.name}.

The records show:
- Opening balance: $${baseAmount}
- ${items} items sold at $${pricePerItem} each
- Closing balance: $${baseAmount + actualTotal}

Expected closing balance should be: Opening + Total Sales

${suspect ? `${suspect.name} (${suspect.role}) was responsible for these records.` : ''}

Calculate:
1. What should the closing balance be?
2. Is there a discrepancy? If so, how much?`;

  const hasDiscrepancy = actualTotal !== expectedTotal;
  const correctAnswer = hasDiscrepancy
    ? `$${discrepancy} is missing`
    : `No discrepancy - records are accurate`;

  const answer = `Calculations:
1. Total sales = ${items} × $${pricePerItem} = $${expectedTotal}
2. Expected closing = $${baseAmount} + $${expectedTotal} = $${baseAmount + expectedTotal}
3. Actual closing = $${baseAmount + actualTotal}
4. Discrepancy = $${baseAmount + expectedTotal} - $${baseAmount + actualTotal} = $${discrepancy}

${hasDiscrepancy ? `⚠️ There IS a discrepancy of $${discrepancy}!` : 'The records match perfectly.'}
${hasDiscrepancy && suspect ? `This points to ${suspect.name}'s involvement!` : ''}`;

  const options = shuffleArray([
    correctAnswer,
    `$${discrepancy + 10} is missing`,
    `$${Math.max(5, discrepancy - 10)} is missing`,
    `No discrepancy - records are accurate`,
  ].filter((v, i, arr) => arr.indexOf(v) === i)); // Remove duplicates

  return {
    id: `puzzle-financial-${evidence.id}-${nanoid(4)}`,
    title: `Financial Analysis: ${evidence.name}`,
    type: 'math',
    question,
    answer,
    options,
    correctAnswer,
    hint: 'Calculate expected total, then compare with actual closing balance.',
    points: complexity === 'BASIC' ? 15 : complexity === 'STANDARD' ? 25 : 40,
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : 3,
    complexity,
    estimatedMinutes: complexity === 'BASIC' ? 3 : complexity === 'STANDARD' ? 5 : 8,
    requiresMultipleSteps: true,

    bindingType: 'financial_analysis',
    proves: {
      claim: 'The financial records are accurate',
      truth: hasDiscrepancy ? `$${discrepancy} is unaccounted for` : 'Records are accurate',
      isContradiction: hasDiscrepancy,
    },
    linkedEvidence: [{
      id: evidence.id,
      name: evidence.name,
      type: evidence.type,
    }],
    linkedSuspect: suspect ? {
      id: suspect.id,
      name: suspect.name,
      isCulprit: suspect.isGuilty,
    } : undefined,
    narrativeIntro: `You've obtained ${evidence.name}. A careful financial analysis might reveal if something is amiss.`,
    successNarrative: hasDiscrepancy
      ? `Your calculations reveal a discrepancy of $${discrepancy}! This is solid evidence that something illegal occurred. ${suspect ? `${suspect.name} was in charge of these records...` : ''}`
      : `Your analysis shows the financial records are accurate. This rules out financial motive.`,
    investigationPhase: 'investigation',
  };
}

// ============================================
// TIMELINE CONTRADICTION PUZZLE GENERATOR
// ============================================

function generateTimelineContradictionPuzzle(
  suspects: SuspectCharacter[],
  timeline: TimelineEvent[],
  crimeWindow: { start: string; end: string },
  complexity: PuzzleComplexity
): EvidenceBoundPuzzle | null {
  if (suspects.length < 2 || timeline.length < 3) return null;

  const guiltyChar = suspects.find(s => s.isGuilty);
  const innocentChar = suspects.find(s => !s.isGuilty);

  if (!guiltyChar || !innocentChar) return null;

  // Create timeline puzzle based on actual events
  const crimeStartMin = parseTimeToMinutes(crimeWindow.start);
  const crimeEndMin = parseTimeToMinutes(crimeWindow.end);

  // Generate conflicting timeline claims
  const guiltyClaimedTime = formatTime(
    Math.floor((crimeStartMin - randomInt(30, 60)) / 60),
    (crimeStartMin - randomInt(30, 60)) % 60
  );

  const actualGuiltyTime = formatTime(
    Math.floor((crimeStartMin + randomInt(5, 15)) / 60),
    (crimeStartMin + randomInt(5, 15)) % 60
  );

  const innocentTime = formatTime(
    Math.floor((crimeEndMin + randomInt(30, 60)) / 60),
    (crimeEndMin + randomInt(30, 60)) % 60
  );

  const question = `Compare these suspect statements with the timeline evidence:

${guiltyChar.name} (${guiltyChar.role}) claims: "I left the area at ${guiltyClaimedTime}."
${innocentChar.name} (${innocentChar.role}) claims: "I arrived at ${innocentTime}."

Evidence found:
- CCTV footage shows ${guiltyChar.name} near the scene at ${actualGuiltyTime}
- Access log confirms ${innocentChar.name} entered at ${innocentTime}
- Crime window: ${crimeWindow.start} to ${crimeWindow.end}

Which suspect's statement contradicts the evidence?`;

  const correctAnswer = `${guiltyChar.name}'s statement is contradicted`;

  const answer = `Analysis:

${guiltyChar.name}:
- Claims: Left at ${guiltyClaimedTime}
- Evidence: CCTV shows them at ${actualGuiltyTime}
- Crime window: ${crimeWindow.start} - ${crimeWindow.end}
- ⚠️ CONTRADICTION: They were seen DURING the crime window!

${innocentChar.name}:
- Claims: Arrived at ${innocentTime}
- Evidence: Access log confirms ${innocentTime}
- ✓ CONSISTENT: Statement matches evidence

CONCLUSION: ${guiltyChar.name}'s statement is contradicted by the CCTV footage.`;

  const options = shuffleArray([
    correctAnswer,
    `${innocentChar.name}'s statement is contradicted`,
    `Both statements are contradicted`,
    `Neither statement is contradicted`,
  ]);

  return {
    id: `puzzle-contradiction-${nanoid(6)}`,
    title: `Statement Analysis: Finding the Lie`,
    type: 'logic',
    question,
    answer,
    options,
    correctAnswer,
    hint: 'Compare each suspect\'s claimed times with what the evidence actually shows.',
    points: complexity === 'BASIC' ? 20 : complexity === 'STANDARD' ? 30 : 45,
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : 3,
    complexity,
    estimatedMinutes: complexity === 'BASIC' ? 4 : complexity === 'STANDARD' ? 6 : 10,
    requiresMultipleSteps: true,

    bindingType: 'contradiction_detection',
    proves: {
      claim: `${guiltyChar.name} claims: "I left at ${guiltyClaimedTime}"`,
      truth: `CCTV shows ${guiltyChar.name} at ${actualGuiltyTime} - DURING the crime!`,
      isContradiction: true,
    },
    linkedEvidence: [
      { id: 'cctv-footage', name: 'CCTV Footage', type: 'digital' },
      { id: 'access-log', name: 'Access Log', type: 'digital' },
    ],
    linkedSuspect: {
      id: guiltyChar.id,
      name: guiltyChar.name,
      isCulprit: true,
    },
    narrativeIntro: `You've gathered statements from multiple suspects. Time to cross-reference them with the evidence and find who's lying.`,
    successNarrative: `Excellent detective work! You've caught ${guiltyChar.name} in a lie! Their claim to have left at ${guiltyClaimedTime} is directly contradicted by CCTV footage showing them at ${actualGuiltyTime} - right in the middle of the crime window. This is damning evidence!`,
    investigationPhase: 'investigation',
  };
}

// ============================================
// EVIDENCE ANALYSIS PUZZLE GENERATOR
// ============================================

function generateEvidenceAnalysisPuzzle(
  evidence: EvidenceItem,
  suspects: SuspectCharacter[],
  complexity: PuzzleComplexity
): EvidenceBoundPuzzle | null {
  const guiltyChar = suspects.find(s => s.isGuilty);
  if (!guiltyChar || evidence.type === 'testimonial') return null;

  // Create puzzle based on evidence type
  let question: string;
  let answer: string;
  let correctAnswer: string;
  let options: string[];

  switch (evidence.type) {
    case 'physical':
      // Fingerprint/physical evidence analysis
      const matchCount = randomInt(3, 8);
      const partialMatches = randomInt(1, 3);

      question = `Forensic analysis of ${evidence.name}:

- ${matchCount} clear fingerprint points found
- Minimum 6 points needed for positive identification
- Partial matches with ${partialMatches} suspect(s)
- Full match found with one suspect

${evidence.analysisResult || 'The evidence points to one of the suspects.'}

Based on this analysis, can we make a positive identification?`;

      const canIdentify = matchCount >= 6;
      correctAnswer = canIdentify ? 'Yes - positive identification possible' : 'No - insufficient points for identification';

      answer = `Forensic Standards:
- ${matchCount} fingerprint points found
- Requirement: 6 points minimum
- ${matchCount} ${canIdentify ? '>=' : '<'} 6

${canIdentify ? `✓ POSITIVE IDENTIFICATION is possible!` : `✗ Cannot make positive identification.`}
${canIdentify && evidence.linkedCharacterId === guiltyChar.id ? `The prints match ${guiltyChar.name}!` : ''}`;

      options = shuffleArray([
        correctAnswer,
        canIdentify ? 'No - insufficient points for identification' : 'Yes - positive identification possible',
        'More forensic tests are needed',
        'The evidence has been contaminated',
      ]);
      break;

    case 'digital':
      // Digital evidence analysis
      const accessAttempts = randomInt(3, 10);
      const successfulAccess = randomInt(1, accessAttempts);
      const suspiciousTime = randomInt(14, 17);

      question = `Digital log analysis of ${evidence.name}:

Access attempts in the last 24 hours:
- Total attempts: ${accessAttempts}
- Successful: ${successfulAccess}
- Failed: ${accessAttempts - successfulAccess}
- Suspicious activity detected at ${suspiciousTime}:00

${evidence.visualCue || 'The logs show unusual patterns.'}

What percentage of access attempts were successful?`;

      const percentage = Math.round((successfulAccess / accessAttempts) * 100);
      correctAnswer = `${percentage}%`;

      answer = `Calculation:
Successful attempts / Total attempts × 100
= ${successfulAccess} / ${accessAttempts} × 100
= ${percentage}%

${percentage < 50 ? 'The high failure rate suggests someone trying to guess credentials!' : 'Access pattern appears normal.'}`;

      options = shuffleArray([
        correctAnswer,
        `${percentage + 10}%`,
        `${Math.max(10, percentage - 15)}%`,
        `${Math.min(90, percentage + 25)}%`,
      ]);
      break;

    default:
      // Document analysis
      const documentsAnalyzed = randomInt(5, 15);
      const irregularities = randomInt(2, 5);

      question = `Analysis of ${evidence.name}:

- ${documentsAnalyzed} documents examined
- ${irregularities} irregularities found
- ${evidence.description}

What is the irregularity rate?`;

      const irregRate = Math.round((irregularities / documentsAnalyzed) * 100);
      correctAnswer = `${irregRate}% irregularity rate`;

      answer = `Calculation:
Irregularities / Total documents × 100
= ${irregularities} / ${documentsAnalyzed} × 100
= ${irregRate}%

${irregRate > 20 ? 'This high irregularity rate suggests intentional manipulation!' : 'Irregularity rate within normal range.'}`;

      options = shuffleArray([
        correctAnswer,
        `${irregRate + 12}% irregularity rate`,
        `${Math.max(5, irregRate - 8)}% irregularity rate`,
        `0% - no irregularities found`,
      ]);
  }

  return {
    id: `puzzle-evidence-${evidence.id}-${nanoid(4)}`,
    title: `Evidence Analysis: ${evidence.name}`,
    type: 'math',
    question,
    answer,
    options,
    correctAnswer,
    hint: 'Read the evidence carefully and perform the required calculation.',
    points: complexity === 'BASIC' ? 15 : complexity === 'STANDARD' ? 25 : 35,
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : 3,
    complexity,
    estimatedMinutes: complexity === 'BASIC' ? 3 : complexity === 'STANDARD' ? 5 : 7,
    requiresMultipleSteps: complexity !== 'BASIC',

    bindingType: 'evidence_analysis',
    proves: {
      claim: evidence.description,
      truth: evidence.analysisResult || 'Evidence analysis complete',
      isContradiction: evidence.importance === 'critical',
    },
    linkedEvidence: [{
      id: evidence.id,
      name: evidence.name,
      type: evidence.type,
    }],
    linkedSuspect: guiltyChar ? {
      id: guiltyChar.id,
      name: guiltyChar.name,
      isCulprit: true,
    } : undefined,
    narrativeIntro: `You've collected ${evidence.name}. A thorough analysis will reveal what it tells us about the case.`,
    successNarrative: `Your analysis of ${evidence.name} is complete. ${evidence.analysisResult || 'This evidence moves the investigation forward.'}`,
    investigationPhase: evidence.importance === 'critical' ? 'conclusion' : 'investigation',
  };
}

// ============================================
// MAIN EXPORT: Generate Evidence-Bound Puzzle Set
// ============================================

export interface EvidenceBoundPuzzleSet {
  caseId: string;
  puzzles: EvidenceBoundPuzzle[];
  puzzlesByPhase: {
    initial: EvidenceBoundPuzzle[];
    investigation: EvidenceBoundPuzzle[];
    conclusion: EvidenceBoundPuzzle[];
  };
  totalPoints: number;
  estimatedMinutes: number;
  contradictionsFound: number;
}

export function generateEvidenceBoundPuzzles(
  narrativeCase: NarrativeCase,
  suspects: SuspectCharacter[],
  evidenceChain: EvidenceChain,
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  puzzleCount: number = 5,
  complexity: PuzzleComplexity = 'STANDARD'
): EvidenceBoundPuzzleSet {
  const puzzles: EvidenceBoundPuzzle[] = [];
  const timeline = narrativeCase.timeline || [];
  const crimeWindow = narrativeCase.crime.crimeWindow;

  // 1. Generate alibi verification puzzles for each suspect
  for (const suspect of suspects) {
    const alibiPuzzle = generateAlibiVerificationPuzzle(
      suspect, timeline, crimeWindow, complexity
    );
    if (alibiPuzzle) {
      puzzles.push(alibiPuzzle);
    }
  }

  // 2. Generate timeline contradiction puzzle
  const contradictionPuzzle = generateTimelineContradictionPuzzle(
    suspects, timeline, crimeWindow, complexity
  );
  if (contradictionPuzzle) {
    puzzles.push(contradictionPuzzle);
  }

  // 3. Generate financial evidence puzzles
  const financialEvidence = [...evidenceChain.initialEvidence, ...evidenceChain.discoveredEvidence]
    .filter(e => e.type === 'documentary' || e.type === 'digital');

  for (const evidence of financialEvidence.slice(0, 2)) {
    const linkedSuspect = suspects.find(s => s.id === evidence.linkedCharacterId);
    const financialPuzzle = generateFinancialEvidencePuzzle(
      evidence, linkedSuspect, narrativeCase.crime.type, complexity
    );
    if (financialPuzzle) {
      puzzles.push(financialPuzzle);
    }
  }

  // 4. Generate evidence analysis puzzles
  const physicalEvidence = [...evidenceChain.initialEvidence, ...evidenceChain.discoveredEvidence]
    .filter(e => e.type === 'physical');

  for (const evidence of physicalEvidence.slice(0, 2)) {
    const analysisPuzzle = generateEvidenceAnalysisPuzzle(
      evidence, suspects, complexity
    );
    if (analysisPuzzle) {
      puzzles.push(analysisPuzzle);
    }
  }

  // 5. Generate conclusion puzzle from conclusive evidence
  if (evidenceChain.conclusiveEvidence.length > 0) {
    const conclusiveEvidence = evidenceChain.conclusiveEvidence[0];
    const conclusionPuzzle = generateEvidenceAnalysisPuzzle(
      conclusiveEvidence, suspects,
      complexity === 'BASIC' ? 'STANDARD' : complexity === 'STANDARD' ? 'CHALLENGING' : 'EXPERT'
    );
    if (conclusionPuzzle) {
      conclusionPuzzle.investigationPhase = 'conclusion';
      conclusionPuzzle.successNarrative = `This is it! Your analysis of ${conclusiveEvidence.name} provides the final piece of evidence. Combined with the alibi contradictions and timeline analysis, you can now prove who committed the ${narrativeCase.crime.type}!`;
      puzzles.push(conclusionPuzzle);
    }
  }

  // Limit to requested puzzle count
  const selectedPuzzles = puzzles.slice(0, puzzleCount);

  // Categorize by phase
  const byPhase = {
    initial: selectedPuzzles.filter(p => p.investigationPhase === 'initial'),
    investigation: selectedPuzzles.filter(p => p.investigationPhase === 'investigation'),
    conclusion: selectedPuzzles.filter(p => p.investigationPhase === 'conclusion'),
  };

  // If no initial puzzles, move first investigation puzzle to initial
  if (byPhase.initial.length === 0 && byPhase.investigation.length > 0) {
    const first = byPhase.investigation.shift()!;
    first.investigationPhase = 'initial';
    byPhase.initial.push(first);
  }

  // Count contradictions found
  const contradictionsFound = selectedPuzzles.filter(p => p.proves.isContradiction).length;

  return {
    caseId: narrativeCase.id,
    puzzles: selectedPuzzles,
    puzzlesByPhase: byPhase,
    totalPoints: selectedPuzzles.reduce((sum, p) => sum + p.points, 0),
    estimatedMinutes: selectedPuzzles.reduce((sum, p) => sum + p.estimatedMinutes, 0),
    contradictionsFound,
  };
}

// ============================================
// UTILITY EXPORTS
// ============================================

export function getPuzzleNarrativeIntro(puzzle: EvidenceBoundPuzzle): string {
  return puzzle.narrativeIntro;
}

export function getPuzzleSuccessNarrative(puzzle: EvidenceBoundPuzzle): string {
  return puzzle.successNarrative;
}

export function getLinkedEvidenceIds(puzzle: EvidenceBoundPuzzle): string[] {
  return puzzle.linkedEvidence.map(e => e.id);
}

export function getPuzzlesProvingContradictions(puzzles: EvidenceBoundPuzzle[]): EvidenceBoundPuzzle[] {
  return puzzles.filter(p => p.proves.isContradiction);
}

export function getLinkedSuspectId(puzzle: EvidenceBoundPuzzle): string | undefined {
  return puzzle.linkedSuspect?.id;
}
