# Phase 13: FAQPage Schema Compliance — Pattern Map

**Mapped:** 2026-05-14
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/pages/index.astro` | page (inline schema injection) | transform (build-time JSON-LD) | `src/components/schema/FAQSchema.astro` | exact (same `is:inline` + `set:html` + `JSON.stringify` pattern; same `FAQPage` schema shape) |
| `src/layouts/Layout.astro` | layout / config | request-response (path-conditional render) | `src/layouts/Layout.astro` (self — narrow existing gate) | self-edit |
| `src/components/schema/WebSiteSchema.astro` | schema component | transform (build-time JSON-LD) | `src/components/schema/RestaurantSchema.astro` | exact (same `schema-dts` + `WithContext<T>` + `is:inline` + `set:html` pattern) |
| `src/components/schema/RestaurantSchema.astro` | schema component | transform (build-time JSON-LD) | `src/components/schema/WebSiteSchema.astro` | exact (same pattern; self-update of lat/lon values) |
| `scripts/aeo-audit.mjs` | utility / build tool | batch (post-build file read + validation) | `scripts/aeo-audit.mjs` lines 97–114 (Phase 12 `@id` gate — self-extension) | exact (same `existsSync` guard → `readFileSync` → string match → `errors++` pattern) |

---

## Pattern Assignments

### `src/pages/index.astro` — inline FAQPage JSON-LD injection

**Change:** Add `faqPageSchema` object in frontmatter + `<script is:inline>` tag after existing SpeakableSpecification block (after line 67).

**Analog:** `src/components/schema/FAQSchema.astro` (lines 1–20) — identical structural pattern for FAQPage schema construction and emission.

**Frontmatter schema-object pattern** (`src/components/schema/FAQSchema.astro` lines 6–17):
```astro
const schema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};
```

**Adapted form for `index.astro`** (D-01 — raw object, no schema-dts import, uses existing `homeFaq` array):
```astro
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
```

**Emission pattern** (`src/components/schema/FAQSchema.astro` line 20):
```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Placement in `index.astro`** — insert immediately after the closing `</script>` of the SpeakableSpecification block (currently line 67). The `homeFaq` array is already available in the frontmatter (line 22); no new imports needed.

**What NOT to use** — `src/pages/index.astro` already contains a static `<script type="application/ld+json">` at line 57 (SpeakableSpecification). That form works only for hardcoded JSON. For Astro-expression interpolation, `is:inline` + `set:html` is mandatory (Pitfall 3 from RESEARCH.md).

---

### `src/layouts/Layout.astro` — FAQSchema gate narrowing (line 122)

**Change:** Remove `currentPath === '/' ||` from the existing conditional.

**Analog:** `src/layouts/Layout.astro` line 122 (self — targeted one-expression edit).

**Current pattern** (`src/layouts/Layout.astro` line 122):
```astro
{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}
```

**Target pattern:**
```astro
{currentPath.startsWith('/faq') && <FAQSchema />}
```

**Also update** `src/layouts/Layout.astro` line 104 (geo.position meta):

Current (line 104):
```html
<meta name="geo.position" content="35.2241;-112.4829" />
```

Target:
```html
<meta name="geo.position" content="35.222908;-112.4781558" />
```

Note: semicolon separator is required for the `geo.position` meta tag format (distinct from the comma-separated GeoCoordinates properties in RestaurantSchema).

**Atomicity requirement (D-02):** This gate change and the `index.astro` inline schema addition MUST be committed together. A diff touching `Layout.astro` but not `index.astro` (or vice versa) creates a policy-violation window.

---

### `src/components/schema/WebSiteSchema.astro` — add `@id` to publisher object

**Change:** Add `'@id': 'https://spicegrillbar66.com/#organization'` to the existing `publisher` object.

**Analog:** `src/components/schema/RestaurantSchema.astro` line 21 — shows the `@id` fragment URL convention used in this project (`'@id': 'https://spicegrillbar66.com/#restaurant'`).

