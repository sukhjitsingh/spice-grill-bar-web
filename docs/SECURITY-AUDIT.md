# Dependency Security Audit — 2026-10-31

GitHub Dependabot reported 132 alerts on `main`. It counts each advisory per dependency path, so the number is higher than `npm audit`'s. Against `package-lock.json`, `npm audit` reported:

|                           | Critical | High | Moderate | Low | Total |
| ------------------------- | -------- | ---- | -------- | --- | ----- |
| Before (`main` @ afd41a3) | 2        | 39   | 34       | 4   | 79    |
| After this change         | 1        | 17   | 26       | 3   | 47    |

## What changed

All changes stay within semver ranges. Nothing was installed with `--force`.

- `npm audit fix` updated transitive packages (vite 6.4.5, devalue, h3, proxy-addr, axios, lodash, picomatch, ws, js-yaml, body-parser, form-data, svgo, …).
- `astro` ^5.17.1 → ^5.18.2 (latest 5.x)
- `@astrojs/sitemap` ^3.7.0 → ^3.7.4 (moves to zod 4.6.x)
- `postcss` ^8.5.6 → ^8.5.32
- `@axe-core/cli` ^4.11.0 → ^4.14.0 (chromedriver 152)
- `npm update` brought in in-range updates for the other dependencies.

## Remaining critical/high advisories

### Runtime/build chain (Astro 5 only gets these fixes in 6.x/7.x)

The site builds as **fully static output**. It has no SSR adapter, server islands, middleware or remote image domains, and Apache serves only `dist/`. None of these packages runs in production. They run only on the developer or CI machine, at build time, and only on content from this repository.

| Package              | Advisory                                                                                                                   | Why it does not affect this site                                                                                                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| astro (critical)     | [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2): RCE through AVIF image optimization              | `<Picture formats={['avif','webp']}>` in `Hero.astro` and `OurStorySection.astro` only processes local images from the repo, at build time. No attacker-supplied images and no runtime image endpoint. |
| astro (high)         | [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7): Host-header SSRF in prerendered error-page fetch | Needs an SSR server that handles requests. Static output has none.                                                                                                                                     |
| astro (high)         | [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp): reflected XSS via slot name                      | Needs slot names taken from request input. All slots are static in the source.                                                                                                                         |
| astro (moderate/low) | define:vars, spread attributes, transition:*, View Transitions, base stripping, JSX/MDX script content                     | Needs request-time rendering of untrusted input. All rendered data is the repo's own JSON (`src/data/*.json`).                                                                                         |
| sharp 0.34.5 (high)  | libvips / libheif / librsvg CVEs                                                                                           | Pinned by Astro 5 (`^0.34.0`). Only runs at build time on trusted local images.                                                                                                                        |
| zod 3.25.x (high)    | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): memory exhaustion on oversized collections       | Pinned by Astro 5. Only validates the repo's own config and content at build time.                                                                                                                     |

### Dev-only tooling (never shipped, documented only)

| Package chain                                                                                                                                        | Notes                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@lhci/cli` 0.15.1 → lighthouse → puppeteer-core → `@puppeteer/browsers`, chromium-bidi (zod 3), extract-zip, tmp, proxy-agent → get-uri → basic-ftp | 0.15.1 is the latest release and there is no fix upstream. It only runs `lhci autorun` against the local `dist/`. |
| `@axe-core/cli` 4.14.0 → chromedriver → proxy-agent → basic-ftp                                                                                      | Latest release. Used only for local accessibility audits.                                                         |
| eslint 8 / airbnb-typescript configs, playwright                                                                                                     | Lint and test tooling only.                                                                                       |

## Follow-up: Astro 7 migration

The remaining Astro, sharp and zod advisories are only fixed in a major-version upgrade. That should be a separate PR:

- `astro` 5 → 7 (Vite 8, zod 4, sharp ^0.35.4), `@astrojs/react` 4 → 7, and `@astrojs/check` / `@astrojs/partytown` / `astro-indexnow` peers (indexnow already supports `^7`).
- Astro 7 needs Node `>=22.23.4`. Check local, CI (`.github/workflows/update-reviews.yml`) and the build host.
- Review the Astro 6 and 7 upgrade guides for content, image and integration API changes. Then rerun `npm run qa`, including the Lighthouse CI thresholds in `.lighthouserc.json`.
