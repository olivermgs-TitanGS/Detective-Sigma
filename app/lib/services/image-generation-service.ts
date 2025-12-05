/**
 * IMAGE GENERATION SERVICE
 *
 * Connects to ComfyUI, Automatic1111 (Stable Diffusion WebUI), or Replicate (cloud)
 * to generate images from prompts created by the case generator.
 */

import {
  ImageGenerationRequest,
  toAutomatic1111Format,
  toComfyUIWorkflow,
  applyContentRatingFilter,
  performRealityCheck,
  ContentRating,
} from '../case-generator/image-generator';

// Global content rating - can be set via API or environment
let currentContentRating: ContentRating = (process.env.CONTENT_RATING as ContentRating) || 'GENERAL';

/**
 * Set the content rating for image generation
 * This affects what content is allowed/blocked
 */
export function setContentRating(rating: ContentRating): void {
  console.log(`[CONTENT RATING] Changed from ${currentContentRating} to ${rating}`);
  currentContentRating = rating;
}

/**
 * Get the current content rating
 */
export function getContentRating(): ContentRating {
  return currentContentRating;
}

// ============================================
// TYPES
// ============================================

export type ImageGenerationBackend = 'comfyui' | 'automatic1111' | 'huggingface';

export interface ImageGenerationConfig {
  backend: ImageGenerationBackend;
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface GeneratedImageResult {
  success: boolean;
  requestId: string;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  generationTime?: number;
}

export interface BatchGenerationResult {
  total: number;
  completed: number;
  failed: number;
  results: GeneratedImageResult[];
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

// Use COMFYUI_REMOTE_URL (Cloudflare Tunnel) if available, otherwise fall back to IMAGE_GEN_URL
// This allows Vercel to connect to your local ComfyUI via Cloudflare Tunnel (FREE)
const getComfyUIBaseUrl = (): string => {
  // Priority: Remote tunnel URL > Local URL > Default
  if (process.env.COMFYUI_REMOTE_URL) {
    return process.env.COMFYUI_REMOTE_URL;
  }
  return process.env.IMAGE_GEN_URL || 'http://localhost:8188';
};

const defaultConfig: ImageGenerationConfig = {
  backend: 'comfyui',
  baseUrl: getComfyUIBaseUrl(),
  timeout: 180000, // 3 minutes for remote connections
};

// ============================================
// AUTOMATIC1111 (Stable Diffusion WebUI) API
// ============================================

async function generateWithAutomatic1111(
  request: ImageGenerationRequest,
  config: ImageGenerationConfig
): Promise<GeneratedImageResult> {
  const startTime = Date.now();

  try {
    const payload = toAutomatic1111Format(request);

    const response = await fetch(`${config.baseUrl}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(config.timeout || 120000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`A1111 API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.images || result.images.length === 0) {
      throw new Error('No images returned from A1111');
    }

    return {
      success: true,
      requestId: request.id,
      imageBase64: result.images[0],
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      requestId: request.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime: Date.now() - startTime,
    };
  }
}

// ============================================
// COMFYUI API
// ============================================

// Get model name from environment or use default
const getModelCheckpoint = (): string => {
  return process.env.COMFYUI_MODEL_CHECKPOINT || 'realisticVisionV60B1_v51HyperVAE.safetensors';
};

// Check if using SDXL/Flux model (larger models need different handling)
const isLargeModel = (): boolean => {
  const checkpoint = getModelCheckpoint().toLowerCase();
  return checkpoint.includes('xl') || checkpoint.includes('flux') || checkpoint.includes('sdxl');
};

function buildComfyUIWorkflow(request: ImageGenerationRequest): object {
  const seed = request.settings.seed || Math.floor(Math.random() * 2147483647);
  const modelCheckpoint = getModelCheckpoint();
  const largeModel = isLargeModel();

  // RTX 3090 Ti (24GB VRAM) can handle higher resolutions
  // SD 1.5: up to 1024x1024, SDXL/Flux: native 1024x1024
  const maxDimension = largeModel ? 1024 : 1024; // Increased for 24GB VRAM
  let width = request.width;
  let height = request.height;

  // Scale down while maintaining aspect ratio if needed
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round((width * scale) / 8) * 8; // Must be divisible by 8
    height = Math.round((height * scale) / 8) * 8;
  }

