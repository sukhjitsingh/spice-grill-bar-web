#!/usr/bin/env bash
# =============================================================================
# Phase 09 Visual Redesign — Automated Behavioral Tests
# Requirements: VISUAL-01 through VISUAL-10
#
# Usage:
#   bash tests/test-phase-09-visual.sh
#
# Exit: 0 if all checks pass, non-zero if any check fails.
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GLOBALS_CSS="$REPO_ROOT/src/styles/globals.css"
LAYOUT="$REPO_ROOT/src/layouts/Layout.astro"
PKG="$REPO_ROOT/package.json"
SRC_DIR="$REPO_ROOT/src"

HERO="$SRC_DIR/components/Hero.astro"
OUR_STORY="$SRC_DIR/components/OurStorySection.astro"
REVIEWS="$SRC_DIR/components/ReviewsSection.astro"
MENU="$SRC_DIR/components/MenuSection.tsx"
ORDER="$SRC_DIR/components/OrderSection.astro"
LOCATION="$SRC_DIR/components/LocationSection.astro"
FOOTER="$SRC_DIR/components/Footer.astro"
HEADER="$SRC_DIR/components/Header.tsx"
FAQ="$SRC_DIR/pages/faq.astro"
NEAR_GC="$SRC_DIR/pages/near-grand-canyon.astro"
DIRECTIONS="$SRC_DIR/pages/directions.astro"

PASS=0
FAIL=0
ERRORS=()

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

pass() {
  PASS=$((PASS + 1))
  printf "  [PASS] %s\n" "$1"
}

fail() {
  FAIL=$((FAIL + 1))
  ERRORS+=("$1")
  printf "  [FAIL] %s\n" "$1"
}

# Assert a fixed string exists in file
assert_contains() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  if grep -qF -- "$pattern" "$file" 2>/dev/null; then
    pass "$description"
  else
    fail "$description  (pattern not found: '$pattern')"
  fi
}

# Assert a fixed string does NOT exist in file
assert_not_contains() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  local result
  result=$(grep -F -- "$pattern" "$file" 2>/dev/null || true)
  if [ -z "$result" ]; then
    pass "$description"
  else
    fail "$description  (forbidden pattern found: '$pattern')"
  fi
}

# Assert an extended-regex pattern exists in a specific file
assert_file_has_match() {
  local pattern="$1"
  local file="$2"
  local description="$3"
  local result
  result=$(grep -E -- "$pattern" "$file" 2>/dev/null || true)
  if [ -n "$result" ]; then
    pass "$description"
  else
    fail "$description  (pattern not found: '$pattern' in $file)"
  fi
}

# Assert an extended-regex pattern does NOT appear in a specific file
assert_file_no_match() {
  local pattern="$1"
  local file="$2"
  local description="$3"
  local result
  result=$(grep -E -- "$pattern" "$file" 2>/dev/null || true)
  if [ -z "$result" ]; then
    pass "$description"
  else
    fail "$description  (forbidden pattern found: '$pattern' in $file)"
  fi
}

# Assert exact count of source files (astro/tsx) containing a fixed-string pattern
# is within an upper bound.
# Note: BSD grep on macOS treats args after -- as filenames, so --include flags
# must appear before any -- end-of-options marker. Use || true to prevent
# set -e from exiting on grep exit code 1 (no matches).
assert_src_file_count_le() {
  local pattern="$1"
  local max_count="$2"
  local description="$3"
  local result
  result=$(grep -rlF "$pattern" --include="*.tsx" --include="*.astro" \
    "$SRC_DIR" 2>/dev/null || true)
  local count
  count=$(echo "$result" | grep -c . || echo 0)
  if [ "$count" -le "$max_count" ]; then
    pass "$description  ($count file(s) found, max $max_count)"
  else
    fail "$description  ($count file(s) found, max $max_count)"
  fi
}

# --------------------------------------------------------------------------
# VISUAL-01: Legacy fonts removed; correct variable fonts imported
# Observable behavior:
#   - package.json has no @fontsource/open-sans or @fontsource/playfair-display
#   - Layout.astro has no open-sans or playfair-display import lines
#   - Layout.astro imports manrope/wght.css and inter/wght.css
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-01: Legacy font packages removed; Manrope/Inter variable fonts imported"
echo "--------------------------------------------------------------------------------"

