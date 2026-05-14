# Phase 13: FAQPage Schema Compliance — Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers three surgical fixes — no visual changes, no new pages, no new npm packages.

**In scope:**
- `src/layouts/Layout.astro` — narrow FAQSchema gate from `currentPath === '/' || currentPath.startsWith('/faq')` to `currentPath.startsWith('/faq')` only; update `geo.position` meta from `35.2241;-112.4829` to `35.222908;-112.4781558`
- `src/pages/index.astro` — inject inline FAQPage JSON-LD with exactly the 8 home FAQ questions (using existing `homeFaq` array); no new imports needed
- `src/components/schema/WebSiteSchema.astro` — add `'@id': 'https://spicegrillbar66.com/#organization'` to the `publisher` object to wire the entity graph (CR-02 from Phase 12)
- `src/components/schema/RestaurantSchema.astro` — update `latitude: 35.22291449138381, longitude: -112.47815397255074` to `latitude: 35.222908, longitude: -112.4781558` (CR-01 authoritative CID-verified coordinates)
- `scripts/aeo-audit.mjs` — add gate verifying `dist/index.html` FAQPage schema has exactly 8 Question entries

**Out of scope:**
- Changes to FAQSchema.astro component itself
- Changes to /faq/ page schema (it correctly receives all 34 questions)
- Any visual changes to the home FAQ section
- llms.txt or other content files
- New npm packages

</domain>

<decisions>
## Implementation Decisions

### FAQPage Injection Method
- **D-01:** Inject the 8-question FAQPage schema as an inline `<script is:inline type="application/ld+json">` block directly in `src/pages/index.astro`. Use the existing `homeFaq` array (already built from `homeFaqIndices = [14, 2, 3, 13, 10, 1, 15, 21]`). Raw JSON object — no schema-dts type import needed. This matches the existing pattern used on `/near-grand-canyon/` and `/near-williams/` pages.

### FAQSchema Gate Narrowing
- **D-02:** In `Layout.astro`, change the condition `(currentPath === '/' || currentPath.startsWith('/faq'))` to `currentPath.startsWith('/faq')` only. The home page will no longer receive the global 34-question FAQSchema block. The two changes (Layout.astro gate + index.astro inline schema) MUST ship as a single atomic commit (or two commits in immediate sequence) to prevent any window where the home page has no FAQ schema.

### Authoritative Geo Coordinates (CR-01)
- **D-03:** Authoritative value is `35.222908, -112.4781558` — verified by owner/developer via the Google Maps CID link (`google.com/maps?cid=5034425112937519671`). Update both:
  - `Layout.astro` geo.position meta: `content="35.222908;-112.4781558"` (semicolon-separated, replaces `35.2241;-112.4829`)
  - `RestaurantSchema.astro` GeoCoordinates: `latitude: 35.222908, longitude: -112.4781558` (replaces `35.22291449138381, -112.47815397255074`)

### WebSiteSchema Publisher @id (CR-02)
- **D-04:** In `WebSiteSchema.astro`, add `'@id': 'https://spicegrillbar66.com/#organization'` to the existing `publisher` object (which is already `'@type': 'Organization'`). This wires the WebSite node to the Organization entity established in Phase 12, completing the Knowledge Graph entity chain: Restaurant → Organization ← WebSite.

### AEO Audit Gate
- **D-05:** Add a new gate to `scripts/aeo-audit.mjs` that reads `dist/index.html` and counts `"@type":"Question"` occurrences within the FAQPage JSON-LD block for the home page. Gate fails (increments `errors`) if count is not exactly 8. Gate skips gracefully with `console.warn` when `dist/index.html` is absent (same pattern as the @id gate from Phase 12). Search string to count: `"@type":"Question"` within the home page output context.

### Commit Strategy
- **D-06:** Two commits acceptable — (1) schema changes across Layout.astro, index.astro, WebSiteSchema.astro, RestaurantSchema.astro; (2) aeo-audit.mjs gate. Or three atomic commits by requirement if planner prefers (AEO-10, CR-01+CR-02, audit gate). Single wave — all changes are independent.

### Claude's Discretion
- Exact position of the inline FAQPage script in index.astro (after the existing SpeakableSpecification script block is a natural placement)
- Whether to update the AEO-10 traceability line in REQUIREMENTS.md in the same commit

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary targets
- `src/layouts/Layout.astro` — line 104 (geo.position meta to update), line 122 (FAQSchema gate condition to narrow)
- `src/pages/index.astro` — lines 21-22 (homeFaqIndices + homeFaq already built), lines 34+ (home FAQ section for script placement reference), line 64 (existing SpeakableSpecification inline script — FAQPage script goes after this)
- `src/components/schema/WebSiteSchema.astro` — lines 12-13 (publisher object to add @id to)
- `src/components/schema/RestaurantSchema.astro` — lines 78-81 (GeoCoordinates lat/lon to update)
- `scripts/aeo-audit.mjs` — end of file before final summary block (new gate insertion point, same pattern as Phase 12 @id gate)

### Project-level
- `CLAUDE.md` — Astro 5 conventions, no new npm packages, schema-dts patterns
- `.planning/REQUIREMENTS.md` — AEO-10 full spec with acceptance criteria
- `.planning/phases/12-schema-entity-disambiguation/12-01-SUMMARY.md` — Phase 12 @id decisions and sameAs patterns (CR-02 cross-reference)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `homeFaqIndices = [14, 2, 3, 13, 10, 1, 15, 21]` and `homeFaq` array already defined in `index.astro` lines 21-22 — use directly in the inline FAQPage script
- Inline JSON-LD pattern from `/near-grand-canyon/` and `/near-williams/` pages: `<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />`
- Phase 12 AEO gate pattern (aeo-audit.mjs lines ~99-114): `fs.existsSync` guard → `fs.readFileSync` → `.includes()` / count check → `errors++` on failure, `console.warn` on skip

### Integration Points
- `Layout.astro:122` current condition: `{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}` — remove the `currentPath === '/' ||` part
- `WebSiteSchema.astro:12-13`: `publisher: { '@type': 'Organization' }` → add `'@id': 'https://spicegrillbar66.com/#organization'`
- `RestaurantSchema.astro:78-81`: update latitude and longitude values only — surrounding GeoCoordinates structure unchanged
- The FAQPage inline schema shape (matching AEO-10): `{ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": homeFaq.map(q => ({ "@type": "Question", "name": q.question, "acceptedAnswer": { "@type": "Answer", "text": q.answer } })) }`

</code_context>

<specifics>
## Specific Values

- Authoritative geo: `latitude: 35.222908, longitude: -112.4781558` (semicolons for meta tag: `35.222908;-112.4781558`)
- Home FAQ indices: `[14, 2, 3, 13, 10, 1, 15, 21]` — exactly 8 entries (0-indexed into faq.json)
- FAQPage @type gate search string: `"@type":"Question"` — expect exactly 8 matches in home page JSON-LD output
- WebSiteSchema publisher @id: `'https://spicegrillbar66.com/#organization'`
- Layout.astro geo.position replacement: `content="35.222908;-112.4781558"` (was `35.2241;-112.4829`)

</specifics>

<deferred>
## Deferred Ideas

None — all discussion stayed within phase scope.

</deferred>

---

*Phase: 13-faqpage-schema-compliance*
*Context gathered: 2026-05-14*
