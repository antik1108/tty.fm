import React from 'react';
import { Song } from '../types';

interface MainContentProps {
  songs: Song[];
  currentSong: Song | null;
  title: string;
  onSelect: (song: Song) => void;
  isLoading: boolean;
  error: string | null;
  onRename?: (newName: string) => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({
  songs,
  currentSong,
  title,
  onSelect,
  isLoading,
  error,
  onRename
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  const isPlaylist = title.startsWith('Playlist: ');
  const displayTitle = isPlaylist ? title.replace('Playlist: ', '') : title;

  const handleStartEdit = () => {
    setEditValue(displayTitle);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onRename || !editValue.trim() || editValue === displayTitle) {
      setIsEditing(false);
      return;
    }
    try {
      await onRename(editValue);
      setIsEditing(false);
    } catch (err) {
      console.error('Rename failed', err);
      // Optional: show error toast
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-terminal-border/40 px-4 py-2 flex justify-between items-center text-[11px] uppercase font-bold text-neon-purple border-b-2 border-terminal-border crt-glow-purple sticky top-0 z-20 h-[42px]">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-black border border-neon-purple text-neon-purple px-2 py-0.5 outline-none w-full max-w-[200px] font-bold uppercase animate-pulse shadow-[0_0_10px_rgba(144,70,255,0.3)]"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <>
              <span>{isPlaylist ? 'Playlist: ' : ''}<span className={isPlaylist ? 'text-white' : ''}>{displayTitle}</span></span>
              {isPlaylist && onRename && (
                <button
                  onClick={handleStartEdit}
                  className="ml-2 text-gray-500 hover:text-white transition-colors pt-0.5"
                  title="Rename Playlist"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[9px] text-gray-500">INDEX:</span>
            <span className="text-matrix-green font-bold text-[10px]">A-Z</span>
          </div>
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white transition-colors">tune</span>
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white transition-colors">search</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar bg-black/10">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead className="sticky top-0 bg-terminal-bg/95 backdrop-blur z-10">
            <tr className="text-gray-500 uppercase border-b-2 border-terminal-border/50">
              <th className="px-6 py-4 font-bold">PID</th>
              <th className="px-6 py-4 font-bold">Object_Name</th>
              <th className="px-6 py-4 font-bold hidden md:table-cell">Sub_Class</th>
              <th className="px-6 py-4 font-bold text-right">Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-terminal-border/20">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  INITIALIZING_UPLINK...
                </td>
              </tr>
            )}
            {error && !isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-alert-yellow">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && songs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  NO_OBJECTS_FOUND
                </td>
              </tr>
            )}
            {!isLoading && !error && songs.map((song) => {
              const isActive = currentSong?.id === song.id;
              return (
                <tr
                  key={song.id}
                  onClick={() => onSelect(song)}
                  className={`cursor-pointer transition-all duration-200 ${isActive
                    ? 'bg-neon-purple/20 border-l-4 border-neon-purple text-white shadow-[inset_10px_0_15px_-5px_rgba(144,70,255,0.3)]'
                    : 'hover:bg-white/5 text-cyber-cyan'
                    }`}
                >
                  <td className={`px-6 py-5 font-mono ${isActive ? 'text-white' : 'text-alert-yellow'}`}>
                    {song.hexId}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`font-bold ${isActive ? 'crt-glow-purple' : ''}`}>{song.title}</div>
                    <div className="text-[10px] text-gray-500 lg:hidden">
                      {song.artist} / {song.size || '--'}
                    </div>
                  </td>
                  <td className={`px-6 py-5 hidden md:table-cell ${isActive ? 'text-neon-purple font-black' : 'text-gray-400'}`}>
                    {song.genre || 'AUDIO'}
                  </td>
                  <td className={`px-6 py-5 text-right font-mono ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {song.size || '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
