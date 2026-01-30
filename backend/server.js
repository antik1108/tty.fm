
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (optional, for covers or assets if needed later)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/library', require('./routes/library.routes'));
app.use('/api/stream', require('./routes/stream.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/system', require('./routes/system.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ONLINE', uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`
    ┌───────────────────────────────┐
    │  TTY.FM SYSTEM SERVICE        │
    │  STATUS: ONLINE               │
    │  PORT:   ${PORT}                 │
    └───────────────────────────────┘
    `);
});
