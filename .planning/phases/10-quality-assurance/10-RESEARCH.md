# Phase 10: Quality Assurance - Research

**Researched:** 2026-03-27
**Domain:** Lighthouse CI, axe-core accessibility, Playwright E2E animation testing
**Confidence:** HIGH

## Summary

Phase 10 is a verify-and-fix phase closing out the v2.0 Radiant Sommelier milestone. Three distinct QA tracks run in parallel: (1) Lighthouse CI performance/SEO gates on all 4 pages, (2) WCAG AA contrast verification in both light and dark modes, and (3) Playwright E2E animation tests for the three animated components. All tools are already installed or have clear installation paths. The only new dependency is `@playwright/test` (currently not in project `node_modules`).

The most technically interesting problem is dark-mode LHCI. The current `.lighthouserc.json` uses `staticDistDir`, which spins up its own local file server at a random port. Since HTML is served as static files, there is no runtime JavaScript executing to set the `.dark` class. The recommended approach is a second `.lighthouserc.dark.json` config that uses a `puppeteerScript` to inject `document.documentElement.classList.add('dark')` before Lighthouse audits. `puppeteer-core` is already present in `node_modules` as a transitive LHCI dependency. Alternatively, a custom `startServerCommand` serving pre-modified HTML avoids the puppeteer path entirely.

For contrast auditing in dark mode, the `axe` CLI cannot inject CSS classes — it runs against a live URL as-is. The practical solution is a custom Node.js script (`scripts/axe-dark.mjs`) that uses `playwright` to load each page, call `page.evaluate()` to add the `.dark` class, then inject and run `axe-core` programmatically. This pattern mirrors the existing `scripts/` convention and avoids a heavy Selenium setup.

**Primary recommendation:** Install `@playwright/test 1.58.2`, write Playwright config targeting `localhost:4321` (dev server), add a `puppeteerScript` for dark LHCI, and write a custom `scripts/axe-dark.mjs` using Playwright as the browser driver for dark mode contrast checks.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Contrast Verification (QA-02)**
- D-01: Run axe-core on all 4 pages in both light and dark mode. Any contrast failures get fixed in this phase.
- D-02: Contrast fixes must be token-level only — adjust M3 hex values in `globals.css` so fixes cascade everywhere. No per-component overrides. The design system must remain palette-swappable.

**Animation Verification (QA-03)**
- D-03: Write automated E2E tests using Playwright to verify tw-animate-css animations in Sheet, DropdownMenu, and MobileActionButtons. Tests should trigger open/close and confirm smooth transitions.
- D-04: Add `@playwright/test` as a dev dependency. Add `npm run test:e2e` as a standalone command.
- D-05: E2E animation tests are NOT added to the pre-push QA gate (`npm run qa`). They run as a separate manual command or in CI.

**Failure Remediation**
- D-06: Fix everything found — any Lighthouse threshold breach, contrast failure, or animation bug gets remediated before the phase closes.
- D-07: Claude fixes autonomously when token-level adjustments are needed (including changes to Phase 9 design decisions like surface colors). Trust Claude to maintain the Radiant Sommelier aesthetic while hitting contrast thresholds.

**Dark Mode Parity**
- D-08: Full parity testing — run Lighthouse + axe-core on all 4 pages in BOTH light and dark modes. Dark mode is not a second-class citizen.
- D-09: Add `npm run test:lhci:dark` as a separate command that runs LHCI with `class="dark"` injected on the html element. Keep the main `test:lhci` unchanged (light mode, fast).

