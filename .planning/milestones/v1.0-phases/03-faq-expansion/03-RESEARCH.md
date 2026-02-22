# Phase 3: FAQ Expansion - Research

**Researched:** 2026-02-20
**Domain:** Content authoring (faq.json) + Astro schema component audit (FAQSchema.astro)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Phase Boundary:**
- Grow faq.json from 9 to 20 highway/route-targeted entries and verify FAQSchema renders all entries dynamically.
- Existing entries may be rewritten for AEO consistency.
- No new pages, no schema changes beyond FAQSchema rendering all entries.

**Question Topics:**
- Claude picks the best distribution of 11 new entries across the required topic areas (I-40 exit, Grand Canyon, Las Vegas, Flagstaff, Phoenix, Kingman, Williams/Seligman pickup, road-tripper recs)
- Claude reviews existing 9 entries and rewrites any that don't meet the AEO answer-first/60-word standard
- Mix in voice-style phrasing for some entries to capture voice/assistant queries (natural spoken phrasing)
- Pickup for Williams/Seligman is **call-ahead only** — people call ahead and food is ready when they arrive at the restaurant (no delivery)
- Include a dedicated **RV/truck parking** entry — RV/truck parking is available across the road at the truck stop
- Include a dedicated **biker-friendly / Route 66 biker culture** entry
- Include a **spice levels / heat customization** entry for travelers unfamiliar with Indian food
- No holiday hours, peak times, reservations, or catering entries

**Answer Voice & Style:**
- **Friendly & factual** tone — warm but concise, lead with the fact, add one friendly detail, no marketing fluff
- **Mix first/third person** — use restaurant name ("Spice Grill & Bar") in the first sentence for AI extraction, then "we" for details
- **Friendly approximations** for distances — "about 70 miles, roughly an hour's drive" (not exact decimals)
- **Dish names without prices** in food recommendation answers — specific dishes but no dollar amounts (avoids maintenance burden)
- **Avoid the word "authentic"** — overused in restaurant marketing
- No other specific word rules — Claude uses good judgment

**FAQ Ordering:**
- **Reorder all 20 entries** as a fresh set — order by search intent priority regardless of old vs new
- **Keep faq.json simple** — just question + answer fields, no category or priority metadata
- Array position IS the priority order

**Keyword Targeting:**
- Target **both equally**: I-40 road trippers AND Grand Canyon visitors
- **Mix cuisine-specific and generic** phrasing — some entries target "Indian restaurant", others target broader "where to eat" / "food stop"
- **Target Williams & Seligman searches** AND Ash Fork + highway keywords — wide net
- **Route 66 mentioned in answers only**, not in question phrasing
- **"Where to eat between [city] and [destination]?"** pattern for city-distance questions — captures the journey intent
- **Anonymous discovery queries** cover: Grand Canyon proximity, I-40 Arizona food stops, and nearby-town searches (Williams, Seligman)
- **Mix branded and anonymous** questions — voice-style entries are anonymous (discovery), standard entries include restaurant name (branded intent)

### Claude's Discretion

