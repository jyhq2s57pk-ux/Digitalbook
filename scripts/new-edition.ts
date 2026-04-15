#!/usr/bin/env npx tsx

/**
 * Scaffold a new edition folder structure.
 *
 * Usage:
 *   npx tsx scripts/new-edition.ts feb-2026
 *   npx tsx scripts/new-edition.ts mar-2026
 *
 * This creates:
 *   content/editions/<slug>/
 *     edition.json
 *     website-rc/section.json + features/
 *     club-avolta-app/section.json + features/
 *     oms/section.json + features/
 *     sso/section.json + features/
 *     my-autogrill/section.json + features/
 *     audio-digest/section.json + features/
 *   public/images/<slug>/
 *   public/audio/<slug>/
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SECTIONS = [
  { slug: 'website-rc', title: 'Website R&C and Emporium', color: '#ED8A40', order: 1 },
  { slug: 'club-avolta-app', title: 'Club Avolta App', color: '#8F53F0', order: 2 },
  { slug: 'oms', title: 'OMS', color: '#00897B', order: 3 },
  { slug: 'sso', title: 'SSO', color: '#616161', order: 4 },
  { slug: 'my-autogrill', title: 'My Autogrill', color: '#C62828', order: 5 },
  { slug: 'progressive-web-app', title: 'PWA', color: '#1a1a1a', order: 6 },
  { slug: 'audio-digest', title: 'Audio Digest', color: '#4D0FB1', order: 7 },
];

const MONTH_NAMES: Record<string, { full: string; num: string }> = {
  jan: { full: 'January', num: '01' },
  feb: { full: 'February', num: '02' },
  mar: { full: 'March', num: '03' },
  apr: { full: 'April', num: '04' },
  may: { full: 'May', num: '05' },
  jun: { full: 'June', num: '06' },
  jul: { full: 'July', num: '07' },
  aug: { full: 'August', num: '08' },
  sep: { full: 'September', num: '09' },
  oct: { full: 'October', num: '10' },
  nov: { full: 'November', num: '11' },
  dec: { full: 'December', num: '12' },
};

function main() {
  const slug = process.argv[2];

  if (!slug) {
    console.error('Usage: npx tsx scripts/new-edition.ts <slug>');
    console.error('Example: npx tsx scripts/new-edition.ts feb-2026');
    process.exit(1);
  }

  // Parse slug (e.g., "feb-2026")
  const [monthKey, year] = slug.split('-');
  const monthInfo = MONTH_NAMES[monthKey];

  if (!monthInfo || !year) {
    console.error(`Invalid slug: "${slug}". Expected format: mmm-yyyy (e.g., feb-2026)`);
    process.exit(1);
  }

  const projectRoot = join(import.meta.dirname || __dirname, '..');
  const editionDir = join(projectRoot, 'content', 'editions', slug);

  if (existsSync(editionDir)) {
    console.error(`Edition "${slug}" already exists at ${editionDir}`);
    process.exit(1);
  }

  console.log(`\n📚 Creating edition: ${monthInfo.full} ${year}\n`);

  // Create edition directory and edition.json
  mkdirSync(editionDir, { recursive: true });
  writeFileSync(
    join(editionDir, 'edition.json'),
    JSON.stringify(
      {
        title: `${monthInfo.full} ${year} Edition`,
        date: `${year}-${monthInfo.num}-01`,
        intro: `Welcome to the ${monthInfo.full} ${year} edition of the Avolta Digital Book. Here you'll find the latest digital features and updates across all work streams.`,
      },
      null,
      2
    ) + '\n'
  );
  console.log(`  ✅ edition.json`);

  // Create section directories
  for (const section of SECTIONS) {
    const sectionDir = join(editionDir, section.slug);
    const featuresDir = join(sectionDir, 'features');
    mkdirSync(featuresDir, { recursive: true });

    writeFileSync(
      join(sectionDir, 'section.json'),
      JSON.stringify(
        {
          title: section.title,
          summary: '',
          color: section.color,
          order: section.order,
        },
        null,
        2
      ) + '\n'
    );
    console.log(`  ✅ ${section.slug}/section.json + features/`);
  }

  // Create public directories for assets
  const imagesDir = join(projectRoot, 'public', 'images', slug);
  const audioDir = join(projectRoot, 'public', 'audio', slug);
  mkdirSync(imagesDir, { recursive: true });
  mkdirSync(audioDir, { recursive: true });
  console.log(`  ✅ public/images/${slug}/`);
  console.log(`  ✅ public/audio/${slug}/`);

  console.log(`\n🎉 Edition "${slug}" scaffolded successfully!`);
  console.log(`\nNext steps:`);
  console.log(`  1. Add feature JSON files to content/editions/${slug}/<section>/features/`);
  console.log(`  2. Add images to public/images/${slug}/`);
  console.log(`  3. Run: npx tsx scripts/validate-content.ts`);
  console.log(`  4. Run: npm run build`);
  console.log(`  5. Push to deploy!\n`);
}

main();
