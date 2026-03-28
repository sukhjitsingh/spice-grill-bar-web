# Phase 10: Quality Assurance - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify the redesigned site passes all automated quality gates and both visual modes are verifiably accessible. Run Lighthouse CI, WCAG AA contrast checks, and tw-animate-css animation tests across all 4 pages in both light and dark mode. Fix all failures found — this phase is verify-AND-fix, not verify-only. After this phase, all QA-01/QA-02/QA-03 requirements pass and the v2.0 milestone is shippable.

Requirements: QA-01, QA-02, QA-03

</domain>

<decisions>
## Implementation Decisions

### Contrast Verification (QA-02)
- **D-01:** Run axe-core on all 4 pages in both light and dark mode. Any contrast failures get fixed in this phase.
- **D-02:** Contrast fixes must be token-level only — adjust M3 hex values in `globals.css` so fixes cascade everywhere. No per-component overrides. The design system must remain palette-swappable.

### Animation Verification (QA-03)
- **D-03:** Write automated E2E tests using Playwright to verify tw-animate-css animations in Sheet, DropdownMenu, and MobileActionButtons. Tests should trigger open/close and confirm smooth transitions.
- **D-04:** Add `@playwright/test` as a dev dependency. Add `npm run test:e2e` as a standalone command.
- **D-05:** E2E animation tests are NOT added to the pre-push QA gate (`npm run qa`). They run as a separate manual command or in CI.

### Failure Remediation
- **D-06:** Fix everything found — any Lighthouse threshold breach, contrast failure, or animation bug gets remediated before the phase closes. The milestone should not ship with known regressions.
- **D-07:** Claude fixes autonomously when token-level adjustments are needed (including changes to Phase 9 design decisions like surface colors). Trust Claude to maintain the Radiant Sommelier aesthetic while hitting contrast thresholds.

### Dark Mode Parity
- **D-08:** Full parity testing — run Lighthouse + axe-core on all 4 pages in BOTH light and dark modes. Dark mode is not a second-class citizen.
- **D-09:** Add `npm run test:lhci:dark` as a separate command that runs LHCI with `class="dark"` injected on the html element. Keep the main `test:lhci` unchanged (light mode, fast).

### Claude's Discretion
- Specific Playwright test structure and assertion patterns
- How to inject dark mode class for LHCI dark runs (puppeteer script, LHCI plugin, or custom collect config)
- Order of verification steps (Lighthouse first vs contrast first)
- Whether to add Playwright to CI configuration or keep it local-only for now
- Specific token value adjustments when fixing contrast failures

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Quality Gate Configuration
- `.lighthouserc.json` — Current LHCI config: 4 URLs, 3 runs, threshold assertions (LCP < 4s, TBT < 600ms, CLS < 0.1, A11y >= 0.9, BP >= 0.8, SEO >= 0.9)
- `package.json` §scripts — All QA commands: `test:lhci`, `test:axe`, `test:quality`, `qa`

### Design System (Token Source of Truth)
- `src/styles/globals.css` — M3 token hex values in `:root` (light) and `.dark` (dark). All contrast fixes go here.
- `docs/DESIGN.md` — The Radiant Sommelier spec: surface hierarchy, no-line rule, blur budget, orange restraint

### Components Under Animation Test
- `src/components/ui/sheet.tsx` — Radix Sheet with tw-animate-css slide animation
- `src/components/ui/dropdown-menu.tsx` — Radix DropdownMenu with tw-animate-css
- `src/components/MobileActionButtons.astro` — Mobile CTA buttons with animation

### Requirements
- `.planning/REQUIREMENTS.md` §Quality Assurance — QA-01, QA-02, QA-03 acceptance criteria

### Prior Phase Context
- `.planning/phases/08-token-system/08-CONTEXT.md` — Token architecture: hex format, @theme inline, glass/gradient utilities
- `.planning/phases/09-visual-redesign/09-CONTEXT.md` — Visual decisions: orange restraint, no-border rule, surface alternation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `axe-core CLI` — Already installed (`npm run test:axe`), runs against localhost:4321
- `.lighthouserc.json` — LHCI config ready, tests all 4 pages with 3 runs each
- `scripts/` directory — Existing audit scripts (aeo-audit.mjs, security-scan.mjs) establish a pattern for custom QA scripts
- `src/components/mode-toggle.tsx` — Dark mode toggle, useful for manual verification

### Established Patterns
- QA pipeline: `npm run qa` = build + test:quality + test:lhci (pre-push hook)
- LHCI uses `staticDistDir: ./dist` — tests the production build directly, no dev server needed
- axe-core requires a running dev server on localhost:4321
- All M3 tokens in globals.css with `:root`/`.dark` blocks — single file for all contrast fixes

### Integration Points
- `package.json` scripts — New commands (`test:e2e`, `test:lhci:dark`) added here
- `.lighthouserc.json` — May need a dark-mode variant config file
- `globals.css` `:root` and `.dark` blocks — Where contrast fixes land

</code_context>

<specifics>
## Specific Ideas

- Token-level fixes only — never add per-component color overrides. The M3 system must stay palette-swappable per Phase 8 D-06.
- Playwright E2E tests should cover the three specific animated components: Sheet (mobile nav open/close), DropdownMenu (open/close), MobileActionButtons (appear/disappear).
- Dark mode LHCI should use the same thresholds as light mode — no relaxed standards for dark.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-quality-assurance*
*Context gathered: 2026-03-27*
