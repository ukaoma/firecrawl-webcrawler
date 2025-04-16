# Firecrawl Application Launcher

This directory contains a macOS application bundle (`Firecrawl.app`) and a shell script (`launch_firecrawl.sh`) that can be used to launch the Firecrawl web crawler.

## Using Firecrawl.app

The Firecrawl.app is a macOS application bundle that allows you to launch the Firecrawl web crawler with a double-click.

### Installation

1. Copy the `Firecrawl.app` to your Applications folder:
   ```
   cp -r Firecrawl.app /Applications/
   ```

   Or use the installer script:
   ```
   ./install_firecrawl.sh
   ```

2. You can then launch it from your Applications folder or Spotlight.

### Features

- Automatically starts the Node.js server
- Opens your default web browser to the application (http://localhost:3000)
- Shows a notification when the server is running
- Automatically shuts down the server when the application is closed
- Contains an embedded Node.js runtime - no system installation needed
- Custom application icon

### Self-Contained Node.js Runtime

The Firecrawl.app now includes a bundled Node.js runtime:

1. No system Node.js installation is required to run the application
2. Uses the embedded Node.js executable inside the app bundle
3. Works reliably when launched from Finder, Dock, or Spotlight 
4. Provides clear error messages if there are any problems

### Troubleshooting

- If the app doesn't start, check the log file which is created in your temporary directory
- Ensure the project path in the app is correct (currently set to: `/Users/ukaoma/Documents/GitHub/firecrawl-webcrawler`)
- If you receive a security warning, right-click on the app and select "Open" the first time

## Using the Shell Script

If you prefer using a terminal, you can use the provided shell script:

1. Open Terminal
2. Navigate to the directory containing the script:
   ```
   cd /path/to/firecrawl-webcrawler
   ```
3. Run the script:
   ```
   ./launch_firecrawl.sh
   ```
4. Press Ctrl+C in the terminal when you want to stop the server

## Customizing the Application

If you need to change the project path in the application, edit the following files:
- `Firecrawl.app/Contents/MacOS/Firecrawl` - Update the `PROJECT_DIR` variable
- `launch_firecrawl.sh` - Update the `PROJECT_DIR` variable

## Custom Icon

The application now includes a custom Firecrawl icon that shows in Finder, Dock, and application switcher. The icon was created from the SVG file and converted to the proper macOS icon format (.icns).

If you want to change the icon:

1. Create or obtain an icon image (SVG or PNG format recommended)
2. Run the icon conversion script:
   ```
   ./icon_conversion/create_icon.sh
   ```
3. Reset the macOS icon cache:
   ```
   touch Firecrawl.app
