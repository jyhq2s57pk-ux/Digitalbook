import type { Feature } from '@/lib/types';
import StatusPill from '@/components/ui/StatusPill';
import Tag from '@/components/ui/Tag';
import CopyLinkButton from '@/components/ui/CopyLinkButton';
import FeatureImage from '@/components/feature/FeatureImage';
import AudioDigestPlayer from '@/components/feature/AudioDigestPlayer';

interface FeatureCardProps {
  feature: Feature;
  variant?: 'light' | 'dark';
  editionSlug: string;
  sectionSlug: string;
}

export default function FeatureCard({
  feature,
  variant = 'light',
  editionSlug,
  sectionSlug,
}: FeatureCardProps) {
  const isLight = variant === 'light';

  // Color tokens based on variant
  const bg = isLight ? 'var(--color-day)' : 'var(--color-card-dark)';
  const titleColor = isLight ? 'var(--color-night)' : '#FFFFFF';
  const headingColor = isLight ? 'var(--color-night)' : '#FFFFFF';
  const bodyColor = isLight ? 'var(--color-night-20)' : '#CACACA';
  const labelColor = isLight ? 'var(--color-night-20)' : '#D3D3D3';
  // Image placeholder colors from Figma
  const imageBgColor = isLight ? '#c0c0c0' : '#454545';

  return (
    <article
      id={feature.slug}
      className="relative overflow-hidden scroll-mt-[180px] md:scroll-mt-[170px] rounded-[32px] md:rounded-[42px] p-6 md:p-8"
      style={{ backgroundColor: bg }}
    >
      <div className="flex flex-col gap-6 md:gap-10">
        {/* Top section: status pill + title + content */}
        <div
          className="flex flex-col lg:flex-row flex-wrap gap-4 md:gap-6 lg:gap-8 pr-10"
          style={{ maxWidth: 1400 }}
        >
          {/* Left column: Status + Title */}
          <div className="flex flex-col items-start gap-6 md:gap-7 lg:flex-1 lg:max-w-[448px] lg:min-w-[350px]">
            <StatusPill
              status={feature.status}
              releaseDate={feature.releaseDate}
              variant={variant}
            />
            <h2
              className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px] tracking-[-0.5px]"
              style={{ color: titleColor, fontWeight: 500 }}
            >
              {feature.title}
            </h2>
          </div>

          {/* Right column: Goal + Description + Tags */}
          <div className="flex flex-col gap-3 md:gap-5 max-w-[650px] lg:flex-1 lg:min-w-[323px]">
            {/* Goal */}
            <div>
              <h3
                className="text-[17px] leading-[24px] md:text-[20px] md:leading-[28px] mb-0.5"
                style={{ color: headingColor, fontWeight: 500 }}
              >
                Goal{' '}
              </h3>
              <p
                className="text-[14px] leading-[22px] md:text-[15px] md:leading-[24px]"
                style={{ color: bodyColor }}
              >
                {feature.goal}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3
                className="text-[17px] leading-[24px] md:text-[20px] md:leading-[28px] mb-0.5"
                style={{ color: headingColor, fontWeight: 500 }}
              >
                Description
              </h3>
              <p
                className="text-[14px] leading-[22px] md:text-[15px] md:leading-[24px]"
                style={{ color: bodyColor }}
              >
                {feature.description}
              </p>
            </div>

            {/* Platform + Region tags */}
            <div className="flex flex-col gap-2">
              {feature.platforms.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[14px] leading-[20px] font-normal shrink-0"
                    style={{ color: labelColor }}
                  >
                    Available on
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {feature.platforms.map((p) => (
                      <Tag key={p} label={p} variant={variant} sectionSlug={sectionSlug} />
                    ))}
                  </div>
                </div>
              )}
              {feature.regions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[14px] leading-[20px] font-normal shrink-0"
                    style={{ color: labelColor }}
                  >
                    Available regions
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {feature.regions.map((r) => (
                      <Tag key={r} label={r} variant={variant} sectionSlug={sectionSlug} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image area — always shown, uses placeholder if no image provided */}
        <div
          className="relative w-full aspect-video rounded-[20px] md:rounded-[28px] overflow-hidden"
          style={{ backgroundColor: imageBgColor }}
        >
          <FeatureImage
            src={feature.images.length > 0 ? feature.images[0] : '/images/jan-2026/desktop.png'}
            alt={`${feature.title} feature screenshot`}
            labelColor={labelColor}
          />
        </div>

        {/* Audio Digest Player — renders when feature has audioSources */}
        {feature.audioSources && Object.keys(feature.audioSources).length > 0 && (
          <AudioDigestPlayer
            audioSources={feature.audioSources}
            variant={variant}
          />
        )}
      </div>

      {/* Copy link button — positioned top right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <CopyLinkButton featureSlug={feature.slug} variant={variant} />
      </div>
    </article>
  );
}
