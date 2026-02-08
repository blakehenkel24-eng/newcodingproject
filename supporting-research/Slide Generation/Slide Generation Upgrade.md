
Desc: this document was pulled from SlideX, where I asked it to reverse engineer its process. 


# SlideTheory Slide Generation Engine — Upgrade Guide

## For: Kimi Code (K2.5) AI Coding Agent

## Purpose: System Prompt + Technical Specification for Upgrading Slide Generation Quality

---

# PART 1: SYSTEM PROMPT / INSTRUCTION SET FOR KIMI CODE

> Copy this entire Part 1 into your Kimi Code session as the instruction set. It tells the coding agent exactly what to build, why, and how.

---

## MISSION

You are upgrading SlideTheory's slide generation engine to produce management-consulting-quality PowerPoint presentations. The system must transform unstructured business content into executive-ready slides that match the communication standards of McKinsey, BCG, and Bain & Company.

The architecture follows a **5-stage pipeline**:

```
USER INPUT → CONTENT ANALYSIS → ARCHETYPE CLASSIFICATION → HTML MOCKUP → PPTX OUTPUT
```

Your job is to implement or upgrade each stage according to the specifications below.

---

## STAGE 1: CONTENT ANALYSIS & STRUCTURING

### What This Stage Does

Takes raw user input (text, data, bullet points, uploaded content) and extracts:

- **Core message**: The single most important insight or finding
- **Content type**: What kind of information is this? (comparison, trend, process, hierarchy, recommendation, financial, etc.)
- **Data points**: Specific numbers, metrics, or evidence that support the core message
- **Logical groupings**: How the information naturally breaks into MECE (Mutually Exclusive, Collectively Exhaustive) categories

### Implementation Requirements

```
# Content Analysis Module
# Input: raw_text (string), context (dict with optional keys: audience, objective, constraints)
# Output: structured_content (dict)

structured_content = {
    "core_message": str,           # Single sentence: the key insight
    "content_type": str,           # One of the archetype keys (see Stage 2)
    "data_points": list[dict],     # [{"label": str, "value": str/number, "unit": str}]
    "logical_groups": list[dict],  # [{"heading": str, "bullets": list[str]}]
    "supporting_evidence": list[str],
    "recommended_archetype": str,  # Archetype ID from Stage 2
    "complexity_score": int        # 1-5, drives layout density decisions
}
```

### MECE Structuring Rules

1. Every piece of information must belong to exactly one group
2. Groups must cover all the information provided (no gaps)
3. Target 3-4 groups per slide (never more than 5)
4. Each bullet within a group should be 1-2 lines max
5. Lead each group with the most impactful point
6. Apply the Pyramid Principle (Minto): conclusion first, then supporting evidence

### Title Engineering Formula

Every slide title MUST follow this pattern:

```
[WHAT happened/is true] + [SO WHAT it means] + [NOW WHAT to do about it]
```

**Examples:**

- ![❌](https://fonts.gstatic.com/s/e/notoemoji/16.0/274c/72.png) Bad: "Q3 Revenue Overview"
- ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) Good: "Revenue declined 12% in Q3 driven by mid-market churn, requiring immediate retention intervention"
- ![❌](https://fonts.gstatic.com/s/e/notoemoji/16.0/274c/72.png) Bad: "Market Analysis"
- ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) Good: "Three emerging segments represent $2.4B untapped opportunity, with Segment A offering fastest path to capture"

**Title Rules:**

- Maximum 2 lines (approximately 120 characters)
- Must contain an insight, not just a topic label
- Must be actionable — the reader should know what to think or do after reading it
- Use strong verbs: "accelerate," "capture," "mitigate," "prioritize"
- Avoid weak verbs: "overview," "update," "summary," "discussion"

---

## STAGE 2: ARCHETYPE CLASSIFICATION

### What This Stage Does

Maps the analyzed content to one of ~18 standard consulting slide archetypes. Each archetype has a predefined layout structure, visual hierarchy, and content placement pattern.

### Archetype Library

Implement the following archetype classifier. The system should select the best archetype based on content_type and data characteristics.

