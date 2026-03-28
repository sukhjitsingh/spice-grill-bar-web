// Build dark-mode variant of dist/ for LHCI dark testing
// Copies dist/ -> dist-dark/ and injects class="dark" on <html>
import { glob } from 'glob';
import fs from 'node:fs/promises';

const distDir = './dist';
const darkDistDir = './dist-dark';

// Remove old dist-dark if exists, then copy
await fs.rm(darkDistDir, { recursive: true, force: true });
await fs.cp(distDir, darkDistDir, { recursive: true });
const htmlFiles = await glob(`${darkDistDir}/**/*.html`);

for (const file of htmlFiles) {
  const content = await fs.readFile(file, 'utf8');
  const modified = content.replace('<html lang="en">', '<html lang="en" class="dark">');
  await fs.writeFile(file, modified);
}
console.log(`Injected class="dark" into ${htmlFiles.length} HTML files in ${darkDistDir}`);
