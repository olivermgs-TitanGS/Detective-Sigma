/**
 * Image generation hook for case generator
 */

import { useState, useCallback } from 'react';
import type { GeneratedCase, GeneratedImages, ImageGenProgress } from '../utils/types';
import { buildSuspectPrompt, buildCoverPrompt, buildScenePrompt, buildCluePrompt } from '../utils/promptBuilder';

export function useImageGeneration() {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ suspects: {}, scenes: {}, clues: {} });
  const [imageGenProgress, setImageGenProgress] = useState<ImageGenProgress | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const resetImages = useCallback(() => {
    setGeneratedImages({ suspects: {}, scenes: {}, clues: {} });
    setImageGenError(null);
  }, []);

  const generateImagesForCase = useCallback(async (caseData: GeneratedCase, subject: string) => {
    setIsGeneratingImages(true);
    setImageGenError(null);

    const newImages: GeneratedImages = { suspects: {}, scenes: {}, clues: {} };
    const cluesWithImages = (caseData.clues || []).filter(c => c.type !== 'testimony');
    const totalImages = 1 + (caseData.suspects?.length || 0) + (caseData.scenes?.length || 0) + cluesWithImages.length;

    try {
      let completed = 0;

      // 1. Generate cover image
      setImageGenProgress({ current: 'Case Cover', completed, total: totalImages });
      const coverResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageRequest: {
            id: `cover-${caseData.caseId}`,
            type: 'cover',
            prompt: buildCoverPrompt(caseData, subject),
            negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human',
            width: 512, height: 512,
            settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
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

      // 2. Generate scene images
      for (const scene of (caseData.scenes || [])) {
        setImageGenProgress({ current: `Scene: ${scene.name}`, completed, total: totalImages });
        const sceneResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `scene-${scene.id}`,
              type: 'scene',
              prompt: buildScenePrompt(scene),
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human figure',
              width: 768, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { sceneId: scene.id, name: scene.name },
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
          const suspectResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageRequest: {
                id: `suspect-${suspect.id}`,
                type: 'suspect',
                prompt,
                negativePrompt,
                width: 512, height: 512,
                settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 30, cfgScale: 6 },
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
        const clueResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `clue-${clue.id}`,
              type: 'evidence',
              prompt: buildCluePrompt(clue),
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human hands',
              width: 512, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
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
