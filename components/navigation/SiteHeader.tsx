'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Section } from '@/lib/types';
import MobileNav from './MobileNav';
import { useHeader } from '@/contexts/HeaderContext';

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
  const { isHeaderVisible } = useHeader();

  return (
    <>
      {/* Global Navigation — dark, semi-transparent with blur (matching Figma) */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-[60px] lg:h-[58px] bg-[rgba(37,37,37,0.9)] backdrop-blur-[10px] transition-transform duration-300 ease-out"
        style={{
          transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="mx-auto max-w-[1150px] h-full px-5 lg:px-6">
          <div className="flex items-center justify-between h-full">
            {/* Left: Digital Book logo */}
            <Link
              href={`/${editionSlug}`}
              className="flex items-center shrink-0"
            >
              <img
                src="/db-logo-white.svg"
                alt="Digital Book"
                className="h-[32px] lg:h-[36px] w-auto"
              />
            </Link>

            {/* Center: Section pills (desktop) — white text on transparent */}
            <nav className="hidden lg:flex items-center gap-[3px] p-[3px] rounded-full">
              {sections.map((section) => {
                const isActive = currentSectionSlug === section.slug;
                return (
                  <Link
                    key={section.slug}
                    href={`/${editionSlug}/${section.slug}`}
                    className={`shrink-0 rounded-full min-w-[60px] px-[13px] py-[9px] text-[13px] font-medium text-center leading-[18px] transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {section.title}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Hamburger menu (mobile/tablet) */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:text-white/80 transition-colors"
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

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[60px] lg:h-[58px]" />

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
