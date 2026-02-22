# Phase 3: FAQ Expansion - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Grow faq.json from 9 to 20 highway/route-targeted entries and verify FAQSchema renders all entries dynamically. Existing entries may be rewritten for AEO consistency. No new pages, no schema changes beyond FAQSchema rendering all entries.

</domain>

<decisions>
## Implementation Decisions

### Question Topics

- Claude picks the best distribution of 11 new entries across the required topic areas (I-40 exit, Grand Canyon, Las Vegas, Flagstaff, Phoenix, Kingman, Williams/Seligman pickup, road-tripper recs)
- Claude reviews existing 9 entries and rewrites any that don't meet the AEO answer-first/60-word standard
- Mix in voice-style phrasing for some entries to capture voice/assistant queries (natural spoken phrasing)
- Pickup for Williams/Seligman is **call-ahead only** — people call ahead and food is ready when they arrive at the restaurant (no delivery)
- Include a dedicated **RV/truck parking** entry — RV/truck parking is available across the road at the truck stop
- Include a dedicated **biker-friendly / Route 66 biker culture** entry
- Include a **spice levels / heat customization** entry for travelers unfamiliar with Indian food
- No holiday hours, peak times, reservations, or catering entries

### Answer Voice & Style

- **Friendly & factual** tone — warm but concise, lead with the fact, add one friendly detail, no marketing fluff
- **Mix first/third person** — use restaurant name ("Spice Grill & Bar") in the first sentence for AI extraction, then "we" for details
- **Friendly approximations** for distances — "about 70 miles, roughly an hour's drive" (not exact decimals)
- **Dish names without prices** in food recommendation answers — specific dishes but no dollar amounts (avoids maintenance burden)
- **Avoid the word "authentic"** — overused in restaurant marketing
- No other specific word rules — Claude uses good judgment

### FAQ Ordering

- **Reorder all 20 entries** as a fresh set — order by search intent priority regardless of old vs new
- **Keep faq.json simple** — just question + answer fields, no category or priority metadata
- Array position IS the priority order

### Keyword Targeting

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

</decisions>

<specifics>
## Specific Ideas

- RV/truck parking is across the road at the truck stop — important detail for the parking FAQ answer
- Call-ahead pickup only for Williams/Seligman — not delivery, not a physical pickup location in those towns
- Biker-friendly angle ties into Route 66 heritage — the existing parking FAQ already mentions motorcycle parking
- Voice-style questions should sound like someone asking a voice assistant ("Is there an Indian restaurant near the Grand Canyon?")
- Journey-intent phrasing for distance questions ("Where to eat between Las Vegas and the Grand Canyon?") rather than dry distance queries

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-faq-expansion_
_Context gathered: 2026-02-20_
