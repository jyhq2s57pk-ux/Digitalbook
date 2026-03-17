'use client';

import { useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';

interface FeatureViewTrackerProps {
  children: React.ReactNode;
  edition: string;
  section: string;
  feature: string;
  title: string;
}

// Track which features have already been reported this page session
const viewedFeatures = new Set<string>();

export default function FeatureViewTracker({
  children,
  edition,
  section,
  feature,
  title,
}: FeatureViewTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const key = `${edition}/${section}/${feature}`;
    if (viewedFeatures.has(key)) return;

    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dwellTimer = setTimeout(() => {
            if (!viewedFeatures.has(key)) {
              viewedFeatures.add(key);
              track('feature_viewed', { edition, section, feature, title });
            }
          }, 1000);
        } else if (dwellTimer) {
          clearTimeout(dwellTimer);
          dwellTimer = null;
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [edition, section, feature, title]);

  return <div ref={ref}>{children}</div>;
}
