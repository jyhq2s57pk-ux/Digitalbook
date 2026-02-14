'use client';

import { useState, useCallback } from 'react';
import type { Feature } from '@/lib/types';

interface ContentsPanelProps {
  sectionTitle: string;
  sectionColor: string;
  features: Feature[];
  activeFeatureSlug?: string | null;
}

export default function ContentsPanel({
  sectionTitle,
  sectionColor,
  features,
}: ContentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showTwoColumns = features.length > 8;

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
      {/* Panel container */}
      <div
        className="bg-white rounded-[16px] overflow-hidden transition-all duration-300 ease-out"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        {/* Header bar - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 text-left"
        >
          <div className="flex items-center gap-3">
            {/* Section color indicator */}
            <div
              className="w-1 h-5 rounded-full"
              style={{ backgroundColor: sectionColor }}
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

        {/* Expandable content */}
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isExpanded ? '500px' : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-[#f0f0f0]">
            <nav
              className={`pt-4 flex flex-col gap-2.5 ${
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