**Current publisher object** (`src/components/schema/WebSiteSchema.astro` lines 12–16):
```typescript
publisher: {
  '@type': 'Organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

**Target publisher object:**
```typescript
publisher: {
  '@type': 'Organization',
  '@id': 'https://spicegrillbar66.com/#organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

**Emission pattern** (unchanged — `src/components/schema/WebSiteSchema.astro` line 20):
```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### `src/components/schema/RestaurantSchema.astro` — update GeoCoordinates

**Change:** Replace latitude and longitude values with CID-verified coordinates.

**Analog:** `src/components/schema/RestaurantSchema.astro` lines 78–82 (self — targeted value edit).

**Current `geo` block** (`src/components/schema/RestaurantSchema.astro` lines 78–82):
```typescript
geo: {
  '@type': 'GeoCoordinates',
  latitude: 35.22291449138381,
  longitude: -112.47815397255074,
},
```

**Target `geo` block:**
```typescript
geo: {
  '@type': 'GeoCoordinates',
  latitude: 35.222908,
  longitude: -112.4781558,
},
```

All surrounding `GeoCoordinates` structure is unchanged. Only the two numeric values are replaced.

---

### `scripts/aeo-audit.mjs` — FAQPage Question count gate

**Change:** Add a new gate after line 114 (end of the existing `@id` gate block), before the final summary block (line 116).

**Analog:** `scripts/aeo-audit.mjs` lines 97–114 — the Phase 12 `@id` gate. Exact same pattern: `existsSync` guard → skip with `console.warn` → `readFileSync` → string match/count → `errors++` on failure.

**`@id` gate pattern to copy from** (`scripts/aeo-audit.mjs` lines 97–114):
```javascript
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
  const restaurantId = '"@id":"https://spicegrillbar66.com/#restaurant"';
  const orgId = '"@id":"https://spicegrillbar66.com/#organization"';
  const missingIds = [];
  if (!distHtml.includes(restaurantId)) missingIds.push('#restaurant');
  if (!distHtml.includes(orgId)) missingIds.push('#organization');
  if (missingIds.length > 0) {
    console.error(`✗ @id gate: dist/index.html missing @id fragment(s): ${missingIds.join(', ')}`);
    errors++;
  } else {
    console.log('✓ @id gate: both #restaurant and #organization @id fragments found in dist/index.html');
  }
}
```

**Adapted FAQPage gate** (insert after line 114, before line 116 `console.log('\n---')`):
```javascript
// 5. FAQPage home-page schema gate — verifies exactly 8 Question entries in dist/index.html
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

**Variable reuse note:** `distIndexPath` is already defined at line 98 and is in scope through the end of the file. The new gate can reference it directly. If `distHtml` was already read in the `@id` gate's `else` branch, it is block-scoped to that `else` — the new gate must read the file again with its own `const distHtml` (or the gates can be merged into a single `if/else` block sharing `distHtml`). Merging into one block is preferred to avoid reading `dist/index.html` twice.

**Merged single-block approach** (preferred — replaces lines 99–114 with the combined gate):
```javascript
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)');
  console.warn('⚠ FAQPage gate: dist/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');

  // @id fragment gate
  const restaurantId = '"@id":"https://spicegrillbar66.com/#restaurant"';
  const orgId = '"@id":"https://spicegrillbar66.com/#organization"';
  const missingIds = [];
  if (!distHtml.includes(restaurantId)) missingIds.push('#restaurant');
  if (!distHtml.includes(orgId)) missingIds.push('#organization');
  if (missingIds.length > 0) {
    console.error(`✗ @id gate: dist/index.html missing @id fragment(s): ${missingIds.join(', ')}`);
    errors++;
  } else {
    console.log('✓ @id gate: both #restaurant and #organization @id fragments found in dist/index.html');
  }

  // FAQPage Question count gate
  const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
  if (questionMatches.length !== 8) {
    console.error(`✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly 8`);
    errors++;
  } else {
    console.log('✓ FAQPage gate: dist/index.html contains exactly 8 Question entries');
  }
}
```

---

## Shared Patterns

### Inline JSON-LD Emission (all schema components)
**Source:** `src/components/schema/FAQSchema.astro` line 20 (also confirmed in RestaurantSchema.astro line 146, WebSiteSchema.astro line 20, BreadcrumbSchema.astro line 25, MenuSchema.astro line 36, OrganizationSchema.astro line 36)
**Apply to:** The new FAQPage inline script in `src/pages/index.astro`
```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### `@id` Fragment URL Convention
**Source:** `src/components/schema/RestaurantSchema.astro` line 21
**Apply to:** `src/components/schema/WebSiteSchema.astro` publisher `@id` value
```typescript
'@id': 'https://spicegrillbar66.com/#restaurant'   // existing — RestaurantSchema
'@id': 'https://spicegrillbar66.com/#organization'  // to add — WebSiteSchema publisher
```

### AEO Audit Gate Structure
**Source:** `scripts/aeo-audit.mjs` lines 97–114
**Apply to:** New FAQPage Question count gate
Pattern: `fs.existsSync` guard → `console.warn` skip → `fs.readFileSync` → string match → `errors++` on failure → `console.log` on pass.

### Geo Coordinate Separator Convention
**Source:** `src/layouts/Layout.astro` line 104 (meta tag uses `;`) vs `src/components/schema/RestaurantSchema.astro` lines 79–81 (GeoCoordinates uses separate properties)
**Apply to:** Both files in this phase — the separator format differs by context.
- `Layout.astro` geo.position meta: semicolons — `35.222908;-112.4781558`
- `RestaurantSchema.astro` GeoCoordinates: separate `latitude` / `longitude` properties — no separator character

---

## No Analog Found

None — all five files have strong existing analogs in the codebase.

---

## Metadata

**Analog search scope:** `src/layouts/`, `src/pages/`, `src/components/schema/`, `scripts/`
**Files read:** 6 (Layout.astro, index.astro, FAQSchema.astro, WebSiteSchema.astro, RestaurantSchema.astro, aeo-audit.mjs)
**Pattern extraction date:** 2026-05-14
