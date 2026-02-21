# Codebase Concerns

**Analysis Date:** 2026-02-20

## Tech Debt

**Hardcoded Business Information Scattered Throughout Codebase:**

- Issue: Phone number (928-277-1292), address (33 Lewis Ave, Ash Fork, AZ 86320), and contact details are hardcoded in 11 locations across components
- Files: `src/components/Header.tsx`, `src/components/schema/RestaurantSchema.astro`, `src/layouts/Layout.astro`, `src/components/LocationSection.astro`, and schema components
- Impact: Updating business details requires manual changes in multiple places, risk of inconsistency. Difficult to maintain if location or hours change.
- Fix approach: Extract business data to `src/data/business.json` and import into all components that need it. Create a utility function to format address/phone/hours consistently.

**Unused Data Fields in Menu Structure:**

- Issue: `menu.json` contains `imageUrl` and `popularity` fields that are partially or not used in rendering
- Files: `src/data/menu.json` (589 lines total), `src/components/MenuSection.tsx` (does not render images), `src/components/schema/MenuSchema.astro` (conditionally uses imageUrl)
- Impact: Dead weight in JSON payload. Misleading schema hints images when none are displayed. Creates confusion for future maintainers
- Fix approach: Remove unused fields from menu.json or implement image display in MenuSection component. If images are future-planned, document this with a clear TODO and schema.

**Theme State Management Inconsistency:**

- Issue: `src/components/mode-toggle.tsx` declares but never uses `themeState` variable (set and immediately forgotten)
- Files: `src/components/mode-toggle.tsx` (lines 13-32)
- Impact: Misleading code suggests state is tracked when it isn't. Complicates debugging and maintenance.
- Fix approach: Remove unused state variable declaration. Theme switching is side-effect only (DOM + localStorage).

**Type Casting Without Safety:**

- Issue: `src/components/MenuSection.tsx` casts JSON data with `as MenuCategory[]` with no validation
- Files: `src/components/MenuSection.tsx` (line 17)
- Impact: Runtime error possible if menu.json structure changes. TypeScript won't catch data shape mismatches.
- Fix approach: Add runtime validation using Zod or simple TypeScript type guard before casting.

## Known Bugs

**Header Navigation Link Routing Bug on Non-Home Pages:**

- Symptoms: Navigation to menu/philosophy sections from `/faq/` creates broken anchor links (`/faq/#menu` instead of `/#menu`)
- Files: `src/components/Header.tsx` (lines 27-31)
- Trigger: Click "Menu" or "Philosophy" link when on `/faq/` page
- Workaround: User must navigate to home page first, then use anchor navigation. Or manually edit URL.
- Root cause: `getHref()` function prepends `/` to anchor links on non-home pages, assuming all anchors are on home. Breaks cross-page navigation.

**ReviewsSection Infinite Scroll Calculation:**

- Symptoms: Marquee animation may stutter or repeat at wrong intervals on mobile
- Files: `src/components/ReviewsSection.astro` (lines 119-130, marquee animation)
- Trigger: View reviews section on mobile devices with varying viewport widths
- Workaround: None currently
- Root cause: `transform: translateX(-33.333%)` assumes exact 3x duplication, but responsive widths may shift duration/translation ratio. Animation cycles don't align smoothly with content width changes.

## Security Considerations

**Google Maps API Key Exposure:**

- Risk: API key visible in browser requests and in `PUBLIC_` environment variable. Could be scraped/abused by competitors or bad actors
- Files: `src/components/GoogleMap.tsx`, `src/components/LocationSection.astro`
- Current mitigation: Using `PUBLIC_GOOGLE_MAPS_API_KEY` from Astro (client-side available). Google Maps API restrictions (HTTP referrer) provide limited protection but are not comprehensive
- Recommendations:
  - Consider restricting API key to `https://spicegrillbar66.com` only (requires Google Cloud Console setup)
  - Monitor API usage dashboard for unusual spikes
  - If budget becomes concern, consider moving map to server-side pre-rendered image or static map embed

