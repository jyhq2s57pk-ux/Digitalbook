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

  if (!edition) {
    notFound();
  }

  const audioContent = getAudioDigestContent(editionSlug);
  const formattedDate = formatEditionDate(editionSlug);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(128deg, #3B3B3B 13%, #252525 78%)',
      }}
    >
      {/* Main Content */}
      <main className="flex-1">
        {/* Title Section */}
        <div
          className="flex flex-col items-center justify-center pt-[80px] md:pt-[100px] px-6"
          style={{ backgroundColor: 'var(--color-sand)' }}
        >
          <div className="flex flex-col items-center gap-5 pb-14 md:pb-16">
            {/* AudioDigest Logo */}
            <div className="flex items-center gap-2">
              <AudioDigestLogoLarge />
            </div>

            {/* Edition Date */}
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
              className="w-full max-w-[705px] rounded-t-[32px] md:rounded-t-[52px] p-6 md:p-8 flex flex-col gap-6 md:gap-8"
              style={{ backgroundColor: '#8F53F0' }}
            >
              {audioContent.podcasts.length > 0 ? (
                audioContent.podcasts.map((podcast, index) => (
                  <AudioPlayerCard
                    key={podcast.language}
                    language={podcast.language}
                    languageFlag={podcast.flag}
                    editionDate={formattedDate}
                    audioSrc={podcast.audioSrc}
                    variant="dark"
                  />
                ))
              ) : (
                // Default placeholder cards if no audio content exists
                <>
                  <AudioPlayerCard
                    language="English"
                    languageFlag="🇬🇧"
                    editionDate={formattedDate}
                    audioSrc="/audio/placeholder.mp3"
                    variant="dark"
                  />
                  <AudioPlayerCard
                    language="Italian"
                    languageFlag="🇮🇹"
                    editionDate={formattedDate}
                    audioSrc="/audio/placeholder.mp3"
                    variant="dark"
                  />
                  <AudioPlayerCard
                    language="Spanish"
                    languageFlag="🇪🇸"
                    editionDate={formattedDate}
                    audioSrc="/audio/placeholder.mp3"
                    variant="dark"
                  />
                  <AudioPlayerCard
                    language="French"
                    languageFlag="🇫🇷"
                    editionDate={formattedDate}
                    audioSrc="/audio/placeholder.mp3"
                    variant="dark"
                  />
                  <AudioPlayerCard
                    language="German"
                    languageFlag="🇩🇪"
                    editionDate={formattedDate}
                    audioSrc="/audio/placeholder.mp3"
                    variant="dark"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AudioDigestLogoLarge() {
  return (
    <img
      src="/audiodigestlogo.svg"
      alt="AudioDigest"
      className="h-[38px] md:h-[48px] w-auto"
    />
  );
}
