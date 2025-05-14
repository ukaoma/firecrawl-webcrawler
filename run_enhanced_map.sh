#!/bin/bash

# Run script for the enhanced website map feature
echo "======================================================"
echo "Starting Firecrawl with Enhanced Website Map Feature"
echo "======================================================"

# Kill any existing server processes
echo "Stopping any existing server processes..."
pkill -f "node server.js" || true

# Start the server
echo "Starting the server..."
node server.js &
SERVER_PID=$!

# Give the server time to start
echo "Waiting for server to start up..."
sleep 2

# Determine browser to use
if [ -n "$(command -v open)" ]; then
    # macOS
    echo "Opening browser on macOS..."
    open "http://localhost:3000/quilt-index.html"
elif [ -n "$(command -v xdg-open)" ]; then
    # Linux
    echo "Opening browser on Linux..."
    xdg-open "http://localhost:3000/quilt-index.html"
elif [ -n "$(command -v start)" ]; then
    # Windows
    echo "Opening browser on Windows..."
    start "http://localhost:3000/quilt-index.html"
else
    echo "Unable to determine system browser. Please open http://localhost:3000/quilt-index.html manually."
fi

echo ""
echo "The enhanced website map feature is now available."
echo "1. Navigate to the 'Website Map' tab"
echo "2. Enter a URL to map (e.g., https://example.com)"
echo "3. Click 'Map Website' to begin mapping"
echo ""
echo "Press Ctrl+C to stop the server when done."

# Wait for Ctrl+C
wait $SERVER_PID
