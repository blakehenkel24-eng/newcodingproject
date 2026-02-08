/**
 * Stage 4: PPTX Generator
 * Native PowerPoint generation using PptxGenJS with archetype-specific renderers
 */

import type { TemplateProps } from '@/lib/llm/archetypeClassifier';
import { ArchetypeId } from '@/lib/llm/archetypes';
import PptxGenJS from 'pptxgenjs';

// === DESIGN TOKENS (aligned with HTML design system) ===
export const DESIGN_TOKENS = {
  colors: {
    navy900: '1A365D',
    navy800: '2C5282',
    navy700: '2B6CB0',
    navy100: 'EBF8FF',
    coral600: 'E53E3E',
    coral500: 'F56565',
    coral100: 'FFF5F5',
    gray900: '1A202C',
    gray700: '4A5568',
    gray500: 'A0AEC0',
    gray200: 'EDF2F7',
    gray100: 'F7FAFC',
    white: 'FFFFFF',
    green: '38A169',
  },

  fonts: {
    title: { face: 'Calibri', size: 28, bold: true, color: '1A365D' },
    subtitle: { face: 'Calibri', size: 16, bold: false, color: '4A5568' },
    body: { face: 'Calibri', size: 12, bold: false, color: '1A202C' },
    bodyBold: { face: 'Calibri', size: 12, bold: true, color: '1A202C' },
    caption: { face: 'Calibri', size: 9, bold: false, color: 'A0AEC0' },
    stat: { face: 'Calibri', size: 40, bold: true, color: '1A365D' },
    statLabel: { face: 'Calibri', size: 10, bold: false, color: 'A0AEC0' },
    cardTitle: { face: 'Calibri', size: 14, bold: true, color: '1A365D' },
  },

  layout: {
    slideW: 10, // inches
    slideH: 5.625, // inches (16:9)
    paddingX: 0.5,
    paddingY: 0.4,
    titleY: 0.4,
    titleH: 0.9,
    contentStartY: 1.4,
  },
};

// === FACTORY FUNCTIONS (avoid object mutation issues) ===
const makeShadow = () => ({
  type: 'outer' as const,
  blur: 4,
  offset: 2,
  angle: 135,
  color: '000000',
  opacity: 0.08,
});

// === MAIN GENERATION FUNCTION ===

export async function generatePPTX(
  archetypeId: ArchetypeId,
  props: TemplateProps,
  filename: string = 'slide.pptx'
): Promise<Blob> {
  const pptx = new PptxGenJS();

  // Set presentation metadata
  pptx.author = 'SlideTheory';
  pptx.company = 'SlideTheory';
  pptx.subject = props.title;
  pptx.title = props.title;

  // Create slide
  const slide = pptx.addSlide();
  slide.background = { color: DESIGN_TOKENS.colors.white };

  // Add title (all slides have titles)
  addTitle(slide, props.title, props.subtitle);

  // Add archetype-specific content
  renderArchetype(slide as any, pptx as any, archetypeId, props);

  // Add footnote/source if present
  if (props.footnote || props.source) {
    addSourceLine(slide, props.footnote as string | undefined, props.source as string | undefined);
  }

  // Generate and return blob
  const data = await (pptx as any).writeFile({ fileName: filename, outputType: 'blob' });
  return data as Blob;
}

// === SHARED COMPONENTS ===

function addTitle(slide: PptxGenJS.Slide, title: string, subtitle?: string): void {
  const { layout, fonts } = DESIGN_TOKENS;

  // Main title
  slide.addText(title, {
    x: layout.paddingX,
    y: layout.titleY,
    w: layout.slideW - layout.paddingX * 2,
    h: subtitle ? layout.titleH * 0.6 : layout.titleH,
    ...fonts.title,
    valign: 'top',
    margin: 0,
  });

  // Subtitle if provided
  if (subtitle) {
    slide.addText(subtitle, {
      x: layout.paddingX,
      y: layout.titleY + layout.titleH * 0.55,
      w: layout.slideW - layout.paddingX * 2,
      h: 0.35,
      ...fonts.subtitle,
      valign: 'top',
      margin: 0,
    });
  }
}

function addSourceLine(
  slide: PptxGenJS.Slide,
  footnote?: string,
  source?: string
): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;

  const text = source ? `Source: ${source}` : footnote || '';

  slide.addText(text, {
    x: layout.paddingX,
    y: layout.slideH - 0.3,
    w: 6,
    h: 0.2,
    ...fonts.caption,
    color: colors.gray500,
    margin: 0,
  });
}

// === ARCHETYPE RENDERERS ===

type Slide = any;
type Pptx = any;

function renderArchetype(
  slide: Slide,
  pptx: Pptx,
  archetypeId: ArchetypeId,
  props: TemplateProps
): void {
  const renderers: Record<ArchetypeId, (slide: Slide, pptx: Pptx, props: TemplateProps) => void> = {
    executive_summary: renderExecutiveSummary,
    situation_complication_resolution: renderSCR,
    three_pillar: renderThreePillar,
    kpi_dashboard: renderKPIDashboard,
    comparison_table: renderComparisonTable,
    process_flow: renderProcessFlow,
    timeline_swimlane: renderTimelineSwimlane,
    two_by_two_matrix: renderTwoByTwoMatrix,
    before_after: renderBeforeAfter,
    waterfall_chart: renderWaterfallChart,
    trend_line: renderTrendLine,
    stacked_bar: renderStackedBar,
    issue_tree: renderIssueTree,
    decision_tree: renderDecisionTree,
    grid_cards: renderGridCards,
    market_sizing: renderMarketSizing,
    competitive_landscape: renderCompetitiveLandscape,
    agenda_divider: renderAgendaDivider,
  };

  const renderer = renderers[archetypeId] || renderExecutiveSummary;
  renderer(slide, pptx, props);
}

