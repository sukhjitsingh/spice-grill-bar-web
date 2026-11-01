import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const FAQ_PATH = path.join(ROOT_DIR, 'src/data/faq.json');

console.log('🔍 Starting AEO (Answer Engine Optimization) Audit...\n');

let errors = 0;

// 1. Check FAQ Answer Length (Voice Search Optimization)
// Google Assistant/Siri prefer answers under 40-50 words.
try {
  if (fs.existsSync(FAQ_PATH)) {
    const faqData = JSON.parse(fs.readFileSync(FAQ_PATH, 'utf-8'));
    console.log(`Checking ${faqData.length} FAQ items for Voice Readiness...`);

    faqData.forEach((item, index) => {
      const wordCount = item.answer.trim().split(/\s+/).length;
      if (wordCount > 50) {
        console.error(
          `❌ [FAQ #${index + 1}] Answer too long for Voice Search (${wordCount} words). Target < 50.`
        );
        console.error(`   Question: "${item.question}"`);
        errors++;
      } else {
        console.log(`✅ [FAQ #${index + 1}] Optimized (${wordCount} words).`);
      }
    });

    // FAQ Count Gate (≥34 entries required for v3.0 AEO coverage)
    if (faqData.length < 34) {
      console.error(`❌ FAQ count is ${faqData.length}, expected ≥34`);
      errors++;
    } else {
      console.log(`✅ FAQ count: ${faqData.length} entries (target ≥34).`);
    }
  } else {
    console.warn('⚠️ FAQ Data not found. Skipping FAQ check.');
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('❌ Failed to parse FAQ data:', msg);
  errors++;
}

// 2. Check llms.txt Existence + Required Sections (AI Agent Readiness)
const LLMS_TXT_PATH = path.join(ROOT_DIR, 'public/llms.txt');
if (fs.existsSync(LLMS_TXT_PATH)) {
  console.log('✅ llms.txt found (AI Agent Discovery enabled).');

  // llms.txt Section Gate (v3.0 AEO refinement — required H2 sections must remain)
  const llmsContent = fs.readFileSync(LLMS_TXT_PATH, 'utf-8');
  const requiredSections = [
    '## Payment Methods',
    '## Reservation Policy',
    '## Delivery', // matches "## Delivery & Takeout"
    '## Amenities',
    '## Dietary', // matches "## Dietary Options"
  ];
  const missing = requiredSections.filter((s) => !llmsContent.includes(s));
  if (missing.length > 0) {
    console.error(`❌ llms.txt missing required sections: ${missing.join(', ')}`);
    errors++;
  } else {
    console.log('✅ llms.txt contains all required sections.');
  }
} else {
  console.error('❌ llms.txt missing in public/. Required for AI search visibility.');
  errors++;
}

// 2b. Check llms-full.txt Existence (AI Agent Readiness — full site content mirror)
const LLMS_FULL_PATH = path.join(ROOT_DIR, 'public/llms-full.txt');
if (fs.existsSync(LLMS_FULL_PATH)) {
  console.log('✅ llms-full.txt found (full AI content mirror enabled).');
} else {
  console.error(
    '❌ llms-full.txt missing in public/. Required for AI crawlers (linked from <head>).'
  );
  errors++;
}

// 2c. llms.txt format gate — llmstxt.org Markdown format, which Lighthouse's Agentic Browsing
// "llms.txt does not follow recommendations" audit checks: an H1, a "> " summary, and links
// written as Markdown links. Bare URLs count as no links at all.
const MD_LINK_RE = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g;
for (const [label, file, minLinks, needsSummary] of [
  ['llms.txt', LLMS_TXT_PATH, 8, true],
  ['llms-full.txt', LLMS_FULL_PATH, 8, false],
]) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf-8');
  const lines = text.split('\n');
  const problems = [];
  if (!lines[0].startsWith('# ')) problems.push('first line is not an H1');
  if (needsSummary && !lines.slice(1, 5).some((line) => line.startsWith('> ')))
    problems.push('no "> " summary within the first 5 lines');
  const linkCount = (text.match(MD_LINK_RE) || []).length;
  if (linkCount < minLinks) problems.push(`${linkCount} Markdown links (need ≥${minLinks})`);
  const bare = text.replace(MD_LINK_RE, '').match(/https?:\/\/\S+/g) || [];
  if (bare.length > 0) problems.push(`bare URLs not in Markdown links: ${bare.join(', ')}`);
  if (label === 'llms.txt' && !text.includes('](https://spicegrillbar66.com/llms-full.txt)'))
    problems.push('no link to llms-full.txt');
  if (problems.length > 0) {
    console.error(`❌ ${label} format: ${problems.join('; ')}`);
    errors++;
  } else {
    console.log(`✅ ${label} format: H1, ${linkCount} Markdown links, no bare URLs`);
  }
}

