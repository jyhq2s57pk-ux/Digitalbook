import type { SectionConfig, FeatureStatus } from './types';

// All 6 work stream sections with their brand colors
export const SECTIONS: SectionConfig[] = [
  { slug: 'website-rc', title: 'Website R&C and Emporium', color: '#ED8A40', order: 1 },
  { slug: 'club-avolta-app', title: 'Club Avolta App', color: '#8F53F0', order: 2 },
  { slug: 'oms', title: 'OMS', color: '#00897B', order: 3 },
  { slug: 'sso', title: 'SSO', color: '#616161', order: 4 },
  { slug: 'my-autogrill', title: 'My Autogrill', color: '#C62828', order: 5 },
  { slug: 'audio-digest', title: 'Audio Digest', color: '#4D0FB1', order: 6 },
];

// Status pill configuration
export const STATUS_CONFIG: Record<FeatureStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  'go-live': {
    label: 'Go-live',
    dotColor: '#ED8A40',
    bgColor: '#FDF3EC',
    textColor: '#252525',
  },
  'set-up-required': {
    label: 'Set up required',
    dotColor: '#8F53F0',
    bgColor: '#F3EDFD',
    textColor: '#252525',
  },
  'sub-region-request': {
    label: 'Sub region request',
    dotColor: '#00897B',
    bgColor: '#E0F2F1',
    textColor: '#252525',
  },
  'content-go-live-ongoing': {
    label: 'Content go-live ongoing',
    dotColor: '#1976D2',
    bgColor: '#E3F2FD',
    textColor: '#252525',
  },
  'in-development': {
    label: 'In development',
    dotColor: '#F9A825',
    bgColor: '#FFFDE7',
    textColor: '#252525',
  },
  'planned': {
    label: 'Planned',
    dotColor: '#9E9E9E',
    bgColor: '#F5F5F5',
    textColor: '#252525',
  },
};

// Month slug parsing helper
const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function parseEditionSlug(slug: string): Date {
  const [month, year] = slug.split('-');
  return new Date(parseInt(year), MONTH_MAP[month] ?? 0, 1);
}

export function formatEditionDate(slug: string): string {
  const date = parseEditionSlug(slug);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
