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
  const imageBg = isLight
    ? 'linear-gradient(90deg, rgba(211,211,211,0.2) 0%, rgba(211,211,211,0.2) 100%), linear-gradient(90deg, #F5F3ED 0%, #F5F3ED 100%)'
    : undefined;
  const imageBgColor = isLight ? undefined : '#454545';

  return (
    <article
      id={feature.slug}
      className="relative overflow-hidden scroll-mt-[80px] card-radius card-padding"
      style={{ backgroundColor: bg }}
    >
      <div className="flex flex-col gap-6 md:gap-10">
        {/* Top section: status pill + title + content */}
        <div
          className="flex flex-col lg:flex-row flex-wrap gap-4 md:gap-6 lg:gap-8 pr-10"
          style={{ maxWidth: 1400 }}
        >
          {/* Left column: Status + Title */}
          <div className="flex flex-col gap-6 md:gap-7 lg:flex-1 lg:max-w-[448px] lg:min-w-[350px]">
            <StatusPill
              status={feature.status}
              releaseDate={feature.releaseDate}
              variant={variant}
            />
            <h2
              className="text-h3 md:text-h1"
              style={{ color: titleColor }}
            >
              {feature.title}
            </h2>
          </div>

          {/* Right column: Goal + Description + Tags */}
          <div className="flex flex-col gap-3 md:gap-5 lg:flex-1 lg:max-w-[600px] lg:min-w-[323px]">
            {/* Goal */}
            <div>
              <h3
                className="text-h4 md:text-[20px] md:leading-[28px] mb-0.5"
                style={{ color: headingColor }}
              >
                Goal{' '}
              </h3>
              <p
                className="text-body-xs md:text-body-sm"
                style={{ color: bodyColor }}
              >
                {feature.goal}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3
                className="text-h4 md:text-[20px] md:leading-[28px] mb-0.5"
                style={{ color: headingColor }}
              >
                Description
              </h3>
              <p
                className="text-body-xs md:text-body-sm"
                style={{ color: bodyColor }}
              >
                {feature.description}
              </p>
            </div>

            {/* Platform + Region tags */}
            <div className="flex flex-col gap-0.5">
              {feature.platforms.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap py-1">
                  <span
                    className="text-body-xs shrink-0"
                    style={{ color: labelColor, letterSpacing: isLight ? '0.25px' : undefined }}
                  >
                    Available on
                  </span>
                  <div className="flex items-center gap-1 py-2">
                    {feature.platforms.map((p) => (
                      <Tag key={p} label={p} variant={variant} />
                    ))}
                  </div>
                </div>
              )}
              {feature.regions.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap py-1">
                  <span
                    className="text-body-xs shrink-0"
                    style={{ color: labelColor, letterSpacing: isLight ? '0.25px' : undefined }}
                  >
                    Available regions
                  </span>
                  <div className="flex items-center gap-1 py-2">
                    {feature.regions.map((r) => (
                      <Tag key={r} label={r} variant={variant} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image area */}
        {feature.images.length > 0 && (
          <div
            className="flex items-center justify-center rounded-[var(--radius-image)] py-2 md:py-4 px-4 md:px-14 min-h-[200px] md:min-h-[400px]"
            style={{
              background: imageBg,
              backgroundColor: imageBgColor,
            }}
          >
            <div className="relative w-full max-w-[1208px] aspect-[1196/802] md:aspect-[811/568]">
              <div className="absolute inset-0 flex items-center justify-center text-body-sm" style={{ color: labelColor }}>
                <FeatureImage
                  src={feature.images[0]}
                  alt={`${feature.title} feature screenshot`}
                  labelColor={labelColor}
                />
              </div>
            </div>
          </div>
        )}

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