```
SLIDE_ARCHETYPES = {

    # === INSIGHT & SUMMARY SLIDES ===
    "executive_summary": {
        "description": "Single key finding with supporting evidence",
        "layout": "headline_plus_evidence",
        "structure": {
            "title": "Action-oriented insight headline (2 lines max)",
            "body": "3-4 supporting bullet groups with evidence",
            "visual": "Optional callout stat or icon row"
        },
        "triggers": ["summary", "key finding", "recommendation", "conclusion"],
        "best_for": "Opening or closing slides, board-level communication"
    },

    "situation_complication_resolution": {
        "description": "SCR framework — sets up context, problem, and proposed action",
        "layout": "three_section_horizontal",
        "structure": {
            "section_1": "Situation — current state and context",
            "section_2": "Complication — what changed or what's at risk",
            "section_3": "Resolution — recommended action"
        },
        "triggers": ["problem", "challenge", "opportunity", "proposal"],
        "best_for": "Framing a recommendation or business case"
    },

    # === COMPARISON & ANALYSIS SLIDES ===
    "two_by_two_matrix": {
        "description": "2x2 matrix with two axes classifying items into 4 quadrants",
        "layout": "matrix_grid",
        "structure": {
            "x_axis": "Dimension 1 (low to high)",
            "y_axis": "Dimension 2 (low to high)",
            "quadrants": ["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"],
            "items": "Positioned by their axis values"
        },
        "triggers": ["prioritize", "classify", "compare along two dimensions", "portfolio"],
        "best_for": "Strategic prioritization, portfolio analysis"
    },

    "comparison_table": {
        "description": "Side-by-side comparison of 2-5 options across criteria",
        "layout": "table_with_header_row",
        "structure": {
            "columns": "Options being compared",
            "rows": "Evaluation criteria",
            "cells": "Ratings, scores, or qualitative assessments",
            "highlight": "Recommended option column"
        },
        "triggers": ["compare", "evaluate", "options", "alternatives", "versus", "vs"],
        "best_for": "Vendor selection, option evaluation, feature comparison"
    },

    "before_after": {
        "description": "Two-column showing current vs. future state",
        "layout": "two_column_split",
        "structure": {
            "left": "Current State / Before (with pain points)",
            "right": "Future State / After (with benefits)",
            "connector": "Arrow or transformation indicator between columns"
        },
        "triggers": ["transformation", "change", "improve", "before and after", "current vs future"],
        "best_for": "Change management, digital transformation, process improvement"
    },

    # === DATA & METRICS SLIDES ===
    "kpi_dashboard": {
        "description": "3-5 large metric callouts with context",
        "layout": "stat_cards_horizontal",
        "structure": {
            "metrics": [
                {"value": "Large number (60-72pt)", "label": "Metric name (14pt)", "trend": "Up/Down/Flat"}
            ],
            "context_row": "One-line commentary below metrics"
        },
        "triggers": ["KPI", "metrics", "dashboard", "performance", "numbers", "statistics"],
        "best_for": "Performance reviews, monthly reporting, investor updates"
    },

    "waterfall_chart": {
        "description": "Shows how an initial value is affected by sequential positive/negative changes",
        "layout": "chart_with_annotation",
        "structure": {
            "start_value": "Beginning amount",
            "changes": [{"label": str, "delta": "number (positive or negative)"}],
            "end_value": "Final amount",
            "annotations": "Key driver callouts"
        },
        "triggers": ["bridge", "waterfall", "walk", "build-up", "breakdown", "revenue bridge"],
        "best_for": "Financial analysis, budget variance, revenue decomposition"
    },

    "trend_line": {
        "description": "Time-series data showing change over time",
        "layout": "chart_full_width",
        "structure": {
            "x_axis": "Time periods",
            "y_axis": "Metric values",
            "series": "1-3 data series",
            "annotations": "Key inflection points called out"
        },
        "triggers": ["trend", "over time", "growth", "trajectory", "forecast", "historical"],
        "best_for": "Revenue trends, market sizing, growth trajectories"
    },

    "stacked_bar": {
        "description": "Composition breakdown across categories",
        "layout": "chart_with_legend",
        "structure": {
            "categories": "X-axis groups",
            "segments": "Component parts within each bar",
            "total": "Optional total label above each bar"
        },
        "triggers": ["breakdown", "composition", "share", "mix", "allocation"],
        "best_for": "Revenue mix, cost allocation, market share"
    },

    # === PROCESS & FLOW SLIDES ===
    "process_flow": {
        "description": "Sequential steps in a horizontal chevron or arrow flow",
        "layout": "chevron_horizontal",
        "structure": {
            "steps": [{"number": int, "title": str, "description": str}],
            "max_steps": 6,
            "connectors": "Arrows or chevron shapes between steps"
        },
        "triggers": ["process", "steps", "workflow", "procedure", "how to", "methodology"],
        "best_for": "Implementation plans, methodologies, operational processes"
    },

    "timeline_swimlane": {
        "description": "Time-phased activities across multiple workstreams",
        "layout": "swimlane_horizontal",
        "structure": {
            "time_axis": "Weeks, months, or quarters across top",
            "lanes": [{"name": str, "activities": [{"start": str, "end": str, "label": str}]}],
            "milestones": [{"date": str, "label": str}]
        },
        "triggers": ["timeline", "roadmap", "phases", "milestones", "gantt", "schedule"],
        "best_for": "Project plans, implementation roadmaps, strategic timelines"
    },

    "decision_tree": {
        "description": "Branching logic from a starting question to outcomes",
        "layout": "tree_diagram",
        "structure": {
            "root": "Starting question or decision",
            "branches": [{"condition": str, "outcome": str}],
            "depth": "2-3 levels max for readability"
        },
        "triggers": ["decision", "if-then", "scenarios", "paths", "options tree"],
        "best_for": "Decision frameworks, diagnostic flows, scenario planning"
    },

    # === STRUCTURE & HIERARCHY SLIDES ===
    "issue_tree": {
        "description": "Hierarchical decomposition of a problem into sub-issues",
        "layout": "tree_left_to_right",
        "structure": {
            "root_issue": "Main problem statement",
            "branches": [
                {"issue": str, "sub_issues": [str]}
            ]
        },
        "triggers": ["issue tree", "root cause", "decompose", "break down", "analyze causes"],
        "best_for": "Problem structuring, hypothesis generation, root cause analysis"
    },

    "three_pillar": {
        "description": "Three equal-weight columns representing parallel themes or pillars",
        "layout": "three_card_horizontal",
        "structure": {
            "pillars": [
                {"icon": str, "title": str, "description": str, "metrics": list[str]}
            ]
        },
        "triggers": ["three pillars", "three priorities", "three areas", "three themes", "triple"],
        "best_for": "Strategic priorities, capability areas, value propositions"
    },

    "grid_cards": {
        "description": "2x2 or 2x3 grid of content cards with icons",
        "layout": "card_grid",
        "structure": {
            "cards": [{"icon": str, "title": str, "body": str}],
            "grid_size": "2x2 or 2x3 based on content volume"
        },
        "triggers": ["multiple topics", "several areas", "categories", "features", "capabilities"],
        "best_for": "Capability overviews, product features, risk categories"
    },

    # === MARKET & FINANCIAL SLIDES ===
    "market_sizing": {
        "description": "TAM/SAM/SOM or top-down/bottom-up market size with funnel logic",
        "layout": "funnel_or_nested_circles",
        "structure": {
            "levels": [
                {"name": "TAM/SAM/SOM", "value": str, "description": str}
            ],
            "methodology": "Top-down or bottom-up calculation shown"
        },
        "triggers": ["market size", "TAM", "SAM", "SOM", "addressable market", "opportunity size"],
        "best_for": "Investment memos, market entry, growth strategy"
    },

    "competitive_landscape": {
        "description": "Positioning map or competitor comparison matrix",
        "layout": "scatter_or_matrix",
        "structure": {
            "axes": {"x": str, "y": str},
            "competitors": [{"name": str, "x_pos": float, "y_pos": float, "size": float}],
            "our_position": "Highlighted differently"
        },
        "triggers": ["competitive", "landscape", "positioning", "competitors", "market map"],
        "best_for": "Competitive analysis, market positioning, strategic planning"
    },

    "agenda_divider": {
        "description": "Section divider or agenda overview slide",
        "layout": "centered_or_sidebar",
        "structure": {
            "sections": [{"number": int, "title": str, "active": bool}],
            "current_section": "Highlighted with accent color"
        },
        "triggers": ["agenda", "table of contents", "section break", "overview"],
        "best_for": "Deck navigation, section transitions"
    }
}
```

