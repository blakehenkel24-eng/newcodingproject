/**
 * Flux 2.0 Image Generator
 * Robust image generation with retries and comprehensive error handling
 */

import { FluxImagePrompt, FluxGenerationResult, FluxProviderConfig } from './types';
import { ArchetypeId } from '@/types/slide';
import { getFluxConfig, getProviderParams, validateFluxConfig } from './config';

// Custom error class for Flux generation errors
class FluxGenerationError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'FluxGenerationError';
  }
}

/**
 * Generate image with automatic retries
 */
export async function generateFluxImage(
  prompt: FluxImagePrompt,
  archetypeId: ArchetypeId,
  config?: Partial<FluxProviderConfig>
): Promise<FluxGenerationResult> {
  const fullConfig = { ...getFluxConfig(), ...config };
  const params = getProviderParams(fullConfig.provider);
  
  // Validate config
  const validation = validateFluxConfig(fullConfig);
  if (!validation.valid) {
    throw new FluxGenerationError(
      `Invalid configuration: ${validation.errors.join(', ')}`,
      fullConfig.provider,
      'CONFIG_INVALID',
      false
    );
  }
  
  let lastError: Error | null = null;
  
  // Retry loop
  for (let attempt = 1; attempt <= params.maxRetries; attempt++) {
    try {
      console.log(`[Flux] Generation attempt ${attempt}/${params.maxRetries} using ${fullConfig.provider}`);
      
      const startTime = Date.now();
      const result = await generateWithProvider(prompt, fullConfig);
      const generationTimeMs = Date.now() - startTime;
      
      console.log(`[Flux] Success! Generated in ${generationTimeMs}ms`);
      
      return {
        slideId: generateSlideId(),
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        prompt,
        archetypeId,
        generationTimeMs,
        modelUsed: result.modelUsed,
        seed: result.seed,
      };
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if error is retryable
      const isRetryable = isRetryableError(error, fullConfig.provider);
      
      if (!isRetryable || attempt === params.maxRetries) {
        break;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`[Flux] Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await sleep(delayMs);
    }
  }
  
  // All retries failed
  const errorMessage = lastError?.message || 'Unknown error';
  throw new FluxGenerationError(
    `Failed after ${params.maxRetries} attempts: ${errorMessage}`,
    fullConfig.provider,
    'GENERATION_FAILED',
    false
  );
}

/**
 * Generate with specific provider
 */
async function generateWithProvider(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<{ imageUrl: string; imageBase64?: string; modelUsed: string; seed?: number }> {
  switch (config.provider) {
    case 'replicate':
      return generateWithReplicate(prompt, config);
    case 'fal':
      return generateWithFal(prompt, config);
    case 'together':
      return generateWithTogether(prompt, config);
    case 'bfl':
      return generateWithBFL(prompt, config);
    default:
      throw new FluxGenerationError(
        `Unknown provider: ${config.provider}`,
        config.provider,
        'UNKNOWN_PROVIDER',
        false
      );
  }
}

/**
 * Generate using Replicate
 */
async function generateWithReplicate(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<{ imageUrl: string; modelUsed: string }> {
  const params = getProviderParams('replicate');
  
  // Create prediction
  const response = await fetchWithTimeout(
    'https://api.replicate.com/v1/predictions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Token ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait', // Synchronous if possible
      },
      body: JSON.stringify({
        version: config.model,
        input: {
          prompt: prompt.prompt,
          negative_prompt: prompt.negativePrompt,
          aspect_ratio: prompt.aspectRatio,
          guidance_scale: prompt.guidanceScale,
          num_inference_steps: prompt.numInferenceSteps,
          output_format: 'png',
          output_quality: 100,
        },
      }),
    },
    params.timeoutSeconds * 1000
  );

  if (!response.ok) {
    const errorData = await parseErrorResponse(response);
    throw new FluxGenerationError(
      `Replicate API error: ${errorData.message}`,
      'replicate',
      errorData.code,
      isRetryableStatus(response.status)
    );
  }

  const prediction = await response.json();
  
  // If already complete (synchronous mode)
  if (prediction.status === 'succeeded' && prediction.output) {
    return {
      imageUrl: Array.isArray(prediction.output) ? prediction.output[0] : prediction.output,
      modelUsed: `replicate:${config.model}`,
    };
  }
  
  // Poll for async completion
  const result = await pollReplicatePrediction(prediction.id, config.apiKey, params);
  
  return {
    imageUrl: Array.isArray(result.output) ? result.output[0] : result.output,
    modelUsed: `replicate:${config.model}`,
  };
}

/**
 * Poll Replicate prediction
 */
async function pollReplicatePrediction(
  predictionId: string,
  apiKey: string,
  params: ReturnType<typeof getProviderParams>
): Promise<any> {
  for (let i = 0; i < params.maxPollAttempts; i++) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${apiKey}` },
    });
    
    if (!response.ok) {
      throw new FluxGenerationError(
        'Failed to check prediction status',
        'replicate',
        'POLL_FAILED',
        true
      );
    }
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    }
    
    if (prediction.status === 'failed') {
      throw new FluxGenerationError(
        `Prediction failed: ${prediction.error || 'Unknown error'}`,
        'replicate',
        'PREDICTION_FAILED',
        false
      );
    }
    
    if (prediction.status === 'canceled') {
      throw new FluxGenerationError(
        'Prediction was canceled',
        'replicate',
        'PREDICTION_CANCELED',
        false
      );
    }
    
    await sleep(params.pollIntervalMs);
  }
  
  throw new FluxGenerationError(
    'Prediction timeout',
    'replicate',
    'TIMEOUT',
    true
  );
}

