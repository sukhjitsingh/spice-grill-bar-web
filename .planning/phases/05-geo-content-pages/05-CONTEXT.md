# Phase 5: GEO Content Pages - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Two new content pages (`/near-grand-canyon/` and `/directions/`) with AI-extractable passage structure targeting Grand Canyon proximity and I-40 navigation queries. Pages must pass Lighthouse CI and Rich Results Test. Cross-linking between pages and homepage required.

</domain>

<decisions>
## Implementation Decisions

### Content tone & voice
- Tone and AEO writing style are Claude's discretion — optimize for AI extraction while maintaining readability
- Route 66 / road-trip identity: mention briefly but don't make it the theme — focus stays on proximity and food
- Voice: mix of third person for factual/extractable paragraphs ("Spice Grill & Bar is 58 miles from...") and first person for softer sections like dish recommendations ("We recommend...")
- Page length: Claude's discretion — optimize for SEO/AEO performance
- Keep content focused on the restaurant — no local landmarks or area tourism beyond the restaurant itself
- CTAs: mobile-first approach, Claude decides what's best for AI engines
- Feature popular/most-ordered items for road-tripper dish recommendations

### Page layout & visual style
- Match homepage visual style: glassmorphism, dark/light sections, brand orange/green/gold accents
- Same full header and footer as homepage for consistent mobile navigation
- Minimal or no images — text-focused pages, keep page weight low and LCP fast
- Hero treatment: Claude's discretion based on performance and AEO (answer-first) needs

### Grand Canyon page (`/near-grand-canyon/`)
- Bold answer-first H1 stating distance and drive time from Grand Canyon South Rim (e.g., "Spice Grill & Bar — 58 Miles from Grand Canyon South Rim")
- Per-city distance facts covering same cities as /directions/: Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman
- Each city distance as standalone extractable paragraph
- Dish recommendations: short list of 3-5 popular items with a one-liner description each
- Operating hours and contact info on page: Claude's discretion based on AEO best practices

### Directions page (`/directions/`)
- Per-city H2 sections for all 7 cities with turn-by-turn summaries emphasizing I-40 Exit 146
- Navigation between 7 city sections: Claude's discretion (anchor links vs. scroll)
- Google Maps embed strategy: Claude's discretion — optimize for LCP performance vs. relevance
- Turn-by-turn detail level: Claude's discretion for AEO and usability
- Drive time placement: Claude's discretion for maximum AEO extraction value
- Address block with NAP data in each section

### Claude's Discretion
- Overall content tone balance (warm vs. informational)
- AEO writing style for extractable paragraphs
- Hero section treatment (image hero vs. minimal header)
- Page content length
- CTA placement and style (optimized for mobile and AI engines)
- City section navigation pattern on /directions/
- Google Maps embed approach (single vs. per-city, placement)
- Turn-by-turn summary depth
- Drive time display placement (in headings vs. in text)
- Whether to include hours/contact on /near-grand-canyon/

</decisions>

<specifics>
## Specific Ideas

- Mobile-first approach is the priority — both pages should work great on phones first
- Popular dishes should be featured (not quick bites or categorized) — straightforward list with brief descriptions
- H1 on Grand Canyon page should lead with the answer immediately (bold, answer-first pattern)
- Both pages use same city list for consistency

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-geo-content-pages*
*Context gathered: 2026-02-21*
