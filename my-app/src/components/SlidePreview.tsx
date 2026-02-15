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
  
  // New archetypes mapped to appropriate templates
  situation_complication_resolution: ExecutiveSummary,
  three_pillar: ExecutiveSummary,
  kpi_dashboard: MultiMetric,
  process_flow: HorizontalFlow,
  timeline_swimlane: Timeline,
  before_after: ComparisonTable,
  waterfall_chart: DataChart,
  trend_line: DataChart,
  stacked_bar: DataChart,
  decision_tree: IssueTree,
  grid_cards: ExecutiveSummary,
  market_sizing: ExecutiveSummary,  // Better represented as structured summary
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
  // Always create a base mapped props object
  const mappedProps: Record<string, unknown> = {
    ...props,
    title: (props as any).title || 'Slide',
  };

  // If no archetypeId, return basic mapped props
  if (!archetypeId) {
    return mappedProps;
  }

  switch (archetypeId) {
    case 'executive_summary':
      // Ensure points array exists and has content for ExecutiveSummary
      let points = (props as any).points;
      if (!points || !Array.isArray(points) || points.length === 0) {
        // Fallback: create points from keyMessage or title
        const keyMessage = (props as any).keyMessage || (props as any).coreMessage;
        if (keyMessage) {
          points = [{ title: 'Key Insight', description: keyMessage, highlight: true }];
        } else {
          points = [{ title: 'No content available', description: 'Please try regenerating the slide', highlight: false }];
        }
      }
      mappedProps.points = points;
      mappedProps.keyMessage = (props as any).keyMessage || (props as any).coreMessage || '';
      break;

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
      } else {
        mappedProps.points = [{ title: 'No content available', description: '', highlight: false }];
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
      const scrPoints = [
        { title: situation?.title || 'Situation', description: situation?.points?.join('. ') || '', highlight: false },
        { title: complication?.title || 'Complication', description: complication?.points?.join('. ') || '', highlight: false },
        { title: resolution?.title || 'Resolution', description: resolution?.points?.join('. ') || '', highlight: true },
      ];
      // Ensure points is always an array with content
      const filteredPoints = scrPoints.filter(p => p.description);
      (mappedProps as any).points = filteredPoints.length > 0 
        ? filteredPoints 
        : [{ title: 'No content available', description: 'Please try regenerating the slide', highlight: false }];
      mappedProps.keyMessage = (props as any).keyMessage || '';
      break;

    case 'market_sizing':
      // Map TAM/SAM/SOM levels to ExecutiveSummary points
      const levels = (props as any).levels;
      if (levels && Array.isArray(levels)) {
        (mappedProps as any).points = levels.map((level: any, index: number) => ({
          title: level.name || level.label || `Level ${index + 1}`,
          description: `${level.value}${level.description ? ` — ${level.description}` : ''}`,
          highlight: index === levels.length - 1, // Highlight SOM (last level)
        }));
      }
      mappedProps.keyMessage = (props as any).methodology || (props as any).keyMessage || '';
      break;

    case 'waterfall_chart':
    case 'trend_line':
    case 'stacked_bar':
      // These map to DataChart - ensure data is properly formatted
      if ((props as any).data || (props as any).series) {
        mappedProps.data = (props as any).data || (props as any).series?.[0]?.data || [];
        mappedProps.series = (props as any).series;
        mappedProps.xAxisLabel = (props as any).xAxisLabel || '';
        mappedProps.yAxisLabel = (props as any).yAxisLabel || '';
        mappedProps.keyTakeaway = (props as any).keyTakeaway || (props as any).keyMessage || '';
      }
      break;

    case 'issue_tree':
    case 'decision_tree':
      // These map to IssueTree - ensure branches are properly formatted
      if ((props as any).branches) {
        mappedProps.root = (props as any).rootProblem || (props as any).rootQuestion || props.title;
        mappedProps.branches = (props as any).branches;
      }
      break;

    case 'grid_cards':
      // Map grid cards to ExecutiveSummary points format
      const cards = (props as any).cards;
      if (cards && Array.isArray(cards)) {
        (mappedProps as any).points = cards.map((card: any, index: number) => ({
          title: card.title,
          description: card.body || card.description || '',
          highlight: index === 0,
          icon: card.icon,
        }));
      }
      mappedProps.keyMessage = (props as any).keyMessage || '';
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
