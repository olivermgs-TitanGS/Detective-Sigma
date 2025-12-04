'use client';

import { useState, useEffect, useRef } from 'react';

// Main gameplay music (excluding ending credits tracks)
const MUSIC_TRACKS = [
  '/music/Shadow Clues.mp3',
  '/music/Shadow Clues (1).mp3',
  '/music/Shadow Clues (2).mp3',
  '/music/Shadow Clues (3).mp3',
  '/music/Whispers in the Fog.mp3',
  '/music/Whispers in the Fog (1).mp3',
  '/music/Shadows Whispered Lies.mp3',
  '/music/Shadows Whispered Lies (1).mp3',
  '/music/Shadows in the Fog.mp3',
  '/music/Shadows in the Fog (1).mp3',
  '/music/Shadows in the Fog (2).mp3',
  '/music/Shadows in the Fog (3).mp3',
];

// Ending credits music (used only on results/credits page)
export const ENDING_CREDITS_TRACKS = [
  '/music/Midnight Whispers.mp3',
  '/music/Midnight Whispers (1).mp3',
];

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5); // 50% default volume
  const [playlist, setPlaylist] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize shuffled playlist on mount
  useEffect(() => {
    setPlaylist(shuffleArray(MUSIC_TRACKS));
  }, []);

  // Setup audio and autoplay
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.volume = volume;
      audioRef.current.muted = false;

      // Handle track ending - play next track
      const handleEnded = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      };

      audioRef.current.addEventListener('ended', handleEnded);

      // Try autoplay
      const playAudio = () => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, wait for user interaction
        });
      };

      setTimeout(playAudio, 500);

      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [playlist]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = playlist[currentTrackIndex];

      if (wasPlaying) {
        audioRef.current.play().catch(() => {
          // Handle play error
        });
      }
    }
  }, [currentTrackIndex, playlist]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);

      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Handle play error
        });
      }
    }
  };

  const skipTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <>
      <audio ref={audioRef} autoPlay muted loop={false} />

      {/* Music Control Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Volume Slider */}
        <div className="border-2 border-amber-600/50 bg-black/90 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-mono text-xs tracking-wider whitespace-nowrap">
              VOLUME
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              style={{
                background: `linear-gradient(to right, #d97706 0%, #d97706 ${volume * 100}%, #334155 ${volume * 100}%, #334155 100%)`
              }}
            />
            <span className="text-amber-400 font-mono text-xs tracking-wider min-w-[3ch]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Control Buttons Row */}
        <div className="flex gap-2">
          {/* Skip Track Button */}
          <button
            onClick={skipTrack}
            className="border-2 border-amber-600/50 bg-black/90 p-3 hover:bg-amber-600 hover:text-black transition-all group backdrop-blur-sm"
            title="Skip Track"
          >
            <span className="text-xl">⏭️</span>
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="border-2 border-amber-600 bg-black/90 p-4 hover:bg-amber-600 hover:text-black transition-all group backdrop-blur-sm"
            title={isMuted ? 'Unmute Music' : 'Mute Music'}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {isMuted ? '🔇' : isPlaying ? '🎵' : '🔊'}
              </span>
              <span className="text-amber-400 group-hover:text-black font-mono text-xs tracking-wider hidden md:inline">
                {isMuted ? 'UNMUTE' : isPlaying ? 'NOIR BGM' : 'PLAY MUSIC'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
