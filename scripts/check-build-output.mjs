#!/usr/bin/env node
// Guards files the Apache deploy depends on; dotfiles are easy to lose in a build pipeline change.
import fs from 'node:fs';

const required = ['dist/.htaccess', 'dist/sitemap.xml', 'dist/sitemap-0.xml', 'dist/index.html'];
const missing = required.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error(`❌ Build output is missing: ${missing.join(', ')}`);
  process.exit(1);
}
if (fs.readFileSync('dist/.htaccess', 'utf8') !== fs.readFileSync('public/.htaccess', 'utf8')) {
  console.error('❌ dist/.htaccess does not match public/.htaccess');
  process.exit(1);
}
const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = (sitemap.match(/<url>/g) || []).length;
const lastmods = (sitemap.match(/<lastmod>/g) || []).length;
if (urls === 0 || lastmods !== urls) {
  console.error(`❌ dist/sitemap-0.xml has ${lastmods} <lastmod> for ${urls} URLs`);
  process.exit(1);
}
console.log('✅ Build output includes .htaccess, sitemap.xml (with lastmod) and index.html');
