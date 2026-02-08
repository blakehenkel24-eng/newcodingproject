/**
 * SlideTheory Type Definitions
 * Updated for the upgraded slide generation pipeline
 */

// === LEGACY TYPES (for backward compatibility) ===

export type LegacySlideType =
  | 'auto'
  | 'executive_summary'
  | 'horizontal_flow'
  | 'two_by_two_matrix'
  | 'comparison_table'
  | 'data_chart'
  | 'multi_metric'
  | 'issue_tree'
  | 'timeline'
  | 'graph_chart';

export type TargetAudience =
  | 'c_suite'
  | 'pe_investors'
  | 'external_client'
  | 'internal_team';

export type DensityMode = 'presentation' | 'read_style';

// === NEW ARCHETYPE TYPES ===

export type ArchetypeId =
  | 'executive_summary'
  | 'situation_complication_resolution'
  | 'two_by_two_matrix'
  | 'comparison_table'
  | 'before_after'
  | 'kpi_dashboard'
  | 'waterfall_chart'
  | 'trend_line'
  | 'stacked_bar'
  | 'process_flow'
  | 'timeline_swimlane'
  | 'decision_tree'
  | 'issue_tree'
  | 'three_pillar'
  | 'grid_cards'
  | 'market_sizing'
  | 'competitive_landscape'
  | 'agenda_divider';

// Combined type for UI selection
export type SlideType = LegacySlideType | ArchetypeId;

// === CONTENT STRUCTURE TYPES ===

export interface ContentBlock {
  type: 'text' | 'metric' | 'list' | 'chart_data' | 'comparison_item';
  label?: string;
  value: string | number;
  subtext?: string;
  emphasis?: 'high' | 'medium' | 'low';
  items?: string[];
}

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

// === PIPELINE OUTPUT TYPES ===

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

// Legacy blueprint for backward compatibility
export interface SlideBlueprint {
  slideTitle: string;
  keyMessage: string;
  contentBlocks: ContentBlock[];
  suggestedLayout: LegacySlideType;
  footnote?: string;
  source?: string;
  density?: DensityMode;
}

// === TEMPLATE PROPS TYPES ===

export interface BaseTemplateProps {
  title: string;
  subtitle?: string;
  archetype: ArchetypeId;
  density: DensityMode;
  footnote?: string;
  source?: string;
}

export interface ExecutiveSummaryProps extends BaseTemplateProps {
  points: Array<{
    title: string;
    description: string;
    highlight?: boolean;
  }>;
  callout?: {
    value: string;
    label: string;
    context?: string;
  };
  keyMessage: string;
}

export interface SCRProps extends BaseTemplateProps {
  situation: {
    title: string;
    points: string[];
  };
  complication: {
    title: string;
    points: string[];
  };
  resolution: {
    title: string;
    points: string[];
  };
}

export interface ThreePillarProps extends BaseTemplateProps {
  pillars: Array<{
    icon: string;
    title: string;
    description: string;
    bullets?: string[];
    metrics?: string[];
  }>;
}

