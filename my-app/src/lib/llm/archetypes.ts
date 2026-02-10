/**
 * SlideTheory Archetype Registry
 * 18 management consulting slide archetypes with classification triggers
 */

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

export interface ArchetypeDefinition {
  id: ArchetypeId;
  description: string;
  layout: string;
  structure: Record<string, unknown>;
  triggers: string[];
  bestFor: string;
  complexity: 'low' | 'medium' | 'high';
  maxElements: number;
}

export const SLIDE_ARCHETYPES: Record<ArchetypeId, ArchetypeDefinition> = {
  // === INSIGHT & SUMMARY SLIDES ===
  executive_summary: {
    id: 'executive_summary',
    description: 'Single key finding with 3-4 supporting evidence points',
    layout: 'headline_plus_evidence',
    structure: {
      title: 'Action-oriented insight headline (2 lines max)',
      body: '3-4 supporting bullet groups with evidence',
      visual: 'Optional callout stat or icon row',
    },
    triggers: ['summary', 'key finding', 'recommendation', 'conclusion', 'takeaway', 'insight'],
    bestFor: 'Opening or closing slides, board-level communication',
    complexity: 'low',
    maxElements: 4,
  },

  situation_complication_resolution: {
    id: 'situation_complication_resolution',
    description: 'SCR framework — sets up context, problem, and proposed action',
    layout: 'three_section_horizontal',
    structure: {
      section_1: 'Situation — current state and context',
      section_2: 'Complication — what changed or what is at risk',
      section_3: 'Resolution — recommended action',
    },
    triggers: ['problem', 'challenge', 'opportunity', 'proposal', 'situation', 'resolution', 'SCR'],
    bestFor: 'Framing a recommendation or business case',
    complexity: 'medium',
    maxElements: 3,
  },

  // === COMPARISON & ANALYSIS SLIDES ===
  two_by_two_matrix: {
    id: 'two_by_two_matrix',
    description: '2x2 matrix with two axes classifying items into 4 quadrants',
    layout: 'matrix_grid',
    structure: {
      x_axis: 'Dimension 1 (low to high)',
      y_axis: 'Dimension 2 (low to high)',
      quadrants: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'],
      items: 'Positioned by their axis values',
    },
    triggers: ['prioritize', 'classify', 'compare along two dimensions', 'portfolio', 'matrix', 'quadrant', 'effort vs impact'],
    bestFor: 'Strategic prioritization, portfolio analysis',
    complexity: 'medium',
    maxElements: 12,
  },

  comparison_table: {
    id: 'comparison_table',
    description: 'Side-by-side comparison of 2-5 options across criteria',
    layout: 'table_with_header_row',
    structure: {
      columns: 'Options being compared',
      rows: 'Evaluation criteria',
      cells: 'Ratings, scores, or qualitative assessments',
      highlight: 'Recommended option column',
    },
    triggers: ['compare', 'evaluate', 'options', 'alternatives', 'versus', 'vs', 'table', 'criteria'],
    bestFor: 'Vendor selection, option evaluation, feature comparison',
    complexity: 'medium',
    maxElements: 20,
  },

  before_after: {
    id: 'before_after',
    description: 'Two-column showing current vs. future state',
    layout: 'two_column_split',
    structure: {
      left: 'Current State / Before (with pain points)',
      right: 'Future State / After (with benefits)',
      connector: 'Arrow or transformation indicator between columns',
    },
    triggers: ['transformation', 'change', 'improve', 'before and after', 'current vs future', 'as-is', 'to-be'],
    bestFor: 'Change management, digital transformation, process improvement',
    complexity: 'low',
    maxElements: 6,
  },

  // === DATA & METRICS SLIDES ===
  kpi_dashboard: {
    id: 'kpi_dashboard',
    description: '3-5 large metric callouts with context',
    layout: 'stat_cards_horizontal',
    structure: {
      metrics: [
        { value: 'Large number (60-72pt)', label: 'Metric name (14pt)', trend: 'Up/Down/Flat' },
      ],
      context_row: 'One-line commentary below metrics',
    },
    triggers: ['KPI', 'metrics', 'dashboard', 'performance', 'numbers', 'statistics', 'key indicators'],
    bestFor: 'Performance reviews, monthly reporting, investor updates',
    complexity: 'low',
    maxElements: 5,
  },

  waterfall_chart: {
    id: 'waterfall_chart',
    description: 'Shows how an initial value is affected by sequential positive/negative changes',
    layout: 'chart_with_annotation',
    structure: {
      start_value: 'Beginning amount',
      changes: [{ label: 'string', delta: 'number (positive or negative)' }],
      end_value: 'Final amount',
      annotations: 'Key driver callouts',
    },
    triggers: ['bridge', 'waterfall', 'walk', 'build-up', 'breakdown', 'revenue bridge', 'variance'],
    bestFor: 'Financial analysis, budget variance, revenue decomposition',
    complexity: 'high',
    maxElements: 10,
  },

  trend_line: {
    id: 'trend_line',
    description: 'Time-series data showing change over time',
    layout: 'chart_full_width',
    structure: {
      x_axis: 'Time periods',
      y_axis: 'Metric values',
      series: '1-3 data series',
      annotations: 'Key inflection points called out',
    },
    triggers: ['trend', 'over time', 'growth', 'trajectory', 'forecast', 'historical', 'time series'],
    bestFor: 'Revenue trends, market sizing, growth trajectories',
    complexity: 'medium',
    maxElements: 12,
  },

  stacked_bar: {
    id: 'stacked_bar',
    description: 'Composition breakdown across categories',
    layout: 'chart_with_legend',
    structure: {
      categories: 'X-axis groups',
      segments: 'Component parts within each bar',
      total: 'Optional total label above each bar',
    },
    triggers: ['breakdown', 'composition', 'share', 'mix', 'allocation', 'segment'],
    bestFor: 'Revenue mix, cost allocation, market share',
    complexity: 'medium',
    maxElements: 15,
  },

  // === PROCESS & FLOW SLIDES ===
  process_flow: {
    id: 'process_flow',
    description: 'Sequential steps in a horizontal chevron or arrow flow',
    layout: 'chevron_horizontal',
    structure: {
      steps: [{ number: 'int', title: 'string', description: 'string' }],
      max_steps: 6,
      connectors: 'Arrows or chevron shapes between steps',
    },
    triggers: ['process', 'steps', 'workflow', 'procedure', 'how to', 'methodology', 'sequential'],
    bestFor: 'Implementation plans, methodologies, operational processes',
    complexity: 'medium',
    maxElements: 6,
  },

  timeline_swimlane: {
    id: 'timeline_swimlane',
    description: 'Time-phased activities across multiple workstreams',
    layout: 'swimlane_horizontal',
    structure: {
      time_axis: 'Weeks, months, or quarters across top',
      lanes: [{ name: 'string', activities: [{ start: 'string', end: 'string', label: 'string' }] }],
      milestones: [{ date: 'string', label: 'string' }],
    },
    triggers: ['timeline', 'roadmap', 'phases', 'milestones', 'gantt', 'schedule', 'workstream'],
    bestFor: 'Project plans, implementation roadmaps, strategic timelines',
    complexity: 'high',
    maxElements: 15,
  },

  decision_tree: {
    id: 'decision_tree',
    description: 'Branching logic from a starting question to outcomes',
    layout: 'tree_diagram',
    structure: {
      root: 'Starting question or decision',
      branches: [{ condition: 'string', outcome: 'string' }],
      depth: '2-3 levels max for readability',
    },
    triggers: ['decision', 'if-then', 'scenarios', 'paths', 'options tree', 'logic tree'],
    bestFor: 'Decision frameworks, diagnostic flows, scenario planning',
    complexity: 'high',
    maxElements: 8,
  },

  // === STRUCTURE & HIERARCHY SLIDES ===
  issue_tree: {
    id: 'issue_tree',
    description: 'Hierarchical decomposition of a problem into sub-issues',
    layout: 'tree_left_to_right',
    structure: {
      root_issue: 'Main problem statement',
      branches: [{ issue: 'string', sub_issues: ['string'] }],
    },
    triggers: ['issue tree', 'root cause', 'decompose', 'break down', 'analyze causes', 'hypothesis'],
    bestFor: 'Problem structuring, hypothesis generation, root cause analysis',
    complexity: 'medium',
    maxElements: 12,
  },

  three_pillar: {
    id: 'three_pillar',
    description: 'Three equal-weight columns representing parallel themes or pillars',
    layout: 'three_card_horizontal',
    structure: {
      pillars: [{ icon: 'string', title: 'string', description: 'string', metrics: ['string'] }],
    },
    triggers: ['three pillars', 'three priorities', 'three areas', 'three themes', 'triple', 'pillars'],
    bestFor: 'Strategic priorities, capability areas, value propositions',
    complexity: 'low',
    maxElements: 3,
  },

  grid_cards: {
    id: 'grid_cards',
    description: '2x2 or 2x3 grid of content cards with icons',
    layout: 'card_grid',
    structure: {
      cards: [{ icon: 'string', title: 'string', body: 'string' }],
      grid_size: '2x2 or 2x3 based on content volume',
    },
    triggers: ['multiple topics', 'several areas', 'categories', 'features', 'capabilities', 'grid'],
    bestFor: 'Capability overviews, product features, risk categories',
    complexity: 'low',
    maxElements: 6,
  },

  // === MARKET & FINANCIAL SLIDES ===
  market_sizing: {
    id: 'market_sizing',
    description: 'TAM/SAM/SOM or top-down/bottom-up market size with funnel logic',
    layout: 'funnel_or_nested_circles',
    structure: {
      levels: [{ name: 'TAM/SAM/SOM', value: 'string', description: 'string' }],
      methodology: 'Top-down or bottom-up calculation shown',
    },
    triggers: ['market size', 'TAM', 'SAM', 'SOM', 'addressable market', 'opportunity size', 'market potential'],
    bestFor: 'Investment memos, market entry, growth strategy',
    complexity: 'medium',
    maxElements: 5,
  },

  competitive_landscape: {
    id: 'competitive_landscape',
    description: 'Positioning map or competitor comparison matrix',
    layout: 'scatter_or_matrix',
    structure: {
      axes: { x: 'string', y: 'string' },
      competitors: [{ name: 'string', x_pos: 'float', y_pos: 'float', size: 'float' }],
      our_position: 'Highlighted differently',
    },
    triggers: ['competitive', 'landscape', 'positioning', 'competitors', 'market map', 'competition'],
    bestFor: 'Competitive analysis, market positioning, strategic planning',
    complexity: 'high',
    maxElements: 10,
  },

  // === NAVIGATION SLIDES ===
  agenda_divider: {
    id: 'agenda_divider',
    description: 'Section divider or agenda overview slide',
    layout: 'centered_or_sidebar',
    structure: {
      sections: [{ number: 'int', title: 'string', active: 'bool' }],
      current_section: 'Highlighted with accent color',
    },
    triggers: ['agenda', 'table of contents', 'section break', 'overview', 'divider'],
    bestFor: 'Deck navigation, section transitions',
    complexity: 'low',
    maxElements: 8,
  },
};

