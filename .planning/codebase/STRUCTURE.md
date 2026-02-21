# Codebase Structure

**Analysis Date:** 2026-02-20

## Directory Layout

```
spice-grill-bar-web/
├── src/                      # All source code
│   ├── pages/               # Page routing (file-based routing)
│   │   ├── index.astro      # Home page (/)
│   │   └── faq.astro        # FAQ page (/faq/)
│   ├── layouts/             # Page layout wrappers
│   │   └── Layout.astro     # Root HTML template for all pages
│   ├── components/          # Reusable components
│   │   ├── schema/          # JSON-LD structured data
│   │   ├── ui/              # Radix UI-based primitives
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.astro     # Page footer
│   │   ├── MenuSection.tsx  # Menu display with categories
│   │   ├── GoogleMap.tsx    # Lazy-loaded map iframe
│   │   ├── Hero.astro       # Hero banner section
│   │   ├── ReviewsSection.astro  # Customer reviews display
│   │   ├── LocationSection.astro # Location info + embedded map
│   │   ├── OrderSection.astro    # Call-to-action buttons
│   │   ├── OurStorySection.astro # Restaurant history
│   │   └── mode-toggle.tsx  # Dark/light theme switcher
│   ├── data/                # Static JSON data
│   │   ├── menu.json        # Menu items by category
│   │   ├── faq.json         # FAQ questions and answers
│   │   └── reviews.json     # Customer testimonials
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Class name merging (cn())
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind + CSS variables
│   ├── assets/              # Images, icons, media
│   │   ├── HomePageBackground.webp
│   │   ├── GarlicNaan.webp
│   │   ├── ShahiPaneer.webp
│   │   └── background.svg
│   └── env.d.ts             # TypeScript environment types
├── public/                  # Static assets served as-is
│   ├── scripts/             # Client-side JavaScript
│   │   ├── theme.js         # Dark mode initialization
│   │   └── gtm.js           # Google Tag Manager
│   ├── favicon.svg          # Site icon
│   ├── favicon.ico
│   ├── manifest.json        # PWA manifest
│   ├── robots.txt           # Search engine crawling rules
│   ├── llms.txt             # LLM instructions
│   └── location-preview.webp  # Map preview before loading
├── scripts/                 # Build/dev scripts
│   ├── aeo-audit.mjs        # Astro Element Observer audit
│   ├── audit.mjs            # Generic audits
│   ├── generate-seo-report.mjs  # SEO reporting
│   ├── security-scan.mjs    # Security scanning
│   └── lhci-config.json     # Lighthouse CI config (may be elsewhere)
├── .planning/               # GSD planning documents
│   └── codebase/            # Analyzed codebase documentation
├── docs/                    # Project documentation
│   └── ImprovementPlan.md   # Development roadmap
├── reports/                 # Generated reports (audit outputs)
├── dist/                    # Built output (generated)
├── .astro/                  # Astro internal cache
├── .github/                 # GitHub configuration
├── .vscode/                 # VS Code settings
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── astro.config.mjs         # Astro build configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
├── .eslintrc.cjs            # ESLint configuration
├── .prettierrc.mjs          # Prettier formatting config
├── .lighthouserc.json       # Lighthouse CI configuration
├── knip.json                # Knip unused code detection
├── commitlint.config.cjs    # Git commit message validation
├── .htaccess                # Apache server configuration
└── .gitignore               # Git ignore rules
```

## Directory Purposes

**src/pages:**

- Purpose: File-based routing - each `.astro` file becomes a route
- Contains: Page templates that wrap content in Layout
- Key files: `index.astro` (homepage), `faq.astro` (FAQ page)
- Pattern: Frontmatter imports components, body is JSX-like template

**src/layouts:**

- Purpose: Shared HTML wrapper for all pages
- Contains: DOCTYPE, head tags, schema components, persistent header/footer
- Key files: `Layout.astro` (universal page wrapper)
- Pattern: Uses `<slot />` to inject page-specific content

**src/components:**

- Purpose: Reusable UI pieces organized by concern
- Contains: Page sections, Radix UI components, themed toggles, maps, forms
- Key files: `Header.tsx` (navigation), `MenuSection.tsx` (menu display), schema components
- Pattern: Astro or React depending on interactivity needs

