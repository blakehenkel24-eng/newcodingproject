/**
 * Flux 2.0 Image Generator
 * Handles image generation via various Flux providers
 */

import { FluxImagePrompt, FluxGenerationResult, FluxProviderConfig } from './types';

// Default configuration (uses environment variables)
function getDefaultConfig(): FluxProviderConfig {
  const provider = (process.env.FLUX_PROVIDER as 'replicate' | 'fal' | 'together' | 'bfl') || 'replicate';
  
  return {
    provider,
    apiKey: process.env.FLUX_API_KEY || '',
    model: process.env.FLUX_MODEL || 'black-forest-labs/flux-schnell',
    baseUrl: process.env.FLUX_BASE_URL,
  };
}

/**
 * Generate image using Replicate
 */
async function generateWithReplicate(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<FluxGenerationResult> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${config.apiKey}`,
      'Content-Type': 'application/json',
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
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replicate API error: ${error}`);
  }

  const prediction = await response.json();
  
  // Poll for completion
  const result = await pollReplicatePrediction(prediction.id, config.apiKey);
  
  return {
    slideId: `flux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: result.output[0],
    prompt,
    archetypeId: 'executive_summary', // Will be set by caller
    generationTimeMs: Date.now() - prediction.created_at,
    modelUsed: `replicate:${config.model}`,
  };
}

/**
 * Poll Replicate prediction until complete
 */
async function pollReplicatePrediction(
  predictionId: string, 
  apiKey: string,
  maxAttempts = 60
): Promise<any> {
  const startTime = Date.now();
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${apiKey}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to check prediction status');
    }
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    }
    
    if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }
    
    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Prediction timeout');
}

/**
 * Generate image using fal.ai
 */
async function generateWithFal(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<FluxGenerationResult> {
  const startTime = Date.now();
  
  const response = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
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
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`fal.ai API error: ${error}`);
  }

  const result = await response.json();
  
  return {
    slideId: `flux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: result.images[0].url,
    imageBase64: result.images[0].content,
    prompt,
    archetypeId: 'executive_summary', // Will be set by caller
    generationTimeMs: Date.now() - startTime,
    modelUsed: 'fal:flux-schnell',
    seed: result.seed,
  };
}

/**
 * Generate image using Together AI
 */
async function generateWithTogether(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<FluxGenerationResult> {
  const startTime = Date.now();
  
  const response = await fetch('https://api.together.xyz/v1/images/generations', {
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
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together AI error: ${error}`);
  }

  const result = await response.json();
  
  return {
    slideId: `flux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: result.data[0].url,
    imageBase64: result.data[0].b64_json,
    prompt,
    archetypeId: 'executive_summary', // Will be set by caller
    generationTimeMs: Date.now() - startTime,
    modelUsed: `together:${config.model}`,
  };
}

/**
 * Generate image using Black Forest Labs (BFL) direct API
 */
async function generateWithBFL(
  prompt: FluxImagePrompt,
  config: FluxProviderConfig
): Promise<FluxGenerationResult> {
  const startTime = Date.now();
  
  // Determine endpoint based on model
  const endpoint = config.model.includes('pro') 
    ? 'https://api.bfl.ml/v1/flux-pro-1.1'
    : 'https://api.bfl.ml/v1/flux-dev';
  
  const response = await fetch(endpoint, {
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
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BFL API error: ${error}`);
  }

  const { id } = await response.json();
  
  // Poll for result
  const result = await pollBFLResult(id, config.apiKey);
  
  return {
    slideId: `flux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: result.sample,
    prompt,
    archetypeId: 'executive_summary', // Will be set by caller
    generationTimeMs: Date.now() - startTime,
    modelUsed: `bfl:${config.model}`,
  };
}

/**
 * Poll BFL for generation result
 */
async function pollBFLResult(
  requestId: string, 
  apiKey: string,
  maxAttempts = 60
): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://api.bfl.ml/v1/get_result?id=${requestId}`, {
      headers: { 'X-Key': apiKey },
    });
    
    if (!response.ok) {
      throw new Error('Failed to check BFL status');
    }
    
    const result = await response.json();
    
    if (result.status === 'Ready') {
      return result.result;
    }
    
    if (result.status === 'Failed') {
      throw new Error('BFL generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('BFL generation timeout');
}

/**
 * Main image generation function
 */
export async function generateFluxImage(
  prompt: FluxImagePrompt,
  archetypeId: ArchetypeId,
  config?: Partial<FluxProviderConfig>
): Promise<FluxGenerationResult> {
  const fullConfig = { ...getDefaultConfig(), ...config };
  
  if (!fullConfig.apiKey) {
    throw new Error('Flux API key not configured. Set FLUX_API_KEY environment variable.');
  }
  
  let result: FluxGenerationResult;
  
  switch (fullConfig.provider) {
    case 'replicate':
      result = await generateWithReplicate(prompt, fullConfig);
      break;
    case 'fal':
      result = await generateWithFal(prompt, fullConfig);
      break;
    case 'together':
      result = await generateWithTogether(prompt, fullConfig);
      break;
    case 'bfl':
      result = await generateWithBFL(prompt, fullConfig);
      break;
    default:
      throw new Error(`Unknown provider: ${fullConfig.provider}`);
  }
  
  // Override with correct archetype
  return {
    ...result,
    archetypeId,
  };
}

/**
 * Generate multiple variations
 */
export async function generateFluxVariations(
  prompt: FluxImagePrompt,
  archetypeId: ArchetypeId,
  count: number = 3,
  config?: Partial<FluxProviderConfig>
): Promise<FluxGenerationResult[]> {
  const promises = Array.from({ length: count }, () => 
    generateFluxImage(prompt, archetypeId, config)
  );
  
  return Promise.all(promises);
}

/**
 * Validate that Flux is properly configured
 */
export function isFluxConfigured(): boolean {
  return !!(
    process.env.FLUX_API_KEY &&
    process.env.FLUX_PROVIDER
  );
}

/**
 * Get available Flux models by provider
 */
export function getFluxModels(provider: FluxProviderConfig['provider']): string[] {
  switch (provider) {
    case 'replicate':
      return [
        'black-forest-labs/flux-schnell',
        'black-forest-labs/flux-dev',
        'black-forest-labs/flux-pro',
      ];
    case 'fal':
      return [
        'fal-ai/flux/schnell',
        'fal-ai/flux/dev',
        'fal-ai/flux-pro',
      ];
    case 'together':
      return [
        'black-forest-labs/FLUX.1-schnell',
        'black-forest-labs/FLUX.1-dev',
      ];
    case 'bfl':
      return [
        'flux-dev',
        'flux-pro-1.1',
      ];
    default:
      return [];
  }
}
