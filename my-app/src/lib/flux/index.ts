/**
 * Flux 2.0 Image Generation Module
 * Complete parallel system for AI image-based slide generation
 */

// Types
export type {
  FluxGenerationRequest,
  FluxImagePrompt,
  FluxGenerationResult,
  FluxProviderConfig,
  FluxArchetypeConfig,
} from './types';

export { FLUX_ARCHETYPE_CONFIGS } from './types';

// Prompt Builder
export {
  buildFluxPrompt,
  enhancePromptWithTextElements,
  buildQuickPrompt,
} from './promptBuilder';

// Image Generator
export {
  generateFluxImage,
  generateFluxVariations,
  isFluxConfigured,
  getFluxModels,
} from './imageGenerator';

// Pipeline
export {
  runFluxPipeline,
  runFluxPipelineWithVariations,
  runFluxQuickGenerate,
  regenerateFluxSlide,
} from './pipeline';
