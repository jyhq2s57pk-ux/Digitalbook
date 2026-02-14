import Link from 'next/link';
import type { Edition } from '@/lib/types';
import { formatEditionDate } from '@/lib/constants';

interface FooterProps {
  edition: Edition;
}

export default function Footer({ edition }: FooterProps) {
  const formattedDate = formatEditionDate(edition.slug);

  return (
    <footer className="w-full">
      {/* Top section: Pill navigation bar */}
      <div className="bg-night px-4 md:px-14 py-6 md:py-6 flex justify-center">
        <div className="bg-sand rounded-full p-[3px] md:p-[3px] flex gap-[3px] md:gap-[3px] overflow-x-auto max-w-full">
          {edition.sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${edition.slug}/${section.slug}`}
              className="shrink-0 rounded-full min-w-[60px] px-[13px] py-[9px] text-[13px] font-medium text-night text-center leading-[18px] hover:bg-night-80/50 transition-colors whitespace-nowrap"
            >
              {section.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Main footer section */}
      <div className="bg-night px-4 md:px-14 pt-[100px] md:pt-[160px] pb-[62px]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-[72px] md:gap-4">
          {/* Left: Digital Book logo */}
          <img
            src="/db-logo-white.svg"
            alt="Digital Book"
            className="h-[60px] md:h-[80px] w-auto"
          />

          {/* Right: Avolta branding + date */}
          <div className="flex flex-col items-center md:items-end gap-[14px] md:gap-[14px]">
            {/* Avolta logo */}
            <div className="flex items-center gap-1">
              <span className="text-white text-[20px] md:text-[24px] font-semibold tracking-wide">
                ((())) Avolta
              </span>
            </div>
            {/* Edition date */}
            <span className="text-white text-[13px] font-medium leading-[18px]">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
