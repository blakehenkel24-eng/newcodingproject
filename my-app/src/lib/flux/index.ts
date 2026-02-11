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

// Configuration
export {
  validateFluxConfig,
  getFluxConfig,
  isFluxConfigured,
  getFluxModels,
  getProviderParams,
  getConfigHelp,
} from './config';

// Prompt Builder
export {
  buildFluxPrompt,
  enhancePromptWithTextElements,
  buildQuickPrompt,
} from './promptBuilder';

// Image Generator
export {
  generateFluxImage,
  FluxGenerationError,
} from './imageGenerator';

// Pipeline
export {
  runFluxPipeline,
  runFluxPipelineWithVariations,
  runFluxQuickGenerate,
  regenerateFluxSlide,
} from './pipeline';

// Export utilities
export {
  exportFluxToPPTX,
  exportFluxBatchToPPTX,
  downloadFluxImage,
  copyFluxImageToClipboard,
} from './export';
