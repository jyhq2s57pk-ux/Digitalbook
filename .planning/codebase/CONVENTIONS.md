# Coding Conventions

> Last updated: 2026-02-15

## Overview

Digital Book is a Next.js 16 static site using React 19, TypeScript 5, and Tailwind CSS 4. The codebase follows strict TypeScript conventions with Next.js App Router patterns.

## TypeScript Configuration

**File:** `tsconfig.json`

- **Strict mode:** Enabled (`"strict": true`)
- **Target:** ES2017
- **Module resolution:** Bundler (modern Next.js standard)
- **Path aliases:** `@/*` maps to project root
- **JSX:** `react-jsx` (automatic runtime)

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

## ESLint Configuration

**File:** `eslint.config.mjs`

Uses ESLint 9 flat config format with Next.js presets:

- `eslint-config-next/core-web-vitals` - Performance best practices
- `eslint-config-next/typescript` - TypeScript rules

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

**Run linting:**
```bash
npm run lint
```

## Code Formatting

- **No Prettier config** - Relies on ESLint rules
- **Indentation:** 2 spaces (inferred from codebase)
- **Semicolons:** Required
- **Quotes:** Single quotes for strings
- **Trailing commas:** Yes

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | `FeatureCard.tsx`, `SiteHeader.tsx` |
| Pages | page.tsx (App Router) | `app/[edition]/page.tsx` |
| Layouts | layout.tsx | `app/[edition]/layout.tsx` |
| Utilities | camelCase.ts | `content.ts`, `constants.ts` |
| Types | types.ts | `lib/types.ts` |
| Contexts | PascalCaseContext.tsx | `HeaderContext.tsx` |
| Scripts | kebab-case.ts | `validate-content.ts`, `new-edition.ts` |

### Variables and Functions

- **Components:** PascalCase (`FeatureCard`, `SiteHeader`)
- **Functions:** camelCase (`getEdition`, `loadFeatures`)
- **Constants:** SCREAMING_SNAKE_CASE or camelCase for config objects (`SECTIONS`, `STATUS_CONFIG`)
- **Interfaces:** PascalCase with descriptive suffixes (`FeatureCardProps`, `SectionConfig`)
- **Types:** PascalCase (`FeatureStatus`, `Edition`)

### Component Props

```typescript
interface FeatureCardProps {
  feature: Feature;
  variant?: 'light' | 'dark';
  editionSlug: string;
  sectionSlug: string;
}
```

## Directory Structure

```
digitalbook/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (redirects to latest edition)
│   └── [edition]/           # Dynamic edition routes
│       ├── page.tsx
│       ├── layout.tsx
│       ├── [section]/
│       │   └── page.tsx
│       └── audio-digest/
│           └── page.tsx
├── components/              # React components
│   ├── ui/                  # Atomic UI components (Tag, StatusPill, CopyLinkButton)
│   ├── feature/             # Feature-specific components (FeatureCard, FeatureImage)
│   ├── navigation/          # Navigation components (SiteHeader, Footer, MobileNav)
│   ├── layout/              # Layout components (SectionNavCard)
│   ├── audio/               # Audio components (AudioPlayerCard)
│   └── providers/           # Context providers (HeaderProviderWrapper)
├── contexts/                # React contexts (HeaderContext)
├── lib/                     # Utilities and helpers
│   ├── types.ts            # TypeScript type definitions
│   ├── constants.ts        # Configuration constants
│   └── content.ts          # Content loading functions
├── content/                 # JSON content files
│   └── editions/           # Edition data directories
├── scripts/                 # CLI scripts
│   ├── validate-content.ts
│   └── new-edition.ts
└── public/                  # Static assets
```

## Component Patterns

### Server Components (Default)

Most components are server components by default:

```typescript
// app/[edition]/page.tsx
export default async function EditionPage({ params }: EditionPageProps) {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);
  // ...
}
```

### Client Components

Use `'use client'` directive for interactive components:

