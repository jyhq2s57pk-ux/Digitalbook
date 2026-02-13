'use client';

import { useScrollspy } from '@/hooks/useScrollspy';
import ContentsPanel from './ContentsPanel';
import type { Feature } from '@/lib/types';

interface SectionScrollWrapperProps {
  sectionTitle: string;
  sectionColor: string;
  features: Feature[];
}

/**
 * Client wrapper that connects ContentsPanel to the scrollspy hook.
 * This keeps the section page as a server component while providing
 * real-time scroll tracking for the sidebar.
 */
export default function SectionScrollWrapper({
  sectionTitle,
  sectionColor,
  features,
}: SectionScrollWrapperProps) {
  const featureSlugs = features.map((f) => f.slug);
  const activeFeatureSlug = useScrollspy(featureSlugs);

  return (
    <ContentsPanel
      sectionTitle={sectionTitle}
      sectionColor={sectionColor}
      features={features}
      activeFeatureSlug={activeFeatureSlug}
    />
  );
}
