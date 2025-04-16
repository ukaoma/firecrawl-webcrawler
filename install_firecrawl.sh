#!/bin/bash

# Firecrawl Installer Script
# This script installs the Firecrawl application to the Applications folder

echo "Firecrawl Installer"
echo "=================="
echo ""

# Define paths
APP_NAME="Firecrawl.app"
SOURCE_PATH="$(pwd)/$APP_NAME"
TARGET_PATH="/Applications/$APP_NAME"

# Check if app exists in current directory
if [ ! -d "$SOURCE_PATH" ]; then
    echo "Error: $APP_NAME not found in the current directory."
    echo "Please run this script from the directory containing $APP_NAME."
    exit 1
fi

echo "This will install Firecrawl to your Applications folder."
echo "The application will be available from your Launchpad and Applications folder."
echo ""
read -p "Do you want to continue? (y/n): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Installation cancelled."
    exit 0
fi

echo ""
echo "Installing Firecrawl to Applications folder..."

# Copy the app to Applications folder
if cp -R "$SOURCE_PATH" "$TARGET_PATH"; then
    echo "Installation successful!"
    echo "You can now launch Firecrawl from your Applications folder or Launchpad."
    
    # Ask if user wants to launch the app now
    echo ""
    read -p "Would you like to launch Firecrawl now? (y/n): " LAUNCH
    
    if [[ "$LAUNCH" == "y" || "$LAUNCH" == "Y" ]]; then
        echo "Launching Firecrawl..."
        open "$TARGET_PATH"
    fi
else
    echo "Error: Failed to copy $APP_NAME to Applications folder."
    echo "You may need administrator privileges. Try again with sudo:"
    echo "sudo cp -R \"$SOURCE_PATH\" \"$TARGET_PATH\""
    exit 1
fi

echo ""
echo "Installation complete."