// --- Executive Summary ---
function renderExecutiveSummary(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const points = (props as any).points as Array<{ title: string; description: string; highlight?: boolean }> | undefined;
  const startY = layout.contentStartY;

  // Optional callout stat on the right
  const callout = (props as any).callout as { value: string; label: string; context?: string } | undefined;

  const contentWidth = callout ? 6.5 : 9;

  // Render points
  points?.slice(0, 4).forEach((point, index) => {
    const y = startY + index * 0.95;

    // Bullet point
    slide.addShape(pptx.shapes.OVAL, {
      x: layout.paddingX,
      y: y + 0.08,
      w: 0.1,
      h: 0.1,
      fill: { color: point.highlight ? colors.coral600 : colors.navy800 },
    });

    // Point title
    slide.addText(point.title, {
      x: layout.paddingX + 0.25,
      y: y,
      w: contentWidth - 0.5,
      h: 0.35,
      ...fonts.bodyBold,
      margin: 0,
    });

    // Point description
    if (point.description) {
      slide.addText(point.description, {
        x: layout.paddingX + 0.25,
        y: y + 0.32,
        w: contentWidth - 0.5,
        h: 0.5,
        ...fonts.body,
        margin: 0,
      });
    }
  });

  // Render callout if present
  if (callout) {
    const calloutX = 7.5;
    const calloutY = startY + 0.5;

    // Callout box
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: calloutX,
      y: calloutY,
      w: 2,
      h: 2.5,
      fill: { color: colors.navy100 },
      line: { color: colors.navy700, width: 1 },
    });

    // Callout value
    slide.addText(callout.value, {
      x: calloutX,
      y: calloutY + 0.3,
      w: 2,
      h: 0.8,
      ...fonts.stat,
      align: 'center',
      margin: 0,
    });

    // Callout label
    slide.addText(callout.label.toUpperCase(), {
      x: calloutX,
      y: calloutY + 1.1,
      w: 2,
      h: 0.3,
      ...fonts.statLabel,
      align: 'center',
      margin: 0,
    });

    // Context
    if (callout.context) {
      slide.addText(callout.context, {
        x: calloutX,
        y: calloutY + 1.5,
        w: 2,
        h: 0.5,
        fontSize: 11,
        color: colors.gray700,
        align: 'center',
        margin: 0,
      });
    }
  }
}

// --- Situation-Complication-Resolution ---
function renderSCR(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const sectionWidth = (layout.slideW - layout.paddingX * 2 - 0.4) / 3;
  const startY = layout.contentStartY;
  const sectionHeight = 3.5;

  const sections = [
    { key: 'situation', title: 'Situation', color: colors.navy800 },
    { key: 'complication', title: 'Complication', color: colors.coral600 },
    { key: 'resolution', title: 'Resolution', color: colors.green },
  ];

  sections.forEach((section, index) => {
    const x = layout.paddingX + index * (sectionWidth + 0.2);
    const data = (props as any)[section.key] as { title: string; points: string[] } | undefined;

    // Section header bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: startY,
      w: sectionWidth,
      h: 0.08,
      fill: { color: section.color },
    });

    // Section title
    slide.addText(data?.title || section.title, {
      x: x + 0.15,
      y: startY + 0.2,
      w: sectionWidth - 0.3,
      h: 0.4,
      ...fonts.cardTitle,
      color: section.color,
      margin: 0,
    });

    // Section points
    const points = data?.points || [];
    const bullets = points.slice(0, 4).map((point, pidx) => ({
      text: point,
      options: {
        bullet: true,
        breakLine: pidx < points.length - 1,
        fontSize: 11,
        color: colors.gray700,
        paraSpaceAfter: 6,
      },
    }));

    if (bullets.length > 0) {
      slide.addText(bullets, {
        x: x + 0.15,
        y: startY + 0.7,
        w: sectionWidth - 0.3,
        h: sectionHeight - 1,
        valign: 'top',
        margin: 0,
      });
    }
  });
}

// --- Three Pillar ---
function renderThreePillar(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const pillars = (props as any).pillars as Array<{
    icon: string;
    title: string;
    description: string;
    bullets?: string[];
    metrics?: string[];
  }> | undefined;

  const cardWidth = (layout.slideW - layout.paddingX * 2 - 0.4) / 3;
  const cardHeight = 3.6;
  const startY = layout.contentStartY;

  pillars?.slice(0, 3).forEach((pillar, index) => {
    const x = layout.paddingX + index * (cardWidth + 0.2);

    // Card background
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: startY,
      w: cardWidth,
      h: cardHeight,
      fill: { color: colors.gray100 },
      shadow: makeShadow(),
    });

    // Top accent bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: startY,
      w: cardWidth,
      h: 0.06,
      fill: { color: colors.coral600 },
    });

    // Card title
    slide.addText(pillar.title, {
      x: x + 0.2,
      y: startY + 0.25,
      w: cardWidth - 0.4,
      h: 0.4,
      ...fonts.cardTitle,
      margin: 0,
    });

    // Description
    slide.addText(pillar.description, {
      x: x + 0.2,
      y: startY + 0.7,
      w: cardWidth - 0.4,
      h: 0.6,
      ...fonts.body,
      margin: 0,
    });

    // Metrics if present
    if (pillar.metrics && pillar.metrics.length > 0) {
      pillar.metrics.slice(0, 2).forEach((metric, midx) => {
        slide.addText(metric, {
          x: x + 0.2,
          y: startY + 1.4 + midx * 0.35,
          w: cardWidth - 0.4,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: colors.navy800,
          margin: 0,
        });
      });
    }

    // Additional bullets
    if (pillar.bullets && pillar.bullets.length > 0) {
      const bulletY = startY + (pillar.metrics?.length ? 2.1 : 1.4);
      const bullets = pillar.bullets.slice(0, 3).map((bullet, bidx) => ({
        text: bullet,
        options: {
          bullet: true,
          breakLine: bidx < pillar.bullets!.length - 1,
          fontSize: 10,
          color: colors.gray700,
          paraSpaceAfter: 3,
        },
      }));

      slide.addText(bullets, {
        x: x + 0.2,
        y: bulletY,
        w: cardWidth - 0.4,
        h: cardHeight - bulletY + startY - 0.2,
        valign: 'top',
        margin: 0,
      });
    }
  });
}

