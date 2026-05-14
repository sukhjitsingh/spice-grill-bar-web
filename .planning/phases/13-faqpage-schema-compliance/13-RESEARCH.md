# Phase 13: FAQPage Schema Compliance — Research

**Researched:** 2026-05-14
**Domain:** JSON-LD FAQPage schema / Astro 5 inline script injection / AEO audit gating
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Inject the 8-question FAQPage schema as an inline `<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />` block directly in `src/pages/index.astro`. Use the existing `homeFaq` array (already built from `homeFaqIndices = [14, 2, 3, 13, 10, 1, 15, 21]`). Raw JSON object — no schema-dts type import needed.
- **D-02:** In `Layout.astro`, change the condition `(currentPath === '/' || currentPath.startsWith('/faq'))` to `currentPath.startsWith('/faq')` only. Both changes (Layout.astro gate + index.astro inline schema) MUST ship as a single atomic commit (or two commits in immediate sequence) to prevent any window where the home page has no FAQ schema.
- **D-03:** Authoritative geo `35.222908, -112.4781558` (CID-verified). Update both `Layout.astro` geo.position meta (`35.222908;-112.4781558`) and `RestaurantSchema.astro` GeoCoordinates.
- **D-04:** In `WebSiteSchema.astro`, add `'@id': 'https://spicegrillbar66.com/#organization'` to the existing `publisher` object.
- **D-05:** Add AEO audit gate to `scripts/aeo-audit.mjs` that counts `"@type":"Question"` occurrences in `dist/index.html`; fail if count != 8; skip gracefully with `console.warn` if file absent.
- **D-06:** Two or three atomic commits acceptable. Single wave — all changes are independent.

### Claude's Discretion

- Exact position of the inline FAQPage script in `index.astro` (after the existing SpeakableSpecification script block is a natural placement).
- Whether to update the AEO-10 traceability line in REQUIREMENTS.md in the same commit.

### Deferred Ideas (OUT OF SCOPE)

None — all discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AEO-10 | `Layout.astro` FAQSchema gate narrowed to `/faq/` only; `index.astro` gains inline FAQPage schema built from `faqData[homeFaqIndices]` containing exactly the 8 questions rendered in the visible DOM; both files change in a single atomic commit. | All five change points fully traced in codebase. Inline schema pattern confirmed via `is:inline` + `set:html`. Audit gate pattern confirmed from Phase 12. |
</phase_requirements>

---

## Summary

Phase 13 corrects a Google FAQPage policy violation on the home page: the current build emits a 34-question FAQPage schema on `/` (via the global `FAQSchema` component in `Layout.astro`) while only 8 questions are visible in the DOM. Google's rich results policy requires the schema to match exactly what users can see. The fix is surgical — no new npm packages, no new pages, no visual changes.

The five changes are: (1) narrow the `FAQSchema` gate in `Layout.astro` from `currentPath === '/' || currentPath.startsWith('/faq')` to `currentPath.startsWith('/faq')` only; (2) inject an 8-question inline `FAQPage` JSON-LD block in `index.astro` using the already-defined `homeFaq` array; (3) update the `geo.position` meta in `Layout.astro` to the CID-verified coordinates; (4) update `GeoCoordinates` in `RestaurantSchema.astro` to the same coordinates; (5) add `'@id': 'https://spicegrillbar66.com/#organization'` to the `publisher` object in `WebSiteSchema.astro`; (6) add an AEO audit gate that validates exactly 8 `Question` entries appear in the built `dist/index.html`.

All change points are precisely located in the codebase. The dominant technical risk is the atomicity window — if the gate removal lands without the inline replacement, the home page briefly has no FAQ schema. The commit strategy in D-02/D-06 addresses this.

