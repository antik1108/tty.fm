import React, { useState } from 'react';
import { Playlist, ViewMode } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  uncategorizedCount: number;
  viewMode: ViewMode;
  selectedPlaylistId: string | null;
  onSelectLibrary: () => void;
  onSelectUpload: () => void;
  onSelectPlaylist: (playlist: Playlist | null) => void;
  onCreatePlaylist: (name: string) => void;
  onRefreshLibrary: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  uncategorizedCount,
  viewMode,
  selectedPlaylistId,
  onSelectLibrary,
  onSelectUpload,
  onSelectPlaylist,
  onCreatePlaylist,
  onRefreshLibrary
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    const name = window.prompt('Playlist name (A-Z, 0-9, underscore):');
    if (!name) return;
    setIsCreating(true);
    onCreatePlaylist(name.trim());
    setIsCreating(false);
  };

  return (
    <aside className="hidden lg:flex w-64 border-r-2 border-terminal-border flex-col bg-black/40 shrink-0">
      <div className="bg-terminal-border/40 px-4 py-2 flex justify-between items-center text-[11px] uppercase font-bold text-neon-purple border-b-2 border-terminal-border crt-glow-purple">
        <span>FileSystem Tree</span>
        <span className="material-symbols-outlined text-xs cursor-pointer">close_fullscreen</span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <nav className="space-y-2 text-[12px]">
          <button
            onClick={onSelectLibrary}
            className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors ${
              viewMode === ViewMode.LIBRARY
                ? 'text-white bg-neon-purple/20 border-l-2 border-neon-purple'
                : 'text-cyber-cyan hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Library_Root</span>
            </div>
            <span className="text-[10px] text-gray-500">[{playlists.reduce((sum, pl) => sum + pl.songCount, 0) + uncategorizedCount}]</span>
          </button>

          <button
            onClick={() => onSelectPlaylist(null)}
            className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors ${
              viewMode === ViewMode.PLAYLIST && !selectedPlaylistId
                ? 'text-white bg-neon-purple/20 border-l-2 border-neon-purple'
                : 'text-cyber-cyan hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              <span>UNCATEGORIZED</span>
            </div>
            <span className="text-[10px] text-gray-500">[{uncategorizedCount}]</span>
          </button>

          <div className="mt-4 text-[9px] text-neon-purple font-bold uppercase tracking-tighter">Playlists</div>
          {playlists.map((pl) => {
            const isActive = viewMode === ViewMode.PLAYLIST && selectedPlaylistId === pl.id;
            return (
              <button
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors ${
                  isActive
                    ? 'text-white bg-neon-purple/20 border-l-2 border-neon-purple'
                    : 'text-cyber-cyan hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  <span>{pl.name}</span>
                </div>
                <span className="text-[10px] text-gray-500">[{pl.songCount}]</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t-2 border-terminal-border bg-black space-y-3">
        <div className="text-[9px] text-neon-purple font-bold crt-glow-purple uppercase tracking-tighter">I/O Console</div>
        <div className="flex items-center gap-2 bg-terminal-border/40 px-3 py-2.5 rounded border border-terminal-border">
          <span className="text-matrix-green font-bold crt-glow-green">$</span>
          <div className="flex items-center flex-1 overflow-hidden">
            <span className="text-[12px] text-cyber-cyan truncate">scan --library</span>
            <div className="w-2 h-4 ml-1 bg-matrix-green animate-blink crt-glow-green"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center justify-center gap-1 p-2 border border-dashed border-neon-purple/40 text-neon-purple/60 hover:text-neon-purple hover:border-neon-purple transition-all text-[10px] uppercase font-bold"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New</span>
          </button>
          <button
            onClick={onRefreshLibrary}
            className="flex items-center justify-center gap-1 p-2 border border-dashed border-cyber-cyan/40 text-cyber-cyan/70 hover:text-white hover:border-cyber-cyan transition-all text-[10px] uppercase font-bold"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={onSelectUpload}
            className="col-span-2 flex items-center justify-center gap-2 p-2 border border-neon-purple/40 text-neon-purple/80 hover:text-white hover:border-neon-purple transition-all text-[10px] uppercase font-bold"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            <span>Upload Node</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
