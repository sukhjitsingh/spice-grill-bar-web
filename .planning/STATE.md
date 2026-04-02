---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: UI Facelift — The Radiant Sommelier
status: executing
stopped_at: Completed 10-03-PLAN.md
last_updated: "2026-03-28T04:23:13.054Z"
last_activity: 2026-03-28
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 15
  completed_plans: 15
  percent: 87
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-22)

**Core value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.
**Current focus:** Phase 10 — quality-assurance

## Current Position

Phase: 10
Plan: Not started
Status: Executing Phase 10
Last activity: 2026-03-28 - Completed quick task 260328-hhm: Remove unused DropdownMenu component and @radix-ui/react-dropdown-menu dependency

Progress: [████████░░] 87%

## Performance Metrics

**v1.0 Velocity:**

- Total plans completed: 8
- Average duration: 3.9 min
- Total execution time: ~35 min

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.

- [Phase 08]: All dark: prefixed overrides removed from button variants — M3 tokens auto-switch via CSS variables
- [Phase 08]: font-serif replaced with font-display (Manrope Variable) across all heading/display text — TOKEN-04 complete
- [Phase 08]: knip.json updated with ignoreDependencies for react-dom and ignoreBinaries for CLI tools to achieve zero false-positive failures
- [Phase 08-token-system]: ReviewsSection review cards use bg-surface-container/border-outline-variant (no backdrop-blur) per glass budget D-15
- [Phase 08-token-system]: MobileActionButtons redundant fallback layer removed — parent .glass provides background and blur via CSS vars

- [Phase 10]: reducedMotion placed in contextOptions per Playwright v1.58 type system
- [Phase 10]: playwright and glob installed as explicit devDependencies for scripts/ imports
- [Phase 10-quality-assurance]: data-radix-menu-content used for DropdownMenu selector (Radix v2 shared menu primitive — not data-radix-dropdown-menu-content)
- [Phase 10-quality-assurance]: Sheet close button targeted via sheetContent.locator('button').first() — Radix Dialog.Close has no data-radix-dialog-close attribute at runtime

### Pending Todos

None.

### Blockers/Concerns

- ~~Future: FAQSchema injected on all pages via Layout.astro — Google may flag FAQ schema on pages where FAQ content is not visible~~ (resolved 260401-fv4)

### Quick Tasks Completed

| # | Description | Date | Commit | Status | Directory |
|---|-------------|------|--------|--------|-----------|
| 260328-fl3 | Add LA to Grand Canyon directions on FAQ page | 2026-03-28 | 48eccb6 | | [260328-fl3-add-la-to-grand-canyon-directions-on-faq](./quick/260328-fl3-add-la-to-grand-canyon-directions-on-faq/) |
| 260328-gl5 | Remove system option from theme toggle | 2026-03-28 | c3415af | | [260328-gl5-remove-system-option-from-theme-toggle-d](./quick/260328-gl5-remove-system-option-from-theme-toggle-d/) |
| 260328-h01 | Replace theme toggle dropdown with sun/moon icon toggle button | 2026-03-28 | f969344 | | [260328-h01-replace-theme-toggle-dropdown-with-sun-m](./quick/260328-h01-replace-theme-toggle-dropdown-with-sun-m/) |
| 260328-i73 | Restore hero tagline 'The Soul of Punjab' and subtitle | 2026-03-28 | f6f953d | | [260328-i73-preserve-hero-section-tagline-and-subtit](./quick/260328-i73-preserve-hero-section-tagline-and-subtit/) |
| 260328-hhm | Remove unused DropdownMenu component and @radix-ui/react-dropdown-menu dependency | 2026-03-28 | 017bbe8 | | [260328-hhm-remove-unused-dropdownmenu-component-and](./quick/260328-hhm-remove-unused-dropdownmenu-component-and/) |
| 260401-fv4 | Fix SEO issues: FAQ OG tags, FAQSchema scope to /faq/, remove hardcoded ogUrl from GEO pages | 2026-04-01 | 40b525b | | [260401-fv4-fix-seo-issues-faq-og-tags-faqschema-sco](./quick/260401-fv4-fix-seo-issues-faq-og-tags-faqschema-sco/) |
| 260401-go1 | Fix Astro image issues: Hero+OurStory to Picture (AVIF+WebP), GoogleMap CLS fix | 2026-04-01 | 6713f13 | Verified | [260401-go1-fix-astro-image-issues-from-astro-images](./quick/260401-go1-fix-astro-image-issues-from-astro-images/) |
| 260401-ihx | Fix framework audit issues: ModeToggle flash, GoogleMap rootMargin, FAQ heading skip, footer year, menu keys | 2026-04-01 | edf1d31 | Verified | [260401-ihx-fix-astro-framework-audit-issues-modetog](./quick/260401-ihx-fix-astro-framework-audit-issues-modetog/) |
| 260401-rmp | Tone down cta-gradient to subtle 20% warm hint using color-mix | 2026-04-01 | 1eb23c8 | | [260401-rmp-restore-order-section-background-image-f](./quick/260401-rmp-restore-order-section-background-image-f/) |

## Session Continuity

Last session: 2026-04-01T20:03:00Z
Stopped at: Completed quick task 260401-rmp
Resume file: None
