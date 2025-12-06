/**
 * CASE GENERATOR ARCHITECTURE
 *
 * This is the CORE FRAMEWORK that should NEVER be rewritten.
 * It defines contracts (interfaces) that all components must follow.
 *
 * DESIGN PRINCIPLES:
 * 1. OPEN/CLOSED: Open for extension, closed for modification
 * 2. DEPENDENCY INVERSION: Depend on abstractions, not concretions
 * 3. SINGLE RESPONSIBILITY: Each module does one thing well
 * 4. INTERFACE SEGREGATION: Small, focused interfaces
 * 5. COMPOSITION OVER INHERITANCE: Build complex behavior from simple parts
 *
 * TO ADD NEW FEATURES:
 * - Add new crime types: Implement ICrimeTemplate and register
 * - Add new scenes: Implement ISceneTemplate and register
 * - Add new puzzle types: Implement IPuzzleGenerator and register
 * - Add new evidence types: Implement IEvidenceGenerator and register
 * - Add new narrative styles: Implement INarrativeStyle and register
 *
 * NEVER MODIFY:
 * - The core interfaces in this file
 * - The pipeline orchestration logic
 * - The registry pattern
 */

// ============================================
// CORE DATA TYPES (Immutable Contracts)
// ============================================

/**
 * Time representation used throughout the system
 */
export interface TimePoint {
  formatted: string;     // "14:30"
  minutes: number;       // Minutes from midnight (870)
}

/**
 * Time window for events
 */
export interface TimeWindow {
  start: TimePoint;
  end: TimePoint;
}

/**
 * Location in the case world
 */
export interface CaseLocation {
  id: string;
  name: string;
  type: string;          // 'canteen', 'library', 'lab', etc.
  description: string;
  parentLocation?: string;  // For nested locations
}

/**
 * A person in the case
 */
export interface CasePerson {
  id: string;
  name: string;
  role: string;
  description: string;
  traits: string[];
}

// ============================================
// GENERATION CONTEXT (Passed Through Pipeline)
// ============================================

/**
 * Generation parameters from the user/API
 */
export interface GenerationParams {
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED';
  gradeLevel: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  puzzleComplexity: 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';
  contentRating?: 'GENERAL' | 'PG13' | 'ADV16' | 'M18';
  constraints?: {
    excludeThemes?: string[];
    requiredSkills?: string[];
    estimatedMinutes?: number;
    minPuzzles?: number;
    maxPuzzles?: number;
  };
}

/**
 * Context that flows through the generation pipeline.
 * Each phase adds to this context; later phases can read from earlier phases.
 */
export interface GenerationContext {
  readonly params: GenerationParams;
  readonly randomSeed?: number;

  // Phases add their outputs here
  crimeBlueprint?: ICrimeBlueprint;
  suspectPool?: ISuspectProfile[];
  culpritDetermination?: ICulpritDetermination;
  evidenceSet?: IEvidenceItem[];
  sceneSet?: IScene[];
  puzzleSet?: IPuzzle[];
  narrativeLayer?: INarrativeLayer;

  // Extension point: custom data from plugins
  extensions: Record<string, unknown>;
}

// ============================================
// PHASE OUTPUT INTERFACES
// These define what each generation phase produces
// ============================================

/**
 * Crime Blueprint - The foundation story
 */
export interface ICrimeBlueprint {
  id: string;
  crimeType: string;
  title: string;

  // The target of the crime
  target: {
    name: string;
    description: string;
    value: number;
    significance: string;
    location: string;
  };

  // Step-by-step crime choreography
  choreography: ICrimeStep[];

  // Evidence traces left by the crime
  traces: ITracePoint[];

  // Timeline
  timeline: {
    dayContext: string;
    crimeWindow: TimeWindow;
    discoveryTime: TimePoint;
  };

  // Primary scene
  primarySceneType: string;
  sceneContext: Record<string, unknown>;

  // Narrative elements
  narrative: {
    hook: string;
    tension: string;
    twist: string;
  };
}

export interface ICrimeStep {
  id: string;
  time: TimePoint;
  phase: 'preparation' | 'execution' | 'aftermath';
  action: string;
  location: string;
  details: string;
  tracesCreated: string[];
  observableBy: string[];
}

