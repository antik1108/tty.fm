
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_PLAYLISTS } from './constants';
import { Song, ViewMode, SystemStats } from './types';
import Sidebar from './components/Sidebar';
import MainLibrary from './components/MainLibrary';
import RightPanel from './components/RightPanel';
import PlayerBar from './components/PlayerBar';
import TerminalHeader from './components/TerminalHeader';
import UploadView from './components/UploadView'; // Will create this next
import { LibraryService } from './services/LibraryService';

const App: React.FC = () => {
  // Songs state
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [searchQuery, setSearchQuery] = useState('');

  // System stats simulation
  const [stats, setStats] = useState<SystemStats>({
    cpu: 12,
    mem: '256MB',
    time: '00:00:00'
  });

  // Fetch songs function (reusable)
  const fetchSongs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await LibraryService.getSongs();
      setSongs(data);
      if (data.length > 0 && !currentSong) {
        setCurrentSong(data[0]);
      }
    } catch (err) {
      setError('FATAL: CONNECTION_REFUSED_TO_MAINFRAME');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSong]);

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Simulate system clock
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

  const handleSongSelect = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  // Render content based on ViewMode
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center flex-1 text-[#9046FF] animate-pulse">
          &gt; INITIALIZING_UPLINK...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 text-red-500 gap-4">
          <div className="border border-red-500 p-4">
            <h2 className="font-bold text-xl mb-2">SYSTEM_FAILURE</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="border border-[#9046FF] px-4 py-2 hover:bg-[#9046FF] hover:text-black text-[#9046FF]"
          >
            [ REBOOT_SYSTEM ]
          </button>
        </div>
      );
    }

    if (viewMode === ViewMode.UPLOAD) {
      return <UploadView onUploadComplete={fetchSongs} />;
    }

    return (
      <MainLibrary
        songs={songs}
        currentSong={currentSong || songs[0] || null}
        onSelect={handleSongSelect}
        query={searchQuery}
      />
    );
  };

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

        {/* Center: Content Area */}
        {renderContent()}

        {/* Right Side: Queue & Search */}
        <RightPanel
          songs={songs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Footer: Controls */}
      <PlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
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
