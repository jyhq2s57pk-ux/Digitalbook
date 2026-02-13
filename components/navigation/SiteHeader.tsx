'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Section } from '@/lib/types';
import MobileNav from './MobileNav';

interface SiteHeaderProps {
  sections: Section[];
  editionSlug: string;
  editionTitle: string;
  currentSectionSlug?: string;
}

export default function SiteHeader({
  sections,
  editionSlug,
  editionTitle,
  currentSectionSlug,
}: SiteHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-sand/90 backdrop-blur-md border-b border-night-80/30">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            {/* Left: Logo / Home link */}
            <Link
              href={`/${editionSlug}`}
              className="flex items-center gap-2 shrink-0"
            >
              <span className="text-body font-semibold text-night">
                Digital Book
              </span>
              <span className="hidden sm:inline text-body-xs text-night-40">
                {editionTitle}
              </span>
            </Link>

            {/* Center: Section pills (desktop) */}
            <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
              {sections.map((section) => {
                const isActive = currentSectionSlug === section.slug;
                return (
                  <Link
                    key={section.slug}
                    href={`/${editionSlug}/${section.slug}`}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-body-xs font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-night-40 hover:text-night hover:bg-night-80/30'
                    }`}
                    style={isActive ? { backgroundColor: section.color } : undefined}
                  >
                    {section.title}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Hamburger (mobile/tablet) */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-night hover:text-night-20 transition-colors"
              aria-label="Open navigation menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        sections={sections}
        editionSlug={editionSlug}
        currentSectionSlug={currentSectionSlug}
      />
    </>
  );
}
