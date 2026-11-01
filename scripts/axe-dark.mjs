#!/usr/bin/env node
// Dark mode accessibility audit: WCAG AA contrast plus the WCAG 2.1 A/AA rule set
// (ARIA validity, accessible names, alt text) behind PageSpeed's Agent Accessibility checks.
// Requires: dev server running on localhost:4321
// Usage: node scripts/axe-dark.mjs
// Or: npm run test:axe:dark (after starting dev server)

import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PAGES = [
  '/',
  '/near-grand-canyon/',
  '/near-williams/',
  '/directions/',
  '/faq/',
  '/events/',
  '/menu/',
];
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const BASE = 'http://localhost:4321';
const AXE_PATH = resolve('./node_modules/axe-core/axe.min.js');

// Verify axe-core exists
try {
  await readFile(AXE_PATH);
} catch {
  console.error('ERROR: axe-core not found at', AXE_PATH);
  console.error('Run: npm install');
  process.exit(1);
}

const browser = await chromium.launch();
let totalViolations = 0;

for (const pagePath of PAGES) {
  const page = await browser.newPage();
  const url = `${BASE}${pagePath}`;

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch (err) {
    console.error(`ERROR: Could not load ${url}. Is the dev server running? (npm run dev)`);
    await browser.close();
    process.exit(1);
  }

  // Inject dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(500); // Allow CSS variables to cascade

  // Inject axe-core, then run two passes: contrast, and the full WCAG A/AA rule set
  await page.addScriptTag({ path: AXE_PATH });
  const passes = await page.evaluate(async (tags) => {
    const contrast = await window.axe.run(document, {
      runOnly: ['color-contrast'],
      resultTypes: ['violations'],
    });
    const wcag = await window.axe.run(document, {
      runOnly: { type: 'tag', values: tags },
      rules: { 'color-contrast': { enabled: false } },
      resultTypes: ['violations'],
    });
    return { contrast: contrast.violations, wcag: wcag.violations };
  }, WCAG_TAGS);

  for (const [label, violations] of Object.entries(passes)) {
    const nodeCount = violations.reduce((n, v) => n + v.nodes.length, 0);
    if (nodeCount > 0) {
      console.error(`\nFAIL: ${pagePath} — ${nodeCount} ${label} violation(s) in dark mode:`);
      for (const violation of violations) {
        for (const node of violation.nodes) {
          console.error(`  [${violation.id}] ${node.html.substring(0, 120)}`);
          console.error(`  Issue: ${node.failureSummary.split('\n')[0]}`);
          console.error('');
        }
      }
      totalViolations += nodeCount;
    } else {
      console.log(`PASS: ${pagePath} — no ${label} violations in dark mode`);
    }
  }

  await page.close();
}

await browser.close();

if (totalViolations > 0) {
  console.error(`\n${totalViolations} total accessibility violation(s) found in dark mode.`);
  process.exit(1);
} else {
  console.log(`\nAll ${PAGES.length} pages pass dark mode contrast and WCAG A/AA audits.`);
  process.exit(0);
}
