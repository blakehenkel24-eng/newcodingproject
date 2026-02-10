/**
 * Stage 1: Content Analysis & Structuring
 * Transforms raw user input into structured content following MECE principles
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { ArchetypeId } from './archetypes';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// === TYPES ===

export interface DataPoint {
  label: string;
  value: string | number;
  unit?: string;
  context?: string; // e.g., "+20% YoY", "vs target"
}

export interface LogicalGroup {
  heading: string;
  bullets: string[];
  emphasis?: 'high' | 'medium' | 'low';
}

export interface StructuredContent {
  coreMessage: string;
  contentType: string;
  dataPoints: DataPoint[];
  logicalGroups: LogicalGroup[];
  supportingEvidence: string[];
  recommendedArchetype: ArchetypeId;
  complexityScore: number; // 1-5
  title: string;
  subtitle?: string;
  footnote?: string;
  source?: string;
}

// === SCHEMAS ===

const DataPointSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  context: z.string().optional(),
});

const LogicalGroupSchema = z.object({
  heading: z.string(),
  bullets: z.array(z.string()).max(5),
  emphasis: z.enum(['high', 'medium', 'low']).optional(),
});

const StructuredContentSchema = z.object({
  coreMessage: z.string(),
  contentType: z.string(),
  dataPoints: z.array(DataPointSchema).max(10),
  logicalGroups: z.array(LogicalGroupSchema).max(4),
  supportingEvidence: z.array(z.string()).max(5),
  recommendedArchetype: z.enum([
    'executive_summary',
    'situation_complication_resolution',
    'two_by_two_matrix',
    'comparison_table',
    'before_after',
    'kpi_dashboard',
    'waterfall_chart',
    'trend_line',
    'stacked_bar',
    'process_flow',
    'timeline_swimlane',
    'decision_tree',
    'issue_tree',
    'three_pillar',
    'grid_cards',
    'market_sizing',
    'competitive_landscape',
    'agenda_divider',
  ]),
  complexityScore: z.number().min(1).max(5),
  title: z.string().max(120),
  subtitle: z.string().optional(),
  footnote: z.string().optional(),
  source: z.string().optional(),
});

// === SYSTEM PROMPT ===

const CONTENT_ANALYZER_PROMPT = `You are an elite strategy consultant from McKinsey/BCG/Bain creating partner-quality presentation slides.

## MISSION
Transform unstructured business content into a structured format that follows consulting best practices.

## THE PYRAMID PRINCIPLE (NON-NEGOTIABLE)
Structure: Main Point → Supporting Arguments → Data
- Lead with the conclusion/answer
- Group supporting arguments (MECE)
- Present data as evidence

## TITLE ENGINEERING FORMULA (CRITICAL)
Every slide title MUST follow: [WHAT happened/is true] + [SO WHAT it means] + [NOW WHAT to do about it]

**Title Rules:**
- Maximum 120 characters (2 lines)
- Must contain an INSIGHT, not just a topic
- Must be actionable — reader knows what to think/do after reading
- Use strong verbs: "accelerate," "capture," "mitigate," "prioritize," "drive"
- Avoid weak verbs: "overview," "update," "summary," "discussion"
- Include KEY NUMBERS when possible

**Examples:**
❌ Bad: "Q3 Revenue Overview" (topic only)
✅ Good: "Revenue declined 12% in Q3 driven by mid-market churn, requiring immediate retention intervention"

❌ Bad: "Market Analysis"
✅ Good: "Three emerging segments represent $2.4B untapped opportunity, with Segment A offering fastest path to capture"

## MECE STRUCTURING RULES
1. Every piece of information belongs to exactly ONE group
2. Groups must cover ALL information (no gaps)
3. Target 3-4 groups per slide (never more than 4)
4. Each bullet within a group: 1-2 lines max (90 characters)
5. Lead each group with the most impactful point
6. Sort groups by importance (most important first)

## LOGICAL GROUPS - MANDATORY (CRITICAL)
The \\\`logicalGroups\\\` array MUST be populated with content from the input. NEVER return an empty array.

For each key theme in the context, create a group with:
- **heading**: A descriptive title (5-8 words)
- **bullets**: 2-5 specific points extracted from the context
- **emphasis**: "high" for the most important group, "medium" or "low" for others

Example for market expansion content:
���json
{
  "logicalGroups": [
    {
      "heading": "Market Opportunity",
      "bullets": [
        "$2.1B addressable market in EU coffee segment",
        "67% of EU consumers prioritize sustainability",
        "Nespresso dominates with 55% market share"
      ],
      "emphasis": "high"
    },
    {
      "heading": "Entry Strategy",
      "bullets": [
        "Phased rollout starting with Germany and Netherlands",
        "Localized sustainability messaging required",
        "Strategic logistics partnerships critical"
      ],
      "emphasis": "medium"
    }
  ]
}
���

## CONTENT TYPE CLASSIFICATION
Select the content type that best describes the input:
- "comparison" — evaluating options against criteria
- "trend" — time-series data showing change
- "process" — sequential steps or workflow
- "hierarchy" — problem breakdown or categorization
- "metrics" — KPIs or performance indicators
- "recommendation" — proposed action with rationale
- "analysis" — structured examination of a situation

## ARCHETYPE SELECTION GUIDE
Based on content, recommend one of these archetypes:

**Insight & Summary:**
- "executive_summary" — Single key finding with 3-4 supporting points
- "situation_complication_resolution" — Problem framing with recommended action

**Comparison & Analysis:**
- "two_by_two_matrix" — Portfolio prioritization (effort vs impact)
- "comparison_table" — Side-by-side option evaluation
- "before_after" — Current vs future state transformation

**Data & Metrics:**
- "kpi_dashboard" — 3-5 metric callouts with trends
- "waterfall_chart" — Financial bridge or variance analysis
- "trend_line" — Time-series showing change over time
- "stacked_bar" — Composition breakdown

**Process & Flow:**
- "process_flow" — Sequential steps (3-6)
- "timeline_swimlane" — Multi-workstream roadmap
- "decision_tree" — Branching logic/scenarios

**Structure & Hierarchy:**
- "issue_tree" — Problem decomposition (MECE)
- "three_pillar" — Three parallel themes
- "grid_cards" — 2x2 or 2x3 capability/feature grid

**Market & Financial:**
- "market_sizing" — TAM/SAM/SOM analysis
- "competitive_landscape" — Positioning map

**Navigation:**
- "agenda_divider" — Section divider or table of contents

## COMPLEXITY SCORING (1-5)
1 = Simple: Single metric or 2-3 bullet points
2 = Basic: 3-4 metrics or simple comparison
3 = Moderate: Multiple data points with relationships
4 = Complex: Multiple dimensions or interdependencies
5 = Very Complex: Requires significant synthesis

## OUTPUT FORMAT
Respond with valid JSON only:
{
  "coreMessage": "The single most important insight (1 sentence)",
  "contentType": "comparison|trend|process|hierarchy|metrics|recommendation|analysis",
  "dataPoints": [
    { "label": "Metric name", "value": 100, "unit": "$", "context": "+20% YoY" }
  ],
  "logicalGroups": [
    { "heading": "Group title", "bullets": ["Point 1", "Point 2"], "emphasis": "high" }
  ],
  "supportingEvidence": ["Evidence point 1", "Evidence point 2"],
  "recommendedArchetype": "archetype_id",
  "complexityScore": 3,
  "title": "Action-oriented title with insight and numbers",
  "subtitle": "Optional subtitle for additional context",
  "footnote": "Source or caveat note",
  "source": "Data source attribution"
}

## QUALITY CHECKLIST (MUST PASS)
- [ ] Title contains WHAT + SO WHAT + NOW WHAT
- [ ] Title includes key numbers when applicable
- [ ] Logical groups are MECE (no overlap, no gaps)
- [ ] Maximum 4 groups, maximum 5 bullets per group
- [ ] Bullets are 1-2 lines max
- [ ] Core message answers "so what?"
- [ ] Recommended archetype fits the content structure`;

// === MAIN FUNCTION ===

export async function analyzeContent(
  text: string,
  message: string,
  data?: string,
  fileContent?: string,
  preferredModel: 'openai' | 'gemini' = 'openai'
): Promise<{ structured: StructuredContent; modelUsed: string }> {
  const userPrompt = buildUserPrompt(text, message, data, fileContent);

  try {
    if (preferredModel === 'openai') {
      return await analyzeWithOpenAI(userPrompt);
    } else {
      return await analyzeWithGemini(userPrompt);
    }
  } catch (error) {
    // Fallback to Gemini if OpenAI fails
    if (preferredModel === 'openai') {
      console.log('OpenAI failed, falling back to Gemini');
      return await analyzeWithGemini(userPrompt);
    }
    throw error;
  }
}

function buildUserPrompt(
  text: string,
  message: string,
  data?: string,
  fileContent?: string
): string {
  let prompt = `CONTEXT/BACKGROUND:\n${text}\n\nKEY MESSAGE/TAKEAWAY:\n${message}`;

  if (data) {
    prompt += `\n\nDATA/METRICS:\n${data}`;
  }

  if (fileContent) {
    prompt += `\n\nUPLOADED FILE CONTENT:\n${fileContent}`;
  }

  prompt += `\n\nTransform this into structured content following consulting best practices. Respond with valid JSON only.`;

  return prompt;
}

async function analyzeWithOpenAI(
  userPrompt: string
): Promise<{ structured: StructuredContent; modelUsed: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: CONTENT_ANALYZER_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 2500,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  const parsed = JSON.parse(content);
  const validated = StructuredContentSchema.parse(parsed);

  return {
    structured: validated as StructuredContent,
    modelUsed: 'gpt-4o',
  };
}

async function analyzeWithGemini(
  userPrompt: string
): Promise<{ structured: StructuredContent; modelUsed: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const fullPrompt = `${CONTENT_ANALYZER_PROMPT}\n\n${userPrompt}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2500,
    },
  });

  const content = result.response.text();

  // Extract JSON from the response (Gemini might wrap it in markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gemini returned invalid JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = StructuredContentSchema.parse(parsed);

  return {
    structured: validated as StructuredContent,
    modelUsed: 'gemini-2.0-flash-exp',
  };
}

// === UTILITY FUNCTIONS ===

/**
 * Apply MECE validation to logical groups
 * Returns warnings if groups may not be MECE
 */
