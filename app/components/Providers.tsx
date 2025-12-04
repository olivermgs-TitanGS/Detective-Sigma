'use client';

import { ReactNode } from 'react';
import { MusicProvider } from '@/contexts/MusicContext';
import { SoundEffectsProvider } from '@/contexts/SoundEffectsContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MusicProvider>
      <SoundEffectsProvider>
        {children}
      </SoundEffectsProvider>
    </MusicProvider>
  );
}
