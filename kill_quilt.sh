#!/bin/bash

# Quilt DataTools Termination Script
# This script finds and stops the Quilt DataTools server running on port 3000

# Display script header
echo "Quilt DataTools - Termination Script"
echo "------------------------------------"

# Find the process listening on port 3000
echo "Finding Quilt DataTools process on port 3000..."

# For macOS - use lsof to find the process
if [[ "$(uname)" == "Darwin" ]]; then
    PID=$(lsof -ti:3000)
# For Linux - try using netstat or ss
elif [[ "$(uname)" == "Linux" ]]; then
    PID=$(netstat -tlnp 2>/dev/null | grep ":3000" | awk '{print $7}' | cut -d'/' -f1)
    # If netstat didn't work, try ss
    if [ -z "$PID" ]; then
        PID=$(ss -tlnp 2>/dev/null | grep ":3000" | awk '{print $6}' | cut -d',' -f2 | cut -d'=' -f2)
    fi
fi

# If we found a PID, terminate it
if [ -n "$PID" ]; then
    echo "Found Quilt DataTools process running with PID: $PID"
    echo "Terminating process..."
    kill $PID
    
    # Check if the process was terminated successfully
    sleep 1
    if ps -p $PID > /dev/null 2>&1; then
        echo "Process is still running. Attempting force termination..."
        kill -9 $PID
        sleep 1
        if ps -p $PID > /dev/null 2>&1; then
            echo "Error: Failed to terminate the process."
            exit 1
        else
            echo "Process successfully terminated."
        fi
    else
        echo "Process successfully terminated."
    fi
else
    echo "No Quilt DataTools process found running on port 3000."
    exit 0
fi

echo "Quilt DataTools has been stopped."
