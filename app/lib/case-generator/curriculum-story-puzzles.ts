/**
 * CURRICULUM-STORY INTEGRATED PUZZLE GENERATOR
 *
 * This is the core system that generates puzzles which are:
 * 1. Aligned with Singapore MOE syllabus topics
 * 2. Deeply integrated with the case storyline
 * 3. Essential to solving the mystery (not just tacked-on math)
 *
 * KEY PRINCIPLE: Every puzzle should HELP SOLVE THE CASE
 * - Solving a time puzzle verifies/contradicts an alibi
 * - Solving a money puzzle reveals a discrepancy
 * - Solving a logic puzzle eliminates suspects
 * - The player learns math/science BY investigating
 */

import { nanoid } from 'nanoid';
import { StoryContext, TimelineEntry } from './story-context-extractor';
import {
  SyllabusTopic,
  GradeLevel,
  Subject,
  getTopicsByGrade,
  getTopicsBySubject,
  fullSyllabus,
} from './syllabus';
import { getSyllabusTracker } from './syllabus-tracker';
import { PuzzleComplexity } from './types';
import { IPuzzle } from './architecture';

// ============================================
// TYPES
// ============================================

export interface StoryIntegratedPuzzle extends IPuzzle {
  // Curriculum alignment
  syllabusTopicId: string;
  syllabusTopicName: string;
  learningObjective: string;
  skills: string[];

  // Story integration
  storyConnection: string;  // How this puzzle connects to the case
  revealsAbout: 'alibi' | 'evidence' | 'motive' | 'timeline' | 'culprit';
  affectedSuspect?: string;  // Which suspect this puzzle is about
  affectedEvidence?: string; // Which evidence this puzzle analyzes

  // Investigation impact
  revelation: {
    type: 'alibi_verified' | 'alibi_broken' | 'evidence_analyzed' | 'suspect_eliminated' | 'culprit_identified';
    description: string;
    storyText: string;  // Narrative text shown after solving
    importance: 'minor' | 'moderate' | 'major' | 'critical';
  };
}

interface TopicStoryMatch {
  topic: SyllabusTopic;
  storyElement: 'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic';
  relevanceScore: number;
  puzzleOpportunity: string;  // What puzzle can be made
}

// ============================================
// TOPIC-STORY MATCHING
// ============================================

/**
 * Map syllabus topics to story elements they can be used for
 */
const TOPIC_STORY_MAPPING: Record<string, {
  storyElements: Array<'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic'>;
  puzzleTypes: string[];
}> = {
  // P4 Math
  'p4-math-whole-numbers': { storyElements: ['quantity', 'money'], puzzleTypes: ['counting', 'comparison'] },
  'p4-math-multiplication': { storyElements: ['quantity', 'money'], puzzleTypes: ['total-calculation', 'inventory'] },
  'p4-math-factors-multiples': { storyElements: ['quantity', 'time'], puzzleTypes: ['grouping', 'scheduling'] },
  'p4-math-fractions': { storyElements: ['quantity', 'time'], puzzleTypes: ['portion', 'time-fraction'] },
  'p4-math-decimals': { storyElements: ['money'], puzzleTypes: ['money-calculation', 'measurement'] },
  'p4-math-area-perimeter': { storyElements: ['distance'], puzzleTypes: ['crime-scene-area', 'perimeter'] },
  'p4-math-tables-graphs': { storyElements: ['data'], puzzleTypes: ['cctv-log', 'sales-data'] },
  'p4-math-angles': { storyElements: ['distance'], puzzleTypes: ['direction', 'visibility'] },

  // P5 Math
  'p5-math-whole-numbers': { storyElements: ['quantity', 'money'], puzzleTypes: ['large-calculation', 'bodmas'] },
  'p5-math-fractions': { storyElements: ['quantity', 'time'], puzzleTypes: ['fraction-of-time', 'splitting'] },
  'p5-math-percentage': { storyElements: ['money', 'quantity'], puzzleTypes: ['discount', 'missing-percentage'] },
  'p5-math-decimals': { storyElements: ['money', 'distance'], puzzleTypes: ['precise-calculation'] },
  'p5-math-area-perimeter': { storyElements: ['distance'], puzzleTypes: ['triangle-area', 'composite'] },
  'p5-math-volume': { storyElements: ['quantity'], puzzleTypes: ['container', 'capacity'] },
  'p5-math-rate': { storyElements: ['time', 'distance'], puzzleTypes: ['alibi-verification', 'travel-time'] },

  // P6 Math
  'p6-math-algebra': { storyElements: ['logic', 'quantity'], puzzleTypes: ['unknown-value', 'equation'] },
  'p6-math-ratio': { storyElements: ['quantity', 'money'], puzzleTypes: ['splitting-loot', 'proportion'] },
  'p6-math-percentage-advanced': { storyElements: ['money'], puzzleTypes: ['profit-loss', 'gst'] },
  'p6-math-average': { storyElements: ['data', 'time'], puzzleTypes: ['average-time', 'missing-value'] },
  'p6-math-circles': { storyElements: ['distance'], puzzleTypes: ['circumference', 'area'] },

  // P4 Science
  'p4-sci-heat': { storyElements: ['time', 'logic'], puzzleTypes: ['cooling-time', 'conductor'] },
  'p4-sci-light': { storyElements: ['logic'], puzzleTypes: ['shadow-analysis', 'visibility'] },
  'p4-sci-matter': { storyElements: ['logic'], puzzleTypes: ['state-change', 'material'] },

  // P5 Science
  'p5-sci-electrical': { storyElements: ['logic'], puzzleTypes: ['circuit-analysis', 'power-outage'] },
  'p5-sci-water-cycle': { storyElements: ['time', 'logic'], puzzleTypes: ['weather-alibi'] },

  // P6 Science
  'p6-sci-forces': { storyElements: ['logic', 'distance'], puzzleTypes: ['movement-analysis'] },
  'p6-sci-food-chains': { storyElements: ['logic'], puzzleTypes: ['ecosystem-clue'] },
};

