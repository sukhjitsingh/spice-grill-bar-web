// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    indexnow({
      key: '5a973t3xfryc2gchkn1q6chy26ss2au9',
    }),
    react(),
    tailwind(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
