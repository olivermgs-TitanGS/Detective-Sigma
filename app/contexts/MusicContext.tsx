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
    '/music/Midnight Whispers (1).mp3',
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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);

  // Keep playlistRef in sync
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Handle track end - play next
    const handleEnded = () => {
      const currentPlaylist = playlistRef.current;
      if (currentPlaylist.length > 1) {
        setCurrentTrackIndex(prev => (prev + 1) % currentPlaylist.length);
      }
      // For single track playlists, loop is already enabled
    };

    audio.addEventListener('ended', handleEnded);

    // Set ready state
    setIsReady(true);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Listen for first user interaction
  useEffect(() => {
    if (hasUserInteracted) return;

    const handleInteraction = () => {
      setHasUserInteracted(true);
    };

    // Listen on capture phase to catch interaction early
    document.addEventListener('click', handleInteraction, { capture: true, once: true });
    document.addEventListener('keydown', handleInteraction, { capture: true, once: true });
    document.addEventListener('touchstart', handleInteraction, { capture: true, once: true });

    return () => {
      document.removeEventListener('click', handleInteraction, { capture: true });
      document.removeEventListener('keydown', handleInteraction, { capture: true });
      document.removeEventListener('touchstart', handleInteraction, { capture: true });
    };
  }, [hasUserInteracted]);

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

  // Play track when ready conditions are met
  useEffect(() => {
    if (!isReady || !audioRef.current || playlist.length === 0) return;

    const audio = audioRef.current;
    const track = playlist[currentTrackIndex];
    if (!track) return;

    // Configure audio
    audio.loop = LOOP_THEMES.includes(currentTheme);
    audio.src = track;
    audio.load();

    // Try to play if not muted
    if (!isMuted) {
      const tryPlay = () => {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Autoplay blocked, waiting for interaction');
            setIsPlaying(false);
          });
      };

      if (hasUserInteracted) {
        tryPlay();
      } else {
        // Wait for interaction then play
        const handleFirstInteraction = () => {
          tryPlay();
        };
        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });

        return () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
      }
    }
  }, [isReady, playlist, currentTrackIndex, isMuted, currentTheme, hasUserInteracted]);

  // Start playing when user interacts (if was waiting)
  useEffect(() => {
    if (hasUserInteracted && !isMuted && audioRef.current && playlist.length > 0 && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [hasUserInteracted, isMuted, playlist.length, isPlaying]);

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
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmuting - try to play
      audioRef.current.muted = false;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
      setIsMuted(false);
    } else {
      // Muting - pause
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