export interface ITracePoint {
  id: string;
  type: 'physical' | 'digital' | 'testimonial' | 'material';
  category: string;
  location: string;
  description: string;
  linkedToStepId: string;
  discoveryDifficulty: 'obvious' | 'careful' | 'forensic';
  narrativeReveal: string;
}

/**
 * Suspect Profile - Detailed character information
 */
export interface ISuspectProfile {
  id: string;
  name: string;
  role: string;
  description: string;

  // Character details
  personality: string[];
  traits: string[];
  appearance: {
    ethnicity?: string;
    gender?: string;
    ageCategory?: string;
    specificAge?: number;
  };

  // Timeline of movements
  timeline: ISuspectMovement[];

  // Alibi
  alibi: {
    claim: string;
    location: string;
    timeWindow: TimeWindow;
    verifiable: boolean;
    witnesses: string[];
  };

  // Motive assessment
  motive: {
    type: string;
    strength: 'none' | 'weak' | 'moderate' | 'strong';
    description: string;
    backstory: string;
    evidence: string[];
  };

  // Opportunity assessment
  opportunity: {
    hadAccess: boolean;
    hasGap: boolean;
    gapWindow?: TimeWindow;
    accessMethod?: string;
  };

  // Relationships
  relationships: ISuspectRelationship[];

  // Dialogue
  dialogueTree: IDialogueNode[];
}

export interface ISuspectMovement {
  time: TimePoint;
  location: string;
  action: string;
  witnesses: string[];
  verifiable: boolean;
}

export interface ISuspectRelationship {
  targetId: string;
  targetName: string;
  type: string;
  description: string;
  tension?: number;  // 0-10 scale
}

export interface IDialogueNode {
  id: string;
  question: string;
  answer: string;
  emotion: string;
  revealsInfo?: string;
  contradictsId?: string;
  unlocksNodeId?: string;
  requiresEvidence?: string;
}

/**
 * Culprit Determination - Evidence-based guilt selection
 */
export interface ICulpritDetermination {
  culpritId: string;
  culpritName: string;

  // Why they're guilty (derived from evidence intersection)
  evidence: {
    opportunityScore: number;      // 0-100
    motiveScore: number;           // 0-100
    meansScore: number;            // 0-100
    traceMatchScore: number;       // 0-100
    totalScore: number;            // Combined
  };

  // Specific proof points
  proofPoints: {
    type: 'opportunity' | 'motive' | 'means' | 'trace';
    description: string;
    linkedEvidenceId?: string;
    linkedTraceId?: string;
  }[];

  // Red herrings for other suspects
  redHerrings: {
    suspectId: string;
    suspectName: string;
    misleadingFact: string;
    actualExplanation: string;
  }[];
}

/**
 * Evidence Item - What players find
 */
export interface IEvidenceItem {
  id: string;
  title: string;
  description: string;

  // Classification
  type: 'physical' | 'document' | 'testimony' | 'digital';
  relevance: 'critical' | 'supporting' | 'red-herring';

  // Location and discovery
  sceneId: string;
  discoveryLocation: string;
  discoveryMethod: string;
  discoveryDifficulty: 'obvious' | 'careful' | 'forensic';

  // Narrative
  visualCue: string;
  examinationDetails: string[];
  analysisResult: string;

  // Connections
  linkedToSuspects: string[];
  linkedToTraces: string[];
  contradicts?: {
    suspectId: string;
    claim: string;
    truth: string;
  };

  // Puzzle integration
  relatedPuzzleId?: string;
  puzzleHint?: string;
}

/**
 * Scene - Explorable locations
 */
export interface IScene {
  id: string;
  name: string;
  description: string;

  // Classification
  sceneType: 'primary' | 'secondary' | 'suspect_location' | 'resolution';
  locationType: string;

  // Atmosphere
  atmosphere: {
    visual: string;
    sensory: string;
    mood: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };

  // Layout
  layout: string;
  accessPoints: IAccessPoint[];
  interactiveAreas: IInteractiveArea[];

  // Content
  evidenceIds: string[];
  suspectsPresentIds: string[];
}

export interface IAccessPoint {
  name: string;
  type: string;
  visibility: string;
  requiresKey: boolean;
  monitored: boolean;
}

export interface IInteractiveArea {
  name: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  containsEvidenceId?: string;
}

