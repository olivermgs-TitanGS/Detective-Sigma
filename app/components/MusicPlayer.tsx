'use client';

import { useMusic } from '@/contexts/MusicContext';

export default function MusicPlayer() {
  const { isMuted, isPlaying, toggleMute, volume, setVolume, skipTrack } = useMusic();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

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
                {isMuted ? '🔇' : isPlaying ? '🎵' : '▶️'}
              </span>
              <span className="text-xs font-bold tracking-wider" style={{ color: '#ffd700' }}>
                {isMuted ? 'UNMUTE' : isPlaying ? 'PLAYING' : 'TAP TO PLAY'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