### Claude's Discretion
- Specific Playwright test structure and assertion patterns
- How to inject dark mode class for LHCI dark runs (puppeteer script, LHCI plugin, or custom collect config)
- Order of verification steps (Lighthouse first vs contrast first)
- Whether to add Playwright to CI configuration or keep it local-only for now
- Specific token value adjustments when fixing contrast failures

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| QA-01 | Lighthouse CI passes on all 4 pages (LCP < 4s, TBT < 600ms, CLS < 0.1, Accessibility >= 90, SEO >= 90) | `.lighthouserc.json` already configured with correct thresholds; `npm run test:lhci` runs `lhci autorun` against `./dist`; LHCI 0.15.1 installed. No changes to existing config needed for light mode. |
| QA-02 | Both light and dark modes render correctly with WCAG AA contrast ratios | axe-core CLI 4.11.0 already installed; dark mode requires a custom `scripts/axe-dark.mjs` using Playwright to inject `.dark` class. All fixes go in `globals.css` `:root` / `.dark` blocks per D-02. |
| QA-03 | `tw-animate-css` animations verified in Sheet, DropdownMenu, and MobileActionButtons components | `@playwright/test` 1.58.2 not yet installed; needs `playwright.config.ts` + `e2e/` directory; dev server must be running on port 4321; Sheet uses `data-[state=open]:animate-in` Radix pattern. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@lhci/cli` | 0.15.1 | Lighthouse CI runner — already installed | Standard Lighthouse automation, already configured |
| `@axe-core/cli` | 4.11.0 | Automated WCAG accessibility auditing — already installed | Industry standard; CLI already wired to `npm run test:axe` |
| `@playwright/test` | 1.58.2 | E2E browser automation for animation tests | Decided in D-03/D-04; not yet installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `puppeteer-core` | (transitive, already present) | Browser control for LHCI dark mode injection | Used only by `puppeteerScript` in `.lighthouserc.dark.json` |
| `axe-core` | (via `@axe-core/cli` → `node_modules`) | Core accessibility engine, injectable via Playwright | Used in `scripts/axe-dark.mjs` programmatic invocation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `puppeteerScript` for dark LHCI | `startServerCommand` serving pre-modified HTML with `.dark` in `<html>` | `startServerCommand` is more complex to write; `puppeteerScript` is simpler once `puppeteer-core` is confirmed available |
| Custom `scripts/axe-dark.mjs` | Playwright axe integration via `@axe-core/playwright` | `@axe-core/playwright` is cleaner but adds a new dep; raw axe-core injection via `page.addScriptTag` works with what's already installed |

**Installation (new dependency only):**
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

**Version verification (confirmed 2026-03-27):**
- `@playwright/test`: 1.58.2 (confirmed via `npm view @playwright/test version`)
- `@lhci/cli`: 0.15.1 (confirmed in project `node_modules`)
- `@axe-core/cli`: 4.11.0 (confirmed in project `node_modules`)

## Architecture Patterns

### Recommended Project Structure

```
e2e/
├── animations.spec.ts       # Sheet, DropdownMenu, MobileActionButtons tests
playwright.config.ts         # Playwright config — targets localhost:4321
scripts/
├── axe-dark.mjs             # Custom dark mode contrast audit using Playwright
.lighthouserc.dark.json      # LHCI config variant for dark mode run
scripts/
├── lhci-dark-inject.cjs     # puppeteerScript: injects document.documentElement.classList.add('dark')
```

### Pattern 1: Playwright Animation Test Structure

**What:** Open an animated component, assert it becomes visible and has expected CSS animation class active, then close it and assert it closes.

**When to use:** For `data-[state=open]:animate-in` / `data-[state=closed]:animate-out` Radix patterns (Sheet, DropdownMenu) and `animate-in slide-in-from-bottom-4` static class (MobileActionButtons).

**Key insight about MobileActionButtons:** It uses `animate-in slide-in-from-bottom-4 duration-700 fade-in` as static classes applied on load — it does NOT open/close. The correct test is to assert it is visible and the animation class is present on the fixed element.

```typescript
// e2e/animations.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Sheet (mobile nav) animation', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // mobile viewport

  test('opens and closes with animation', async ({ page }) => {
    await page.goto('/');
    // Sheet is triggered by the mobile hamburger button
    const trigger = page.getByRole('button', { name: /menu/i });
    await trigger.click();
    // SheetContent uses data-[state=open]:animate-in
    const sheetContent = page.locator('[data-radix-dialog-content]');
    await expect(sheetContent).toBeVisible();
    await expect(sheetContent).toHaveAttribute('data-state', 'open');
    // Close via X button
    await page.getByRole('button', { name: /close/i }).click();
    await expect(sheetContent).not.toBeVisible();
  });
});

test.describe('DropdownMenu animation', () => {
  test('opens and closes with animation', async ({ page }) => {
    await page.goto('/');
    // ModeToggle trigger
    const trigger = page.getByRole('button', { name: /toggle theme/i });
    await trigger.click();
    const content = page.locator('[data-radix-dropdown-menu-content]');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('data-state', 'open');
    // Close by pressing Escape
    await page.keyboard.press('Escape');
    await expect(content).not.toBeVisible();
  });
});

