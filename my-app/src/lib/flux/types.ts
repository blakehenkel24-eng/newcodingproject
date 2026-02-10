/**
 * Flux 2.0 Image Generation Types
 * Completely separate from HTML-based slide generation
 */

import { ArchetypeId, TargetAudience, DensityMode } from '@/types/slide';

export interface FluxGenerationRequest {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType: ArchetypeId | 'auto';
  audience: TargetAudience;
  density: DensityMode;
}

export interface FluxImagePrompt {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: '16:9' | '4:3';
  style: 'mckinsey' | 'bcg' | 'bain' | 'modern';
  guidanceScale: number;
  numInferenceSteps: number;
}

export interface FluxGenerationResult {
  slideId: string;
  imageUrl: string;
  imageBase64?: string;
  prompt: FluxImagePrompt;
  archetypeId: ArchetypeId;
  generationTimeMs: number;
  modelUsed: string;
  seed?: number;
}

export interface FluxProviderConfig {
  provider: 'replicate' | 'fal' | 'together' | 'bfl';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

// Extended archetype definitions for Flux with visual guidance
export interface FluxArchetypeConfig {
  id: ArchetypeId;
  visualStyle: string;
  layoutGuidance: string;
  colorPalette: string;
  typographyStyle: string;
  examplePrompt: string;
}

export const FLUX_ARCHETYPE_CONFIGS: Record<ArchetypeId, FluxArchetypeConfig> = {
  executive_summary: {
    id: 'executive_summary',
    visualStyle: 'Clean, minimal, single focal point with 3-4 supporting elements',
    layoutGuidance: 'Title at top, large central insight, supporting points below in horizontal row',
    colorPalette: 'Professional navy blue, white, teal accent, subtle gray',
    typographyStyle: 'Bold sans-serif headline, clean body text, data numbers in monospace',
    examplePrompt: 'Executive summary slide, McKinsey style, dark navy background, large white headline at top reading "Q3 Revenue Up 23%", three white metric cards below showing "$45M Revenue", "12% Margin", "+850 Customers", teal accent highlights, clean sans-serif typography, professional consulting presentation, 16:9 aspect ratio, minimal, high contrast',
  },
  situation_complication_resolution: {
    id: 'situation_complication_resolution',
    visualStyle: 'Three-panel horizontal layout with clear visual separation',
    layoutGuidance: 'Three equal columns: Situation (green), Complication (amber), Resolution (teal)',
    colorPalette: 'Situation: sage green, Complication: warm amber, Resolution: teal blue',
    typographyStyle: 'Section headers bold, body text clean, resolution emphasized',
    examplePrompt: 'SCR framework slide, three horizontal panels, left panel green titled "Situation", center panel amber titled "Complication", right panel teal titled "Resolution", McKinsey consulting style, white text, icons in each panel, connecting arrow between panels, dark background, professional, 16:9',
  },
  two_by_two_matrix: {
    id: 'two_by_two_matrix',
    visualStyle: '2x2 grid quadrants with clear axis labels and positioned items',
    layoutGuidance: 'X and Y axes with four distinct quadrants, items as dots or bubbles',
    colorPalette: 'Four distinct quadrant colors, neutral background, accent for selected items',
    typographyStyle: 'Axis labels prominent, quadrant titles clear, item labels small',
    examplePrompt: '2x2 portfolio matrix, Impact vs Effort axes, four quadrants labeled "Quick Wins", "Major Projects", "Fill-ins", "Thankless Tasks", scattered colored dots representing initiatives, McKinsey style, dark navy background, white grid lines, teal and orange accents, professional consulting chart, 16:9',
  },
  comparison_table: {
    id: 'comparison_table',
    visualStyle: 'Clean table with alternating rows, clear headers, highlighted recommendation',
    layoutGuidance: 'Header row with option names, criteria in left column, checkmarks/ratings in cells',
    colorPalette: 'White/light background, dark headers, green checkmarks, red X marks, yellow highlight for recommended',
    typographyStyle: 'Bold headers, clean data cells, emphasis on recommended column',
    examplePrompt: 'Comparison table slide, three columns comparing "Option A", "Option B", "Option C", rows for criteria like "Cost", "Speed", "Quality", green checkmarks and red X marks, recommended option highlighted in yellow, McKinsey consulting style, professional table design, dark background, 16:9',
  },
  before_after: {
    id: 'before_after',
    visualStyle: 'Two-column split with transformation arrow',
    layoutGuidance: 'Left: current state with pain points (muted/red), Right: future state with benefits (vibrant/green)',
    colorPalette: 'Before: muted grays and reds, After: vibrant greens and teals',
    typographyStyle: 'Clear Before/After headers, bullet points contrasting states',
    examplePrompt: 'Before and after transformation slide, split screen, left side muted gray "Before: Manual Processes" with red X icons, right side vibrant teal "After: Automation" with green checkmarks, large arrow connecting left to right, McKinsey consulting style, professional, dark background, 16:9',
  },
  kpi_dashboard: {
    id: 'kpi_dashboard',
    visualStyle: 'Large metric cards, bold numbers, trend indicators',
    layoutGuidance: '3-5 large metric cards in horizontal row, each with value, label, trend arrow',
    colorPalette: 'Dark background, white large numbers, green up arrows, red down arrows',
    typographyStyle: 'Huge bold numbers (60pt+), small labels, trend icons',
    examplePrompt: 'KPI dashboard slide, four large metric cards showing "$12.5M" with green up arrow, "8.2%" with green up, "94%" neutral, "$450K" with red down, large bold white numbers on dark navy background, small labels below each, McKinsey style, professional metrics dashboard, 16:9',
  },
  waterfall_chart: {
    id: 'waterfall_chart',
    visualStyle: 'Cascading bars showing build-up from start to end',
    layoutGuidance: 'Horizontal waterfall with start bar, intermediate steps, end bar',
    colorPalette: 'Start/end in dark blue, increases in green, decreases in red',
    typographyStyle: 'Value labels on each bar, connector lines, total emphasized',
    examplePrompt: 'Waterfall bridge chart, starting bar "$100M", green bars for "+ Revenue" and "+ New Products", red bar for "- Costs", ending bar "$127M", connector lines between bars, value labels on each, McKinsey financial style, dark background, professional chart, 16:9',
  },
  trend_line: {
    id: 'trend_line',
    visualStyle: 'Line chart with clear time axis, data points, trend line',
    layoutGuidance: 'X-axis time periods, Y-axis values, 1-3 lines with legend',
    colorPalette: 'Dark background, bright line colors (teal, orange, yellow), grid lines subtle',
    typographyStyle: 'Axis labels clear, data points annotated, legend positioned',
    examplePrompt: 'Trend line chart, time series from 2020-2024, teal line showing upward trend from 100 to 245, data points marked with circles, subtle grid lines, Y-axis labeled "Revenue ($M)", X-axis years, McKinsey chart style, dark navy background, professional data visualization, 16:9',
  },
  stacked_bar: {
    id: 'stacked_bar',
    visualStyle: 'Stacked bars showing composition across categories',
    layoutGuidance: 'Multiple bars, each segmented by colored components, legend',
    colorPalette: 'Distinct segment colors, consistent across bars, dark background',
    typographyStyle: 'Category labels below bars, segment values inside or above',
    examplePrompt: 'Stacked bar chart, three bars for Q1 Q2 Q3, each bar segmented into "Product A" (teal), "Product B" (orange), "Product C" (yellow), percentages labeled on segments, legend on right, McKinsey style, dark navy background, professional composition chart, 16:9',
  },
  process_flow: {
    id: 'process_flow',
    visualStyle: 'Horizontal chevron or arrow flow with numbered steps',
    layoutGuidance: '4-6 steps in horizontal flow, connected by arrows',
    colorPalette: 'Sequential color progression, teal to blue gradient',
    typographyStyle: 'Step numbers prominent, titles bold, descriptions small',
    examplePrompt: 'Process flow diagram, five horizontal chevron shapes connected by arrows, numbered 1-5, teal gradient from light to dark, icons in each step, text below each chevron, McKinsey consulting style, dark background, professional process diagram, 16:9',
  },
  timeline_swimlane: {
    id: 'timeline_swimlane',
    visualStyle: 'Swimlane diagram with time axis and workstream rows',
    layoutGuidance: 'Horizontal timeline, vertical swimlanes for workstreams, milestones marked',
    colorPalette: 'Each swimlane different color, milestone diamonds in accent color',
    typographyStyle: 'Time periods in header, workstream names on left, activity labels in bars',
    examplePrompt: 'Timeline swimlane, four horizontal lanes labeled "Engineering", "Marketing", "Sales", "Operations", Q1-Q4 time axis across top, colored bars showing activity duration, diamond milestones, Gantt-style chart, McKinsey project management style, dark background, 16:9',
  },
  decision_tree: {
    id: 'decision_tree',
    visualStyle: 'Branching tree diagram from root question to outcomes',
    layoutGuidance: 'Root at top, branches downward, outcomes at bottom',
    colorPalette: 'Decision nodes in amber, outcome nodes in teal or red/green',
    typographyStyle: 'Questions in nodes, yes/no on branches, outcomes clear',
    examplePrompt: 'Decision tree diagram, diamond-shaped decision nodes, branching yes/no paths, rectangular outcome boxes at bottom, amber decision nodes, teal and red outcome nodes, McKinsey consulting style, dark navy background, professional logic tree, 16:9',
  },
  issue_tree: {
    id: 'issue_tree',
    visualStyle: 'Hierarchical tree breaking down problem into sub-issues',
    layoutGuidance: 'Root problem left, branches rightward into MECE structure',
    colorPalette: 'Hierarchy in shades of same color, darker at root',
    typographyStyle: 'Root bold, branches clear hierarchy, sub-issues smaller',
    examplePrompt: 'Issue tree diagram, root problem on left "Declining Revenue", branching into three main issues "Volume", "Price", "Mix", each with sub-issues, MECE structure, McKinsey problem-solving style, dark background, hierarchical tree layout, 16:9',
  },
  three_pillar: {
    id: 'three_pillar',
    visualStyle: 'Three equal vertical pillars with icons',
    layoutGuidance: 'Three columns with icons at top, titles, descriptions',
    colorPalette: 'Each pillar distinct accent color on dark background',
    typographyStyle: 'Large icons, bold pillar titles, descriptive text',
    examplePrompt: 'Three pillar slide, three vertical columns with large icons at top, titles "Strategy", "Execution", "Results", descriptive text below each, teal orange and blue accents, McKinsey strategic framework style, dark navy background, professional, 16:9',
  },
  grid_cards: {
    id: 'grid_cards',
    visualStyle: '2x2 or 2x3 grid of content cards with icons',
    layoutGuidance: 'Equal-sized cards in grid, each with icon, title, description',
    colorPalette: 'Cards with subtle borders, accent icons, consistent background',
    typographyStyle: 'Card titles bold, body text concise, icons large',
    examplePrompt: 'Grid cards layout, 2x3 grid of six cards, each with icon, title, short description, subtle card borders, icons in teal, McKinsey capability overview style, dark navy background, professional grid design, 16:9',
  },
  market_sizing: {
    id: 'market_sizing',
    visualStyle: 'Funnel or nested circles showing TAM/SAM/SOM',
    layoutGuidance: 'Largest to smallest market, each level labeled with size',
    colorPalette: 'Concentric circles or funnel in gradient shades',
    typographyStyle: 'Large market size numbers, TAM/SAM/SOM labels',
    examplePrompt: 'Market sizing slide, three concentric circles labeled TAM $50B, SAM $12B, SOM $800M, largest circle outer in light teal, smallest inner in dark teal, McKinsey market analysis style, dark background, professional market visualization, 16:9',
  },
  competitive_landscape: {
    id: 'competitive_landscape',
    visualStyle: '2D scatter plot positioning competitors on two axes',
    layoutGuidance: 'X and Y axes, competitor bubbles positioned, size indicates scale',
    colorPalette: 'Competitors in gray, our company highlighted in accent color',
    typographyStyle: 'Axis labels clear, competitor names near bubbles',
    examplePrompt: 'Competitive positioning map, X-axis "Price", Y-axis "Quality", scattered bubbles for competitors labeled "Competitor A", "Competitor B", our company highlighted in bright teal with glow effect, bubble sizes indicating market share, McKinsey competitive analysis style, dark background, 16:9',
  },
  agenda_divider: {
    id: 'agenda_divider',
    visualStyle: 'Section list with current section highlighted',
    layoutGuidance: 'Vertical list or horizontal timeline of sections, one active',
    colorPalette: 'Inactive sections muted, active section bright accent color',
    typographyStyle: 'Section numbers prominent, titles clear, active emphasized',
    examplePrompt: 'Agenda divider slide, vertical list of five sections numbered 1-5, sections 1 and 2 in muted gray showing completed, section 3 "Market Analysis" highlighted in bright teal with larger text, sections 4-5 muted, McKinsey section divider style, dark navy background, 16:9',
  },
};
