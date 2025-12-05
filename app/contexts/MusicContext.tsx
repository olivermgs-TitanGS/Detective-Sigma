'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Define music themes for different page contexts
export type MusicTheme = 'menu' | 'cases' | 'investigation' | 'quiz' | 'results' | 'credits' | 'registration' | 'silent';

// Track playlists for each theme
const PLAYLISTS: Record<MusicTheme, string[]> = {
  menu: [
    '/music/Shadow Clues.mp3',
    '/music/Shadow Clues (1).mp3',
    '/music/Whispers in the Fog.mp3',
  ],
  cases: [
    '/music/Case_Files.mp3',
  ],
  investigation: [
    '/music/Shadow Clues (2).mp3',
    '/music/Shadow Clues (3).mp3',
    '/music/Shadows Whispered Lies.mp3',
    '/music/Shadows Whispered Lies (1).mp3',
    '/music/Shadows in the Fog.mp3',
    '/music/Shadows in the Fog (1).mp3',
  ],
  quiz: [
    '/music/Shadows in the Fog (2).mp3',
    '/music/Shadows in the Fog (3).mp3',
    '/music/Whispers in the Fog (1).mp3',
  ],
  results: [
    '/music/Shadow Clues (2).mp3',
  ],
  credits: [
    '/music/Midnight Whispers.mp3',
  ],
  registration: [
    '/music/Shadows in the Fog.wav',
  ],
  silent: [],
};

// Themes that should loop a single track instead of shuffling playlist
const LOOP_THEMES: MusicTheme[] = ['registration', 'credits', 'results', 'cases'];

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface MusicContextType {
  currentTheme: MusicTheme;
  setTheme: (theme: MusicTheme) => void;
  isPlaying: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  skipTrack: () => void;
  currentTrack: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<MusicTheme>('menu');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const themeRef = useRef<MusicTheme>('menu');
  const hasStartedRef = useRef(false);

  // Check if on admin pages - disable music completely
  const isAdminPage = pathname?.startsWith('/admin');

  // Stop music on admin pages
  useEffect(() => {
    if (isAdminPage && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAdminPage]);

  // Keep refs in sync
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    themeRef.current = currentTheme;
  }, [currentTheme]);

  // Initialize audio element and set up global interaction listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Handle track end
    const handleEnded = () => {
      const currentPlaylist = playlistRef.current;
      if (currentPlaylist.length > 1) {
        setCurrentTrackIndex(prev => (prev + 1) % currentPlaylist.length);
      }
    };

    audio.addEventListener('ended', handleEnded);

    // Global listener to start music on ANY interaction
    const startMusic = () => {
      // Don't start music on admin pages
      if (window.location.pathname.startsWith('/admin')) return;
      if (hasStartedRef.current) return;

      const audio = audioRef.current;
      if (!audio) return;
      if (audio.src && !audio.paused) return;

      // Get tracks - use playlistRef if available, otherwise get from PLAYLISTS directly
      let tracks = playlistRef.current;
      if (tracks.length === 0) {
        tracks = PLAYLISTS[themeRef.current] || [];
      }

      if (tracks.length > 0) {
        const track = tracks[0];
        if (track) {
          // Set loop based on theme
          audio.loop = LOOP_THEMES.includes(themeRef.current);

          if (!audio.src.endsWith(track)) {
            audio.src = track;
            audio.load();
          }

          audio.play()
            .then(() => {
              hasStartedRef.current = true;
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log('Audio play failed:', err);
            });
        }
      }
    };

    // Listen for any interaction
    document.addEventListener('click', startMusic, { capture: true });
    document.addEventListener('keydown', startMusic, { capture: true });
    document.addEventListener('touchstart', startMusic, { capture: true });
    document.addEventListener('mousedown', startMusic, { capture: true });
    document.addEventListener('scroll', startMusic, { capture: true, passive: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('click', startMusic, { capture: true });
      document.removeEventListener('keydown', startMusic, { capture: true });
      document.removeEventListener('touchstart', startMusic, { capture: true });
      document.removeEventListener('mousedown', startMusic, { capture: true });
      document.removeEventListener('scroll', startMusic, { capture: true });
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Update playlist when theme changes
  useEffect(() => {
    const tracks = PLAYLISTS[currentTheme];
    if (tracks.length > 0) {
      const shuffled = shuffleArray(tracks);
      setPlaylist(shuffled);
      setCurrentTrackIndex(0);
    } else {
      setPlaylist([]);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentTheme]);

  // Play track when playlist or index changes
  useEffect(() => {
    if (!audioRef.current || playlist.length === 0 || isMuted || isAdminPage) return;

    const audio = audioRef.current;
    const track = playlist[currentTrackIndex];
    if (!track) return;

    // Configure audio
    audio.loop = LOOP_THEMES.includes(currentTheme);

    // Only change source if different
    if (audio.src !== window.location.origin + track) {
      audio.src = track;
      audio.load();
    }

    // Try to play
    audio.play()
      .then(() => {
        hasStartedRef.current = true;
        setIsPlaying(true);
      })
      .catch(() => {
        // Will start on interaction
        setIsPlaying(false);
      });
  }, [playlist, currentTrackIndex, isMuted, currentTheme, isAdminPage]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const setTheme = useCallback((theme: MusicTheme) => {
    if (theme !== currentTheme) {
      themeRef.current = theme; // Update ref immediately
      setCurrentTheme(theme);
    }
  }, [currentTheme]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmuting
      audioRef.current.muted = false;
      audioRef.current.play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {});
      setIsMuted(false);
    } else {
      // Muting
      audioRef.current.muted = true;
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const skipTrack = useCallback(() => {
    if (playlist.length > 1) {
      setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
    }
  }, [playlist.length]);

  const value: MusicContextType = {
    currentTheme,
    setTheme,
    isPlaying,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    skipTrack,
    currentTrack: playlist[currentTrackIndex] || null,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

// Hook to set theme on page mount
export function useMusicTheme(theme: MusicTheme) {
  const { setTheme } = useMusic();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
}