test.describe('MobileActionButtons animation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('is visible on mobile with animation classes', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('.animate-in.slide-in-from-bottom-4');
    await expect(bar).toBeVisible();
  });
});
```

**Important:** Playwright respects `prefers-reduced-motion`. To test animations specifically, disable reduced motion in the Playwright config:
```typescript
// playwright.config.ts — set in context options
use: {
  reducedMotion: 'no-preference', // ensures animations run
}
```

### Pattern 2: Playwright Config for Local Dev Server

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4321',
    reducedMotion: 'no-preference',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
```

**`webServer` auto-start behavior:** Playwright spins up `npm run dev` automatically when running `npx playwright test`. `reuseExistingServer: !process.env.CI` means locally it reuses an already-running dev server (fast); in CI it always starts fresh.

### Pattern 3: LHCI Dark Mode via puppeteerScript

`staticDistDir` spins up its own local file server at a random port — the URLs in `.lighthouserc.json` get their port rewritten dynamically. A `puppeteerScript` runs before Lighthouse audits each page, allowing class injection:

```javascript
// scripts/lhci-dark-inject.cjs  (CommonJS — LHCI uses require())
/** @param {import('puppeteer').Browser} browser */
module.exports = async (browser, { url }) => {
  const page = await browser.newPage();
  await page.goto(url);
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.close();
};
```

```json
// .lighthouserc.dark.json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/", "/near-grand-canyon/", "/directions/", "/faq/"],
      "numberOfRuns": 3,
      "puppeteerScript": "./scripts/lhci-dark-inject.cjs"
    },
    "upload": { "target": "temporary-public-storage" },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 4000 }],
        "total-blocking-time": ["error", { "maxNumericValue": 600 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.8 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

**package.json script:**
```json
"test:lhci:dark": "lhci autorun --config=.lighthouserc.dark.json"
```

**Caveat:** Lighthouse runs in its own page context, separate from the puppeteerScript page. The class injected in the script page does NOT carry over to Lighthouse's audit page. This is a known LHCI limitation — the puppeteerScript is designed for authentication flows (setting cookies/localStorage), not CSS class injection across contexts. **The practical alternative:** Build a dark-variant `dist/` where `<html>` has `class="dark"` baked in via a post-build script.

### Pattern 3 (Revised): Dark LHCI via Post-Build HTML Modification

Since puppeteerScript's class injection does not persist into Lighthouse's audit context, the reliable approach is:

```javascript
// scripts/build-dark.mjs
// Run after `npm run build` to produce ./dist-dark/ with .dark class baked in
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = './dist';
const darkDistDir = './dist-dark';

await fs.cp(distDir, darkDistDir, { recursive: true });
const htmlFiles = await glob(`${darkDistDir}/**/*.html`);

for (const file of htmlFiles) {
  const content = await fs.readFile(file, 'utf8');
  const modified = content.replace('<html lang="en">', '<html lang="en" class="dark">');
  await fs.writeFile(file, modified);
}
```

```json
// .lighthouserc.dark.json — uses dist-dark instead
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist-dark",
      ...
    }
  }
}
```

```json
// package.json
"build:dark": "npm run build && node scripts/build-dark.mjs",
"test:lhci:dark": "npm run build:dark && lhci autorun --config=.lighthouserc.dark.json"
```

### Pattern 4: Axe Dark Mode Audit Script

The `axe` CLI opens URLs as-is — it cannot inject `.dark` class. A custom script using Playwright as the browser driver is the correct approach:

```javascript
// scripts/axe-dark.mjs
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';  // optional clean dep

// OR — raw injection approach (no extra dep):
import { chromium } from '@playwright/test';

const PAGES = ['/', '/near-grand-canyon/', '/directions/', '/faq/'];
const BASE = 'http://localhost:4321';

const browser = await chromium.launch();
let failures = 0;

for (const path of PAGES) {
  const page = await browser.newPage();
  await page.goto(`${BASE}${path}`);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(300); // allow CSS vars to apply

  // Inject axe-core and run
  await page.addScriptTag({ path: './node_modules/axe-core/axe.min.js' });
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, { runOnly: ['color-contrast'] });
  });

  if (results.violations.length > 0) {
    console.error(`DARK MODE CONTRAST FAILURES on ${path}:`);
    results.violations.forEach(v => {
      v.nodes.forEach(n => console.error(`  - ${n.html}`));
    });
    failures++;
  } else {
    console.log(`PASS: ${path} — no contrast violations in dark mode`);
  }
  await page.close();
}

