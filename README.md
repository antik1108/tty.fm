# 📻 TTY.FM

```
████████╗████████╗██╗   ██╗   ███████╗███╗   ███╗
╚══██╔══╝╚══██╔══╝╚██╗ ██╔╝   ██╔════╝████╗ ████║
   ██║      ██║    ╚████╔╝    █████╗  ██╔████╔██║
   ██║      ██║     ╚██╔╝     ██╔══╝  ██║╚██╔╝██║
   ██║      ██║      ██║   ██╗██║     ██║ ╚═╝ ██║
   ╚═╝      ╚═╝      ╚═╝   ╚═╝╚═╝     ╚═╝     ╚═╝
```

**A cyberpunk terminal-themed music streaming system** — built for learning how real infrastructure works, not just how to click deploy buttons.

> This isn't just another music player. It's my journey into understanding servers, self-hosting, reverse tunnels, and DevOps — while building something that actually looks cool.

---

## 🎯 Why This Exists

I got tired of abstractions. Tired of "just deploy to Vercel" without understanding what's actually happening under the hood.

**This project is about:**
- 🔧 Learning infrastructure from scratch
- 🌐 Understanding how the internet *really* works
- 🚀 Self-hosting applications from behind CGNAT
- 🛡️ Using Tailscale for secure networking
- ⚡ Managing processes with PM2
- 🎵 Building something fun while learning DevOps

Yes, it's a music player. But it's also my playground for understanding:
- How reverse tunneling bypasses NAT
- How range requests work for audio streaming
- How to keep services alive with process managers
- How to expose localhost to the world securely
- How WebSocket connections and real-time streaming actually function

**For the developers who want to understand infrastructure, not just use it.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎵 **Audio Streaming** | HTTP range request support for seamless playback |
| 📚 **Smart Library** | Tag-based metadata extraction (artist, album, genre) |
| 🎼 **Playlists** | Organize your music collection with folders |
| 📤 **Upload System** | Drag-and-drop music files with progress tracking |
| 📊 **System Monitoring** | Real-time logs, node stats, and uptime tracking |
| 🖥️ **Terminal UI** | Cyberpunk aesthetic with scanlines and glitch effects |
| 🎚️ **Media Controls** | Volume, seek, play/pause with keyboard shortcuts |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🔄 **Auto-Reconnect** | Frontend handles backend restarts gracefully |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          USERS                              │
└─────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   TAILSCALE     │  │  REVERSE TUNNEL │  │   LOCAL NET     │
│   (Secure VPN)  │  │   (Cloudflare)  │  │  (Development)  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   NGINX/Proxy   │
                    │   (if needed)   │
                    └─────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   FRONTEND      │  │    BACKEND      │  │   FILE SYSTEM   │
│  (React+Vite)   │  │  (Node/Express) │  │   (Music Dir)   │
│                 │  │                 │  │                 │
│  Port 5173      │◄─┤  Port 3001      │──┤  ~/tty-fm/music │
│  TypeScript     │  │  Music Metadata │  │  Organized by   │
│  Cyber UI       │  │  Stream Handler │  │  Playlists      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**The Self-Hosting Setup:**
- 🏠 Running from my laptop (no cloud servers!)
- 🔒 Tailscale for secure peer-to-peer networking
- 🌐 Reverse tunnel (Cloudflare/SSH) to bypass CGNAT
- ⚡ PM2 to keep services alive 24/7
- 📁 Music files stored locally, served via HTTP range requests

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks |
| **TypeScript** | Type safety and better DX |
| **Vite 6** | Lightning-fast dev server |
| **CSS3** | Custom cyber terminal theme |
| **Fetch API** | HTTP streaming with range headers |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | Web server framework |
| **music-metadata** | Extract tags from audio files |
| **Multer** | File upload handling |
| **fs/streams** | Range request streaming |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **PM2** | Process manager (keep it alive!) |
| **Tailscale** | Zero-config VPN mesh network |
| **Cloudflare Tunnel** | Expose localhost publicly |
| **Bash Scripts** | Automated setup and deployment |
| **Git** | Version control |

---

## 📁 Project Structure

