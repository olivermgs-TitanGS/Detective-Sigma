'use client';

import { useMusic } from '@/contexts/MusicContext';
import { usePathname } from 'next/navigation';

export default function MusicPlayer() {
  const { isMuted, isPlaying, toggleMute, volume, setVolume, skipTrack, currentTrack } = useMusic();
  const pathname = usePathname();

  // Don't render music player on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  // Extract song name from path (e.g., "/music/Shadow Clues.mp3" -> "Shadow Clues")
  const getSongName = (path: string | null): string => {
    if (!path) return 'No track';
    const filename = path.split('/').pop() || '';
    return filename.replace('.mp3', '').replace(/\s*\(\d+\)$/, ''); // Remove .mp3 and (1), (2) etc.
  };

  const songName = getSongName(currentTrack);

  return (
    <>
      {/* Mobile: Compact floating button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            border: '2px solid #ffea00',
          }}
        >
          {isMuted ? '🔇' : isPlaying ? '🎵' : '▶️'}
        </button>
      </div>

      {/* Desktop: Compact single-row controls */}
      <div
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 px-3 py-2 rounded-lg"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
        }}
      >
        {/* Song Name */}
        <span
          className="text-xs font-medium truncate max-w-[120px]"
          style={{ color: '#ffd700' }}
          title={songName}
        >
          🎵 {songName}
        </span>

        <div className="w-px h-4 bg-gray-600" />

        {/* Skip Button */}
        <button
          onClick={skipTrack}
          className="w-7 h-7 flex items-center justify-center rounded transition-all hover:scale-110 hover:bg-white/10"
          title="Skip Track"
        >
          <span className="text-sm">⏭️</span>
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="w-7 h-7 flex items-center justify-center rounded transition-all hover:scale-110 hover:bg-white/10"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="text-sm">
            {isMuted ? '🔇' : isPlaying ? '🔊' : '▶️'}
          </span>
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1.5 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ffd700 0%, #ffd700 ${volume * 100}%, #333 ${volume * 100}%, #333 100%)`
          }}
          title={`Volume: ${Math.round(volume * 100)}%`}
        />

        {/* Volume Percentage */}
        <span className="text-xs font-bold min-w-[3ch]" style={{ color: '#ffd700' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>
    </>
  );
}
