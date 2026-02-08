/**
 * Stage 5: Quality Assurance Engine
 * Validates generated slides against consulting quality standards
 */

import { ArchetypeId, ArchetypeDefinition } from './archetypes';
import { StructuredContent } from './contentAnalyzer';
import { TemplateProps } from './archetypeClassifier';

// === TYPES ===

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

// === WEAK WORDS LIST ===
const WEAK_WORDS = [
  'overview', 'update', 'summary', 'discussion', 'review',
  'look at', 'examine', 'consider', 'explore', 'investigate',
  'analysis of', 'assessment of', 'evaluation of',
  'briefing', 'status', 'report'
];

const STRONG_WORDS = [
  'accelerate', 'capture', 'mitigate', 'prioritize', 'drive',
  'leverage', 'unlock', 'transform', 'optimize', 'maximize',
  'minimize', 'eliminate', 'achieve', 'deliver', 'increase',
  'decrease', 'reduce', 'expand', 'grow', 'improve'
];

// === MAIN VALIDATION FUNCTION ===

export function validateSlide(
  structured: StructuredContent,
  archetypeId: ArchetypeId,
  props: TemplateProps
): QAReport {
  const checks: QACheck[] = [];

  // Run all validation checks
  checks.push(...validateTitleQuality(props.title));
  checks.push(...validateContentStructure(structured, archetypeId));
  checks.push(...validateArchetypeFit(structured, archetypeId));
  checks.push(...validateDataIntegrity(structured));

  // Calculate overall score
  const errorCount = checks.filter((c) => c.severity === 'error' && !c.passed).length;
  const warningCount = checks.filter((c) => c.severity === 'warning' && !c.passed).length;

  const totalWeight = checks.length * 2;
  const errorWeight = errorCount * 2;
  const warningWeight = warningCount * 0.5;

  const score = Math.max(0, Math.round(100 - (errorWeight / totalWeight) * 100 - (warningWeight / totalWeight) * 50));

  // Generate recommendations
  const recommendations = generateRecommendations(checks, structured);

  return {
    passed: errorCount === 0 && score >= 70,
    checks,
    score,
    recommendations,
  };
}

// === TITLE VALIDATION ===

function validateTitleQuality(title: string): QACheck[] {
  const checks: QACheck[] = [];

  // Check 1: Title length
  const charCount = title.length;
  checks.push({
    name: 'title_length',
    passed: charCount <= 120,
    message: charCount <= 120
      ? `Title is ${charCount} characters (target: ≤120)`
      : `Title is ${charCount} characters — consider shortening to ≤120`,
    severity: charCount > 140 ? 'error' : charCount > 120 ? 'warning' : 'info',
  });

  // Check 2: Contains insight (not just topic)
  const hasWeakWords = WEAK_WORDS.some((word) => title.toLowerCase().includes(word));
  checks.push({
    name: 'title_has_insight',
    passed: !hasWeakWords,
    message: hasWeakWords
      ? 'Title appears descriptive rather than insightful — use action verbs'
      : 'Title appears action-oriented',
    severity: hasWeakWords ? 'warning' : 'info',
  });

  // Check 3: Contains action verb
  const hasStrongWords = STRONG_WORDS.some((word) => title.toLowerCase().includes(word));
  checks.push({
    name: 'title_action_verb',
    passed: hasStrongWords,
    message: hasStrongWords
      ? 'Title contains strong action verb'
      : 'Consider adding strong action verb: accelerate, capture, mitigate, prioritize, drive',
    severity: 'info',
  });

  // Check 4: Contains numbers/data
  const hasNumbers = /\d/.test(title);
  checks.push({
    name: 'title_has_numbers',
    passed: hasNumbers,
    message: hasNumbers
      ? 'Title includes specific numbers'
      : 'Consider adding key numbers to title for credibility',
    severity: 'info',
  });

  // Check 5: Title structure (WHAT + SO WHAT pattern)
  const hasSoWhat = /,\s*(driving|requiring|enabling|resulting|leading|positioning)/i.test(title) ||
                    /\s+(to|for|by|through|with)\s+/.test(title);
  checks.push({
    name: 'title_structure',
    passed: hasSoWhat,
    message: hasSoWhat
      ? 'Title follows WHAT + SO WHAT structure'
      : 'Consider adding "so what" — what does this mean for the audience?',
    severity: 'info',
  });

  return checks;
}

