
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mm = require('music-metadata');


const { MUSIC_DIR, DATA_DIR, LIBRARY_FILE, getPlaylistFolders, getPlaylistPath } = require('../paths');

// Ensure directories exist
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });


let cachedLibrary = [];

const LibraryModule = {
    async scanLibrary() {
        console.log('[LIBRARY] Scanning music directory with playlists...');
        try {
            const library = [];
            const playlists = getPlaylistFolders();

            // Also scan root folder for uncategorized songs
            const allFolders = ['', ...playlists]; // '' represents root folder

            for (const folder of allFolders) {
                const folderPath = folder ? getPlaylistPath(folder) : MUSIC_DIR;
                
                if (!fs.existsSync(folderPath)) continue;

                const files = fs.readdirSync(folderPath).filter(f => 
                    f.match(/\.(mp3|wav|ogg|opus|m4a|flac)$/i) && 
                    !fs.statSync(path.join(folderPath, f)).isDirectory()
                );

                for (const file of files) {
                    const filePath = path.join(folderPath, file);
                    const stats = fs.statSync(filePath);

                    // Deterministic ID based on folder + filename
                    const idSource = folder ? `${folder}/${file}` : file;
                    const id = crypto.createHash('md5').update(idSource).digest('hex').substring(0, 8);
                    const hexId = '0x' + id.substring(0, 2).toUpperCase();

                    let metadata = {
                        title: file,
                        artist: 'Unknown Artist',
                        duration: 0
                    };

                    try {
                        const cleanMetadata = await mm.parseFile(filePath);
                        metadata.title = cleanMetadata.common.title || file;
                        metadata.artist = cleanMetadata.common.artist || 'Unknown Artist';
                        metadata.duration = cleanMetadata.format.duration || 0;
                    } catch (err) {
                        console.warn(`[LIBRARY] Failed to parse metadata for ${file}:`, err.message);
                    }

                    library.push({
                        id,
                        hexId,
                        title: metadata.title.toUpperCase(), // Terminal style
                        artist: metadata.artist.toUpperCase(),
                        durationSeconds: Math.floor(metadata.duration),
                        duration: this.formatTime(metadata.duration),
                        filename: file,
                        size: stats.size,
                        playlist: folder || null // null means root/uncategorized
                    });
                }
            }

            cachedLibrary = library;
            this.saveIndex();
            console.log(`[LIBRARY] Index complete. ${library.length} songs found across ${playlists.length} playlists.`);
            return library;
        } catch (error) {
            console.error('[LIBRARY] Scan failed:', error);
            return [];
        }
    },

    saveIndex() {
        fs.writeFileSync(LIBRARY_FILE, JSON.stringify(cachedLibrary, null, 2));
    },

    loadIndex() {
        if (fs.existsSync(LIBRARY_FILE)) {
            cachedLibrary = JSON.parse(fs.readFileSync(LIBRARY_FILE));
            console.log(`[LIBRARY] Loaded index with ${cachedLibrary.length} songs.`);
        } else {
            this.scanLibrary();
        }
        return cachedLibrary;
    },

    getLibrary() {
        return cachedLibrary;
    },

    getLibraryByPlaylist(playlistName) {
        if (!playlistName) return cachedLibrary;
        return cachedLibrary.filter(s => s.playlist === playlistName);
    },

    getSongById(id) {
        return cachedLibrary.find(s => s.id === id);
    },

    formatTime(seconds) {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// Load on startup
LibraryModule.loadIndex();

module.exports = LibraryModule;
