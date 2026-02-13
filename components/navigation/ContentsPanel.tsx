'use client';

import { useState } from 'react';
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
  activeFeatureSlug,
}: ContentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="rounded-[var(--radius-panel)] p-3 w-full"
      style={{ backgroundColor: 'var(--color-panel-dark)' }}
    >
      <div className="flex flex-col gap-3.5 pb-2">
        {/* Header: Section badge + collapse toggle */}
        <div className="flex items-center justify-between">
          <div
            className="rounded-[var(--radius-button)] px-3 py-[10px] h-[39px] flex items-center"
            style={{ backgroundColor: sectionColor }}
          >
            <span className="text-body-sm text-white whitespace-nowrap">
              {sectionTitle}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-[39px] h-[39px] flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse contents' : 'Expand contents'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Contents list */}
        {isExpanded && (
          <div className="flex flex-col gap-12 p-2">
            <div className="flex flex-col gap-5">
              <h3 className="text-white font-semibold text-body">
                Contents
              </h3>
              <nav className="flex flex-col gap-5">
                {features.map((feature) => {
                  const isActive = activeFeatureSlug === feature.slug;
                  return (
                    <a
                      key={feature.slug}
                      href={`#${feature.slug}`}
                      className={`text-body transition-colors duration-150 ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-[#E7E7E7] hover:text-white'
                      }`}
                    >
                      {feature.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
