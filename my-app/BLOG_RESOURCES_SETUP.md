# Blog & Resources Infrastructure

This document outlines the blog and resources section infrastructure built for SlideTheory's SEO and lead generation strategy.

## 📁 Created Files

### 1. Blog System

**Pages:**
- `/src/app/blog/page.tsx` - Blog listing page with SEO optimization
- `/src/app/blog/[slug]/page.tsx` - Individual blog post page with table of contents

**Content:**
- `/src/content/blog/action-titles-mckinsey.json` - "How to Write Action Titles Like McKinsey"
- `/src/content/blog/pyramid-principle-explained.json` - "The Pyramid Principle Explained"
- `/src/content/blog/slide-mistakes-credibility.json` - "5 Slide Mistakes That Destroy Your Credibility"

### 2. Resources Section

**Pages:**
- `/src/app/resources/page.tsx` - Resources listing page with lead capture

**Content:**
- `/src/content/resources/mckinsey-slide-templates.json` - Template library download
- `/src/content/resources/consulting-slide-checklist.json` - Slide checklist download
- `/src/content/resources/action-title-formula.json` - Cheat sheet download

### 3. Components

**Blog Components:**
- `/src/components/blog/EmailGateModal.tsx` - Email capture modal for downloads
- `/src/components/blog/BlogCard.tsx` - Blog post preview card
- `/src/components/blog/ResourceCard.tsx` - Resource download card
- `/src/components/blog/TableOfContents.tsx` - Sticky TOC for blog posts

### 4. Backend Infrastructure

**Libraries:**
- `/src/lib/supabase.ts` - Supabase client and lead capture functions
- `/src/lib/content.ts` - Content loading utilities and SEO helpers
- `/src/lib/email-service.ts` - Email service integration (SendGrid/Mailchimp)

**API:**
- `/src/app/api/leads/capture/route.ts` - Lead capture API endpoint

**Database:**
- `/supabase/migrations/002_create_leads_table.sql` - Leads table schema

### 5. Updated Files

- `/src/components/marketing/Navbar.tsx` - Added Blog & Resources links
- `/src/components/marketing/Footer.tsx` - Added resources section
- `/tailwind.config.js` - Added typography plugin

## 🎨 Design System

**Colors:**
- Primary: Teal (`#0D9488`)
- Accent: Orange (`#F97316`)
- Neutrals: Slate palette

**Typography:**
- Font: Inter
- Prose styling for blog content via `@tailwindcss/typography`

## 🔐 Lead Capture Flow

1. User clicks download on a resource
2. EmailGateModal appears (if resource requires email)
3. User submits email, name, and company
4. API captures lead to Supabase `leads` table
5. User is subscribed to email list (SendGrid/Mailchimp)
6. Welcome email is sent with download link
7. File download begins

## 📝 Adding New Content

### New Blog Post

1. Create a JSON file in `/src/content/blog/{slug}.json`:
```json
{
  "title": "Post Title",
  "excerpt": "Brief description",
  "content": "<p>HTML content...</p>",
  "author": { "name": "Author Name", "role": "Role" },
  "publishedAt": "2024-01-15",
  "readTime": "5 min read",
  "category": "Category",
  "tags": ["tag1", "tag2"],
  "featured": false
}
```

2. Rebuild the site to generate static pages

### New Resource

1. Create a JSON file in `/src/content/resources/{slug}.json`:
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

2. Upload actual file to `/public/downloads/`

## 🔧 Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Email Provider (sendgrid|mailchimp|none)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key_here

# Or for Mailchimp
MAILCHIMP_API_KEY=your_key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id

# From address
FROM_EMAIL=hello@slidetheory.com
FROM_NAME=SlideTheory
```

### SEO

Each page includes:
- Meta title & description
- OpenGraph tags
- Twitter Cards
- Structured data (JSON-LD)
- Canonical URLs

## 🚀 Next Steps

1. **Apply Supabase Migration:**
   ```bash
   npx supabase db push
   ```

2. **Add Download Files:**
   - Create `/public/downloads/` directory
   - Add actual PDF/template files referenced in resources

3. **Configure Email Service:**
   - Uncomment and configure SendGrid or Mailchimp in `/src/lib/email-service.ts`
   - Add API keys to environment variables

4. **Add Images:**
   - Blog cover images: `/public/images/blog/`
   - Resource thumbnails: `/public/images/resources/`

5. **Set Up RSS Feed:** (Optional)
   - Create `/app/rss.xml/route.ts` for RSS feed generation

6. **Analytics:**
   - Add conversion tracking for lead captures
   - Track resource downloads
   - Monitor blog post engagement

## 📊 Lead Schema

The `leads` table in Supabase captures:
- Email (unique)
- Name & Company
- Source (e.g., "resource_download", "blog_newsletter")
- Resource downloaded
- UTM parameters
- Subscription status
- Timestamps
