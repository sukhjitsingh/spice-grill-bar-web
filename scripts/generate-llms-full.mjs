#!/usr/bin/env node
/**
 * Regenerate the "## Full Menu" section of public/llms-full.txt from src/data/menu.json.
 *
 * Why: llms-full.txt is consumed by AI crawlers (GPTBot, ClaudeBot, etc.) and must stay
 * in lockstep with the canonical menu data in src/data/menu.json. Manual edits drift —
 * this script is the source of truth for that section.
 *
 * Hook: runs as `prebuild` so every `npm run build` produces a fresh menu section.
 *
 * Behavior:
 * - Reads src/data/menu.json (authoritative source)
 * - Reads public/llms-full.txt (everything BEFORE "## Full Menu" is preserved)
 * - Replaces "## Full Menu" through EOF with regenerated content
 * - Writes back to public/llms-full.txt
 * - Logs whether content changed
 *
 * Safety:
 * - Fails the build if menu.json is missing, malformed, or the marker isn't found
 * - Idempotent: re-running with no menu.json changes produces no diff
 * - Format matches existing convention: `- **Name** ($X.XX): Description.`
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const MENU_PATH = path.join(ROOT_DIR, 'src/data/menu.json');
const LLMS_PATH = path.join(ROOT_DIR, 'public/llms-full.txt');
const MARKER = '## Full Menu';

function generateMenuSection(menu) {
  let out = `${MARKER}\n\n`;
  for (const cat of menu) {
    if (!cat.category || !Array.isArray(cat.items)) {
      throw new Error(`Malformed menu.json category: ${JSON.stringify(cat).slice(0, 80)}`);
    }
    out += `### ${cat.category}\n`;
    for (const item of cat.items) {
      if (!item.name || typeof item.price !== 'number') {
        throw new Error(`Malformed menu.json item in "${cat.category}": ${JSON.stringify(item)}`);
      }
      const priceStr = `$${item.price.toFixed(2)}`;
      const desc = (item.description || '').trim();
      if (desc) {
        const punct = /[.!?]$/.test(desc) ? '' : '.';
        out += `- **${item.name}** (${priceStr}): ${desc}${punct}\n`;
      } else {
        out += `- **${item.name}** (${priceStr})\n`;
      }
    }
    out += '\n';
  }
  return out.replace(/\n+$/, '\n');
}

function main() {
  if (!fs.existsSync(MENU_PATH)) {
    console.error(`❌ ${path.relative(ROOT_DIR, MENU_PATH)} not found`);
    process.exit(1);
  }
  if (!fs.existsSync(LLMS_PATH)) {
    console.error(`❌ ${path.relative(ROOT_DIR, LLMS_PATH)} not found`);
    process.exit(1);
  }

  let menu;
  try {
    menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf-8'));
  } catch (err) {
    console.error(`❌ Failed to parse menu.json: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(menu) || menu.length === 0) {
    console.error('❌ menu.json must be a non-empty array of categories');
    process.exit(1);
  }

  const llms = fs.readFileSync(LLMS_PATH, 'utf-8');
  const idx = llms.indexOf(MARKER);
  if (idx === -1) {
    console.error(`❌ Marker "${MARKER}" not found in llms-full.txt — refusing to regenerate`);
    process.exit(1);
  }

  const before = llms.slice(0, idx);
  const newMenuSection = generateMenuSection(menu);
  const next = before + newMenuSection;

  if (next === llms) {
    const itemCount = menu.reduce((n, c) => n + c.items.length, 0);
    console.log(`✅ llms-full.txt menu section in sync (${itemCount} items, no changes)`);
    return;
  }

  fs.writeFileSync(LLMS_PATH, next);
  const itemCount = menu.reduce((n, c) => n + c.items.length, 0);
  console.log(`✅ llms-full.txt menu section regenerated (${itemCount} items written)`);
}

main();
