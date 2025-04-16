#!/bin/bash

# Create a script to convert the SVG to an ICNS file
echo "Creating Firecrawl app icon..."

# Create iconset directory
mkdir -p icon_conversion/Firecrawl.iconset

# Use the new fire icon SVG
SOURCE_ICON="icon_conversion/fire_icon.svg"

# Generate different sizes from the SVG
SIZES=(16 32 64 128 256 512 1024)

for size in "${SIZES[@]}"; do
  echo "Generating ${size}x${size} icon..."
  
  # Regular size
  sips -s format png -z $size $size "$SOURCE_ICON" --out icon_conversion/Firecrawl.iconset/icon_${size}x${size}.png
  
  # Retina size (2x)
  if [ $size -lt 512 ]; then
    double=$((size * 2))
    sips -s format png -z $double $double "$SOURCE_ICON" --out icon_conversion/Firecrawl.iconset/icon_${size}x${size}@2x.png
  fi
done

# Create ICNS file from iconset
echo "Converting to ICNS format..."
iconutil -c icns icon_conversion/Firecrawl.iconset -o icon_conversion/Firecrawl.icns

# Copy to the App's Resources folder
echo "Installing icon to app..."
cp icon_conversion/Firecrawl.icns Firecrawl.app/Contents/Resources/AppIcon.icns

echo "Icon creation complete!"
