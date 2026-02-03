import fs from 'node:fs';
import path from 'node:path';

const SCAN_DIRS = ['./src', './scripts'];

// Known patterns for secrets
const SECRET_PATTERNS = [
  { name: 'OpenAI Key', regex: /sk-[a-zA-Z0-9]{20,}/ },
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
  { name: 'Generic Secret', regex: /secret\s*[:=]\s*['"][a-zA-Z0-9]{10,}['"]/i },
];

// XSS / Unsafe patterns
// usage: set:html={...} or dangerouslySetInnerHTML
const UNSAFE_PATTERNS = [
  { name: 'set:html', regex: /set:html=\{/ },
  { name: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/ },
  { name: 'javascript: URI', regex: /href=["']javascript:/ },
];

const ALLOWED_XSS = [
  'RestaurantSchema.astro',
  'FAQSchema.astro',
  '.DS_Store',
  'security-scan.mjs', // Exclude self from scan to avoid regex false positives
];

function scanDir(dir) {
  let errors = 0;
  let warnings = 0;

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const res = scanDir(fullPath);
      errors += res.errors;
      warnings += res.warnings;
    } else {
      // Skip non-code files
      if (!/\.(astro|tsx|ts|js|mjs|json)$/.test(file)) return;

      const content = fs.readFileSync(fullPath, 'utf8');

      // 1. Scan for Secrets
      const isAllowed = ALLOWED_XSS.includes(file);
      if (!isAllowed) {
        SECRET_PATTERNS.forEach((pattern) => {
          if (pattern.regex.test(content)) {
            // Special case for Google Maps Public Key (often needed on client)
            if (pattern.name === 'Google API Key') {
              console.warn(`  ⚠️  Potential Public Key found in ${file} (${pattern.name})`);
              warnings++;
            } else {
              console.error(`  ❌ CRITICAL: Potential Secret found in ${file} (${pattern.name})`);
              errors++;
            }
          }
        });
      }

      // 2. Scan for XSS
      UNSAFE_PATTERNS.forEach((pattern) => {
        if (pattern.regex.test(content)) {
          if (ALLOWED_XSS.includes(file)) {
            // console.log(`  ℹ️  Allowed ${pattern.name} in ${file}`);
          } else {
            console.warn(`  ⚠️  Warning: Unsafe HTML injection (${pattern.name}) in ${file}`);
            warnings++;
          }
        }
      });
    }
  });

  return { errors, warnings };
}

console.log('🔒 Starting Security Scan...');
let totalErrors = 0;
let totalWarnings = 0;

SCAN_DIRS.forEach((dir) => {
  const results = scanDir(dir);
  totalErrors += results.errors;
  totalWarnings += results.warnings;
});

console.log('---');
console.log(`Scan Complete.`);
console.log(`Critical Secrets: ${totalErrors}`);
console.log(`Warnings (Public Keys/XSS): ${totalWarnings}`);

if (totalErrors > 0) {
  console.error('❌ Security Scan Failed: Secrets Detected.');
  process.exit(1);
} else {
  console.log('✅ Security Scan Passed.');
}