### Classification Logic

```
def classify_content(structured_content: dict) -> str:
    """
    Priority order for classification:
    1. Explicit user request (if user says "make a waterfall chart")
    2. Data shape match (time-series data → trend_line, categorical comparison → comparison_table)
    3. Content type inference (process description → process_flow)
    4. Default fallback → executive_summary
    """
    # Step 1: Check for explicit archetype mentions in user input
    # Step 2: Analyze data_points structure
    # Step 3: Match content_type against archetype triggers
    # Step 4: Fallback
    pass
```

---

## STAGE 3: HTML MOCKUP GENERATION

### What This Stage Does

Generates a pixel-perfect HTML/CSS mockup at 16:9 aspect ratio (1280×720px) that serves as both the visual preview and the blueprint for PPTX conversion.

### Critical Design System

```
/* === MASTER DESIGN TOKENS === */
:root {
    /* Primary Palette */
    --navy-900: #1a365d;        /* Primary dark / slide backgrounds */
    --navy-800: #2c5282;        /* Secondary dark / headers */
    --navy-700: #2b6cb0;        /* Tertiary / hover states */
    --navy-100: #ebf8ff;        /* Light background tint */

    /* Accent Palette */
    --coral-600: #e53e3e;       /* Primary accent / highlights */
    --coral-500: #f56565;       /* Secondary accent */
    --coral-100: #fff5f5;       /* Light accent background */

    /* Neutral Palette */
    --gray-900: #1a202c;        /* Body text */
    --gray-700: #4a5568;        /* Secondary text */
    --gray-500: #a0aec0;        /* Muted text / borders */
    --gray-200: #edf2f7;        /* Light borders / dividers */
    --gray-100: #f7fafc;        /* Card backgrounds */
    --white: #ffffff;           /* Slide background default */

    /* Typography Scale */
    --font-title: 28px;         /* Slide title */
    --font-subtitle: 18px;      /* Subtitle / section headers */
    --font-body: 14px;          /* Body text */
    --font-caption: 11px;       /* Sources, footnotes */
    --font-stat: 48px;          /* Large metric callouts */
    --font-stat-label: 12px;    /* Metric labels */

    /* Font Family */
    --font-primary: 'Calibri', 'Helvetica Neue', Arial, sans-serif;

    /* Spacing */
    --slide-padding: 40px;      /* Outer slide margins */
    --element-gap: 20px;        /* Between content blocks */
    --card-padding: 20px;       /* Inside cards */
    --title-margin-bottom: 24px;

    /* Slide Dimensions */
    --slide-width: 1280px;
    --slide-height: 720px;
}
```

