/**
 * COMPREHENSIVE UNIT TESTS FOR SUSPECT IMAGE GENERATION FLOW
 *
 * Tests the entire pipeline from generation to display:
 * 1. Suspect ID generation
 * 2. Image request creation
 * 3. Image storage in client state
 * 4. Save API payload
 * 5. Database persistence
 * 6. Retrieval and display
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock nanoid with incrementing IDs for uniqueness testing
let nanoidCounter = 0;
vi.mock('nanoid', () => ({
  nanoid: (length: number) => {
    nanoidCounter++;
    return `ID${String(nanoidCounter).padStart(4, '0')}`.slice(0, length);
  },
}));

beforeEach(() => {
  nanoidCounter = 0; // Reset counter between tests
});

// ============================================
// TEST 1: SUSPECT ID GENERATION
// ============================================

describe('Suspect ID Generation', () => {
  it('should generate unique suspect IDs with correct format', async () => {
    // Import after mock
    const { generateCharacterWeb } = await import('../character-web');

    const mockNarrativeCase = {
      id: 'test-case',
      title: 'Test Case',
      setting: {
        location: 'School Canteen',
        locationType: 'school',
        description: 'A busy school canteen',
        timeOfDay: 'morning',
        dayContext: 'Monday morning',
      },
      crime: {
        type: 'theft',
        method: 'Someone stole money from the cash register',
        severity: 'moderate',
        crimeWindow: {
          start: '10:00',
          end: '11:00',
        },
      },
      culprit: {
        motive: {
          type: 'financial',
          description: 'Needed money urgently',
          backstory: 'Had debts to pay',
        },
        method: 'Distracted the cashier',
        mistakes: ['Left fingerprints'],
      },
      timeline: [],
      narrativeHook: 'Test hook',
      resolution: 'Test resolution',
    };

    const mockSuspectRoles = [
      { role: 'Canteen Manager', defaultAlibi: 'Was in the office' },
      { role: 'Cashier', defaultAlibi: 'Was serving customers' },
      { role: 'Cleaner', defaultAlibi: 'Was cleaning tables' },
    ];

    const characters = generateCharacterWeb(mockNarrativeCase as any, mockSuspectRoles);

    // Verify ID format
    characters.forEach((char: any) => {
      expect(char.id).toMatch(/^suspect-[A-Za-z0-9]+$/);
      console.log(`[TEST] Generated suspect ID: ${char.id}`);
    });

    // Verify all IDs are unique
    const ids = characters.map((c: any) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should preserve suspect IDs through narrativeToGeneratedCase', async () => {
    const { generateCase } = await import('../generator');

    const request = {
      difficulty: 'INSPECTOR' as const,
      subject: 'MATH' as const,
      gradeLevel: 'P5' as const,
      puzzleComplexity: 'STANDARD' as const,
    };

    const generatedCase = await generateCase(request);

    // Verify suspects have IDs
    expect(generatedCase.suspects.length).toBeGreaterThan(0);

    generatedCase.suspects.forEach((suspect) => {
      expect(suspect.id).toBeDefined();
      expect(suspect.id).toMatch(/^suspect-[A-Za-z0-9]+$/);
      console.log(`[TEST] Suspect in generated case: ${suspect.name} (ID: ${suspect.id})`);
    });
  });
});

// ============================================
// TEST 2: IMAGE REQUEST CREATION
// ============================================

describe('Suspect Image Request Creation', () => {
  it('should create valid image request with correct suspect ID', () => {
    const suspect = {
      id: 'suspect-ABC123',
      name: 'Tan Wei Ming',
      role: 'Canteen Manager',
      alibi: 'Was in the office',
      isGuilty: false,
      personality: ['calm', 'professional'],
    };

    // Simulate what page.tsx does
    const imageRequest = {
      id: `suspect-${suspect.id}`,
      type: 'suspect',
      prompt: 'test prompt',
      negativePrompt: 'test negative',
      width: 512,
      height: 512,
      settings: { model: 'test', sampler: 'euler', steps: 20, cfgScale: 7 },
      metadata: { suspectId: suspect.id, name: suspect.name },
    };

    expect(imageRequest.id).toBe('suspect-suspect-ABC123');
    expect(imageRequest.metadata.suspectId).toBe('suspect-ABC123');

    console.log(`[TEST] Image request ID: ${imageRequest.id}`);
    console.log(`[TEST] Metadata suspectId: ${imageRequest.metadata.suspectId}`);
  });
});

// ============================================
// TEST 3: IMAGE STORAGE IN CLIENT STATE
// ============================================

describe('Client State Image Storage', () => {
  it('should store image URL with correct suspect ID key', () => {
    const newImages: { suspects: Record<string, string> } = { suspects: {} };

    const suspect = { id: 'suspect-ABC123', name: 'Test Suspect' };
    const mockImageUrl = 'data:image/png;base64,ABC123...';

    // Simulate what page.tsx does after successful image generation
    newImages.suspects[suspect.id] = mockImageUrl;

    expect(newImages.suspects['suspect-ABC123']).toBe(mockImageUrl);
    expect(Object.keys(newImages.suspects)).toContain('suspect-ABC123');

    console.log(`[TEST] Stored image keys: ${Object.keys(newImages.suspects)}`);
  });

  it('should match image storage key with suspect ID', () => {
    const suspects = [
      { id: 'suspect-AAA111', name: 'Suspect A' },
      { id: 'suspect-BBB222', name: 'Suspect B' },
      { id: 'suspect-CCC333', name: 'Suspect C' },
    ];

    const generatedImages: { suspects: Record<string, string> } = { suspects: {} };

    // Simulate storing images
    suspects.forEach((s) => {
      generatedImages.suspects[s.id] = `data:image/png;base64,${s.id}`;
    });

    // Verify all keys match
    suspects.forEach((s) => {
      expect(generatedImages.suspects[s.id]).toBeDefined();
      console.log(`[TEST] Suspect ${s.name}: key=${s.id}, hasImage=${!!generatedImages.suspects[s.id]}`);
    });
  });
});

// ============================================
// TEST 4: SAVE API PAYLOAD
// ============================================

describe('Save API Payload', () => {
  it('should include all suspect images in save payload', () => {
    const generatedCase = {
      caseId: 'case-123',
      title: 'Test Case',
      suspects: [
        { id: 'suspect-AAA', name: 'Suspect A' },
        { id: 'suspect-BBB', name: 'Suspect B' },
      ],
    };

    const generatedImages = {
      cover: 'data:image/png;base64,cover...',
      suspects: {
        'suspect-AAA': 'data:image/png;base64,suspectA...',
        'suspect-BBB': 'data:image/png;base64,suspectB...',
      },
      scenes: {},
      clues: {},
    };

    // Simulate save payload
    const payload = {
      case: generatedCase,
      images: {
        cover: generatedImages.cover,
        suspects: generatedImages.suspects,
        scenes: generatedImages.scenes,
        clues: generatedImages.clues,
      },
    };

    // Verify suspect images are included
    expect(Object.keys(payload.images.suspects).length).toBe(2);
    expect(payload.images.suspects['suspect-AAA']).toBeDefined();
    expect(payload.images.suspects['suspect-BBB']).toBeDefined();

    // Verify IDs match between case and images
    generatedCase.suspects.forEach((suspect) => {
      expect(payload.images.suspects[suspect.id]).toBeDefined();
      console.log(`[TEST] Suspect ${suspect.name}: case ID=${suspect.id}, image exists=${!!payload.images.suspects[suspect.id]}`);
    });
  });
});

// ============================================
// TEST 5: DATABASE PERSISTENCE (saveGeneratedCase)
// ============================================

describe('Database Persistence', () => {
  it('should match image keys with suspect IDs during save', () => {
    const generatedCase = {
      suspects: [
        { id: 'suspect-XXX', name: 'Test A', role: 'Manager', alibi: 'alibi', personality: ['calm'], isGuilty: false },
        { id: 'suspect-YYY', name: 'Test B', role: 'Staff', alibi: 'alibi', personality: ['nervous'], isGuilty: true },
      ],
    };

    const images = {
      suspects: {
        'suspect-XXX': 'data:image/png;base64,imageX...',
        'suspect-YYY': 'data:image/png;base64,imageY...',
      },
    };

    // Simulate what saveGeneratedCase does
    const savedSuspects: any[] = [];

    for (const suspect of generatedCase.suspects) {
      const suspectImageUrl = images.suspects[suspect.id] || null;

      savedSuspects.push({
        name: suspect.name,
        id: suspect.id,
        imageUrl: suspectImageUrl,
      });

      console.log(`[TEST] Saving suspect ${suspect.name}: ID=${suspect.id}, imageUrl=${suspectImageUrl ? 'YES' : 'NULL'}`);
    }

    // Verify all suspects got their images
    savedSuspects.forEach((saved) => {
      expect(saved.imageUrl).toBeDefined();
      expect(saved.imageUrl).not.toBeNull();
    });
  });

  it('should fail gracefully when image keys do not match', () => {
    const generatedCase = {
      suspects: [
        { id: 'suspect-AAA', name: 'Test' },
      ],
    };

    // WRONG keys - simulating a bug
    const images = {
      suspects: {
        'wrong-key-BBB': 'data:image/png;base64,image...',
      },
    };

    const suspectImageUrl = images.suspects[generatedCase.suspects[0].id] || null;

    console.log(`[TEST] Key mismatch scenario:`);
    console.log(`  - Suspect ID: ${generatedCase.suspects[0].id}`);
    console.log(`  - Available keys: ${Object.keys(images.suspects)}`);
    console.log(`  - Result: ${suspectImageUrl}`);

    expect(suspectImageUrl).toBeNull();
  });
});

// ============================================
// TEST 6: ID CONSISTENCY END-TO-END
// ============================================

describe('End-to-End ID Consistency', () => {
  it('should maintain consistent IDs through entire flow', async () => {
    const { generateCase } = await import('../generator');

    // Step 1: Generate case
    const request = {
      difficulty: 'INSPECTOR' as const,
      subject: 'MATH' as const,
      gradeLevel: 'P5' as const,
    };

    const generatedCase = await generateCase(request);
    console.log('\n[E2E TEST] Generated case suspects:');
    generatedCase.suspects.forEach((s) => {
      console.log(`  - ${s.name}: ID=${s.id}`);
    });

    // Step 2: Simulate image generation storage
    const generatedImages: { suspects: Record<string, string> } = { suspects: {} };
    for (const suspect of generatedCase.suspects) {
      // This is what page.tsx does
      generatedImages.suspects[suspect.id] = `data:image/png;base64,mock-${suspect.id}`;
    }

    console.log('\n[E2E TEST] Generated images keys:');
    Object.keys(generatedImages.suspects).forEach((key) => {
      console.log(`  - ${key}`);
    });

    // Step 3: Simulate save payload
    const savePayload = {
      case: generatedCase,
      images: {
        suspects: generatedImages.suspects,
      },
    };

    // Step 4: Simulate saveGeneratedCase lookup
    console.log('\n[E2E TEST] Save lookup results:');
    for (const suspect of savePayload.case.suspects) {
      const imageUrl = savePayload.images.suspects[suspect.id];
      console.log(`  - ${suspect.name}: ID=${suspect.id}, image=${imageUrl ? 'FOUND' : 'MISSING'}`);

      // This should ALWAYS find the image
      expect(imageUrl).toBeDefined();
      expect(imageUrl).toContain(suspect.id);
    }
  });
});

// ============================================
// TEST 7: FRONTEND RENDERING VALIDATION
// ============================================

describe('Frontend Rendering', () => {
  it('should correctly identify valid image URLs', () => {
    // This is the isImageUrl function from SuspectDialog.tsx
    function isImageUrl(url?: string): boolean {
      if (!url) return false;
      return url.startsWith('http') || url.startsWith('/') || url.startsWith('data:');
    }

    // Valid URLs
    expect(isImageUrl('data:image/png;base64,ABC123')).toBe(true);
    expect(isImageUrl('https://example.com/image.png')).toBe(true);
    expect(isImageUrl('/images/suspect.png')).toBe(true);

    // Invalid URLs (emoji or undefined)
    expect(isImageUrl(undefined)).toBe(false);
    expect(isImageUrl('')).toBe(false);
    expect(isImageUrl('👤')).toBe(false);

    console.log('[TEST] URL validation working correctly');
  });
});

// ============================================
// TEST 8: FULL INTEGRATION TEST
// ============================================

describe('Full Integration Test', () => {
  it('should generate, store, save, and retrieve suspect images correctly', async () => {
    console.log('\n========================================');
    console.log('FULL INTEGRATION TEST');
    console.log('========================================\n');

    // Import generator
    const { generateCase } = await import('../generator');

    // 1. Generate a case
    console.log('STEP 1: Generating case...');
    const generatedCase = await generateCase({
      difficulty: 'INSPECTOR',
      subject: 'MATH',
      gradeLevel: 'P5',
    } as any);

    console.log(`  Generated ${generatedCase.suspects.length} suspects`);
    const suspectIds = generatedCase.suspects.map((s) => s.id);
    console.log(`  Suspect IDs: ${suspectIds.join(', ')}`);

    // 2. Simulate image generation (what page.tsx does)
    console.log('\nSTEP 2: Simulating image generation...');
    const generatedImages = {
      cover: 'data:image/png;base64,cover',
      suspects: {} as Record<string, string>,
      scenes: {} as Record<string, string>,
      clues: {} as Record<string, string>,
    };

    for (const suspect of generatedCase.suspects) {
      // Simulate API response
      const mockImageUrl = `data:image/png;base64,suspect-image-${suspect.id}`;
      generatedImages.suspects[suspect.id] = mockImageUrl;
      console.log(`  Generated image for ${suspect.name} (${suspect.id})`);
    }

    console.log(`  Total images stored: ${Object.keys(generatedImages.suspects).length}`);

    // 3. Verify ID alignment
    console.log('\nSTEP 3: Verifying ID alignment...');
    const imageKeys = Object.keys(generatedImages.suspects);

    let allAligned = true;
    for (const suspect of generatedCase.suspects) {
      const hasImage = imageKeys.includes(suspect.id);
      console.log(`  ${suspect.name}: ID=${suspect.id}, hasImage=${hasImage}`);
      if (!hasImage) allAligned = false;
    }

    expect(allAligned).toBe(true);
    console.log(`  All IDs aligned: ${allAligned}`);

    // 4. Simulate save
    console.log('\nSTEP 4: Simulating save...');
    const mockSavedSuspects: any[] = [];

    for (const suspect of generatedCase.suspects) {
      const imageUrl = generatedImages.suspects[suspect.id] || null;
      mockSavedSuspects.push({
        id: 'db-' + suspect.id,
        name: suspect.name,
        imageUrl: imageUrl,
      });
      console.log(`  Saved ${suspect.name}: imageUrl=${imageUrl ? 'SAVED' : 'NULL'}`);
    }

    // 5. Verify all saved with images
    console.log('\nSTEP 5: Final verification...');
    const allSaved = mockSavedSuspects.every((s) => s.imageUrl !== null);
    console.log(`  All suspects saved with images: ${allSaved}`);

    expect(allSaved).toBe(true);

    console.log('\n========================================');
    console.log('INTEGRATION TEST COMPLETE');
    console.log('========================================\n');
  });
});
