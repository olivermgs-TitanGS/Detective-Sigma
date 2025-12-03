'use client';

import { useState, useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Low volume for ambiance
      // Autoplay after user interaction
      const playAudio = () => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, wait for user interaction
        });
      };

      // Try to play after a short delay
      setTimeout(playAudio, 1000);
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);

      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        });
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        {/* Noir Detective Ambiance Music */}
        <source src="https://cdn.pixabay.com/audio/2022/03/10/audio_4b1d044270.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 border-2 border-amber-600 bg-black/90 p-4 hover:bg-amber-600 hover:text-black transition-all group backdrop-blur-sm"
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
    </>
  );
}
