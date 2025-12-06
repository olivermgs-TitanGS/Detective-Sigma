/**
 * CASE GENERATOR ORCHESTRATOR
 *
 * This is the main entry point for the new architecture.
 * It registers all phases and converts the generation context to the
 * final GeneratedCase format used by the rest of the application.
 *
 * USAGE:
 * import { generateCaseFromArchitecture } from './architecture/orchestrator';
 * const generatedCase = await generateCaseFromArchitecture(params);
 */

import { nanoid } from 'nanoid';
import {
  GenerationContext,
  GenerationParams,
  pipeline,
  registry,
  createContext,
} from './index';

import { registerCrimeBlueprintPhase } from './phases/crime-blueprint-phase';
import { registerSuspectPoolPhase } from './phases/suspect-pool-phase';
import { registerGuiltDeterminationPhase } from './phases/guilt-determination-phase';
import {
  registerEvidenceGenerationPhase,
  registerSceneGenerationPhase,
  registerPuzzleGenerationPhase,
  registerNarrativeLayerPhase,
} from './phases/evidence-scene-puzzle-phases';

// Import types from the main types file for compatibility
import type {
  GeneratedCase,
  Suspect,
  Clue,
  Puzzle,
  Scene,
  TimelineEvent,
  DialogueNode,
  CharacterRelationship,
  PuzzleRevelation,
} from '../types';

// ============================================
// INITIALIZATION
// ============================================

let initialized = false;

/**
 * Initialize the generation pipeline by registering all phases.
 * This is called automatically on first use.
 */
export function initializePipeline(): void {
  if (initialized) return;

  // Register all phases in order
  registerCrimeBlueprintPhase();   // Order 10
  registerSuspectPoolPhase();       // Order 20
  registerGuiltDeterminationPhase();// Order 30
  registerEvidenceGenerationPhase();// Order 40
  registerSceneGenerationPhase();   // Order 50
  registerPuzzleGenerationPhase();  // Order 60
  registerNarrativeLayerPhase();    // Order 70

  initialized = true;
  console.log('[CaseGenerator] Architecture pipeline initialized with phases:',
    registry.getPhases().map(p => p.name).join(', ')
  );
}

// ============================================
// CONTEXT TO GENERATED CASE CONVERTER
// ============================================

/**
 * Converts the generation context into the GeneratedCase format
 * used by the rest of the application.
 */
function contextToGeneratedCase(context: GenerationContext): GeneratedCase {
  const blueprint = context.crimeBlueprint!;
  const suspects = context.suspectPool!;
  const culprit = context.culpritDetermination!;
  const evidence = context.evidenceSet!;
  const scenes = context.sceneSet!;
  const puzzles = context.puzzleSet!;
  const narrative = context.narrativeLayer!;
  const { params } = context;

  // Convert suspects to the expected format
  const convertedSuspects: Suspect[] = suspects.map(s => {
    const isGuilty = s.id === culprit.culpritId;

    // Convert dialogue tree
    const dialogueTree: DialogueNode[] = s.dialogueTree.map(d => ({
      id: d.id,
      question: d.question,
      answer: d.answer,
      emotion: d.emotion as DialogueNode['emotion'],
      revealsInfo: d.revealsInfo,
      contradictsId: d.contradictsId,
      unlocksNodeId: d.unlocksNodeId,
      requiresEvidence: d.requiresEvidence,
    }));

    // Convert relationships
    const relationships: CharacterRelationship[] = s.relationships.map(r => ({
      targetId: r.targetId,
      targetName: r.targetName,
      type: r.type as CharacterRelationship['type'],
      description: r.description,
    }));

    return {
      id: s.id,
      name: s.name,
      role: s.role,
      alibi: s.alibi.claim,
      personality: s.personality,
      isGuilty,
      motive: isGuilty ? s.motive.description : undefined,
      ethnicity: s.appearance.ethnicity as Suspect['ethnicity'],
      gender: s.appearance.gender as Suspect['gender'],
      ageCategory: s.appearance.ageCategory as Suspect['ageCategory'],
      specificAge: s.appearance.specificAge,
      displayAge: s.appearance.ageCategory,
      dialogueTree,
      relationships,
    };
  });

  // Convert evidence to clues
  const convertedClues: Clue[] = evidence.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    type: e.type,
    relevance: e.relevance,
    linkedTo: e.linkedToSuspects,
    discoveryLocation: e.discoveryLocation,
    examinationDetails: e.examinationDetails,
    visualCue: e.visualCue,
    analysisResult: e.analysisResult,
    discoveryMethod: e.discoveryMethod,
    positionX: 50,  // Default position
    positionY: 50,
    requiredPuzzleId: e.relatedPuzzleId,
    puzzleHint: undefined,
  }));

  // Convert puzzles
  const convertedPuzzles: Puzzle[] = puzzles.map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    question: p.question,
    answer: p.answer,
    options: p.options,
    hint: p.hint,
    points: p.points,
    difficulty: p.difficulty,
    complexity: p.complexity,
    estimatedMinutes: p.estimatedMinutes,
    requiresMultipleSteps: p.complexity !== 'BASIC',
    dataTablesProvided: [],
    topicId: p.topicId,
    learningObjectivesCovered: p.learningObjectives,
    narrativeContext: p.narrativeContext,
    investigationPhase: p.investigationPhase,
    revelation: p.revelation as PuzzleRevelation,
    relatedCharacterName: suspects.find(s => s.id === p.relatedSuspectId)?.name,
  }));

  // Convert scenes
  const convertedScenes: Scene[] = scenes.map(s => ({
    id: s.id,
    name: s.name,
    description: narrative.sceneDescriptions[s.id] || s.description,
    interactiveElements: s.interactiveAreas.map(a => a.name),
    cluesAvailable: s.evidenceIds,
    locationType: s.locationType,
    sceneType: s.sceneType as Scene['sceneType'],
    ambiance: s.atmosphere.timeOfDay as Scene['ambiance'],
    mood: s.atmosphere.mood as Scene['mood'],
    interactiveAreas: s.interactiveAreas.map(a => ({
      name: a.name,
      position: a.position,
      size: a.size,
    })),
  }));

  // Generate timeline events
  const timelineEvents: TimelineEvent[] = blueprint.choreography.map((step, index) => ({
    id: step.id,
    time: step.time.formatted,
    timeMinutes: step.time.minutes,
    description: step.action,
    location: step.location,
    involvedCharacters: step.phase === 'execution' ? [culprit.culpritName] : [],
    isKeyEvent: step.phase === 'execution',
    discoverable: step.phase !== 'execution',
  }));

  // Build the final generated case
  const generatedCase: GeneratedCase = {
    caseId: `case-${nanoid(10)}`,
    title: blueprint.title,
    briefing: narrative.briefing,
    metadata: {
      difficulty: params.difficulty,
      gradeLevel: params.gradeLevel,
      subjectFocus: params.subject,
      estimatedMinutes: calculateEstimatedMinutes(puzzles),
      puzzleComplexity: params.puzzleComplexity,
      syllabusTopicsCovered: [],
      learningObjectives: [],
    },
    story: {
      setting: blueprint.primarySceneType,
      crime: `${blueprint.crimeType} of ${blueprint.target.name}`,
      resolution: narrative.resolution,
      backstory: blueprint.target.significance,
      incident: blueprint.narrative.hook,
      investigationHints: narrative.revelationMoments,
      twist: blueprint.narrative.twist,
      timeline: timelineEvents,
      crimeWindow: {
        start: blueprint.timeline.crimeWindow.start.formatted,
        end: blueprint.timeline.crimeWindow.end.formatted,
      },
      culpritProfile: {
        motive: {
          type: suspects.find(s => s.id === culprit.culpritId)?.motive.type || 'unknown',
          description: suspects.find(s => s.id === culprit.culpritId)?.motive.description || '',
          backstory: suspects.find(s => s.id === culprit.culpritId)?.motive.backstory || '',
        },
        method: blueprint.choreography.find(s => s.phase === 'execution')?.action || 'Unknown method',
        mistakes: culprit.proofPoints.map(p => p.description),
      },
    },
    suspects: convertedSuspects,
    clues: convertedClues,
    puzzles: convertedPuzzles,
    scenes: convertedScenes,
    evidenceChain: {
      mainPath: evidence.filter(e => e.relevance === 'critical').map(e => e.id),
      criticalCount: evidence.filter(e => e.relevance === 'critical').length,
    },
    puzzlePhases: {
      initial: puzzles.filter(p => p.investigationPhase === 'initial').map(p => p.id),
      investigation: puzzles.filter(p => p.investigationPhase === 'investigation').map(p => p.id),
      conclusion: puzzles.filter(p => p.investigationPhase === 'conclusion').map(p => p.id),
    },
  };

  return generatedCase;
}

