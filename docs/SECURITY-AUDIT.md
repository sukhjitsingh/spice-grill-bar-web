# Dependency Security Audit

GitHub Dependabot reported 132 alerts on `main`. It counts each advisory per dependency path, so the number is higher than `npm audit`'s. Counts below are `npm audit` against `package-lock.json`.

|                                                | Critical | High | Moderate | Low | Total |
| ---------------------------------------------- | -------- | ---- | -------- | --- | ----- |
| Before (`main` @ afd41a3)                      | 2        | 39   | 34       | 4   | 79    |
| Round 1: in-range fixes (PR #16)               | 1        | 17   | 26       | 3   | 47    |
| Round 2: Astro 5 → 7 migration (this revision) | 0        | 15   | 26       | 2   | 43    |

All remaining high advisories are in **dev-only tooling** that never ships in `dist/` (see below).

## Round 1: in-range fixes (2026-10-31, PR #16)

All changes stayed within semver ranges. Nothing was installed with `--force`.

- `npm audit fix` updated transitive packages (vite 6.4.5, devalue, h3, proxy-addr, axios, lodash, picomatch, ws, js-yaml, body-parser, form-data, svgo, …).
- `astro` ^5.17.1 → ^5.18.2, `@astrojs/sitemap` ^3.7.0 → ^3.7.4, `postcss` ^8.5.6 → ^8.5.32, `@axe-core/cli` ^4.11.0 → ^4.14.0.

## Round 2: Astro 7 migration (2026-10-31)

### Package changes

| Package              | From    | To        | Notes                                                 |
| -------------------- | ------- | --------- | ----------------------------------------------------- |
| `astro`              | ^5.18.2 | ^7.4.4    | Brings Vite 8 (Rolldown), zod 4.6.x, sharp 0.35.5     |
| `@astrojs/react`     | ^4.4.2  | ^7.1.2    | `oxc-transform-react` peer is optional and not needed |
| `@astrojs/partytown` | ^2.1.4  | ^2.1.9    |                                                       |
| `astro-indexnow`     | ^2.1.0  | ^2.3.10   | Declares `astro ^7` support                           |
| `@astrojs/check`     | ^0.9.6  | ^0.9.12   |                                                       |
| `engines.node`       | (none)  | >=22.23.4 | Required by Astro 7. CI already uses Node 24.         |

Advisories resolved by this: the astro critical (AVIF optimization RCE, GHSA-26w7-cxv4-gfx2) and its high/moderate XSS and SSRF advisories, sharp (libvips/libheif/librsvg), and zod 3 in the build chain.

### Breaking change found and fixed: `compressHTML`

Astro 7 changes the `compressHTML` default to `'jsx'`, which applies React's whitespace rules. That drops the space at a line break between text and an inline element. This repo's Prettier-formatted markup relies on those spaces, for example:

```astro
between
<a href="/directions/#williams">Williams</a>
```

With the default, visible text on the rendered pages broke: "ourfrequently asked questions", "betweenWilliamsandSeligmanon", "about78 miles", "takeI-40". This affected the home, directions, near-grand-canyon and near-williams pages.

**Fix:** set `compressHTML: true` in `astro.config.mjs` to restore Astro 5's lossless whitespace handling. After the fix, the rendered text on all pages matches Astro 5 exactly.

### Other differences (reviewed, no action needed)

- **React SSR image preload hints are gone.** Astro 5 + `@astrojs/react` 4 emitted `<link rel="preload" as="image">` for `/logo_light.svg`, `/logo_dark.svg` and `/location-preview.webp` (the last is the below-the-fold Maps placeholder). `@astrojs/react` 7 no longer emits them. Lighthouse LCP did not get worse; it improved slightly.
- **`fetchpriority="auto"` is no longer written** on one lazy-loaded image. `auto` is the browser default, so this changes nothing.
- **Fewer files in `dist/_astro`** (17 MB vs 21 MB). Astro 7 no longer emits unreferenced copies of some source images. Every `src`/`srcset`/`href` in the HTML still resolves, and every `<picture>` has the same formats, widths and `sizes`.
- **JS chunking changed** (Rolldown: `react.*.js`, `react-dom.*.js`, `rolldown-runtime.*.js`). Total client JS is about the same (348 KB vs 352 KB).
- **The Vite "didn't resolve at build time" warning** appears on both Astro 5 and 7.

### Verification (Astro 5 baseline build vs Astro 7 build)

| Check                                                                                           | Result                                                                                               |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Build, lint, knip, typecheck (`astro check` + `tsc`), AEO audit                                 | Pass (0 errors, 0 warnings)                                                                          |
| Lighthouse CI assertions (`.lighthouserc.json`, 6 URLs × 3 runs)                                | Pass. Home: perf 0.94, a11y 0.96, LCP 3013 ms (was 3163 ms), TBT 0, CLS 0                            |
| Playwright e2e (`e2e/animations.spec.ts`: mobile sheet, theme toggle, mobile action buttons)    | 3/3 pass on the Astro 7 dev server                                                                   |
| All 6 routes on the Astro 7 dev server                                                          | 200                                                                                                  |
| JSON-LD, meta tags, headings, links, ids, ARIA                                                  | Identical on all pages                                                                               |
| Rendered `innerText` and page height, desktop 1366 px and mobile 390 px                         | Identical on all 6 pages                                                                             |
| Full-page screenshot pixel diff                                                                 | 0% on all pages except the home page's continuously animated reviews marquee                         |
| Island hydration (`Header` load, `MenuSection` / `GoogleMap` visible) and menu category buttons | Identical, no JS errors                                                                              |
| `<ClientRouter>` navigation home → events → back, desktop and mobile menu                       | SPA navigation, `astro:page-load` fires, past-event filter runs (6/54 shown), no errors              |
| axe-core WCAG 2 A/AA + best practices, light and dark                                           | Same results as Astro 5 on every page. No contrast violations. Earlier minor findings are unchanged. |

## Remaining high advisories (dev-only, documented)

| Package chain                                                                                                                                        | Notes                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@lhci/cli` 0.15.1 → lighthouse → puppeteer-core → `@puppeteer/browsers`, chromium-bidi (zod 3), extract-zip, tmp, proxy-agent → get-uri → basic-ftp | 0.15.1 is the latest release and there is no fix upstream. It only runs `lhci autorun` against the local `dist/`. |
| `@axe-core/cli` 4.14.0 → chromedriver → proxy-agent → basic-ftp                                                                                      | Latest release. Used only for local accessibility audits.                                                         |
| eslint 8 / airbnb-typescript configs, playwright                                                                                                     | Lint and test tooling only.                                                                                       |

None of these packages run in production. Apache serves only the static `dist/` output.
