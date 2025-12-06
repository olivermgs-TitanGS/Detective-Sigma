/**
 * PHASES 4-7: Evidence, Scene, Puzzle, and Narrative Generation
 *
 * These phases build on top of the crime blueprint, suspect pool,
 * and guilt determination to create the playable case content.
 */

import { nanoid } from 'nanoid';
import {
  IGenerationPhase,
  GenerationContext,
  IEvidenceItem,
  IScene,
  IPuzzle,
  INarrativeLayer,
  IAccessPoint,
  IInteractiveArea,
  ICrimeBlueprint,
  ISuspectProfile,
  ICulpritDetermination,
  ITracePoint,
  registry,
} from '../index';

// Curriculum-story integrated puzzle system imports
import { extractStoryContext } from '../../story-context-extractor';
import { generateCurriculumStoryPuzzles, StoryIntegratedPuzzle } from '../../curriculum-story-puzzles';
import { GradeLevel, Subject } from '../../syllabus';
import { PuzzleComplexity } from '../../types';

// ============================================
// PHASE 4: EVIDENCE GENERATION
// ============================================

export class EvidenceGenerationPhase implements IGenerationPhase<void, IEvidenceItem[]> {
  readonly name = 'evidence-generation';
  readonly order = 40;

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint &&
           !!context.suspectPool &&
           !!context.culpritDetermination &&
           !context.evidenceSet;
  }

  async execute(context: GenerationContext): Promise<IEvidenceItem[]> {
    const blueprint = context.crimeBlueprint!;
    const suspects = context.suspectPool!;
    const culpritDetermination = context.culpritDetermination!;
    const { params } = context;

    const evidence: IEvidenceItem[] = [];

    // Generate evidence from traces
    for (const trace of blueprint.traces) {
      const evidenceItem = this.generateEvidenceFromTrace(
        trace,
        blueprint,
        suspects,
        culpritDetermination
      );
      evidence.push(evidenceItem);
    }

    // Generate additional evidence based on difficulty
    const additionalCount = this.getAdditionalEvidenceCount(params.difficulty);
    for (let i = 0; i < additionalCount; i++) {
      const extraEvidence = this.generateSupportingEvidence(
        blueprint,
        suspects,
        culpritDetermination,
        evidence.length
      );
      evidence.push(extraEvidence);
    }

    // Assign relevance based on culprit connection
    this.assignRelevance(evidence, culpritDetermination);

    context.evidenceSet = evidence;
    return evidence;
  }

  private getAdditionalEvidenceCount(difficulty: string): number {
    switch (difficulty) {
      case 'ROOKIE': return 2;
      case 'INSPECTOR': return 3;
      case 'DETECTIVE': return 4;
      case 'CHIEF': return 5;
      default: return 3;
    }
  }

  private generateEvidenceFromTrace(
    trace: ITracePoint,
    blueprint: ICrimeBlueprint,
    suspects: ISuspectProfile[],
    culpritDetermination: ICulpritDetermination
  ): IEvidenceItem {
    const culprit = suspects.find(s => s.id === culpritDetermination.culpritId);

    // Map trace type to evidence type
    const typeMap: Record<string, IEvidenceItem['type']> = {
      physical: 'physical',
      digital: 'digital',
      testimonial: 'testimony',
      material: 'document',
    };

    // Generate discovery details
    const discoveryMethods: Record<string, string[]> = {
      physical: ['Found during scene examination', 'Discovered by forensic analysis', 'Noticed during search'],
      digital: ['Retrieved from system logs', 'Extracted from records', 'Found in digital archives'],
      testimonial: ['Revealed during interview', 'Mentioned by a witness', 'Uncovered through questioning'],
      material: ['Found among documents', 'Discovered in records', 'Located during search'],
    };

    // Check if this trace contradicts the culprit's alibi
    let contradicts: IEvidenceItem['contradicts'];
    if (culprit && trace.type !== 'testimonial') {
      // Check if culprit claimed to be elsewhere
      const claimedLocation = culprit.alibi.location.toLowerCase();
      if (!claimedLocation.includes(trace.location.toLowerCase())) {
        contradicts = {
          suspectId: culprit.id,
          claim: culprit.alibi.claim,
          truth: `Evidence places them at ${trace.location} instead`,
        };
      }
    }

    return {
      id: `evidence-${nanoid(8)}`,
      title: this.generateEvidenceTitle(trace),
      description: trace.description,
      type: typeMap[trace.type] || 'physical',
      relevance: 'supporting', // Will be updated later
      sceneId: 'primary-scene',
      discoveryLocation: trace.location,
      discoveryMethod: this.selectRandom(discoveryMethods[trace.type] || discoveryMethods.physical),
      discoveryDifficulty: trace.discoveryDifficulty,
      visualCue: this.generateVisualCue(trace),
      examinationDetails: this.generateExaminationDetails(trace),
      analysisResult: trace.narrativeReveal,
      linkedToSuspects: culprit ? [culprit.id] : [],
      linkedToTraces: [trace.id],
      contradicts,
    };
  }

  private generateEvidenceTitle(trace: ITracePoint): string {
    const categoryTitles: Record<string, string[]> = {
      fingerprint: ['Fingerprint Evidence', 'Latent Fingerprints', 'Print Analysis'],
      footprint: ['Footprint Pattern', 'Shoe Print Evidence', 'Floor Impression'],
      video: ['CCTV Footage', 'Security Recording', 'Video Evidence'],
      access_log: ['Access Log Entry', 'System Record', 'Entry Log'],
      physical_evidence: ['Physical Evidence', 'Material Clue', 'Trace Evidence'],
    };

    const titles = categoryTitles[trace.category] || categoryTitles.physical_evidence;
    return this.selectRandom(titles);
  }

  private generateVisualCue(trace: ITracePoint): string {
    const cues: Record<string, string[]> = {
      physical: [
        'Something catches your eye near the surface',
        'A faint mark that most would overlook',
        'Evidence that tells its own story',
      ],
      digital: [
        'The screen displays interesting data',
        'Numbers that don\'t quite add up',
        'A record that raises questions',
      ],
      testimonial: [
        'The witness seems uncertain about something',
        'Their story has an interesting detail',
        'Something in their account stands out',
      ],
      material: [
        'An item that seems out of place',
        'Something that shouldn\'t be here',
        'A clue hiding in plain sight',
      ],
    };

    return this.selectRandom(cues[trace.type] || cues.physical);
  }

  private generateExaminationDetails(trace: ITracePoint): string[] {
    return [
      `Location: ${trace.location}`,
      `Type: ${trace.category}`,
      `Discovery difficulty: ${trace.discoveryDifficulty}`,
      trace.narrativeReveal,
    ];
  }

  private generateSupportingEvidence(
    blueprint: ICrimeBlueprint,
    suspects: ISuspectProfile[],
    culpritDetermination: ICulpritDetermination,
    index: number
  ): IEvidenceItem {
    const culprit = suspects.find(s => s.id === culpritDetermination.culpritId);

    // Generate different types of supporting evidence
    const evidenceTypes = [
      {
        title: 'Timeline Analysis',
        description: `A detailed analysis of movements during ${blueprint.timeline.crimeWindow.start.formatted} - ${blueprint.timeline.crimeWindow.end.formatted}`,
        type: 'document' as const,
        visualCue: 'A chart showing everyone\'s whereabouts',
      },
      {
        title: 'Witness Statement',
        description: 'An account from someone who was present at the location',
        type: 'testimony' as const,
        visualCue: 'The witness recalls what they saw',
      },
      {
        title: 'Access Record',
        description: 'A log showing who entered and exited the area',
        type: 'digital' as const,
        visualCue: 'The entry log shows interesting patterns',
      },
      {
        title: 'Personal Item',
        description: 'An item that may belong to one of the suspects',
        type: 'physical' as const,
        visualCue: 'Something personal left behind',
      },
    ];

    const template = evidenceTypes[index % evidenceTypes.length];

    return {
      id: `evidence-${nanoid(8)}`,
      title: template.title,
      description: template.description,
      type: template.type,
      relevance: 'supporting',
      sceneId: 'primary-scene',
      discoveryLocation: blueprint.traces[0]?.location || 'Primary Scene',
      discoveryMethod: 'Discovered during investigation',
      discoveryDifficulty: 'careful',
      visualCue: template.visualCue,
      examinationDetails: ['Requires careful analysis', 'May reveal important information'],
      analysisResult: 'This evidence contributes to understanding the full picture',
      linkedToSuspects: culprit ? [culprit.id] : [],
      linkedToTraces: [],
    };
  }

  private assignRelevance(
    evidence: IEvidenceItem[],
    culpritDetermination: ICulpritDetermination
  ): void {
    // Critical evidence: directly contradicts culprit or links to proof points
    // Supporting: helps but doesn't prove
    // Red herring: misleading

    let criticalCount = 0;
    const maxCritical = 3;

    for (const item of evidence) {
      if (item.contradicts && item.contradicts.suspectId === culpritDetermination.culpritId) {
        if (criticalCount < maxCritical) {
          item.relevance = 'critical';
          criticalCount++;
        }
      } else if (item.linkedToSuspects.includes(culpritDetermination.culpritId)) {
        if (criticalCount < maxCritical && Math.random() > 0.5) {
          item.relevance = 'critical';
          criticalCount++;
        }
      }
    }

    // Mark some evidence as red herrings (for higher difficulties)
    const redHerringCount = Math.min(2, evidence.filter(e => e.relevance === 'supporting').length);
    let herringsMade = 0;

    for (const item of evidence) {
      if (item.relevance === 'supporting' && herringsMade < redHerringCount) {
        if (!item.linkedToSuspects.includes(culpritDetermination.culpritId) && Math.random() > 0.7) {
          item.relevance = 'red-herring';
          herringsMade++;
        }
      }
    }
  }

  private selectRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// ============================================