// === CONTENT STRUCTURE VALIDATION ===

function validateContentStructure(
  structured: StructuredContent,
  archetypeId: ArchetypeId
): QACheck[] {
  const checks: QACheck[] = [];
  const groups = structured.logicalGroups;

  // Check 1: Group count
  checks.push({
    name: 'group_count',
    passed: groups.length >= 2 && groups.length <= 4,
    message:
      groups.length < 2
        ? `Only ${groups.length} group(s) — consider adding more structure`
        : groups.length > 4
          ? `${groups.length} groups — consider consolidating to 3-4 MECE categories`
          : `${groups.length} groups is ideal`,
    severity: groups.length > 5 ? 'error' : groups.length > 4 || groups.length < 2 ? 'warning' : 'info',
  });

  // Check 2: Bullets per group
  const maxBullets = Math.max(...groups.map((g) => g.bullets.length), 0);
  checks.push({
    name: 'bullets_per_group',
    passed: maxBullets <= 5,
    message:
      maxBullets > 5
        ? `One group has ${maxBullets} bullets — max recommended is 5`
        : `Maximum ${maxBullets} bullet(s) per group (target: ≤5)`,
    severity: maxBullets > 7 ? 'error' : maxBullets > 5 ? 'warning' : 'info',
  });

  // Check 3: Bullet length
  const longBullets = groups.flatMap((g) =>
    g.bullets.filter((b) => b.length > 90)
  );
  checks.push({
    name: 'bullet_length',
    passed: longBullets.length === 0,
    message:
      longBullets.length > 0
        ? `${longBullets.length} bullet(s) exceed 90 characters — consider shortening`
        : 'All bullets are concise (≤90 chars)',
    severity: longBullets.length > 2 ? 'warning' : 'info',
  });

  // Check 4: Empty groups
  const emptyGroups = groups.filter((g) => g.bullets.length === 0);
  checks.push({
    name: 'empty_groups',
    passed: emptyGroups.length === 0,
    message:
      emptyGroups.length > 0
        ? `${emptyGroups.length} group(s) have no bullets`
        : 'All groups have content',
    severity: 'error',
  });

  // Check 5: Single-item groups (potential orphans)
  const singleItemGroups = groups.filter((g) => g.bullets.length === 1);
  checks.push({
    name: 'orphan_bullets',
    passed: singleItemGroups.length === 0,
    message:
      singleItemGroups.length > 0
        ? `${singleItemGroups.length} group(s) have only one bullet — consider merging`
        : 'Good distribution across groups',
    severity: 'info',
  });

  // Check 6: MECE check (basic overlap detection)
  const groupHeadings = groups.map((g) => g.heading.toLowerCase());
  const overlaps: string[] = [];
  for (let i = 0; i < groupHeadings.length; i++) {
    for (let j = i + 1; j < groupHeadings.length; j++) {
      if (
        groupHeadings[i].includes(groupHeadings[j]) ||
        groupHeadings[j].includes(groupHeadings[i])
      ) {
        overlaps.push(`${groups[i].heading} / ${groups[j].heading}`);
      }
    }
  }
  checks.push({
    name: 'mece_check',
    passed: overlaps.length === 0,
    message:
      overlaps.length > 0
        ? `Potential overlap detected: ${overlaps[0]} — ensure MECE structure`
        : 'Groups appear mutually exclusive',
    severity: overlaps.length > 0 ? 'warning' : 'info',
  });

  return checks;
}

// === ARCHETYPE FIT VALIDATION ===

