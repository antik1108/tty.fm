
import { Song, Playlist } from './types';

export const MOCK_SONGS: Song[] = [
  { id: '1', hexId: '0x01', title: 'MIDNIGHT CITY', artist: 'M83', duration: '04:03', durationSeconds: 243 },
  { id: '2', hexId: '0x02', title: 'STARBOY', artist: 'THE WEEKND', duration: '03:50', durationSeconds: 230 },
  { id: '3', hexId: '0x03', title: 'LEVITATING', artist: 'DUA LIPA', duration: '03:23', durationSeconds: 203 },
  { id: '4', hexId: '0x04', title: 'BLINDING LIGHTS', artist: 'THE WEEKND', duration: '03:20', durationSeconds: 200 },
  { id: '5', hexId: '0x05', title: 'AFTER HOURS', artist: 'THE WEEKND', duration: '06:01', durationSeconds: 361 },
  { id: '6', hexId: '0x06', title: 'SOLAR POWER', artist: 'LORDE', duration: '03:12', durationSeconds: 192 },
  { id: '7', hexId: '0x07', title: 'HOUDINI', artist: 'DUA LIPA', duration: '03:05', durationSeconds: 185 },
  { id: '8', hexId: '0x08', title: 'PAINT THE TOWN RED', artist: 'DOJA CAT', duration: '03:51', durationSeconds: 231 },
  { id: '9', hexId: '0x09', title: 'SAVE YOUR TEARS', artist: 'THE WEEKND', duration: '03:36', durationSeconds: 216 },
  { id: '10', hexId: '0x0A', title: 'FLOWERS', artist: 'MILEY CYRUS', duration: '03:20', durationSeconds: 200 },
  { id: '11', hexId: '0x0B', title: 'KILL BILL', artist: 'SZA', duration: '02:34', durationSeconds: 154 },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'p1', name: 'Late_Night_Lofi' },
  { id: 'p2', name: 'Gym_Motivation' },
  { id: 'p3', name: 'Summer_24_Hits' },
  { id: 'p4', name: 'Deep_Work_Focus' },
  { id: 'p5', name: 'Retro_Synths' },
];

export const COLORS = {
  purple: '#9046FF',
  purpleDim: '#4b2485',
  black: '#000000',
  white: '#FFFFFF',
};