// --- KPI Dashboard ---
function renderKPIDashboard(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const metrics = (props as any).metrics as Array<{
    label: string;
    value: string;
    unit?: string;
    context?: string;
    trend?: 'up' | 'down' | 'neutral';
  }> | undefined;

  const startY = layout.contentStartY + 0.3;
  const metricCount = Math.min(metrics?.length || 0, 5);
  const spacing = (layout.slideW - layout.paddingX * 2) / metricCount;

  metrics?.slice(0, metricCount).forEach((metric, index) => {
    const x = layout.paddingX + index * spacing;

    // Metric value
    const displayValue = metric.unit === '$' ? `$${metric.value}` : `${metric.value}${metric.unit || ''}`;

    slide.addText(displayValue, {
      x: x,
      y: startY,
      w: spacing,
      h: 0.9,
      ...fonts.stat,
      align: 'center',
      valign: 'bottom',
      margin: 0,
    });

    // Metric label
    slide.addText(metric.label.toUpperCase(), {
      x: x,
      y: startY + 0.95,
      w: spacing,
      h: 0.3,
      ...fonts.statLabel,
      align: 'center',
      margin: 0,
    });

    // Trend indicator
    if (metric.trend && metric.trend !== 'neutral') {
      const trendColor = metric.trend === 'up' ? colors.green : colors.coral600;
      const trendText = metric.context || (metric.trend === 'up' ? '▲ Up' : '▼ Down');

      slide.addText(trendText, {
        x: x,
        y: startY + 1.3,
        w: spacing,
        h: 0.25,
        fontSize: 11,
        color: trendColor,
        align: 'center',
        margin: 0,
      });
    } else if (metric.context) {
      slide.addText(metric.context, {
        x: x,
        y: startY + 1.3,
        w: spacing,
        h: 0.25,
        fontSize: 11,
        color: colors.gray700,
        align: 'center',
        margin: 0,
      });
    }

    // Divider line (not after last)
    if (index < metricCount - 1) {
      slide.addShape(pptx.shapes.LINE, {
        x: x + spacing - 0.05,
        y: startY + 0.15,
        w: 0,
        h: 1.4,
        line: { color: colors.gray200, width: 1 },
      });
    }
  });

  // Context line
  if ((props as any).contextLine) {
    slide.addText((props as any).contextLine as string, {
      x: layout.paddingX,
      y: startY + 2.2,
      w: layout.slideW - layout.paddingX * 2,
      h: 0.4,
      ...fonts.body,
      align: 'center',
      margin: 0,
    });
  }
}

// --- Comparison Table ---
function renderComparisonTable(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const headers = (props as any).headers as string[] | undefined;
  const rows = (props as any).rows as Array<{ criteria: string; values: string[] }> | undefined;
  const recommendedColumn = (props as any).recommendedColumn as number | undefined;

  const startY = layout.contentStartY;
  const tableWidth = layout.slideW - layout.paddingX * 2;
  const colWidth = tableWidth / (headers?.length || 3);
  const rowHeight = 0.45;

  // Header row
  headers?.forEach((header, index) => {
    const x = layout.paddingX + index * colWidth;

    // Header background
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: startY,
      w: colWidth,
      h: rowHeight,
      fill: { color: colors.navy900 },
    });

    // Header text
    slide.addText(header, {
      x: x + 0.1,
      y: startY + 0.08,
      w: colWidth - 0.2,
      h: rowHeight - 0.15,
      fontSize: 12,
      bold: true,
      color: colors.white,
      valign: 'middle',
      margin: 0,
    });

    // Highlight recommended column
    if (recommendedColumn === index) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: x - 0.02,
        y: startY,
        w: 0.04,
        h: rowHeight + (rows?.length || 0) * rowHeight,
        fill: { color: colors.coral600 },
      });
    }
  });

  // Data rows
  rows?.slice(0, 8).forEach((row, rowIndex) => {
    const y = startY + (rowIndex + 1) * rowHeight;
    const bgColor = rowIndex % 2 === 0 ? colors.white : colors.gray100;

    // Criteria column
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: layout.paddingX,
      y,
      w: colWidth,
      h: rowHeight,
      fill: { color: bgColor },
    });

    slide.addText(row.criteria, {
      x: layout.paddingX + 0.1,
      y: y + 0.08,
      w: colWidth - 0.2,
      h: rowHeight - 0.15,
      ...fonts.bodyBold,
      valign: 'middle',
      margin: 0,
    });

    // Value columns
    row.values.forEach((value, colIndex) => {
      const x = layout.paddingX + (colIndex + 1) * colWidth;
      const isRecommended = recommendedColumn === colIndex + 1;

      slide.addShape(pptx.shapes.RECTANGLE, {
        x,
        y,
        w: colWidth,
        h: rowHeight,
        fill: { color: isRecommended ? colors.coral100 : bgColor },
      });

      slide.addText(String(value), {
        x: x + 0.1,
        y: y + 0.08,
        w: colWidth - 0.2,
        h: rowHeight - 0.15,
        ...fonts.body,
        valign: 'middle',
        margin: 0,
      });
    });
  });
}