/**
 * Puzzle - Educational challenges
 */
export interface IPuzzle {
  id: string;
  title: string;

  // Classification
  type: 'math' | 'logic' | 'observation' | 'deduction';
  complexity: 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';
  difficulty: number;       // 1-10
  estimatedMinutes: number;

  // Content
  narrativeContext: string;
  question: string;
  answer: string;
  options?: string[];       // For MCQ
  hint: string;

  // Curriculum alignment
  topicId?: string;
  learningObjectives?: string[];
  dataTablesProvided?: string[];

  // Integration
  investigationPhase: 'initial' | 'investigation' | 'conclusion';
  relatedEvidenceId?: string;
  relatedSuspectId?: string;

  // Revelation
  revelation: {
    type: string;
    description: string;
    storyText: string;
    importance: 'minor' | 'moderate' | 'major';
  };

  // Points
  points: number;
}

/**
 * Narrative Layer - Story text and atmosphere
 */
export interface INarrativeLayer {
  briefing: string;
  openingHook: string;
  sceneDescriptions: Record<string, string>;
  suspectIntroductions: Record<string, string>;
  evidenceDiscoveries: Record<string, string>;
  puzzleContexts: Record<string, string>;
  revelationMoments: string[];
  resolution: string;
}

// ============================================
// GENERATOR INTERFACES (Plugin Contracts)
// ============================================

/**
 * A generation phase processor.
 * Implement this interface to create new generation phases.
 */
export interface IGenerationPhase<TInput = void, TOutput = void> {
  readonly name: string;
  readonly order: number;  // Lower numbers run first

  /**
   * Check if this phase can run given the current context
   */
  canExecute(context: GenerationContext): boolean;

  /**
   * Execute this phase and update the context
   */
  execute(context: GenerationContext, input?: TInput): Promise<TOutput>;
}

/**
 * Template provider for crime types.
 * Implement this to add new crime types.
 */
export interface ICrimeTemplateProvider {
  readonly crimeType: string;
  readonly supportedDifficulties: string[];
  readonly supportedSubjects: string[];

  generateBlueprint(params: GenerationParams): ICrimeBlueprint;
}

/**
 * Template provider for scenes.
 * Implement this to add new scene types.
 */
export interface ISceneTemplateProvider {
  readonly sceneType: string;

  generateScene(
    blueprint: ICrimeBlueprint,
    params: GenerationParams
  ): IScene;
}

/**
 * Generator for puzzles.
 * Implement this to add new puzzle types or educational content.
 */
export interface IPuzzleGenerator {
  readonly puzzleType: string;
  readonly supportedTopics: string[];
  readonly supportedComplexities: string[];

  generatePuzzle(
    context: GenerationContext,
    evidenceItem?: IEvidenceItem
  ): IPuzzle;
}

/**
 * Generator for evidence from traces.
 * Implement this to add new evidence generation logic.
 */
export interface IEvidenceGenerator {
  readonly evidenceType: string;

  generateFromTrace(
    trace: ITracePoint,
    blueprint: ICrimeBlueprint,
    suspects: ISuspectProfile[]
  ): IEvidenceItem;
}

/**
 * Narrative style provider.
 * Implement this to add new writing styles (e.g., noir, adventure, etc.)
 */
export interface INarrativeStyleProvider {
  readonly styleName: string;

  generateNarrativeLayer(context: GenerationContext): INarrativeLayer;
}

// ============================================
// REGISTRY (Extension Point)
// ============================================

