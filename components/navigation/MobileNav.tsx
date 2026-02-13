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

export default function MobileNav({
  isOpen,
  onClose,
  sections,
  editionSlug,
  currentSectionSlug,
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        className="absolute inset-y-0 right-0 w-full max-w-[320px] bg-night p-8 flex flex-col"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="self-end w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors mb-8"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Section links */}
        <div className="flex flex-col gap-1">
          {sections.map((section) => {
            const isActive = currentSectionSlug === section.slug;
            return (
              <Link
                key={section.slug}
                href={`/${editionSlug}/${section.slug}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-button)] transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: section.color }}
                />
                <span className="text-body">{section.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Home link at bottom */}
        <div className="mt-auto pt-8 border-t border-white/10">
          <Link
            href={`/${editionSlug}`}
            onClick={onClose}
            className="text-body-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to overview
          </Link>
        </div>
      </nav>
    </div>
  );
}
