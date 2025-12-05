import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Chunked image upload endpoint
 *
 * Uploads a single image at a time to avoid Vercel's 4.5MB payload limit.
 * Call this endpoint multiple times with individual images after saving the case.
 */

interface ImageUploadRequest {
  caseId: string;
  entityType: 'case' | 'suspect' | 'scene' | 'clue';
  entityId: string;  // Database ID of the entity
  imageData: string; // Base64 encoded image data
}

export async function POST(request: Request) {
  try {
    const body: ImageUploadRequest = await request.json();

    if (!body.caseId || !body.entityType || !body.entityId || !body.imageData) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId, entityType, entityId, imageData' },
        { status: 400 }
      );
    }

    // Validate case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: body.caseId },
    });

    if (!caseExists) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Update the appropriate entity with the image
    switch (body.entityType) {
      case 'case':
        await prisma.case.update({
          where: { id: body.caseId },
          data: { coverImage: body.imageData },
        });
        break;

      case 'suspect':
        await prisma.suspect.update({
          where: { id: body.entityId },
          data: { imageUrl: body.imageData },
        });
        break;

      case 'scene':
        await prisma.scene.update({
          where: { id: body.entityId },
          data: { imageUrl: body.imageData },
        });
        break;

      case 'clue':
        await prisma.clue.update({
          where: { id: body.entityId },
          data: { imageUrl: body.imageData },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid entity type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Image uploaded for ${body.entityType} ${body.entityId}`,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Batch upload multiple images (for smaller batches that fit within limit)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.caseId || !body.images || !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId, images (array)' },
        { status: 400 }
      );
    }

    const results: { entityType: string; entityId: string; success: boolean; error?: string }[] = [];

    for (const img of body.images) {
      try {
        switch (img.entityType) {
          case 'case':
            await prisma.case.update({
              where: { id: body.caseId },
              data: { coverImage: img.imageData },
            });
            break;

          case 'suspect':
            await prisma.suspect.update({
              where: { id: img.entityId },
              data: { imageUrl: img.imageData },
            });
            break;

          case 'scene':
            await prisma.scene.update({
              where: { id: img.entityId },
              data: { imageUrl: img.imageData },
            });
            break;

          case 'clue':
            await prisma.clue.update({
              where: { id: img.entityId },
              data: { imageUrl: img.imageData },
            });
            break;
        }
        results.push({ entityType: img.entityType, entityId: img.entityId, success: true });
      } catch (err) {
        results.push({
          entityType: img.entityType,
          entityId: img.entityId,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: results.every(r => r.success),
      results,
    });
  } catch (error) {
    console.error('Error batch uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to batch upload images', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
