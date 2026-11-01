// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';
import partytown from '@astrojs/partytown';
import { execFileSync } from 'node:child_process';

// Sitemap <lastmod>: the newest git commit touching each page or the data it renders, so
// Bing/IndexNow and other crawlers can tell which pages actually changed. Falls back to
// the build date when git history isn't available.
const PAGE_SOURCES = {
  '/': ['src/pages/index.astro', 'src/components', 'src/lib', 'src/data'],
  '/menu/': ['src/pages/menu.astro', 'src/components/MenuSection.tsx', 'src/data/menu.json'],
  '/faq/': ['src/pages/faq.astro', 'src/data/faq.json'],
  '/events/': ['src/pages/events.astro', 'src/lib/events.ts', 'src/data/events.json'],
  '/directions/': ['src/pages/directions.astro'],
  '/near-grand-canyon/': ['src/pages/near-grand-canyon.astro', 'src/data/menu.json'],
  '/near-williams/': ['src/pages/near-williams.astro', 'src/data/menu.json'],
};
const BUILD_DATE = new Date().toISOString();

function lastModified(pathname) {
  const sources = PAGE_SOURCES[pathname];
  if (!sources) return BUILD_DATE;
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...sources], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return date ? new Date(date).toISOString() : BUILD_DATE;
  } catch {
    return BUILD_DATE;
  }
}

export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7 defaults to 'jsx' whitespace rules, which drop the spaces around
  // inline links/spans that Prettier wraps onto new lines. Keep the lossless
  // Astro 5 behavior.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    indexnow({ key: '5a973t3xfryc2gchkn1q6chy26ss2au9' }),
    react(),
    sitemap({
      serialize(item) {
        item.lastmod = lastModified(new URL(item.url).pathname);
        return item;
      },
    }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  devToolbar: { enabled: false },
});
