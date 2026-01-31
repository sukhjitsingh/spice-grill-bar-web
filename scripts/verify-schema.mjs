import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = './dist';
const HTML_FILE = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(HTML_FILE)) {
  console.error(`Error: ${HTML_FILE} not found. Run 'npm run build' first.`);
  process.exit(1);
}

const html = fs.readFileSync(HTML_FILE, 'utf8');
const dom = new JSDOM(html);
const scripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');

console.log(`Found ${scripts.length} JSON-LD blocks.`);

let hasErrors = false;

scripts.forEach((script, index) => {
  try {
    const json = JSON.parse(script.textContent);
    console.log(`\nBlock #${index + 1} (@type: ${json['@type']}): Valid JSON`);
    
    // Basic Schema Checks
    if (json['@context'] !== 'https://schema.org') {
      console.warn(`  Warning: @context is ${json['@context']}, expected https://schema.org`);
    }
    
    if (json['@type'] === 'Restaurant') {
       if (!json.name) console.error('  Error: Restaurant missing name');
       if (!json.address) console.error('  Error: Restaurant missing address');
       else console.log('  - Verified: Restaurant Name & Address present');
    }
    
    if (json['@type'] === 'FAQPage') {
       if (!Array.isArray(json.mainEntity)) console.error('  Error: FAQPage mainEntity is not an array');
       else console.log(`  - Verified: FAQPage contains ${json.mainEntity.length} questions`);
    }

  } catch (e) {
    console.error(`Block #${index + 1}: Invalid JSON - ${e.message}`);
    hasErrors = true;
  }
});

if (hasErrors) process.exit(1);
console.log('\nSchema Verification Passed.');
