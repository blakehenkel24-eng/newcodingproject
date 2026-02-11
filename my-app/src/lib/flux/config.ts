/**
 * Flux 2.0 Configuration
 * Validates and manages provider configurations
 */

import { FluxProviderConfig } from './types';

// Provider-specific default models
const DEFAULT_MODELS: Record<FluxProviderConfig['provider'], string> = {
  replicate: 'black-forest-labs/flux-schnell',
  fal: 'fal-ai/flux/schnell',
  together: 'black-forest-labs/FLUX.1-schnell',
  bfl: 'flux-dev',
};

// Provider-specific API endpoints
const PROVIDER_ENDPOINTS: Record<FluxProviderConfig['provider'], string> = {
  replicate: 'https://api.replicate.com/v1/predictions',
  fal: 'https://queue.fal.run/fal-ai/flux/schnell',
  together: 'https://api.together.xyz/v1/images/generations',
  bfl: 'https://api.bfl.ml/v1/flux-dev',
};

// Provider documentation URLs
const PROVIDER_DOCS: Record<FluxProviderConfig['provider'], string> = {
  replicate: 'https://replicate.com/docs',
  fal: 'https://fal.ai/docs',
  together: 'https://docs.together.ai/docs',
  bfl: 'https://docs.bfl.ml/',
};

interface ConfigValidationResult {
  valid: boolean;
  provider: FluxProviderConfig['provider'];
  model: string;
  errors: string[];
  warnings: string[];
  docsUrl: string;
}

/**
 * Validate Flux configuration
 */
export function validateFluxConfig(
  customConfig?: Partial<FluxProviderConfig>
): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Get configuration
  const provider = customConfig?.provider || 
    (process.env.FLUX_PROVIDER as FluxProviderConfig['provider']) || 'replicate';
  
  const apiKey = customConfig?.apiKey || process.env.FLUX_API_KEY || '';
  
  const model = customConfig?.model || 
    process.env.FLUX_MODEL || 
    DEFAULT_MODELS[provider];
  
  // Validate provider
  const validProviders: FluxProviderConfig['provider'][] = ['replicate', 'fal', 'together', 'bfl'];
  if (!validProviders.includes(provider)) {
    errors.push(`Invalid provider: ${provider}. Must be one of: ${validProviders.join(', ')}`);
  }
  
  // Validate API key
  if (!apiKey) {
    errors.push('FLUX_API_KEY environment variable is required');
  } else if (apiKey.length < 20) {
    errors.push('FLUX_API_KEY appears to be invalid (too short)');
  }
  
  // Validate model for provider
  const validModels = getFluxModels(provider);
  if (!validModels.includes(model)) {
    warnings.push(`Model "${model}" may not be valid for ${provider}. Valid models: ${validModels.join(', ')}`);
  }
  
  // Provider-specific validations
  switch (provider) {
    case 'replicate':
      if (!model.includes('/')) {
        errors.push('Replicate model must be in format "owner/model" or "owner/model:version"');
      }
      break;
    case 'fal':
      if (!apiKey.startsWith('fal-')) {
        warnings.push('Fal.ai API keys typically start with "fal-"');
      }
      break;
    case 'together':
      if (apiKey.startsWith('sk-')) {
        warnings.push('Together AI API keys typically do not start with "sk-"');
      }
      break;
    case 'bfl':
      if (apiKey.length < 40) {
        warnings.push('BFL API keys are typically longer than 40 characters');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    provider,
    model,
    errors,
    warnings,
    docsUrl: PROVIDER_DOCS[provider],
  };
}

/**
 * Get default configuration with validation
 */
export function getFluxConfig(customConfig?: Partial<FluxProviderConfig>): FluxProviderConfig {
  const provider = customConfig?.provider || 
    (process.env.FLUX_PROVIDER as FluxProviderConfig['provider']) || 'replicate';
  
  return {
    provider,
    apiKey: customConfig?.apiKey || process.env.FLUX_API_KEY || '',
    model: customConfig?.model || process.env.FLUX_MODEL || DEFAULT_MODELS[provider],
    baseUrl: customConfig?.baseUrl || process.env.FLUX_BASE_URL || PROVIDER_ENDPOINTS[provider],
  };
}

