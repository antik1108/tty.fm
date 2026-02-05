
const express = require('express');
const router = express.Router();
const LibraryModule = require('../core/library');
const StreamerModule = require('../core/streamer');

router.get('/:id', (req, res) => {
    const songId = req.params.id;
    const song = LibraryModule.getSongById(songId);

    if (!song) {
        return res.status(404).json({ error: 'SONG_NOT_FOUND' });
    }

    // Pass both filename and playlist to streamer
    StreamerModule.streamFile(req, res, song.filename, song.playlist);
});

module.exports = router;
