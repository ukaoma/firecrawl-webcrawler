#!/bin/bash

# Firecrawl Launcher Script
# This script starts the Firecrawl server and opens it in the default browser

# Configuration
PROJECT_DIR="/Users/ukaoma/Documents/GitHub/firecrawl-webcrawler"
PORT=3000
URL="http://localhost:$PORT"

# Display startup message
echo "Starting Firecrawl webcrawler..."
echo "Project directory: $PROJECT_DIR"
echo "Server will be available at: $URL"

# Change to the project directory
cd "$PROJECT_DIR" || { echo "Error: Could not change to project directory!"; exit 1; }

echo "Searching for Node.js installation..."

# Check if Node.js is installed using multiple methods
NODE_PATHS=(
    # Most common Homebrew paths on macOS
    "/opt/homebrew/bin/node"
    "/usr/local/bin/node"
    # System paths
    "/usr/bin/node"
    "/opt/local/bin/node"
    # Version managers
    "$HOME/.nvm/versions/node/*/bin/node"
    "$HOME/.nodenv/shims/node"
    "$HOME/.nodenv/versions/*/bin/node"
)

NODE_FOUND=false
NODE_PATH=""

# Method 1: Check explicit paths first
echo "Method 1: Checking explicit installation paths..."
for path in "${NODE_PATHS[@]}"; do
    # Handle paths with wildcards using ls
    if [[ "$path" == *"*"* ]]; then
        # Use ls to expand wildcards
        EXPANDED_PATHS=$(ls -1 $path 2>/dev/null || echo "")
        if [ -n "$EXPANDED_PATHS" ]; then
            # Use the first match
            NODE_PATH=$(echo "$EXPANDED_PATHS" | head -n 1)
            if [ -x "$NODE_PATH" ]; then
                NODE_FOUND=true
                echo "Found Node.js at expanded path: $NODE_PATH"
                break
            fi
        fi
    elif [ -x "$path" ]; then
        NODE_FOUND=true
        NODE_PATH="$path"
        echo "Found Node.js at explicit path: $NODE_PATH"
        break
    fi
done

# Method 2: Use the login shell to find Node.js (should work well in terminal)
if ! $NODE_FOUND; then
    echo "Method 2: Using login shell to find Node.js..."
    
    # This should work well since we're already in a terminal
    NODE_PATH=$(which node 2>/dev/null || echo "")
    if [ -n "$NODE_PATH" ] && [ -x "$NODE_PATH" ]; then
        NODE_FOUND=true
        echo "Found Node.js using which command: $NODE_PATH"
    fi
    
    # Try login shells as fallback
    if ! $NODE_FOUND; then
        if command -v bash &>/dev/null; then
            NODE_PATH=$(bash -l -c 'which node' 2>/dev/null || echo "")
            if [ -n "$NODE_PATH" ] && [ -x "$NODE_PATH" ]; then
                NODE_FOUND=true
                echo "Found Node.js using bash login shell: $NODE_PATH"
            fi
        fi
        
        if ! $NODE_FOUND && command -v zsh &>/dev/null; then
            NODE_PATH=$(zsh -l -c 'which node' 2>/dev/null || echo "")
            if [ -n "$NODE_PATH" ] && [ -x "$NODE_PATH" ]; then
                NODE_FOUND=true
                echo "Found Node.js using zsh login shell: $NODE_PATH"
            fi
        fi
    fi
fi

if ! $NODE_FOUND; then
    echo "Error: Node.js is not installed or not found"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
else
    echo "Using Node.js at: $NODE_PATH"
fi

# Start the server in the background
echo "Starting Node.js server..."
# If NODE_PATH is not executable for some reason, fall back to the PATH
if [ ! -x "$NODE_PATH" ]; then
    echo "Warning: Specified Node.js path is not executable, falling back to system PATH"
    NODE_PATH="/opt/homebrew/bin/node"
    
    # Final fallback to just "node" if we still don't have a valid path
    if [ ! -x "$NODE_PATH" ]; then
        NODE_PATH="node"
    fi
fi

# Use the full path to node to ensure it works
"$NODE_PATH" server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Open the browser
echo "Opening browser at $URL"
open "$URL"

# Create a trap to handle script termination
trap cleanup INT TERM

cleanup() {
    echo -e "\nShutting down server (PID: $SERVER_PID)..."
    kill $SERVER_PID
    echo "Server shutdown complete."
    exit 0
}

# Keep the script running until Ctrl+C
echo -e "\nFirecrawl is now running"
echo "Press Ctrl+C to stop the server"
wait $SERVER_PID
