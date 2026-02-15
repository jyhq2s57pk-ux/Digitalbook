# External Integrations

> Generated: 2026-02-15

## Overview

The Avolta Digital Book is a **self-contained static site** with minimal external dependencies. It does not connect to external APIs, databases, or third-party services at runtime.

## Content System (Internal)

### File-System Content Store

| Component | Path | Format |
|-----------|------|--------|
| Editions | `content/editions/{month}-{year}/` | Directory structure |
| Edition metadata | `edition.json` | JSON |
| Section metadata | `{section}/section.json` | JSON |
| Features | `{section}/features/*.json` | JSON |

**Content Types** (from `lib/types.ts`):
- `Edition` - title, date, intro, sections
- `Section` - slug, title, summary, color, order, features
- `Feature` - slug, title, status, goal, description, tags, regions, platforms, images

**Feature Statuses:**
- `go-live`
- `set-up-required`
- `sub-region-request`
- `content-go-live-ongoing`
- `in-development`
- `planned`

### Work Stream Sections

Six predefined sections in `lib/constants.ts`:

| Section | Slug | Color |
|---------|------|-------|
| Website R&C and Emporium | `website-rc` | #ED8A40 |
| Club Avolta App | `club-avolta-app` | #8F53F0 |
| OMS | `oms` | #00897B |
| SSO | `sso` | #616161 |
| My Autogrill | `my-autogrill` | #C62828 |
| Audio Digest | `audio-digest` | #4D0FB1 |

## Static Assets

### Images

| Location | Purpose |
|----------|---------|
| `public/images/{edition}/` | Feature screenshots per edition |
| `public/*.svg` | Brand logos (db-logo, avoltalogo, audiodigestlogo) |

Formats supported via Next.js Image optimization:
- AVIF (preferred)
- WebP (fallback)

### Audio

| Location | Purpose |
|----------|---------|
| `public/audio/{edition}/` | Audio Digest podcast files |

Audio playback handled by native HTML5 `<audio>` element in `components/audio/AudioPlayerCard.tsx`.

### Fonts

| Font | Location | Weights |
|------|----------|---------|
| Saans (Avolta brand) | `public/fonts/Avolta Saans/` | 400, 500, 600 |

Self-hosted WOFF files loaded via `@font-face` in `app/globals.css`.

## Build-Time Integrations

### Next.js Static Export

- **Type:** Static Site Generation (SSG)
- **Output:** Static HTML, CSS, JS
- **No runtime server required**

### Design System

- **Source:** Figma file `BKwFVMKiwQ9KW9HkWJnF2z`
- **Integration:** Manual extraction to CSS custom properties
- **Location:** `app/globals.css` `@theme inline` block

## Potential External Services (Not Currently Integrated)

Based on the feature schema, these fields exist but are not actively used:

| Field | Purpose | Status |
|-------|---------|--------|
| `jiraLink` | Link to Jira issue | Optional, display only |
| `docsLink` | Link to documentation | Optional, display only |
| `owner` | Feature owner name | Optional, display only |

These are passive links stored in feature JSON files, not active API integrations.

## Deployment

### Environment Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://digitalbook.avolta.com` | Base URL for sitemap, OpenGraph |

### Metadata Configuration

**OpenGraph** (from `app/layout.tsx`):
- Type: website
- Site Name: Avolta Digital Book
- Locale: en_US

**Viewport:**
- Theme color: #8F53F0 (primary purple)

**Robots:**
- Indexable: yes
- Followable: yes

## SEO

### Sitemap

**File:** `app/sitemap.ts`

Dynamically generates sitemap entries for:
- All edition homepages (priority: 0.9)
- All section pages within editions (priority: 0.7)
- Change frequency: monthly

### Metadata

Title template: `%s | Avolta Digital Book`

## Summary

| Integration Type | Count | Notes |
|------------------|-------|-------|
| External APIs | 0 | No runtime API calls |
| Databases | 0 | File-system content only |
| Third-party services | 0 | Self-hosted static site |
| CDN/Hosting | TBD | Deployment target not specified |
| Analytics | 0 | No analytics integration |
| Authentication | 0 | Public site, no auth |

This is a clean, self-contained static site optimized for internal publishing of monthly digital feature updates across Avolta work streams.
