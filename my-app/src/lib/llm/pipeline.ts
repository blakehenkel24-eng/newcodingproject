/**
 * SlideTheory Slide Generation Pipeline
 * 5-Stage orchestrator: Content Analysis → Archetype Classification → HTML/PPTX Generation → QA
 */

import { analyzeContent, StructuredContent, validateMECE } from './contentAnalyzer';
import { classifyAndMap, ClassificationResult, TemplateProps } from './archetypeClassifier';
import { validateSlide, QAReport, validateContentFit } from './qualityAssurance';
import { ArchetypeId } from './archetypes';
import { generatePPTX } from '@/lib/export/pptxGenerator';

// === TYPES ===

export interface PipelineInput {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType?: string;
  audience?: string;
  density?: 'presentation' | 'read_style';
}

export interface PipelineOutput {
  slideId: string;
  archetypeId: ArchetypeId;
  structured: StructuredContent;
  templateProps: TemplateProps;
  qaReport: QAReport;
  generationTimeMs: number;
  modelUsed: string;
}

export interface PipelineOptions {
  skipQA?: boolean;
  forceArchetype?: ArchetypeId;
  preferredModel?: 'openai' | 'gemini';
}

// === PIPELINE STAGES ===

/**
 * Stage 1: Content Analysis
 * Parses raw input into structured content following MECE principles
 */
async function stage1_ContentAnalysis(
  input: PipelineInput,
  options: PipelineOptions
): Promise<{ structured: StructuredContent; modelUsed: string }> {
  console.log('[Pipeline] Stage 1: Content Analysis');
  const startTime = Date.now();

  const result = await analyzeContent(
    input.text,
    input.message,
    input.data,
    input.fileContent,
    options.preferredModel
  );

  // Validate MECE structure
  const meceWarnings = validateMECE(result.structured.logicalGroups);
  if (meceWarnings.length > 0) {
    console.log('[Pipeline] MECE warnings:', meceWarnings);
  }

  console.log(`[Pipeline] Content analysis complete in ${Date.now() - startTime}ms`);
  console.log(`[Pipeline] Detected archetype: ${result.structured.recommendedArchetype}`);
  console.log(`[Pipeline] Complexity score: ${result.structured.complexityScore}/5`);

  return result;
}

/**
 * Stage 2: Archetype Classification
 * Maps structured content to the appropriate slide archetype
 */
function stage2_ArchetypeClassification(
  structured: StructuredContent,
  userRequestedType?: string,
  forceArchetype?: ArchetypeId
): ClassificationResult {
  console.log('[Pipeline] Stage 2: Archetype Classification');
  const startTime = Date.now();

  // Override with forced archetype if provided
  const effectiveType = forceArchetype || userRequestedType;

  const result = classifyAndMap(
    structured,
    effectiveType,
    'presentation' // Default density
  );

  console.log(`[Pipeline] Classification complete in ${Date.now() - startTime}ms`);
  console.log(`[Pipeline] Selected archetype: ${result.archetypeId} (confidence: ${result.confidence})`);

  return result;
}

/**
 * Stage 3 & 4: Content Validation
 * Pre-flight check for overflow and quality issues
 */
function stage3_Validation(
  structured: StructuredContent,
  archetypeId: ArchetypeId
): { valid: boolean; warnings: string[] } {
  console.log('[Pipeline] Stage 3: Content Validation');

  // Check content fit
  const fitCheck = validateContentFit(
    structured.title,
    structured.logicalGroups,
    archetypeId
  );

  if (!fitCheck.fits) {
    console.log('[Pipeline] Content fit warnings:', fitCheck.warnings);
  }

  return {
    valid: fitCheck.warnings.length === 0,
    warnings: fitCheck.warnings,
  };
}

/**
 * Stage 5: Quality Assurance
 * Validates the slide against consulting standards
 */
function stage5_QualityAssurance(
  structured: StructuredContent,
  archetypeId: ArchetypeId,
  templateProps: TemplateProps
): QAReport {
  console.log('[Pipeline] Stage 5: Quality Assurance');
  const startTime = Date.now();

  const report = validateSlide(structured, archetypeId, templateProps);

  console.log(`[Pipeline] QA complete in ${Date.now() - startTime}ms`);
  console.log(`[Pipeline] Quality score: ${report.score}/100`);
  console.log(`[Pipeline] QA passed: ${report.passed}`);

  if (report.recommendations.length > 0) {
    console.log('[Pipeline] Recommendations:', report.recommendations);
  }

  return report;
}

// === MAIN PIPELINE ===

/**
 * Execute the full slide generation pipeline
 */
export async function executePipeline(
  input: PipelineInput,
  options: PipelineOptions = {}
): Promise<PipelineOutput> {
  const pipelineStartTime = Date.now();
  const slideId = crypto.randomUUID();

  console.log(`\n[Pipeline] Starting slide generation: ${slideId}`);
  console.log(`[Pipeline] Input length: ${input.text.length} chars`);

  try {
    // Stage 1: Content Analysis
    const { structured, modelUsed } = await stage1_ContentAnalysis(input, options);

    // Stage 2: Archetype Classification
    const classification = stage2_ArchetypeClassification(
      structured,
      input.slideType,
      options.forceArchetype
    );

    // Stage 3: Validation
    const validation = stage3_Validation(structured, classification.archetypeId);

    if (!validation.valid) {
      console.log('[Pipeline] Validation warnings (continuing anyway):', validation.warnings);
    }

    // Stage 5: Quality Assurance (unless skipped)
    let qaReport: QAReport;
    if (!options.skipQA) {
      qaReport = stage5_QualityAssurance(
        structured,
        classification.archetypeId,
        classification.props
      );
    } else {
      qaReport = {
        passed: true,
        checks: [],
        score: 100,
        recommendations: [],
      };
    }

    const generationTimeMs = Date.now() - pipelineStartTime;

    console.log(`[Pipeline] Complete in ${generationTimeMs}ms\n`);

    return {
      slideId,
      archetypeId: classification.archetypeId,
      structured,
      templateProps: classification.props,
      qaReport,
      generationTimeMs,
      modelUsed,
    };

  } catch (error) {
    console.error('[Pipeline] Error:', error);
    throw error;
  }
}

/**
 * Generate PPTX file from pipeline output
 */
export async function generateSlidePPTX(
  output: PipelineOutput,
  filename?: string
): Promise<Blob> {
  console.log(`[Pipeline] Generating PPTX for slide: ${output.slideId}`);

  const blob = await generatePPTX(
    output.archetypeId,
    output.templateProps,
    filename || `slide-${output.slideId.slice(0, 8)}.pptx`
  );

  console.log('[Pipeline] PPTX generation complete');
  return blob;
}

// === EXPORT FOR API ===

export {
  // Stage exports for testing/composition
  analyzeContent,
  classifyAndMap,
  validateSlide,
  validateContentFit,
  generatePPTX,
};

export type {
  StructuredContent,
  TemplateProps,
  QAReport,
  ClassificationResult,
};