// PHASE 5: SCENE GENERATION
// ============================================

export class SceneGenerationPhase implements IGenerationPhase<void, IScene[]> {
  readonly name = 'scene-generation';
  readonly order = 50;

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint &&
           !!context.evidenceSet &&
           !context.sceneSet;
  }

  async execute(context: GenerationContext): Promise<IScene[]> {
    const blueprint = context.crimeBlueprint!;
    const evidence = context.evidenceSet!;
    const suspects = context.suspectPool || [];

    const scenes: IScene[] = [];

    // Generate primary scene (crime scene)
    const primaryScene = this.generatePrimaryScene(blueprint, evidence);
    scenes.push(primaryScene);

    // Generate secondary scenes based on evidence locations
    const evidenceLocations = new Set(evidence.map(e => e.discoveryLocation));
    for (const location of evidenceLocations) {
      if (location !== primaryScene.name) {
        const secondaryScene = this.generateSecondaryScene(
          location,
          blueprint,
          evidence.filter(e => e.discoveryLocation === location)
        );
        scenes.push(secondaryScene);
      }
    }

    // Generate suspect-related scenes if needed
    if (suspects.length > 0 && scenes.length < 4) {
      const suspectScene = this.generateSuspectScene(suspects, blueprint);
      scenes.push(suspectScene);
    }

    // Assign evidence to scenes
    this.assignEvidenceToScenes(scenes, evidence);

    context.sceneSet = scenes;
    return scenes;
  }

  private generatePrimaryScene(blueprint: ICrimeBlueprint, evidence: IEvidenceItem[]): IScene {
    const atmospheres = {
      morning: { visual: 'Soft morning light filters through', sensory: 'The day is just beginning', mood: 'calm' },
      afternoon: { visual: 'Bright daylight illuminates everything', sensory: 'Activity fills the air', mood: 'tense' },
      evening: { visual: 'The fading light casts long shadows', sensory: 'The day is winding down', mood: 'mysterious' },
      night: { visual: 'Artificial lights create stark contrasts', sensory: 'Quiet has settled', mood: 'mysterious' },
    };

    const timeOfDay = (blueprint.sceneContext.timeOfDay as keyof typeof atmospheres) || 'afternoon';

    return {
      id: 'primary-scene',
      name: `Primary Crime Scene`,
      description: `The main location where the ${blueprint.crimeType} occurred. ${blueprint.narrative.hook}`,
      sceneType: 'primary',
      locationType: blueprint.primarySceneType,
      atmosphere: {
        ...atmospheres[timeOfDay],
        timeOfDay,
      },
      layout: 'The central area where the incident took place, with multiple points of interest',
      accessPoints: this.generateAccessPoints(blueprint.primarySceneType),
      interactiveAreas: this.generateInteractiveAreas(evidence, blueprint),
      evidenceIds: evidence.filter(e => e.relevance === 'critical').map(e => e.id),
      suspectsPresentIds: [],
    };
  }

  private generateSecondaryScene(
    location: string,
    blueprint: ICrimeBlueprint,
    locationEvidence: IEvidenceItem[]
  ): IScene {
    return {
      id: `scene-${nanoid(6)}`,
      name: location,
      description: `A secondary location connected to the investigation. Evidence found here may be crucial.`,
      sceneType: 'secondary',
      locationType: 'investigation',
      atmosphere: {
        visual: 'A location connected to the case',
        sensory: 'The atmosphere hints at secrets',
        mood: 'tense',
        timeOfDay: 'afternoon',
      },
      layout: 'An area worth investigating thoroughly',
      accessPoints: [],
      interactiveAreas: locationEvidence.map((e, i) => ({
        name: `Investigation Point ${i + 1}`,
        description: e.visualCue,
        position: { x: 20 + (i * 25), y: 30 + (i * 10) },
        size: { width: 15, height: 15 },
        containsEvidenceId: e.id,
      })),
      evidenceIds: locationEvidence.map(e => e.id),
      suspectsPresentIds: [],
    };
  }

  private generateSuspectScene(suspects: ISuspectProfile[], blueprint: ICrimeBlueprint): IScene {
    return {
      id: 'suspect-area',
      name: 'Suspect Interview Area',
      description: 'A location where suspects can be questioned about their whereabouts and knowledge.',
      sceneType: 'suspect_location',
      locationType: 'interview',
      atmosphere: {
        visual: 'A quiet space for conversation',
        sensory: 'The air is thick with tension',
        mood: 'tense',
        timeOfDay: 'afternoon',
      },
      layout: 'Tables and chairs arranged for interviews',
      accessPoints: [],
      interactiveAreas: suspects.map((s, i) => ({
        name: s.name,
        description: `Interview ${s.role}`,
        position: { x: 20 + (i * 20), y: 50 },
        size: { width: 15, height: 20 },
      })),
      evidenceIds: [],
      suspectsPresentIds: suspects.map(s => s.id),
    };
  }

  private generateAccessPoints(sceneType: string): IAccessPoint[] {
    const accessPointTemplates: Record<string, IAccessPoint[]> = {
      canteen: [
        { name: 'Main Entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
        { name: 'Kitchen Door', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: false },
        { name: 'Service Window', type: 'service_entrance', visibility: 'semi-private', requiresKey: false, monitored: false },
      ],
      library: [
        { name: 'Main Entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
        { name: 'Staff Entrance', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: true },
        { name: 'Emergency Exit', type: 'emergency_exit', visibility: 'semi-private', requiresKey: false, monitored: false },
      ],
      lab: [
        { name: 'Lab Door', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: false },
        { name: 'Prep Room Door', type: 'back_door', visibility: 'semi-private', requiresKey: true, monitored: false },
        { name: 'Emergency Exit', type: 'emergency_exit', visibility: 'semi-private', requiresKey: false, monitored: false },
      ],
      default: [
        { name: 'Main Entrance', type: 'main_entrance', visibility: 'public', requiresKey: false, monitored: true },
        { name: 'Back Door', type: 'back_door', visibility: 'hidden', requiresKey: true, monitored: false },
      ],
    };

    return accessPointTemplates[sceneType] || accessPointTemplates.default;
  }

  private generateInteractiveAreas(evidence: IEvidenceItem[], blueprint: ICrimeBlueprint): IInteractiveArea[] {
    const areas: IInteractiveArea[] = [];

    // Create interactive areas for critical evidence
    const criticalEvidence = evidence.filter(e => e.relevance === 'critical');
    criticalEvidence.forEach((e, i) => {
      areas.push({
        name: e.title,
        description: e.visualCue,
        position: { x: 20 + (i * 20), y: 30 },
        size: { width: 15, height: 15 },
        containsEvidenceId: e.id,
      });
    });

    // Add target area
    areas.push({
      name: `${blueprint.target.name} Location`,
      description: `Where the ${blueprint.target.name} was kept`,
      position: { x: 50, y: 50 },
      size: { width: 20, height: 20 },
    });

    return areas;
  }

  private assignEvidenceToScenes(scenes: IScene[], evidence: IEvidenceItem[]): void {
    for (const item of evidence) {
      // Update evidence scene ID to match actual scenes
      const matchingScene = scenes.find(s =>
        s.name.toLowerCase().includes(item.discoveryLocation.toLowerCase()) ||
        item.discoveryLocation.toLowerCase().includes(s.locationType.toLowerCase())
      );

      if (matchingScene) {
        item.sceneId = matchingScene.id;
        if (!matchingScene.evidenceIds.includes(item.id)) {
          matchingScene.evidenceIds.push(item.id);
        }
      } else {
        // Default to primary scene
        item.sceneId = 'primary-scene';
      }
    }
  }
}

// ============================================
// PHASE 6: PUZZLE GENERATION
// ============================================

export class PuzzleGenerationPhase implements IGenerationPhase<void, IPuzzle[]> {
  readonly name = 'puzzle-generation';
  readonly order = 60;

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint &&
           !!context.evidenceSet &&
           !!context.culpritDetermination &&
           !context.puzzleSet;
  }

  async execute(context: GenerationContext): Promise<IPuzzle[]> {
    const { params } = context;
    const puzzleCount = this.getPuzzleCount(params.difficulty, params.puzzleComplexity);

    console.log('[PuzzleGenerationPhase] Generating curriculum-aligned, story-integrated puzzles...');

    try {
      // Extract story context from the case for puzzle generation
      const storyContext = extractStoryContext(context);

      // Map grade level for syllabus (P1-P3 → P4, P4-P6 stay same)
      const gradeLevelMap: Record<string, GradeLevel> = {
        P1: 'P4', P2: 'P4', P3: 'P4',
        P4: 'P4', P5: 'P5', P6: 'P6',
      };
      const gradeLevel: GradeLevel = gradeLevelMap[params.gradeLevel] || 'P5';
      const subject: Subject = params.subject as Subject;
      const complexity: PuzzleComplexity = (params.puzzleComplexity || 'STANDARD') as PuzzleComplexity;

      // Generate puzzles using the new curriculum-story integrated system
      // These puzzles are:
      // 1. Aligned with Singapore MOE syllabus topics
      // 2. Deeply integrated with the case storyline
      // 3. Essential to solving the mystery
      const integratedPuzzles = generateCurriculumStoryPuzzles(
        gradeLevel,
        subject,
        storyContext,
        puzzleCount,
        complexity
      );

      console.log(`[PuzzleGenerationPhase] Generated ${integratedPuzzles.length} integrated puzzles`);
      console.log(`[PuzzleGenerationPhase] Topics covered: ${integratedPuzzles.map(p => (p as StoryIntegratedPuzzle).syllabusTopicName || 'unknown').join(', ')}`);

      // Map to IPuzzle interface
      const puzzles: IPuzzle[] = integratedPuzzles.map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        complexity: p.complexity,
        difficulty: p.difficulty,
        estimatedMinutes: p.estimatedMinutes,
        narrativeContext: p.narrativeContext,
        question: p.question,
        answer: p.answer,
        options: p.options,
        hint: p.hint,
        investigationPhase: p.investigationPhase,
        relatedEvidenceId: p.relatedEvidenceId,
        relatedSuspectId: p.relatedSuspectId,
        revelation: p.revelation,
        points: p.points,
        // Include curriculum metadata for tracking
        syllabusTopicId: (p as StoryIntegratedPuzzle).syllabusTopicId,
        syllabusTopicName: (p as StoryIntegratedPuzzle).syllabusTopicName,
        learningObjective: (p as StoryIntegratedPuzzle).learningObjective,
        skills: (p as StoryIntegratedPuzzle).skills,
        storyConnection: (p as StoryIntegratedPuzzle).storyConnection,
        revealsAbout: (p as StoryIntegratedPuzzle).revealsAbout,
      }));

      context.puzzleSet = puzzles;
      return puzzles;

    } catch (error) {
      console.error('[PuzzleGenerationPhase] Curriculum-story generation failed, falling back to legacy:', error);
      // Fallback to legacy generation if the new system fails
      return this.legacyGenerate(context);
    }
  }

  /**
   * Legacy puzzle generation - used as fallback if curriculum-story system fails
   */
  private async legacyGenerate(context: GenerationContext): Promise<IPuzzle[]> {
    const blueprint = context.crimeBlueprint!;
    const evidence = context.evidenceSet!;
    const culpritDetermination = context.culpritDetermination!;
    const suspects = context.suspectPool || [];
    const { params } = context;

    const puzzles: IPuzzle[] = [];
    const puzzleCount = this.getPuzzleCount(params.difficulty, params.puzzleComplexity);

    // Generate puzzles for each investigation phase
    const phases = ['initial', 'investigation', 'conclusion'] as const;
    const puzzlesPerPhase = Math.ceil(puzzleCount / 3);

    for (const phase of phases) {
      for (let i = 0; i < puzzlesPerPhase && puzzles.length < puzzleCount; i++) {
        const relatedEvidence = this.selectEvidenceForPuzzle(evidence, phase, i);
        const puzzle = this.generatePuzzle(
          blueprint,
          culpritDetermination,
          suspects,
          relatedEvidence,
          phase,
          params,
          puzzles.length
        );
        puzzles.push(puzzle);
      }
    }

    context.puzzleSet = puzzles;
    return puzzles;
  }

  private getPuzzleCount(difficulty: string, complexity: string): number {
    const baseCount: Record<string, number> = {
      ROOKIE: 3,
      INSPECTOR: 4,
      DETECTIVE: 5,
      CHIEF: 6,
    };

    const complexityModifier: Record<string, number> = {
      BASIC: -1,
      STANDARD: 0,
      CHALLENGING: 1,
      EXPERT: 2,
    };

    return Math.max(2, (baseCount[difficulty] || 4) + (complexityModifier[complexity] || 0));
  }

  private selectEvidenceForPuzzle(
    evidence: IEvidenceItem[],
    phase: 'initial' | 'investigation' | 'conclusion',
    index: number
  ): IEvidenceItem | undefined {
    const phaseEvidence: Record<string, IEvidenceItem['relevance'][]> = {
      initial: ['supporting'],
      investigation: ['critical', 'supporting'],
      conclusion: ['critical'],
    };

    const relevanceTypes = phaseEvidence[phase];
    const filtered = evidence.filter(e => relevanceTypes.includes(e.relevance));
    return filtered[index % filtered.length];
  }

  private generatePuzzle(
    blueprint: ICrimeBlueprint,
    culpritDetermination: ICulpritDetermination,
    suspects: ISuspectProfile[],
    relatedEvidence: IEvidenceItem | undefined,
    phase: 'initial' | 'investigation' | 'conclusion',
    params: GenerationContext['params'],
    index: number
  ): IPuzzle {
    // Determine puzzle type based on subject and phase
    const puzzleType = this.selectPuzzleType(params.subject, phase);

    // Generate puzzle content based on type
    const puzzleContent = this.generatePuzzleContent(
      puzzleType,
      blueprint,
      culpritDetermination,
      suspects,
      params,
      index
    );

    // Generate revelation based on phase
    const revelation = this.generateRevelation(
      phase,
      culpritDetermination,
      relatedEvidence
    );

    // Calculate points and difficulty
    const difficultyNum = this.getDifficultyNumber(params.difficulty);
    const complexityNum = this.getComplexityNumber(params.puzzleComplexity);
    const points = 10 * difficultyNum * complexityNum;

    return {
      id: `puzzle-${nanoid(8)}`,
      title: puzzleContent.title,
      type: puzzleType,
      complexity: params.puzzleComplexity,
      difficulty: difficultyNum,
      estimatedMinutes: 2 + difficultyNum + complexityNum,
      narrativeContext: puzzleContent.context,
      question: puzzleContent.question,
      answer: puzzleContent.answer,
      options: puzzleContent.options,
      hint: puzzleContent.hint,
      investigationPhase: phase,
      relatedEvidenceId: relatedEvidence?.id,
      relatedSuspectId: phase === 'conclusion' ? culpritDetermination.culpritId : undefined,
      revelation,
      points,
    };
  }

  private selectPuzzleType(
    subject: string,
    phase: 'initial' | 'investigation' | 'conclusion'
  ): IPuzzle['type'] {
    const typesBySubjectPhase: Record<string, Record<string, IPuzzle['type'][]>> = {
      MATH: {
        initial: ['math', 'observation'],
        investigation: ['math', 'logic'],
        conclusion: ['deduction', 'math'],
      },
      SCIENCE: {
        initial: ['observation', 'logic'],
        investigation: ['logic', 'observation'],
        conclusion: ['deduction', 'logic'],
      },
      INTEGRATED: {
        initial: ['observation', 'math'],
        investigation: ['logic', 'math'],
        conclusion: ['deduction', 'logic'],
      },
    };

    const types = typesBySubjectPhase[subject]?.[phase] || ['logic'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private generatePuzzleContent(
    type: IPuzzle['type'],
    blueprint: ICrimeBlueprint,
    culpritDetermination: ICulpritDetermination,
    suspects: ISuspectProfile[],
    params: GenerationContext['params'],
    index: number
  ): {
    title: string;
    context: string;
    question: string;
    answer: string;
    options: string[];
    hint: string;
  } {
    const crimeWindow = blueprint.timeline.crimeWindow;
    const windowDuration = crimeWindow.end.minutes - crimeWindow.start.minutes;

    switch (type) {
      case 'math':
        return this.generateMathPuzzle(blueprint, windowDuration, index);
      case 'logic':
        return this.generateLogicPuzzle(blueprint, suspects, culpritDetermination);
      case 'observation':
        return this.generateObservationPuzzle(blueprint);
      case 'deduction':
        return this.generateDeductionPuzzle(suspects, culpritDetermination);
      default:
        return this.generateMathPuzzle(blueprint, windowDuration, index);
    }
  }

  private generateMathPuzzle(
    blueprint: ICrimeBlueprint,
    windowDuration: number,
    index: number
  ): {
    title: string;
    context: string;
    question: string;
    answer: string;
    options: string[];
    hint: string;
  } {
    const puzzleVariants = [
      {
        title: 'Time Window Calculation',
        context: `The crime occurred between ${blueprint.timeline.crimeWindow.start.formatted} and ${blueprint.timeline.crimeWindow.end.formatted}.`,
        question: `How many minutes was the crime window?`,
        answer: windowDuration.toString(),
        options: this.generateNumericOptions(windowDuration),
        hint: 'Subtract the start time from the end time.',
      },
      {
        title: 'Value Assessment',
        context: `The ${blueprint.target.name} was ${blueprint.target.significance}.`,
        question: `If the ${blueprint.target.name} was worth $${blueprint.target.value}, and similar items are worth 20% less, what would be the value of a similar item?`,
        answer: Math.round(blueprint.target.value * 0.8).toString(),
        options: this.generateNumericOptions(Math.round(blueprint.target.value * 0.8)),
        hint: 'Calculate 80% of the original value.',
      },
      {
        title: 'Timeline Analysis',
        context: `The investigation spans multiple time points.`,
        question: `If the discovery was at ${blueprint.timeline.discoveryTime.formatted} and the crime window started ${windowDuration} minutes earlier, what time did the window end?`,
        answer: blueprint.timeline.crimeWindow.end.formatted,
        options: this.generateTimeOptions(blueprint.timeline.crimeWindow.end.formatted),
        hint: 'Work backwards from the discovery time.',
      },
    ];

    return puzzleVariants[index % puzzleVariants.length];
  }

  private generateLogicPuzzle(
    blueprint: ICrimeBlueprint,
    suspects: ISuspectProfile[],
    culpritDetermination: ICulpritDetermination
  ): {
    title: string;
    context: string;
    question: string;
    answer: string;
    options: string[];
    hint: string;
  } {
    const culprit = suspects.find(s => s.id === culpritDetermination.culpritId);
    const innocents = suspects.filter(s => s.id !== culpritDetermination.culpritId);

    return {
      title: 'Alibi Analysis',
      context: `Multiple suspects have provided alibis. One of them has a gap during the crime window.`,
      question: `If a suspect claims to have been at their workstation from ${blueprint.timeline.crimeWindow.start.formatted} but was not seen by anyone until ${blueprint.timeline.crimeWindow.end.formatted}, how many minutes is the gap in their alibi?`,
      answer: (blueprint.timeline.crimeWindow.end.minutes - blueprint.timeline.crimeWindow.start.minutes).toString(),
      options: this.generateNumericOptions(blueprint.timeline.crimeWindow.end.minutes - blueprint.timeline.crimeWindow.start.minutes),
      hint: 'Calculate the difference between when they claim to have arrived and when they were first seen.',
    };
  }

  private generateObservationPuzzle(blueprint: ICrimeBlueprint): {
    title: string;
    context: string;
    question: string;
    answer: string;
    options: string[];
    hint: string;
  } {
    const traces = blueprint.traces;
    const physicalTraces = traces.filter(t => t.type === 'physical');

    return {
      title: 'Evidence Observation',
      context: `You are examining the crime scene for physical evidence.`,
      question: `How many types of physical evidence were left at the scene?`,
      answer: physicalTraces.length.toString(),
      options: this.generateNumericOptions(physicalTraces.length),
      hint: 'Count all items that can be physically collected from the scene.',
    };
  }

  private generateDeductionPuzzle(
    suspects: ISuspectProfile[],
    culpritDetermination: ICulpritDetermination
  ): {
    title: string;
    context: string;
    question: string;
    answer: string;
    options: string[];
    hint: string;
  } {
    const culprit = suspects.find(s => s.id === culpritDetermination.culpritId);

    return {
      title: 'Final Deduction',
      context: `Based on all the evidence: opportunity, motive, means, and traces—one suspect stands out.`,
      question: `Who had the strongest combination of opportunity and motive?`,
      answer: culprit?.name || 'Unknown',
      options: suspects.map(s => s.name),
      hint: 'Consider who had both the chance and a reason to commit the crime.',
    };
  }

  private generateRevelation(
    phase: 'initial' | 'investigation' | 'conclusion',
    culpritDetermination: ICulpritDetermination,
    relatedEvidence?: IEvidenceItem
  ): IPuzzle['revelation'] {
    const revelations: Record<string, {
      type: string;
      description: string;
      storyText: string;
      importance: 'minor' | 'moderate' | 'major';
    }> = {
      initial: {
        type: 'timeline',
        description: 'Understanding the sequence of events',
        storyText: 'The timeline begins to take shape. Each minute tells a story.',
        importance: 'minor',
      },
      investigation: {
        type: 'evidence',
        description: relatedEvidence?.title || 'A key piece of evidence',
        storyText: 'This clue connects to other findings. The picture is becoming clearer.',
        importance: 'moderate',
      },
      conclusion: {
        type: 'motive',
        description: `Understanding ${culpritDetermination.culpritName}'s actions`,
        storyText: 'The final piece falls into place. The truth can no longer hide.',
        importance: 'major',
      },
    };

    return revelations[phase];
  }

  private generateNumericOptions(correctAnswer: number): string[] {
    const options = [correctAnswer.toString()];
    const offsets = [-20, -10, 10, 15];

    for (const offset of offsets) {
      const option = Math.max(0, correctAnswer + offset);
      if (!options.includes(option.toString())) {
        options.push(option.toString());
      }
    }

    return this.shuffleArray(options.slice(0, 4));
  }

  private generateTimeOptions(correctTime: string): string[] {
    const [hours, minutes] = correctTime.split(':').map(Number);
    const correctMinutes = hours * 60 + minutes;

    const options = [correctTime];
    const offsets = [-30, -15, 15, 30];

    for (const offset of offsets) {
      const newMinutes = correctMinutes + offset;
      const h = Math.floor(newMinutes / 60) % 24;
      const m = newMinutes % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      if (!options.includes(timeStr)) {
        options.push(timeStr);
      }
    }

    return this.shuffleArray(options.slice(0, 4));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getDifficultyNumber(difficulty: string): number {
    const map: Record<string, number> = { ROOKIE: 1, INSPECTOR: 2, DETECTIVE: 3, CHIEF: 4 };
    return map[difficulty] || 2;
  }

  private getComplexityNumber(complexity: string): number {
    const map: Record<string, number> = { BASIC: 1, STANDARD: 2, CHALLENGING: 3, EXPERT: 4 };
    return map[complexity] || 2;
  }
}

// ============================================
// PHASE 7: NARRATIVE LAYER
// ============================================

export class NarrativeLayerPhase implements IGenerationPhase<void, INarrativeLayer> {
  readonly name = 'narrative-layer';
  readonly order = 70;

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint &&
           !!context.suspectPool &&
           !!context.culpritDetermination &&
           !!context.evidenceSet &&
           !!context.sceneSet &&
           !!context.puzzleSet &&
           !context.narrativeLayer;
  }

  async execute(context: GenerationContext): Promise<INarrativeLayer> {
    const blueprint = context.crimeBlueprint!;
    const suspects = context.suspectPool!;
    const culpritDetermination = context.culpritDetermination!;
    const evidence = context.evidenceSet!;
    const scenes = context.sceneSet!;
    const puzzles = context.puzzleSet!;

    const narrativeLayer: INarrativeLayer = {
      briefing: this.generateBriefing(blueprint),
      openingHook: blueprint.narrative.hook,
      sceneDescriptions: this.generateSceneDescriptions(scenes, blueprint),
      suspectIntroductions: this.generateSuspectIntroductions(suspects, culpritDetermination),
      evidenceDiscoveries: this.generateEvidenceDiscoveries(evidence),
      puzzleContexts: this.generatePuzzleContexts(puzzles),
      revelationMoments: this.generateRevelationMoments(culpritDetermination, evidence),
      resolution: this.generateResolution(culpritDetermination, suspects, blueprint),
    };

    context.narrativeLayer = narrativeLayer;
    return narrativeLayer;
  }

  private generateBriefing(blueprint: ICrimeBlueprint): string {
    return [
      blueprint.narrative.hook,
      '',
      blueprint.narrative.tension,
      '',
      `Your mission: Examine the evidence, interview the suspects, and uncover the truth about the missing ${blueprint.target.name}.`,
      '',
      blueprint.narrative.twist,
    ].join('\n');
  }

  private generateSceneDescriptions(scenes: IScene[], blueprint: ICrimeBlueprint): Record<string, string> {
    const descriptions: Record<string, string> = {};

    for (const scene of scenes) {
      descriptions[scene.id] = [
        scene.description,
        '',
        scene.atmosphere.visual,
        scene.atmosphere.sensory,
        '',
        `The ${scene.atmosphere.mood} atmosphere suggests there may be clues to find here.`,
      ].join('\n');
    }

    return descriptions;
  }

  private generateSuspectIntroductions(
    suspects: ISuspectProfile[],
    culpritDetermination: ICulpritDetermination
  ): Record<string, string> {
    const introductions: Record<string, string> = {};

    for (const suspect of suspects) {
      const isGuilty = suspect.id === culpritDetermination.culpritId;
      const personalityDesc = suspect.personality.join(', ');

      let intro: string;
      if (isGuilty) {
        intro = [
          `${suspect.name}, the ${suspect.role}.`,
          '',
          `They appear ${personalityDesc}. But something seems off.`,
          '',
          `"${suspect.alibi.claim}"`,
        ].join('\n');
      } else {
        intro = [
          `${suspect.name}, the ${suspect.role}.`,
          '',
          `They seem ${personalityDesc}.`,
          '',
          `"${suspect.alibi.claim}"`,
        ].join('\n');
      }

      introductions[suspect.id] = intro;
    }

    return introductions;
  }

  private generateEvidenceDiscoveries(evidence: IEvidenceItem[]): Record<string, string> {
    const discoveries: Record<string, string> = {};

    for (const item of evidence) {
      discoveries[item.id] = [
        item.visualCue,
        '',
        `You examine the ${item.title} more closely.`,
        '',
        ...item.examinationDetails,
        '',
        item.analysisResult,
      ].join('\n');
    }

    return discoveries;
  }

  private generatePuzzleContexts(puzzles: IPuzzle[]): Record<string, string> {
    const contexts: Record<string, string> = {};

    for (const puzzle of puzzles) {
      contexts[puzzle.id] = [
        puzzle.narrativeContext,
        '',
        `This puzzle will help you understand more about the case.`,
      ].join('\n');
    }

    return contexts;
  }

  private generateRevelationMoments(
    culpritDetermination: ICulpritDetermination,
    evidence: IEvidenceItem[]
  ): string[] {
    const moments: string[] = [];

    // Generate revelation for each proof point
    for (const proof of culpritDetermination.proofPoints) {
      moments.push(`The ${proof.type} evidence points clearly: ${proof.description}`);
    }

    // Add contradiction revelations
    const contradictingEvidence = evidence.filter(e => e.contradicts);
    for (const item of contradictingEvidence) {
      if (item.contradicts) {
        moments.push(
          `Wait—${item.title} contradicts what was claimed. ` +
          `They said "${item.contradicts.claim}" but the evidence shows: ${item.contradicts.truth}`
        );
      }
    }

    return moments;
  }

  private generateResolution(
    culpritDetermination: ICulpritDetermination,
    suspects: ISuspectProfile[],
    blueprint: ICrimeBlueprint
  ): string {
    const culprit = suspects.find(s => s.id === culpritDetermination.culpritId);

    if (!culprit) {
      return 'The case has been solved.';
    }

    return [
      `The evidence was undeniable.`,
      '',
      `${culprit.name}, the ${culprit.role}, was responsible for the ${blueprint.crimeType} of ${blueprint.target.name}.`,
      '',
      `Their ${culprit.motive.type} motive: ${culprit.motive.description}`,
      '',
      `The key evidence:`,
      ...culpritDetermination.proofPoints.map(p => `• ${p.description}`),
      '',
      `Justice was served. Another case closed.`,
    ].join('\n');
  }
}

// ============================================
// REGISTRATION FUNCTIONS
// ============================================

export function registerEvidenceGenerationPhase(): void {
  registry.registerPhase(new EvidenceGenerationPhase());
}

export function registerSceneGenerationPhase(): void {
  registry.registerPhase(new SceneGenerationPhase());
}

export function registerPuzzleGenerationPhase(): void {
  registry.registerPhase(new PuzzleGenerationPhase());
}

export function registerNarrativeLayerPhase(): void {
  registry.registerPhase(new NarrativeLayerPhase());
}
