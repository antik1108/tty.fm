
import { Song } from '../types';

const API_BASE = '/api';

export const LibraryService = {
  async getSongs(): Promise<Song[]> {
    try {
      const response = await fetch(`${API_BASE}/library`);
      if (!response.ok) {
        throw new Error(`Failed to fetch library: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('LibraryService Error:', error);
      throw error;
    }
  },

  getStreamUrl(songId: string): string {
    return `${API_BASE}/stream/${songId}`;
  },

  async uploadSong(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
  }
};
