'use client';

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';

// Sound effect types
export type SoundEffect =
  | 'click'
  | 'paperRustle'
  | 'folderOpen'
  | 'folderClose'
  | 'stamp'
  | 'cameraShutter'
  | 'typewriter'
  | 'success'
  | 'error'
  | 'clueFound'
  | 'pinDrop'
  | 'whoosh';

// Sound effect file paths (you can add actual audio files to public/sfx/)
const SOUND_EFFECTS: Record<SoundEffect, string> = {
  click: '/sfx/click.mp3',
  paperRustle: '/sfx/paper-rustle.mp3',
  folderOpen: '/sfx/folder-open.mp3',
  folderClose: '/sfx/folder-close.mp3',
  stamp: '/sfx/stamp.mp3',
  cameraShutter: '/sfx/camera-shutter.mp3',
  typewriter: '/sfx/typewriter.mp3',
  success: '/sfx/success.mp3',
  error: '/sfx/error.mp3',
  clueFound: '/sfx/clue-found.mp3',
  pinDrop: '/sfx/pin-drop.mp3',
  whoosh: '/sfx/whoosh.mp3',
};

interface SoundEffectsContextType {
  playSound: (sound: SoundEffect) => void;
  stopSound: (sound: SoundEffect) => void;
  stopAllSounds: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  preloadSounds: () => void;
}

const SoundEffectsContext = createContext<SoundEffectsContextType | undefined>(undefined);

interface SoundEffectsProviderProps {
  children: ReactNode;
}

export function SoundEffectsProvider({ children }: SoundEffectsProviderProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const audioRefs = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const preloadedRef = useRef(false);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create audio elements for each sound
    Object.entries(SOUND_EFFECTS).forEach(([key, path]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = volume;
      // Only set src when the file exists - for now use placeholder behavior
      // audio.src = path;
      audioRefs.current.set(key as SoundEffect, audio);
    });

    return () => {
      // Cleanup
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, []);

  // Update volume for all audio elements
  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      audio.volume = volume;
    });
  }, [volume]);

  // Preload all sounds
  const preloadSounds = useCallback(() => {
    if (preloadedRef.current) return;

    audioRefs.current.forEach((audio, key) => {
      const path = SOUND_EFFECTS[key];
      if (path && !audio.src) {
        audio.src = path;
        audio.load();
      }
    });

    preloadedRef.current = true;
  }, []);

  // Play a sound effect
  const playSound = useCallback((sound: SoundEffect) => {
    if (isMuted) return;

    const audio = audioRefs.current.get(sound);
    if (audio) {
      // Ensure sound is loaded
      if (!audio.src) {
        audio.src = SOUND_EFFECTS[sound];
      }

      // Reset and play
      audio.currentTime = 0;
      audio.play().catch((err) => {
        // Silently fail if audio can't play (file not found, etc.)
        console.debug(`Sound effect "${sound}" not available:`, err.message);
      });
    }
  }, [isMuted]);

  // Stop a specific sound
  const stopSound = useCallback((sound: SoundEffect) => {
    const audio = audioRefs.current.get(sound);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const value: SoundEffectsContextType = {
    playSound,
    stopSound,
    stopAllSounds,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    preloadSounds,
  };

  return (
    <SoundEffectsContext.Provider value={value}>
      {children}
    </SoundEffectsContext.Provider>
  );
}

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext);
  if (context === undefined) {
    throw new Error('useSoundEffects must be used within a SoundEffectsProvider');
  }
  return context;
}

// Hook to play sound on component mount
export function useSoundOnMount(sound: SoundEffect, delay = 0) {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    const timer = setTimeout(() => {
      playSound(sound);
    }, delay);

    return () => clearTimeout(timer);
  }, [playSound, sound, delay]);
}

// Hook to play sound on action
export function useSoundAction(sound: SoundEffect) {
  const { playSound } = useSoundEffects();

  return useCallback(() => {
    playSound(sound);
  }, [playSound, sound]);
}