**Primary recommendation:** Execute all five file changes in one commit (or two back-to-back), with the AEO gate as a final second commit. Use `<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />` for the dynamic FAQPage injection in `index.astro`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| FAQPage JSON-LD on home page | Frontend Server (Astro SSG) | — | Schema emitted at build time from `homeFaq` array; no runtime needed |
| FAQSchema gate (Layout.astro) | Frontend Server (Astro SSG) | — | Conditional rendering at build time via `currentPath` — static site, resolved per-page |
| GeoCoordinates / geo.position | Frontend Server (Astro SSG) | — | Both are static values replaced in source; no runtime data fetch |
| AEO audit gate | Build tooling (Node script) | — | Post-build validation reads `dist/index.html`; belongs in `scripts/` alongside existing Phase 12 gate |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro 5 | 5.x (project-installed) | Static site build; `<script is:inline>` + `set:html` for JSON-LD injection | Project framework; no alternative |
| schema-dts | 1.1.5 (project-installed) | TypeScript types for schema.org | Used by all existing schema components |

[VERIFIED: codebase grep — all schema components use `schema-dts`; Astro `is:inline` + `set:html` confirmed in 6 existing schema component outputs]

### Supporting

No additional libraries needed. All changes use patterns and data already present in the project.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<script is:inline set:html={JSON.stringify(...)}>` | Static hardcoded JSON in `<script type="application/ld+json">` | Static works for pages with no Astro-side data (e.g., `near-grand-canyon.astro`). `index.astro` uses `homeFaq` derived from `faq.json` at build time, so `set:html` + `JSON.stringify` is the correct pattern to avoid duplicating the FAQ text manually |
| Separate schema component | Inline script in `index.astro` | D-01 locks to inline — avoids creating a new file dependency for a one-page-only schema |

**Installation:** No packages to install.

---

## Architecture Patterns

### System Architecture Diagram

```
faq.json (34 entries)
      |
      | homeFaqIndices[14,2,3,13,10,1,15,21]
      v
index.astro (build time)
      |--- <section id="home-faq"> renders 8 items in DOM
      |--- <script is:inline set:html={JSON.stringify(inlineFAQPage)}> -- 8-question FAQPage JSON-LD
      |--- <script type="application/ld+json"> -- existing SpeakableSpecification (unchanged)
      |
      v (via Layout.astro)
Layout.astro
      |--- currentPath.startsWith('/faq') && <FAQSchema /> -- gate narrowed (was: '/' OR '/faq')
      |--- RestaurantSchema / OrganizationSchema / WebSiteSchema / MenuSchema / BreadcrumbSchema
      |--- geo.position meta updated to 35.222908;-112.4781558

faq.astro (/faq/ route)
      |--- currentPath.startsWith('/faq') = TRUE -> FAQSchema (34 questions) still rendered

dist/index.html (build output)
      |
      v
aeo-audit.mjs gate
      |--- reads dist/index.html
      |--- counts "@type":"Question" within page
      |--- fails if count != 8
      |--- skips with console.warn if dist/index.html absent
```

### Recommended Project Structure

No structural changes — all edits are in existing files.

```
src/layouts/Layout.astro            # Change line 104 (geo.position) + line 122 (FAQSchema gate)
src/pages/index.astro               # Add inline FAQPage script after SpeakableSpecification block (line 67)
src/components/schema/WebSiteSchema.astro  # Add @id to publisher object (lines 12-13)
src/components/schema/RestaurantSchema.astro  # Update lat/lon (lines 79-80)
scripts/aeo-audit.mjs               # Add Question count gate (after line 114, before final summary)
```

### Pattern 1: Astro Inline Dynamic JSON-LD

**What:** Inject JSON-LD schema derived from Astro frontmatter data using `is:inline` + `set:html`.
**When to use:** When the schema content is computed from Astro-side data (arrays, imports) and cannot be hardcoded as static JSON.

```astro
---
// Source: existing schema components (FAQSchema.astro, BreadcrumbSchema.astro, etc.)
const schemaObj = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaq.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
};
---