**src/components/ui:**

- Purpose: Unstyled, accessible component primitives (Radix UI wrappers)
- Contains: Button, Sheet (off-canvas), Dropdown Menu
- Key files: `button.tsx` (styled button), `sheet.tsx` (mobile menu drawer)
- Pattern: CVA for variants, Slot for composition flexibility

**src/components/schema:**

- Purpose: JSON-LD structured data for SEO and social sharing
- Contains: Restaurant info, FAQ schema, Menu schema, Breadcrumbs, Organization
- Key files: All schema components (6 files)
- Pattern: Type-safe via schema-dts library

**src/data:**

- Purpose: Content separated from presentation
- Contains: Menu items with prices/descriptions, FAQ Q&A, review text
- Key files: `menu.json` (15KB - largest), `faq.json`, `reviews.json`
- Pattern: Simple JSON arrays with objects matching component interfaces

**src/lib:**

- Purpose: Shared utility functions
- Contains: Class name utilities
- Key files: `utils.ts` (cn function using clsx + tailwind-merge)
- Pattern: Minimal, focused utilities

**src/styles:**

- Purpose: Global CSS and design tokens
- Contains: CSS custom properties, Tailwind directives, utility classes
- Key files: `globals.css` (CSS variables for colors, dark mode)
- Pattern: Utility-first with CSS variable fallbacks

**src/assets:**

- Purpose: Images optimized for web
- Contains: PNG, WebP, SVG files
- Key files: `HomePageBackground.webp` (hero image), food photos
- Pattern: WebP for photos, SVG for icons

**public/:**

- Purpose: Static assets copied as-is during build (no processing)
- Contains: Client-side scripts, manifest, search engine files
- Key files: `scripts/theme.js` (runs before hydration), `robots.txt`
- Pattern: Any asset that should have a predictable URL

**public/scripts/:**

- Purpose: Client-side JavaScript that runs in browser
- Contains: Theme initialization, Google Tag Manager
- Key files: `theme.js` (prevents dark mode flash), `gtm.js` (analytics)
- Pattern: Run inline in HTML `<script>` tags before Hydration

**scripts/:**

- Purpose: Build-time Node.js scripts for quality assurance
- Contains: Audit runners, report generators
- Key files: `aeo-audit.mjs` (Astro element observer), `generate-seo-report.mjs`
- Pattern: Run via npm scripts (test:audit, test:report, test:security)

**.planning/codebase/:**

- Purpose: GSD-generated codebase analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md
- Key files: This directory
- Generated: Yes, by /gsd:map-codebase commands

## Key File Locations

**Entry Points:**

- `src/pages/index.astro`: Homepage routing entry point
- `src/pages/faq.astro`: FAQ page routing entry point
- `src/layouts/Layout.astro`: HTML document root for all pages

**Configuration:**

- `astro.config.mjs`: Build settings, integrations, site URL
- `tsconfig.json`: TypeScript strict mode, path alias `@/*` → `src/*`
- `tailwind.config.mjs`: Color tokens, font families, responsive breakpoints
- `.eslintrc.cjs`: Linting rules for Astro, TypeScript, React
- `.lighthouserc.json`: Lighthouse CI thresholds and targets

**Core Logic:**

- `src/components/Header.tsx`: Navigation, mobile menu, header interactivity
- `src/components/MenuSection.tsx`: Menu data display, category switching
- `src/components/GoogleMap.tsx`: Lazy loading iframe with preview fallback

**Styling & Utilities:**

- `src/styles/globals.css`: Design tokens (colors, fonts), dark mode setup
- `src/lib/utils.ts`: Class name merging utility
- `tailwind.config.mjs`: Tailwind plugin configuration

**Testing & Quality:**

- `scripts/aeo-audit.mjs`: Astro element observer metrics
- `scripts/audit.mjs`: Generic build audits
- `scripts/security-scan.mjs`: Security vulnerability scanning

## Naming Conventions

**Files:**

- React components (interactive): PascalCase + `.tsx` (e.g., `Header.tsx`, `GoogleMap.tsx`)
- Astro components (static): PascalCase + `.astro` (e.g., `Layout.astro`, `Hero.astro`)
- Utility files: camelCase + `.ts` (e.g., `utils.ts`)
- Data files: kebab-case + `.json` (e.g., `menu.json`, `faq.json`)
- Script files: camelCase + `.mjs` for ESM (e.g., `aeo-audit.mjs`)