// --- Process Flow ---
function renderProcessFlow(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, colors } = DESIGN_TOKENS;
  const steps = (props as any).steps as Array<{ number: number; title: string; description: string }> | undefined;

  const startY = layout.contentStartY + 0.5;
  const stepCount = Math.min(steps?.length || 0, 6);
  const stepWidth = (layout.slideW - layout.paddingX * 2 - (stepCount - 1) * 0.15) / stepCount;
  const stepHeight = 2.5;

  steps?.slice(0, stepCount).forEach((step, index) => {
    const x = layout.paddingX + index * (stepWidth + 0.15);

    // Main step body
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: index === 0 ? x : x - 0.15,
      y: startY,
      w: stepWidth + (index === 0 ? 0 : 0.15),
      h: stepHeight,
      fill: { color: colors.navy800 },
    });

    // Step number
    slide.addText(String(step.number), {
      x: x + 0.15,
      y: startY + 0.2,
      w: stepWidth - 0.3,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: 'FFFFFF',
      margin: 0,
    });

    // Step title
    slide.addText(step.title, {
      x: x + 0.15,
      y: startY + 0.75,
      w: stepWidth - 0.3,
      h: 0.5,
      fontSize: 13,
      bold: true,
      color: 'FFFFFF',
      margin: 0,
    });

    // Step description
    slide.addText(step.description, {
      x: x + 0.15,
      y: startY + 1.35,
      w: stepWidth - 0.3,
      h: 1,
      fontSize: 10,
      color: 'FFFFFF',
      valign: 'top',
      margin: 0,
    });
  });
}

// --- Timeline Swimlane ---
function renderTimelineSwimlane(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const periods = (props as any).periods as string[] | undefined;
  const lanes = (props as any).lanes as Array<{
    name: string;
    activities: Array<{ start: string; end: string; label: string }>;
  }> | undefined;

  const startY = layout.contentStartY;
  const labelWidth = 1.4;
  const trackWidth = layout.slideW - layout.paddingX * 2 - labelWidth;
  const colWidth = trackWidth / (periods?.length || 4);
  const laneHeight = 0.6;

  // Period headers
  periods?.forEach((period, index) => {
    const x = layout.paddingX + labelWidth + index * colWidth;

    slide.addText(period, {
      x,
      y: startY,
      w: colWidth,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: colors.navy800,
      align: 'center',
      margin: 0,
    });
  });

  // Lanes
  lanes?.slice(0, 5).forEach((lane, laneIndex) => {
    const y = startY + 0.4 + laneIndex * laneHeight;

    // Lane label
    slide.addText(lane.name, {
      x: layout.paddingX,
      y: y + 0.1,
      w: labelWidth - 0.1,
      h: 0.4,
      fontSize: 10,
      bold: true,
      color: colors.navy900,
      valign: 'middle',
      margin: 0,
    });

    // Lane background
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: layout.paddingX + labelWidth,
      y,
      w: trackWidth,
      h: laneHeight - 0.1,
      fill: { color: laneIndex % 2 === 0 ? colors.gray100 : colors.white },
    });

    // Activities
    lane.activities?.slice(0, 3).forEach((activity) => {
      const startIdx = periods?.indexOf(activity.start) ?? -1;
      const endIdx = periods?.indexOf(activity.end) ?? -1;

      if (startIdx >= 0 && endIdx >= 0) {
        const barX = layout.paddingX + labelWidth + startIdx * colWidth + 0.05;
        const barW = (endIdx - startIdx + 1) * colWidth - 0.1;

        slide.addShape(pptx.shapes.RECTANGLE, {
          x: barX,
          y: y + 0.12,
          w: barW,
          h: 0.35,
          fill: { color: colors.navy800 },
        });

        slide.addText(activity.label, {
          x: barX,
          y: y + 0.15,
          w: barW,
          h: 0.3,
          fontSize: 9,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle',
          margin: 0,
        });
      }
    });
  });
}