function validateArchetypeFit(
  structured: StructuredContent,
  archetypeId: ArchetypeId
): QACheck[] {
  const checks: QACheck[] = [];

  // Check 1: Archetype matches complexity
  const complexityMap: Record<string, string[]> = {
    low: ['executive_summary', 'kpi_dashboard', 'agenda_divider', 'three_pillar'],
    medium: [
      'comparison_table', 'process_flow', 'before_after', 'two_by_two_matrix',
      'trend_line', 'stacked_bar', 'issue_tree', 'grid_cards', 'market_sizing'
    ],
    high: ['waterfall_chart', 'timeline_swimlane', 'decision_tree', 'competitive_landscape'],
  };

  const complexityLevel =
    structured.complexityScore <= 2 ? 'low' : structured.complexityScore >= 4 ? 'high' : 'medium';

  const appropriateArchetypes = complexityMap[complexityLevel];
  const isAppropriate = appropriateArchetypes.includes(archetypeId);

  checks.push({
    name: 'archetype_complexity_match',
    passed: isAppropriate,
    message: isAppropriate
      ? `Archetype ${archetypeId} matches complexity level (${complexityLevel})`
      : `Complexity is ${complexityLevel} but archetype ${archetypeId} may not be optimal`,
    severity: 'info',
  });

  // Check 2: Data points match archetype
  const dataPointMin: Record<string, number> = {
    kpi_dashboard: 3,
    waterfall_chart: 3,
    trend_line: 3,
    stacked_bar: 3,
    comparison_table: 2,
    two_by_two_matrix: 2,
  };

  const minData = dataPointMin[archetypeId];
  if (minData !== undefined) {
    const hasEnoughData = structured.dataPoints.length >= minData;
    checks.push({
      name: 'data_sufficiency',
      passed: hasEnoughData,
      message: hasEnoughData
        ? `${structured.dataPoints.length} data point(s) (min: ${minData})`
        : `Only ${structured.dataPoints.length} data point(s) — ${archetypeId} works best with ${minData}+`,
      severity: hasEnoughData ? 'info' : 'warning',
    });
  }

  // Check 3: Archetype element limits
  const elementLimits: Record<string, number> = {
    executive_summary: 4,
    three_pillar: 3,
    kpi_dashboard: 5,
    process_flow: 6,
    grid_cards: 6,
  };

  const limit = elementLimits[archetypeId];
  if (limit !== undefined) {
    const groupCount = structured.logicalGroups.length;
    const withinLimit = groupCount <= limit;
    checks.push({
      name: 'element_limit',
      passed: withinLimit,
      message: withinLimit
        ? `${groupCount} element(s) within ${archetypeId} limit (${limit})`
        : `${groupCount} element(s) exceeds ${archetypeId} limit (${limit})`,
      severity: withinLimit ? 'info' : 'warning',
    });
  }

  return checks;
}

// === DATA INTEGRITY VALIDATION ===

function validateDataIntegrity(structured: StructuredContent): QACheck[] {
  const checks: QACheck[] = [];

  // Check 1: Source attribution
  checks.push({
    name: 'source_attribution',
    passed: !!(structured.source || structured.footnote),
    message: structured.source || structured.footnote
      ? 'Source/footnote provided'
      : 'Consider adding data source for credibility',
    severity: 'info',
  });

  // Check 2: Number formatting consistency
  const values = structured.dataPoints.map((dp) => String(dp.value));
  const hasCurrency = values.some((v) => v.includes('$') || v.includes('USD'));
  const hasPercentages = values.some((v) => v.includes('%'));
  const hasRawNumbers = values.some((v) => /^\d+$/.test(v));

  checks.push({
    name: 'formatting_consistency',
    passed: !(hasCurrency && hasPercentages && hasRawNumbers),
    message: 'Multiple number formats detected — ensure consistent formatting',
    severity: 'info',
  });

  // Check 3: Data context
  const hasContextRatio =
    structured.dataPoints.filter((dp) => dp.context).length /
    structured.dataPoints.length;

  checks.push({
    name: 'data_context',
    passed: hasContextRatio >= 0.5 || structured.dataPoints.length === 0,
    message:
      hasContextRatio >= 0.5
        ? `${Math.round(hasContextRatio * 100)}% of metrics have context (YoY, vs target, etc.)`
        : `Only ${Math.round(hasContextRatio * 100)}% of metrics have context — add comparison baselines`,
    severity: hasContextRatio < 0.3 && structured.dataPoints.length > 2 ? 'warning' : 'info',
  });

  // Check 4: Core message clarity
  const coreMessageLength = structured.coreMessage.length;
  checks.push({
    name: 'core_message_clarity',
    passed: coreMessageLength <= 200,
    message:
      coreMessageLength <= 200
        ? 'Core message is concise'
        : 'Core message is lengthy — consider simplifying',
    severity: coreMessageLength > 300 ? 'warning' : 'info',
  });

  return checks;
}

