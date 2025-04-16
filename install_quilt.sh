#!/bin/bash

# QuiltTools Installer Script
# This script installs the QuiltTools app to the Applications folder

echo "Quilt DataTools Installer"
echo "========================="
echo

# Check if the app bundle exists
if [ ! -d "QuiltTools.app" ]; then
    echo "Error: QuiltTools.app not found in the current directory."
    echo "Please run this script from the directory containing QuiltTools.app."
    exit 1
fi

# Default destination
DEST="/Applications"

# Ask for confirmation
echo "This will install Quilt DataTools to your Applications folder."
echo "The application requires approximately 60MB of disk space."
echo
read -p "Install Quilt DataTools to $DEST? (y/n): " CONFIRM

if [[ $CONFIRM != [Yy]* ]]; then
    echo "Installation cancelled."
    exit 0
fi

echo
echo "Installing Quilt DataTools to $DEST..."

# Check if app already exists in destination
if [ -d "$DEST/QuiltTools.app" ]; then
    echo "Quilt DataTools is already installed. Replacing existing installation..."
    rm -rf "$DEST/QuiltTools.app"
fi

# Copy app to Applications folder
cp -R QuiltTools.app "$DEST/"

# Set permissions
chmod -R 755 "$DEST/QuiltTools.app"

# Check if installation was successful
if [ -d "$DEST/QuiltTools.app" ]; then
    echo
    echo "✅ Installation successful!"
    echo
    echo "You can now launch Quilt DataTools from your Applications folder"
    echo "or search for it in Spotlight."
    
    # Ask if user wants to launch the application now
    read -p "Would you like to launch Quilt DataTools now? (y/n): " LAUNCH
    
    if [[ $LAUNCH == [Yy]* ]]; then
        echo "Launching Quilt DataTools..."
        open "$DEST/QuiltTools.app"
    else
        echo "You can launch the application later from your Applications folder."
    fi
else
    echo
    echo "❌ Installation failed. Please try again or contact support."
    exit 1
fi

echo
echo "Thank you for choosing Quilt Software!"
