# Testing Patterns and Setup

> Last updated: 2026-02-15

## Current Testing Status

**No test framework is currently configured.** The codebase does not have:
- No Jest, Vitest, or other test runners
- No test files (`*.test.*`, `*.spec.*`)
- No testing dependencies in `package.json`
- No test scripts configured

## Validation Script

The codebase uses a **content validation script** instead of traditional unit tests.

**File:** `scripts/validate-content.ts`

### Running Validation

```bash
npm run validate
# or
npx tsx scripts/validate-content.ts
```

### What It Validates

1. **Edition files** (`edition.json`)
   - Required: `title`, `date`
   - Warning if missing: `intro`

2. **Section files** (`section.json`)
   - Required: `title`, `color`, `order`

3. **Feature files** (`features/*.json`)
   - Required: `slug`, `title`, `status`
   - Valid status values: `go-live`, `set-up-required`, `sub-region-request`, `content-go-live-ongoing`
   - Warning if missing: `goal`, `description`
   - Validates arrays: `tags`, `regions`, `platforms`, `images`
   - Validates image paths exist in `public/`

### Validation Output

```
Validating content...

Summary:
   Editions:  2
   Sections:  12
   Features:  24

All content is valid!
```

## Recommended Testing Setup

If implementing tests, consider:

### Framework: Vitest

Vitest is recommended for Next.js 16 projects:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': '.',
    },
  },
});
```

### Test File Locations

Follow component co-location pattern:

```
components/
├── ui/
│   ├── Tag.tsx
│   ├── Tag.test.tsx        # Unit test
│   ├── StatusPill.tsx
│   └── StatusPill.test.tsx
lib/
├── content.ts
├── content.test.ts
├── constants.ts
└── constants.test.ts
```

Or use a separate `__tests__` directory:

```
__tests__/
├── components/
│   └── ui/
│       └── Tag.test.tsx
├── lib/
│   └── content.test.ts
└── integration/
    └── edition-page.test.tsx
```

### Example Test Cases

#### Utility Functions

```typescript
// lib/constants.test.ts
import { describe, it, expect } from 'vitest';
import { parseEditionSlug, formatEditionDate } from './constants';

describe('parseEditionSlug', () => {
  it('parses jan-2026 correctly', () => {
    const date = parseEditionSlug('jan-2026');
    expect(date.getMonth()).toBe(0);
    expect(date.getFullYear()).toBe(2026);
  });

  it('parses feb-2026 correctly', () => {
    const date = parseEditionSlug('feb-2026');
    expect(date.getMonth()).toBe(1);
    expect(date.getFullYear()).toBe(2026);
  });
});

describe('formatEditionDate', () => {
  it('formats slug to readable date', () => {
    expect(formatEditionDate('jan-2026')).toBe('January 2026');
    expect(formatEditionDate('feb-2026')).toBe('February 2026');
  });
});
```

#### Component Tests

```typescript
// components/ui/Tag.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tag from './Tag';

describe('Tag', () => {
  it('renders label text', () => {
    render(<Tag label="iOS" />);
    expect(screen.getByText('iOS')).toBeInTheDocument();
  });

  it('applies light variant styles by default', () => {
    const { container } = render(<Tag label="iOS" />);
    // Check for light background color
  });

  it('applies dark variant styles', () => {
    const { container } = render(<Tag label="iOS" variant="dark" />);
    // Check for dark background color
  });

  it('uses section-specific colors', () => {
    const { container } = render(<Tag label="iOS" sectionSlug="club-avolta-app" />);
    // Check for purple section color
  });
});
```

#### Content Loading Tests

```typescript
// lib/content.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getEditions, getEdition, getLatestEdition } from './content';

// Note: These would need mocking of fs module
describe('getEditions', () => {
  it('returns editions sorted newest first', () => {
    const editions = getEditions();
    expect(editions[0]).toBe('feb-2026');
    expect(editions[1]).toBe('jan-2026');
  });
});

describe('getLatestEdition', () => {
  it('returns most recent edition slug', () => {
    expect(getLatestEdition()).toBe('feb-2026');
  });
});
```

## Linting as Quality Gate

Currently, ESLint serves as the primary code quality check:

```bash
npm run lint
```

### Pre-commit Recommendations

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "validate": "npx tsx scripts/validate-content.ts",
    "check-all": "npm run lint && npm run typecheck && npm run validate"
  }
}
```

## Type Checking

TypeScript strict mode provides compile-time safety:

```bash
npx tsc --noEmit
```

Key strict mode features enabled:
- `strict: true` (enables all strict type-checking options)
- `isolatedModules: true` (ensures each file can be transpiled independently)
- `noEmit: true` (type-check only, no output files)

## CI/CD Recommendations

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run validate
      - run: npm run build
```

## Build Verification

The Next.js build process serves as an integration test:

```bash
npm run build
```

This verifies:
- All pages compile without errors
- Static generation works for all routes
- No TypeScript errors
- No broken imports

## Summary

| Quality Check | Status | Command |
|---------------|--------|---------|
| Unit Tests | Not configured | - |
| Integration Tests | Not configured | - |
| ESLint | Configured | `npm run lint` |
| TypeScript | Strict mode | `npx tsc --noEmit` |
| Content Validation | Configured | `npm run validate` |
| Build | Configured | `npm run build` |