export interface KPIDashboardProps extends BaseTemplateProps {
  metrics: Array<{
    label: string;
    value: string;
    unit?: string;
    context?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  contextLine?: string;
}

export interface ComparisonTableProps extends BaseTemplateProps {
  headers: string[];
  rows: Array<{
    criteria: string;
    values: string[];
  }>;
  recommendedColumn?: number;
}

export interface ProcessFlowProps extends BaseTemplateProps {
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export interface TimelineSwimlaneProps extends BaseTemplateProps {
  periods: string[];
  lanes: Array<{
    name: string;
    activities: Array<{
      start: string;
      end: string;
      label: string;
    }>;
  }>;
  milestones?: Array<{
    date: string;
    label: string;
  }>;
}

export interface TwoByTwoMatrixProps extends BaseTemplateProps {
  xAxisLabel: string;
  yAxisLabel: string;
  quadrants: Array<{
    name: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    items: string[];
  }>;
}

export interface BeforeAfterProps extends BaseTemplateProps {
  before: {
    title: string;
    painPoints: string[];
    metrics?: Array<{ label: string; value: string }>;
  };
  after: {
    title: string;
    benefits: string[];
    metrics?: Array<{ label: string; value: string }>;
  };
}

export interface WaterfallChartProps extends BaseTemplateProps {
  startValue: number;
  endValue: number;
  changes: Array<{
    label: string;
    delta: number;
  }>;
  annotations?: string[];
}

export interface TrendLineProps extends BaseTemplateProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  series?: Array<{
    name: string;
    data: Array<{ label: string; value: number }>;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  keyTakeaway?: string;
}

export interface StackedBarProps extends BaseTemplateProps {
  categories: string[];
  segments: string[];
  data: Array<{
    category: string;
    value: number;
  }>;
}

export interface IssueTreeProps extends BaseTemplateProps {
  rootProblem: string;
  branches: Array<{
    issue: string;
    subIssues: string[];
  }>;
}

export interface DecisionTreeProps extends BaseTemplateProps {
  rootQuestion: string;
  branches: Array<{
    condition: string;
    outcome: string;
    subBranches?: Array<{
      condition: string;
      outcome: string;
    }>;
  }>;
}

export interface GridCardsProps extends BaseTemplateProps {
  cards: Array<{
    icon: string;
    title: string;
    body: string;
  }>;
  gridSize: '2x2' | '2x3';
}

export interface MarketSizingProps extends BaseTemplateProps {
  levels: Array<{
    name: string;
    value: string;
    description: string;
  }>;
  methodology: string;
}

export interface CompetitiveLandscapeProps extends BaseTemplateProps {
  axes: {
    x: string;
    y: string;
  };
  competitors: Array<{
    name: string;
    xPos: number;
    yPos: number;
    size: number;
  }>;
  ourPosition?: {
    x: number;
    y: number;
    highlighted: boolean;
  };
}

export interface AgendaDividerProps extends BaseTemplateProps {
  sections: Array<{
    number: number;
    title: string;
    active: boolean;
  }>;
  currentSection: number;
}

// Union type for all template props
export type TemplateProps =
  | ExecutiveSummaryProps
  | SCRProps
  | ThreePillarProps
  | KPIDashboardProps
  | ComparisonTableProps
  | ProcessFlowProps
  | TimelineSwimlaneProps
  | TwoByTwoMatrixProps
  | BeforeAfterProps
  | WaterfallChartProps
  | TrendLineProps
  | StackedBarProps
  | IssueTreeProps
  | DecisionTreeProps
  | GridCardsProps
  | MarketSizingProps
  | CompetitiveLandscapeProps
  | AgendaDividerProps
  | BaseTemplateProps;

// === API RESPONSE TYPES ===

export interface SlideData {
  slideId: string;
  archetypeId: ArchetypeId;
  templateId: string; // For backward compatibility
  props: TemplateProps;
  structured: StructuredContent;
  blueprint?: SlideBlueprint; // For backward compatibility
  generationTimeMs: number;
  remainingGenerations: number;
  modelUsed: string;
  qaScore: number;
  qaPassed: boolean;
  qaRecommendations?: string[];
}

export interface SlideTemplatePropsBase {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footnote?: string;
  source?: string;
  density: DensityMode;
}

// === QA TYPES ===

export interface QACheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface QAReport {
  passed: boolean;
  checks: QACheck[];
  score: number; // 0-100
  recommendations: string[];
}

// === HELPER FUNCTIONS ===

/**
 * Check if a slide type is a legacy type
 */
export function isLegacyType(type: string): type is LegacySlideType {
  const legacyTypes: string[] = [
    'auto', 'executive_summary', 'horizontal_flow', 'two_by_two_matrix',
    'comparison_table', 'data_chart', 'multi_metric', 'issue_tree',
    'timeline', 'graph_chart'
  ];
  return legacyTypes.includes(type);
}

/**
 * Map legacy type to new archetype
 */
export function mapToArchetype(type: string): ArchetypeId {
  const mapping: Record<string, ArchetypeId> = {
    auto: 'executive_summary',
    executive_summary: 'executive_summary',
    horizontal_flow: 'process_flow',
    two_by_two_matrix: 'two_by_two_matrix',
    comparison_table: 'comparison_table',
    data_chart: 'trend_line',
    multi_metric: 'kpi_dashboard',
    issue_tree: 'issue_tree',
    timeline: 'timeline_swimlane',
    graph_chart: 'competitive_landscape',
  };
  return mapping[type] || 'executive_summary';
}

/**
 * Get all available archetype options for UI
 */
export function getArchetypeOptions(): Array<{ id: ArchetypeId; label: string; category: string }> {
  return [
    { id: 'executive_summary', label: 'Executive Summary', category: 'Insight & Summary' },
    { id: 'situation_complication_resolution', label: 'Situation-Complication-Resolution', category: 'Insight & Summary' },
    { id: 'three_pillar', label: 'Three Pillars', category: 'Structure & Hierarchy' },
    { id: 'kpi_dashboard', label: 'KPI Dashboard', category: 'Data & Metrics' },
    { id: 'comparison_table', label: 'Comparison Table', category: 'Comparison & Analysis' },
    { id: 'process_flow', label: 'Process Flow', category: 'Process & Flow' },
    { id: 'timeline_swimlane', label: 'Timeline Swimlane', category: 'Process & Flow' },
    { id: 'two_by_two_matrix', label: '2x2 Matrix', category: 'Comparison & Analysis' },
    { id: 'before_after', label: 'Before/After', category: 'Comparison & Analysis' },
    { id: 'waterfall_chart', label: 'Waterfall Chart', category: 'Data & Metrics' },
    { id: 'trend_line', label: 'Trend Line', category: 'Data & Metrics' },
    { id: 'stacked_bar', label: 'Stacked Bar', category: 'Data & Metrics' },
    { id: 'issue_tree', label: 'Issue Tree', category: 'Structure & Hierarchy' },
    { id: 'decision_tree', label: 'Decision Tree', category: 'Process & Flow' },
    { id: 'grid_cards', label: 'Grid Cards', category: 'Structure & Hierarchy' },
    { id: 'market_sizing', label: 'Market Sizing', category: 'Market & Financial' },
    { id: 'competitive_landscape', label: 'Competitive Landscape', category: 'Market & Financial' },
    { id: 'agenda_divider', label: 'Agenda Divider', category: 'Navigation' },
  ];
}