```typescript
// components/ui/CopyLinkButton.tsx
'use client';

import { useState, useCallback } from 'react';

export default function CopyLinkButton({ featureSlug, variant = 'light'}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  // ...
}
```

### Props Interface Pattern

Define props interfaces directly above components:

```typescript
interface SiteHeaderProps {
  sections: Section[];
  editionSlug: string;
  editionTitle: string;
  currentSectionSlug?: string;
}

export default function SiteHeader({
  sections,
  editionSlug,
  editionTitle,
  currentSectionSlug,
}: SiteHeaderProps) {
  // ...
}
```

### Default Exports

Components use **default exports**:

```typescript
export default function FeatureCard({ feature, variant = 'light' }: FeatureCardProps) {
  // ...
}
```

### Type Imports

Use `type` keyword for type-only imports:

```typescript
import type { Feature } from '@/lib/types';
import type { Metadata, Viewport } from 'next';
```

## Styling Conventions

### Tailwind CSS

- Use Tailwind utility classes inline
- Responsive prefixes: `md:`, `lg:`
- Custom CSS variables for brand colors

```tsx
<div className="flex flex-col gap-6 md:gap-10">
  <h2 className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px]">
```

### CSS Variables

Defined in `globals.css`, used via `var()`:

```typescript
const bg = isLight ? 'var(--color-day)' : 'var(--color-card-dark)';
```

### Inline Styles for Dynamic Values

```typescript
<article
  style={{ backgroundColor: bg }}
  className="relative overflow-hidden rounded-[32px]"
>
```

## Import Order

1. React/Next.js imports
2. External libraries
3. Internal absolute imports (`@/lib/...`, `@/components/...`)
4. Relative imports
5. Type imports (can be at top with `type` keyword)

```typescript
import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { Section } from '@/lib/types';
import MobileNav from './MobileNav';
```

## Type Definitions

### Central Type File

All shared types in `lib/types.ts`:

```typescript
export type FeatureStatus =
  | 'go-live'
  | 'set-up-required'
  | 'sub-region-request'
  | 'content-go-live-ongoing'
  | 'in-development'
  | 'planned';

export interface Feature {
  slug: string;
  title: string;
  status: FeatureStatus;
  // ...
}
```

### Type Assertions

Use `satisfies` for type safety without widening:

```typescript
return {
  slug,
  title: data.title || slug,
  // ...
} satisfies Feature;
```

## Next.js App Router Patterns

### Static Generation

```typescript
export async function generateStaticParams() {
  return getAllEditionParams();
}
```

### Metadata Generation

```typescript
export async function generateMetadata({ params }: EditionPageProps): Promise<Metadata> {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);
  if (!edition) return {};
  return {
    title: `${edition.title} Edition`,
    description: edition.intro,
  };
}
```

### Async Params (Next.js 16)

Route params are promises in Next.js 16:

```typescript
interface EditionPageProps {
  params: Promise<{ edition: string }>;
}

export default async function EditionPage({ params }: EditionPageProps) {
  const { edition: editionSlug } = await params;
  // ...
}
```

## Error Handling

### Not Found Pattern

```typescript
import { notFound } from 'next/navigation';

export default async function EditionPage({ params }: EditionPageProps) {
  const edition = getEdition(editionSlug);
  if (!edition) {
    notFound();
  }
  // ...
}
```

### Try-Catch with Empty Catch

```typescript
try {
  await navigator.clipboard.writeText(url);
} catch {
  // Fallback for older browsers
}
```

## Content Management

### JSON File Structure

Content stored in `content/editions/{edition-slug}/`:

```
content/editions/feb-2026/
├── edition.json
├── website-rc/
│   ├── section.json
│   └── features/
│       └── *.json
├── club-avolta-app/
│   ├── section.json
│   └── features/
└── ...
```

### Content Loading

Server-side only, using Node.js `fs` module:

```typescript
import fs from 'fs';
import path from 'path';

export function getEdition(slug: string): Edition | null {
  const editionDir = path.join(CONTENT_DIR, slug);
  // ...
}
```
