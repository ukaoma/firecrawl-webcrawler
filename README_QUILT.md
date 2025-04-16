# Quilt DataTools

Quilt DataTools is a specialty retail data utility developed for the Quilt Software platform. This application helps retailers extract ZIP code data and map website URLs with powerful ranking algorithms.

![Quilt Software](icon_conversion/quilt_icon.svg)

## Overview

This application is a rebranded version of the Firecrawl webcrawler, styled to match Quilt Software's branding and designed to integrate with Quilt's specialty retail software ecosystem. The functionality remains the same, but the interface has been updated to match Quilt's design language.

## Features

- **ZIP Code Data Extraction**: Import ZIP codes individually or in bulk to gather demographic information.
- **Website Mapping**: Crawl and map any website to discover all linked pages, with intelligent URL ranking.
- **Quilt-Integrated Design**: Styled to match Quilt Software's branding for seamless integration.
- **Self-Contained Application**: Includes a bundled Node.js runtime for maximum compatibility.

## Getting Started

### Option 1: Using the App Bundle (Recommended)

1. Run the installer script to copy the app to your Applications folder:
   ```bash
   ./install_quilt.sh
   ```

2. Launch Quilt DataTools from your Applications folder or Spotlight.

### Option 2: Using the Shell Script

Run the launcher script from the terminal:
```bash
./launch_quilt.sh
```

This will:
1. Start the Node.js server
2. Open your default browser to the Quilt-styled interface at http://localhost:3000/quilt-index.html
3. Keep running until you press Ctrl+C in the terminal

## ZIP Code Data Extraction

1. Enter ZIP codes (one per line or comma-separated) in the input field
2. Alternatively, upload a CSV file with ZIP codes
3. Click "Process ZIP Codes" to extract demographic data
4. Use the "Download CSV" button to save results

## Website Mapping

1. Enter a website URL to map (e.g., https://example.com)
2. Click "Map Website" to begin the crawling process
3. Review discovered URLs, ranked by importance
4. Use the "Download URLs" button to export a single-column CSV file with the header "URLs"

## Customization

Quilt DataTools is designed to be a drop-in solution for specialty retailers. For custom integrations with your specific retail software, please contact the Quilt Software team.

## Requirements

- macOS 10.12 or later
- No additional software required (Node.js is bundled with the application)

## For Developers

The Quilt branding files can be found in:
- `web/quilt-styles.css` - Quilt-specific CSS styles
- `web/quilt-index.html` - Quilt-branded HTML interface
- `icon_conversion/quilt_icon.svg` - Quilt icon in SVG format

To modify the Quilt branding, edit these files and restart the application.

---

Powered by Quilt Software — Specialty retail solutions that empower local merchants to compete with industry giants and keep Main Street thriving.
