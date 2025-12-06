/**
 * Image generation hook for case generator
 */

import { useState, useCallback } from 'react';
import type { GeneratedCase, GeneratedImages, ImageGenProgress, ContentRating } from '../utils/types';
import { buildSuspectPrompt, buildCoverPrompt, buildScenePrompt, buildCluePrompt } from '../utils/promptBuilder';

// Negative prompts by content rating - more restrictive = more negative prompts
const RATING_NEGATIVE_PROMPTS: Record<ContentRating, string> = {
  GENERAL: 'nsfw, nude, naked, revealing, suggestive, violence, blood, gore, weapons, injury, death, scary, horror, frightening, disturbing, provocative, sexy, cleavage, bikini, underwear, lingerie, swimsuit',
  PG13: 'nsfw, nude, naked, explicit, gore, graphic violence, death, disturbing, provocative, sexy, cleavage',
  ADV16: 'nsfw, nude, naked, explicit, gore, graphic content',
  M18: 'explicit nsfw, hardcore',
};

export function useImageGeneration() {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ suspects: {}, scenes: {}, clues: {} });
  const [imageGenProgress, setImageGenProgress] = useState<ImageGenProgress | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const resetImages = useCallback(() => {
    setGeneratedImages({ suspects: {}, scenes: {}, clues: {} });
    setImageGenError(null);
  }, []);

  const generateImagesForCase = useCallback(async (caseData: GeneratedCase, subject: string, contentRating: ContentRating = 'GENERAL') => {
    setIsGeneratingImages(true);
    setImageGenError(null);

    const newImages: GeneratedImages = { suspects: {}, scenes: {}, clues: {} };
    const cluesWithImages = (caseData.clues || []).filter(c => c.type !== 'testimony');
    const totalImages = 1 + (caseData.suspects?.length || 0) + (caseData.scenes?.length || 0) + cluesWithImages.length;

    // Get rating-appropriate negative prompts
    const ratingNegatives = RATING_NEGATIVE_PROMPTS[contentRating];

    try {
      let completed = 0;

      // 1. Generate cover image
      setImageGenProgress({ current: 'Case Cover', completed, total: totalImages });
      // Cover image - Realistic Vision V6.0 settings
      const coverResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageRequest: {
            id: `cover-${caseData.caseId}`,
            type: 'cover',
            prompt: buildCoverPrompt(caseData, subject),
            negativePrompt: `worst quality, low quality, blurry, text, watermark, people, human, deformed, disfigured, ${ratingNegatives}`,
            width: 512, height: 512,
            settings: { model: 'realisticVisionV60B1', sampler: 'DPM++ 2M Karras', steps: 25, cfgScale: 7 },
            metadata: { caseId: caseData.caseId },
          },
          saveToPublic: false,
        }),
      });
      const coverData = await coverResponse.json();
      if (coverResponse.ok && coverData.success && coverData.imageUrl) {
        newImages.cover = coverData.imageUrl;
      }
      completed++;
      setGeneratedImages({ ...newImages });

      // 2. Generate scene images (larger for immersive gameplay with embedded evidence)
      for (const scene of (caseData.scenes || [])) {
        setImageGenProgress({ current: `Scene: ${scene.name}`, completed, total: totalImages });

        // Find clues that belong to this scene for embedding in the image
        // Use cluesAvailable for semantic mapping, include position data for zone-based embedding
        const sceneClues = (caseData.clues || []).filter(clue => {
          // Match by scene's cluesAvailable array (semantic mapping)
          const inCluesAvailable = scene.cluesAvailable?.includes(clue.id);
          // Fallback: match by discoveryLocation containing scene name
          const matchesLocation = clue.discoveryLocation?.toLowerCase().includes(scene.name.toLowerCase());
          return inCluesAvailable || matchesLocation;
        }).map(clue => ({
          title: clue.title,
          visualCue: clue.visualCue,
          type: clue.type,
          positionX: clue.positionX,
          positionY: clue.positionY,
        }));

        // Build scene object with sceneType for enhanced prompts
        const sceneForPrompt = {
          description: scene.description,
          locationType: scene.locationType,
          id: scene.id,
          sceneType: scene.locationType?.includes('security') ? 'security' :
                     scene.name.toLowerCase().includes('work') ? 'work_area' :
                     scene.name.toLowerCase().includes('investigation') ? 'investigation' :
                     scene.name.toLowerCase().includes('resolution') ? 'resolution' : 'primary',
        };

        // Scene images - Realistic Vision V6.0 settings
        // Square resolution (1024x1024) for mobile-friendly display across all platforms
        // Square format works well on mobile portrait, mobile landscape, and desktop
        const sceneResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `scene-${scene.id}`,
              type: 'scene',
              prompt: buildScenePrompt(sceneForPrompt, sceneClues),
              negativePrompt: `worst quality, low quality, blurry, text, watermark, people, human figure, deformed, disfigured, ${ratingNegatives}`,
              width: 1024, height: 1024,
              settings: { model: 'realisticVisionV60B1', sampler: 'DPM++ 2M Karras', steps: 30, cfgScale: 7 },
              metadata: { sceneId: scene.id, name: scene.name, sceneType: sceneForPrompt.sceneType, embeddedClues: sceneClues.length },
            },
            saveToPublic: false,
          }),
        });
        const sceneData = await sceneResponse.json();
        if (sceneResponse.ok && sceneData.success && sceneData.imageUrl) {
          newImages.scenes[scene.id] = sceneData.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 3. Generate suspect portraits
      for (const suspect of (caseData.suspects || [])) {
        setImageGenProgress({ current: `Suspect: ${suspect.name}`, completed, total: totalImages });
        const { prompt, negativePrompt, metadata } = buildSuspectPrompt(suspect);

        try {
          // Suspect portraits - Realistic Vision V6.0 settings (higher steps for faces)
          const suspectResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageRequest: {
                id: `suspect-${suspect.id}`,
                type: 'suspect',
                prompt,
                negativePrompt: `${negativePrompt}, ${ratingNegatives}`,
                width: 512, height: 512,
                settings: { model: 'realisticVisionV60B1', sampler: 'DPM++ 2M Karras', steps: 30, cfgScale: 7 },
                metadata: { suspectId: suspect.id, name: suspect.name, ...metadata },
              },
              saveToPublic: false,
            }),
          });

          if (suspectResponse.ok) {
            const suspectData = await suspectResponse.json();
            if (suspectData.success && suspectData.imageUrl) {
              newImages.suspects[suspect.id] = suspectData.imageUrl;
            }
          }
        } catch (err) {
          console.error(`Failed to generate image for ${suspect.name}:`, err);
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 4. Generate clue images
      for (const clue of cluesWithImages) {
        setImageGenProgress({ current: `Evidence: ${clue.title}`, completed, total: totalImages });
        // Evidence/clue images - Realistic Vision V6.0 settings
        // buildCluePrompt now returns { prompt, negativePrompt } for better accuracy
        const cluePromptData = buildCluePrompt(clue);
        const clueResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `clue-${clue.id}`,
              type: 'evidence',
              prompt: cluePromptData.prompt,
              negativePrompt: `${cluePromptData.negativePrompt}, ${ratingNegatives}`,
              width: 512, height: 512,
              settings: { model: 'realisticVisionV60B1', sampler: 'DPM++ 2M Karras', steps: 25, cfgScale: 7 },
              metadata: { clueId: clue.id, title: clue.title },
            },
            saveToPublic: false,
          }),
        });
        if (clueResponse.ok) {
          const data = await clueResponse.json();
          if (data.success && data.imageUrl) {
            newImages.clues[clue.id] = data.imageUrl;
          }
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      setImageGenProgress(null);
    } catch (err) {
      setImageGenError(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setIsGeneratingImages(false);
      setImageGenProgress(null);
    }
  }, []);

  return {
    isGeneratingImages,
    generatedImages,
    imageGenProgress,
    imageGenError,
    setImageGenError,
    resetImages,
    generateImagesForCase,
  };
}
