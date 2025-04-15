const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');
const fs = require('fs');

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
  '43213', '43613', '43713', '44256', '44483', '44512', '45040', '45150', '45230', '45232', 
  '45238', '45239', '45241', '45417', '45505', '45804', '46060', '46733', '46802', '46970', 
  '47265', '47305', '47546', '47591', '47713', '48040', '48071', '48315', '48329', '48651', 
  '48653', '48661', '48763', '48910', '49007', '49202', '49203', '49686', '49707', '49801', 
  '49837', '49841', '49854', '49855', '49870', '49911', '49930', '49938', '49946', '49953', 
  '50315', '50324', '53027', '53037', '53066', '53072', '53073', '53074', '53083', '53086', 
  '53090', '53142', '53185', '53189', '53202', '53215', '53223', '53228', '53404', '53511', 
  '53538', '53551', '53566', '53589', '53590', '53597', '53703', '53713', '53719', '53901', 
  '53913', '53916', '53959', '53965', '54129', '54143', '54220', '54302', '54449', '54868', 
  '54901', '54914', '54935', '54956', '55102', '55376', '55407', '57783', '60048', '60101', 
  '60160', '60185', '60462', '60506', '62205', '62208', '63011', '63026', '63031', '63074', 
  '63116', '63125', '63141', '63303', '67337', '68046', '68102', '68134', '68144', '70072', 
  '70360', '70737', '70805', '72616', '75220', '75702', '76574', '77803', '79401', '82001', 
  '82601', '83201', '83301', '83605', '83651', '83703', '83814', '85020', '85122', '85254', 
  '85323', '85378', '85541', '85546', '85602', '85635', '85701', '85712', '85938', '86004', 
  '86305', '86333', '87031', '87036', '87110', '88005', '88030', '90031', '90804', '93950', 
  '94025', '94080', '94401', '94513', '94523', '94550', '94555', '94565', '95363', '95457', 
  '95531', '95825', '97457', '97739', '98028', '98032', '98057', '98203', '98272', '98310', 
  '98366', '98409', '99403', '99801'
];

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const BATCH_SIZE = 10; // Process in batches to avoid rate limiting
const INPUT_FILE = "zip_data.csv";
const OUTPUT_FILE = "zip_data_updated.csv";

// Initialize the Firecrawl app
const app = new firecrawlJs.default({apiKey: API_KEY});

// Define the schema for extracting data
const schema = z.object({
  zip_data: z.array(z.object({
    zip_code: z.string(),
    population: z.number(),
    density: z.number()
  }))
});

// Create initial CSV data from zip codes
function createInitialCSV() {
  console.log("Creating initial CSV file...");
  
  // Create CSV header
  let csvContent = "Zip/Postal Code,Website,Converted,Population Density,Population\n";
  
  // Add rows for each zip code
  zipCodes.forEach(zip => {
    const website = `https://simplemaps.com/us-zips/${zip}`;
    csvContent += `${zip},${website},FALSE,,\n`;
  });
  
  // Write to file
  fs.writeFileSync(INPUT_FILE, csvContent);
  console.log(`Initial CSV file created at ${INPUT_FILE}`);
}