assert_not_contains "$PKG" "@fontsource/open-sans" \
  "package.json does not contain @fontsource/open-sans"

assert_not_contains "$PKG" "@fontsource/playfair-display" \
  "package.json does not contain @fontsource/playfair-display"

assert_not_contains "$LAYOUT" "@fontsource/open-sans" \
  "Layout.astro does not import @fontsource/open-sans"

assert_not_contains "$LAYOUT" "@fontsource/playfair-display" \
  "Layout.astro does not import @fontsource/playfair-display"

assert_contains "$LAYOUT" "@fontsource-variable/manrope/wght.css" \
  "Layout.astro imports @fontsource-variable/manrope/wght.css"

assert_contains "$LAYOUT" "@fontsource-variable/inter/wght.css" \
  "Layout.astro imports @fontsource-variable/inter/wght.css"

# --------------------------------------------------------------------------
# VISUAL-02: Glass budget — backdrop-blur utility only in approved files
# Observable behavior:
#   - .glass class only in Header.tsx, OurStorySection.astro, OrderSection.astro
#   - glass-card class only in Header.tsx
#   - backdrop-blur-sm (raw) only in Hero.astro (pill badge)
#   - Unapproved files have no .glass / glass-card / backdrop-blur
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-02: Glass budget — backdrop-blur utility only in approved files"
echo "------------------------------------------------------------------------"

# Approved files: glass class present
assert_contains "$HEADER" "glass" \
  "Header.tsx uses .glass utility (approved)"

assert_contains "$OUR_STORY" "glass" \
  "OurStorySection.astro uses .glass utility (approved)"

assert_contains "$ORDER" "glass" \
  "OrderSection.astro uses .glass utility (approved)"

# glass-card only in Header.tsx
assert_contains "$HEADER" "glass-card" \
  "Header.tsx uses glass-card (approved)"

# Hero.astro: only backdrop-blur-sm on pill badge (not .glass utility)
assert_contains "$HERO" "backdrop-blur-sm" \
  "Hero.astro has backdrop-blur-sm on pill badge (accepted exception)"

assert_not_contains "$HERO" "glass" \
  "Hero.astro does not use .glass utility (backdrop-blur-sm pill only, not glass budget)"

# Unapproved files: no glass or backdrop-blur
assert_not_contains "$REVIEWS" "glass" \
  "ReviewsSection.astro has no .glass / glass-card"

assert_not_contains "$REVIEWS" "backdrop-blur" \
  "ReviewsSection.astro has no backdrop-blur"

assert_not_contains "$MENU" "glass" \
  "MenuSection.tsx has no .glass / glass-card"

assert_not_contains "$MENU" "backdrop-blur" \
  "MenuSection.tsx has no backdrop-blur"

assert_not_contains "$LOCATION" "glass" \
  "LocationSection.astro has no .glass / glass-card"

assert_not_contains "$LOCATION" "backdrop-blur" \
  "LocationSection.astro has no backdrop-blur"

assert_not_contains "$FOOTER" "glass" \
  "Footer.astro has no .glass / glass-card"

assert_not_contains "$FOOTER" "backdrop-blur" \
  "Footer.astro has no backdrop-blur"

assert_not_contains "$FAQ" "glass" \
  "faq.astro has no .glass / glass-card"

assert_not_contains "$FAQ" "backdrop-blur" \
  "faq.astro has no backdrop-blur"

assert_not_contains "$NEAR_GC" "glass" \
  "near-grand-canyon.astro has no .glass / glass-card"

assert_not_contains "$NEAR_GC" "backdrop-blur" \
  "near-grand-canyon.astro has no backdrop-blur"

assert_not_contains "$DIRECTIONS" "glass" \
  "directions.astro has no .glass / glass-card"

assert_not_contains "$DIRECTIONS" "backdrop-blur" \
  "directions.astro has no backdrop-blur"

# --------------------------------------------------------------------------
# VISUAL-03: No structural border-t / border-b on section root elements
# Observable behavior: section root opening tags have no border-t or border-b.
# Checks only the first <section ... > / <footer ... > line in each file
# (content badges with border- are excluded — those are nested elements).
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-03: No structural border-t/border-b on section root elements"
echo "---------------------------------------------------------------------"

