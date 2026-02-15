interface TagProps {
  label: string;
  variant?: 'light' | 'dark';
  sectionSlug?: string;
}

// Section color configurations for badges
// Light: subtle background tint, dark text
// Dark: dark background, colored text
const sectionBadgeColors: Record<string, { lightBg: string; darkText: string }> = {
  'website-rc': { lightBg: '#FFE9D8', darkText: '#ED8A40' },
  'club-avolta-app': { lightBg: '#F3EDFD', darkText: '#8F53F0' },
  'oms': { lightBg: '#E0F2F1', darkText: '#00897B' },
  'sso': { lightBg: '#EEEEEE', darkText: '#616161' },
  'my-autogrill': { lightBg: '#FFEBEE', darkText: '#C62828' },
  'audio-digest': { lightBg: '#EDE7F6', darkText: '#4D0FB1' },
};

// Default fallback (orange/sun)
const defaultColors = { lightBg: 'var(--color-sun-bg)', darkText: 'var(--color-sun-light)' };

export default function Tag({ label, variant = 'light', sectionSlug }: TagProps) {
  const isLight = variant === 'light';
  const colors = sectionSlug ? sectionBadgeColors[sectionSlug] || defaultColors : defaultColors;

  return (
    <span
      className="inline-flex items-center justify-center h-[25px] rounded-[34px] px-3 text-[14px] leading-[20px] whitespace-nowrap font-medium"
      style={{
        backgroundColor: isLight ? colors.lightBg : 'var(--color-tag-dark)',
        color: isLight ? 'var(--color-night)' : colors.darkText,
      }}
    >
      {label}
    </span>
  );
}
