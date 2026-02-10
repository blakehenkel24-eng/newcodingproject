/**
 * Flux 2.0 Prompt Builder
 * Builds optimized prompts for image generation from slide content
 */

import { 
  ArchetypeId, 
  StructuredContent, 
  TargetAudience, 
  DensityMode 
} from '@/types/slide';
import { 
  FluxImagePrompt, 
  FluxArchetypeConfig, 
  FLUX_ARCHETYPE_CONFIGS 
} from './types';

interface PromptBuilderInput {
  structured: StructuredContent;
  archetypeId: ArchetypeId;
  audience: TargetAudience;
  density: DensityMode;
  style: 'mckinsey' | 'bcg' | 'bain' | 'modern';
}

// Audience-specific visual modifiers
const AUDIENCE_MODIFIERS: Record<TargetAudience, string> = {
  c_suite: 'executive-level, high-level strategic view, minimal detail, bold numbers, boardroom presentation',
  pe_investors: 'financial focus, ROI metrics, exit multiples, investment thesis, deal-focused',
  external_client: 'client-friendly, polished, branded elements, professional services aesthetic',
  internal_team: 'detailed, operational metrics, actionable insights, implementation-focused',
};

// Density modifiers
const DENSITY_MODIFIERS: Record<DensityMode, string> => {
  presentation: 'minimal text, large visuals, presenter-supporting, key points only',
  read_style: 'more detailed, self-contained, comprehensive information, readable standalone',
};

// Style-specific visual guidelines
const STYLE_GUIDELINES: Record<string, string> = {
  mckinsey: 'McKinsey consulting style, dark navy blue background (#0F172A), white and teal (#14B8A6) accents, clean sans-serif typography, minimal design, high contrast, professional executive presentation',
  bcg: 'BCG consulting style, deep green background, white and light green accents, structured grid layout, bold typography, corporate professional',
  bain: 'Bain consulting style, crimson red accents, clean white or light background, bold headlines, modern corporate design',
  modern: 'Modern SaaS style, gradient backgrounds, purple and blue accents, rounded corners, contemporary design, tech startup aesthetic',
};

/**
 * Extract key content for the prompt
 */
function extractKeyContent(structured: StructuredContent): {
  title: string;
  keyMetrics: string[];
  mainPoints: string[];
} {
  const title = structured.title || structured.coreMessage;
  
  // Extract metrics
  const keyMetrics = structured.dataPoints
    .slice(0, 3)
    .map(dp => `${dp.label}: ${dp.value}${dp.unit || ''}`);
  
  // Extract main points from logical groups
  const mainPoints = structured.logicalGroups
    .slice(0, 3)
    .flatMap(g => g.bullets.slice(0, 2));
  
  return { title, keyMetrics, mainPoints };
}

/**
 * Build base prompt for any archetype
 */
function buildBasePrompt(
  config: FluxArchetypeConfig,
  content: { title: string; keyMetrics: string[]; mainPoints: string[] },
  style: string,
  audience: string,
  density: string
): string {
  const parts: string[] = [
    // Core subject
    `Professional consulting slide: "${content.title}"`,
    
    // Archetype-specific layout
    config.visualStyle,
    config.layoutGuidance,
    
    // Content elements
    content.keyMetrics.length > 0 
      ? `Key metrics displayed: ${content.keyMetrics.join(', ')}`
      : '',
    content.mainPoints.length > 0
      ? `Main points: ${content.mainPoints.join('; ')}`
      : '',
    
    // Visual style
    style,
    
    // Audience and density
    audience,
    density,
    
    // Technical specs
    '16:9 aspect ratio',
    'high quality',
    'professional photography style',
    'sharp text',
    'readable fonts',
  ];
  
  return parts.filter(Boolean).join('. ');
}

/**
 * Build archetype-specific content description
 */
function buildArchetypeContentDescription(
  archetypeId: ArchetypeId,
  structured: StructuredContent
): string {
  const { dataPoints, logicalGroups } = structured;
  
  switch (archetypeId) {
    case 'executive_summary': {
      const metrics = dataPoints.slice(0, 4).map(dp => 
        `${dp.label}: ${dp.value}${dp.unit || ''}${dp.context ? ` (${dp.context})` : ''}`
      );
      return `Executive summary with headline "${structured.title}". Key findings: ${metrics.join('; ')}.`;
    }
    
    case 'situation_complication_resolution': {
      const groups = logicalGroups.slice(0, 3);
      const sections = ['Situation', 'Complication', 'Resolution'];
      return groups.map((g, i) => 
        `${sections[i]}: ${g.heading} - ${g.bullets.slice(0, 2).join(', ')}`
      ).join('. ');
    }
    
    case 'two_by_two_matrix': {
      const items = logicalGroups.flatMap(g => g.bullets).slice(0, 8);
      return `2x2 matrix with items positioned by impact and effort: ${items.join(', ')}`;
    }
    
    case 'comparison_table': {
      const criteria = logicalGroups.map(g => g.heading);
      return `Comparison table evaluating across criteria: ${criteria.join(', ')}`;
    }
    
    case 'before_after': {
      const groups = logicalGroups.slice(0, 2);
      if (groups.length >= 2) {
        return `Before: ${groups[0].heading} - ${groups[0].bullets[0]}. After: ${groups[1].heading} - ${groups[1].bullets[0]}`;
      }
      return 'Before and after transformation comparison';
    }
    
    case 'kpi_dashboard': {
      const metrics = dataPoints.slice(0, 5).map(dp => 
        `${dp.label}: ${dp.value}${dp.unit || ''}`
      );
      return `KPI dashboard showing: ${metrics.join(', ')}`;
    }
    
    case 'waterfall_chart': {
      const values = dataPoints.map(dp => `${dp.label} ${dp.value}`).slice(0, 6);
      return `Waterfall chart showing progression: ${values.join(' → ')}`;
    }
    
    case 'trend_line': {
      const trend = dataPoints.slice(0, 8).map(dp => `${dp.label}: ${dp.value}`);
      return `Line chart trend over time: ${trend.join(', ')}`;
    }
    
    case 'process_flow': {
      const steps = logicalGroups.slice(0, 6).map((g, i) => `Step ${i + 1}: ${g.heading}`);
      return `Process flow: ${steps.join(' → ')}`;
    }
    
    case 'timeline_swimlane': {
      const lanes = logicalGroups.slice(0, 4).map(g => g.heading);
      return `Timeline with workstreams: ${lanes.join(', ')}`;
    }
    
    case 'three_pillar': {
      const pillars = logicalGroups.slice(0, 3).map(g => g.heading);
      return `Three strategic pillars: ${pillars.join(', ')}`;
    }
    
    case 'market_sizing': {
      const levels = dataPoints.slice(0, 3).map(dp => `${dp.label}: ${dp.value}`);
      return `Market sizing: ${levels.join(' > ')}`;
    }
    
    case 'issue_tree': {
      const root = structured.title;
      const branches = logicalGroups.slice(0, 3).map(g => g.heading);
      return `Issue tree breaking down "${root}" into: ${branches.join(', ')}`;
    }
    
    default:
      return structured.coreMessage;
  }
}

