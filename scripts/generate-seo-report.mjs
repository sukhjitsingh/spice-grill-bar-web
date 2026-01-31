
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = './dist';
const OUT_FILE = './reports/SEO_REPORT.md';

// Ensure reports directory exists
if (!fs.existsSync(path.dirname(OUT_FILE))) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
}

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === '.html') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getHtmlFiles(DIST_DIR);
let report = `# SEO Verification Report\nGenerated: ${new Date().toLocaleString()}\n\n`;

files.forEach(file => {
  const relPath = path.relative(DIST_DIR, file);
  const html = fs.readFileSync(file, 'utf8');
  const doc = new JSDOM(html).window.document;

  report += `## File: \`${relPath}\`\n`;
  
  // Title
  const title = doc.querySelector('title')?.textContent || 'MISSING';
  report += `- **Title**: ${title}\n`;
  
  // Meta Description
  const desc = doc.querySelector('meta[name="description"]')?.content || 'MISSING';
  report += `- **Meta Description**: ${desc}\n`;
  
  // Canonical
  const canon = doc.querySelector('link[rel="canonical"]')?.href || 'MISSING';
  report += `- **Canonical**: \`${canon}\`\n`;
  
  // H1
  const h1 = doc.querySelector('h1')?.textContent?.trim() || 'MISSING';
  report += `- **H1**: "${h1}"\n`;
  
  // Schema
  const schemas = doc.querySelectorAll('script[type="application/ld+json"]');
  report += `- **Schema Blocks**: ${schemas.length}\n`;
  schemas.forEach((s, i) => {
    try {
      const json = JSON.parse(s.textContent);
      report += `  - Block ${i+1}: Type \`${json['@type']}\`\n`;
    } catch(e) {
      report += `  - Block ${i+1}: INVALID JSON\n`;
    }
  });

  // Images
  const imgs = doc.querySelectorAll('img');
  const missingAlt = Array.from(imgs).filter(img => !img.hasAttribute('alt') && img.getAttribute('aria-hidden') !== 'true');
  report += `- **Images**: ${imgs.length} total, ${missingAlt.length} missing alt\n`;
  if (missingAlt.length > 0) {
      missingAlt.forEach(img => {
          report += `  - ❌ Missing alt: ${img.src}\n`;
      });
  }

  report += `\n---\n\n`;
});

fs.writeFileSync(OUT_FILE, report);
console.log(`Report generated at ${OUT_FILE}`);