// --- Two-by-Two Matrix ---
function renderTwoByTwoMatrix(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const xAxisLabel = (props as any).xAxisLabel as string || 'Effort';
  const yAxisLabel = (props as any).yAxisLabel as string || 'Impact';
  const quadrants = (props as any).quadrants as Array<{
    name: string;
    position: string;
    items: string[];
  }> | undefined;

  const startY = layout.contentStartY;
  const matrixSize = 3.5;
  const cellSize = matrixSize / 2;
  const matrixX = (layout.slideW - matrixSize) / 2;
  const matrixY = startY + 0.3;

  // Y-axis label
  slide.addText(yAxisLabel, {
    x: layout.paddingX,
    y: matrixY + matrixSize / 2 - 0.15,
    w: 1,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: colors.navy800,
    align: 'center',
    margin: 0,
  });

  // X-axis label
  slide.addText(xAxisLabel, {
    x: matrixX + matrixSize / 2 - 0.5,
    y: matrixY + matrixSize + 0.2,
    w: 1,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: colors.navy800,
    align: 'center',
    margin: 0,
  });

  // Grid lines
  slide.addShape(pptx.shapes.LINE, {
    x: matrixX + matrixSize / 2,
    y: matrixY,
    w: 0,
    h: matrixSize,
    line: { color: colors.gray200, width: 1, dashType: 'dash' },
  });

  slide.addShape(pptx.shapes.LINE, {
    x: matrixX,
    y: matrixY + matrixSize / 2,
    w: matrixSize,
    h: 0,
    line: { color: colors.gray200, width: 1, dashType: 'dash' },
  });

  // Quadrant labels and items
  const quadrantPositions: Record<string, { x: number; y: number }> = {
    'top-left': { x: matrixX, y: matrixY },
    'top-right': { x: matrixX + cellSize, y: matrixY },
    'bottom-left': { x: matrixX, y: matrixY + cellSize },
    'bottom-right': { x: matrixX + cellSize, y: matrixY + cellSize },
  };

  quadrants?.forEach((quadrant) => {
    const pos = quadrantPositions[quadrant.position];
    if (!pos) return;

    // Quadrant name
    slide.addText(quadrant.name, {
      x: pos.x + 0.1,
      y: pos.y + 0.1,
      w: cellSize - 0.2,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: colors.navy800,
      margin: 0,
    });

    // Items
    quadrant.items.slice(0, 4).forEach((item, index) => {
      slide.addText(`• ${item}`, {
        x: pos.x + 0.1,
        y: pos.y + 0.45 + index * 0.28,
        w: cellSize - 0.2,
        h: 0.25,
        fontSize: 10,
        color: colors.gray700,
        margin: 0,
      });
    });
  });
}

// --- Before/After ---
function renderBeforeAfter(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const before = (props as any).before as { title: string; painPoints: string[]; metrics?: Array<{ label: string; value: string }> } | undefined;
  const after = (props as any).after as { title: string; benefits: string[]; metrics?: Array<{ label: string; value: string }> } | undefined;

  const startY = layout.contentStartY;
  const colWidth = (layout.slideW - layout.paddingX * 2 - 0.5) / 2;

  // Before column
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: layout.paddingX,
    y: startY,
    w: colWidth,
    h: 3.5,
    fill: { color: colors.gray100 },
  });

  slide.addText(before?.title || 'Current State', {
    x: layout.paddingX + 0.2,
    y: startY + 0.2,
    w: colWidth - 0.4,
    h: 0.4,
    ...fonts.cardTitle,
    color: colors.coral600,
    margin: 0,
  });

  before?.painPoints.slice(0, 4).forEach((point, index) => {
    slide.addText(`✗ ${point}`, {
      x: layout.paddingX + 0.2,
      y: startY + 0.7 + index * 0.45,
      w: colWidth - 0.4,
      h: 0.4,
      fontSize: 11,
      color: colors.gray700,
      margin: 0,
    });
  });

  // Arrow in middle
  slide.addShape(pptx.shapes.RIGHT_ARROW, {
    x: layout.paddingX + colWidth + 0.1,
    y: startY + 1.5,
    w: 0.3,
    h: 0.5,
    fill: { color: colors.navy800 },
  });

  // After column
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: layout.paddingX + colWidth + 0.5,
    y: startY,
    w: colWidth,
    h: 3.5,
    fill: { color: colors.navy100 },
  });

  slide.addText(after?.title || 'Future State', {
    x: layout.paddingX + colWidth + 0.7,
    y: startY + 0.2,
    w: colWidth - 0.4,
    h: 0.4,
    ...fonts.cardTitle,
    color: colors.green,
    margin: 0,
  });

  after?.benefits.slice(0, 4).forEach((benefit, index) => {
    slide.addText(`✓ ${benefit}`, {
      x: layout.paddingX + colWidth + 0.7,
      y: startY + 0.7 + index * 0.45,
      w: colWidth - 0.4,
      h: 0.4,
      fontSize: 11,
      color: colors.gray700,
      margin: 0,
    });
  });
}

// --- Waterfall Chart ---
function renderWaterfallChart(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const startValue = Number((props as any).startValue) || 0;
  const endValue = Number((props as any).endValue) || 0;
  const changes = (props as any).changes as Array<{ label: string; delta: number }> | undefined;

  const startY = layout.contentStartY + 0.5;
  const chartHeight = 2.5;
  const barWidth = 0.6;
  const spacing = 0.8;
  const totalItems = (changes?.length || 0) + 2;
  const totalWidth = totalItems * spacing;
  const startX = (layout.slideW - totalWidth) / 2;

  // Calculate running total for positioning
  let runningTotal = startValue;
  const maxValue = Math.max(startValue, endValue, ...(changes?.map((c) => Math.abs(c.delta)) || []));
  const scale = chartHeight / (maxValue * 1.2);

  // Start bar
  const startHeight = Math.abs(startValue) * scale;
  const startBarY = startY + chartHeight - startHeight;

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: startX,
    y: startBarY,
    w: barWidth,
    h: startHeight,
    fill: { color: colors.navy800 },
  });

  slide.addText(String(startValue), {
    x: startX,
    y: startBarY - 0.3,
    w: barWidth,
    h: 0.25,
    fontSize: 11,
    bold: true,
    color: colors.navy900,
    align: 'center',
    margin: 0,
  });

  slide.addText('Start', {
    x: startX,
    y: startY + chartHeight + 0.1,
    w: barWidth,
    h: 0.3,
    fontSize: 9,
    color: colors.gray700,
    align: 'center',
    margin: 0,
  });

  // Change bars
  changes?.forEach((change, index) => {
    const x = startX + (index + 1) * spacing;
    const isPositive = change.delta >= 0;
    const barHeight = Math.abs(change.delta) * scale;

    // Update running total
    runningTotal += change.delta;

    // Bar
    const prevHeight = index === 0 ? startHeight : Math.abs(runningTotal - change.delta) * scale;
    const prevY = startY + chartHeight - prevHeight;
    const barY = isPositive ? prevY - barHeight : prevY;

    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: barY,
      w: barWidth,
      h: barHeight,
      fill: { color: isPositive ? colors.green : colors.coral600 },
    });

    // Value label
    slide.addText((isPositive ? '+' : '') + String(change.delta), {
      x,
      y: barY - 0.3,
      w: barWidth,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: isPositive ? colors.green : colors.coral600,
      align: 'center',
      margin: 0,
    });

    // Label
    slide.addText(change.label, {
      x: x - 0.1,
      y: startY + chartHeight + 0.1,
      w: barWidth + 0.2,
      h: 0.5,
      fontSize: 8,
      color: colors.gray700,
      align: 'center',
      valign: 'top',
      margin: 0,
    });
  });

  // End bar
  const endX = startX + ((changes?.length || 0) + 1) * spacing;
  const endHeight = Math.abs(endValue) * scale;
  const endBarY = startY + chartHeight - endHeight;

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: endX,
    y: endBarY,
    w: barWidth,
    h: endHeight,
    fill: { color: colors.navy800 },
  });

  slide.addText(String(endValue), {
    x: endX,
    y: endBarY - 0.3,
    w: barWidth,
    h: 0.25,
    fontSize: 11,
    bold: true,
    color: colors.navy900,
    align: 'center',
    margin: 0,
  });

  slide.addText('End', {
    x: endX,
    y: startY + chartHeight + 0.1,
    w: barWidth,
    h: 0.3,
    fontSize: 9,
    color: colors.gray700,
    align: 'center',
    margin: 0,
  });
}

