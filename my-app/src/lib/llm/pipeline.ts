/**
 * SlideTheory Slide Generation Pipeline
 * 5-Stage orchestrator: Content Analysis → Archetype Classification → HTML/PPTX Generation → QA
 */

import { analyzeContent, StructuredContent, validateMECE, LogicalGroup } from './contentAnalyzer';
import { classifyAndMap, ClassificationResult, TemplateProps } from './archetypeClassifier';
import { validateSlide, QAReport, validateContentFit } from './qualityAssurance';
import { ArchetypeId } from './archetypes';
import { generatePPTX } from '@/lib/export/pptxGenerator';
import { detectPII, anonymize, DataLifecycleManager, SECURE_RETENTION_CONFIG } from '@/lib/security';

// === TYPES ===

export interface PipelineInput {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType?: string;
  audience?: string;
  density?: 'presentation' | 'read_style';
  securityOptions?: {
    enableAnonymization?: boolean;
    anonymizationLevel?: 'light' | 'medium' | 'strict';
    retentionPolicy?: 'immediate' | '5minutes' | '1hour' | '1day' | '30days';
  };
}

export interface PipelineOutput {
  slideId: string;
  archetypeId: ArchetypeId;
  structured: StructuredContent;
  templateProps: TemplateProps;
  qaReport: QAReport;
  generationTimeMs: number;
  modelUsed: string;
  securityInfo: {
    anonymizationApplied: boolean;
    entitiesDetected: string[];
    entitiesReplaced: number;
    securityScore: number;
    retentionExpiry: Date;
  };
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

  // Security Stage: PII Detection & Anonymization
  const securityStartTime = Date.now();
  const securityOptions = input.securityOptions || {};
  const enableAnonymization = securityOptions.enableAnonymization !== false; // Default to true
  
  // Detect PII in original input
  const piiDetection = detectPII(input.text + ' ' + (input.message || '') + ' ' + (input.data || ''));
  console.log(`[Pipeline] PII Detection: ${piiDetection.entities.length} entities found, risk score: ${piiDetection.riskScore}`);

  // Anonymize input if enabled
  let processedInput = input;
  let anonymizationResult = null;
  
  if (enableAnonymization && piiDetection.hasSensitiveData) {
    console.log('[Pipeline] Applying anonymization...');
    
    const textAnon = anonymize(input.text, { level: securityOptions.anonymizationLevel || 'medium' });
    const messageAnon = anonymize(input.message || '', { level: securityOptions.anonymizationLevel || 'medium' });
    const dataAnon = anonymize(input.data || '', { level: securityOptions.anonymizationLevel || 'medium' });
    
    processedInput = {
      ...input,
      text: textAnon.anonymizedText,
      message: messageAnon.anonymizedText,
      data: dataAnon.anonymizedText,
    };
    
    anonymizationResult = {
      textEntities: textAnon.entitiesReplaced.length,
      messageEntities: messageAnon.entitiesReplaced.length,
      dataEntities: dataAnon.entitiesReplaced.length,
      securityScore: Math.max(textAnon.securityScore, messageAnon.securityScore, dataAnon.securityScore),
    };
    
    console.log(`[Pipeline] Anonymization complete in ${Date.now() - securityStartTime}ms`);
  }

  try {
    // Stage 1: Content Analysis (using anonymized input)
    let { structured, modelUsed } = await stage1_ContentAnalysis(processedInput, options);

    // Fallback: If logicalGroups is empty, create groups from raw content
    if (!structured.logicalGroups || structured.logicalGroups.length === 0) {
      console.log('[Pipeline] WARNING: logicalGroups is empty, creating fallback groups');
      structured = createFallbackGroups(structured, processedInput);
    }

    // Stage 2: Archetype Classification
    const classification = stage2_ArchetypeClassification(
      structured,
      processedInput.slideType,
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

    // Schedule automatic data deletion
    const lifecycleManager = new DataLifecycleManager({
      ...SECURE_RETENTION_CONFIG,
      userInput: securityOptions.retentionPolicy || SECURE_RETENTION_CONFIG.userInput,
    });
    
    // Note: In production, you'd get the userId from the auth context
    const userId = 'anonymous'; // This should come from auth
    await lifecycleManager.scheduleUserInputDeletion(slideId, userId);

    console.log(`[Pipeline] Complete in ${generationTimeMs}ms\n`);

    return {
      slideId,
      archetypeId: classification.archetypeId,
      structured,
      templateProps: classification.props,
      qaReport,
      generationTimeMs,
      modelUsed,
      securityInfo: {
        anonymizationApplied: enableAnonymization && piiDetection.hasSensitiveData,
        entitiesDetected: Object.keys(piiDetection.entityCounts),
        entitiesReplaced: anonymizationResult ? 
          (anonymizationResult.textEntities + anonymizationResult.messageEntities + anonymizationResult.dataEntities) : 0,
        securityScore: anonymizationResult?.securityScore || (100 - piiDetection.riskScore),
        retentionExpiry: new Date(Date.now() + (securityOptions.retentionPolicy === 'immediate' ? 0 : 5 * 60 * 1000)),
      },
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

// === FALLBACK FUNCTIONS ===

/**
 * Create fallback logical groups when LLM returns empty groups
 * Extracts key points from raw input to ensure slide has content
 */
function createFallbackGroups(
  structured: StructuredContent,
  input: PipelineInput
): StructuredContent {
  const groups: LogicalGroup[] = [];
  
  // Group 1: Key Insights from context
  const contextPoints = input.text
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 120)
    .slice(0, 4);
  
  if (contextPoints.length > 0) {
    groups.push({
      heading: 'Key Insights',
      bullets: contextPoints,
      emphasis: 'high',
    });
  }
  
  // Group 2: Data Points
  if (structured.dataPoints.length > 0) {
    groups.push({
      heading: 'Key Metrics',
      bullets: structured.dataPoints.slice(0, 4).map(dp => 
        `${dp.label}: ${dp.value}${dp.unit || ''}${dp.context ? ` (${dp.context})` : ''}`
      ),
      emphasis: 'medium',
    });
  } else if (input.data) {
    // Parse data from input string
    const dataPoints = input.data
      .split(/[;\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 5)
      .slice(0, 4);
    if (dataPoints.length > 0) {
      groups.push({
        heading: 'Key Metrics',
        bullets: dataPoints,
        emphasis: 'medium',
      });
    }
  }
  
  // Group 3: Strategic Actions from key message
  if (input.message) {
    const actionPoints = input.message
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 100)
      .slice(0, 3);
    if (actionPoints.length > 0) {
      groups.push({
        heading: 'Strategic Actions',
        bullets: actionPoints,
        emphasis: 'medium',
      });
    }
  }
  
  // Ensure at least one group exists
  if (groups.length === 0) {
    groups.push({
      heading: 'Overview',
      bullets: [input.message || 'See details above'],
      emphasis: 'high',
    });
  }
  
  return {
    ...structured,
    logicalGroups: groups,
  };
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
