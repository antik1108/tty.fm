#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════╗
# ║                    TTY.FM STARTUP SCRIPT                      ║
# ║         Personal Cloud Music System - Setup & Launch          ║
# ╚═══════════════════════════════════════════════════════════════╝

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
MUSIC_DIR="$HOME/tty-fm/music"

# Print styled header
print_header() {
    echo -e "${PURPLE}"
    echo "┌───────────────────────────────────────┐"
    echo "│         TTY.FM SYSTEM LOADER          │"
    echo "│         ══════════════════════        │"
    echo "└───────────────────────────────────────┘"
    echo -e "${NC}"
}

# Print status message
log_info() {
    echo -e "${PURPLE}[TTY.FM]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists pacman; then
            echo "arch"
        elif command_exists apt; then
            echo "debian"
        elif command_exists dnf; then
            echo "fedora"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Install Node.js based on OS
# Check and install Node.js
check_nodejs() {
    log_info "Checking for Node.js..."
    
    if command_exists node; then
        local node_version=$(node --version)
        log_success "Node.js found: $node_version"
        
        # Check if version is >= 18
        local major_version=$(echo $node_version | cut -d'.' -f1 | tr -d 'v')
        if [ "$major_version" -lt 18 ]; then
            log_error "Node.js version is below 18. Please upgrade Node.js on this server."
            exit 1
        fi
    else
        log_error "Node.js not found. Please install Node.js (>=18) and rerun."
        exit 1
    fi
}

# Check and install npm
check_npm() {
    log_info "Checking for npm..."
    
    if command_exists npm; then
        local npm_version=$(npm --version)
        log_success "npm found: v$npm_version"
    else
        log_error "npm not found. This should have been installed with Node.js"
        exit 1
    fi
}

# Install backend dependencies
install_backend_deps() {
    log_info "Checking backend dependencies..."
    
    if [ -d "$BACKEND_DIR/node_modules" ]; then
        log_success "Backend dependencies already installed"
    else
        log_info "Installing backend dependencies..."
        cd "$BACKEND_DIR"
        npm install
        log_success "Backend dependencies installed"
    fi
}

# Install frontend dependencies
install_frontend_deps() {
    log_info "Checking frontend dependencies..."
    
    if [ -d "$FRONTEND_DIR/node_modules" ]; then
        log_success "Frontend dependencies already installed"
    else
        log_info "Installing frontend dependencies..."
        cd "$FRONTEND_DIR"
        npm install
        log_success "Frontend dependencies installed"
    fi
}

# Create music directory
setup_music_dir() {
    log_info "Checking music directory..."
    
    if [ -d "$MUSIC_DIR" ]; then
        log_success "Music directory exists: $MUSIC_DIR"
    else
        log_info "Creating music directory..."
        mkdir -p "$MUSIC_DIR"
        log_success "Music directory created: $MUSIC_DIR"
    fi
    
    # Count songs
    local song_count=$(find "$MUSIC_DIR" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.ogg" -o -name "*.opus" -o -name "*.m4a" -o -name "*.flac" \) 2>/dev/null | wc -l | tr -d ' ')
    log_info "Found $song_count song(s) in library"
}

# Kill any existing processes on our ports
cleanup_ports() {
    log_info "Checking for processes on ports 3000 and 3001..."
    
    if ! command_exists lsof; then
        log_warning "lsof not found; skipping port cleanup"
        return
    fi
    
    # Kill process on port 3001 (backend)
    if lsof -ti:3001 &> /dev/null; then
        log_warning "Killing existing process on port 3001..."
        lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    fi
    
    # Kill process on port 3000 (frontend)
    if lsof -ti:3000 &> /dev/null; then
        log_warning "Killing existing process on port 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    fi
    
    log_success "Ports cleared"
}

# Start the servers
start_servers() {
    echo ""
    echo -e "${PURPLE}┌───────────────────────────────────────┐${NC}"
    echo -e "${PURPLE}│         STARTING TTY.FM SERVERS       │${NC}"
    echo -e "${PURPLE}└───────────────────────────────────────┘${NC}"
    echo ""
    
    # Start backend in background
    log_info "Starting backend server..."
    cd "$BACKEND_DIR"
    npm start &
    BACKEND_PID=$!
    sleep 2
    
    # Start frontend in background
    log_info "Starting frontend server..."
    cd "$FRONTEND_DIR"
    npm run dev -- --host &
    FRONTEND_PID=$!
    sleep 3
    
    echo ""
    echo -e "${GREEN}┌───────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│         TTY.FM IS NOW ONLINE!         │${NC}"
    echo -e "${GREEN}├───────────────────────────────────────┤${NC}"
    echo -e "${GREEN}│  Backend:  http://localhost:3001      │${NC}"
    echo -e "${GREEN}│  Frontend: http://localhost:3000      │${NC}"
    echo -e "${GREEN}│                                       │${NC}"
    echo -e "${GREEN}│  Music folder: ~/tty-fm/music         │${NC}"
    echo -e "${GREEN}│                                       │${NC}"
    echo -e "${GREEN}│  Press Ctrl+C to stop servers         │${NC}"
    echo -e "${GREEN}└───────────────────────────────────────┘${NC}"
    echo ""
    
    # Handle graceful shutdown
    trap 'log_info "Shutting down..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' SIGINT SIGTERM
    
    # Wait for both processes
    wait
}

# Main execution
main() {
    print_header
    
    log_info "Detected OS: $(detect_os)"
    echo ""
    
    # Step 1: Check Node.js
    check_nodejs
    
    # Step 2: Check npm
    check_npm
    
    # Step 3: Install backend dependencies
    install_backend_deps
    
    # Step 4: Install frontend dependencies
    install_frontend_deps
    
    # Step 5: Setup music directory
    setup_music_dir
    
    # Step 6: Cleanup ports
    cleanup_ports
    
    # Step 7: Start servers
    start_servers
}

# Run main function
main