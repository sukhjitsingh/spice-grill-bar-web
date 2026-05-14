# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v3.0 — AEO/GEO Refinement

**Shipped:** 2026-05-14
**Phases:** 1 (Phase 11) | **Plans:** 8 | **Sessions:** ~2

### What Was Built

- Monday hours data drift closed across RestaurantSchema, llms.txt, and llms-full.txt
- Owner-confirmed structured data: 8 payment methods, walk-in-only reservations, 7 amenities — all strictly sourced, nothing invented
- Kaibab Estates West direction corrected from "east on I-40" to "north of Ash Fork" — propagated to schema, FAQ, GEO page, and llms files
- Home page FAQPage + SpeakableSpecification for voice search extraction (8 visible FAQ entries)
- faq.json expanded from 21 → 34 voice-optimized entries (all under 50-word ceiling)
- `/near-williams/` GEO landing page targeting Williams tourists and Kaibab residents; wired to Footer, sitemap, Lighthouse CI
- 3 new CI-enforced AEO gates in aeo-audit.mjs — FAQ count, llms.txt section headers, robots.txt AI-bot allowlist
- Build-time llms-full.txt menu regeneration from menu.json — eliminates future price drift automatically

### What Worked

- **Owner-confirmation gate (Plan 11-01) as blocking wave**: Making downstream plans depend on the owner-confirmation file completely prevented inventing data. Zero Wi-Fi claims, zero wrong directions, zero incorrect payment methods. This pattern should be standard for any data-collection phase.
- **Integration checker surfaced a real gap**: The near-williams URL was missing from both llms files — only caught by the integration check, not the phase VERIFICATION.md. Running the integration check as a distinct step is worth it.
- **VERIFICATION.md-first approach**: Having a comprehensive VERIFICATION.md with programmatic spot-checks made the audit trivial — just cross-referencing against it.
- **Build-time automation (generate-llms-full.mjs)**: The price sync issues that triggered the post-execution fixes were a direct consequence of manual copy-paste in llms-full.txt. Automating the menu section at build time was the right call and will save time in every future milestone.

### What Was Inefficient

- **Post-execution price fixes**: The session after Phase 11 execution was mostly cleaning up stale prices that had already been there before v3.0 work. These should have been part of a pre-flight data-sync check in Phase 11 planning.
- **VALIDATION.md sign-off not automated**: Phase 11 VALIDATION.md was created correctly but `nyquist_compliant` was never set to `true` after execution. The sign-off step should be explicitly tracked in the final plan.
- **MILESTONES.md entry polluted by tools**: The CLI extracted one-liners from all phases (7-11) instead of only v3.0 phases. Required manual cleanup. The CLI's phase-scoping needs improvement for multi-milestone repos.

### Patterns Established

- **Owner-confirmation blocking gate**: For any phase that touches restaurant business data (hours, payment, amenities, directions), create a `*-OWNER-CONFIRMATION.md` gate file in the phase dir before any schema or content writes.
- **Integration checker post-execution**: Always run integration checker after phase execution for phases that create new pages — the page-URL-in-llms-files gap is easy to miss in a VERIFICATION.md focused on individual requirements.
- **Build-time generation for AI-docs menu sections**: Menu prices and items in `llms-full.txt` are now auto-generated from `menu.json` at build time. This pattern should extend to any other structured content that lives in both a data file and a prose doc.
- **ID-anchored SpeakableSpecification selectors**: Use `#section-id h3` / `#section-id p` as CSS selectors for SpeakableSpec — these survive Tailwind class changes. Established in Phase 11-06.

### Key Lessons

1. **Data that lives in multiple places will drift.** The Monday hours were in schema, llms.txt, llms-full.txt, and FAQ — all four drifted at different times. CI gates (AEO-09) are the only reliable fix. Any datum that exists in > 1 surface needs a CI gate or build-time generation.
2. **Never invent owner-confirmable business data.** Wi-Fi, payment methods, reservations — these seem obvious but planners readily fill in "likely" values. The blocking confirmation gate makes this structurally impossible to skip.
3. **Integration checking should be a standard milestone step, not an afterthought.** The llms URL gap was real and would have affected AI discoverability in production. The phase VERIFICATION.md did not catch it.
4. **MILESTONES.md entry quality depends on clean one-liner extraction from SUMMARYs.** When some SUMMARY.md files are missing `one_liner` fields, the CLI produces garbage output. Populate `one_liner` consistently or clean up manually — don't let it ship with "One-liner:" placeholders.

### Cost Observations

- Model mix: ~70% sonnet (subagents), ~30% opus (orchestration and verification)
- Sessions: ~2 primary sessions
- Notable: The owner-confirmation gate added ~30 min to planning but saved multiple rounds of correction. High ROI on blocking gates for data-sensitive phases.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Process Change |
|-----------|--------|-------|-------------------|
| v1.0 | 6 | 8 | Initial GSD workflow established |
| v2.0 | 4 | 15 | Full visual redesign; M3 token system introduced |
| v3.0 | 1 | 8 | Owner-confirmation blocking gate; build-time AI-doc generation; integration checker standard |

### Cumulative Quality

| Milestone | AEO Gates | Pages | Schema Requirements |
|-----------|-----------|-------|---------------------|
| v1.0 | 1 (50-word voice) | 4 | 17 |
| v2.0 | 1 (50-word voice) | 4 | 24 (visual/QA) |
| v3.0 | 4 (voice + count + sections + AI-bots) | 5 | 9 AEO + all prior |

### Top Lessons (Verified Across Milestones)

1. **Fix data before adding signals.** Phase order matters: v1.0 fixed NAP/hours drift before adding new schema; v3.0 fixed Monday drift before adding AEO signals. Getting this right upfront prevents cascade corrections.
2. **CI gates are the only reliable drift prevention.** Every milestone has had data drift somewhere. The only fix that scales is a failing CI gate, not manual review.
3. **Owner-confirmation before schema writes** — first demonstrated in v3.0, should be standard from v4.0 onward.