```
TTY.FM/
├── start.sh                    # One-command startup script
│
├── backend/                    # Node.js/Express API
│   ├── server.js               # Main entry point
│   ├── paths.js                # Path configuration
│   ├── package.json
│   ├── core/
│   │   ├── library.js          # Music metadata extraction
│   │   ├── streamer.js         # HTTP range request handler
│   │   └── system.js           # System stats & monitoring
│   ├── routes/
│   │   ├── library.routes.js   # GET /api/library
│   │   ├── stream.routes.js    # GET /api/stream/:id
│   │   ├── upload.routes.js    # POST /api/upload
│   │   ├── playlist.routes.js  # Playlist management
│   │   └── system.routes.js    # System logs/stats
│   └── data/
│       └── library.json        # Cached music metadata
│
├── frontend/                   # React + TypeScript
│   ├── App.tsx                 # Main application component
│   ├── index.tsx               # React entry point
│   ├── types.ts                # TypeScript definitions
│   ├── constants.ts            # UI constants
│   ├── components/
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── Sidebar.tsx         # Playlist navigation
│   │   ├── MainContent.tsx     # Song list/grid view
│   │   ├── Footer.tsx          # Audio player controls
│   │   ├── RightPanel.tsx      # Current song info
│   │   ├── SystemLogs.tsx      # Real-time system logs
│   │   └── UploadPanel.tsx     # File upload interface
│   ├── services/
│   │   ├── LibraryService.ts   # API calls to backend
│   │   └── SystemService.ts    # System monitoring API
│   └── package.json
│
└── ~/tty-fm/music/             # Music storage (user home)
    ├── song1.mp3
    ├── song2.opus
    └── MyPlaylist/             # Playlist folders
        ├── track1.mp3
        └── track2.flac
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- **A music collection** (MP3, FLAC, OGG, OPUS, WAV, M4A)
- **Optional:** Tailscale account (for remote access)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/TTY.FM.git
cd TTY.FM

# Make the startup script executable
chmod +x start.sh

# Run it!
./start.sh
```

**The script will:**
1. ✅ Kill any processes on ports 3001/5173
2. ✅ Create music directory at `~/tty-fm/music`
3. ✅ Install backend dependencies
4. ✅ Install frontend dependencies
5. ✅ Start backend on port 3001
6. ✅ Start frontend on port 5173
7. ✅ Open browser to http://localhost:5173

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Backend running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

### Add Your Music

```bash
# Copy files directly
cp ~/Downloads/*.mp3 ~/tty-fm/music/

# Or create a playlist folder
mkdir ~/tty-fm/music/Synthwave
cp ~/Music/synthwave/*.flac ~/tty-fm/music/Synthwave/

# Or use the upload interface in the app!
```

---

## 🌐 Self-Hosting Setup

### The Problem: CGNAT

If you're behind college Wi-Fi, mobile hotspot, or shared networks, you can't just open ports. Your device has a **private IP** and incoming connections are blocked.

**Traditional hosting won't work because:**
- ❌ You don't have a public IP
- ❌ You can't configure router port forwarding
- ❌ ISP blocks incoming connections (CGNAT)

### Solution 1: Tailscale (My Personal Network)

Tailscale creates a secure mesh VPN. Your devices get stable IPs that work anywhere.

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# Your machine gets an IP like 100.x.x.x
# Access from any Tailscale device: http://100.x.x.x:5173
```

**Why I love Tailscale:**
- Zero configuration VPN
- Works through any NAT/firewall
- Encrypted by default
- MagicDNS for easy hostnames
- Perfect for accessing my server from anywhere

### Solution 2: Cloudflare Tunnel (Public Access)

For making it accessible to everyone (not just me):

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create tty-fm

# Route traffic
cloudflared tunnel route dns tty-fm music.yourdomain.com

# Run tunnel
cloudflared tunnel run tty-fm
```

### Solution 3: SSH Reverse Tunnel

```bash
# Expose to public via a VPS you control
ssh -R 80:localhost:5173 user@your-vps.com
```

---

## 🔧 Production Deployment with PM2

Keep your server running 24/7, even after closing the terminal:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "tty-fm-backend"

# Start frontend build
cd frontend
npm run build
pm2 serve dist 5173 --name "tty-fm-frontend" --spa

# Save PM2 process list
pm2 save

# Auto-start on system boot
pm2 startup
# Follow the command it gives you

# Monitor processes
pm2 monit