/**
 * Build negative prompt to avoid common issues
 */
function buildNegativePrompt(): string {
  return [
    'blurry text',
    'illegible text',
    'misspelled words',
    'distorted text',
    'low quality',
    'pixelated',
    'watermark',
    'logo',
    'brand name',
    'copyright text',
    'crowded layout',
    'cluttered',
    'too many elements',
    'small text',
    'handwritten',
    'cursive font',
    'decorative font',
    'photorealistic people',
    'faces',
    'photographs',
  ].join(', ');
}

/**
 * Main function to build Flux prompt
 */
export function buildFluxPrompt(input: PromptBuilderInput): FluxImagePrompt {
  const { structured, archetypeId, audience, density, style } = input;
  
  // Get archetype config
  const config = FLUX_ARCHETYPE_CONFIGS[archetypeId];
  
  // Extract content
  const content = extractKeyContent(structured);
  
  // Get modifiers
  const styleGuideline = STYLE_GUIDELINES[style];
  const audienceModifier = AUDIENCE_MODIFIERS[audience];
  const densityModifier = DENSITY_MODIFIERS[density];
  
  // Build archetype-specific content
  const archetypeContent = buildArchetypeContentDescription(archetypeId, structured);
  
  // Combine into final prompt
  const prompt = [
    `Professional consulting slide design: ${content.title}`,
    '',
    'CONTENT:',
    archetypeContent,
    content.keyMetrics.length > 0 ? `Metrics: ${content.keyMetrics.join(', ')}` : '',
    '',
    'VISUAL SPECIFICATIONS:',
    config.visualStyle,
    config.layoutGuidance,
    config.colorPalette,
    config.typographyStyle,
    '',
    'STYLE:',
    styleGuideline,
    audienceModifier,
    densityModifier,
    '',
    'TECHNICAL:',
    '16:9 aspect ratio presentation slide',
    'High resolution',
    'Sharp, readable text',
    'Professional color grading',
    'Clean, minimal design',
    'Dark background with light text',
    'No photographs or faces',
    'Vector graphic style',
  ].filter(Boolean).join('\n');
  
  return {
    prompt,
    negativePrompt: buildNegativePrompt(),
    aspectRatio: '16:9',
    style,
    guidanceScale: 7.5,
    numInferenceSteps: 28,
  };
}

/**
 * Enhance prompt with specific text elements for better accuracy
 * This adds explicit text instructions to help Flux render text better
 */
export function enhancePromptWithTextElements(
  basePrompt: FluxImagePrompt,
  structured: StructuredContent
): FluxImagePrompt {
  // Create a text instruction overlay
  const textElements = [
    `Title text: "${structured.title}"`,
    ...structured.dataPoints.slice(0, 4).map(dp => 
      `${dp.label}: ${dp.value}${dp.unit || ''}`
    ),
    ...structured.logicalGroups.slice(0, 3).flatMap(g => 
      g.bullets.slice(0, 2).map(b => `${g.heading}: ${b.substring(0, 50)}`)
    ),
  ];
  
  const enhancedPrompt = `${basePrompt.prompt}

TEXT ELEMENTS TO INCLUDE (render these exact phrases clearly):
${textElements.map(t => `- "${t}"`).join('\n')}

Ensure all text is legible, properly spelled, and professionally formatted.`;
  
  return {
    ...basePrompt,
    prompt: enhancedPrompt,
    guidanceScale: 8.0, // Slightly higher for text accuracy
    numInferenceSteps: 30, // More steps for better quality
  };
}

/**
 * Build a simple/direct prompt for quick generation
 */
export function buildQuickPrompt(
  title: string,
  archetypeId: ArchetypeId,
  style: 'mckinsey' | 'bcg' | 'bain' | 'modern' = 'mckinsey'
): FluxImagePrompt {
  const config = FLUX_ARCHETYPE_CONFIGS[archetypeId];
  const styleGuideline = STYLE_GUIDELINES[style];
  
  return {
    prompt: `${config.examplePrompt}. Title: "${title}". ${styleGuideline}. High quality, professional, 16:9.`,
    negativePrompt: buildNegativePrompt(),
    aspectRatio: '16:9',
    style,
    guidanceScale: 7.0,
    numInferenceSteps: 25,
  };
}