// --- Trend Line ---
function renderTrendLine(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const data = (props as any).data as Array<{ label: string; value: number }> | undefined;

  const startY = layout.contentStartY + 0.3;
  const chartHeight = 2.8;
  const chartWidth = layout.slideW - layout.paddingX * 2 - 1;
  const startX = layout.paddingX + 0.5;

  if (!data || data.length === 0) return;

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
  const minValue = Math.min(...data.map((d) => d.value)) * 0.9;
  const range = maxValue - minValue;

  const pointSpacing = chartWidth / (data.length - 1 || 1);

  // Y-axis
  slide.addShape(pptx.shapes.LINE, {
    x: startX,
    y: startY,
    w: 0,
    h: chartHeight,
    line: { color: colors.gray500, width: 1 },
  });

  // X-axis
  slide.addShape(pptx.shapes.LINE, {
    x: startX,
    y: startY + chartHeight,
    w: chartWidth,
    h: 0,
    line: { color: colors.gray500, width: 1 },
  });

  // Grid lines
  [0.25, 0.5, 0.75].forEach((pct) => {
    slide.addShape(pptx.shapes.LINE, {
      x: startX,
      y: startY + chartHeight * (1 - pct),
      w: chartWidth,
      h: 0,
      line: { color: colors.gray200, width: 0.5, dashType: 'dash' },
    });
  });

  // Points and connecting line
  const points: Array<{ x: number; y: number }> = [];

  data.forEach((point, index) => {
    const x = startX + index * pointSpacing;
    const y = startY + chartHeight - ((point.value - minValue) / range) * chartHeight;
    points.push({ x, y });

    // Data point
    slide.addShape(pptx.shapes.OVAL, {
      x: x - 0.06,
      y: y - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: colors.navy800 },
    });

    // X-axis label
    slide.addText(point.label, {
      x: x - 0.3,
      y: startY + chartHeight + 0.15,
      w: 0.6,
      h: 0.4,
      fontSize: 9,
      color: colors.gray700,
      align: 'center',
      margin: 0,
    });

    // Value label for key points
    if (index === 0 || index === data.length - 1 || point.value === maxValue || point.value === minValue) {
      slide.addText(String(point.value), {
        x: x - 0.3,
        y: y - 0.35,
        w: 0.6,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: colors.navy900,
        align: 'center',
        margin: 0,
      });
    }
  });

  // Connecting lines
  for (let i = 0; i < points.length - 1; i++) {
    slide.addShape(pptx.shapes.LINE, {
      x: points[i].x,
      y: points[i].y,
      w: points[i + 1].x - points[i].x,
      h: points[i + 1].y - points[i].y,
      line: { color: colors.navy800, width: 2 },
    });
  }

  // Key takeaway
  if ((props as any).keyTakeaway) {
    slide.addText((props as any).keyTakeaway as string, {
      x: layout.paddingX,
      y: startY + chartHeight + 0.7,
      w: layout.slideW - layout.paddingX * 2,
      h: 0.4,
      ...fonts.body,
      align: 'center',
      margin: 0,
    });
  }
}

// --- Stacked Bar ---
function renderStackedBar(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const data = (props as any).data as Array<{ category: string; value: number }> | undefined;

  const startY = layout.contentStartY + 0.5;
  const chartHeight = 2.5;
  const barHeight = 0.5;
  const maxBarWidth = layout.slideW - layout.paddingX * 2 - 2;

  if (!data || data.length === 0) return;

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;

  data.slice(0, 6).forEach((item, index) => {
    const y = startY + index * (barHeight + 0.2);
    const barWidth = (item.value / maxValue) * maxBarWidth;

    // Category label
    slide.addText(item.category, {
      x: layout.paddingX,
      y: y + 0.1,
      w: 1.5,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: colors.navy900,
      margin: 0,
    });

    // Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: layout.paddingX + 1.6,
      y,
      w: barWidth,
      h: barHeight,
      fill: { color: index % 2 === 0 ? colors.navy800 : colors.navy700 },
    });

    // Value label
    slide.addText(String(item.value), {
      x: layout.paddingX + 1.6 + barWidth + 0.1,
      y: y + 0.1,
      w: 1,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: colors.navy900,
      margin: 0,
    });
  });
}