<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />
```

[VERIFIED: codebase — `set:html={JSON.stringify(schema)}` is the exact pattern used in all 6 schema components: FAQSchema.astro:20, BreadcrumbSchema.astro:25, MenuSchema.astro:36, WebSiteSchema.astro:20, OrganizationSchema.astro:36, RestaurantSchema.astro:146]

### Pattern 2: AEO Audit Gate (Phase 12 Style)

**What:** Read build output HTML, search for a string, count occurrences, fail if count != expected.
**When to use:** Any AEO invariant that must be verified against the built output.

```javascript
// Source: scripts/aeo-audit.mjs lines 98-114 (Phase 12 @id gate pattern)
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ [gate name]: dist/index.html not found — skipping (run npm run build first)');
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
  const questionCount = (distHtml.match(/"@type":"Question"/g) || []).length;
  if (questionCount !== 8) {
    console.error(`✗ FAQPage gate: dist/index.html has ${questionCount} Question entries, expected 8`);
    errors++;
  } else {
    console.log('✓ FAQPage gate: dist/index.html contains exactly 8 Question entries');
  }
}
```

[VERIFIED: codebase — aeo-audit.mjs lines 97-114 show the exact guard + readFileSync + includes + errors++ pattern]

**Confirmed search string:** `"@type":"Question"` — verified via `JSON.stringify` simulation against `homeFaq` that this produces exactly 8 matches. [VERIFIED: local node execution]

### Pattern 3: FAQSchema Gate Narrowing in Layout.astro

**What:** Change a conditional render from multi-path to single-path scope.
**Current state (line 122):**

```astro
{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}
```

**Target state:**

```astro
{currentPath.startsWith('/faq') && <FAQSchema />}
```

[VERIFIED: codebase — Layout.astro line 122 confirms current condition exactly as shown]

### Pattern 4: Geo Coordinate Update

**Layout.astro line 104 (current):**
```html
<meta name="geo.position" content="35.2241;-112.4829" />
```

**Target:**
```html
<meta name="geo.position" content="35.222908;-112.4781558" />
```

**RestaurantSchema.astro lines 79-80 (current):**
```typescript
latitude: 35.22291449138381,
longitude: -112.47815397255074,
```

**Target:**
```typescript
latitude: 35.222908,
longitude: -112.4781558,
```

[VERIFIED: codebase — confirmed values via direct file read]

### Pattern 5: WebSiteSchema Publisher @id

**WebSiteSchema.astro lines 12-14 (current):**
```typescript
publisher: {
  '@type': 'Organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

**Target (add `'@id'` line):**
```typescript
publisher: {
  '@type': 'Organization',
  '@id': 'https://spicegrillbar66.com/#organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

[VERIFIED: codebase — WebSiteSchema.astro lines 12-16 confirm current structure]

### Anti-Patterns to Avoid

- **Static hardcoded JSON for `homeFaq` questions:** Do NOT duplicate the 8 FAQ answers as literal strings in `index.astro`. Always derive them from the `homeFaq` array via `JSON.stringify`. This keeps the source of truth in `faq.json` and prevents drift.
- **Separate commit for gate removal vs. inline schema addition:** Even a one-second gap where `/` has no FAQ schema is a production policy violation window. Both must be committed together.
- **Using schema-dts `WithContext<FAQPage>` type in index.astro:** The D-01 decision locks to a raw JS object. The schema-dts type is not needed here and would require an import; avoid it.
- **Counting `"@type":"Question"` across ALL pages:** The audit gate reads only `dist/index.html`. The faq.astro page will also have 34 Question entries, but those are in a separate HTML file.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Serializing schema to JSON string | Custom serializer | `JSON.stringify(schemaObj)` | Already the pattern used by all 6 schema components |
| Reading build output in tests | Custom file reader | `fs.readFileSync` + string match (already in aeo-audit.mjs) | Established pattern; no additional tooling needed |

---

## Runtime State Inventory

Step 2.5 SKIPPED: This is not a rename/refactor/migration phase. Changes are surgical edits to schema values and conditional logic — no stored data, live service config, OS-registered state, secrets, or build artifacts require migration.

---

## Common Pitfalls

### Pitfall 1: Atomicity Window — Gate Removed Before Inline Schema Added

**What goes wrong:** If the `Layout.astro` gate removal is committed separately before the `index.astro` inline FAQPage block is added, the home page briefly has zero FAQPage schema. Google may re-crawl during this window and record a schema removal.
**Why it happens:** Two-file changes split across separate commits.
**How to avoid:** D-02 explicitly requires a single atomic commit (or two back-to-back). In practice: stage both files before committing.
**Warning signs:** A commit diff that touches `Layout.astro` but not `index.astro` (or vice versa for the schema changes).

### Pitfall 2: Question Count Mismatch in AEO Audit

**What goes wrong:** The audit gate expects exactly 8. If `homeFaq.filter(entry => entry)` silently drops an entry due to an out-of-bounds index, the count becomes 7 and the gate fails.
**Why it happens:** `faq.json` has 34 entries (0-indexed 0–33). All 8 indices in `homeFaqIndices` (14, 2, 3, 13, 10, 1, 15, 21) are valid. [VERIFIED: local node execution confirmed all 8 resolve to non-null entries]
**How to avoid:** No action needed — indices are confirmed valid. The `.filter(entry => entry)` guard is defensive but should not remove any entries for the current faq.json.
**Warning signs:** AEO audit gate reports a count other than 8 after build.

### Pitfall 3: `set:html` vs Static `<script>` — Wrong Pattern for Dynamic Data

**What goes wrong:** Using `<script type="application/ld+json">` (no `is:inline`, no `set:html`) inside an Astro template and attempting to interpolate `{JSON.stringify(schemaObj)}` inside the tag body — Astro will escape or not process the expression.
**Why it happens:** The existing Speakable schema in `index.astro` uses a static `<script type="application/ld+json">` (no Astro expression needed because the content is hardcoded). The new FAQPage schema needs Astro expression interpolation.
**How to avoid:** Use `<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />` — the pattern confirmed across all 6 schema components.
**Warning signs:** Build output shows literal `{JSON.stringify(schemaObj)}` in the HTML instead of the actual JSON.

### Pitfall 4: AEO Audit Run Without Prior Build

**What goes wrong:** `npm run test:aeo` is run before `npm run build`. The gate skips with a `console.warn` but doesn't fail — giving a false pass.
**Why it happens:** `dist/index.html` absent triggers the `fs.existsSync` skip branch.
**How to avoid:** When validating AEO-10, always run `npm run build` first, then `npm run test:aeo`. The `npm run qa` script chains these correctly.
**Warning signs:** AEO audit output shows "skipping — run npm run build first" for the FAQPage gate.

### Pitfall 5: geo.position Meta Uses Semicolon Separator

**What goes wrong:** Coordinates entered with comma separator: `"35.222908,-112.4781558"` — incorrect for the `geo.position` meta tag format.
**Why it happens:** GeoCoordinates (RestaurantSchema) uses comma-separated values; the HTML meta tag requires semicolons.
**How to avoid:** `Layout.astro` geo.position: semicolons (`35.222908;-112.4781558`). `RestaurantSchema.astro` `GeoCoordinates`: separate `latitude` and `longitude` properties (no separator).

---

## Code Examples

Verified patterns from codebase analysis:

### FAQPage Schema Object for index.astro

```astro
---
// In index.astro frontmatter — schemaObj computed from existing homeFaq array
// No schema-dts import required (D-01)
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaq.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
};
---

