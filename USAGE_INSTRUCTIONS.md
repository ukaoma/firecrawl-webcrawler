# Zip Code Data Extractor

This project extracts population and density data for US zip codes using Firecrawl API.

## Files Overview

- `firecrawl_extractor.js` - Original script that processes all zip codes
- `zip_extractor_robust.js` - Improved version with better error handling and logging
- `sample_extract.js` - Simple test script for a small batch of zip codes

## How to Run

1. Install dependencies:
   ```
   npm install @mendable/firecrawl-js zod
   ```

2. Run the robust extractor:
   ```
   node zip_extractor_robust.js
   ```
   
   This will:
   - Process all zip codes in small batches
   - Extract population and density data
   - Save results to CSV and JSON formats in the `results` directory
   - Create detailed logs in the `logs` directory

## Output Files

- `results/zip_data_results.csv` - CSV file with columns: Zip/Postal Code, Population, Density, Error
- `results/zip_data_results.json` - JSON file with the same data

## Using the Results

To use the extracted data with your spreadsheet:
1. Open the CSV file in Excel/Google Sheets
2. Copy the Population and Density columns
3. Paste into your spreadsheet where needed
4. Match the zip codes to ensure data is aligned correctly

## Handling Errors and Resuming

If the script is interrupted:
1. Check the logs to see where it stopped
2. The script saves intermediate results after each batch
3. If needed, you can modify the zip code list in the script to start from where it left off

## API Key

This project uses Firecrawl API with key: `fc-4bd96b21a1fa459a9336127ab8974234`

## Results Format

Example of the extracted data:
```
Zip/Postal Code,Population,Density
02532,13180,956.22
02536,21100,771.24
02723,17111,10732.64