### HTML Template Structure

Every slide HTML file must follow this exact structure:

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 1280px;
            height: 720px;
            overflow: hidden;
            font-family: var(--font-primary);
            background: var(--white);
        }
        .slide {
            width: 1280px;
            height: 720px;
            padding: var(--slide-padding);
            position: relative;
            display: flex;
            flex-direction: column;
        }
        .slide-title {
            font-size: var(--font-title);
            font-weight: 700;
            color: var(--navy-900);
            line-height: 1.3;
            margin-bottom: var(--title-margin-bottom);
            max-width: 90%;
        }
        .slide-subtitle {
            font-size: var(--font-subtitle);
            color: var(--gray-700);
            margin-bottom: 16px;
        }
        .content-area {
            flex: 1;
            display: flex;
            /* Layout varies by archetype — see layout patterns below */
        }
        .source-line {
            position: absolute;
            bottom: 12px;
            left: 40px;
            font-size: var(--font-caption);
            color: var(--gray-500);
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-title"><!-- ACTION-ORIENTED TITLE --></div>
        <div class="content-area">
            <!-- ARCHETYPE-SPECIFIC LAYOUT -->
        </div>
        <div class="source-line">Source: Company analysis</div>
    </div>
</body>
</html>
```

### Layout Pattern CSS Templates

Each archetype maps to one of these layout patterns. Implement as reusable CSS classes:

#### Pattern A: Three-Card Horizontal (for three_pillar, grid_cards)

```
.layout-three-card {
    display: flex;
    gap: 20px;
    flex: 1;
}
.card {
    flex: 1;
    background: var(--gray-100);
    border-radius: 8px;
    padding: var(--card-padding);
    border-top: 4px solid var(--coral-600);
}
.card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
}
.card-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--navy-900);
    margin-bottom: 8px;
}
.card-body {
    font-size: var(--font-body);
    color: var(--gray-700);
    line-height: 1.5;
}
```

#### Pattern B: Two-Column Split (for before_after, comparison, SCR)

```
.layout-two-col {
    display: flex;
    gap: 24px;
    flex: 1;
}
.col-left, .col-right {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.col-divider {
    width: 2px;
    background: var(--gray-200);
    margin: 0 12px;
}
```

#### Pattern C: Stat Cards Row (for kpi_dashboard)

```
.layout-stats {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex: 1;
}
.stat-card {
    text-align: center;
    padding: 24px;
    flex: 1;
}
.stat-value {
    font-size: var(--font-stat);
    font-weight: 800;
    color: var(--navy-900);
    line-height: 1;
}
.stat-label {
    font-size: var(--font-stat-label);
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 8px;
}
.stat-trend {
    font-size: 14px;
    margin-top: 4px;
}
.stat-trend.up { color: #38a169; }
.stat-trend.down { color: var(--coral-600); }
```

#### Pattern D: Chevron Process Flow (for process_flow)

```
.layout-process {
    display: flex;
    align-items: center;
    gap: 0;
    flex: 1;
    padding: 20px 0;
}
.chevron {
    flex: 1;
    background: var(--navy-800);
    color: white;
    padding: 20px 24px 20px 36px;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%);
    text-align: center;
}
.chevron:first-child {
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%);
}
.chevron-number {
    font-size: 24px;
    font-weight: 800;
    opacity: 0.5;
}
.chevron-title {
    font-size: 14px;
    font-weight: 700;
    margin-top: 4px;
}
.chevron-desc {
    font-size: 11px;
    opacity: 0.85;
    margin-top: 4px;
}
```

#### Pattern E: Table Layout (for comparison_table)

```
.layout-table {
    flex: 1;
    overflow: hidden;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-body);
}
.data-table th {
    background: var(--navy-900);
    color: white;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
}
.data-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--gray-200);
    color: var(--gray-900);
}
.data-table tr:nth-child(even) td {
    background: var(--gray-100);
}
.highlight-col {
    background: var(--coral-100) !important;
    border-left: 3px solid var(--coral-600);
}
```

#### Pattern F: Swimlane Timeline (for timeline_swimlane)

```
.layout-swimlane {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.swimlane-header {
    display: flex;
    padding: 0 0 8px 140px;
    gap: 0;
}
.swimlane-period {
    flex: 1;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--navy-800);
    border-bottom: 2px solid var(--navy-800);
    padding-bottom: 4px;
}
.swimlane-row {
    display: flex;
    align-items: center;
    min-height: 48px;
}
.swimlane-label {
    width: 140px;
    font-size: 13px;
    font-weight: 600;
    color: var(--navy-900);
    flex-shrink: 0;
    padding-right: 12px;
}
.swimlane-track {
    flex: 1;
    display: flex;
    position: relative;
    height: 32px;
}
.swimlane-bar {
    position: absolute;
    height: 28px;
    background: var(--navy-800);
    border-radius: 4px;
    color: white;
    font-size: 11px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    white-space: nowrap;
}
```

### Content Overflow Prevention Rules

**CRITICAL — these prevent the #1 quality issue in AI-generated slides:**

1. **Title**: Max 2 lines. If content exceeds, truncate the "NOW WHAT" portion
2. **Bullet text**: Max 2 lines per bullet. Rewrite to be more concise rather than wrapping
3. **Cards**: Max 4-5 lines of body text per card in a 3-card layout
4. **Tables**: Max 8 data rows. If more, show top entries + "... and X more" row
5. **Process steps**: Max 6 steps. If more, group into phases
6. **Stat cards**: Max 5 metrics. If more, select top 5 by relevance

```
// Content overflow validator — run after HTML generation
function validateContentFit(htmlString) {
    // Parse HTML and check each element against its max dimensions
    // Flag any element whose rendered text exceeds its container
    // Return list of overflow warnings with suggested fixes
}
```

---

## STAGE 4: HTML → PPTX CONVERSION

### What This Stage Does

Converts the HTML mockup into a native .pptx file using PptxGenJS (Node.js).

### Why PptxGenJS (Not python-pptx)

- Richer shape/chart support
- Better text formatting control
- More reliable shadow, gradient, and icon rendering
- Active maintenance and documentation

### Setup

```
npm install -g pptxgenjs react-icons react react-dom sharp
```

### Core Conversion Architecture

```
const pptxgen = require("pptxgenjs");

