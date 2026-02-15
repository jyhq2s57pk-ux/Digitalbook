# Digital Book - Directory Structure

## Root Layout

```
digitalbook/
├── app/                    # Next.js 16 App Router
├── components/             # React components
├── content/                # JSON content files
├── contexts/               # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and type definitions
├── public/                 # Static assets
├── scripts/                # Build and maintenance scripts
├── .planning/              # Project documentation
├── .vercel/                # Vercel deployment config
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## App Router (`app/`)

```
app/
├── layout.tsx              # Root HTML layout with metadata
├── page.tsx                # Root redirect to latest edition
├── globals.css             # Tailwind + design system tokens
├── sitemap.ts              # Dynamic sitemap generation
├── favicon.ico
└── [edition]/              # Dynamic edition segment
    ├── layout.tsx          # Edition layout (header, footer, providers)
    ├── page.tsx            # Edition home - section navigation cards
    ├── [section]/          # Dynamic section segment
    │   └── page.tsx        # Section page - feature card listings
    └── audio-digest/       # Static audio segment
        └── page.tsx        # Audio digest player page
```

### Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root HTML structure, metadata, viewport config |
| `app/page.tsx` | Redirects `/` to latest edition (e.g., `/feb-2026`) |
| `app/globals.css` | Tailwind imports + Figma design tokens |
| `app/sitemap.ts` | Generates XML sitemap for all editions/sections |
| `app/[edition]/layout.tsx` | Shared layout with SiteHeader, Footer, BackToTop |
| `app/[edition]/page.tsx` | Edition landing with SectionNavCard grid |
| `app/[edition]/[section]/page.tsx` | Feature card display with ContentsPanel |
| `app/[edition]/audio-digest/page.tsx` | Audio player cards for multiple languages |

## Components (`components/`)

```
components/
├── audio/
│   └── AudioPlayerCard.tsx     # Audio player with waveform visualization
├── feature/
│   ├── AudioDigestPlayer.tsx   # In-card audio player for features
│   ├── FeatureCard.tsx         # Main feature display card (light/dark variants)
│   └── FeatureImage.tsx        # Feature screenshot image component
├── layout/
│   └── SectionNavCard.tsx      # Clickable section card for edition home
├── navigation/
│   ├── BackToTop.tsx           # Scroll-to-top button
│   ├── ContentsPanel.tsx       # Collapsible table of contents
│   ├── Footer.tsx              # Site footer with section links
│   ├── MobileNav.tsx           # Mobile navigation overlay
│   ├── PrevNextNav.tsx         # Section navigation arrows
│   ├── SectionScrollWrapper.tsx # Scroll behavior wrapper
│   └── SiteHeader.tsx          # Fixed header with section pills
├── providers/
│   └── HeaderProviderWrapper.tsx # Context provider wrapper
└── ui/
    ├── CopyLinkButton.tsx      # Copy feature URL button
    ├── StatusPill.tsx          # Feature status indicator
    └── Tag.tsx                 # Platform/region tag component
```

### Component Patterns

- **Server Components**: Default for all components unless interaction required
- **Client Components**: Marked with `'use client'` (SiteHeader, HeaderContext)
- **Variants**: Many components support `light`/`dark` variants
- **Section Colors**: Components accept `sectionSlug` for dynamic theming

## Content (`content/`)

```
content/
├── _templates/                     # (Reserved for templates)
└── editions/
    ├── jan-2026/                   # Edition directory (slug format: mmm-yyyy)
    │   ├── edition.json            # Edition metadata
    │   ├── website-rc/             # Section directory
    │   │   ├── section.json        # Section metadata
    │   │   └── features/
    │   │       └── *.json          # Feature files
    │   ├── club-avolta-app/
    │   ├── oms/
    │   ├── sso/
    │   ├── my-autogrill/
    │   └── audio-digest/
    │       ├── section.json
    │       ├── audio-digest.json   # Audio podcast configuration
    │       └── features/
    └── feb-2026/
        └── ...
