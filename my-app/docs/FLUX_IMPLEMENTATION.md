# Flux 2.0 Implementation Guide

## Overview

This document describes the Flux 2.0 image generation system for SlideTheory - a parallel implementation to the existing HTML-based slide generation.

**Status:** Internal A/B Testing Only  
**Access:** Direct URL only (`/flux-dashboard`) - not linked from main UI

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUX 2.0 PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │ User Input   │───▶│ LLM Analysis │───▶│ Archetype    │              │
│  │              │    │ (OpenAI/Gem) │    │ Selection    │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                                           │                   │
│         │                                           ▼                   │
│         │                                    ┌──────────────┐          │
│         │                                    │ Prompt Build │          │
│         │                                    │ (Archetype   │          │
│         │                                    │  Config)     │          │
│         │                                    └──────────────┘          │
│         │                                           │                   │
│         ▼                                           ▼                   │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │              Flux Image Generation                        │          │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │          │
│  │  │Replicate│  │ Fal.ai  │  │Together │  │  BFL    │     │          │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │          │
│  └──────────────────────────────────────────────────────────┘          │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │                    Output: AI Image                       │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Parallel System (Not Replacement)
- HTML generation remains the primary/default system
- Flux is for internal A/B testing only
- Both systems share the same LLM analysis and archetype classification

### 2. Archetype-Driven Visuals
- No user-selected "styles" (McKinsey/BCG/Bain/Modern)
- Each archetype has predefined visual configuration
- Consistent professional consulting aesthetic

### 3. Robust Error Handling
- Automatic retries with exponential backoff
- Provider-specific timeout handling
- Comprehensive logging for debugging

---

## File Structure

```
my-app/src/lib/flux/
├── index.ts              # Public exports
├── types.ts              # TypeScript types & archetype configs
├── config.ts             # Configuration validation & provider settings
├── promptBuilder.ts      # Prompt construction from content
├── imageGenerator.ts     # Provider integrations with retries
├── pipeline.ts           # Orchestration layer
└── export.ts             # Export utilities (PPTX, PNG)

my-app/src/app/
├── flux-dashboard/
│   └── page.tsx          # Flux UI (internal testing only)
└── api/flux-generate/
    └── route.ts          # API endpoint
```

---

## Configuration

### Environment Variables

```bash
# Required
FLUX_PROVIDER=replicate    # or: fal, together, bfl
FLUX_API_KEY=your_key_here

# Optional
FLUX_MODEL=black-forest-labs/flux-schnell
```

### Provider Comparison

| Provider | Speed | Quality | Pricing | Best For |
|----------|-------|---------|---------|----------|
| **Replicate** | Medium | Good | Per-image | Beginners, reliability |
| **Fal.ai** | Fast | Good | Per-image | High volume, speed |
| **Together** | Medium | Good | Per-image | Competitive pricing |
| **BFL** | Slow | Best | Per-image | Maximum quality |

### Model Recommendations

| Model | Time | Use Case |
|-------|------|----------|
| flux-schnell | ~2s | Testing, prototyping |
| flux-dev | ~10s | Balanced quality/speed |
| flux-pro | ~30s | Production, best quality |

---

## A/B Testing Protocol

### 1. Setup
```bash
# Add to .env.local
FLUX_PROVIDER=replicate
FLUX_API_KEY=r8_your_key_here
FLUX_MODEL=black-forest-labs/flux-dev
```

### 2. Test Process

**Step 1:** Generate with HTML
- Go to `/dashboard`
- Enter context and message
- Generate slide
- Evaluate: Text accuracy, layout, editability

**Step 2:** Generate with Flux
- Go to `/flux-dashboard` (direct URL)
- Enter **same inputs**
- Generate slide
- Evaluate: Visual appeal, text rendering, overall quality

**Step 3:** Compare
- Side-by-side comparison
- Document pros/cons
- Decide: Keep HTML, improve Flux, or migrate?

### 3. Evaluation Criteria

| Criteria | HTML | Flux |
|----------|------|------|
| Text Accuracy | ✅ Perfect | ⚠️ May have errors |
| Editability | ✅ Full | ❌ None (image) |
| Visual Appeal | ⚠️ Good | ✅ Potentially better |
| Export Options | ✅ PPTX | ⚠️ PNG only |
| Generation Speed | ✅ Fast | ⚠️ 2-30s |
| Consistency | ✅ High | ⚠️ Variable |

---

## Known Limitations

### Text Rendering
- Flux may misspell words or render text incorrectly
- Numbers and metrics may be inaccurate
- This is a fundamental limitation of image generation models

### Consistency
- Same inputs may produce different outputs
- Layouts may vary between generations
- Not suitable for brand-critical content

### Export
- Only PNG download available
- PPTX export is image-based (not editable)
- No copy-to-clipboard (would require additional processing)

---

## Error Handling

### Retry Logic
- Automatic retries for transient errors
- Exponential backoff: 1s, 2s, 4s
- Provider-specific max attempts (2-3)

### Error Types

| Error | Cause | Action |
|-------|-------|--------|
| `CONFIG_INVALID` | Missing/wrong env vars | Check configuration |
| `TIMEOUT` | Generation too slow | Try faster model |
| `API_ERROR` | Provider issue | Retry or change provider |
| `RATE_LIMITED` | Too many requests | Wait and retry |

---

## API Reference

### POST /api/flux-generate

**Request:**
```json
{
  "text": "Background context...",
  "message": "Key takeaway...",
  "data": "Optional metrics...",
  "slideType": "auto",
  "audience": "c_suite",
  "density": "presentation"
}
```

**Response:**
```json
{
  "success": true,
  "slideId": "flux_abc123",
  "imageUrl": "https://...",
  "archetypeId": "executive_summary",
  "generationTimeMs": 12345,
  "modelUsed": "replicate:flux-dev"
}
```

### GET /api/flux-generate

Returns configuration status (useful for health checks).

---

## Future Improvements

### Potential Enhancements
1. **Multi-provider fallback** - Try another provider if one fails
2. **Caching** - Store generated images to avoid regeneration
3. **Batch generation** - Generate multiple variations at once
4. **Feedback loop** - User thumbs up/down to improve prompts
5. **Custom training** - Fine-tune on consulting slide dataset

### Migration Path
If Flux proves superior:
1. Gradually migrate users from HTML to Flux
2. Add editing capabilities (inpainting, etc.)
3. Improve text accuracy through prompt engineering
4. Eventually deprecate HTML templates

---

## Troubleshooting

### "Flux not configured" error
```bash
# Check environment variables
echo $FLUX_PROVIDER   # Should output: replicate
echo $FLUX_API_KEY    # Should output your key

# Test configuration
curl /api/flux-generate
```

### Slow generation
- Switch to `flux-schnell` model
- Try Fal.ai provider (typically fastest)
- Check provider status page

### Poor image quality
- Upgrade to `flux-pro` model
- Try BFL provider (official, highest quality)
- Review archetype config for better prompts

### Text rendering issues
- This is expected behavior
- Consider HTML generation for text-critical slides
- Flux is better for visual/layout-focused slides

---

## Security Notes

1. **API Keys** - Never commit to git, use environment variables
2. **Rate Limiting** - Same as HTML generation (5/day for free tier)
3. **Data Privacy** - Images may pass through provider infrastructure
4. **Logging** - Prompts logged for debugging (truncated)

---

## Contact

For issues or questions about Flux implementation:
- Check provider documentation
- Review error logs in server console
- Compare with HTML generation output

---

*Last updated: 2024*
