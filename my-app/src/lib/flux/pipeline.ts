/**
 * Flux 2.0 Generation Pipeline
 * Orchestrates the full slide generation process using Flux image generation
 */

import { ArchetypeId, StructuredContent, TargetAudience, DensityMode } from '@/types/slide';
import { FluxGenerationRequest, FluxGenerationResult, FluxImagePrompt } from './types';
import { buildFluxPrompt, enhancePromptWithTextElements } from './promptBuilder';
import { generateFluxImage } from './imageGenerator';

// Import content analyzer from existing pipeline (reuse this)
import { analyzeContent } from '@/lib/llm/contentAnalyzer';

// Import archetype classifier (reuse this too)
import { classifyContent } from '@/lib/llm/archetypes';

interface FluxPipelineInput {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType: ArchetypeId | 'auto';
  audience: TargetAudience;
  density: DensityMode;
}

interface FluxPipelineResult {
  success: boolean;
  result?: FluxGenerationResult;
  structured?: StructuredContent;
  archetypeId?: ArchetypeId;
  prompt?: FluxImagePrompt;
  error?: string;
  generationTimeMs: number;
}

/**
 * Main Flux generation pipeline
 * Stage 1: Analyze content → Stage 2: Classify archetype → Stage 3: Build prompt → Stage 4: Generate image
 */
export async function runFluxPipeline(
  input: FluxPipelineInput
): Promise<FluxPipelineResult> {
  const startTime = Date.now();
  
  try {
    // === STAGE 1: Content Analysis ===
    console.log('[Flux Pipeline] Stage 1: Analyzing content...');
    
    const structured = await analyzeContent({
      text: input.text,
      message: input.message,
      data: input.data,
      fileContent: input.fileContent,
    });
    
    console.log('[Flux Pipeline] Content analyzed:', {
      coreMessage: structured.coreMessage.substring(0, 50) + '...',
      contentType: structured.contentType,
      dataPoints: structured.dataPoints.length,
      logicalGroups: structured.logicalGroups.length,
    });
    
    // === STAGE 2: Archetype Classification ===
    console.log('[Flux Pipeline] Stage 2: Classifying archetype...');
    
    let archetypeId: ArchetypeId;
    
    if (input.slideType !== 'auto') {
      archetypeId = input.slideType;
      console.log('[Flux Pipeline] Using user-selected archetype:', archetypeId);
    } else {
      archetypeId = classifyContent(
        structured.contentType,
        structured.dataPoints,
        input.text + ' ' + input.message,
        structured.logicalGroups
      );
      console.log('[Flux Pipeline] Auto-classified archetype:', archetypeId);
    }
    
    // === STAGE 3: Build Flux Prompt ===
    console.log('[Flux Pipeline] Stage 3: Building Flux prompt...');
    
    // Build Flux prompt - archetype determines visual style automatically
    let prompt = buildFluxPrompt({
      structured,
      archetypeId,
      audience: input.audience,
      density: input.density,
    });
    
    // Enhance prompt for better text rendering
    prompt = enhancePromptWithTextElements(prompt, structured);
    
    console.log('[Flux Pipeline] Prompt built:', {
      promptLength: prompt.prompt.length,
      style: prompt.style,
      guidanceScale: prompt.guidanceScale,
    });
    
    // === STAGE 4: Generate Image ===
    console.log('[Flux Pipeline] Stage 4: Generating image with Flux...');
    
    const result = await generateFluxImage(prompt, archetypeId);
    
    const totalTime = Date.now() - startTime;
    console.log('[Flux Pipeline] Complete! Generation time:', totalTime, 'ms');
    
    return {
      success: true,
      result,
      structured,
      archetypeId,
      prompt,
      generationTimeMs: totalTime,
    };
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('[Flux Pipeline] Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in Flux pipeline',
      generationTimeMs: totalTime,
    };
  }
}



/**
 * Run pipeline with multiple variations
 */
