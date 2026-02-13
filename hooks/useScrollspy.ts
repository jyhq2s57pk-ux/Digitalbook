'use client';

import { useState, useEffect } from 'react';

/**
 * Tracks which feature section is currently visible in the viewport.
 * Uses Intersection Observer to watch elements by their IDs.
 *
 * @param featureSlugs - Array of feature slugs (element IDs) to observe
 * @param options - IntersectionObserver options
 * @returns The slug of the currently active (most visible) feature
 */
export function useScrollspy(
  featureSlugs: string[],
  options?: {
    rootMargin?: string;
    threshold?: number | number[];
  }
): string | null {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (featureSlugs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          setActiveSlug(bestEntry.target.id);
        }
      },
      {
        rootMargin: options?.rootMargin ?? '-80px 0px -40% 0px',
        threshold: options?.threshold ?? [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe each feature element
    for (const slug of featureSlugs) {
      const element = document.getElementById(slug);
      if (element) {
        observer.observe(element);
      }
    }

    // Set initial active slug to first visible element
    if (!activeSlug && featureSlugs.length > 0) {
      setActiveSlug(featureSlugs[0]);
    }

    return () => observer.disconnect();
  }, [featureSlugs, options?.rootMargin, options?.threshold]);

  return activeSlug;
}
