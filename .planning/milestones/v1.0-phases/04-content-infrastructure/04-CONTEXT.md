# Phase 4: Content Infrastructure - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix breadcrumb label generation, add new pages to Lighthouse CI, and update footer links so every new content page inherits clean scaffolding from day one. Header navigation is NOT modified.

</domain>

<decisions>
## Implementation Decisions

### Navigation placement
- No new links in the header navbar — keep it clean with existing Menu | Philosophy | FAQ
- No sub-nav bar or mobile-menu-only links — skip header entirely for these pages
- Pages are discoverable through footer links and internal cross-links only
- **Roadmap criteria update required:** Remove "Header navigation includes links to /near-grand-canyon/ and /directions/" from Phase 4 success criteria

### Footer link organization
- Add a new "Explore" section to the footer grid
- Explore section contains: page links (Near Grand Canyon, Directions, FAQ) + social links (Instagram, Facebook)
- Social links move FROM the bottom bar INTO the Explore section
- Social links use icons + text labels (e.g., Instagram icon + "Instagram") — more accessible than icon-only
- Bottom bar becomes copyright only: "© 2024 Spice Grill & Bar. All rights reserved."
- Mobile-friendly layout is the priority for the footer grid rearrangement

### Breadcrumb label logic
- Auto-generate labels from URL slugs (near-grand-canyon → "Near Grand Canyon")
- No manual label passing required — slug-to-title-case conversion handles it
- "Home" breadcrumb item is always auto-included as the first item on every page
- Pages do not need to pass their own breadcrumb chain

### Claude's Discretion
- Link label text for "Near Grand Canyon" and "Directions" pages (SEO-friendly, natural phrasing)
- Footer grid layout arrangement (column count, responsive breakpoints) — must be mobile-friendly
- Breadcrumb visibility (schema-only vs visible on page) — mobile-friendly if visible
- Handling breadcrumb edge cases (acronyms like FAQ, special formatting)
- Whether FAQ link stays in bottom bar redundantly or moves entirely to Explore section

</decisions>

<specifics>
## Specific Ideas

- User wants the Explore section to consolidate page links AND social links in one place
- Social links should have both icons and text labels, not just icons
- Footer must be mobile-friendly — this is the top priority for layout decisions
- The header navbar should remain minimal and unchanged

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-content-infrastructure*
*Context gathered: 2026-02-20*
