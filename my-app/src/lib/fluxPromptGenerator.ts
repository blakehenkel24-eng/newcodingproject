/**
 * Flux Prompt Generator
 * Uses GPT-4o to generate detailed, creative prompts for Flux image generation
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FluxBlueprint {
  prompt: string;
  title: {
    text: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'center';
    style: string;
  };
  content: {
    type: 'bullets' | 'columns' | 'grid' | 'timeline' | 'matrix' | 'cards' | 'chart';
    layout: string;
    elements: Array<{
      type: string;
      text: string;
      position: string;
      style: string;
    }>;
  };
  visualStyle: {
    colorPalette: string;
    typography: string;
    spacing: string;
    accents: string;
  };
  archetype: string;
}

const FLUX_PROMPT_SYSTEM = `You are an expert at creating detailed image generation prompts for AI slide generators. Your task is to generate a precise, creative blueprint that will be handed off to Flux 2.0 to generate a photorealistic strategy consulting slide.

## CORE PRINCIPLE

The slide you describe MUST look like a real McKinsey, BCG, or Bain slide. Not "AI-generated art" - a real PowerPoint slide screenshot.

## CRITICAL REQUIREMENTS

1. **EXACT TEXT**: Every piece of text that should appear on the slide MUST be specified exactly as it should appear. Include the FULL text, not abbreviations.
2. **REALISTIC LAYOUT**: Think about how actual consulting slides are structured - not artistic arrangements
3. **PROFESSIONAL APPEARANCE**: Clean, minimal, corporate - not creative or decorative
4. **LEGIBLE TEXT**: All text must be readable at slide size (16-18pt minimum for body)

## SLIDE ARCHETYPES AND THEIR LAYOUTS

### 1. EXECUTIVE SUMMARY
- Title at top (left-aligned)
- 3-4 key insight boxes below in a row or stacked
- Each box: title (bold) + 1-2 lines of body text
- Optional: footnote at bottom left

### 2. TWO-BY-TWO MATRIX
- Title at top
- 2x2 grid in center with visible axis lines
- X-axis and Y-axis labels OUTSIDE the grid
- Each quadrant: label at corner + 2-3 short bullet points inside
- Grid lines should be thin and professional

### 3. COMPARISON TABLE
- Title at top
- Table with 2-4 columns, multiple rows
- Column headers: BOLD, light gray background
- Cell content: regular weight
- Alternating row colors (white/light gray)

### 4. KPI DASHBOARD
- Title at top
- 3-5 metric boxes in a horizontal row
- Each box: LARGE number (32-48pt), smaller label below
- Trend indicator: up arrow (green) or down arrow (red)

### 5. PROCESS FLOW / HORIZONTAL FLOW
- Title at top
- 4-6 steps in horizontal sequence
- Each step: numbered circle (20-24pt) + title + short description
- Arrows between steps: thin, black, horizontal

### 6. STACKED BAR CHART
- Title at top
- Horizontal or vertical stacked bar
- Legend below or to the side
- Values labeled on each segment
- Clean axis lines

### 7. WATERFALL CHART
- Title at top
- Horizontal waterfall showing + and - changes
- Starting bar, intermediate floating bars, ending bar
- Connector lines between bars
- Values above each bar

### 8. LINE CHART
- Title at top
- X-axis: time periods
- Y-axis: metric values
- Line with data points marked
- Legend if multiple lines

### 9. TIMELINE / SWIMLANE
- Title at top
- Horizontal timeline with date markers
- Multiple swimlanes (rows) for different workstreams
- Milestones marked with diamonds/stars
- Swimlane labels on left

### 10. BEFORE / AFTER (TRANSFORMATION)
- Split slide: left half = "Current State", right half = "Future State"
- Title: "From [Current] to [Future]"
- Left: pain points, challenges (red/orange indicators)
- Right: benefits, outcomes (green/teal indicators)
- Transformation arrow between halves

### 11. THREE PILLAR / THREE COLUMN
- Title at top
- Three equal-width vertical columns
- Each column: icon + title + 2-3 bullet points
- Columns evenly spaced with dividers

### 12. ISSUE TREE / PROBLEM TREE
- Title at top
- Root problem box at top center
- Branching lines down to 2-4 sub-issues
- Each sub-issue branches to 2-3 causes
- Hierarchical boxes connected by lines

### 13. MARKET SIZING (TAM/SAM/SOM)
- Title at top
- Three concentric circles (largest outside, smallest inside)
- Labels inside each circle: TAM, SAM, SOM with values
- Methodology note at bottom

### 14. COMPETITIVE LANDSCAPE
- Title at top
- 2D positioning map with X and Y axes
- Axis labels (e.g., "Innovation" vs "Cost Efficiency")
- Bubble positions for competitors
- Bubble size = market share
- Your company highlighted

### 15. SCR (SITUATION-COMPLICATION-RESOLUTION)
- Title at top
- Three horizontal panels or columns
- Left: "Situation" - context
- Center: "Complication" - problem
- Right: "Resolution" - solution
- Arrow showing flow left to right

## DESIGN SYSTEM (MUST FOLLOW)

### Colors
- Background: White (#FFFFFF) or very light gray (#F8FAFC)
- Primary text: Navy (#0F172A)
- Secondary text: Slate gray (#475569)
- Accent 1: Teal (#0D9488)
- Accent 2: Orange (#F97316)
- Positive: Green (#22C55E)
- Negative: Red (#EF4444)
- Borders: Light gray (#E2E8F0)

### Typography
- Font: Inter, Helvetica, or system sans-serif
- Title: 28-36pt, bold, navy
- Headings: 18-24pt, semibold, navy
- Body: 14-18pt, regular, slate
- Captions: 12pt, regular, gray

### Spacing
- Generous whitespace
- 24-48pt padding on edges
- 16-24pt between major sections
- 8-12pt between related elements

### Visual Effects
- Subtle shadows on cards (0 2px 4px rgba(0,0,0,0.1))
- Thin borders (1px solid #E2E8F0)
- No gradients - flat design
- Clean geometric shapes

## OUTPUT FORMAT

Return a JSON object with this exact structure:
{
  "title": {
    "text": "EXACT TITLE TEXT",
    "position": "top-left|top-center|top-right|center",
    "style": "bold 32pt navy sans-serif"
  },
  "content": {
    "type": "bullets|columns|grid|timeline|matrix|cards|chart",
    "layout": "DETAILED LAYOUT DESCRIPTION",
    "elements": [
      {
        "type": "box|card|metric|arrow|text|line",
        "text": "EXACT TEXT TO DISPLAY",
        "position": "top-left|top-center|top-right|bottom-left|center|row-1-col-2|etc",
        "style": "16pt bold navy"
      }
    ]
  },
  "visualStyle": {
    "colorPalette": "white background, navy text, teal accents",
    "typography": "Inter/sans-serif, professional weights",
    "spacing": "generous 32pt padding, 24pt between sections",
    "accents": "teal #0D9488 for highlights, orange #F97316 for emphasis"
  },
  "archetype": "executive_summary|two_by_two_matrix|etc"
}

IMPORTANT: The "text" fields must contain the EXACT text that should appear on the slide. Do not use placeholder text.`;

export async function generateFluxBlueprint(
  structuredContent: {
    title: string;
    coreMessage: string;
    logicalGroups: Array<{
      heading: string;
      bullets: string[];
      emphasis?: string;
    }>;
    dataPoints?: Array<{
      label: string;
      value: string | number;
      context?: string;
    }>;
    recommendedArchetype: string;
    source?: string;
    footnote?: string;
  },
  options: {
    density?: 'presentation' | 'read_style';
    audience?: string;
  } = {}
): Promise<FluxBlueprint> {
  const userPrompt = `Generate a detailed Flux blueprint for a slide with these specifications:

SLIDE TYPE: ${structuredContent.recommendedArchetype}
TITLE: ${structuredContent.title}
CORE MESSAGE: ${structuredContent.coreMessage}
DENSITY: ${options.density || 'presentation'}
AUDIENCE: ${options.audience || 'executives'}

LOGICAL GROUPS/CONTENT:
${structuredContent.logicalGroups.map((group, i) => `
Group ${i + 1}: ${group.heading}
${group.bullets.map((b, j) => `  - ${b}`).join('\n')}
`).join('').trim()}

${structuredContent.dataPoints && structuredContent.dataPoints.length > 0 ? `
KEY METRICS:
${structuredContent.dataPoints.map(dp => `- ${dp.label}: ${dp.value}${dp.context ? ` (${dp.context})` : ''}`).join('\n')}
` : ''}

${structuredContent.source ? `SOURCE: ${structuredContent.source}` : ''}
${structuredContent.footnote ? `FOOTNOTE: ${structuredContent.footnote}` : ''}

Now generate a detailed blueprint JSON that specifies EXACTLY what text should appear on the slide, where each element should be positioned, and what visual style to use. Be creative and specific.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: FLUX_PROMPT_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    const parsed = JSON.parse(content);
    
    // Validate and ensure required fields
    const blueprint: FluxBlueprint = {
      prompt: parsed.prompt || generatePromptFromBlueprint(parsed),
      title: parsed.title || { text: structuredContent.title, position: 'top-left', style: 'bold 32pt navy' },
      content: parsed.content || { type: 'bullets', layout: 'vertical list', elements: [] },
      visualStyle: parsed.visualStyle || {
        colorPalette: 'white background, navy text, teal accents',
        typography: 'Inter/sans-serif',
        spacing: 'generous',
        accents: 'teal #0D9488',
      },
      archetype: parsed.archetype || structuredContent.recommendedArchetype,
    };

    return blueprint;
  } catch (error) {
    console.error('Error generating Flux blueprint:', error);
    throw error;
  }
}

/**
 * Generate a Flux prompt string from a blueprint
 * Following the PRD specification exactly (Section 8, Step 2)
 */
