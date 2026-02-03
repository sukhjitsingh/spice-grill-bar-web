// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
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
