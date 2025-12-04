'use client';

import { ReactNode } from 'react';
import { MusicProvider } from '@/contexts/MusicContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MusicProvider>
      {children}
    </MusicProvider>
  );
}
