# SlideTheory - AI-Powered Slide Generation

## Project Overview

SlideTheory is a Next.js 14 web application that enables strategy consultants to generate McKinsey/BCG/Bain-quality presentation slides in under 30 seconds. Users provide context (research notes, data, key messages) through a structured input form. An LLM pipeline distills that context into a structured slide blueprint, selects the appropriate slide archetype, and renders a polished slide as a styled React component. Users can then copy the slide to clipboard or export it as a `.pptx` file.

### Core Value Proposition

- Eliminates blank-screen paralysis for consultants who know their content but struggle with slide design
- Produces strategy-consulting-grade output: structured frameworks, clean typography, data visualization
- Speed: context in, polished slide out, in under 30 seconds
- One slide at a time (not full decks) — fits naturally into existing consultant workflows

### Target User

Strategy consultants at firms like McKinsey, BCG, Bain, Deloitte S&O, and boutique strategy shops. These users make 10-50+ slides per week, often under time pressure, and value clean, structured, executive-ready output above all else.

### Key Technical Decision: HTML Rendering over Image Generation

Rather than using image generation AI to create slide visuals, SlideTheory renders slides as styled React/HTML components. This is a critical architectural decision because:

- **Text precision**: Image gen models frequently misspell words, misplace text, or produce unreadable type at small sizes. For McKinsey-style slides where every word matters, this is unacceptable.
- **Layout control**: HTML/CSS gives pixel-perfect control over grids, tables, frameworks, and whitespace — the hallmarks of strategy consulting slides.
- **Export fidelity**: HTML components can be reliably converted to PPTX (via pptxgenjs) or copied as images (via html2canvas) without the distortion that comes from image-to-image conversion.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, Framer Motion (animations) |
| **Backend** | Next.js API Routes (Node.js runtime) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Email/Password + OAuth ready) |
| **AI/LLM** | OpenAI GPT-4o (primary), Google Gemini 2.0 Flash (fallback) |
| **Export** | pptxgenjs (PPTX export), html2canvas (clipboard image) |
| **Charts** | Recharts |
| **Validation** | Zod |
| **File Parsing** | PapaParse (CSV), XLSX (Excel) |
| **Notifications** | react-hot-toast |

---

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/callback/  # OAuth callback handler
│   │   │   ├── confirm-test-user/  # Test user confirmation endpoint
│   │   │   ├── export/pptx/    # PPTX export endpoint
│   │   │   ├── generate-slide/ # Main slide generation endpoint
│   │   │   └── leads/capture/  # Lead capture for marketing
│   │   ├── blog/               # Blog listing and posts
│   │   ├── dashboard/          # Main slide generation interface
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── forgot-password/    # Password reset request
│   │   ├── reset-password/     # Password reset confirmation
│   │   ├── onboarding/         # User onboarding flow
│   │   ├── resources/          # Resource downloads page
│   │   ├── security/           # Security settings page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── blog/               # Blog components (BlogCard, EmailGateModal, etc.)
│   │   ├── marketing/          # Landing page sections (Hero, Features, Pricing, etc.)
│   │   ├── onboarding/         # Onboarding components
│   │   ├── templates/          # Slide template components (10 templates)
│   │   ├── ExportButtons.tsx   # Copy/PPTX export buttons
│   │   ├── InputPanel.tsx      # Main input form component
│   │   ├── Logo.tsx            # Logo component
│   │   ├── SlideHistory.tsx    # Slide history sidebar
│   │   └── SlidePreview.tsx    # Slide preview wrapper
│   ├── content/
│   │   ├── blog/               # Blog post JSON files
│   │   └── resources/          # Resource JSON files
│   ├── lib/
│   │   ├── llm/                # LLM pipeline logic
│   │   │   ├── archetypeClassifier.ts  # Archetype classification logic
│   │   │   ├── archetypes.ts   # 18 slide archetype definitions
│   │   │   ├── contentAnalyzer.ts      # Stage 1: Content analysis with OpenAI/Gemini
│   │   │   ├── layoutSelector.ts       # Phase 2: template selection & props mapping (legacy)
│   │   │   ├── pipeline.ts     # Main 5-stage orchestration
│   │   │   ├── prompts.ts      # System prompts + few-shot examples (legacy)
│   │   │   ├── qualityAssurance.ts     # Stage 5: QA validation
│   │   │   └── structurer.ts   # Legacy content structuring
│   │   ├── supabase/           # Supabase client configurations
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── security/           # Data privacy and security module
│   │   │   ├── anonymizer.ts   # PII anonymization
│   │   │   ├── dataLifecycle.ts # Data retention and deletion
│   │   │   ├── piiDetector.ts  # Entity and PII detection
│   │   │   └── index.ts        # Security module exports
│   │   ├── supabase.ts         # Legacy supabase client + lead capture
│   │   ├── content.ts          # Content loading utilities for blog/resources
│   │   ├── email-service.ts    # Email service integration
│   │   ├── export/             # Export functionality
│   │   │   ├── clipboard.ts    # html2canvas clipboard copy
│   │   │   ├── pptxExport.ts   # Client-side PPTX export
│   │   │   └── pptxGenerator.ts # Server-side PPTX generation
│   │   ├── parsers/            # File parsers (CSV, Excel, JSON)
│   │   │   └── index.ts
│   │   └── rateLimit.ts        # Rate limiting logic (5/day free tier)
│   ├── types/
│   │   ├── slide.ts            # SlideBlueprint, SlideContent, TemplateProps types
│   │   └── input.ts            # Form input types
│   └── middleware.ts           # Next.js middleware for auth
├── supabase/
│   └── migrations/             # SQL migrations
│       ├── 001_initial_schema.sql
│       ├── 002_create_leads_table.sql
│       └── 003_add_test_user.sql
├── docs/
│   └── SECURITY_ARCHITECTURE.md # Security architecture documentation
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── .eslintrc.json              # ESLint configuration
```

---

## Build and Development Commands

```bash
# Navigate to the app directory
cd my-app

# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Environment Variables

Create `.env.local` in the `my-app/` directory:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# LLM APIs (Required)
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (Optional - for lead capture)
EMAIL_PROVIDER=sendgrid  # or 'mailchimp' or 'none'
SENDGRID_API_KEY=...
FROM_EMAIL=hello@slidetheory.com
FROM_NAME=SlideTheory
```

---

## Database Schema

### Tables

#### `profiles`

Extends Supabase auth.users with app-specific data.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, references auth.users(id) ON DELETE CASCADE |
| email | TEXT | NOT NULL |
| display_name | TEXT | nullable |
| created_at | TIMESTAMPTZ | default now() |
| daily_generation_count | INTEGER | default 0 |
| last_generation_date | DATE | nullable |
| tier | TEXT | default 'free' (future: 'pro', 'enterprise', 'test') |

#### `slides`

Stores every generated slide for analytics, regeneration, and history.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | FK → profiles(id), NOT NULL |
| context_input | TEXT | the raw context dump |
| message_input | TEXT | the takeaway message |
| data_input | TEXT | nullable (pasted data/metrics) |
| file_input_url | TEXT | nullable (URL to uploaded file in storage) |
| slide_type | TEXT | auto, executive_summary, etc. |
| target_audience | TEXT | c_suite, pe_investors, external_client, internal_team |
| density_mode | TEXT | presentation, read_style |
| llm_blueprint | JSONB | structured output from Phase 1 LLM |
| selected_template | TEXT | which archetype/template was chosen |
| template_props | JSONB | final props passed to React template |
| feedback | TEXT | nullable ('thumbs_up', 'thumbs_down') |
| regeneration_count | INTEGER | default 0 |
| llm_model_used | TEXT | e.g., 'gpt-4o', 'gemini-2.0-flash-exp' |
| generation_time_ms | INTEGER | |
| created_at | TIMESTAMPTZ | default now() |

#### `leads`

Stores email subscribers and resource downloaders for marketing.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| email | TEXT | NOT NULL, unique |
| name | TEXT | nullable |
| company | TEXT | nullable |
| source | TEXT | NOT NULL |
| resource_downloaded | TEXT | nullable |
| utm_source | TEXT | nullable |
| utm_medium | TEXT | nullable |
| utm_campaign | TEXT | nullable |
| subscribed | BOOLEAN | default true |
| created_at | TIMESTAMPTZ | default now() |
| updated_at | TIMESTAMPTZ | default now() |

### Row Level Security (RLS)

- **profiles**: Users can only read/update their own profile
- **slides**: Users can only access their own slides
- **leads**: Only service role can access (no direct user access)

---

## Code Style Guidelines

### TypeScript

- Use strict TypeScript with explicit types
- Prefer interfaces over type aliases for object shapes
- Use union types for enums (e.g., `type SlideType = 'auto' | 'executive_summary'...`)
- Path alias `@/*` maps to `./src/*`

### React Components

- Use functional components with hooks
- `'use client'` directive for client components (forms, animations, dropzones)
- Server components by default (Next.js App Router)
- Props interfaces defined inline or in types file

### Naming Conventions

- PascalCase for components, interfaces, types
- camelCase for variables, functions, properties
- UPPER_SNAKE_CASE for constants
- kebab-case for file names

### Tailwind CSS

- Use Tailwind utility classes exclusively (no custom CSS except in globals.css)
- Custom colors defined in `tailwind.config.js`:
  - Primary: Teal palette (`teal-500` = `#14B8A6`)
  - Accent: Orange palette (`orange-500` = `#F97316`)
  - Neutrals: Slate palette
  - Legacy: `navy` (`#0F172A`), `accent-teal` (`#0D9488`)

### Animation

- Use Framer Motion for animations (`motion.div`, variants, etc.)
- Predefined animations in `tailwind.config.js`:
  - `animate-fade-in`
  - `animate-slide-up`
  - `animate-slide-up-delayed`

---

## API Routes

### POST `/api/generate-slide`

Main endpoint for slide generation. Protected by auth and rate limiting.

**Request Body:**
```typescript
{
  text: string;           // Context/background info
  message: string;        // Key takeaway message
  data?: string;          // Optional structured data
  fileContent?: string;   // Optional parsed file content
  slideType: SlideType;   // 'auto' or specific archetype
  audience: TargetAudience;
  density: DensityMode;
  isRegeneration?: boolean;
}
```

**Response:**
```typescript
{
  slideId: string;
  archetypeId: ArchetypeId;
  templateId: string;     // For backward compatibility
  props: TemplateProps;
  structured: StructuredContent;
  blueprint: SlideBlueprint;  // For backward compatibility
  generationTimeMs: number;
  remainingGenerations: number;
  modelUsed: string;
  qaScore: number;
  qaPassed: boolean;
  qaRecommendations?: string[];
}
```

### GET `/api/generate-slide`

Retrieves slide history for the authenticated user.

**Query Parameters:**
- `limit`: Number of slides to return (default: 10)
- `offset`: Pagination offset (default: 0)

### POST `/api/leads/capture`

Captures lead information from email gates on resources.

**Request Body:**
```typescript
{
  email: string;
  name?: string;
  company?: string;
  source: string;
  resource_downloaded?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  send_welcome?: boolean;
  resource_title?: string;
}
```

### POST `/api/export/pptx`

Generates PPTX file from slide data.

### Auth Callback: `/api/auth/callback`

Handles OAuth callbacks from Supabase Auth.

---

## LLM Pipeline Architecture

The slide generation uses a 5-stage pipeline orchestrated in `lib/llm/pipeline.ts`:

### Stage 1: Content Analysis (`lib/llm/contentAnalyzer.ts`)

**Model:** GPT-4o with JSON mode (or Gemini 2.0 Flash as fallback)

**Purpose:** Parse unstructured user input into a structured `StructuredContent` object.

**Key Principles:**
- **Pyramid Principle**: Main Point → Supporting Arguments → Data
- **Action Titles**: Title must follow `[WHAT] + [SO WHAT] + [NOW WHAT]` formula
- **MECE**: Mutually Exclusive, Collectively Exhaustive structure
- Maximum 4 logical groups, 5 bullets per group

**Output:** `StructuredContent` with:
- `coreMessage`: The single most important insight
- `contentType`: classification (comparison, trend, process, etc.)
- `dataPoints`: Array of metrics with context
- `logicalGroups`: MECE-structured bullet groups
- `recommendedArchetype`: Suggested slide type
- `complexityScore`: 1-5 rating
- `title`: Action-oriented slide title

### Stage 2: Archetype Classification (`lib/llm/archetypeClassifier.ts`)

**Purpose:** Map `StructuredContent` to exact props for React slide template components.

**Logic:**
- If `slideType` is "auto", select best archetype based on content structure
- If `slideType` is specified, use that archetype
- Transform `contentBlocks` into template-specific props

### Stage 3: Content Validation

Pre-flight check for overflow and quality issues using `validateContentFit()`.

### Stage 5: Quality Assurance (`lib/llm/qualityAssurance.ts`)

**Purpose:** Validate generated slides against consulting quality standards.

**Checks:**
- Title quality (length, insight, action verbs, numbers)
- Content structure (group count, bullets per group, MECE)
- Archetype fit (complexity match, data sufficiency)
- Data integrity (source attribution, formatting consistency)

**Output:** `QAReport` with score (0-100), pass/fail status, and recommendations.

---

## Slide Archetypes (18 Types)

All archetypes defined in `lib/llm/archetypes.ts`:

### Insight & Summary
1. **executive_summary** — Single key finding with 3-4 supporting evidence points
2. **situation_complication_resolution** — SCR framework for problem framing

### Comparison & Analysis
3. **two_by_two_matrix** — 2x2 matrix for portfolio prioritization
4. **comparison_table** — Side-by-side option evaluation
5. **before_after** — Current vs future state transformation

### Data & Metrics
6. **kpi_dashboard** — 3-5 large metric callouts
7. **waterfall_chart** — Financial bridge/variance analysis
8. **trend_line** — Time-series data
9. **stacked_bar** — Composition breakdown

### Process & Flow
10. **process_flow** — Sequential steps (3-6)
11. **timeline_swimlane** — Multi-workstream roadmap
12. **decision_tree** — Branching logic/scenarios

### Structure & Hierarchy
13. **issue_tree** — Problem decomposition (MECE)
14. **three_pillar** — Three parallel themes
15. **grid_cards** — 2x2 or 2x3 capability grid

### Market & Financial
16. **market_sizing** — TAM/SAM/SOM analysis
17. **competitive_landscape** — Positioning map

### Navigation
18. **agenda_divider** — Section divider or TOC

---

## Slide Templates

All templates render at 16:9 aspect ratio (1920×1080 reference) with these design principles:
- **Typography:** Inter font family; weights 400, 500, 600, 700, 800
- **Color palette:** Navy `#0F172A`, Slate grays, Teal `#0D9488`, Orange `#F97316`
- **Whitespace:** Generous padding, clear visual hierarchy
- **Frameworks:** Bold labels, supporting text, data-driven insights

### Available Templates (in `components/templates/`)

1. **ExecutiveSummary** — Opening/closing section overviews with 2-4 key points
2. **HorizontalFlow** — Process, timeline, or sequential steps (3-6 steps)
3. **TwoByTwoMatrix** — 2×2 grids (e.g., Impact vs. Effort)
4. **ComparisonTable** — Side-by-side comparison of 2-4 options
5. **DataChart** — Bar/line charts with 1 key takeaway
6. **MultiMetric** — Dashboard-style with 3-6 key numbers
7. **IssueTree** — Hierarchical breakdown (problem → causes)
8. **Timeline** — Calendar/time-based view with milestones
9. **GraphChart** — Node/edge relationship diagrams
10. **General** — Flexible fallback for unstructured content

---

## Security & Data Privacy

### PII Detection and Anonymization (`lib/security/`)

The application includes a comprehensive security module:

**PII Detection (`piiDetector.ts`):**
- Detects company names, person names, emails, phones, financial figures
- Uses regex patterns and known entity dictionaries
- Calculates risk scores (0-100)

**Anonymization (`anonymizer.ts`):**
- Replaces sensitive entities with placeholders
- Preserves financial figures (essential for consulting slides)
- Configurable anonymization levels: 'light', 'medium', 'strict'

**Data Lifecycle (`dataLifecycle.ts`):**
- Automatic data deletion scheduling
- Configurable retention policies: 'immediate', '5minutes', '1hour', '1day', '30days'

### Security Principles

1. **Privacy by Design**: Data minimization, purpose limitation, short retention
2. **Defense in Depth**: Multiple layers of protection from ingestion to storage
3. **Zero Data Retention (ZDR)**: No data retained by LLM providers

For detailed security architecture, see `docs/SECURITY_ARCHITECTURE.md`.

---

## Rate Limiting

Free tier: 5 slides per day per user (resets at midnight UTC, based on `last_generation_date`).

Test users (emails: `test@slidetheory.com`, `admin@slidetheory.com`, `demo@slidetheory.com`) bypass rate limits.

**Implementation:** `lib/rateLimit.ts`

```typescript
// Check logic:
if (profile.last_generation_date !== today) {
    profile.daily_generation_count = 0;
    profile.last_generation_date = today;
}

if (profile.daily_generation_count >= 5) {
    throw new Error("Daily limit reached");
}
```

---

## File Upload & Parsing

Supports CSV, Excel (.xlsx, .xls), and JSON files up to 5MB.

**Implementation:** `lib/parsers/index.ts`

- CSV: Parsed with PapaParse
- Excel: Parsed with XLSX library
- JSON: Native JSON.parse with array/object handling

Parsed data is formatted as tab-separated values for LLM consumption (limited to first 50 rows).

---

## Export Functionality

### Clipboard Copy (`lib/export/clipboard.ts`)

Uses html2canvas to render the slide DOM element to a canvas, then copies as PNG to clipboard.

### PPTX Export (`lib/export/pptxExport.ts`, `lib/export/pptxGenerator.ts`)

Uses pptxgenjs to create a PowerPoint file. Dynamically imports on client-side only to avoid SSR issues.

---

## Blog & Resources System

Content is stored as JSON files in `src/content/blog/` and `src/content/resources/`.

**Blog Post JSON Structure:**
```json
{
  "title": "Post Title",
  "excerpt": "Brief description",
  "content": "<p>HTML content...</p>",
  "author": { "name": "Author", "role": "Role" },
  "publishedAt": "2024-01-15",
  "readTime": "5 min read",
  "category": "Category",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "coverImage": "/images/blog/cover.jpg"
}
```

**Resource JSON Structure:**
```json
{
  "title": "Resource Title",
  "description": "Description",
  "type": "pdf|template|checklist|cheatsheet",
  "category": "Category",
  "downloadUrl": "/downloads/file.pdf",
  "fileSize": "2 MB",
  "pages": 10,
  "requiresEmail": true,
  "featured": false
}
```

**Lead Capture Flow:**
1. User clicks download on a resource requiring email
2. `EmailGateModal` appears
3. User submits email, name, company
4. API captures lead to Supabase `leads` table
5. User subscribed to email list (async)
6. Welcome email sent (if resource download)
7. File download begins

---

## Testing Strategy

Currently, the project relies on manual testing. No automated test suite is configured. To add testing:

```bash
# Install testing libraries
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Recommended test structure:
- Unit tests for `lib/llm/contentAnalyzer.ts` and `lib/llm/archetypeClassifier.ts`
- Component tests for slide templates
- Integration tests for `/api/generate-slide`
- E2E tests for critical user flows (signup → generate slide → export)

---

## Deployment

### Vercel Configuration

- **Framework:** Next.js (auto-detected by Vercel)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Environment Variables:** Set all env vars in Vercel dashboard

### Supabase Setup

1. Create project in Supabase dashboard
2. Run SQL migrations in Supabase SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_create_leads_table.sql`
   - `supabase/migrations/003_add_test_user.sql`
3. Enable Email Auth in Supabase Auth settings
4. Configure email templates for auth emails
5. Enable RLS on all tables

---

## Key Type Definitions

### Slide Types
```typescript
type ArchetypeId = 
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
```

### Target Audiences
```typescript
type TargetAudience = 
  | 'c_suite'
  | 'pe_investors'
  | 'external_client'
  | 'internal_team';
```

### Density Modes
```typescript
type DensityMode = 'presentation' | 'read_style';
```

---

## Important Notes for AI Coding Agents

1. **This project specification lives in `AGENTS.md`** — refer to it for architecture, patterns, and conventions.

2. **The LLM system prompts** in `lib/llm/contentAnalyzer.ts` include critical instructions for output format. Do not modify them without understanding the downstream parsing logic.

3. **All slide templates must maintain exact 16:9 aspect ratio** for consistent export behavior. Use `aspect-video` Tailwind class.

4. **The fallback LLM (Gemini)** should only be used when OpenAI calls fail — maintain GPT-4o as primary.

5. **When implementing new slide templates**, follow the existing component pattern:
   - Accept typed props interface extending `BaseTemplateProps`
   - Render with Tailwind classes
   - Support both `presentation` and `read_style` density modes
   - Use Framer Motion for entrance animations
   - Include footnote/source display at bottom
   - Export archetype definition in `lib/llm/archetypes.ts`

6. **Path aliases:** Use `@/` prefix for imports from `src/` (e.g., `import { Button } from '@/components/Button'`)

7. **Client vs Server components:**
   - Add `'use client'` at the top of files using:
     - React hooks (useState, useEffect, etc.)
     - Browser APIs (window, document, localStorage)
     - Framer Motion components
     - Event handlers (onClick, onSubmit, etc.)
     - react-dropzone for file uploads
   - Keep Server Components (default) for:
     - Data fetching
     - Static content
     - SEO-critical pages

8. **Environment variables:**
   - Client-side: Must be prefixed with `NEXT_PUBLIC_`
   - Server-side: No prefix required
   - Never commit `.env.local` to git

9. **Database changes:** Always update both:
   - The TypeScript types in `src/types/`
   - The SQL migration files in `supabase/migrations/`

10. **MECE Principle:** When structuring content, ensure logical groups are:
    - **M**utually **E**xclusive (no overlap between groups)
    - **C**ollectively **E**xhaustive (no gaps, covers all content)
    - Target 3-4 groups maximum
    - Maximum 5 bullets per group

11. **Action Title Formula:** All slide titles should follow:
    `[WHAT happened] + [SO WHAT it means] + [NOW WHAT to do]`
    Example: "Revenue declined 12% in Q3 driven by mid-market churn, requiring immediate retention intervention"

12. **Security considerations:**
    - Always use the security module for PII detection before sending data to LLMs
    - Respect data retention policies
    - Never log sensitive user data
    - API keys must remain server-side only