// 3. robots.txt AI-bot Allowlist Gate (forward-protection — current file already passes)
const ROBOTS_PATH = path.join(ROOT_DIR, 'public/robots.txt');
if (fs.existsSync(ROBOTS_PATH)) {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
  const requiredBots = [
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
    'OAI-SearchBot',
    'Claude-SearchBot',
    'Claude-User',
    'Perplexity-User',
    'Applebot-Extended',
    'bingbot',
  ];
  for (const bot of requiredBots) {
    // Match `User-agent: <bot>` followed by `Allow: /` (allow blank/comment lines between)
    const re = new RegExp(`User-agent:\\s*${bot}\\s*\\n(?:#[^\\n]*\\n|\\s*\\n)*Allow:\\s*/`, 'i');
    if (!re.test(robotsContent)) {
      console.error(`❌ robots.txt: ${bot} missing Allow: / directive`);
      errors++;
    } else {
      console.log(`✅ robots.txt: ${bot} allowed.`);
    }
  }
} else {
  console.error('❌ robots.txt missing in public/.');
  errors++;
}

// 4. @id fragment gate + FAQPage Question count gate — verifies build output (dist/index.html read once)
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (!fs.existsSync(distIndexPath)) {
  console.warn(
    '⚠️ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)'
  );
  console.warn(
    '⚠️ FAQPage gate: dist/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');

  // @id fragment gate
  const restaurantId = '"@id":"https://spicegrillbar66.com/#restaurant"';
  const orgId = '"@id":"https://spicegrillbar66.com/#organization"';
  const missingIds = [];
  if (!distHtml.includes(restaurantId)) missingIds.push('#restaurant');
  if (!distHtml.includes(orgId)) missingIds.push('#organization');
  if (missingIds.length > 0) {
    console.error(`❌ @id gate: dist/index.html missing @id fragment(s): ${missingIds.join(', ')}`);
    errors++;
  } else {
    console.log(
      '✅ @id gate: both #restaurant and #organization @id fragments found in dist/index.html'
    );
  }

  // FAQPage gate — the home page must emit exactly ONE FAQPage holding exactly the
  // visible home-FAQ questions. Google requires FAQ markup to match visible content;
  // the full 36-question FAQSchema belongs on /faq/ only (see Layout.astro).
  // KEEP IN SYNC with homeFaqIndices.length in src/pages/index.astro (currently 8).
  const HOME_FAQ_QUESTIONS = 8;
  const faqPageCount = (distHtml.match(/"@type":"FAQPage"/g) || []).length;
  const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
  if (faqPageCount !== 1) {
    console.error(
      `❌ FAQPage gate: dist/index.html has ${faqPageCount} FAQPage blocks, expected exactly 1 (FAQSchema must not be injected on /)`
    );
    errors++;
  } else if (questionMatches.length !== HOME_FAQ_QUESTIONS) {
    console.error(
      `❌ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly ${HOME_FAQ_QUESTIONS} (matches homeFaqIndices in src/pages/index.astro)`
    );
    errors++;
  } else {
    console.log(
      `✅ FAQPage gate: dist/index.html has 1 FAQPage with ${questionMatches.length} Question entries`
    );
  }
}