/**
 * Classify content to determine the best archetype
 * Uses multiple signals: user intent, data shape, content structure, complexity
 */
export function classifyContent(
  contentType: string,
  dataPoints: Array<{ label: string; value: string | number }>,
  userRequest?: string,
  logicalGroups?: Array<{ heading: string; bullets: string[] }>
): ArchetypeId {
  // Step 1: Check for explicit archetype mentions in user input (highest priority)
  if (userRequest) {
    const lowerRequest = userRequest.toLowerCase();
    for (const [id, archetype] of Object.entries(SLIDE_ARCHETYPES)) {
      for (const trigger of archetype.triggers) {
        if (lowerRequest.includes(trigger.toLowerCase())) {
          return id as ArchetypeId;
        }
      }
    }
  }

  // Step 2: Analyze data shape for chart types
  const numericValues = dataPoints.filter(
    (dp) => typeof dp.value === 'number' || !isNaN(Number(String(dp.value).replace(/[^0-9.-]/g, '')))
  );

  const hasTimeLabels = dataPoints.some((dp) =>
    /\b(Q[1-4]|20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|month|quarter|year)\b/i.test(String(dp.label))
  );

  const hasComparisonWords = dataPoints.some((dp) =>
    /\b(vs|versus|compared|difference|gap|change|increase|decrease|growth|decline)\b/i.test(String(dp.label) + ' ' + String(dp.context))
  );

  // Time series data → trend_line
  if (numericValues.length >= 3 && hasTimeLabels) {
    return 'trend_line';
  }

  // Comparison over time with deltas → waterfall_chart
  if (hasComparisonWords && numericValues.length >= 3) {
    return 'waterfall_chart';
  }

  // Waterfall/bridge indicators in content type
  if (contentType.includes('bridge') || contentType.includes('waterfall') || contentType.includes('variance') || contentType.includes('walk')) {
    return 'waterfall_chart';
  }

  // Step 3: Analyze logical groups structure
  if (logicalGroups && logicalGroups.length > 0) {
    // 3 groups with similar structure → three_pillar
    if (logicalGroups.length === 3) {
      return 'three_pillar';
    }

    // 4-6 groups with short bullets → grid_cards
    if (logicalGroups.length >= 4 && logicalGroups.length <= 6) {
      const avgBulletLength = logicalGroups.reduce((sum, g) => 
        sum + g.bullets.reduce((bSum, b) => bSum + b.length, 0) / (g.bullets.length || 1), 0
      ) / logicalGroups.length;
      if (avgBulletLength < 60) {
        return 'grid_cards';
      }
    }

    // Sequential language in groups → process_flow
    const hasSequentialLanguage = logicalGroups.some((g, i) => 
      /\b(phase|step|stage|period|quarter|month|week|day)\b/i.test(g.heading) ||
      g.heading.toLowerCase().includes(String(i + 1))
    );
    if (hasSequentialLanguage && logicalGroups.length <= 6) {
      return 'process_flow';
    }
  }

  // Step 4: Match content_type against archetype triggers
  const lowerContent = contentType.toLowerCase();
  for (const [id, archetype] of Object.entries(SLIDE_ARCHETYPES)) {
    for (const trigger of archetype.triggers) {
      if (lowerContent.includes(trigger.toLowerCase())) {
        return id as ArchetypeId;
        }
    }
  }

  // Step 5: Data-driven defaults
  if (numericValues.length >= 3 && numericValues.length <= 5) {
    return 'kpi_dashboard';
  }

  if (numericValues.length > 5) {
    return hasTimeLabels ? 'trend_line' : 'stacked_bar';
  }

  // Step 6: Structure-based fallbacks
  if (logicalGroups) {
    if (logicalGroups.length === 2) {
      // Check if it's a before/after structure
      const headings = logicalGroups.map(g => g.heading.toLowerCase());
      const hasBeforeAfter = headings.some(h => /\b(current|before|today|as is|baseline)\b/.test(h)) &&
                             headings.some(h => /\b(future|after|target|to be|goal)\b/.test(h));
      if (hasBeforeAfter) {
        return 'before_after';
      }
    }
  }

  // Step 7: Final fallback to executive_summary
  return 'executive_summary';
}

/**
 * Get archetype by ID
 */
export function getArchetype(id: ArchetypeId): ArchetypeDefinition {
  return SLIDE_ARCHETYPES[id];
}

/**
 * Get all archetype options for UI dropdown
 */
export function getArchetypeOptions(): Array<{ id: ArchetypeId; label: string; description: string }> {
  return Object.values(SLIDE_ARCHETYPES).map((archetype) => ({
    id: archetype.id,
    label: archetype.id
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: archetype.description,
  }));
}
