/**
 * CONTENT RATING API
 *
 * GET /api/admin/content-rating - Get current content rating
 * POST /api/admin/content-rating - Set content rating
 *
 * Singapore IMDA Video Game Classification compliant
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  setContentRating,
  getContentRating,
} from '@/lib/services/image-generation-service';
import {
  RATING_CONFIGS,
  RATING_ORDER,
  validateSingaporeCompliance,
  getContentRules,
} from '@/lib/content-rating/singapore-imda-rating';

type ContentRating = 'GENERAL' | 'PG13' | 'ADV16' | 'M18';

/**
 * GET - Get current content rating
 */
export async function GET() {
  try {
    const currentRating = getContentRating();
    const config = RATING_CONFIGS[currentRating];
    const compliance = validateSingaporeCompliance(currentRating);
    const rules = getContentRules(currentRating);

    return NextResponse.json({
      rating: currentRating,
      label: config.label,
      description: config.description,
      minAge: config.minAge,
      isRestricted: config.isRestricted,
      consumerAdvice: config.consumerAdvice,
      compliance,
      rules: {
        violence: rules.violence,
        themes: rules.themes,
        language: rules.language,
        substances: rules.substances,
        imageGeneration: rules.imageGeneration,
      },
      availableRatings: RATING_ORDER.map((r) => ({
        rating: r,
        label: RATING_CONFIGS[r].label,
        description: RATING_CONFIGS[r].description,
        minAge: RATING_CONFIGS[r].minAge,
        isRestricted: RATING_CONFIGS[r].isRestricted,
      })),
    });
  } catch (error) {
    console.error('Error getting content rating:', error);
    return NextResponse.json(
      { error: 'Failed to get content rating' },
      { status: 500 }
    );
  }
}

/**
 * POST - Set content rating
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating } = body;

    // Validate rating
    if (!rating || !RATING_ORDER.includes(rating as ContentRating)) {
      return NextResponse.json(
        {
          error: 'Invalid rating',
          validRatings: RATING_ORDER,
          message: `Rating must be one of: ${RATING_ORDER.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const newRating = rating as ContentRating;
    const config = RATING_CONFIGS[newRating];
    const compliance = validateSingaporeCompliance(newRating);

    // Log rating change for audit
    console.log(`[CONTENT RATING] Admin changed rating to: ${newRating}`);
    console.log(`[CONTENT RATING] Singapore compliance:`, compliance);

    // Set the rating
    setContentRating(newRating);

    return NextResponse.json({
      success: true,
      rating: newRating,
      label: config.label,
      description: config.description,
      minAge: config.minAge,
      isRestricted: config.isRestricted,
      consumerAdvice: config.consumerAdvice,
      compliance,
      message: `Content rating set to ${newRating}. ${
        config.isRestricted
          ? 'WARNING: This is a restricted rating under Singapore IMDA regulations.'
          : ''
      }`,
    });
  } catch (error) {
    console.error('Error setting content rating:', error);
    return NextResponse.json(
      { error: 'Failed to set content rating' },
      { status: 500 }
    );
  }
}