export function validateMECE(groups: LogicalGroup[]): string[] {
  const warnings: string[] = [];

  // Check for empty groups
  const emptyGroups = groups.filter((g) => g.bullets.length === 0);
  if (emptyGroups.length > 0) {
    warnings.push(`${emptyGroups.length} group(s) have no bullets`);
  }

  // Check for single-item groups (potential orphan)
  const singleItemGroups = groups.filter((g) => g.bullets.length === 1);
  if (singleItemGroups.length > 0) {
    warnings.push(`${singleItemGroups.length} group(s) have only one bullet — consider merging`);
  }

  // Check for too many groups
  if (groups.length > 4) {
    warnings.push(`Too many groups (${groups.length}) — consider consolidating to 3-4 MECE categories`);
  }

  // Check total bullet count
  const totalBullets = groups.reduce((sum, g) => sum + g.bullets.length, 0);
  if (totalBullets > 15) {
    warnings.push(`Too many total bullets (${totalBullets}) — slides should have maximum 12-15 bullets`);
  }

  return warnings;
}

/**
 * Generate a consulting-quality title using the WHAT + SO WHAT + NOW WHAT formula
 */
export function generateTitle(
  what: string,
  soWhat: string,
  nowWhat: string,
  maxLength: number = 120
): string {
  const fullTitle = `${what}, ${soWhat}, ${nowWhat}`;

  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  // Truncate prioritizing WHAT and SO WHAT
  const shortened = `${what}, ${soWhat}`;
  if (shortened.length <= maxLength) {
    return shortened;
  }

  // Just use WHAT with SO WHAT if possible
  const minimal = `${what} — ${soWhat}`;
  if (minimal.length <= maxLength) {
    return minimal;
  }

  // Truncate with ellipsis
  return `${what.slice(0, maxLength - 3)}...`;
}

