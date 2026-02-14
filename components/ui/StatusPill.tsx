import type { FeatureStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface StatusPillProps {
  status: FeatureStatus;
  releaseDate?: string;
  variant?: 'light' | 'dark';
}

export default function StatusPill({ status, releaseDate, variant = 'light' }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  const label = releaseDate ? `${config.label} ${releaseDate}` : config.label;

  const isLight = variant === 'light';

  return (
    <div
      className="inline-flex items-center gap-[9px] rounded-full px-3 py-[10px] h-[34px] w-fit"
      style={{
        backgroundColor: isLight ? config.bgColor : 'var(--color-tag-dark)',
        borderColor: config.dotColor,
      }}
    >
      <span
        className="w-[14px] h-[14px] rounded-full shrink-0"
        style={{ backgroundColor: config.dotColor }}
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
