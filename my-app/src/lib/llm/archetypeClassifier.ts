/**
 * Stage 2: Archetype Classification & Props Mapping
 * Maps structured content to the appropriate slide archetype and generates template props
 */

import { ArchetypeId, SLIDE_ARCHETYPES, classifyContent as classifyByKeywords } from './archetypes';
import { StructuredContent } from './contentAnalyzer';

// === TYPES ===

export interface TemplateProps {
  title: string;
  subtitle?: string;
  archetype: ArchetypeId;
  density: 'presentation' | 'read_style';
  [key: string]: unknown;
}

export interface ClassificationResult {
  archetypeId: ArchetypeId;
  props: TemplateProps;
  confidence: number;
  reasoning: string;
}

// === CLASSIFICATION LOGIC ===

/**
 * Classify content and map to archetype with props
 * Priority order:
 * 1. Explicit user request
 * 2. Data shape match
 * 3. Content type inference
 * 4. Default fallback
 */
export function classifyAndMap(
  structured: StructuredContent,
  userRequestedType?: string,
  density: 'presentation' | 'read_style' = 'presentation'
): ClassificationResult {
  // Step 1: Check for explicit user request
  let archetypeId: ArchetypeId;
  let confidence = 0.9;
  let reasoning = '';

  if (userRequestedType && userRequestedType !== 'auto') {
    // Map old type names to new archetype IDs
    archetypeId = mapLegacyTypeToArchetype(userRequestedType);
    confidence = 1.0;
    reasoning = `User explicitly requested ${userRequestedType}`;
  } else {
    // Step 2-4: Use the classifier
    archetypeId = classifyByKeywords(
      structured.contentType,
      structured.dataPoints,
      structured.coreMessage
    );
    confidence = 0.85;
    reasoning = `Classified based on content type "${structured.contentType}" and ${structured.dataPoints.length} data points`;
  }

  // Map to template props
  const props = mapToArchetypeProps(structured, archetypeId, density);

  return {
    archetypeId,
    props,
    confidence,
    reasoning,
  };
}

/**
 * Map legacy slide types to new archetype IDs
 */
