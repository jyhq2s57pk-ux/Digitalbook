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
    <div className="mx-auto max-w-[1280px] px-5 md:px-10 lg:px-16">
      {/* Hero Section */}
      <header className="pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        {/* Edition badge */}
        <div className="mb-8">
          <span className="inline-block bg-night text-white text-body-xs font-medium rounded-full px-4 py-2">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-semibold text-primary mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-1px' }}
        >
          Digital<br />Book
        </h1>

        {/* Intro */}
        <p className="text-body text-night-20 max-w-[520px] mx-auto leading-relaxed">
          {edition.intro}
        </p>
      </header>

      {/* Section Navigation Cards — 2×3 grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pb-12 md:pb-16 max-w-[720px] mx-auto">
        {edition.sections.map((section) => (
          <SectionNavCard
            key={section.slug}
            title={section.title}
            color={section.color}
            href={`/${editionSlug}/${section.slug}`}
            featureCount={section.features.length}
          />
        ))}
      </section>

      {/* Bottom section nav links (pill style) */}
      <nav className="flex flex-wrap items-center justify-center gap-2.5 pb-16">
        {edition.sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${editionSlug}/${section.slug}`}
            className="text-body-xs text-night-40 border border-night-80 rounded-full px-4 py-2 hover:bg-night hover:text-white hover:border-night transition-colors"
          >
            {section.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
