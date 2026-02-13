import Link from 'next/link';
import type { Edition } from '@/lib/types';

interface FooterProps {
  edition: Edition;
}

export default function Footer({ edition }: FooterProps) {
  return (
    <footer className="bg-night rounded-t-[32px] px-8 md:px-16 py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10">
        {/* Digital Book title */}
        <h2
          className="text-white text-center font-semibold"
          style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.5px' }}
        >
          Digital<br />Book
        </h2>

        {/* Avolta branding */}
        <div className="text-center">
          <p className="text-white text-h4 font-semibold tracking-wide mb-1">
            {')))'} Avolta
          </p>
          <p className="text-night-60 text-body-sm">{edition.title}</p>
        </div>

        {/* Section links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4">
          {edition.sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${edition.slug}/${section.slug}`}
              className="text-body-xs text-night-60 hover:text-white transition-colors"
            >
              {section.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
