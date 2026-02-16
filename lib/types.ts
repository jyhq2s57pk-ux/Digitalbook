// Avolta Digital Book — Content Types

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
  releaseDate?: string;
  goal: string;
  description: string;
  tags: string[];
  regions: string[];
  platforms: string[];
  images: string[];
  owner?: string;
  jiraLink?: string;
  docsLink?: string;
  audioSources?: Record<string, string>; // For Audio Digest: { en: "path.mp3", fr: "path.mp3" }
}

export interface Section {
  slug: string;
  title: string;
  summary: string;
  color: string;
  order: number;
  features: Feature[];
}

export interface Edition {
  slug: string;
  title: string;
  date: string;
  intro: string;
  sections: Section[];
}

export interface SectionConfig {
  slug: string;
  title: string;
  color: string;
  order: number;
}

export interface AudioPodcast {
  language: string;
  region?: string;
  flag: string;
  audioSrc: string;
}

export interface AudioDigestContent {
  podcasts: AudioPodcast[];
}