// === RECOMMENDATION GENERATION ===

function generateRecommendations(checks: QACheck[], structured: StructuredContent): string[] {
  const recommendations: string[] = [];
  const failedChecks = checks.filter((c) => !c.passed);

  // Title recommendations
  const titleChecks = failedChecks.filter((c) => c.name.startsWith('title_'));
  if (titleChecks.length > 0) {
    recommendations.push(
      'Title: Use format "[WHAT] + [SO WHAT] + [NOW WHAT]" with strong verbs (accelerate, capture, mitigate)'
    );
  }

  // Structure recommendations
  if (failedChecks.some((c) => c.name === 'group_count')) {
    recommendations.push('Structure: Organize content into 3-4 MECE categories');
  }

  if (failedChecks.some((c) => c.name === 'bullets_per_group')) {
    recommendations.push('Content: Limit to 3-5 bullets per group for readability');
  }

  if (failedChecks.some((c) => c.name === 'bullet_length')) {
    recommendations.push('Content: Keep bullets to 1-2 lines (≤90 characters)');
  }

  // Data recommendations
  if (failedChecks.some((c) => c.name === 'data_context')) {
    recommendations.push('Data: Add context to metrics (e.g., "+20% YoY", "vs 85% target")');
  }

  if (!structured.source && !structured.footnote) {
    recommendations.push('Credibility: Add data source attribution');
  }

  return recommendations;
}

// === FORMATTING HELPERS ===

/**
 * Generate a human-readable QA summary
 */
export function formatQAReport(report: QAReport): string {
  const lines: string[] = [];

  lines.push(`Quality Score: ${report.score}/100`);
  lines.push(`Status: ${report.passed ? '✅ Passed' : '❌ Needs Improvement'}`);
  lines.push('');

  if (report.recommendations.length > 0) {
    lines.push('Recommendations:');
    report.recommendations.forEach((rec) => lines.push(`  • ${rec}`));
    lines.push('');
  }

  const failedChecks = report.checks.filter((c) => !c.passed);
  if (failedChecks.length > 0) {
    lines.push('Issues:');
    failedChecks.forEach((check) => {
      const icon = check.severity === 'error' ? '❌' : check.severity === 'warning' ? '⚠️' : 'ℹ️';
      lines.push(`  ${icon} ${check.name}: ${check.message}`);
    });
  }

  return lines.join('\n');
}

/**
 * Quick validation for overflow prevention
 */
export function validateContentFit(
  title: string,
  groups: Array<{ heading: string; bullets: string[] }>,
  archetypeId: ArchetypeId
): { fits: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Title overflow check
  if (title.length > 140) {
    warnings.push('Title may overflow — shorten to ≤120 characters');
  }

  // Content overflow by archetype
  const limits: Record<string, { maxGroups: number; maxBullets: number; maxTotalBullets: number }> = {
    executive_summary: { maxGroups: 4, maxBullets: 4, maxTotalBullets: 12 },
    three_pillar: { maxGroups: 3, maxBullets: 5, maxTotalBullets: 12 },
    kpi_dashboard: { maxGroups: 5, maxBullets: 1, maxTotalBullets: 5 },
    comparison_table: { maxGroups: 8, maxBullets: 1, maxTotalBullets: 8 },
    process_flow: { maxGroups: 6, maxBullets: 2, maxTotalBullets: 12 },
  };

  const limit = limits[archetypeId];
  if (limit) {
    if (groups.length > limit.maxGroups) {
      warnings.push(`${archetypeId} supports max ${limit.maxGroups} groups — you have ${groups.length}`);
    }

    const totalBullets = groups.reduce((sum, g) => sum + g.bullets.length, 0);
    if (totalBullets > limit.maxTotalBullets) {
      warnings.push(`Total content (${totalBullets} bullets) may not fit — target ≤${limit.maxTotalBullets}`);
    }

    const maxBulletsInGroup = Math.max(...groups.map((g) => g.bullets.length), 0);
    if (maxBulletsInGroup > limit.maxBullets) {
      warnings.push(`One group has ${maxBulletsInGroup} bullets — ${archetypeId} works best with ≤${limit.maxBullets}`);
    }
  }

  return {
    fits: warnings.length === 0,
    warnings,
  };
}