/**
 * Generate using fal.ai
 */
async function generateWithFal(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<{ imageUrl: string; imageBase64?: string; modelUsed: string; seed?: number }> {
  const params = getProviderParams('fal');
  
  const response = await fetchWithTimeout(
    'https://queue.fal.run/fal-ai/flux/schnell',
    {
      method: 'POST',
      headers: {
        'Authorization': `Key ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.prompt,
        image_size: prompt.aspectRatio === '16:9' ? 'landscape_16_9' : 'landscape_4_3',
        num_inference_steps: prompt.numInferenceSteps,
        seed: Math.floor(Math.random() * 1000000),
        enable_safety_checker: false,
        sync_mode: true, // Synchronous mode
      }),
    },
    params.timeoutSeconds * 1000
  );

  if (!response.ok) {
    const errorData = await parseErrorResponse(response);
    throw new FluxGenerationError(
      `fal.ai API error: ${errorData.message}`,
      'fal',
      errorData.code,
      isRetryableStatus(response.status)
    );
  }

  const result = await response.json();
  
  return {
    imageUrl: result.images?.[0]?.url,
    imageBase64: result.images?.[0]?.content,
    modelUsed: `fal:${config.model || 'flux-schnell'}`,
    seed: result.seed,
  };
}

/**
 * Generate using Together AI
 */
async function generateWithTogether(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<{ imageUrl: string; imageBase64?: string; modelUsed: string }> {
  const params = getProviderParams('together');
  
  const response = await fetchWithTimeout(
    'https://api.together.xyz/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt.prompt,
        width: prompt.aspectRatio === '16:9' ? 1344 : 1024,
        height: prompt.aspectRatio === '16:9' ? 768 : 768,
        steps: prompt.numInferenceSteps,
        guidance: prompt.guidanceScale,
        seed: Math.floor(Math.random() * 1000000),
        response_format: 'url', // Can also be 'b64_json'
      }),
    },
    params.timeoutSeconds * 1000
  );

  if (!response.ok) {
    const errorData = await parseErrorResponse(response);
    throw new FluxGenerationError(
      `Together AI error: ${errorData.message}`,
      'together',
      errorData.code,
      isRetryableStatus(response.status)
    );
  }

  const result = await response.json();
  
  return {
    imageUrl: result.data?.[0]?.url,
    imageBase64: result.data?.[0]?.b64_json,
    modelUsed: `together:${config.model}`,
  };
}

/**
 * Generate using BFL
 */
async function generateWithBFL(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<{ imageUrl: string; modelUsed: string }> {
  const params = getProviderParams('bfl');
  
  const endpoint = config.model?.includes('pro')
    ? 'https://api.bfl.ml/v1/flux-pro-1.1'
    : 'https://api.bfl.ml/v1/flux-dev';
  
  // Submit request
  const submitResponse = await fetchWithTimeout(
    endpoint,
    {
      method: 'POST',
      headers: {
        'X-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.prompt,
        width: prompt.aspectRatio === '16:9' ? 1344 : 1024,
        height: prompt.aspectRatio === '16:9' ? 768 : 768,
        steps: prompt.numInferenceSteps,
        guidance: prompt.guidanceScale,
        safety_tolerance: 2,
        prompt_upsampling: false,
      }),
    },
    params.timeoutSeconds * 1000
  );

  if (!submitResponse.ok) {
    const errorData = await parseErrorResponse(submitResponse);
    throw new FluxGenerationError(
      `BFL API error: ${errorData.message}`,
      'bfl',
      errorData.code,
      isRetryableStatus(submitResponse.status)
    );
  }

  const { id } = await submitResponse.json();
  
  // Poll for result
  const result = await pollBFLResult(id, config.apiKey, params);
  
  return {
    imageUrl: result.sample,
    modelUsed: `bfl:${config.model || 'flux-dev'}`,
  };
}

/**
 * Poll BFL for result
 */
async function pollBFLResult(
  requestId: string,
  apiKey: string,
  params: ReturnType<typeof getProviderParams>
): Promise<any> {
  for (let i = 0; i < params.maxPollAttempts; i++) {
    const response = await fetch(`https://api.bfl.ml/v1/get_result?id=${requestId}`, {
      headers: { 'X-Key': apiKey },
    });
    
    if (!response.ok) {
      throw new FluxGenerationError(
        'Failed to check BFL status',
        'bfl',
        'POLL_FAILED',
        true
      );
    }
    
    const result = await response.json();
    
    if (result.status === 'Ready') {
      return result.result;
    }
    
    if (result.status === 'Failed') {
      throw new FluxGenerationError(
        'BFL generation failed',
        'bfl',
        'GENERATION_FAILED',
        false
      );
    }
    
    if (result.status === 'Error') {
      throw new FluxGenerationError(
        `BFL error: ${result.message || 'Unknown'}`,
        'bfl',
        'API_ERROR',
        false
      );
    }
    
    await sleep(params.pollIntervalMs);
  }
  
  throw new FluxGenerationError(
    'BFL generation timeout',
    'bfl',
    'TIMEOUT',
    true
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate unique slide ID
 */
function generateSlideId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return `flux_${timestamp}_${random}`;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FluxGenerationError(
        'Request timeout',
        'unknown',
        'TIMEOUT',
        true
      );
    }
    throw error;
  }
}

/**
 * Parse error response
 */
async function parseErrorResponse(response: Response): Promise<{ message: string; code?: string }> {
  try {
    const data = await response.json();
    return {
      message: data.error || data.message || data.detail || `HTTP ${response.status}`,
      code: data.code || `HTTP_${response.status}`,
    };
  } catch {
    return {
      message: `HTTP ${response.status}: ${response.statusText}`,
      code: `HTTP_${response.status}`,
    };
  }
}

/**
 * Check if HTTP status is retryable
 */
function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown, provider: string): boolean {
  if (error instanceof FluxGenerationError) {
    return error.retryable;
  }
  
  // Network errors are retryable
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('network') || 
        message.includes('fetch') || 
        message.includes('timeout') ||
        message.includes('econnrefused')) {
      return true;
    }
  }
  
  return false;
}

// ============================================================================
// Exports
// ============================================================================

export { validateFluxConfig, isFluxConfigured, getFluxModels, getFluxConfig } from './config';
export { FluxGenerationError };
export type { FluxProviderConfig, FluxImagePrompt, FluxGenerationResult } from './types';