**Content Security Policy (CSP) Permissive:**

- Risk: CSP header in `src/layouts/Layout.astro` (line 40-42) allows `'unsafe-inline'` for scripts and styles, and broad `https:` domains
- Files: `src/layouts/Layout.astro`
- Current mitigation: `frame-src` limited to Google Maps and `script-src` allows self + unsafe-inline + https (Partytown/GTM requires unsafe-inline)
- Recommendations:
  - Document why `unsafe-inline` is necessary (Partytown/GTM issue)
  - Consider nonce-based inline script injection instead of blanket unsafe-inline
  - Tighten `connect-src` to specific endpoints (GTM, Google Analytics)

**Environment Variable Missing Validation:**

- Risk: `.env` file `.env` is present and tracked in git (potentially visible in history), though currently only contains `PUBLIC_GOOGLE_MAPS_API_KEY`
- Files: `.env`
- Current mitigation: `.gitignore` does NOT include `.env` — relies on developer discipline
- Recommendations:
  - Add `.env` to `.gitignore` if it will contain secrets in future
  - Update `.env.example` or `.env.local` pattern for local development guidance
  - Document in CLAUDE.md that `.env` should never be committed

## Performance Bottlenecks

**MenuSection Scroll Event Listener Without Debounce/Throttle:**

- Problem: Scroll event fires on every frame, DOM queries execute on every scroll (even when not ticking)
- Files: `src/components/MenuSection.tsx` (lines 29-62)
- Cause: `requestAnimationFrame` throttle is manual flag-based, not optimized. `document.querySelectorAll('.menu-category')` runs every event
- Impact: On pages with many menu items, scroll performance degrades. Lighthouse CLS/FID may be affected on slower devices.
- Improvement path: Cache selector results outside handler. Consider Intersection Observer API for category tracking instead of scroll + DOM measurement. Test on low-end device.

**ReviewsSection Marquee Animation Uses CSS Transform, Will Reflow:**

- Problem: `transform: translateX()` is performant, but animation runs 20s on infinite loop with 3x duplication. High CLS risk if content loads slow.
- Files: `src/components/ReviewsSection.astro` (lines 119-130)
- Cause: Animation always running; reviews component is above fold (high visibility impact)
- Impact: Cumulative Layout Shift could increase if reviews load late or don't render initially
- Improvement path: Lazy-load reviews section, or add `content-visibility: auto` to reduce paint. Consider `will-change: transform` (already applied but verify browser support).

**GoogleMap Lazy Loading Intersection Observer Has 200px Margin:**

- Problem: Map iframe loads 200px before entering viewport, which is aggressive and may load map scripts when user isn't near it
- Files: `src/components/GoogleMap.tsx` (line 15)
- Cause: Pre-load optimization but may be too eager
- Impact: Unnecessary script execution if user scrolls quickly past map. LCP/LHC impact if user doesn't view map.
- Improvement path: Reduce rootMargin to 50px or make configurable. Benchmark actual user scroll patterns to justify margin.

## Fragile Areas

**Menu Category ID Generation via toKebabCase:**

- Files: `src/components/MenuSection.tsx` (lines 20-25)
- Why fragile: String transformation without escape handling. If category name contains special chars or numbers, kebab case may produce unexpected IDs
- Safe modification: Test with edge case category names (e.g., "5-Star Favorites", "Q&A Combo"). Add unit tests for `toKebabCase`. Or move to shared utility with full coverage.
- Test coverage: No unit tests for this function. Risk of silent failures if menu data adds special chars.

**Schema Components Hard-Coded Hours and Details:**

