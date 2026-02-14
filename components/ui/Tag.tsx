interface TagProps {
  label: string;
  variant?: 'light' | 'dark';
}

export default function Tag({ label, variant = 'light' }: TagProps) {
  const isLight = variant === 'light';

  return (
    <span
      className="inline-flex items-center justify-center h-[25px] rounded-[34px] px-3 text-[14px] leading-[20px] whitespace-nowrap font-medium"
      style={{
        backgroundColor: isLight ? 'var(--color-sun-bg)' : 'var(--color-tag-dark)',
        color: isLight ? 'var(--color-night)' : 'var(--color-sun-light)',
      }}
    >
      {label}
    </span>
  );
}