await browser.close();
process.exit(failures > 0 ? 1 : 0);
```

**package.json addition:**
```json
"test:axe:dark": "node scripts/axe-dark.mjs"
```

**Note:** This script requires the dev server to be running on port 4321. Document this in the script header.

### Anti-Patterns to Avoid

- **Axe CLI for dark mode:** `axe http://localhost:4321 --tags wcag2aa` will test light mode only. The CLI has no flag to inject CSS classes. Do not use it for dark mode — use the custom script.
- **Per-component color overrides:** If contrast fails on a specific element, the fix MUST be in the `:root` or `.dark` block in `globals.css`, not as an inline `style` or direct class on the component (D-02).
- **Skipping `puppeteer-core` installation check:** `puppeteer-core` is already in `node_modules` as a transitive dep of `@lhci/cli`. Do not install `puppeteer` (the full package with bundled Chromium) — it is not needed.
- **Running Playwright against `dist/`:** Playwright animation tests MUST run against the dev server (`npm run dev`), not a static build. The `data-[state=open]` Radix attributes are set by React client-side; they require JS execution.
- **Forgetting `reducedMotion: 'no-preference'`:** Without this Playwright config option, the browser emulates `prefers-reduced-motion: reduce` by default, which can disable animations and cause false-negative test results.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contrast ratio calculation | Custom hex-to-WCAG calculator | axe-core via CLI or Playwright injection | axe-core computes WCAG 2.1 AA ratios for all text/bg pairs including CSS variable resolution |
| Browser automation for E2E | Selenium/WebDriver setup | `@playwright/test` (D-04 decision) | Playwright has first-class `webServer` integration, simpler API for Astro/React apps |
| HTML mutation for dark LHCI | Manual HTML editing | `scripts/build-dark.mjs` post-build script | Simple string replace; idempotent; keeps `./dist` unchanged |
| Animation presence assertions | pixel-diff screenshot comparison | Playwright `toHaveAttribute('data-state', 'open')` | Radix components set `data-state` attributes on open/close — more reliable than pixel comparison |

**Key insight:** Radix UI components expose `data-state="open"` / `data-state="closed"` as attributes. These are the canonical signal for animation state — `tw-animate-css` applies classes based on `data-[state=open]:` selectors. Testing `data-state` directly is more reliable than testing CSS animation class presence.

## Common Pitfalls

### Pitfall 1: puppeteerScript Class Injection Does Not Persist to Lighthouse

**What goes wrong:** Developer writes a `puppeteerScript` that calls `document.documentElement.classList.add('dark')` and assumes Lighthouse will audit the dark page. Lighthouse runs in its own fresh page context — the puppeteerScript context and the Lighthouse audit context are separate. The audit runs in light mode.

**Why it happens:** LHCI's `puppeteerScript` was designed for auth flows (setting cookies/localStorage tokens), not DOM mutation. Lighthouse launches its own page.

**How to avoid:** Use the `build-dark.mjs` post-build script to create a `./dist-dark/` directory with `.dark` baked into every HTML file's `<html>` tag. Point `.lighthouserc.dark.json` at `staticDistDir: ./dist-dark`.

**Warning signs:** Dark LHCI score matches light LHCI score identically on all metrics — this suggests dark mode was not actually applied.

### Pitfall 2: Axe CLI Cannot Test Dark Mode

**What goes wrong:** Developer runs `axe http://localhost:4321 --tags wcag2aa` expecting to catch dark mode contrast issues. The test passes even when dark mode has contrast failures.

**Why it happens:** Axe CLI opens the URL in Chrome headless — the page loads in light mode (no `.dark` class). The dark-mode tokens in `.dark {}` are never applied.

**How to avoid:** Use `scripts/axe-dark.mjs` (Playwright-based script) for dark mode contrast auditing. Run `npm run test:axe` for light mode and `npm run test:axe:dark` for dark mode.

**Warning signs:** All axe tests pass even though dark mode visually shows low-contrast text.

