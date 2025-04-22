const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');
const fs = require('fs');
const imageProcessor = require('./image_url_processor');

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
  // Define the sequence of actions to ensure images are loaded
  // Including specific handling for Aura components with servlet images
  const actions = [
    { type: "wait", milliseconds: 2500 },     // Initial wait for page to load
    { type: "scroll", y: 800 },               // Scroll down to trigger lazy loading
    { type: "wait", milliseconds: 1500 },     // Wait after scrolling
    { type: "scroll", y: 1600 },              // Scroll more to ensure all content is loaded
    { type: "wait", milliseconds: 1500 },     // Wait after scrolling
    
    // Wait for servlet images to be loaded in the DOM
    // These often appear in Aura components after initial page rendering
    { type: "waitForSelector", selector: 'img[src^="/servlet/rtaImage"]', timeout: 5000 },
    
    { type: "wait", milliseconds: 1000 },     // Brief wait after images are found
    { type: "scrape" }                        // Perform the actual scraping
  ];
  
  console.log("Executing with the following action sequence:", JSON.stringify(actions, null, 2));
  
  let extractResult = await app.extract(
    urls, 
    {
      prompt: "Extract the population and density from the specific URLs / Zip codes I provide you with. For any images from rainpos.my.site.com, only use images with URLs in the format /servlet/rtaImage?eid=...&feoid=...&refid=... and avoid using direct image paths like /images/... as they require login and are not publicly accessible. IMPORTANT: Wait for all dynamic content to fully load on the page, including images that may load after initial page rendering. Look for the publicly accessible servlet image URLs that might appear when right-clicking on images in the page.",
      schema,
      actions: actions  // Add the actions parameter to control the browser behavior
    }
  );
    
    // Process the extraction result to clean up any non-compliant image URLs
    console.log("Post-processing extraction result to ensure proper image URLs...");
    extractResult = imageProcessor.processExtractionResult(extractResult);
    
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
