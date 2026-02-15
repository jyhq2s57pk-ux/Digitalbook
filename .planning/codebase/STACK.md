# Technology Stack

> Generated: 2026-02-15

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router, static site generation |
| **React** | 19.2.3 | UI library with React 19 features |
| **TypeScript** | ^5 | Type-safe JavaScript |

## Build & Development

| Tool | Version | Configuration File |
|------|---------|-------------------|
| **Turbopack** | (bundled) | `next.config.ts` - root configured |
| **ESLint** | ^9 | `eslint.config.mjs` - Next.js core-web-vitals + TypeScript |
| **PostCSS** | (bundled) | `postcss.config.mjs` |

## Styling

| Technology | Version | Notes |
|------------|---------|-------|
| **Tailwind CSS** | ^4 | CSS framework via `@tailwindcss/postcss` |
| **CSS Custom Properties** | - | Design tokens in `app/globals.css` |
| **Self-hosted fonts** | - | Saans font family (Avolta brand) |

## TypeScript Configuration

**File:** `tsconfig.json`

- **Target:** ES2017
- **Module Resolution:** bundler
- **JSX:** react-jsx (React 19 automatic runtime)
- **Strict mode:** enabled
- **Path aliases:** `@/*` maps to project root

## Project Architecture

### Static Site Generation (SSG)

The project is a **fully static site** using Next.js App Router:

- `generateStaticParams()` pre-renders all edition and section pages
- File-based content from `content/editions/` directory
- No server-side runtime required

### Directory Structure

```
digitalbook/
  app/                      # Next.js App Router pages
    [edition]/              # Dynamic edition routes
      [section]/            # Dynamic section routes
      audio-digest/         # Audio digest page
    layout.tsx              # Root layout with metadata
    globals.css             # Tailwind + design tokens
    sitemap.ts              # Dynamic sitemap generation
  components/               # React components
    audio/                  # Audio player components
    feature/                # Feature card, image components
    layout/                 # Section nav cards
    navigation/             # Header, footer, mobile nav
    providers/              # React context wrappers
    ui/                     # Tags, status pills, buttons
  contexts/                 # React Context providers
    HeaderContext.tsx       # Scroll-aware header visibility
  lib/                      # Utilities and types
    content.ts              # File-system content loading
    constants.ts            # Section config, status pills
    types.ts                # TypeScript interfaces
  content/editions/         # JSON-based content
    {month}-{year}/         # Edition folders (e.g., feb-2026)
      edition.json          # Edition metadata
      {section}/            # Section folders
        section.json        # Section metadata
        features/*.json     # Feature data files
  scripts/                  # CLI tools
    validate-content.ts     # Content validation
    new-edition.ts          # Edition scaffolding
  public/                   # Static assets
    fonts/Avolta Saans/     # Brand typography
    images/{edition}/       # Edition-specific images
    audio/{edition}/        # Edition-specific audio files
```

## Key Patterns

### Content Management

- **File-system based:** No database or CMS
- **JSON content:** Edition, section, and feature data stored as JSON
- **Build-time loading:** `lib/content.ts` reads filesystem at build
- **Validation script:** `npm run validate` checks content structure

### Component Organization

- **Server Components:** Default for pages and layouts
- **Client Components:** Interactive elements marked with `'use client'`
  - `AudioPlayerCard.tsx` - Audio playback
  - `SiteHeader.tsx` - Mobile nav state
  - `HeaderProviderWrapper.tsx` - Context provider

### Design System

Design tokens extracted from Figma (reference: `BKwFVMKiwQ9KW9HkWJnF2z`):

- **Colors:** night, sand, sun, primary, section-specific
- **Typography:** h1-h4, body variants with precise sizing
- **Spacing:** page, section, card with responsive variants
- **Border radii:** card, image, panel, tag, button

### Image Optimization

Configured in `next.config.ts`:
- **Formats:** AVIF, WebP (modern formats first)
- **Next.js Image component:** Automatic optimization

## NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server with Turbopack |
| `build` | `next build` | Production static build |
| `start` | `next start` | Serve built site |
| `lint` | `eslint` | Code linting |
| `validate` | `npx tsx scripts/validate-content.ts` | Content validation |
| `new-edition` | `npx tsx scripts/new-edition.ts` | Scaffold new edition |

## Environment Variables

| Variable | Usage | Location |
|----------|-------|----------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for sitemap/metadata | `app/layout.tsx`, `app/sitemap.ts` |

Default: `https://digitalbook.avolta.com`

## Dependencies Summary

### Production
- `next` - Framework
- `react` - UI library
- `react-dom` - React DOM bindings

### Development
- `@tailwindcss/postcss` - Tailwind CSS integration
- `@types/node`, `@types/react`, `@types/react-dom` - TypeScript definitions
- `eslint`, `eslint-config-next` - Linting
- `tailwindcss` - CSS framework
- `typescript` - Type checking
