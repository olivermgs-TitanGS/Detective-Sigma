'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

// Define music themes for different page contexts
export type MusicTheme = 'menu' | 'investigation' | 'quiz' | 'results' | 'credits' | 'registration' | 'silent';

// Track playlists for each theme
const PLAYLISTS: Record<MusicTheme, string[]> = {
  menu: [
    '/music/Shadow Clues.mp3',
    '/music/Shadow Clues (1).mp3',
    '/music/Whispers in the Fog.mp3',
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
    '/music/Shadow Clues.mp3',
    '/music/Whispers in the Fog.mp3',
  ],
  credits: [
    '/music/Midnight Whispers.mp3',
  ],
  registration: [
    '/music/Midnight Whispers (1).mp3',  // Single track, loops continuously
  ],
  silent: [],
};

// Themes that should loop a single track instead of shuffling playlist
const LOOP_THEMES: MusicTheme[] = ['registration', 'credits'];

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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInitialized = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      // Handle track end - play next
      audioRef.current.addEventListener('ended', () => {
        setCurrentTrackIndex(prev => (prev + 1) % (playlist.length || 1));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update playlist when theme changes
  useEffect(() => {
    const tracks = PLAYLISTS[currentTheme];
    if (tracks.length > 0) {
      setPlaylist(shuffleArray(tracks));
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
    if (!audioRef.current || playlist.length === 0) return;

    const track = playlist[currentTrackIndex];
    if (!track) return;

    // Enable looping for single-track themes
    audioRef.current.loop = LOOP_THEMES.includes(currentTheme);
    audioRef.current.src = track;
    audioRef.current.load();

    if (!isMuted) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }
  }, [playlist, currentTrackIndex, isMuted, currentTheme]);

  // Handle autoplay block - start on user interaction
  useEffect(() => {
    if (!autoplayBlocked) return;

    const startOnInteraction = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {});
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };
  }, [autoplayBlocked, isMuted]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const setTheme = useCallback((theme: MusicTheme) => {
    if (theme !== currentTheme) {
      setCurrentTheme(theme);
    }
  }, [currentTheme]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        audioRef.current.muted = true;
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const skipTrack = useCallback(() => {
    if (playlist.length > 0) {
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
