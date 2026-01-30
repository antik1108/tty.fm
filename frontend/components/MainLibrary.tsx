
import React, { useMemo } from 'react';
import { Song } from '../types';

interface Props {
  songs: Song[];
  currentSong: Song;
  onSelect: (s: Song) => void;
  query: string;
}

const MainLibrary: React.FC<Props> = ({ songs, currentSong, onSelect, query }) => {
  const filteredSongs = useMemo(() => {
    if (!query) return songs;
    const lowerQuery = query.toLowerCase();
    return songs.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) || 
      s.artist.toLowerCase().includes(lowerQuery)
    );
  }, [songs, query]);

  return (
    <main className="flex-1 flex flex-col pl-4 min-w-0">
      <div className="flex justify-between items-end mb-4 shrink-0">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter truncate">
          ┌─ [ LIBRARY_ROOT ] ───────────────────────────────────────────
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto border border-[#4b2485]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-black text-white font-bold border-b border-[#9046FF] z-10">
            <tr>
              <th className="p-2 w-16 text-xs">ID</th>
              <th className="p-2 text-xs">SONG TITLE</th>
              <th className="p-2 text-xs">ARTIST</th>
              <th className="p-2 w-24 text-xs">TIME</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredSongs.map((song) => {
              const isActive = song.id === currentSong.id;
              return (
                <tr 
                  key={song.id}
                  onClick={() => onSelect(song)}
                  className={`border-b border-[#4b2485] cursor-pointer transition-colors ${
                    isActive ? 'bg-[#9046FF] text-black font-bold' : 'hover:bg-[#4b2485] hover:text-white'
                  }`}
                >
                  <td className="p-2 font-mono">{song.hexId}</td>
                  <td className="p-2 truncate uppercase">
                    {song.title} {isActive && '[PLAYING]'}
                  </td>
                  <td className="p-2 truncate uppercase">{song.artist}</td>
                  <td className="p-2 font-mono">{song.duration}</td>
                </tr>
              );
            })}
            <tr className="text-[#4b2485]">
              <td className="p-2">...</td>
              <td className="p-2">...</td>
              <td className="p-2">...</td>
              <td className="p-2">...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-4 text-xs shrink-0">
        <div className="border border-[#9046FF] p-2 flex-1">
          <span className="text-white font-bold block mb-1">METADATA:</span>
          BITRATE: 320kbps<br/>
          FORMAT: FLAC<br/>
          SAMP_RATE: 44.1kHz
        </div>
        <div className="border border-[#9046FF] p-2 flex-1">
          <span className="text-white font-bold block mb-1">SYSTEM_INFO:</span>
          DRIVER: CORE_AUDIO_01<br/>
          BUFFER: 512ms<br/>
          LATENCY: 12ms
        </div>
      </div>
    </main>
  );
};

export default MainLibrary;
