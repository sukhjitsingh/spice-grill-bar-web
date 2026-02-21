# Coding Conventions

**Analysis Date:** 2026-02-20

## Naming Patterns

**Files:**

- React components: PascalCase (e.g., `Header.tsx`, `MenuSection.tsx`)
- Utility files: camelCase (e.g., `utils.ts`, `mode-toggle.tsx`)
- UI component files: kebab-case (e.g., `button.tsx`, `dropdown-menu.tsx`, `sheet.tsx`)
- Astro components: PascalCase (e.g., `Hero.astro`, `Footer.astro`, `Layout.astro`)
- Schema components: PascalCase with Schema suffix (e.g., `RestaurantSchema.astro`, `MenuSchema.astro`)
- Data files: lowercase with underscores or camelCase (e.g., `menu.json`, `reviews.json`, `faq.json`)

**Functions:**

- camelCase for all functions (both sync and async)
- Export named functions using `export function functionName() {}`
- Helper functions typically prefixed with get/set/handle (e.g., `getHref`, `setTheme`, `handleScroll`)
- Transformation utilities: simple descriptive names (e.g., `toKebabCase`, `cn`)

**Variables:**

- camelCase for all variables
- State variables: use React.useState with clear descriptive names (e.g., `isOpen`, `isScrolled`, `activeCategory`)
- Reference variables: useRef naming convention `*Ref` (e.g., `containerRef`)
- Constants: camelCase (not SCREAMING_SNAKE_CASE) - example: `navigation` array in `Header.tsx`

**Types:**

- PascalCase for interfaces and types (e.g., `MenuItem`, `MenuCategory`, `ButtonProps`)
- Props interfaces: `[ComponentName]Props` pattern (e.g., `ButtonProps`)
- Generic names when clear from context

**Classes:**

- Not used; React Hooks and Astro components are preferred patterns

## Code Style

**Formatting:**

- Tool: Prettier 3.8.1
- Print width: 100 characters
- Semi-colons: Required (semicolon: true)
- Quotes: Single quotes ('') for strings
- Tab width: 2 spaces
- Trailing commas: ES5 style (trailing comma in objects/arrays, not function params)
- Tabs: Spaces only (useTabs: false)
- Astro files: Uses prettier-plugin-astro for formatting

**Linting:**

- Tool: ESLint 8.57.1
- Config: `.eslintrc.cjs`
- Base config: airbnb-base with TypeScript support
- Plugins: @typescript-eslint, astro, jsx-a11y, simple-import-sort, prettier

**Key ESLint Rules:**

- Import sorting: Enforced via `simple-import-sort/imports` error
- Exports sorting: Enforced via `simple-import-sort/exports` error
- console: Allowed for warn, error, info (console.log should be removed)
- class-methods-use-this: Disabled
- Indent: Disabled (Prettier handles formatting)
- Unused variables: Error with pattern `^_` ignored (use leading underscore to suppress)
- Explicit function return types: Disabled - let TypeScript inference work
- Import extensions: Disabled - bundlers handle this

## Import Organization

**Order:**

1. React and third-party libraries (from node_modules)
2. Astro imports and core utilities
3. Local absolute imports using path aliases
4. Local relative imports (not used when @ alias available)

**Example from `Header.tsx`:**

```typescript
import { Menu, Phone, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
```

**Path Aliases:**

- `@/*` maps to `src/*` (defined in tsconfig.json)
- Always prefer absolute imports using `@/` over relative paths
- Group UI components with barrel exports when appropriate

**Barrel Exports:**

- UI components export multiple related items together (e.g., `Sheet`, `SheetContent`, `SheetTrigger` from one file)
- Single components export themselves plus any variants/utilities (e.g., `Button` and `buttonVariants`)

## Error Handling

**Patterns:**

- No explicit error handling found in React components - relies on React error boundaries (implicit)
- Validation typically via TypeScript types rather than runtime checks
- IntersectionObserver wrapped directly without error handling (GoogleMap.tsx)
- No try/catch blocks observed in src code
- Console restrictions: console.warn, console.error, console.info are allowed; console.log should be removed

**Type Safety Over Runtime Errors:**

