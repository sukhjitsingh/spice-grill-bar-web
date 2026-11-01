#!/usr/bin/env node
// Guards files the Apache deploy depends on; dotfiles are easy to lose in a build pipeline change.
import fs from 'node:fs';

const required = ['dist/.htaccess', 'dist/sitemap.xml', 'dist/index.html'];
const missing = required.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error(`❌ Build output is missing: ${missing.join(', ')}`);
  process.exit(1);
}
if (fs.readFileSync('dist/.htaccess', 'utf8') !== fs.readFileSync('public/.htaccess', 'utf8')) {
  console.error('❌ dist/.htaccess does not match public/.htaccess');
  process.exit(1);
}
console.log('✅ Build output includes .htaccess, sitemap.xml and index.html');
