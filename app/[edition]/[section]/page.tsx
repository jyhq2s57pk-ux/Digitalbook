import { getEdition, getSection, getAllSectionParams } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import FeatureCard from '@/components/feature/FeatureCard';
import SectionScrollWrapper from '@/components/navigation/SectionScrollWrapper';
import PrevNextNav from '@/components/navigation/PrevNextNav';

interface SectionPageProps {
  params: Promise<{ edition: string; section: string }>;
}

export async function generateStaticParams() {
  return getAllSectionParams();
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { edition: editionSlug, section: sectionSlug } = await params;
  const section = getSection(editionSlug, sectionSlug);
  if (!section) return {};
  return {
    title: section.title,
    description: section.summary,
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { edition: editionSlug, section: sectionSlug } = await params;
  const edition = getEdition(editionSlug);
  const section = getSection(editionSlug, sectionSlug);

  if (!edition || !section) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16 py-8">
      {/* Two-column layout: sidebar + feature cards */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left column: Contents Panel with scrollspy (sticky on desktop) */}
        <aside className="lg:w-[280px] xl:w-[320px] shrink-0">
          <div className="lg:sticky lg:top-[84px]">
            <SectionScrollWrapper
              sectionTitle={section.title}
              sectionColor={section.color}
              features={section.features}
            />
          </div>
        </aside>

        {/* Right column: Feature Cards */}
        <main className="flex-1 min-w-0">
          {/* Section summary */}
          {section.summary && (
            <p className="text-body text-night-20 max-w-[600px] mb-8">
              {section.summary}
            </p>
          )}

          {/* Feature Cards */}
          <div className="flex flex-col gap-6">
            {section.features.length === 0 ? (
              <div className="bg-white card-radius p-10 text-center">
                <p className="text-body text-night-40">
                  No features in this section yet.
                </p>
              </div>
            ) : (
              section.features.map((feature, index) => (
                <FeatureCard
                  key={feature.slug}
                  feature={feature}
                  variant={index % 2 === 0 ? 'light' : 'dark'}
                  editionSlug={editionSlug}
                  sectionSlug={sectionSlug}
                />
              ))
            )}
          </div>

          {/* Previous / Next section navigation */}
          <PrevNextNav
            editionSlug={editionSlug}
            sections={edition.sections}
            currentSectionSlug={sectionSlug}
          />
        </main>
      </div>
    </div>
  );
}