### Pitfall 3: Playwright Animation Tests Fail with Reduced Motion

**What goes wrong:** Playwright's default browser context emulates `prefers-reduced-motion: reduce`. Some browsers/CSS can disable `tw-animate-css` animations entirely when this media query is set. Tests that look for animation frame states may behave differently.

**Why it happens:** Playwright sets reduced motion by default to be accessibility-friendly.

**How to avoid:** Set `reducedMotion: 'no-preference'` in `playwright.config.ts` `use` block. Verified: `@playwright/test` 1.58.2 supports this option.

**Warning signs:** `animate-in` classes appear on elements but transitions complete instantly (zero duration).

### Pitfall 4: Sheet Trigger Selector Ambiguity on Mobile Viewport

**What goes wrong:** The Sheet trigger (hamburger menu) is hidden on desktop (`hidden md:flex` on the desktop nav). If the Playwright test runs at desktop viewport without setting mobile size, the trigger is not visible and `click()` throws.

**Why it happens:** The mobile Sheet is only shown on small viewports (the desktop nav is the alternative).

**How to avoid:** Use `test.use({ viewport: { width: 375, height: 812 } })` inside the Sheet test describe block, or set it globally in the config. Confirmed from `Header.tsx`: the Sheet is nested inside the mobile-only section.

**Warning signs:** `page.getByRole('button', { name: /menu/i })` returns a hidden element; Playwright throws `locator.click: element is not visible`.

### Pitfall 5: Contrast Failures Are Often in `on-surface-variant` Pairings

**What goes wrong:** The light mode `--on-surface-variant: #5c4038` on `--surface-container: #ffe9e4` may fail WCAG AA (4.5:1). Similarly in dark mode, secondary text on intermediate surface levels can fail.

**Why it happens:** M3 token palettes generated from warm seeds often produce mid-contrast pairs at the secondary/variant level. M3 spec does not guarantee WCAG AA for all token combinations — only the primary on-primary pairs.

**How to avoid:** Run axe against all 4 pages explicitly checking for `color-contrast` violations before assuming the palette is compliant. Fix at token level per D-02 — adjust the hex value of the problematic `on-*` token.

**Warning signs:** Axe reports `color-contrast` violations on `.text-on-surface-variant` elements (body text, subtitles, meta labels).

## Code Examples

Verified patterns from official sources and existing codebase:

### WCAG AA Contrast Check Command (Light Mode)

```bash
# Requires dev server running: npm run dev
npx axe http://localhost:4321 http://localhost:4321/near-grand-canyon/ http://localhost:4321/directions/ http://localhost:4321/faq/ --tags wcag2aa --exit
```

### Run Lighthouse CI (Light Mode — Existing)

```bash
npm run build && npm run test:lhci
```

### Run Lighthouse CI (Dark Mode — New)

```bash
npm run test:lhci:dark
# which runs: npm run build:dark && lhci autorun --config=.lighthouserc.dark.json
```

### Playwright Test for Sheet Open/Close State

```typescript
// From Radix Dialog data-state attribute pattern (source: radix-ui.com/docs/primitives/components/dialog)
const sheetContent = page.locator('[data-radix-dialog-content]');
await expect(sheetContent).toHaveAttribute('data-state', 'open');
```

### axe-core Token Fix Pattern (globals.css)

