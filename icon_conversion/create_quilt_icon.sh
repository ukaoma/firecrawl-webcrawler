#!/bin/bash

# Create a script to convert the Quilt SVG to an ICNS file
echo "Creating Quilt app icon..."

# Create iconset directory
mkdir -p icon_conversion/Quilt.iconset

# Use the new Quilt icon SVG
SOURCE_ICON="icon_conversion/quilt_icon.svg"

# Generate different sizes from the SVG
SIZES=(16 32 64 128 256 512 1024)

for size in "${SIZES[@]}"; do
  echo "Generating ${size}x${size} icon..."
  
  # Regular size
  sips -s format png -z $size $size "$SOURCE_ICON" --out icon_conversion/Quilt.iconset/icon_${size}x${size}.png
  
  # Retina size (2x)
  if [ $size -lt 512 ]; then
    double=$((size * 2))
    sips -s format png -z $double $double "$SOURCE_ICON" --out icon_conversion/Quilt.iconset/icon_${size}x${size}@2x.png
  fi
done

# Create ICNS file from iconset
echo "Converting to ICNS format..."
iconutil -c icns icon_conversion/Quilt.iconset -o icon_conversion/Quilt.icns

# Prepare to copy to an app bundle if needed
echo "Icon creation complete!"
echo ""
echo "To use this icon with an app bundle, run:"
echo "cp icon_conversion/Quilt.icns [AppName].app/Contents/Resources/AppIcon.icns"
echo "touch [AppName].app  # Update icon cache"
