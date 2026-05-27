#!/usr/bin/env node
/**
 * Logo optimization script.
 *
 * Reads src/assets/SpiceBar_logo_primary.svg (1.95 MB Canva export), strips the
 * C2PA metadata block, resizes the two embedded PNG blobs from ~1288KB/~100KB to
 * max 350px width, then writes:
 *
 *   public/logo_light.svg          — original black outlines (~30-40 KB)
 *   public/logo_dark.svg           — white outlines for dark surfaces
 *   public/favicon.svg             — theme-responsive via CSS media query
 *   public/favicon.ico             — 48×48 PNG (browser fallback)
 *   public/apple-touch-icon.png    — 180×180 PNG
 *   public/opengraph-image.webp    — 1200×630 WebP (logo on dark gradient)
 */

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function main() {
  // ── 1. Read source ───────────────────────────────────────────────────────────
  const srcPath = path.join(root, 'src/assets/SpiceBar_logo_primary.svg');
  console.log('Reading', srcPath);
  let svg = fs.readFileSync(srcPath, 'utf8');
  console.log('  Source size:', kb(svg.length));

  // ── 2. Strip Canva C2PA metadata ────────────────────────────────────────────
  svg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  console.log('  After metadata strip:', kb(svg.length));

  // ── 3. Find both embedded PNG blobs and resize them ──────────────────────────
  // Collect all matches (index, end, attr name, base64 data)
  const pngRe = /(xlink:href|href)="(data:image\/png;base64,([A-Za-z0-9+/=]+))"/g;
  const hits = [];
  let m;
  while ((m = pngRe.exec(svg)) !== null) {
    hits.push({ start: m.index, end: m.index + m[0].length, attr: m[1], b64: m[3] });
  }
  console.log('  Embedded PNGs found:', hits.length);

  // Process from end → start so offsets stay valid
  for (const h of [...hits].reverse()) {
    const original = Buffer.from(h.b64, 'base64');
    const meta = await sharp(original).metadata();
    console.log(`  PNG ${meta.width}×${meta.height} (${kb(original.length)}) → resizing to w≤350`);

    const resized = await sharp(original)
      .resize({ width: 350, withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const newB64 = resized.toString('base64');
    const replacement = `${h.attr}="data:image/png;base64,${newB64}"`;
    svg = svg.slice(0, h.start) + replacement + svg.slice(h.end);
    console.log(`    Resized: ${kb(h.b64.length)} → ${kb(newB64.length)} (base64)`);
  }
  console.log('  After PNG resize:', kb(svg.length));

  // ── 4. Light variant (original black strokes/fills) ─────────────────────────
  const lightSvg = svg;
  const lightPath = path.join(root, 'public/logo_light.svg');
  fs.writeFileSync(lightPath, lightSvg, 'utf8');
  console.log('logo_light.svg:', kb(fs.statSync(lightPath).size));

  // ── 5. Dark variant (swap #000000 → #ffffff) ────────────────────────────────
  // Only swap filled/stroked elements; preserve fill="none"
  const darkSvg = svg
    .replace(/stroke="#000000"/g, 'stroke="#ffffff"')
    .replace(/fill="#000000"/g, 'fill="#ffffff"');
  const darkPath = path.join(root, 'public/logo_dark.svg');
  fs.writeFileSync(darkPath, darkSvg, 'utf8');
  console.log('logo_dark.svg:', kb(fs.statSync(darkPath).size));

  // ── 6. Favicon SVG — inject CSS dark-mode media query ───────────────────────
  // Presentation attributes have lower specificity than CSS rules, so the
  // attribute selectors below correctly override stroke="#000000" / fill="#000000".
  const darkModeStyle = `\n  <style>\n    @media (prefers-color-scheme: dark) {\n      [stroke="#000000"] { stroke: #ffffff; }\n      [fill="#000000"] { fill: #ffffff; }\n    }\n  </style>`;
  const faviconSvg = lightSvg.replace(/(<svg[^>]*>)/, `$1${darkModeStyle}`);
  const faviconPath = path.join(root, 'public/favicon.svg');
  fs.writeFileSync(faviconPath, faviconSvg, 'utf8');
  console.log('favicon.svg:', kb(fs.statSync(faviconPath).size));

  // ── 7. Raster assets via sharp SVG rendering ─────────────────────────────────
  // sharp uses librsvg which handles embedded data-URI PNGs in SVG.
  // Render both variants upfront so OG image uses the dark SVG directly
  // (avoids negate() which inverts photo colors, not just black outlines).
  let logoRasterBuffer = null;
  let logoDarkRasterBuffer = null;

  try {
    logoRasterBuffer = await sharp(Buffer.from(lightSvg), { density: 144 })
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    logoDarkRasterBuffer = await sharp(Buffer.from(darkSvg), { density: 144 })
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    console.log('SVG → raster OK, logo PNG:', kb(logoRasterBuffer.length));
  } catch (err) {
    console.warn('SVG rasterisation failed:', err.message);
    console.warn('Skipping favicon.ico, apple-touch-icon.png, opengraph-image.webp generation.');
    console.warn('Run the script in an environment with librsvg support, or generate rasters manually.');
  }

  if (logoRasterBuffer) {
    // favicon.ico — 48×48 PNG saved with .ico extension (browsers accept it)
    const icoBuffer = await sharp(logoRasterBuffer)
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(root, 'public/favicon.ico'), icoBuffer);
    console.log('favicon.ico:', kb(icoBuffer.length));

    // apple-touch-icon.png — 180×180 PNG on white background (iOS requirement)
    const touchBuffer = await sharp({
      create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
    })
      .composite([{
        input: await sharp(logoRasterBuffer)
          .resize(160, 160, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .png()
          .toBuffer(),
        left: 10,
        top: 10,
      }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(root, 'public/apple-touch-icon.png'), touchBuffer);
    console.log('apple-touch-icon.png:', kb(touchBuffer.length));

    // opengraph-image.webp — 1200×630 logo on dark gradient
    // Background: deep brown (matches surface-dim in dark mode)
    const bgSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14100d"/>
      <stop offset="60%" stop-color="#1e1410"/>
      <stop offset="100%" stop-color="#2a1a0e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
</svg>`;

    const bgBuffer = await sharp(Buffer.from(bgSvg), { density: 72 })
      .resize(1200, 630)
      .png()
      .toBuffer();

    // Use the dark SVG raster directly — outlines are already white,
    // and the embedded photo colours are preserved (no negate distortion).
    const ogLogoBuffer = await sharp(logoDarkRasterBuffer)
      .resize(340, 340, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const ogBuffer = await sharp(bgBuffer)
      .composite([{
        input: ogLogoBuffer,
        left: Math.round((1200 - 340) / 2),
        top: Math.round((630 - 340) / 2),
      }])
      .webp({ quality: 88 })
      .toBuffer();

    fs.writeFileSync(path.join(root, 'public/opengraph-image.webp'), ogBuffer);
    console.log('opengraph-image.webp:', kb(ogBuffer.length));
  }

  console.log('\nAll done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