- Exact distribution of 11 new entries across topic areas
- Which existing entries to rewrite vs keep as-is
- Where to include "I-40 Exit 146" (add value, don't be repetitive)
- Where to include subtle CTAs (phone, website) — only where they genuinely help answer the question
- Whether to add 'AZ'/'Arizona' in questions vs answers only
- Optimal ordering of all 20 entries by search intent priority
- Whether to add visual section groupings on the FAQ page or keep it as a flat list

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FAQ-01 | Expand `faq.json` from 9 to 20 questions by adding 11 highway/route-specific entries covering: I-40 exit number (Exit 146), distance and drive time from Grand Canyon South Rim (~70 mi / ~1 hr), Las Vegas, Flagstaff, Phoenix, Kingman; whether it's a good I-40 pitstop; pickup availability for Williams/Seligman; what to order for road-trippers | Content is authored directly in faq.json as plain JSON objects with `question` and `answer` fields. The AEO audit enforces ≤50 words per answer (the phase spec says ≤60 — the AEO test is the binding constraint at 50). All 9 existing entries currently pass; new entries must too. |
| FAQ-02 | Verify `FAQSchema.astro` renders all `faq.json` entries dynamically (no hardcoded question count or index limit) | FAQSchema.astro already uses `faqData.map()` with no hardcoded limit. Verification is a read + confirm task, not a code change. The faq.astro page also uses `.map()` with no limit. Both are already dynamic. |
</phase_requirements>

---

## Summary

Phase 3 is overwhelmingly a **content authoring** task. The codebase is already wired correctly: `FAQSchema.astro` uses `faqData.map()` with no hardcoded index or count, so it will automatically emit structured data for all entries once faq.json is updated. `faq.astro` is identically dynamic. FAQ-02 requires only a verification read — no code change is expected.

The substantive work is in FAQ-01: authoring 11 new faq.json entries, selectively rewriting any existing entries that fail the AEO word-count or answer-first style standard, and reordering all 20 entries by search intent priority. All 9 current entries already pass the AEO 50-word limit check. Several need style rewrites (answer-first principle, no use of "authentic", restaurant name in first sentence for AI extraction).

The AEO audit (`scripts/aeo-audit.mjs`) is the only automated test gate: it checks (1) each FAQ answer is ≤50 words and (2) `public/llms.txt` exists. The phase spec says "60 words or fewer" but the test enforces 50 — 50 is the binding constraint. New and rewritten answers must not exceed 50 words.

**Primary recommendation:** Author 11 new entries directly in faq.json, audit and rewrite non-compliant existing entries, then run `npm run test:aeo` to confirm all answers pass the 50-word gate. FAQSchema.astro requires only a brief read-and-confirm step — no code edits expected.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `src/data/faq.json` | n/a | Source of truth for all FAQ content | Single source consumed by FAQSchema.astro and faq.astro; no duplication |
| `src/components/schema/FAQSchema.astro` | n/a | Emits JSON-LD FAQPage structured data | Injected via Layout.astro; consumed by Google/AI engines |
| `src/pages/faq.astro` | n/a | Renders human-visible FAQ page | Imports same faq.json; fully dynamic via `.map()` |
| `scripts/aeo-audit.mjs` | n/a | AEO gate: validates ≤50 words per answer, checks llms.txt | Run via `npm run test:aeo`; CI gate on pre-push |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `schema-dts` | installed | TypeScript types for schema.org | Already used in FAQSchema.astro; ensures type safety |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain JSON faq.json | MDX / CMS-driven content | JSON is simpler, no new dependencies, already working |
| Dynamic `.map()` | Hardcoded question count | Hardcoded is anti-pattern; `.map()` is already in place |

**Installation:** No new packages needed. This phase is pure content + verification.

---

## Architecture Patterns

### Existing Project Structure (relevant files)

```
src/
├── data/
│   └── faq.json              # ← THE file being edited (9 → 20 entries)
├── components/
│   └── schema/
│       └── FAQSchema.astro   # ← Verify dynamic rendering (already correct)
└── pages/
    └── faq.astro             # ← Renders FAQ page (already dynamic)

scripts/
└── aeo-audit.mjs             # ← AEO test gate (≤50 words, llms.txt check)
```

### Pattern 1: faq.json Structure

**What:** Each entry is a plain object with exactly two fields: `question` and `answer`. No metadata, no category, no priority — per locked decision.

**Example (current correct structure):**
```json
[
  {
    "question": "Where is Spice Grill & Bar located?",
    "answer": "Spice Grill & Bar is at 33 Lewis Ave, Ash Fork, AZ 86320, right on I-40 Exit 146 and historic Route 66 — a perfect pitstop for Grand Canyon visitors."
  }
]
```

**Rules:**
- `question` field: the search query phrasing (voice-style or branded)
- `answer` field: answer-first, fact in first sentence, ≤50 words (AEO test limit), restaurant name in first sentence, "we" after that, no prices, no "authentic"

### Pattern 2: FAQSchema.astro — Dynamic Map (already implemented correctly)

```astro
// Source: src/components/schema/FAQSchema.astro (lines 8-16)
mainEntity: faqData.map((item) => ({
  '@type': 'Question',
  name: item.question,
  acceptedAnswer: {
    '@type': 'Answer',
    text: item.answer,
  },
})),
```

No index limit exists. Adding entries to faq.json automatically expands the schema output.

### Pattern 3: Answer-First AEO Style

**What:** Lead with the core fact; never start with "Yes, we..." before the fact. Restaurant name in first sentence for AI entity recognition.

**Wrong (currently in Q1):**
```
"Spice Grill & Bar serves authentic Punjabi Indian cuisine, featuring Tandoori specialties, rich curries, and freshly baked naans, blending traditional spices with modern culinary excellence."
```
Issues: uses "authentic" (banned), ends with marketing fluff ("culinary excellence"), doesn't lead with a crisp fact.

**Correct pattern:**
```
"Spice Grill & Bar is an Indian restaurant in Ash Fork, AZ, serving Punjabi curries, Tandoori dishes, and fresh naan. We're known for Butter Chicken, Goat Curry, and Shahi Paneer."
```

### Pattern 4: Distance/Journey-Intent Questions

**What:** Capture the traveler's journey mental model ("Where to eat between X and Y?") rather than dry distance queries.

**Question phrasing:**
- "Where to eat between Las Vegas and the Grand Canyon?" (journey intent)
- "Is there an Indian restaurant near the Grand Canyon?" (voice/discovery intent)
- "How far is Spice Grill & Bar from the Grand Canyon?" (branded intent)

**Answer pattern for distances:**
```
"Spice Grill & Bar is about 70 miles from the Grand Canyon South Rim, roughly an hour's drive via AZ-64 and I-40. It's an easy stop on the way — take I-40 Exit 146 in Ash Fork."
```

### Anti-Patterns to Avoid

- **Hardcoded index limit:** Never add `faqData.slice(0, N)` or index checks — already absent, keep it that way
- **Using "authentic":** Banned per locked decision — use specific dish names instead
- **Prices in answers:** No dollar amounts — avoids future maintenance burden
- **Exceeding 50 words:** AEO test hard-limits at 50 (not the phase spec's 60) — verify word counts before finalizing
- **Route 66 in questions:** Route 66 goes in answers only, not in question phrasing
- **"Yes, we..." openers:** Start with the fact, not an affirmation
- **Delivery framing for Williams/Seligman:** It's call-ahead pickup at the restaurant — never say "delivery"

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Word count validation | Manual counting | AEO audit script | `npm run test:aeo` already counts words and exits non-zero on failure |
| Schema dynamic rendering | Array index guards | Existing `.map()` pattern | Already implemented correctly; no code change needed |
| FAQ page rendering | Custom loop | Existing faq.astro `.map()` | Already fully dynamic |

**Key insight:** Both schema and page rendering are already correct. The only deliverable is the faq.json content itself plus confirming the audit passes.

---

## Common Pitfalls

### Pitfall 1: AEO Audit Word Count Constraint vs Phase Spec

**What goes wrong:** Phase spec says "60 words or fewer" but `aeo-audit.mjs` fails at >50 words.
**Why it happens:** The audit was written independently of the phase spec.
**How to avoid:** Use 50 as the hard limit when authoring answers. Aim for 35-45 words — leaves a comfortable buffer.
**Warning signs:** Any answer approaching 47+ words — count manually before finalizing.

### Pitfall 2: Existing Entry 1 Uses "authentic"

**What goes wrong:** Q1 ("What type of food...") currently uses the word "authentic" — banned per locked decision.
**Why it happens:** Legacy content from before the style guidelines were set.
**How to avoid:** This entry needs a rewrite. Confirm no other existing entries use the word.
**Current text:** "Spice Grill & Bar serves authentic Punjabi Indian cuisine..." — must change.

### Pitfall 3: "I-40 Exit 146" Repetition

**What goes wrong:** If Exit 146 appears in every distance-related answer, it becomes noisy and repetitive.
**Why it happens:** It's a critical keyword for AEO, so the instinct is to include it everywhere.
**How to avoid:** Include Exit 146 in the location/pitstop entries (2-3 max) where it naturally answers the question. For pure distance entries, focus on the distance fact first.

### Pitfall 4: Ordering Fails to Surface High-Intent Queries First

**What goes wrong:** High-traffic discovery queries (Grand Canyon proximity, I-40 pitstop) get buried after branded queries.
**Why it happens:** Natural tendency to put "What is this restaurant?" first.
**How to avoid:** Schema.org FAQPage gives weight to earlier entries in some implementations. Prioritize: (1) location/pitstop/discovery, (2) highway-specific distances, (3) cuisine/food, (4) operational details.

### Pitfall 5: Call-Ahead Pickup Misrepresented

**What goes wrong:** Williams/Seligman pickup answer implies a physical pickup location in those towns or implies delivery.
**Why it happens:** "Pickup for Williams/Seligman" could be read either way.
**How to avoid:** Answer must explicitly say: call ahead, order is ready when they arrive at the restaurant in Ash Fork. No delivery. No separate pickup location.

### Pitfall 6: FAQSchema in Wrong Layout Context

**What goes wrong:** Assuming FAQSchema.astro is only injected on faq.astro — it's injected via Layout.astro (on all pages).
**Why it happens:** Easy to miss the injection point.
**How to verify:** Check Layout.astro to confirm FAQSchema is imported and rendered globally, meaning expanding faq.json affects every page's structured data output.

---

## Code Examples

### Current FAQSchema.astro (verified — no changes needed)

```astro
// Source: src/components/schema/FAQSchema.astro
---
import type { FAQPage, WithContext } from 'schema-dts';
import faqData from '../../data/faq.json';

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
---

<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

This is correct. No modification needed.

### AEO Audit Check Logic (verified from scripts/aeo-audit.mjs)

```javascript
// Fails if any answer exceeds 50 words — binding constraint
const wordCount = item.answer.split(/\s+/).length;
if (wordCount > 50) {
  // error logged, errors++
}
```

The test does NOT validate answer-first phrasing, restaurant name presence, or keyword targeting — those are authoring discipline only, not automated checks.

### Existing Entries — AEO Status (verified by word count)

| # | Question | Words | AEO Pass | Style Issue |
|---|----------|-------|----------|-------------|
| 1 | What type of food does Spice Grill & Bar serve? | 25 | YES | Uses "authentic" — needs rewrite |
| 2 | What are the operating hours? | 6 | YES | None — clean |
| 3 | Vegetarian or vegan options? | 26 | YES | Uses "authentic" — needs rewrite |
| 4 | Where is Spice Grill & Bar located? | 29 | YES | Starts with "We are" not restaurant name — minor |
| 5 | Do you offer takeout or delivery? | 19 | YES | None — clean |
| 6 | Is there parking available? | 20 | YES | Mentions biker-friendly but no RV/truck — separate entry will cover RV |
| 7 | Does Spice Grill & Bar serve alcohol? | 16 | YES | None — clean |
| 8 | What are the most popular dishes? | 23 | YES | None — clean |
| 9 | Is Spice Grill & Bar kid-friendly? | 23 | YES | None — clean |

**Entries requiring rewrite:** Q1 (uses "authentic"), Q3 (uses "authentic"), Q4 (starts "We are" — minor, can fix or leave).

### Proposed Topic Distribution for 11 New Entries

Based on CONTEXT.md locked decisions, the 11 new entries should cover:

| # | Topic | Question Style | Intent |
|---|-------|---------------|--------|
| 10 | Grand Canyon distance/drive time | Voice/discovery | "Is there an Indian restaurant near the Grand Canyon?" |
| 11 | I-40 pitstop | Journey | "Is Spice Grill & Bar a good I-40 food stop?" |
| 12 | Grand Canyon distance (branded) | Distance fact | "How far is Spice Grill & Bar from the Grand Canyon?" |
| 13 | Las Vegas distance | Journey intent | "Where to eat between Las Vegas and the Grand Canyon?" |
| 14 | Flagstaff proximity | Journey intent | "Where to eat between Flagstaff and the Grand Canyon?" |
| 15 | Phoenix distance | Journey intent | "Is Spice Grill & Bar a good stop from Phoenix?" |
| 16 | Kingman proximity | Journey intent | "Where to eat between Kingman and the Grand Canyon?" |
| 17 | Williams/Seligman pickup | Operational | "Can I order ahead from Williams or Seligman?" |
| 18 | Road-tripper dish recommendations | Food/discovery | "What should I order if I've never had Indian food?" |
| 19 | RV/truck parking | Practical | "Is there RV or truck parking near Spice Grill & Bar?" |
| 20 | Biker-friendly / Route 66 culture | Practical/discovery | "Is Spice Grill & Bar biker-friendly?" |
| +1 | Spice levels / heat customization | Food/discovery | "Can I customize how spicy my food is?" |

Note: The above is 12 slots for 11 entries — the planner/executor will select the best 11 and resolve the overlap (the biker-friendly entry partially overlaps with existing Q6 parking entry, so Q6 may be merged/replaced rather than kept alongside a new biker entry).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded FAQ count in schema | Dynamic `.map()` | Already implemented | Adding entries to faq.json is sufficient — no schema code change |
| Generic FAQs (hours, menu) | Highway/route-targeted AEO questions | Phase 3 goal | Directly answers queries AI engines surface for road-tripper intent |

**Deprecated/outdated:**
- No deprecated patterns found in this phase's scope.

---

## Open Questions

1. **Q6 (Parking) vs New Biker Entry overlap**
   - What we know: Q6 mentions "biker-friendly destination with space for motorcycles" — basic coverage exists
   - What's unclear: Whether to keep Q6 as-is + add a richer biker/Route 66 entry, or rewrite Q6 to cover both parking and biker culture
   - Recommendation: Rewrite Q6 to cover practical parking (including RV at truck stop) and add a separate biker/Route 66 culture entry for the cultural angle — these serve different search intents

2. **Spice/heat entry vs road-tripper food entry**
   - What we know: CONTEXT.md mandates both a spice levels entry AND a road-tripper dish recommendation entry (plus the existing Q8 popular dishes)
   - What's unclear: How to avoid Q8 (popular dishes) and a new road-tripper recs entry being redundant
   - Recommendation: Keep Q8 for branded "most popular dishes" queries; make the new road-tripper entry explicitly address "never had Indian food before" framing — different audience, different angle

3. **Layout.astro FAQSchema injection scope**
   - What we know: FAQSchema.astro is imported in Layout.astro, making it global
   - What's unclear: Whether injecting 20 FAQ entries on non-FAQ pages is desirable vs limiting to faq.astro only
   - Recommendation: Verify Layout.astro injection during FAQ-02 verification. If FAQSchema is on all pages, that's worth flagging — Google may penalize FAQ schema on pages where FAQ content isn't visible. However, since this is the current behavior and not a Phase 3 change, log it as a future concern rather than a blocker.

---

## Sources

### Primary (HIGH confidence)

- Direct file inspection: `src/data/faq.json` — 9 entries, all ≤50 words, 2 entries use "authentic"
- Direct file inspection: `src/components/schema/FAQSchema.astro` — confirmed dynamic `.map()`, no hardcoded limit
- Direct file inspection: `src/pages/faq.astro` — confirmed dynamic `.map()`, no hardcoded limit
- Direct file inspection: `scripts/aeo-audit.mjs` — confirmed 50-word limit (not 60), confirms llms.txt check
- `src/data/faq.json` word-count verification via Node.js — all 9 entries pass 50-word gate

### Secondary (MEDIUM confidence)

- `.planning/REQUIREMENTS.md` — FAQ-01, FAQ-02 requirement text
- `.planning/phases/03-faq-expansion/03-CONTEXT.md` — all locked decisions and style guidance
- `.planning/STATE.md` — project position, accumulated decisions

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all files inspected directly, no assumptions
- Architecture: HIGH — dynamic `.map()` pattern confirmed in both FAQSchema.astro and faq.astro
- Pitfalls: HIGH — AEO word limit verified against actual audit script (50 words, not 60 as phase spec states)
- Content authoring guidance: MEDIUM — topic distribution and ordering recommendations follow CONTEXT.md decisions, but final distribution is Claude's discretion

**Research date:** 2026-02-20
**Valid until:** 2026-04-20 (content/data patterns; stable until faq.json schema or audit script changes)
