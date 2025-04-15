# Firecrawl ZIP Code Data Extractor

This project provides tools to extract population and density data for US ZIP codes using the Firecrawl API.

![ZIP Code Data Extractor](https://via.placeholder.com/800x400?text=ZIP+Code+Data+Extractor)

## Features

### Command Line Tools
- Extract population and density data for ZIP codes
- Process in batches to avoid API rate limits
- Robust error handling and logging
- CSV and JSON output formats

### Web Interface
- User-friendly GUI for data extraction
- Multiple input methods (paste ZIP codes or upload CSV)
- Real-time progress tracking
- Downloadable results

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)

2. Clone this repository or download the files

3. Install the dependencies:
   ```
   npm install
   ```

## Usage Options

### Option 1: Web Interface

1. Start the web server:
   ```
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Use the web interface to:
   - Enter ZIP codes manually
   - Upload a CSV file with ZIP codes
   - Process the data and download results

### Option 2: Command Line Scripts

Several script options are available:

#### Basic Script (firecrawl_extractor.js)
```
node firecrawl_extractor.js
```
Processes all ZIP codes listed in the script.

#### Robust Script with Logging (zip_extractor_robust.js)
```
node zip_extractor_robust.js
```
More robust version with detailed logging and error handling.

#### Sample Test Script (sample_extract.js)
```
node sample_extract.js
```
Quick test with a small batch of ZIP codes.

## Project Structure

```
firecrawl-webcrawler/
├── server.js                # Express server for web interface
├── package.json             # Project configuration
├── index.js                 # Original script template
├── firecrawl_extractor.js   # Main extraction script
├── zip_extractor_robust.js  # Enhanced extraction script with logging
├── sample_extract.js        # Sample test script
├── web/                     # Web interface files
│   ├── index.html           # Main HTML interface
│   ├── styles.css           # CSS styling
│   ├── script.js            # Frontend JavaScript
│   └── sample_zips.csv      # Sample CSV for testing
├── results/                 # Generated result files
└── logs/                    # Log files from robust script
```

## Technical Details

- **Frontend**: HTML, CSS, JavaScript with Bootstrap
- **Backend**: Node.js with Express
- **API**: Firecrawl API for data extraction
- **Data Processing**: Both server-side and client-side JavaScript

## API Information

This application uses the Firecrawl API with the following key:
```
fc-4bd96b21a1fa459a9336127ab8974234
```

## Documentation

Additional documentation is available in:
- [USAGE_INSTRUCTIONS.md](USAGE_INSTRUCTIONS.md) - Command line script usage
- [README_GUI.md](README_GUI.md) - Web interface details

## Troubleshooting

- **API Rate Limiting**: By default, the scripts process ZIP codes in small batches to avoid rate limiting. You can adjust the batch size in the script settings.
- **CSV Format**: When uploading a CSV, ensure it has a column with a name containing "zip", "zipcode", "postal code", or similar.
- **Error Handling**: Check the `logs` directory for detailed error logs when using the robust script.