**Directories:**

- Component directories: lowercase (e.g., `components/`, `schema/`, `ui/`)
- Feature directories: lowercase (e.g., `data/`, `lib/`, `pages/`)
- Compound words: no separation (e.g., `schema`, not `s-c-h-e-m-a`)

**Classes & Exports:**

- React components: PascalCase (e.g., `export function Header()`, `export function MenuSection()`)
- Utility functions: camelCase (e.g., `export function cn()`)
- Interfaces/Types: PascalCase (e.g., `interface MenuItem`, `interface MenuCategory`)

**CSS Classes & IDs:**

- Tailwind: Use utility classes directly (e.g., `className="flex items-center"`)
- Custom: kebab-case (e.g., `id="menu-category"`, `class="menu-section"`)
- Component-specific: prefix with component name (e.g., `.hide-scroll` is reusable utility)

## Where to Add New Code

**New Feature (e.g., reservations system):**

- Primary code: Create new file `src/pages/reservations.astro` for page, `src/components/ReservationForm.tsx` for form
- Tests: Create `src/components/ReservationForm.test.tsx` (if testing framework added)
- Data: Add `src/data/reservations.json` if needed
- Styling: Add custom styles to `src/styles/globals.css` or component-scoped Tailwind

**New Component/Module:**

- If interactive (state, effects): `src/components/ComponentName.tsx` with React
- If static markup only: `src/components/ComponentName.astro` with Astro
- If reusable primitive: `src/components/ui/component-name.tsx` with Radix UI + CVA
- If data-driven: Add interface in consuming component or shared types file

**Utilities:**

- Shared helpers: `src/lib/utils.ts` (add function alongside `cn()`)
- CSS utilities: `src/styles/globals.css` in `@layer utilities` section
- Constants: `src/lib/constants.ts` (create if needed)

**Content/Data:**

- Static content: `src/data/content-name.json` with matching TypeScript interface
- Reusable interfaces: Define in consuming component or `src/lib/types.ts`

**Styling New Components:**

- Use Tailwind classes inline (preferred): `className="flex items-center gap-2"`
- For complex variants: Use CVA like `src/components/ui/button.tsx`
- Global styles: Only for utility classes, CSS variables in `src/styles/globals.css`

## Special Directories

**src/components/schema/:**

- Purpose: Isolated JSON-LD schema components
- Generated: No
- Committed: Yes
- Pattern: Each schema type has its own Astro component file

**src/components/ui/:**

- Purpose: Radix UI wrapper components with Tailwind styling
- Generated: No (but could be generated by UI library CLI in future)
- Committed: Yes
- Pattern: Primitive, reusable, unstyled-first with CVA variants

**public/scripts/:**

- Purpose: Scripts that must run early (before framework hydration)
- Generated: No
- Committed: Yes
- Pattern: Inline in HTML with `<script is:inline>` tag

**.astro/:**

- Purpose: Astro build cache and type definitions
- Generated: Yes (auto-generated by Astro)
- Committed: No (in .gitignore)

**dist/:**

- Purpose: Build output ready for deployment
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

**reports/:**

- Purpose: Generated audit and test reports
- Generated: Yes (by audit scripts)
- Committed: No (in .gitignore)

## Module Organization

**Page-to-Component Flow:**

```
pages/index.astro
  ├── imports Layout.astro
  ├── imports Hero.astro
  ├── imports MenuSection.tsx (client:visible)
  └── imports ReviewsSection.astro
```

**Component Import Pattern:**

```
src/components/MenuSection.tsx
  ├── imports menuData from @/data/menu.json
  ├── imports { cn } from @/lib/utils
  ├── imports * as React (hooks)
  └── defines MenuCategory, MenuItem interfaces locally
```

**Layout Injection Pattern:**

```
Layout.astro renders:
  <head>
    <schema components>
    <client scripts>
  </head>
  <body>
    <Header client:visible />
    <slot /> (page content)
    <Footer />
  </body>
```

---

_Structure analysis: 2026-02-20_