/**
 * Format numbers in consulting style
 */
export function formatConsultingNumber(
  value: number,
  unit?: string,
  decimals: number = 1
): string {
  const absValue = Math.abs(value);
  let formatted: string;

  if (absValue >= 1_000_000_000) {
    formatted = `${(value / 1_000_000_000).toFixed(decimals)}B`;
  } else if (absValue >= 1_000_000) {
    formatted = `${(value / 1_000_000).toFixed(decimals)}M`;
  } else if (absValue >= 1_000) {
    formatted = `${(value / 1_000).toFixed(decimals)}K`;
  } else {
    formatted = value.toFixed(decimals);
  }

  if (unit) {
    if (unit === '$') {
      return `$${formatted}`;
    } else if (unit === '%') {
      return `${value.toFixed(decimals)}%`;
    } else {
      return `${formatted} ${unit}`;
    }
  }

  return formatted;
}

/**
 * Extract trend from text (up/down/neutral)
 */
export function extractTrend(text: string): { direction: 'up' | 'down' | 'neutral'; value?: string } {
  const lowerText = text.toLowerCase();

  // Up indicators
  if (/\b(up|increase|growth|rise|gain|improve|higher|positive|\+)\b/.test(lowerText)) {
    const match = text.match(/[\+]?[\d]+%?/);
    return { direction: 'up', value: match?.[0] };
  }

  // Down indicators
  if (/\b(down|decrease|decline|fall|drop|loss|lower|negative|\-)\b/.test(lowerText)) {
    const match = text.match(/[\-][\d]+%?/);
    return { direction: 'down', value: match?.[0] };
  }

  return { direction: 'neutral' };
}