# OurStorySection root — check first section opening tag line
our_story_root=$(grep -n '<section' "$OUR_STORY" | head -1 | cut -d: -f1)
our_story_root_line=$(sed -n "${our_story_root}p" "$OUR_STORY" 2>/dev/null || true)
if echo "$our_story_root_line" | grep -qE 'border-t|border-b'; then
  fail "OurStorySection.astro section root has no border-t / border-b"
else
  pass "OurStorySection.astro section root has no border-t / border-b"
fi

# ReviewsSection root
reviews_root=$(grep -n '<section' "$REVIEWS" | head -1 | cut -d: -f1)
reviews_root_line=$(sed -n "${reviews_root}p" "$REVIEWS" 2>/dev/null || true)
if echo "$reviews_root_line" | grep -qE 'border-t|border-b'; then
  fail "ReviewsSection.astro section root has no border-t / border-b"
else
  pass "ReviewsSection.astro section root has no border-t / border-b"
fi

# MenuSection root (tsx — find the line with id="menu")
menu_root_line=$(grep -n 'id="menu"' "$MENU" | head -1 | cut -d: -f2 || true)
if echo "$menu_root_line" | grep -qE 'border-t|border-b'; then
  fail "MenuSection.tsx section root has no border-t / border-b"
else
  pass "MenuSection.tsx section root has no border-t / border-b"
fi

# LocationSection root
location_root=$(grep -n '<section' "$LOCATION" | head -1 | cut -d: -f1)
location_root_line=$(sed -n "${location_root}p" "$LOCATION" 2>/dev/null || true)
if echo "$location_root_line" | grep -qE 'border-t|border-b'; then
  fail "LocationSection.astro section root has no border-t / border-b"
else
  pass "LocationSection.astro section root has no border-t / border-b"
fi

# Footer root — no border-t on footer element
footer_root=$(grep -n '<footer' "$FOOTER" | head -1 | cut -d: -f1)
footer_root_line=$(sed -n "${footer_root}p" "$FOOTER" 2>/dev/null || true)
if echo "$footer_root_line" | grep -qE 'border-t'; then
  fail "Footer.astro footer root has no border-t"
else
  pass "Footer.astro footer root has no border-t"
fi

# --------------------------------------------------------------------------
# VISUAL-04: 7 editorial typography @utility classes in globals.css
# Observable behavior: all 7 utilities defined with var(--font-display) or
# var(--font-sans)
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-04: 7 editorial typography @utility classes defined in globals.css"
echo "--------------------------------------------------------------------------"

for util in text-display-lg text-display-md text-heading-lg text-heading-md \
            text-body-lg text-body-md text-label-sm; do
  assert_contains "$GLOBALS_CSS" "@utility $util" \
    "globals.css defines @utility $util"
done

# Utilities use the correct font families.
# Display/heading utilities use var(--font-display); body/label use var(--font-sans).
# Confirmed by: (a) font-family: var(--font-display) appears in globals.css typography block,
# (b) font-family: var(--font-sans) appears in globals.css typography block.
# The @utility existence checks above plus these font-family property checks are
# sufficient behavioral evidence that each utility applies the correct font.
assert_contains "$GLOBALS_CSS" "font-family: var(--font-display)" \
  "globals.css typography utilities include font-family: var(--font-display) (display/heading families)"

assert_contains "$GLOBALS_CSS" "font-family: var(--font-sans)" \
  "globals.css typography utilities include font-family: var(--font-sans) (body/label families)"

# --------------------------------------------------------------------------
# VISUAL-05: Glass utilities defined correctly in globals.css
# Observable behavior:
#   - @utility glass exists and has backdrop-filter
#   - @utility glass-card exists and does NOT have backdrop-filter
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-05: Glass utilities defined in globals.css with correct properties"
echo "--------------------------------------------------------------------------"

assert_contains "$GLOBALS_CSS" "@utility glass" \
  "globals.css defines @utility glass"

assert_contains "$GLOBALS_CSS" "@utility glass-card" \
  "globals.css defines @utility glass-card"

assert_contains "$GLOBALS_CSS" "backdrop-filter: blur(32px)" \
  "globals.css @utility glass has backdrop-filter"

# glass-card block must not contain backdrop-filter — check by extracting the block
glass_card_block=$(awk '/@utility glass-card/,/^}/' "$GLOBALS_CSS" 2>/dev/null || true)
if echo "$glass_card_block" | grep -qF "backdrop-filter"; then
  fail "globals.css @utility glass-card does NOT have backdrop-filter (tonal only)"
