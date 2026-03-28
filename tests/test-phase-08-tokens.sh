#!/usr/bin/env bash
# =============================================================================
# Phase 08 Token System — Automated Behavioral Tests
# Requirements: TOKEN-01 through TOKEN-05
#
# Usage:
#   bash tests/test-phase-08-tokens.sh
#
# Exit: 0 if all checks pass, non-zero if any check fails.
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GLOBALS_CSS="$REPO_ROOT/src/styles/globals.css"
SRC_DIR="$REPO_ROOT/src"

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

# Assert an extended-regex pattern does NOT appear in any .tsx/.astro/.ts
# file under src/. Uses || true so grep exit-1 (no match) never kills script.
assert_src_zero_matches() {
  local pattern="$1"
  local description="$2"
  local result
  result=$(grep -rE -- "$pattern" \
    --include="*.tsx" --include="*.astro" --include="*.ts" \
    "$SRC_DIR" 2>/dev/null || true)
  if [ -z "$result" ]; then
    pass "$description"
  else
    local count
    count=$(printf '%s\n' "$result" | wc -l | tr -d ' ')
    fail "$description  ($count match(es) found for '$pattern')"
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

# --------------------------------------------------------------------------
# TOKEN-01: Surface hierarchy tokens exist in :root and .dark
# Observable behavior: globals.css defines all 5 required surface depth
# tokens (dim, container-low, container, container-high, bright) in both
# :root (light mode) and .dark blocks, each wired through @theme inline.
# --------------------------------------------------------------------------

echo ""
echo "TOKEN-01: Surface hierarchy tokens defined in both modes"
echo "-----------------------------------------------------------"

# Required surface hierarchy token names are present in the CSS
for token in "--surface-dim" "--surface-container-low" "--surface-container:" \
             "--surface-container-high" "--surface-bright"; do
  assert_contains "$GLOBALS_CSS" "$token" \
    "globals.css defines '$token'"
done

# Dark mode has distinct dark hex values for each surface depth level
assert_contains "$GLOBALS_CSS" "--surface-dim: #1f0f0b" \
  "globals.css .dark --surface-dim is warm dark hex (#1f0f0b)"
assert_contains "$GLOBALS_CSS" "--surface-container-low: #281713" \
  "globals.css .dark --surface-container-low is warm dark hex (#281713)"
assert_contains "$GLOBALS_CSS" "--surface-container: #2d1b17" \
  "globals.css .dark --surface-container is warm dark hex (#2d1b17)"
assert_contains "$GLOBALS_CSS" "--surface-container-high: #382621" \
  "globals.css .dark --surface-container-high is warm dark hex (#382621)"
assert_contains "$GLOBALS_CSS" "--surface-bright: #49342f" \
  "globals.css .dark --surface-bright is warm dark hex (#49342f)"

# @theme inline block wires each surface token into Tailwind --color-* namespace
for mapping in \
  "--color-surface-dim: var(--surface-dim)" \
  "--color-surface-container-low: var(--surface-container-low)" \
  "--color-surface-container: var(--surface-container)" \
  "--color-surface-container-high: var(--surface-container-high)" \
  "--color-surface-bright: var(--surface-bright)"; do
  assert_contains "$GLOBALS_CSS" "$mapping" \
    "globals.css @theme inline maps '$mapping'"
done

# --------------------------------------------------------------------------
# TOKEN-02: Light mode surface tokens are warm-tint hex values (no hsl())
# Observable behavior: :root surface tokens use hex notation with warm
# reddish-cream values; no hsl() wrapper appears anywhere in globals.css.
# --------------------------------------------------------------------------

echo ""
echo "TOKEN-02: Light mode surface tokens are warm-tint hex values"
echo "-------------------------------------------------------------"

assert_contains "$GLOBALS_CSS" "--surface-dim: #f3d3cb" \
  "globals.css :root --surface-dim is warm cream hex (#f3d3cb)"
assert_contains "$GLOBALS_CSS" "--surface: #fff8f6" \
  "globals.css :root --surface is warm white hex (#fff8f6)"
assert_contains "$GLOBALS_CSS" "--surface-container-low: #fff1ed" \
  "globals.css :root --surface-container-low is warm hex (#fff1ed)"
assert_contains "$GLOBALS_CSS" "--surface-container: #ffe9e4" \
  "globals.css :root --surface-container is warm hex (#ffe9e4)"
assert_contains "$GLOBALS_CSS" "--surface-container-high: #ffe2db" \
  "globals.css :root --surface-container-high is warm hex (#ffe2db)"
assert_contains "$GLOBALS_CSS" "--surface-bright: #fff8f6" \
  "globals.css :root --surface-bright is warm white hex (#fff8f6)"

# No hsl() wrappers permitted anywhere in the token file (also covers TOKEN-05)
hsl_result=$(grep -F "hsl(" "$GLOBALS_CSS" 2>/dev/null || true)
if [ -z "$hsl_result" ]; then
  pass "globals.css contains zero hsl() wrappers"
else
  fail "globals.css contains hsl() — all values must be hex or rgba()"
fi

# --------------------------------------------------------------------------
# TOKEN-03: Zero legacy shadcn/brand/zinc/orange/neutral tokens in src/;
# M3 tokens present in key components.
# Observable behavior: grep returns zero matches for legacy class names;
# key components contain the expected M3 token class names.
# --------------------------------------------------------------------------

echo ""
echo "TOKEN-03: Zero legacy tokens in src/; M3 tokens in key components"
echo "-------------------------------------------------------------------"

# 3a. Zero legacy brand token class references across all src/ files
assert_src_zero_matches \
  "brand-orange|brand-green|brand-gold" \
  "src/ contains zero brand-orange/green/gold class references"

# 3b. Zero shadcn semantic token class names
assert_src_zero_matches \
  "text-foreground(\b|$| )" \
  "src/ contains zero text-foreground (shadcn) class references"
assert_src_zero_matches \
  "text-muted-foreground" \
  "src/ contains zero text-muted-foreground (shadcn) class references"
assert_src_zero_matches \
  "bg-popover(\b|$| )" \
  "src/ contains zero bg-popover (shadcn) class references"
assert_src_zero_matches \
  "bg-accent(\b|$| )" \
  "src/ contains zero bg-accent (shadcn) class references"
assert_src_zero_matches \
  "ring-ring(\b|$| )" \
  "src/ contains zero ring-ring (shadcn) class references"

# 3c. Zero hardcoded neutral-* palette classes in components
assert_src_zero_matches \
  "neutral-(50|100|200|800|900|950)" \
  "src/ contains zero neutral-* hardcoded Tailwind palette classes"

# 3d. Zero chart-* token references
assert_src_zero_matches \
  "chart-" \
  "src/ contains zero chart-* token references"

# 3e. Key components contain M3 token classes

BUTTON="$SRC_DIR/components/ui/button.tsx"
assert_contains "$BUTTON" "bg-primary-container text-on-primary-container" \
  "button.tsx default variant uses M3 bg-primary-container text-on-primary-container"
assert_contains "$BUTTON" "bg-error-container text-on-error-container" \
  "button.tsx destructive variant uses M3 bg-error-container text-on-error-container"
assert_contains "$BUTTON" "hover:bg-surface-container hover:text-on-surface" \
  "button.tsx ghost variant uses M3 hover:bg-surface-container hover:text-on-surface"
assert_not_contains "$BUTTON" "neutral-" \
  "button.tsx contains no neutral-* hardcoded palette classes"
assert_not_contains "$BUTTON" "dark:" \
  "button.tsx contains no dark: prefixed color overrides (M3 tokens auto-switch)"

SHEET="$SRC_DIR/components/ui/sheet.tsx"
assert_contains "$SHEET" "bg-surface" \
  "sheet.tsx uses bg-surface (not shadcn bg-background)"
assert_contains "$SHEET" "focus:ring-outline" \
  "sheet.tsx uses focus:ring-outline (not shadcn focus:ring-ring)"
assert_contains "$SHEET" "text-on-surface-variant" \
  "sheet.tsx uses text-on-surface-variant (not shadcn text-muted-foreground)"

DROPDOWN="$SRC_DIR/components/ui/dropdown-menu.tsx"
assert_contains "$DROPDOWN" "bg-surface-container-highest" \
  "dropdown-menu.tsx uses bg-surface-container-highest (not shadcn bg-popover)"
assert_contains "$DROPDOWN" "focus:bg-surface-container-high" \
  "dropdown-menu.tsx uses focus:bg-surface-container-high (not shadcn focus:bg-accent)"
assert_contains "$DROPDOWN" "bg-outline-variant" \
  "dropdown-menu.tsx uses bg-outline-variant (not shadcn bg-muted)"

REVIEWS="$SRC_DIR/components/ReviewsSection.astro"
assert_contains "$REVIEWS" "bg-surface-container" \
  "ReviewsSection.astro review card uses M3 bg-surface-container"
assert_contains "$REVIEWS" "text-primary-container" \
  "ReviewsSection.astro uses M3 text-primary-container for accent text"
assert_not_contains "$REVIEWS" "backdrop-blur" \
  "ReviewsSection.astro review cards have no backdrop-blur (glass budget compliance)"

HEADER="$SRC_DIR/components/Header.tsx"
assert_contains "$HEADER" "hover:text-primary-container" \
  "Header.tsx nav links use hover:text-primary-container (not hover:text-brand-orange)"

DIRECTIONS="$SRC_DIR/pages/directions.astro"
assert_contains "$DIRECTIONS" "bg-primary-container text-on-primary-container" \
  "directions.astro CTA uses M3 bg-primary-container text-on-primary-container"

MENU="$SRC_DIR/components/MenuSection.tsx"
assert_contains "$MENU" "border-outline-variant" \
  "MenuSection.tsx uses M3 border-outline-variant (not hardcoded border-orange-300)"

# --------------------------------------------------------------------------
# TOKEN-04: font-display (Manrope) and font-sans (Inter) registered in
# globals.css; zero font-serif class in src/.
# Observable behavior: @theme inline registers both font tokens; no src/ file
# uses the font-serif utility class (Playfair Display was removed per D-25).
# --------------------------------------------------------------------------

echo ""
echo "TOKEN-04: Font families registered; zero font-serif in src/"
echo "-------------------------------------------------------------"

assert_contains "$GLOBALS_CSS" "--font-sans: 'Inter Variable'" \
  "globals.css @theme inline registers --font-sans as Inter Variable"
assert_contains "$GLOBALS_CSS" "--font-display: 'Manrope Variable'" \
  "globals.css @theme inline registers --font-display as Manrope Variable"
assert_not_contains "$GLOBALS_CSS" "--font-serif" \
  "globals.css does NOT register --font-serif (Playfair Display removed per D-25)"

assert_src_zero_matches "font-serif" \
  "src/ contains zero font-serif class references"

# Key components use font-display on headings/display text
HERO="$SRC_DIR/components/Hero.astro"
assert_file_has_match "font-display" "$HERO" \
  "Hero.astro uses font-display on main headline"

assert_file_has_match "font-display" "$HEADER" \
  "Header.tsx uses font-display on logo/nav text"

assert_file_has_match "font-display" "$MENU" \
  "MenuSection.tsx uses font-display on menu headings"

FAQ="$SRC_DIR/pages/faq.astro"
assert_file_has_match "font-display" "$FAQ" \
  "faq.astro uses font-display on page title"

DIRECTIONS_FILE="$SRC_DIR/pages/directions.astro"
assert_file_has_match "font-display" "$DIRECTIONS_FILE" \
  "directions.astro uses font-display on headings"

# --------------------------------------------------------------------------
# TOKEN-05: All CSS variables use hex values (no hsl() wrappers).
# Observable behavior: globals.css has zero hsl() occurrences; key color
# variable definitions are confirmed as hex.
# --------------------------------------------------------------------------

echo ""
echo "TOKEN-05: All CSS variables use hex values (no hsl() wrappers)"
echo "----------------------------------------------------------------"

# Explicit TOKEN-05 hsl() check (shared evidence with TOKEN-02, labeled separately)
hsl_result2=$(grep -F "hsl(" "$GLOBALS_CSS" 2>/dev/null || true)
if [ -z "$hsl_result2" ]; then
  pass "globals.css contains zero hsl() wrappers (TOKEN-05)"
else
  fail "globals.css has hsl() occurrences — TOKEN-05 violated"
fi

# Spot-check: key tokens are defined as hex, not as hsl/oklch/other notation
assert_contains "$GLOBALS_CSS" "--surface-container: #ffe9e4" \
  "globals.css light --surface-container is hex #ffe9e4 (no hsl wrapper)"
assert_contains "$GLOBALS_CSS" "--surface-container: #2d1b17" \
  "globals.css dark --surface-container is hex #2d1b17 (no hsl wrapper)"
assert_contains "$GLOBALS_CSS" "--primary-container: #d93900" \
  "globals.css light --primary-container is hex #d93900 (no hsl wrapper)"
assert_contains "$GLOBALS_CSS" "--primary-container: #ff5626" \
  "globals.css dark --primary-container is hex #ff5626 (no hsl wrapper)"

# Glass vars correctly use rgba() (warm-tint pattern, not hsl)
assert_contains "$GLOBALS_CSS" "--glass-bg: rgba(255, 226, 219, 0.7)" \
  "globals.css light --glass-bg uses rgba() warm-tint (not hsl)"
assert_contains "$GLOBALS_CSS" "--glass-bg: rgba(56, 38, 33, 0.7)" \
  "globals.css dark --glass-bg uses rgba() warm-tint (not hsl)"

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
