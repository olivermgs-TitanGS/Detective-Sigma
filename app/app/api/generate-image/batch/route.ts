/**
 * BATCH IMAGE GENERATION API ROUTE
 *
 * POST /api/generate-image/batch
 * - Generates all images for a case
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getImageGenerationService,
  saveImageToPublic,
} from '@/lib/services/image-generation-service';
import { CaseImageRequests } from '@/lib/case-generator/image-generator';

interface BatchRequestBody {
  caseId: string;
  imageRequests: CaseImageRequests;
  saveToPublic?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication (NextAuth v5)
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: BatchRequestBody = await request.json();

    // Validate request
    if (!body.caseId || !body.imageRequests) {
      return NextResponse.json(
        { error: 'Missing caseId or imageRequests in body' },
        { status: 400 }
      );
    }

    const { caseId, imageRequests, saveToPublic = true } = body;
    const service = getImageGenerationService();

    // Check if service is available
    const health = await service.checkHealth();
    if (!health.available) {
      return NextResponse.json(
        {
          error: 'Image generation service unavailable',
          details: health.error,
          suggestion: 'Make sure ComfyUI or Automatic1111 is running',
        },
        { status: 503 }
      );
    }

    // Track progress
    const progress = {
      cover: { done: false, url: '' },
      scenes: [] as string[],
      suspects: [] as string[],
      evidence: [] as string[],
    };

    // Generate all images
    const results = await service.generateCaseImages(
      imageRequests,
      (type, completed, total) => {
        console.log(`[ImageGen] ${type}: ${completed}/${total}`);
      }
    );

    // Process and save results
    const baseFolder = `generated/cases/${caseId}`;

    // Save cover
    if (results.cover.success && results.cover.imageBase64) {
      if (saveToPublic) {
        progress.cover.url = await saveImageToPublic(
          results.cover.imageBase64,
          'cover.png',
          baseFolder
        );
      }
      progress.cover.done = true;
    }

    // Save scenes
    for (let i = 0; i < results.scenes.length; i++) {
      const scene = results.scenes[i];
      if (scene.success && scene.imageBase64) {
        if (saveToPublic) {
          const url = await saveImageToPublic(
            scene.imageBase64,
            `scene-${i + 1}.png`,
            `${baseFolder}/scenes`
          );
          progress.scenes.push(url);
        }
      }
    }

    // Save suspects
    for (let i = 0; i < results.suspects.length; i++) {
      const suspect = results.suspects[i];
      if (suspect.success && suspect.imageBase64) {
        if (saveToPublic) {
          const suspectId = imageRequests.suspects[i].metadata?.name || `suspect-${i + 1}`;
          const url = await saveImageToPublic(
            suspect.imageBase64,
            `${suspectId}.png`,
            `${baseFolder}/suspects`
          );
          progress.suspects.push(url);
        }
      }
    }

    // Save evidence
    for (let i = 0; i < results.evidence.length; i++) {
      const item = results.evidence[i];
      if (item.success && item.imageBase64) {
        if (saveToPublic) {
          const url = await saveImageToPublic(
            item.imageBase64,
            `evidence-${i + 1}.png`,
            `${baseFolder}/evidence`
          );
          progress.evidence.push(url);
        }
      }
    }

    // Calculate summary
    const totalImages = 1 + imageRequests.scenes.length +
      imageRequests.suspects.length + imageRequests.evidence.length;
    const successfulImages = (results.cover.success ? 1 : 0) +
      results.scenes.filter(r => r.success).length +
      results.suspects.filter(r => r.success).length +
      results.evidence.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      caseId,
      summary: {
        total: totalImages,
        successful: successfulImages,
        failed: totalImages - successfulImages,
      },
      images: {
        cover: progress.cover.url || null,
        scenes: progress.scenes,
        suspects: progress.suspects,
        evidence: progress.evidence,
      },
      // Include detailed results for debugging
      details: {
        cover: {
          success: results.cover.success,
          error: results.cover.error,
          time: results.cover.generationTime,
        },
        scenes: results.scenes.map(r => ({
          success: r.success,
          error: r.error,
          time: r.generationTime,
        })),
        suspects: results.suspects.map(r => ({
          success: r.success,
          error: r.error,
          time: r.generationTime,
        })),
        evidence: results.evidence.map(r => ({
          success: r.success,
          error: r.error,
          time: r.generationTime,
        })),
      },
    });
  } catch (error) {
    console.error('Batch image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
