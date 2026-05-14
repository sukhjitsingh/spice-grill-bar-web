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
      const wordCount = item.answer.split(/\s+/).length;
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
  console.error('❌ Failed to parse FAQ data:', err.message);
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

// 3. robots.txt AI-bot Allowlist Gate (forward-protection — current file already passes)
const ROBOTS_PATH = path.join(ROOT_DIR, 'public/robots.txt');
if (fs.existsSync(ROBOTS_PATH)) {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
  const requiredBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
  for (const bot of requiredBots) {
    // Match `User-agent: <bot>` followed by `Allow: /` (allow blank/comment lines between)
    const re = new RegExp(
      `User-agent:\\s*${bot}\\s*\\n(?:#[^\\n]*\\n|\\s*\\n)*Allow:\\s*/`,
      'i'
    );
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

// 4. @id fragment gate + FAQPage Question count gate — verifies build output
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)');
  console.warn('⚠ FAQPage gate: dist/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');

  // @id fragment gate
  const restaurantId = '"@id":"https://spicegrillbar66.com/#restaurant"';
  const orgId = '"@id":"https://spicegrillbar66.com/#organization"';
  const missingIds = [];
  if (!distHtml.includes(restaurantId)) missingIds.push('#restaurant');
  if (!distHtml.includes(orgId)) missingIds.push('#organization');
  if (missingIds.length > 0) {
    console.error(`✗ @id gate: dist/index.html missing @id fragment(s): ${missingIds.join(', ')}`);
    errors++;
  } else {
    console.log('✓ @id gate: both #restaurant and #organization @id fragments found in dist/index.html');
  }

  // 5. FAQPage home-page schema gate — verifies exactly 8 Question entries in dist/index.html
  const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
  if (questionMatches.length !== 8) {
    console.error(`✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly 8`);
    errors++;
  } else {
    console.log('✓ FAQPage gate: dist/index.html contains exactly 8 Question entries');
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
