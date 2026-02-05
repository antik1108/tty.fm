export interface Song {
  id: string;
  hexId: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  size?: string | number;
  genre?: string;
  playlist?: string | null;
  filename?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  icon?: string;
}

export interface PlaylistsResponse {
  playlists: Playlist[];
  uncategorizedCount: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'CORE' | 'NET' | 'PROCESS' | 'SYS' | 'WARN' | 'UI' | 'AI' | 'UPLOAD';
  message: string;
}

export interface SystemStats {
  latency: number;
  status: string;
  uptime: string;
  nodeLoad: number;
  nodeName: string;
}

export enum ViewMode {
  LIBRARY = 'LIBRARY',
  UPLOAD = 'UPLOAD',
  PLAYLIST = 'PLAYLIST'
}