```css
/* If axe reports on-surface-variant fails contrast on surface-container-low: */
:root {
  /* Before: #5c4038 (may fail 4.5:1 on #fff1ed) */
  --on-surface-variant: #4a3028; /* darken until contrast passes */
}
.dark {
  /* Before: #e6beb3 (may fail on #2d1b17) */
  --on-surface-variant: #f0cec4; /* lighten until contrast passes */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `axe-cli` for all contrast testing | `axe-cli` (light) + custom Playwright script (dark) | Phase 10 introduces dark mode parity requirement | Dark mode now first-class QA citizen |
| Manual animation verification | Playwright E2E tests | Phase 10 per D-03/D-04 | Animation regressions caught in CI |
| Single LHCI config | Two configs: `lighthouserc.json` + `lighthouserc.dark.json` | Phase 10 per D-09 | Keeps `npm run qa` fast (light only) while enabling dark audits |

**Not deprecated:**
- `npm run test:lhci` (light mode) — unchanged, stays in pre-push hook
- `axe-core` CLI for light mode — unchanged

## Open Questions

1. **Does `puppeteer-core` version match what LHCI needs for `puppeteerScript`?**
   - What we know: `puppeteer-core` is present in `node_modules` as a transitive dep
   - What's unclear: Whether it is the version that LHCI's `puppeteer-manager.js` was written against
   - Recommendation: Use the `build-dark.mjs` approach (Pattern 3 Revised) to avoid puppeteer version dependency entirely. It is simpler and more reliable.

2. **Does the `<html>` element in Layout.astro have any dynamic class that could conflict with `.dark` injection?**
   - What we know: `Layout.astro` renders `<html lang="en">` — no dynamic class. Dark mode is toggled entirely via `document.documentElement.classList` in JS.
   - What's unclear: Whether Astro's `ClientRouter` (View Transitions) re-renders the `<html>` element and strips injected classes during navigation.
   - Recommendation: `build-dark.mjs` inserts `class="dark"` in the HTML file itself, so it is present before any JS runs. No conflict.

3. **Should Playwright tests be run in CI?**
   - What we know: D-05 defers this decision to Claude's discretion
   - What's unclear: Whether the project has a CI configuration file
   - Recommendation: Keep Playwright local-only for this phase. Do not add to `.github/workflows/` unless a workflow file already exists. The `npm run test:e2e` command is sufficient for manual and pre-release verification.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scripts | Yes | 22.13.1 | — |
| npm | Package install | Yes | 10.9.2 | — |
| `@lhci/cli` | QA-01, test:lhci | Yes (node_modules) | 0.15.1 | — |
| `@axe-core/cli` | QA-02 light, test:axe | Yes (node_modules) | 4.11.0 | — |
| `@playwright/test` | QA-03, test:e2e | No (not in node_modules) | — | Install: `npm i -D @playwright/test` |
| Chromium (Playwright) | QA-03, axe-dark.mjs | No (needs browser install) | — | Install: `npx playwright install chromium` |
| `puppeteer-core` | LHCI puppeteerScript | Yes (transitive dep) | present | Use build-dark.mjs instead (preferred) |
| `axe-core` (node_modules) | scripts/axe-dark.mjs | Yes (via @axe-core/cli dep) | 4.11.x | — |
| Chrome/Chromium | axe CLI, Playwright | Yes (system Playwright 1.58.2 is installed globally) | — | — |

**Missing dependencies with no fallback:**
- None that block core QA-01 or QA-02 light mode

**Missing dependencies with fallback:**
- `@playwright/test` in project: required for QA-03 and dark mode axe script. Install step is Wave 0.
- Chromium browser for Playwright: `npx playwright install chromium` after installing `@playwright/test`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `@playwright/test` 1.58.2 (to be installed) + `@lhci/cli` 0.15.1 (existing) + `@axe-core/cli` 4.11.0 (existing) |
| Config file | `playwright.config.ts` (Wave 0 — does not exist yet) |
| Quick run command | `npx playwright test` (after dev server started) |
| Full suite command | `npm run test:lhci && npm run test:lhci:dark && npm run test:axe && node scripts/axe-dark.mjs && npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QA-01 | LCP < 4s, TBT < 600ms, CLS < 0.1, A11y >= 0.9, SEO >= 0.9 on all 4 pages (light) | Performance/automated | `npm run test:lhci` | Yes (`.lighthouserc.json`) |
| QA-01 | Same thresholds in dark mode | Performance/automated | `npm run test:lhci:dark` | No — Wave 0: `.lighthouserc.dark.json` + `scripts/build-dark.mjs` |
| QA-02 | WCAG AA contrast on all 4 pages, light mode | Accessibility/automated | `npm run test:axe` | Yes (command exists, uses `@axe-core/cli`) |
| QA-02 | WCAG AA contrast on all 4 pages, dark mode | Accessibility/automated | `npm run test:axe:dark` | No — Wave 0: `scripts/axe-dark.mjs` |
| QA-03 | Sheet opens/closes with animation | E2E/automated | `npx playwright test e2e/animations.spec.ts` | No — Wave 0: `e2e/animations.spec.ts` |
| QA-03 | DropdownMenu opens/closes with animation | E2E/automated | `npx playwright test e2e/animations.spec.ts` | No — Wave 0: `e2e/animations.spec.ts` |
| QA-03 | MobileActionButtons visible with animation on mobile | E2E/automated | `npx playwright test e2e/animations.spec.ts` | No — Wave 0: `e2e/animations.spec.ts` |

