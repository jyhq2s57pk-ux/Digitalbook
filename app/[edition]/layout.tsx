import { getEdition } from '@/lib/content';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/navigation/SiteHeader';
import Footer from '@/components/navigation/Footer';
import BackToTop from '@/components/navigation/BackToTop';

interface EditionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ edition: string }>;
}

export default async function EditionLayout({ children, params }: EditionLayoutProps) {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);

  if (!edition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-sand">
      <SiteHeader
        sections={edition.sections}
        editionSlug={editionSlug}
        editionTitle={edition.title}
      />
      <main>{children}</main>
      <Footer edition={edition} />
      <BackToTop />
    </div>
  );
}