// Process data in batches
async function processZipCodeBatches() {
  // Ensure we have the initial CSV file
  if (!fs.existsSync(INPUT_FILE)) {
    createInitialCSV();
  }
  
  // Read the CSV file
  const csvContent = fs.readFileSync(INPUT_FILE, 'utf8');
  const lines = csvContent.split('\n');
  const header = lines[0];
  
  // Parse the CSV to extract zip codes and their current data
  const zipData = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const parts = lines[i].split(',');
    zipData.push({
      zip: parts[0],
      website: parts[1] || `https://simplemaps.com/us-zips/${parts[0]}`,
      converted: parts[2] === 'TRUE',
      density: parts[3] || '',
      population: parts[4] || ''
    });
  }
  
  // Create the output file with the header
  fs.writeFileSync(OUTPUT_FILE, header + '\n');
  
  // Process in batches - only those that haven't been converted yet
  const zipDataToProcess = zipData.filter(item => !item.converted);
  const totalBatches = Math.ceil(zipDataToProcess.length / BATCH_SIZE);
  
  console.log(`Total zip codes to process: ${zipDataToProcess.length}`);
  console.log(`Processing in ${totalBatches} batches of ${BATCH_SIZE}...`);
  
  for (let i = 0; i < zipDataToProcess.length; i += BATCH_SIZE) {
    const batchData = zipDataToProcess.slice(i, i + BATCH_SIZE);
    const batchZips = batchData.map(item => item.zip);
    const batchUrls = batchData.map(item => `https://simplemaps.com/us-zips/${item.zip}`);
    
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${totalBatches}...`);
    console.log(`Zip codes: ${batchZips.join(', ')}`);
    
    try {
      const extractResult = await app.extract(
        batchUrls, 
        {
          prompt: "Extract the population and density from the specific URLs / Zip codes I provide you with.",
          schema,
        }
      );
      
      if (extractResult && extractResult.zip_data) {
        const extractedData = extractResult.zip_data;
        
        // Update the zipData with the extracted information
        for (let j = 0; j < batchZips.length; j++) {
          const zip = batchZips[j];
          const zipIndex = zipData.findIndex(z => z.zip === zip);
          
          // Look for matching data in the extracted results
          const item = extractedData.find(extractedItem => 
            extractedItem.zip_code === zip || 
            extractedItem.zip_code.replace(/^0+/, '') === zip.replace(/^0+/, '')
          );
          
          if (item && zipIndex !== -1) {
            zipData[zipIndex].population = item.population;
            zipData[zipIndex].density = item.density;
            zipData[zipIndex].converted = true;
            
            console.log(`Successfully extracted data for zip code ${zip}: Population: ${item.population}, Density: ${item.density}`);
          } else if (zipIndex !== -1) {
            // Mark as attempted but not successfully converted
            console.log(`Failed to extract data for zip code ${zip}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error extracting data for batch: ${batchZips.join(', ')}`);
      console.error(error);
    }
    
    // Write all data to the output file (both processed and unprocessed)
    let updatedContent = '';
    zipData.forEach(item => {
      updatedContent += `${item.zip},${item.website},${item.converted ? 'TRUE' : 'FALSE'},${item.density},${item.population}\n`;
    });
    fs.writeFileSync(OUTPUT_FILE, header + '\n' + updatedContent);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < zipDataToProcess.length) {
      console.log("Waiting 2 seconds before next batch...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\nProcessing complete. Results saved to ${OUTPUT_FILE}`);
  const convertedCount = zipData.filter(item => item.converted).length;
  console.log(`Total successful conversions: ${convertedCount} out of ${zipData.length} zip codes`);
}

// Debug FireCrawl setup
console.log("Setting up FireCrawl with API key:", API_KEY);
try {
  console.log("Module type:", typeof firecrawlJs);
  console.log("Module contents:", Object.keys(firecrawlJs));
  console.log("FireCrawl app initialization successful");
} catch (err) {
  console.error("Error initializing FireCrawl app:", err);
  process.exit(1);
}

// Run the process
console.log("Starting extraction process for zip code data...");
(async () => {
  try {
    console.log("Creating initial CSV file (if needed)...");
    if (!fs.existsSync(INPUT_FILE)) {
      createInitialCSV();
    } else {
      console.log(`Input file ${INPUT_FILE} already exists, using it`);
    }
    
    console.log("Starting batch processing...");
    await processZipCodeBatches();
    console.log("Process completed successfully");
  } catch (error) {
    console.error("An error occurred during processing:");
    console.error(error);
    
    // Write error to a log file
    fs.writeFileSync('error.log', error.toString() + '\n' + error.stack);
    console.error("Error details written to error.log");
  }
})();
