#!/usr/bin/env node
// Light mode WCAG AA contrast audit
// Requires: dev server running on localhost:4321
// Usage: node scripts/axe-light.mjs
// Or: npm run test:axe (after starting dev server)

import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PAGES = ['/', '/near-grand-canyon/', '/directions/', '/faq/'];
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

  // Inject and run axe-core
  await page.addScriptTag({ path: AXE_PATH });
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: ['color-contrast'],
      resultTypes: ['violations'],
    });
  });

  if (results.violations.length > 0) {
    console.error(
      `\nFAIL: ${pagePath} — ${results.violations[0].nodes.length} contrast violation(s) in light mode:`,
    );
    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        console.error(`  Element: ${node.html.substring(0, 120)}`);
        console.error(`  Issue: ${node.failureSummary.split('\n')[0]}`);
        console.error('');
      }
    }
    totalViolations += results.violations[0].nodes.length;
  } else {
    console.log(`PASS: ${pagePath} — no contrast violations in light mode`);
  }

  await page.close();
}

await browser.close();

if (totalViolations > 0) {
  console.error(`\n${totalViolations} total contrast violation(s) found in light mode.`);
  process.exit(1);
} else {
  console.log('\nAll 4 pages pass light mode contrast audit.');
  process.exit(0);
}