- Files: `src/components/schema/RestaurantSchema.astro` (hardcoded hours 07:00-22:00 M-F, 07:00-22:00 Sa-Su)
- Why fragile: Hours are duplicated from natural language in FAQ and schema. If hours change, both must be updated or schema becomes stale/wrong.
- Safe modification: Extract hours to `src/data/business.json` (see Tech Debt section). Import into schema and FAQ sections to maintain single source of truth.
- Test coverage: No automated check that schema hours match business data. AEO audit does not validate schema consistency.

**Reviews Data Auto-Update Dependency on External Gemini API:**

- Files: Referenced in `CLAUDE.md` (line 45) but mechanism not visible in source (likely in GitHub Actions)
- Why fragile: Auto-update script depends on Gemini API availability, authentication, and data format stability. If Gemini API changes, reviews stop updating silently.
- Safe modification: Add error handling/notifications if GitHub Action fails. Log failures to accessible dashboard. Consider manual fallback process.
- Test coverage: No validation that reviews.json is valid JSON before deployment. Could deploy malformed data if API returns bad format.

**Dark Mode Detection Race Condition:**

- Files: `src/layouts/Layout.astro` (line 92) loads `theme.js` inline to prevent flash. `src/components/mode-toggle.tsx` reads theme after hydration.
- Why fragile: If `theme.js` script fails to execute or DOM state out of sync with localStorage, mode toggle may show wrong initial state.
- Safe modification: Test in slow network (DevTools throttle), test in private/incognito windows (no localStorage), test after cache clear.
- Test coverage: No automated tests for theme switching behavior. Risk of regression.

## Scaling Limits

**Static Site with Hard-Coded Menu:**

- Current capacity: ~589 lines of JSON menu data (manageable)
- Limit: If menu grows to 100+ items across 10+ categories, JSON becomes unwieldy. Component rendering loops may slow down without virtualization.
- Scaling path:
  - At 1000+ items: Consider moving to CMS (Sanity, Contentful) with client-side filtering/search
  - Add search/filter UI to menu section for discoverability
  - Implement pagination or infinite scroll if items exceed 50+ on screen

**Hardcoded Hours and Details in Multiple Locations:**

- Current capacity: Works for single location with static hours
- Limit: If restaurant adds new location, hours change seasonally, or adds special hours, maintenance becomes error-prone
- Scaling path: Centralize business info in `src/data/business.json`. If multiple locations added, refactor to array of locations and iterate in schema/layout components.

**Review Marquee Performance:**

- Current capacity: ~15 reviews displayed on loop (duplicated 3x = 45 items in DOM)
- Limit: If reviews grow to 50+, continuous marquee animation with large DOM will cause jank on mobile
- Scaling path:
  - Implement carousel/slider UI with pagination instead of infinite scroll
  - Virtual scroll reviews (Swiper.js has built-in support)
  - Or keep marquee but use `will-change: transform` and test on Lighthouse

## Dependencies at Risk

**Astro Version 5 (New Framework for Team):**

- Risk: Migration from Next.js to Astro 5 is recent (migration branch suggests ongoing work). Limited production track record in team codebase.
- Impact: If Astro 5 has regressions or updates break builds, no fallback to Next.js structure exists in production.
- Migration plan: Keep Next.js artifacts removed (already done per commit `d149e7e`). Monitor Astro releases. Document any Astro-specific gotchas in CLAUDE.md. Maintain working build pipeline (pre-push hook).

**@astrojs/partytown for GTM Script:**

- Risk: Partytown is a niche dependency. If abandoned or incompatible with future Astro versions, GTM script injection breaks.
- Impact: Analytics tracking may fail. Debugging analytics issues becomes complex (off-thread execution).
- Migration plan: Monitor Partytown GitHub. Have fallback: move GTM inline or use Astro integrations middleware if Partytown fails. Test analytics on staging before production deployments.

**Radix UI React Components (Shipped to Client):**