  // Complete ComfyUI workflow for Realistic Vision V6.0 (SD 1.5)
  return {
    prompt: {
      "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
          "ckpt_name": modelCheckpoint
        }
      },
      "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {
          "text": request.prompt,
          "clip": ["4", 1]
        }
      },
      "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {
          "text": request.negativePrompt,
          "clip": ["4", 1]
        }
      },
      "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {
          "width": width,
          "height": height,
          "batch_size": 1
        }
      },
      "3": {
        "class_type": "KSampler",
        "inputs": {
          "seed": seed,
          "steps": request.settings.steps,
          "cfg": request.settings.cfgScale,
          "sampler_name": "dpmpp_2m",
          "scheduler": "karras",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        }
      },
      "8": {
        "class_type": "VAEDecode",
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        }
      },
      "9": {
        "class_type": "SaveImage",
        "inputs": {
          "filename_prefix": "detective_sigma",
          "images": ["8", 0]
        }
      }
    }
  };
}

async function generateWithComfyUI(
  request: ImageGenerationRequest,
  config: ImageGenerationConfig
): Promise<GeneratedImageResult> {
  const startTime = Date.now();

  try {
    const workflow = buildComfyUIWorkflow(request);

    // Queue the prompt
    const queueResponse = await fetch(`${config.baseUrl}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });

    if (!queueResponse.ok) {
      const errorText = await queueResponse.text();
      throw new Error(`ComfyUI queue error: ${queueResponse.status} - ${errorText}`);
    }

    const queueResult = await queueResponse.json();
    const promptId = queueResult.prompt_id;

    // Poll for completion
    const imageData = await pollComfyUICompletion(config.baseUrl, promptId, config.timeout || 120000);

    return {
      success: true,
      requestId: request.id,
      imageBase64: imageData,
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      requestId: request.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime: Date.now() - startTime,
    };
  }
}

async function pollComfyUICompletion(
  baseUrl: string,
  promptId: string,
  timeout: number
): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 1000; // 1 second

  while (Date.now() - startTime < timeout) {
    const historyResponse = await fetch(`${baseUrl}/history/${promptId}`);

    if (historyResponse.ok) {
      const history = await historyResponse.json();

      if (history[promptId] && history[promptId].outputs) {
        // Find the image output
        const outputs = history[promptId].outputs;
        for (const nodeId in outputs) {
          const nodeOutput = outputs[nodeId];
          if (nodeOutput.images && nodeOutput.images.length > 0) {
            const image = nodeOutput.images[0];
            // Fetch the actual image
            const imageResponse = await fetch(
              `${baseUrl}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`
            );
            if (imageResponse.ok) {
              const imageBlob = await imageResponse.blob();
              const arrayBuffer = await imageBlob.arrayBuffer();
              return Buffer.from(arrayBuffer).toString('base64');
            }
          }
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('ComfyUI generation timeout');
}

// ============================================
// HUGGING FACE INFERENCE API (FREE TIER)
// ============================================

async function generateWithHuggingFace(
  request: ImageGenerationRequest,
  config: ImageGenerationConfig
): Promise<GeneratedImageResult> {
  const startTime = Date.now();

  try {
    // Use Stable Diffusion XL model (free on HF)
    const modelId = 'stabilityai/stable-diffusion-xl-base-1.0';
    const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;

    // Simplify prompt for HF (remove Pony-specific tags)
    let cleanPrompt = request.prompt
      .replace(/score_\d+,?\s*/gi, '')
      .replace(/score_\d+_up,?\s*/gi, '')
      .trim();

    // Add quality keywords
    cleanPrompt = `high quality, detailed, ${cleanPrompt}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: cleanPrompt,
        parameters: {
          negative_prompt: request.negativePrompt?.replace(/score_\d+,?\s*/gi, '') || 'low quality, blurry',
          width: Math.min(request.width, 1024),
          height: Math.min(request.height, 1024),
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
        options: {
          wait_for_model: true,
        },
      }),
      signal: AbortSignal.timeout(config.timeout || 120000),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Handle model loading (HF returns 503 while loading)
      if (response.status === 503) {
        throw new Error('Model is loading, please try again in a few seconds');
      }

      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    // HF returns raw image bytes
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return {
      success: true,
      requestId: request.id,
      imageBase64: base64Image,
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      requestId: request.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime: Date.now() - startTime,
    };
  }
}

