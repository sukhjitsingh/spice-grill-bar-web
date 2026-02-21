# Testing Patterns

**Analysis Date:** 2026-02-20

## Test Framework

**Status:** Not yet implemented

**No Test Framework Detected:**

- No jest.config._ or vitest.config._ files present
- No unit tests (.test.ts, .test.tsx, .spec.ts, .spec.tsx) in src/ directory
- No test directory structure present
- 0% test coverage for application code

**Testing Dependencies Available:**

- `jsdom@27.4.0` - DOM simulation for tests (already installed as dev dependency)
- Ready for integration of a test runner

**Recommended Test Framework for This Project:**

- **Vitest** would integrate best with Astro + React setup
- **Jest** is alternative with astro-jest if needed
- Both support TypeScript with configured tsconfig.json

## Quality Assurance Practices (Current)

**Build/Quality Commands Implemented:**

```bash
npm run lint              # ESLint check for .js,.jsx,.ts,.tsx,.astro files
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier format check/write
npm run typecheck        # astro check + tsc --noEmit
npm run knip            # Find unused code/dependencies
npm run test:aeo        # Automated Evergreen Optimization audit
npm run test:axe        # Accessibility testing
npm run test:audit      # General code audit
npm run test:report     # SEO report generation
npm run test:security   # Security scan
npm run test:lhci       # Lighthouse CI performance testing
npm run test:quality    # Composite: lint + knip + typecheck + test:aeo
npm run qa              # Full QA: build + test:quality + test:lhci
```

**Quality Assurance Stack (Non-Unit Testing):**

- Linting: ESLint 8.57.1
- Formatting: Prettier 3.8.1
- Type Checking: TypeScript 5.5.4 + Astro Check
- Unused Code Detection: Knip 5.83.0
- Accessibility: axe-core CLI 4.11.0
- Performance: Lighthouse CI 0.15.1
- SEO: Custom audit scripts

## Git Hooks & Pre-commit

**Simple Git Hooks Implementation:**

- Config: `simple-git-hooks@2.13.1` with `lint-staged@16.2.7`

**Pre-commit Hook:**

```bash
npx lint-staged
```

Runs on staged files:

- `*.{js,jsx,ts,tsx,astro}`: ESLint fix + Prettier write
- `*.{json,md,yml}`: Prettier write

**Commit Message Hook:**

```bash
npx --no -- commitlint --edit ${1}
```

Validates commit messages against conventional commits (@commitlint/cli)

**Pre-push Hook:**

```bash
npm run qa
```

Runs full quality assurance before pushing

## Test File Organization (When Tests Are Added)

**Recommended Structure:**

```
src/
├── components/
│   ├── Header.tsx
│   ├── Header.test.tsx          # Co-located test
│   └── __tests__/
│       └── Header.test.tsx      # Alternative: grouped tests
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── __tests__/
    └── integration/             # Full page/integration tests
        └── homepage.test.ts
```

**Recommended Pattern: Co-located Tests**

- Place test file next to component: `Component.tsx` + `Component.test.tsx`
- Benefits: Clear coupling, easy to find tests, deleted component removes test

**Naming Convention for Tests:**

- Unit tests: `[component-name].test.ts(x)`
- Spec files: `[component-name].spec.ts(x)` (alternative)
- Integration: `integration-[feature].test.ts`

## Test Structure (Template for Future Implementation)

