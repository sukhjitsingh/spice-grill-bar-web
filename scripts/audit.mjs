import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = './dist';

// Helper to find all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else {
      if (path.extname(file) === '.html') {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
let totalErrors = 0;
let totalWarnings = 0;

console.log(`\n🔍 Starting Audit on ${htmlFiles.length} files...\n`);

htmlFiles.forEach((file) => {
  const relativePath = path.relative(DIST_DIR, file);
  console.log(`📄 Checking: ${relativePath}`);

  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  let fileErrors = 0;

  // 1. SEO Checks
  // Title
  const title = doc.querySelector('title');
  if (!title || !title.textContent.trim()) {
    console.error(`  ❌ Error: Missing <title> tag`);
    fileErrors++;
  } else {
    if (title.textContent.length < 10)
      console.warn(`  ⚠️  Warning: Title too short ("${title.textContent}")`);
    if (title.textContent.length > 80)
      console.warn(`  ⚠️  Warning: Title too long (${title.textContent.length} chars)`);
  }

  // Meta Description
  const metaDesc = doc.querySelector('meta[name="description"]');
  if (!metaDesc || !metaDesc.content.trim()) {
    console.error(`  ❌ Error: Missing meta description`);
    fileErrors++;
  } else {
    if (metaDesc.content.length < 50)
      console.warn(`  ⚠️  Warning: Description too short (${metaDesc.content.length} chars)`);
    if (metaDesc.content.length > 200)
      console.warn(`  ⚠️  Warning: Description too long (${metaDesc.content.length} chars)`);
  }

  // H1
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length === 0) {
    console.error(`  ❌ Error: No <h1> tag found`);
    fileErrors++;
  } else if (h1s.length > 1) {
    console.error(`  ❌ Error: Multiple <h1> tags found (${h1s.length})`);
    fileErrors++;
  }

  // Canonical
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.href) {
    console.warn(`  ⚠️  Warning: Missing canonical URL`);
    totalWarnings++;
  }

  // 2. Image Alt Text
  const images = doc.querySelectorAll('img');
  images.forEach((img, i) => {
    if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
      // Ignore decorative images if marked explicitly (aria-hidden)
      if (img.getAttribute('aria-hidden') !== 'true') {
        console.error(`  ❌ Error: Image #${i + 1} missing alt text (src: ${img.src})`);
        fileErrors++;
      }
    }
  });

  // 3. Schema Validation
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  if (scripts.length === 0) {
    console.warn(`  ⚠️  Warning: No JSON-LD schema found`);
    totalWarnings++;
  }
  scripts.forEach((script, i) => {
    try {
      const json = JSON.parse(script.textContent);
      // Basic TYPE checking
      if (!json['@context'] || !json['@type']) {
        console.error(`  ❌ Error: Schema Block #${i + 1} missing @context or @type`);
        fileErrors++;
      }
    } catch (e) {
      console.error(`  ❌ Error: Schema Block #${i + 1} Invalid JSON`);
      fileErrors++;
    }
  });

  // 4. Link Checking (Internal)
  const links = doc.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Internal link
        const targetPath = path.join(
          DIST_DIR,
          href === '/' ? 'index.html' : href.replace(/\/$/, '/index.html')
        );
        const targetFile = href.endsWith('.html') ? path.join(DIST_DIR, href) : targetPath;

        // Logic to try looking for directory/index.html vs file.html
        // Simplest check: does the generated static file exist?
        // This is a naive check; might fail on edge cases, but good for smoke testing.

        let exist = false;
        if (fs.existsSync(targetPath)) exist = true; // folder/index.html
        if (fs.existsSync(path.join(DIST_DIR, href + '.html'))) exist = true; // file.html

        // Special case root
        if (href === '/') exist = true;

        if (!exist && href.startsWith('/#') === false) {
          // Ignore anchor only links if logic fails
          // console.warn(`  ⚠️  Potential broken internal link: ${href}`);
          // Commented out to reduce noise until refined
        }
      }
    }
  });

  if (fileErrors === 0) {
    console.log(`  ✅ Passed`);
  } else {
    totalErrors += fileErrors;
  }
  console.log('---');
});

console.log(`\nAudit Complete.`);
console.log(`Errors: ${totalErrors}`);
console.log(`Warnings: ${totalWarnings}`);

if (totalErrors > 0) process.exit(1);