export function generateFluxPromptFromBlueprint(blueprint: FluxBlueprint): string {
  const parts: string[] = [];

  // Main directive - concise and direct
  parts.push(`Professional management consulting slide. 16:9 aspect ratio, 1920x1080.`);
  parts.push(``);

  // Visual description from blueprint - concise
  parts.push(blueprint.content.layout);
  parts.push(``);

  // Title - exact text
  parts.push(`Title: "${blueprint.title.text}"`);
  parts.push(``);

  // Content elements - list exactly what's on the slide
  if (blueprint.content.elements && blueprint.content.elements.length > 0) {
    blueprint.content.elements.forEach((el) => {
      parts.push(`- ${el.text}`);
    });
    parts.push(``);
  }

  // Style requirements - concise
  parts.push(`Style: White background. Dark navy text. Arial/Calibri font. Clean PowerPoint. McKinsey/BCG/Bain quality.`);
  parts.push(`Legible text at all sizes. Sharp, crisp.`);
  parts.push(`No decorative elements, no gradients.`);

  // Density
  const spacing = blueprint.visualStyle.spacing;
  if (spacing === 'dense' || spacing === 'compact') {
    parts.push(`Read-style: denser layout, more details.`);
  } else {
    parts.push(`Presentation-style: sparser layout, larger fonts.`);
  }

  return parts.join('\n');
}

/**
 * Fallback: generate prompt from structured content if LLM fails
 */
function generatePromptFromBlueprint(parsed: Record<string, unknown>): string {
  const title = (parsed.title as { text?: string })?.text || 'Slide';
  const content = parsed.content as { elements?: Array<{ text: string; position: string }> } | undefined;
  
  let prompt = `Generate a professional strategy consulting slide titled "${title}". `;
  
  if (content?.elements) {
    prompt += 'Include these elements: ';
    prompt += content.elements.map(e => `"${e.text}" at ${e.position}`).join(', ');
  }
  
  prompt += '. Style: White background, navy text, teal accents, Inter font, clean PowerPoint aesthetic, 16:9 aspect ratio, McKinsey/BCG/Bain quality.';
  
  return prompt;
}
