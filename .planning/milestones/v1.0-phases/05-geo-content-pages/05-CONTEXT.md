# Phase 5: GEO Content Pages - Context

**Gathered:** 2026-02-21
**Updated:** 2026-02-21 (GEO/AEO marketing audit incorporated)
**Status:** Ready for planning

<domain>
## Phase Boundary

Two new content pages (`/near-grand-canyon/` and `/directions/`) with AI-extractable passage structure targeting Grand Canyon proximity and I-40 navigation queries. Pages must pass Lighthouse CI and Rich Results Test. Cross-linking between pages and homepage required.

Additionally: fix llms.txt errors and add new page URLs to it, since llms.txt is the AI crawler entry point.

</domain>

<decisions>
## Implementation Decisions

### Content tone & voice
- Tone and AEO writing style are Claude's discretion — optimize for AI extraction while maintaining readability
- Route 66 / road-trip identity: mention briefly but don't make it the theme — focus stays on proximity and food
- Voice: mix of third person for factual/extractable paragraphs ("Spice Grill & Bar is X miles from...") and first person for softer sections like dish recommendations ("We recommend...")
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
- Bold answer-first H1 stating distance and drive time from Grand Canyon South Rim
- Per-city distance facts covering same cities as /directions/: Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman
- Each city distance as standalone extractable `<p>` paragraph (NOT list items)
- Dish recommendations: short list of 3-5 popular items with a one-liner description each
- Operating hours as standalone voice-extractable `<p>` paragraph (e.g., "Spice Grill & Bar is open Tuesday through Thursday from 8 AM to 9 PM, and Friday through Sunday from 8 AM to 10 PM. The restaurant is closed on Mondays.")
- Include a "why stop here" value proposition paragraph — AI engines need recommendation rationale, not just distance facts (e.g., "one of the few sit-down restaurants between Williams and Seligman on I-40, authentic Punjabi cuisine, family-friendly, beer and wine")

### Directions page (`/directions/`)
- Per-city H2 sections for all 7 cities with turn-by-turn summaries emphasizing I-40 Exit 146
- Navigation between 7 city sections: Claude's discretion (anchor links vs. scroll)
- Google Maps embed strategy: Claude's discretion — optimize for LCP performance vs. relevance
- Turn-by-turn detail level: Claude's discretion for AEO and usability
- Drive time placement: Claude's discretion for maximum AEO extraction value
- Address block with NAP data in each section
- Include standalone "I-40 Exit 146" extractable sentence early on page (e.g., "Spice Grill & Bar is located at I-40 Exit 146 in Ash Fork, Arizona.") — perfect for voice assistant extraction

### AEO/GEO enhancements (from marketing audit)
- **Distance consistency (CRITICAL):** Verify exact distance on Google Maps from "Grand Canyon South Rim Visitor Center" to "33 Lewis Ave, Ash Fork, AZ 86320". Use that single verified number EVERYWHERE: both new pages, faq.json entries 1/4/6/7/8, meta descriptions. No conflicting numbers across the site.
- **Standalone "I-40 Exit 146" sentence** on both pages early in content — 12-word voice-extractable answer
- **Hours as standalone `<p>`** (not table/list) for voice extraction on /near-grand-canyon/
- **"Why stop here" paragraph** on /near-grand-canyon/ — gives AI engines a recommendation rationale
- **Keyword-rich anchor text** for cross-links: "Driving directions to Spice Grill & Bar from 7 cities" instead of generic "Get Directions"
- **Page-specific inline FAQ schema** — 2-3 FAQ pairs per page targeting the exact queries each page answers (separate from global FAQSchema)
- **`speakable` schema markup** on both pages — tells voice assistants which sections to read aloud (H1, lead paragraph, city distances)

### llms.txt AND llms-full.txt fixes (CRITICAL)
- Fix Monday hours in BOTH files: currently says "Mon - Thurs" / "Monday - Thursday" but Monday is CLOSED. Must show Monday as closed in both files.
- Add new page URLs to both files: /near-grand-canyon/, /directions/, /faq/
- Add proximity keywords / Location & Proximity section to both files so AI crawlers understand geographic relevance
- Fix FAQ hours answer in llms.txt to reflect Monday closure

### Already handled (verified — no action needed)
- Canonical URLs: Layout.astro dynamically generates canonical from `Astro.url.pathname` — new pages get correct canonicals automatically
- BreadcrumbSchema: Layout.astro dynamically builds breadcrumbs from `currentPath` — new pages get "Home > Near Grand Canyon" and "Home > Directions" automatically

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

</decisions>

<specifics>
## Specific Ideas

- Mobile-first approach is the priority — both pages should work great on phones first
- Popular dishes should be featured (not quick bites or categorized) — straightforward list with brief descriptions
- H1 on Grand Canyon page should lead with the answer immediately (bold, answer-first pattern)
- Both pages use same city list for consistency
- "The only Indian restaurant on the I-40 corridor between Flagstaff and Kingman" — use this claim if factually true (highly citable for AI engines)
- Cross-link anchor text should contain target query keywords, not generic phrases
- Each page should have 2-3 inline FAQ schema pairs targeting the exact queries that page answers

</specifics>

<deferred>
## Deferred Ideas

- Off-site citation consistency: update Google Business Profile, Yelp, TripAdvisor with matching distance claims — future phase
- Bing Webmaster Tools AI Performance tracking — future setup task
- `dateModified` schema for content freshness signals — low priority, future enhancement

</deferred>

---

*Phase: 05-geo-content-pages*
*Context gathered: 2026-02-21*
*Updated: 2026-02-21 (GEO/AEO marketing audit)*
