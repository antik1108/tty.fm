import { Playlist, PlaylistsResponse, Song } from '../types';

const API_BASE = '/api';

export const LibraryService = {
  async getSongs(): Promise<Song[]> {
    const response = await fetch(`${API_BASE}/library`);
    if (!response.ok) {
      throw new Error(`Failed to fetch library: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async refreshLibrary(): Promise<void> {
    const response = await fetch(`${API_BASE}/library/refresh`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`Failed to refresh library: ${response.status} ${response.statusText}`);
    }
  },

  async getPlaylists(): Promise<PlaylistsResponse> {
    const response = await fetch(`${API_BASE}/playlists`);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async getPlaylistSongs(playlistName: string): Promise<Song[]> {
    const response = await fetch(`${API_BASE}/playlists/${encodeURIComponent(playlistName)}/songs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async createPlaylist(name: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(`Failed to create playlist: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.playlist as Playlist;
  },

  getStreamUrl(songId: string): string {
    return `${API_BASE}/stream/${songId}`;
  },

  async uploadSong(file: File, playlist?: string | null): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const query = playlist ? `?playlist=${encodeURIComponent(playlist)}` : '';
    const response = await fetch(`${API_BASE}/upload${query}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
  }
};
