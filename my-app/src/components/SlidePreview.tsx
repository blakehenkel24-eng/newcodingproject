import { DensityMode, ArchetypeId, TemplateProps } from '@/types/slide';
import { ExecutiveSummary } from './templates/ExecutiveSummary';
import { HorizontalFlow } from './templates/HorizontalFlow';
import { TwoByTwoMatrix } from './templates/TwoByTwoMatrix';
import { ComparisonTable } from './templates/ComparisonTable';
import { DataChart } from './templates/DataChart';
import { MultiMetric } from './templates/MultiMetric';
import { IssueTree } from './templates/IssueTree';
import { Timeline } from './templates/Timeline';
import { GraphChart } from './templates/GraphChart';
import { General } from './templates/General';

interface SlidePreviewProps {
  templateId: string;
  archetypeId?: ArchetypeId;
  props: Record<string, unknown> | TemplateProps;
  density: DensityMode;
}

// Map legacy template IDs and new archetype IDs to components
const templateComponents: Record<string, React.FC<any>> = {
  // Legacy templates
  executive_summary: ExecutiveSummary,
  horizontal_flow: HorizontalFlow,
  two_by_two_matrix: TwoByTwoMatrix,
  comparison_table: ComparisonTable,
  data_chart: DataChart,
  multi_metric: MultiMetric,
  issue_tree: IssueTree,
  timeline: Timeline,
  graph_chart: GraphChart,
  general: General,
  
  // New archetypes (map to closest existing template or General for now)
  situation_complication_resolution: ExecutiveSummary,
  three_pillar: ExecutiveSummary, // Could create dedicated component
  kpi_dashboard: MultiMetric,
  process_flow: HorizontalFlow,
  timeline_swimlane: Timeline,
  before_after: ComparisonTable,
  waterfall_chart: DataChart,
  trend_line: DataChart,
  stacked_bar: DataChart,
  decision_tree: IssueTree,
  grid_cards: ExecutiveSummary,
  market_sizing: TwoByTwoMatrix,
  competitive_landscape: TwoByTwoMatrix,
  agenda_divider: General,
};

/**
 * Map new archetype props to legacy template props format
 * This ensures backward compatibility while we migrate templates
 */
function mapPropsToLegacy(
  archetypeId: ArchetypeId | string,
  props: Record<string, unknown> | TemplateProps
): Record<string, unknown> {
  // If it's already a legacy template, return as-is
  if (!archetypeId || archetypeId in templateComponents) {
    return props as Record<string, unknown>;
  }

  // Map new archetype props to legacy format
  const mappedProps: Record<string, unknown> = {
    ...props,
    title: (props as any).title || 'Slide',
  };

  switch (archetypeId) {
    case 'kpi_dashboard':
      // Map KPI dashboard metrics to MultiMetric format
      if ((props as any).metrics) {
        mappedProps.metrics = (props as any).metrics.map((m: any) => ({
          label: m.label,
          value: m.value,
          change: m.context,
          trend: m.trend || 'neutral',
        }));
      }
      break;

    case 'process_flow':
      // Map process flow steps to HorizontalFlow format
      if ((props as any).steps) {
        mappedProps.steps = (props as any).steps.map((s: any) => ({
          number: s.number,
          label: s.title,
          description: s.description,
        }));
      }
      break;

    case 'three_pillar':
      // Map three pillar to ExecutiveSummary points format
      if ((props as any).pillars) {
        mappedProps.points = (props as any).pillars.map((p: any, index: number) => ({
          title: p.title,
          description: p.description,
          highlight: index === 0,
        }));
      }
      break;

    case 'before_after':
      // Map before/after to comparison format
      mappedProps.headers = ['Aspect', 'Current State', 'Future State'];
      const before = (props as any).before;
      const after = (props as any).after;
      if (before && after) {
        mappedProps.rows = [
          { criteria: 'Key Points', values: [before.painPoints?.[0] || '', after.benefits?.[0] || ''] },
        ];
      }
      break;

    case 'situation_complication_resolution':
      // Map SCR to ExecutiveSummary with combined points
      const situation = (props as any).situation;
      const complication = (props as any).complication;
      const resolution = (props as any).resolution;
      mappedProps.points = [
        { title: situation?.title || 'Situation', description: situation?.points?.[0] || '', highlight: false },
        { title: complication?.title || 'Complication', description: complication?.points?.[0] || '', highlight: false },
        { title: resolution?.title || 'Resolution', description: resolution?.points?.[0] || '', highlight: true },
      ];
      break;

    default:
      // For unmapped archetypes, pass through with basic props
      break;
  }

  return mappedProps;
}

export function SlidePreview({ templateId, archetypeId, props, density }: SlidePreviewProps) {
  // Use archetypeId if provided, otherwise fall back to templateId
  const effectiveId = archetypeId || templateId;
  
  // Get the component
  const TemplateComponent = templateComponents[effectiveId] || General;
  
  // Map props if using new archetype
  const mappedProps = archetypeId 
    ? mapPropsToLegacy(archetypeId, props)
    : props;

  return (
    <div className="slide-container bg-white shadow-lg">
      <TemplateComponent {...mappedProps} density={density} />
    </div>
  );
}
