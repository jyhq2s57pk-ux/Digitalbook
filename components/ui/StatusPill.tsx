import type { FeatureStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface StatusPillProps {
  status: FeatureStatus;
  releaseDate?: string;
  variant?: 'light' | 'dark';
  sectionSlug?: string;
}

// Section color configurations for status pills
const sectionPillColors: Record<string, { dotColor: string; bgColor: string }> = {
  'website-rc': { dotColor: '#ED8A40', bgColor: '#FFE9D8' },
  'club-avolta-app': { dotColor: '#8F53F0', bgColor: '#F3EDFD' },
  'oms': { dotColor: '#00897B', bgColor: '#E0F2F1' },
  'sso': { dotColor: '#616161', bgColor: '#EEEEEE' },
  'my-autogrill': { dotColor: '#C62828', bgColor: '#FFEBEE' },
  'audio-digest': { dotColor: '#4D0FB1', bgColor: '#EDE7F6' },
};

export default function StatusPill({ status, releaseDate, variant = 'light', sectionSlug }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  const label = releaseDate ? `${config.label} ${releaseDate}` : config.label;

  const isLight = variant === 'light';

  // Use section colors if provided, otherwise fall back to status config
  const colors = sectionSlug && sectionPillColors[sectionSlug]
    ? sectionPillColors[sectionSlug]
    : { dotColor: config.dotColor, bgColor: config.bgColor };

  return (
    <div
      className="inline-flex items-center gap-[9px] rounded-full px-3 py-[10px] h-[34px] w-fit"
      style={{
        backgroundColor: isLight ? colors.bgColor : 'var(--color-tag-dark)',
      }}
    >
      <span
        className="w-[14px] h-[14px] rounded-full shrink-0"
        style={{ backgroundColor: colors.dotColor }}
      />
      <span
        className="text-body-sm whitespace-nowrap"
        style={{ color: isLight ? config.textColor : '#FFFFFF' }}
      >
        {label}
      </span>
    </div>
  );
}
