
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { MUSIC_DIR, getPlaylistFolders, ensurePlaylistExists, getPlaylistPath } = require('../paths');
const LibraryModule = require('../core/library');

// GET /api/playlists - List all playlists with song counts
router.get('/', (req, res) => {
    const playlistFolders = getPlaylistFolders();
    const library = LibraryModule.getLibrary();
    
    const playlists = playlistFolders.map(name => {
        const songCount = library.filter(s => s.playlist === name).length;
        return {
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: name,
            songCount: songCount
        };
    });

    // Also include uncategorized songs count
    const uncategorizedCount = library.filter(s => !s.playlist).length;
    
    res.json({
        playlists,
        uncategorizedCount
    });
});

// GET /api/playlists/:name/songs - Get songs in a playlist
router.get('/:name/songs', (req, res) => {
    const { name } = req.params;
    const songs = LibraryModule.getLibraryByPlaylist(name);
    res.json(songs);
});

// POST /api/playlists - Create a new playlist
router.post('/', (req, res) => {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'INVALID_PLAYLIST_NAME' });
    }

    // Sanitize name (allow letters, numbers, spaces, underscores)
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9_\s]/g, '');
    
    if (sanitizedName.length === 0) {
        return res.status(400).json({ error: 'INVALID_PLAYLIST_NAME' });
    }

    const playlistPath = getPlaylistPath(sanitizedName);
    
    if (fs.existsSync(playlistPath)) {
        return res.status(409).json({ error: 'PLAYLIST_EXISTS' });
    }

    try {
        ensurePlaylistExists(sanitizedName);
        res.json({ 
            status: 'PLAYLIST_CREATED',
            playlist: {
                id: sanitizedName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                name: sanitizedName,
                songCount: 0
            }
        });
    } catch (error) {
        console.error('[PLAYLIST] Create failed:', error);
        res.status(500).json({ error: 'CREATE_FAILED' });
    }
});

// PUT /api/playlists/:name - Rename a playlist
router.put('/:name', async (req, res) => {
    const { name: oldName } = req.params;
    const { newName } = req.body;

    if (!newName || typeof newName !== 'string') {
        return res.status(400).json({ error: 'INVALID_NEW_NAME' });
    }

    const sanitizedNewName = newName.trim().replace(/[^a-zA-Z0-9_\s]/g, '');
    
    if (sanitizedNewName.length === 0) {
        return res.status(400).json({ error: 'INVALID_NEW_NAME' });
    }

    const oldPath = getPlaylistPath(oldName);
    const newPath = getPlaylistPath(sanitizedNewName);

    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ error: 'PLAYLIST_NOT_FOUND' });
    }

    if (fs.existsSync(newPath) && oldName !== sanitizedNewName) {
        return res.status(409).json({ error: 'NAME_ALREADY_EXISTS' });
    }

    try {
        fs.renameSync(oldPath, newPath);
        // Re-scan library to update playlist references
        await LibraryModule.scanLibrary();
        
        res.json({ 
            status: 'PLAYLIST_RENAMED',
            oldName: oldName,
            newName: sanitizedNewName
        });
    } catch (error) {
        console.error('[PLAYLIST] Rename failed:', error);
        res.status(500).json({ error: 'RENAME_FAILED' });
    }
});

// DELETE /api/playlists/:name - Delete a playlist (moves songs to root)
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const { deleteSongs } = req.query; // ?deleteSongs=true to delete songs too

    const playlistPath = getPlaylistPath(name);

    if (!fs.existsSync(playlistPath)) {
        return res.status(404).json({ error: 'PLAYLIST_NOT_FOUND' });
    }

    try {
        const files = fs.readdirSync(playlistPath);
        
        if (deleteSongs === 'true') {
            // Delete all songs in the playlist
            for (const file of files) {
                fs.unlinkSync(path.join(playlistPath, file));
            }
        } else {
            // Move songs to root music folder
            for (const file of files) {
                const oldPath = path.join(playlistPath, file);
                const newPath = path.join(MUSIC_DIR, file);
                // Avoid overwriting existing files
                if (!fs.existsSync(newPath)) {
                    fs.renameSync(oldPath, newPath);
                }
            }
        }

        // Remove the empty folder
        fs.rmdirSync(playlistPath);
        
        // Re-scan library
        await LibraryModule.scanLibrary();

        res.json({ 
            status: 'PLAYLIST_DELETED',
            name: name,
            songsDeleted: deleteSongs === 'true'
        });
    } catch (error) {
        console.error('[PLAYLIST] Delete failed:', error);
        res.status(500).json({ error: 'DELETE_FAILED' });
    }
});

module.exports = router;
