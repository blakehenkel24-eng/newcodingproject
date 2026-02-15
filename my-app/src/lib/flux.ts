/**
 * Flux Image Generation Module
 * Uses Black Forest Labs Flux API to generate slide images
 */

import { ArchetypeId } from './llm/archetypes';

const FLUX_API_URL = 'https://api.bfl.ai/v1/flux-pro-1.1';

// === RATE LIMITING ===

export type UserTier = 'free' | 'pro' | 'enterprise';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  tier: UserTier;
}

const fluxRateLimits = new Map<string, RateLimitEntry>();

// Rate limits by tier
const RATE_LIMITS = {
  free: { limit: 5, windowMs: 24 * 60 * 60 * 1000 },      // 5 per day
  pro: { limit: 50, windowMs: 5 * 60 * 60 * 1000 },       // 50 per 5 hours
  enterprise: { limit: 200, windowMs: 60 * 60 * 1000 },    // 200 per hour
};

/**
 * Check if user has exceeded Flux rate limit
 * @param identifier - User ID
 * @param tier - User's subscription tier (free, pro, enterprise)
 */
export function checkFluxRateLimit(
  identifier: string, 
  tier: UserTier = 'free'
): { allowed: boolean; remaining: number; resetTime: number; tier: UserTier } {
  const now = Date.now();
  const config = RATE_LIMITS[tier];
  const entry = fluxRateLimits.get(identifier);
  
  // Check if tier changed or window expired
  if (!entry || now > entry.resetTime || entry.tier !== tier) {
    const resetTime = now + config.windowMs;
    fluxRateLimits.set(identifier, { count: 1, resetTime, tier });
    return { allowed: true, remaining: config.limit - 1, resetTime, tier };
  }
  
  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime, tier };
  }
  
  entry.count++;
  return { allowed: true, remaining: config.limit - entry.count, resetTime: entry.resetTime, tier };
}

/**
 * Get current rate limit status for display
 */
export function getFluxRateLimitStatus(
  identifier: string, 
  tier: UserTier = 'free'
): { used: number; remaining: number; resetTime: number; tier: UserTier; limit: number } {
  const now = Date.now();
  const config = RATE_LIMITS[tier];
  const entry = fluxRateLimits.get(identifier);
  
  if (!entry || now > entry.resetTime || entry.tier !== tier) {
    return { used: 0, remaining: config.limit, resetTime: now + config.windowMs, tier, limit: config.limit };
  }
  
  return { used: entry.count, remaining: config.limit - entry.count, resetTime: entry.resetTime, tier, limit: config.limit };
}

export interface FluxImageRequest {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  seed?: number;
  steps?: number;
  prompt_upsampling?: boolean;
  safety_tolerance?: number;
}

export interface FluxImageResponse {
  id: string;
  polling_url?: string;
  status?: 'Queued' | 'Processing' | 'Ready' | 'Failed';
  result?: {
    sample: string;
  };
  error?: string;
}

export interface SlideImageResult {
  imageUrl: string;
  imagePrompt: string;
  generationTimeMs: number;
}

/**
 * Generate an image using Black Forest Labs Flux API
 */