function calculateEstimatedMinutes(puzzles: GenerationContext['puzzleSet']): number {
  if (!puzzles) return 30;
  return puzzles.reduce((total, p) => total + p.estimatedMinutes, 0) + 10; // +10 for investigation time
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

/**
 * Generate a complete case using the new architecture.
 *
 * @param params - Generation parameters
 * @returns A GeneratedCase compatible with the existing system
 */
export async function generateCaseFromArchitecture(
  params: GenerationParams
): Promise<GeneratedCase> {
  // Ensure pipeline is initialized
  initializePipeline();

  console.log('[CaseGenerator] Starting generation with params:', {
    difficulty: params.difficulty,
    subject: params.subject,
    gradeLevel: params.gradeLevel,
    puzzleComplexity: params.puzzleComplexity,
  });

  // Create initial context
  const context = createContext(params);

  // Run the pipeline
  const completedContext = await pipeline.generate(params);

  // Validate that all phases completed
  if (!completedContext.crimeBlueprint) {
    throw new Error('Crime blueprint generation failed');
  }
  if (!completedContext.suspectPool) {
    throw new Error('Suspect pool generation failed');
  }
  if (!completedContext.culpritDetermination) {
    throw new Error('Culprit determination failed');
  }
  if (!completedContext.evidenceSet) {
    throw new Error('Evidence generation failed');
  }
  if (!completedContext.sceneSet) {
    throw new Error('Scene generation failed');
  }
  if (!completedContext.puzzleSet) {
    throw new Error('Puzzle generation failed');
  }
  if (!completedContext.narrativeLayer) {
    throw new Error('Narrative layer generation failed');
  }

  // Convert to GeneratedCase format
  const generatedCase = contextToGeneratedCase(completedContext);

  console.log('[CaseGenerator] Generation complete:', {
    caseId: generatedCase.caseId,
    title: generatedCase.title,
    suspectCount: generatedCase.suspects.length,
    clueCount: generatedCase.clues.length,
    puzzleCount: generatedCase.puzzles.length,
    sceneCount: generatedCase.scenes.length,
    culprit: generatedCase.suspects.find(s => s.isGuilty)?.name,
  });

  return generatedCase;
}

// ============================================
// UTILITY EXPORTS
// ============================================

// Note: initializePipeline and contextToGeneratedCase are already exported via named export syntax
export type { GenerationContext, GenerationParams };
