import fs from 'fs';
import path from 'path';
import type { Edition, Section, Feature, AudioDigestContent } from './types';
import { SECTIONS, parseEditionSlug } from './constants';

const CONTENT_DIR = path.join(process.cwd(), 'content/editions');

// Get all edition slugs, sorted newest first
export function getEditions(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name)
    .sort((a, b) => parseEditionSlug(b).getTime() - parseEditionSlug(a).getTime());
}

// Get the latest edition slug
export function getLatestEdition(): string {
  const editions = getEditions();
  return editions[0] || 'jan-2026';
}

// Load a full edition with all sections and features
export function getEdition(slug: string): Edition | null {
  const editionDir = path.join(CONTENT_DIR, slug);
  const editionFile = path.join(editionDir, 'edition.json');

  if (!fs.existsSync(editionFile)) return null;

  const editionData = JSON.parse(fs.readFileSync(editionFile, 'utf-8'));

  const sections: Section[] = SECTIONS.flatMap((sectionConfig) => {
    const sectionDir = path.join(editionDir, sectionConfig.slug);
    const sectionFile = path.join(sectionDir, 'section.json');

    // Skip sections that don't exist in this edition (e.g., PWA is apr-2026+)
    if (!fs.existsSync(sectionFile)) {
      return [];
    }

    const sectionData = JSON.parse(fs.readFileSync(sectionFile, 'utf-8'));
    const features = loadFeatures(sectionDir);

    return [{
      slug: sectionConfig.slug,
      title: sectionData.title || sectionConfig.title,
      navLabel: sectionData.navLabel,
      summary: sectionData.summary || '',
      color: sectionData.color || sectionConfig.color,
      order: sectionData.order ?? sectionConfig.order,
      features,
      additionalItemsCsv: sectionData.additionalItemsCsv,
      nutshell: sectionData.nutshell,
      nutshellFooter: sectionData.nutshellFooter,
    }];
  }).sort((a, b) => a.order - b.order);

  return {
    slug,
    title: editionData.title,
    date: editionData.date,
    intro: editionData.intro,
    sections,
  };
}

// Load a single section with its features
export function getSection(editionSlug: string, sectionSlug: string): Section | null {
  const edition = getEdition(editionSlug);
  if (!edition) return null;

  return edition.sections.find((s) => s.slug === sectionSlug) || null;
}

// Load features from a section directory
function loadFeatures(sectionDir: string): Feature[] {
  const featuresDir = path.join(sectionDir, 'features');

  if (!fs.existsSync(featuresDir)) return [];

  return fs
    .readdirSync(featuresDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(featuresDir, f), 'utf-8'));
      const slug = data.slug || f.replace('.json', '');
      return {
        slug,
        title: data.title || slug,
        status: data.status || 'go-live',
        releaseDate: data.releaseDate,
        goal: data.goal || '',
        description: data.description || '',
        tags: data.tags || [],
        regions: data.regions || [],
        platforms: data.platforms || [],
        images: data.images || [],
        imageFit: data.imageFit,
        owner: data.owner,
        jiraLink: data.jiraLink,
        docsLink: data.docsLink,
        audioSources: data.audioSources,
      } satisfies Feature;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

// Static params generators for Next.js
export function getAllEditionParams() {
  return getEditions().map((edition) => ({ edition }));
}

export function getAllSectionParams() {
  const editions = getEditions();
  const params: { edition: string; section: string }[] = [];

  for (const edition of editions) {
    for (const section of SECTIONS) {
      params.push({ edition, section: section.slug });
    }
  }

  return params;
}

// Load audio digest content for an edition
export function getAudioDigestContent(editionSlug: string): AudioDigestContent {
  const audioDigestDir = path.join(CONTENT_DIR, editionSlug, 'audio-digest');
  const audioDigestFile = path.join(audioDigestDir, 'audio-digest.json');

  if (!fs.existsSync(audioDigestFile)) {
    // Return default empty structure
    return {
      podcasts: [],
    };
  }

  const data = JSON.parse(fs.readFileSync(audioDigestFile, 'utf-8'));

  return {
    podcasts: data.podcasts || [],
  };
}
