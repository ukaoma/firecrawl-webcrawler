# ZIP Code Data Extractor Web Interface

A web-based graphical user interface for extracting population and density data for US ZIP codes using the Firecrawl API.

![ZIP Code Data Extractor](https://via.placeholder.com/800x400?text=ZIP+Code+Data+Extractor)

## Features

- **Multiple Input Methods**: 
  - Paste ZIP codes directly (one per line or comma-separated)
  - Upload a CSV file containing ZIP codes
  
- **Flexible Processing**:
  - Process ZIP codes in batches to avoid rate limiting
  - Real-time progress tracking
  
- **Interactive Results**:
  - View results in an organized table
  - Download results as a CSV file
  
- **User-Friendly Interface**:
  - Clean, responsive design
  - Clear feedback during processing
  - Error handling and status updates

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)

2. Clone this repository or download the files

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the server:
   ```
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

### Option 1: Enter ZIP Codes Manually

1. In the "Paste ZIP Codes" tab, enter your ZIP codes:
   - One per line, or
   - Comma-separated

2. Click the "Process ZIP Codes" button

### Option 2: Upload a CSV File

1. In the "Upload CSV" tab, click "Browse" to select your CSV file
   - The CSV must have a column with a name containing "zip", "zipcode", "postal code", or similar
   
2. After upload, you'll see a preview of the first 5 rows
   
3. Click the "Process ZIP Codes" button

### Viewing and Downloading Results

1. As processing occurs, you'll see real-time updates in the results table
   
2. Each ZIP code will show:
   - Population data
   - Density data
   - Processing status
   
3. When complete, click "Download CSV" to save the results

## Technical Details

- **Frontend**: HTML, CSS, JavaScript with Bootstrap for styling
- **Backend**: Node.js with Express
- **API**: Firecrawl API for data extraction
- **Data Processing**: Client-side JavaScript for processing and handling data

## Project Structure

```
firecrawl-webcrawler/
├── server.js            # Express server
├── web/
│   ├── index.html       # Main HTML interface
│   ├── styles.css       # CSS styling
│   └── script.js        # Frontend JavaScript
├── results/             # Generated result files
└── README_GUI.md        # This documentation
```

## API Information

This application uses the Firecrawl API with the following key:
```
fc-4bd96b21a1fa459a9336127ab8974234
```

## Troubleshooting

- **CSV Upload Issues**: Ensure your CSV has a properly labeled column for ZIP codes
- **Processing Errors**: Check the console for detailed error messages
- **Rate Limiting**: If processing fails, try enabling batch processing with smaller batch sizes
