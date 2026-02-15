# Digital Book - Architecture

## Overview

The Digital Book is a monthly feature release publication system for Avolta's digital work streams. Built with Next.js 16 App Router, it serves as a static site showcasing features across six distinct sections: Website R&C, Club Avolta App, OMS, SSO, My Autogrill, and Audio Digest.

## Architecture Pattern

**Content-Driven Static Site** with file-based content management and dynamic routing.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Layout    │  │ Navigation  │  │    Feature Display      │  │
│  │ Components  │  │ Components  │  │      Components         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                         App Router Layer                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │   /[edition]  →  /[edition]/[section]  →  audio-digest    │  │
│  │   Dynamic routes with SSG (generateStaticParams)          │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        Content Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  lib/       │  │   JSON      │  │    Static Assets        │  │
│  │  content.ts │──│   Content   │──│   (images, audio)       │  │
│  │  (reader)   │  │   Files     │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Layers

### 1. Routing Layer (`app/`)

Uses Next.js 16 App Router with dynamic segments:

- **Root** (`app/page.tsx`): Redirects to latest edition
- **Edition Layout** (`app/[edition]/layout.tsx`): Shared header, footer, providers
- **Edition Page** (`app/[edition]/page.tsx`): Section navigation cards
- **Section Page** (`app/[edition]/[section]/page.tsx`): Feature card listings
- **Audio Digest** (`app/[edition]/audio-digest/page.tsx`): Dedicated audio player page

All pages use `generateStaticParams()` for Static Site Generation (SSG).

### 2. Content Layer (`lib/`, `content/`)

File-based content management system:

- **`lib/content.ts`**: Content loading functions (fs-based, build-time)
- **`lib/types.ts`**: TypeScript interfaces for Edition, Section, Feature
- **`lib/constants.ts`**: Section configuration, status mappings, date utilities

Content is read from `content/editions/` at build time and transformed into typed objects.

### 3. Component Layer (`components/`)

Organized by function:

| Directory | Purpose |
|-----------|---------|
| `components/layout/` | Page structure components (SectionNavCard) |
| `components/navigation/` | Header, Footer, MobileNav, ContentsPanel |
| `components/feature/` | FeatureCard, FeatureImage, AudioDigestPlayer |
| `components/ui/` | StatusPill, Tag, CopyLinkButton |
| `components/audio/` | AudioPlayerCard |
| `components/providers/` | React context providers |

### 4. State Management (`contexts/`)

Minimal client-side state using React Context:

- **`HeaderContext.tsx`**: Scroll-aware header visibility (show/hide on scroll direction)

No external state management libraries; the app is primarily static with minimal interactivity.

### 5. Styling Layer

- **Tailwind CSS v4** with custom theme configuration in `app/globals.css`
- **Design tokens** from Figma (colors, typography, spacing, radii)
- **Custom font**: Avolta Saans (self-hosted in `public/fonts/`)
- **Responsive design**: Mobile-first with `md:` and `lg:` breakpoints

## Data Flow

```
Build Time:
  content/editions/{month-year}/
       ├── edition.json
       ├── {section}/
       │   ├── section.json
       │   └── features/*.json
       └── audio-digest/
           └── audio-digest.json
                    │
                    ▼
            lib/content.ts
       (getEdition, getSection, loadFeatures)
                    │
                    ▼
            generateStaticParams()
                    │
                    ▼
          Static HTML/JSON output
```

Runtime:
- Pure static pages served from CDN
- Client-side JavaScript for:
  - Header scroll behavior
  - Mobile navigation toggle
  - Audio playback controls
  - Copy-to-clipboard functionality

## Key Patterns

### 1. Static Params Generation

All dynamic routes use `generateStaticParams()` to pre-render at build time:

```typescript
// app/[edition]/[section]/page.tsx
export async function generateStaticParams() {
  return getAllSectionParams(); // Returns [{edition, section}, ...]
}
```

### 2. Server Components by Default

All page components are React Server Components (RSC). Client components are explicitly marked with `'use client'` directive:
- `SiteHeader.tsx` - interactive navigation
- `HeaderContext.tsx` - scroll tracking
- Audio player components

### 3. Type Safety

Strong TypeScript typing throughout:
- `lib/types.ts` defines core interfaces
- JSON content files validated against types
- Path aliases via `@/*` mapping

### 4. Design System Tokens

CSS custom properties in `globals.css`:
```css
--color-night: #252525;
--color-sand: #F5F3ED;
--color-primary: #8F53F0;
--color-section-website-rc: #ED8A40;
/* ... */
```

### 5. Section-Based Color Theming

Each section has a distinct brand color applied via:
- Section config in `lib/constants.ts`
- Dynamic style props in components
- Status pills and tags adapt to section context

## Build & Deployment

- **Build**: `next build` produces static output
- **Output**: Static HTML + client JS bundles
- **Deployment**: Vercel (configured via `.vercel/`)
- **Scripts**:
  - `npm run validate`: Content validation
  - `npm run new-edition`: Scaffold new edition

## Performance Considerations

1. **Static Generation**: All pages pre-rendered at build time
2. **Image Optimization**: Next.js Image with AVIF/WebP formats
3. **Font Loading**: `font-display: swap` for self-hosted fonts
4. **Minimal JavaScript**: Server components reduce client bundle
5. **Turbopack**: Enabled for faster development builds