/**
 * Check if Flux is minimally configured
 */
export function isFluxConfigured(): boolean {
  const provider = process.env.FLUX_PROVIDER as FluxProviderConfig['provider'];
  const apiKey = process.env.FLUX_API_KEY;
  
  if (!provider || !apiKey) {
    return false;
  }
  
  const validProviders: FluxProviderConfig['provider'][] = ['replicate', 'fal', 'together', 'bfl'];
  return validProviders.includes(provider) && apiKey.length > 10;
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
        'black-forest-labs/flux-1.1-pro',
      ];
    case 'fal':
      return [
        'fal-ai/flux/schnell',
        'fal-ai/flux/dev',
        'fal-ai/flux-pro',
        'fal-ai/flux-lora',
      ];
    case 'together':
      return [
        'black-forest-labs/FLUX.1-schnell',
        'black-forest-labs/FLUX.1-dev',
        'black-forest-labs/FLUX.1-pro',
      ];
    case 'bfl':
      return [
        'flux-dev',
        'flux-pro-1.1',
        'flux-pro',
      ];
    default:
      return [];
  }
}

/**
 * Get provider-specific generation parameters
 */
export function getProviderParams(provider: FluxProviderConfig['provider']): {
  maxRetries: number;
  timeoutSeconds: number;
  pollIntervalMs: number;
  maxPollAttempts: number;
} {
  switch (provider) {
    case 'replicate':
      return {
        maxRetries: 3,
        timeoutSeconds: 120,
        pollIntervalMs: 1000,
        maxPollAttempts: 120,
      };
    case 'fal':
      return {
        maxRetries: 2,
        timeoutSeconds: 60,
        pollIntervalMs: 500,
        maxPollAttempts: 120,
      };
    case 'together':
      return {
        maxRetries: 3,
        timeoutSeconds: 60,
        pollIntervalMs: 1000,
        maxPollAttempts: 60,
      };
    case 'bfl':
      return {
        maxRetries: 3,
        timeoutSeconds: 120,
        pollIntervalMs: 1000,
        maxPollAttempts: 120,
      };
    default:
      return {
        maxRetries: 3,
        timeoutSeconds: 120,
        pollIntervalMs: 1000,
        maxPollAttempts: 120,
      };
  }
}

/**
 * Get help text for configuration
 */
export function getConfigHelp(): string {
  return `
Flux 2.0 Configuration Guide:

Required Environment Variables:
  FLUX_PROVIDER    - One of: replicate, fal, together, bfl
  FLUX_API_KEY     - Your API key from the provider

Optional Environment Variables:
  FLUX_MODEL       - Specific model to use (provider-dependent)
  FLUX_BASE_URL    - Custom API endpoint (rarely needed)

Provider Setup:

1. Replicate (recommended for beginners):
   - Sign up at https://replicate.com
   - Get API token from account settings
   - Set FLUX_PROVIDER=replicate
   - Set FLUX_API_KEY=r8_xxxxxxxx...

2. Fal.ai (fastest):
   - Sign up at https://fal.ai
   - Get API key from dashboard
   - Set FLUX_PROVIDER=fal
   - Set FLUX_API_KEY=fal-xxxxxxxx...

3. Together AI:
   - Sign up at https://together.ai
   - Get API key from settings
   - Set FLUX_PROVIDER=together
   - Set FLUX_API_KEY=xxxxxxxx...

4. BFL (Black Forest Labs - official):
   - Sign up at https://api.bfl.ml
   - Get API key from dashboard
   - Set FLUX_PROVIDER=bfl
   - Set FLUX_API_KEY=xxxxxxxx...

Model Recommendations:
  - flux-schnell: Fastest, good for testing (~2s)
  - flux-dev: Balanced quality/speed (~10s)
  - flux-pro: Best quality, slowest (~30s)
`;
}
