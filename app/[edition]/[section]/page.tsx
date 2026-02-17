import { getEdition, getSection, getAllSectionParams } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import FeatureCard from '@/components/feature/FeatureCard';
import AdditionalItems from '@/components/feature/AdditionalItems';
import ContentsPanel from '@/components/navigation/ContentsPanel';

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-sand)' }}>
      {/* Main content area */}
      <div className="flex flex-col gap-[32px] md:gap-[51px] items-center pt-[80px] md:pt-[95px] pb-[100px] md:pb-[200px] px-4 md:px-10">
        {/* Contents Panel - collapsible */}
        <ContentsPanel
          sectionTitle={section.title}
          sectionSlug={sectionSlug}
          features={section.features}
          hasAdditionalItems={!!section.additionalItemsCsv}
        />

        {/* Feature Cards */}
        {section.features.length === 0 ? (
          <div className="w-full max-w-[1100px] bg-day rounded-[32px] md:rounded-[42px] p-8 text-center">
            <p className="text-body text-night-40">
              No features in this section yet.
            </p>
          </div>
        ) : (
          section.features.map((feature, index) => (
            <div key={feature.slug} className="w-full max-w-[1100px]">
              <FeatureCard
                feature={feature}
                editionSlug={editionSlug}
                sectionSlug={sectionSlug}
              />
            </div>
          ))
        )}

        {/* Additional Items — CSV table rendered after feature cards */}
        {section.additionalItemsCsv && (
          <div className="w-full max-w-[1100px]">
            <AdditionalItems
              csvPath={section.additionalItemsCsv}
              sectionSlug={sectionSlug}
            />
          </div>
        )}
      </div>
    </div>
  );
}
