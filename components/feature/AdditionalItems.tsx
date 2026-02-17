import fs from 'fs';
import path from 'path';
import CopyLinkButton from '@/components/ui/CopyLinkButton';

interface AdditionalItemsProps {
  csvPath: string;
  sectionSlug: string;
}

interface CsvRow {
  jiraRef: string;
  summary: string;
  description: string;
}

function parseCsv(csvContent: string): CsvRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const rows: CsvRow[] = [];

  // Skip header row (index 0), parse data rows
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    if (row.length >= 3) {
      rows.push({
        jiraRef: row[0].trim(),
        summary: row[1].trim(),
        description: row[2].trim(),
      });
    }
  }

  return rows;
}

// Handle CSV fields with commas inside quotes
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

// Section color mapping matching the design system
const sectionColors: Record<string, { light: string; headerBg: string }> = {
  'website-rc': { light: 'rgba(237, 138, 64, 0.06)', headerBg: 'rgba(237, 138, 64, 0.10)' },
  'club-avolta-app': { light: 'rgba(143, 83, 240, 0.06)', headerBg: 'rgba(143, 83, 240, 0.10)' },
  'oms': { light: 'rgba(0, 137, 123, 0.06)', headerBg: 'rgba(0, 137, 123, 0.10)' },
  'sso': { light: 'rgba(97, 97, 97, 0.06)', headerBg: 'rgba(97, 97, 97, 0.10)' },
  'my-autogrill': { light: 'rgba(198, 40, 40, 0.06)', headerBg: 'rgba(198, 40, 40, 0.10)' },
};

export default function AdditionalItems({ csvPath, sectionSlug }: AdditionalItemsProps) {
  // Read and parse CSV at build time (server component)
  const fullPath = path.join(process.cwd(), 'public', csvPath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const csvContent = fs.readFileSync(fullPath, 'utf-8');
  const rows = parseCsv(csvContent);

  if (rows.length === 0) return null;

  const colors = sectionColors[sectionSlug] || sectionColors['website-rc'];

  return (
    <article
      id="additional-items"
      className="relative overflow-hidden scroll-mt-[167px] rounded-[32px] md:rounded-[42px] p-6 md:p-8"
      style={{ backgroundColor: 'var(--color-day)' }}
    >
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Title */}
        <h2
          className="text-[28px] leading-[34px] md:text-[32px] md:leading-[40px] tracking-[-0.5px]"
          style={{ color: 'var(--color-night)', fontWeight: 500 }}
        >
          Additional Items
        </h2>

        {/* Scrollable table with sticky header */}
        <div className="overflow-auto rounded-[16px] border border-black/[0.06]" style={{ maxHeight: '600px' }}>
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr style={{ backgroundColor: colors.headerBg, backdropFilter: 'blur(8px)' }}>
                <th className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] font-semibold whitespace-nowrap" style={{ color: 'var(--color-night)', width: '140px' }}>
                  Jira Ref
                </th>
                <th className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] font-semibold" style={{ color: 'var(--color-night)', width: '35%' }}>
                  Summary
                </th>
                <th className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] font-semibold" style={{ color: 'var(--color-night)' }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.jiraRef + index}
                  style={{
                    backgroundColor: index % 2 === 1 ? colors.light : 'var(--color-day)',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <td
                    className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] font-medium whitespace-nowrap align-top"
                    style={{ color: 'var(--color-night)' }}
                  >
                    {row.jiraRef}
                  </td>
                  <td
                    className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] align-top"
                    style={{ color: 'var(--color-night-20)' }}
                  >
                    {row.summary}
                  </td>
                  <td
                    className="px-4 md:px-5 py-3 text-[13px] md:text-[14px] leading-[20px] align-top"
                    style={{ color: 'var(--color-night-20)' }}
                  >
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy link button — positioned top right, matching FeatureCard */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <CopyLinkButton featureSlug="additional-items" />
      </div>
    </article>
  );
}