// --- Issue Tree ---
function renderIssueTree(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const rootProblem = (props as any).rootProblem as string || props.title;
  const branches = (props as any).branches as Array<{ issue: string; subIssues: string[] }> | undefined;

  const startY = layout.contentStartY + 0.3;
  const branchWidth = (layout.slideW - layout.paddingX * 2 - 1) / Math.min(branches?.length || 1, 4);

  // Root problem box
  const rootWidth = 3;
  const rootX = (layout.slideW - rootWidth) / 2;

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: rootX,
    y: startY,
    w: rootWidth,
    h: 0.6,
    fill: { color: colors.navy800 },
  });

  slide.addText(rootProblem, {
    x: rootX + 0.15,
    y: startY + 0.15,
    w: rootWidth - 0.3,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    margin: 0,
  });

  // Branches
  branches?.slice(0, 4).forEach((branch, index) => {
    const branchX = layout.paddingX + 0.5 + index * branchWidth;
    const branchY = startY + 1.2;

    // Branch box
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: branchX,
      y: branchY,
      w: branchWidth - 0.4,
      h: 0.5,
      fill: { color: colors.gray100 },
      line: { color: colors.navy800, width: 1 },
    });

    slide.addText(branch.issue, {
      x: branchX + 0.1,
      y: branchY + 0.12,
      w: branchWidth - 0.6,
      h: 0.26,
      fontSize: 10,
      bold: true,
      color: colors.navy900,
      margin: 0,
    });

    // Sub-issues
    branch.subIssues.slice(0, 3).forEach((subIssue, sidx) => {
      slide.addText(`• ${subIssue}`, {
        x: branchX + 0.1,
        y: branchY + 0.7 + sidx * 0.35,
        w: branchWidth - 0.6,
        h: 0.3,
        fontSize: 9,
        color: colors.gray700,
        margin: 0,
      });
    });
  });
}

// --- Decision Tree ---
function renderDecisionTree(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const rootQuestion = (props as any).rootQuestion as string || props.title;
  const branches = (props as any).branches as Array<{
    condition: string;
    outcome: string;
    subBranches?: Array<{ condition: string; outcome: string }>;
  }> | undefined;

  const startY = layout.contentStartY + 0.3;
  const branchWidth = (layout.slideW - layout.paddingX * 2) / Math.min(branches?.length || 1, 3);

  // Root question
  const rootWidth = 2.5;
  const rootX = (layout.slideW - rootWidth) / 2;

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: rootX,
    y: startY,
    w: rootWidth,
    h: 0.7,
    fill: { color: colors.navy800 },
  });

  slide.addText(rootQuestion, {
    x: rootX + 0.1,
    y: startY + 0.15,
    w: rootWidth - 0.2,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle',
    margin: 0,
  });

  // Branches
  branches?.slice(0, 3).forEach((branch, index) => {
    const branchX = layout.paddingX + index * branchWidth;
    const branchY = startY + 1.5;

    // Condition label
    slide.addText(branch.condition, {
      x: branchX,
      y: startY + 0.9,
      w: branchWidth,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: colors.navy800,
      align: 'center',
      margin: 0,
    });

    // Outcome box
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: branchX + 0.2,
      y: branchY,
      w: branchWidth - 0.4,
      h: 0.6,
      fill: { color: colors.gray100 },
      line: { color: colors.navy700, width: 1 },
    });

    slide.addText(branch.outcome, {
      x: branchX + 0.3,
      y: branchY + 0.15,
      w: branchWidth - 0.6,
      h: 0.3,
      fontSize: 10,
      color: colors.navy900,
      align: 'center',
      margin: 0,
    });
  });
}

// --- Grid Cards ---
function renderGridCards(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const cards = (props as any).cards as Array<{ icon: string; title: string; body: string }> | undefined;
  const gridSize = (props as any).gridSize as string || '2x2';

  const startY = layout.contentStartY;
  const cols = gridSize === '2x2' ? 2 : 3;
  const rows = Math.ceil(Math.min(cards?.length || 0, 6) / cols);

  const cardWidth = (layout.slideW - layout.paddingX * 2 - (cols - 1) * 0.2) / cols;
  const cardHeight = 3.2 / rows;

  cards?.slice(0, cols * rows).forEach((card, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = layout.paddingX + col * (cardWidth + 0.2);
    const y = startY + row * (cardHeight + 0.2);

    // Card background
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y,
      w: cardWidth,
      h: cardHeight,
      fill: { color: colors.gray100 },
      shadow: makeShadow(),
    });

    // Icon placeholder
    slide.addShape(pptx.shapes.OVAL, {
      x: x + 0.15,
      y: y + 0.15,
      w: 0.35,
      h: 0.35,
      fill: { color: colors.navy100 },
      line: { color: colors.navy700, width: 1 },
    });

    // Title
    slide.addText(card.title, {
      x: x + 0.15,
      y: y + 0.6,
      w: cardWidth - 0.3,
      h: 0.35,
      ...fonts.cardTitle,
      margin: 0,
    });

    // Body
    slide.addText(card.body, {
      x: x + 0.15,
      y: y + 1,
      w: cardWidth - 0.3,
      h: cardHeight - 1.2,
      ...fonts.body,
      valign: 'top',
      margin: 0,
    });
  });
}