function mapLegacyTypeToArchetype(legacyType: string): ArchetypeId {
  const mapping: Record<string, ArchetypeId> = {
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

  return mapping[legacyType] || 'executive_summary';
}

// === PROPS MAPPERS ===

function mapToArchetypeProps(
  structured: StructuredContent,
  archetypeId: ArchetypeId,
  density: 'presentation' | 'read_style'
): TemplateProps {
  const baseProps: TemplateProps = {
    title: structured.title,
    subtitle: structured.subtitle,
    archetype: archetypeId,
    density,
  };

  switch (archetypeId) {
    case 'executive_summary':
      return mapToExecutiveSummary(structured, baseProps);
    case 'situation_complication_resolution':
      return mapToSCR(structured, baseProps);
    case 'three_pillar':
      return mapToThreePillar(structured, baseProps);
    case 'kpi_dashboard':
      return mapToKPIDashboard(structured, baseProps);
    case 'comparison_table':
      return mapToComparisonTable(structured, baseProps);
    case 'process_flow':
      return mapToProcessFlow(structured, baseProps);
    case 'timeline_swimlane':
      return mapToTimelineSwimlane(structured, baseProps);
    case 'two_by_two_matrix':
      return mapToTwoByTwoMatrix(structured, baseProps);
    case 'before_after':
      return mapToBeforeAfter(structured, baseProps);
    case 'waterfall_chart':
      return mapToWaterfallChart(structured, baseProps);
    case 'trend_line':
      return mapToTrendLine(structured, baseProps);
    case 'stacked_bar':
      return mapToStackedBar(structured, baseProps);
    case 'issue_tree':
      return mapToIssueTree(structured, baseProps);
    case 'decision_tree':
      return mapToDecisionTree(structured, baseProps);
    case 'grid_cards':
      return mapToGridCards(structured, baseProps);
    case 'market_sizing':
      return mapToMarketSizing(structured, baseProps);
    case 'competitive_landscape':
      return mapToCompetitiveLandscape(structured, baseProps);
    case 'agenda_divider':
      return mapToAgendaDivider(structured, baseProps);
    default:
      return baseProps;
  }
}

function mapToExecutiveSummary(
  structured: StructuredContent,
  base: TemplateProps
): TemplateProps {
  let points = (structured.logicalGroups || []).map((group, index) => ({
    title: group.heading,
    description: (group.bullets || []).join(' '),
    highlight: group.emphasis === 'high' || index === 0,
  }));

  // Fallback: if no points from logicalGroups, create from coreMessage
  if (points.length === 0 && structured.coreMessage) {
    points = [{
      title: 'Key Insight',
      description: structured.coreMessage,
      highlight: true,
    }];
  }

  // Second fallback: create from supportingEvidence
  if (points.length === 0 && structured.supportingEvidence && structured.supportingEvidence.length > 0) {
    points = structured.supportingEvidence.slice(0, 4).map((evidence, index) => ({
      title: index === 0 ? 'Key Points' : `Point ${index + 1}`,
      description: evidence,
      highlight: index === 0,
    }));
  }

  // Final fallback: create from dataPoints
  if (points.length === 0 && structured.dataPoints && structured.dataPoints.length > 0) {
    points = structured.dataPoints.slice(0, 4).map((dp, index) => ({
      title: dp.label,
      description: `${dp.value}${dp.unit || ''}${dp.context ? ` (${dp.context})` : ''}`,
      highlight: index === 0,
    }));
  }

  // Last resort fallback
  if (points.length === 0) {
    points = [{
      title: 'Overview',
      description: 'See detailed analysis in supporting materials',
      highlight: true,
    }];
  }

  // Add data points as a visual element if available
  const hasMetrics = structured.dataPoints.length > 0;
  const callout = hasMetrics
    ? {
        value: String(structured.dataPoints[0].value),
        label: structured.dataPoints[0].label,
        context: structured.dataPoints[0].context,
      }
    : undefined;

  return {
    ...base,
    points: points.slice(0, 4),
    callout,
    keyMessage: structured.coreMessage,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToSCR(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const groups = structured.logicalGroups;

  return {
    ...base,
    situation: {
      title: groups[0]?.heading || 'Current State',
      points: groups[0]?.bullets || ['No situation data provided'],
    },
    complication: {
      title: groups[1]?.heading || 'The Challenge',
      points: groups[1]?.bullets || ['No complication data provided'],
    },
    resolution: {
      title: groups[2]?.heading || 'Recommended Action',
      points: groups[2]?.bullets || ['No resolution data provided'],
    },
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToThreePillar(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const pillars = structured.logicalGroups.slice(0, 3).map((group, index) => ({
    icon: getIconForIndex(index),
    title: group.heading,
    description: group.bullets[0] || '',
    bullets: group.bullets.slice(1),
    metrics: structured.dataPoints
      .filter((_, i) => i % 3 === index)
      .map((dp) => `${dp.label}: ${dp.value}`),
  }));

  return {
    ...base,
    pillars,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToKPIDashboard(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const metrics = structured.dataPoints.slice(0, 5).map((dp) => {
    const value = String(dp.value);
    const trend = dp.context
      ? dp.context.includes('+') || dp.context.toLowerCase().includes('up')
        ? 'up'
        : dp.context.includes('-') || dp.context.toLowerCase().includes('down')
          ? 'down'
          : 'neutral'
      : 'neutral';

    return {
      label: dp.label,
      value,
      unit: dp.unit,
      context: dp.context,
      trend,
    };
  });

  return {
    ...base,
    metrics,
    contextLine: structured.coreMessage,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToComparisonTable(structured: StructuredContent, base: TemplateProps): TemplateProps {
  // Extract options from logical groups or data points
  const groups = structured.logicalGroups;
  const numOptions = Math.min(groups.length, 4);

  // Build headers
  const headers = ['Criteria', ...groups.slice(0, numOptions).map((g) => g.heading)];

  // Build rows from supporting evidence or bullets
  const rows = structured.supportingEvidence.slice(0, 6).map((evidence) => ({
    criteria: evidence.split(':')[0] || evidence.slice(0, 30),
    values: groups.slice(0, numOptions).map((g) => g.bullets[0] || '—'),
  }));

  // Determine recommended option (first high-emphasis group or first group)
  const recommendedIndex = groups.findIndex((g) => g.emphasis === 'high');

  return {
    ...base,
    headers,
    rows,
    recommendedColumn: recommendedIndex >= 0 ? recommendedIndex + 1 : undefined,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToProcessFlow(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const steps = structured.logicalGroups.slice(0, 6).map((group, index) => ({
    number: index + 1,
    title: group.heading,
    description: group.bullets.join('. '),
  }));

  return {
    ...base,
    steps,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToTimelineSwimlane(structured: StructuredContent, base: TemplateProps): TemplateProps {
  // Create time periods (quarters or months)
  const periods = ['Q1', 'Q2', 'Q3', 'Q4'];

  // Map logical groups to workstream lanes
  const lanes = structured.logicalGroups.slice(0, 4).map((group) => ({
    name: group.heading,
    activities: group.bullets.slice(0, 4).map((bullet, index) => ({
      start: periods[index % periods.length],
      end: periods[Math.min(index + 1, periods.length - 1)],
      label: bullet.slice(0, 30),
    })),
  }));

  // Create milestones from data points
  const milestones = structured.dataPoints.slice(0, 4).map((dp, index) => ({
    date: periods[index % periods.length],
    label: dp.label,
  }));

  return {
    ...base,
    periods,
    lanes,
    milestones,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToTwoByTwoMatrix(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const groups = structured.logicalGroups;

  // Distribute items across quadrants based on implied priority
  const quadrants = [
    {
      name: 'Quick Wins',
      position: 'top-left' as const,
      items: groups[0]?.bullets.slice(0, 3) || [],
    },
    {
      name: 'Major Projects',
      position: 'top-right' as const,
      items: groups[1]?.bullets.slice(0, 3) || [],
    },
    {
      name: 'Fill-ins',
      position: 'bottom-left' as const,
      items: groups[2]?.bullets.slice(0, 3) || [],
    },
    {
      name: 'Thankless Tasks',
      position: 'bottom-right' as const,
      items: groups[3]?.bullets.slice(0, 3) || [],
    },
  ];

  return {
    ...base,
    xAxisLabel: 'Effort / Investment →',
    yAxisLabel: '← Impact / Value',
    quadrants,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToBeforeAfter(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const groups = structured.logicalGroups;

  return {
    ...base,
    before: {
      title: groups[0]?.heading || 'Current State',
      painPoints: groups[0]?.bullets || ['No current state data'],
      metrics: structured.dataPoints.slice(0, 2).map((dp) => ({
        label: dp.label,
        value: String(dp.value),
      })),
    },
    after: {
      title: groups[1]?.heading || 'Future State',
      benefits: groups[1]?.bullets || ['No future state data'],
      metrics: structured.dataPoints.slice(2, 4).map((dp) => ({
        label: dp.label,
        value: String(dp.value),
      })),
    },
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToWaterfallChart(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const dataPoints = structured.dataPoints;

  // Assume first data point is start, last is end, middle are changes
  const startValue = Number(dataPoints[0]?.value) || 0;
  const endValue = Number(dataPoints[dataPoints.length - 1]?.value) || startValue;

  const changes = dataPoints.slice(1, -1).map((dp) => ({
    label: dp.label,
    delta: Number(dp.value) || 0,
  }));

  return {
    ...base,
    startValue,
    endValue,
    changes,
    annotations: structured.supportingEvidence.slice(0, 3),
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToTrendLine(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const data = structured.dataPoints.map((dp) => ({
    label: dp.label,
    value: Number(dp.value) || 0,
  }));

  return {
    ...base,
    data,
    series: [{ name: 'Value', data }],
    xAxisLabel: 'Time Period',
    yAxisLabel: 'Value',
    keyTakeaway: structured.coreMessage,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToStackedBar(structured: StructuredContent, base: TemplateProps): TemplateProps {
  // Group data points by category
  const categories = structured.logicalGroups.map((g) => g.heading);
  const segments = structured.dataPoints.map((dp) => dp.label);

  return {
    ...base,
    categories,
    segments,
    data: structured.dataPoints.map((dp) => ({
      category: dp.label,
      value: Number(dp.value) || 0,
    })),
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToIssueTree(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const branches = structured.logicalGroups.slice(0, 4).map((group) => ({
    issue: group.heading,
    subIssues: group.bullets.slice(0, 4),
  }));

  return {
    ...base,
    rootProblem: structured.title,
    branches,
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToDecisionTree(structured: StructuredContent, base: TemplateProps): TemplateProps {
  return {
    ...base,
    rootQuestion: structured.title,
    branches: structured.logicalGroups.slice(0, 3).map((group) => ({
      condition: group.heading,
      outcome: group.bullets[0] || 'No outcome specified',
      subBranches: group.bullets.slice(1).map((bullet) => ({
        condition: bullet,
        outcome: 'See details',
      })),
    })),
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToGridCards(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const cards = structured.logicalGroups.slice(0, 6).map((group, index) => ({
    icon: getIconForIndex(index),
    title: group.heading,
    body: group.bullets.join('. '),
  }));

  return {
    ...base,
    cards,
    gridSize: cards.length <= 4 ? '2x2' : '2x3',
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToMarketSizing(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const dataPoints = structured.dataPoints;

  const levels = [
    {
      name: 'TAM',
      value: String(dataPoints[0]?.value || '$100B'),
      description: dataPoints[0]?.label || 'Total Addressable Market',
    },
    {
      name: 'SAM',
      value: String(dataPoints[1]?.value || '$10B'),
      description: dataPoints[1]?.label || 'Serviceable Addressable Market',
    },
    {
      name: 'SOM',
      value: String(dataPoints[2]?.value || '$1B'),
      description: dataPoints[2]?.label || 'Serviceable Obtainable Market',
    },
  ];

  return {
    ...base,
    levels,
    methodology: structured.supportingEvidence[0] || 'Top-down market analysis',
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToCompetitiveLandscape(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const groups = structured.logicalGroups;

  return {
    ...base,
    axes: {
      x: groups[0]?.heading || 'Market Presence',
      y: groups[1]?.heading || 'Innovation',
    },
    competitors: groups.slice(0, 4).map((group, index) => ({
      name: group.heading,
      xPos: 0.2 + (index % 2) * 0.6,
      yPos: 0.2 + Math.floor(index / 2) * 0.6,
      size: 0.1 + (group.bullets.length * 0.05),
    })),
    ourPosition: { x: 0.5, y: 0.5, highlighted: true },
    footnote: structured.footnote,
    source: structured.source,
  };
}

function mapToAgendaDivider(structured: StructuredContent, base: TemplateProps): TemplateProps {
  const sections = structured.logicalGroups.map((group, index) => ({
    number: index + 1,
    title: group.heading,
    active: index === 0,
  }));

  return {
    ...base,
    sections,
    currentSection: 1,
  };
}

// === UTILITY FUNCTIONS ===

function getIconForIndex(index: number): string {
  const icons = ['target', 'rocket', 'shield', 'lightbulb', 'chart', 'users'];
  return icons[index % icons.length];
}

/**
 * Get layout pattern for an archetype
 */
export function getLayoutPattern(archetypeId: ArchetypeId): string {
  const patterns: Record<ArchetypeId, string> = {
    executive_summary: 'headline_plus_evidence',
    situation_complication_resolution: 'three_section_horizontal',
    two_by_two_matrix: 'matrix_grid',
    comparison_table: 'table_with_header_row',
    before_after: 'two_column_split',
    kpi_dashboard: 'stat_cards_horizontal',
    waterfall_chart: 'chart_with_annotation',
    trend_line: 'chart_full_width',
    stacked_bar: 'chart_with_legend',
    process_flow: 'chevron_horizontal',
    timeline_swimlane: 'swimlane_horizontal',
    decision_tree: 'tree_diagram',
    issue_tree: 'tree_left_to_right',
    three_pillar: 'three_card_horizontal',
    grid_cards: 'card_grid',
    market_sizing: 'funnel_or_nested_circles',
    competitive_landscape: 'scatter_or_matrix',
    agenda_divider: 'centered_or_sidebar',
  };

  return patterns[archetypeId];
}
