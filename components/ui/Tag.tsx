interface TagProps {
  label: string;
  variant?: 'light' | 'dark';
}

export default function Tag({ label, variant = 'light' }: TagProps) {
  const isLight = variant === 'light';

  return (
    <span
      className="inline-flex items-center justify-center h-[25px] rounded-full px-3 py-2 text-body-xs whitespace-nowrap"
      style={{
        backgroundColor: isLight ? 'var(--color-sun-bg)' : 'var(--color-tag-dark)',
        color: isLight ? 'var(--color-night)' : 'var(--color-sun-light)',
        fontWeight: isLight ? 400 : 500,
      }}
    >
      {label}
    </span>
  );
}
