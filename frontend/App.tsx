
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_SONGS, MOCK_PLAYLISTS } from './constants';
import { Song, ViewMode, SystemStats } from './types';
import Sidebar from './components/Sidebar';
import MainLibrary from './components/MainLibrary';
import RightPanel from './components/RightPanel';
import PlayerBar from './components/PlayerBar';
import TerminalHeader from './components/TerminalHeader';

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song>(MOCK_SONGS[3]); // BLINDING LIGHTS
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(102); // 01:42
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<SystemStats>({
    cpu: 12,
    mem: '256MB',
    time: '14:42:01'
  });

  // Simulate system clock and slight resource fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setStats(prev => ({
        ...prev,
        time: now.toLocaleTimeString('en-GB', { hour12: false }),
        cpu: Math.max(8, Math.min(25, prev.cpu + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate playback
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.durationSeconds) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  const handleSongSelect = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  return (
    <div className="h-screen flex flex-col p-2 bg-black select-none overflow-hidden text-[#9046FF]">
      {/* Top Meta Bar */}
      <TerminalHeader stats={stats} />

      <div className="flex flex-1 min-h-0">
        {/* Left Side: Navigation & Playlists */}
        <Sidebar 
          currentView={viewMode} 
          setView={setViewMode} 
          playlists={MOCK_PLAYLISTS} 
        />

        {/* Center: Song List & Meta */}
        <MainLibrary 
          songs={MOCK_SONGS} 
          currentSong={currentSong} 
          onSelect={handleSongSelect}
          query={searchQuery}
        />

        {/* Right Side: Queue & Search */}
        <RightPanel 
          songs={MOCK_SONGS} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>

      {/* Footer: Controls */}
      <PlayerBar 
        song={currentSong} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
      />

      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#9046FF] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#9046FF] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#9046FF] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#9046FF] pointer-events-none"></div>
    </div>
  );
};

export default App;
