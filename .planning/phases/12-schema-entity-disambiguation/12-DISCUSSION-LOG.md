# Phase 12: Schema Entity Disambiguation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 12-schema-entity-disambiguation
**Areas discussed:** Google Maps URL in sameAs, CI enforcement gate, How the CI gate reads schema, Link tag placement in `<head>`

---

## Google Maps URL in sameAs

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse the short link | maps.app.goo.gl/q2EJFMbMRaysU6vH8 — already in OrganizationSchema, no lookup needed | |
| Expand to canonical CID URL | google.com/maps?cid=... — more stable for Knowledge Graph entity resolution | ✓ |

**User's choice:** Expand to canonical CID URL
**Notes:** CID URL looked up during discussion: `https://www.google.com/maps?cid=5034425112937519671` (derived from the short link redirect). User also confirmed that OrganizationSchema's existing sameAs Maps entry should be updated to the CID URL for consistency, since Phase 12 touches that file anyway.

---

## CI Enforcement Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Add a lightweight CI gate | aeo-audit.mjs checks @id fragments in rendered output | ✓ |
| TypeScript + code review only | @id is a static string, catches removals via TS | |

**User's choice:** Add a lightweight CI gate
**Notes:** Gate reads `dist/index.html` (not source files) to verify actual build output. Gracefully skips if `dist/` doesn't exist.

---

## How the CI Gate Reads Schema

| Option | Description | Selected |
|--------|-------------|----------|
| Read dist/index.html after build | Confirms actual rendered output; already available in npm run qa | ✓ |
| Read source schema files directly | Simpler but doesn't verify the Astro build emits them correctly | |

**User's choice:** Read dist/index.html after build
**Notes:** Gate increments shared `errors` counter (not throw). Skips with warning if `dist/index.html` doesn't exist (standalone `npm run test:aeo` without prior build).

---

## Link Tag Placement in `<head>`

| Option | Description | Selected |
|--------|-------------|----------|
| Replace in-place | Current line 70 changed, llms-full.txt added immediately after | ✓ |
| Move to end of `<head>` | Separate AI-discovery group before `</head>` | |

**User's choice:** Replace in-place
**Notes:** Keeps the discovery links co-located with canonical/manifest links at their current position.

---

## Claude's Discretion

- Field ordering within RestaurantSchema and OrganizationSchema (conventional JSON-LD puts `@id` near the top after `@context`/`@type`)
- Commit strategy (one atomic commit vs split by requirement)

## Deferred Ideas

None — discussion stayed within phase scope.
