// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    indexnow({ key: '5a973t3xfryc2gchkn1q6chy26ss2au9' }),
    react(),
    sitemap(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  devToolbar: { enabled: false },
});
