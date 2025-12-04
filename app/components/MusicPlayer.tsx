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
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
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

      const handleEnded = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      };

      audioRef.current.addEventListener('ended', handleEnded);

      const playAudio = () => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked
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
        audioRef.current.play().catch(() => {});
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
        }).catch(() => {});
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <>
      <audio ref={audioRef} autoPlay muted loop={false} />

      {/* Mobile: Compact floating button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        {isExpanded ? (
          <div
            className="rounded-lg p-3"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #ffd700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#ffd700', color: '#000' }}
            >
              ✕
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs" style={{ color: '#ffd700' }}>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ffd700 0%, #ffd700 ${volume * 100}%, #333 ${volume * 100}%, #333 100%)`
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={skipTrack}
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ background: 'rgba(255, 215, 0, 0.2)', border: '1px solid #ffd700' }}
              >
                ⏭️
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ background: 'rgba(255, 215, 0, 0.2)', border: '1px solid #ffd700' }}
              >
                {isMuted ? '🔇' : '🎵'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{
              background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              border: '2px solid #ffea00',
            }}
          >
            {isMuted ? '🔇' : isPlaying ? '🎵' : '🔊'}
          </button>
        )}
      </div>

      {/* Desktop: Full controls */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-3">
        {/* Volume Slider */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #ffd700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider" style={{ color: '#ffd700' }}>
              VOLUME
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ffd700 0%, #ffd700 ${volume * 100}%, #333 ${volume * 100}%, #333 100%)`
              }}
            />
            <span className="text-xs font-bold min-w-[3ch]" style={{ color: '#ffd700' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={skipTrack}
            className="p-3 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #ff9500',
              boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)',
            }}
            title="Skip Track"
          >
            <span className="text-xl">⏭️</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #ffd700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            }}
            title={isMuted ? 'Unmute Music' : 'Mute Music'}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {isMuted ? '🔇' : isPlaying ? '🎵' : '🔊'}
              </span>
              <span className="text-xs font-bold tracking-wider" style={{ color: '#ffd700' }}>
                {isMuted ? 'UNMUTE' : isPlaying ? 'PLAYING' : 'PLAY'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