// ============================================
// MAIN SERVICE CLASS
// ============================================

export class ImageGenerationService {
  private config: ImageGenerationConfig;

  constructor(config?: Partial<ImageGenerationConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Check if the image generation backend is available
   */
  async checkHealth(): Promise<{ available: boolean; backend: string; error?: string }> {
    try {
      let endpoint: string;
      let headers: Record<string, string> = {};

      if (this.config.backend === 'comfyui') {
        endpoint = `${this.config.baseUrl}/system_stats`;
      } else if (this.config.backend === 'huggingface') {
        // Check HF API with a simple model info request
        endpoint = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
        if (this.config.apiKey) {
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
      } else {
        endpoint = `${this.config.baseUrl}/sdapi/v1/sd-models`;
      }

      const response = await fetch(endpoint, {
        headers,
        signal: AbortSignal.timeout(10000),
      });

      // For HF, 503 means model is loading (still available, just slow)
      const isAvailable = response.ok || (this.config.backend === 'huggingface' && response.status === 503);

      return {
        available: isAvailable,
        backend: this.config.backend,
      };
    } catch (error) {
      return {
        available: false,
        backend: this.config.backend,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Generate a single image from a request
   * Content filtering based on Singapore IMDA rating system
   *
   * @param request - Image generation request
   * @param ratingOverride - Optional rating override (uses global rating if not specified)
   */
  async generateImage(
    request: ImageGenerationRequest,
    ratingOverride?: ContentRating
  ): Promise<GeneratedImageResult> {
    const rating = ratingOverride || currentContentRating;

    // ========================================
    // SINGAPORE IMDA CONTENT RATING FILTER
    // ========================================
    // Content allowed/blocked based on admin-configured rating
    // GENERAL (default) -> PG13 -> ADV16 -> M18
    const ratingResult = applyContentRatingFilter(request, rating);

    if (!ratingResult.isAllowed) {
      console.error(`[CONTENT RATING: ${rating}] BLOCKED:`, ratingResult.violations);
      return {
        success: false,
        requestId: request.id,
        error: `Content Rating (${rating}) BLOCKED: ${ratingResult.warning}`,
        generationTime: 0,
      };
    }

    // Use the filtered request (with rating-appropriate negative prompt)
    const safeRequest = ratingResult.filteredRequest || request;

    // Log warnings
    if (ratingResult.warning) {
      console.warn(`[CONTENT RATING: ${rating}] Warning:`, ratingResult.warning);
    }

    // ========================================
    // REALITY CHECK (No Fantasy Content)
    // ========================================
    const realityResult = performRealityCheck(safeRequest);

    if (!realityResult.isValid) {
      const errors = realityResult.violations
        .filter(v => v.severity === 'error')
        .map(v => v.description)
        .join(', ');

      console.error('[REALITY CHECK] BLOCKED image generation:', realityResult.violations);
      return {
        success: false,
        requestId: request.id,
        error: `Reality Check BLOCKED: ${errors}`,
        generationTime: 0,
      };
    }

    // Use sanitized prompt if available
    const finalRequest = realityResult.sanitizedPrompt
      ? { ...safeRequest, prompt: realityResult.sanitizedPrompt }
      : safeRequest;

    // Log reality warnings (but allow generation)
    const warnings = realityResult.violations.filter(v => v.severity === 'warning');
    if (warnings.length > 0) {
      console.warn('[REALITY CHECK] Warnings:', warnings.map(w => w.description).join(', '));
    }

    // ========================================
    // GENERATE IMAGE
    // ========================================
    if (this.config.backend === 'comfyui') {
      return generateWithComfyUI(finalRequest, this.config);
    } else if (this.config.backend === 'huggingface') {
      return generateWithHuggingFace(finalRequest, this.config);
    } else {
      return generateWithAutomatic1111(finalRequest, this.config);
    }
  }

  /**
   * Generate multiple images with progress tracking
   */
  async generateBatch(
    requests: ImageGenerationRequest[],
    onProgress?: (completed: number, total: number, current: string) => void
  ): Promise<BatchGenerationResult> {
    const results: GeneratedImageResult[] = [];
    let completed = 0;
    let failed = 0;

    for (const request of requests) {
      onProgress?.(completed, requests.length, request.id);

      const result = await this.generateImage(request);
      results.push(result);

      if (result.success) {
        completed++;
      } else {
        failed++;
      }
    }

    return {
      total: requests.length,
      completed,
      failed,
      results,
    };
  }

  /**
   * Generate all images for a case
   */
  async generateCaseImages(
    imageRequests: {
      cover: ImageGenerationRequest;
      scenes: ImageGenerationRequest[];
      suspects: ImageGenerationRequest[];
      evidence: ImageGenerationRequest[];
    },
    onProgress?: (type: string, completed: number, total: number) => void
  ): Promise<{
    cover: GeneratedImageResult;
    scenes: GeneratedImageResult[];
    suspects: GeneratedImageResult[];
    evidence: GeneratedImageResult[];
  }> {
    // Generate cover
    onProgress?.('cover', 0, 1);
    const cover = await this.generateImage(imageRequests.cover);
    onProgress?.('cover', 1, 1);

    // Generate scenes
    const scenes: GeneratedImageResult[] = [];
    for (let i = 0; i < imageRequests.scenes.length; i++) {
      onProgress?.('scenes', i, imageRequests.scenes.length);
      scenes.push(await this.generateImage(imageRequests.scenes[i]));
    }
    onProgress?.('scenes', imageRequests.scenes.length, imageRequests.scenes.length);

    // Generate suspects
    const suspects: GeneratedImageResult[] = [];
    for (let i = 0; i < imageRequests.suspects.length; i++) {
      onProgress?.('suspects', i, imageRequests.suspects.length);
      suspects.push(await this.generateImage(imageRequests.suspects[i]));
    }
    onProgress?.('suspects', imageRequests.suspects.length, imageRequests.suspects.length);

    // Generate evidence
    const evidence: GeneratedImageResult[] = [];
    for (let i = 0; i < imageRequests.evidence.length; i++) {
      onProgress?.('evidence', i, imageRequests.evidence.length);
      evidence.push(await this.generateImage(imageRequests.evidence[i]));
    }
    onProgress?.('evidence', imageRequests.evidence.length, imageRequests.evidence.length);

    return { cover, scenes, suspects, evidence };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let serviceInstance: ImageGenerationService | null = null;

export function getImageGenerationService(): ImageGenerationService {
  if (!serviceInstance) {
    serviceInstance = new ImageGenerationService({
      backend: (process.env.IMAGE_GEN_BACKEND as ImageGenerationBackend) || 'comfyui',
      baseUrl: getComfyUIBaseUrl(),
      apiKey: process.env.IMAGE_GEN_API_KEY,
      timeout: parseInt(process.env.IMAGE_GEN_TIMEOUT || '180000'),
    });
  }
  return serviceInstance;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert base64 image to data URL for display
 */
export function base64ToDataUrl(base64: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Save base64 image to public folder (for Next.js)
 */
export async function saveImageToPublic(
  base64: string,
  filename: string,
  subfolder: string = 'generated'
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const publicDir = path.join(process.cwd(), 'public', subfolder);

  // Ensure directory exists
  await fs.mkdir(publicDir, { recursive: true });

  const filePath = path.join(publicDir, filename);
  const buffer = Buffer.from(base64, 'base64');

  await fs.writeFile(filePath, buffer);

  return `/${subfolder}/${filename}`;
}