// === MASTER CONFIG ===
const CONFIG = {
    layout: 'LAYOUT_16x9',     // 10" × 5.625"
    slide: { w: 10, h: 5.625 },
    padding: { x: 0.4, y: 0.35 },  // Outer margins in inches

    colors: {
        navy900: "1A365D",
        navy800: "2C5282",
        navy700: "2B6CB0",
        navy100: "EBF8FF",
        coral600: "E53E3E",
        coral500: "F56565",
        coral100: "FFF5F5",
        gray900: "1A202C",
        gray700: "4A5568",
        gray500: "A0AEC0",
        gray200: "EDF2F7",
        gray100: "F7FAFC",
        white: "FFFFFF"
    },

    fonts: {
        title: { face: "Calibri", size: 22, bold: true, color: "1A365D" },
        subtitle: { face: "Calibri", size: 14, bold: false, color: "4A5568" },
        body: { face: "Calibri", size: 11, bold: false, color: "1A202C" },
        caption: { face: "Calibri", size: 8, bold: false, color: "A0AEC0" },
        stat: { face: "Calibri", size: 36, bold: true, color: "1A365D" },
        statLabel: { face: "Calibri", size: 9, bold: false, color: "A0AEC0" }
    }
};

// === PPTX GENERATION FUNCTION ===
function generatePresentation(slides_data) {
    let pres = new pptxgen();
    pres.layout = CONFIG.layout;
    pres.author = "SlideTheory";

    for (const slideData of slides_data) {
        let slide = pres.addSlide();

        // Background
        slide.background = { color: CONFIG.colors.white };

        // Title — always placed consistently
        slide.addText(slideData.title, {
            x: CONFIG.padding.x,
            y: CONFIG.padding.y,
            w: CONFIG.slide.w - (CONFIG.padding.x * 2),
            h: 0.7,
            ...CONFIG.fonts.title,
            valign: "top",
            margin: 0
        });

        // Render archetype-specific content
        renderArchetype(slide, pres, slideData);

        // Source line
        if (slideData.source) {
            slide.addText(slideData.source, {
                x: CONFIG.padding.x,
                y: CONFIG.slide.h - 0.35,
                w: 6,
                h: 0.25,
                ...CONFIG.fonts.caption,
                margin: 0
            });
        }
    }

    return pres;
}
```

### Archetype Render Functions

Implement a render function for each archetype. Here are the critical ones:

```
function renderArchetype(slide, pres, data) {
    const renderers = {
        "executive_summary": renderExecutiveSummary,
        "three_pillar": renderThreePillar,
        "kpi_dashboard": renderKPIDashboard,
        "comparison_table": renderComparisonTable,
        "process_flow": renderProcessFlow,
        "timeline_swimlane": renderTimelineSwimlane,
        "before_after": renderBeforeAfter,
        "waterfall_chart": renderWaterfallChart,
        // ... all 18 archetypes
    };

    const renderer = renderers[data.archetype] || renderExecutiveSummary;
    renderer(slide, pres, data);
}