- Use TypeScript interfaces for data validation
- Example: MenuCategory interface ensures correct shape of menu data
- Props validation through TypeScript interfaces (e.g., `GoogleMap` expects `apiKey: string`)

## Logging

**Framework:** console object

**Patterns:**

- Use console.warn() for warnings
- Use console.error() for errors
- Use console.info() for informational messages
- Avoid console.log() - use appropriate console method instead
- No dedicated logging framework in use

## Comments

**When to Comment:**

- Offset calculations: Document magic numbers (e.g., `// Offset for sticky headers`, `// Header height + sticky section header + padding`)
- Complex scroll logic: Explain the purpose (e.g., `// Start loading 200px before it enters viewport`)
- Non-obvious behavior: Like manual state updates for UX (e.g., `// Manually set active immediately for better UX`)
- Sparse usage - most code is self-documenting through clear naming

**JSDoc/TSDoc:**

- Not extensively used in this codebase
- Minimal documentation strings
- TypeScript types serve as primary documentation

## Function Design

**Size:**

- Functions are concise, typically 10-30 lines max
- Longer functions like MenuSection component are allowed (182 lines total) but broken into logical sections
- Helper functions extracted when used multiple times (e.g., `toKebabCase` utility)

**Parameters:**

- Destructured object parameters for props (e.g., `{ currentPath = '/' }` in Header)
- Default values directly in destructuring
- Avoid long parameter lists - use object destructuring instead

**Return Values:**

- React components return JSX.Element
- Utility functions return typed values (e.g., `function cn(...inputs: ClassValue[])`)
- Callbacks return void when used as event handlers
- Early returns used for guard clauses (e.g., in GoogleMap conditional render)

## Module Design

**Exports:**

- Named exports for components: `export function ComponentName() {}`
- Named exports for utilities: `export function utilityName() {}`
- Interface exports: `export interface TypeName { }`
- Re-exports from barrel files: `export { Component1, Component2 }`

**Barrel Exports:**

- Used in ui/ directory for convenience (e.g., `sheet.tsx` exports Sheet, SheetContent, SheetTrigger)
- Not used extensively for feature modules
- Helps manage UI component complexity

**File Organization:**

- One component per file (standard React pattern)
- UI components grouped in `components/ui/` directory
- Schema components in `components/schema/` subdirectory
- Utilities in `lib/` directory

## React-Specific Patterns

**Hooks:**

- Use React.useState for component state
- Use React.useEffect for side effects with proper dependency arrays
- Reference: `useRef` for DOM access
- Prefer functional components with hooks over class components

**React.forwardRef:**

- Used for UI components that need ref forwarding (e.g., Button component)
- Pattern: `React.forwardRef<ElementType, PropsType>((props, ref) => {...})`
- Set displayName on forwardRef components

**State Management:**

- Local component state only - no Redux/Zustand
- Pass callbacks as props for state updates
- Controlled components pattern for forms

**Render Props:**

- Not used; prefer component composition
- Prefer flexible prop passing to Radix UI primitives

**Type-Safe Props:**

- All component props typed with interfaces
- Example: `ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>`
- Combines HTML attributes with custom variants

## CSS and Styling

**Framework:** Tailwind CSS with Astro and React

- Dark mode support with `dark:` prefix
- Custom brand color: `brand-orange` used throughout
- Responsive utilities: `md:`, `lg:` breakpoints

**Class Utilities:**

- cn() function from `@/lib/utils` for merging classes
- Implements clsx + tailwind-merge pattern
- Used extensively for conditional classes (e.g., MenuSection button styling)

**Class-Variance-Authority (CVA):**

- Used for component variants (e.g., ButtonVariants in button.tsx)
- Defines variants and sizes as CVA patterns
- Used with cn() for merging custom classes

## Type System

**TypeScript Version:** 5.5.4
**Strictness:** Astro strict config (`astro/tsconfigs/strict`)

**Key Patterns:**

- Type annotations on interfaces, not individual variables (let inference work)
- Generic types used for UI component props (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`)
- Union types for multi-state values (e.g., `'theme-light' | 'dark' | 'system'`)
- No use of `any` or `unknown` where possible

---

_Convention analysis: 2026-02-20_
