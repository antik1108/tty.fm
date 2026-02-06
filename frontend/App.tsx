import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import Footer from './components/Footer';
import SystemLogs from './components/SystemLogs';
import UploadPanel from './components/UploadPanel';
import { LibraryService } from './services/LibraryService';
import { SystemService } from './services/SystemService';
import { Playlist, Song, SystemLog, SystemStats, ViewMode } from './types';

const INITIAL_STATS: SystemStats = {
  latency: 12,
  status: 'OPTIMIZED',
  uptime: '00:00:00',
  nodeLoad: 0,
  nodeName: 'LOCAL_NODE'
};

const INSIGHT_TEMPLATES = [
  'DATASTREAM_COHERENT: SYNTH_CHANNELS ALIGNED.',
  'NEURAL_SIGNATURE_OK: RHYTHM_GRID LOCKED.',
  'SPECTRAL_SCAN CLEAN: SUB_BASS THRESHOLD STABLE.',
  'NODE_FEEDBACK: AUDIO_MATRIX STABLE UNDER LOAD.',
  'ENCRYPTED_STREAM VERIFIED: SIGNAL TO NOISE OPTIMAL.'
];

const formatBytes = (bytes?: number) => {
  if (!bytes || Number.isNaN(bytes)) return '--';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIBRARY);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<SystemStats>(INITIAL_STATS);
  const [neuralInsight, setNeuralInsight] = useState('SYSTEM_IDLE: AWAITING_INPUT...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'library' | 'visualizer'>('library');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addLog = useCallback((level: SystemLog['level'], message: string) => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).slice(2, 10),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      level,
      message
    };
    setLogs((prev) => [...prev.slice(-20), newLog]);
  }, []);

  const normalizeSongs = useCallback((data: Song[]) => {
    return data.map((song) => ({
      ...song,
      size: formatBytes(typeof song.size === 'number' ? song.size : undefined),
      genre: song.genre || 'AUDIO'
    }));
  }, []);

  const fetchPlaylists = useCallback(async () => {
    const data = await LibraryService.getPlaylists();
    setPlaylists(data.playlists);
    setUncategorizedCount(data.uncategorizedCount);
  }, []);

  const fetchLibrary = useCallback(async (playlistName?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      let library: Song[] = [];
      if (playlistName === null) {
        library = await LibraryService.getSongs();
        library = library.filter((song) => !song.playlist);
      } else if (playlistName) {
        library = await LibraryService.getPlaylistSongs(playlistName);
      } else {
        library = await LibraryService.getSongs();
      }
      const normalized = normalizeSongs(library);
      setSongs(normalized);
      setCurrentSong((prev) => prev && normalized.find((song) => song.id === prev.id) ? prev : normalized[0] || null);
    } catch (err) {
      console.error(err);
      setError('FATAL: CONNECTION_REFUSED_TO_MAINFRAME');
    } finally {
      setIsLoading(false);
    }
  }, [normalizeSongs]);

  const refreshSystemStats = useCallback(async () => {
    try {
      const raw = await SystemService.getStats();
      const nodeLoad = Math.min(100, Math.max(0, raw.cpu));
      setStats({
        latency: Math.max(8, Math.min(40, Math.round(raw.cpu / 2) + 10)),
        status: nodeLoad > 70 ? 'THROTTLED' : 'OPTIMIZED',
        uptime: raw.uptime,
        nodeLoad,
        nodeName: `${raw.platform.toUpperCase()}-${raw.arch.toUpperCase()}`
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    addLog('CORE', 'Memory allocation successful.');
    addLog('NET', 'Establishing handshake with MAINFRAME...');
    addLog('UI', 'Cyber terminal layout initialized.');

    fetchPlaylists().catch(() => undefined);
    fetchLibrary().catch(() => undefined);
    refreshSystemStats().catch(() => undefined);

    const interval = setInterval(() => {
      refreshSystemStats().catch(() => undefined);
    }, 2000);

    return () => clearInterval(interval);
  }, [addLog, fetchLibrary, fetchPlaylists, refreshSystemStats]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Playback failed', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handleSongSelect = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // On mobile, automatically switch to visualizer when a song starts playing
    if (window.innerWidth < 1024) {
      setMobileView('visualizer');
    }
    addLog('PROCESS', `Streaming PID ${song.hexId} (Encrypted).`);
    const insight = INSIGHT_TEMPLATES[Math.floor(Math.random() * INSIGHT_TEMPLATES.length)];
    setNeuralInsight(insight);
    addLog('AI', `Neural insight generated for ${song.hexId}`);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    addLog('SYS', isPlaying ? 'Playback suspended.' : 'Playback resumed.');
  };

  const handleSeek = (percent: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const nextTime = (percent / 100) * audioRef.current.duration;
    audioRef.current.currentTime = nextTime;
    setProgress(percent);
  };

  const handleSelectLibrary = () => {
    setViewMode(ViewMode.LIBRARY);
    setSelectedPlaylist(null);
    fetchLibrary().catch(() => undefined);
    // Ensure we are viewing the library content
    setMobileView('library');
  };

  const handleSelectPlaylist = (playlist: Playlist | null) => {
    setViewMode(ViewMode.PLAYLIST);
    setSelectedPlaylist(playlist);
    fetchLibrary(playlist?.name || null).catch(() => undefined);
    // Ensure we are viewing the library content
    setMobileView('library');
  };

  const handleSelectUpload = () => {
    setViewMode(ViewMode.UPLOAD);
    setMobileView('library'); // Upload is part of the "library" main content area
  };

  const handleCreatePlaylist = async (name: string) => {
    try {
      const playlist = await LibraryService.createPlaylist(name);
      setPlaylists((prev) => [...prev, playlist]);
      addLog('SYS', `Playlist created: ${playlist.name}`);
    } catch (err) {
      console.error(err);
      addLog('WARN', 'Playlist creation failed.');
    }
  };

  const handleRefreshLibrary = async () => {
    try {
      await LibraryService.refreshLibrary();
      await fetchPlaylists();
      await fetchLibrary(selectedPlaylist?.name || null);
      addLog('CORE', 'Library refresh complete.');
    } catch (err) {
      console.error(err);
      addLog('WARN', 'Library refresh failed.');
    }
  };

  const handleUpload = async (file: File, playlistName?: string | null) => {
    await LibraryService.uploadSong(file, playlistName);
    await fetchPlaylists();
    if (viewMode !== ViewMode.UPLOAD) {
      await fetchLibrary(selectedPlaylist?.name || null);
    }
    addLog('UPLOAD', `Upload complete: ${file.name}`);
  };

  const mainTitle = useMemo(() => {
    if (viewMode === ViewMode.UPLOAD) return 'Upload Interface';
    if (viewMode === ViewMode.PLAYLIST) {
      return selectedPlaylist ? `Playlist: ${selectedPlaylist.name}` : 'Playlist: UNCATEGORIZED';
    }
    return 'Core Process Library';
  }, [viewMode, selectedPlaylist]);

  const timeLabel = useMemo(() => {
    return `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }, [currentTime, duration]);

  // Handle mobile View Toggling
  const handleToggleMobileView = () => {
    setMobileView((prev) => prev === 'library' ? 'visualizer' : 'library');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-terminal-bg relative">
      <Header
        stats={stats}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <Sidebar
          playlists={playlists}
          uncategorizedCount={uncategorizedCount}
          viewMode={viewMode}
          selectedPlaylistId={selectedPlaylist?.id || null}
          onSelectLibrary={handleSelectLibrary}
          onSelectUpload={handleSelectUpload}
          onSelectPlaylist={handleSelectPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          onRefreshLibrary={handleRefreshLibrary}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden relative">
          {/* Main Layout Area - Library/Upload */}
          <section className={`
            flex-col border-r-2 border-terminal-border bg-terminal-bg
            lg:col-span-8 lg:flex 
            ${mobileView === 'library' ? 'flex absolute inset-0 lg:static' : 'hidden lg:flex'}
          `}>
            {viewMode === ViewMode.UPLOAD ? (
              <UploadPanel playlists={playlists} onUpload={handleUpload} />
            ) : (
              <MainContent
                songs={songs}
                currentSong={currentSong}
                title={mainTitle}
                onSelect={handleSongSelect}
                isLoading={isLoading}
                error={error}
              />
            )}
            <div className="h-48 border-t-2 border-terminal-border bg-black shrink-0 hidden lg:block">
              <SystemLogs logs={logs} />
            </div>
          </section>

          {/* Right Panel - Visualizer */}
          <section className={`
            flex-col bg-black/40
            lg:col-span-4 lg:flex
            ${mobileView === 'visualizer' ? 'flex absolute inset-0 lg:static z-20 bg-terminal-bg' : 'hidden lg:flex'}
          `}>
            <RightPanel currentSong={currentSong} neuralInsight={neuralInsight} isPlaying={isPlaying} />
          </section>
        </main>
      </div>

      <Footer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        progress={progress}
        timeLabel={timeLabel}
        onSeek={handleSeek}
        volume={volume}
        setVolume={setVolume}
        onSongClick={handleToggleMobileView}
      />

      <audio
        ref={audioRef}
        src={currentSong ? LibraryService.getStreamUrl(currentSong.id) : undefined}
        onTimeUpdate={() => {
          if (!audioRef.current || !audioRef.current.duration) return;
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      <div className="fixed top-0 left-0 right-0 h-[2px] bg-neon-purple/20 pointer-events-none z-[60]"></div>
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-neon-purple/20 pointer-events-none z-[60]"></div>
    </div>
  );
};

export default App;
