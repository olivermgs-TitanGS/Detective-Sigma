/**
 * GENERATION PHASES INDEX
 *
 * Exports all phase registration functions for clean imports.
 */

export { CrimeBlueprintPhase, registerCrimeBlueprintPhase } from './crime-blueprint-phase';
export { SuspectPoolPhase, registerSuspectPoolPhase } from './suspect-pool-phase';
export { GuiltDeterminationPhase, registerGuiltDeterminationPhase } from './guilt-determination-phase';
export {
  EvidenceGenerationPhase,
  SceneGenerationPhase,
  PuzzleGenerationPhase,
  NarrativeLayerPhase,
  registerEvidenceGenerationPhase,
  registerSceneGenerationPhase,
  registerPuzzleGenerationPhase,
  registerNarrativeLayerPhase,
} from './evidence-scene-puzzle-phases';

/**
 * Register all phases at once
 */
export function registerAllPhases(): void {
  const { registerCrimeBlueprintPhase } = require('./crime-blueprint-phase');
  const { registerSuspectPoolPhase } = require('./suspect-pool-phase');
  const { registerGuiltDeterminationPhase } = require('./guilt-determination-phase');
  const {
    registerEvidenceGenerationPhase,
    registerSceneGenerationPhase,
    registerPuzzleGenerationPhase,
    registerNarrativeLayerPhase,
  } = require('./evidence-scene-puzzle-phases');

  registerCrimeBlueprintPhase();
  registerSuspectPoolPhase();
  registerGuiltDeterminationPhase();
  registerEvidenceGenerationPhase();
  registerSceneGenerationPhase();
  registerPuzzleGenerationPhase();
  registerNarrativeLayerPhase();
}
