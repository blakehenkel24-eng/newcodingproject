import { SlideBlueprint, SlideType } from '@/types/slide';

interface TemplateProps {
  title: string;
  [key: string]: unknown;
}

export function selectLayoutAndMapProps(
  blueprint: SlideBlueprint,
  requestedType: SlideType
): { templateId: string; props: TemplateProps } {
  // If user specified a template, use it; otherwise use the suggested one
  const templateId = requestedType === 'auto' 
    ? blueprint.suggestedLayout 
    : requestedType;
  
  const props = mapBlueprintToProps(blueprint, templateId);
  
  return { templateId, props };
}

function mapBlueprintToProps(blueprint: SlideBlueprint, templateId: string): TemplateProps {
  const baseProps = {
    title: blueprint.slideTitle,
    keyMessage: blueprint.keyMessage,
    footnote: blueprint.footnote,
    source: blueprint.source,
  };
  
  switch (templateId) {
    case 'executive_summary':
      return mapToExecutiveSummary(blueprint, baseProps);
    case 'horizontal_flow':
      return mapToHorizontalFlow(blueprint, baseProps);
    case 'two_by_two_matrix':
      return mapToTwoByTwoMatrix(blueprint, baseProps);
    case 'comparison_table':
      return mapToComparisonTable(blueprint, baseProps);
    case 'data_chart':
      return mapToDataChart(blueprint, baseProps);
    case 'multi_metric':
      return mapToMultiMetric(blueprint, baseProps);
    case 'issue_tree':
      return mapToIssueTree(blueprint, baseProps);
    case 'timeline':
      return mapToTimeline(blueprint, baseProps);
    case 'graph_chart':
      return mapToGraphChart(blueprint, baseProps);
    default:
      return mapToGeneral(blueprint, baseProps);
  }
}

function mapToExecutiveSummary(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const points = blueprint.contentBlocks.map((block, index) => ({
    title: block.label || `Point ${index + 1}`,
    description: String(block.value),
    highlight: block.emphasis === 'high',
  }));
  
  return {
    ...base,
    points: points.slice(0, 4), // Max 4 points for executive summary
  } as unknown as TemplateProps;
}

function mapToHorizontalFlow(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const steps = blueprint.contentBlocks.map((block, index) => ({
    number: index + 1,
    label: block.label || `Step ${index + 1}`,
    description: String(block.value),
  }));
  
  return {
    ...base,
    steps: steps.slice(0, 6), // Max 6 steps
  } as unknown as TemplateProps;
}

function mapToTwoByTwoMatrix(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  return {
    ...base,
    xAxisLabel: 'Impact',
    yAxisLabel: 'Effort',
    quadrants: [
      { name: 'Quick Wins', items: blueprint.contentBlocks.slice(0, 2).map(b => String(b.value)), position: 'top-left' },
      { name: 'Major Projects', items: blueprint.contentBlocks.slice(2, 4).map(b => String(b.value)), position: 'top-right' },
      { name: 'Fill-ins', items: [], position: 'bottom-left' },
      { name: 'Thankless Tasks', items: [], position: 'bottom-right' },
    ],
  } as unknown as TemplateProps;
}

function mapToComparisonTable(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const items = blueprint.contentBlocks.filter(b => b.type === 'comparison_item');
  
  return {
    ...base,
    headers: ['Criteria', 'Option A', 'Option B'],
    rows: items.map(item => ({
      criteria: item.label || 'Criterion',
      values: [String(item.value), item.subtext || ''],
    })),
  } as unknown as TemplateProps;
}

function mapToDataChart(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const chartData = blueprint.contentBlocks
    .filter(b => typeof b.value === 'number' || !isNaN(Number(b.value)))
    .map(b => ({
      label: b.label || 'Item',
      value: Number(b.value),
    }));
  
  return {
    ...base,
    chartType: 'bar',
    data: chartData.length > 0 ? chartData : [{ label: 'Sample', value: 100 }],
    keyTakeaway: blueprint.keyMessage,
  } as unknown as TemplateProps;
}

function mapToMultiMetric(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const metrics = blueprint.contentBlocks
    .filter(b => b.type === 'metric' || typeof b.value === 'number' || !isNaN(Number(String(b.value).replace(/[^0-9.-]/g, ''))))
    .map(b => ({
      label: b.label || 'Metric',
      value: String(b.value),
      change: b.subtext,
      trend: b.subtext?.includes('+') ? 'up' : b.subtext?.includes('-') ? 'down' : 'neutral' as 'up' | 'down' | 'neutral',
    }));
  
  return {
    ...base,
    metrics: metrics.length > 0 ? metrics.slice(0, 6) : [
      { label: 'Metric 1', value: '100', trend: 'up' as const },
      { label: 'Metric 2', value: '200', trend: 'down' as const },
    ],
  } as unknown as TemplateProps;
}

function mapToIssueTree(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  return {
    ...base,
    rootProblem: blueprint.slideTitle,
    branches: blueprint.contentBlocks.slice(0, 4).map(b => ({
      cause: b.label || 'Cause',
      subCauses: b.items || [String(b.value)],
    })),
  } as unknown as TemplateProps;
}

function mapToTimeline(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  return {
    ...base,
    milestones: blueprint.contentBlocks.slice(0, 6).map((b, index) => ({
      date: b.label || `Q${index + 1} 2024`,
      label: String(b.value).slice(0, 30),
      description: b.subtext || '',
      status: index === 0 ? 'complete' : index === 1 ? 'current' : 'future' as 'complete' | 'current' | 'future',
    })),
  } as unknown as TemplateProps;
}

function mapToGraphChart(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  const nodes = blueprint.contentBlocks.map((b, index) => ({
    id: `node-${index}`,
    label: b.label || String(b.value).slice(0, 20),
    type: index === 0 ? 'central' : index < 3 ? 'primary' : 'secondary' as 'central' | 'primary' | 'secondary',
  }));
  
  const edges = nodes.slice(1).map((node, index) => ({
    from: 'node-0',
    to: node.id,
    label: '',
  }));
  
  return {
    ...base,
    nodes: nodes.length > 0 ? nodes : [
      { id: 'center', label: 'Central', type: 'central' as const },
      { id: 'a', label: 'A', type: 'primary' as const },
    ],
    edges: edges.length > 0 ? edges : [{ from: 'center', to: 'a' }],
  } as unknown as TemplateProps;
}

function mapToGeneral(blueprint: SlideBlueprint, base: Record<string, unknown>): TemplateProps {
  return {
    ...base,
    content: blueprint.keyMessage,
    sections: blueprint.contentBlocks.map(b => ({
      heading: b.label || 'Section',
      text: String(b.value),
    })),
  } as unknown as TemplateProps;
}