// === EXAMPLE: Three-Pillar Renderer ===
function renderThreePillar(slide, pres, data) {
    const startY = 1.2;
    const cardW = 2.85;
    const cardH = 3.5;
    const gap = 0.2;
    const startX = CONFIG.padding.x;

    data.pillars.forEach((pillar, i) => {
        const x = startX + (i * (cardW + gap));

        // Card background
        slide.addShape(pres.shapes.RECTANGLE, {
            x: x, y: startY, w: cardW, h: cardH,
            fill: { color: CONFIG.colors.gray100 },
            shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
        });

        // Top accent bar
        slide.addShape(pres.shapes.RECTANGLE, {
            x: x, y: startY, w: cardW, h: 0.06,
            fill: { color: CONFIG.colors.coral600 }
        });

        // Card title
        slide.addText(pillar.title, {
            x: x + 0.2, y: startY + 0.3, w: cardW - 0.4, h: 0.4,
            fontSize: 14, bold: true, color: CONFIG.colors.navy900,
            fontFace: "Calibri", margin: 0
        });

        // Card body bullets
        const bullets = pillar.bullets.map((b, idx) => ({
            text: b,
            options: {
                bullet: true,
                breakLine: idx < pillar.bullets.length - 1,
                fontSize: 10,
                color: CONFIG.colors.gray700,
                fontFace: "Calibri"
            }
        }));

        slide.addText(bullets, {
            x: x + 0.2, y: startY + 0.8, w: cardW - 0.4, h: cardH - 1.2,
            valign: "top", margin: 0, paraSpaceAfter: 4
        });
    });
}

// === EXAMPLE: KPI Dashboard Renderer ===
function renderKPIDashboard(slide, pres, data) {
    const metrics = data.metrics.slice(0, 5); // Max 5
    const cardW = (CONFIG.slide.w - (CONFIG.padding.x * 2) - ((metrics.length - 1) * 0.2)) / metrics.length;
    const startY = 1.5;

    metrics.forEach((metric, i) => {
        const x = CONFIG.padding.x + (i * (cardW + 0.2));

        // Stat value
        slide.addText(metric.value, {
            x: x, y: startY, w: cardW, h: 1.2,
            fontSize: 36, bold: true, color: CONFIG.colors.navy900,
            fontFace: "Calibri", align: "center", valign: "bottom", margin: 0
        });

        // Stat label
        slide.addText(metric.label.toUpperCase(), {
            x: x, y: startY + 1.3, w: cardW, h: 0.4,
            fontSize: 9, bold: false, color: CONFIG.colors.gray500,
            fontFace: "Calibri", align: "center", valign: "top",
            charSpacing: 1, margin: 0
        });

        // Trend indicator
        if (metric.trend) {
            const trendColor = metric.trend === "up" ? "38A169" : CONFIG.colors.coral600;
            const trendSymbol = metric.trend === "up" ? "▲" : "▼";
            slide.addText(`${trendSymbol} ${metric.trend_value}`, {
                x: x, y: startY + 1.7, w: cardW, h: 0.3,
                fontSize: 10, color: trendColor,
                fontFace: "Calibri", align: "center", margin: 0
            });
        }

        // Divider line between metrics (not after last)
        if (i < metrics.length - 1) {
            slide.addShape(pres.shapes.LINE, {
                x: x + cardW + 0.08, y: startY + 0.2, w: 0, h: 1.8,
                line: { color: CONFIG.colors.gray200, width: 1 }
            });
        }
    });
}
```

### CRITICAL PPTXGENJS RULES (from official documentation)

1. **NEVER use `#` prefix on hex colors** — causes file corruption
2. **NEVER encode opacity in hex strings** (e.g., `"00000020"`) — use `opacity` property instead
3. **NEVER reuse option objects** across multiple `addShape`/`addText` calls — PptxGenJS mutates objects in-place. Use factory functions:
    
    ```
    const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.08 });
    ```
    
4. **Use `bullet: true`**, never unicode `•` symbols (creates double bullets)
5. **Use `breakLine: true`** between text array items
6. **Avoid `lineSpacing` with bullets** — use `paraSpaceAfter` instead
7. **Use `RECTANGLE` not `ROUNDED_RECTANGLE`** when adding accent border overlays
8. **Use `margin: 0`** on text boxes that need precise alignment with shapes
9. **Each presentation needs a fresh `pptxgen()` instance**
10. **Shadow `offset` must be non-negative** — for upward shadows use `angle: 270`

