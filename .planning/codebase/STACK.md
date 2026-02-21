# Technology Stack

**Analysis Date:** 2026-02-20

## Languages

**Primary:**

- JavaScript/TypeScript - Frontend and build scripts
- TypeScript 5.5.4 - Type safety for React components and Astro files

**Secondary:**

- HTML5/CSS3 - Markup and styling via Tailwind
- Shell/Bash - CI/CD workflows

## Runtime

**Environment:**

- Node.js 20 - Development and CI/CD (specified in GitHub workflow `.github/workflows/update-reviews.yml`)

**Package Manager:**

- npm - Dependency management
- Lockfile: package-lock.json (type: "module" in `package.json` indicates ESM)

## Frameworks

**Core:**

- Astro 5.17.1 - Static site generator, primary framework
- React 19.2.4 - Interactive UI components (islands architecture)
- React DOM 19.2.4 - React runtime

**Styling:**

- Tailwind CSS 3.4.19 - Utility-first CSS framework
- PostCSS 8.5.6 - CSS preprocessing
- Autoprefixer 10.4.24 - Browser compatibility

**Component Libraries:**

- Radix UI - Headless UI components:
  - `@radix-ui/react-dialog` 1.1.15 - Dialog/modal component
  - `@radix-ui/react-dropdown-menu` 2.1.16 - Dropdown menus
  - `@radix-ui/react-label` 2.1.8 - Form labels
  - `@radix-ui/react-separator` 1.1.8 - Visual separators
  - `@radix-ui/react-slot` 1.2.4 - Slot composition
- lucide-react 0.563.0 - Icon library

**Utility Libraries:**

- class-variance-authority 0.7.1 - Component variant management
- clsx 2.1.1 - Conditional className binding
- tailwind-merge 3.4.0 - Tailwind class conflict resolution
- tailwindcss-animate 1.0.7 - Animation utilities

**Fonts:**

- @fontsource/open-sans 5.2.7 - Open Sans font (sans-serif family)
- @fontsource/playfair-display 5.2.8 - Playfair Display font (serif family)

## Testing & Quality Tools

**Testing:**

- jsdom 27.4.0 - DOM simulation for audits and checks

**Code Quality:**

- ESLint 8.57.1 - JavaScript linting with TypeScript support
  - eslint-config-airbnb-typescript 18.0.0 - Airbnb style guide
  - eslint-config-prettier 10.1.8 - Prettier integration
  - eslint-plugin-astro 1.5.0 - Astro file linting
  - eslint-plugin-import 2.32.0 - Import statement linting
  - eslint-plugin-jsx-a11y 6.10.2 - Accessibility linting
  - eslint-plugin-prettier 5.5.5 - Prettier as ESLint rule
  - eslint-plugin-react 7.37.5 - React linting
  - eslint-plugin-react-hooks 7.0.1 - React hooks linting
  - eslint-plugin-simple-import-sort 12.1.1 - Import sorting
  - astro-eslint-parser 1.2.2 - Astro syntax parsing

**Formatting:**

- Prettier 3.8.1 - Code formatter
  - prettier-plugin-astro 0.14.1 - Astro file formatting

**Type Checking:**

- @astrojs/check 0.9.6 - Astro TypeScript validation

**Linting Tools:**

- knip 5.83.0 - Unused code detection
- @axe-core/cli 4.11.0 - Web accessibility audits

**Performance & SEO:**

- @lhci/cli 0.15.1 - Lighthouse CI integration
- schema-dts 1.1.5 - JSON-LD schema type generation

## Build & Dev Tools

**Build:**

- Astro 5.17.1 - Static site generation with output format: 'directory'

**Dev & Integration:**

- @astrojs/react 4.4.2 - React integration for Astro
- @astrojs/tailwind 6.0.2 - Tailwind CSS integration
- @astrojs/sitemap 3.7.0 - Automatic sitemap generation
- @astrojs/partytown 2.1.4 - Third-party script optimization (Google Analytics via dataLayer.push)

**Git Hooks:**

- simple-git-hooks 2.13.1 - Git hook management
- lint-staged 16.2.7 - Pre-commit linting
- @commitlint/cli 20.4.1 - Commit message validation
- @commitlint/config-conventional 20.4.1 - Conventional commits standard

## Key Dependencies

**Critical:**

- Astro 5.17.1 - Entire site generation depends on this
- React 19.2.4 - Interactive components (Header, GoogleMap, MenuSection, ModeToggle)
- Tailwind CSS 3.4.19 - All styling (layout, components, theme)
- @astrojs/sitemap 3.7.0 - SEO-critical sitemap generation

**Infrastructure:**

- @astrojs/partytown 2.1.4 - Off-thread script execution for Google Analytics
- Radix UI suite - Accessible component primitives for modals, dropdowns, menus

## Configuration

**Environment:**

- Public environment variables only (Astro limitation for client-side)
  - `PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps Embed API key (stored in `.env`, referenced in `src/env.d.ts`)
  - Format: `PUBLIC_` prefix required for client-side access

**Build:**

- `astro.config.mjs` - Main Astro configuration
  - Site: `https://spicegrillbar66.com`
  - Trailing slashes: always
  - Output format: directory structure
- `tsconfig.json` - TypeScript configuration
  - Path alias: `@/*` maps to `src/*`
  - JSX: react-jsx
  - Strict mode enabled (extends astro/tsconfigs/strict)
- `tailwind.config.mjs` - Tailwind customization
  - Custom brand colors (orange, green, gold)
  - Font families (Open Sans, Playfair Display)
  - Dark mode: class-based
- `.prettierrc.mjs` - Code formatting
  - Print width: 100
  - Semicolons: true
  - Single quotes: true
  - Tab width: 2
- `commitlint.config.cjs` - Conventional commits validation
- `.lighthouserc.json` - Lighthouse CI assertions
  - LCP: < 4000ms
  - TBT: < 600ms
  - CLS: < 0.1
  - Accessibility: >= 90%
  - Best Practices: >= 80%
  - SEO: >= 90%

## Platform Requirements

**Development:**

- Node.js 20 or higher
- npm 8+ (for workspaces support if needed)
- Modern browser for dev toolbar
- ESLint + Prettier compatible editor (VS Code recommended)

**Production:**

- Static file hosting (Apache with .htaccess support)
- HTTPS enforcement via Apache mod_rewrite
- Gzip/Brotli compression support
- No server-side runtime required (fully static)

## Platform/Hosting

**Deployment Target:**

- Apache-compatible shared hosting (`.htaccess` configuration present)
- Static file distribution via `dist/` directory
- HTTPS enforced via rewrite rules in `.htaccess`
- Supports directory-based routing (Astro format: 'directory' generates `/page/index.html`)

## Special Build Outputs

**Generated Files:**

- `dist/` - Built site (committed to deployment)
- `dist/sitemap.xml` - Auto-generated from `dist/sitemap-index.xml` via postbuild script
- `.lighthouseci/` - Lighthouse CI reports (generated during CI runs)

---

_Stack analysis: 2026-02-20_
