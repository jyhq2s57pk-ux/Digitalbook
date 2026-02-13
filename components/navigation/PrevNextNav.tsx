import Link from 'next/link';
import type { Section } from '@/lib/types';

interface PrevNextNavProps {
  editionSlug: string;
  sections: Section[];
  currentSectionSlug: string;
}

export default function PrevNextNav({
  editionSlug,
  sections,
  currentSectionSlug,
}: PrevNextNavProps) {
  const currentIndex = sections.findIndex((s) => s.slug === currentSectionSlug);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  if (!prevSection && !nextSection) return null;

  return (
    <nav
      className="flex items-stretch gap-4 mt-8"
      aria-label="Section navigation"
    >
      {/* Previous */}
      {prevSection ? (
        <Link
          href={`/${editionSlug}/${prevSection.slug}`}
          className="flex-1 group flex items-center gap-3 bg-white rounded-[var(--radius-panel)] p-5 hover:shadow-md transition-shadow"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-night-40 group-hover:text-night transition-colors shrink-0">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <div className="min-w-0">
            <span className="text-body-xs text-night-40 block">Previous</span>
            <span className="text-body-sm font-medium text-night truncate block">
              {prevSection.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next */}
      {nextSection ? (
        <Link
          href={`/${editionSlug}/${nextSection.slug}`}
          className="flex-1 group flex items-center justify-end gap-3 bg-white rounded-[var(--radius-panel)] p-5 hover:shadow-md transition-shadow text-right"
        >
          <div className="min-w-0">
            <span className="text-body-xs text-night-40 block">Next</span>
            <span className="text-body-sm font-medium text-night truncate block">
              {nextSection.title}
            </span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-night-40 group-hover:text-night transition-colors shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
