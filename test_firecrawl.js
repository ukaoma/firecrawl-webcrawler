// The problem is likely with how we're importing the module
// Try different import approaches
const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');

// Print Node.js version
console.log("Node.js version:", process.version);

// Print module info to debug
console.log("FireCrawl module type:", typeof firecrawlJs);
console.log("FireCrawl module contents:", Object.keys(firecrawlJs));

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";

console.log("\nAttempting to initialize FireCrawl app...");

try {
  // Try different initialization approaches based on the module structure
  let app;
  
  if (typeof firecrawlJs === 'function') {
    // If it's a function/constructor
    app = new firecrawlJs({apiKey: API_KEY});
    console.log("Initialized as constructor function");
  } else if (typeof firecrawlJs === 'object' && firecrawlJs.default) {
    // If it has a default export
    app = new firecrawlJs.default({apiKey: API_KEY});
    console.log("Initialized using default export");
  } else if (typeof firecrawlJs === 'object') {
    // If it's an object with methods
    app = firecrawlJs;
    console.log("Using module object directly");
  }
  
  console.log("FireCrawl app initialized successfully");
  console.log("App object type:", typeof app);
  console.log("App methods:", Object.keys(app));

  // Define a simple schema
  const schema = z.object({
    zip_data: z.array(z.object({
      zip_code: z.string(),
      population: z.number(),
      density: z.number()
    }))
  });
  
  console.log("\nSchema defined successfully");

  if (app && typeof app.extract === 'function') {
    // Test a single URL extraction if extract method is available
    console.log("Testing extraction with a single URL...");
    app.extract(
      ["https://simplemaps.com/us-zips/02532"], 
      {
        prompt: "Extract the population and density from this zip code page.",
        schema
      }
    ).then(result => {
      console.log("Extraction successful! Result:", JSON.stringify(result, null, 2));
    }).catch(error => {
      console.error("Extraction error:", error);
    });
  } else {
    console.error("Cannot find extract method on app object");
  }

} catch (error) {
  console.error("ERROR during setup:", error);
}