**Recommended Structure:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Header Component', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should render navigation links', () => {
    const { container } = render(<Header />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should toggle menu on mobile', () => {
    const { rerender } = render(<Header />);
    const button = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
```

**Patterns to Follow:**

- Use describe() for grouping related tests
- Use beforeEach/afterEach for common setup/teardown
- One assertion or logical group per test
- Descriptive test names: "should [expected behavior]"
- Use testing-library patterns (screen queries, userEvent)

## What Needs Testing

**Priority Components (High Priority):**

- `Header.tsx` - Complex scroll detection, navigation state, mobile responsiveness
- `MenuSection.tsx` - Scroll tracking, category navigation, data rendering
- `GoogleMap.tsx` - Lazy loading with IntersectionObserver, conditional render

**Priority Utilities (Medium Priority):**

- `cn()` in `lib/utils.ts` - Class merging utility (small but critical)
- `toKebabCase()` in MenuSection - String transformation

**Priority Integrations (Medium Priority):**

- React hooks usage (useState, useEffect, useRef)
- Astro component rendering in Layout
- Theme toggle functionality (ModeToggle.tsx)

**Lower Priority:**

- UI primitives (Button, Sheet, DropdownMenu) - Already from Radix UI with its own tests
- Static Astro components (Footer, Hero) - Content-heavy, minimal logic

## Current Test Coverage

**Status: 0% Coverage**

- No test files exist in src/
- No coverage reports or tools configured
- No coverage thresholds set

**When Coverage Tools Are Added:**

- Use: `npm run test:coverage` (to be added to package.json)
- Target: Minimum 60% coverage for src/ directory
- Exclude: node_modules, dist, schema components (static)

## Accessibility Testing

**Current Tool:** axe-core CLI

```bash
npm run test:axe         # Requires running dev server on http://localhost:4321
```

**What It Tests:**

- WCAG 2.1 level AA compliance
- Heading hierarchy
- Color contrast
- ARIA attributes
- Form labels
- Images alt text

**Code Patterns Following A11y:**

- All images have alt text (e.g., `alt="Spice Grill & Bar location on Google Maps"`)
- Keyboard focus indicators implemented (focus-visible:ring patterns)
- ARIA labels on interactive elements (e.g., `aria-label="Open menu"`)
- Proper semantic HTML (button, nav, link elements)
- Skip links available where needed

## Performance Testing

**Current Tool:** Lighthouse CI

```bash
npm run test:lhci        # Requires lhci.config.json configuration
```

**What It Tests:**

- Performance metrics (Core Web Vitals)
- Accessibility scores
- Best practices
- SEO readiness

**Integrated Features:**

- Image optimization with webp format
- Lazy loading for GoogleMap component
- CSS animations with transition properties

## Security Testing

**Tool:** Custom security scan script

```bash
npm run test:security
```

**What It Checks:**

- Dependency vulnerabilities (npm audit equivalent)
- Known security issues in packages
- Configuration security

**Security Features Implemented:**

- Content Security Policy headers in Layout.astro
- HTTPS enforcement via .htaccess
- No hardcoded secrets (env vars via Astro)
- Safe iframe implementation for Google Maps

## Mocking (When Tests Are Added)

**Recommended Framework:** Vitest with MSW (Mock Service Worker) or Vi.mock()

**What to Mock:**

- DOM APIs: window.matchMedia (for theme detection)
- IntersectionObserver (for lazy loading tests)
- localStorage (for theme persistence)
- fetch/API calls (when added)

**What NOT to Mock:**

- React/Astro rendering - use actual renderer
- CSS/Tailwind utilities - test styling through DOM
- Router navigation - test href attributes
- Built-in functions like Array.map, String methods

**Example MSW Setup (for future):**

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/menu', (req, res, ctx) => {
    return res(ctx.json(mockMenuData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Fixtures and Test Data

**No Fixtures Currently:** Data is in JSON files

- `src/data/menu.json` - Menu items and categories
- `src/data/reviews.json` - Review data
- `src/data/faq.json` - FAQ items

**Recommended Test Data Location:**

```
src/__fixtures__/
├── menu.ts              # TypeScript factories or mocks
├── reviews.ts
└── faq.ts

// Usage in tests:
import { mockMenuData, createMenuItem } from '@/__fixtures__/menu';
```

**Factory Pattern (Recommended):**

```typescript
// src/__fixtures__/menu.ts
export function createMenuItem(overrides = {}) {
  return {
    name: 'Chicken Tikka',
    price: 16.99,
    description: 'Chicken marinated in ginger, yogurt & tandoor spices.',
    ...overrides,
  };
}

export const mockMenuData = [
  {
    category: 'Appetizers',
    items: [createMenuItem()],
  },
];
```

## Async Testing Pattern

**Pattern Used in Current Code:**

```typescript
// IntersectionObserver with async behavior
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setShowMap(true); // Async state update
        observer.disconnect();
      }
    },
    { rootMargin: '200px' }
  );
  // ...
}, []);

// Testing this would require:
// 1. Mock IntersectionObserver
// 2. Use waitFor() for state updates
// 3. Trigger intersection manually in test
```

**Recommended Test Pattern:**

```typescript
import { waitFor } from '@testing-library/react';

it('should load map when scrolled into view', async () => {
  render(<GoogleMap apiKey="test-key" />);

  // Mock and trigger intersection
  const mockObserver = vi.fn();
  global.IntersectionObserver = vi.fn((callback) => ({
    observe: vi.fn(() => callback([{ isIntersecting: true }])),
    disconnect: vi.fn(),
  }));

  await waitFor(() => {
    expect(screen.getByTitle(/Google Maps/)).toBeInTheDocument();
  });
});
```

## Error Testing Pattern

**No Error Handling Tests (Not Yet Implemented)**

**Error Handling in Current Code:**

- No try/catch blocks in components
- No error boundaries implemented
- No error states displayed to users
- TypeScript prevents runtime type errors

**Recommended Error Boundaries (Future):**

```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

**Test Pattern for Error Boundaries:**

```typescript
it('should catch and display component errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary fallback={<div>Error occurred</div>}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/Error occurred/)).toBeInTheDocument();
});
```

## Setting Up Tests (Implementation Guide)

**Step 1: Install Vitest**

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/dom
```

**Step 2: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

**Step 3: Add to package.json scripts**

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

**Step 4: Create first test file**

- Copy test pattern from "Test Structure" section above
- Place in `src/lib/utils.test.ts`
- Run with `npm test`

---

_Testing analysis: 2026-02-20_