export async function generateSlideImage(
  prompt: string,
  options: {
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
    seed?: number;
    steps?: number;
    userId?: string; // For rate limiting
    tier?: UserTier; // User's subscription tier
  } = {}
): Promise<SlideImageResult> {
  // Check rate limit if userId provided
  const identifier = options.userId || 'anonymous';
  const tier = options.tier || 'free';
  const rateLimitCheck = checkFluxRateLimit(identifier, tier);
  const config = RATE_LIMITS[tier];
  
  if (!rateLimitCheck.allowed) {
    const resetDate = new Date(rateLimitCheck.resetTime);
    throw new Error(`Flux API rate limit exceeded. You have ${config.limit} generations per ${tier === 'free' ? 'day' : '5 hours'}. Resets at ${resetDate.toLocaleTimeString()}`);
  }

  console.log(`[Flux] Rate limit: ${rateLimitCheck.remaining} requests remaining (${tier} tier)`);
  const startTime = Date.now();
  
  const apiKey = process.env.FLUX_API_KEY;
  
  if (!apiKey) {
    throw new Error('FLUX_API_KEY is not configured. Please add it to your environment variables.');
  }

  const requestBody: FluxImageRequest = {
    prompt,
    negative_prompt: 'blurry text, illegible, distorted, artistic, colorful, decorative, web design, low quality, watermark, cartoon, illustration, gradient, shadow, 3d render, photo realistic, complex background',
    aspect_ratio: options.aspectRatio || '16:9',
    seed: options.seed,
    steps: options.steps || 30,
    prompt_upsampling: true,
    safety_tolerance: 2,
  };

  console.log('[Flux] Sending image generation request...');
  console.log('[Flux] Prompt:', prompt.substring(0, 200) + '...');

  const response = await fetch(FLUX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[Flux] Response status:', response.status);
  console.log('[Flux] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Flux] API error:', response.status, errorText);
    throw new Error(`Flux API error: ${response.status} - ${errorText}`);
  }

  const result: FluxImageResponse = await response.json();
  console.log('[Flux] Full response:', JSON.stringify(result, null, 2));
  console.log('[Flux] Response ID:', result.id, 'Polling URL:', result.polling_url);

  // If there's a polling URL, we need to poll for completion
  if (result.polling_url) {
    return await pollForCompletion(result.polling_url, apiKey, startTime);
  }

  // If status is directly available
  if (result.status === 'Failed') {
    throw new Error(`Flux image generation failed: ${result.error}`);
  }

  // If status is ready immediately
  if (result.status === 'Ready') {
    const generationTimeMs = Date.now() - startTime;
    console.log(`[Flux] Image generated in ${generationTimeMs}ms`);

    return {
      imageUrl: result.result?.sample || '',
      imagePrompt: prompt,
      generationTimeMs,
    };
  }

  // Fallback - shouldn't reach here but handle gracefully
  const generationTimeMs = Date.now() - startTime;
  console.log(`[Flux] Unexpected response, treating as ready`);
  return {
    imageUrl: result.result?.sample || '',
    imagePrompt: prompt,
    generationTimeMs,
  };
}

/**
 * Poll for image completion
 */