/**
 * Find the best topic-story matches for the given context
 */
export function findTopicStoryMatches(
  gradeLevel: GradeLevel,
  subject: Subject,
  storyContext: StoryContext,
  maxMatches: number = 5
): TopicStoryMatch[] {
  const tracker = getSyllabusTracker();
  const matches: TopicStoryMatch[] = [];

  // Get all topics for this grade/subject
  let topics = fullSyllabus.filter(t =>
    t.gradeLevel === gradeLevel &&
    (subject === 'INTEGRATED' || t.subject === subject)
  );

  // Score each topic by story relevance AND coverage need
  for (const topic of topics) {
    const mapping = TOPIC_STORY_MAPPING[topic.id];
    if (!mapping) continue;

    // Check which story elements are available
    let storyRelevance = 0;
    let bestElement: 'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic' = 'logic';

    for (const element of mapping.storyElements) {
      const elementScore = scoreStoryElement(element, storyContext);
      if (elementScore > storyRelevance) {
        storyRelevance = elementScore;
        bestElement = element;
      }
    }

    // Get coverage need from tracker
    const usage = tracker.getTopicUsage(topic.id);
    const coverageNeed = usage ? (usage.usageCount === 0 ? 100 : 50 / usage.usageCount) : 100;

    // Combined score
    const totalScore = storyRelevance * 0.6 + coverageNeed * 0.4;

    if (storyRelevance > 0) {
      matches.push({
        topic,
        storyElement: bestElement,
        relevanceScore: totalScore,
        puzzleOpportunity: describePuzzleOpportunity(topic, bestElement, storyContext),
      });
    }
  }

  // Sort by relevance and return top matches
  return matches
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxMatches);
}

/**
 * Score how well a story element is represented in the context
 */
function scoreStoryElement(
  element: 'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic',
  context: StoryContext
): number {
  switch (element) {
    case 'time':
      // Good if we have timeline data and crime window
      return context.timeData.timelines.length > 0 ? 80 : 20;

    case 'money':
      // Good if money is involved in the crime
      return context.moneyData.missingAmount > 0 ? 90 : 10;

    case 'distance':
      // Good if we have route data
      return context.locationData.routes.length > 0 ? 70 : 20;

    case 'quantity':
      // Good if inventory data exists
      return context.quantityData.inventory.length > 0 ? 75 : 25;

    case 'data':
      // Good if we have multiple suspects/evidence to analyze
      return (context.suspects.length >= 3 || context.evidence.length >= 3) ? 80 : 30;

    case 'logic':
      // Always somewhat applicable
      return 50;
  }
}

/**
 * Describe what puzzle can be made from this topic-story combination
 */
function describePuzzleOpportunity(
  topic: SyllabusTopic,
  element: 'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic',
  context: StoryContext
): string {
  const mapping = TOPIC_STORY_MAPPING[topic.id];
  if (!mapping) return 'General puzzle';

  switch (element) {
    case 'time':
      return `Verify alibis using ${topic.name} - check if suspects could have been at crime scene`;
    case 'money':
      return `Analyze financial discrepancy using ${topic.name} - calculate missing amounts`;
    case 'distance':
      return `Calculate travel times using ${topic.name} - verify suspect movements`;
    case 'quantity':
      return `Investigate inventory using ${topic.name} - determine what was taken`;
    case 'data':
      return `Analyze evidence patterns using ${topic.name} - find contradictions`;
    case 'logic':
      return `Deduce suspect involvement using ${topic.name} - eliminate possibilities`;
  }
}

