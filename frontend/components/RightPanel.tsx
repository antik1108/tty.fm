import React from 'react';
import { Song } from '../types';

interface RightPanelProps {
  currentSong: Song | null;
  neuralInsight: string;
  isPlaying: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ currentSong, neuralInsight, isPlaying }) => {
  if (!currentSong) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="bg-terminal-border/40 px-4 py-2 flex justify-between items-center text-[11px] uppercase font-bold text-neon-purple border-b-2 border-terminal-border crt-glow-purple">
          <span>Object: Neural Output</span>
        </div>
        <div className="flex-1 p-8 flex items-center justify-center bg-black/30 text-gray-500">
          AWAITING_SIGNAL
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="bg-terminal-border/40 px-4 py-2 flex justify-between items-center text-[11px] uppercase font-bold text-neon-purple border-b-2 border-terminal-border crt-glow-purple">
        <span>Object: Neural Output</span>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative bg-black/30 overflow-y-auto no-scrollbar custom-scrollbar">
        <div className="relative w-48 md:w-56 lg:w-64 aspect-square bg-black flex items-center justify-center border-4 border-double border-neon-purple crt-glow-purple mb-8 overflow-hidden rounded-full shadow-[0_0_50px_rgba(144,70,255,0.1)]">
          <div
            className={`absolute inset-0 animate-spin-slow opacity-40 transition-opacity ${isPlaying ? 'opacity-40' : 'opacity-10'}`}
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(144, 70, 255, 0.2) 41%, transparent 42%, transparent 48%, rgba(144, 70, 255, 0.2) 49%, transparent 50%)',
              backgroundSize: '30px 30px'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent"></div>
          <div className={`z-10 text-neon-purple transition-all duration-700 ${isPlaying ? 'animate-pulse crt-glow-purple scale-110' : 'opacity-50 scale-100'}`}>
            <span className="material-symbols-outlined text-7xl md:text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'slow_motion_video' : 'adjust'}
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 text-center z-10 mb-8">
          <h2 className="text-white text-xl md:text-2xl font-black tracking-tight crt-glow-cyan uppercase">
            {currentSong.title.split('.')[0]}
          </h2>
          <p className="text-neon-purple font-bold text-xs tracking-[0.3em] uppercase crt-glow-purple">
            {currentSong.artist}
          </p>
        </div>

        <div className="w-full bg-black/60 p-4 rounded border border-terminal-border mb-8">
          <div className="text-[8px] text-gray-600 mb-2 uppercase font-black">Neural Link Analysis</div>
          <div className="text-[10px] leading-relaxed text-cyber-cyan font-mono italic">&gt; {neuralInsight}</div>
        </div>

        <div className="w-full h-20 flex items-end justify-between gap-1 px-1 relative overflow-hidden bg-black/40 rounded border border-terminal-border/40">
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px)'
            }}
          ></div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`bg-neon-purple w-full transition-all duration-300 ${isPlaying ? `animate-bar-${(i % 3) + 1}` : 'h-[10%]'}`}
              style={{
                height: `${isPlaying ? Math.random() * 80 + 20 : 10}%`,
                opacity: (i + 5) / 15,
                boxShadow: isPlaying ? '0 0 10px rgba(144, 70, 255, 0.5)' : 'none'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
