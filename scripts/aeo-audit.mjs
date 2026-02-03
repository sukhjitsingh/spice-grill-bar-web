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
  } else {
    console.warn('⚠️ FAQ Data not found. Skipping FAQ check.');
  }
} catch (err) {
  console.error('❌ Failed to parse FAQ data:', err.message);
  errors++;
}

// 2. Check llms.txt Existence (AI Agent Readiness)
const LLMS_TXT_PATH = path.join(ROOT_DIR, 'public/llms.txt');
if (fs.existsSync(LLMS_TXT_PATH)) {
  console.log('✅ llms.txt found (AI Agent Discovery enabled).');
} else {
  console.error('❌ llms.txt missing in public/. Required for AI search visibility.');
  errors++;
}

console.log('\n---------------------------------------------------');
if (errors > 0) {
  console.error(`❌ AEO Audit Failed with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('✅ AEO Audit Passed! Content is optimized for Voice & AI.');
  process.exit(0);
}
