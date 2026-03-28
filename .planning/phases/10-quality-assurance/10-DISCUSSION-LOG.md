# Phase 10: Quality Assurance - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 10-quality-assurance
**Areas discussed:** Contrast verification approach, Animation verification method, Failure remediation scope, Dark mode parity

---

## Contrast Verification Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Automated + fix | Run axe-core on all 4 pages in both modes. Fix contrast failures in this phase. | ✓ |
| Automated audit only | Run axe-core to generate a report, but don't fix failures. | |
| Manual spot-check | Visually inspect key pairs using browser DevTools contrast checker. | |

**User's choice:** Automated + fix
**Notes:** None

### Follow-up: Fix Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Token-level fixes only | Adjust M3 token hex values in globals.css so fixes cascade everywhere. | ✓ |
| Component overrides OK | Allow per-component contrast overrides when token changes affect others negatively. | |

**User's choice:** Token-level fixes only
**Notes:** Preserves palette-swappable design system architecture from Phase 8.

---

## Animation Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| Build + manual verify | Build site, manually trigger each animation, document pass/fail per component. | |
| CSS audit only | Grep for tw-animate-css class usage, verify correct classes applied. | |
| Automated E2E test | Write Playwright/Puppeteer tests that open each component and screenshot before/after. | ✓ |

**User's choice:** Automated E2E test
**Notes:** None

### Follow-up: E2E Framework

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright | Modern, fast, built-in screenshot comparison. Adds @playwright/test as dev dep. | ✓ |
| Puppeteer | Lighter weight, Chrome-only. Requires manual screenshot diffing setup. | |
| You decide | Claude picks best fit. | |

**User's choice:** Playwright
**Notes:** None

### Follow-up: QA Gate Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Separate command | Add npm run test:e2e as standalone. Keep npm run qa fast. | ✓ |
| Add to QA gate | Include E2E in npm run qa. Slower pre-push but catches regressions. | |
| You decide | Claude picks based on current pipeline speed. | |

**User's choice:** Separate command
**Notes:** None

---

## Failure Remediation Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Fix everything found | Any threshold breach, contrast failure, or animation bug gets fixed before phase closes. | ✓ |
| Fix critical only | Fix hard failures only. Log minor issues as tech debt. | |
| Verify only, log all | Purely diagnostic. Fixes happen in a follow-up phase. | |

**User's choice:** Fix everything found
**Notes:** Milestone should not ship with known regressions.

### Follow-up: Autonomy on Phase 9 Changes

| Option | Description | Selected |
|--------|-------------|----------|
| Claude fixes autonomously | Token adjustments maintaining Radiant Sommelier aesthetic are fine without asking. | ✓ |
| Flag for review | Any change touching Phase 9 design decisions must be flagged for approval. | |

**User's choice:** Claude fixes autonomously
**Notes:** Trust Claude to maintain visual intent while hitting contrast thresholds.

---

## Dark Mode Parity

| Option | Description | Selected |
|--------|-------------|----------|
| Full parity testing | Run Lighthouse + axe-core on all 4 pages in BOTH modes. | ✓ |
| Contrast-only for dark | Run axe-core contrast in dark mode, skip full Lighthouse. | |
| Spot-check dark mode | Manual verification only. Rely on M3 token auto-switching. | |

**User's choice:** Full parity testing
**Notes:** Dark mode is not a second-class citizen.

### Follow-up: LHCI Dark Config

| Option | Description | Selected |
|--------|-------------|----------|
| Separate command | Add npm run test:lhci:dark. Keep main test:lhci fast and unambiguous. | ✓ |
| Extend existing config | Add dark-mode URL variants to .lighthouserc.json. | |
| You decide | Claude picks cleanest integration approach. | |

**User's choice:** Separate command
**Notes:** None

---

## Claude's Discretion

- Specific Playwright test structure and assertion patterns
- How to inject dark mode class for LHCI dark runs
- Order of verification steps
- Whether to add Playwright to CI
- Specific token value adjustments for contrast fixes

## Deferred Ideas

None — discussion stayed within phase scope
