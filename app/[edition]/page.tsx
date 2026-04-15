import { getEdition, getAllEditionParams } from '@/lib/content';
import { formatEditionDate } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import SectionNavCard from '@/components/layout/SectionNavCard';

interface EditionPageProps {
  params: Promise<{ edition: string }>;
}

export async function generateStaticParams() {
  return getAllEditionParams();
}

export async function generateMetadata({ params }: EditionPageProps): Promise<Metadata> {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);
  if (!edition) return {};
  return {
    title: `${edition.title} Edition`,
    description: edition.intro,
  };
}

export default async function EditionPage({ params }: EditionPageProps) {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);

  if (!edition) {
    notFound();
  }

  const formattedDate = formatEditionDate(editionSlug);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-7 max-w-[1050px] mx-auto px-4 pt-14 md:pt-[56px] pb-[100px] md:pb-[100px]">
      {/* Hero Section — matching Figma */}
      <header className="flex flex-col items-center gap-10 md:gap-[43px] max-w-[680px] pt-[74px] md:pt-[100px] pb-8 px-4 md:px-4 text-center">
        {/* Title — Digital Book logo */}
        <img
          src="/db-logo.svg"
          alt="Digital Book"
          className="h-[100px] md:h-[150px] w-auto"
        />

        {/* Intro text */}
        <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-night max-w-full">
          {edition.intro}
        </p>
      </header>

      {/* iPad container with shadow — matching Figma */}
      <div
        className="w-full max-w-[953px] p-5 md:p-8 rounded-[32px] md:rounded-[64px]"
        style={{ boxShadow: '0px -4px 20px 0px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Section Navigation Cards — single column mobile, 2 columns desktop.
            When both PWA and AudioDigest are present, render AudioDigest before
            PWA so AudioDigest fills the right column spanning 2 rows and PWA
            flows into the left column beneath My Autogrill. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {(() => {
            const sections = [...edition.sections];
            const pwaIdx = sections.findIndex((s) => s.slug === 'progressive-web-app');
            const adIdx = sections.findIndex((s) => s.slug === 'audio-digest');
            if (pwaIdx !== -1 && adIdx !== -1 && pwaIdx < adIdx) {
              [sections[pwaIdx], sections[adIdx]] = [sections[adIdx], sections[pwaIdx]];
            }
            const hasPwa = pwaIdx !== -1;
            return sections.map((section) => (
              <SectionNavCard
                key={section.slug}
                title={section.title}
                sectionSlug={section.slug}
                editionSlug={editionSlug}
                href={`/${editionSlug}/${section.slug}`}
                isAudioDigest={section.slug === 'audio-digest'}
                spanTwoRows={hasPwa && section.slug === 'audio-digest'}
              />
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
