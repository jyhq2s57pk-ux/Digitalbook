import Link from 'next/link';

interface SectionNavCardProps {
  title: string;
  sectionSlug: string;
  href: string;
  isAudioDigest?: boolean;
}

// Color mapping from Figma - outer (LIGHTER) and inner (DARKER/saturated) colors
const sectionColors: Record<string, { outer: string; inner: string }> = {
  'website-rc': { outer: '#f4b98c', inner: '#dc6b14' },
  'club-avolta-app': { outer: '#bb97f6', inner: '#8f53f0' },
  'oms': { outer: '#5ae0c9', inner: '#198674' },
  'sso': { outer: '#cccccc', inner: '#777777' },
  'my-autogrill': { outer: '#eb707c', inner: '#d61f31' },
  'audio-digest': { outer: 'rgba(94,45,157,0.44)', inner: '#8a38f5' },
};

// Arrow SVG component
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 13L13 5M13 5H6M13 5V12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SectionNavCard({
  title,
  sectionSlug,
  href,
  isAudioDigest = false,
}: SectionNavCardProps) {
  const colors = sectionColors[sectionSlug] || { outer: '#353535', inner: '#585858' };

  // AudioDigest has special treatment with gradient
  if (isAudioDigest) {
    return (
      <Link
        href={href}
        className="group relative flex items-end justify-between rounded-[20px] md:rounded-[30px] p-4 md:pl-4 md:pr-5 md:py-4 h-[159px] md:h-[208px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: colors.outer }}
      >
        {/* Inner card with gradient */}
        <div
          className="flex-1 max-w-[200px] h-full flex flex-col items-center justify-center rounded-[16px] md:rounded-[24px] px-2.5 pt-[13px] pb-2.5 md:pt-[19px] md:pb-2.5 md:px-2.5"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(217deg, rgba(0, 0, 0, 0) 24%, rgba(0, 0, 0, 0.2) 83%), linear-gradient(90deg, #8a38f5 0%, #8a38f5 100%)',
          }}
        >
          {/* AudioDigest logo lockup */}
          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            <div className="flex items-center gap-1">
              <span className="text-white text-[13px] md:text-[16px] font-medium">((()))</span>
              <span className="text-white text-[13px] md:text-[16px] font-semibold tracking-wide">AudioDigest</span>
            </div>
            <span className="text-white text-[13px] text-center">Play now</span>
          </div>
        </div>

        {/* Arrow icon */}
        <div className="shrink-0 ml-2 mb-0.5">
          <ArrowIcon className="w-[13px] h-[13px] md:w-[18px] md:h-[18px] opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex items-end justify-between rounded-[20px] md:rounded-[30px] p-4 md:pl-4 md:pr-5 md:py-4 h-[159px] md:h-[211px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: colors.outer }}
    >
      {/* Inner card */}
      <div
        className="flex-1 max-w-[200px] h-full flex flex-col justify-end overflow-hidden rounded-[16px] md:rounded-[24px] py-4 md:pt-5 md:pb-6"
        style={{ backgroundColor: colors.inner }}
      >
        <div className="px-4 md:px-5">
          <span className="block text-white text-[16px] md:text-[21px] font-medium leading-[1.33] md:leading-[1.2] md:tracking-[-0.1px]">
            {title}
          </span>
        </div>
      </div>

      {/* Arrow icon */}
      <div className="shrink-0 ml-2 mb-0.5">
        <ArrowIcon className="w-[13px] h-[13px] md:w-[18px] md:h-[18px] opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