// 5. FAQ Speakable gate — verifies SpeakableSpecification present in dist/faq/index.html (AEO-12)
const distFaqPath = path.join(ROOT_DIR, 'dist/faq/index.html');
if (!fs.existsSync(distFaqPath)) {
  console.warn(
    '⚠️ FAQ Speakable gate: dist/faq/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distFaqHtml = fs.readFileSync(distFaqPath, 'utf-8');
  if (!distFaqHtml.includes('SpeakableSpecification')) {
    console.error('❌ FAQ Speakable gate: SpeakableSpecification not found in dist/faq/index.html');
    errors++;
  } else {
    console.log('✅ FAQ Speakable gate: SpeakableSpecification found in dist/faq/index.html');
  }
}

// 6. HowTo schema gate — verifies HowTo present in dist/directions/index.html (AEO-14)
const distDirectionsPath = path.join(ROOT_DIR, 'dist/directions/index.html');
if (!fs.existsSync(distDirectionsPath)) {
  console.warn(
    '⚠️ HowTo gate: dist/directions/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distDirectionsHtml = fs.readFileSync(distDirectionsPath, 'utf-8');
  if (!distDirectionsHtml.includes('"@type": "HowTo"')) {
    console.error('❌ HowTo gate: HowTo schema not found in dist/directions/index.html');
    errors++;
  } else {
    console.log('✅ HowTo gate: HowTo schema found in dist/directions/index.html');
  }
}

// 7. Events gate — verifies Speakable + complete Event nodes in dist/events/index.html
const distEventsPath = path.join(ROOT_DIR, 'dist/events/index.html');
if (!fs.existsSync(distEventsPath)) {
  console.warn(
    '⚠️ Events gate: dist/events/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distEventsHtml = fs.readFileSync(distEventsPath, 'utf-8');
  if (!distEventsHtml.includes('SpeakableSpecification')) {
    console.error('❌ Events gate: SpeakableSpecification not found in dist/events/index.html');
    errors++;
  }
  const eventNodes = [];
  for (const [, json] of distEventsHtml.matchAll(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g
  )) {
    try {
      const parsed = JSON.parse(json);
      eventNodes.push(...(parsed['@graph'] || [parsed]).filter((n) => n['@type'] === 'Event'));
    } catch {
      console.error('❌ Events gate: unparseable JSON-LD block in dist/events/index.html');
      errors++;
    }
  }
  const incomplete = eventNodes.filter((n) => !n.name || !n.startDate || !n.location);
  if (eventNodes.length === 0) {
    console.error('❌ Events gate: no Event nodes found in dist/events/index.html');
    errors++;
  } else if (incomplete.length > 0) {
    console.error(
      `❌ Events gate: ${incomplete.length} Event node(s) missing name/startDate/location`
    );
    errors++;
  } else {
    console.log(
      `✅ Events gate: ${eventNodes.length} complete Event nodes + Speakable in dist/events/index.html`
    );
  }
}

// 8. Menu gate — Menu JSON-LD lives on /menu/ only, with every item and a Speakable spec
const distMenuPath = path.join(ROOT_DIR, 'dist/menu/index.html');
if (!fs.existsSync(distMenuPath)) {
  console.warn(
    '⚠️ Menu gate: dist/menu/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distMenuHtml = fs.readFileSync(distMenuPath, 'utf-8');
  const menuData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/menu.json'), 'utf-8'));
  const expectedItems = menuData.reduce((n, c) => n + c.items.length, 0);
  const menuItemCount = (distMenuHtml.match(/"@type":"MenuItem"/g) || []).length;
  const homeHtml = fs.existsSync(distIndexPath) ? fs.readFileSync(distIndexPath, 'utf-8') : '';
  if (!distMenuHtml.includes('"@type":"Menu"') || menuItemCount !== expectedItems) {
    console.error(
      `❌ Menu gate: dist/menu/index.html has ${menuItemCount} MenuItem nodes, expected ${expectedItems}`
    );
    errors++;
  } else if (!distMenuHtml.includes('SpeakableSpecification')) {
    console.error('❌ Menu gate: SpeakableSpecification not found in dist/menu/index.html');
    errors++;
  } else if (homeHtml.includes('"@type":"Menu"')) {
    console.error(
      '❌ Menu gate: Menu JSON-LD should only render on /menu/, but dist/index.html contains it'
    );
    errors++;
  } else {
    console.log(
      `✅ Menu gate: ${menuItemCount} MenuItem nodes + Speakable on /menu/; homepage carries no Menu JSON-LD`
    );
  }
}

// 8b. Menu link gate — any link whose text mentions the menu must go to /menu/, not home.
// Guards against the GEO-page "View the full … menu" buttons regressing to href="/".
const distDir = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(distDir)) {
  const htmlFiles = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (entry.name === 'index.html') htmlFiles.push(full);
    }
  };
  collect(distDir);
  const badMenuLinks = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    for (const m of html.matchAll(/<a\b[^>]*\bhref="\/"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const text = m[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (/menu/i.test(text)) badMenuLinks.push(`${path.relative(distDir, file)}: "${text}"`);
    }
  }
  if (badMenuLinks.length > 0) {
    console.error(
      `❌ Menu link gate: ${badMenuLinks.length} menu link(s) point to / instead of /menu/:`
    );
    badMenuLinks.forEach((hit) => console.error(`   ${hit}`));
    errors++;
  } else {
    console.log(`✅ Menu link gate: no menu links point to / across ${htmlFiles.length} pages`);
  }
}

// 9. Claims gate — no distance/uniqueness superlatives that a competitor contradicts.
// Taj Mahal Indian Restaurant operates in Williams, AZ, so "closest Indian restaurant to
// Williams / the Grand Canyon" and "only Punjabi restaurant between Flagstaff and Kingman"
// are false. AI answer engines cross-check claims and stop citing pages that contradict
// the wider web. Kaibab Estates West (≈5 miles from Ash Fork) is the one true "closest".
const CLAIM_RE =
  /\b(closest|nearest|only)\b[^.]{0,40}\b(Indian|Punjabi)\b[^.]{0,60}\b(Williams|Grand Canyon|Flagstaff|Kingman|I-40)\b/gi;
// Allowed only when the claim is about Kaibab Estates West itself ("…restaurant to Kaibab…").
const CLAIM_ALLOW = /restaurant to Kaibab Estates/i;
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(astro|json)$/.test(entry.name) && entry.name !== 'reviews.json') out.push(full);
  }
  return out;
}
const claimFiles = [
  ...walk(path.join(ROOT_DIR, 'src')),
  path.join(ROOT_DIR, 'public/llms.txt'),
  path.join(ROOT_DIR, 'public/llms-full.txt'),
].filter((f) => fs.existsSync(f));
const claimHits = [];
for (const file of claimFiles) {
  // Collapse whitespace so claims wrapped across lines are still caught.
  const text = fs.readFileSync(file, 'utf-8').replace(/\s+/g, ' ');
  for (const match of text.matchAll(CLAIM_RE)) {
    if (!CLAIM_ALLOW.test(match[0])) {
      claimHits.push(`${path.relative(ROOT_DIR, file)}: "${match[0]}"`);
    }
  }
}
if (claimHits.length > 0) {
  console.error(`❌ Claims gate: ${claimHits.length} contradicted superlative claim(s):`);
  claimHits.forEach((hit) => console.error(`   ${hit}`));
  errors++;
} else {
  console.log(`✅ Claims gate: no closest/only claims about Williams, Grand Canyon or I-40`);
}

