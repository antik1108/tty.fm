import React from 'react';
import { Song } from '../types';

interface FooterProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  progress: number;
  timeLabel: string;
  onSeek: (percent: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  onSongClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  progress,
  timeLabel,
  onSeek,
  volume,
  setVolume,
  onSongClick
}) => {
  if (!currentSong) {
    return <footer className="h-16 border-t-2 border-terminal-border bg-black" />;
  }

  return (
    <footer className="h-auto md:h-24 pb-safe-or-6 border-t-2 border-terminal-border bg-black/90 backdrop-blur-md flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr] items-center px-6 py-4 md:py-0 gap-6 relative z-10 shrink-0 shadow-[0_-5px_20px_rgba(144,70,255,0.1)]">
      <div className="w-full flex-col gap-1 overflow-hidden hidden md:flex">
        <div className="flex justify-between items-end">
          <button
            onClick={onSongClick}
            className="flex flex-col overflow-hidden text-left hover:opacity-80 transition-opacity"
          >
            <span className="text-[11px] text-white font-bold uppercase truncate">{currentSong.title}</span>
            <span className="text-[9px] text-neon-purple tracking-widest font-black uppercase">Encrypted_Stream</span>
          </button>
          <span className="text-[10px] text-gray-500 tabular-nums font-mono whitespace-nowrap ml-2">{timeLabel}</span>
        </div>
        <div
          className="h-2.5 bg-terminal-border relative rounded-full overflow-hidden cursor-pointer group"
          onClick={(event) => {
            const target = event.currentTarget;
            const rect = target.getBoundingClientRect();
            const percent = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
            onSeek(percent);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-neon-purple crt-glow-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_#9046FF] transition-all duration-300"
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Mobile-only compact player */}
      <div className="w-full flex items-center justify-between gap-4 md:hidden">
        <button
          onClick={onSongClick}
          className="flex-1 flex flex-col overflow-hidden text-left hover:opacity-80 transition-opacity"
        >
          <span className="text-[13px] text-white font-bold uppercase truncate crt-glow-purple">{currentSong.title}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-neon-purple tracking-widest font-black uppercase">Playing</span>
            <span className="text-[9px] text-gray-500 tabular-nums font-mono">{timeLabel}</span>
          </div>
        </button>

        <button
          onClick={onTogglePlay}
          className="w-12 h-12 flex items-center justify-center bg-neon-purple text-white rounded-full shadow-[0_0_15px_rgba(144,70,255,0.4)] active:scale-95 transition-all border border-white/20"
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>

      <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
        <button className="text-cyber-cyan hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">shuffle</span>
        </button>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-neon-purple transition-colors">
            <span className="material-symbols-outlined text-[32px]">skip_previous</span>
          </button>
          <button
            onClick={onTogglePlay}
            className="w-14 h-14 flex items-center justify-center bg-neon-purple text-white rounded-full active:scale-95 transition-all shadow-[0_0_30px_rgba(144,70,255,0.4)] border-2 border-white/10"
          >
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button className="text-white hover:text-neon-purple transition-colors">
            <span className="material-symbols-outlined text-[32px]">skip_next</span>
          </button>
        </div>
        <button className="text-cyber-cyan hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">repeat</span>
        </button>
      </div>

      <div className="hidden md:flex w-full items-center justify-end gap-6">
        <div className="flex items-center gap-3 w-40">
          <span className="material-symbols-outlined text-matrix-green text-xl crt-glow-green">
            {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
          </span>
          <div className="flex-1 h-2 bg-terminal-border rounded-full overflow-hidden cursor-pointer group relative">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => setVolume(parseInt(event.target.value, 10))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-full bg-matrix-green crt-glow-green transition-all" style={{ width: `${volume}%` }}></div>
          </div>
        </div>
        <div className="border-l border-terminal-border pl-4">
          <span className="block text-[10px] text-neon-purple font-black crt-glow-purple">TTY_NODE_PROC</span>
          <span className="block text-[8px] text-gray-600 uppercase">Kernel_Latest</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