/**
 * Central registry for all pluggable components.
 * Use this to register new crime types, scenes, puzzles, etc.
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;

  private crimeTemplates = new Map<string, ICrimeTemplateProvider>();
  private sceneTemplates = new Map<string, ISceneTemplateProvider>();
  private puzzleGenerators = new Map<string, IPuzzleGenerator>();
  private evidenceGenerators = new Map<string, IEvidenceGenerator>();
  private narrativeStyles = new Map<string, INarrativeStyleProvider>();
  private phases: IGenerationPhase<unknown, unknown>[] = [];

  private constructor() {}

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  // Registration methods
  registerCrimeTemplate(provider: ICrimeTemplateProvider): void {
    this.crimeTemplates.set(provider.crimeType, provider);
  }

  registerSceneTemplate(provider: ISceneTemplateProvider): void {
    this.sceneTemplates.set(provider.sceneType, provider);
  }

  registerPuzzleGenerator(generator: IPuzzleGenerator): void {
    this.puzzleGenerators.set(generator.puzzleType, generator);
  }

  registerEvidenceGenerator(generator: IEvidenceGenerator): void {
    this.evidenceGenerators.set(generator.evidenceType, generator);
  }

  registerNarrativeStyle(provider: INarrativeStyleProvider): void {
    this.narrativeStyles.set(provider.styleName, provider);
  }

  registerPhase(phase: IGenerationPhase<unknown, unknown>): void {
    this.phases.push(phase);
    this.phases.sort((a, b) => a.order - b.order);
  }

  // Retrieval methods
  getCrimeTemplate(type: string): ICrimeTemplateProvider | undefined {
    return this.crimeTemplates.get(type);
  }

  getRandomCrimeTemplate(params: GenerationParams): ICrimeTemplateProvider | undefined {
    const suitable = Array.from(this.crimeTemplates.values()).filter(t =>
      t.supportedDifficulties.includes(params.difficulty) &&
      t.supportedSubjects.includes(params.subject)
    );
    if (suitable.length === 0) return Array.from(this.crimeTemplates.values())[0];
    return suitable[Math.floor(Math.random() * suitable.length)];
  }

  getSceneTemplate(type: string): ISceneTemplateProvider | undefined {
    return this.sceneTemplates.get(type);
  }

  getPuzzleGenerator(type: string): IPuzzleGenerator | undefined {
    return this.puzzleGenerators.get(type);
  }

  getEvidenceGenerator(type: string): IEvidenceGenerator | undefined {
    return this.evidenceGenerators.get(type);
  }

  getNarrativeStyle(name: string): INarrativeStyleProvider | undefined {
    return this.narrativeStyles.get(name);
  }

  getPhases(): IGenerationPhase<unknown, unknown>[] {
    return [...this.phases];
  }

  // Utility methods
  getAllCrimeTypes(): string[] {
    return Array.from(this.crimeTemplates.keys());
  }

  getAllSceneTypes(): string[] {
    return Array.from(this.sceneTemplates.keys());
  }

  getAllPuzzleTypes(): string[] {
    return Array.from(this.puzzleGenerators.keys());
  }
}

// ============================================
// PIPELINE ORCHESTRATOR
// ============================================

/**
 * The main orchestrator that runs the generation pipeline.
 * This class coordinates all phases but contains no business logic.
 */
export class GenerationPipeline {
  private registry: ComponentRegistry;

  constructor() {
    this.registry = ComponentRegistry.getInstance();
  }

  /**
   * Run the complete generation pipeline
   */
  async generate(params: GenerationParams): Promise<GenerationContext> {
    // Initialize context
    const context: GenerationContext = {
      params,
      extensions: {},
    };

    // Run all phases in order
    const phases = this.registry.getPhases();
    for (const phase of phases) {
      if (phase.canExecute(context)) {
        await phase.execute(context);
      }
    }

    return context;
  }

  /**
   * Run a specific phase manually (for testing or custom flows)
   */
  async runPhase(
    phaseName: string,
    context: GenerationContext
  ): Promise<GenerationContext> {
    const phases = this.registry.getPhases();
    const phase = phases.find(p => p.name === phaseName);

    if (phase && phase.canExecute(context)) {
      await phase.execute(context);
    }

    return context;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createTimePoint(hours: number, minutes: number): TimePoint {
  return {
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    minutes: hours * 60 + minutes,
  };
}

export function createTimePointFromMinutes(totalMinutes: number): TimePoint {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return {
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    minutes: totalMinutes,
  };
}

export function parseTimeString(timeStr: string): TimePoint {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return createTimePoint(hours, minutes);
}

export function createTimeWindow(start: TimePoint, end: TimePoint): TimeWindow {
  return { start, end };
}

/**
 * Create a basic generation context
 */
export function createContext(params: GenerationParams): GenerationContext {
  return {
    params,
    extensions: {},
  };
}

// ============================================
// EXPORTS
// ============================================

export const registry = ComponentRegistry.getInstance();
export const pipeline = new GenerationPipeline();
