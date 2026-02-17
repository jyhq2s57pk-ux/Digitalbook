'use client';

import { useState, useCallback } from 'react';
import type { Feature } from '@/lib/types';
import { useHeader } from '@/contexts/HeaderContext';

interface ContentsPanelProps {
  sectionTitle: string;
  sectionSlug: string;
  features: Feature[];
  activeFeatureSlug?: string | null;
  hasAdditionalItems?: boolean;
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

// Gap from top of viewport (or below header) = 28px
const TOP_GAP = 28;

export default function ContentsPanel({
  sectionTitle,
  sectionSlug,
  features,
  hasAdditionalItems,
}: ContentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showTwoColumns = features.length > 8;
  const colors = sectionColors[sectionSlug] || { outer: '#e0e0e0', inner: '#666666' };
  const { isHeaderVisible, headerHeight } = useHeader();

  // Calculate top position: 28px gap from viewport top when header hidden,
  // or headerHeight + 28px when header is visible
  const topPosition = isHeaderVisible ? headerHeight + TOP_GAP : TOP_GAP;

  const scrollToFeature = useCallback((slug: string) => {
    setIsExpanded(false);
    // Wait for panel to collapse, then scroll to 20px below the submenu bar
    setTimeout(() => {
      const element = document.getElementById(slug);
      const panel = document.getElementById('contents-panel');
      if (element && panel) {
        const panelBottom = panel.getBoundingClientRect().bottom;
        const elementTop = element.getBoundingClientRect().top;
        const scrollBy = elementTop - panelBottom - 20; // 20px gap below visible bar
        window.scrollBy({
          top: scrollBy,
          behavior: 'smooth',
        });
      }
    }, 300);
  }, []);

  return (
    <div
      className="w-full max-w-[1100px] mx-auto sticky z-30 transition-[top] duration-300 ease-out"
      style={{ top: `${topPosition}px` }}
    >
      {/* Panel container - relative for dropdown positioning */}
      <div className="relative">
        {/* Header bar - always visible, 59px height, dark theme with blur (matching main nav) */}
        <button
          id="contents-panel"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-[59px] flex items-center justify-between px-[10px] py-[10px] text-left rounded-[16px] bg-[#F5F3ED]"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Section color indicator - solid color pill (14x39px) */}
            <div
              className="w-[14px] h-[39px] rounded-full shrink-0"
              style={{
                backgroundColor: colors.inner,
              }}
            />
            <span className="text-[15px] md:text-[16px] font-medium text-night">
              {sectionTitle}
            </span>
          </div>

          {/* Up/Down arrow - dark */}
          <div className="w-8 h-8 flex items-center justify-center text-night/50 hover:text-night transition-colors">
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
          className="absolute top-full left-0 right-0 mt-2 bg-day rounded-[16px] overflow-hidden transition-all duration-300 ease-out"
          style={{
            boxShadow: isExpanded
              ? '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)'
              : 'none',
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
                  className="text-left text-[14px] md:text-[15px] leading-[22px] text-night-20 hover:text-night transition-colors py-1.5"
                >
                  {feature.title}
                </button>
              ))}
              {hasAdditionalItems && (
                <button
                  onClick={() => scrollToFeature('additional-items')}
                  className="text-left text-[14px] md:text-[15px] leading-[22px] text-night-20 hover:text-night transition-colors py-1.5"
                >
                  Additional Items
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