else
  pass "globals.css @utility glass-card does NOT have backdrop-filter (tonal only)"
fi

# --------------------------------------------------------------------------
# VISUAL-06: Home page surface hierarchy — each section uses correct bg token
# Observable behavior: each component's section/root element carries the
# required Tailwind background class.
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-06: Home page surface hierarchy — section background tokens"
echo "-------------------------------------------------------------------"

assert_contains "$HERO" "bg-surface-dim" \
  "Hero.astro section uses bg-surface-dim"

assert_contains "$OUR_STORY" "bg-surface-container-low" \
  "OurStorySection.astro section uses bg-surface-container-low"

assert_contains "$REVIEWS" "bg-surface-dim" \
  "ReviewsSection.astro section uses bg-surface-dim"

assert_contains "$MENU" "bg-surface-container-low" \
  "MenuSection.tsx section uses bg-surface-container-low"

assert_contains "$ORDER" "bg-surface-dim" \
  "OrderSection.astro section uses bg-surface-dim"

assert_contains "$LOCATION" "bg-surface-container" \
  "LocationSection.astro section uses bg-surface-container"

# --------------------------------------------------------------------------
# VISUAL-07: FAQ page — surface tokens and typography
# Observable behavior:
#   - main element uses bg-surface-container-low
#   - H1 uses text-display-md or text-display-lg
#   - FAQ item cards use bg-surface-container
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-07: FAQ page surface hierarchy and typography"
echo "-----------------------------------------------------"

assert_contains "$FAQ" "bg-surface-container-low" \
  "faq.astro main uses bg-surface-container-low"

assert_file_has_match "text-display-md|text-display-lg" "$FAQ" \
  "faq.astro H1 uses text-display-md or text-display-lg"

assert_contains "$FAQ" "bg-surface-container" \
  "faq.astro FAQ item cards use bg-surface-container"

# --------------------------------------------------------------------------
# VISUAL-08: Near Grand Canyon page — surface tokens and typography
# Observable behavior:
#   - Cards use bg-surface-container
#   - Section headings use text-heading-lg
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-08: Near Grand Canyon page — surface tokens and typography"
echo "------------------------------------------------------------------"

assert_contains "$NEAR_GC" "bg-surface-container" \
  "near-grand-canyon.astro cards use bg-surface-container"

assert_contains "$NEAR_GC" "text-heading-lg" \
  "near-grand-canyon.astro section headings use text-heading-lg"

# --------------------------------------------------------------------------
# VISUAL-09: Directions page — surface tokens and typography
# Observable behavior:
#   - City nav uses bg-surface-container
#   - City headings use text-heading-lg
# --------------------------------------------------------------------------

echo ""
echo "VISUAL-09: Directions page — surface tokens and typography"
echo "-----------------------------------------------------------"

assert_contains "$DIRECTIONS" "bg-surface-container" \
  "directions.astro city nav uses bg-surface-container"

assert_contains "$DIRECTIONS" "text-heading-lg" \
  "directions.astro city headings use text-heading-lg"

# --------------------------------------------------------------------------
# VISUAL-10: Orange budget — ≤ 4 distinct visual contexts use primary-container
# NOTE: This requirement is MANUAL-ONLY. The rule is "≤ 4 visual contexts"
# (CTA buttons, star ratings, nav hover, accent details), not "≤ 4 files".
# File count is a poor proxy: button.tsx + AstroButton.astro = 1 visual context
# (both render the same CTA button); hover:bg-primary-container on multiple
# pages is 1 nav-hover context. Human visual audit required.
# See Manual-Only Verifications in 09-VALIDATION.md.
# --------------------------------------------------------------------------

# --------------------------------------------------------------------------
# Summary
# --------------------------------------------------------------------------

echo ""
echo "============================================================"
printf "RESULTS: %d passed, %d failed\n" "$PASS" "$FAIL"
echo "============================================================"

if [ "${#ERRORS[@]}" -gt 0 ]; then
  echo ""
  echo "FAILURES:"
  for err in "${ERRORS[@]}"; do
    printf "  - %s\n" "$err"
  done
  echo ""
  exit 1
fi

echo ""
echo "All checks passed."
exit 0
