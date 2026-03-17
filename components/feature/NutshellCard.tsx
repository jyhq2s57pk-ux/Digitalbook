import type { NutshellBlock } from '@/lib/types';
import CopyLinkButton from '@/components/ui/CopyLinkButton';

interface NutshellCardProps {
  sectionTitle: string;
  blocks: NutshellBlock[];
  footer?: string;
  editionSlug: string;
  sectionSlug: string;
}

export default function NutshellCard({
  sectionTitle,
  blocks,
  footer,
  editionSlug,
  sectionSlug,
}: NutshellCardProps) {
  return (
    <article
      id="in-a-nutshell"
      className="relative overflow-hidden scroll-mt-[167px] rounded-[32px] md:rounded-[42px] p-6 md:p-8"
      style={{ backgroundColor: 'var(--color-day)' }}
    >
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 pr-10">
        {/* Left column: Section title + "In a nutshell" */}
        <div className="flex flex-col items-start gap-2 lg:min-w-[280px] lg:max-w-[320px] shrink-0">
          <h2
            className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px] tracking-[-0.5px] font-medium"
            style={{ color: 'var(--color-night)' }}
          >
            {sectionTitle}
          </h2>
          <span
            className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px] tracking-[-0.5px]"
            style={{ color: 'var(--color-night)', fontWeight: 300 }}
          >
            In a nutshell
          </span>
        </div>

        {/* Right column: Content blocks */}
        <div className="flex flex-col gap-5 flex-1 max-w-[650px]">
          {blocks.map((block, i) => (
            <div key={i}>
              <h3
                className="text-[16px] leading-[24px] md:text-[18px] md:leading-[26px] font-semibold mb-2"
                style={{ color: 'var(--color-night)' }}
              >
                {block.heading}
              </h3>
              <ul className="flex flex-col gap-1.5 pl-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-[14px] leading-[22px] md:text-[15px] md:leading-[24px]"
                    style={{ color: 'var(--color-night-20)' }}
                  >
                    <span className="shrink-0 mt-[2px]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {footer && (
            <div className="mt-2">
              {footer.split('\n').map((line, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-[22px] md:text-[15px] md:leading-[24px] font-semibold"
                  style={{ color: 'var(--color-night)' }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Copy link button — positioned top right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <CopyLinkButton featureSlug="in-a-nutshell" editionSlug={editionSlug} sectionSlug={sectionSlug} />
      </div>
    </article>
  );
}