# View logs
pm2 logs tty-fm-backend
```

---

## 🎮 Usage

### Basic Controls

| Action | Keyboard Shortcut |
|--------|-------------------|
| Play/Pause | **Space** |
| Next Song | **→** or **N** |
| Previous Song | **←** or **P** |
| Volume Up | **↑** |
| Volume Down | **↓** |
| Mute | **M** |
| Toggle Fullscreen | **F** |

### Features Walkthrough

1. **Library View** — See all your music with metadata
2. **Playlists** — Click folders in the sidebar
3. **Upload** — Drag & drop files or click to browse
4. **System Logs** — Watch real-time backend activity
5. **Search** — Filter songs by title, artist, or album
6. **Queue Management** — Click songs to play immediately

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status and uptime |
| `GET` | `/api/library` | List all songs |
| `GET` | `/api/library/:playlist` | Songs in specific playlist |
| `GET` | `/api/stream/:id` | Stream audio (range requests) |
| `POST` | `/api/upload` | Upload music files |
| `GET` | `/api/playlists` | List all playlists |
| `POST` | `/api/playlists` | Create new playlist |
| `GET` | `/api/system/stats` | System statistics |
| `GET` | `/api/system/logs` | Recent system logs |

---

## 🎨 The Cyberpunk Aesthetic

### Design Philosophy

- **Monospace fonts** — Everything feels like a terminal
- **Purple/Green color scheme** — Classic hacker vibes
- **Scanline effects** — Retro CRT monitor look
- **Glitch borders** — Animated neon accents
- **System logs** — Real-time activity feels alive
- **ASCII art** — Because we're not afraid of the 80s

### Color Palette

```css
--matrix-green: #00ff41      /* Primary accent */
--cyber-cyan: #00f0ff         /* Links and highlights */
--neon-purple: #9046ff        /* Buttons and borders */
--alert-yellow: #ffff00       /* Warnings */
--terminal-black: #0a0a0a     /* Background */
--input-gray: #1a1a1a         /* Input fields */
```

---

## 🧠 What I Learned Building This

### DevOps Concepts
- How **CGNAT** works and why it blocks self-hosting
- **Reverse tunneling** as a solution to NAT traversal
- **Process management** with PM2 for always-on services
- **Service monitoring** and log aggregation
- **Graceful error handling** for network failures

### Networking
- **Tailscale's WireGuard** mesh VPN architecture
- **HTTP range requests** for audio streaming
- **WebSocket connections** for real-time updates
- **CORS policies** and cross-origin resource sharing
- **DNS configuration** for custom domains

### Backend Engineering
- **Stream handling** with fs.createReadStream()
- **Metadata extraction** from audio files
- **File upload** with multipart/form-data
- **RESTful API design** patterns
- **Error handling** and status codes

### Frontend Development
- **React Hooks** (useState, useEffect, useRef, useCallback)
- **TypeScript** type safety
- **Audio API** in browsers
- **Custom CSS** animations and effects
- **Responsive design** patterns

### System Administration
- **Linux process management**
- **Port management** and conflict resolution
- **File system organization**
- **Bash scripting** for automation
- **Environment configuration**

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use the start.sh script (it handles this)
./start.sh
```

### Backend Can't Find Music

```bash
# Check if music directory exists
ls -la ~/tty-fm/music

# Create it if missing
mkdir -p ~/tty-fm/music

# Add a test file
cp ~/Downloads/song.mp3 ~/tty-fm/music/
```

### Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check firewall isn't blocking
# macOS: System Settings > Network > Firewall
# Linux: sudo ufw status

# Verify CORS is enabled in backend/server.js
```

### PM2 Process Crashes

```bash
# View logs
pm2 logs tty-fm-backend --lines 100

# Restart process
pm2 restart tty-fm-backend

# Check PM2 status
pm2 list
```

### Tailscale Not Working

```bash
# Check Tailscale status
tailscale status

# Restart Tailscale
sudo tailscale down
sudo tailscale up

# Verify your Tailscale IP
ip addr show tailscale0
```

---

## 🚧 Roadmap

**Current Focus:**
- [x] Basic music streaming
- [x] Playlist management
- [x] Upload functionality
- [x] System monitoring
- [ ] **User authentication** (learning about JWT)
- [ ] **WebSocket for live logs** (learning Socket.io)
- [ ] **Mobile app** (learning React Native)

**Future Ideas:**
- **Docker containers** — Easier deployment
- **Kubernetes** — Learning orchestration
- **Prometheus metrics** — Better monitoring
- **Redis caching** — Performance optimization
- **CDN integration** — For static assets
- **CI/CD pipeline** — Automated testing & deployment

*This isn't just a project. It's my DevOps bootcamp.*

---

## 🤝 Contributing

This is a personal learning project, but if you find bugs or have suggestions:

1. **Fork the repo**
2. **Create a feature branch** (`git checkout -b feature/cool-thing`)
3. **Commit your changes** (`git commit -m 'Add cool thing'`)
4. **Push to branch** (`git push origin feature/cool-thing`)
5. **Open a Pull Request**

---

## 📝 License

MIT License - Do whatever you want with this code.

---

## 💭 Final Thoughts

**Why build this when Spotify exists?**

Because clicking "deploy" teaches you nothing about how computers talk to each other. This project forced me to understand:
- Why localhost isn't accessible from the internet
- How tunnels bypass NAT
- Why process managers exist
- How audio streaming actually works
- What happens when you type a URL

**The best way to learn is to build.**

And hey, it looks pretty cool too. 🎵

---

## 🔗 Connect

If you're also learning DevOps/infrastructure and want to chat:
- **GitHub:** [@antik1108](https://github.com/antik1108)
- **Project:** [github.com/antik1108/TTY.FM](https://github.com/antik1108/TTY.FM)

**Built with curiosity, caffeine, and a lot of Stack Overflow.**

```
EOF 2026 — self-hosted from a laptop
```
