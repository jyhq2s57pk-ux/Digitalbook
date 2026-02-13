import Link from 'next/link';

interface SectionNavCardProps {
  title: string;
  color: string;
  href: string;
  featureCount?: number;
}

export default function SectionNavCard({
  title,
  color,
  href,
  featureCount,
}: SectionNavCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[20px] aspect-[4/3] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: color }}
    >
      {/* Section title */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <span className="text-white text-body font-medium leading-tight">
          {title}
        </span>
        {featureCount !== undefined && featureCount > 0 && (
          <span className="text-white/60 text-body-xs mt-1">
            {featureCount} feature{featureCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Arrow icon — top-right diagonal */}
      <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </Link>
  );
}
