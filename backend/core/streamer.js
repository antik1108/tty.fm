
const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); // Using a simpler mapping if package not avail, but we didn't install mime-types. Let's use basic lookup.


const { MUSIC_DIR } = require('../paths');


const StreamerModule = {
    streamFile(req, res, filename) {
        const filePath = path.join(MUSIC_DIR, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'FILE_NOT_FOUND' });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const contentType = this.getContentType(filename) || 'audio/mpeg';

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    },

    getContentType(filename) {
        const ext = path.extname(filename).toLowerCase();
        switch (ext) {
            case '.mp3': return 'audio/mpeg';
            case '.wav': return 'audio/wav';
            case '.ogg': return 'audio/ogg';
            case '.opus': return 'audio/opus';
            case '.m4a': return 'audio/mp4';
            case '.flac': return 'audio/flac';
            default: return 'application/octet-stream';
        }
    }
};

module.exports = StreamerModule;
