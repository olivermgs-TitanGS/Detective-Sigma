/**
 * IMAGE GENERATION API ROUTE
 *
 * POST /api/generate-image
 * - Generates a single image from a prompt
 *
 * POST /api/generate-image/batch
 * - Generates multiple images for a case
 *
 * GET /api/generate-image/health
 * - Check if image generation backend is available
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getImageGenerationService,
  base64ToDataUrl,
  saveImageToPublic,
} from '@/lib/services/image-generation-service';
import { ImageGenerationRequest } from '@/lib/case-generator/image-generator';

// ============================================
// HEALTH CHECK
// ============================================

export async function GET() {
  try {
    const service = getImageGenerationService();
    const health = await service.checkHealth();

    return NextResponse.json({
      status: health.available ? 'online' : 'offline',
      backend: health.backend,
      error: health.error,
      message: health.available
        ? `Image generation service (${health.backend}) is available`
        : `Image generation service is not available: ${health.error}`,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Failed to check service health' },
      { status: 500 }
    );
  }
}

// ============================================
// GENERATE SINGLE IMAGE
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body.imageRequest) {
      console.error('[API] Missing imageRequest in body');
      return NextResponse.json(
        { error: 'Missing imageRequest in body' },
        { status: 400 }
      );
    }

    const imageRequest = body.imageRequest as ImageGenerationRequest;
    const saveToPublic = body.saveToPublic ?? false;

    // DEBUG: Log request details
    console.log(`[API] Image request received:`, {
      id: imageRequest.id,
      type: imageRequest.type,
      promptLength: imageRequest.prompt?.length || 0,
      negativePromptLength: imageRequest.negativePrompt?.length || 0,
      width: imageRequest.width,
      height: imageRequest.height,
    });

    const service = getImageGenerationService();

    // Check if service is available
    const health = await service.checkHealth();
    if (!health.available) {
      const suggestion = health.backend === 'huggingface'
        ? 'Check your HUGGING_FACE_API_KEY (IMAGE_GEN_API_KEY) in environment variables'
        : 'Make sure ComfyUI or Automatic1111 is running locally';

      return NextResponse.json(
        {
          error: 'Image generation service unavailable',
          details: health.error,
          backend: health.backend,
          suggestion,
        },
        { status: 503 }
      );
    }

    // Generate the image
    console.log(`[API] Generating image for ${imageRequest.type}: ${imageRequest.id}`);
    const result = await service.generateImage(imageRequest);
    console.log(`[API] Generation result for ${imageRequest.id}:`, {
      success: result.success,
      error: result.error,
      hasImage: !!result.imageBase64,
      generationTime: result.generationTime,
    });

    if (!result.success) {
      console.error(`[API] Image generation FAILED for ${imageRequest.id}:`, result.error);
      return NextResponse.json(
        {
          error: 'Image generation failed',
          details: result.error,
          requestId: result.requestId,
        },
        { status: 500 }
      );
    }

    // Save to public folder if requested
    let publicUrl: string | undefined;
    if (saveToPublic && result.imageBase64) {
      const filename = `${imageRequest.type}-${imageRequest.id}.png`;
      publicUrl = await saveImageToPublic(
        result.imageBase64,
        filename,
        'generated/images'
      );
    }

    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      generationTime: result.generationTime,
      // Return either data URL or public URL
      imageUrl: publicUrl || (result.imageBase64 ? base64ToDataUrl(result.imageBase64) : undefined),
      publicPath: publicUrl,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
