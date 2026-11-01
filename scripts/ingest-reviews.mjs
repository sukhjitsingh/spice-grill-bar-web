/**
 * Review ingestion: scrapes Google Maps and Yelp with headless Chrome, asks
 * Gemini to extract structured reviews, and writes src/data/reviews.json.
 * It also refreshes src/data/rating.json with Google's overall rating and total
 * review count (the figures the hero badge and Restaurant schema show), but only
 * when the new values pass a sanity check against the stored ones.
 *
 * Run: npm run ingest:reviews  (needs GEMINI_API_KEY in env, .env or .env.local)
 *
 * Additive: existing reviews are never removed or edited. Only reviews not
 * already in the file (same source + author, or same opening text) are added,
 * at the front, with ids continuing each source's numbering.
 *
 * Fails soft: on a missing key, blocked scrape, or API error the file is left
 * untouched and the process exits 0.
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { GoogleGenAI } from '@google/genai';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/reviews.json', import.meta.url));
const RATING_PATH = fileURLToPath(new URL('../src/data/rating.json', import.meta.url));
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/Spice+Grill+%26+Bar+Ash+Fork';
const YELP_URL =
  'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork?osq=spice+grill+and+bar#reviews';
const MIN_SCRAPE_CHARS = 500;
const MAX_SOURCE_CHARS = 50000;
const SOURCES = ['Google', 'Yelp'];

const warn = (msg) =>
  console.warn(process.env.GITHUB_ACTIONS ? `::warning::${msg}` : `Warning: ${msg}`);
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

function loadEnv() {
  ['.env', '.env.local'].forEach((file) => {
    try {
      process.loadEnvFile(file);
    } catch {
      // File missing; rely on the real environment.
    }
  });
}

function readExisting() {
  try {
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    warn(`Could not read existing reviews: ${e.message}`);
    return [];
  }
}

async function scrapeGoogle(page) {
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
  await page.goto(GOOGLE_MAPS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('Google title:', await page.title());

  const reviewButton = await page.$('button[aria-label*="Reviews"]');
  if (reviewButton) {
    await reviewButton.click();
    await sleep(3000);
  }
  await page.mouse.wheel({ deltaY: 3000 });
  await sleep(2000);
  return page.evaluate(() => document.body.innerText);
}

async function scrapeYelp(page) {
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://www.google.com/',
  });
  await page.goto(YELP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Yelp title:', await page.title());
  await sleep(5000);
  return page.evaluate(() => document.body.innerText);
}

async function scrapeSafely(name, fn, page) {
  try {
    const text = await fn(page);
    const ok = text.length >= MIN_SCRAPE_CHARS;
    console.log(`${name} scrape ${ok ? 'OK' : 'FAILED'} (${text.length} chars)`);
    return ok ? text : null;
  } catch (e) {
    warn(`${name} scrape failed: ${e.message}`);
    return null;
  }
}

async function scrapeAll() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    });
    return {
      Google: await scrapeSafely('Google', scrapeGoogle, page),
      Yelp: await scrapeSafely('Yelp', scrapeYelp, page),
    };
  } finally {
    await browser.close();
  }
}

const SYSTEM_INSTRUCTION = `You are a data extraction specialist for Spice Grill & Bar, a Punjabi restaurant in Ash Fork, AZ.

Your task is to extract customer reviews from raw scraped text data from Google Maps and Yelp business pages.

Guidelines:
- Extract ONLY genuine customer reviews (ignore navigation text, ads, business info)
- Copy review text verbatim apart from whitespace cleanup; never invent or paraphrase reviews
- Prioritize recent, detailed reviews
- Convert relative dates ("2 weeks ago") to absolute dates based on the provided current date
- If a source is blocked or empty, extract from the available source only
- Return valid JSON as specified`;

async function extractWithGemini(apiKey, scraped) {
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const sourceData = SOURCES.filter((s) => scraped[s])
    .map((s) => `# ${s} Data\n${scraped[s].substring(0, MAX_SOURCE_CHARS)}\n`)
    .join('\n');

  console.log(`Sending scraped text to ${model}...`);
  const response = await ai.models.generateContent({
    model,
    contents: `Data is in raw text format from web scraping.
Current date: ${today}

Task: Extract up to 4 reviews from each available source.

${sourceData}
Extract reviews with these fields:
- id: unique identifier (e.g. "google-1", "yelp-1")
- author: reviewer's name
- rating: integer 1-5
- text: the review text
- source: "Google" or "Yelp"
- date: formatted date string like "November 28, 2025"

Also report googleSummary: the business's OVERALL Google rating and TOTAL Google
review count as shown on the Google Maps listing (for example "4.7" and "(512)").
These are the listing totals, not figures computed from the reviews you extracted.
Omit googleSummary if the Google data does not show them.
`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          reviews: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                author: { type: 'string' },
                rating: { type: 'number' },
                text: { type: 'string' },
                source: { type: 'string', enum: SOURCES },
                date: { type: 'string' },
              },
              required: ['id', 'author', 'rating', 'text', 'source', 'date'],
            },
          },
          googleSummary: {
            type: 'object',
            properties: {
              ratingValue: { type: 'number' },
              reviewCount: { type: 'integer' },
            },
            required: ['ratingValue', 'reviewCount'],
          },
        },
        required: ['reviews'],
      },
    },
  });

  const parsed = JSON.parse(response.text);
  if (Array.isArray(parsed)) return { reviews: parsed, googleSummary: null };
  return { reviews: parsed.reviews || [], googleSummary: parsed.googleSummary || null };
}

function readRating() {
  try {
    return JSON.parse(fs.readFileSync(RATING_PATH, 'utf8'));
  } catch (e) {
    warn(`Could not read ${RATING_PATH}: ${e.message}`);
    return null;
  }
}

// Accepts Gemini's Google totals only when they are plausible next to the stored
// values; anything else keeps rating.json as is. Counts can dip slightly when Google
// removes reviews, but never collapse or jump more than threefold in a month.
function isPlausibleSummary(summary, stored) {
  if (!summary) return false;
  const { ratingValue, reviewCount } = summary;
  if (typeof ratingValue !== 'number' || ratingValue < 1 || ratingValue > 5) return false;
  if (!Number.isInteger(reviewCount) || reviewCount < 1) return false;
  if (stored && Number.isInteger(stored.reviewCount)) {
    if (reviewCount < stored.reviewCount * 0.9 || reviewCount > stored.reviewCount * 3) {
      return false;
    }
  }
  return true;
}

function updateRating(summary) {
  const stored = readRating();
  if (!isPlausibleSummary(summary, stored)) {
    warn(
      `Google summary missing or implausible (${JSON.stringify(summary)}); keeping rating.json.`
    );
    return;
  }
  const next = {
    ratingValue: Math.round(summary.ratingValue * 10) / 10,
    reviewCount: summary.reviewCount,
    source: 'Google',
    asOf: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(RATING_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `rating.json: ${next.ratingValue} from ${next.reviewCount} Google reviews (was ${stored?.ratingValue} from ${stored?.reviewCount}).`
  );
}

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

function isValidReview(r) {
  return (
    r &&
    Number.isInteger(r.rating) &&
    r.rating >= 1 &&
    r.rating <= 5 &&
    nonEmpty(r.author) &&
    nonEmpty(r.text) &&
    nonEmpty(r.date) &&
    SOURCES.includes(r.source)
  );
}

// Lowercase, strip punctuation and collapse whitespace so trivial differences
// in Gemini's transcription don't create duplicates.
const fingerprint = (v) =>
  v
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
const authorKey = (r) => `${r.source}|a|${fingerprint(r.author)}`;
const textKey = (r) => `${r.source}|t|${fingerprint(r.text).slice(0, 60)}`;

function nextIdNumbers(reviews) {
  const next = {};
  SOURCES.forEach((source) => {
    const prefix = `${source.toLowerCase()}-`;
    const nums = reviews
      .map((r) =>
        typeof r.id === 'string' && r.id.startsWith(prefix)
          ? Number(r.id.slice(prefix.length))
          : NaN
      )
      .filter(Number.isFinite);
    next[source] = (nums.length ? Math.max(...nums) : 0) + 1;
  });
  return next;
}

// Returns only reviews not already present (same source and same author, or
// same opening text), with fresh ids that continue each source's numbering.
function findNewReviews(existing, extracted, scrapedSources) {
  const seen = new Set(existing.flatMap((r) => [authorKey(r), textKey(r)]));
  const nextId = nextIdNumbers(existing);
  const added = [];
  extracted.forEach((raw) => {
    if (!scrapedSources.includes(raw.source)) return;
    const r = {
      author: raw.author.trim(),
      rating: raw.rating,
      text: raw.text.trim(),
      source: raw.source,
      date: raw.date.trim(),
    };
    if (seen.has(authorKey(r)) || seen.has(textKey(r))) return;
    seen.add(authorKey(r));
    seen.add(textKey(r));
    const id = `${r.source.toLowerCase()}-${nextId[r.source]}`;
    nextId[r.source] += 1;
    added.push({ id, ...r });
  });
  return added;
}

async function main() {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    warn('GEMINI_API_KEY is not set; skipping review ingestion and keeping existing reviews.');
    return;
  }

  const existing = readExisting();
  console.log(`Loaded ${existing.length} existing reviews.`);

  const scraped = await scrapeAll();
  const scrapedSources = SOURCES.filter((s) => scraped[s]);
  if (scrapedSources.length === 0) {
    warn('Both sources failed to scrape; keeping existing reviews.');
    return;
  }

  const { reviews: rawReviews, googleSummary } = await extractWithGemini(apiKey, scraped);
  if (scrapedSources.includes('Google')) updateRating(googleSummary);

  const extracted = rawReviews.filter(isValidReview);
  console.log(`Gemini returned ${extracted.length} valid reviews.`);

  // Existing reviews are never removed or changed; new ones go first (newest-first file).
  const added = findNewReviews(existing, extracted, scrapedSources);
  if (added.length === 0) {
    console.log('No new reviews; reviews.json unchanged.');
    return;
  }

  const finalReviews = [...added, ...existing];
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(finalReviews, null, 2)}\n`);
  console.log(
    `Added ${added.length} new reviews (${added.map((r) => r.id).join(', ')}); ${finalReviews.length} total.`
  );
}

main().catch((e) => {
  warn(`Review ingestion failed, keeping existing reviews: ${e.stack || e.message}`);
});