---

## STAGE 5: QUALITY ASSURANCE

### What This Stage Does

Validates the generated slide against consulting quality standards before delivery.

### Automated QA Checks

```
QA_CHECKLIST = {
    "title_quality": {
        "has_insight": True,        # Not just a topic label
        "max_characters": 120,       # Fits in 2 lines
        "has_action_verb": True,     # Contains actionable language
        "avoids_weak_words": True    # No "overview", "update", "summary"
    },
    "content_structure": {
        "max_bullets_per_group": 5,
        "max_groups": 4,
        "bullet_max_chars": 90,      # Single line target
        "mece_check": True,          # Groups don't overlap
        "no_orphan_bullets": True    # Every group has 2+ items
    },
    "visual_layout": {
        "no_overflow": True,         # All text fits within containers
        "consistent_spacing": True,  # Even gaps between elements
        "adequate_margins": True,    # Min 0.4" from slide edges
        "color_contrast": True,      # Text readable against backgrounds
        "visual_hierarchy": True     # Title > Headers > Body > Caption
    },
    "data_integrity": {
        "numbers_formatted": True,   # Proper commas, units, decimals
        "percentages_sum": True,     # Pie charts sum to ~100%
        "trends_accurate": True,     # Up/down arrows match data direction
        "source_cited": True         # Data has attribution
    }
}
```

### Visual QA Process

After PPTX generation, convert to images and inspect:

```
# Convert PPTX → PDF → JPG for visual inspection
libreoffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide

# Then visually verify each slide-XX.jpg for:
# - Text overflow or cutoff
# - Overlapping elements
# - Misaligned columns or cards
# - Low-contrast text
# - Missing content
# - Uneven spacing
```

### QA Fix Loop

1. Generate slides
2. Convert to images
3. Inspect each slide image
4. List ALL issues found
5. Fix issues in code
6. Re-generate and re-inspect
7. Repeat until clean pass

**Do not ship until at least one fix-and-verify cycle is complete.**

---

# PART 2: TECHNICAL ARCHITECTURE SPECIFICATION

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  "Dump and go" — paste text, upload file, or describe need      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STAGE 1: CONTENT ANALYZER                     │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │ Text     │  │ MECE         │  │ Title         │             │
│  │ Parser   │──│ Structurer   │──│ Generator     │             │
│  └──────────┘  └──────────────┘  └───────────────┘             │
│                                                                 │
│  Input: Raw text/file     Output: structured_content (JSON)     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                STAGE 2: ARCHETYPE CLASSIFIER                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  18 Archetype Templates with trigger keywords           │    │
│  │  Priority: Explicit request > Data shape > Inference    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Input: structured_content    Output: archetype_id + layout_id  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               STAGE 3: HTML MOCKUP GENERATOR                    │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │ Template │  │ Content      │  │ Overflow      │             │
│  │ Selector │──│ Injector     │──│ Validator     │             │
│  └──────────┘  └──────────────┘  └───────────────┘             │
│                                                                 │
│  6 Layout Patterns (A-F) × Design Token System                  │
│  Output: 1280×720px HTML file                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               STAGE 4: PPTX CONVERTER                           │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │ PptxGen  │  │ Archetype    │  │ Asset         │             │
│  │ JS Init  │──│ Renderers    │──│ Embedder      │             │
│  └──────────┘  └──────────────┘  └───────────────┘             │
│                                                                 │
│  Master CONFIG → Per-archetype render functions → .pptx file    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STAGE 5: QA ENGINE                              │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │ Auto     │  │ Visual       │  │ Fix           │             │
│  │ Checks   │──│ Inspection   │──│ Loop          │             │
│  └──────────┘  └──────────────┘  └───────────────┘             │
│                                                                 │
│  Checklist validation → Image comparison → Iterative fix        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │   FINAL OUTPUT   │
                    │   .pptx + .png   │
                    └──────────────────┘
