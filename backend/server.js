
// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Static files (optional, for covers or assets if needed later)
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/api/library', require('./routes/library.routes'));
// app.use('/api/stream', require('./routes/stream.routes'));
// app.use('/api/upload', require('./routes/upload.routes'));
// app.use('/api/system', require('./routes/system.routes'));

// // Health check
// app.get('/api/health', (req, res) => {
//     res.json({ status: 'ONLINE', uptime: process.uptime() });
// });

// // Root route
// app.get('/', (req, res) => {
//     res.send(`
//         <body style="background:black; color:#9046FF; font-family:monospace; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
//             <div style="text-align:center;">
//                 <h1>TTY.FM MAINFRAME</h1>
//                 <p>SYSTEM STATUS: <span style="color:green;">ONLINE</span></p>
//                 <p>PORT: ${PORT}</p>
//                 <p>ENDPOINTS: /api/library, /api/stream/:id, /api/upload</p>
//             </div>
//         </body>
//     `);
// });

// app.listen(PORT, () => {
//     console.log(`
//     ┌───────────────────────────────┐
//     │  TTY.FM SYSTEM SERVICE        │
//     │  STATUS: ONLINE               │
//     │  PORT:   ${PORT}                 │
//     └───────────────────────────────┘
//     `);
// });



const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;



const { MUSIC_DIR, DATA_DIR, BASE_DIR } = require('./paths');


// Make paths available to routes
app.locals.MUSIC_DIR = MUSIC_DIR;
app.locals.DATA_DIR = DATA_DIR;


// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// STATIC FILES (optional)
// ==============================
app.use("/public", express.static(path.join(BASE_DIR, "public")));

// ==============================
// API ROUTES
// ==============================
app.use("/api/library", require("./routes/library.routes"));
app.use("/api/stream", require("./routes/stream.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/system", require("./routes/system.routes"));

// ==============================
// HEALTH CHECK
// ==============================
app.get("/api/health", (req, res) => {
    res.json({
        status: "ONLINE",
        uptime: process.uptime(),
        musicDir: MUSIC_DIR
    });
});

// ==============================
// ROOT (STATUS PAGE)
// ==============================
app.get("/", (req, res) => {
    res.send(`
    <body style="background:black; color:#9046FF; font-family:monospace; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
      <div style="text-align:center;">
        <h1>TTY.FM MAINFRAME</h1>
        <p>SYSTEM STATUS: <span style="color:lime;">ONLINE</span></p>
        <p>PORT: ${PORT}</p>
        <p>MUSIC DIR: ${MUSIC_DIR}</p>
        <p>ENDPOINTS:</p>
        <p>/api/library</p>
        <p>/api/stream/:id</p>
        <p>/api/upload</p>
      </div>
    </body>
  `);
});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
    console.log(`
┌───────────────────────────────┐
│  TTY.FM SYSTEM SERVICE        │
│  STATUS: ONLINE               │
│  PORT:   ${PORT}                 │
│  MUSIC:  ${MUSIC_DIR}
└───────────────────────────────┘
  `);
});