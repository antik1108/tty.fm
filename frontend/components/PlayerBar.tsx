
import React, { useRef, useEffect, useState } from 'react';
import { Song } from '../types';
import { LibraryService } from '../services/LibraryService';

interface Props {
  song: Song | null;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
}

const PlayerBar: React.FC<Props> = ({ song, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle play/pause from props
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Handle song change
  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.src = LibraryService.getStreamUrl(song.id);
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Auto-play failed", e));
      }
    }
  }, [song]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!song) {
    return <footer className="hidden"></footer>;
  }

  return (
    <footer className="mt-4 border border-[#9046FF] p-3 shrink-0 relative overflow-hidden">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => console.error("Audio Error", e)}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold animate-pulse text-xs">● NOW PLAYING</div>
          <div className="text-lg font-bold tracking-tight uppercase truncate max-w-md">
            {song.title} - {song.artist}
          </div>
        </div>
        <div className="flex gap-4 text-xs font-bold">
          <button className="hover:text-white">[ SHUFFLE: OFF ]</button>
          <button className="hover:text-white">[ REPEAT: ONE ]</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-white font-bold text-lg font-mono w-32 shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Retro Block Progress Bar */}
        <div className="flex-1 flex overflow-hidden border border-[#4b2485] h-5 bg-black relative">
          <div
            className="bg-[#9046FF] h-full transition-all duration-300 z-10"
            style={{ width: `${progressPercent}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] opacity-20 tracking-[10px] pointer-events-none select-none">
            ████████████████████████████████████████████████████████████████████████████
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="px-2 border border-[#9046FF] hover:bg-[#9046FF] hover:text-black transition-colors font-bold">|&lt;&lt;</button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 border border-[#9046FF] font-bold transition-all ${isPlaying ? 'bg-[#9046FF] text-black' : 'hover:bg-[#9046FF] hover:text-black'
              }`}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button className="px-2 border border-[#9046FF] hover:bg-[#9046FF] hover:text-black transition-colors font-bold">&gt;&gt;|</button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-[10px] uppercase font-bold">
        <div className="flex gap-6">
          <span>VOL: [████████──] 80%</span>
          <span>EQ: [FLAT]</span>
          <span className="text-[#4b2485]">BUFF: 1024KB</span>
        </div>
        <div className="text-white tracking-widest opacity-80">
          STREAMING_LIVE_04c6c074
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