- Risk: React overhead (19.2.4 + Radix components) for limited interactivity. Header + MenuSection + mode-toggle = ~50KB JavaScript minimum.
- Impact: LCP/FID metrics may degrade. Lighthouse scores may dip if React hydration is slow.
- Migration plan: Consider replacing React components with native HTML/web components (esp. dropdown-menu, sheet). Use Astro's islands architecture sparingly. Or keep React but implement code-splitting per component.

## Missing Critical Features

**No Search/Filter for Menu:**

- Problem: Menu has 40+ items. Users can't quickly find items by name or ingredient. Defeats purpose of detailed descriptions.
- Blocks: Better UX for first-time customers. Mobile experience is scroll-heavy.
- Recommendation: Implement client-side menu search using Algolia or simple `Array.filter()`. Priority: High (impacts UX directly).

**No Image Gallery for Menu Items:**

- Problem: `menu.json` has `imageUrl` field but no images are displayed. Food photos drive engagement/ordering decisions.
- Blocks: Potential increase in online orders if customers see appetizing photos. Competitive disadvantage vs. other Route 66 restaurants with image-rich menus.
- Recommendation: Add images to menu items (even simple smartphone photos). Lazy-load images. Add lightbox/modal. Priority: Medium (nice-to-have, not blocking).

**No Review Submission Form:**

- Problem: Reviews are auto-fetched from Google/Yelp but customers can't leave reviews directly on site.
- Blocks: Drive customer engagement and social proof. Allows direct review moderation.
- Recommendation: Add review form (Firebase/Supabase backend) or embed Google Review widget. Priority: Low (reviews auto-update weekly, sufficient for now).

**No Analytics Custom Events for Menu Clicks:**

- Problem: GTM tracks pageviews but not which menu items customers explore. No data on popular items beyond hardcoded `popularity: 0`.
- Blocks: Can't optimize menu layout by popularity. Can't identify high-interest items for promotion.
- Recommendation: Add custom events to menu items (click tracking). Use Gtag or direct GA4 API calls. Priority: Medium (helps future optimization).

## Test Coverage Gaps

**No Tests for Component Logic:**

- Untested area: MenuSection scroll tracking, Header navigation logic, dark mode switching, map lazy loading
- Files: `src/components/MenuSection.tsx`, `src/components/Header.tsx`, `src/components/mode-toggle.tsx`, `src/components/GoogleMap.tsx`
- Risk: Scroll event bugs, navigation edge cases, theme flashing, map loading failures could ship undetected.
- Priority: High (all interactive features should have E2E tests)

**No Tests for Data Validation:**

- Untested area: Menu data structure, FAQ answer length (relied on AEO audit script), reviews data format
- Files: `src/data/menu.json`, `src/data/faq.json`, `src/data/reviews.json`
- Risk: Malformed data could crash components at runtime. Reviews auto-update could introduce invalid JSON.
- Priority: High (data is single source of truth)

**No Tests for Schema Output:**

- Untested area: JSON-LD schema components do not validate against schema.org specs
- Files: `src/components/schema/*.astro`
- Risk: Invalid schema could break SEO ranking or AEO visibility. No CI check prevents broken schema deployments.
- Priority: High (schema is critical for local SEO and AEO)

**No Tests for SEO/Metadata:**

- Untested area: Open Graph meta tags, canonical URLs, robots meta tag
- Files: `src/layouts/Layout.astro`
- Risk: Incorrect meta tags could hurt organic search ranking or social sharing appearance.
- Priority: Medium (Lighthouse SEO audit provides some coverage but not exhaustive)

**No Lighthouse CI Baseline Tracking:**

- Untested area: Historical Lighthouse scores not tracked (only current runs checked against thresholds)
- Files: `.lighthouserc.json`, `.lighthouseci/` folder
- Risk: Regressions in performance/accessibility could creep in gradually without detection. No dashboard to spot trends.
- Priority: Low (current thresholds prevent major regressions, but trend analysis would improve confidence)

---

_Concerns audit: 2026-02-20_
