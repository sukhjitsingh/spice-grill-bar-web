#!/usr/bin/env node
/**
 * Write a Markdown version of every built page: dist/<page>/index.html → dist/<page>/index.md.
 *
 * Why: AI agents ask for `Accept: text/markdown`, and Markdown costs them far fewer tokens than
 * the HTML. public/.htaccess serves index.md for those requests, and every page's Link header
 * advertises it (rel="alternate").
 *
 * Hook: runs in `build:finish` (part of `npm run build`), so the Markdown always matches the HTML it was made from.
 *
 * What goes in: front matter (title, description, canonical URL), the page's <main>, then the
 * site footer (address, phone, hours, links). Left out: the header nav, scripts, icons and
 * anything aria-hidden, images, buttons, forms and embeds.
 */

import fs from 'node:fs';
import path from 'node:path';

import { JSDOM } from 'jsdom';

const DIST = 'dist';
const SITE = 'https://spicegrillbar66.com';

const SKIP = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEMPLATE',
  'SVG',
  'IMG',
  'PICTURE',
  'VIDEO',
  'AUDIO',
  'IFRAME',
  'CANVAS',
  'BUTTON',
  'FORM',
  'INPUT',
  'SELECT',
  'TEXTAREA',
  'NAV',
  'DIALOG',
]);
const BLOCK = new Set([
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'DD',
  'DETAILS',
  'DIV',
  'DL',
  'DT',
  'FIELDSET',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'HGROUP',
  'HR',
  'LI',
  'MAIN',
  'OL',
  'P',
  'PRE',
  'SECTION',
  'SUMMARY',
  'TABLE',
  'UL',
  'ASTRO-ISLAND',
  'ASTRO-SLOT',
]);

const isSkipped = (el) =>
  SKIP.has(el.tagName.toUpperCase()) ||
  el.getAttribute('aria-hidden') === 'true' ||
  el.hasAttribute('hidden');

const hasBlockChild = (el) =>
  [...el.querySelectorAll('*')].some((d) => BLOCK.has(d.tagName.toUpperCase()) && !isSkipped(d));

// Children of a flex or grid container render apart even with no whitespace between them in the
// HTML ("<span>Korma Sauce</span><span>New</span>"), so join them with a space.
const separator = (el) =>
  /(^|\s)(inline-)?(flex|grid)(\s|$)/.test(el.getAttribute?.('class') ?? '') ? ' ' : '';

const escapeText = (text) => text.replace(/([\\`*_[\]])/g, '\\$1');

function absoluteUrl(href) {
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;
  try {
    return new URL(href, `${SITE}/`).href;
  } catch {
    return null;
  }
}

function inline(node) {
  if (node.nodeType === 3) return escapeText(node.textContent.replace(/\s+/g, ' '));
  if (node.nodeType !== 1 || isSkipped(node)) return '';
  const tag = node.tagName.toUpperCase();
  if (tag === 'BR') return '\n';
  const inner = [...node.childNodes].map(inline).join(separator(node));
  const text = inner.trim();
  if (!text && tag !== 'A') return inner.includes(' ') ? ' ' : '';
  // Keep the spaces around an element so "<b>Open</b> daily" does not become "**Open**daily".
  const lead = /^\s/.test(inner) ? ' ' : '';
  const trail = /\s$/.test(inner) ? ' ' : '';
  switch (tag) {
    case 'STRONG':
    case 'B':
      return `${lead}**${text}**${trail}`;
    case 'EM':
    case 'I':
      return `${lead}*${text}*${trail}`;
    case 'CODE':
      return `${lead}\`${node.textContent.trim()}\`${trail}`;
    case 'A': {
      const url = absoluteUrl(node.getAttribute('href'));
      const label = text || escapeText(node.getAttribute('aria-label') || '');
      if (!label) return '';
      return url ? `${lead}[${label}](${url})${trail}` : `${lead}${label}${trail}`;
    }
    default:
      return inner;
  }
}

const tidy = (text) =>
  text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');

/** Render an element's children as Markdown blocks; inline runs between blocks become paragraphs. */
function blocks(el, ctx = {}) {
  const out = [];
  let run = '';
  const flush = () => {
    const text = tidy(run);
    if (text) out.push(text);
    run = '';
  };
  for (const child of el.childNodes) {
    if (
      child.nodeType === 1 &&
      !isSkipped(child) &&
      (BLOCK.has(child.tagName.toUpperCase()) || (child.tagName === 'A' && hasBlockChild(child)))
    ) {
      flush();
      out.push(...block(child, ctx));
    } else {
      run += (run ? separator(el) : '') + inline(child);
    }
  }
  flush();
  return out;
}

function list(el, ordered, ctx) {
  const items = [...el.children].filter((li) => li.tagName === 'LI' && !isSkipped(li));
  return items
    .map((li, i) => {
      const marker = ordered ? `${i + 1}.` : '-';
      const body = blocks(li, ctx).join('\n');
      return body
        .split('\n')
        .map((line, n) =>
          n === 0 ? `${marker} ${line}` : `${' '.repeat(marker.length + 1)}${line}`
        )
        .join('\n');
    })
    .filter((item) => item.trim() !== '-' && item.trim() !== '1.')
    .join('\n');
}

function table(el) {
  const rows = [...el.querySelectorAll('tr')].map((tr) =>
    [...tr.children].map((cell) => tidy(inline(cell)).replace(/\|/g, '\\|').replace(/\n/g, ' '))
  );
  if (rows.length === 0) return [];
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r) => [...r, ...Array(width - r.length).fill('')];
  const [head, ...body] = rows.map(pad);
  return [
    [
      `| ${head.join(' | ')} |`,
      `| ${head.map(() => '---').join(' | ')} |`,
      ...body.map((r) => `| ${r.join(' | ')} |`),
    ].join('\n'),
  ];
}

