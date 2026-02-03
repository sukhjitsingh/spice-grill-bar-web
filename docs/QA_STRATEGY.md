# FAANG-Standard Quality Assurance Strategy

**Project**: Spice Grill & Bar Web
**Status**: Implementation Pending
**Standard**: Elite / Enterprise (Google, Airbnb, Meta aligned)

This document outlines the "Zero-Regression" QA protocol. The goal is to enforce rigorous Code Quality, Performance, Accessibility, and Data Integrity standards through automated pipelines, preventing any sub-standard code from reaching production.

---

## 🏗 Phase 0: The Gatekeeper (Code Quality & Hygiene)

_Objective: Block "sloppy" code before it can even be committed._

### 🛠 Tools & Standards

1.  **Style Guide**: **Airbnb** (Strict React/TypeScript).
    - _Tool_: `eslint`, `eslint-config-airbnb-typescript`.
    - _Enforcement_: Strict equality, explicit returns, no unused vars.
2.  **Formatting**: **Prettier**.
    - _Tool_: `prettier-plugin-astro`.
    - _Enforcement_: Consistent indentation, quotes, spacing via ESLint integration.
3.  **Commit Discipline**: **Conventional Commits**.
    - _Tool_: `commitlint`.
    - _Standard_: Angular convention (`feat:`, `fix:`, `chore:`, `docs:`).
    - _Goal_: Automated changelogs & readable history.
4.  **Repository Hygiene**: **Knip**.
    - _Tool_: `knip`.
    - _Goal_: Zero dead code. specific checks for unused exports, types, and dependencies.
5.  **Efficiency**: **Lint-Staged**.
    - _Tool_: `lint-staged`.
    - _Workflow_: Runs linters _only_ on staged files during commit to maintain velocity.

---

## 🧩 Phase 1: Deep Schema Integrity (Type-Safe Data)

_Objective: Guarantee valid, Google-compliant Structured Data at compile time._

### 🛠 Tools & Standards

1.  **Strict Typing**: **schema-dts** (Google).
    - _Method_: Use `WithContext<Restaurant>` TypeScript interfaces for all JSON-LD.
    - _Benefit_: Invalid schema structure causes **build errors**, making it impossible to ship broken data.
2.  **AEO Validation**: **Runtime Checks**.
    - _Tool_: Custom `aeo-audit.mjs`.
    - _Checks_:
      - FAQ Content Length (< 50 words for Voice Search).
      - `llms.txt` presence and format (for AI Agents).

---

## ⚡️ Phase 2: Performance Budgets (The "Speed Guard")

_Objective: Prevent regression of Core Web Vitals._

### 🛠 Tools & Standards

1.  **Performance Auditing**: **Lighthouse CI** (Google).
    - _Tool_: `@lhci/cli`.
    - _Config_: `.lighthouserc.json`.
    - _Budgets_:
      - **LCP**: < 2.5s (Mobile).
      - **TBT**: < 200ms.
      - **CLS**: < 0.1.
      - **Categories**: SEO (100), Accessibility (100), Best Practices (95+).

---

## ♿️ Phase 3: Accessibility & AEO Structure

_Objective: Ensure legal compliance and semantic structure for AI agents._

### 🛠 Tools & Standards

1.  **Logic Linting**: **eslint-plugin-jsx-a11y**.
    - _Standard_: Airbnb (Strict).
    - _Checks_: Button roles, alt text presence, valid ARIA attributes.
2.  **Headless Audit**: **axe-core**.
    - _Tool_: `@axe-core/cli` (or `pa11y-ci`).
    - _Workflow_: Scans the production build (`dist/`) for contrast issues and structural violations.

---

## 🤖 Phase 4: Automation (The "Enforcer")

_Objective: Unify all checks into mandatory Git hooks._

### 🛠 Tools & Standards

1.  **Git Hooks**: **simple-git-hooks**.
    - _Why_: Lightweight, zero-config (native `package.json`).
    - _Pipeline_:
      - **Pre-Commit**: `lint-staged` (Format + Lint changed files).
      - **Commit-Msg**: `commitlint` (Validate message format).
      - **Pre-Push**: `npm run qa` (Full Regression Suite).

---

## 🚀 The Pipeline Workflow

### 1. Developer Writes Code

- **Editor**: TypeScript errors if Schema is invalid (`schema-dts`).
- **Editor**: ESLint warns about accessibility/style issues (`airbnb`).

### 2. Developer Commits (`git commit`)

- **Hook**: `simple-git-hooks` -> `lint-staged`.
- **Action**: Runs `eslint --fix`, `prettier`, and `knip` on _staged files only_.
- **Hook**: `commit-msg`.
- **Action**: Validates commit message format (e.g., `feat: new menu schema`).

### 3. Developer Pushes (`git push`)

- **Hook**: `pre-push` -> `npm run qa`.
- **Action**: Runs the **Full Gauntlet**:
  1.  `npm run build` (Type check entire project).
  2.  `npm run test:type-schema` (Verify JSON-LD typing).
  3.  `npm run test:aeo` (Verify Content/LLM readiness).
  4.  `npm run test:axe` (Verify Accessibility).
  5.  `npm run test:lhci` (Verify Performance Budgets).
- **Result**: If ANY step fails, the push is rejected.

---

## 📜 NPM Scripts Reference

```json
{
  "prepare": "simple-git-hooks",
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.astro",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "knip": "knip",
  "test:quality": "npm run lint && npm run knip && tsc --noEmit",
  "test:type-schema": "tsc --project tsconfig.schema.json --noEmit",
  "test:aeo": "node scripts/aeo-audit.mjs",
  "test:axe": "axe dist --exit",
  "test:lhci": "lhci autorun",
  "qa": "npm run build && npm run test:quality && npm run test:aeo && npm run test:axe && npm run test:lhci"
}
```
