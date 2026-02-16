import { getEdition, getAllEditionParams, getAudioDigestContent } from '@/lib/content';
import { formatEditionDate } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AudioPlayerCard from '@/components/audio/AudioPlayerCard';

interface AudioDigestPageProps {
  params: Promise<{ edition: string }>;
}

export async function generateStaticParams() {
  return getAllEditionParams();
}

export async function generateMetadata({ params }: AudioDigestPageProps): Promise<Metadata> {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);
  if (!edition) return {};
  return {
    title: `Audio Digest - ${edition.title}`,
    description: `Listen to the audio digest for ${edition.title} edition in multiple languages.`,
  };
}

export default async function AudioDigestPage({ params }: AudioDigestPageProps) {
  const { edition: editionSlug } = await params;
  const edition = getEdition(editionSlug);
  const audioContent = getAudioDigestContent(editionSlug);

  if (!edition) {
    notFound();
  }

  const formattedDate = formatEditionDate(editionSlug);

  return (
    <div className="min-h-screen flex flex-col bg-[#252525]">
      {/* Main Content */}
      <main className="flex-1">
        {/* Title Section - Sand background */}
        <div
          className="flex flex-col items-center pt-[80px] md:pt-[100px] px-6 pb-14 md:pb-16"
          style={{ backgroundColor: 'var(--color-sand)' }}
        >
          {/* AudioDigest Logo and Date */}
          <div className="flex flex-col items-center gap-5 mb-14 md:mb-[72px]">
            <img
              src="/audiodigestlogo.svg"
              alt="AudioDigest"
              className="h-[38px] md:h-[45px] w-auto"
            />
            <p
              className="text-[14px] md:text-[16px] leading-[22px] text-center"
              style={{ color: 'var(--color-night)' }}
            >
              {formattedDate}
            </p>
          </div>

          {/* Purple Container with Cards */}
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-[950px] rounded-[32px] md:rounded-[52px] p-6 md:p-8 flex flex-col gap-4 md:gap-8"
              style={{ backgroundColor: '#8F53F0' }}
            >
              {/* 2-column grid on desktop, 1 column on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[15px]">
                {audioContent.podcasts.map((podcast, index) => (
                  <AudioPlayerCard
                    key={index}
                    language={podcast.language}
                    languageRegion={podcast.region}
                    audioSrc={podcast.audioSrc}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