function block(el, ctx) {
  const tag = el.tagName.toUpperCase();
  if (/^H[1-6]$/.test(tag)) {
    const text = tidy(inline(el)).replace(/\n/g, ' ');
    if (!text) return [];
    const label = ctx.linkHref ? `[${text}](${ctx.linkHref})` : text;
    if (ctx.linkHref) ctx.linkUsed = true;
    return [`${'#'.repeat(Number(tag[1]))} ${label}`];
  }
  switch (tag) {
    case 'P':
    case 'DT':
    case 'DD':
    case 'SUMMARY':
    case 'FIGCAPTION': {
      const text = tidy(inline(el));
      return text ? [tag === 'DT' ? `**${text}**` : text] : [];
    }
    case 'UL':
    case 'OL': {
      const md = list(el, tag === 'OL', ctx);
      return md ? [md] : [];
    }
    case 'BLOCKQUOTE':
      return blocks(el, ctx).map((b) =>
        b
          .split('\n')
          .map((line) => `> ${line}`)
          .join('\n')
      );
    case 'PRE':
      return [`\`\`\`\n${el.textContent.replace(/\n$/, '')}\n\`\`\``];
    case 'HR':
      return ['---'];
    case 'TABLE':
      return table(el);
    case 'A': {
      // A card link wrapping headings and text: link the first heading, or add the link after.
      const href = absoluteUrl(el.getAttribute('href'));
      const inner = { ...ctx, linkHref: href, linkUsed: false };
      const out = blocks(el, inner);
      if (href && !inner.linkUsed) {
        const label = escapeText(el.getAttribute('aria-label') || '') || 'Link';
        out.push(`[${label}](${href})`);
      }
      return out;
    }
    default:
      return blocks(el, ctx);
  }
}

function toMarkdown(html) {
  const { document } = new JSDOM(html).window;
  const main = document.querySelector('main');
  if (!main) throw new Error('no <main> element');
  const title = document.title.trim();
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const footer =
    document.querySelector('body > footer') ?? document.querySelector('footer:not(main footer)');

  const parts = [
    [
      '---',
      `title: ${JSON.stringify(title)}`,
      `description: ${JSON.stringify(description)}`,
      `url: ${JSON.stringify(canonical)}`,
      '---',
    ].join('\n'),
    ...block(main, {}),
  ];
  if (footer && !main.contains(footer)) parts.push('---', ...block(footer, {}));
  return `${parts.join('\n\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

const pages = fs
  .readdirSync(DIST, { recursive: true })
  .map(String)
  .filter(
    (file) => path.basename(file) === 'index.html' && !file.split(path.sep).includes('_astro')
  );

if (pages.length === 0) {
  console.error('❌ generate-markdown: no index.html files in dist/');
  process.exit(1);
}

for (const page of pages.sort()) {
  const source = path.join(DIST, page);
  const target = source.replace(/\.html$/, '.md');
  try {
    fs.writeFileSync(target, toMarkdown(fs.readFileSync(source, 'utf8')));
  } catch (error) {
    console.error(`❌ generate-markdown: ${source}: ${error.message}`);
    process.exit(1);
  }
}
console.log(`✅ Markdown versions written for ${pages.length} pages`);
