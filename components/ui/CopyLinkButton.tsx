'use client';

import { useState, useCallback } from 'react';

interface CopyLinkButtonProps {
  /** The anchor hash to append to the current URL, e.g. "marketing-preferences" */
  featureSlug: string;
  variant?: 'light' | 'dark';
}

export default function CopyLinkButton({ featureSlug, variant = 'light' }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${featureSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [featureSlug]);

  const iconColor = variant === 'light' ? '#252525' : '#FFFFFF';

  return (
    <button
      onClick={handleCopy}
      className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      title={copied ? 'Link copied!' : 'Copy link to feature'}
      aria-label={copied ? 'Link copied!' : 'Copy link to feature'}
    >
      {copied ? (
        /* Checkmark icon */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        /* Link icon — matches Figma Vector node */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )}
    </button>
  );
}
