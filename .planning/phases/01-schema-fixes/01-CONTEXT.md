# Phase 1: Schema Fixes - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Correct broken data in RestaurantSchema — hours, telephone, and URL — and sync any inconsistent data found in faq.json to match. No new schema signals or content ships in this phase. The goal is: clean, consistent, validated NAP data everywhere before any new SEO work builds on top of it.

</domain>

<decisions>
## Implementation Decisions

### Hours data

- Confirmed correct hours: Monday closed, Tuesday–Thursday 08:00–21:00, Friday–Sunday 08:00–22:00
- No seasonal or holiday exceptions — hours are consistent year-round
- Fix hours in both schema (structured data) AND visible UI (wherever hours are displayed to site visitors)
- Monday closure handling: Claude's discretion on whether to omit Monday or use explicit closed spec

### FAQ answer wording

- FAQ question text: "When is Spice Grill & Bar open?"
- Call out the Tue–Thu / Fri–Sun split explicitly: "Tue–Thu 8am–9pm, Fri–Sun 8am–10pm, closed Mondays"
- Use 12-hour time format (8am–9pm, not 08:00–21:00) in the human-readable FAQ text
- No CTA or extra context — state hours only, keep it clean
- Check faq.json to find the existing hours entry/entries and update in place (don't assume one vs. multiple)

### Other broken data

- Audit all faq.json entries for any data inconsistencies (wrong phone format, wrong URL, wrong hours anywhere)
- Fix any NAP inconsistencies found in faq.json even if not originally listed in requirements — NAP consistency across all files is the goal
- Validation approach: Claude's discretion (run test:aeo after fix to surface any failures)

### Phone & URL

- Phone: +1-928-277-1292 is the sole correct number — no other business numbers
- Fix phone format everywhere it appears: RestaurantSchema, faq.json answers, visible UI (header/footer), and any other schema components
- URL: Audit all URL references — canonical tag, sitemap, OG tags, and schema — fix all in one pass
- Canonical domain: roadmap specifies non-www (https://spicegrillbar66.com); www vs non-www status is unclear — use non-www per roadmap but note the server redirect situation may need manual verification

### Claude's Discretion

- How to represent Monday closure in openingHoursSpecification (omit vs. explicit closes 00:00)
- Which automated tests to run to verify the fix (test:aeo is a candidate)
- Whether to document the www/non-www redirect as a follow-up item if it can't be confirmed in code

</decisions>

<specifics>
## Specific Ideas

- The data fix must be complete and consistent before Phase 2 (Schema Additions) ships — this phase is the foundation
- Treat NAP consistency across ALL files as the definition of done, not just the three schema fields named in requirements

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-schema-fixes_
_Context gathered: 2026-02-20_
