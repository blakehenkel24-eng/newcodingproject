# AI Slide Generation: Comprehensive Research Document

**Research Date:** February 2026  
**Purpose:** Guide major product improvements for SlideTheory  
**Target Quality Standard:** McKinsey-level (10/10) presentations

---

## Table of Contents

1. [How Top Companies Do Slide Generation](#1-how-top-companies-do-slide-generation)
2. [McKinsey-Level Slide Standards (10/10 Quality)](#2-mckinsey-level-slide-standards-1010-quality)
3. [Technical Approaches for AI Slide Generation](#3-technical-approaches-for-ai-slide-generation)
4. [Improvement Opportunities](#4-improvement-opportunities)
5. [Key Takeaways & Recommendations](#5-key-takeaways--recommendations)

---

## 1. How Top Companies Do Slide Generation

### 1.1 Tome.app Approach

**Core Philosophy:** AI-powered storytelling and narrative generation

**Key Differentiators:**
- **Narrative-First Approach:** Tome focuses on transforming content into compelling stories rather than just slides
- **Interactive Presentations:** Creates web-native, interactive presentations rather than static slides
- **AI Page Generation:** Uses AI to generate individual pages/sections based on prompts
- **Dynamic Layouts:** Automatically adjusts layouts based on content type and narrative flow
- **Integration-Heavy:** Connects with various data sources and tools for live data

**Technology Stack:**
- Proprietary AI models for narrative structuring
- Web-native rendering (not PowerPoint-based)
- Real-time collaboration engine
- Integration APIs for data sources

**Limitations:**
- Poor PowerPoint export quality (formatting issues)
- Limited customization for strict brand guidelines
- Not ideal for traditional consulting deck formats

---

### 1.2 Gamma.app Methodology

**Core Philosophy:** "Cards" instead of slides - web-native presentations

**Key Differentiators:**
- **Card-Based System:** Breaks content into bite-sized "cards" rather than traditional slides
- **One-Click Restyling:** Entire presentation theme can be changed instantly
- **Interactive Elements:** Built-in support for embeds, videos, GIFs, apps
- **AI Content Generation:** Generates content from prompts, notes, or documents
- **Focus on Visual Appeal:** Modern, minimalist aesthetic by default

**Workflow:**
1. User inputs content (notes, docs, or prompts)
2. AI breaks content into narrative "cards"
3. User selects visual theme
4. AI suggests images and layouts
5. Real-time collaboration and sharing

**Strengths:**
- Lightning-fast creation (minutes vs. hours)
- Beautiful default aesthetics
- Strong for web-based sharing
- Good for startups and creative pitches

**Weaknesses:**
- PowerPoint export is problematic (paid feature with formatting issues)
- Limited template selection compared to competitors
- Can produce generic layouts without deep customization
- Lacks enterprise-grade features (SOC 2, admin controls)
- Missing complex data visualization capabilities

---

### 1.3 Beautiful.ai Smart Slide Technology

**Core Philosophy:** "Design Automation" - AI handles design decisions automatically

**Key Differentiators:**
- **Smart Slides™:** 60+ intelligent templates that auto-adjust as content is added/removed
- **Design Guardrails:** Built-in rules prevent bad design (prevents text overflow, maintains alignment)
- **Real-Time Adaptation:** Layouts automatically resize and realign based on content changes
- **Professional Templates:** Curated for business use cases (pitch decks, QBRs, marketing)

**Smart Slide Types:**
- Dashboard (multiple charts/visuals on one slide)
- Arrow cycles (process visualization)
- Photo grids (visual storytelling)
- Gantt charts (project timelines)
- Infographics (data presentation)

**AI Features:**
- AI Presentation Maker (generate from prompts)
- AI Slide Generation (single slide creation)
- AI Image Generation (matching deck style)
- AI Writing Assistant (rewrite, expand, shorten)

**Technology Approach:**
- Rule-based design system with ML enhancement
- Constraint-based layouts (prevents user errors)
- Template matching algorithm
- Brand theme system (colors, fonts, logos)

**User Impact:**
- Saves up to 70-80% of design time
- Consistent professional output
- No design skills required

---

### 1.4 Plus AI Methodology

**Core Philosophy:** "Native integration" - AI inside PowerPoint and Google Slides

**Key Differentiators:**
- **Native Add-in:** Works directly inside PowerPoint and Google Slides (not standalone)
- **Contextual AI:** Considers entire presentation context when generating/editing
- **Enterprise-Grade:** SOC 2 Type II compliance, custom templates for organizations
- **Open XML Renderer:** Creates native PPTX files (full compatibility)

**AI Capabilities:**
- **Insert:** Add single slides with specific layouts
- **Rewrite:** Condense, expand, change tone, fix grammar
- **Remix:** Reformat slides into new layouts instantly
- **Custom Instructions:** Save brand voice and context preferences

**Workflow:**
1. User describes presentation needs
2. AI generates outline for review
3. User approves/modifies outline
4. AI generates slides with chosen theme
5. User refines using native editing tools

**Input Methods:**
- Prompt to presentation
- Text to presentation (up to 100K characters)
- Document to presentation (PDF, Word, etc.)

**Strengths:**
- No workflow disruption (stays in familiar tools)
- Large prompt window (100K characters)
- Slide-by-slide guidance possible
- Enterprise security compliance
- Context retention across slides

**Weaknesses:**
- Less design automation than Beautiful.ai
- Still requires manual formatting in some cases
- Can produce inconsistent results without careful prompting

---

### 1.5 Other Notable Tools

#### Presentations.AI
- **Focus:** Professional, data-rich presentations
- **Key Feature:** "Anti-fragile" templates that adapt to content changes
- **Strength:** Reliable PowerPoint export
- **Differentiator:** Research-enhancement for factual accuracy

#### Wonderslide
- **Approach:** Upload draft PPT → AI applies professional design
- **Technology:** Neural network trained on thousands of professional templates
- **Output:** Editable PowerPoint/Google Slides files

#### Adobe DocPres (Research Project)
- **Approach:** Multi-staged LLM + VLM pipeline
- **Innovation:** Hierarchical document summarization before slide generation
- **Stages:** Bird's-eye view → Outline → Slide mapping → Content generation

---

## 2. McKinsey-Level Slide Standards (10/10 Quality)

### 2.1 Visual Hierarchy Best Practices

**The McKinsey Visual System:**

| Element | Standard | Rationale |
|---------|----------|-----------|
| **Action Titles** | Complete sentences stating the insight | Executives can understand the story by reading only titles |
| **One Message Per Slide** | Single insight per slide | Prevents cognitive overload |
| **Data Prominence** | Full-slide charts for important data | Focuses attention on evidence |
| **Visual Hierarchy** | Clear distinction between primary/secondary info | Guides eye naturally |

**Typography Hierarchy:**

| Level | Font Size | Usage |
|-------|-----------|-------|
| Action Title | 24-28pt | Slide headline (key takeaway) |
| Subtitle/Section | 20-22pt | Supporting context |
| Body Text | 16-18pt | Main content, bullet points |
| Chart Labels | 12-14pt | Data annotations, axis labels |
| Source/Footer | 10-12pt | Citations, footnotes |

**Font Guidelines:**
- **Primary Fonts:** Arial, Helvetica, Calibri (sans-serif)
- **Avoid:** Script fonts, decorative fonts
- **Left-aligned** for body text (easier to scan)
- **Line spacing:** 1.5-2.0 for readability
- **Bold** for emphasis only (avoid italics, underlines)

---

### 2.2 Typography and Spacing Rules

**Consulting Typography Principles:**

1. **Maximum 3 Font Sizes Per Slide**
   - Too many sizes create visual chaos
   - Audience notices inconsistency subconsciously

2. **The 120% Rule for Line Spacing**
   - Optimal line spacing = 1.2x font size
   - Example: 18pt font → 22pt line spacing
   - Prevents cramped text while maintaining connection

3. **Character Limits**
   - Action titles: 1-2 lines maximum
   - Bullet points: 1 line preferred, 2 lines maximum
   - Body text: 50-60 characters per line optimal

4. **White Space Management**
   - Minimum 10% margin on all sides
   - Adequate spacing between sections
   - "Breathing room" reduces cognitive load

5. **Contrast Standards**
   - Minimum 4.5:1 contrast ratio (WCAG compliance)
   - Dark text on light background (preferred for consulting)
   - Black (#000000) on white (#FFFFFF) is gold standard

---

### 2.3 Color Theory for Consulting

**The McKinsey Color Palette:**

McKinsey uses a **minimalist approach** - only blues and neighboring hues:
- Primary: Dark blue (#003f5c)
- Secondary: Medium blues, teals
- Accent: Light blue-gray
- Gray: Blue-tinted gray (#c0c5c9)

**Consulting Color Principles:**

| Principle | Application |
|-----------|-------------|
| **Minimal Palette** | 2-3 primary colors + shades |
| **Functional Colors** | Colors must have meaning (green = positive, red = negative) |
| **Professional Tones** | Desaturated, business-appropriate |
| **Consistency** | Same colors for same categories across deck |

**Color Strategies by Firm:**
- **McKinsey:** Blues only (minimalist, trustworthy)
- **BCG:** Greens (growth, money)
- **Bain:** Reds (energy, action)

**Data Visualization Colors:**
- Sequential: Single hue, varying lightness
- Diverging: Two hues meeting at neutral center
- Categorical: Distinct but harmonious hues (max 5-7)

**Accessibility Requirements:**
- Colorblind-friendly palettes (8% of men affected)
- Don't rely on color alone for meaning
- Test with colorblind simulators

---

### 2.4 Data Visualization Standards

**Chart Selection Guide:**

| Purpose | Recommended Chart | Avoid |
|---------|-------------------|-------|
| Category comparison | Horizontal bar chart | Pie charts (hard to compare) |
| Trend over time | Line chart | 3D charts (distortion) |
| Part-to-whole | Stacked bar, treemap | Pie charts with many segments |
| Correlation | Scatter plot with trendline | Dual-axis charts (confusing) |
| Distribution | Histogram, box plot | Area charts (hard to read values) |
| Process/flow | Sankey, simple process flow | Complex diagrams |

**McKinsey Data Visualization Rules:**

1. **Start with Insight, Then Choose Chart**
   - Don't start with data and force a visualization
   - Select the chart that proves your point most clearly

2. **Simplest Chart That Works**
   - Bar charts beat 3D pie charts every time
   - Simple beats clever

3. **Full-Slide Charts for Critical Insights**
   - Give important data room to breathe
   - Don't surround with bullet points

4. **Direct Labeling**
   - Label data points directly on chart
   - Eliminate legends when possible
   - Reduces cognitive load

5. **Highlight What Matters**
   - Use color, arrows, callouts to draw attention
   - Guide audience to key data point

6. **Source Citations**
   - Always include data source (small text, bottom)
   - Builds credibility

---

### 2.5 MECE Structure Implementation

**What is MECE?**
- **M**utually **E**xclusive: No overlap between categories
- **C**ollectively **E**xhaustive: Nothing important is missing

**Applying MECE to Presentations:**

1. **Structuring Arguments**
   - Each supporting point is distinct
   - All points together cover the complete picture
   - Eliminates redundancy and gaps

2. **MECE Framework Examples:**
   - **Revenue analysis:** By product line, geography, customer segment
   - **Market entry:** Market attractiveness, competitive position, implementation feasibility
   - **Cost reduction:** Fixed costs, variable costs, one-time expenses

3. **Implementation Steps:**
   - Group similar ideas with supporting data
   - Use gap analysis to check for missing elements
   - Organize from most to least impactful

---

### 2.6 Action Title Formulation

**The Action Title Principle:**

Every slide title must be a **complete sentence stating the key takeaway**, not a topic label.

**Weak Titles vs. Action Titles:**

| Weak Title | Action Title |
|------------|--------------|
| "Market Analysis" | "Indonesia represents the highest-ROI expansion opportunity" |
| "Revenue Trends" | "Revenue declined 8% due to premium segment contraction" |
| "Competitive Landscape" | "Two competitors are rapidly gaining share in our core markets" |
| "Customer Segmentation" | "Three segments account for 67% of lifetime value" |

**Writing Effective Action Titles:**

1. **Transform Observations into Insights**
   - Don't describe what data shows
   - Explain what it means

2. **Be Specific with Numbers**
   - "Revenue declined 12% in Q4" vs. "Revenue is declining"
   - Include timeframes and magnitudes

3. **Self-Contained Meaning**
   - Someone should understand the message without reading slide content

4. **Limit Length**
   - One line preferred
   - Two lines maximum
   - If longer, message isn't focused enough

5. **Include the "So What"**
   - State the implication, not just the fact
   - Example: "Customer satisfaction decline puts $12M revenue at risk"

---

### 2.7 The Pyramid Principle

**Developed by Barbara Minto (McKinsey):**

**Structure:**
```
        [CONCLUSION]
       /    |    \
   [Arg1] [Arg2] [Arg3]
     /|\    /|\    /|\
   [Evidence for each argument]
```

**Key Principles:**

1. **Top-Down Communication**
   - Start with the answer/recommendation
   - Then provide supporting arguments
   - End with detailed evidence

2. **Why This Works:**
   - Executives want the answer first
   - Provides reference point for all following information
   - Reduces cognitive load

3. **SCQA Framework for Introduction:**
   - **S**ituation: Current state (uncontroversial)
   - **C**omplication: Problem or opportunity
   - **Q**uestion: What should be done?
   - **A**nswer: Recommendation

**Application to Slide Structure:**
- Slide title = Conclusion
- Bullet points = Supporting arguments
- Sub-bullets = Evidence/data

---

## 3. Technical Approaches for AI Slide Generation

### 3.1 LLM Prompting Strategies

**Multi-Staged Approach (Adobe Research - DocPres):**

Research shows that dividing slide generation into multiple sub-tasks outperforms single-shot prompting:

```
Stage 1: Bird's-Eye View (Hierarchical Summary)
    ↓
Stage 2: Outline Generation (Slide titles/flow)
    ↓
Stage 3: Section Mapping (Connect slides to source)
    ↓
Stage 4: Content Generation (Per-slide bullets)
    ↓
Stage 5: Image Selection (Visual matching)
```

**Benefits:**
- Each stage has limited, focused context
- Reduces hallucinations
- Enables source attribution
- Better narrative flow

**Prompt Engineering Best Practices:**

1. **Role Definition**
   - "Act as a senior strategy consultant..."
   - "You are a presentation expert with 20 years experience..."

2. **Context Provision**
   - Provide document sections relevant to each slide
   - Include previous slides for flow consistency
   - Add audience and objective context

3. **Output Constraints**
   - Max bullet points per slide (typically 3-5)
   - Max words per bullet (typically 10-15)
   - Specific formatting requirements

4. **Chain-of-Thought Prompting**
   - Ask AI to think step-by-step
   - Improves logical consistency

**Example Prompt Structure:**
```
ROLE: Act as a [type of expert]
OBJECTIVE: Create [type of presentation] for [audience]
CONTEXT: [Background information]
CONSTRAINTS:
- Max [X] bullet points per slide
- Max [X] words per bullet
- Use action titles
- Follow MECE structure
OUTPUT FORMAT: [Specific format requirements]
```

---

### 3.2 Layout Selection Algorithms

**Current Approaches:**

1. **Template Matching**
   - Content type detection (text, chart, image, mixed)
   - Match to predefined layout templates
   - Score based on content fit

2. **Constraint-Based Layout**
   - Define design rules as constraints
   - Solve for optimal element positioning
   - Examples: Beautiful.ai Smart Slides

3. **Learning-Based Selection**
   - Train on high-quality presentation datasets
   - Predict optimal layout for given content
   - Reinforcement learning from user choices

**Content-to-Layout Mapping:**

| Content Type | Recommended Layout |
|--------------|-------------------|
| Single chart | Full-slide chart |
| Chart + context | Left text, right chart (40/60) |
| 3-5 key points | Title + 3-5 bullets |
| Process/steps | Horizontal flow diagram |
| Comparison | 2-column or table |
| Timeline | Gantt or horizontal timeline |
| Photo story | Photo grid |

---

### 3.3 Content Structuring Methods

**Document-to-Presentation Pipeline:**

```
Input Document
    ↓
Content Extraction (Text + Images)
    ↓
Hierarchical Summarization
    ↓
Outline Generation (with narrative flow)
    ↓
Slide Content Allocation
    ↓
Visual Element Selection
    ↓
Layout Assignment
    ↓
Final Presentation
```

**Key Algorithms:**

1. **Hierarchical Summarization**
   - Summarize subsections → sections → full document
   - Preserves document structure
   - Enables source attribution

2. **Outline Generation**
   - Use LLM to identify key topics
   - Ensure logical flow (SCQA, chronological, structural)
   - Balance slide distribution

3. **Content Chunking**
   - Split long content into slide-sized pieces
   - Maintain context across slides
   - Identify natural break points

---

### 3.4 Template Matching Systems

**Template Selection Criteria:**

| Criterion | Weight | Measurement |
|-----------|--------|-------------|
| Content type fit | High | Text, chart, image presence |
| Amount of content | High | Word count, data points |
| Visual hierarchy needs | Medium | Importance levels |
| Brand requirements | High | Colors, fonts, logos |
| Audience type | Medium | Executive, technical, external |

**Template Libraries by Category:**

**Consulting/Professional:**
- Title slide (clean, minimal)
- Executive summary (structured text)
- Full-slide chart (data focus)
- Two-column (text + visual)
- Process flow (3-5 steps)
- Framework diagram (matrix, pyramid)

**Creative/Marketing:**
- Hero image with text overlay
- Photo grid/gallery
- Quote/testimonial
- Timeline/milestone
- Comparison slider

**Data-Heavy:**
- Dashboard (multiple metrics)
- Single chart (full focus)
- Data table
- Infographic

---

## 4. Improvement Opportunities

### 4.1 What's Missing from Current AI Tools

**1. True Consulting-Grade Quality**
- No tool consistently produces McKinsey-level structure
- Action titles are often weak or generic
- MECE structuring is not enforced
- Pyramid Principle not implemented

**2. Context Understanding**
- Limited audience awareness
- No understanding of presentation objective
- Can't adapt tone/style to situation
- Missing "pre-wiring" capabilities

**3. Data Visualization Intelligence**
- Poor chart type recommendations
- Limited data-to-insight conversion
- No automatic highlighting of key data points
- Weak source citation handling

**4. Brand Compliance**
- Inconsistent brand adherence
- Limited font customization
- Color palette enforcement is weak
- Template adherence issues

**5. Advanced Content Features**
- No "so what" generation
- Weak insight extraction from data
- No hypothesis testing framework
- Missing appendix/back-up slide handling

---

### 4.2 Common User Complaints

**From Reddit, Trustpilot, and Reviews:**

| Complaint | Frequency | Tools Affected |
|-----------|-----------|----------------|
| "Not consulting-ready" | High | Gamma, Beautiful.ai |
| Poor PowerPoint export | High | Gamma, Tome |
| Generic outputs | High | All tools |
| Limited customization | Medium | Gamma, Beautiful.ai |
| Formatting issues | Medium | Presentations.AI, Gamma |
| Poor customer support | Medium | Presentations.AI, Gamma |
| Brand compliance problems | Medium | All tools |
| Can't handle complex data | Medium | Gamma, Beautiful.ai |
| Limited template selection | Low-Medium | Gamma |
| Aggressive subscription models | Low | Presentations.AI |

**Specific User Quotes:**

> "Tools that build entire decks from one prompt would be great if I were in fourth grade doing a presentation on mitochondria, but not for a consulting deck." - Reddit consultant

> "Gamma is not consulting ready at all." - Consultant review

> "The tooling just isn't there. Most APIs and Python packages can export basic HTML or slides with text boxes, but nothing that fits enterprise-grade design systems." - AI consultant

> "It is not generating pics, does not able to stay with the meaning of presentation, no customer support." - Plus AI review

---

### 4.3 Consultant-Specific Needs Not Being Met

**1. Structured Thinking Frameworks**
- MECE principle enforcement
- Pyramid Principle structure
- Issue tree generation
- Hypothesis-driven analysis

**2. Professional Design Standards**
- Action title generation (not just descriptive)
- Consulting-style layouts
- Proper chart selection
- Executive summary formatting

**3. Content Quality**
- Insight extraction (not just summarization)
- "So what" identification
- Recommendation formulation
- Supporting evidence selection

**4. Workflow Integration**
- Seamless PowerPoint integration (without export issues)
- Slide library/reuse
- Team collaboration with review workflows
- Version control

**5. Data Handling**
- Excel/data import with automatic visualization
- Chart type recommendations based on data
- Source citation management
- Sensitivity analysis handling

**6. Client-Specific Requirements**
- Client brand compliance
- Industry-specific templates
- Confidentiality/security controls
- Appendix/back-up slide generation

---

## 5. Key Takeaways & Recommendations

### 5.1 Product Strategy Recommendations

**1. Differentiate on Consulting Quality**
- Be the first AI tool truly built for consulting standards
- Implement MECE, Pyramid Principle, Action Titles as core features
- Focus on "insight generation" not just "slide generation"

**2. Hybrid Approach**
- Combine Beautiful.ai's design automation with Plus AI's contextual understanding
- Multi-staged LLM pipeline for better quality
- Constraint-based layouts with AI assistance

**3. Native PowerPoint Integration**
- Follow Plus AI's model of native add-ins
- Avoid export quality issues that plague Gamma/Tome
- Maintain full editability in PowerPoint

**4. Structured Content Engine**
- Implement hierarchical content processing (DocPres approach)
- Build MECE checking into the workflow
- Generate "ghost decks" (outlines) before full generation

**5. Consultant-Centric Features**
- Action title generator
- Chart type recommender
- Source citation manager
- Appendix slide handling
- Pre-wiring/feedback collection

### 5.2 Technical Architecture Recommendations

**Multi-Staged Pipeline:**
```
1. Content Ingestion & Analysis
2. Hierarchical Summarization
3. Outline Generation (with MECE validation)
4. Slide Mapping & Content Allocation
5. Layout Selection (template matching)
6. Content Generation (action titles + bullets)
7. Visual Element Selection
8. Brand Compliance Check
9. Export/Integration
```

**Key Technologies:**
- LLM for content generation and structuring
- VLM for image selection and layout
- Constraint solver for layout optimization
- Vector database for template matching
- Rule engine for brand compliance

### 5.3 Competitive Positioning

| Competitor | Their Strength | Our Differentiation |
|------------|----------------|---------------------|
| Gamma | Speed, visual appeal | Consulting quality, PowerPoint integration |
| Beautiful.ai | Design automation | True consulting structure, contextual AI |
| Plus AI | Native integration | Design automation, MECE enforcement |
| Tome | Interactive/web | Traditional slide excellence |

**Unique Value Proposition:**
> "The only AI presentation tool that creates consultant-grade slides with McKinsey-level structure, natively in PowerPoint."

### 5.4 Success Metrics

**Quality Metrics:**
- Action title strength (human rating)
- MECE compliance score
- Chart type appropriateness
- Brand compliance rate

**Efficiency Metrics:**
- Time to first draft
- Time to client-ready deck
- Reduction in formatting time
- Reuse rate of generated slides

**User Satisfaction:**
- Consultant NPS
- Enterprise adoption rate
- Export success rate
- Support ticket volume

---

## Appendix A: Reference Frameworks

### A.1 The Pyramid Principle Structure

```
Executive Summary (Answer)
    ↓
Key Supporting Arguments (MECE)
    ↓
Detailed Evidence (Data, Analysis)
```

### A.2 SCQA Framework

| Element | Purpose | Example |
|---------|---------|---------|
| Situation | Set context | "Your retail division maintains 23% market share" |
| Complication | Create urgency | "Digital competitors captured 12% share in 18 months" |
| Question | Frame the decision | "How can we respond to this threat?" |
| Answer | Provide recommendation | "Implement three-part digital transformation" |

### A.3 Consulting Slide Types Checklist

- [ ] Title slide
- [ ] Executive summary
- [ ] Situation assessment
- [ ] Problem diagnosis
- [ ] Hypothesis tree
- [ ] Data/analysis slide (full chart)
- [ ] Recommendation
- [ ] Implementation plan
- [ ] Risk/mitigation
- [ ] Next steps
- [ ] Appendix/back-up

---

## Document Information

**Research Sources:**
- McKinsey & Company presentation methodology
- Barbara Minto's Pyramid Principle
- Adobe Research DocPres paper (2024)
- User reviews from Reddit, Trustpilot, G2
- Tool documentation from Gamma, Beautiful.ai, Plus AI, Tome
- Data visualization best practices from Datawrapper, Economist, Financial Times

**Last Updated:** February 2026