export async function runFluxPipelineWithVariations(
  input: FluxPipelineInput,
  variationCount: number = 3
): Promise<FluxPipelineResult[]> {
  const results: FluxPipelineResult[] = [];
  
  // First, get the structured content and archetype (reuse for all variations)
  const structured = await analyzeContent({
    text: input.text,
    message: input.message,
    data: input.data,
    fileContent: input.fileContent,
  });
  
  const archetypeId = input.slideType !== 'auto' 
    ? input.slideType 
    : classifyContent(
        structured.contentType,
        structured.dataPoints,
        input.text + ' ' + input.message,
        structured.logicalGroups
      );
  
  const style = detectStyleFromInput(input.text) || 'mckinsey';
  
  // Generate variations with different seeds
  const promises = Array.from({ length: variationCount }, async (_, i) => {
    const startTime = Date.now();
    
    try {
      // Slightly vary the prompt for each variation
      const prompt = buildFluxPrompt({
        structured: {
          ...structured,
          title: i === 0 ? structured.title : `${structured.title} (Variation ${i + 1})`,
        },
        archetypeId,
        audience: input.audience,
        density: input.density,
        style,
      });
      
      const enhancedPrompt = enhancePromptWithTextElements(prompt, structured);
      const result = await generateFluxImage(enhancedPrompt, archetypeId);
      
      return {
        success: true,
        result,
        structured,
        archetypeId,
        prompt: enhancedPrompt,
        generationTimeMs: Date.now() - startTime,
      } as FluxPipelineResult;
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generationTimeMs: Date.now() - startTime,
      } as FluxPipelineResult;
    }
  });
  
  return Promise.all(promises);
}

/**
 * Quick generation with minimal processing
 * Uses example prompts for faster generation
 */
export async function runFluxQuickGenerate(
  title: string,
  archetypeId: ArchetypeId,
  style: 'mckinsey' | 'bcg' | 'bain' | 'modern' = 'mckinsey'
): Promise<FluxPipelineResult> {
  const startTime = Date.now();
  
  try {
    const { buildQuickPrompt } = await import('./promptBuilder');
    const prompt = buildQuickPrompt(title, archetypeId, style);
    
    const result = await generateFluxImage(prompt, archetypeId);
    
    return {
      success: true,
      result,
      archetypeId,
      prompt,
      generationTimeMs: Date.now() - startTime,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Regenerate a slide with modifications
 */
export async function regenerateFluxSlide(
  originalInput: FluxPipelineInput,
  modifications: {
    title?: string;
    style?: 'mckinsey' | 'bcg' | 'bain' | 'modern';
    archetypeId?: ArchetypeId;
  }
): Promise<FluxPipelineResult> {
  // Analyze content again
  const structured = await analyzeContent({
    text: originalInput.text,
    message: originalInput.message,
    data: originalInput.data,
    fileContent: originalInput.fileContent,
  });
  
  // Apply modifications
  if (modifications.title) {
    structured.title = modifications.title;
  }
  
  const archetypeId = modifications.archetypeId || 
    (originalInput.slideType !== 'auto' 
      ? originalInput.slideType 
      : classifyContent(
          structured.contentType,
          structured.dataPoints,
          originalInput.text + ' ' + originalInput.message,
          structured.logicalGroups
        ));
  
  const style = modifications.style || detectStyleFromInput(originalInput.text) || 'mckinsey';
  
  // Build and generate
  const prompt = buildFluxPrompt({
    structured,
    archetypeId,
    audience: originalInput.audience,
    density: originalInput.density,
    style,
  });
  
  const enhancedPrompt = enhancePromptWithTextElements(prompt, structured);
  const result = await generateFluxImage(enhancedPrompt, archetypeId);
  
  return {
    success: true,
    result,
    structured,
    archetypeId,
    prompt: enhancedPrompt,
    generationTimeMs: result.generationTimeMs,
  };
}
