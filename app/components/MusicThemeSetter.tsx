'use client';

import { useEffect } from 'react';
import { useMusic, MusicTheme } from '@/contexts/MusicContext';

interface MusicThemeSetterProps {
  theme: MusicTheme;
}

export default function MusicThemeSetter({ theme }: MusicThemeSetterProps) {
  const { setTheme } = useMusic();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
