# Phase 12: Schema Entity Disambiguation - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers two AEO infrastructure fixes — no new pages, no visual changes, no new npm packages.

**In scope:**
- `src/components/schema/RestaurantSchema.astro` — add `@id: 'https://spicegrillbar66.com/#restaurant'` and `sameAs` array (5 URLs, canonical CID Maps URL)
- `src/components/schema/OrganizationSchema.astro` — add `@id: 'https://spicegrillbar66.com/#organization'` and update existing `sameAs` Maps entry from short link to canonical CID URL
- `src/layouts/Layout.astro` — replace `<link rel="help" href="/llms.txt">` with `rel="alternate" type="text/plain"` and add `<link rel="alternate" type="text/plain" href="/llms-full.txt">` immediately after
- `scripts/aeo-audit.mjs` — add `@id` fragment gate that reads `dist/index.html` after build

**Out of scope:**
- Any visual or layout changes
- Changes to other schema components (FAQSchema, MenuSchema, WebSiteSchema, BreadcrumbSchema)
- llms.txt or llms-full.txt content changes
- robots.txt changes
- New npm packages

</domain>

<decisions>
## Implementation Decisions

### Google Maps URL in sameAs
- **D-01:** Use the canonical CID URL `https://www.google.com/maps?cid=5034425112937519671` (not the short `maps.app.goo.gl/q2EJFMbMRaysU6vH8` link) in RestaurantSchema's new `sameAs` array.
- **D-02:** Also update OrganizationSchema's existing `sameAs` Maps entry to use the same CID URL. Phase 12 touches OrganizationSchema anyway (adding `@id`), so update for consistency. Both schemas must use the same URL for the same entity.

### CI Enforcement Gate
- **D-03:** Add a gate to `scripts/aeo-audit.mjs` that reads `dist/index.html` after build and checks that the rendered JSON-LD output contains `#restaurant` and `#organization` `@id` fragment strings. This confirms actual build output, not just source code.
- **D-04:** Gate must gracefully skip with a warning (not a failure) when `dist/index.html` doesn't exist — `npm run test:aeo` can be run standalone without a prior build. Only fail the audit if the file exists but the `@id` fragments are missing.

### AI Crawler Discovery Link Placement
- **D-05:** Replace `<link rel="help" href="/llms.txt" />` in-place at its current position (after `<link rel="manifest" href="/manifest.json" />`). Do NOT move to end of `<head>`. The replacement tag is `<link rel="alternate" type="text/plain" href="/llms.txt" />`. The `llms-full.txt` link goes immediately after on the next line.

### Claude's Discretion
- Field ordering within RestaurantSchema and OrganizationSchema (where to insert `@id` and `sameAs` relative to existing fields — conventional JSON-LD puts `@id` near the top after `@context`/`@type`)
- Commit strategy (one atomic commit for all Phase 12 changes vs split by requirement — planner decides)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary targets (read for current state before editing)
- `src/components/schema/RestaurantSchema.astro` — add `@id` + `sameAs`; currently has no `@id` and no `sameAs` at the entity level
- `src/components/schema/OrganizationSchema.astro` — add `@id`; update Maps URL in existing `sameAs`; currently has `sameAs` with 5 URLs but no `@id`
- `src/layouts/Layout.astro` — fix llms link at line 70; currently `<link rel="help" href="/llms.txt" />`
- `scripts/aeo-audit.mjs` — add `@id` gate; currently ~90 lines reading source files and public/

### Project-level
- `CLAUDE.md` — Astro 5 conventions, no new npm packages constraint
- `.planning/REQUIREMENTS.md` — AEO-11 and AEO-16 full specs with acceptance criteria

### Schema standards
- `node_modules/schema-dts/dist/schema.d.ts` — verify `WithContext<T>` includes `@id: string` (confirmed: line 12) and `Thing` includes `sameAs` (confirmed: line 10431)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `WithContext<Restaurant>` and `WithContext<Organization>` types already accept `@id: string` — no type casting or workaround needed
- `sameAs` on `Thing` (base of all schema types) is typed as `SchemaValue<URL, "sameAs">` — string values accepted
- `@id` on nested `areaServed` entries (e.g., `{ '@type': 'City', name: 'Ash Fork', '@id': 'https://...' }`) shows the existing pattern for the property name syntax

### Established Patterns
- All schema files use `schema-dts` TypeScript types with `const schema: WithContext<T> = { ... }` then `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`
- `aeo-audit.mjs` uses `fs.readFileSync` + string checks; new `@id` gate should follow the same pattern but read from `dist/index.html`
- The audit script exits with `process.exit(1)` when `errors > 0` — new gate should increment the shared `errors` counter on failure (not throw)

### Integration Points
- `Layout.astro` line 70: `<link rel="help" href="/llms.txt" />` is the exact string to replace
- `scripts/aeo-audit.mjs` ROOT_DIR resolves to project root; `dist/index.html` path = `path.join(ROOT_DIR, 'dist/index.html')`
- `npm run qa` = build → test:quality (includes test:aeo) → test:lhci; `dist/` is available when `test:aeo` runs via `qa`

</code_context>

<specifics>
## Specific Ideas

- Canonical CID URL already looked up: `https://www.google.com/maps?cid=5034425112937519671` (derived from the existing short link `maps.app.goo.gl/q2EJFMbMRaysU6vH8` which redirects to `google.com/maps/place/...data=...1s0x8732a987857c6279:0x45dddef778f25a37...`; hex CID `0x45dddef778f25a37` = decimal `5034425112937519671`)
- The 5 `sameAs` URLs for RestaurantSchema (mirroring OrganizationSchema but with CID URL for Maps):
  1. `https://www.google.com/maps?cid=5034425112937519671` (canonical, replaces short link)
  2. `https://www.yelp.com/biz/spice-grill-and-bar-ash-fork`
  3. `https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html`
  4. `https://www.facebook.com/profile.php?id=61566349169122`
  5. `https://www.instagram.com/panjabi_dhaba_sgb`
- The `@id` gate in `aeo-audit.mjs` should search for the literal strings `"@id":"https://spicegrillbar66.com/#restaurant"` and `"@id":"https://spicegrillbar66.com/#organization"` in `dist/index.html` (JSON.stringify output, no spaces around `:`)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 12-schema-entity-disambiguation*
*Context gathered: 2026-05-14*