// 10. Inline-link gate — every page needs contextual links inside its <main> prose, not
// just nav, footer and CTA buttons. AI answer engines read the sentence around a link to
// understand how pages relate. Inline links share the `underline-offset-2` text-link style.
const INLINE_LINK_PAGES = [
  'index.html',
  'menu/index.html',
  'faq/index.html',
  'events/index.html',
  'directions/index.html',
  'near-grand-canyon/index.html',
  'near-williams/index.html',
];
const MIN_INLINE_LINKS = 2;
if (fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
  const thin = [];
  for (const page of INLINE_LINK_PAGES) {
    const file = path.join(ROOT_DIR, 'dist', page);
    if (!fs.existsSync(file)) {
      thin.push(`${page} (missing)`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf-8');
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    const links = [...main.matchAll(/<a\b[^>]*>/gi)].filter(
      ([tag]) => /\bhref="\/[^"]*"/.test(tag) && /underline-offset-2/.test(tag)
    ).length;
    if (links < MIN_INLINE_LINKS) thin.push(`${page} (${links})`);
  }
  if (thin.length > 0) {
    console.error(
      `❌ Inline-link gate: fewer than ${MIN_INLINE_LINKS} inline internal links in <main>: ${thin.join(', ')}`
    );
    errors++;
  } else {
    console.log(
      `✅ Inline-link gate: all ${INLINE_LINK_PAGES.length} pages have ≥${MIN_INLINE_LINKS} inline internal links`
    );
  }
}

// 11. Rating consistency gate — the hero badge and the Restaurant aggregateRating must both
// show Google's overall figures from src/data/rating.json (refreshed by ingest-reviews.mjs).
const ratingPath = path.join(ROOT_DIR, 'src/data/rating.json');
if (!fs.existsSync(ratingPath)) {
  console.error('❌ Rating gate: src/data/rating.json is missing');
  errors++;
} else if (fs.existsSync(distIndexPath)) {
  const ratingData = JSON.parse(fs.readFileSync(ratingPath, 'utf-8'));
  const homeHtml = fs.readFileSync(distIndexPath, 'utf-8');
  const schemaRating = homeHtml.match(
    /"aggregateRating":\{[^}]*"ratingValue":([\d.]+)[^}]*"reviewCount":(\d+)/
  );
  const heroRating = homeHtml.match(/aria-label="([\d.]+) out of 5 stars"/);
  const problems = [];
  if (!schemaRating) problems.push('no aggregateRating in dist/index.html');
  else {
    if (Number(schemaRating[1]) !== ratingData.ratingValue)
      problems.push(
        `schema ratingValue ${schemaRating[1]} ≠ rating.json ${ratingData.ratingValue}`
      );
    if (Number(schemaRating[2]) !== ratingData.reviewCount)
      problems.push(
        `schema reviewCount ${schemaRating[2]} ≠ rating.json ${ratingData.reviewCount}`
      );
  }
  if (!heroRating) problems.push('hero star rating aria-label not found');
  else if (Number(heroRating[1]) !== ratingData.ratingValue)
    problems.push(`hero rating ${heroRating[1]} ≠ rating.json ${ratingData.ratingValue}`);
  if (problems.length > 0) {
    console.error(`❌ Rating gate: ${problems.join('; ')}`);
    errors++;
  } else {
    console.log(
      `✅ Rating gate: hero and aggregateRating both show ${ratingData.ratingValue} from ${ratingData.reviewCount} ${ratingData.source} reviews`
    );
  }
  const ageDays = (Date.now() - Date.parse(ratingData.asOf)) / 86_400_000;
  if (!(ageDays <= 90)) {
    console.warn(
      `⚠️ Rating gate: rating.json asOf ${ratingData.asOf} is over 90 days old — check the monthly Update Reviews workflow`
    );
  }
}

