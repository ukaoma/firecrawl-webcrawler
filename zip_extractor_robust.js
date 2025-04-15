const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');

// List of all zip codes
const zipCodes = [
  '02532', '02536', '02723', '02762', '02840', '03246', '06418', '06710', '08009', '08723', 
  '08724', '11040', '11743', '11768', '11772', '13669', '14760', '15108', '15146', '15234', 
  '15235', '15401', '15650', '15714', '15902', '15954', '16001', '16201', '16801', '23235', 
  '26003', '26070', '27909', '30046', '30060', '30083', '30132', '30144', '30341', '30518', 
  '30529', '31520', '32084', '32136', '32250', '32257', '32501', '32703', '32935', '32967', 
  '33060', '33311', '33455', '33458', '33570', '33612', '33713', '33765', '33948', '33990', 
  '34112', '34134', '34205', '34231', '34606', '34668', '34711', '35630', '35810', '40218', 
  '40219', '40223', '40601', '41076', '42002', '42351', '42701', '42718', '43055', '43130', 
  '43213', '43613', '43713', '44256', '44483', '44512', '45040', '45150', '45230', '45232'
];

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const BATCH_SIZE = 5; // Process in smaller batches to avoid rate limiting
const LOGS_DIR = "logs";
const RESULTS_DIR = "results";
const TIMEOUT_MS = 120000; // 2 minute timeout for API calls

// Create directories if they don't exist
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

// Setup logger
const logFile = path.join(LOGS_DIR, `extraction_log_${new Date().toISOString().replace(/:/g, '-')}.txt`);
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n');
}

// Initialize the Firecrawl app
let app;
try {
  app = new firecrawlJs.default({apiKey: API_KEY});
  log(`FireCrawl app initialized successfully with API key: ${API_KEY}`);
} catch (error) {
  log(`Error initializing FireCrawl app: ${error}`, 'ERROR');
  process.exit(1);
}

// Define the schema for extracting data
const schema = z.object({
  zip_data: z.array(z.object({
    zip_code: z.string(),
    population: z.number(),
    density: z.number()
  }))
});

// Process zip codes with configurable timeout
async function processZipCodes() {
  log('Starting zip code processing');
  
  // Results container
  const results = [];
  
  // Process in batches
  for (let i = 0; i < zipCodes.length; i += BATCH_SIZE) {
    const batch = zipCodes.slice(i, i + BATCH_SIZE);
    log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(zipCodes.length/BATCH_SIZE)}: ${batch.join(', ')}`);
    
    // Create URLs for this batch
    const urls = batch.map(zip => `https://simplemaps.com/us-zips/${zip}`);
    
    try {
      // Create a promise with timeout
      const extractPromise = app.extract(
        urls, 
        {
          prompt: "Extract the population and density from the specific URLs / Zip codes I provide you with.",
          schema,
        }
      );
      
      // Add timeout capability
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out')), TIMEOUT_MS)
      );
      
      // Race the promises
      const extractResult = await Promise.race([extractPromise, timeoutPromise]);
      
      log(`Raw API response: ${JSON.stringify(extractResult)}`);
      
      // Process results - handle different response formats
      let extractedData = [];
      
      if (extractResult && extractResult.data && extractResult.data.zip_data) {
        // Format 1: New format with data property
        extractedData = extractResult.data.zip_data;
      } else if (extractResult && extractResult.zip_data) {
        // Format 2: Direct format
        extractedData = extractResult.zip_data;
      } else {
        log(`No zip_data found in response: ${JSON.stringify(extractResult)}`, 'WARNING');
      }
      
      // Process each extracted item
      if (extractedData.length > 0) {
        extractedData.forEach(item => {
          log(`Successfully extracted data for zip code ${item.zip_code}: Population: ${item.population}, Density: ${item.density}`);
          
          results.push({
            zip_code: item.zip_code,
            population: item.population,
            density: item.density
          });
        });
      } else {
        log(`No data extracted for batch: ${batch.join(', ')}`, 'WARNING');
        
        // Add placeholder entries for this batch
        batch.forEach(zip => {
          results.push({
            zip_code: zip,
            population: null,
            density: null,
            error: 'No data extracted'
          });
        });
      }
      
    } catch (error) {
      log(`Error extracting data for batch ${batch.join(', ')}: ${error}`, 'ERROR');
      
      // Add error entries for this batch
      batch.forEach(zip => {
        results.push({
          zip_code: zip,
          population: null,
          density: null,
          error: error.toString()
        });
      });
    }
    
    // Save intermediate results
    const resultsFile = path.join(RESULTS_DIR, 'zip_data_results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    const csvFile = path.join(RESULTS_DIR, 'zip_data_results.csv');
    let csvContent = "Zip/Postal Code,Population,Density,Error\n";
    results.forEach(item => {
      csvContent += `${item.zip_code},${item.population || ''},${item.density || ''},${item.error || ''}\n`;
    });
    fs.writeFileSync(csvFile, csvContent);
    
    log(`Saved intermediate results (${results.length} records) to ${resultsFile} and ${csvFile}`);
    
    // Add a small delay between batches
    if (i + BATCH_SIZE < zipCodes.length) {
      log(`Waiting 5 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  log(`Processing complete. Total records: ${results.length}`);
  const successCount = results.filter(r => r.population !== null && r.density !== null).length;
  log(`Successful extractions: ${successCount} out of ${results.length} (${(successCount/results.length*100).toFixed(1)}%)`);
  
  return results;
}

// Run the process
(async () => {
  try {
    log('Starting extraction process for zip code data');
    const results = await processZipCodes();
    log('Process completed successfully');
  } catch (error) {
    log(`An unhandled error occurred: ${error}`, 'ERROR');
    log(error.stack, 'ERROR');
  }
})();
