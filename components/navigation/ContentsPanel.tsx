'use client';

import { useState, useCallback } from 'react';
import type { Feature } from '@/lib/types';

interface ContentsPanelProps {
  sectionTitle: string;
  sectionSlug: string;
  features: Feature[];
  activeFeatureSlug?: string | null;
}

// Color mapping from home page buttons - outer (LIGHTER) and inner (DARKER/saturated) colors
const sectionColors: Record<string, { outer: string; inner: string }> = {
  'website-rc': { outer: '#f4b98c', inner: '#dc6b14' },
  'club-avolta-app': { outer: '#bb97f6', inner: '#8f53f0' },
  'oms': { outer: '#5ae0c9', inner: '#198674' },
  'sso': { outer: '#cccccc', inner: '#777777' },
  'my-autogrill': { outer: '#eb707c', inner: '#d61f31' },
  'audio-digest': { outer: '#c4a3f7', inner: '#8a38f5' },
};

export default function ContentsPanel({
  sectionTitle,
  sectionSlug,
  features,
}: ContentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showTwoColumns = features.length > 8;
  const colors = sectionColors[sectionSlug] || { outer: '#e0e0e0', inner: '#666666' };

  const scrollToFeature = useCallback((slug: string) => {
    setIsExpanded(false);
    // Wait for panel to collapse, then scroll smoothly
    setTimeout(() => {
      const element = document.getElementById(slug);
      if (element) {
        const offset = 140; // Header + collapsed panel + gap
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth',
        });
      }
    }, 300);
  }, []);

  return (
    <div className="w-full max-w-[1100px] mx-auto sticky top-[90px] lg:top-[88px] z-30">
      {/* Panel container - relative for dropdown positioning */}
      <div className="relative">
        {/* Header bar - always visible, fixed height */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 text-left bg-white rounded-[16px]"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Section color indicator - two-tone pill */}
            <div
              className="w-1.5 h-5 rounded-full"
              style={{
                background: `linear-gradient(180deg, ${colors.outer} 0%, ${colors.inner} 100%)`,
              }}
            />
            <span className="text-[15px] md:text-[16px] font-medium text-[#252525]">
              {sectionTitle}
            </span>
          </div>

          {/* Up/Down arrow */}
          <div className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-[#252525] transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-out',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* Expandable dropdown - absolutely positioned to overlay content */}
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] overflow-hidden transition-all duration-300 ease-out"
          style={{
            boxShadow: isExpanded ? '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)' : 'none',
            opacity: isExpanded ? 1 : 0,
            visibility: isExpanded ? 'visible' : 'hidden',
            transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
          }}
        >
          <div className="px-4 md:px-5 py-4 md:py-5">
            <nav
              className={`flex flex-col gap-2.5 ${
                showTwoColumns ? 'lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-2.5' : ''
              }`}
            >
              {features.map((feature) => (
                <button
                  key={feature.slug}
                  onClick={() => scrollToFeature(feature.slug)}
                  className="text-left text-[14px] md:text-[15px] leading-[22px] text-[#525252] hover:text-[#252525] transition-colors py-1.5"
                >
                  {feature.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
