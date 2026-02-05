
const path = require('path');
const fs = require('fs');

const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, "data");
// User configured music directory (contains playlist folders)
const MUSIC_DIR = path.join(process.env.HOME, "tty-fm", "music");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });

// Helper to get playlist folder path
const getPlaylistPath = (playlistName) => path.join(MUSIC_DIR, playlistName);

// Helper to ensure playlist folder exists
const ensurePlaylistExists = (playlistName) => {
    const playlistPath = getPlaylistPath(playlistName);
    if (!fs.existsSync(playlistPath)) {
        fs.mkdirSync(playlistPath, { recursive: true });
    }
    return playlistPath;
};

// Get all playlist folders
const getPlaylistFolders = () => {
    if (!fs.existsSync(MUSIC_DIR)) return [];
    return fs.readdirSync(MUSIC_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
};

module.exports = {
    BASE_DIR,
    DATA_DIR,
    MUSIC_DIR,
    LIBRARY_FILE: path.join(DATA_DIR, 'library.json'),
    PLAYLISTS_FILE: path.join(DATA_DIR, 'playlists.json'),
    getPlaylistPath,
    ensurePlaylistExists,
    getPlaylistFolders
};
