import React from 'react';
import { SystemStats } from '../types';

interface HeaderProps {
  stats: SystemStats;
}

const Header: React.FC<HeaderProps & { onMenuClick: () => void }> = ({ stats, onMenuClick }) => {
  return (
    <header className="h-auto border-b-2 border-terminal-border bg-black flex flex-col lg:grid lg:grid-cols-[256px_1fr_256px] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-terminal-border shrink-0 z-40">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-neon-purple font-black tracking-widest text-lg crt-glow-purple">TTY.FM</span>
          <div className="text-[9px] flex flex-col">
            <span className="text-matrix-green crt-glow-green uppercase">Status: Synced</span>
            <span className="text-gray-500 uppercase">Mode: Cyber_Terminal</span>
          </div>
        </div>
        <button
          onClick={onMenuClick}
          className="lg:hidden text-neon-purple p-1 border border-terminal-border active:bg-neon-purple/20 relative"
        >
          <span className="material-symbols-outlined">menu</span>
          <div className="absolute top-0 right-0 w-2 h-2 bg-matrix-green rounded-full animate-pulse shadow-[0_0_5px_#00FF00]"></div>
        </button>
      </div>

      <div className="flex overflow-x-auto whitespace-nowrap bg-black/40 lg:bg-transparent no-scrollbar custom-scrollbar">
        <div className="px-6 py-3 border-r border-terminal-border flex flex-col justify-center min-w-[120px]">
          <span className="text-[8px] text-gray-500 uppercase">Latency</span>
          <span className="text-cyber-cyan text-sm font-bold tabular-nums crt-glow-cyan">{stats.latency}ms</span>
        </div>
        <div className="px-6 py-3 border-r border-terminal-border flex flex-col justify-center min-w-[140px]">
          <span className="text-[8px] text-gray-500 uppercase">Buffer_State</span>
          <span className="text-matrix-green text-sm font-bold crt-glow-green uppercase">{stats.status}</span>
        </div>
        <div className="px-6 py-3 border-r border-terminal-border flex flex-col justify-center min-w-[120px]">
          <span className="text-[8px] text-gray-500 uppercase">Uptime</span>
          <span className="text-alert-yellow text-sm font-bold tabular-nums">{stats.uptime}</span>
        </div>
        <div className="px-6 py-3 flex flex-col justify-center min-w-[160px]">
          <span className="text-[8px] text-gray-500 uppercase">Node_Load</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-terminal-border rounded-full overflow-hidden">
              <div
                className="h-full bg-matrix-green crt-glow-green transition-all duration-500"
                style={{ width: `${stats.nodeLoad}%` }}
              ></div>
            </div>
            <span className="text-matrix-green text-[10px] crt-glow-green">{stats.nodeLoad}%</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex p-4 flex-col justify-center text-right">
        <span className="text-neon-purple text-[10px] font-bold crt-glow-purple">NODE: {stats.nodeName}</span>
        <span className="text-gray-600 text-[9px]">SECURE_TUNNEL_ACTIVE</span>
      </div>
    </header>
  );
};

export default Header;