```

### Content File Schemas

**`edition.json`**:
```json
{
  "title": "January 2026",
  "date": "2026-01-01",
  "intro": "Edition introduction text..."
}
```

**`section.json`**:
```json
{
  "title": "Website R&C and Emporium",
  "summary": "Section summary...",
  "color": "#ED8A40",
  "order": 1
}
```

**`features/*.json`**:
```json
{
  "slug": "feature-slug",
  "title": "Feature Title",
  "status": "go-live",
  "releaseDate": "Feb. 2026",
  "goal": "Feature goal...",
  "description": "Detailed description...",
  "tags": ["tag1", "tag2"],
  "regions": ["Global"],
  "platforms": ["Website", "App"],
  "images": ["/images/jan-2026/section/image.png"],
  "owner": "Optional owner",
  "jiraLink": "Optional JIRA URL",
  "docsLink": "Optional docs URL",
  "audioSources": { "en": "/audio/path.mp3" }
}
```

## Library (`lib/`)

```
lib/
├── content.ts      # Content loading functions (fs-based)
├── constants.ts    # Section config, status mappings, utilities
└── types.ts        # TypeScript interfaces
```

### Exports

| Module | Key Exports |
|--------|-------------|
| `content.ts` | `getEditions()`, `getEdition()`, `getSection()`, `getAudioDigestContent()`, `getAllEditionParams()`, `getAllSectionParams()` |
| `constants.ts` | `SECTIONS`, `STATUS_CONFIG`, `parseEditionSlug()`, `formatEditionDate()` |
| `types.ts` | `Edition`, `Section`, `Feature`, `FeatureStatus`, `SectionConfig`, `AudioPodcast` |

## Contexts (`contexts/`)

```
contexts/
└── HeaderContext.tsx    # Scroll-aware header visibility context
```

Provides `useHeader()` hook with:
- `isHeaderVisible`: boolean for show/hide animation
- `headerHeight`: number (60px mobile, 58px desktop)

## Hooks (`hooks/`)

```
hooks/
└── useScrollspy.ts      # Section scroll tracking hook
```

## Public Assets (`public/`)

```
public/
├── db-logo.svg                 # Digital Book logo (dark)
├── db-logo-white.svg           # Digital Book logo (light)
├── audiodigestlogo.svg         # Audio Digest logo (dark)
├── audiodigestlogo-white.svg   # Audio Digest logo (light)
├── images/
│   └── jan-2026/
│       ├── website-rc/         # Section-specific images
│       ├── club-avolta-app/
│       └── ...
├── audio/
│   ├── jan-2026/               # Edition audio files
│   └── feb-2026/
└── fonts/
    └── Avolta Saans/
        ├── Saans-Regular.woff
        ├── Saans-Medium.woff
        └── Saans-SemiBold.woff
```

## Scripts (`scripts/`)

```
scripts/
├── new-edition.ts       # Create new edition scaffold
└── validate-content.ts  # Validate JSON content structure
```

Run via:
- `npm run new-edition` - Interactive edition creation
- `npm run validate` - Content validation checks

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (images, turbopack) |
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `package.json` | Dependencies and scripts |
| `tailwind.config.ts` | Tailwind CSS configuration |

## Import Aliases

The project uses `@/*` path alias mapped to root:

```typescript
import { getEdition } from '@/lib/content';
import FeatureCard from '@/components/feature/FeatureCard';
import type { Feature } from '@/lib/types';
```

## Naming Conventions

- **Editions**: `{mmm}-{yyyy}` (e.g., `jan-2026`, `feb-2026`)
- **Sections**: kebab-case matching slugs in `SECTIONS` constant
- **Features**: kebab-case slugs matching filename
- **Components**: PascalCase with descriptive names
- **CSS**: Tailwind utilities + CSS custom properties
