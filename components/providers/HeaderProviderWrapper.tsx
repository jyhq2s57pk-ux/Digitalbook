'use client';

import { HeaderProvider } from '@/contexts/HeaderContext';
import type { ReactNode } from 'react';

interface HeaderProviderWrapperProps {
  children: ReactNode;
}

export default function HeaderProviderWrapper({ children }: HeaderProviderWrapperProps) {
  return <HeaderProvider>{children}</HeaderProvider>;
}