<!-- After existing SpeakableSpecification script block (line 67) -->
<script is:inline type="application/ld+json" set:html={JSON.stringify(faqPageSchema)} />
```

### AEO Audit Gate Addition (insert after line 114, before final summary)

```javascript
// 5. FAQPage home-page schema gate — verifies exactly 8 Question entries
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ FAQPage gate: dist/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
  const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
  if (questionMatches.length !== 8) {
    console.error(`✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly 8`);
    errors++;
  } else {
    console.log('✓ FAQPage gate: dist/index.html contains exactly 8 Question entries');
  }
}
```

Note: `distHtml` is already read in the `@id` gate block (lines 102-103). If the `@id` gate and this gate share the same `if (!fs.existsSync(distIndexPath))` block, the variable can be shared. If they are separate blocks, `distIndexPath` is already defined at line 98 — the gate can reuse it.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQPage schema on all pages (global via Layout.astro) | FAQPage schema scoped per-page to match visible DOM | Google policy enforcement tightened ~2022 | Schema/DOM mismatch is an active policy violation |

**Deprecated/outdated:**
- **Global FAQPage schema on pages with partial FAQ visibility:** Google explicitly requires that schema markup represent content visible to the user. Injecting all 34 questions when only 8 are shown is a policy violation.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `faq.json` will continue to have 34 entries during Phase 13 execution (the GitHub Actions reviewer does not add/remove entries between now and plan execution) | Code Examples | If entries are added/removed, homeFaqIndices[21] could shift; low risk — automated reviewer only adds entries, never removes |

**No other assumed claims** — all technical findings were verified against the live codebase in this session.

---

## Open Questions

1. **AEO audit @id gate and FAQPage gate share `distHtml`**
   - What we know: The existing `@id` gate reads `distHtml` within an `if (fs.existsSync(distIndexPath))` block at lines 99-114.
   - What's unclear: Whether the planner should merge the FAQPage count check inside the same `else` branch (reusing `distHtml`) or write a new separate guard.
   - Recommendation: Merge into the same `if` block to avoid reading the file twice. The planner should note the variable scope.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `aeo-audit.mjs` gate | Yes | Project runtime | — |
| `dist/index.html` | AEO audit FAQPage gate | Optional (build-time) | — | Gate skips with `console.warn` when absent |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** `dist/index.html` — gate skips gracefully, same as Phase 12 `@id` gate.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Custom Node.js audit script (`aeo-audit.mjs`) + Playwright e2e |
| Config file | `scripts/aeo-audit.mjs` (AEO), `playwright.config.ts` (e2e) |
| Quick run command | `npm run test:aeo` |
| Full suite command | `npm run qa` (build + lint + knip + typecheck + aeo + lhci) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AEO-10 | Home page FAQPage has exactly 8 Question entries | audit gate | `npm run build && npm run test:aeo` | Wave 0: add gate to `scripts/aeo-audit.mjs` |
| AEO-10 | `/faq/` page still receives full FAQSchema (34 questions) | manual / Google Rich Results Test | manual | — |

### Sampling Rate

- **Per task commit:** `npm run test:aeo` (requires prior build)
- **Per wave merge:** `npm run qa`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `scripts/aeo-audit.mjs` — add FAQPage Question count gate (covers AEO-10)

*(All other test infrastructure exists. No new test files, framework installs, or conftest equivalents needed.)*

---

## Security Domain

All changes are build-time static schema modifications. No user input, authentication, session management, access control, or cryptography is involved. ASVS categories V2, V3, V4, V6 do not apply. V5 (Input Validation) is not applicable because all data flows from trusted static JSON files at build time.

**Not applicable to this phase.**

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 13 |
|-----------|-------------------|
| No new npm packages | Confirmed — no new packages needed |
| Conventional commits enforced | All commits must use `fix:` or `chore:` prefix; pre-push hook runs `npm run qa` |
| LCP < 4000ms, TBT < 600ms, CLS < 0.105 | Inline JSON-LD is zero-JS, zero-render-blocking — no Lighthouse impact |
| Accessibility >= 90, SEO >= 90 | JSON-LD changes improve SEO signal; no accessibility impact |
| `is:inline` + `set:html` for dynamic schema | Confirmed pattern from schema components |
| Astro 5 static site — no runtime | All schema injection is build-time; confirmed compatible |

---

## Sources

### Primary (HIGH confidence)
- Codebase direct reads — `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/components/schema/FAQSchema.astro`, `src/components/schema/WebSiteSchema.astro`, `src/components/schema/RestaurantSchema.astro`, `scripts/aeo-audit.mjs` — all critical values and patterns verified by reading the actual files
- `src/data/faq.json` — 34 entries confirmed; all 8 `homeFaqIndices` verified as valid by local `node` execution
- `.planning/phases/13-faqpage-schema-compliance/13-CONTEXT.md` — locked decisions read verbatim

### Secondary (MEDIUM confidence)
- Google Rich Results policy (schema/DOM mismatch) — referenced in `REQUIREMENTS.md` research summary: "FAQPage schema/DOM mismatch on `/` is a Google policy violation" [CITED: .planning/REQUIREMENTS.md]

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all patterns verified in live codebase
- Architecture: HIGH — five change points pinpointed with line numbers, current and target state confirmed
- Pitfalls: HIGH — derived from actual code analysis and verified index ranges
- AEO audit gate: HIGH — search string `"@type":"Question"` confirmed to match exactly 8 times via local `JSON.stringify` simulation

**Research date:** 2026-05-14
**Valid until:** 2026-06-14 (stable — no external API dependencies; only risk is faq.json modifications from GitHub Actions reviewer)
