# Consulting Firm Design System Guide

A comprehensive guide to presentation design standards based on McKinsey, BCG, Bain, and industry best practices.

---

## Table of Contents

1. [Typography](#1-typography)
2. [Color Systems](#2-color-systems)
3. [Layout Grids](#3-layout-grids)
4. [Chart Standards](#4-chart-standards)
5. [Iconography](#5-iconography)
6. [Common Slide Layouts](#6-common-slide-layouts)
7. [Accessibility Guidelines](#7-accessibility-guidelines)
8. [Quality Checklist](#8-quality-checklist)

---

## 1. Typography

### 1.1 Recommended Fonts

Consulting firms prioritize **readability, professionalism, and cross-platform compatibility** in their font choices.

#### Primary Font Families

| Use Case | McKinsey | BCG | Bain | Universal Fallbacks |
|----------|----------|-----|------|---------------------|
| **Headlines** | Bower (custom) → Georgia | Helvetica/Arial Bold | Helvetica Bold | Arial Bold, Calibri Bold, Segoe UI Bold |
| **Body Text** | McKinsey Sans → Arial | Helvetica/Arial | Helvetica | Arial, Calibri, Segoe UI |

#### Font Recommendations by Context

**For Standard Business Presentations:**
- **Windows:** Segoe UI (system font, highly readable)
- **Mac:** Helvetica, Avenir, or San Francisco
- **Cross-platform:** Arial (universally available)

**For Premium/Custom Presentations:**
- **Premium Sans-Serif:** Circular (Spotify), Graphik, Eina Sans, Aktiv Grotesk
- **Free Alternatives (Google Fonts):** Inter, Open Sans, Roboto, Montserrat, Lato, Poppins

**Font Pairing Rules:**
- Use **maximum 2 fonts** per presentation
- If using two fonts, choose from different families (Serif + Sans-Serif)
- Never pair similar-looking fonts (e.g., avoid Arial + Segoe UI)

### 1.2 Font Sizes

| Element | Size (Points) | Usage |
|---------|---------------|-------|
| **Slide Title / Headline** | 28-36 pt | Main slide titles, action titles |
| **Subtitle** | 20-24 pt | Supporting headlines, section headers |
| **Body Text** | 16-20 pt | Main content (18 pt minimum for accessibility) |
| **Bullet Points** | 16-18 pt | List content |
| **Chart Labels** | 12-14 pt | Axis labels, data labels |
| **Footnotes / Sources** | 10-12 pt | Source citations, disclaimers |

**Minimum Font Size Rule:** Never go below **18 pt for body text** in live presentations. For leave-behind decks, 14 pt absolute minimum.

### 1.3 Line Heights and Spacing

#### Line Spacing (Leading)

| Text Size | Line Spacing | Rationale |
|-----------|--------------|-----------|
| Large text (>20 pt) | 0.85-1.0 | Tighter spacing for headlines |
| Body text (16-20 pt) | 1.2-1.3 | Improved readability |
| Small text (<14 pt) | 1.3-1.5 | More breathing room for dense text |

**PowerPoint Settings:**
- Use **"Multiple"** line spacing (not "Exactly") for relative scaling
- Default PowerPoint spacing is too loose; manually adjust downward for large text

#### Paragraph Spacing

- **Before paragraph:** 6-12 pt
- **After paragraph:** 6-12 pt
- **Between bullet points:** 6-8 pt

#### Character Spacing (Tracking)

- **Large headlines (all caps):** Expand tracking slightly (+0.5 to +1 pt) for elegance
- **Body text:** Normal or slightly condensed (-0.2 to 0 pt)
- **Numbers:** Pay attention to 0 and 1 kerning; may need individual adjustment

### 1.4 Typography Best Practices

1. **Left-align all body text** - never justify in presentations
2. **Use bold for emphasis** - avoid ALL CAPS and italics for emphasis
3. **Limit text per slide** - maximum 7 lines, 7 words per line (7×7 rule)
4. **Action titles** - slide titles should be complete thoughts/sentences stating the key takeaway
5. **Visual hierarchy** - ensure clear distinction between title (largest), subtitle, and body

---

## 2. Color Systems

### 2.1 McKinsey Color Palette

McKinsey's 2019 rebrand introduced a **high-contrast "50 shades of blue"** palette with a deeper, more vivid blue.

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Dark Blue** | `#051C2C` | Headers, primary text, key elements |
| **Primary Blue** | `#0066FF` | Accents, highlights, links |
| **Light Blue** | `#E6F2FF` | Backgrounds, subtle fills |
| **Accent Blue** | `#0055CC` | Charts, secondary elements |
| **White** | `#FFFFFF` | Primary background |
| **Light Gray** | `#F5F5F5` | Alternate backgrounds |
| **Dark Gray** | `#333333` | Body text on light backgrounds |

**McKinsey Design Principles:**
- Mix white and dark blue slides for contrast and visual interest
- Use vivid blue **sparingly** to highlight key data or insights
- Apply soft gradients for depth on backgrounds

### 2.2 BCG Color Palette

BCG is known for its distinctive **green and white** color scheme.

| Color | Hex Code | Usage |
|-------|----------|-------|
| **BCG Green** | `#00512E` | Primary brand color, headers |
| **BCG Light Green** | `#4CAF50` | Accents, positive indicators |
| **BCG Yellow/Gold** | `#FFC107` | Highlights, callouts, key data points |
| **Dark Gray** | `#2D2D2D` | Primary text |
| **White** | `#FFFFFF` | Primary background |
| **Light Gray** | `#F8F9FA` | Alternate backgrounds |

**BCG Design Principles:**
- Use color coding strategically to draw attention to key insights
- Yellow/gold is used selectively to highlight critical data
- Green gradients for positive trends

### 2.3 Bain Color Palette

Bain uses a **red and neutral** color scheme.

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Bain Red** | `#CB2026` | Primary brand color, accent |
| **Deep Red** | `#8B0000` | Headers, emphasis |
| **Black/Dark Gray** | `#1A1A1A` | Primary text |
| **Pale Gray** | `#F5F5F5` | Backgrounds |
| **White** | `#FFFFFF` | Primary background |

### 2.4 Semantic Colors (Universal)

| Meaning | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| **Positive / Growth** | Green | `#2E7D32` or `#4CAF50` | Positive trends, growth, success |
| **Negative / Decline** | Red | `#C62828` or `#EF5350` | Negative trends, decline, warnings |
| **Neutral / Baseline** | Gray | `#757575` or `#9E9E9E` | Baseline data, neutral categories |
| **Highlight / Attention** | Blue | `#1565C0` or `#2196F3` | Key insights, callouts |
| **Caution / Warning** | Orange/Amber | `#F57C00` or `#FFB300` | Caution, intermediate states |

**Semantic Color Rules:**
1. Always use the same semantic color for the same meaning throughout a presentation
2. Green for positive, red for negative is standard in Western business contexts
3. Be mindful of cultural associations (red = luck in Eastern cultures)

### 2.5 Color Usage Guidelines

#### General Principles

1. **Limit your palette** - Use 1-2 core colors + semantic colors
2. **Start with grayscale** - Build charts in gray first, then add color for emphasis
3. **60-30-10 rule:**
   - 60% neutral (white/gray backgrounds)
   - 30% primary brand color
   - 10% accent/highlight color

#### Background Colors

| Background | Text Color | Use Case |
|------------|------------|----------|
| White (#FFFFFF) | Dark gray/black | Standard slides, maximum readability |
| Light gray (#F5F5F5) | Dark gray | Alternate slides, subtle differentiation |
| Dark blue (McKinsey) | White | Section dividers, emphasis slides |
| Dark (any) | White/Light | Title slides, dramatic effect |

#### Accessibility Requirements

- Minimum contrast ratio: **4.5:1** for normal text
- Minimum contrast ratio: **3:1** for large text (18pt+ bold, 24pt+ normal)
- Never rely on color alone to convey meaning (use patterns, labels, or icons)
- Consider color blindness: ~8% of men and 0.5% of women have color vision deficiencies
- Red-green color blindness is most common - avoid red-green combinations for critical distinctions

---

## 3. Layout Grids

### 3.1 Standard Slide Margins

| Margin Type | Size | Use Case |
|-------------|------|----------|
| **Ultra-thin** | 0.25" (6mm) | Creative presentations, design portfolios, modern layouts |
| **Thin** | 0.5" (12mm) | Content-heavy slides, data presentations |
| **Normal** | 0.75" (19mm) | Standard business presentations |
| **Thick** | 1.0"+ (25mm+) | Conference presentations, stage/keynote presentations |

**Recommendation for Consulting Decks:** Use **normal to thin margins (0.5-0.75")** to maximize content space while maintaining professionalism.

### 3.2 Grid Systems

Consulting firms typically use a **12-column grid system** for maximum flexibility.

#### 12-Column Grid

```
| M | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | M |
```

- **Columns:** 12 equal columns
- **Gutter width:** 0.25" - 0.5" between columns
- **Margins:** As defined above
- **Row height:** Use consistent vertical rhythm (e.g., 0.5" increments)

#### Common Layout Patterns

| Layout | Columns Used | Best For |
|--------|--------------|----------|
| **50/50 Split** | 6 + 6 | Comparisons, two-column text |
| **1/3 - 2/3** | 4 + 8 | Chart + bullets, image + text |
| **2/3 - 1/3** | 8 + 4 | Bullets + chart, text + image |
| **3-Column** | 4 + 4 + 4 | Three options, timeline steps |
| **Golden Ratio** | 4.5 + 7.5 | Visual hierarchy emphasis |

### 3.3 Whitespace Guidelines

**The 20-30% Rule:** Maintain **20-30% empty space** on each slide to reduce cognitive load.

#### Whitespace Usage

| Element | Spacing Guideline |
|---------|-------------------|
| **Page margins** | Consistent on all sides (as defined above) |
| **Between sections** | 2x the internal spacing |
| **Between elements** | Minimum 0.25" (6mm) |
| **Text to edge of box** | 0.15-0.2" (4-5mm) padding |
| **Title to content** | 0.3-0.5" (8-12mm) |

#### Whitespace Techniques

1. **Reference Squares Method:**
   - Create two squares (large for margins, small for element spacing)
   - Use as guides when positioning elements
   - Delete when finished

2. **Grouping with Whitespace:**
   - Equal spacing = equal relationship
   - Larger gaps = separate categories
   - Use whitespace to create visual hierarchy without lines or boxes

### 3.4 Design Principles (CRAP)

| Principle | Application |
|-----------|-------------|
| **Contrast** | Direct attention to critical messages through size and color differentiation |
| **Repetition** | Reinforce brand and thematic consistency across all slides |
| **Alignment** | Establish visual order; everything should align to something else |
| **Proximity** | Group related elements; space indicates relationships |

---

## 4. Chart Standards

### 4.1 When to Use Each Chart Type

| Chart Type | Best For | Avoid When |
|------------|----------|------------|
| **Bar Chart** | Comparing categories, rankings | Too many categories (>10) |
| **Line Chart** | Trends over time, continuous data | Discrete categories, few data points |
| **Pie Chart** | Simple part-to-whole (3-5 segments) | Many segments, precise comparison needed |
| **Donut Chart** | Part-to-whole with center metric | Complex breakdowns |
| **Stacked Bar** | Composition within categories | Too many segments, precise comparison |
| **Waterfall** | Showing cumulative changes | Simple additions/subtractions |
| **Scatter Plot** | Correlations, relationships, distributions | Simple comparisons |
| **Bubble Chart** | 3 variables (x, y, size) | Precise value comparison |
| **Heat Map** | Patterns in matrix data, intensity | Continuous trends |
| **Histogram** | Frequency distribution | Small datasets |
| **Box Plot** | Distribution, outliers, quartiles | Non-technical audiences |
| **Radar/Spider** | Multi-dimensional comparison | More than 6-8 variables |

### 4.2 Chart Selection Decision Tree

```
What do you want to show?
├── Comparison
│   ├── Categories → Bar Chart
│   ├── Time → Line Chart
│   └── Before/After → Waterfall or Bar Chart
├── Composition
│   ├── Static (one time) → Pie/Donut (few) or Stacked Bar (many)
│   └── Changing over time → Stacked Area or 100% Stacked Bar
├── Distribution
│   ├── Single variable → Histogram
│   ├── Two variables → Scatter Plot
│   └── Multiple variables → Box Plot or Bubble Chart
└── Relationship
    ├── Two variables → Scatter Plot
    └── Three variables → Bubble Chart
```

### 4.3 Chart Design Best Practices

#### General Principles

1. **One chart per slide** - Full-slide charts maximize impact and clarity
2. **Clear, action-oriented title** - State the insight, not just the topic
3. **Minimal chart junk** - Remove unnecessary gridlines, borders, 3D effects
4. **Direct labels** - Label data points directly when possible; minimize legend use
5. **Consistent scales** - Keep Y-axis scales consistent across related charts

#### Color Schemes for Data Visualization

**Sequential (for ordered data):**
```
Lightest → Darkest
#E3F2FD → #1565C0 (blue gradient)
```

**Diverging (for data with midpoint):**
```
Negative → Neutral → Positive
#EF5350 → #F5F5F5 → #66BB6A
```

**Categorical (for distinct categories):**
```
Use distinct but harmonious colors
Max 4-5 categories; more = use patterns or labels
```

**Highlighting:**
```
Use neutral gray for baseline data
Use brand/accent color for key data point(s)
```

### 4.4 Axis Labeling Best Practices

| Element | Best Practice |
|---------|---------------|
| **Y-Axis** | Start at zero for bar charts; can truncate for line charts if appropriate |
| **X-Axis** | Use horizontal labels; rotate 45° if necessary; avoid vertical text |
| **Units** | Always include units ($, %, K, M) |
| **Scales** | Keep consistent across comparable charts |
| **Gridlines** | Use light gray (#E0E0E0); minimal horizontal only; consider removing entirely |

### 4.5 Legend Placement

| Placement | When to Use |
|-----------|-------------|
| **Top** | Short legend, need to save horizontal space |
| **Bottom** | Standard placement, doesn't compete with title |
| **Right** | Long legend items, horizontal chart layout |
| **Embedded** | Preferred - label data directly, eliminate legend |

**Legend Best Practices:**
- Order legend items to match chart order
- Use clear, descriptive labels
- Consider direct data labeling instead of legend for simple charts

### 4.6 Data Labels and Annotations

- **Use data labels when:** Exact values matter, few data points
- **Skip data labels when:** Chart is for trend analysis, many data points clutter
- **Callouts/Annotations:** Use for highlighting key insights, outliers, or inflection points
- **Number formatting:**
  - Large numbers: Use K (thousands), M (millions), B (billions)
  - Decimals: Limit to 1-2 decimal places maximum
  - Percentages: Include % symbol

---

## 5. Iconography

### 5.1 Arrow Styles

| Arrow Type | Use Case | Style |
|------------|----------|-------|
| **Standard arrow** | Direction, flow, progression | Simple line with triangular head |
| **Thick arrow** | Strong emphasis, major transitions | 2-3pt line weight |
| **Dashed arrow** | Optional path, alternative flow | Dotted or dashed line |
| **Curved arrow** | Return, cycle, feedback loop | Smooth curve |
| **Bidirectional** | Two-way relationship, balance | Arrowheads on both ends |

**Arrow Color Guidelines:**
- Use neutral gray for standard directional arrows
- Use semantic colors (green/red) for positive/negative trends
- Match arrow color to associated element or brand color

### 5.2 Bullet Point Styles

| Style | When to Use |
|-------|-------------|
| **Solid circle (●)** | Standard bulleted lists |
| **Hollow circle (○)** | Secondary level, sub-bullets |
| **Square (■)** | Alternative to circle, checklists |
| **Dash (–)** | Informal lists, sub-bullets |
| **Arrow (→)** | Action items, process steps |
| **Numbered (1, 2, 3)** | Sequential steps, priorities, rankings |
| **Lettered (A, B, C)** | Options, alternatives |

**Bullet Point Best Practices:**
- Limit to 3-5 bullets per slide when possible
- Keep bullet text to 1-2 lines maximum
- Use consistent punctuation (periods for complete sentences, none for fragments)
- Align bullets consistently; use hanging indents for multi-line bullets

### 5.3 Standard Icons

Consulting firms use **simple, minimalist, monochromatic icons** that blend with the overall aesthetic.

#### Common Icon Categories

| Category | Examples |
|----------|----------|
| **Business** | Company, strategy, growth, revenue, profit |
| **People** | Users, customers, employees, teams, leadership |
| **Technology** | Digital, AI, data, cloud, security |
| **Process** | Workflow, timeline, steps, iteration |
| **Status** | Checkmark, warning, error, info |
| **Trends** | Up arrow, down arrow, stable, volatility |

#### Icon Design Principles

1. **Consistency:** Use icons from the same set throughout
2. **Simplicity:** Simple line icons work best; avoid detailed illustrations
3. **Size:** Minimum 0.5" (12mm) for visibility; scale consistently
4. **Color:** Monochromatic by default; use accent color for emphasis
5. **Alignment:** Align icons with associated text baselines

#### Recommended Icon Sources

- **Professional sets:** Think-Cell, Noun Project, Font Awesome
- **Built-in:** PowerPoint Icons (limited but consistent)
- **Custom:** Commission bespoke icon sets for major presentations

### 5.4 Using Icons Effectively

| Technique | Application |
|-----------|-------------|
| **Icon + Label** | Key concepts, categories |
| **Icon in circle/shape** | Callouts, key metrics |
| **Icon as bullet** | Visual lists |
| **Icon row** | Process steps, timeline |
| **Icon grid** | Framework illustration, capability map |

---

## 6. Common Slide Layouts

### 6.1 Layout: Title + 2-Column

**Purpose:** Compare two options, present text + chart, or show image + bullets

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Action-Oriented Statement]    │
├──────────────────┬──────────────────────┤
│                  │                      │
│   [Left Column]  │   [Right Column]     │
│   - Bullets      │   - Chart/Image      │
│   - Text block   │   - Data             │
│                  │                      │
├──────────────────┴──────────────────────┤
│  [Source: xxx]                          │
└─────────────────────────────────────────┘
```

**Grid:** 50/50 split or 40/60 for emphasis

**Best For:** Comparisons, supporting evidence with visualization

---

### 6.2 Layout: Title + Chart + Bullets

**Purpose:** Present data visualization with supporting context

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Key Insight from Chart]       │
├─────────────────────────────────────────┤
│                                         │
│         [Large Chart/Graph]             │
│                                         │
├──────────────────┬──────────────────────┤
│  [Key Takeaway]  │  [Supporting Points] │
│                  │  • Bullet 1          │
│                  │  • Bullet 2          │
└──────────────────┴──────────────────────┘
```

**Grid:** Chart spans full width; summary below

**Best For:** Data-driven insights, executive summaries of analysis

---

### 6.3 Layout: Full-Bleed Chart

**Purpose:** Maximum impact for key data visualization

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - States the Chart's Message]   │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│      [Chart fills 80%+ of slide]        │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [Minimal annotation if needed]         │
│  [Source: xxx]                          │
└─────────────────────────────────────────┘
```

**Grid:** Minimal margins, chart dominates

**Best For:** Key findings, trend analysis, market data

---

### 6.4 Layout: Comparison

**Purpose:** Side-by-side comparison of options, scenarios, or time periods

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Comparison Result/Takeaway]   │
├──────────────────┬──────────────────────┤
│    [Option A]    │     [Option B]       │
│                  │                      │
│    • Point 1     │     • Point 1        │
│    • Point 2     │     • Point 2        │
│    • Point 3     │     • Point 3        │
│                  │                      │
│   [Visual/Icon]  │    [Visual/Icon]     │
├──────────────────┴──────────────────────┤
│  [Recommendation/Conclusion]            │
└─────────────────────────────────────────┘
```

**Grid:** 50/50 split with clear visual separation

**Best For:** Option evaluation, before/after, competitor comparison

---

### 6.5 Layout: Executive Summary

**Purpose:** Single-slide overview of entire presentation

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title: Executive Summary]             │
├─────────────────────────────────────────┤
│  [1-2 sentence overall conclusion]      │
├──────────┬──────────┬───────────────────┤
│ [Point 1]│ [Point 2]│ [Point 3]         │
│ Brief    │ Brief    │ Brief             │
│ summary  │ summary  │ summary           │
├──────────┴──────────┴───────────────────┤
│  [Key metrics / numbers row]            │
└─────────────────────────────────────────┘
```

**Grid:** 3-column for points, full-width for metrics

**Best For:** Opening summary slide, read-ahead decks

---

### 6.6 Layout: Framework/Matrix

**Purpose:** Present consulting frameworks (2x2, pyramid, flow)

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Framework Conclusion]         │
├─────────────────────────────────────────┤
│                                         │
│      [2x2 Matrix or Framework]          │
│      ┌─────────┬─────────┐              │
│      │    A    │    B    │              │
│      ├─────────┼─────────┤              │
│      │    C    │    D    │              │
│      └─────────┴─────────┘              │
│                                         │
│  [Brief description of each quadrant]   │
└─────────────────────────────────────────┘
```

**Grid:** Centered framework, annotations around

**Best For:** Strategic frameworks, positioning, portfolio analysis

---

### 6.7 Layout: Timeline/Roadmap

**Purpose:** Show sequence, phases, or milestones

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Timeline Summary]             │
├─────────────────────────────────────────┤
│                                         │
│  [M1]────[M2]────[M3]────[M4]────[M5]   │
│   │       │       │       │       │    │
│  Phase 1  │    Phase 2    │   Phase 3  │
│                                         │
│  [Swim lanes if multiple workstreams]   │
└─────────────────────────────────────────┘
```

**Grid:** Horizontal flow, vertical swim lanes for complexity

**Best For:** Implementation plans, project schedules, strategic roadmaps

---

### 6.8 Layout: Title Slide

**Purpose:** Professional opening with minimal information

**Structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│        [Presentation Title]             │
│        ───────────────────              │
│        Subtitle if needed               │
│                                         │
│                                         │
│        [Date]                           │
│        [Client/Organization]            │
│                                         │
└─────────────────────────────────────────┘
```

**Best For:** Opening, setting professional tone

---

### 6.9 Layout: Section Divider

**Purpose:** Signal transition to new section

**Structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│              [Section Number]           │
│                                         │
│           [Section Title]               │
│                                         │
│         Brief description               │
│                                         │
└─────────────────────────────────────────┘
```

**Design:** Often uses dark background or accent color for contrast

**Best For:** Long presentations, clear section breaks

---

### 6.10 Layout: Key Metrics/Snapshot

**Purpose:** Dashboard-style presentation of 3-5 key numbers

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Title - Performance Summary]          │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│   85%    │   $2.4M  │     +23%          │
│          │          │                   │
│  Metric  │  Metric  │     Metric        │
│   One    │   Two    │      Three        │
│          │          │                   │
└──────────┴──────────┴───────────────────┘
```

**Design:** Large numbers, minimal text, icon optional

**Best For:** KPIs, financial summaries, performance dashboards

---

## 7. Accessibility Guidelines

### 7.1 Visual Accessibility

| Requirement | Standard |
|-------------|----------|
| **Minimum font size** | 18 pt for body text, 24 pt preferred |
| **Contrast ratio** | 4.5:1 minimum for body text; 3:1 for large text |
| **Color reliance** | Never use color alone to convey information |
| **Pattern/texture** | Use with color for charts when possible |

### 7.2 Color Blindness Considerations

- **Red-Green (most common):** Avoid red-green pairs for critical distinctions
- **Blue-Yellow:** Less common but important for some populations
- **Solutions:**
  - Use patterns (stripes, dots) in addition to colors
  - Add labels directly to chart elements
  - Use shape differences in addition to color

### 7.3 Text Alternatives

- **Charts:** Provide data table in appendix or speaker notes
- **Images:** Include descriptive alt text when sharing digitally
- **Icons:** Ensure icon meaning is clear from context or label

### 7.4 Reading Order

- Structure slides with logical reading order (top-to-bottom, left-to-right)
- Test with PowerPoint's Accessibility Checker
- Ensure screen readers can navigate content correctly

---

## 8. Quality Checklist

### 8.1 Content Review

- [ ] Slide titles are action-oriented (state the takeaway)
- [ ] One main idea per slide
- [ ] No more than 7 lines/bullets per slide
- [ ] All claims supported by data on slide or appendix
- [ ] Sources cited for all data
- [ ] Story flows logically from slide to slide

### 8.2 Visual Review

- [ ] Consistent fonts throughout
- [ ] Font sizes meet minimum requirements
- [ ] Colors from approved palette only
- [ ] Sufficient color contrast
- [ ] Consistent alignment across slides
- [ ] Proper whitespace (not overcrowded)
- [ ] Charts use appropriate types
- [ ] All charts have clear labels and titles

### 8.3 Formatting Review

- [ ] Logo placement consistent
- [ ] Footer information complete (source, date, page numbers)
- [ ] Margins consistent
- [ ] Element alignment verified
- [ ] No spelling or grammar errors
- [ ] Numbers formatted consistently

### 8.4 Technical Review

- [ ] File size appropriate for sharing
- [ ] Fonts embedded or standard fonts used
- [ ] All links working (if applicable)
- [ ] Animations minimal and purposeful
- [ ] Tested on target display/screen

### 8.5 The "Squint Test"

1. Step back from the slide
2. Squint your eyes
3. Ask yourself:
   - [ ] Is the main message still clear?
   - [ ] Does the visual hierarchy remain apparent?
   - [ ] Are the key data points prominent?

If the answer to any is no, revise the slide.

---

## Appendix: Key Terms

| Term | Definition |
|------|------------|
| **Action Title** | Slide title that states the key takeaway or conclusion |
| **Chart Junk** | Visual elements that don't enhance understanding |
| **Full-Bleed** | Image or element that extends to the edge of the slide |
| **Gutter** | Space between columns in a grid |
| **MECE** | Mutually Exclusive, Collectively Exhaustive - no overlap, no gaps |
| **Placeholder** | Pre-defined content area in slide master |
| **Pyramid Principle** | Top-down communication: conclusion first, then supporting arguments |
| **SCQA** | Situation, Complication, Question, Answer - storytelling framework |
| **Whitespace** | Empty space around and between design elements |

---

## References

This guide synthesizes best practices from:
- McKinsey & Company visual identity guidelines (2019)
- Boston Consulting Group presentation standards
- Bain & Company design principles
- Industry research on data visualization (Tufte, Few)
- Leading presentation design agencies (Slidor, BrightCarbon, SlideModel)

---

*Document Version: 1.0*
*Last Updated: February 2026*