// ============================================
// PUZZLE GENERATORS BY STORY ELEMENT
// ============================================

/**
 * Generate a time-based puzzle (Rate, Time calculations)
 * REVELATION: Verifies or contradicts a suspect's alibi
 */
function generateTimePuzzle(
  topic: SyllabusTopic,
  context: StoryContext,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle {
  // Pick a suspect to verify
  const suspect = context.suspects[Math.floor(Math.random() * context.suspects.length)];
  const timeline = context.timeData.timelines.find(t => t.suspectId === suspect.id);

  // Pick a route
  const route = context.locationData.routes[0];

  // Calculate: Could they have traveled from A to B in the alibi time?
  const walkSpeed = 5; // km/h
  const distanceKm = route.distanceMeters / 1000;
  const timeNeededMinutes = Math.round((distanceKm / walkSpeed) * 60);

  // Create a scenario
  const departureTime = context.timeData.crimeWindow.startMinutes - 15;
  const arrivalNeeded = context.timeData.crimeWindow.startMinutes;
  const timeAvailable = arrivalNeeded - departureTime;
  const couldMakeIt = timeNeededMinutes <= timeAvailable;

  const question = complexity === 'BASIC'
    ? `${suspect.name} left ${route.from} at ${minutesToDisplay(departureTime)}. Walking at ${walkSpeed} km/h, the distance to ${route.to} is ${route.distanceMeters}m.\n\nHow many minutes would the journey take?`
    : `${suspect.name} claims they left ${route.from} at ${minutesToDisplay(departureTime)} and arrived at ${route.to} at ${minutesToDisplay(arrivalNeeded)}.\n\nThe distance is ${route.distanceMeters}m. Walking speed is ${walkSpeed} km/h.\n\n1. Calculate the journey time\n2. Is ${suspect.name}'s claim possible?`;

  const answer = complexity === 'BASIC'
    ? `${timeNeededMinutes} minutes`
    : `Journey time: ${route.distanceMeters}m ÷ 1000 = ${distanceKm}km\nTime = ${distanceKm}km ÷ ${walkSpeed}km/h = ${(distanceKm/walkSpeed).toFixed(2)} hours = ${timeNeededMinutes} minutes\n\n${couldMakeIt ? 'YES' : 'NO'}, the claim is ${couldMakeIt ? 'POSSIBLE' : 'IMPOSSIBLE'} (needed ${timeNeededMinutes} min, had ${timeAvailable} min)`;

  const options = generateTimeOptions(timeNeededMinutes, couldMakeIt);

  return {
    id: `puzzle-${nanoid(8)}`,
    title: `${suspect.name}'s Alibi Check`,
    type: 'math',
    complexity,
    difficulty: complexityToNumber(complexity),
    estimatedMinutes: complexityToMinutes(complexity),
    narrativeContext: `Detective, we need to verify ${suspect.name}'s movements. They claim to have walked from ${route.from} to ${route.to}. Let's check if the timing adds up.`,
    question,
    answer,
    options,
    hint: 'Convert distance to km, then use Time = Distance ÷ Speed. Compare to the time available.',
    investigationPhase: 'investigation',
    relatedSuspectId: suspect.id,
    points: complexityToPoints(complexity),

    // Curriculum alignment
    syllabusTopicId: topic.id,
    syllabusTopicName: topic.name,
    learningObjective: topic.learningObjectives[0]?.description || 'Apply rate concepts',
    skills: ['speed-distance-time', 'unit-conversion', 'logical-reasoning'],

    // Story integration
    storyConnection: `Verifying ${suspect.name}'s claimed travel time from ${route.from} to ${route.to}`,
    revealsAbout: 'alibi',
    affectedSuspect: suspect.name,

    // Investigation impact
    revelation: {
      type: couldMakeIt ? 'alibi_verified' : 'alibi_broken',
      description: couldMakeIt
        ? `${suspect.name}'s alibi is physically possible - they COULD have made the journey in time.`
        : `${suspect.name}'s alibi is IMPOSSIBLE - there wasn't enough time to make that journey!`,
      storyText: couldMakeIt
        ? `Your calculations show ${suspect.name} could have walked from ${route.from} to ${route.to} in the time claimed. This part of their alibi checks out... but there may be other inconsistencies.`
        : `Aha! Your calculations prove ${suspect.name} is LYING! They couldn't possibly have walked ${route.distanceMeters}m in just ${timeAvailable} minutes. This alibi is broken - ${suspect.name} just became a prime suspect!`,
      importance: couldMakeIt ? 'moderate' : 'major',
    },
  };
}

/**
 * Generate a money-based puzzle (Percentage, Operations)
 * REVELATION: Reveals financial discrepancy or missing amount
 */
function generateMoneyPuzzle(
  topic: SyllabusTopic,
  context: StoryContext,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle {
  const { totalInvolved, missingAmount, percentageMissing } = context.moneyData;

  // Create a cash register / financial record puzzle
  const items = [
    { name: 'Food items', count: 45, price: 2.50 },
    { name: 'Drinks', count: 32, price: 1.80 },
    { name: 'Snacks', count: 28, price: 1.20 },
  ];

  const expectedTotal = items.reduce((sum, item) => sum + (item.count * item.price), 0);
  const actualCash = expectedTotal - missingAmount;

  const question = complexity === 'BASIC'
    ? `The ${context.locationName} sales records show:\n${items.map(i => `• ${i.name}: ${i.count} sold at $${i.price.toFixed(2)} each`).join('\n')}\n\nCalculate the expected total sales.`
    : `The ${context.locationName} cash register shows:\n\n**Sales Records:**\n${items.map(i => `• ${i.name}: ${i.count} sold at $${i.price.toFixed(2)} each`).join('\n')}\n\n**Actual cash in register:** $${actualCash.toFixed(2)}\n\nCalculate:\n1. Expected total from sales\n2. How much is missing?\n3. What percentage is missing?`;

  const answer = complexity === 'BASIC'
    ? `Total = ${items.map(i => `(${i.count} × $${i.price.toFixed(2)})`).join(' + ')}\n= $${expectedTotal.toFixed(2)}`
    : `Expected: ${items.map(i => `${i.count} × $${i.price.toFixed(2)} = $${(i.count * i.price).toFixed(2)}`).join('\n')}\nTotal expected: $${expectedTotal.toFixed(2)}\n\nMissing: $${expectedTotal.toFixed(2)} - $${actualCash.toFixed(2)} = $${missingAmount.toFixed(2)}\n\nPercentage: ($${missingAmount.toFixed(2)} ÷ $${expectedTotal.toFixed(2)}) × 100 = ${((missingAmount/expectedTotal)*100).toFixed(1)}%`;

  const options = generateMoneyOptions(
    complexity === 'BASIC' ? expectedTotal : missingAmount,
    complexity !== 'BASIC'
  );

  return {
    id: `puzzle-${nanoid(8)}`,
    title: 'The Cash Register Mystery',
    type: 'math',
    complexity,
    difficulty: complexityToNumber(complexity),
    estimatedMinutes: complexityToMinutes(complexity),
    narrativeContext: `Detective, the ${context.locationName} manager noticed the cash doesn't add up. We need to analyze the sales records to determine exactly how much is missing.`,
    question,
    answer,
    options,
    hint: 'Calculate each category separately, then add. Compare expected vs actual to find the discrepancy.',
    investigationPhase: 'initial',
    points: complexityToPoints(complexity),

    // Curriculum alignment
    syllabusTopicId: topic.id,
    syllabusTopicName: topic.name,
    learningObjective: topic.learningObjectives[0]?.description || 'Calculate with money',
    skills: ['multiplication', 'addition', 'percentage'],

    // Story integration
    storyConnection: `Analyzing ${context.locationName} financial records to determine theft amount`,
    revealsAbout: 'evidence',
    affectedEvidence: 'sales-records',

    // Investigation impact
    revelation: {
      type: 'evidence_analyzed',
      description: `Exactly $${missingAmount.toFixed(2)} is missing from the cash register - this confirms the theft amount.`,
      storyText: `Your calculations reveal the truth: $${missingAmount.toFixed(2)} has vanished from the cash register! This is ${((missingAmount/expectedTotal)*100).toFixed(1)}% of the day's takings. Now we know exactly what we're looking for - and whoever took it had access to the register during the crime window.`,
      importance: 'major',
    },
  };
}

/**
 * Generate a quantity-based puzzle (Multiplication, Fractions, Ratio)
 * REVELATION: Shows what was taken and possibly how it was divided
 */
function generateQuantityPuzzle(
  topic: SyllabusTopic,
  context: StoryContext,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle {
  const inventory = context.quantityData.inventory[0];
  const suspects = context.suspects.slice(0, 3);

  // Create an inventory/ratio puzzle
  const isRatio = topic.id.includes('ratio');

  let question: string;
  let answer: string;
  let revelationType: 'alibi_verified' | 'alibi_broken' | 'evidence_analyzed' | 'suspect_eliminated' | 'culprit_identified';
  let revelationText: string;

  if (isRatio && complexity !== 'BASIC') {
    // Ratio puzzle: How were the items divided?
    const ratio = [2, 3, 4];
    const totalParts = ratio.reduce((a, b) => a + b, 0);
    const itemsPerPart = inventory.missing / totalParts;

    question = `Security footage shows ${suspects.length} people leaving with ${inventory.name}. Based on bag sizes, they carried items in ratio ${ratio.join(':')}.\n\nTotal ${inventory.name} missing: ${inventory.missing}\n\nHow many did each person take?`;

    answer = `Total parts: ${ratio.join(' + ')} = ${totalParts}\nOne part = ${inventory.missing} ÷ ${totalParts} = ${itemsPerPart}\n\n${suspects.map((s, i) => `${s.name}: ${ratio[i]} parts = ${ratio[i] * itemsPerPart} ${inventory.name}`).join('\n')}`;

    revelationType = 'evidence_analyzed';
    revelationText = `The ratio reveals how the stolen ${inventory.name} were divided! ${suspects[2].name} took the largest share (${ratio[2] * itemsPerPart} items). This suggests they may be the ringleader...`;
  } else {
    // Simple quantity puzzle
    question = `The ${context.locationName} inventory shows:\n• ${inventory.name} before: ${inventory.countBefore}\n• ${inventory.name} after: ${inventory.countAfter}\n• Each ${inventory.name} is worth $${inventory.unitValue?.toFixed(2) || '10.00'}\n\nCalculate:\n1. How many ${inventory.name} are missing?\n2. What is the total value of missing items?`;

    const totalValue = inventory.missing * (inventory.unitValue || 10);
    answer = `Missing: ${inventory.countBefore} - ${inventory.countAfter} = ${inventory.missing} ${inventory.name}\n\nValue: ${inventory.missing} × $${(inventory.unitValue || 10).toFixed(2)} = $${totalValue.toFixed(2)}`;

    revelationType = 'evidence_analyzed';
    revelationText = `You've confirmed that ${inventory.missing} ${inventory.name} worth $${(inventory.missing * (inventory.unitValue || 10)).toFixed(2)} were taken. This matches the physical evidence we found!`;
  }

  const options = isRatio
    ? generateRatioOptions(suspects, [2, 3, 4], inventory.missing)
    : generateQuantityOptions(inventory.missing, inventory.missing * (inventory.unitValue || 10));

  return {
    id: `puzzle-${nanoid(8)}`,
    title: isRatio ? 'Dividing the Evidence' : 'The Inventory Count',
    type: 'math',
    complexity,
    difficulty: complexityToNumber(complexity),
    estimatedMinutes: complexityToMinutes(complexity),
    narrativeContext: isRatio
      ? `Detective, security footage shows multiple people involved. We need to figure out how they divided the stolen goods.`
      : `Detective, we need to verify exactly what was taken from the ${context.locationName} inventory.`,
    question,
    answer,
    options,
    hint: isRatio ? 'Find the value of 1 part first, then multiply.' : 'Subtraction gives missing count, multiply for total value.',
    investigationPhase: isRatio ? 'investigation' : 'initial',
    points: complexityToPoints(complexity),

    // Curriculum alignment
    syllabusTopicId: topic.id,
    syllabusTopicName: topic.name,
    learningObjective: topic.learningObjectives[0]?.description || 'Calculate quantities',
    skills: isRatio ? ['ratio', 'division', 'multiplication'] : ['subtraction', 'multiplication'],

    // Story integration
    storyConnection: isRatio
      ? 'Analyzing how stolen items were divided among suspects'
      : `Verifying ${context.locationName} inventory to confirm theft`,
    revealsAbout: 'evidence',

    // Investigation impact
    revelation: {
      type: revelationType,
      description: isRatio
        ? `The stolen items were divided unevenly - one person took the majority.`
        : `Confirmed: ${inventory.missing} ${inventory.name} are missing.`,
      storyText: revelationText,
      importance: 'moderate',
    },
  };
}

/**
 * Generate a data analysis puzzle (Tables, Graphs, Average)
 * REVELATION: Identifies patterns or contradictions in evidence
 */
function generateDataPuzzle(
  topic: SyllabusTopic,
  context: StoryContext,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle {
  // Create a CCTV/access log analysis puzzle
  const crimeWindow = context.timeData.crimeWindow;
  const timelines = context.timeData.timelines;

  // Build the log table
  const tableRows = timelines.map(t => ({
    name: t.suspectName,
    role: t.role,
    entry: t.arrivalDisplay,
    exit: t.departureDisplay,
    duration: t.departureMinutes - t.arrivalMinutes,
  }));

  // Find who was present during crime window
  const presentDuring = timelines.filter(t =>
    t.arrivalMinutes <= crimeWindow.endMinutes &&
    t.departureMinutes >= crimeWindow.startMinutes
  );

  const question = `**CCTV Access Log - ${context.locationName}**\n\n| Name | Role | Entry | Exit |\n|------|------|-------|------|\n${tableRows.map(r => `| ${r.name} | ${r.role} | ${r.entry} | ${r.exit} |`).join('\n')}\n\n**Crime window:** ${crimeWindow.startDisplay} - ${crimeWindow.endDisplay}\n\n1. Who was present during the ENTIRE crime window?\n2. Who left before the crime started?\n3. Who could NOT have committed the crime based on timing?`;

  const answer = `Present during crime window: ${presentDuring.map(t => t.suspectName).join(', ') || 'None'}\n\nLeft before crime: ${timelines.filter(t => t.departureMinutes < crimeWindow.startMinutes).map(t => t.suspectName).join(', ') || 'None'}\n\nCould NOT have done it: ${timelines.filter(t => t.departureMinutes < crimeWindow.startMinutes || t.arrivalMinutes > crimeWindow.endMinutes).map(t => t.suspectName).join(', ') || 'All suspects had opportunity'}`;

  const eliminatedSuspects = timelines.filter(t =>
    t.departureMinutes < crimeWindow.startMinutes ||
    t.arrivalMinutes > crimeWindow.endMinutes
  );

  return {
    id: `puzzle-${nanoid(8)}`,
    title: 'The Security Log Analysis',
    type: 'logic',
    complexity,
    difficulty: complexityToNumber(complexity),
    estimatedMinutes: complexityToMinutes(complexity),
    narrativeContext: `Detective, we've obtained the CCTV access logs for ${context.locationName}. This data shows exactly when each person entered and left. Cross-reference with the crime window to narrow down our suspects.`,
    question,
    answer,
    options: generateDataOptions(presentDuring.map(t => t.suspectName), timelines.map(t => t.suspectName)),
    hint: 'Compare each person\'s entry and exit times with the crime window. They must be present for the ENTIRE window to have opportunity.',
    investigationPhase: 'investigation',
    points: complexityToPoints(complexity),

    // Curriculum alignment
    syllabusTopicId: topic.id,
    syllabusTopicName: topic.name,
    learningObjective: 'Read and interpret tables to solve problems',
    skills: ['table-reading', 'time-comparison', 'logical-reasoning'],

    // Story integration
    storyConnection: 'Analyzing CCTV logs to determine who had opportunity',
    revealsAbout: 'timeline',

    // Investigation impact
    revelation: {
      type: eliminatedSuspects.length > 0 ? 'suspect_eliminated' : 'evidence_analyzed',
      description: eliminatedSuspects.length > 0
        ? `${eliminatedSuspects.map(s => s.suspectName).join(' and ')} can be eliminated - they weren't present during the crime!`
        : `All suspects were present during the crime window - no one can be eliminated by timing alone.`,
      storyText: eliminatedSuspects.length > 0
        ? `Excellent work, Detective! The data proves that ${eliminatedSuspects.map(s => s.suspectName).join(' and ')} ${eliminatedSuspects.length > 1 ? 'were' : 'was'} NOT at ${context.locationName} during the crime. We can eliminate ${eliminatedSuspects.length > 1 ? 'them' : 'this suspect'} from our investigation. The remaining suspects are: ${presentDuring.map(t => t.suspectName).join(', ')}.`
        : `Interesting... all suspects were present during the crime window. We'll need other evidence to narrow down the culprit.`,
      importance: eliminatedSuspects.length > 0 ? 'major' : 'moderate',
    },
  };
}

/**
 * Generate a conclusion puzzle that identifies the culprit
 * REVELATION: Final deduction pointing to the guilty party
 */
function generateConclusionPuzzle(
  topic: SyllabusTopic,
  context: StoryContext,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle {
  const culprit = context.culprit;
  const allSuspects = context.suspects;

  // Create a multi-step deduction puzzle
  const innocentSuspects = allSuspects.filter(s => !s.isGuilty);
  const guiltyDetails = allSuspects.find(s => s.isGuilty)!;

  // Build elimination clues
  const clues = [
    `Clue 1: The culprit was present during the entire crime window (${context.timeData.crimeWindow.startDisplay} - ${context.timeData.crimeWindow.endDisplay})`,
    `Clue 2: ${innocentSuspects[0]?.name || 'One suspect'} has a verified alibi from a security camera`,
    `Clue 3: The culprit's motive was "${culprit.motive}"`,
    `Clue 4: ${culprit.keyMistake}`,
  ];

  const question = `**CASE SUMMARY - ${context.caseTitle}**\n\n**Suspects:**\n${allSuspects.map(s => `• ${s.name} (${s.role}) - "${s.alibiClaim}"`).join('\n')}\n\n**Evidence:**\n${clues.join('\n')}\n\nBased on all the evidence, who committed the crime? Explain your reasoning.`;

  const answer = `The culprit is ${culprit.name}.\n\nReasoning:\n1. They were present during the crime window\n2. Their motive: ${culprit.motive}\n3. Their mistake: ${culprit.keyMistake}\n4. The evidence points directly to them:\n   - ${context.suspects.find(s => s.isGuilty)?.contradictionDetails || 'Their alibi has contradictions'}`;

  return {
    id: `puzzle-${nanoid(8)}`,
    title: 'The Final Deduction',
    type: 'deduction',
    complexity,
    difficulty: complexityToNumber(complexity),
    estimatedMinutes: complexityToMinutes(complexity) + 3,
    narrativeContext: `Detective, you've gathered all the evidence. It's time to make your final deduction. Review everything carefully - one of these suspects is guilty. Use logic and the evidence to identify the culprit.`,
    question,
    answer,
    options: allSuspects.map(s => s.name),
    hint: 'Eliminate suspects one by one based on the evidence. Who had means, motive, AND opportunity?',
    investigationPhase: 'conclusion',
    relatedSuspectId: culprit.id,
    points: complexityToPoints(complexity) * 2,  // Double points for conclusion

    // Curriculum alignment
    syllabusTopicId: topic.id,
    syllabusTopicName: topic.name,
    learningObjective: 'Apply logical reasoning to solve problems',
    skills: ['deduction', 'logical-reasoning', 'evidence-synthesis'],

    // Story integration
    storyConnection: 'Final case resolution - identifying the culprit',
    revealsAbout: 'culprit',
    affectedSuspect: culprit.name,

    // Investigation impact
    revelation: {
      type: 'culprit_identified',
      description: `${culprit.name} is the culprit!`,
      storyText: `"It was you, ${culprit.name}!" you declare.\n\n${culprit.name}'s face pales. "${culprit.keyMistake}" you continue. "You thought you were clever, but the evidence doesn't lie."\n\n"${culprit.motive}..." ${culprit.name} mutters. "I didn't think anyone would figure it out."\n\n**CASE SOLVED!** The mystery of ${context.caseTitle} has been solved through brilliant detective work and mathematical reasoning!`,
      importance: 'critical',
    },
  };
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

/**
 * Generate a complete set of curriculum-aligned, story-integrated puzzles
 */
export function generateCurriculumStoryPuzzles(
  gradeLevel: GradeLevel,
  subject: Subject,
  storyContext: StoryContext,
  puzzleCount: number,
  complexity: PuzzleComplexity
): StoryIntegratedPuzzle[] {
  const puzzles: StoryIntegratedPuzzle[] = [];
  const tracker = getSyllabusTracker();

  // Find best topic-story matches
  const matches = findTopicStoryMatches(gradeLevel, subject, storyContext, puzzleCount + 2);

  if (matches.length === 0) {
    console.warn('[CurriculumStoryPuzzles] No topic-story matches found, using fallback');
    // Fallback to generic logic puzzles
    const fallbackTopic = fullSyllabus.find(t => t.id.includes('tables-graphs')) || fullSyllabus[0];
    matches.push({
      topic: fallbackTopic,
      storyElement: 'data',
      relevanceScore: 50,
      puzzleOpportunity: 'General analysis puzzle',
    });
  }

  // Distribution: initial → investigation → conclusion
  const phaseCounts = {
    initial: Math.ceil(puzzleCount * 0.2),      // 20% discovery
    investigation: Math.ceil(puzzleCount * 0.6), // 60% analysis
    conclusion: Math.ceil(puzzleCount * 0.2),    // 20% resolution
  };

  let matchIndex = 0;

  // Generate INITIAL phase puzzles (discovery)
  for (let i = 0; i < phaseCounts.initial && matchIndex < matches.length; i++) {
    const match = matches[matchIndex++];
    const puzzle = generatePuzzleForElement(match.topic, match.storyElement, storyContext, complexity, 'initial');
    if (puzzle) {
      puzzles.push(puzzle);
      tracker.recordTopicUsage(match.topic.id, storyContext.caseTitle);
    }
  }

  // Generate INVESTIGATION phase puzzles (analysis)
  for (let i = 0; i < phaseCounts.investigation && matchIndex < matches.length; i++) {
    const match = matches[matchIndex++];
    const puzzle = generatePuzzleForElement(match.topic, match.storyElement, storyContext, complexity, 'investigation');
    if (puzzle) {
      puzzles.push(puzzle);
      tracker.recordTopicUsage(match.topic.id, storyContext.caseTitle);
    }
  }

  // Generate CONCLUSION phase puzzle (resolution)
  // Always include a final deduction puzzle
  const conclusionTopic = matches[0]?.topic || fullSyllabus.find(t => t.strand === 'algebra') || fullSyllabus[0];
  const conclusionPuzzle = generateConclusionPuzzle(conclusionTopic, storyContext, complexity);
  conclusionPuzzle.investigationPhase = 'conclusion';
  puzzles.push(conclusionPuzzle);

  console.log(`[CurriculumStoryPuzzles] Generated ${puzzles.length} puzzles covering topics: ${puzzles.map(p => p.syllabusTopicName).join(', ')}`);

  return puzzles;
}

/**
 * Generate a puzzle for a specific story element
 */
function generatePuzzleForElement(
  topic: SyllabusTopic,
  element: 'time' | 'money' | 'distance' | 'quantity' | 'data' | 'logic',
  context: StoryContext,
  complexity: PuzzleComplexity,
  phase: 'initial' | 'investigation' | 'conclusion'
): StoryIntegratedPuzzle | null {
  try {
    let puzzle: StoryIntegratedPuzzle;

    switch (element) {
      case 'time':
      case 'distance':
        puzzle = generateTimePuzzle(topic, context, complexity);
        break;
      case 'money':
        puzzle = generateMoneyPuzzle(topic, context, complexity);
        break;
      case 'quantity':
        puzzle = generateQuantityPuzzle(topic, context, complexity);
        break;
      case 'data':
      case 'logic':
        puzzle = generateDataPuzzle(topic, context, complexity);
        break;
      default:
        puzzle = generateDataPuzzle(topic, context, complexity);
    }

    puzzle.investigationPhase = phase;
    return puzzle;
  } catch (error) {
    console.error(`[CurriculumStoryPuzzles] Error generating puzzle for ${topic.name}:`, error);
    return null;
  }
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

function complexityToNumber(complexity: PuzzleComplexity): number {
  return { BASIC: 1, STANDARD: 2, CHALLENGING: 3, EXPERT: 4 }[complexity] || 2;
}

function complexityToMinutes(complexity: PuzzleComplexity): number {
  return { BASIC: 3, STANDARD: 5, CHALLENGING: 8, EXPERT: 12 }[complexity] || 5;
}

function complexityToPoints(complexity: PuzzleComplexity): number {
  return { BASIC: 15, STANDARD: 25, CHALLENGING: 40, EXPERT: 60 }[complexity] || 25;
}

// MCQ option generators
function generateTimeOptions(correctMinutes: number, couldMakeIt: boolean): string[] {
  const options = [
    `${correctMinutes} minutes`,
    `${correctMinutes + 5} minutes`,
    `${correctMinutes - 3} minutes`,
    `${Math.round(correctMinutes * 1.5)} minutes`,
  ];
  return shuffleArray(options);
}

function generateMoneyOptions(correctAmount: number, includePercentage: boolean): string[] {
  const options = [
    `$${correctAmount.toFixed(2)}`,
    `$${(correctAmount * 1.15).toFixed(2)}`,
    `$${(correctAmount * 0.85).toFixed(2)}`,
    `$${(correctAmount + 10).toFixed(2)}`,
  ];
  return shuffleArray(options);
}

function generateQuantityOptions(missingCount: number, totalValue: number): string[] {
  return shuffleArray([
    `${missingCount} items, $${totalValue.toFixed(2)}`,
    `${missingCount + 3} items, $${(totalValue * 1.2).toFixed(2)}`,
    `${missingCount - 2} items, $${(totalValue * 0.8).toFixed(2)}`,
    `${missingCount + 5} items, $${(totalValue * 1.3).toFixed(2)}`,
  ]);
}

function generateRatioOptions(
  suspects: StoryContext['suspects'],
  ratio: number[],
  totalMissing: number
): string[] {
  const totalParts = ratio.reduce((a, b) => a + b, 0);
  const perPart = totalMissing / totalParts;

  const correct = suspects.map((s, i) => `${s.name}: ${ratio[i] * perPart}`).join(', ');
  const wrong1 = suspects.map((s, i) => `${s.name}: ${(ratio[i] + 1) * perPart}`).join(', ');
  const wrong2 = suspects.map((s) => `${s.name}: ${totalMissing / 3}`).join(', ');
  const wrong3 = suspects.map((s, i) => `${s.name}: ${ratio[2-i] * perPart}`).join(', ');

  return shuffleArray([correct, wrong1, wrong2, wrong3]);
}

function generateDataOptions(presentSuspects: string[], allSuspects: string[]): string[] {
  const correct = presentSuspects.length > 0 ? presentSuspects.join(', ') : 'None were present';
  return shuffleArray([
    correct,
    allSuspects.slice(0, 2).join(', '),
    allSuspects.slice(-2).join(', '),
    'All suspects were present',
  ]);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
