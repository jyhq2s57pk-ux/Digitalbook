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
          className="flex flex-col items-center pt-[80px] md:pt-[100px] px-6 pb-14 md:pb-16 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/feb-2026/audiodigestbackground.webp')` }}
        >
          {/* Purple Container — Logo left, Cards right */}
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-[1000px] rounded-[32px] md:rounded-[52px] p-6 md:p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-8"
              style={{ backgroundColor: '#8F53F0', boxShadow: '0px 8px 60px 0px rgba(0, 0, 0, 0.08)' }}
            >
              {/* Left: AudioDigest Logo and Date */}
              <div className="flex flex-col items-center gap-5 md:flex-1 md:pt-[24px]">
                <img
                  src="/audiodigestlogo-white.svg"
                  alt="AudioDigest"
                  className="h-[34px] md:h-[44px] w-auto"
                />
                <p className="text-[14px] md:text-[16px] leading-[22px] text-center text-white">
                  {formattedDate}
                </p>
              </div>

              {/* Right: Audio Player Cards stacked */}
              <div className="flex flex-col gap-[15px] w-full md:w-[518px] shrink-0">
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
