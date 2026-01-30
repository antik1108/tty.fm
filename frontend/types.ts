
export interface Song {
  id: string;
  hexId: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
}

export interface Playlist {
  id: string;
  name: string;
}

export enum ViewMode {
  HOME = 'HOME',
  BROWSE = 'BROWSE',
  LIBRARY = 'LIBRARY',
  FAVORITES = 'FAVORITES',
  UPLOAD = 'UPLOAD'
}

export interface SystemStats {
  cpu: number;
  mem: string;
  time: string;
}
