'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FeatureImageProps {
  src: string;
  alt: string;
  labelColor: string;
  fit?: 'contain' | 'cover';
}

export default function FeatureImage({ src, alt, labelColor, fit = 'contain' }: FeatureImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span className="text-body-sm" style={{ color: labelColor }}>
        Image: {src}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={fit === 'cover' ? 'object-cover' : 'object-contain'}
      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 1000px"
      onError={() => setHasError(true)}
    />
  );
}
