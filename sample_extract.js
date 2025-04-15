const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');
const fs = require('fs');

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";

// Sample zip codes for testing
const sampleZipCodes = ['02532', '02536', '02723', '08009', '08723'];

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

async function runSampleExtraction() {
  console.log("Starting sample extraction with the following zip codes:", sampleZipCodes);
  
  // Create URLs
  const urls = sampleZipCodes.map(zip => `https://simplemaps.com/us-zips/${zip}`);
  
  try {
    console.log("Making extraction request to Firecrawl API...");
    const extractResult = await app.extract(
      urls, 
      {
        prompt: "Extract the population and density from the specific URLs / Zip codes I provide you with.",
        schema,
      }
    );
    
    console.log("\nExtraction result:");
    console.log(JSON.stringify(extractResult, null, 2));
    
    // Save the result to a JSON file
    fs.writeFileSync('sample_result.json', JSON.stringify(extractResult, null, 2));
    console.log("\nResult saved to sample_result.json");
    
    // Create a simple CSV with the extracted data
    let csvContent = "Zip/Postal Code,Population,Density\n";
    if (extractResult && extractResult.data && extractResult.data.zip_data) {
      extractResult.data.zip_data.forEach(item => {
        csvContent += `${item.zip_code},${item.population},${item.density}\n`;
      });
    }
    fs.writeFileSync('sample_result.csv', csvContent);
    console.log("Result also saved to sample_result.csv");
    
  } catch (error) {
    console.error("Error during extraction:", error);
  }
}

// Run the sample extraction
runSampleExtraction();
