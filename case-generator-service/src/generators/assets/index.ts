import { GenerationRequest, AssetManifest, AssetSpec, Suspect, Clue, Scene } from '../../types';
import { StoryOutput } from '../story';
import { createGeneratorLogger } from '../../utils/logger';

const logger = createGeneratorLogger('assets');

export async function generateAssets(
  request: GenerationRequest,
  story: StoryOutput,
  suspects: Suspect[],
  clues: Clue[],
  scenes: Scene[]
): Promise<AssetManifest> {
  logger.info('Generating asset specifications');

  const includeAssets = request.preferences?.includeAssets !== false;

  if (!includeAssets) {
    return {
      cover: { type: 'image', metadata: {} },
      scenes: {},
      suspects: {},
      clues: {},
    };
  }

  // Generate cover asset
  const cover: AssetSpec = {
    type: 'image',
    prompt: `Detective case cover image: ${story.title}. ${story.theme} theme. Location: ${story.location}. Style: educational, friendly, colorful illustration suitable for children aged 10-12. Singapore context.`,
    metadata: {
      style: 'illustration',
      resolution: '1200x630',
      aspectRatio: '16:9',
    },
  };

  // Generate scene assets
  const sceneAssets: { [key: string]: AssetSpec } = {};
  scenes.forEach((scene) => {
    sceneAssets[scene.id] = {
      type: 'image',
      prompt: `Scene background for detective case: ${scene.name}. ${scene.description}. Style: illustrated, child-friendly, detailed but not cluttered. Lighting: bright and welcoming. Singapore setting.`,
      metadata: {
        style: 'background',
        resolution: '1920x1080',
        aspectRatio: '16:9',
        scene: scene.name,
      },
    };
  });

  // Generate suspect portraits
  const suspectAssets: { [key: string]: AssetSpec } = {};
  suspects.forEach((suspect) => {
    suspectAssets[suspect.id] = {
      type: 'image',
      prompt: `Character portrait: ${suspect.name}, ${suspect.role}. Personality: ${suspect.personality.join(', ')}. Age-appropriate for educational game (10-12 year old audience). Singapore context with diverse ethnicity. Style: friendly cartoon illustration, expressive face, neutral background. Professional but approachable appearance.`,
      metadata: {
        style: 'portrait',
        resolution: '512x512',
        aspectRatio: '1:1',
        character: suspect.name,
        role: suspect.role,
      },
    };
  });

  // Generate clue assets
  const clueAssets: { [key: string]: AssetSpec } = {};
  clues.forEach((clue) => {
    if (clue.type === 'document') {
      clueAssets[clue.id] = {
        type: 'image',
        prompt: `${clue.title}: ${clue.description}. Style: realistic document/paper texture, legible text, professional layout. Suitable for educational detective game.`,
        metadata: {
          style: 'document',
          resolution: '800x600',
          clueType: clue.type,
        },
      };
    } else if (clue.type === 'physical') {
      clueAssets[clue.id] = {
        type: 'image',
        prompt: `Physical evidence: ${clue.title}. ${clue.description}. Style: realistic photograph style, clear details, neutral background. Educational quality.`,
        metadata: {
          style: 'evidence-photo',
          resolution: '800x600',
          clueType: clue.type,
        },
      };
    }
  });

  logger.info({
    cover: 1,
    scenes: Object.keys(sceneAssets).length,
    suspects: Object.keys(suspectAssets).length,
    clues: Object.keys(clueAssets).length,
  }, 'Generated asset specifications');

  return {
    cover,
    scenes: sceneAssets,
    suspects: suspectAssets,
    clues: clueAssets,
  };
}
