'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Section } from '@/lib/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  editionSlug: string;
  currentSectionSlug?: string;
}

// Border colors for each section (from Figma)
const sectionBorderColors: Record<string, string> = {
  'website-rc': '#ed8a40',
  'club-avolta-app': '#8f53f0',
  'oms': '#30d7ba',
  'my-autogrill': '#e54c5c',
  'sso': '#6a6a6a',
  'audio-digest': '#6a6a6a',
};

export default function MobileNav({
  isOpen,
  onClose,
  sections,
  editionSlug,
}: MobileNavProps) {
  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-night rounded-b-[32px] overflow-hidden">
      {/* Top bar with logo and close button */}
      <nav className="flex items-center justify-between p-5 h-[60px] backdrop-blur-[10px]">
        <img
          src="/db-logo-white.svg"
          alt="Digital Book"
          className="h-[32px] w-auto"
        />
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-white hover:text-white/80 transition-colors"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Dropdown content */}
      <div className="px-4 pt-2 pb-[18px]">
        <div className="bg-[rgba(37,37,37,0.92)] rounded-[32px] px-4 py-2.5">
          {/* Section links as bordered cards */}
          <div className="flex flex-col gap-5 py-2">
            {sections.map((section) => {
              const borderColor = sectionBorderColors[section.slug] || '#6a6a6a';
              const isAudioDigest = section.slug === 'audio-digest';

              return (
                <Link
                  key={section.slug}
                  href={`/${editionSlug}/${section.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-[12px] border-[1.5px] transition-colors hover:bg-white/5"
                  style={{ borderColor }}
                >
                  {isAudioDigest ? (
                    <span className="text-white text-[16px] font-medium">
                      ((())) AudioDigest
                    </span>
                  ) : (
                    <span className="text-white text-[16px] leading-[24px]">
                      {section.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Avolta logo */}
          <div className="flex justify-end pt-4 pb-2">
            <img
              src="/avoltalogo-white.svg"
              alt="Avolta"
              className="h-[20px] w-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
