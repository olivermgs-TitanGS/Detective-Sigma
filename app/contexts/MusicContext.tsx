'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// ============================================================================
// MUSIC THEME DEFINITIONS
// ============================================================================

export type MusicTheme = 'menu' | 'cases' | 'investigation' | 'quiz' | 'results' | 'credits' | 'registration' | 'silent';

// Track playlists for each theme - curated for specific moods
const PLAYLISTS: Record<MusicTheme, string[]> = {
  // Menu: Welcoming, mysterious, sets the detective atmosphere
  menu: [
    '/music/Shadow Clues.mp3',
    '/music/Shadow Clues (1).mp3',
    '/music/Whispers in the Fog.mp3',
  ],
  // Cases: Browsing case files, thoughtful, anticipatory
  cases: [
    '/music/Case_Files.mp3',
  ],
  // Investigation: Active gameplay, tension, focus, discovery
  investigation: [
    '/music/Shadow Clues (2).mp3',
    '/music/Shadow Clues (3).mp3',
    '/music/Shadows Whispered Lies.mp3',
    '/music/Shadows Whispered Lies (1).mp3',
    '/music/Shadows in the Fog.mp3',
    '/music/Shadows in the Fog (1).mp3',
  ],
  // Quiz: Assessment, tension, thinking under pressure
  quiz: [
    '/music/Shadows in the Fog (2).mp3',
    '/music/Shadows in the Fog (3).mp3',
    '/music/Whispers in the Fog (1).mp3',
  ],
  // Results: Achievement, resolution, satisfaction
  results: [
    '/music/Shadow Clues (2).mp3',
  ],
  // Credits: Completion, reflection, accomplishment
  credits: [
    '/music/Midnight Whispers.mp3',
  ],
  // Registration: Calm, welcoming, focused for auth flows
  registration: [
    '/music/Shadows in the Fog.wav',
  ],
  // Silent: No music
  silent: [],
};

// Themes that loop a single track vs cycling through playlist
const LOOP_THEMES: MusicTheme[] = ['registration', 'credits', 'results', 'cases'];

// ============================================================================
// INTELLIGENT ROUTE-TO-THEME MAPPING
// ============================================================================
// Routes are matched in ORDER - more specific patterns come FIRST
// Supports wildcards: [id], [caseId], * (any segment), ** (any remaining path)

interface RouteThemeRule {
  pattern: string;
  theme: MusicTheme;
  description: string; // For documentation/debugging
}

const ROUTE_THEME_RULES: RouteThemeRule[] = [
  // ========== ADMIN SECTION - Always silent ==========
  { pattern: '/admin/**', theme: 'silent', description: 'Admin area - no music distraction' },

  // ========== STUDENT CASE FLOW - Most specific first ==========
  { pattern: '/student/cases/[id]/results', theme: 'results', description: 'Case completion - victory music' },
  { pattern: '/student/cases/[id]/quiz', theme: 'quiz', description: 'Quiz assessment - tension music' },
  { pattern: '/student/cases/[id]/play', theme: 'investigation', description: 'Active gameplay - investigation music' },
  { pattern: '/student/cases/[id]', theme: 'cases', description: 'Case briefing/intro - case files music' },
  { pattern: '/student/cases', theme: 'cases', description: 'Case library - browsing music' },

  // ========== STUDENT HUB ==========
  { pattern: '/student/dashboard', theme: 'menu', description: 'Student home base - welcoming menu music' },
  { pattern: '/student/leaderboard', theme: 'menu', description: 'Leaderboard - upbeat competitive vibe' },
  { pattern: '/student/progress', theme: 'menu', description: 'Progress review - reflective menu music' },
  { pattern: '/student/achievements', theme: 'menu', description: 'Achievements - celebratory menu music' },
  { pattern: '/student/profile', theme: 'menu', description: 'Profile page - calm menu music' },
  { pattern: '/student/**', theme: 'menu', description: 'Fallback for student pages' },

  // ========== TEACHER SECTION - Silent for professional focus ==========
  { pattern: '/teacher/**', theme: 'silent', description: 'Teacher area - professional, no distraction' },

  // ========== AUTH FLOW ==========
  { pattern: '/login', theme: 'registration', description: 'Login - calm, focused' },
  { pattern: '/register/**', theme: 'registration', description: 'Registration - welcoming, calm' },
  { pattern: '/forgot-password', theme: 'registration', description: 'Password recovery - calm' },
  { pattern: '/reset-password', theme: 'registration', description: 'Password reset - calm' },
  { pattern: '/verify-email', theme: 'registration', description: 'Email verification - calm' },

  // ========== PUBLIC PAGES ==========
  { pattern: '/', theme: 'menu', description: 'Landing page - grand intro music' },
  { pattern: '/about', theme: 'menu', description: 'About page - storytelling music' },
  { pattern: '/features', theme: 'menu', description: 'Features page - showcase music' },
  { pattern: '/pricing', theme: 'menu', description: 'Pricing page - professional music' },
  { pattern: '/contact', theme: 'menu', description: 'Contact page - approachable music' },

  // ========== SPECIAL PAGES ==========
  { pattern: '/credits', theme: 'credits', description: 'Credits page - completion music' },
  { pattern: '/completion', theme: 'credits', description: 'Completion page - achievement music' },

  // ========== CATCH-ALL FALLBACK ==========
  { pattern: '/**', theme: 'menu', description: 'Default fallback - menu music' },
];