// --- Market Sizing ---
function renderMarketSizing(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const levels = (props as any).levels as Array<{ name: string; value: string; description: string }> | undefined;

  const startY = layout.contentStartY + 0.5;
  const centerX = layout.slideW / 2;

  // Draw nested circles (funnel visualization)
  const sizes = [
    { w: 4, h: 2.5, color: colors.navy100 },
    { w: 3, h: 1.9, color: colors.navy800 },
    { w: 2, h: 1.3, color: colors.coral600 },
  ];

  sizes.forEach((size, index) => {
    const level = levels?.[index];
    if (!level) return;

    const x = centerX - size.w / 2;
    const y = startY + index * 0.3;

    // Oval
    slide.addShape(pptx.shapes.OVAL, {
      x,
      y,
      w: size.w,
      h: size.h,
      fill: { color: size.color },
    });

    // Level name and value
    slide.addText(level.name, {
      x,
      y: y + size.h / 2 - 0.35,
      w: size.w,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: index === 0 ? colors.navy900 : 'FFFFFF',
      align: 'center',
      margin: 0,
    });

    slide.addText(level.value, {
      x,
      y: y + size.h / 2,
      w: size.w,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: index === 0 ? colors.navy900 : 'FFFFFF',
      align: 'center',
      margin: 0,
    });
  });

  // Methodology note
  if ((props as any).methodology) {
    slide.addText((props as any).methodology as string, {
      x: layout.paddingX,
      y: startY + 3,
      w: layout.slideW - layout.paddingX * 2,
      h: 0.4,
      ...fonts.body,
      align: 'center',
      margin: 0,
    });
  }
}

// --- Competitive Landscape ---
function renderCompetitiveLandscape(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const axes = (props as any).axes as { x: string; y: string } | undefined;
  const competitors = (props as any).competitors as Array<{
    name: string;
    xPos: number;
    yPos: number;
    size: number;
  }> | undefined;

  const startY = layout.contentStartY + 0.3;
  const chartSize = 4;
  const chartX = (layout.slideW - chartSize) / 2;
  const chartY = startY;

  // Background grid
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: chartX,
    y: chartY,
    w: chartSize,
    h: chartSize,
    fill: { color: colors.gray100 },
  });

  // Grid lines
  slide.addShape(pptx.shapes.LINE, {
    x: chartX + chartSize / 2,
    y: chartY,
    w: 0,
    h: chartSize,
    line: { color: colors.gray500, width: 1, dashType: 'dash' },
  });

  slide.addShape(pptx.shapes.LINE, {
    x: chartX,
    y: chartY + chartSize / 2,
    w: chartSize,
    h: 0,
    line: { color: colors.gray500, width: 1, dashType: 'dash' },
  });

  // Axis labels
  if (axes) {
    slide.addText(axes.y, {
      x: chartX - 0.8,
      y: chartY + chartSize / 2 - 0.15,
      w: 0.7,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: colors.navy800,
      align: 'center',
      margin: 0,
    });

    slide.addText(axes.x, {
      x: chartX + chartSize / 2 - 0.5,
      y: chartY + chartSize + 0.15,
      w: 1,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: colors.navy800,
      align: 'center',
      margin: 0,
    });
  }

  // Competitor bubbles
  competitors?.forEach((comp) => {
    const x = chartX + comp.xPos * chartSize;
    const y = chartY + (1 - comp.yPos) * chartSize;
    const size = Math.max(0.15, comp.size * 0.5);

    slide.addShape(pptx.shapes.OVAL, {
      x: x - size / 2,
      y: y - size / 2,
      w: size,
      h: size,
      fill: { color: colors.navy800 },
    });

    slide.addText(comp.name, {
      x: x - 0.5,
      y: y + size / 2 + 0.05,
      w: 1,
      h: 0.25,
      fontSize: 9,
      color: colors.gray700,
      align: 'center',
      margin: 0,
    });
  });
}

// --- Agenda Divider ---
function renderAgendaDivider(slide: Slide, pptx: Pptx, props: TemplateProps): void {
  const { layout, fonts, colors } = DESIGN_TOKENS;
  const sections = (props as any).sections as Array<{ number: number; title: string; active: boolean }> | undefined;
  const currentSection = (props as any).currentSection as number || 1;

  const startY = layout.contentStartY + 0.5;
  const sectionHeight = 0.6;
  const sectionWidth = layout.slideW - layout.paddingX * 2;

  // Title
  slide.addText('Agenda', {
    x: layout.paddingX,
    y: startY - 0.3,
    w: sectionWidth,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: colors.navy900,
    margin: 0,
  });

  sections?.slice(0, 6).forEach((section, index) => {
    const y = startY + index * (sectionHeight + 0.1);
    const isActive = section.number === currentSection;

    // Section number
    slide.addShape(pptx.shapes.OVAL, {
      x: layout.paddingX,
      y: y + 0.1,
      w: 0.4,
      h: 0.4,
      fill: { color: isActive ? colors.coral600 : colors.gray200 },
    });

    slide.addText(String(section.number), {
      x: layout.paddingX,
      y: y + 0.15,
      w: 0.4,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: isActive ? 'FFFFFF' : colors.gray700,
      align: 'center',
      margin: 0,
    });

    // Section title
    slide.addText(section.title, {
      x: layout.paddingX + 0.55,
      y: y + 0.15,
      w: sectionWidth - 0.6,
      h: 0.3,
      fontSize: 14,
      bold: isActive,
      color: isActive ? colors.navy900 : colors.gray700,
      margin: 0,
    });
  });
}
