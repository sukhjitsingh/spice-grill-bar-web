---
phase: quick
plan: 260328-hhm
subsystem: ui-components
tags: [cleanup, dead-code, dependencies]
dependency_graph:
  requires: [260328-h01]
  provides: []
  affects: [bundle-size, knip-clean]
tech_stack:
  added: []
  patterns: []
key_files:
  created: []
  modified:
    - src/components/mode-toggle.tsx
  deleted:
    - src/components/ui/dropdown-menu.tsx
    - "@/components/ui/dropdown-menu.tsx"
decisions:
  - mode-toggle.tsx updated to remove DropdownMenu imports (same changes as quick task 260328-h01, applied to this worktree which branched before h01)
metrics:
  duration: 15min
  completed: 2026-03-28
  tasks_completed: 2
  files_changed: 4
---

# Quick Task 260328-hhm: Remove Unused DropdownMenu Component and Dependency Summary

**One-liner:** Deleted `dropdown-menu.tsx`, uninstalled `@radix-ui/react-dropdown-menu`, and updated `mode-toggle.tsx` to use the icon toggle introduced in h01.

## What Was Done

Removed the DropdownMenu shadcn component and its Radix UI dependency after the theme toggle was replaced with a simple icon button (quick task 260328-h01). The component had zero consumers — the only import was in `mode-toggle.tsx` which itself was replaced in h01.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Verify no imports, delete component, uninstall package | 2177270 | src/components/ui/dropdown-menu.tsx (deleted), src/components/mode-toggle.tsx, package.json, package-lock.json |
| 2 | Validate build and quality checks | 7d64e4e | @/components/ui/dropdown-menu.tsx (deleted) |

## Verification Results

- `grep -r "dropdown-menu" src/` — returns nothing (PASS)
- `grep "react-dropdown-menu" package.json` — returns nothing (PASS)
- `npm run build` — exits 0 (PASS)
- `npm run knip` — configuration hints only, no errors (PASS)
- `npm run typecheck` — 0 errors (PASS)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] mode-toggle.tsx still imported DropdownMenu**
- **Found during:** Task 1 verification
- **Issue:** This worktree branched before quick task 260328-h01's changes were applied, so `mode-toggle.tsx` still used DropdownMenu. Deleting the component without updating mode-toggle would break the build.
- **Fix:** Applied the same mode-toggle.tsx changes from h01 commit (f969344) — replaced dropdown with simple icon button toggle.
- **Files modified:** src/components/mode-toggle.tsx
- **Commit:** 2177270

**2. [Rule 3 - Blocking] Stale @/components/ui/dropdown-menu.tsx caused typecheck failure**
- **Found during:** Task 2 (typecheck)
- **Issue:** A legacy `@/` directory (from the Next.js migration) contained a physical copy of `dropdown-menu.tsx`. TypeScript was checking this file and finding the missing `@radix-ui/react-dropdown-menu` module.
- **Fix:** Deleted `@/components/ui/dropdown-menu.tsx`.
- **Files modified:** @/components/ui/dropdown-menu.tsx (deleted)
- **Commit:** 7d64e4e

## Known Stubs

None.

## Self-Check: PASSED

- src/components/ui/dropdown-menu.tsx: MISSING (expected — deleted)
- @/components/ui/dropdown-menu.tsx: MISSING (expected — deleted)
- Commit 2177270: FOUND
- Commit 7d64e4e: FOUND
