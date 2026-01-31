
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const LibraryModule = require('../core/library');


const { MUSIC_DIR } = require('../paths');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, MUSIC_DIR);
    },
    filename: function (req, file, cb) {
        // Keep original filename or sanitize it
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'NO_FILE_UPLOADED' });
    }

    // Trigger re-index
    await LibraryModule.scanLibrary();

    res.json({
        status: 'UPLOAD_SUCCESS',
        filename: req.file.filename,
        size: req.file.size
    });
});

module.exports = router;
