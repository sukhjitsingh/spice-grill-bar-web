# Architecture

**Analysis Date:** 2026-02-20

## Pattern Overview

**Overall:** Astro Static Site Generator with Island Architecture (Astro Islands)

**Key Characteristics:**

- Zero JavaScript by default, opt-in interactivity via React islands
- Multi-page static site (index, faq) with server-side rendering
- Hybrid component system: Astro components for markup, React components for interactivity
- Structured data (JSON-LD) for SEO integration
- Dark mode support via CSS variables and client-side theme switching
- Lazy-loaded interactive sections (menu component, google maps)

## Layers

**Presentation Layer:**

- Purpose: Render static page markup and interactive UI components
- Location: `src/pages/`, `src/layouts/`, `src/components/`
- Contains: Astro pages, React components, Astro layout wrapper
- Depends on: Data layer, utilities, UI components
- Used by: Browser, search engines

**Component Layer:**

- Purpose: Reusable UI pieces organized by purpose
- Location: `src/components/`
- Contains: Page sections (Hero, MenuSection, ReviewsSection), UI primitives, schema components
- Depends on: Utils, data layer, external libraries (Radix UI, Lucide)
- Used by: Pages, layout

**Data Layer:**

- Purpose: Static content structured as JSON
- Location: `src/data/`
- Contains: menu.json, faq.json, reviews.json
- Depends on: None
- Used by: Components (imported directly)

**Utilities & Style Layer:**

- Purpose: Shared functions, CSS utilities, theme configuration
- Location: `src/lib/`, `src/styles/`, configuration files
- Contains: `cn()` utility for class merging, CSS custom properties, Tailwind config
- Depends on: External libraries (clsx, tailwind-merge)
- Used by: All components

**Schema/SEO Layer:**

- Purpose: Structured data markup for search engines and social platforms
- Location: `src/components/schema/`
- Contains: JSON-LD schema components (Restaurant, FAQ, Breadcrumb, Organization, etc.)
- Depends on: schema-dts library for type safety
- Used by: Layout (rendered in HTML head)

## Data Flow

**Page Load Flow:**

1. Browser requests `/` or `/faq/`
2. Astro server processes page file (`src/pages/index.astro` or `src/pages/faq.astro`)
3. Page imports Layout component which imports schema components, fonts, styles
4. Layout wraps page content and injects structured data
5. Page imports section components (Hero, MenuSection, ReviewsSection, etc.)
6. Components import data files (menu.json, faq.json, reviews.json)
7. Astro builds static HTML output with CSS inlined
8. React components marked with `client:visible` remain hydrated for interactivity
9. Client-side scripts handle theme toggling and scroll interactions

**Interactive Component Flow (MenuSection):**

1. Component loads with `client:visible` directive (lazy hydration)
2. Menu data imported from `src/data/menu.json`
3. useState manages active category
4. useEffect adds scroll listener with requestAnimationFrame for performance
5. Smooth scroll navigation between categories
6. Component re-renders on category change

**Theme Switching Flow:**

1. `src/components/mode-toggle.tsx` renders dropdown menu
2. User selects theme (light/dark/system)
3. JavaScript modifies `document.documentElement.classList` ('dark' class)
4. CSS custom properties in `:root` and `.dark` selectors apply
5. Theme preference stored in localStorage
6. Initialization script (`/scripts/theme.js`) runs before hydration to prevent flash

**Header Navigation Flow:**

1. Header component mounts with scroll listener
2. On scroll > 10px, applies glass morphism effect
3. Navigation links check current path to redirect hash links appropriately
4. Mobile menu uses Sheet component (Radix UI) for dropdown
5. Desktop shows full navigation with hover effects

**Google Maps Loading:**

1. LocationSection component references GoogleMap child
2. GoogleMap uses IntersectionObserver to detect viewport visibility
3. 200px before map enters viewport, starts loading iframe
4. Shows preview image and loading state until iframe ready
5. User can also click to force load

**State Management:**

- No global state management tool (Redux, Zustand, etc.)
- Component-level state via React hooks (useState, useEffect)
- Theme stored in localStorage with fallback to system preference
- Menu navigation state stored in component memory (resets on navigation)

## Key Abstractions

**Layout Wrapper:**

- Purpose: Root template for all pages with consistent header, footer, schema components
- Examples: `src/layouts/Layout.astro`
- Pattern: Top-level template with slots for page-specific content

**Section Components:**

- Purpose: Full-width page sections with specific content and styling
- Examples: `src/components/Hero.astro`, `src/components/MenuSection.tsx`, `src/components/ReviewsSection.astro`
- Pattern: Self-contained sections that render independently, can be reordered

**Schema Components:**

- Purpose: Type-safe structured data markup (JSON-LD)
- Examples: `src/components/schema/RestaurantSchema.astro`, `src/components/schema/MenuSchema.astro`
- Pattern: Astro components that render `<script type="application/ld+json">` tags

**UI Primitives:**

- Purpose: Low-level, composable interactive components with Radix UI accessibility
- Examples: `src/components/ui/button.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/dropdown-menu.tsx`
- Pattern: CVA (class-variance-authority) for variant styling, uncontrolled state handling

**Data Models:**

- Purpose: TypeScript interfaces defining structure of JSON data
- Examples: `MenuItem`, `MenuCategory` in `src/components/MenuSection.tsx`
- Pattern: Interfaces defined locally in consuming components, JSON imported directly

## Entry Points

**Index Page:**

- Location: `src/pages/index.astro`
- Triggers: User navigates to `/`
- Responsibilities: Import and arrange page sections, pass props to layout

**FAQ Page:**

- Location: `src/pages/faq.astro`
- Triggers: User navigates to `/faq/`
- Responsibilities: Import FAQ data, render Q&A list, use layout

**Layout Entry:**

- Location: `src/layouts/Layout.astro`
- Triggers: Every page uses Layout component
- Responsibilities: Define HTML structure, inject fonts/styles/scripts, render schema, header, footer

**Header Component:**

- Location: `src/components/Header.tsx`
- Triggers: Layout renders in body
- Responsibilities: Navigation, mobile menu, phone button, order button, theme toggle

## Error Handling

**Strategy:** Limited error handling - static site generation catches build-time errors

**Patterns:**

- No explicit try-catch blocks in components
- Google Maps loads gracefully with fallback preview image
- Missing environment variable (PUBLIC_GOOGLE_MAPS_API_KEY) would cause build error
- No client-side error boundaries currently implemented
- Smooth fallbacks: menu scroll listener uses requestAnimationFrame to prevent janky behavior

## Cross-Cutting Concerns

**Logging:**

- Google Analytics via Partytown (moved off main thread)
- GTM configuration in `/scripts/gtm.js`
- No application-level logging

**Validation:**

- TypeScript provides compile-time type validation
- JSON data files have implicit schema (MenuItem, MenuCategory interfaces)
- No runtime validation of external APIs

**Authentication:**

- Not applicable (public website)
- External order system (Toast Tab) handles checkout authentication

**Accessibility:**

- ARIA labels on interactive elements
- Focus ring styles on buttons
- Semantic HTML (nav, main, section tags)
- Dark mode for reduced eye strain
- Skip-to-content patterns could be added

**Performance:**

- Static HTML output (no server runtime cost)
- Lazy hydration for interactive components
- Lazy loading for Google Maps
- IntersectionObserver for viewport-aware loading
- CSS-in-JS avoided (Tailwind inline only)
- requestAnimationFrame for scroll handlers
- Image optimization (WebP format in assets)

---

_Architecture analysis: 2026-02-20_