### Sampling Rate
- **Per task commit:** `npm run test:lhci` (fast, existing, covers QA-01 light)
- **Per wave merge:** Full suite: all 6 commands from the table above
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `playwright.config.ts` — Playwright config targeting `localhost:4321` with `webServer` autostart
- [ ] `e2e/animations.spec.ts` — animation tests for Sheet, DropdownMenu, MobileActionButtons
- [ ] `.lighthouserc.dark.json` — LHCI config for dark mode using `staticDistDir: ./dist-dark`
- [ ] `scripts/build-dark.mjs` — post-build script to create `./dist-dark/` with `.dark` class
- [ ] `scripts/axe-dark.mjs` — dark mode contrast audit using Playwright + axe-core injection
- [ ] `package.json` script additions: `test:e2e`, `test:lhci:dark`, `test:axe:dark`, `build:dark`
- [ ] `@playwright/test` install: `npm install --save-dev @playwright/test && npx playwright install chromium`

## Project Constraints (from CLAUDE.md)

- **TailwindCSS v4** — CSS-first, no `tailwind.config.mjs`. All token fixes in `globals.css`.
- **Conventional commits enforced** — All commits must use `feat:`, `fix:`, `chore:`, etc.
- **Pre-push hook runs `npm run qa`** — `npm run qa` = `build + test:quality + test:lhci`. Do not break this. New commands (`test:e2e`, `test:lhci:dark`) must NOT be added to `qa` per D-05.
- **Lighthouse CI thresholds are hard requirements** — LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility >= 90, Best Practices >= 80, SEO >= 90.
- **No `--no-verify`** — Never skip git hooks.
- **M3 token architecture** — All contrast fixes in `:root` and `.dark` blocks only. No per-component style overrides.
- **`PUBLIC_GOOGLE_MAPS_API_KEY`** — Required in `.env` for the directions page. Dev server requires this for Google Maps. Axe and Playwright tests against the directions page need this set.
- **Glass budget** — Only Header, Sheet, DropdownMenu get `backdrop-blur`. Do not add blur to other elements during contrast fixes.
- **Orange budget** — `#FF4B12` / primary-container appears in max 4 contexts. Contrast fixes must not introduce new orange use-cases.

## Sources

### Primary (HIGH confidence)
- Direct inspection of `/Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@lhci/cli/src/collect/collect.js` — confirmed `staticDistDir` behavior, `puppeteerScript` signature, `puppeteer-core` dependency
- Direct inspection of `/Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@axe-core/cli/README.md` — confirmed CLI cannot inject classes; only URL-based testing
- Direct inspection of `src/components/ui/sheet.tsx` — confirmed `data-[state=open]:animate-in` pattern and `data-radix-dialog-content` attribute
- Direct inspection of `src/components/ui/dropdown-menu.tsx` — confirmed `data-radix-dropdown-menu-content` attribute and animate-in classes
- Direct inspection of `src/components/MobileActionButtons.astro` — confirmed static `animate-in slide-in-from-bottom-4 duration-700` classes (no open/close)
- Direct inspection of `src/components/Header.tsx` — confirmed Sheet trigger is mobile-only (hamburger button)
- `npm view @playwright/test version` — confirmed 1.58.2 (2026-03-27)

### Secondary (MEDIUM confidence)
- Playwright docs pattern for `webServer` config and `reducedMotion` option — from Playwright 1.58.x official documentation knowledge
- Radix UI `data-state` attribute convention — verified from component source code directly

### Tertiary (LOW confidence)
- Claim that LHCI `puppeteerScript` class injection does not persist to Lighthouse audit context — inferred from LHCI source code reading; not tested empirically. The `build-dark.mjs` workaround is recommended regardless.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified from `node_modules` and `npm view`
- Architecture patterns: HIGH — based on direct source code inspection of installed packages
- Pitfalls: HIGH (from source code) / MEDIUM (puppeteerScript limitation — inferred, not tested)
- Dark mode LHCI approach: MEDIUM — `build-dark.mjs` approach is reliable; puppeteerScript limitation is inferred

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable tooling; 30-day estimate)
