
import React from 'react';
import { Song } from '../types';

interface Props {
  songs: Song[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const RightPanel: React.FC<Props> = ({ songs, searchQuery, setSearchQuery }) => {
  // Simple queue simulation
  const queue = songs.slice(0, 5);

  return (
    <aside className="w-72 flex flex-col border-l border-[#9046FF] ml-4 pl-4 shrink-0">
      <div className="text-white mb-2 text-xs font-bold">┌─ UP_NEXT ──┐</div>
      <div className="flex-1 overflow-y-auto text-xs">
        <div className="flex flex-col gap-2">
          {queue.map((song, idx) => (
            <div 
              key={song.id} 
              className={`border border-[#4b2485] p-2 hover:border-[#9046FF] transition-colors cursor-pointer ${
                idx > 2 ? 'opacity-50' : ''
              }`}
            >
              <div className="text-white font-bold uppercase">{song.title}</div>
              <div className="uppercase">{song.artist}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-white mb-1 text-xs">SEARCH_QUERY:</div>
        <div className="border border-[#9046FF] p-1 flex items-center">
          <span className="mr-2 text-white font-bold">&gt;</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[#9046FF] w-full placeholder:text-[#4b2485] text-sm" 
            placeholder="Filter songs..." 
            type="text"
          />
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
