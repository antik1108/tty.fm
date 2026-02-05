import React, { useState } from 'react';
import { Playlist } from '../types';

interface UploadPanelProps {
  playlists: Playlist[];
  onUpload: (file: File, playlistName?: string | null) => Promise<void>;
}

const UploadPanel: React.FC<UploadPanelProps> = ({ playlists, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('WAITING_FOR_INPUT');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setStatus(`SELECTED: ${event.target.files[0].name.toUpperCase()}`);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatus('UPLOADING_PACKET...');

    try {
      await onUpload(file, selectedPlaylist || null);
      setStatus('UPLOAD_COMPLETE. SYNCED_TO_MAINFRAME.');
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('ERROR: UPLOAD_FAILED. CONNECTION_RESET.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 border-r-2 border-terminal-border relative bg-black/50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(144,70,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(144,70,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="flex items-center gap-2 mb-6 border-b border-terminal-border pb-2">
        <span className="text-xs text-gray-500 uppercase">[ Upload Interface ]</span>
      </div>

      <div className="flex flex-col gap-8 max-w-xl mx-auto w-full mt-10 z-10">
        <div className="border border-terminal-border p-6 relative">
          <label className="block mb-4 text-xs font-bold opacity-80 uppercase">&gt; Select_Audio_Source_File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-xs text-neon-purple file:mr-4 file:py-2 file:px-4 file:border file:border-neon-purple file:text-[10px] file:font-semibold file:bg-black file:text-neon-purple hover:file:bg-neon-purple hover:file:text-black cursor-pointer"
          />
        </div>

        <div className="border border-terminal-border p-4">
          <label className="block mb-2 text-[10px] uppercase text-gray-500">Target Playlist</label>
          <select
            value={selectedPlaylist}
            onChange={(event) => setSelectedPlaylist(event.target.value)}
            className="w-full bg-black text-cyber-cyan text-sm border border-terminal-border px-3 py-2 focus:outline-none focus:border-neon-purple"
          >
            <option value="">UNCATEGORIZED</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.name}>
                {playlist.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase font-bold tracking-widest border-b border-terminal-border pb-1 mb-2">
            STATUS_LOG
          </div>
          <div className="font-mono text-sm opacity-80 animate-pulse">&gt; {status}</div>
        </div>

        {file && !isUploading && (
          <button
            onClick={handleUpload}
            className="mt-4 border border-neon-purple py-3 text-sm font-bold hover:bg-neon-purple hover:text-black transition-all uppercase tracking-widest"
          >
            [ INITIALIZE_UPLOAD ]
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;
