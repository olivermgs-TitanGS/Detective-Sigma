'use client';

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';
import { playSynthSound, SynthSoundType, ensureAudioContext } from '@/lib/audio/synth-sounds';

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
  | 'whoosh'
  // New celebration sounds
  | 'levelUp'
  | 'achievement'
  | 'points'
  | 'streak'
  | 'confetti'
  | 'correct'
  | 'wrong'
  | 'combo'
  // UI interaction sounds
  | 'buttonHover'
  | 'buttonClick'
  | 'tabSwitch'
  | 'modalOpen'
  | 'modalClose'
  | 'notification';

// Sound effect file paths (optional - synthetic sounds used as fallback)
const SOUND_EFFECTS: Record<SoundEffect, string> = {
  // Original sounds
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
  // Celebration sounds
  levelUp: '/sfx/level-up.mp3',
  achievement: '/sfx/achievement.mp3',
  points: '/sfx/points.mp3',
  streak: '/sfx/streak.mp3',
  confetti: '/sfx/confetti.mp3',
  correct: '/sfx/correct.mp3',
  wrong: '/sfx/wrong.mp3',
  combo: '/sfx/combo.mp3',
  // UI interaction sounds
  buttonHover: '/sfx/button-hover.mp3',
  buttonClick: '/sfx/button-click.mp3',
  tabSwitch: '/sfx/tab-switch.mp3',
  modalOpen: '/sfx/modal-open.mp3',
  modalClose: '/sfx/modal-close.mp3',
  notification: '/sfx/notification.mp3',
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
  useSyntheticSounds: boolean;
  setUseSyntheticSounds: (use: boolean) => void;
}

const SoundEffectsContext = createContext<SoundEffectsContextType | undefined>(undefined);

interface SoundEffectsProviderProps {
  children: ReactNode;
}

export function SoundEffectsProvider({ children }: SoundEffectsProviderProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [useSyntheticSounds, setUseSyntheticSounds] = useState(true); // Default to synthetic
  const audioRefs = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const failedSounds = useRef<Set<SoundEffect>>(new Set());
  const preloadedRef = useRef(false);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create audio elements for each sound
    Object.entries(SOUND_EFFECTS).forEach(([key]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = volume;
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

    // Use synthetic sounds if enabled or if the audio file previously failed
    if (useSyntheticSounds || failedSounds.current.has(sound)) {
      try {
        ensureAudioContext();
        playSynthSound(sound as SynthSoundType);
      } catch (err) {
        console.debug(`Synthetic sound "${sound}" failed:`, err);
      }
      return;
    }

    // Try to play audio file
    const audio = audioRefs.current.get(sound);
    if (audio) {
      // Ensure sound is loaded
      if (!audio.src) {
        audio.src = SOUND_EFFECTS[sound];
      }

      // Reset and play
      audio.currentTime = 0;
      audio.play().catch((err) => {
        // Fallback to synthetic sound
        console.debug(`Sound file "${sound}" not available, using synthetic:`, err.message);
        failedSounds.current.add(sound);
        try {
          ensureAudioContext();
          playSynthSound(sound as SynthSoundType);
        } catch (synthErr) {
          console.debug(`Synthetic fallback also failed:`, synthErr);
        }
      });
    }
  }, [isMuted, useSyntheticSounds]);

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
    useSyntheticSounds,
    setUseSyntheticSounds,
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

// Hook to get sound handlers for buttons
export function useButtonSounds() {
  const { playSound } = useSoundEffects();

  return {
    onClick: useCallback(() => playSound('buttonClick'), [playSound]),
    onMouseEnter: useCallback(() => playSound('buttonHover'), [playSound]),
  };
}
