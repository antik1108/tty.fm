
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const LibraryModule = require('../core/library');


const { MUSIC_DIR, ensurePlaylistExists, getPlaylistPath } = require('../paths');

// Configure storage - dynamic destination based on playlist
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get playlist from query or body (form field)
        const playlist = req.query.playlist || req.body?.playlist;
        
        let destPath = MUSIC_DIR;
        if (playlist && playlist.trim()) {
            // Ensure playlist folder exists and use it
            destPath = ensurePlaylistExists(playlist.trim());
        }
        
        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        // Keep original filename or sanitize it
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// We need to parse the playlist field before multer processes the file
// So we use a different approach - pass playlist in query string
router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'NO_FILE_UPLOADED' });
    }

    const playlist = req.query.playlist || null;

    // Trigger re-index
    await LibraryModule.scanLibrary();

    res.json({
        status: 'UPLOAD_SUCCESS',
        filename: req.file.filename,
        size: req.file.size,
        playlist: playlist || 'UNCATEGORIZED'
    });
});

module.exports = router;
