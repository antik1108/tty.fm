
const path = require('path');
const fs = require('fs');

const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, "data");
// User configured music directory
const MUSIC_DIR = path.join(process.env.HOME, "tty-fm", "music");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });

module.exports = {
    BASE_DIR,
    DATA_DIR,
    MUSIC_DIR,
    LIBRARY_FILE: path.join(DATA_DIR, 'library.json')
};