// 12. Title / meta description length gate: titles 30-70 characters, descriptions 110-160,
// none duplicated. Ahrefs flags titles over 60; the owner chose 61-69 character titles for
// /, /menu/, /events/ and /directions/, so the cap is 70 to stop anything longer.
const TITLE_RANGE = [30, 70];
const DESC_RANGE = [110, 160];
const distRoot = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(distRoot)) {
  const decode = (v) =>
    v
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  const pages = [];
  const walkDist = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDist(full);
      else if (entry.name === 'index.html') pages.push(full);
    }
  };
  walkDist(distRoot);
  const metaProblems = [];
  const seen = { title: new Map(), description: new Map() };
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf-8');
    const page = `/${path.relative(distRoot, path.dirname(file))}`.replace(/\/?$/, '/');
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
    for (const [kind, value, [min, max]] of [
      ['title', title, TITLE_RANGE],
      ['description', desc, DESC_RANGE],
    ]) {
      if (value.length < min || value.length > max)
        metaProblems.push(`${page} ${kind} is ${value.length} chars (want ${min}-${max})`);
      if (seen[kind].has(value))
        metaProblems.push(`${page} ${kind} duplicates ${seen[kind].get(value)}`);
      else seen[kind].set(value, page);
    }
  }
  if (metaProblems.length > 0) {
    console.error(`❌ Meta length gate: ${metaProblems.length} problem(s):`);
    metaProblems.forEach((m) => console.error(`   ${m}`));
    errors++;
  } else {
    console.log(
      `✅ Meta length gate: ${pages.length} pages have titles ≤${TITLE_RANGE[1]} and descriptions ≤${DESC_RANGE[1]} characters, no duplicates`
    );
  }
}

console.log('\n---------------------------------------------------');
if (errors > 0) {
  console.error(`❌ AEO Audit Failed with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('✅ AEO Audit Passed! Content is optimized for Voice & AI.');
  process.exit(0);
}