async function pollForCompletion(
  pollingUrl: string,
  apiKey: string,
  startTime: number,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<SlideImageResult> {
  console.log('[Flux] Starting polling at:', pollingUrl);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    
    const response = await fetch(pollingUrl, {
      headers: {
        'x-key': apiKey,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Flux] Polling error:', response.status, errorText);
      throw new Error(`Flux polling error: ${response.status} - ${errorText}`);
    }
    
    const result: FluxImageResponse = await response.json();
    console.log(`[Flux] Poll attempt ${attempt}:`, JSON.stringify(result));
    
    if (result.status === 'Ready') {
      const generationTimeMs = Date.now() - startTime;
      console.log(`[Flux] Image ready in ${generationTimeMs}ms`);
      
      return {
        imageUrl: result.result?.sample || '',
        imagePrompt: '',
        generationTimeMs,
      };
    }
    
    if (result.status === 'Failed') {
      throw new Error(`Flux image generation failed: ${result.error}`);
    }
    
    // Still processing, continue polling
    console.log(`[Flux] Still processing... attempt ${attempt}/${maxAttempts}`);
  }
  
  throw new Error('Flux image generation timed out after maximum attempts');
}

/**
 * Build a detailed image generation prompt from slide content
 * This creates a prompt that will generate a high-quality consulting slide
 */
export function buildSlideImagePrompt(
  archetypeId: ArchetypeId,
  title: string,
  logicalGroups: Array<{
    heading: string;
    bullets: string[];
    emphasis?: string;
  }>,
  dataPoints?: Array<{
    label: string;
    value: string | number;
    context?: string;
  }>,
  options: {
    density?: 'presentation' | 'read_style';
    audience?: string;
    source?: string;
    footnote?: string;
  } = {}
): string {
  const density = options.density || 'presentation';
  const audience = options.audience || 'executives';
  
  // Archetype-specific visual guidance
  const archetypeVisuals: Record<string, string> = {
    executive_summary: 'Professional summary slide with key points displayed in clean rectangular boxes, left-aligned content, minimalist design',
    situation_complication_resolution: 'Three-column layout showing Situation, Complication, and Resolution sections with clear visual separation',
    two_by_two_matrix: '2x2 matrix grid with labeled axes, quadrants filled with text, clean grid lines, professional charting style',
    comparison_table: 'Comparison table with columns for options and rows for criteria, alternating row colors, professional business formatting',
    before_after: 'Split slide design showing "Before" on left and "After" on right with transformation arrows between them',
    kpi_dashboard: 'Dashboard with large metric cards showing numbers prominently, trend indicators, clean sans-serif typography',
    waterfall_chart: 'Financial waterfall chart showing positive and negative changes leading to final value, clear connectors',
    trend_line: 'Line chart or area chart showing data over time with axis labels and data points visible',
    stacked_bar: 'Stacked bar chart showing composition breakdown, clear legend, professional color scheme',
    process_flow: 'Horizontal process flow with numbered steps in circles, connected by arrows, clean sequential layout',
    timeline_swimlane: 'Gantt chart or timeline with multiple swimlanes showing different workstreams, milestone markers',
    decision_tree: 'Flowchart-style decision tree with branching paths, diamond decision nodes, clear outcome boxes',
    issue_tree: 'Hierarchical tree diagram starting with root problem, branching to causes and sub-causes',
    three_pillar: 'Three equal-width vertical columns or sections with icons and titles, parallel card layout',
    grid_cards: '2x2 or 2x3 grid of cards with icons, titles, and descriptions in each cell',
    market_sizing: 'Concentric circles showing TAM, SAM, SOM with labels inside each level, hierarchical sizing',
    competitive_landscape: '2D positioning map with axes labels, competitor dots positioned appropriately, bubble sizes indicate market share',
    agenda_divider: 'Section divider slide with large section number, title, and subtle decorative elements',
  };

  const baseVisual = archetypeVisuals[archetypeId] || archetypeVisuals.executive_summary;
  
  // Build the content description
  let contentDescription = '';
  
  if (logicalGroups && logicalGroups.length > 0) {
    contentDescription = '\n\nSLIDE CONTENT:\n';
    logicalGroups.forEach((group, index) => {
      contentDescription += `\n${index + 1}. ${group.heading}:\n`;
      group.bullets.forEach(bullet => {
        contentDescription += `   - ${bullet}\n`;
      });
    });
  }
  
  if (dataPoints && dataPoints.length > 0) {
    contentDescription += '\n\nKEY METRICS:\n';
    dataPoints.forEach(dp => {
      const context = dp.context ? ` (${dp.context})` : '';
      contentDescription += `- ${dp.label}: ${dp.value}${context}\n`;
    });
  }

  const fullPrompt = `Generate a professional strategy consulting slide for ${audience}.

SLIDE TITLE: ${title}

ARCHETYPE: ${archetypeId.replace(/_/g, ' ')}
VISUAL STYLE: ${baseVisual}

${contentDescription}

DESIGN SPECIFICATIONS:
- Aspect ratio: 16:9 (1920x1080)
- Style: McKinsey/BCG/Bain quality presentation
- Color palette: Navy blue (#0F172A), white, light gray, teal accent (#0D9488), orange accent (#F97316)
- Typography: Clean sans-serif (Inter or similar), professional weights
- Layout: ${density === 'presentation' ? 'Clean with ample whitespace, bullet points concise' : 'Denser information layout'}
- Include footnote/source at bottom if provided: ${options.source || 'N/A'}
- Background: White or very light gray
- No gradient backgrounds, keep it clean and professional

The slide should look like a real PowerPoint slide that a top-tier strategy consultant would present. High quality, photorealistic rendering of a business presentation slide.`;

  return fullPrompt;
}

export type { ArchetypeId };