/**
 * Matches a pathname against a route pattern
 * Supports: [param] for dynamic segments, * for single wildcard, ** for rest
 */
function matchRoute(pathname: string, pattern: string): boolean {
  // Normalize paths
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  let pathIndex = 0;
  let patternIndex = 0;

  while (patternIndex < patternParts.length) {
    const patternPart = patternParts[patternIndex];
    const pathPart = pathParts[pathIndex];

    // ** matches everything remaining
    if (patternPart === '**') {
      return true;
    }

    // No more path parts but still have pattern parts
    if (pathPart === undefined) {
      return false;
    }

    // * matches any single segment
    if (patternPart === '*') {
      pathIndex++;
      patternIndex++;
      continue;
    }

    // [param] matches any single segment (dynamic route)
    if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      pathIndex++;
      patternIndex++;
      continue;
    }

    // Exact match required
    if (patternPart !== pathPart) {
      return false;
    }

    pathIndex++;
    patternIndex++;
  }

  // All pattern parts matched, check if path is fully consumed
  return pathIndex === pathParts.length;
}

/**
 * Determines the appropriate music theme for a given pathname
 */
function getThemeForRoute(pathname: string): MusicTheme {
  for (const rule of ROUTE_THEME_RULES) {
    if (matchRoute(pathname, rule.pattern)) {
      return rule.theme;
    }
  }
  return 'menu'; // Ultimate fallback
}

// ============================================================================
// MUSIC CONTEXT
// ============================================================================

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
  // New: Allow temporary theme override for events
  triggerEventTheme: (theme: MusicTheme, durationMs?: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<MusicTheme>('menu');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isEventOverride, setIsEventOverride] = useState(false);
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const themeRef = useRef<MusicTheme>('menu');
  const hasStartedRef = useRef(false);
  const eventTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const baseThemeRef = useRef<MusicTheme>('menu');

  // ============================================================================
  // AUTOMATIC ROUTE-BASED THEME DETECTION
  // ============================================================================
  useEffect(() => {
    if (!pathname) return;

    // Don't auto-change theme during event override
    if (isEventOverride) return;

    const detectedTheme = getThemeForRoute(pathname);

    // Only update if theme actually changed
    if (detectedTheme !== currentTheme) {
      baseThemeRef.current = detectedTheme;
      themeRef.current = detectedTheme;
      setCurrentTheme(detectedTheme);

      // Debug log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎵 Music Manager: ${pathname} → ${detectedTheme}`);
      }
    }
  }, [pathname, isEventOverride, currentTheme]);

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
      // Don't start music on admin or teacher pages
      const path = window.location.pathname;
      if (path.startsWith('/admin') || path.startsWith('/teacher')) return;
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
    const isSilentRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/teacher');
    if (!audioRef.current || playlist.length === 0 || isMuted || isSilentRoute) return;

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
  }, [playlist, currentTrackIndex, isMuted, currentTheme, pathname]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Manual theme override (still available for special cases)
  const setTheme = useCallback((theme: MusicTheme) => {
    if (theme !== currentTheme) {
      themeRef.current = theme;
      baseThemeRef.current = theme;
      setCurrentTheme(theme);
    }
  }, [currentTheme]);

  // Temporary event-based theme override
  const triggerEventTheme = useCallback((theme: MusicTheme, durationMs: number = 5000) => {
    // Clear any existing timeout
    if (eventTimeoutRef.current) {
      clearTimeout(eventTimeoutRef.current);
    }

    // Store current theme as base
    if (!isEventOverride) {
      baseThemeRef.current = currentTheme;
    }

    // Set override
    setIsEventOverride(true);
    themeRef.current = theme;
    setCurrentTheme(theme);

    // Return to base theme after duration
    eventTimeoutRef.current = setTimeout(() => {
      setIsEventOverride(false);
      themeRef.current = baseThemeRef.current;
      setCurrentTheme(baseThemeRef.current);
    }, durationMs);
  }, [currentTheme, isEventOverride]);

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
    triggerEventTheme,
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

// Legacy hook - still works but no longer needed for most cases
export function useMusicTheme(theme: MusicTheme) {
  const { setTheme } = useMusic();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
}
