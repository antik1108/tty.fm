
const express = require('express');
const router = express.Router();
const LibraryModule = require('../core/library');

router.get('/', (req, res) => {
    const library = LibraryModule.getLibrary();
    res.json(library);
});

router.post('/refresh', async (req, res) => {
    const library = await LibraryModule.scanLibrary();
    res.json({ status: 'REFRESHED', count: library.length });
});

module.exports = router;