```

## File Structure

```
SlideTheory/
├── src/
│   ├── pipeline.py               # Main orchestrator
│   ├── content_analyzer.py       # Stage 1: Parse + structure
│   ├── archetype_classifier.py   # Stage 2: Select archetype
│   ├── archetypes/
│   │   ├── __init__.py
│   │   ├── registry.py           # SLIDE_ARCHETYPES dict
│   │   ├── executive_summary.py
│   │   ├── three_pillar.py
│   │   ├── kpi_dashboard.py
│   │   ├── comparison_table.py
│   │   ├── process_flow.py
│   │   ├── timeline_swimlane.py
│   │   ├── before_after.py
│   │   ├── waterfall_chart.py
│   │   ├── two_by_two_matrix.py
│   │   ├── trend_line.py
│   │   ├── stacked_bar.py
│   │   ├── market_sizing.py
│   │   ├── competitive_landscape.py
│   │   ├── issue_tree.py
│   │   ├── decision_tree.py
│   │   ├── grid_cards.py
│   │   ├── scr_framework.py
│   │   └── agenda_divider.py
│   ├── html_generator/
│   │   ├── __init__.py
│   │   ├── base_template.py      # HTML shell + CSS vars
│   │   ├── layout_patterns.py    # Patterns A-F CSS
│   │   ├── overflow_checker.py   # Content fit validation
│   │   └── renderer.py           # Assemble HTML
│   ├── pptx_converter/
│   │   ├── generate.js           # PptxGenJS main entry
│   │   ├── config.js             # Master CONFIG object
│   │   ├── renderers/            # Per-archetype JS renderers
│   │   │   ├── executive_summary.js
│   │   │   ├── three_pillar.js
│   │   │   ├── kpi_dashboard.js
│   │   │   └── ...
│   │   └── icons.js              # react-icons → base64 PNG
│   └── qa/
│       ├── auto_checks.py        # QA_CHECKLIST validation
│       ├── visual_qa.py          # PPTX → image → inspect
│       └── fix_loop.py           # Iterative correction
├── templates/
│   ├── css/
│   │   ├── tokens.css            # Design system variables
│   │   ├── pattern_a.css         # Three-card
│   │   ├── pattern_b.css         # Two-column
│   │   ├── pattern_c.css         # Stat cards
│   │   ├── pattern_d.css         # Chevron flow
│   │   ├── pattern_e.css         # Table
│   │   └── pattern_f.css         # Swimlane
│   └── html/
│       └── base.html             # Master HTML shell
├── config/
│   ├── design_tokens.json        # Colors, fonts, spacing
│   └── archetype_triggers.json   # Keyword → archetype mapping
└── tests/
    ├── test_classifier.py
    ├── test_overflow.py
    └── sample_inputs/            # Test cases for each archetype
```

## Integration Points

### If Your System Already Has HTML-to-PPTX

Your existing pipeline likely does one of these:

1. **Headless browser screenshot → image → embed in PPTX** (low quality, non-editable)
2. **HTML parsing → python-pptx element mapping** (medium quality, limited layout control)
3. **Direct python-pptx programmatic generation** (high quality if well-implemented)

**Recommended upgrade path:**

- Keep your HTML mockup stage for preview generation (screenshot for PNG preview)
- Replace the PPTX generation with PptxGenJS archetype renderers for native, editable slides
- The HTML and PPTX stages should be **independent paths from the same structured_content JSON**, not a sequential HTML→PPTX conversion

```
structured_content.json
    ├── → HTML Generator → 1280×720 PNG preview
    └── → PptxGenJS Generator → native .pptx file
```

This decoupling means your PPTX output doesn't depend on HTML parsing accuracy.

## Key Performance Metrics

Track these to measure improvement:

|Metric|Baseline|Target|
|---|---|---|
|Title contains insight (not just topic)|~30%|95%+|
|Content fits without overflow|~60%|99%+|
|Correct archetype selected|~50%|90%+|
|Visual alignment passes QA|~40%|95%+|
|Full slide generation time|Variable|<8 seconds|

---

## IMPLEMENTATION PRIORITY ORDER

1. **Design Token System** — Implement CSS variables and PptxGenJS CONFIG first. Everything else depends on consistent styling.
2. **Archetype Registry** — Build the 18-archetype classification system with trigger keywords.
3. **Title Engineering** — Implement the WHAT + SO WHAT + NOW WHAT formula as a dedicated function.
4. **Top 5 Archetype Renderers** — executive_summary, three_pillar, kpi_dashboard, comparison_table, process_flow. These cover ~80% of slide requests.
5. **Overflow Prevention** — Content fit validation before rendering.
6. **Remaining 13 Archetypes** — Build incrementally based on usage.
7. **QA Pipeline** — Automated checks + visual inspection loop.

---

## CONSULTING COMMUNICATION PRINCIPLES (Reference)

These principles should be embedded in the content analysis and title generation stages:

1. **Pyramid Principle (Barbara Minto)**: Lead with the answer. Support with grouped arguments. Support arguments with data.
2. **MECE**: Every grouping must be Mutually Exclusive and Collectively Exhaustive.
3. **So-What Test**: Every piece of information must answer "so what does this mean for the reader?"
4. **One Slide, One Message**: Each slide should communicate exactly one key insight.
5. **Evidence Before Recommendation**: Show the data that leads to the conclusion, then state the conclusion.
6. **Action Orientation**: Every slide should implicitly or explicitly suggest what the reader should do next.
7. **Audience Calibration**: C-suite wants decisions and impact. Middle management wants process and timelines. Technical teams want methodology and detail.
